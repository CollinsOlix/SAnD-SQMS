require("dotenv").config();
const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { endSession, fetchWaitTime } = require("../config/firestoreFunctions");

module.exports = function (app) {
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json({ type: "application/json" }));
  app.use(cookieParser());
  var whitelist = [
    "http://localhost:3000",
    "https://sdnxn5zx-3000.euw.devtunnels.ms", // Ensure this matches the exact URL in the request headers
  ];
  var corsOptions = {
    origin: function (origin, callback) {
      // console.log("Origin: ", origin); // Debug log
      if (!origin || whitelist.includes(origin)) {
        callback(null, true); // Allow requests from whitelist or no origin (e.g., server-side proxy)
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    headers: ["Content-Type", "Authorization"],
    maxAge: 84600,
  };
  app.use(cors(corsOptions));

  app.post("/:id/end-session", async (request, response) => {
    let isSuccessful = await endSession(request.body.id);
    if (isSuccessful) {
      if (request.cookies.sqms) response.clearCookie("sqms");
    }
    response.json(isSuccessful);
  });
  app.get("/:id/end-session", async (request, response) => {
    let isSuccessful = await endSession(request.params.id);
    if (isSuccessful) {
      if (request.cookies.sqms) response.clearCookie("sqms");
    }
    response.json(isSuccessful);
  });
  app.post("/service/service-time", async (request, response) => {
    const { branch, service } = request.body;
    await fetchWaitTime(branch, service);
  });
};
