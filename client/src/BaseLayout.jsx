import React, { useState } from "react";
import AppContext from "./includes/context";
import { BrowserRouter, Route, Routes } from "react-router";
import StaffSignIn from "./pages/StaffSignIn";
import AdminDashboard from "./pages/AdminDashboard";
import ServiceCenter from "./pages/ServiceCenter";
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
        customerBranchOption,
        sessionDetails,
        setSessionDetails,
        setCustomerBranchOption,
        availableServicesInBranch,
        setAvailableServicesInBranch,
        staffDetails,
        setStaffDetails,
        SERVER_URL,
        staffBoardDetails,
        setStaffBoardDetails,
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/staff" element={<StaffSignIn />} />
          <Route path="/admin/:id" element={<AdminDashboard />} />
          <Route path="/sessions/:id" element={<ServiceCenter />} />
          <Route path="/staff/board" element={<StaffBoard />} />
          {/* <Route path="/sessions/:id" element={<OnlineServiceCenter />} /> */}
          <Route path="test" element={<Test />} />
        </Routes>
      </BrowserRouter>
    </AppContext>
  );
}

export default BaseLayout;
