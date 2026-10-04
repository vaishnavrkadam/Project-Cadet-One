import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut,
  onAuthStateChanged,
  type User 
} from "firebase/auth";
import { 
  getFirestore, 
  enableIndexedDbPersistence 
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD8YHqO0wof5xBYb0esQ0OHQ_QYT96cGHo",
  authDomain: "project-cadet-one.firebaseapp.com",
  projectId: "project-cadet-one",
  storageBucket: "project-cadet-one.firebasestorage.app",
  messagingSenderId: "267727734706",
  appId: "1:267727734706:web:02dde4b8f08836412c46ab"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Enable offline persistence if supported in browser environment to minimize reads
try {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled in one tab at a time.
    } else if (err.code === 'unimplemented') {
      // The current browser does not support all of the features required to enable persistence
    }
  });
} catch {
  // Persistence already enabled or not supported in current environment
}

export { signInWithPopup, signOut, onAuthStateChanged, type User };
