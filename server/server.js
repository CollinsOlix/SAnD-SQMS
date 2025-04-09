require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const {
  getCustomerData,
  fetchBranchesFromDB,
  addBranch,
  getSessions,
  createNewSession,
  fetchServices,
  updateServiceQueueNumber,
  joinServiceQueue,
  testUpdate,
  setBranchDefaultValues,
} = require("./config/firestoreFunctions");
const PORT = 5000;

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
let trials = 0;

app.use(express.json({ type: "application/json" }));

//
//CORS policies
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

//Route to send customer details to
app.post("/", async (request, response) => {
  let { customerNumber, firstName, service, branch } = request.body;

  //
  //Check that user hasn't been trying wrong details
  //for too many times

  if (trials >= 7) {
    response.json("Too many incorrect attempts");
    return;
  }

  //
  //Confirm customer entered a valid number
  if (customerNumber.length != 5) {
    ++trials;
    response.json("Invalid First Name or Customer Number");
    return;
  }
  //
  //Confirm customer provided a proper name
  if (typeof firstName !== "string" || firstName.trim().length < 2) {
    ++trials;
    response.json("Invalid First Name or Customer Number");
  } else {
    try {
      customerNumber = `${customerNumber}`;

      const customerDetails = await getCustomerData(customerNumber, firstName);
      if (typeof customerDetails === "string") {
        response.json({
          customerDetails,
          signedIn: typeof customerDetails === "string" ? false : true,
          sessionId: newSessionId,
        });
      }
      const newSessionId = await createNewSession(
        customerNumber,
        branch,
        service,
        customerDetails
      );
      const secretToken = jwt.sign(
        {
          customerNumber,
          sessionId: newSessionId,
          customerDetails,
          service,
          branch,
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
        },
        process.env.JWTSECRET
      );
      response.cookie("sqms", secretToken, {
        maxAge: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
        httpOnly: true,
        sameSite: "strict",

        secure: true,
      });

      response.json({
        customerDetails,
        signedIn: typeof customerDetails === "string" ? false : true,
        sessionId: newSessionId,
      });
    } catch (e) {
      console.log(e);
    }
  }
});

app.get("/updateService", async (request, response) => {
  // const { index, branch } = request.query;
  // const jees = await updateServiceQueueNumber("Apex Bank ( Girne )", 0);
  response.json("Empty Route");
});

app.get("/", (request, response) => {
  if (request.cookies?.sqms) {
    const userData = jwt.verify(request.cookies.sqms, process.env.JWTSECRET);
    console.log("User Data: ", userData);
    response.json({
      signedIn: true,
      sessionId: userData.sessionId,
    });
  }
});

app.get("/user", (request, response) => {
  if (!request.cookies.sqms) {
    response.json({ signedIn: false });
  } else {
    try {
      const customerData = jwt.verify(
        request.cookies.sqms,
        process.env.JWTSECRET
      );
      response.json({
        sessionId: customerData.sessionId,
        signedIn: customerData ? true : false,
      });
    } catch (err) {
      console.error("JWT Error: ", err);
      response.clearCookie("sqms");
      response.json({
        signedIn: false,
      });
    }
  }
});

//
//Get Services route
app.post("/get-services", async (request, response) => {
  try {
    const services = await fetchServices(request.body.branch);
    console.log(services);
    response.json(services);
  } catch (err) {
    console.log(err);
    response.json("Error Fetching Services");
  }
});

//
app.get("/get-branches", async (request, response) => {
  const branches = await fetchBranchesFromDB();
  response.json(branches);
});

app.get("/add-branch", async (request, response) => {
  await addBranch();
  response.json("Finished");
});

app.post("/get-sessions", async (request, response) => {
  const { sessionId } = request.body;
  const sessions = await getSessions();
  let session = sessions.find((session) => session?.sessionId == sessionId);
  if (!session) {
    response.json("Session not found");
    return;
  }
  response.json(session);
});

//
//Join Queue request
app.post("/join-queue", async (request, response) => {
  const { sessionId, branch, service } = request.body;
  console.log("Recieving:");
  const joinQueue = await joinServiceQueue(sessionId, branch, service);
  response.json(joinQueue);
});

app.get("/test", async (request, response) => {
  await testUpdate();
  response.send("Test");
});

app.get("/set-branch", async (request, response) => {
  // let isBranchSet = await setBranchDefaultValues(
  //   "Apex Bank ( Upper Girne )",
  //   "Account and Card Issues"
  // );
  // let isBranchSet = await fetchServices("Apex Bank ( Girne )");
  let isBranchSet = await getCustomerData("11108", "Marie");
  response.send(isBranchSet);
});
app.listen(PORT, console.log("Listening on PORT ", PORT));
