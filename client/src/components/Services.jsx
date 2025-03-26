import React from "react";
import "../styles/adminDashboard.css";

function Services({ option, index, setIsModalOpen, setActiveModal }) {
  return (
    <div
      className="serviceContainer"
      onClick={() => {
        setActiveModal(Object.values(option)[0].action);
        setIsModalOpen(true);
      }}
    >
      <div key={index} className="serviceWrapper">
        <div className="service" onClick={Object.values(option)[0].onClick}>
          <div className="iconContainer">{Object.values(option)[0].icon}</div>
        </div>
      </div>
      <h4 style={{ textAlign: "center", fontSize: "1.1em", color: "white" }}>
        {Object.keys(option)[0]}
      </h4>
    </div>
  );
}

export default Services;
