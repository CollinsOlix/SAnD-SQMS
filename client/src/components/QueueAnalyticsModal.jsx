import React, { useEffect, useRef } from "react";
import {
  fetchServiceAnalytics,
  getServicesInBranch,
} from "../includes/serverFunctions";
import LineGraph from "./LineGraph";
import { Ring } from "@uiball/loaders";

function QueueAnalyticsModal({
  staffDetails,
  availableBranches,
  setIsModalOpen,
}) {
  const [services, setServices] = React.useState([]);
  const [serviceDetails, setServiceDetails] = React.useState();
  const [shouldDisplayLoadingAnimation, setShouldDisplayLoadingAnimation] =
    React.useState(false);
  const branchNameRef = useRef(!staffDetails.superAdmin && staffDetails.branch);
  const serviceNameRef = useRef();
  const fetchServices = async () => {
    console.log(branchNameRef.current.value);
    let serviceDeets = await getServicesInBranch(branchNameRef.current.value);
    setServices((e) => (e = serviceDeets));
    getServiceAnalytics();
  };
  const getServiceAnalytics = async () => {
    let serviceDeets = await fetchServiceAnalytics(
      branchNameRef.current.value,
      serviceNameRef.current.value
    );
    console.log(serviceDeets);
    setServiceDetails((_) => (_ = serviceDeets));
  };
  useEffect(() => {
    fetchServices();
  }, []);
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1em",
        }}
      >
        <h3 className="modal-headers">Branch Analytics</h3>
        <span
          onClick={() => setIsModalOpen((_) => (_ = false))}
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
        {/* {responseMessage && (
          <div
            style={{
              border: "2px solid #3a72da",
              margin: "10px 0",
              borderRadius: "0.3em",
            }}
          >
            <p style={{ textAlign: "center" }}>{responseMessage}</p>
          </div>
        )} */}
      </form>
      <label htmlFor="branchName"></label>
      <select
        ref={branchNameRef}
        className="adminDashInput"
        onChange={fetchServices}
        disabled={!staffDetails.superAdmin}
      >
        {availableBranches &&
          availableBranches.map((item, index) => (
            <option key={item.branchName + index}>{item.branchName}</option>
          ))}
      </select>
      <label htmlFor="serviceName">Select a service</label>
      <br />
      <select
        ref={serviceNameRef}
        className="adminDashInput"
        onChange={getServiceAnalytics}
      >
        {services.map((item) => (
          <option>{item.serviceName}</option>
        ))}
      </select>
      {shouldDisplayLoadingAnimation ? (
        <div
          style={{
            flex: 1,
            width: "100%",
            aspectRatio: "3/2",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "relative",
              zIndex: 99,
              inset: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ring size={80} lineWeight={5} speed={1} color="#3a72da" />
          </div>
        </div>
      ) : (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div
              style={{
                padding: "0.6em",
                // margin: "0.6em",
                border: "2px solid #3a72da",
                borderRadius: "0.3em",
                textAlign: "center",
              }}
            >
              <p>Number of staff assigned to this service</p>
              <h1>{serviceDetails?.staff.length}</h1>
            </div>
            <div
              style={{
                padding: "0.6em",
                margin: "0 0.6em",
                border: "2px solid #3a72da",
                borderRadius: "0.3em",
                textAlign: "center",
              }}
            >
              <p>Average servicing time this week</p>
              <h1>
                {`${
                  Math.trunc(
                    (serviceDetails?.serviceHistory.reduce(
                      (a, b) => a + b.serviceDuration,
                      0
                    ) /
                      60) *
                      100
                  ) / 100
                }`}
                mins
              </h1>
            </div>
            <div
              style={{
                padding: "0.6em",
                // margin: "0.6em",
                border: "2px solid #3a72da",
                borderRadius: "0.3em",
                textAlign: "center",
              }}
            >
              <p>Number of transactions this week</p>
              <h1>{serviceDetails?.serviceHistory.length}</h1>
            </div>
          </div>
          <div>
            {/* <LineGraph
                title={"Number of transactions per day this week"}
                data={lineChartData}
              /> */}
          </div>
        </div>
      )}
    </div>
  );
}

export default QueueAnalyticsModal;
