import React, { useRef } from "react";
import BackDrop from "../components/BackDrop";
import { FormGroup } from "@mui/material";

function Test() {
  const branchNameRef = useRef();
  const serviceNameRef = useRef();
  return (
    <BackDrop>
      <div style={{ width: "50%", justifySelf: "center" }}>
        <FormGroup>
          <legend>Reset</legend>
          <label
            style={{ fontSize: "1.4em", color: "white" }}
            htmlFor="branchText"
          >
            Branch
          </label>
          <input
            id="branchText"
            type="text"
            ref={branchNameRef}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "5px",
              marginBottom: "10px",
              fontSize: "medium",
              border: "1px solid",
            }}
          />
          <label
            style={{ fontSize: "1.4em", color: "white" }}
            htmlFor="serviceText"
          >
            Service
          </label>
          <input
            id="serviceText"
            type="text"
            ref={serviceNameRef}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "5px",
              marginBottom: "10px",
              fontSize: "medium",
              border: "1px solid",
            }}
          />
          <div style={{ display: "flex" }}>
            <button
              disabled={
                branchNameRef.current?.value && serviceNameRef.current?.value
              }
              onClick={() => {
                console.log("Hello from 1");
              }}
            >
              Reset Branch
            </button>
            <button
              disabled={!serviceNameRef.current?.value}
              onClick={() => {
                console.log("Hello from 2");
              }}
            >
              Reset Service
            </button>
          </div>
          <button
            onClick={() => {
              console.log(
                !serviceNameRef.current?.value && !branchNameRef.current?.value
              );
            }}
          >
            Third
          </button>
        </FormGroup>
      </div>
    </BackDrop>
  );
}

export default Test;
