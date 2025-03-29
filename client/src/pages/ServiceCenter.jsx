import React, { useLayoutEffect } from "react";
import BackDrop from "../components/BackDrop";
import { useNavigate } from "react-router";

function ServiceCenter() {
  const navigate = useNavigate();
  const testRequest = async () => {
    await fetch("http://localhost:5000/test", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (typeof data === "string") {
          navigate("/");
        }
      });
  };
  useLayoutEffect(() => {
    testRequest();
  }, []);
  return (
    <BackDrop>
      <p>Sessions</p>
    </BackDrop>
  );
}

export default ServiceCenter;
