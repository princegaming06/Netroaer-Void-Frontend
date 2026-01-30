let lastActivePage = "home"; // default

import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";


//connecting node js backend
fetch("http://localhost:5000/api/test")
  .then((res) => res.json())
  .then((data) => {
    console.log(data.message);
  })
  .catch((err) => console.error("Error:", err));

//connected
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

/* =======================
     1) PASTE CONFIG HERE ✅
     ======================= */
const firebaseConfig = {
  apiKey: "AIzaSyDutEYVehgb0om_ZfmZ778IFMPGrWkViqA",
  authDomain: "netroar-studios-06.firebaseapp.com",
  projectId: "netroar-studios-06",
  appId: "1:325720867256:web:e6fbaf89494f69b0c08f4d",
};

function isFirebaseConfigured(cfg) {
  const vals = [cfg.apiKey, cfg.authDomain, cfg.projectId, cfg.appId].map((v) =>
    (v || "").trim(),
  );
  if (vals.some((v) => !v)) return false;
  if (vals.some((v) => v.includes("PASTE_HERE"))) return false;
  return true;
}

// Firebase init (safe)
let db = null;
let app = null;
let auth = null;
let provider = null;
const firebaseReady = isFirebaseConfigured(firebaseConfig);


if (firebaseReady) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  provider = new GoogleAuthProvider();

  // ✅ YAHI PAR
  db = getFirestore(app);
} else {
  console.warn(
    "Firebase config missing. Auth will be disabled until you paste real config.",
  );
}

/* ---------- SETTINGS STORAGE ---------- */
const SETTINGS_KEY = "ns_settings_v1";
const DEFAULT_SETTINGS = {
  theme: "dark",
  ui: "normal",
  soundOn: true,
  soundType: "beep",
  volume: 60,
  animOn: true,
  animIntensity: "med",
};

function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

function saveSettings(s) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
}

let settings = loadSettings();

function applySettings() {
  document.body.dataset.theme = settings.theme;
  document.body.dataset.ui = settings.ui;

  const animOn = !!settings.animOn;
  const intensity = settings.animIntensity;

  if (!animOn) {
    document.documentElement.style.setProperty("--animDur", "0s");
    document.documentElement.style.setProperty("--rippleDur", "0s");
    document.documentElement.style.setProperty("--rippleScale", "1");
  } else {
    if (intensity === "low") {
      document.documentElement.style.setProperty("--animDur", ".18s");
      document.documentElement.style.setProperty("--rippleDur", ".35s");
      document.documentElement.style.setProperty("--rippleScale", "5");
    } else if (intensity === "high") {
      document.documentElement.style.setProperty("--animDur", ".32s");
      document.documentElement.style.setProperty("--rippleDur", ".55s");
      document.documentElement.style.setProperty("--rippleScale", "7");
    } else {
      document.documentElement.style.setProperty("--animDur", ".25s");
      document.documentElement.style.setProperty("--rippleDur", ".45s");
      document.documentElement.style.setProperty("--rippleScale", "6");
    }
  }
}

applySettings();

/* ---------- ELEMENTS ---------- */
const header = document.querySelector("header");
const pages = document.querySelectorAll(".page");
const footerIcons = document.querySelectorAll("footer i[data-page]");
const footerEl = document.querySelector("footer");
const ctaAssets = document.getElementById("ctaAssets");

const authModal = document.getElementById("authModal");
const authClose = document.getElementById("authClose");
const authReason = document.getElementById("authReason");
const authMsg = document.getElementById("authMsg");
const authSuccess = document.getElementById("authSuccess");
const authSuccessText = document.getElementById("authSuccessText");

const emailEl = document.getElementById("authEmail");
const passEl = document.getElementById("authPassword");
const btnLogin = document.getElementById("btnLogin");
const btnSignup = document.getElementById("btnSignup");
const btnGoogle = document.getElementById("btnGoogle");
const btnLogout = document.getElementById("btnLogout");
// ✅ Terms checkbox elements
const termsOk = document.getElementById("termsOk");
const openTermsLink = document.getElementById("openTermsLink");
const termsBack = document.getElementById("termsBack");

// Profile elements
const pAvatar = document.getElementById("pAvatar");
const pName = document.getElementById("pName");
const pEmail = document.getElementById("pEmail");
const pBadge = document.getElementById("pBadge");
const pLogin = document.getElementById("pLogin");
const pLogout = document.getElementById("pLogout");
const goSettings = document.getElementById("goSettings");
const settingsBack = document.getElementById("settingsBack");
const downloadList = document.getElementById("downloadList");
const unlockDownloads = document.getElementById("unlockDownloads");

