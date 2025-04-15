import React from "react";
import "../styles/staffBoard.css";

function ServedItem({ data }) {

  return (
    <div className="servedItem">
      <div className="servedItem-left">
        <p>{data?.customerDetails?.firstName || "John Doe"}</p>
        <p>{data?.customerDetails?.customerNumber || "000"}</p>
      </div>
      <div className="servedItem-right">
        <p>{data.service}</p>
        <p>{`${Math.floor(data.serviceDuration / 60)}m:${
          data.serviceDuration % 60
        }s`}</p>
      </div>
    </div>
  );
}

export default ServedItem;
