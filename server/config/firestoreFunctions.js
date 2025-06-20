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
  onSnapshot,
} = require("firebase/firestore");
const { db } = require("./firebase");

const { v4: uuidv4 } = require("uuid");
const emailjs = require("@emailjs/nodejs");

//
//Helper function
const getToday = () => {
  let today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

function getStartOfWeek(inputDate) {
  const date = new Date(inputDate);

  // Get day of the week (0 - Sunday, 1 - Monday, ..., 6 - Saturday)
  const day = date.getDay();

  // Calculate how many days to subtract to get Monday
  // If Sunday (0), shift back 6 days, else shift back (day - 1) days
  const diff = day === 0 ? -6 : 1 - day;

  // Create new date for Monday
  const monday = new Date(date);
  monday.setDate(date.getDate() + diff);

  // Reset time to midnight
  monday.setHours(0, 0, 0, 0);

  return monday;
}
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
    console.error("Get Customer Err:\n", err);
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

const addBranch = async () => {};

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

  //if there are more than 10 people in the queue
  if (
    serviceToUpdate.data().lastQueueNumber -
      serviceToUpdate.data().serviceCurrentNumber >
    2
  ) {
    //find the person who's ticket number is 10 numbers ahead of the current number
    //and send them a notification

    let customerRef = query(
      collection(db, "Organizations", "Apex Bank", "sessions"),
      where("branch", "==", branch),
      where(
        `service.${service}.ticketNumber`,
        "==",
        serviceToUpdate.data().serviceCurrentNumber + 2
      )
    );
    const customerDoc = await getDocs(customerRef);
    customerRef = [];
    customerDoc.forEach((doc) => customerRef.push(doc.data()));

    //send a notification to the customer

    var templateParams = {
      title: "Less than 10 people left",
      email: customerRef[0].customerDetails.email,
    };

    emailjs
      .send("service_7zxm5j5", "template_bbzxxam", templateParams, {
        publicKey: "j5SRNJSTwRYZhM0i6",
      })
      .then(
        function (response) {
          console.log("SUCCESS!", response.status, response.text);
        },
        function (err) {
          console.log("FAILED...", err);
        }
      );
  }
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
  const serviceRef = doc(
    db,
    "Organizations",
    "Apex Bank",
    "branches",
    branch,
    "availableServices",
    title
  );
  await setDoc(
    serviceRef,
    {
      serviceName: "Account and Card Issues",
      lastQueueNumber: 0,
      serviceCurrentNumber: 0,
    },
    { merge: true }
  );

  const branchData = await getDoc(serviceRef);
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

  //
  //Make it such that if the customer is a priority customer,
  //the session is created with a priority status

  ///

  //**

  ///

  if (customerDetails.priority) {
    if (branchDetails.priorityType == "Same Queue") {
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
      //If there are priority customers available
      if (priorityCustomersAvailable === false) {
        //create a new session with priority status

        //
        //set the priority customers available flag to true and increment the last number on the queue
        await setDoc(
          priorityQueueRef,
          {
            priorityCustomersAvailable: true,
            priorityLastNumber: serviceItem.ticketNumber,
          },
          { merge: true }
        );

        //
        //create a new session for the user, with priority set to true
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
            priorityScheme: branchDetails.priorityType,
          }
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
            priorityScheme: branchDetails.priorityType,
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
    }

    if (branchDetails.priorityType === "Special Queue") {
      // Add customer to special queue
      try {
        const servicesRef = doc(
          db,
          "Organizations",
          "Apex Bank",
          "branches",
          branch,
          "availableServices",
          service
        );
        const serviceQueue = await getDoc(servicesRef);
        if (serviceQueue.exists()) {
          const serviceItem = serviceQueue.data();

          await setDoc(
            servicesRef,
            {
              priorityCustomersAvailable: true,
              specialQueueLastNumber:
                serviceItem.specialQueueLastNumber + 1 || 1,
              specialQueueCurrentNumber:
                serviceItem.specialQueueCurrentNumber + 1 || 1,
            },
            { merge: true }
          );

          await setDoc(
            doc(db, "Organizations", "Apex Bank", "sessions", newSessionId),
            {
              customerDetails: { ...customerDetails, customerNumber },
              branch,
              service: {
                [serviceItem.serviceName]: {
                  ...serviceItem,
                  ticketNumber: serviceItem.specialQueueLastNumber + 1 || 1,
                },
              },
              customerNumber,
              sessionId: newSessionId,
              date: Timestamp.now(),
              priority: true,
              hasBeenHandled: false,
              priorityScheme: branchDetails.priorityType,
            }
          );
        }
      } catch (err) {
        console.error("Error with special queue: ", err);
      }
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
          priorityScheme: branchDetails.priorityType,
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
    waitingCustomers = [];
    waitingCustomersRef.forEach((doc) => {
      if (Object.keys(doc.data().service).length > 0)
        waitingCustomers.push(doc.data());
    });
    return waitingCustomers;
  } catch (err) {
    console.error("error getting waiting customers: ", err);
    return null;
  }
};

const decrementPriorityWaitingNumber = async (branch, service) => {
  const serviceRef = doc(
    db,
    "Organizations",
    "Apex Bank",
    "branches",
    branch,
    "availableServices",
    service
  );
  try {
    const serviceDeets = await getDoc(serviceRef);
    const vipWaitingNumber = serviceDeets.data().numberOfPeopleBeforeVIP;
    if (vipWaitingNumber > 0) {
      await updateDoc(
        serviceRef,
        {
          numberOfPeopleBeforeVIP: vipWaitingNumber - 1,
        },
        { merge: true }
      );
    }
  } catch (err) {
    console.error("Error Decrementing waiting number:\n", err);
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

    let history = await getDailyHistory(branch, service);
    return history;
  } catch (err) {
    console.error("Add Error:\n", err);
    return null;
  }
};

const createNewService = async (branch, service) => {
  const servicesRef = doc(
    db,
    "Organizations",
    "Apex Bank",
    "branches",
    branch,
    "availableServices",
    service
  );
  try {
    let docExists = await getDoc(servicesRef);
    if (docExists.exists()) {
      return "This Service already exists";
    } else {
      await initializeService(branch, service);
      return "Service Created Successfully";
    }
  } catch (err) {
    console.error("Error creating service:\n", err);
    return "Error creating service";
  }
};
const deleteService = async (branch, service) => {
  const servicesRef = doc(
    db,
    "Organizations",
    "Apex Bank",
    "branches",
    branch,
    "availableServices",
    service
  );
  try {
    let docExists = await getDoc(servicesRef);
    if (docExists.exists()) {
      await deleteDoc(servicesRef);
      return "Service Deleted Successfully";
    } else {
      return "Service Does Not Exist";
    }
  } catch (err) {
    console.error("Error Deleting Service:\n", err);
    return "Error Deleting Service";
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
      { status: "closed", closingDate: Timestamp.now() },
      { merge: true }
    );
  } catch (err) {
    console.error("Error closing queue:\n", err);
  }
};
const openQueue = async (branch, service) => {
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
    let queueDoc = await getDoc(queueRef);
    const { seconds, nanoseconds } = queueDoc.data().closingDate;
    if (
      new Date(seconds * 1000 + nanoseconds / 1e6).getDate() <
      new Date().getDate()
    ) {
      initializeService(branch, service);
    }
    await updateDoc(queueRef, { status: "open" }, { merge: true });
  } catch (err) {
    console.error("Error closing queue:\n", err);
  }
};