// Settings inputs (these exist in your HTML)
const setSoundOn = document.getElementById("setSoundOn");
const setVolume = document.getElementById("setVolume");
const setAnimOn = document.getElementById("setAnimOn");
const volValue = document.getElementById("volValue");

/* ---------- PAGE SWITCH ---------- */
function setActivePage(pageId) {

  // 🔹 SAVE LAST PAGE (before opening public profile)
  const current = document.querySelector(".page.active");
  if (current && pageId === "public-profile") {
    lastActivePage = current.id;
  }

  pages.forEach((p) => p.classList.remove("active"));
  const page = document.getElementById(pageId);
  if (page) page.classList.add("active");

  if (page && page.classList.contains("scrollable")) page.scrollTop = 0;
  header?.classList.remove("hide");

  footerIcons.forEach((i) =>
    i.classList.toggle("active", i.dataset.page === pageId),
  );

  // ✅ Hide footer on settings page
  if (footerEl) {
    footerEl.style.display = pageId === "settings" ? "none" : "flex";
  }

  // 🔹 HEADER RESET (unchanged)
  const headerEl = document.querySelector("header");
  if (headerEl) {
    headerEl.textContent =
      pageId === "public-profile"
        ? headerEl.textContent
        : "NETROAR STUDIO";
  }
}


footerIcons.forEach((icon) => {
  icon.addEventListener("click", () => setActivePage(icon.dataset.page));
});

ctaAssets?.addEventListener("click", () => setActivePage("assets"));

/* ---------- Header auto-hide on scroll ---------- */
function attachHeaderAutoHide(container) {
  let last = 0;
  container.addEventListener(
    "scroll",
    () => {
      if (!settings.animOn) return;
      const y = container.scrollTop;
      header?.classList.toggle("hide", y > last && y > 60);
      last = y;
    },
    { passive: true },
  );
}
["assets", "about", "profile", "settings", "official-full", "public-profile"].forEach((id) => {
  const el = document.getElementById(id);
  if (el) attachHeaderAutoHide(el);
});

/* ---------- Modal helpers ---------- */
let afterLoginGoTo = null;

function setMsg(t) {
  if (!authMsg) return;
  authMsg.textContent = t || "";
}

function openAuthModal(reasonText, goToAfter) {
  if (!authModal) return;
  if (authReason) authReason.textContent = reasonText || "Sign in to continue.";
  setMsg("");
  if (authSuccess) authSuccess.style.display = "none";
  afterLoginGoTo = goToAfter || null;
  authModal.classList.add("open");

  if (termsOk) termsOk.checked = false;
  updateAuthButtonsState();

  // If firebase not configured, show info immediately
  if (!firebaseReady) {
    setMsg(
      "⚠️ Firebase config paste karo (apiKey/authDomain/projectId/appId). Tabhi login kaam karega.",
    );
  }
}
termsOk?.addEventListener("change", updateAuthButtonsState);
openTermsLink?.addEventListener("click", (e) => {
  e.preventDefault();
  closeAuthModal(); // pehle modal band
  setActivePage("terms"); // terms page open
});
termsBack?.addEventListener("click", () => {
  setActivePage("profile"); // ya "settings" if you want
});

function closeAuthModal() {
  if (!authModal) return;
  authModal.classList.remove("open");
  afterLoginGoTo = null;
}

authClose?.addEventListener("click", closeAuthModal);
authModal
  ?.querySelector(".modal-backdrop")
  ?.addEventListener("click", closeAuthModal);

function updateAuthButtonsState() {
  const ok = !!termsOk?.checked;

  if (btnLogin) btnLogin.disabled = !ok;
  if (btnSignup) btnSignup.disabled = !ok;
  if (btnGoogle) btnGoogle.disabled = !ok;
}

// Profile sign in/out buttons
pLogin?.addEventListener("click", () =>
  openAuthModal("Sign in to view your profile.", "profile"),
);
pLogout?.addEventListener("click", async () => {
  if (!firebaseReady) return;
  await signOut(auth);
  setActivePage("home");
});
goSettings?.addEventListener("click", () => setActivePage("settings"));
settingsBack?.addEventListener("click", () => {
  setActivePage("profile");
});

/* ---------- Filters ---------- */
const filterButtons = document.querySelectorAll(".asset-filters button");
const cards = document.querySelectorAll(".asset-card");
const assetsSection = document.getElementById("assets");

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const f = btn.dataset.filter;
    cards.forEach((card) => {
      card.style.display =
        f === "all" || card.dataset.category === f ? "block" : "none";
    });

    if (assetsSection) assetsSection.scrollTop = 0;
    header?.classList.remove("hide");
  });
});

