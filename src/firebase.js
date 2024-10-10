// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage'; // Import Storage

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAY1OHYjcnFV5ONKE91PjW_D_J6N4a_7Pc",
  authDomain: "bank-84ba3.firebaseapp.com",
  projectId: "bank-84ba3",
  storageBucket: "bank-84ba3.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Services
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app); // Initialize Storage

// Export the initialized services
export { auth, db, storage }; // Export storage along with auth and db
