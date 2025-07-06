// src/firebase/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBKUKeb2NiRVIWGIrJKRkgwiIWAexTZ2GE",
  authDomain: "devboard-b72a1.firebaseapp.com",
  projectId: "devboard-b72a1",
  storageBucket: "devboard-b72a1.appspot.com",
  messagingSenderId: "468077591350",
  appId: "1:468077591350:web:17f7f29bffabda6f54d197",
  measurementId: "G-1MV8D0DG3E"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
