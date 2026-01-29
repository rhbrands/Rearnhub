// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

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

// ----------------------
// Helper function
// ----------------------
function attachFormHandler(formId, callback) {
  const form = document.getElementById(formId);
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    await callback(form);
  });
}

// ----------------------
// Registration
// ----------------------
attachFormHandler("registerForm", async (form) => {
  const messageBox = document.getElementById("register-message");

  const fullName = form.querySelector("#fullName").value.trim();
  const whatsapp = form.querySelector("#whatsapp").value.trim();
  const email = form.querySelector("#email").value.trim();
  const password = form.querySelector("#password").value;

  messageBox.textContent = "";
  messageBox.className = "form-message";

  if (!fullName || !whatsapp || !email || !password) {
    messageBox.textContent = "Please fill in all required fields.";
    messageBox.classList.add("error");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      fullName,
      whatsapp,
      email,
      balance: 5000, // registration bonus
      createdAt: new Date()
    });

    messageBox.textContent = "Account created successfully! Redirecting...";
    messageBox.classList.add("success");

    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 1500);

  } catch (error) {
    messageBox.textContent = error.message;
    messageBox.classList.add("error");
  }
});

// ----------------------
// Login
// ----------------------
attachFormHandler("loginForm", async (form) => {
  const messageBox = document.getElementById("login-message");

  const email = form.querySelector("#email").value.trim();
  const password = form.querySelector("#password").value;

  messageBox.textContent = "";
  messageBox.className = "form-message";

  if (!email || !password) {
    messageBox.textContent = "Please enter both email and password.";
    messageBox.classList.add("error");
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);

    messageBox.textContent = "Login successful! Redirecting...";
    messageBox.classList.add("success");

    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 1500);

  } catch (error) {
    messageBox.textContent = error.message;
    messageBox.classList.add("error");
  }
});
