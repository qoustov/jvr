const menuButton = document.querySelector("[data-menu-button]");
const menuLabel = document.querySelector("[data-menu-label]");
const nav = document.querySelector("[data-nav]");
const reelButtons = [...document.querySelectorAll("[data-reel]")];
const masterButton = document.querySelector("[data-play-master]");
const masterIcon = masterButton.querySelector(".play-icon");
const masterAction = document.querySelector("[data-master-action]");
const masterTitle = document.querySelector("[data-master-title]");
const audio = document.querySelector("[data-audio-player]");
const player = document.querySelector("[data-master-player]");
const playerToggle = document.querySelector("[data-player-toggle]");
const playerIcon = document.querySelector("[data-player-icon]");
const playerTitle = document.querySelector("[data-player-title]");
const playerProgress = document.querySelector("[data-player-progress]");
const playerTime = document.querySelector("[data-player-time]");
const galleryGrid = document.querySelector("[data-gallery-grid]");
const galleryItems = [...document.querySelectorAll("[data-gallery-item]")];
const galleryToggle = document.querySelector("[data-gallery-toggle]");
const lightbox = document.querySelector("[data-lightbox]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxCaption = document.querySelector("[data-lightbox-caption]");
const enquiryForm = document.querySelector("[data-enquiry-form]");
let activeReel = reelButtons[0];
let menuReturnTarget = null;
let activeGalleryIndex = 0;
let galleryReturnTarget = null;

function closeMenu(restoreFocus = false) {
  nav.classList.remove("is-open");
  document.body.classList.remove("menu-open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open menu");
  menuLabel.textContent = "Open menu";
  if (restoreFocus && menuReturnTarget) menuReturnTarget.focus();
}

menuButton.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") === "true";
  if (open) {
    closeMenu(true);
    return;
  }
  menuReturnTarget = document.activeElement;
  menuButton.setAttribute("aria-expanded", String(!open));
  menuButton.setAttribute("aria-label", "Close menu");
  menuLabel.textContent = "Close menu";
  nav.classList.toggle("is-open", !open);
  document.body.classList.toggle("menu-open", !open);
  nav.querySelector("a").focus();
});

nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => closeMenu(false)));

document.addEventListener("keydown", (event) => {
  if (!nav.classList.contains("is-open")) return;

  if (event.key === "Escape") {
    event.preventDefault();
    closeMenu(true);
    return;
  }

  if (event.key !== "Tab") return;
  const focusable = [menuButton, ...nav.querySelectorAll("a")];
  const currentIndex = focusable.indexOf(document.activeElement);
  const step = event.shiftKey ? -1 : 1;
  const nextIndex = currentIndex < 0
    ? 0
    : (currentIndex + step + focusable.length) % focusable.length;
  event.preventDefault();
  focusable[nextIndex].focus();
});

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
}

function reflectPlayback() {
  const playing = !audio.paused;
  player.classList.toggle("is-playing", playing);
  playerIcon.textContent = playing ? "❚❚" : "▶";
  masterIcon.textContent = playing ? "❚❚" : "▶";
  masterAction.textContent = playing ? "Pause" : "Play";
  masterTitle.textContent = activeReel.dataset.title;
  masterButton.setAttribute("aria-pressed", String(playing));
  masterButton.setAttribute("aria-label", `${playing ? "Pause" : "Play"} ${activeReel.dataset.title}`);
  playerToggle.setAttribute("aria-label", `${playing ? "Pause" : "Play"} ${activeReel.dataset.title}`);
  reelButtons.forEach((button) => {
    const icon = button.querySelector("i");
    icon.textContent = button === activeReel && playing ? "❚❚" : "▶";
    button.setAttribute("aria-label", `${button === activeReel && playing ? "Pause" : "Play"} ${button.dataset.title}`);
  });
}

function selectReel(button, shouldPlay = true, shouldScroll = false) {
  const changed = activeReel !== button || audio.getAttribute("src") !== button.dataset.src;
  activeReel = button;
  reelButtons.forEach((item) => {
    const selected = item === button;
    item.classList.toggle("is-active", selected);
    item.setAttribute("aria-pressed", String(selected));
  });
  playerTitle.textContent = button.dataset.title;
  masterTitle.textContent = button.dataset.title;

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
  button.addEventListener("click", () => selectReel(button, true));
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
  playerProgress.setAttribute("aria-valuetext", `${formatTime(audio.currentTime)} of ${formatTime(duration)}`);
});
audio.addEventListener("loadedmetadata", () => {
  playerTime.textContent = `0:00 / ${formatTime(audio.duration)}`;
  playerProgress.setAttribute("aria-valuetext", `0:00 of ${formatTime(audio.duration)}`);
});
playerProgress.addEventListener("input", () => {
  if (Number.isFinite(audio.duration)) audio.currentTime = (Number(playerProgress.value) / 1000) * audio.duration;
});

function showGalleryImage(index) {
  activeGalleryIndex = (index + galleryItems.length) % galleryItems.length;
  const item = galleryItems[activeGalleryIndex];
  const sourceImage = item.querySelector("img");
  lightboxImage.src = sourceImage.dataset.fullSrc || sourceImage.src;
  lightboxImage.alt = sourceImage.alt;
  lightboxCaption.textContent = `${activeGalleryIndex + 1} / ${galleryItems.length} — ${item.dataset.caption}`;
}

galleryItems.forEach((item, index) => {
  item.addEventListener("click", () => {
    galleryReturnTarget = item;
    showGalleryImage(index);
    lightbox.showModal();
    lightbox.querySelector("[data-lightbox-close]").focus();
  });
});

galleryToggle.addEventListener("click", () => {
  const expanded = galleryGrid.classList.toggle("is-expanded");
  galleryToggle.setAttribute("aria-expanded", String(expanded));
  galleryToggle.textContent = expanded ? "Show fewer photographs" : "View all 8 photographs";
});

lightbox.querySelector("[data-lightbox-close]").addEventListener("click", () => lightbox.close());
lightbox.querySelector("[data-lightbox-prev]").addEventListener("click", () => showGalleryImage(activeGalleryIndex - 1));
lightbox.querySelector("[data-lightbox-next]").addEventListener("click", () => showGalleryImage(activeGalleryIndex + 1));
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) lightbox.close();
});
lightbox.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    event.preventDefault();
    lightbox.close();
    return;
  }
  if (event.key === "ArrowLeft") showGalleryImage(activeGalleryIndex - 1);
  if (event.key === "ArrowRight") showGalleryImage(activeGalleryIndex + 1);
});
lightbox.addEventListener("cancel", (event) => {
  event.preventDefault();
  lightbox.close();
});
lightbox.addEventListener("close", () => galleryReturnTarget?.focus());

function buildEnquiryMailto(formData) {
  const projectType = formData.get("projectType");
  const lines = [
    `Project type: ${projectType}`,
    `Usage / medium: ${formData.get("usage") || "Not specified"}`,
    `Deadline: ${formData.get("deadline") || "Not specified"}`,
    `Live direction: ${formData.get("liveDirection")}`,
    "",
    "Project details:",
    formData.get("message"),
  ];
  const subject = encodeURIComponent(`Project enquiry — ${projectType}`);
  const body = encodeURIComponent(lines.join("\n"));
  return `mailto:jivaruka@gmail.com?subject=${subject}&body=${body}`;
}

enquiryForm.addEventListener("submit", (event) => {
  event.preventDefault();
  window.location.href = buildEnquiryMailto(new FormData(enquiryForm));
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
