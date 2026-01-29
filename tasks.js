import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc, increment, onSnapshot } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

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

document.addEventListener("DOMContentLoaded", () => {
  const userFullNameSpan = document.getElementById("userFullName");
  const backDashboardBtn = document.getElementById("backDashboardBtn");
  const balanceAmount = document.querySelector(".balance-amount"); // optional, for live balance

  // ----------------------
  // Toast helper
  // ----------------------
  const showToast = (message) => {
    const toast = document.createElement("div");
    toast.textContent = message;
    toast.style.position = "fixed";
    toast.style.top = "20px";
    toast.style.left = "50%";
    toast.style.transform = "translateX(-50%)";
    toast.style.background = "#00ff9c";
    toast.style.color = "#000";
    toast.style.padding = "10px 20px";
    toast.style.borderRadius = "5px";
    toast.style.fontWeight = "bold";
    toast.style.zIndex = "9999";
    toast.style.boxShadow = "0 4px 10px rgba(0,0,0,0.3)";
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
  };

  // ----------------------
  // Auth check
  // ----------------------
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = "login.html";
      return;
    }

    const userRef = doc(db, "users", user.uid);

    // ----------------------
    // Real-time snapshot for live balance updates
    // ----------------------
    onSnapshot(userRef, (docSnap) => {
      if (!docSnap.exists()) return;

      const userData = docSnap.data();

      // Show full name
      userFullNameSpan.textContent = userData.fullName || user.email;

      // Update balance dynamically
      if (balanceAmount) {
        balanceAmount.textContent = `#${userData.balance || 0}`;
      }

      // Update task cards for already completed tasks
      const taskCards = document.querySelectorAll(".task-card");
      taskCards.forEach(card => {
        const btn = card.querySelector("button");
        const taskId = card.dataset.taskId;

        if (userData.completedTasks?.[taskId]) {
          btn.textContent = "Completed ✅";
          btn.disabled = true;
          card.classList.add("task-completed");
        }
      });
    });

    // ----------------------
    // Task buttons click
    // ----------------------
    const taskCards = document.querySelectorAll(".task-card");
    taskCards.forEach(card => {
      const btn = card.querySelector("button");
      const taskId = card.dataset.taskId;
      const reward = Number(card.dataset.reward);

      btn.addEventListener("click", async () => {
        try {
          btn.disabled = true;
          btn.textContent = "Processing... ⏳";

          // Safe increment and mark task complete
          await updateDoc(userRef, {
            balance: increment(reward),
            [`completedTasks.${taskId}`]: true
          });

          // Update UI instantly
          btn.textContent = "Completed ✅";
          card.classList.add("task-completed");

          // Show toast
          showToast(`Task completed! ₦${reward} added 🎉`);

        } catch (err) {
          console.error("Error completing task:", err);
          btn.disabled = false;
          btn.textContent = "Do Task";
          showToast("Failed to complete task. Try again.");
        }
      });
    });
  });

  // ----------------------
  // Back button
  // ----------------------
  if (backDashboardBtn) {
    backDashboardBtn.addEventListener("click", () => {
      window.location.href = "dashboard.html";
    });
  }
});
