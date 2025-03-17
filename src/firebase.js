import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyB1ETuxDruPs5Rbd5R9QVDVBfDB0Ewn7S8",
    authDomain: "composit-certificates.firebaseapp.com",
    projectId: "composit-certificates",
    storageBucket: "composit-certificates.firebasestorage.app",
    messagingSenderId: "691905165280",
    appId: "1:691905165280:web:f0c380f430f6d013e69d85"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, doc, getDoc };
