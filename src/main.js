import './style.css';

// Mobile menu toggle
const menuBtn = document.querySelector("#menu-btn");
const nav = document.querySelector("nav");

menuBtn?.addEventListener("click", () => {
  nav.classList.toggle("hidden");
});