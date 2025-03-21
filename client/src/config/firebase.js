import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDwf55nlST1f92wPWEmVEw1xdxxOq4FsjY",
  authDomain: "sqms-2db8d.firebaseapp.com",
  projectId: "sqms-2db8d",
  storageBucket: "sqms-2db8d.firebasestorage.app",
  messagingSenderId: "1021982862315",
  appId: "1:1021982862315:web:827468e367d354df7a87ae",
  measurementId: "G-KW1JTN6FWH",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
