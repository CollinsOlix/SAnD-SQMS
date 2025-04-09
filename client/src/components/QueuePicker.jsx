import { useContext } from "react";
import "../styles/serviceCenter.css";
import AddIcon from "@mui/icons-material/Add";
import AppContext from "../includes/context";

const QueuePicker = ({ index, item, active }) => {
  const { customerBranchOption, sessionDetails, setSessionDetails } =
    useContext(AppContext);
  // sessionId, queueId, branch, service;
  const joinQueue = async () => {
    await fetch("http://localhost:5000/join-queue", {
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
      <p style={{ fontWeight: "bold", fontSize: "1.3em" }}>
        There Are Currently
      </p>
      <p style={{ fontSize: "6em", fontWeight: "bold", fontFamily: "Inter" }}>
        {item.peopleWaiting}
      </p>
      <p style={{ fontWeight: "bold", fontSize: "1.3em" }}>people waiting</p>
    </div>
  ) : (
    <div className="queue-container">
      <h4>{item?.serviceName}</h4>
      <p
        style={{
          fontSize: "8em",
          fontWeight: "bold",
          fontFamily: "Inter",
          margin: "0",
        }}
      >
        {item.serviceCurrentNumber}
      </p>
      <div className="icon-container" onClick={joinQueue}>
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
