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

const fetchServices = async (branch) => {
  const servicesRef = doc(db, "Organizations", "Apex Bank", "branches", branch);
  const querySnapshot = await getDoc(servicesRef);
  return querySnapshot.data().availableServices;
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

const updateServiceQueueNumber = async (branch, index) => {
  const serviceToUpdate = await getDoc(
    doc(db, "Organizations", "Apex Bank", "branches", branch)
  );
  await setDoc(
    doc(db, "Organizations", "Apex Bank", "branches", branch),
    {
      availableServices: [
        {
          serviceName: "Account and Card Issues",
          lastQueueNumber:
            serviceToUpdate.data().availableServices[index].lastQueueNumber + 1,
        },
      ],
    },
    { merge: true }
  );
  const updatedService = await getDoc(
    doc(db, "Organizations", "Apex Bank", "branches", branch)
  );
  return {
    orig: serviceToUpdate.data().availableServices[index],
    final: updatedService.data().availableServices[index],
  };
};

const createNewSession = async (customerNumber, branch, service) => {
  const newSessionId = await generateSessionId();
  const serviceToJoin = await fetchServices(branch);
  let serviceItem = serviceToJoin.find(
    (availService) => availService.serviceName === service
  );

  const indexxer = serviceToJoin.findIndex(
    (availService) => availService.serviceName === service
  );

  console.log("Indexxer: ", indexxer);

  try {
    await updateServiceQueueNumber(branch, indexxer);
    await setDoc(
      doc(db, "Organizations", "Apex Bank", "sessions", newSessionId),
      {
        branch,
        service: [serviceItem],
        customerNumber,
        sessionId: newSessionId,
        date: Timestamp.now(),
      }
    );
  } catch (error) {
    console.error(error);
  }

  return newSessionId;
};

const joinServiceQueue = async (sessionId, branch, serviceName) => {
  try {
    const queueData = await getDoc(
      doc(db, "Organizations", "Apex Bank", "branches", branch)
    );
    const queue = queueData
      .data()
      .availableServices.find((item) => item.serviceName == serviceName);
    const queueIndex = queueData
      .data()
      .availableServices.findIndex((item) => item.serviceName == serviceName);
    let sessionData = await getDoc(
      doc(db, "Organizations", "Apex Bank", "sessions", sessionId)
    );
    const sessionDoc = await setDoc(
      doc(db, "Organizations", "Apex Bank", "sessions", sessionId),
      {
        service: sessionData.data().service.push({
          serviceName,
          lastQueueNumber: queue.lastQueueNumber,
        }),
      },
      { merge: true }
    );
    await updateServiceQueueNumber(branch, queueIndex);
    sessionData = await getDoc(
      doc(db, "Organizations", "Apex Bank", "sessions", sessionId)
    );
    return sessionData;
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
};
