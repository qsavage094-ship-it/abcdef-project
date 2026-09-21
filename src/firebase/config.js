import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Provided Firebase Configuration
export const firebaseConfig = {
  apiKey: "AIzaSyCMJwyZE8nD-jb7l0Do2xgcuPEtmuCv6f4",
  authDomain: "digital-agri-project.firebaseapp.com",
  projectId: "digital-agri-project",
  storageBucket: "digital-agri-project.firebasestorage.app",
  messagingSenderId: "1015462643197",
  appId: "1:1015462643197:web:ae49de61490ae0d30cc594",
  measurementId: "G-1ZX4HJX0N7"
};

// Initialize Firebase safely
let app;
let auth;
let db;
let storage;

try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  console.log("Firebase initialized successfully with project:", firebaseConfig.projectId);
} catch (error) {
  console.warn("Firebase initialization warning (running in robust offline-resilient mode):", error);
}

export { app, auth, db, storage };
