import React from "react";
import "../styles/home.css";
import { useEffect } from "react";
import { serviceWaitTime } from "../includes/serverFunctions";
import { useContext } from "react";
import AppContext from "../includes/context";
import { useState } from "react";

function Board({ service }) {
  const { customerBranchOption } = useContext(AppContext);
  const [avgWaitTime, setAvgWaitTime] = useState(0);
  const fetchServiceWaitTime = async () => {
    let timee = await serviceWaitTime(
      customerBranchOption,
      service?.serviceName
    );
    setAvgWaitTime(timee);
  };
  useEffect(() => {
    if (service?.serviceName) {
      fetchServiceWaitTime();
    }
  }, [service]);
  return (
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
        <div className="date">
          {new Date(Date.now()).toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            weekday: "long",
            timeZone: "UTC",
          })}
        </div>
      </div>
      <div className="metrics-section">
        <div className="metric">
          <span className="metric-value">
            {Math.max(
              service?.lastQueueNumber - service?.serviceCurrentNumber,
              0
            ) || 0}
          </span>
          <div className="metric-label">Visitor's currently waiting</div>
        </div>
        <div className="metric">
          <span className="metric-value">
            {avgWaitTime / 60}
            <span style={{ fontSize: "24px" }}>mins</span>
          </span>
          <div className="metric-label">Average waiting time</div>
        </div>
      </div>
    </div>
  );
}

export default Board;
