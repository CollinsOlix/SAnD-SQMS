import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import BackDrop from "../components/BackDrop";
import { useNavigate } from "react-router";
import QueuePicker from "../components/QueuePicker";
import AppContext from "../includes/context";
import { useParams } from "react-router";

function ServiceCenter() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [sessionDetails, setSessionDetails] = useState();

  //
  //Context store
  const {
    customerBranchOption,
    availableServicesInBranch,
    setAvailableServicesInBranch,
    setCustomerBranchOption,
  } = useContext(AppContext);

  //
  //Requesting for user logged in status
  const isUserLoggedIn = async () => {
    await fetch("http://localhost:5000/user", {
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
          return false;
        }
        return data;
      });
  };

  //
  //request to fetch services and queue numbers
  const fetchServices = async (branch) => {
    await fetch("http://localhost:5000/get-services", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ branch: branch }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setAvailableServicesInBranch(data);
      });
  };

  //
  //request to fetch session data
  const getSessionData = async () => {
    await fetch("http://localhost:5000/get-sessions", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ sessionId: id }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Data: ", data);
        setSessionDetails((e) => (e = data));
        setCustomerBranchOption(data.branch);
        // setSessionDetails(data.service);
        fetchServices(data.branch);
        return data;
      });
  };
  useLayoutEffect(() => {
    if (isUserLoggedIn()) {
      getSessionData();
    }
  }, []);

  useEffect(() => {
    console.log("Session Details: ", sessionDetails);
    console.log("Availa: ", availableServicesInBranch);
  }, [sessionDetails, availableServicesInBranch]);

  const { branchServices } = useContext(AppContext);
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
            defaultValue={customerBranchOption || sessionDetails?.branch}
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
            <option value="1">
              {customerBranchOption || sessionDetails?.branch}
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
            {sessionDetails &&
              sessionDetails?.service.map((item, index) => (
                <QueuePicker
                  active={true}
                  index={index}
                  key={index}
                  item={{
                    serviceName: item.serviceToJoin,
                    serviceCurrentNumber: item.lastQueueNumber + 1,
                    peopleWaiting:
                      item.lastQueueNumber +
                        1 -
                        availableServicesInBranch.find(
                          (it) => it.serviceName === item.serviceName
                        )?.serviceCurrentNumber || 0,
                  }}
                />
              ))}
            {availableServicesInBranch.map((item, index) => {
              if (
                !(
                  sessionDetails &&
                  sessionDetails.service.some(
                    (it) => it.serviceName === item.serviceName
                  )
                )
              )
                return <QueuePicker index={index} key={index} item={item} />;
            })}
          </div>
        </div>
      </div>
    </BackDrop>
  );
}

export default ServiceCenter;
