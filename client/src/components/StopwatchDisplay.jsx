import React from "react";
import "../styles/stopwatchStyle.css";

const StopwatchDisplay = ({ currentTimeMin, currentTimeSec, formatTime }) => {
  return (
    <div className={"stopwatch__display"}>
      <span className="timerText">
        {formatTime(currentTimeMin)}m:
        {formatTime(currentTimeSec)}s
      </span>
    </div>
  );
};

export default StopwatchDisplay;
