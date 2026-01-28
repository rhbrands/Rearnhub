import { getAuth } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

const auth = getAuth();
const db = getFirestore();

function attachTask(buttonId, taskName, points) {
  const btn = document.getElementById(buttonId);
  if (btn) {
    btn.addEventListener("click", async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);
      let currentPoints = userDoc.data().points || 0;

      currentPoints += points;
      await updateDoc(userRef, { points: currentPoints });
      document.getElementById("points").innerText = currentPoints;

      alert(`Task "${taskName}" completed! +${points} points`);
    });
  }
}

// Attach tasks
attachTask("task1Btn", "Read Article", 10);
attachTask("task2Btn", "Watch Video", 15);
