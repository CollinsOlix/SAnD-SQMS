require("dotenv").config();
const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {
  createNewService,
  deleteService,
  fetchBranchAnalytics,
  getStaffFromBranch,
  getAllTransactionsByStaff,
  getServiceAnalytics,
  initializeService,
  initializeBranch,
} = require("../config/firestoreFunctions");

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

  app.post("/admin/new-service", async (request, response) => {
    const { branch, service } = request.body;
    console.log(branch, service);
    const serviceAdded = await createNewService(branch, service);
    response.json(serviceAdded);
  });
  app.post("/admin/remove-service", async (request, response) => {
    const { branch, service } = request.body;
    console.log("B: ", branch, service);
    const serviceAdded = await deleteService(branch, service);
    response.json(serviceAdded);
  });

  app.get("/admin/staff", async (request, response) => {
    let today = new Date();
    let dateFromTwoWeeksAgo = new Date(
      today.getTime() - 14 * 24 * 60 * 60 * 1000
    );
    //get date from exactly two weeks ago in js?
    // const staff = await fetchBranchAnalytics(
    //   "Apex Bank ( Girne )",
    //   "Account and Card Issues"
    // );
    initializeBranch("Apex Bank ( Girne )");
    await initializeService("Apex Bank ( Girne )", "Personal Operations");
    await initializeService("Apex Bank ( Girne )", "Foreign Transactions");
    await initializeService("Apex Bank ( Girne )", "Withdrawals");
    // const staff = await getServiceAnalytics(
    //   "Apex Bank ( Upper Girne )",
    //   "Account and Card Issues"
    // );
    // response.json(staff);
    response.json([]);
  });
  app.post("/admin/analytics/branch", async (request, response) => {
    const { branch } = request.body;
    let today = new Date();
    let dateFromTwoWeeksAgo = new Date(
      today.getTime() - 14 * 24 * 60 * 60 * 1000
    );
    //get date from exactly two weeks ago in js?
    const data = await fetchBranchAnalytics(branch);
    response.json(data);
  });

  app.post("/admin/fetch-staff", async (request, response) => {
    const { branch } = request.body;
    let staff = await getStaffFromBranch(branch);
    response.json(staff);
  });
  app.post("/admin/history", async (request, response) => {
    const { branch, id, name } = request.body;
    const staffHistory = await getAllTransactionsByStaff(branch, id, name);
    response.json(staffHistory);
  });

  app.post("/admin/service-analytics", async (request, response) => {
    const { branch, service } = request.body;
    const data = await getServiceAnalytics(branch, service);
    response.json(data);
  });
};
