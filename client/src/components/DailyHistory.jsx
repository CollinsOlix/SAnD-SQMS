import React from "react";
import ServedItem from "./ServedItem";
import "../styles/staffBoard.css";

function DailyHistory({
  openQueue,
  isQueueOpen,
  staffDetails,
  getNextCustomer,
  historyData,
  isRunning,
  setIsRunning,
  start,
  closeQueue,
  pause,
  printDailyHistory,
}) {
  return (
    <div className="dailyHistoryWrapper">
      <h3>
        Hello, {staffDetails.name} - {staffDetails.branch}
      </h3>
      <div className="dailyHistory">
        <h1 className="">Daily History</h1>
        <button className="printBtn" onClick={printDailyHistory}>
          Print History
        </button>
      </div>
      <div
        style={{
          flex: 1,
          overflowY: "scroll",
          overflow: "hidden scroll",
          margin: "0.3em 0",
        }}
      >
        {historyData.map((item, i) => (
          <ServedItem key={i} data={item} />
        ))}
      </div>
      <div className="dailyHistory bottom">
        <button
          disabled={isQueueOpen && isQueueOpen === "closed"}
          onClick={isRunning ? pause : start}
          style={{
            backgroundColor: isQueueOpen === "closed" && "gray",
            color: isQueueOpen === "closed" && "#454545",
          }}
        >
          {!isRunning ? "Start" : "Pause"}
        </button>
        <button onClick={isQueueOpen === "closed" ? openQueue : closeQueue}>
          {isQueueOpen === "closed" ? "Open Queue" : "Close Queue"}
        </button>

        <button
          style={{
            backgroundColor: isQueueOpen === "closed" && "gray",
            color: isQueueOpen === "closed" && "#454545",
          }}
          disabled={isQueueOpen && isQueueOpen === "closed"}
          onClick={getNextCustomer}
        >
          Next Customer
        </button>
      </div>
    </div>
  );
}

export default DailyHistory;