const endSession = async (id) => {
  const sessionRef = doc(db, "Organizations", "Apex Bank", "sessions", id);
  try {
    await deleteDoc(sessionRef);
    return true;
  } catch (err) {
    console.error("Error ending session:\n", err);
    return false;
  }
};

const getPriorityCustomers = async (branch, service) => {
  let priorityCustomerArray = [];
  const branchRef = doc(db, "Organizations", "Apex Bank", "branches", branch);
  let branchDetails = await getDoc(branchRef);
  const priorityRef = collection(db, "Organizations", "Apex Bank", "sessions");
  const q = query(
    priorityRef,
    where("branch", "==", branch),
    where("priority", "==", true),
    where("date", ">", getToday()),
    // where("hasBeenHandled", "==", false),
    orderBy("date")
  );
  const priorityCustomers = await getDocs(q);
  if (branchDetails.data().priorityType !== "Same Queue") {
    priorityCustomers.forEach((doc) => {
      if (doc.data().service) {
        priorityCustomerArray.push(doc.data());
      }
    });
  } else {
    try {
      priorityCustomers.forEach((doc) => {
        if (doc.data().service[service]) {
          priorityCustomerArray.push(doc.data());
        }
      });
    } catch (err) {
      console.error("Error getting priority customers:\n", err);
    }
  }
  if (!priorityCustomerArray.length > 0)
    setPriorityCustomersNotAvailable(branch, service);
  return priorityCustomerArray;
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
      serviceRef,
      {
        numberOfPeopleBeforeVIP: branchDetails.data().priorityMaxWait || 3,
        priorityCustomersAvailable: false, // Set to false to indicate that priority customers are not available
      },
      { merge: true }
    );
  } catch (err) {
    console.error("Error setting priority customers available:\n", err);
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
    console.error("Error setting customer service to handled:\n", err);
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

const setPriorityWaitTo = async (branch, service, to) => {
  const serviceRef = doc(
    db,
    "Organizations",
    "Apex Bank",
    "branches",
    branch,
    "availableServices",
    service
  );
  await setDoc(serviceRef, { numberOfPeopleBeforeVIP: to }, { merge: true });
};

const initializeBranch = async (branch) => {
  const branchRef = doc(db, "Organizations", "Apex Bank", "branches", branch);
  await setDoc(
    branchRef,
    {
      branchName: branch,
      priorityType: "Same Queue",
      priorityMaxWait: 3,
    },
    { merge: true }
  );
};
const initializeNewBranch = async (branch, location) => {
  const branchRef = doc(
    db,
    "Organizations",
    "Apex Bank",
    "branches",
    `${branch} ( ${location} )`
  );
  try {
    let branchDoc = await getDoc(branchRef);
    if (branchDoc.exists()) {
      return "Branch already exists";
    } else {
      await setDoc(branchRef, {
        branchName: `${branch} ( ${location} )`,
        location: location,
        priorityType: "Same Queue",
        priorityMaxWait: 3,
      });

      await initializeService(
        `${branch} ( ${location} )`,
        "Account and Card Issues"
      );
      await initializeService(
        `${branch} ( ${location} )`,
        "Personal Operations"
      );
      return "Branch Created Successfully";
    }
  } catch (err) {
    console.error("Error initializing new branch:\n", err);
    return "Error initializing new branch";
  }
};
const initializeService = async (branch, service) => {
  const servicesRef = doc(
    db,
    "Organizations",
    "Apex Bank",
    "branches",
    branch,
    "availableServices",
    service
  );
  await setDoc(
    servicesRef,
    {
      serviceName: service,
      lastQueueNumber: 0,
      priorityCurrentNumber: 0,
      priorityCustomersAvailable: true,
      priorityLastNumber: 0,
      serviceCurrentNumber: 1,
      numberOfPeopleBeforeVIP: 3,
      specialQueueCurrentNumber: 0,
      specialQueueLastNumber: 1,
      status: "open",
      closingDate: Timestamp.now(),
    },
    { merge: true }
  );
};

const getStaffInBranch = async (branch) => {
  const staffRef = collection(db, "Organizations", "Apex Bank", "staff");
  const staffQuery = query(staffRef, where("branch", "==", branch));
  let allDocs = [];

  try {
    let staff = await getDocs(staffQuery);
    allDocs = staff.docs.map((doc) => doc.data());
    allDocs.forEach((doc) => {
      doc.password = "***";
    });
    return allDocs;
  } catch (err) {
    console.error("Error Getting Staff in Branch:\n", err);
  }
};

const getHistory = async (branch, date1 = new Date()) => {
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
    where("date", ">=", getStartOfWeek(date1)),
    where("date", "<=", date1)
  );
  //get date of the starting day of this week in js?
  let allDocs = [];
  try {
    const historySnapshot = await getDocs(q);
    allDocs = historySnapshot.docs.map((doc) => doc.data());
    return allDocs;
  } catch (err) {
    console.error("Error getting history:\n", err);
    return allDocs;
  }
};

