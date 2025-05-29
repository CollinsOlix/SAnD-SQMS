import React, { useRef, useState } from "react";
import { setBranchPriorityScheme } from "../includes/serverFunctions";
import { useEffect } from "react";

function PrioritySchemeModal({
  setIsModalOpen,
  staffDetails,
  availableBranches,
}) {
  const branchNameRef = useRef();
  const queueNumberRef = useRef();
  const prioritySchemeRef = useRef();

  const [responseMessage, setResponseMessage] = useState();
  const [prioritySchemeState, setPrioritySchemeState] = useState(
    prioritySchemeRef.current?.value
  );
  const changePriorityScheme = async () => {
    let isPrioritySchemeSet = await setBranchPriorityScheme(
      branchNameRef.current.value,
      prioritySchemeRef.current.value,
      queueNumberRef.current?.value || 0
    );
    isPrioritySchemeSet
      ? setResponseMessage("Priority Scheme Set")
      : setResponseMessage("Failed to Set Priority Scheme");
    setTimeout(() => {
      setResponseMessage();
    }, 3000);
  };

  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1em",
        }}
      >
        <h3>Set priority scheme for a branch</h3>
        <span
          onClick={() => setIsModalOpen(false)}
          style={{
            cursor: "pointer",
            padding: "0.3em 0.5em",
            backgroundColor: "#12326e",
            color: "white",
            borderRadius: "10%",
          }}
        >
          close
        </span>
      </div>
      {responseMessage && (
        <div
          style={{
            border: "2px solid #3a72da",
            margin: "10px 0",
            borderRadius: "0.3em",
          }}
        >
          <p style={{ textAlign: "center" }}>{responseMessage}</p>
        </div>
      )}
      <label>Branch</label>
      {!staffDetails.superAdmin ? (
        <select
          ref={branchNameRef}
          className="adminDashInput"
          disabled={!staffDetails.superAdmin}
        >
          <option>{staffDetails.branch}</option>
        </select>
      ) : (
        <select
          onChange={(e) => {
            // fetchServices();
          }}
          ref={branchNameRef}
          className="adminDashInput"
          disabled={!staffDetails.superAdmin}
        >
          {availableBranches.map((item, k) => (
            <option key={k}>{item.branchName}</option>
          ))}
        </select>
      )}
      <label htmlFor="priorityScheme">Select a service</label>
      <br />
      <select
        id="priorityScheme"
        ref={prioritySchemeRef}
        className="adminDashInput"
        defaultValue={
          availableBranches.find(
            (item) => item.branchName === branchNameRef.current?.value
          )?.priorityType
        }
        onChange={(e) => {
          setPrioritySchemeState(e.target.value);
        }}
      >
        <option>Same Queue</option>
        <option>Special Queue</option>
      </select>
      <label>Service special customers after every</label>
      <input
        className="adminDashInput"
        type="text"
        ref={queueNumberRef}
        placeholder=""
        defaultValue={3}
        disabled={prioritySchemeState && prioritySchemeState !== "Same Queue"}
      ></input>
      <button
        onClick={() => {
          changePriorityScheme();
        }}
      >
        Save Changes
      </button>
    </div>
  );
}

export default PrioritySchemeModal;
