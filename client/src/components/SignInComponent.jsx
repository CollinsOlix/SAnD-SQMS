import React, { useContext, useRef } from "react";
import "../styles.css";
import AppContext from "../includes/context";
import { useNavigate } from "react-router";

function SignInComponent({
  passwordText,
  usernameText,
  buttonText,
  headerText,
}) {
  const navigate = useNavigate();
  const { SERVER_URL } = useContext(AppContext);
  const userNameRef = useRef(null);
  const passwordRef = useRef(null);
  const onSubmitForm = async () => {
    await fetch(`${SERVER_URL}/staff-sign-in`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
        staffId: userNameRef.current.value,
        password: passwordRef.current.value,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.staffSignedIn) {
          if (data.staffType === "staff") {
            navigate("/staff/board");
          } else if (data.staffType === "admin") {
            navigate(`/admin/${data.staffId}`);
          }
        } else {
          alert("Invalid Staff ID or Password");
        }
      });
  };
  return (
    <div className="login-container">
      <h2>{headerText}</h2>

      <div className="input">
        <div>
          <label>
            <b>{usernameText} </b>
          </label>
          <input ref={userNameRef} type="text" placeholder={usernameText} />
        </div>
        <div>
          <label>
            <b>{passwordText}</b>
          </label>
          <input ref={passwordRef} type="text" placeholder={passwordText} />
        </div>
      </div>
      <button onClick={onSubmitForm}>{buttonText}</button>
    </div>
  );
}

export default SignInComponent;
