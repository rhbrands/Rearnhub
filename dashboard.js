import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDUuzw189X97PKegWApVMTUEY5AJC6F5r8",
  authDomain: "rearnhub.firebaseapp.com",
  projectId: "rearnhub",
  storageBucket: "rearnhub.firebasestorage.app",
  messagingSenderId: "461077159495",
  appId: "1:461077159495:web:595412074b4c28de17db62"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

console.log("Dashboard JS loaded"); // <-- check if this appears in console

// Wait for DOM to exist
document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");
  const userFullNameSpan = document.getElementById("userFullName");

  if (!logoutBtn || !userFullNameSpan) {
    console.error("Elements not found in DOM");
    return;
  }

  // Protect page
  onAuthStateChanged(auth, user => {
    if (!user) {
      window.location.href = "login.html";
    } else {
      // Use localStorage for now to display name
      userFullNameSpan.textContent = localStorage.getItem("fullName") || user.email;
    }
  });

  // Logout button
  logoutBtn.addEventListener("click", async () => {
    try {
      await signOut(auth);
      console.log("Logged out successfully");
      window.location.href = "login.html";
    } catch (err) {
      console.error("Logout failed", err);
    }
  });
});
