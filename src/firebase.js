// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD_BBP0RfYHtdo23waSfQ_yFgugDT49j8s",
  authDomain: "soccrd-leaderboard.firebaseapp.com",
  projectId: "soccrd-leaderboard",
  storageBucket: "soccrd-leaderboard.firebasestorage.app",
  messagingSenderId: "1025739968554",
  appId: "1:1025739968554:web:571501481894a15b6bb353",
  measurementId: "G-JVJQBGWDJZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
