// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB_KbFNKPKb8Zu4lKWDVWtak41-lzGbPL8",
  authDomain: "taskmanager-85878.firebaseapp.com",
  projectId: "taskmanager-85878",
  storageBucket: "taskmanager-85878.appspot.com",
  messagingSenderId: "984857274141",
  appId: "1:984857274141:web:75651cfc456839b52923f4",
  measurementId: "G-19QBJH83ND"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
// export const analytics = getAnalytics(app);