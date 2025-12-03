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



// Slider

const slides = document.querySelectorAll(".slide");
let index = 0;

// Show initial slide
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

// Add button listeners safely
document.getElementById("next")?.addEventListener("click", nextSlide);
document.getElementById("prev")?.addEventListener("click", prevSlide);

// Auto-slide
setInterval(nextSlide, 4000);


// Showcase Carousel
const track = document.getElementById("showcase-track");
const dots = document.querySelectorAll(".dot");
let scIndex = 0;

function updateShowcase() {
  const cardWidth = document.querySelector(".showcase-card").offsetWidth;
  track.style.transform = `translateX(-${scIndex * cardWidth}px)`;

  dots.forEach((dot, i) => {
    dot.style.backgroundColor = i === scIndex ? "black" : "gray";
  });
}

// Dot click
dots.forEach((dot, i) => {
  dot.addEventListener("click", () => {
    scIndex = i;
    updateShowcase();
  });
});

// Initialize
updateShowcase();
