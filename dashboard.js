import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import { getFirestore, doc, onSnapshot, collection, query, where, getDocs, setDoc } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

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
const db = getFirestore(app);

console.log("Dashboard JS loaded");

document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");
  const userFullNameSpan = document.getElementById("userFullName");
  const tasksBtn = document.getElementById("tasksBtn");
  const referLinkInput = document.getElementById("referLink");
  const referCountSpan = document.getElementById("referCount");
  const balanceAmount = document.querySelector(".balance-amount");

  if (!logoutBtn || !userFullNameSpan) {
    console.error("Required elements not found in DOM");
    return;
  }

  // Protect page & display full name
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = "login.html";
      return;
    }

    const userRef = doc(db, "users", user.uid);

    // Real-time listener for user document
    onSnapshot(userRef, async (docSnap) => {
      if (!docSnap.exists()) {
        // Initialize new user with balance 5000 if document doesn't exist
        await setDoc(userRef, { balance: 5000 }, { merge: true });
        if (balanceAmount) balanceAmount.textContent = "#5000";
        if (userFullNameSpan) userFullNameSpan.textContent = user.email;
        if (referCountSpan) referCountSpan.textContent = "0";
        if (referLinkInput) referLinkInput.value = `https://rhbrands.github.io/Rearnhub/register?ref=${user.uid}`;
        return;
      }

      const userData = docSnap.data();

      // Display full name
      userFullNameSpan.textContent = userData.fullName || user.email;

      // Update balance
      if (balanceAmount) {
        balanceAmount.textContent = `#${userData.balance ?? 0}`;
      }

      // Update referral info
      if (referLinkInput) {
        referLinkInput.value = `https://rhbrands.github.io/Rearnhub/register?ref=${user.uid}`;
      }
      if (referCountSpan) {
        referCountSpan.textContent = userData.referrals?.length || 0;
      }
    });
  });

  // ----------------------
  // Tasks Button
  // ----------------------
  if (tasksBtn) {
    tasksBtn.addEventListener("click", () => {
      window.location.href = "tasks.html";
    });
  }

  // ----------------------
  // Logout button
  // ----------------------
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
