import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import { 
  getFirestore, doc, getDoc, updateDoc 
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
// Initialize Firebase (ONCE)
// ----------------------
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {
  const userFullNameSpan = document.getElementById("userFullName");
  const backDashboardBtn = document.getElementById("backDashboardBtn");

  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = "login.html";
      return;
    }

    // ----------------------
    // Fetch user
    // ----------------------
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      console.error("User document not found");
      return;
    }

    const userData = userSnap.data();

    // ----------------------
    // Header name
    // ----------------------
    userFullNameSpan.textContent =
      userData.fullName || user.email;

    // ----------------------
    // Task buttons logic
    // ----------------------
    const taskButtons = document.querySelectorAll(".task-card button");

    taskButtons.forEach((btn, index) => {
      btn.addEventListener("click", async () => {
        const taskId = `task${index + 1}`;
        const reward = 200;

        // Prevent double reward
        if (userData.completedTasks?.[taskId]) {
          alert("Task already completed ❌");
          return;
        }

        await updateDoc(userRef, {
          balance: (userData.balance || 0) + reward,
          [`completedTasks.${taskId}`]: true
        });

        alert("Task completed! Balance updated ✅");
        btn.disabled = true;
        btn.textContent = "Completed";
      });
    });
  });

  // ----------------------
  // Back to dashboard
  // ----------------------
  if (backDashboardBtn) {
    backDashboardBtn.addEventListener("click", () => {
      window.location.href = "dashboard.html";
    });
  }
});
