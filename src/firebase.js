import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

// firebase init

const firebaseConfig = {
  apiKey: process.env.FIREBASE_KEY,
  authDomain: process.env.FIREBASE_DOMAIN,
  projectId: process.env.FIREBASE_ID,
  storageBucket: process.env.FIREBASE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGE,
  appId: process.env.FIREBASE_APPID,
  measurementId: process.env.FIREBASE_MEASUR,
};

firebase.initializeApp(firebaseConfig);

// utils
const firebaseDB = firebase.firestore();
const firebaseAuth = firebase.auth();

// collection references
const taskCollection = firebaseDB.collection("task");

// export utils/refs
export { firebaseDB, firebaseAuth, taskCollection };
