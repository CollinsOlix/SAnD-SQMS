import React, { useState, useEffect } from "react";

const Stopwatch = ({ elapsedTime }) => {
  // Calculate minutes and seconds
  const minutes = Math.floor(elapsedTime / 60);
  const seconds = elapsedTime % 60;

  return (
    <div style={{ textAlign: "center", fontFamily: "Arial, sans-serif" }}>
      <span className="timerText">
        {minutes}m: {seconds}s
      </span>
    </div>
  );
};

export default Stopwatch;
