// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getMessaging } from "firebase/messaging";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB_k-oPsqXrE1hE2Qm80yHT2p84TnMpwuQ",
  authDomain: "xtrack-f9f0b.firebaseapp.com",
  projectId: "xtrack-f9f0b",
  storageBucket: "xtrack-f9f0b.firebasestorage.app",
  messagingSenderId: "136590796086",
  appId: "1:136590796086:web:0824ad75fa0ac9a15b7f97",
  measurementId: "G-ZXK3LYXFFV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// const analytics = getAnalytics(app);
export const messaging = getMessaging(app);
