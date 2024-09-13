// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);