/* ---------- Preview video (hover + touch friendly) ---------- */
document.querySelectorAll(".asset-card").forEach((card) => {
  const video = card.querySelector(".preview-video");
  if (!video) return;

  card.addEventListener("mouseenter", () => {
    video.currentTime = 0;
    video.play().catch(() => {});
  });
  card.addEventListener("mouseleave", () => {
    video.pause();
    video.currentTime = 0;
  });

  card.addEventListener(
    "touchstart",
    () => {
      video.currentTime = 0;
      video.play().catch(() => {});
    },
    { passive: true },
  );
  card.addEventListener(
    "touchend",
    () => {
      video.pause();
      video.currentTime = 0;
    },
    { passive: true },
  );
  card.addEventListener(
    "touchcancel",
    () => {
      video.pause();
      video.currentTime = 0;
    },
    { passive: true },
  );
});

/* ---------- Downloads history (local) ---------- */
const DL_KEY = "ns_downloads_v1";

function loadDownloads() {
  try {
    const raw = localStorage.getItem(DL_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function saveDownloads(arr) {
  localStorage.setItem(DL_KEY, JSON.stringify(arr.slice(0, 20)));
}

function pushDownload(item, action) {
  const arr = loadDownloads();
  arr.unshift({
    item,
    action,
    time: new Date().toLocaleString(),
  });
  saveDownloads(arr);
  renderDownloads();
}

function renderDownloads() {
  if (!downloadList) return;
  const arr = loadDownloads().slice(0, 5);
  downloadList.innerHTML = "";
  if (arr.length === 0) {
    downloadList.innerHTML = `<div class="list-item"><b>No downloads yet</b><span>—</span></div>`;
    return;
  }
  arr.forEach((d) => {
    const el = document.createElement("div");
    el.className = "list-item";
    el.innerHTML = `<b>${String(d.action).toUpperCase()} • ${d.item}</b><span>${d.time}</span>`;
    downloadList.appendChild(el);
  });
}
renderDownloads();

/* ---------- AUTH (safe) ---------- */
let isAuthed = false;
let currentUser = null;

function renderProfile() {
  if (
    !pAvatar ||
    !pName ||
    !pEmail ||
    !pBadge ||
    !pLogin ||
    !pLogout ||
    !unlockDownloads
  )
    return;

  if (!isAuthed || !currentUser) {
    pAvatar.textContent = "NS";
    pName.textContent = "Guest";
    pEmail.textContent = "Sign in to see your profile";
    pBadge.textContent = "SIGNED OUT";
    pBadge.style.color = "var(--muted)";
    pLogin.style.display = "inline-flex";
    pLogout.style.display = "none";
    unlockDownloads.textContent = "Sign in required";
    return;
  }

  const name = currentUser.displayName || "Creator";
  const email = currentUser.email || "—";
  const photo = currentUser.photoURL || null;

  if (photo) {
    pAvatar.innerHTML = `<img src="${photo}" alt="avatar">`;
  } else {
    const initials = (name.trim()[0] || "N").toUpperCase();
    pAvatar.textContent = initials;
  }

  pName.textContent = name;
  pEmail.textContent = email;
  pBadge.textContent = "SIGNED IN";
  pBadge.style.color = "var(--accent)";
  pLogin.style.display = "none";
  pLogout.style.display = "inline-flex";
  unlockDownloads.textContent = "Enabled ✅";
}
renderProfile();

// Email/pass auth
btnLogin?.addEventListener("click", async () => {
  if (!firebaseReady)
    return setMsg("Firebase config paste karo, tabhi login chalega.");
  try {
    await signInWithEmailAndPassword(
      auth,
      (emailEl?.value || "").trim(),
      passEl?.value || "",
    );
  } catch (err) {
    setMsg(err?.message || "Login failed.");
  }
});

btnSignup?.addEventListener("click", async () => {
  if (!firebaseReady)
    return setMsg("Firebase config paste karo, tabhi signup chalega.");
  try {
    await createUserWithEmailAndPassword(
      auth,
      (emailEl?.value || "").trim(),
      passEl?.value || "",
    );
  } catch (err) {
    setMsg(err?.message || "Signup failed.");
  }
});

btnGoogle?.addEventListener("click", async () => {
  if (!firebaseReady)
    return setMsg("Firebase config paste karo, tabhi Google login chalega.");
  try {
    await signInWithPopup(auth, provider);
  } catch (err) {
    setMsg(err?.message || "Google sign-in failed.");
  }
});

btnLogout?.addEventListener("click", async () => {
  if (!firebaseReady) return;
  await signOut(auth);
  closeAuthModal();
});

if (firebaseReady) {
  onAuthStateChanged(auth, async (user) => {
    currentUser = user || null;
    isAuthed = !!user;

    // ❌ logged out
    if (!isAuthed) {
      if (btnLogout) btnLogout.style.display = "none";
      if (authSuccess) authSuccess.style.display = "none";
      renderProfile();
      return;
    }

    // ✅ logged in
    const uid = user.uid;

    // 🔥 FIRESTORE CHECK (profile completed or not)
    // ⚠️ yahan assume kar rahe hain ki Firestore setup hai
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);

    // 👉 profile incomplete OR first time user
    if (!snap.exists() || snap.data().profileCompleted !== true) {
      window.location.href = "complete-profile.html";
      return;
    }

    // ✅ profile complete → normal flow
    if (btnLogout) btnLogout.style.display = "inline-flex";
    if (authSuccessText) {
      authSuccessText.textContent = `Welcome back, ${user.displayName || user.email || "Creator"}!`;
    }
    if (authSuccess) authSuccess.style.display = "flex";
    setMsg("");

    renderProfile();

    const go = afterLoginGoTo || "profile";
    setTimeout(
      () => {
        closeAuthModal();
        setActivePage(go);
      },
      settings.animOn ? 650 : 0,
    );
  });
}

/* ---------- Login required ONLY on asset actions ---------- */
document.querySelectorAll(".requires-auth").forEach((btn) => {
  btn.addEventListener("click", () => {
    const item = btn.dataset.item || "this asset";
    const action = btn.dataset.action || "open";

    if (!firebaseReady) {
      openAuthModal("Firebase config missing. Sign in disabled.", "profile");
      return;
    }

    if (!isAuthed) {
      openAuthModal(`Sign in first to ${action} • ${item}.`, "profile");
      return;
    }

    pushDownload(item, action);

    // Put real links here later
    // if(action === "open") window.open("https://your-link", "_blank");
    // if(action === "download") window.location.href = "https://your-download-link";

    alert(
      `✅ ${action.toUpperCase()} allowed for: ${item}\n(Next: yahan real link set karenge)`,
    );
  });
});

/* ---------- CUSTOM U-SELECT (Theme + UI size) ---------- */
function setupUSelect() {
  const selects = document.querySelectorAll(".u-select");

  function setActive(sel, value) {
    const bind = sel.dataset.bind; // "theme" | "ui"
    const label = sel.querySelector(".u-select-label");
    const options = sel.querySelectorAll(".u-option");
    options.forEach((o) =>
      o.classList.toggle("active", o.dataset.value === value),
    );

    if (bind === "theme") {
      settings.theme = value;
      saveSettings(settings);
      applySettings();
      if (label) label.textContent = value === "light" ? "Light" : "Dark";
    }

    if (bind === "ui") {
      settings.ui = value;
      saveSettings(settings);
      applySettings();
      if (label)
        label.textContent =
          value === "small" ? "Small" : value === "large" ? "Large" : "Normal";
    }
    if (bind === "soundType") {
      settings.soundType = value;
      saveSettings(settings);

      if (label) {
        label.textContent =
          value === "soft"
            ? "Soft"
            : value === "click"
              ? "Click"
              : "Beep (default)";
      }
    }

    if (bind === "animIntensity") {
      settings.animIntensity = value;
      saveSettings(settings);
      applySettings();

      if (label) {
        label.textContent =
          value === "low"
            ? "Low"
            : value === "high"
              ? "High"
              : "Medium (default)";
      }
    }
  }

  // init
  selects.forEach((sel) => {
    const bind = sel.dataset.bind;
    if (bind === "theme") setActive(sel, settings.theme);
    if (bind === "ui") setActive(sel, settings.ui);
    if (bind === "soundType") setActive(sel, settings.soundType);
    if (bind === "animIntensity") setActive(sel, settings.animIntensity);

    const btn = sel.querySelector(".u-select-btn");
    btn?.addEventListener("click", (e) => {
      e.stopPropagation();

      // 1) Close other selects
      selects.forEach((s2) => {
        if (s2 !== sel) s2.classList.remove("open");
      });

      // 2) Remove raise from all cards
      document
        .querySelectorAll(".card.raised")
        .forEach((c) => c.classList.remove("raised"));

      // 3) Toggle current select
      sel.classList.toggle("open");

      // 4) If open, raise its parent card so menu won't be covered
      if (sel.classList.contains("open")) {
        const parentCard = sel.closest(".card");
        if (parentCard) parentCard.classList.add("raised");
      }
    });

    sel.querySelectorAll(".u-option").forEach((opt) => {
      opt.addEventListener("click", (e) => {
        e.stopPropagation();
        setActive(sel, opt.dataset.value);
        sel.classList.remove("open");
      });
    });
  });

  document.addEventListener("click", () => {
    selects.forEach((s) => s.classList.remove("open"));
    document
      .querySelectorAll(".card.raised")
      .forEach((c) => c.classList.remove("raised"));
  });
}
setupUSelect();

/* ---------- SETTINGS UI wiring (fixed: no null .value errors) ---------- */
function paintRange(el) {
  if (!el) return;
  const v = Number(el.value);
  const max = Number(el.max || 100);
  const pct = Math.round((v / max) * 100);
  el.style.background = `linear-gradient(90deg, var(--accent) ${pct}%, rgba(255,255,255,.12) ${pct}%)`;
  if (volValue) volValue.textContent = `${v}%`;
}

function syncSettingsUI() {
  if (setSoundOn) setSoundOn.checked = !!settings.soundOn;
  if (setVolume) setVolume.value = String(settings.volume ?? 60);
  if (setAnimOn) setAnimOn.checked = !!settings.animOn;
  paintRange(setVolume);
}
syncSettingsUI();

setSoundOn?.addEventListener("change", () => {
  settings.soundOn = setSoundOn.checked;
  saveSettings(settings);
});

setVolume?.addEventListener("input", () => {
  settings.volume = parseInt(setVolume.value, 10);
  saveSettings(settings);
  paintRange(setVolume);
});

setAnimOn?.addEventListener("change", () => {
  settings.animOn = setAnimOn.checked;
  saveSettings(settings);
  applySettings();
});

/* ---------- Tap sound + ripple ---------- */
let audioCtx;
let lastClickSound = 0;

function playClick() {
  if (!settings.soundOn) return;

  const now = Date.now();
  if (now - lastClickSound < 70) return;
  lastClickSound = now;

  audioCtx ||= new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === "suspended") audioCtx.resume().catch(() => {});

  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();

  let freq = 860;
  let type = "square";
  let dur = 0.045;

  if (settings.soundType === "soft") {
    freq = 520;
    type = "sine";
    dur = 0.06;
  } else if (settings.soundType === "click") {
    freq = 1200;
    type = "triangle";
    dur = 0.03;
  }

  const vol = Math.max(0, Math.min(1, (settings.volume || 60) / 100));
  o.type = type;
  o.frequency.setValueAtTime(freq, audioCtx.currentTime);

  g.gain.setValueAtTime(0.0001, audioCtx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.12 * vol, audioCtx.currentTime + 0.006);
  g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + dur);

  o.connect(g);
  g.connect(audioCtx.destination);

  o.start();
  o.stop(audioCtx.currentTime + dur + 0.005);
}

