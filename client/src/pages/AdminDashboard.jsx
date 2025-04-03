import React, { useEffect, useState } from "react";
import BackDrop from "../components/BackDrop";
import { actionServices } from "../includes/includes";
import "../styles/adminDashboard.css";
import Services from "../components/Services";
import { useParams } from "react-router";
import Modal from "react-modal";

function AdminDashboard() {
  let { id } = useParams();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [activeModal, setActiveModal] = useState("Add Branch");
  const NewBranchModal = () => {
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
        <form>
          <label htmlFor="branchName">Branch Name (required)</label>
          <br />
          <input type="text" id="branchName" className="adminDashInput" />
          <br />
          <label htmlFor="branchLocation">
            Branch Location Address (required)
          </label>
          <br />
          <input type="text" id="branchLocation" className="adminDashInput" />
        </form>
        <button>Create Branch</button>
      </div>
    );
  };
  const NewQueueModal = () => {
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
          <h3>Create New Queue</h3>
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
        <form>
          <label htmlFor="queueService">Queue Service (required)</label>
          <br />
          <input type="text" id="queueService" className="adminDashInput" />
          <br />
          <div>
            <label htmlFor="queueAttendee">Queue Attendee</label>
            <div style={{ marginBottom: "0.5em" }}>
              <select id="queueAttendee" className="adminDashInput">
                <option value="">Attendee A</option>
                <option value="">Attendee B (unassigned)</option>
              </select>
            </div>
          </div>
          <label htmlFor="priorityQueue">Priority Queue? (required)</label>
          <div>
            <input type="radio" value="true" id="true" name="priorityQueue" />
            <label for="true">True</label>
          </div>
          <div>
            <input
              type="radio"
              name="priorityQueue"
              value="false"
              checked
              id="false"
            />
            <label for="huey">False</label>
          </div>
        </form>
        <button>Create Queue</button>
      </div>
    );
  };

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      maxWidth: "50%",
      minWidth: "30%",
      height: "fit-content",
    },
  };

  useEffect(() => {
    // getCustomerData("cust1", "test");
  }, [id, activeModal]);
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
                    return (
                      <Services
                        option={option}
                        key={index}
                        setIsModalOpen={setIsModalOpen}
                        setActiveModal={setActiveModal}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <Modal
          style={customStyles}
          isOpen={isModalOpen}
          onRequestClose={() => {
            setActiveModal((e) => (e = ""));
          }}
          onAfterClose={() => {
            setActiveModal((e) => (e = ""));
          }}
        >
          {activeModal === "Add Branch" ? <NewBranchModal /> : ""}
          {activeModal === "Add Queue" ? <NewQueueModal /> : ""}
        </Modal>
      </div>
    </BackDrop>
  );
}

export default AdminDashboard;
