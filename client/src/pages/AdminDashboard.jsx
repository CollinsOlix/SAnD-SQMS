import React, { useEffect } from "react";
import BackDrop from "../components/BackDrop";
import { actionServices } from "../includes/includes";
import "../styles/adminDashboard.css";
import Services from "../components/Services";
import { useParams } from "react-router";
import ReactDOM from "react-dom";
import Modal from "react-modal";

function AdminDashboard() {
  let { id } = useParams();

  useEffect(() => {
    // getCustomerData("cust1", "test");
    console.log("This is id: ", id);
  }, [id]);
  // ...

  return (
    <BackDrop>
      <div style={{ padding: "0 1.5em" }}>
        <div className="greetingTextContainer">
          <h2>Admin Dashboard</h2>
          <div>
            <h3>Hello, Mrs Fimbulwinter!</h3>
            {/* <h3>Hello, {name}</h3> */}
            <h4>Monday, 9th March, 2025</h4>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            margin: "1em 0",
          }}
        >
          {actionServices.map((service, index) => {
            return (
              <div key={index}>
                <h2 style={{ color: "#fff" }}>{Object.keys(service)[0]}</h2>
                <hr />
                <div className="actionButtonsContainer">
                  {Object.values(service)[0].map((option, index) => {
                    return <Services option={option} key={index} />;
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <Modal>
          <h2>Modal Title</h2>
        </Modal>
      </div>
    </BackDrop>
  );
}

export default AdminDashboard;
