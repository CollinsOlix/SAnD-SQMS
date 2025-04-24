// QueueStatus.js
import { useState } from "react";

import "../styles/QueueStatus.css";

export default function QueueStatus() {
  const [currentNumber, setcurrentNumber] = useState(23);
  const [ticketNumber, setticketNumber] = useState(15);
  const [customersBefore, setCustomersBefore] = useState(10);
  const arrivalTime = "21-03-2024 10:30AM";

  return (
    <div classeName="container" style={{}} >
        <h2 className="header">SAnD’s Smart Queue Management System</h2>
        
        <div className="queue-info">
          <p className="label">The current number is :</p>
          <p className="current-number">{currentNumber}</p>
          <p className="service">Service 1</p>
          <p className="label">Your number is :</p>
          <p className="ticket-number">{ticketNumber}</p>
          <p className="details">There are {customersBefore} customers before you.</p>
        </div>
        <p className="arrival">Arrived: {arrivalTime}</p>
        <button className="cancel-button">Cancel Queue</button>
      </div>
      
    
    
      
  );
}
