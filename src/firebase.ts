// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  // The API key is now read from the secure environment variable
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  
  // The rest of these values are not secret and are safe to keep here
  authDomain: "make-auto-13-apr.firebaseapp.com",
  projectId: "make-auto-13-apr",
  storageBucket: "make-auto-13-apr.appspot.com",
  messagingSenderId: "283509995575",
  appId: "1:283509995575:web:4c756ce7a4a2c21b6a27b2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export ONLY the Firestore database
export const db = getFirestore(app);
