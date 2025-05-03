import { useEffect, useRef, useState } from "react";
import {
  getServicesInBranch,
  removeServiceFunction,
} from "../includes/serverFunctions";

const RemoveServiceModal = ({
  staffDetails,
  availableBranches,
  setIsModalOpen,
}) => {
  const [serviceState, setServiceState] = useState([]);
  const fetchServices = async () => {
    console.log(branchNameRef.current.value);
    let serviceDeets = await getServicesInBranch(branchNameRef.current.value);
    setServiceState((e) => (e = serviceDeets));
  };
  const serviceNameRef = useRef();
  const branchNameRef = useRef(!staffDetails.superAdmin && staffDetails.branch);
  useEffect(() => {
    fetchServices();
  }, []);
  const [btnDisabled, setBtnDisabled] = useState("");
  const [responseMessage, setResponseMessage] = useState();

  const removeService = async () => {
    let respMessage = await removeServiceFunction(
      staffDetails.superAdmin
        ? branchNameRef.current.value
        : staffDetails.branch,
      serviceNameRef.current.value
    );
    setResponseMessage((e) => (e = respMessage));
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
        <h3>Remove a Service</h3>
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
            onChange={(e) => {
              fetchServices();
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
        <br />
        <label htmlFor="serviceName">Select a service</label>
        <br />
        <select ref={serviceNameRef} className="adminDashInput">
          {serviceState.map((item) => (
            <option>{item.serviceName}</option>
          ))}
        </select>
      </form>
      <button onClick={removeService}>Remove this Service</button>
    </div>
  );
};

export default RemoveServiceModal;
