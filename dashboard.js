import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

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

// Protect page: redirect if not logged in
onAuthStateChanged(auth, user => {
  if (user) {
    // Display full name from Firestore
    import { getDoc, doc } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

onAuthStateChanged(auth, async user => {
  if (user) {
    try {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        document.getElementById("userFullName").textContent = userData.fullName;
      } else {
        document.getElementById("userFullName").textContent = user.email;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      document.getElementById("userFullName").textContent = user.email;
    }
  } else {
    window.location.href = "login.html";
  }
});

// Logout button
const logoutBtn = document.getElementById("logoutBtn");
logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "login.html";
});
