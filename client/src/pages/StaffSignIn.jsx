import React from "react";
import BackDrop from "../components/BackDrop";
import SignInComponent from "../components/SignInComponent";
import "../styles/staffSignIn.css";

function StaffSignIn() {
  return (
    <BackDrop>
      <div style={{ display: "flex", flexDirection: "row", flex: 1 }}>
        <div
          className="staffSignInContainer"
          style={{
            backgroundColor: "#fff",
          }}
        ></div>
        <div className="staffSignInContainer">
          <SignInComponent
            headerText={"Sign in as a Staff"}
            buttonText="Staff Sign In"
            usernameText="Staff ID Number"
            passwordText="Password"
          />
        </div>
      </div>
    </BackDrop>
  );
}

export default StaffSignIn;