function ripple(e) {
  if (!settings.animOn) return;
  const r = document.createElement("span");
  r.className = "tap-ripple";
  r.style.left = e.clientX + "px";
  r.style.top = e.clientY + "px";
  document.body.appendChild(r);
  r.addEventListener("animationend", () => r.remove());
}

document.addEventListener(
  "pointerdown",
  (e) => {
    playClick();
    ripple(e);
  },
  { passive: true },
);

/* ---------- Start ---------- */
window.addEventListener("load", () => setActivePage("home"));
/* ✅ Auto-open auth modal when coming back from Terms */
(function autoOpenAuthFromTerms() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("openAuth") === "1") {
    // thoda delay taki page ready ho jaaye
    setTimeout(
      () => {
        openAuthModal("Please accept Terms & Conditions to continue.");
      },
      settings.animOn ? 300 : 0,
    );
  }
  if (params.get("openAuth") === "1") {
    history.replaceState(null, "", "index.html");
  }
})();
function safeOpenTerms() {
  // try normal navigation
  try {
    window.location.href = "terms.html?from=auth";
    return false;
  } catch (e) {
    // fallback
    window.location.href = "index.html";
    return false;
  }
}
/* ================= OFFICIAL ASSETS DEV LOGIC ================= */

const officialScroll = document.getElementById("officialScroll");
const showAllBtn = document.querySelector(".show-all");
const addOfficialBtn = document.querySelector(".add-official");

