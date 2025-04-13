require("dotenv").config();
const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {
  getStaffData,
  getServiceDetails,
} = require("../config/firestoreFunctions");

module.exports = function (app) {
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json({ type: "application/json" }));
  app.use(cookieParser());

  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );
  app.post("/staff-sign-in", async (request, response) => {
    const { staffId, password } = request.body;
    if (staffId.length < 5 || !isNaN(Number(password))) {
      response.json("Invalid Staff ID");
      return;
    } else if (typeof password !== "string" || password.trim().length < 2) {
      response.json("Invalid Password");
      return;
    } else {
      try {
        const staffDetails = await getStaffData(staffId, password);
        if (staffDetails) {
          const secretStaffToken = jwt.sign(
            {
              staffDetails,
              exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
            },
            process.env.JWTSECRET
          );
          response
            .cookie("staffToken", secretStaffToken, {
              maxAge: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
              httpOnly: true,
              sameSite: "strict",
              secure: true,
            })
            .json({
              staffSignedIn: staffDetails ? true : false,
              staffId,
            });
        } else {
          response.json({ staffSignedIn: false });
        }
      } catch (err) {
        console.log(err);
        response.json("Error");
      }
    }
  });

  app.get("/staff-sign-in", async (request, response) => {
    const token = request.cookies.staffToken;
    if (token) {
      jwt.verify(token, process.env.JWTSECRET, (err, decoded) => {
        if (err) {
          response.json({ staffSignedIn: false });
        } else {
          response.json({
            staffSignedIn: true,
            staffDetails: decoded.staffDetails,
          });
        }
      });
    } else {
      response.json({ staffSignedIn: false });
    }
  });

  app.get("/staff/logout", (request, response) => {
    console.log("Logging out");
    if (request.cookies.staffToken) {
      console.log("clearing cookie");
      response.clearCookie("staffToken").json({ staffSignedIn: false });
    } else {
      response.json({ staffSignedIn: false });
    }
  });

  app.post("/staff/get-service-details", async (request, response) => {
    console.log(request.body);
    const { branch, service } = request.body;
    let serviceDetails = await getServiceDetails(branch, service);
    response.json(serviceDetails);
  });
};
