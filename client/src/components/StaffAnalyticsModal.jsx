import React, { useEffect, useRef, useState } from "react";
import {
  fetchAllTransactionsFromBranch,
  fetchStaffFromBranch,
} from "../includes/serverFunctions";
import LineGraph from "./LineGraph";
import { Ring } from "@uiball/loaders";

function StaffAnalyticsModal({
  setIsModalOpen,
  availableBranches,
  staffDetails,
}) {
  const [allStaff, setAllStaff] = useState();
  const [activeStaff, setActiveStaff] = useState();
  const [staffHistory, setStaffHistory] = useState();
  const [averageServicingTime, setAverageServicingTime] = useState();
  const [shouldDisplayLoadingAnimation, setShouldDisplayLoadingAnimation] =
    useState(true);
  const branchNameRef = useRef();
  const staffNameRef = useRef();
  const fetchStaff = async (branch) => {
    let staff = await fetchStaffFromBranch(branch);
    setAllStaff((_) => (_ = staff));
    setActiveStaff((_) => (_ = staff[0]));
  };
  const fetchStaffHistory = async (branch, id, name) => {
    let staffHistory = await fetchAllTransactionsFromBranch(branch, id, name);
    setStaffHistory((_) => (_ = staffHistory));
    setAverageServicingTime(
      (_) =>
        (_ =
          staffHistory.reduce((a, b) => a + b.serviceDuration, 0) /
          staffHistory.length)
    );
    setShouldDisplayLoadingAnimation(false);
  };

  useEffect(() => {
    if (branchNameRef.current.value) {
      fetchStaff(branchNameRef.current.value);
    }
  }, []);

  useEffect(() => {
    console.log("All Staff: ", allStaff);

    allStaff &&
      fetchStaffHistory(
        activeStaff.branch,
        activeStaff.staffId,
        activeStaff.name
      );
  }, [allStaff]);
  useEffect(() => {
    averageServicingTime && console.log("AveServTime: ", averageServicingTime);
  }, [averageServicingTime]);
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
        <h3 className="modal-headers">Staff Analytics</h3>
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
      <form></form>
      <label htmlFor="branchName"></label>
      <select
        ref={branchNameRef}
        className="adminDashInput"
        disabled={!staffDetails.superAdmin}
      >
        {availableBranches &&
          availableBranches.map((item, index) => (
            <option key={item.branchName + index}>{item.branchName}</option>
          ))}
      </select>
      <select
        ref={staffNameRef}
        className="adminDashInput"
        onChange={() => {
          setActiveStaff((_) => (_ = staffNameRef.current.value));
        }}
      >
        {allStaff &&
          allStaff.map((item, index) => (
            <option key={item.name + index}>
              {item.name}
              {" -"}
              {item.staffType === "admin"
                ? " Admin"
                : item.assignedTo
                ? ` ${item.assignedTo}`
                : " Unassigned "}
            </option>
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
              <p>Average servicing time</p>
              <h1>{Math.trunc(averageServicingTime * 100) / 100}</h1>
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
              <p>Average number of services rendered</p>
              <h1>{"yolo"}</h1>
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
              <h1>{"yolo"}</h1>
            </div>
          </div>
          <div>
            <LineGraph title={"Some title"} data={{ Mon: 4, Tue: 4, Wed: 7 }} />
          </div>
        </div>
      )}
      <div style={{ display: "flex" }}>
        <button>Do something</button>
        <button>Do something</button>
      </div>
    </div>
  );
}

export default StaffAnalyticsModal;
