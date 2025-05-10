import { Ring } from "@uiball/loaders";
import React, { useEffect, useRef, useState } from "react";
import { getServicesInBranch } from "../includes/serverFunctions";

function AssignStaffToServiceModal({
  setIsModalOpen,
  staffDetails,
  availableBranches,
}) {
  const branchNameRef = useRef();
  const serviceNameRef = useRef();
  const [services, setServices] = useState([]);
  const [shouldDisplayLoadingAnimation, setShouldDisplayLoadingAnimation] =
    useState(true);

  const fetchServices = async () => {
    setShouldDisplayLoadingAnimation(true);
    let serviceData = await getServicesInBranch(branchNameRef.current.value);
    setServices((_) => (_ = serviceData));
    setShouldDisplayLoadingAnimation(false);
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
        //    onChange={getServiceAnalytics}
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
        <div>Lol</div>
      )}
    </div>
  );
}

export default AssignStaffToServiceModal;
