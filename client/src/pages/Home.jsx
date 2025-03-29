import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

import "../styles/home.css";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import Board from "../components/Board";
import { useNavigate } from "react-router";

function Home() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState();
  const [availableBranches, setAvailableBranches] = useState();
  const [availableServices, setAvailableServices] = useState();
  const [firstName, setFirstName] = useState();
  const [customerNumber, setCustomerNumber] = useState();
  const [trials, setTrials] = useState(0);
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
        setErrorMessage("Invalid First Name or Customer Number");
        setTrials((trial) => trial + 1);
        return "Invalid First Name or Customer Number";
      }
    } else {
      setTrials((trial) => trial + 1);
      setErrorMessage("Invalid First Name or Customer Number");
      return "Invalid First Name or Customer Number";
    }
  };

  const fetchBranches = async () => {
    await fetch("http://localhost:5000/get-branches")
      .then((response) => response.json())
      .then((data) => {
        setAvailableBranches(data);
      });
  };
  const userHasSession = async () => {
    await fetch("http://localhost:5000/", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && data.signedIn) {
          navigate(`sessions/${data.sessionId}`);
        }
      });
  };
  useLayoutEffect(() => {
    userHasSession();
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
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          customerNumber,
          service: serviceOptionsRef.current.value,
          branch: branchOptionsRef.current.value,
          trials,
        }),
      })
        .then(async (response) => {
          let jsonData = await response.json();
          return jsonData;
        })
        .then((userData) => {
          if (userData.signedIn) {
            navigate(`sessions/${userData.sessionId}`);
          }
          if (typeof userData?.customerDetails === "string") {
            setErrorMessage(userData.customerDetails);
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
      <div className="home-a">
        <div className="home-b">
          <Board />
        </div>
        <div className="home-c">
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
                  onInput={(e) => {
                    setErrorMessage(null);
                    setCustomerNumber(e.target.value);
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
                <select
                  ref={serviceOptionsRef}
                  id="serviceOptions"
                  onChange={(e) => {
                    setService(e.target.value);
                  }}
                >
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
                    if (trials >= 7) {
                      setErrorMessage(
                        "Too many incorrect signin attempts, Please visit a branch closest to you"
                      );
                      return;
                    }
                    setErrorMessage(null);
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
