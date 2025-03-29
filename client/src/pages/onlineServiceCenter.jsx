import React, { useState } from "react";
// import "./ap.css";
// import Plus from "./plus.png";

function Select() {
  return (
    <select className="select" style={{ padding: "10px", fontSize: "30px" }}>
      <option value="someOption" style={{ margin: "50px", padding: "20px" }}>
        <b>Branch</b>
      </option>
    </select>
  );
}

function Box() {
  return (
    <div className="box-container">
      <label style={{ fontSize: "25px" }}>Operation</label>
      <br />
      <div style={{ marginTop: "1px", fontSize: "150px" }}>
        <b>00</b>
      </div>
      <br />
      <img
        // src={Plus}
        alt="add"
        style={{
          marginTop: "-25px",
          width: "50%",
          height: "50%",
          borderRadius: "25px",
        }}
      />
      <br />
      <button
        style={{
          marginTop: "25px",
          background: "none",
          color: "white",
          fontSize: "25px",
        }}
      >
        Get a Tiket
      </button>
    </div>
  );
}
const OnlineServiceCenter = () => {
  return (
    <div className="app">
      <div style={{ marginleft: "150px", color: "white" }}>
        <h1>SAnD's Smart Queue Management System</h1>
      </div>

      <Select />
      <div style={{ display: "flex", padding: "20px" }}>
        <div className="osc-box">
          <Box />
        </div>
        <div className="osc-box">
          <Box />
        </div>
        <div className="osc-box">
          <Box />
        </div>
        <div className="osc-box">
          <Box />
        </div>
      </div>
    </div>
  );
};

export default OnlineServiceCenter;
