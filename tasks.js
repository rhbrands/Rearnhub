import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

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

document.addEventListener("DOMContentLoaded", () => {
  const userFullNameSpan = document.getElementById("userFullName");
  const backDashboardBtn = document.getElementById("backDashboardBtn");

  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = "login.html";
      return;
    }

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) return;

    const userData = userSnap.data();
    userFullNameSpan.textContent = userData.fullName || user.email;

    const taskCards = document.querySelectorAll(".task-card");

    taskCards.forEach(card => {
      const taskId = card.dataset.taskId;
      const reward = Number(card.dataset.reward);

      // For video tasks, assume class "video-task" is added
      if (card.classList.contains("video-task")) {
        const watchBtn = card.querySelector(".watch-btn");
        const completeBtn = card.querySelector(".complete-btn");

        // Initially, mark as complete button is disabled
        completeBtn.disabled = true;

        // Disable if task already completed
        if (userData.completedTasks?.[taskId]) {
          completeBtn.textContent = "Completed ✅";
          completeBtn.disabled = true;
          card.classList.add("task-completed");
        }

        // Watch Video button clicked
        watchBtn.addEventListener("click", () => {
          // Open video or play modal
          alert("Video opened! Watch it for at least 1 minute.");

          // Activate "Mark as Complete" button after 1 min (60000ms)
          setTimeout(() => {
            if (!userData.completedTasks?.[taskId]) {
              completeBtn.disabled = false;
            }
          }, 60000);
        });

        // Mark as Complete button clicked
        completeBtn.addEventListener("click", async () => {
          try {
            completeBtn.disabled = true;
            completeBtn.textContent = "Processing... ⏳";

            await updateDoc(userRef, {
              balance: increment(reward),
              [`completedTasks.${taskId}`]: true
            });

            completeBtn.textContent = "Completed ✅";
            card.classList.add("task-completed");

          } catch (err) {
            console.error("Error completing task:", err);
            completeBtn.disabled = false;
            completeBtn.textContent = "Mark as Complete";
            alert("Failed to complete task. Try again.");
          }
        });

      } else {
        // Non-video tasks (old behavior)
        const btn = card.querySelector("button");
        if (userData.completedTasks?.[taskId]) {
          btn.textContent = "Completed ✅";
          btn.disabled = true;
          card.classList.add("task-completed");
        } else {
          btn.addEventListener("click", async () => {
            try {
              btn.disabled = true;
              btn.textContent = "Processing... ⏳";
              await updateDoc(userRef, {
                balance: increment(reward),
                [`completedTasks.${taskId}`]: true
              });
              btn.textContent = "Completed ✅";
              card.classList.add("task-completed");
            } catch (err) {
              console.error("Error completing task:", err);
              btn.disabled = false;
              btn.textContent = "Do Task";
              alert("Failed to complete task. Try again.");
            }
          });
        }
      }
    });
  });

  if (backDashboardBtn) {
    backDashboardBtn.addEventListener("click", () => {
      window.location.href = "dashboard.html";
    });
  }
});
