const {
  doc,
  getDoc,
  getDocs,
  collection,
  setDoc,
} = require("firebase/firestore");
const { db } = require("./firebase");

const getCustomerData = async (customerNumber, firstName) => {
  const docRef = doc(db, "customers", customerNumber);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    if (docSnap.data().firstName === firstName) {
      return docSnap.data();
    } else {
      return "Customer Name does not match";
    }
  } else {
    return "Customer Number does not exist!";
  }
};

const fetchBranchesFromDB = async () => {
  const docRef = await getDocs(collection(db, "branches"));
  let branches = [];
  docRef.forEach((doc) => {
    branches.push(doc.data());
  });
  return branches;
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
  let sessionData = await getDocs(collection(db, "sessions"));
  let sessions = [];
  sessionData.forEach((doc) => {
    sessions.push(doc.data());
  });
  return sessions;
};

module.exports = {
  getCustomerData,
  fetchBranchesFromDB,
  addBranch,
  getSessions,
};
