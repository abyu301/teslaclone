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

// Slider (hero)
const slides = document.querySelectorAll(".slide");
let index = 0;
showSlide(index);
function showSlide(i) {
  slides.forEach((slide, idx) => {
    slide.style.opacity = idx === i ? "1" : "0";
  });
}
function nextSlide() {
  index = (index + 1) % slides.length;
  showSlide(index);
}
function prevSlide() {
  index = (index - 1 + slides.length) % slides.length;
  showSlide(index);
}
document.getElementById("next")?.addEventListener("click", nextSlide);
document.getElementById("prev")?.addEventListener("click", prevSlide);
setInterval(nextSlide, 4000);


// ===== Showcase Carousel (center active, neighbors scaled, ends show two full cards) =====
const track = document.getElementById("showcase-track");
const dots = Array.from(document.querySelectorAll(".dot"));
let scIndex = 0;

function applySizingClasses(cards) {
  // sizing strategy:
  // - For normal middle states:
  //   active -> larger (66%), adjacent -> smaller (42%), others -> 36%
  // - For start/end states (scIndex === 0 or last):
  //   show first two / last two as full-width 50% each
  const activeFlex = "66%";
  const adjacentFlex = "42%";
  const normalFlex = "36%";
  const endFlex = "50%";

  const lastIndex = cards.length - 1;

  cards.forEach((card, i) => {
    card.classList.remove("active", "adjacent", "end-two");
    // Reset inline flex-basis before assigning
    card.style.flex = "";
  });

  if (scIndex === 0 && cards.length >= 2) {
    // first dot: make first two full-width
    cards[0].classList.add("active", "end-two");
    cards[1].classList.add("active", "end-two");
    cards[0].style.flex = `0 0 ${endFlex}`;
    cards[1].style.flex = `0 0 ${endFlex}`;
    // make others small
    for (let i = 2; i < cards.length; i++) cards[i].style.flex = `0 0 ${normalFlex}`;
    return;
  }

  if (scIndex === lastIndex && cards.length >= 2) {
    // last dot: make last two full-width
    cards[lastIndex].classList.add("active", "end-two");
    cards[lastIndex - 1].classList.add("active", "end-two");
    cards[lastIndex].style.flex = `0 0 ${endFlex}`;
    cards[lastIndex - 1].style.flex = `0 0 ${endFlex}`;
    // make others small
    for (let i = 0; i < lastIndex - 1; i++) cards[i].style.flex = `0 0 ${normalFlex}`;
    return;
  }

  // Normal (centered) states:
  cards.forEach((card, i) => {
    if (i === scIndex) {
      card.classList.add("active");
      card.style.flex = `0 0 ${activeFlex}`;
    } else if (i === scIndex - 1 || i === scIndex + 1) {
      card.classList.add("adjacent");
      card.style.flex = `0 0 ${adjacentFlex}`;
    } else {
      card.style.flex = `0 0 ${normalFlex}`;
    }
  });
}

function updateShowcase() {
  if (!track) return;
  const cards = Array.from(track.querySelectorAll(".showcase-card"));
  if (cards.length === 0) return;

  const container = track.parentElement;
  if (!container) return;

  // Apply sizing (this sets flex-basis inline which affects layout)
  applySizingClasses(cards);

  // Need to wait one frame so widths update after flex changes
  requestAnimationFrame(() => {
    const containerWidth = container.getBoundingClientRect().width;
    const trackWidth = track.scrollWidth;

    // When centered: compute translate so active card is centered.
    // Use bounding rect of the active card (or card 0/last for end states).
    let activeCard = cards[scIndex];

    // For end-two cases, center on the first of the two for translate calculation,
    // but we'll special-case translate to 0 or max anyway so it won't matter much.
    if (!activeCard) activeCard = cards[0];

    const activeRect = activeCard.getBoundingClientRect();
    const activeWidth = activeRect.width;

    // offsetLeft of active card relative to track
    const activeOffsetLeft = activeCard.offsetLeft;

    // Desired translate to center active card
    const desiredTranslateCenter = activeOffsetLeft - (containerWidth - activeWidth) / 2;

    // Clamp
    const maxTranslate = Math.max(0, trackWidth - containerWidth);
    let translate = Math.min(Math.max(0, desiredTranslateCenter), maxTranslate);

    // Special-case ends: first -> translate = 0; last -> translate = maxTranslate
    const lastIndex = cards.length - 1;
    if (scIndex === 0) translate = 0;
    if (scIndex === lastIndex) translate = maxTranslate;

    track.style.transform = `translateX(-${translate}px)`;

    // Update dot colors
    dots.forEach((dot, i) => {
      dot.style.backgroundColor = i === scIndex ? "black" : "gray";
    });

    // Update accessibility attributes (optional)
    cards.forEach((card, i) => {
      card.setAttribute("aria-hidden", i === scIndex ? "false" : "true");
    });
  });
}

// Dot click
dots.forEach((dot, i) => {
  dot.addEventListener("click", () => {
    scIndex = i;
    updateShowcase();
  });
});

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

window.addEventListener("resize", () => requestAnimationFrame(updateShowcase));

// Showcase Prev / Next buttons
document.getElementById("showcase-next")?.addEventListener("click", () => {
  const cards = track.querySelectorAll(".showcase-card");
  scIndex = Math.min(scIndex + 1, cards.length - 1);
  updateShowcase();
});

document.getElementById("showcase-prev")?.addEventListener("click", () => {
  scIndex = Math.max(scIndex - 1, 0);
  updateShowcase();
});

// Initialize
updateShowcase();
