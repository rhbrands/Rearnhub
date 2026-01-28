import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

const auth = getAuth();
const db = getFirestore();

onAuthStateChanged(auth, async user => {
  if(!user){
    window.location.href = "login.html";
    return;
  }

  const userDoc = await getDoc(doc(db, "users", user.uid));
  const data = userDoc.data();
  document.getElementById("welcome").innerText = `Welcome, ${data.name}`;
  document.getElementById("points").innerText = data.points;
  document.getElementById("refLink").innerText = `${window.location.origin}/register.html?ref=${user.uid}`;
});

window.completeTask = async (taskName) => {
  const user = auth.currentUser;
  if(!user) return;

  const userRef = doc(db, "users", user.uid);
  const userDoc = await getDoc(userRef);
  let points = userDoc.data().points || 0;

  const taskPoints = taskName === "Read Article" ? 10 : 15;
  points += taskPoints;

  await updateDoc(userRef, { points });
  document.getElementById("points").innerText = points;
  alert(`Task "${taskName}" completed! +${taskPoints} points`);
};
