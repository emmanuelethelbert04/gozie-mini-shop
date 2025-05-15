
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC8zvAgzz76asNW8Edpq6JI8BVZZeiZEaw",
  authDomain: "mini-store-68c3f.firebaseapp.com",
  projectId: "mini-store-68c3f",
  storageBucket: "mini-store-68c3f.firebasestorage.app",
  messagingSenderId: "809470423114",
  appId: "1:809470423114:web:a99578c025fd139dcd76b3",
  databaseURL: "https://mini-store-68c3f-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const storage = getStorage(app);

export { app, auth, database, storage };
