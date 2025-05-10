import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import BackDrop from "../components/BackDrop";
import { Link, useNavigate } from "react-router";
import QueuePicker from "../components/QueuePicker";
import AppContext from "../includes/context";
import { useParams } from "react-router";
import "../styles/serviceCenter.css";
import Modal from "react-modal";
import { Ring } from "@uiball/loaders";
import useWebSocket from "react-use-websocket";

function ServiceCenter() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shouldDisplayLoadingAnimation, setShouldDisplayLoadingAnimation] =
    useState(true);
  const modalStyles = {
    content: {
      position: "absolute",
      zIndex: 5,
      height: "fit-content",
      maxWidth: "50%",
      minWidth: "30%",
      inset: "0",
      justifySelf: "center",
    },
  };

  //
  //Context store
  const {
    customerBranchOption,
    availableServicesInBranch,
    setAvailableServicesInBranch,
    setCustomerBranchOption,
    sessionDetails,
    setSessionDetails,
    SERVER_URL,
  } = useContext(AppContext);

  const [socketUrl, setSocketUrl] = useState(SERVER_URL);
  const [messageHistory, setMessageHistory] = useState([]);
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory((prev) => prev.concat(lastMessage));
    }
  }, [lastMessage]);

  //
  //Requesting for user logged in status
  const isUserLoggedIn = useCallback(async () => {
    await fetch(`${SERVER_URL}/user`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (typeof data === "string" || !data?.signedIn) {
          navigate("/");
          return false;
        }
        return data;
      });
  }, [SERVER_URL, navigate]);

  //
  //request to fetch services and queue numbers
  const fetchServices = useCallback(
    async (branch) => {
      await fetch(`${SERVER_URL}/get-services`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ branch: branch }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          sendMessage(
            JSON.stringify({
              branch,
            })
          );
          setAvailableServicesInBranch((e) => (e = data));
        });
    },
    [SERVER_URL, setAvailableServicesInBranch]
  );

  //
  //request to fetch session data
  const getSessionData = useCallback(async () => {
    await fetch(`${SERVER_URL}/get-sessions`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ sessionId: id }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setSessionDetails((e) => (e = data));
        setCustomerBranchOption(data.branch);
        // setSessionDetails(data.service);
        fetchServices(data.branch);
        return data;
      });
  }, [
    SERVER_URL,
    id,
    setCustomerBranchOption,
    setSessionDetails,
    fetchServices,
  ]);

  const endSession = async () => {
    await fetch(`${SERVER_URL}/${id}/end-session`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ id }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((isSuccessful) => {
        if (isSuccessful) {
          setIsModalOpen(false);
          navigate("/");
        } else {
          console.log("Is: ", isSuccessful);
        }
      });
  };
  useLayoutEffect(() => {
    if (isUserLoggedIn()) {
      getSessionData();
    }
  }, [getSessionData, isUserLoggedIn]);

  useEffect(() => {
    console.log("Avail: ", availableServicesInBranch);
    if (availableServicesInBranch.length > 0 && sessionDetails) {
      setShouldDisplayLoadingAnimation((e) => (e = false));
    }
  }, [availableServicesInBranch, sessionDetails]);

  useEffect(() => {
    if (lastMessage) {
      console.log("This part ran", Array.isArray(JSON.parse(lastMessage.data)));
      console.log("This part ran a", availableServicesInBranch);
      lastMessage?.data &&
        setAvailableServicesInBranch((_) => (_ = JSON.parse(lastMessage.data)));
    }
  }, [lastMessage]);

  if (sessionDetails === "Session not found") {
    return (
      <BackDrop>
        <div className="service-center-container">
          <div>
            <h2>Session not Found</h2>
            <p>Session information is wrong or has expired.</p>
            <Link to={"/"}>Return to Homepage</Link>
          </div>
        </div>
      </BackDrop>
    );
  } else {
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
      <BackDrop>
        <Modal isOpen={isModalOpen} style={modalStyles}>
          <div style={{ width: "100%" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1em",
              }}
            >
              <h3 style={{ color: "#000" }}>End Session?</h3>

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
            Are you sure you want to end this Session? You would need to pick a
            new ticket for every queue you have previously joined again.
            <button onClick={endSession}>Yes I want to end this session</button>
          </div>
        </Modal>
        <div className="service-center-container">
          <div style={{ display: "flex" }}>
            <select
              disabled={true}
              defaultValue={customerBranchOption || sessionDetails?.branch}
              className="select-branch"
              contentEditable={false}
            >
              <option value="1">
                {customerBranchOption || sessionDetails?.branch}
              </option>
            </select>
            <div
              style={{
                flex: 4,
                textAlign: "right",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <h1
                style={{
                  color: "white",
                  textShadow: "1px 1px 3px black",
                  marginRight: 10,
                }}
              >
                Hello, {sessionDetails?.customerDetails.firstName}
              </h1>
              <button
                onClick={() => setIsModalOpen(true)}
                style={{ width: "fit-content" }}
              >
                End this session
              </button>
            </div>
          </div>
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              marginTop: "3em",
              justifyContent: "end",
            }}
          >
            <h3>Services currently offered at this branch</h3>

            <div
              style={{
                position: "relative",
                zIndex: 0,
                bottom: 0,
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
                Object.keys(sessionDetails.service).map((item, index) => {
                  return (
                    <div>
                      <QueuePicker
                        noWaitingNumber={
                          sessionDetails.customerDetails.priority
                        }
                        active={true}
                        index={index}
                        key={index + "active"}
                        item={{
                          serviceName: sessionDetails.service[item].serviceName,
                          ticketNumber:
                            sessionDetails.service[item].ticketNumber,
                          serviceCurrentNumber:
                            availableServicesInBranch.find(
                              (service) =>
                                service?.serviceName ===
                                sessionDetails.service[item].serviceName
                            ).serviceCurrentNumber || 0,
                          peopleWaiting:
                            sessionDetails.service[item].ticketNumber -
                              availableServicesInBranch.find(
                                (service) =>
                                  service.serviceName ===
                                  sessionDetails.service[item].serviceName
                              ).serviceCurrentNumber || 0,
                        }}
                      />
                    </div>
                  );
                })}

              {availableServicesInBranch.map((item, index) => {
                if (
                  !(sessionDetails && sessionDetails.service[item.serviceName])
                ) {
                  return <QueuePicker index={index} key={index} item={item} />;
                } else {
                  return <></>;
                }
              })}
            </div>
          </div>
        </div>
      </BackDrop>
    );
  }
}

export default ServiceCenter;
