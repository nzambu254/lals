// src/firebase.js

// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

// Your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyC8Ly0TLO4y1d1QgSABOPkr1HEqSZKC2B4",
  authDomain: "primeno-696eb.firebaseapp.com",
  projectId: "primeno-696eb",
  storageBucket: "primeno-696eb.appspot.com",
  messagingSenderId: "446781126402",
  appId: "1:446781126402:web:e24546afe884fe7ab5b41b"
}

// Initialize Firebase App
const app = initializeApp(firebaseConfig)

// Initialize and export Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

export default app
