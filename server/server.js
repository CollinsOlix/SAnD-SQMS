const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const {
  getCustomerData,
  fetchBranchesFromDB,
  addBranch,
  getSessions,
} = require("./config/firestoreFunctions");
const PORT = 5000;

app.use(express.urlencoded({ extended: false }));

app.use(express.json({ type: "application/json" }));
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

const generateSessionID = () => {
  return uuidv4();
};

//Route to send customer details to
app.post("/", async (request, response) => {
  let deets = await getSessions();
  console.log(deets);
  let { customerNumber, firstName, service, customerBranchOption } =
    request.body;
  console.log(request.body);
  if (typeof firstName !== "string" || firstName.trim().length < 2) {
    response.json("Invalid Name");
  } else {
    customerNumber = `${customerNumber}`;
    const customerDetails = await getCustomerData(customerNumber, firstName);
    // const secretToken = jwt.sign(
    //   {
    //     customerNumber,
    //     sessionID: generateSessionID(),
    //     exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
    //   },
    //   process.env.JWTSECRET
    // );

    response.json(customerDetails);
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
