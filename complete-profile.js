// fake uid for demo
const uid = "837462839";

const nameInput = document.getElementById("nameInput");
const usernameInput = document.getElementById("usernameInput");
const dobInput = document.getElementById("dobInput");
const saveBtn = document.getElementById("saveBtn");
const skipBtn = document.getElementById("skipBtn");

// save profile
saveBtn.addEventListener("click", () => {
  const profileData = {
    uid,
    name: nameInput.value.trim(),
    username: usernameInput.value.trim(),
    dob: dobInput.value,
    profileCompleted: true,
    joined: new Date().toISOString().slice(0,10)
  };

  console.log("SAVE TO FIRESTORE 👇", profileData);

  // later:
  // setDoc(doc(db,"users",uid), profileData, { merge:true })

  alert("Profile saved ✅");
  window.location.href = "index.html";
});

// skip
skipBtn.addEventListener("click", () => {
  console.log("Profile skipped ❌");
  window.location.href = "index.html";
});
