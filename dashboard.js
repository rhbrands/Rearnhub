import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

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

// ------------------------------
// Helper to safely attach logout button
// ------------------------------
function initLogoutButton() {
  const logoutBtn = document.getElementById("logoutBtn");
  if (!logoutBtn) return;

  logoutBtn.onclick = async () => {
    try {
      await signOut(auth);
      window.location.href = "login.html";
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed. Check console.");
    }
  };
}

// ------------------------------
// Display full name & protect page
// ------------------------------
function initDashboard() {
  const userFullNameSpan = document.getElementById("userFullName");
  if (!userFullNameSpan) return;

  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      // redirect if not logged in
      window.location.href = "login.html";
      return;
    }

    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        userFullNameSpan.textContent = userData.fullName || user.email;
      } else {
        userFullNameSpan.textContent = user.email;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      userFullNameSpan.textContent = user.email;
    }
  });
}

// ------------------------------
// Initialize dashboard after DOM is ready
// ------------------------------
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    initDashboard();
    initLogoutButton();
  });
} else {
  initDashboard();
  initLogoutButton();
}
