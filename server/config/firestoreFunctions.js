const {
  doc,
  getDoc,
  getDocs,
  collection,
  setDoc,
  Timestamp,
  query,
  where,
  addDoc,
  orderBy,
  updateDoc,
  deleteDoc,
} = require("firebase/firestore");
const { db } = require("./firebase");

const { v4: uuidv4 } = require("uuid");

//
//Helper function
const getToday = () => {
  let today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

//
//Firebase firestore functions
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

const getBranchInfo = async (branch) => {
  try {
    const querySnapshot = await getDoc(
      doc(db, "Organizations", "Apex Bank", "branches", branch)
    );

    return querySnapshot.data();
  } catch (err) {
    console.error("Get Customer Err: ", err);
    return null;
  }
};

//
//Gets Staff data from the database or returns null if not found
const getStaffData = async (staffId, password) => {
  const docRef = doc(db, "Organizations", "Apex Bank", "staff", staffId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
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

const getDailyHistory = async (branch, service) => {
  const historyRef = collection(
    db,
    "Organizations",
    "Apex Bank",
    "branches",
    branch,
    "history"
  );
  const q = query(
    historyRef,
    where("service", "==", service),
    where("date", ">", getToday()),
    orderBy("date", "desc")
  );
  try {
    let history = await getDocs(q)
      .then((querySnapshot) => {
        let dailyHistory = [];
        querySnapshot.forEach((doc) => {
          dailyHistory.push(doc.data());
        });
        return dailyHistory;
      })
      .catch((err) => {
        console.error(err);
        return [];
      });
    return history;
  } catch (err) {
    console.error("Daily History Error", err);
  }
};

const incrementServiceQueueNumber = async (branch, service) => {
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
      serviceCurrentNumber:
        serviceToUpdate.data().serviceCurrentNumber >=
        serviceToUpdate.data().lastQueueNumber
          ? serviceToUpdate.data().lastQueueNumber
          : serviceToUpdate.data().serviceCurrentNumber + 1,
    },
    { merge: true }
  );
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

const deleteSession = async (sessionId) => {};

const createNewSession = async (
  customerNumber,
  branch,
  service,
  customerDetails
) => {
  const branchDetails = await getBranchInfo(branch);

  const newSessionId = await generateSessionId();
  const serviceToJoin = await fetchServices(branch);
  let serviceItem = serviceToJoin.find(
    (availService) => availService.serviceName === service
  );

  console.log("Customer Type: ", customerDetails);
  //
  //Make it such that if the customer is a priority customer,
  //the session is created with a priority status
  if (branchDetails.priorityType == "Same Queue" && customerDetails.priority) {
    //
    //check if priority queue is empty
    const priorityQueueRef = doc(
      db,
      "Organizations",
      "Apex Bank",
      "branches",
      branch,
      "availableServices",
      service
    );
    const priorityQueueRequest = await getDoc(priorityQueueRef);
    const { priorityCustomersAvailable, priorityLastNumber } =
      priorityQueueRequest.data();

    serviceItem = {
      ...serviceItem,
      ticketNumber: priorityLastNumber + 1 || 1,
    };

    //
    //
    if (priorityCustomersAvailable == false) {
      //create a new session with priority status

      await setDoc(
        doc(db, "Organizations", "Apex Bank", "sessions", newSessionId),
        {
          customerDetails: { ...customerDetails, customerNumber },
          branch,
          service: { [serviceItem.serviceName]: serviceItem },
          customerNumber,
          sessionId: newSessionId,
          date: Timestamp.now(),
          priority: true,
          hasBeenHandled: false,
          ticketNumber: serviceItem.ticketNumber,
        }
      );
      await setDoc(
        priorityQueueRef,
        {
          priorityCustomersAvailable: true,
          priorityLastNumber: serviceItem.ticketNumber,
        },
        { merge: true }
      );
    } else {
      await setDoc(
        doc(db, "Organizations", "Apex Bank", "sessions", newSessionId),
        {
          customerDetails: { ...customerDetails, customerNumber },
          branch,
          service: { [serviceItem.serviceName]: serviceItem },
          customerNumber,
          sessionId: newSessionId,
          date: Timestamp.now(),
          priority: true,
          hasBeenHandled: false,
          ticketNumber: serviceItem.ticketNumber,
        }
      );
      await setDoc(
        priorityQueueRef,
        {
          priorityCustomersAvailable: true,
          priorityLastNumber: serviceItem.ticketNumber,
        },
        { merge: true }
      );
    }
  } else {
    /*
    if vip queue is empty, add customer to priority queue
    and set numberOfPeopleBeforeVIP to priorityMaxWait 
    number set by admin of the branch


  */
    serviceItem = {
      ...serviceItem,
      ticketNumber: serviceItem.lastQueueNumber + 1,
    };
    try {
      await updateServiceQueueNumber(branch, service);
      await setDoc(
        doc(db, "Organizations", "Apex Bank", "sessions", newSessionId),
        {
          branch,
          service: { [serviceItem.serviceName]: serviceItem },
          customerNumber,
          sessionId: newSessionId,
          date: Timestamp.now(),
          customerDetails,
          priority: customerDetails.priority,
        }
      );
    } catch (error) {
      console.error(error);
    }
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
    newService[service] = {
      serviceName: service,
      ticketNumber: updatedService.lastQueueNumber,
      serviceCurrentNumber: updatedService.serviceCurrentNumber,
    };

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

const getWaitingCustomers = async (branch) => {
  const q = query(
    collection(db, "Organizations", "Apex Bank", "sessions"),
    where("date", ">", getToday()),
    where("branch", "==", branch),
    where("priority", "!=", true)
  );
  try {
    const waitingCustomersRef = await getDocs(q);
    let waitingCustomers = waitingCustomersRef.docs.map((doc) => doc.data());
    console.log("before sort: ", waitingCustomers);
    waitingCustomers = [];
    waitingCustomersRef.forEach((doc) => {
      if (Object.keys(doc.data().service).length > 0)
        waitingCustomers.push(doc.data());
    });
    console.log(waitingCustomers);
    return waitingCustomers;
  } catch (err) {
    console.error(err);
    return null;
  }
};

const decrementPriorityWaitingNumber = async (branch) => {
  const branchRef = doc(db, "Organizations", "Apex Bank", "branches", branch);
  try {
    const branchDeets = await getDoc(branchRef);
    const vipWaitingNumber = branchDeets.data().numberOfPeopleBeforeVIP;
    if (vipWaitingNumber > 0) {
      await updateDoc(
        branchRef,
        {
          numberOfPeopleBeforeVIP: vipWaitingNumber - 1,
        },
        { merge: true }
      );
    }
  } catch (err) {
    console.error("Error Decrementing waiting number: ", err);
  }
};

const addSessionToHistory = async (
  branch,
  service,
  customerDetails,
  handledBy,
  serviceDuration
) => {
  const historyRef = collection(
    db,
    "Organizations",
    "Apex Bank",
    "branches",
    branch,
    "history"
  );
  try {
    await addDoc(historyRef, {
      branch,
      service,
      customerDetails,
      handledBy,
      serviceDuration,
      date: Timestamp.now(),
    });

    await incrementServiceQueueNumber(branch, service);
    let history = await getDailyHistory(branch, service);
    return history;
  } catch (err) {
    console.error("Add Error: ", err);
    return null;
  }
};

const closeQueue = async (branch, service) => {
  const queueRef = doc(
    db,
    "Organizations",
    "Apex Bank",
    "branches",
    branch,
    "availableServices",
    service
  );
  try {
    await updateDoc(
      queueRef,
      { status: "closed", serviceCurrentNumber: 0 },
      { merge: true }
    );
  } catch (err) {
    console.error("Error closing queue: ", err);
  }
};

const endSession = async (id) => {
  const sessionRef = doc(db, "Organizations", "Apex Bank", "sessions", id);
  try {
    await deleteDoc(sessionRef);
    return true;
  } catch (err) {
    console.error("Error ending session: ", err);
    return false;
  }
};

const getPriorityCustomers = async (branch, service) => {
  const priorityRef = collection(db, "Organizations", "Apex Bank", "sessions");
  const q = query(
    priorityRef,
    where("branch", "==", branch),
    where("priority", "==", true),
    // where("hasBeenHandled", "==", false),
    orderBy("date")
  );
  try {
    const priorityCustomers = await getDocs(q);

    let priorityCustomerArray = [];
    priorityCustomers.forEach((doc) => {
      if (doc.data().service[service]) {
        priorityCustomerArray.push(doc.data());
      }
    });
    if (!priorityCustomerArray.length > 0)
      setPriorityCustomersNotAvailable(branch, service);
    return priorityCustomerArray;
  } catch (err) {
    console.error("Error getting priority customers: ", err);
    return [];
  }
};

const setPriorityCustomersNotAvailable = async (branch, service) => {
  const branchRef = doc(db, "Organizations", "Apex Bank", "branches", branch);
  const serviceRef = doc(
    db,
    "Organizations",
    "Apex Bank",
    "branches",
    branch,
    "availableServices",
    service
  );
  let branchDetails = await getDoc(branchRef);
  try {
    await setDoc(
      branchRef,
      { numberOfPeopleBeforeVIP: branchDetails.data().priorityMaxWait },
      { merge: true }
    );
    await setDoc(
      serviceRef,
      {
        priorityCustomersAvailable: false, // Set to false to indicate that priority customers are not available
      },
      { merge: true }
    );
  } catch (err) {
    console.error("Error setting priority customers available: ", err);
  }
};

const setCustomerServiceToHandled = async (sessionId, service) => {
  const sessionRef = doc(
    db,
    "Organizations",
    "Apex Bank",
    "sessions",
    sessionId
  );
  const sessionDeets = await getDoc(sessionRef);
  let oldService = sessionDeets.data().service;
  delete oldService[service];
  try {
    await updateDoc(
      sessionRef,
      {
        service: oldService,
      },
      { merge: true }
    );
  } catch (err) {
    console.error("Error setting customer service to handled: ", err);
  }
};

const updatePriorityQueueDetails = async (branch, service) => {
  const serviceRef = doc(
    db,
    "Organizations",
    "Apex Bank",
    "branches",
    branch,
    "availableServices",
    service
  );
  const serviceDeets = await getDoc(serviceRef);

  await setDoc(
    serviceRef,
    {
      priorityCurrentNumber:
        serviceDeets.data().priorityCurrentNumber + 1 >
        serviceDeets.data().priorityLastNumber
          ? serviceDeets.data().priorityLastNumber
          : serviceDeets.data().priorityCurrentNumber + 1,
    },
    { merge: true }
  );
};

const deleteAllHistory = async (branch) => {
  let historyRef = await getDocs(
    collection(db, "Organizations", "Apex Bank", "branches", branch, "history")
  );
  let historyDocs = [];
  historyRef.forEach((doc) => historyDocs.push(doc.id));
  let i = 0;
  let deleteFunc = async () => {
    if (i < historyDocs.length) {
      let hh = doc(
        db,
        "Organizations",
        "Apex Bank",
        "branches",
        branch,
        "history",
        historyDocs[i]
      );
      await deleteDoc(hh);
      i++;
      await deleteFunc();
    }
  };

  await deleteFunc();
  return historyDocs;
};
module.exports = {
  addBranch,
  testUpdate,
  closeQueue,
  endSession,
  getSessions,
  getStaffData,
  getBranchInfo,
  fetchServices,
  getCustomerData,
  getDailyHistory,
  deleteAllHistory,
  joinServiceQueue,
  createNewSession,
  getServiceDetails,
  generateSessionId,
  getWaitingCustomers,
  fetchBranchesFromDB,
  addSessionToHistory,
  getPriorityCustomers,
  setBranchDefaultValues,
  updateServiceQueueNumber,
  updatePriorityQueueDetails,
  setCustomerServiceToHandled,
  setPriorityCustomersNotAvailable,
  decrementPriorityWaitingNumber,
};
