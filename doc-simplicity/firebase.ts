import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDIYoa8sU5Rh9N-ABQXUszJcZpSNn3KQHU",
  authDomain: "doc-simplicity.firebaseapp.com",
  projectId: "doc-simplicity",
  storageBucket: "doc-simplicity.firebasestorage.app",
  messagingSenderId: "168978476168",
  appId: "1:168978476168:web:62fca8005ac66ed3ab033d",
  measurementId: "G-19PN9NQQST",
};

// Initialize Firebase

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
