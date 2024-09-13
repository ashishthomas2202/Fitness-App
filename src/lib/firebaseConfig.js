import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyCGNUevBgAEhwoZnMrLBIY6GQesXRwyRZ4",
  authDomain: "flexfit-7b489.firebaseapp.com",
  projectId: "flexfit-7b489",
  storageBucket: "flexfit-7b489.appspot.com",
  messagingSenderId: "660326188875",
  appId: "1:660326188875:web:fb1585054e4623e0900ace",
  measurementId: "G-JFL1R0KTCB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
