import React from "react";
import { NavLink } from "react-router";

function BackDrop({ children }) {
  return (
    <div className="backdrop">
      <nav>
        <span className="logoText">SAnD's Smart Queue Monitoring System</span>
        <div className="navLinks">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/staff-sign-in">Staff Login</NavLink>
        </div>
      </nav>
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
}

export default BackDrop;
