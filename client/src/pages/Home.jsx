import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import "../styles/home.css";
import Board from "../components/Board";
import { useNavigate } from "react-router";
import AppContext from "../includes/context";

function Home() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState();
  const [availableBranches, setAvailableBranches] = useState();
  const [availableServices, setAvailableServices] = useState();
  const [firstName, setFirstName] = useState();
  const [customerNumber, setCustomerNumber] = useState();
  const [trials, setTrials] = useState(0);
  const [service, setService] = useState();
  const branchOptionsRef = useRef(null);
  const serviceOptionsRef = useRef(null);

  //
  //Context store
  const { setCustomerBranchOption, SERVER_URL } = useContext(AppContext);

  const getSessionData = useCallback(
    async (id) => {
      fetch(`${SERVER_URL}/get-sessions`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ sessionId: id }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => console.log("Session Data: ", data));
    },
    [SERVER_URL]
  );

  const fetchBranches = useCallback(async () => {
    await fetch(`${SERVER_URL}/get-branches`)
      .then((response) => response.json())
      .then((data) => {
        setAvailableBranches(data);
      });
  }, [SERVER_URL]);

  const fetchServices = async (branch) => {
    await fetch(`${SERVER_URL}/get-services`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ branch: branch }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Avail Services: ", data);
        setAvailableServices(data);
        return data;
      });
  };
  const userHasSession = useCallback(async () => {
    await fetch(`${SERVER_URL}/`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && data.signedIn) {
          getSessionData(data.sessionId);
          navigate(`sessions/${data.sessionId}`);
        }
      });
  }, [SERVER_URL, navigate, getSessionData]);
  useLayoutEffect(() => {
    userHasSession();
    fetchBranches();
  }, [fetchBranches, userHasSession]);

  useEffect(() => {
    // getCustomerData("cust1", "test");
    setService(serviceOptionsRef.current?.value);
    setCustomerBranchOption(branchOptionsRef.current?.value);
    fetchBranches(branchOptionsRef.current?.value);
  }, [fetchBranches, setCustomerBranchOption]);

  const submitUserData = async () => {
    setCustomerBranchOption(branchOptionsRef.current.value);
    try {
      await fetch(`${SERVER_URL}`, {
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
                  onChange={async (e) => {
                    setCustomerBranchOption(branchOptionsRef.current.value);
                    fetchServices(branchOptionsRef.current.value);
                  }}
                  defaultValue="Select a branch"
                >
                  <option value="Select a branch" disabled>
                    Select A Branch
                  </option>
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
                    availableServices.map((service) => {
                      console.log(service);
                      return (
                        <option
                          key={service.serviceName}
                          value={service.serviceName}
                        >
                          {service.serviceName}
                        </option>
                      );
                    })}
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
                    console.log("Making attempt");
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
