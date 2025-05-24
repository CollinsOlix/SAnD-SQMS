require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require("./routes/staffRoute")(app);
require("./routes/customerRoute")(app);
require("./routes/adminRoute")(app);
require("./routes/testRoute")(app);
const {
  getCustomerData,
  fetchBranchesFromDB,
  addBranch,
  getSessions,
  createNewSession,
  fetchServices,
  joinServiceQueue,
} = require("./config/firestoreFunctions");
const PORT = 5000;

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
let trials = 0;

app.use(express.json({ type: "application/json" }));

//
//
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



//Route to send customer details to
app.post("/", async (request, response) => {
  let { customerNumber, firstName, service, branch } = request.body;

  //
  //Check that user hasn't been trying wrong details
  //for too many times

  if (trials >= 7) {
    response
      .setHeader("Access-Control-Allow-Origin", `${request.headers.origin}`)
      .json("Too many incorrect attempts");
    return;
  }

  //
  //Confirm customer entered a valid number
  if (customerNumber.length != 5) {
    ++trials;
    response
      .setHeader("Access-Control-Allow-Origin", `${request.headers.origin}`)
      .json("Invalid First Name or Customer Number");
    return;
  }
  //
  //Confirm customer provided a proper name
  if (typeof firstName !== "string" || firstName.trim().length < 2) {
    ++trials;
    response
      .setHeader("Access-Control-Allow-Origin", `${request.headers.origin}`)
      .json("Invalid First Name or Customer Number");
  } else {
    try {
      customerNumber = `${customerNumber}`;

      const customerDetails = await getCustomerData(customerNumber, firstName);
      if (typeof customerDetails === "string") {
        response
          .setHeader("Access-Control-Allow-Origin", `${request.headers.origin}`)
          .json({
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
      response
        .setHeader("Access-Control-Allow-Origin", `${request.headers.origin}`)
        .cookie("sqms", secretToken, {
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
  response
    .setHeader("Access-Control-Allow-Origin", `${request.headers.origin}`)
    .json("Empty Route");
});

app.get("/", (request, response) => {
  if (request.cookies?.sqms) {
    try {
      const userData = jwt.verify(request.cookies.sqms, process.env.JWTSECRET);
      response.json({
        signedIn: true,
        sessionId: userData.sessionId,
      });
    } catch (err) {
      response
        .setHeader("Access-Control-Allow-Origin", `${request.headers.origin}`)
        .clearCookie("sqms")
        .json({
          signedIn: false,
        });
    }
  } else {
    response
      .setHeader("Access-Control-Allow-Origin", `${request.headers.origin}`)
      .json({
        signedIn: false,
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
      response
        .setHeader("Access-Control-Allow-Origin", `${request.headers.origin}`)
        .json({
          sessionId: customerData.sessionId,
          signedIn: customerData ? true : false,
        });
    } catch (err) {
      console.error("JWT Error: ", err);
      response
        .setHeader("Access-Control-Allow-Origin", `${request.headers.origin}`)
        .clearCookie("sqms");
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
    response
      .setHeader("Access-Control-Allow-Origin", `${request.headers.origin}`)
      .json(services);
  } catch (err) {
    console.log(err);
    response
      .setHeader("Access-Control-Allow-Origin", `${request.headers.origin}`)
      .json("Error Fetching Services");
  }
});

//
app.get("/get-branches", async (request, response) => {
  const branches = await fetchBranchesFromDB();
  response
    .setHeader("Access-Control-Allow-Origin", `${request.headers.origin}`)
    .json(branches);
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
    response
      .setHeader("Access-Control-Allow-Origin", `${request.headers.origin}`)
      .json("Session not found");
    return;
  }
  response
    .setHeader("Access-Control-Allow-Origin", `${request.headers.origin}`)
    .json(session);
});

//
//Join Queue request
app.post("/join-queue", async (request, response) => {
  const { sessionId, branch, service } = request.body;
  const joinQueue = await joinServiceQueue(sessionId, branch, service);
  response
    .setHeader("Access-Control-Allow-Origin", `${request.headers.origin}`)
    .json(joinQueue);
});

// app.listen(PORT, console.log("Listening on PORT ", PORT));
module.exports = app;
