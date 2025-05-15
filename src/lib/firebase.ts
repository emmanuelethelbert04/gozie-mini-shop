
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC8zvAgzz76asNW8Edpq6JI8BVZZeiZEaw",
  authDomain: "mini-store-68c3f.firebaseapp.com",
  projectId: "mini-store-68c3f",
  storageBucket: "mini-store-68c3f.firebasestorage.app",
  messagingSenderId: "809470423114",
  appId: "1:809470423114:web:a99578c025fd139dcd76b3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { app, auth, database };
