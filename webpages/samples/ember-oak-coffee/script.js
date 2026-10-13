// Mobile menu
const burger = document.getElementById("burger");
const nav = document.getElementById("nav");

const setMenu = (open) => {
  nav.classList.toggle("open", open);
  burger.classList.toggle("open", open);
  burger.setAttribute("aria-expanded", open);
  document.body.style.overflow = open ? "hidden" : "";
};

burger.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));

// Header background on scroll
const header = document.getElementById("header");
const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 20);
window.addEventListener("scroll", onScroll);
onScroll();

// Reveal on scroll
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// Menu tabs
const tabs = document.querySelectorAll(".tab");
tabs.forEach((tab) =>
  tab.addEventListener("click", () => {
    tabs.forEach((t) => {
      t.classList.toggle("active", t === tab);
      t.setAttribute("aria-selected", t === tab);
    });
    document.querySelectorAll(".menu").forEach((menu) =>
      menu.classList.toggle("active", menu.id === tab.dataset.tab)
    );
  })
);

// Toast helper
const toast = document.getElementById("toast");
let toastTimer;
const showToast = (text) => {
  toast.textContent = text;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
};

// "Add to bag" buttons (demo)
let bagCount = 0;
document.querySelectorAll(".add").forEach((btn) =>
  btn.addEventListener("click", () => {
    bagCount++;
    showToast(`☕ ${btn.dataset.name} added — ${bagCount} item${bagCount > 1 ? "s" : ""} in your bag`);
  })
);

// Opening hours: highlight today and show open/closed status
const hours = {
  0: [9, 16], 1: [7, 17], 2: [7, 17], 3: [7, 17], 4: [7, 19], 5: [7, 19], 6: [8, 18],
};
const now = new Date();
const day = now.getDay();
const hour = now.getHours() + now.getMinutes() / 60;
const [opens, closes] = hours[day];
const status = document.getElementById("openStatus");

document.querySelector(`.hours tr[data-day="${day}"]`).classList.add("today");

if (hour >= opens && hour < closes) {
  status.textContent = `Open now · until ${closes}:00`;
  status.style.setProperty("--dot", "#16a34a");
} else {
  status.textContent = hour < opens ? `Closed · opens today at ${opens}:00` : "Closed · see you tomorrow";
  status.style.setProperty("--dot", "#dc2626");
}

// Newsletter (demo — no backend)
const newsForm = document.getElementById("newsForm");
const newsMsg = document.getElementById("newsMsg");
newsForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!newsForm.email.checkValidity() || !newsForm.email.value) {
    newsMsg.textContent = "Please enter a valid email address.";
    return;
  }
  newsMsg.textContent = "You're in! Check your inbox for your free coffee voucher. ☕";
  newsForm.reset();
});

document.getElementById("year").textContent = new Date().getFullYear();
