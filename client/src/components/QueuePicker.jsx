import { useContext } from "react";
import "../styles/serviceCenter.css";
import AddIcon from "@mui/icons-material/Add";
import AppContext from "../includes/context";

const QueuePicker = ({ index, item, active }) => {
  const { customerBranchOption } = useContext(AppContext);
  const joinQueue = async () => {
    await fetch("/join-queue", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(response=>response.json());
  };
  return active ? (
    <div className="queue-container">
      <h4>{item?.serviceName}</h4>
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
        {item.serviceCurrentNumber}
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
