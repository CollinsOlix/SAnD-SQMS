import React from "react";
import "../styles/staffBoard.css";

function ServedItem() {
  return (
    <div className="servedItem">
      <div className="servedItem-left">
        <p>Name</p>
        <p>Number</p>
      </div>
      <div className="servedItem-right">
        <p>Service</p>
        <p>Time</p>
      </div>
    </div>
  );
}

export default ServedItem;
