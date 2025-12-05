// /src/main.js
import './style.css';

// Mobile Menu
const menuBtn = document.querySelector("#menu-btn");
const mobileMenu = document.querySelector("#mobile-menu");
const menuClose = document.querySelector("#menu-close");

menuBtn?.addEventListener("click", () => {
  mobileMenu.classList.remove("hidden");
});
menuClose?.addEventListener("click", () => {
  mobileMenu.classList.add("hidden");
});
mobileMenu?.addEventListener("click", (e) => {
  if (e.target === mobileMenu) mobileMenu.classList.add("hidden");
});

// Hero slider (unchanged)
const slides = document.querySelectorAll(".slide");
let index = 0;
showSlide(index);
function showSlide(i) {
  slides.forEach((slide, idx) => {
    slide.style.opacity = idx === i ? "1" : "0";
  });
}
function nextSlide() { index = (index + 1) % slides.length; showSlide(index); }
function prevSlide() { index = (index - 1 + slides.length) % slides.length; showSlide(index); }
document.getElementById("next")?.addEventListener("click", nextSlide);
document.getElementById("prev")?.addEventListener("click", prevSlide);
setInterval(nextSlide, 4000);

// ===== Showcase Carousel (class-driven sizing) =====
const track = document.getElementById("showcase-track");
const dots = Array.from(document.querySelectorAll(".dot"));
const prevBtn = document.getElementById("showcase-prev");
const nextBtn = document.getElementById("showcase-next");
let scIndex = 0;

function clearAllSizeClasses(card) {
  card.classList.remove("size-active","size-adj","size-normal","size-end","active","adjacent","end-two");
  // remove any leftover inline flex (defensive)
  card.style.flex = "";
}

function applySizingClasses(cards) {
  const lastIndex = cards.length - 1;
  cards.forEach(c => clearAllSizeClasses(c));

  if (scIndex === 0 && cards.length >= 2) {
    // first dot: first two full-width (size-end)
    cards[0].classList.add("size-end","active","end-two");
    cards[1].classList.add("size-end","active","end-two");
    for (let i = 2; i < cards.length; i++) cards[i].classList.add("size-normal");
    return;
  }

  if (scIndex === lastIndex && cards.length >= 2) {
    // last dot: last two full-width
    cards[lastIndex].classList.add("size-end","active","end-two");
    cards[lastIndex - 1].classList.add("size-end","active","end-two");
    for (let i = 0; i < lastIndex - 1; i++) cards[i].classList.add("size-normal");
    return;
  }

  // Normal centered case
  cards.forEach((card, i) => {
    if (i === scIndex) {
      card.classList.add("size-active","active");
    } else if (i === scIndex - 1 || i === scIndex + 1) {
      card.classList.add("size-adj","adjacent");
    } else {
      card.classList.add("size-normal");
    }
  });
}

function updateArrowsVisibility(cardsCount) {
  if (!prevBtn || !nextBtn) return;
  prevBtn.classList.toggle("arrow-hidden", scIndex === 0);
  nextBtn.classList.toggle("arrow-hidden", scIndex === Math.max(0, cardsCount - 1));
}

function updateShowcase() {
  if (!track) return;
  const cards = Array.from(track.querySelectorAll(".showcase-card"));
  if (!cards.length) return;
  const container = track.parentElement;
  if (!container) return;

  // apply classes (CSS handles flex sizes per breakpoint)
  applySizingClasses(cards);

  // wait for layout to settle after classes applied
  requestAnimationFrame(() => {
    const containerWidth = container.getBoundingClientRect().width;
    const trackWidth = track.scrollWidth;

    // choose a reference card for centering (use current scIndex)
    let activeCard = cards[scIndex] || cards[0];
    const activeRect = activeCard.getBoundingClientRect();
    const activeWidth = activeRect.width;
    const activeOffsetLeft = activeCard.offsetLeft;

    // translate needed to center the active card
    const desiredTranslateCenter = activeOffsetLeft - (containerWidth - activeWidth) / 2;
    const maxTranslate = Math.max(0, trackWidth - containerWidth);
    let translate = Math.min(Math.max(0, desiredTranslateCenter), maxTranslate);

    // special-case ends to align edges
    const lastIndex = cards.length - 1;
    if (scIndex === 0) translate = 0;
    if (scIndex === lastIndex) translate = maxTranslate;

    track.style.transform = `translateX(-${translate}px)`;

    // update dots colors
    dots.forEach((dot, i) => dot.style.backgroundColor = i === scIndex ? "black" : "gray");

    // accessibility
    cards.forEach((card, i) => card.setAttribute("aria-hidden", i === scIndex ? "false" : "true"));

    // arrows visibility
    updateArrowsVisibility(cards.length);
  });
}

// dot click
dots.forEach((dot, i) => dot.addEventListener("click", () => { scIndex = i; updateShowcase(); }));

// keyboard nav
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") {
    scIndex = Math.min(scIndex + 1, track.querySelectorAll(".showcase-card").length - 1);
    updateShowcase();
  } else if (e.key === "ArrowLeft") {
    scIndex = Math.max(scIndex - 1, 0);
    updateShowcase();
  }
});

// arrows
nextBtn?.addEventListener("click", () => {
  scIndex = Math.min(scIndex + 1, track.querySelectorAll(".showcase-card").length - 1);
  updateShowcase();
});
prevBtn?.addEventListener("click", () => {
  scIndex = Math.max(scIndex - 1, 0);
  updateShowcase();
});

// resize handler
window.addEventListener("resize", () => requestAnimationFrame(updateShowcase));

// init
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", updateShowcase);
} else {
  updateShowcase();
}

// ===== FSD Video Pause/Play Toggle =====
const video = document.querySelector("video");
  const toggleBtn = document.getElementById("videoToggle");
  const icon = document.getElementById("toggleIcon");

  toggleBtn.addEventListener("click", () => {
    if (video.paused) {
      video.play();
      icon.src = "/public/img/icons/puse.svg";   // play → show pause icon
    } else {
      video.pause();
      icon.src = "/public/img/icons/play.svg";   // pause → show play icon
    }
  });