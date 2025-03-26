import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

import "../styles/home.css";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";

function Home() {
  const [errorMessage, setErrorMessage] = useState();
  const [availableBranches, setAvailableBranches] = useState();
  const [availableServices, setAvailableServices] = useState();
  const [firstName, setFirstName] = useState();
  const [customerNumber, setCustomerNumber] = useState();
  const [customerBranchOption, setCustomerBranchOption] = useState();
  const [service, setService] = useState();
  const branchOptionsRef = useRef(null);
  const serviceOptionsRef = useRef(null);

  const getCustomerData = async (customerNumber, firstName) => {
    const docRef = doc(db, "customers", customerNumber);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      if (docSnap.data().firstName === firstName) {
        return docSnap.data();
      } else {
        setErrorMessage("First Name not recognized");
        return "First Name not recognized";
      }
    } else {
      setErrorMessage("Customer Number does not exist!");
      return "Customer Number does not exist!";
    }
  };

  const fetchBranches = async () => {
    await fetch("http://localhost:5000/get-branches")
      .then((response) => response.json())
      .then((data) => {
        setAvailableBranches(data);
      });
  };
  useLayoutEffect(() => {
    fetchBranches();
  }, []);

  useEffect(() => {
    // getCustomerData("cust1", "test");
    setService(serviceOptionsRef.current?.value);
    setCustomerBranchOption(branchOptionsRef.current?.value);
  }, []);

  useEffect(() => {
    let dataa =
      availableBranches &&
      availableBranches
        .find(
          (aBranch) =>
            aBranch.branchName === customerBranchOption ||
            aBranch.branchName === branchOptionsRef.current.value
        )
        ?.services.map((item) => item);
    availableBranches && setAvailableServices(dataa);
  }, [customerBranchOption, availableBranches]);

  const submitUserData = async () => {
    try {
      console.log("Fetching Data");
      await fetch("http://localhost:5000", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          customerNumber,
          service: serviceOptionsRef.current.value,
          branch: branchOptionsRef.current.value,
        }),
      })
        .then(async (response) => {
          let jsonData = await response.json();
          console.log(jsonData);
          return jsonData;
        })
        .then((data) => {
          if (typeof data === "string") {
            setErrorMessage(data);
          }
        });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ height: "100%" }}>
      <div style={{ textAlign: "center", padding: "0.3em", color: "white" }}>
        <h3>Tired of spending long wait times at the queues?</h3>
        <h4>Get a ticket and wait from the comfort of your home.</h4>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
          height: "90%",
        }}
      >
        <div
          style={{
            flex: 3,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "80%",
            padding: "1em",
          }}
        >
          <div className="board">
            <div className="home-day-and-time">
              <div className="days-section">
                <div>
                  <h2 className="home-title">Open Days</h2>
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                    (day, index) => (
                      <h4 key={index} className="home-text">
                        {day}
                      </h4>
                    )
                  )}
                </div>
                <div>
                  <h2 className="home-title">.</h2>
                  {[
                    "9:00 AM - 5:00 PM",
                    "9:00 AM - 5:00 PM",
                    "9:00 AM - 5:00 PM",
                    "9:00 AM - 5:00 PM",
                    "9:00 AM - 5:00 PM",
                    "CLOSED",
                    "CLOSED",
                  ].map((time, index) => (
                    <h4 key={time + index} className="home-text">
                      {time}
                    </h4>
                  ))}
                </div>
              </div>
              <div className="days-section">
                <div>
                  <h2 className="home-title">Busy Days.</h2>

                  {["Moderately", "Moderately", "Very", "Lightly", ""].map(
                    (time, index) => (
                      <h4 key={time + index} className="home-text">
                        {time} Busy
                      </h4>
                    )
                  )}
                </div>
              </div>
            </div>
            <div className="status-section">
              <div className="current-status">Currently Moderately Busy</div>
              <div className="date">Friday, March 8, 2025</div>
            </div>
            <div className="metrics-section">
              <div className="metric">
                <span className="metric-value">20</span>
                <div className="metric-label">Visitor's currently waiting</div>
              </div>
              <div className="metric">
                <span className="metric-value">
                  10<span style={{ fontSize: "24px" }}>mins</span>
                </span>
                <div className="metric-label">Average waiting time</div>
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            flex: 2,
            height: "80%",
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            flexDirection: "column",
            padding: "1em",
          }}
        >
          <div className="home-login-container">
            <h2>Sign in to SAnD's SQMS</h2>

            <div className="home-input">
              <div
                className="error-container"
                style={{
                  display: errorMessage ? "block" : "none",
                  padding: "0.1em",
                  backgroundColor: "white",
                }}
              >
                <p className="error">{errorMessage}</p>
              </div>
              <div>
                <label>
                  <b>First Name </b>
                </label>
                <input
                  type="text"
                  name="firstName"
                  onInput={(e) => {
                    setErrorMessage();
                    setFirstName(e.target.value);
                  }}
                  style={{
                    border:
                      errorMessage &&
                      errorMessage === "First Name not recognized"
                        ? "2px solid red"
                        : errorMessage === "Invalid Name"
                        ? "2px solid red"
                        : "",
                    color:
                      errorMessage &&
                      errorMessage === "First Name not recognized"
                        ? "red"
                        : errorMessage === "Invalid Name"
                        ? "red"
                        : "",
                  }}
                  className="homeInput"
                  placeholder=" First name goes here..."
                />
              </div>
              <div>
                <label>
                  <b>Customer Number or Phone Number </b>
                </label>
                <input
                  type="number"
                  name="customerNumber"
                  onInput={(e) => setCustomerNumber(e.target.value)}
                  style={{
                    border:
                      errorMessage && errorMessage === "An Error Message"
                        ? "2px solid red"
                        : "",
                    color:
                      errorMessage && errorMessage === "An Error Message"
                        ? "red"
                        : "",
                  }}
                  className="homeInput"
                  placeholder="Customer ID or Phone Number"
                />
              </div>

              <div>
                <label>
                  <b>Select a branch</b>
                </label>
                <select
                  ref={branchOptionsRef}
                  id="branchOptions"
                  onChange={(e) => {
                    setCustomerBranchOption(e.target.value);
                  }}
                >
                  {availableBranches?.map((aBranch) => (
                    <option key={aBranch.branchID} value={aBranch.branchName}>
                      {aBranch.branchName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>
                  <b>Select a service</b>
                </label>
                <select ref={serviceOptionsRef} id="serviceOptions">
                  {availableServices &&
                    availableServices.map((service) => (
                      <option key={service} value={service}>
                        {service}
                      </option>
                    ))}
                </select>
              </div>

              <div className="get-ticket">
                <button
                  onClick={async () => {
                    await submitUserData();
                  }}
                >
                  <b>Get a Ticket</b>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