function updateShowAllVisibility() {
  if (!officialScroll || !showAllBtn) return;

  // agar content horizontal overflow kar raha hai
  const needsScroll =
    officialScroll.scrollWidth > officialScroll.clientWidth + 10;

  showAllBtn.style.display = needsScroll ? "inline" : "none";
}

/* DEV MODE: + button se fake official card add */
addOfficialBtn?.addEventListener("click", () => {
  if (!officialScroll) return;

  const fakeCard = document.createElement("div");
  fakeCard.className = "asset-card official";

  fakeCard.innerHTML = `
      <span class="asset-badge official-badge">OFFICIAL</span>
      <img class="thumb" src="mb.jpg" alt="Dev Asset">
      <div class="overlay">
        <h3>Dev Asset ${officialScroll.children.length + 1}</h3>
        <p class="official-sub">Netroar Studio • Dev</p>
        <div class="asset-actions">
          <button class="asset-btn primary">Open</button>
          <button class="asset-btn ghost">Download</button>
        </div>
      </div>
    `;

  officialScroll.appendChild(fakeCard);

  // naya card add hone ke baad
  updateShowAllVisibility();

  // thoda scroll bhi kara do taaki dikhe
  officialScroll.scrollTo({
    left: officialScroll.scrollWidth,
    behavior: "smooth",
  });
});

