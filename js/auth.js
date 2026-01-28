// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

// 🔹 Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDUuzw189X97PKegWApVMTUEY5AJC6F5r8",
  authDomain: "rearnhub.firebaseapp.com",
  projectId: "rearnhub",
  storageBucket: "rearnhub.firebasestorage.app",
  messagingSenderId: "461077159495",
  appId: "1:461077159495:web:595412074b4c28de17db62",
  measurementId: "G-YLCZ0TLE7G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

// 🔹 Logout button
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    try {
      await signOut(auth); // Sign out user
      window.location.href = "login.html"; // Redirect to login
    } catch (error) {
      alert("Error logging out: " + error.message);
    }
  });
}

// 🔹 Check auth state on dashboard
onAuthStateChanged(auth, async user => {
  if (!user) {
    // Redirect to login if not logged in
    window.location.href = "login.html";
    return;
  }

  // Load user data
  const userRef = doc(db, "users", user.uid);
  const userDoc = await getDoc(userRef);
  const data = userDoc.data();

  document.getElementById("welcome").innerText = `Welcome, ${data.name}`;
  document.getElementById("points").innerText = data.points;

  // Referral link
  document.getElementById("refLink").innerText = `${window.location.origin}/Rearnhub/register.html?ref=${user.uid}`;
});
