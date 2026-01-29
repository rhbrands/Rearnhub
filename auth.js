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
  setDoc,
  collection,
  query,
  where,
  getDocs
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

// Helper
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
  messageBox.textContent = "";
  messageBox.className = "form-message";

  const fullName = form.querySelector("#fullName").value.trim();
  const whatsapp = form.querySelector("#whatsapp").value.trim();
  const email = form.querySelector("#email").value.trim();
  const password = form.querySelector("#password").value;

  if (!fullName || !whatsapp || !email || !password) {
    messageBox.textContent = "Please fill in all required fields.";
    messageBox.className = "form-message error";
    return;
  }

  try {
    const phoneQuery = query(
      collection(db, "users"),
      where("whatsapp", "==", whatsapp)
    );
    const phoneSnapshot = await getDocs(phoneQuery);

    if (!phoneSnapshot.empty) {
      messageBox.textContent = "Phone number already in use by another user";
      messageBox.className = "form-message error";
      return;
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      fullName,
      whatsapp,
      email,
      balance: 5000,
      createdAt: new Date()
    });

    messageBox.textContent = "Account created successfully!";
    messageBox.className = "form-message success";

    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 1000);

  } catch (error) {
    let friendlyMessage = "Registration failed. Please try again.";

    if (error.code === "auth/email-already-in-use") {
      friendlyMessage = "Email already in use by another user";
    } else if (error.code === "auth/invalid-email") {
      friendlyMessage = "Invalid email address";
    } else if (error.code === "auth/weak-password") {
      friendlyMessage = "Password should be at least 6 characters";
    }

    messageBox.textContent = friendlyMessage;
    messageBox.className = "form-message error";
  }
});

// ----------------------
// Login
// ----------------------
attachFormHandler("loginForm", async (form) => {
  const messageBox = document.getElementById("login-message");
  messageBox.textContent = "";
  messageBox.className = "form-message";

  const email = form.querySelector("#email").value.trim();
  const password = form.querySelector("#password").value;

  if (!email || !password) {
    messageBox.textContent = "Please enter both email and password.";
    messageBox.className = "form-message error";
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);

    messageBox.textContent = "Login successful! Redirecting...";
    messageBox.className = "form-message success";

    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 1500);

  } catch (error) {
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
