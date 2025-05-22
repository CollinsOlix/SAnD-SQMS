import { useState, useEffect, useRef } from "react";
import { Ring } from "@uiball/loaders";
import {
  fetchBranchAnalytics,
  getServicesInBranch,
} from "../includes/serverFunctions";
import LineGraph from "./LineGraph";

export default function BranchAnalyticsModal({
  staffDetails,
  availableBranches,
  setIsModalOpen,
}) {
  const [responseMessage, setResponseMessage] = useState();
  //   const [serviceState, setServiceState] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [shouldDisplayLoadingAnimation, setShouldDisplayLoadingAnimation] =
    useState(true);
  //   const fetchServices = async () => {
  //     let serviceDeets = await getServicesInBranch(branchNameRef.current.value);
  //     setServiceState((e) => (e = serviceDeets));
  //   };
  const [lineChartData, setLineChartData] = useState({
    Monday: 0,
    Tuesday: 0,
    Wednesday: 0,
    Thursday: 0,
    Friday: 0,
  });

  const branchNameRef = useRef(!staffDetails.superAdmin && staffDetails.branch);

  //
  //
  const branchAnalytics = async () => {
    setShouldDisplayLoadingAnimation(true);
    let analyticsData = await fetchBranchAnalytics(branchNameRef.current.value);

    setAnalytics((e) => (e = analyticsData));
    let weekData = {
      Monday: 0,
      Tuesday: 0,
      Wednesday: 0,
      Thursday: 0,
      Friday: 0,
    };
    setLineChartData((_) => (_ = weekData));
    analyticsData &&
      analyticsData.history.forEach((item) => {
        let r = new Date(
          item.date.seconds * 1000 + item.date.nanoseconds / 1e6
        ).toLocaleDateString("en-US", { weekday: "long" });
        weekData[r]++;
        setLineChartData((e) => (e = weekData));
      });

    setShouldDisplayLoadingAnimation(false);
    return analyticsData;
  };
  useEffect(() => {
    branchAnalytics();
  }, []);

  useEffect(() => {
    setLineChartData({
      Monday: 0,
      Tuesday: 0,
      Wednesday: 0,
      Thursday: 0,
      Friday: 0,
    });
    let weekData = {
      Monday: 0,
      Tuesday: 0,
      Wednesday: 0,
      Thursday: 0,
      Friday: 0,
    };
    analytics?.history?.forEach((item) => {
      let r = new Date(
        item.date.seconds * 1000 + item.date.nanoseconds / 1e6
      ).toLocaleDateString("en-US", { weekday: "long" });
      weekData[r]++;
      setLineChartData((e) => (e = weekData));
    });
  }, [analytics]);
  const [btnDisabled, setBtnDisabled] = useState("");

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
      </form>
      <label htmlFor="branchName"></label>
      <select
        ref={branchNameRef}
        className="adminDashInput"
        onChange={branchAnalytics}
        disabled={!staffDetails.superAdmin}
      >
        {availableBranches &&
          availableBranches.map((item, index) => (
            <option key={item.branchName + index}>{item.branchName}</option>
          ))}
      </select>
      <div style={{ height: "500px", flex: 1 }}>
        {shouldDisplayLoadingAnimation ? (
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
            <Ring size={80} lineWeight={5} speed={1} color="#3a72da" />
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
                <p>Number of staff</p>
                <h1>{analytics.staff.length}</h1>
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
                <p>Number of services</p>
                <h1>{analytics.services.length}</h1>
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
                <h1>{analytics.history.length}</h1>
              </div>
            </div>
            <div>
              <LineGraph
                title={"Number of transactions per day this week"}
                data={lineChartData}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
