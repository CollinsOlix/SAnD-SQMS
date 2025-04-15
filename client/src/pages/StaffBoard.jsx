import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import AppContext from "../includes/context";
import BackDrop from "../components/BackDrop";
import { useNavigate } from "react-router";
import "../styles/staffBoard.css";
import Stopwatch from "../components/Stopwatch";
import DailyHistory from "../components/DailyHistory";
import printJS from "print-js";

function StaffBoard() {
  const {
    SERVER_URL,
    staffDetails,
    setStaffDetails,
    staffBoardDetails,
    setStaffBoardDetails,
  } = useContext(AppContext);
  const navigate = useNavigate();

  const [waitingCustomers, setWaitingCustomers] = useState([]);
  const [activeCustomer, setActiveCustomer] = useState({});
  const [elapsedTime, setElapsedTime] = useState(0); // Tracks total elapsed time in seconds
  const [isRunning, setIsRunning] = useState(false); // Tracks whether the stopwatch is running
  const [dailyHistory, setDailyHistory] = useState([]);

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer); // Cleanup when component unmounts or isRunning changes
  }, [isRunning]);

  const start = () => {
    setIsRunning(true);
  };

  const pause = () => {
    setIsRunning(false);
  };

  const reset = () => {
    setIsRunning(false);
    setElapsedTime(0);
  };

  const isStaffSignedIn = async () => {
    await fetch(`${SERVER_URL}/staff-sign-in`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.staffSignedIn === true) {
          setStaffDetails((e) => (e = data.staffDetails));
        } else {
          navigate("/staff");
        }
      });
  };

  const getServiceDetails = async () => {
    try {
      await fetch(`${SERVER_URL}/staff/get-service-details`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          branch: staffDetails.branch,
          service: staffDetails.assignedTo,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          setStaffBoardDetails((e) => (e = data));
          getWaitingCustomers(staffDetails.branch);
        });
    } catch (err) {
      console.error(err);
    }
  };

  const getWaitingCustomers = async (branch) => {
    try {
      await fetch(`${SERVER_URL}/staff/get-waiting-customers`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          branch,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          function filterByServiceName(data, serviceName) {
            return data.filter((item) => item.service[serviceName]);
          }
          setWaitingCustomers(
            filterByServiceName(data, staffDetails.assignedTo)
          );
        });
    } catch (err) {}
  };

  const printDailyHistory = async () => {
    const formatPrintDate = (timestamp) => {
      // Convert seconds to milliseconds
      const secondsInMs = timestamp.seconds * 1000;

      // Convert nanoseconds to milliseconds and add to seconds
      const totalMs = secondsInMs + timestamp.nanoseconds / 1000000;

      // Create a Date object
      const date = new Date(totalMs);

      // Convert to a human-readable format
      const humanReadableDate = date.toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        timeZone: "UTC", // or any other desired time zone
      });

      console.log(humanReadableDate);

      return humanReadableDate;
    };

    const printableHistory = dailyHistory.map((item) => ({
      "Customer Name": item.customerDetails.firstName,
      "Customer Number": item.customerDetails.customerNumber,
      Service: item.service,
      "Handled By": item.handledBy.staffName,
      Date: formatPrintDate(item.date),
      "Service Duration": `${Math.floor(item.serviceDuration / 60)}m:${
        item.serviceDuration % 60
      }s`,
    }));
    printJS({
      printable: printableHistory,
      type: "json",
      properties: Object.keys(printableHistory[0]),
    });
  };

  const getNextCustomer = async () => {
    pause();

    await fetch(`${SERVER_URL}/staff/get-next-customer`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        branch: staffDetails.branch,
        service: staffDetails.assignedTo,
        customerDetails: {
          ...(activeCustomer?.customerDetails || {}),
          customerNumber: activeCustomer?.customerNumber || 0,
        },
        handledBy: {
          staffId: staffDetails.staffId,
          staffName: staffDetails.name,
        },
        serviceDuration: elapsedTime,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setDailyHistory((e) => (e = data));
        reset();
        start();
      });
  };

  const getDailyHistory = async () => {
    await fetch(`${SERVER_URL}/staff/get-daily-history`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        branch: staffDetails.branch,
        service: staffDetails.assignedTo,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setDailyHistory((e) => (e = data));
      });
  };

  useLayoutEffect(() => {
    isStaffSignedIn();
  }, []);

  useEffect(() => {
    if (staffDetails) {
      getServiceDetails();
      getDailyHistory();
    }
  }, [staffDetails]);

  useEffect(() => {
    let active = waitingCustomers.find(
      (cust) =>
        cust.service[staffDetails.assignedTo]?.ticketNumber ===
        staffBoardDetails?.serviceCurrentNumber
    );
    setActiveCustomer((e) => (e = active));
    staffBoardDetails?.serviceCurrentNumber !== 0 && start();
  }, [waitingCustomers, staffBoardDetails, staffDetails]);

  useEffect(() => {
    console.log("Daily History: ", dailyHistory);
  }, [dailyHistory]);

  return staffDetails ? (
    <BackDrop showNavTabs={true}>
      <div
        style={{
          flex: 1,
          display: "flex",
          padding: "0 1.5em 1.5em 1.5em",
          height: "100%",
          overflow: "hidden",
        }}
      >
        <div className="currentlyServingBoard">
          <h3 className="darkBlue">Currently Serving</h3>
          <p className="mediumText">Ticket Number</p>
          <div className="ticketRectangle">
            <h1>{staffBoardDetails?.serviceCurrentNumber || 0}</h1>
          </div>
          <p className="mediumText darkBlue">Serving Time</p>
          <Stopwatch elapsedTime={elapsedTime} />
          <div className="customerDetails">
            <h3 className="mediumText darkBlue">Customer Information</h3>
            <p className="mediumText">
              Customer Name: {activeCustomer?.customerDetails.firstName || ""}
            </p>
            <p className="mediumText">
              Customer Number: {activeCustomer?.customerNumber}
            </p>
          </div>
        </div>
        <DailyHistory
          staffDetails={staffDetails}
          getNextCustomer={getNextCustomer}
          historyData={dailyHistory || []}
          start={start}
          pause={pause}
          isRunning={isRunning}
          setIsRunning={setIsRunning}
          stop={"k"}
          printDailyHistory={printDailyHistory}
        />
      </div>
    </BackDrop>
  ) : (
    <div>Loading...</div>
  );
}

export default StaffBoard;