const fetchBranchAnalytics = async (branch, date1) => {
  try {
    let staff = await getStaffInBranch(branch);
    // await initializeBranch(branch);
    // await initializeService(branch, service);
    let services = await fetchServices(branch);
    let history = await getHistory(branch, date1);
    return { staff, services, history };
  } catch (err) {
    console.error("Error fetching branch analytics:\n", err);
    return null;
  }
};

const getStaffFromBranch = async (branch) => {
  const staffRef = collection(db, "Organizations", "Apex Bank", "staff");
  let snapShot = await getDocs(query(staffRef, where("branch", "==", branch)));
  let allDocs = [];
  snapShot.forEach((doc) => allDocs.push({ ...doc.data(), password: "***" }));
  return allDocs;
};

const getAllTransactionsByStaff = async (branch, id, name) => {
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
    where("handledBy.staffId", "==", id),
    where("handledBy.staffName", "==", name)
  );
  let historyDocs = await getDocs(q);

  let allDocs = [];
  historyDocs.forEach((doc) => {
    allDocs.push(doc.data());
  });

  return allDocs;
};

const getServiceAnalytics = async (branch, service) => {
  const historyRef = collection(
    db,
    "Organizations",
    "Apex Bank",
    "branches",
    branch,
    "history"
  );
  let thisMonth = new Date().setDate(1);
  let q = query(
    historyRef,
    where("service", "==", service),
    where("date", ">=", new Date(thisMonth))
  );
  let historyDocs = await getDocs(q);
  q = [];
  historyDocs.forEach((doc) => q.push(doc.data()));

  let staffRef = collection(db, "Organizations", "Apex Bank", "staff");
  let staffDocs = await getDocs(
    query(
      staffRef,
      where("assignedTo", "==", service),
      where("branch", "==", branch)
    )
  );
  let staff = [];
  staffDocs.forEach((doc) => staff.push(doc.data()));

  return { serviceHistory: q, staff };
};

