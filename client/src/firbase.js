// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "kumar-estate.firebaseapp.com",
  projectId: "kumar-estate",
  storageBucket: "kumar-estate.appspot.com",
  messagingSenderId: "1000206663331",
  appId: "1:1000206663331:web:ec316157ed496a88530916"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);