/* initial check */
window.addEventListener("load", updateShowAllVisibility);
window.addEventListener("resize", updateShowAllVisibility);

/* ============================================================ */
/* ================= OFFICIAL FULL VIEW LOGIC ================= */

const officialFull = document.getElementById("official-full");
const officialFullGrid = document.getElementById("officialFullGrid");
const officialBack = document.getElementById("officialBack");

let lastPageBeforeOfficial = "assets";

/* Open full official section */
showAllBtn?.addEventListener("click", () => {
  lastPageBeforeOfficial = "assets";

  // hide all pages
  document
    .querySelectorAll(".page")
    .forEach((p) => p.classList.remove("active"));

  // mark state
  document.body.dataset.officialOpen = "1";

  // clear old
  officialFullGrid.innerHTML = "";

  // clone official cards
  officialScroll.querySelectorAll(".asset-card.official").forEach((card) => {
    const clone = card.cloneNode(true);
    clone.classList.remove("official-preview");
    officialFullGrid.appendChild(clone);
  });

  officialFull.classList.add("active");
});

/* Back to assets */
officialBack?.addEventListener("click", () => {
  document.body.dataset.officialOpen = "0";

  officialFull.classList.remove("active");

  document.getElementById("assets")?.classList.add("active");
});
/* ================= CREATOR ASSETS DEV LOGIC ================= */

const creatorGrid = document.getElementById("creatorAssets");

const creatorAddMenu = document.getElementById("creatorAddMenu");

/* ===== CREATOR ADD MENU FIX ===== */

const creatorAddBtn = document.getElementById("creatorAddBtn");

/* ================= CREATOR ADD MENU (CLEAN) ================= */

/* + tap → menu open / close */
creatorAddBtn?.addEventListener("click", (e) => {
  e.stopPropagation();

  if (!creatorAddMenu) return;

  creatorAddMenu.style.display =
    creatorAddMenu.style.display === "block" ? "none" : "block";
});

/* menu option choose → fake card add */
creatorAddMenu?.querySelectorAll(".add-option").forEach((option) => {
  option.addEventListener("click", () => {
    let cardHTML = "";

    if (option.dataset.type === "image") {
      cardHTML = `
          <div class="asset-card">
            <span class="asset-badge">CREATOR</span>
            <img class="thumb" src="mb.jpg">
            <div class="overlay">
              <h3>Image Asset</h3>
            </div>
          </div>`;
    }

    if (option.dataset.type === "video") {
      cardHTML = `
          <div class="asset-card">
            <span class="asset-badge">CREATOR</span>
            <video class="preview-video" src="preview1.mp4" muted loop></video>
            <div class="overlay">
              <h3>Video Asset</h3>
            </div>
          </div>`;
    }

    if (option.dataset.type === "sound") {
      cardHTML = `
          <div class="asset-card">
            <span class="asset-badge">CREATOR</span>
            <div class="overlay">
              <h3>SFX</h3>
            </div>
          </div>`;
    }

    creatorGrid.prepend(
      document.createRange().createContextualFragment(cardHTML),
    );

    creatorAddMenu.style.display = "none";
  });
});

/* tap outside → menu close */
document.addEventListener("pointerdown", (e) => {
  if (
    creatorAddMenu &&
    !creatorAddMenu.contains(e.target) &&
    !creatorAddBtn.contains(e.target)
  ) {
    creatorAddMenu.style.display = "none";
  }
});
/* ================= REAL SEARCH ================= */

const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");
const searchFilterBtns = document.querySelectorAll(".search-filters button");

let currentSearchType = "profiles";

searchFilterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    searchFilterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentSearchType = btn.dataset.type;
    runSearch(searchInput.value.trim());
  });
});

searchInput?.addEventListener("input", () => {
  runSearch(searchInput.value.trim());
});

async function runSearch(query) {
  searchResults.innerHTML = "";
  if (!query) return;

  if (currentSearchType === "profiles") {
    searchProfiles(query);
  } else {
    searchAssets(query, currentSearchType);
  }
}

