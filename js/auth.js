import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

// 🔹 Your Firebase config
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

// 🔹 Signup
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Show message to user
    const msgEl = document.getElementById("signupMessage");
    if (msgEl) msgEl.innerText = "Creating your account...";

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const referral = document.getElementById("referral").value;

    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Redirect immediately
      window.location.href = "dashboard.html";

      // Then write user data to Firestore in the background
      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        points: 0,
        referral: referral || null
      });
      
      console.log("User document created in Firestore.");

    } catch (error) {
      if (msgEl) msgEl.innerText = ""; // clear message
      alert(error.message);
    }
  });
}


// 🔹 Login
const loginForm = document.getElementById("loginForm");
if(loginForm){
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "dashboard.html";
    } catch (error) {
      alert(error.message);
    }
  });
}

// 🔹 Logout (for dashboard)
window.logout = async () => {
  await signOut(auth);
  window.location.href = "login.html";
};
