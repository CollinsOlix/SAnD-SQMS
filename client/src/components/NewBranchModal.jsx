import React from "react";
import { useContext } from "react";
import { useRef } from "react";
import AppContext from "../includes/context";
import { useState } from "react";

const NewBranchModal = ({ setIsModalOpen }) => {
  const { SERVER_URL } = useContext(AppContext);
  const branchNameRef = useRef();
  const locationRef = useRef();
  const [responseMessage, setResponseMessage] = useState();

  const addNewBranch = async () => {
    if (!branchNameRef.current?.value || !locationRef.current?.value) {
      setResponseMessage("Please fill in all fields before submitting.");
      setTimeout(() => {
        setResponseMessage();
      }, 3000);
      return;
    }
    try {
      await fetch(`${SERVER_URL}/admin/add-branch`, {
        method: "POST",
        body: JSON.stringify({
          branch: branchNameRef.current.value,
          location: locationRef.current.value,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setResponseMessage(data);
          setTimeout(() => {
            setResponseMessage();
          }, 3000);
        });
    } catch (err) {
      console.log("Error adding new branch: ", err);
    }
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
        <h3>Create New Branch</h3>
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
      <form>
        <label htmlFor="branchName">Branch Name (required)</label>
        <br />
        <input
          type="text"
          id="branchName"
          ref={branchNameRef}
          className="adminDashInput"
        />
        <br />
        <label htmlFor="branchLocation">
          Branch Location Address (required)
        </label>
        <br />
        <input
          type="text"
          id="branchLocation"
          ref={locationRef}
          className="adminDashInput"
        />
      </form>
      <button onClick={addNewBranch}>Create Branch</button>
    </div>
  );
};

export default NewBranchModal;