/* -------- PROFILES SEARCH -------- */
async function searchProfiles(q) {
  searchResults.innerHTML = "";
  const term = q.toLowerCase();
  let found = false;

  // 🔹 1) TRY FIRESTORE FIRST
  if (firebaseReady && db) {
    try {
      const snap = await getDocs(collection(db, "users"));

      snap.forEach((docu) => {
        const u = docu.data();
        if (
          u.name?.toLowerCase().includes(term) ||
          u.username?.toLowerCase().includes(term)
        ) {
          renderProfileCard(u, docu.id);
          found = true;
        }
      });
    } catch (err) {
      console.warn("Firestore search failed, using fake DB", err);
    }
  }

  // 🔹 2) FALLBACK → fakeUsersDB
  if (!found && typeof fakeUsersDB !== "undefined") {
    fakeUsersDB.forEach((u) => {
      if (
        u.name.toLowerCase().includes(term) ||
        u.username.toLowerCase().includes(term)
      ) {
        renderProfileCard(u, u.uid);
        found = true;
      }
    });
  }

  if (!found) {
    searchResults.innerHTML = `<p class="muted">No profiles found</p>`;
  }
}


/* -------- ASSETS SEARCH -------- */
async function searchAssets(q, type) {
  const snap = await getDocs(collection(db, "assets"));

  snap.forEach((docu) => {
    const a = docu.data();

    if (
      a.type === type &&
      (a.title.toLowerCase().includes(q.toLowerCase()) ||
        a.tags?.some((t) => t.includes(q.toLowerCase())))
    ) {
      const div = document.createElement("div");
      div.className = "asset-card";
      div.innerHTML = `
          <div class="overlay">
            <h3>${a.title}</h3>
            <p>${a.type.toUpperCase()}</p>
          </div>
        `;
      searchResults.appendChild(div);
    }
  });
}
/* ================= PUBLIC PROFILE DEMO DATA ================= */

/* ================= FAKE USERS DATABASE (DEMO) ================= */

const fakeUsersDB = {
  8473926150: {
    uid: "8473926150",
    name: "Void Otaku",
    username: "void_otaku",
    verified: true,
    status: "🎧 Sound Designer | SFX Lover",
    avatar: "previewImg",
    connects: 128,
    circles: 4,
    skills: ["Editing", "Sound", "Anime", "Gaming"],
    about:
      "I am here to upload and explore sound effects, glass breaks, anime impacts and UI sounds.",
    interests: ["SFX", "Anime", "UI", "Transitions"],
    hobbies: ["Music", "Gaming", "Editing"],
    joined: "12 Aug 2025",
    country: "India 🇮🇳",
    isConnected: false,
  },
  
  1234567890: {
    uid: "1234567890",
    name: "Prince",
    username: "prince.fx",
    verified: false,
    status: "Learning Editing",
    avatar: "previewImg",
    connects: 23,
    circles: 2,
    skills: ["Editing", "Reels"],
    about: "Just started my editing journey.",
    interests: ["Transitions", "Reels"],
    hobbies: ["Music"],
    joined: "30 Jan 2026",
    country: "India 🇮🇳",
    isConnected: false,
    accountType: "user",
  },
};

/* ================= PUBLIC PROFILE RENDER ================= */

/* ================= RENDER PUBLIC PROFILE (HTML MATCHED) ================= */

