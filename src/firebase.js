// Import the necessary functions from the Firebase SDK
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
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

// Initialize Firestore
const db = getFirestore(app);

// Export the Firestore database for use in other files
export { db };
