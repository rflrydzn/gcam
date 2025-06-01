// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC1nqg6ycoo3ff4H2zgQEpTWrbyE_KSp2g",
  authDomain: "gcam-cf211.firebaseapp.com",
  projectId: "gcam-cf211",
  storageBucket: "gcam-cf211.firebasestorage.app",
  messagingSenderId: "629625814315",
  appId: "1:629625814315:web:78da386cd358b6e210996e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };