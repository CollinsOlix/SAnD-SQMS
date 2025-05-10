import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router";
import AppContext from "../includes/context";

function BackDrop({ children, showNavTabs }) {
  const { staffDetails, SERVER_URL } = useContext(AppContext);
  const navigate = useNavigate();

  const logOut = async () => {
    try {
      await fetch(`${SERVER_URL}/staff/logout`, {
        method: "GET",
        credentials: "include",
      }).then(() => {
        navigate("/staff");
      });
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  return (
    <div className="backdrop">
      <nav>
        <span className="logoText">SAnD's Smart Queue Monitoring System</span>
        {showNavTabs && (
          <div className="navLinks">
            <NavLink to="/">Home</NavLink>
            {staffDetails ? (
              <button style={{ display: "inline" }} onClick={logOut}>
                Log Out
              </button>
            ) : (
              <NavLink to="/staff">Staff Login</NavLink>
            )}
          </div>
        )}
      </nav>
      <div
        style={{
          flex: 1,
          maxHeight: "100%",
          overflow: "hidden",
          paddingTop: "10px",
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default BackDrop;
