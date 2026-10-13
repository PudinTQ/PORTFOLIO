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

// Class schedule
const schedule = {
  Mon: [["6:00 AM", "Strength Lab", "Marcus Johnson", 4], ["9:30 AM", "Mobility Flow", "Rachel Wu", 12], ["12:15 PM", "Burn HIIT", "Elena Lopez", 0], ["6:00 PM", "Fight Club", "Kenji Ota", 6]],
  Tue: [["6:00 AM", "Burn HIIT", "Elena Lopez", 8], ["12:15 PM", "Strength Lab", "Marcus Johnson", 3], ["5:30 PM", "Spin 45", "Elena Lopez", 10], ["7:00 PM", "Fight Club", "Kenji Ota", 2]],
  Wed: [["6:00 AM", "Strength Lab", "Marcus Johnson", 5], ["9:30 AM", "Mobility Flow", "Rachel Wu", 14], ["6:00 PM", "Burn HIIT", "Elena Lopez", 0], ["7:15 PM", "Olympic Lifting", "Marcus Johnson", 6]],
  Thu: [["6:00 AM", "Fight Club", "Kenji Ota", 9], ["12:15 PM", "Burn HIIT", "Elena Lopez", 2], ["5:30 PM", "Strength Lab", "Marcus Johnson", 7], ["7:00 PM", "Spin 45", "Elena Lopez", 11]],
  Fri: [["6:00 AM", "Burn HIIT", "Elena Lopez", 3], ["12:15 PM", "Strength Lab", "Marcus Johnson", 8], ["5:30 PM", "Fight Club", "Kenji Ota", 5]],
  Sat: [["8:00 AM", "Team WOD", "Marcus Johnson", 1], ["9:30 AM", "Fight Club", "Kenji Ota", 7], ["11:00 AM", "Mobility Flow", "Rachel Wu", 15]],
  Sun: [["9:00 AM", "Spin 45", "Elena Lopez", 9], ["10:30 AM", "Mobility Flow", "Rachel Wu", 16]],
};

const daysWrap = document.getElementById("days");
const list = document.getElementById("schedule-list");
const dayNames = Object.keys(schedule);

const spotsLabel = (n) => {
  if (n === 0) return '<span class="spots full">Full</span>';
  if (n <= 3) return `<span class="spots low">${n} spot${n > 1 ? "s" : ""} left</span>`;
  return `<span class="spots">${n} spots</span>`;
};

const renderDay = (day) => {
  [...daysWrap.children].forEach((b) => {
    const active = b.textContent === day;
    b.classList.toggle("active", active);
    b.setAttribute("aria-selected", active);
  });
  list.innerHTML = schedule[day]
    .map(
      ([time, name, coach, spots], i) => `
      <div class="class-row" style="animation-delay:${i * 70}ms">
        <time>${time}</time>
        <h3>${name}</h3>
        <span class="coach-name">with ${coach}</span>
        ${spotsLabel(spots)}
      </div>`
    )
    .join("");
};

dayNames.forEach((day) => {
  const btn = document.createElement("button");
  btn.textContent = day;
  btn.setAttribute("role", "tab");
  btn.addEventListener("click", () => renderDay(day));
  daysWrap.appendChild(btn);
});

// Start on today's day (JS: 0 = Sunday)
const todayIndex = (new Date().getDay() + 6) % 7;
renderDay(dayNames[todayIndex]);

// Pricing toggle
const toggle = document.getElementById("billingToggle");
const lblMonthly = document.getElementById("lblMonthly");
const lblAnnual = document.getElementById("lblAnnual");

toggle.addEventListener("click", () => {
  const annual = toggle.getAttribute("aria-checked") !== "true";
  toggle.setAttribute("aria-checked", annual);
  lblMonthly.classList.toggle("active", !annual);
  lblAnnual.classList.toggle("active", annual);
  document.querySelectorAll(".amount").forEach((el) => {
    el.style.opacity = 0;
    setTimeout(() => {
      el.textContent = annual ? el.dataset.annual : el.dataset.monthly;
      el.style.opacity = 1;
    }, 150);
  });
});

// BMI calculator
const bmiForm = document.getElementById("bmiForm");
bmiForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const inches = Number(bmiForm.ft.value) * 12 + Number(bmiForm.in.value);
  const lb = Number(bmiForm.lb.value);
  if (!inches || !lb) return;

  const bmi = (703 * lb) / (inches * inches);
  let label = "Healthy weight";
  if (bmi < 18.5) label = "Underweight";
  else if (bmi >= 30) label = "Obese range";
  else if (bmi >= 25) label = "Overweight";

  document.getElementById("bmiValue").textContent = bmi.toFixed(1);
  document.getElementById("bmiLabel").textContent = label;

  // Scale 15–40 onto the bar
  const pct = Math.min(Math.max(((bmi - 15) / 25) * 100, 0), 100);
  const marker = document.getElementById("bmiMarker");
  marker.style.opacity = 1;
  marker.style.left = `${pct}%`;
});

// Trial form (demo — no backend)
const trialForm = document.getElementById("trialForm");
const trialMsg = document.getElementById("trialMsg");

trialForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let valid = true;
  trialForm.querySelectorAll("[required]").forEach((input) => {
    const ok = input.checkValidity() && input.value.trim() !== "";
    input.classList.toggle("invalid", !ok);
    if (!ok) valid = false;
  });

  if (!valid) {
    trialMsg.textContent = "Please enter your name and a valid email.";
    trialMsg.className = "trial__msg err";
    return;
  }

  // form.elements.name, because form.name is the form's own name attribute
  const firstName = trialForm.elements.name.value.trim().split(" ")[0];
  trialMsg.textContent = `You're in, ${firstName}! Check your email for your 7-day pass.`;
  trialMsg.className = "trial__msg ok";
  trialForm.reset();
});

document.getElementById("year").textContent = new Date().getFullYear();
