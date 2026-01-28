import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDUuzw189X97PKegWApVMTUEY5AJC6F5r8",
  authDomain: "rearnhub.firebaseapp.com",
  projectId: "rearnhub",
  storageBucket: "rearnhub.firebasestorage.app",
  messagingSenderId: "461077159495",
  appId: "1:461077159495:web:595412074b4c28de17db62",
  measurementId: "G-YLCZ0TLE7G"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

// Logout button
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    try {
      await signOut(auth);
      window.location.href = "login.html";
    } catch (error) {
      alert("Error logging out: " + error.message);
    }
  });
}

// Load user data
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const userRef = doc(db, "users", user.uid);
  const userDoc = await getDoc(userRef);
  const data = userDoc.data();

  // Welcome / user name
  document.getElementById("welcome").innerText = `Hello, ${data.name}`;

  // Set balances
  document.getElementById("taskBalance").innerText = data.taskBalance || 0;
  document.getElementById("refBalance").innerText = data.refBalance || 0;
  document.getElementById("totalBalance").innerText =
    (data.taskBalance || 0) + (data.refBalance || 0);

  // Referral link
  document.getElementById("refLink").value =
    `${window.location.origin}/Rearnhub/register.html?ref=${user.uid}`;

  // Referral count
  document.getElementById("refCount").innerText = data.refCount || 0;
});
