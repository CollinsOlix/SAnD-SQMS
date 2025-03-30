import "../styles/serviceCenter.css";
import AddIcon from "@mui/icons-material/Add";

const QueuePicker = ({ index = 1 }) => {
  return index < 1 ? (
    <div className="queue-container">
      <h4>Operation 1</h4>
      <p style={{ fontWeight: "bold", fontSize: "1.3em" }}>
        Your Ticket Number
      </p>
      <p
        style={{
          fontSize: "10em",
          fontWeight: "bold",
          fontFamily: "Inter",
          margin: "0",
        }}
      >
        00
      </p>
      <p style={{ fontWeight: "bold", fontSize: "1.3em" }}>
        There Are Currently
      </p>
      <p style={{ fontSize: "6em", fontWeight: "bold", fontFamily: "Inter" }}>
        00
      </p>
      <p style={{ fontWeight: "bold", fontSize: "1.3em" }}>people waiting</p>
    </div>
  ) : (
    <div className="queue-container">
      <h4>Operation {index}</h4>
      <p
        style={{
          fontSize: "10em",
          fontWeight: "bold",
          fontFamily: "Inter",
          margin: "0",
        }}
      >
        00
      </p>
      <div className="icon-container">
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
