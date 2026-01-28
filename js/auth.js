import { auth, db } from "./firebase.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import { doc, setDoc, getDoc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

// Registration function
export function registerUser() {
  const btn = document.getElementById("registerBtn");
  if (!btn) return;

  btn.addEventListener("click", async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    if (!email || !password) return alert("Enter email and password");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      const userRef = doc(db, "users", uid);

      // Create user doc
      await setDoc(userRef, {
        points: 0,
        completedTasks: [],
        referralCount: 0
      });

      // Handle referral
      const urlParams = new URLSearchParams(window.location.search);
      const refId = urlParams.get("ref");
      if (refId) {
        const refRef = doc(db, "users", refId);
        const refSnap = await getDoc(refRef);
        if (refSnap.exists()) {
          await updateDoc(refRef, { referralCount: increment(1) });
        }
      }

      // Redirect to dashboard
      window.location.href = "/Rearnhub/dashboard.html";
    } catch (err) {
      alert(err.message);
    }
  });
}

// Login function
export function loginUser() {
  const btn = document.getElementById("loginBtn");
  if (!btn) return;

  btn.addEventListener("click", async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    if (!email || !password) return alert("Enter email and password");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "/Rearnhub/dashboard.html";
    } catch (err) {
      alert(err.message);
    }
  });
}
