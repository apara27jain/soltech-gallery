const tabButtons = document.querySelectorAll(".tab-button");
const root = document.documentElement;
const movingCards = document.querySelectorAll(".gallery-card, .certificate-card");
const panels = {
  projects: document.querySelector("#projects-gallery"),
  certificates: document.querySelector("#certificates-gallery"),
};

movingCards.forEach((card, index) => {
  card.dataset.depth = String(0.26 + (index % 6) * 0.075);
});

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selected = button.dataset.gallery;

    tabButtons.forEach((tab) => tab.classList.remove("active"));
    button.classList.add("active");

    Object.entries(panels).forEach(([name, panel]) => {
      panel.classList.toggle("active", name === selected);
    });
  });
});

const lightbox = document.querySelector(".lightbox");
const lightboxImage = document.querySelector(".lightbox-image");
const closeButton = document.querySelector(".lightbox-close");
const previousButton = document.querySelector(".lightbox-arrow.prev");
const nextButton = document.querySelector(".lightbox-arrow.next");
let activeImages = [];
let activeIndex = 0;

function getVisibleImages() {
  const activePanel = document.querySelector(".gallery-panel.active");
  return [...activePanel.querySelectorAll(".has-image img")];
}

function openLightbox(images, index) {
  activeImages = images;
  activeIndex = index;
  updateLightboxImage();
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
}

function updateLightboxImage() {
  const image = activeImages[activeIndex];
  lightboxImage.src = image.src;
  lightboxImage.alt = image.alt;
}

function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImage.src = "";
}

function showNextImage(direction) {
  activeIndex =
    (activeIndex + direction + activeImages.length) % activeImages.length;
  updateLightboxImage();
}

document.querySelectorAll(".has-image").forEach((card) => {
  card.addEventListener("click", () => {
    const images = getVisibleImages();
    const image = card.querySelector("img");
    const index = images.indexOf(image);
    openLightbox(images, index);
  });
});

closeButton.addEventListener("click", closeLightbox);
previousButton.addEventListener("click", () => showNextImage(-1));
nextButton.addEventListener("click", () => showNextImage(1));

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (!lightbox.classList.contains("open")) return;

  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") showNextImage(-1);
  if (event.key === "ArrowRight") showNextImage(1);
});

function moveScene(event) {
  if (window.matchMedia("(max-width: 760px)").matches) return;

  const x = event.clientX / window.innerWidth - 0.5;
  const y = event.clientY / window.innerHeight - 0.5;

  root.style.setProperty("--scene-x", `${x * -34}px`);
  root.style.setProperty("--scene-y", `${y * -28}px`);
  root.style.setProperty("--scene-tilt-x", `${x * 3.4}deg`);
  root.style.setProperty("--scene-tilt-y", `${y * -3.4}deg`);

  movingCards.forEach((card) => {
    const depth = Number(card.dataset.depth);
    card.style.setProperty("--move-x", `${x * depth * 120}px`);
    card.style.setProperty("--move-y", `${y * depth * 105}px`);
  });
}

function resetScene() {
  root.style.setProperty("--scene-x", "0px");
  root.style.setProperty("--scene-y", "0px");
  root.style.setProperty("--scene-tilt-x", "0deg");
  root.style.setProperty("--scene-tilt-y", "0deg");

  movingCards.forEach((card) => {
    card.style.setProperty("--move-x", "0px");
    card.style.setProperty("--move-y", "0px");
  });
}

window.addEventListener("mousemove", moveScene);
window.addEventListener("mouseleave", resetScene);
