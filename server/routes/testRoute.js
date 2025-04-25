require("dotenv").config();
const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { getBranchInfo } = require("../config/firestoreFunctions");

module.exports = function (app) {
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json({ type: "application/json" }));
    app.use(cookieParser());

    app.get("/test", async (request, repsonse) => {
        let data = await getBranchInfo("Apex Bank ( Girne )");
        repsonse.json(data);
    })
}