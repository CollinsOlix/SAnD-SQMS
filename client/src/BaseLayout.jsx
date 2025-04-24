import React, { useState } from "react";
import AppContext from "./includes/context";
import { BrowserRouter, Route, Routes } from "react-router";
import StaffSignIn from "./pages/StaffSignIn";
import AdminDashboard from "./pages/AdminDashboard";
import ServiceCenter from "./pages/ServiceCenter";
import LocalService from "./pages/LocalService";
import Afterqrcode from "./pages/QueueStatus";
import App from "./App";
import Test from "./pages/Test";

import "./index.css";
import StaffBoard from "./pages/StaffBoard";

function BaseLayout() {
  const SERVER_URL = "http://localhost:5000";
  const [customerBranchOption, setCustomerBranchOption] = useState();
  const [sessionDetails, setSessionDetails] = useState();
  const [availableServicesInBranch, setAvailableServicesInBranch] = useState();
  const [staffDetails, setStaffDetails] = useState();
  const [staffBoardDetails, setStaffBoardDetails] = useState();

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
          <Route path="/staff" element={<StaffSignIn />} />
          <Route path="/admin/:id" element={<AdminDashboard />} />
          <Route path="/sessions/:id" element={<ServiceCenter />} />
          <Route path="/staff/board" element={<StaffBoard />} />
          <Route path="/local" element={<LocalService />} />
          <Route path="/qrcode" element={<Afterqrcode />} />
          {/* <Route path="/sessions/:id" element={<OnlineServiceCenter />} /> */}
          <Route path="test" element={<Test />} />
        </Routes>
      </BrowserRouter>
    </AppContext>
  );
}

export default BaseLayout;
