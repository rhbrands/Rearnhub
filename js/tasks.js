import { getAuth } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

const auth = getAuth();
const db = getFirestore();

// Helper to update balance display
async function updateBalances(user) {
  const userRef = doc(db, "users", user.uid);
  const userDoc = await getDoc(userRef);
  const data = userDoc.data();

  const taskBalance = data.taskBalance || 0;
  const refBalance = data.refBalance || 0;

  document.getElementById("taskBalance").innerText = taskBalance;
  document.getElementById("refBalance").innerText = refBalance;
  document.getElementById("totalBalance").innerText = taskBalance + refBalance;
}

// Attach tasks
function attachTask(buttonId, taskName, points) {
  const btn = document.getElementById(buttonId);
  if (btn) {
    btn.addEventListener("click", async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);
      let taskBalance = userDoc.data().taskBalance || 0;

      taskBalance += points;
      await updateDoc(userRef, { taskBalance });

      await updateBalances(user);
      alert(`Task "${taskName}" completed! +${points} points`);
    });
  }
}

// Attach task buttons
attachTask("task1Btn", "Read Article", 10);
attachTask("task2Btn", "Watch Video", 15);

// Initialize balances on load
auth.onAuthStateChanged(async (user) => {
  if (user) {
    await updateBalances(user);
  }
});
