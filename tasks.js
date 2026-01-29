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
      const completeBtn = card.querySelector(".complete-btn");
      const taskId = card.dataset.taskId;
      const reward = Number(card.dataset.reward);

      // If task already completed
      if (userData.completedTasks?.[taskId]) {
        completeBtn.textContent = "Completed ✅";
        completeBtn.disabled = true;
        card.classList.add("task-completed");
      }

      // ---------- Video Task ----------
      if (card.classList.contains("video-task")) {
        const watchBtn = card.querySelector(".watch-btn");
        const videoLink = card.dataset.videoLink;

        let videoWatched = false;

        watchBtn.addEventListener("click", () => {
          window.open(videoLink, "_blank");
          videoWatched = true;

          // Enable completeBtn after 1 min
          setTimeout(() => {
            if (!userData.completedTasks?.[taskId]) completeBtn.disabled = false;
          }, 60000);
        });

        completeBtn.addEventListener("click", async () => {
          if (!videoWatched) return alert("Please watch the video first!");
          try {
            completeBtn.disabled = true;
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
      }

      // ---------- Social Task ----------
      if (card.classList.contains("social-task")) {
        const joinBtn = card.querySelector(".join-btn");
        const socialLink = card.dataset.socialLink;

        joinBtn.addEventListener("click", () => {
          window.open(socialLink, "_blank");
          // Activate completeBtn after 10s countdown
          let countdown = 10;
          completeBtn.disabled = true;
          completeBtn.textContent = `Checking... ${countdown}s`;

          const timer = setInterval(() => {
            countdown--;
            if (countdown > 0) {
              completeBtn.textContent = `Checking... ${countdown}s`;
            } else {
              clearInterval(timer);
              if (!userData.completedTasks?.[taskId]) completeBtn.disabled = false;
              completeBtn.textContent = "Mark as Complete";
            }
          }, 1000);
        });

        completeBtn.addEventListener("click", async () => {
          try {
            completeBtn.disabled = true;
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
      }

      // ---------- Other Task ----------
      if (card.classList.contains("other-task")) {
        const startBtn = card.querySelector(".start-btn");
        const taskLink = card.dataset.taskLink;

        startBtn.addEventListener("click", () => {
          window.open(taskLink, "_blank");

          // Enable completeBtn after 30s countdown
          let countdown = 30;
          completeBtn.disabled = true;
          completeBtn.textContent = `Checking... ${countdown}s`;

          const timer = setInterval(() => {
            countdown--;
            if (countdown > 0) {
              completeBtn.textContent = `Checking... ${countdown}s`;
            } else {
              clearInterval(timer);
              if (!userData.completedTasks?.[taskId]) completeBtn.disabled = false;
              completeBtn.textContent = "Mark as Complete";
            }
          }, 1000);
        });

        completeBtn.addEventListener("click", async () => {
          try {
            completeBtn.disabled = true;
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
      }
    });
  });

  // Back to Dashboard button
  if (backDashboardBtn) {
    backDashboardBtn.addEventListener("click", () => {
      window.location.href = "dashboard.html";
    });
  }
});
