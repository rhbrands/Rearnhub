import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import { 
  getFirestore, doc, getDoc, collection, query, where, getDocs, onSnapshot, setDoc 
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

// ----------------------
// Firebase config
// ----------------------
const firebaseConfig = {
  apiKey: "AIzaSyDUuzw189X97PKegWApVMTUEY5AJC6F5r8",
  authDomain: "rearnhub.firebaseapp.com",
  projectId: "rearnhub",
  storageBucket: "rearnhub.firebasestorage.app",
  messagingSenderId: "461077159495",
  appId: "1:461077159495:web:595412074b4c28de17db62"
};

// ----------------------
// Initialize Firebase
// ----------------------
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

console.log("Dashboard JS loaded");

document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");
  const userFullNameSpan = document.getElementById("userFullName");
  const balanceAmount = document.querySelector(".balance-amount");
  const referLinkInput = document.getElementById("referLink");
  const referCountSpan = document.getElementById("referCount");
  const tasksBtn = document.getElementById("tasksBtn");

  if (!logoutBtn || !userFullNameSpan || !balanceAmount) {
    console.error("Required DOM elements not found");
    return;
  }

  // ----------------------
  // Auth check
  // ----------------------
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = "login.html";
      return;
    }

    try {
      // Reference to user document
      const userRef = doc(db, "users", user.uid);

      // ----------------------
      // Real-time listener for user data
      // ----------------------
      onSnapshot(userRef, async (docSnap) => {
        let userData = null;

        if (docSnap.exists()) {
          userData = docSnap.data();
          console.log("Realtime snapshot fetched:", userData);
        } else {
          // If user doc does not exist, create it with initial balance
          await setDoc(userRef, { balance: 5000, completedTasks: [] }, { merge: true });
          userData = { balance: 5000, completedTasks: [] };
          console.log("New user doc created with balance 5000");
        }

        // Display user info
        userFullNameSpan.textContent = userData.fullName || user.email;

        // Update balance dynamically
        balanceAmount.textContent = `#${userData.balance || 0}`;

        // Update referral link
        if (referLinkInput) {
          referLinkInput.value = `https://rhbrands.github.io/Rearnhub/register?ref=${user.uid}`;
        }

        // Update referral count
        if (referCountSpan) {
          referCountSpan.textContent = userData.referrals ? userData.referrals.length : 0;
        }
      });

    } catch (err) {
      console.error("Error fetching user data:", err);
      userFullNameSpan.textContent = user.email;
    }
  });

  // ----------------------
  // Tasks button
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
      window.location.href = "login.html";
    } catch (err) {
      console.error("Logout failed", err);
    }
  });
});
