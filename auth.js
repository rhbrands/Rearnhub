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
// Password Strength Hint
// ----------------------
const passwordInput = document.getElementById("password");
const passwordHint = document.getElementById("password-hint");

if (passwordInput && passwordHint) {
  passwordInput.addEventListener("input", () => {
    const val = passwordInput.value;

    let strength = 0;

    if (val.length >= 6) strength++;
    if (/[A-Z]/.test(val)) strength++;
    if (/[0-9]/.test(val)) strength++;
    if (/[\W_]/.test(val)) strength++; // special characters

    let message = "";
    let color = "#ef4444"; // red by default

    switch (strength) {
      case 0:
      case 1:
        message = "Weak password";
        color = "#ef4444"; // red
        break;
      case 2:
      case 3:
        message = "Medium strength";
        color = "#facc15"; // yellow
        break;
      case 4:
        message = "Strong password";
        color = "#22c55e"; // green
        break;
    }

    passwordHint.textContent = message;
    passwordHint.style.color = color;
  });
}

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
  let friendlyMessage = "Registration failed. Please try again.";

  if (error.code === "auth/email-already-in-use") {
    friendlyMessage = "Email already in use, try logging in";
  } else if (error.code === "auth/invalid-email") {
    friendlyMessage = "Invalid email address";
  } else if (error.code === "auth/weak-password") {
    friendlyMessage = "Password should be at least 6 characters";
  }

  messageBox.textContent = friendlyMessage;
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
  const messageBox = document.getElementById("login-message");

  let friendlyMessage = "Login failed. Please try again.";

  if (
    error.code === "auth/invalid-credential" ||
    error.code === "auth/wrong-password" ||
    error.code === "auth/user-not-found"
  ) {
    friendlyMessage = "Incorrect email or password";
  }

  messageBox.textContent = friendlyMessage;
  messageBox.className = "form-message error";
}

});
