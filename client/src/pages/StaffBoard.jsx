import React, { useContext, useEffect, useLayoutEffect } from "react";
import AppContext from "../includes/context";
import BackDrop from "../components/BackDrop";
import { useNavigate } from "react-router";
import "../styles/staffBoard.css";
import ServedItem from "../components/ServedItem";

function StaffBoard() {
  const {
    SERVER_URL,
    staffDetails,
    setStaffDetails,
    staffBoardDetails,
    setStaffBoardDetails,
  } = useContext(AppContext);
  const navigate = useNavigate();

  const isStaffSignedIn = async () => {
    await fetch(`${SERVER_URL}/staff-sign-in`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
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
        });
    } catch (err) {
      console.error(err);
    }
  };

  useLayoutEffect(() => {
    isStaffSignedIn();
  }, []);

  useEffect(() => {
    if (staffDetails) {
      getServiceDetails();
    }
  }, [staffDetails]);

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
            <h1>{staffBoardDetails.serviceCurrentNumber}</h1>
          </div>
          <p className="mediumText darkBlue">Serving Time</p>
          <p className="timerText">00:05:27</p>
          <div className="customerDetails">
            <h3 className="mediumText darkBlue">Customer Information</h3>
            <p className="mediumText">Customer Number: 123</p>
            <p className="mediumText">Customer Name: 123</p>
          </div>
        </div>
        <div className="dailyHistoryWrapper">
          <h3>Hello, {staffDetails.name}</h3>
          <div className="dailyHistory">
            <h1 className="">Daily History</h1>
          </div>
          <div
            style={{
              flex: 1,
              overflowY: "scroll",
              overflow: "hidden scroll",
              margin: "0.3em 0",
            }}
          >
            {[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map((e, i) => (
              <ServedItem key={i} />
            ))}
          </div>
          <div className="dailyHistory bottom">
            <button>Next Customer</button>
          </div>
        </div>
      </div>
    </BackDrop>
  ) : (
    <div>Loading...</div>
  );
}

export default StaffBoard;
