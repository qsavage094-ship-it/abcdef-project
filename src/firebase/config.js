import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Supported via .env (VITE_FIREBASE_*) or fallback to digital-agri-project
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCMJwyZE8nD-jb7l0Do2xgcuPEtmuCv6f4",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "digital-agri-project.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "digital-agri-project",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "digital-agri-project.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1015462643197",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1015462643197:web:ae49de61490ae0d30cc594",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-1ZX4HJX0N7"
};

// Safe initialization
let app = null;
let auth = null;
let db = null;
let storage = null;
let isFirebaseConnected = false;

try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  isFirebaseConnected = true;
  console.log("🔥 Firebase initialized successfully for project:", firebaseConfig.projectId);
} catch (error) {
  console.warn("⚠️ Firebase initialization warning (running in offline-resilient mode):", error);
}

export { app, auth, db, storage, isFirebaseConnected };
