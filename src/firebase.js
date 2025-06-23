// src/firebase.js

// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

// Your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyB6dK5gpEyDx9TgNWg4yFh9EGq3EaJieDQ",
  authDomain: "system-cd851.firebaseapp.com",
  projectId: "system-cd851",
  storageBucket: "system-cd851.firebasestorage.app",
  messagingSenderId: "289046423387",
  appId: "1:289046423387:web:522d89817d8835f7049c7e"
}

// Initialize Firebase App
const app = initializeApp(firebaseConfig)

// Initialize and export Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

export default app
