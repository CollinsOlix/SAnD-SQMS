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
} = require("./config/firestoreFunctions");
const PORT = 5000;

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
let trials = 0;

app.use(express.json({ type: "application/json" }));
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
      const newSessionId = await createNewSession(
        customerNumber,
        branch,
        service
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

app.get("/", (request, response) => {
  if (request.cookies?.sqms) {
    const userData = jwt.verify(request.cookies.sqms, process.env.JWTSECRET);
    response.json({
      signedIn: true,
      sessionId: userData.sessionId,
    });
  }
});

app.post("/test", (request, response) => {
  if (!request.cookies.sqms) {
    response.json("User not logged in");
  } else {
    const customerData = jwt.verify(
      request.cookies.sqms,
      process.env.JWTSECRET
    );
    console.log(customerData);
    response.json({
      sessionId: customerData.sessionId,
      signedIn: true,
    });
  }
});
app.get("/get-branches", async (request, response) => {
  const branches = await fetchBranchesFromDB();
  response.json(branches);
});

app.get("/add-branch", async (request, response) => {
  await addBranch();
  response.json("Finished");
});
app.listen(PORT, console.log("Listening on PORT ", PORT));
