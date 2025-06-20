import { useContext, useState } from "react";
import "../styles/serviceCenter.css";
import AddIcon from "@mui/icons-material/Add";
import AppContext from "../includes/context";
import Modal from "react-modal";
import { useEffect } from "react";

const QueuePicker = ({ index, item, active, isPriorityCustomer }) => {
  useEffect(() => {
    console.log("QueuePicker ", item);
  }, []);
  const {
    customerBranchOption,
    sessionDetails,
    setSessionDetails,
    SERVER_URL,
  } = useContext(AppContext);
  // sessionId, queueId, branch, service;
  const joinQueue = async () => {
    await fetch(`${SERVER_URL}/join-queue`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
        branch: customerBranchOption,
        service: item.serviceName,
        sessionId: sessionDetails.sessionId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => setSessionDetails((e) => (e = data)));
  };
  return active ? (
    <div className="queue-container-active">
      <h3>{item?.serviceName}</h3>
      <p style={{ fontWeight: "bold", fontSize: "1.3em" }}>
        Your Ticket Number
      </p>
      <p
        style={{
          fontSize: "8em",
          fontWeight: "bold",
          fontFamily: "Inter",
          margin: "0",
        }}
      >
        {item.ticketNumber}
      </p>
      {
        <>
          <p style={{ fontWeight: "bold", fontSize: "1.3em" }}>
            There Are Currently
          </p>
          <p
            style={{ fontSize: "6em", fontWeight: "bold", fontFamily: "Inter" }}
          >
            {item.peopleWaiting}
          </p>
          <p style={{ fontWeight: "bold", fontSize: "1.3em" }}>
            people waiting
          </p>
        </>
      }
      <p style={{ fontWeight: "bold", fontSize: "1.3em" }}>
        You will be called upon shortly
      </p>
    </div>
  ) : (
    <div
      className="queue-container"
      style={{ backgroundColor: item.status === "closed" && "gray" }}
    >
      <h4>{item?.serviceName}</h4>
      <p
        style={{
          fontSize: "8em",
          fontWeight: "bold",
          fontFamily: "Inter",
          margin: "0",
        }}
      >
        {item.lastQueueNumber}
      </p>
      <div
        className="icon-container"
        onClick={item.status !== "closed" && joinQueue}
      >
        <AddIcon
          sx={{
            fontSize: 70,
            color: "black",
            margin: "0.3em",
          }}
        />
      </div>
      <p style={{ fontWeight: "bold", fontSize: "1.3em" }}>Get A Ticket</p>
    </div>
  );
};
export default QueuePicker;
