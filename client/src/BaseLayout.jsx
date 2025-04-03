import React, { useState } from "react";
import AppContext from "./includes/context";
import { BrowserRouter, Route, Routes } from "react-router";
import StaffSignIn from "./pages/StaffSignIn";
import AdminDashboard from "./pages/AdminDashboard";
import ServiceCenter from "./pages/ServiceCenter";
import App from "./App";
import Test from "./pages/Test";

import "./index.css";

function BaseLayout() {
  const [customerBranchOption, setCustomerBranchOption] = useState();
  const [sessionDetails, setSessionDetails] = useState();
  const [availableServicesInBranch, setAvailableServicesInBranch] = useState(
    []
  );

  return (
    <AppContext
      value={{
        customerBranchOption,
        setCustomerBranchOption,
        sessionDetails,
        setSessionDetails,
        availableServicesInBranch,
        setAvailableServicesInBranch,
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/staff-sign-in" element={<StaffSignIn />} />
          <Route path="/admin/:id" element={<AdminDashboard />} />
          <Route path="/sessions/:id" element={<ServiceCenter />} />
          {/* <Route path="/sessions/:id" element={<OnlineServiceCenter />} /> */}
          <Route path="test" element={<Test />} />
        </Routes>
      </BrowserRouter>
    </AppContext>
  );
}

export default BaseLayout;
