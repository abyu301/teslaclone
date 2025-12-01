import './style.css';

// Mobile menu toggle
const menuBtn = document.querySelector("#menu-btn");
const mobileMenu = document.querySelector("#mobile-menu");
const menuClose = document.querySelector("#menu-close");

// Open menu
menuBtn?.addEventListener("click", () => {
  mobileMenu.classList.remove("hidden");
});

// Close menu
menuClose?.addEventListener("click", () => {
  mobileMenu.classList.add("hidden");
});

// click outside menu (overlay) to close
mobileMenu?.addEventListener("click", (e) => {
  if (e.target === mobileMenu) {
    mobileMenu.classList.add("hidden");
  }
});
