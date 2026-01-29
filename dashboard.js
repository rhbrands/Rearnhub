import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import { 
  getFirestore, doc, getDoc, collection, query, where, getDocs 
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

console.log("Dashboard JS loaded");

document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");
  const userFullNameSpan = document.getElementById("userFullName");

  if (!logoutBtn || !userFullNameSpan) {
    console.error("Elements not found in DOM");
    return;
  }

  // Protect page & display full name
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = "login.html";
      return;
    }

    try {
      // First, try to fetch by UID (new users)
      let userData = null;
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        userData = userSnap.data();
        console.log("Fetched by UID:", userData);
      } else {
        // Fallback for old users: query by email
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", user.email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          userData = querySnapshot.docs[0].data();
          console.log("Fetched by email:", userData);
        }
      }

// Display fullName
if (userData && userData.fullName) {
    userFullNameSpan.textContent = userData.fullName;
} else {
    userFullNameSpan.textContent = user.email;
}

// ----------------------
// Account Balance Section
// ----------------------
const balanceAmount = document.querySelector(".balance-amount");
if (balanceAmount) {
    balanceAmount.textContent = "#"; // placeholder
}

// ----------------------
// Refer Section
// ----------------------
const referLinkInput = document.getElementById("referLink");
const referCountSpan = document.getElementById("referCount");

if (referLinkInput) {
    referLinkInput.value = `https://rhbrands.github.io/Rearnhub/register?ref=${user.uid}`;
}

if (referCountSpan) {
    const referralCount = userData && userData.referrals ? userData.referrals.length : 0;
    referCountSpan.textContent = referralCount;
}

      // ----------------------
// Tasks Section
// ----------------------
const tasksBtn = document.getElementById("tasksBtn");
if (tasksBtn) {
  tasksBtn.addEventListener("click", () => {
    window.location.href = "tasks.html"; // link to your tasks page
  });
}

    } catch (error) {
      console.error("Error fetching user data:", error);
      userFullNameSpan.textContent = user.email;
    }
  });


  // Logout button
  logoutBtn.addEventListener("click", async () => {
    try {
      await signOut(auth);
      console.log("Logged out successfully");
      window.location.href = "login.html";
    } catch (err) {
      console.error("Logout failed", err);
    }
  });
});
