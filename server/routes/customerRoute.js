require("dotenv").config();
const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { endSession } = require("../config/firestoreFunctions");

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
};
