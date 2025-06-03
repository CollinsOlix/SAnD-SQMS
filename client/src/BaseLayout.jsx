import React, { useCallback, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import AdminDashboard from "./pages/AdminDashboard";
import ServiceCenter from "./pages/ServiceCenter";
import LocalService from "./pages/LocalService";
import StaffSignIn from "./pages/StaffSignIn";
import Afterqrcode from "./pages/QueueStatus";
import StaffBoard from "./pages/StaffBoard";
import AppContext from "./includes/context";
import LineGraph from "./components/LineGraph";
import Test from "./pages/Test";
import App from "./App";

import "./index.css";
import useWebSocket from "react-use-websocket";

const SERVER_URL = "http://localhost:5000";

function BaseLayout() {
  // const SERVER_URL = "https://sdnxn5zx-5000.euw.devtunnels.ms/";

  const [staffDetails, setStaffDetails] = useState();
  const [sessionDetails, setSessionDetails] = useState();
  const [staffBoardDetails, setStaffBoardDetails] = useState();
  const [customerBranchOption, setCustomerBranchOption] = useState();
  const [availableServicesInBranch, setAvailableServicesInBranch] = useState(
    new Array(0)
  );

  const [socketUrl, setSocketUrl] = useState(SERVER_URL);
  const [messageHistory, setMessageHistory] = useState([]);
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  const listenForQueueNumberUpdates = () => {};



  useEffect(() => {
    // const socket = new WebSocket(socketUrl);
  }, [customerBranchOption, staffDetails]);

  return (
    <AppContext
      value={{
        SERVER_URL,
        staffDetails,
        sessionDetails,
        setStaffDetails,
        setSessionDetails,
        staffBoardDetails,
        customerBranchOption,
        setStaffBoardDetails,
        setCustomerBranchOption,
        availableServicesInBranch,
        setAvailableServicesInBranch,
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/test" element={<Test />} />
          <Route path="/test/t" element={<LineGraph />} />
          <Route path="/staff" element={<StaffSignIn />} />
          <Route path="/local" element={<LocalService />} />
          <Route path="/qrcode" element={<Afterqrcode />} />
          <Route path="/staff/board" element={<StaffBoard />} />
          <Route path="/admin/:id" element={<AdminDashboard />} />
          <Route path="/sessions/:id" element={<ServiceCenter />} />
          {/* <Route path="/sessions/:id" element={<OnlineServiceCenter />} /> */}
        </Routes>
      </BrowserRouter>
    </AppContext>
  );
}

export default BaseLayout;
