import React from "react";
import "../styles.css";

function SignInComponent({
  passwordText,
  usernameText,
  buttonText,
  headerText,
  submitForm,
}) {
  return (
    <div className="login-container">
      <h2>{headerText}</h2>

      <div className="input">
        <div>
          <label>
            <b>{usernameText} </b>
          </label>
          <input type="text" placeholder={usernameText} />
        </div>
        <div>
          <label>
            <b>{passwordText}</b>
          </label>
          <input type="text" placeholder={passwordText} />
        </div>
      </div>
      <button onClick={submitForm}>{buttonText}</button>
    </div>
  );
}

export default SignInComponent;
