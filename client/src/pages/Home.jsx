import React from "react";
import "../styles/home.css";

function Home() {
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
                      <h4 className="home-text">{day}</h4>
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
                  ].map((time) => (
                    <h4 className="home-text">{time}</h4>
                  ))}
                </div>
              </div>
              <div className="days-section">
                <div>
                  <h2 className="home-title">Busy Days.</h2>

                  {["Moderately", "Moderately", "Very", "Lightly", ""].map(
                    (time) => (
                      <h4 className="home-text">{time} Busy</h4>
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
                <div className="metric-value">20</div>
                <div className="metric-label">Visitor's currently waiting</div>
              </div>
              <div className="metric">
                <div className="metric-value">
                  10<span style={{ fontSize: "24px" }}>mins</span>
                </div>
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
          }}>
          <div className="home-login-container">
            <h2>Sign in to SAnD's SQMS</h2>
            <div className="home-input">
              <div>
                <label>
                  {" "}
                  <b>First Name </b>
                </label>
                <input type="text" placeholder=" First name goes here..." />
              </div>
              <div>
                <label>
                  {" "}
                  <b>Customer Number or Phone Number </b>
                </label>
                <input type="text" placeholder="Customer ID or Phone Number" />
              </div>

              <div>
                <label>
                  <b>Select a branch</b>
                </label>
                <select>
                  <option value="">Branch A</option>
                  <option value="">Branch B</option>
                </select>
              </div>
              <div>
                <label>
                  <b>Select a service</b>
                </label>
                <select>
                  <option value="">Service A</option>
                  <option value="">Service B</option>
                </select>
              </div>

              <div className="get-ticket">
                <button>
                  {" "}
                  <b>Get a Ticket</b>{" "}
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
