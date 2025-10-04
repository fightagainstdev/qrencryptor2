// Firebase configuration and initialization
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyCks5vci6I6vzi1uiaBW-BPkFltXCSwOMU",
  authDomain: "qrencryptor.firebaseapp.com",
  projectId: "qrencryptor",
  storageBucket: "qrencryptor.firebasestorage.app",
  messagingSenderId: "979193624185",
  appId: "1:979193624185:web:ba20f034adf35f2a1646a8",
  measurementId: "G-SWZ1TZSVVM"
};

// Initialize Firebase only on client side
let app;
let auth;
let db;
let storage;

if (typeof window !== 'undefined') {
  // Debug: Log Firebase config
  console.log('Firebase Config:', firebaseConfig);

  // Initialize Firebase
  console.log('Initializing Firebase app');
  if (getApps().length === 0) {
    console.log('Creating new app');
    app = initializeApp(firebaseConfig);
  } else {
    console.log('App already exists');
    app = getApps()[0];
  }

  // Initialize Firebase Auth, Firestore, and Storage
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  console.log('db initialized:', db);
}

export { auth, db, storage };