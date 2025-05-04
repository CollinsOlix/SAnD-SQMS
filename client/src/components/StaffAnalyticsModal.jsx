import React, { useEffect, useRef, useState } from "react";
import {
  fetchAllTransactionsFromBranch,
  fetchStaffFromBranch,
} from "../includes/serverFunctions";
import LineGraph from "./LineGraph";
import { Ring } from "@uiball/loaders";
import {
  getAllHistoryForThisMonth,
  getStartOfMonth,
  getStartOfWeek,
  initializeMonth,
} from "../includes/includes";
// import { getStartOfWeek } from "../includes/includes";

function StaffAnalyticsModal({
  setIsModalOpen,
  availableBranches,
  staffDetails,
}) {
  const [allStaff, setAllStaff] = useState();
  const [activeStaff, setActiveStaff] = useState();
  const [staffHistory, setStaffHistory] = useState();
  const [graphData, setGraphData] = useState();
  const [graphTitle, setGraphTitle] = useState("Data title goes here");
  const [averageServicingTime, setAverageServicingTime] = useState();
  const [shouldDisplayLoadingAnimation, setShouldDisplayLoadingAnimation] =
    useState(true);
  const branchNameRef = useRef();
  const staffNameRef = useRef();

  //
  const fetchStaff = async (branch) => {
    let staff = await fetchStaffFromBranch(branch);
    setAllStaff((_) => (_ = staff));
    setActiveStaff((_) => (_ = staff[0]));
  };

  //
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

  //
  const weeklyData = () => {
    console.log(staffHistory);
    setShouldDisplayLoadingAnimation(true);
    setGraphTitle("Service visualization for this week");
    let weekData = {
      Monday: 0,
      Tuesday: 0,
      Wednesday: 0,
      Thursday: 0,
      Friday: 0,
    };
    setGraphData((_) => (_ = weekData));
    staffHistory &&
      staffHistory.forEach((item) => {
        let r = new Date(
          item.date.seconds * 1000 + item.date.nanoseconds / 1e6
        );
        if (r.getMonth() >= new Date().getMonth()) {
          r = r.toLocaleDateString("en-US", { weekday: "long" });
          if (r.toLowerCase() === "sunday" || r.toLowerCase() === "saturday") {
            return;
          } else {
            weekData[r]++;
          }
        }
        setGraphData((e) => (e = weekData));
      });
    console.log(weekData);
    setTimeout(() => {
      setShouldDisplayLoadingAnimation(false);
    }, 500);
  };

  //
  const monthlyData = () => {
    setShouldDisplayLoadingAnimation(true);
    setGraphTitle("Service visualization for this month");
    staffHistory &&
      setGraphData((_) => (_ = getAllHistoryForThisMonth(staffHistory)));
    setTimeout(() => {
      setShouldDisplayLoadingAnimation(false);
    }, 500);
  };
  useEffect(() => {
    if (branchNameRef.current.value) {
      fetchStaff(branchNameRef.current.value);
    }
  }, []);

  useEffect(() => {
    activeStaff &&
      fetchStaffHistory(
        activeStaff.branch,
        activeStaff.staffId,
        activeStaff.name
      );
  }, [activeStaff]);

  useEffect(() => {
    staffHistory && weeklyData();
  }, [staffHistory]);
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
        onChange={() => {
          fetchStaff(branchNameRef.current.value);
        }}
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
          setActiveStaff(
            (_) =>
              (_ = allStaff.find((item) =>
                staffNameRef.current.value.includes(item.name)
              ))
          );
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
              <p>Average servicing time in minutes</p>
              <h1>
                {staffHistory.length > 0
                  ? `${Math.trunc((averageServicingTime / 60) * 100) / 100}`
                  : "Null"}
              </h1>
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
              <p>Overall Number of services rendered</p>
              <h1>
                {staffHistory?.length > 0 ? staffHistory?.length : "Null"}
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
              <h1>
                {
                  staffHistory.filter((item) => {
                    let r = new Date(
                      item?.date.seconds * 1000 + item.date.nanoseconds / 1e6
                    );
                    let monday = getStartOfWeek(new Date());

                    return r > monday && item;
                  }).length
                }
              </h1>
            </div>
          </div>
          <div>
            <LineGraph
              title={graphTitle}
              data={
                graphData
                  ? graphData
                  : initializeMonth(
                      new Date().getFullYear(),
                      new Date().getMonth()
                    )
              }
            />
          </div>
        </div>
      )}
      <div style={{ display: "flex" }}>
        <button onClick={weeklyData}>Data for the week</button>
        <button onClick={monthlyData}>Data for the month</button>
      </div>
    </div>
  );
}

export default StaffAnalyticsModal;
