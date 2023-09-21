// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA-ggRSCfib2OspLnRPjRz7sXfr6oQ6T9k",
  authDomain: "athlete-hub-88660.firebaseapp.com",
  projectId: "athlete-hub-88660",
  storageBucket: "athlete-hub-88660.appspot.com",
  messagingSenderId: "1022917209452",
  appId: "1:1022917209452:web:3ad06813267beb327cd749",
  measurementId: "G-16ZYFYTHGK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);