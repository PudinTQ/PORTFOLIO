// Mobile menu
const burger = document.getElementById("burger");
const nav = document.getElementById("nav");

burger.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  burger.classList.toggle("open", isOpen);
  burger.setAttribute("aria-expanded", isOpen);
});

nav.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    burger.classList.remove("open");
    burger.setAttribute("aria-expanded", false);
  })
);

// Header shadow on scroll
const header = document.getElementById("header");
window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 10);
});

// Reveal on scroll + animated counters
const animateCount = (el) => {
  const target = Number(el.dataset.count);
  const duration = 1600;
  const start = performance.now();
  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(target * eased).toLocaleString("en-US");
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      entry.target.querySelectorAll("[data-count]").forEach(animateCount);
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.15 }
);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// Reviews slider
const track = document.getElementById("sliderTrack");
const dotsWrap = document.getElementById("sliderDots");
const slides = track.children.length;
let current = 0;

const goTo = (index) => {
  current = (index + slides) % slides;
  track.style.transform = `translateX(-${current * 100}%)`;
  [...dotsWrap.children].forEach((dot, i) => dot.classList.toggle("active", i === current));
};

for (let i = 0; i < slides; i++) {
  const dot = document.createElement("button");
  dot.setAttribute("aria-label", `Show review ${i + 1}`);
  dot.addEventListener("click", () => {
    goTo(i);
    restartAutoplay();
  });
  dotsWrap.appendChild(dot);
}

let autoplay;
const restartAutoplay = () => {
  clearInterval(autoplay);
  autoplay = setInterval(() => goTo(current + 1), 6000);
};
goTo(0);
restartAutoplay();

// Booking form (demo — no backend)
const form = document.getElementById("bookingForm");
const msg = document.getElementById("formMsg");
form.date.min = new Date().toISOString().split("T")[0];

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let valid = true;
  form.querySelectorAll("[required]").forEach((input) => {
    const ok = input.checkValidity() && input.value.trim() !== "";
    input.classList.toggle("invalid", !ok);
    if (!ok) valid = false;
  });

  if (!valid) {
    msg.textContent = "Please fill in all required fields.";
    msg.className = "form__msg err";
    return;
  }

  msg.textContent = `Thanks, ${form.first.value}! We'll call you within one business hour to confirm.`;
  msg.className = "form__msg ok";
  form.reset();
});

document.getElementById("year").textContent = new Date().getFullYear();
