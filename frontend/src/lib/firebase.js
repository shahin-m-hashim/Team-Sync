// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { initializeApp } from "firebase/app";

const appId = import.meta.env.VITE_FIREBASE_APP_ID;
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const messagingSenderId = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID;
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey,
  authDomain: "s8-main-project.firebaseapp.com",
  projectId: "s8-main-project",
  storageBucket: "s8-main-project.appspot.com",
  messagingSenderId,
  appId,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
