import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

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

export { getCustomerData };
