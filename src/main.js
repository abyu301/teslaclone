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
  card.classList.remove("size-active", "size-adj", "size-normal", "size-end", "active", "adjacent", "end-two");
  card.style.flex = "";
}

function applySizingClasses(cards) {
  const lastIndex = cards.length - 1;
  cards.forEach(c => clearAllSizeClasses(c));

  if (scIndex === 0 && cards.length >= 2) {
    cards[0].classList.add("size-end", "active", "end-two");
    cards[1].classList.add("size-end", "active", "end-two");
    for (let i = 2; i < cards.length; i++) cards[i].classList.add("size-normal");
    return;
  }

  if (scIndex === lastIndex && cards.length >= 2) {
    cards[lastIndex].classList.add("size-end", "active", "end-two");
    cards[lastIndex - 1].classList.add("size-end", "active", "end-two");
    for (let i = 0; i < lastIndex - 1; i++) cards[i].classList.add("size-normal");
    return;
  }

  cards.forEach((card, i) => {
    if (i === scIndex) {
      card.classList.add("size-active", "active");
    } else if (i === scIndex - 1 || i === scIndex + 1) {
      card.classList.add("size-adj", "adjacent");
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

  applySizingClasses(cards);

  requestAnimationFrame(() => {
    const containerWidth = container.getBoundingClientRect().width;
    const trackWidth = track.scrollWidth;

    let activeCard = cards[scIndex] || cards[0];
    const activeRect = activeCard.getBoundingClientRect();
    const activeWidth = activeRect.width;
    const activeOffsetLeft = activeCard.offsetLeft;

    const desiredTranslateCenter =
      activeOffsetLeft - (containerWidth - activeWidth) / 2;

    const maxTranslate = Math.max(0, trackWidth - containerWidth);
    let translate = Math.min(Math.max(0, desiredTranslateCenter), maxTranslate);

    const lastIndex = cards.length - 1;

    if (scIndex === 0) translate = 0;
    if (scIndex === lastIndex) translate = maxTranslate;

    track.style.transform = `translateX(-${translate}px)`;

    dots.forEach((dot, i) => {
      dot.style.backgroundColor = i === scIndex ? "black" : "gray";
    });

    cards.forEach((card, i) =>
      card.setAttribute("aria-hidden", i === scIndex ? "false" : "true")
    );

    updateArrowsVisibility(cards.length);
  });
}

dots.forEach((dot, i) =>
  dot.addEventListener("click", () => {
    scIndex = i;
    updateShowcase();
  })
);

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") {
    scIndex = Math.min(scIndex + 1, track.querySelectorAll(".showcase-card").length - 1);
    updateShowcase();
  } else if (e.key === "ArrowLeft") {
    scIndex = Math.max(scIndex - 1, 0);
    updateShowcase();
  }
});

nextBtn?.addEventListener("click", () => {
  scIndex = Math.min(scIndex + 1, track.querySelectorAll(".showcase-card").length - 1);
  updateShowcase();
});
prevBtn?.addEventListener("click", () => {
  scIndex = Math.max(scIndex - 1, 0);
  updateShowcase();
});

window.addEventListener("resize", () => requestAnimationFrame(updateShowcase));

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




/* ============================================================
    ===  SECOND SLIDER (SECTION B) — Independent Clone     ===
   ============================================================ */