function renderPublicProfile(user) {
  const page = document.getElementById("public-profile");
  if (!page || !user) return;

  /* ---------- AVATAR ---------- */
  // const avatarImg = page.querySelector("#ppAvatarImg");
  const previewImg = document.getElementById(ppAvatarImg);
  if (previewImg) {
    previewImg.src = user.avatar || "previewImg";
  }
  // if (avatarImg) {
  //   avatarImg.src = user.avatar || "logo.png";
  // }

  /* ---------- NAME + VERIFIED ---------- */
  const nameEl = page.querySelector(".pp-name-lg");
  if (nameEl) {
    nameEl.innerHTML =
      user.name +
      (user.verified ? ' <span class="pp-badge">✔</span>' : "");
  }

  /* ---------- USERNAME ---------- */
  const usernameEl = page.querySelector(".pp-username");
  if (usernameEl) {
    usernameEl.textContent = "@" + (user.username || "unknown");
  }

  /* ---------- STATUS ---------- */
  const statusEl = page.querySelector(".pp-status");
  if (statusEl) {
    statusEl.textContent = user.status || "";
  }

  /* ---------- STATS ---------- */
  const connectsEl = page.querySelector(
    ".pp-stats div:nth-child(1) strong",
  );
  if (connectsEl) {
    connectsEl.textContent = user.connects ?? 0;
  }

  const circlesEl = page.querySelector(
    ".pp-stats div:nth-child(2) strong",
  );
  if (circlesEl) {
    circlesEl.textContent = user.circles ?? 0;
  }

  /* ---------- ABOUT ---------- */
  const aboutEl = page.querySelector(".pp-about-center p");
  if (aboutEl) {
    aboutEl.textContent = user.about || "";
  }

  /* ---------- INTERESTS / HASHTAGS ---------- */
  const hashtagsEl = page.querySelector(".pp-hashtags");
  if (hashtagsEl) {
    if (Array.isArray(user.interests)) {
      hashtagsEl.textContent =
        "#" + user.interests.join(" #");
    } else {
      hashtagsEl.textContent = "";
    }
  }

  /* ---------- FOOTER META ---------- */
  const footerEl = page.querySelector(".pp-footer");
  if (footerEl) {
    let extraHTML = "";

    // ✅ ONLY FOR NORMAL USERS
    if (user.accountType === "user") {
      extraHTML = `
        <p><strong>Account Type:</strong> User</p>
      `;
    }

    footerEl.innerHTML = `
      <p><strong>UID:</strong> ${user.uid || "—"}</p>
      <p><strong>Joined:</strong> ${user.joined || "—"}</p>
      <p><strong>Country:</strong> ${user.country || "—"}</p>
      ${extraHTML}
    `;
  }


  /* ---------- CONNECT BUTTON ---------- */
  const connectBtn = page.querySelector(".pp-actions .primary");
  if (connectBtn) {
    connectBtn.textContent = user.isConnected ? "CONNECTED" : "CONNECT";
    connectBtn.classList.toggle("ghost", !!user.isConnected);

    connectBtn.onclick = () => {
      user.isConnected = !user.isConnected;
      connectBtn.textContent = user.isConnected
        ? "CONNECTED"
        : "CONNECT";
      connectBtn.classList.toggle("ghost", user.isConnected);
    };
  }
  const headerEl = document.querySelector("header");
  if (headerEl && user?.name) {
    headerEl.textContent = user.name;
  }
}

/* ================= OPEN PROFILE BY USER ID ================= */

function openProfileById(userId) {
  const user = fakeUsersDB[userId];

  if (!user) {
    alert("User not found");
    return;
  }

  renderPublicProfile(user);
  setActivePage("public-profile");
}

/* ================= SEARCH USERS ================= */

searchInput?.addEventListener("input", () => {
  const q = searchInput.value.trim().toLowerCase();
  searchResults.innerHTML = "";

  if (!q) return;

  Object.values(fakeUsersDB).forEach((user) => {
    if (user.username.toLowerCase().includes(q)) {
      const div = document.createElement("div");
      div.className = "search-user";

      div.innerHTML = `
          <div class="su-left">
            <img src="${user.avatar}">
          </div>
          <div class="su-mid">
            <strong>${user.name} ${user.verified ? "✔" : ""}</strong>
            <span>@${user.username}</span>
            <small>UID: ${user.uid}</small>
          </div>
        `;

      /* 👉 RESULT CLICK → OPEN PROFILE */
      div.addEventListener("click", () => {
        openProfileById(user.uid);
        searchInput.value = "";
        searchResults.innerHTML = "";
      });

      searchResults.appendChild(div);
    }
  });
});
function renderProfileResults(list) {
  const box = document.getElementById("searchResults");
  if (!box) return;

  box.innerHTML = "";

  if (list.length === 0) {
    box.innerHTML = `<p class="muted">No profiles found</p>`;
    return;
  }

  list.forEach((u) => {
    const div = document.createElement("div");
    div.className = "profile-card";
    div.innerHTML = `
      <img src="${u.photoURL || "logo.png"}">
      <div>
        <b>${u.name}${u.verified ? " ✔" : ""}</b>
        <small>@${u.username}</small>
      </div>
    `;

    div.addEventListener("click", () => openProfileById(u.uid));
    box.appendChild(div);
  });
}

/* ---- SAFE SEARCH FALLBACK (non-destructive) ---- */
window.__nsSearchFallback = function(term, renderProfileCard) {
  if (typeof fakeUsersDB === "undefined") return false;
  let used = false;
  fakeUsersDB.forEach((u) => {
    if (
      (u.name || "").toLowerCase().includes(term) ||
      (u.username || "").toLowerCase().includes(term)
    ) {
      if (typeof renderProfileCard === "function") renderProfileCard(u, u.uid);
      used = true;
    }
  });
  return used;
};

document.addEventListener("click", (e) => {
  const backBtn = e.target.closest(".back-btn");
  if (!backBtn) return;

  e.preventDefault();

  setActivePage(lastActivePage || "home");
});
