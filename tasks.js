import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

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

  // ----------------------
  // Auth check
  // ----------------------
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = "login.html";
      return;
    }

    // Reference to user doc
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) return;

    const userData = userSnap.data();

    // Show full name
    userFullNameSpan.textContent = userData.fullName || user.email;

    // ----------------------
    // Task buttons
    // ----------------------
    const taskCards = document.querySelectorAll(".task-card");

    taskCards.forEach(card => {
      const btn = card.querySelector("button");
      const taskId = card.dataset.taskId;
      const reward = Number(card.dataset.reward);

      // Disable if already completed
      if (userData.completedTasks?.[taskId]) {
        btn.textContent = "Completed ✅";
        btn.disabled = true;
        return;
      }

      btn.addEventListener("click", async () => {
        try {
          // Disable immediately
          btn.disabled = true;
          btn.textContent = "Processing... ⏳";

          // Increment balance safely & mark task completed
          await updateDoc(userRef, {
            balance: increment(reward),
            [`completedTasks.${taskId}`]: true
          });

          // Update UI
          btn.textContent = "Completed ✅";

          // Optional: subtle animation instead of alert
          card.classList.add("task-completed"); // you can style .task-completed in CSS

        } catch (err) {
          console.error("Error completing task:", err);
          btn.disabled = false;
          btn.textContent = "Do Task";
          alert("Failed to complete task. Try again.");
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