function initSliderB() {
  const trackB = document.getElementById("solar-track");
  if (!trackB) return; // exit if section B does not exist yet

  const dotsB = Array.from(document.querySelectorAll(".solar-dot"));
  const prevBtnB = document.getElementById("solar-prev");
  const nextBtnB = document.getElementById("solar-next");

  let scIndexB = 0;

  function clearAllSizeClassesB(card) {
    card.classList.remove(
      "size-active","size-adj","size-normal","size-end",
      "active","adjacent","end-two"
    );
    card.style.flex = "";
  }

  function applySizingClassesB(cards) {
    const lastIndex = cards.length - 1;
    cards.forEach(c => clearAllSizeClassesB(c));

    if (scIndexB === 0 && cards.length >= 2) {
      cards[0].classList.add("size-end","active","end-two");
      cards[1].classList.add("size-end","active","end-two");
      for (let i = 2; i < cards.length; i++) cards[i].classList.add("size-normal");
      return;
    }

    if (scIndexB === lastIndex && cards.length >= 2) {
      cards[lastIndex].classList.add("size-end","active","end-two");
      cards[lastIndex - 1].classList.add("size-end","active","end-two");
      for (let i = 0; i < lastIndex - 1; i++) cards[i].classList.add("size-normal");
      return;
    }

    cards.forEach((card, i) => {
      if (i === scIndexB) {
        card.classList.add("size-active", "active");
      } else if (i === scIndexB - 1 || i === scIndexB + 1) {
        card.classList.add("size-adj", "adjacent");
      } else {
        card.classList.add("size-normal");
      }
    });
  }

  function updateArrowsVisibilityB(cardsCount) {
    if (!prevBtnB || !nextBtnB) return;
    prevBtnB.classList.toggle("arrow-hidden", scIndexB === 0);
    nextBtnB.classList.toggle("arrow-hidden", scIndexB === Math.max(0, cardsCount - 1));
  }

  function updateShowcaseB() {
    const cards = Array.from(trackB.querySelectorAll(".solar-card"));
    if (!cards.length) return;

    const container = trackB.parentElement;
    if (!container) return;

    applySizingClassesB(cards);

    requestAnimationFrame(() => {
      const containerWidth = container.getBoundingClientRect().width;
      const trackWidth = trackB.scrollWidth;

      let activeCard = cards[scIndexB] || cards[0];
      const activeRect = activeCard.getBoundingClientRect();
      const activeWidth = activeRect.width;
      const activeOffsetLeft = activeCard.offsetLeft;

      const desiredTranslateCenter =
        activeOffsetLeft - (containerWidth - activeWidth) / 2;

      const maxTranslate = Math.max(0, trackWidth - containerWidth);
      let translate = Math.min(Math.max(0, desiredTranslateCenter), maxTranslate);

      const lastIndex = cards.length - 1;

      if (scIndexB === 0) translate = 0;
      if (scIndexB === lastIndex) translate = maxTranslate;

      trackB.style.transform = `translateX(-${translate}px)`;

      dotsB.forEach((dot, i) => {
        dot.style.backgroundColor = i === scIndexB ? "black" : "gray";
      });

      cards.forEach((card, i) =>
        card.setAttribute("aria-hidden", i === scIndexB ? "false" : "true")
      );

      updateArrowsVisibilityB(cards.length);
    });
  }

  dotsB.forEach((dot, i) =>
    dot.addEventListener("click", () => {
      scIndexB = i;
      updateShowcaseB();
    })
  );

  nextBtnB?.addEventListener("click", () => {
    const cards = trackB.querySelectorAll(".solar-card");
    scIndexB = Math.min(scIndexB + 1, cards.length - 1);
    updateShowcaseB();
  });

  prevBtnB?.addEventListener("click", () => {
    scIndexB = Math.max(scIndexB - 1, 0);
    updateShowcaseB();
  });

  // Resize
  window.addEventListener("resize", () => requestAnimationFrame(updateShowcaseB));

  // Init
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", updateShowcaseB);
  } else {
    updateShowcaseB();
  }
}

// Run it
initSliderB();




// ===========================
// ASK QUESTION INPUT LOGIC
// ===========================

// Elements
const questionInput = document.getElementById("questionInput");
const staticLabel = document.getElementById("staticLabel");
const arrowBox = document.getElementById("arrowBox");

// Placeholder suggestions that rotate
const suggestions = [
  "Would you like to know how I built this UI?",
  "Need a developer to build something similar?",
  "Should I add more features to this clone?",
  "Interested in the tools I used for this clone?"
];


let placeholderIndex = 0;

// Change placeholder every 2 seconds
setInterval(() => {
  if (document.activeElement === questionInput) return; // don't rotate while typing

  placeholderIndex = (placeholderIndex + 1) % suggestions.length;
  questionInput.placeholder = suggestions[placeholderIndex];
}, 3000);


// When input loses focus → show label *if it's empty*
questionInput.addEventListener("blur", () => {
  if (questionInput.value.trim() === "") {
    staticLabel.classList.remove("opacity-0");
  }
});

// While typing → turn arrow blue
questionInput.addEventListener("input", () => {
  if (questionInput.value.trim() !== "") {
    arrowBox.classList.remove("bg-gray-100");
    arrowBox.classList.add("bg-blue-500");
  } else {
    arrowBox.classList.remove("bg-blue-500");
    arrowBox.classList.add("bg-gray-100");
  }
});




// ===========================
// GOOGLE MAPS INTEGRATION
// ===========================
const apiKey = import.meta.env.VITE_GOOGLE_MAPS_KEY;

// Dynamically load Google Maps Script
function loadGoogleMaps() {
  const script = document.createElement("script");
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
  script.async = true;
  window.initMap = initMap;
  document.head.appendChild(script);
}

loadGoogleMaps();


  
let map;

function initMap() {
  const defaultPos = { lat: 37.7749, lng: -122.4194 };

  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 10,
    center: defaultPos,
    mapId: "DEMO_MAP_ID"
  });
}

function findMe() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((pos) => {
      const userPos = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      };
      map.setCenter(userPos);
      map.setZoom(13);

      new google.maps.Marker({
        position: userPos,
        map: map
      });
    });
  }
}


