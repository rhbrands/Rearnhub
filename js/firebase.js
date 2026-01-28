// Firebase configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDUuzw189X97PKegWApVMTUEY5AJC6F5r8",
  authDomain: "rearnhub.firebaseapp.com",
  projectId: "rearnhub",
  storageBucket: "rearnhub.firebasestorage.app",
  messagingSenderId: "461077159495",
  appId: "1:461077159495:web:595412074b4c28de17db62"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
