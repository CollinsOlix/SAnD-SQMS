require("dotenv").config();
const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {
  getStaffData,
  getServiceDetails,
  getWaitingCustomers,
  addSessionToHistory,
  getDailyHistory,
  closeQueue,
  getBranchInfo,
  getPriorityCustomers,
  setPriorityCustomersAvailable,
  decrementPriorityWaitingNumber,
  setCustomerServiceToHandled,
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
        console.error(err);
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
    if (request.cookies.staffToken) {
      response.clearCookie("staffToken").json({ staffSignedIn: false });
    } else {
      response.json({ staffSignedIn: false });
    }
  });

  app.post("/staff/get-service-details", async (request, response) => {
    const { branch, service } = request.body;
    let serviceDetails = await getServiceDetails(branch, service);
    response.json(serviceDetails);
  });

  app.post("/staff/get-waiting-customers", async (request, response) => {
    const { branch } = request.body;
    let data = await getWaitingCustomers(branch);
    response.json(data);
  });

  app.post("/staff/get-next-customer", async (request, response) => {
    const { branch, service, customerDetails, handledBy, serviceDuration } =
      request.body;
    if (customerDetails.priority == true) {
      await setCustomerServiceToHandled(sessionId);
      await updatePriorityQueueDetails();
    }

    let sessionHistory = await addSessionToHistory(
      branch,
      service,
      customerDetails,
      handledBy,
      serviceDuration
    );
    let branchData = await getBranchInfo(branch);
    let serviceData = await getServiceDetails(branch, service);
    let priorityCustomers = await getPriorityCustomers(branch, service);
    if (serviceData.priorityCustomersAvailable) {
      if (branchData.numberOfPeopleBeforeVIP > 0) {
        await decrementPriorityWaitingNumber(branch);
      } else {
        if (priorityCustomers.length > 0) {
          response.json({
            sessionHistory,
            waitingCustomers: priorityCustomers,
          });
        }
        if (priorityCustomers.length == 0) {
          await setPriorityCustomersAvailable(branch, service);
        }
      }
    } else if (!serviceData.priorityCustomersAvailable) {
      let waitingCustomers = await getWaitingCustomers(branch);
      response.json({ sessionHistory, waitingCustomers });
    }
  });

  //
  //get daily history route
  app.post("/staff/get-daily-history", async (request, response) => {
    const { branch, service } = request.body;
    let history = await getDailyHistory(branch, service);
    response.json(history);
  });

  //
  //Close Queue
  app.post("/staff/close-queue", async (request, response) => {
    const { branch, service } = request.body;
    const { branch, service } = request.body;
    try {
      await closeQueue(branch, service);
      response.json("Queue Closed");
    } catch (err) {
      console.error("Error closing queue: ", err);
      response.json("Error closing queue");
    }
  });
  });

  //
  //random route for testing
  app.get("/staff/test", async (request, response) => {
    let data = await getWaitingCustomers("Apex Bank ( Girne )");
    response.json(data);
  });
};
