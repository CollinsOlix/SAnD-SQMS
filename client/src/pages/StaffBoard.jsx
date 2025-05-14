import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import AppContext from "../includes/context";
import BackDrop from "../components/BackDrop";
import { useNavigate } from "react-router";
import "../styles/staffBoard.css";
import Stopwatch from "../components/Stopwatch";
import DailyHistory from "../components/DailyHistory";
import printJS from "print-js";
import { Ring } from "@uiball/loaders";
import { getServiceDetails } from "../includes/serverFunctions";

function StaffBoard() {
  const {
    SERVER_URL,
    staffDetails,
    setStaffDetails,
    staffBoardDetails,
    customerBranchOption,
    setStaffBoardDetails,
  } = useContext(AppContext);
  const navigate = useNavigate();

  const [waitingCustomers, setWaitingCustomers] = useState([]);
  const [activeCustomer, setActiveCustomer] = useState();
  const [elapsedTime, setElapsedTime] = useState(0); // Tracks total elapsed time in seconds
  const [isRunning, setIsRunning] = useState(false); // Tracks whether the stopwatch is running
  const [dailyHistory, setDailyHistory] = useState([]);
  const [numberOfPeopleInQueue, setNumberOfPeopleInQueue] = useState(0);
  const [shouldShowLoadingIndicator, setShouldDisplayLoadingIndicator] =
    useState(true);
  const [activeCustomerNumber, setActiveCustomerNumber] = useState();

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

  const fetchServiceDetails = async () => {
    let serviceDeets = await getServiceDetails(
      staffDetails.branch,
      staffDetails.assignedTo
    );
    setStaffBoardDetails((e) => (e = serviceDeets));
  };
  const getWaitingCustomers = async (branch) => {
    if (staffDetails) {
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
              let filteredData = data.filter(
                (item) => item?.service[serviceName]
              );
              return filteredData;
            }
            let waitListed = filterByServiceName(data, staffDetails.assignedTo);
            console.log("Waitlisted: ", waitListed);
            console.log("STfab: ", staffBoardDetails);
            setWaitingCustomers((e) => (e = waitListed));
            if (staffBoardDetails) {
              let active = waitListed.find(
                (item) =>
                  item.service[staffBoardDetails.serviceName].ticketNumber ===
                  staffBoardDetails.serviceCurrentNumber
              );
              if (waitListed.length)
                waitListed.forEach((cust) => {
                  if (
                    cust?.service[staffDetails?.assignedTo]?.ticketNumber <
                    active?.service[staffDetails?.assignedTo]?.ticketNumber
                  ) {
                    active = cust;
                  }
                });
              setActiveCustomer((e) => (e = active));
            }
            setNumberOfPeopleInQueue((e) => (e = waitListed.length));
          });
      } catch (err) {
        console.error("Error getting waiting customers: ", err);
      }
    }
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
        sessionId: activeCustomer?.sessionId || null,
        serviceDuration: elapsedTime,
      }),
    })
      .then((response) => response.json())
      .then(async (data) => {
        setDailyHistory((e) => (e = data.sessionHistory));
        setWaitingCustomers((e) => (e = data.waitingCustomers));
        if (staffBoardDetails) {
          console.log("Staff b deets: ", staffBoardDetails);
          let active = data.waitingCustomers.find(
            (item) =>
              item.service[staffBoardDetails.serviceName].ticketNumber ===
              staffBoardDetails.serviceCurrentNumber
          );
          if (data.waitingCustomers.length)
            data.waitingCustomers.forEach((cust) => {
              if (
                cust?.service[staffDetails?.assignedTo]?.ticketNumber <
                active?.service[staffDetails?.assignedTo]?.ticketNumber
              ) {
                active = cust;
              }
            });
          setActiveCustomer((e) => (e = active));
        }
        await fetchServiceDetails();
        reset();
      });
    await fetchServiceDetails();
  };

  const getDailyHistory = async () => {
    if (staffDetails) {
      try {
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
      } catch (err) {
        console.error("Error getting daily history: ", err);
      }
    }
  };

  const closeQueue = async () => {
    await fetch(`${SERVER_URL}/staff/close-queue`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        branch: staffDetails.branch,
        service: staffDetails.assignedTo,
      }),
    }).then(async () => await fetchServiceDetails());
  };
  const openQueue = async () => {
    await fetch(`${SERVER_URL}/staff/open-queue`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        branch: staffDetails.branch,
        service: staffDetails.assignedTo,
      }),
    }).then(async () => await fetchServiceDetails());
  };

  useLayoutEffect(() => {
    isStaffSignedIn();
  }, []);

  useEffect(() => {
    if (staffDetails) {
      fetchServiceDetails();
      getWaitingCustomers(staffDetails.branch);
      getDailyHistory();
    }
  }, [staffDetails]);

  useEffect(() => {
    if (staffBoardDetails) {
      let active = waitingCustomers[0];
      if (waitingCustomers.length)
        waitingCustomers.forEach((cust) => {
          if (
            cust?.service[staffDetails?.assignedTo]?.ticketNumber <
            active?.service[staffDetails?.assignedTo]?.ticketNumber
          ) {
            active = cust;
          }
        });
      console.log("active: ", active);
      setActiveCustomer((e) => (e = active));
      console.log("active: ", activeCustomer);
      console.log("wait: ", numberOfPeopleInQueue);
    }
    setNumberOfPeopleInQueue(waitingCustomers.length);

    activeCustomer &&
      staffDetails &&
      typeof activeCustomer?.service?.[staffDetails?.assignedTo]
        ?.ticketNumber == "number" &&
      start();
  }, [staffBoardDetails, waitingCustomers]);

  useEffect(() => {
    if (staffBoardDetails && waitingCustomers)
      setShouldDisplayLoadingIndicator(false);
  }, [staffBoardDetails, waitingCustomers]);

  useEffect(() => {
    console.log(
      "active: ",
      activeCustomer?.service?.[staffDetails?.assignedTo]?.ticketNumber
    );
  }, [activeCustomer]);
  //
  //Displayed content
  return shouldShowLoadingIndicator ? (
    <div
      style={{
        position: "fixed",
        zIndex: 99,
        inset: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <Ring size={80} lineWeight={5} speed={1} color="white" />
    </div>
  ) : staffDetails ? (
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
            <h1>
              {waitingCustomers[0]?.customerDetails?.priority
                ? waitingCustomers[0]?.service[staffDetails.assignedTo]
                    .ticketNumber
                : staffBoardDetails.serviceCurrentNumber || 0}
            </h1>
          </div>
          <p className="mediumText darkBlue">Serving Time</p>
          <Stopwatch elapsedTime={elapsedTime} />
          <h3>
            Number of people waiting: {Math.max(numberOfPeopleInQueue - 1, 0)}
          </h3>
          <hr style={{ width: "100%" }} />
          <div className="customerDetails">
            <h3 className="mediumText darkBlue">Customer Information</h3>
            <p className="mediumText">
              Customer Name: {activeCustomer?.customerDetails?.firstName || ""}
            </p>
            <p className="mediumText">
              Customer Number: {activeCustomer?.customerNumber}
            </p>
            {activeCustomer && activeCustomer.priority && (
              <p className="mediumText">Priority Customer</p>
            )}
          </div>
        </div>
        <DailyHistory
          isQueueOpen={staffBoardDetails?.status}
          openQueue={openQueue}
          staffDetails={staffDetails}
          getNextCustomer={getNextCustomer}
          historyData={dailyHistory || []}
          start={start}
          pause={pause}
          isRunning={isRunning}
          setIsRunning={setIsRunning}
          closeQueue={closeQueue}
          printDailyHistory={printDailyHistory}
        />
      </div>
    </BackDrop>
  ) : (
    <div>Loading...</div>
  );
}

export default StaffBoard;
