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
  openQueue,
  getBranchInfo,
  getPriorityCustomers,
  setPriorityCustomersNotAvailable,
  decrementPriorityWaitingNumber,
  setCustomerServiceToHandled,
  updatePriorityQueueDetails,
  deleteAllHistory,
  closeQueue,
  setPriorityWaitTo,
  incrementServiceQueueNumber,
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
              staffType: staffDetails.staffType,
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
          let staffDetails = decoded.staffDetails;
          delete staffDetails.password;
          response.json({
            staffSignedIn: true,
            staffDetails,
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
    const {
      branch,
      service,
      customerDetails,
      handledBy,
      sessionId,
      serviceDuration,
    } = request.body;
    let sessionHistory;
    console.log("SessionId: ", sessionId);
    if (sessionId) {
      sessionHistory = await addSessionToHistory(
        branch,
        service,
        customerDetails,
        handledBy,
        serviceDuration
      );
      await setCustomerServiceToHandled(sessionId, service);
      if (customerDetails.priority == true) {
        await updatePriorityQueueDetails(branch, service);
      } else {
        await incrementServiceQueueNumber(branch, service);
      }
    } else {
      await incrementServiceQueueNumber(branch, service);
      sessionHistory = await getDailyHistory(branch, service);
    }

    let priorityCustomers = await getPriorityCustomers(branch, service);
    let waitingCustomers = await getWaitingCustomers(branch);
    let branchData = await getBranchInfo(branch);
    let serviceData = await getServiceDetails(branch, service);
    console.log(
      "Prio: ",
      priorityCustomers.length,
      " Normies: ",
      waitingCustomers.length
    );
    if (
      serviceData.priorityCustomersAvailable ||
      priorityCustomers.length > 0
    ) {
      if (serviceData.numberOfPeopleBeforeVIP > 0) {
        if (waitingCustomers.length > 0) {
          await decrementPriorityWaitingNumber(branch, service);
        } else {
          await setPriorityWaitTo(branch, service, 0);
          response.json({
            sessionHistory,
            waitingCustomers: priorityCustomers,
          });
        }
      } else {
        //send the list of people waiting in priority
        response.json({
          sessionHistory,
          waitingCustomers: priorityCustomers,
        });
      }
    } else if (!serviceData.priorityCustomersAvailable) {
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
    try {
      await closeQueue(branch, service);
      response.json("Queue Closed");
    } catch (err) {
      console.error("Error closing queue: ", err);
      response.json("Error closing queue");
    }
  });
  app.post("/staff/open-queue", async (request, response) => {
    const { branch, service } = request.body;
    try {
      await openQueue(branch, service);
      response.json("Queue Closed");
    } catch (err) {
      console.error("Error closing queue: ", err);
      response.json("Error closing queue");
    }
  });

  //
  //random route for testing
  app.get("/staff/test", async (request, response) => {
    // let data = await getWaitingCustomers("Apex Bank ( Girne )");
    // let data = await getPriorityCustomers(
    //   "Apex Bank ( Girne )",
    //   "Account and Card Issues"
    // );
    response.json(data);
  });
};
