import React, { useCallback, useEffect, useRef, useState } from "react";
import BackDrop from "../components/BackDrop";
import { FormGroup } from "@mui/material";
import useWebSocket, { ReadyState } from "react-use-websocket";

const SERVER_URL = "http://localhost:5000";

function Test() {
  const branchNameRef = useRef();
  const serviceNameRef = useRef();

  const [socketUrl, setSocketUrl] = useState(SERVER_URL);
  const [messageHistory, setMessageHistory] = useState([]);
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory((prev) => prev.concat(lastMessage));
    }
  }, [lastMessage]);

  const handleSendMessage = useCallback(
    () =>
      sendMessage(
        JSON.stringify({
          branch: "Apex Bank ( Girne )",
        })
      ),
    []
  );

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  return (
    <BackDrop>
      {/* <div style={{ width: "50%", justifySelf: "center" }}>
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
      </div> */}

      <div>
        <button
          onClick={handleSendMessage}
          disabled={readyState !== ReadyState.OPEN}
        >
          Click Me to send 'Hello'
        </button>
        {/* <span>The WebSocket is currently {connectionStatus}</span> */}
        <br />
        {lastMessage ? (
          <span>Last message: {lastMessage.data.length}</span>
        ) : null}
        <ul>
          {messageHistory.map((message, idx) => (
            <span key={idx}>{message ? message.data.length : null}</span>
          ))}
        </ul>
      </div>
    </BackDrop>
  );
}

export default Test;
