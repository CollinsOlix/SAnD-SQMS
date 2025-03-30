import React, { useContext, useLayoutEffect } from "react";
import BackDrop from "../components/BackDrop";
import { useNavigate } from "react-router";
import QueuePicker from "../components/QueuePicker";
import AppContext from "../includes/context";

function ServiceCenter() {
  const navigate = useNavigate();
  const testRequest = async () => {
    await fetch("http://localhost:5000/test", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (typeof data === "string") {
          navigate("/");
        }
      });
  };
  useLayoutEffect(() => {
    testRequest();
  }, []);

  const { branchServices } = useContext(AppContext);
  console.log(branchServices);
  return (
    <BackDrop>
      <div
        className="service-center"
        style={{
          padding: "0 22px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
          width: "100%",
        }}
      >
        <div style={{ display: "flex" }}>
          <select
            disabled={true}
            style={{
              flex: 2,
              padding: "7px",
              borderRadius: "5px",
              border: "none",
              fontSize: "larger",
              boxShadow: "1px 1px 3px black",
            }}
            contentEditable={false}
          >
            <option value="1" selected>
              Branch A
            </option>
          </select>
          <div style={{ flex: 4, textAlign: "right" }}>
            <h1 style={{ color: "white", textShadow: "1px 1px 3px black" }}>
              Hello, Collins
            </h1>
          </div>
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            marginTop: "3em",
          }}
        >
          <h3>Services currently offered at this branch</h3>

          <div
            style={{
              flex: 1,
              display: "grid",
              marginTop: "2em",
              gap: "2rem",
              overflow: "hidden scroll",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              maxHeight: "450px",
              // gridTemplateColumns: "1fr 1fr 1fr 1fr",
            }}
          >
            {new Array(8).fill(12).map((item, index) => (
              <QueuePicker index={index} key={index} />
            ))}
          </div>
        </div>
      </div>
    </BackDrop>
  );
}

export default ServiceCenter;