const getRealTimeQueueData = (branch) => {
  console.log("branch", branch);
  let queueData = [];
  try {
    onSnapshot(
      query(
        collection(db, "Organizations", "Apex Bank", "sessions"),
        where("branch", "==", branch)
      ),
      (querySnapshot) => {
        querySnapshot.forEach((doc) => queueData.push(doc.data()));
      }
    );
  } catch (err) {
    console.log("Error fetching r/time queue updates: ", err);
  }
  return queueData;
};

const fetchWaitTime = async (branch, service) => {
  let allDocs = [];
  const serviceRef = collection(
    db,
    "Organizations",
    "Apex Bank",
    "branches",
    branch,
    "history"
  );
  const q = query(
    serviceRef,
    where("service", "==", service),
    where("date", ">=", getToday())
  );
  const historyDocs = await getDocs(q);
  historyDocs.forEach((doc) => allDocs.push(doc.data()));
  let waitTime = 0;
  if (allDocs.length > 0) {
    allDocs.forEach((doc) => (waitTime += doc.serviceDuration));
    waitTime = waitTime / allDocs.length; // Average wait time
  } else {
    waitTime = 0;
  }
  return waitTime;
};

const setBranchPriorityScheme = async (branch, scheme, waitNumber) => {
  const branchRef = doc(db, "Organizations", "Apex Bank", "branches", branch);
  try {
    await setDoc(
      branchRef,
      {
        priorityType: scheme,
        priorityMaxWait: waitNumber,
      },
      { merge: true }
    );
    return true;
  } catch (err) {
    console.error("Error setting branch priority scheme: ", err);
    return false;
  }
};

module.exports = {
  addBranch,
  openQueue,
  closeQueue,
  endSession,
  getSessions,
  getStaffData,
  deleteService,
  getBranchInfo,
  fetchServices,
  fetchWaitTime,
  getCustomerData,
  getDailyHistory,
  createNewService,
  deleteAllHistory,
  joinServiceQueue,
  initializeBranch,
  createNewSession,
  generateSessionId,
  setPriorityWaitTo,
  getServiceDetails,
  initializeService,
  getStaffFromBranch,
  initializeNewBranch,
  getServiceAnalytics,
  getWaitingCustomers,
  fetchBranchesFromDB,
  addSessionToHistory,
  getRealTimeQueueData,
  fetchBranchAnalytics,
  getPriorityCustomers,
  setBranchDefaultValues,
  setBranchPriorityScheme,
  updateServiceQueueNumber,
  getAllTransactionsByStaff,
  updatePriorityQueueDetails,
  incrementServiceQueueNumber,
  setCustomerServiceToHandled,
  decrementPriorityWaitingNumber,
  setPriorityCustomersNotAvailable,
};
