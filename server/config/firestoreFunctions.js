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

//
//Gets Staff data from the database or returns null if not found
const getStaffData = async (staffId, password) => {
  const docRef = doc(db, "Organizations", "Apex Bank", "staff", staffId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
    if (docSnap.data().password === password) {
      return docSnap.data();
    } else {
      return null;
    }
  } else {
    return null;
  }
};

//
// Fetches all available services for a specific branch
const fetchServices = async (branch) => {
  const servicesRef = collection(
    db,
    "Organizations",
    "Apex Bank",
    "branches",
    branch,
    "availableServices"
  );
  const querySnapshot = await getDocs(servicesRef);
  let allDocs = [];
  allDocs = querySnapshot.docs.map((doc) => doc.data());
  return allDocs;
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

const testUpdate = async () => {
  await setDoc(
    doc(db, "Organizations", "Apex Bank", "branches", "Apex Bank ( Girne )"),
    {
      "availableServices[1]": {
        serviceName: "Withdrawals",
        lastQueueNumber: 200,
        serviceCurrentNumber: 130,
      },
    }
  );
};

const updateServiceQueueNumber = async (branch, service) => {
  let docReff = doc(
    db,
    "Organizations",
    "Apex Bank",
    "branches",
    branch,
    "availableServices",
    service
  );
  const serviceToUpdate = await getDoc(docReff);
  await setDoc(
    docReff,
    {
      lastQueueNumber: serviceToUpdate.data().lastQueueNumber + 1,
    },
    { merge: true }
  );
  const updatedService = await getDoc(docReff);
  return {
    orig: serviceToUpdate.data(),
    final: updatedService.data(),
  };
};

const setBranchDefaultValues = async (branch, title) => {
  const branchRef = doc(
    db,
    "Organizations",
    "Apex Bank",
    "branches",
    branch,
    "availableServices",
    title
  );
  await setDoc(branchRef, {
    serviceName: "Account and Card Issues",
    lastQueueNumber: 1,
    serviceCurrentNumber: 0,
  });

  const branchData = await getDoc(branchRef);
  return branchData.data();
};

const createNewSession = async (
  customerNumber,
  branch,
  service,
  customerDetails
) => {
  const newSessionId = await generateSessionId();
  const serviceToJoin = await fetchServices(branch);
  let serviceItem = serviceToJoin.find(
    (availService) => availService.serviceName === service
  );

  serviceItem = {
    ...serviceItem,
    ticketNumber: serviceItem.lastQueueNumber + 1,
  };

  const indexxer = serviceToJoin.findIndex(
    (availService) => availService.serviceName === service
  );

  console.log("Indexxer: ", indexxer);

  try {
    await updateServiceQueueNumber(branch, service);
    await setDoc(
      doc(db, "Organizations", "Apex Bank", "sessions", newSessionId),
      {
        branch,
        service: [serviceItem],
        customerNumber,
        sessionId: newSessionId,
        date: Timestamp.now(),
        customerDetails,
      }
    );
  } catch (error) {
    console.error(error);
  }

  return newSessionId;
};

const joinServiceQueue = async (sessionId, branch, service) => {
  try {
    const queueData = await getDoc(
      doc(
        db,
        "Organizations",
        "Apex Bank",
        "branches",
        branch,
        "availableServices",
        service
      )
    );

    let sessionData = await getDoc(
      doc(db, "Organizations", "Apex Bank", "sessions", sessionId)
    );

    let updatedService = await updateServiceQueueNumber(branch, service);
    updatedService = updatedService.final;

    let newService = sessionData.data().service;
    newService.push({
      serviceName: service,
      ticketNumber: updatedService.lastQueueNumber,
      serviceCurrentNumber: updatedService.serviceCurrentNumber,
    });

    const sessionDoc = await setDoc(
      doc(db, "Organizations", "Apex Bank", "sessions", sessionId),
      {
        service: newService,
      },
      { merge: true }
    );
    sessionData = await getDoc(
      doc(db, "Organizations", "Apex Bank", "sessions", sessionId)
    );
    console.log("Session Data: ", sessionData.data());
    return sessionData.data();
  } catch (err) {
    console.error(err);
  }
};

const getServiceDetails = async (branch, service) => {
  try {
    const serviceRef = doc(
      db,
      "Organizations",
      "Apex Bank",
      "branches",
      branch,
      "availableServices",
      service
    );
    const serviceDoc = await getDoc(serviceRef);
    return serviceDoc.data();
  } catch (err) {
    console.error(err);
  }
};

const getWaitingCustomers = async () => {
  try {
  } catch (err) {
    console.error(err);
  }
};
module.exports = {
  getCustomerData,
  fetchBranchesFromDB,
  addBranch,
  getSessions,
  generateSessionId,
  fetchServices,
  createNewSession,
  updateServiceQueueNumber,
  joinServiceQueue,
  testUpdate,
  setBranchDefaultValues,
  getStaffData,
  getServiceDetails,
};
