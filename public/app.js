const menuButton = document.querySelector("[data-menu-button]");
const nav = document.querySelector("[data-nav]");
const reelButtons = [...document.querySelectorAll("[data-reel]")];
const masterButton = document.querySelector("[data-play-master]");
const playerStatus = document.querySelector("[data-player-status]");
const reelNotice = document.querySelector("[data-reel-notice]");

function closeMenu() {
  nav.classList.remove("is-open");
  document.body.classList.remove("menu-open");
  menuButton.setAttribute("aria-expanded", "false");
}

menuButton.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!open));
  nav.classList.toggle("is-open", !open);
  document.body.classList.toggle("menu-open", !open);
});

nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

function selectReel(name, button) {
  reelButtons.forEach((item) => item.classList.toggle("is-active", item === button));
  playerStatus.textContent = `${name} reel selected`;
  reelNotice.hidden = false;
  document.querySelector("[data-master-player]").scrollIntoView({ behavior: "smooth", block: "center" });
}

reelButtons.forEach((button) => {
  button.addEventListener("click", () => selectReel(button.dataset.reel, button));
});

masterButton.addEventListener("click", () => {
  document.querySelector("#reels").scrollIntoView({ behavior: "smooth" });
  playerStatus.textContent = "Choose a voice direction";
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
document.querySelector("[data-year]").textContent = new Date().getFullYear();
