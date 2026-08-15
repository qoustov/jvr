const menuButton = document.querySelector("[data-menu-button]");
const nav = document.querySelector("[data-nav]");
const reelButtons = [...document.querySelectorAll("[data-reel]")];
const masterButton = document.querySelector("[data-play-master]");
const audio = document.querySelector("[data-audio-player]");
const player = document.querySelector("[data-master-player]");
const playerToggle = document.querySelector("[data-player-toggle]");
const playerIcon = document.querySelector("[data-player-icon]");
const playerTitle = document.querySelector("[data-player-title]");
const playerProgress = document.querySelector("[data-player-progress]");
const playerTime = document.querySelector("[data-player-time]");
let activeReel = reelButtons[0];

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

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
}

function reflectPlayback() {
  const playing = !audio.paused;
  player.classList.toggle("is-playing", playing);
  playerIcon.textContent = playing ? "❚❚" : "▶";
  playerToggle.setAttribute("aria-label", `${playing ? "Pause" : "Play"} ${activeReel.dataset.title}`);
  reelButtons.forEach((button) => {
    const icon = button.querySelector("i");
    icon.textContent = button === activeReel && playing ? "❚❚" : "▶";
  });
}

function selectReel(button, shouldPlay = true, shouldScroll = false) {
  const changed = activeReel !== button || audio.getAttribute("src") !== button.dataset.src;
  activeReel = button;
  reelButtons.forEach((item) => item.classList.toggle("is-active", item === button));
  playerTitle.textContent = button.dataset.title;

  if (changed) {
    audio.src = button.dataset.src;
    audio.load();
    playerProgress.value = 0;
    playerTime.textContent = `0:00 / ${button.dataset.duration}`;
  }

  if (shouldPlay) {
    if (!changed && !audio.paused) audio.pause();
    else audio.play().catch(() => reflectPlayback());
  }

  if (shouldScroll) player.scrollIntoView({ behavior: "smooth", block: "center" });
}

reelButtons.forEach((button) => {
  button.addEventListener("click", () => selectReel(button, true, true));
});

masterButton.addEventListener("click", () => {
  selectReel(activeReel, true, true);
});

playerToggle.addEventListener("click", () => {
  if (audio.paused) audio.play().catch(() => reflectPlayback());
  else audio.pause();
});

audio.addEventListener("play", reflectPlayback);
audio.addEventListener("pause", reflectPlayback);
audio.addEventListener("ended", reflectPlayback);
audio.addEventListener("timeupdate", () => {
  const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
  playerProgress.value = duration ? Math.round((audio.currentTime / duration) * 1000) : 0;
  playerTime.textContent = `${formatTime(audio.currentTime)} / ${formatTime(duration)}`;
});
audio.addEventListener("loadedmetadata", () => {
  playerTime.textContent = `0:00 / ${formatTime(audio.duration)}`;
});
playerProgress.addEventListener("input", () => {
  if (Number.isFinite(audio.duration)) audio.currentTime = (Number(playerProgress.value) / 1000) * audio.duration;
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
