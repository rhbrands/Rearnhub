import { auth, db } from "./firebase.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

import {
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

const email = document.getElementById("email");
const password = document.getElementById("password");
const registerBtn = document.getElementById("registerBtn");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const authMsg = document.getElementById("authMsg");

const authSection = document.getElementById("auth-section");
const dashboard = document.getElementById("dashboard");

// REGISTER
registerBtn.addEventListener("click", async () => {
  try {
    const cred = await createUserWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );

    await setDoc(doc(db, "users", cred.user.uid), {
      email: cred.user.email,
      createdAt: new Date()
    });

    authMsg.textContent = "Account created successfully ✅";
  } catch (err) {
    authMsg.textContent = err.message;
  }
});

// LOGIN
loginBtn.addEventListener("click", async () => {
  try {
    await signInWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );
  } catch (err) {
    authMsg.textContent = err.message;
  }
});

// LOGOUT
logoutBtn.addEventListener("click", () => signOut(auth));

// AUTH STATE LISTENER
onAuthStateChanged(auth, user => {
  if (user) {
    authSection.classList.add("hidden");
    dashboard.classList.remove("hidden");
  } else {
    authSection.classList.remove("hidden");
    dashboard.classList.add("hidden");
  }
});
