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
// DOM ELEMENTS
// ----------------------
const passwordInput = document.getElementById("password");
const passwordHint = document.getElementById("password-hint");
const togglePasswordBtn = document.getElementById("toggle-password");

// ----------------------
// Password Strength Hint
// ----------------------
if (passwordInput && passwordHint) {
  passwordInput.addEventListener("input", () => {
    const val = passwordInput.value;
    let strength = 0;

    if (val.length >= 6) strength++;
    if (/[A-Z]/.test(val)) strength++;
    if (/[0-9]/.test(val)) strength++;
    if (/[\W_]/.test(val)) strength++;

    let message = "Weak password";
    let color = "#ef4444";

    if (strength >= 2) {
      message = "Medium strength";
      color = "#facc15";
    }
    if (strength === 4) {
      message = "Strong password";
      color = "#22c55e";
    }

    passwordHint.textContent = message;
    passwordHint.style.color = color;
  });
}

// ----------------------
// Show / Hide Password
// ----------------------
if (togglePasswordBtn && passwordInput) {
  togglePasswordBtn.addEventListener("click", () => {
    const isHidden = passwordInput.type === "password";
    passwordInput.type = isHidden ? "text" : "password";
    togglePasswordBtn.textContent = isHidden ? "🙈" : "👁️";
  });
}

// ----------------------
// Helper: Attach form with spinner
// ----------------------
function attachFormHandler(formId, callback) {
  const form = document.getElementById(formId);
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector("button[type='submit']");
    const originalText = submitBtn.textContent;

    // Add loading state
    submitBtn.disabled = true;
    submitBtn.classList.add("loading");
    submitBtn.innerHTML = `${originalText} <span class="spinner"></span>`;

    try {
      await callback(form); // run the async callback
    } finally {
      // Remove loading state after 1.5s (or when callback finishes)
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.classList.remove("loading");
        submitBtn.textContent = originalText;
      }, 1500);
    }
  });
}

// ----------------------
// Registration
// ----------------------
attachFormHandler("registerForm", async (form) => {
  const msg = document.getElementById("register-message");

  const fullName = form.querySelector("#fullName")?.value.trim();
  const whatsapp = form.querySelector("#whatsapp")?.value.trim();
  const email = form.querySelector("#email").value.trim();
  const password = form.querySelector("#password").value;

  msg.textContent = "";
  msg.className = "form-message";

  if (!fullName || !whatsapp || !email || !password) {
    msg.textContent = "Please fill in all required fields.";
    msg.classList.add("error");
    return;
  }

  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);

    await setDoc(doc(db, "users", cred.user.uid), {
      fullName,
      whatsapp,
      email,
      balance: 5000,
      createdAt: new Date()
    });

    msg.textContent = "Account created successfully! Redirecting...";
    msg.classList.add("success");

    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 1500);

  } catch (error) {
    let message = "Registration failed.";

    if (error.code === "auth/email-already-in-use") {
      message = "Email already in use, try logging in";
    } else if (error.code === "auth/invalid-email") {
      message = "Invalid email address";
    } else if (error.code === "auth/weak-password") {
      message = "Password should be at least 6 characters";
    }

    msg.textContent = message;
    msg.classList.add("error");
  }
});

// ----------------------
// Login
// ----------------------
attachFormHandler("loginForm", async (form) => {
  const msg = document.getElementById("login-message");

  const email = form.querySelector("#email").value.trim();
  const password = form.querySelector("#password").value;

  msg.textContent = "";
  msg.className = "form-message";

  if (!email || !password) {
    msg.textContent = "Please enter both email and password.";
    msg.classList.add("error");
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);

    msg.textContent = "Login successful! Redirecting...";
    msg.classList.add("success");

    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 1500);

  } catch (error) {
    msg.textContent = "Incorrect email or password";
    msg.classList.add("error");
  }
});
