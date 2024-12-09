import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDBnBlzmFkkDKy3q-V1lkObl0Yo-G__Oz8",
  authDomain: "aice-new.firebaseapp.com",
  projectId: "aice-new",
  storageBucket: "aice-new.firebasestorage.app",
  messagingSenderId: "1051339703345",
  appId: "1:1051339703345:web:1cdb58c26fea04886e0110",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };

