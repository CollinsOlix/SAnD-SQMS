import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import BackDrop from "../components/BackDrop";
import { actionServices } from "../includes/includes";
import "../styles/adminDashboard.css";
import Services from "../components/Services";
import { useNavigate, useParams } from "react-router";
import Modal from "react-modal";
import AppContext from "../includes/context";
import { Ring } from "@uiball/loaders";
import BranchAnalyticsModal from "../components/BranchAnalyticsModal";
import RemoveServiceModal from "../components/RemoveServiceModal";
import StaffAnalyticsModal from "../components/StaffAnalyticsModal";
import QueueAnalyticsModal from "../components/QueueAnalyticsModal";
import AssignStaffToServiceModal from "../components/AssignStaffToServiceModal";
import PrioritySchemeModal from "../components/PrioritySchemeModal";
import NewBranchModal from "../components/NewBranchModal";

function AdminDashboard() {
  let { id } = useParams();
  const navigate = useNavigate();
  const { setStaffDetails, staffDetails, SERVER_URL } = useContext(AppContext);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [activeModal, setActiveModal] = useState("");
  const [shouldDisplayLoadingAnimation, setShouldDisplayLoadingAnimation] =
    useState(true);
  const [availableBranches, setAvailableBranches] = useState();

  //
  //
  const fetchBranches = async () => {
    await fetch(`${SERVER_URL}/get-branches`)
      .then((response) => response.json())
      .then((data) => {
        if (staffDetails?.superAdmin) {
          setAvailableBranches((e) => (e = data));
        } else {
          setAvailableBranches((e) => [
            (e = data.find((item) => item.branchName === staffDetails?.branch)),
          ]);
        }
      });
  };

  //
  const isStaffSignedIn = async () => {
    await fetch(`${SERVER_URL}/staff-sign-in`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.staffSignedIn === true) {
          if (data.staffDetails.staffType !== "admin") {
            navigate("/staff/board");
          } else console.log(data);
          setStaffDetails((e) => (e = data.staffDetails));
          setShouldDisplayLoadingAnimation(false);
        } else {
          navigate("/staff");
        }
      });
  };
  const EmptyModal = () => {
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
          <h3>Create New Branch</h3>{" "}
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
  const NewServiceModal = () => {
    const serviceNameRef = useRef();
    const branchNameRef = useRef(
      !staffDetails.superAdmin && staffDetails.branch
    );
    const [btnDisabled, setBtnDisabled] = useState("");
    const [responseMessage, setResponseMessage] = useState();

    const addNewService = async () => {
      try {
        await fetch(`${SERVER_URL}/admin/new-service`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            service: serviceNameRef.current.value,
            branch: staffDetails.superAdmin
              ? branchNameRef.current.value
              : staffDetails.branch,
          }),
        })
          .then((response) => response.json())
          .then((data) => setResponseMessage((e) => (e = data)));
      } catch (err) {
        console.error("Err: ", err);
      } finally {
        setTimeout(() => setResponseMessage((e) => (e = null)), 3000);
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
          <h3>Add a New Service</h3>
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
          <label htmlFor="serviceName">Name of Service (required)</label>
          <br />
          <input
            ref={serviceNameRef}
            type="text"
            id="serviceName"
            className="adminDashInput"
            required
            onChange={() => {
              setBtnDisabled(serviceNameRef.current.value);
            }}
          />
          <label htmlFor="branchName">Select a branch</label>
          <br />
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
              ref={branchNameRef}
              className="adminDashInput"
              disabled={!staffDetails.superAdmin}
            >
              {availableBranches.map((item, k) => (
                <option key={k}>{item.branchName}</option>
              ))}
            </select>
          )}
        </form>
        <button disabled={!btnDisabled} onClick={addNewService}>
          Add this Service
        </button>
      </div>
    );
  };

  const renderModal = () => {
    switch (activeModal) {
      case "Add Branch":
        return <NewBranchModal setIsModalOpen={setIsModalOpen} />;
      case "Add Queue":
        return <NewQueueModal />;
      case "Add a Service":
        return <NewServiceModal />;
      case "Set Priority Scheme":
        return (
          <PrioritySchemeModal
            setIsModalOpen={setIsModalOpen}
            availableBranches={availableBranches}
            staffDetails={staffDetails}
          />
        );
      case "Remove a Service":
        return (
          <RemoveServiceModal
            setIsModalOpen={setIsModalOpen}
            staffDetails={staffDetails}
            availableBranches={availableBranches}
          />
        );
      case "Branch Analytics":
        return (
          <BranchAnalyticsModal
            staffDetails={staffDetails}
            availableBranches={availableBranches}
            setIsModalOpen={setIsModalOpen}
          />
        );
      case "View Staff Analytics":
        return (
          <StaffAnalyticsModal
            setIsModalOpen={setIsModalOpen}
            availableBranches={availableBranches}
            staffDetails={staffDetails}
          />
        );
      case "Assign Staff to a Service":
        return (
          <AssignStaffToServiceModal
            staffDetails={staffDetails}
            setIsModalOpen={setIsModalOpen}
            availableBranches={availableBranches}
          />
        );
      case "Test":
        return <></>;
      case "View Service Analytics":
        return (
          <QueueAnalyticsModal
            setIsModalOpen={setIsModalOpen}
            availableBranches={availableBranches}
            staffDetails={staffDetails}
          />
        );
      default:
        return <EmptyModal />;
    }
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
  useLayoutEffect(() => {
    isStaffSignedIn();
  }, []);

  useEffect(() => {}, [id, activeModal]);
  // ...
  useEffect(() => {
    fetchBranches();
  }, [staffDetails]);

  return shouldDisplayLoadingAnimation ? (
    <div
      style={{
        position: "fixed",
        zIndex: 99,
        inset: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <Ring size={80} lineWeight={5} speed={1} color="white" />
    </div>
  ) : (
    <BackDrop showNavTabs={true}>
      <div
        style={{
          padding: "0 1.5em",
          height: "100%",
          overflow: "hidden scroll",
        }}
      >
        <div className="greetingTextContainer">
          <h2>Admin Dashboard</h2>
          <div>
            <h3>Hello! {staffDetails?.name}!</h3>
            {/* <h3>Hello, {name}</h3> */}
            <h4>
              {new Date().toLocaleString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                weekday: "long",
              })}
            </h4>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            margin: "1em 0",
          }}
        >
          {actionServices &&
            actionServices.map((service, index) => {
              return (
                <div
                  key={index}
                  style={{
                    // backgroundColor: "green",
                    margin: "0.4em 0",
                    border: "1px solid #fff",
                    padding: "0.4em",
                    borderRadius: "0.3em",
                    backgroundColor: "#3a72da",
                    color: "#0c2a5d",
                  }}
                >
                  <h2 style={{ color: "#fff" }}>{Object.keys(service)[0]}</h2>

                  <hr />
                  <div className="actionButtonsContainer">
                    {staffDetails?.superAdmin
                      ? Object.values(service)[0].map((option, index) => (
                          <Services
                            option={option}
                            key={index}
                            setIsModalOpen={setIsModalOpen}
                            setActiveModal={setActiveModal}
                          />
                        ))
                      : Object.values(service)[0].map(
                          (option, index) =>
                            !option[Object.keys(option)[0]]
                              .requiresSuperAdmin && (
                              <Services
                                option={option}
                                key={index}
                                setIsModalOpen={setIsModalOpen}
                                setActiveModal={setActiveModal}
                              />
                            )
                        )}
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
          {renderModal()}
        </Modal>
      </div>
    </BackDrop>
  );
}

export default AdminDashboard;
