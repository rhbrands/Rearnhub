import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

// ----------------------
// Firebase config
// ----------------------
const firebaseConfig = {
  apiKey: "AIzaSyDUuzw189X97PKegWApVMTUEY5AJC6F5r8",
  authDomain: "rearnhub.firebaseapp.com",
  projectId: "rearnhub",
  storageBucket: "rearnhub.firebasestorage.app",
  messagingSenderId: "461077159495",
  appId: "1:461077159495:web:595412074b4c28de17db62"
};

// ----------------------
// Initialize Firebase
// ----------------------
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {
  const userFullNameSpan = document.getElementById("userFullName");
  const backDashboardBtn = document.getElementById("backDashboardBtn");

  if (!userFullNameSpan) {
    console.error("ERROR: No element found with id 'userFullName'. Check your tasks.html header!");
    return;
  }

  // ----------------------
  // Watch auth state
  // ----------------------
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      console.log("User not logged in. Redirecting to login page.");
      window.location.href = "login.html";
      return;
    }

    console.log("Logged in user UID:", user.uid, "Email:", user.email);

    let userData = null;

    try {
      // 1️⃣ Try fetching by UID first
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      console.log("Checking UID document:", user.uid);
      console.log("userSnap.exists():", userSnap.exists());

      if (userSnap.exists()) {
        userData = userSnap.data();
        console.log("Fetched by UID:", userData);
      } else {
        // 2️⃣ Fallback: query by email
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", user.email));
        const querySnapshot = await getDocs(q);

        console.log("Fallback email query results:", querySnapshot.size);

        if (!querySnapshot.empty) {
          userData = querySnapshot.docs[0].data();
          console.log("Fetched by email:", userData);
        }
      }

      // 3️⃣ Display fullName if available, else email
      if (userData && userData.fullName) {
        userFullNameSpan.textContent = userData.fullName;
      } else {
        console.warn("Full name not found in Firestore. Falling back to email.");
        userFullNameSpan.textContent = user.email;
      }

     // ----------------------
// Account Balance Section
// ----------------------
const balanceAmount = document.querySelector(".balance-amount");
if (balanceAmount) {
    if (userData.balance === undefined || userData.balance === null) {
        // Initialize new user's balance to 5000
        await setDoc(doc(db, "users", user.uid), { balance: 5000 }, { merge: true });
        balanceAmount.textContent = "#5000";
        console.log("New user balance initialized to 5000 on Tasks page");
    } else {
        balanceAmount.textContent = `#${userData.balance}`;
    }
}




    } catch (err) {
      console.error("Error fetching user data:", err);
      userFullNameSpan.textContent = user.email;
    }
  });

  // ----------------------
  // Back to Dashboard button
  // ----------------------
  if (backDashboardBtn) {
    backDashboardBtn.addEventListener("click", () => {
      window.location.href = "dashboard.html";
    });
  }
});
