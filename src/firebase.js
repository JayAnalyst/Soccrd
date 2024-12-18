// src/firebase.js
import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD_BBP0RfYHtdo23waSfQ_yFgugDT49j8s",
  authDomain: "soccrd-leaderboard.firebaseapp.com",
  projectId: "soccrd-leaderboard",
  storageBucket: "soccrd-leaderboard.firebasestorage.app",
  messagingSenderId: "1025739968554",
  appId: "1:1025739968554:web:571501481894a15b6bb353",
  measurementId: "G-JVJQBGWDJZ"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

export { db };
