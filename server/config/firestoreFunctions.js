const {
  doc,
  getDoc,
  getDocs,
  collection,
  setDoc,
  Timestamp,
} = require("firebase/firestore");
const { db } = require("./firebase");

const { v4: uuidv4 } = require("uuid");

const getCustomerData = async (customerNumber, firstName) => {
  const docRef = doc(
    db,
    "Organizations",
    "Apex Bank",
    "customers",
    customerNumber
  );
  const docSnap = await getDoc(docRef);
  console.log(customerNumber, typeof customerNumber);
  if (docSnap.exists()) {
    if (docSnap.data().firstName.toLowerCase() === firstName.toLowerCase()) {
      return docSnap.data();
    } else {
      return "Invalid First Name or Customer Name";
    }
  } else {
    return "Invalid First Name or Customer Name";
  }
};

const fetchBranchesFromDB = async () => {
  try {
    const docRef = await getDocs(
      collection(db, "Organizations", "Apex Bank", "branches")
    );
    let branches = [];
    docRef.forEach((doc) => {
      let branchData = doc.data();
      branches.push(branchData);
    });
    return branches;
  } catch (error) {
    console.error(error);
  }
};

const addBranch = async () => {
  await setDoc(doc(db, "branches", "Test Branch C"), {
    branchAdminID: 22222,
    branchID: 3,
    branchLocation: "Test Location 3",
    branchName: "Test Branch C",
    services: ["Acct", "Registratgion"],
  });
};

const getSessions = async () => {
  let sessionData = await getDocs(
    collection(db, "Organizations", "Apex Bank", "sessions")
  );
  let sessions = [];
  sessionData.forEach((doc) => {
    sessions.push(doc.data());
  });
  return sessions;
};

const generateSessionId = async () => {
  let activeSessions = await getSessions();
  const sessionIds = activeSessions.map((session) => session.sessionId);
  let newSessionId = uuidv4();
  if (sessionIds.includes(newSessionId)) {
    newSessionId = await generateSessionId();
  }

  return newSessionId;
};

const createNewSession = async (customerNumber, branch, service) => {
  const newSessionId = await generateSessionId();
  console.log(newSessionId);
  console.log({
    branch,
    service,
    customerNumber,
    date: Timestamp.now(),
  });
  try {
    await setDoc(
      doc(db, "Organizations", "Apex Bank", "sessions", newSessionId),
      {
        branch,
        service,
        customerNumber,
        date: Timestamp.now(),
      }
    );
  } catch (error) {
    console.error(error);
  }

  return newSessionId;
};

module.exports = {
  getCustomerData,
  fetchBranchesFromDB,
  addBranch,
  getSessions,
  generateSessionId,
  createNewSession,
};
