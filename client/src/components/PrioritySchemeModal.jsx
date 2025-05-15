import React, { useRef, useState } from "react";

function PrioritySchemeModal({
  setIsModalOpen,
  staffDetails,
  availableBranches,
}) {
  const branchNameRef = useRef();
  const prioritySchemeRef = useRef();
  const [prioritySchemeState, setPrioritySchemeState] = useState(
    prioritySchemeRef.current?.value
  );
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
      >
        <option>Same Queue</option>
        <option>Special Queue</option>
      </select>
      <label>Service special customers after every</label>
      <input
        className="adminDashInput"
        type="text"
        placeholder=""
        defaultValue={3}
        disabled={prioritySchemeState && prioritySchemeState !== "Same Queue"}
      ></input>
      <button>Save Changes</button>
    </div>
  );
}

export default PrioritySchemeModal;
