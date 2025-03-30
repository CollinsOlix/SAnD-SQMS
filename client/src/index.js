import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter, Route, Routes } from "react-router";
import StaffSignIn from "./pages/StaffSignIn";
import AdminDashboard from "./pages/AdminDashboard";
import Test from "./pages/Test";
import OnlineServiceCenter from "./pages/onlineServiceCenter";
import ServiceCenter from "./pages/ServiceCenter";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
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
  </React.StrictMode>
);
