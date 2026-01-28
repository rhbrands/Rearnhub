// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

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

console.log("Firebase initialized");

// ----------------------
// Helper function to attach form handlers safely
// ----------------------
function attachFormHandler(formId, callback) {
  const form = document.getElementById(formId);
  if (!form) return;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    await callback(form);
  });
}

// ----------------------
// Registration
// ----------------------
attachFormHandler("registerForm", async (form) => {
  const fullName = form.querySelector("#fullName").value.trim();
  const whatsapp = form.querySelector("#whatsapp").value.trim();
  const email = form.querySelector("#email").value.trim();
  const password = form.querySelector("#password").value;

  if (!fullName || !whatsapp || !email || !password) {
    alert("Please fill in all required fields.");
    return;
  }

  try {
    await createUserWithEmailAndPassword(auth, email, password);

    // Optionally save extra info in localStorage for now
    localStorage.setItem("fullName", fullName);
    localStorage.setItem("whatsapp", whatsapp);

    alert("Account created successfully!");
    window.location.href = "dashboard.html";
  } catch (error) {
    alert(error.message);
  }
});

// ----------------------
// Login
// ----------------------
attachFormHandler("loginForm", async (form) => {
  const email = form.querySelector("#email").value.trim();
  const password = form.querySelector("#password").value;

  if (!email || !password) {
    alert("Please enter both email and password.");
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Login successful!");
    window.location.href = "dashboard.html";
  } catch (error) {
    alert(error.message);
  }
});
