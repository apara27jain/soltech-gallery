// ── PROJECT GALLERIES ──────────────────────────────────────────────────
const PROJECT_GALLERIES = {
  "sbe-international-stones-dudu-400kw": { name: "SBE International Stones", meta: "400 kW · Dudu, Rajasthan", photos: Array.from({length:9},(_,i)=>`images/sbe-international-stones-dudu-400kw/photo-${i+1}.jpg`) },
  "magnatix-rocks-dudu-400kw":           { name: "Magnatix Rocks",            meta: "400 kW · Dudu, Rajasthan", photos: Array.from({length:14},(_,i)=>`images/magnatix-rocks-dudu-400kw/photo-${i+1}.jpg`) },
  "westin-pushkar-300kw":                { name: "The Westin Pushkar",         meta: "300 kW · Pushkar, Rajasthan", photos: Array.from({length:35},(_,i)=>`images/westin-pushkar-300kw/photo-${i+1}.jpg`) },
  "vrindavan-dham-khatu-shyam-250kw":    { name: "Vrindavan Dham Dharamshala", meta: "250 kW · Khatu Shyam Ji, Rajasthan", photos: Array.from({length:20},(_,i)=>`images/vrindavan-dham-khatu-shyam-250kw/photo-${i+1}.jpg`) },
  "shakun-marble-vki-234kw":             { name: "Shakun Marbles VKI",         meta: "234 kW · VKI Industrial Area, Jaipur", photos: Array.from({length:1},(_,i)=>`images/shakun-marble-vki-234kw/photo-${i+1}.jpg`) },
  "ashoka-marble-vki-180kw":             { name: "Ashoka Marble VKI",          meta: "180 kW · VKI Industrial Area, Jaipur", photos: Array.from({length:6},(_,i)=>`images/ashoka-marble-vki-180kw/photo-${i+1}.jpg`) },
  "shreeyansh-healthcare-kishangarh-130kw": { name: "Shreeyansh Healthcare",   meta: "130 kW · Kishangarh, Rajasthan", photos: Array.from({length:12},(_,i)=>`images/shreeyansh-healthcare-kishangarh-130kw/photo-${i+1}.jpg`) },
  "tileco-land-developers-vki-100kw":    { name: "Tileco Land Developers",     meta: "100 kW · VKI Industrial Area, Jaipur", photos: Array.from({length:7},(_,i)=>`images/tileco-land-developers-vki-100kw/photo-${i+1}.jpg`) },
  "radhika-industries-40kw":             { name: "Radhika Industries",          meta: "40 kW · Jaipur, Rajasthan", photos: Array.from({length:2},(_,i)=>`images/radhika-industries-40kw/photo-${i+1}.jpg`) },
  "vidhyadhar-nagar-jaipur-10kw":        { name: "Vidhyadhar Nagar Residence", meta: "10 kW · Jaipur, Rajasthan", photos: Array.from({length:4},(_,i)=>`images/vidhyadhar-nagar-jaipur-10kw/photo-${i+1}.jpg`) },
};

// ── KW FILTER ──────────────────────────────────────────────────────────
const filterBtns = document.querySelectorAll(".filter-btn");
const allCards   = document.querySelectorAll(".gallery-card");

function applyFilter(filter) {
  allCards.forEach((card) => {
    const kw = Number(card.dataset.kw);
    let show = false;
    if (filter === "all")      show = true;
    else if (filter === "300+")    show = kw >= 300;
    else if (filter === "100-300") show = kw >= 100 && kw < 300;
    else if (filter === "under100") show = kw < 100;
    card.classList.toggle("hidden", !show);
  });
}

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    applyFilter(btn.dataset.filter);
  });
});

// ── PARALLAX ───────────────────────────────────────────────────────────
const root        = document.documentElement;
const movingCards = document.querySelectorAll(".gallery-card");

movingCards.forEach((card, index) => {
  card.dataset.depth = String(0.26 + (index % 6) * 0.075);
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

// ── LIGHTBOX ───────────────────────────────────────────────────────────
const lightbox        = document.querySelector(".lightbox");
const lightboxImage   = document.querySelector(".lightbox-image");
const lightboxName    = document.querySelector(".lightbox-name");
const lightboxMeta    = document.querySelector(".lightbox-meta");
const lightboxCounter = document.querySelector(".lightbox-counter");
const closeButton     = document.querySelector(".lightbox-close");
const prevButton      = document.querySelector(".lightbox-arrow.prev");
const nextButton      = document.querySelector(".lightbox-arrow.next");

let activePhotos = [];
let activeMeta   = { name: "", meta: "" };
let activeIndex  = 0;

function openLightbox(projectKey, startIndex = 0) {
  const project = PROJECT_GALLERIES[projectKey];
  if (!project) return;
  activePhotos = project.photos;
  activeMeta   = { name: project.name, meta: project.meta };
  activeIndex  = startIndex;
  updateLightbox();
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function updateLightbox() {
  lightboxImage.src        = activePhotos[activeIndex];
  lightboxImage.alt        = `${activeMeta.name} — photo ${activeIndex + 1}`;
  lightboxName.textContent = activeMeta.name;
  lightboxMeta.textContent = activeMeta.meta;
  lightboxCounter.textContent = activePhotos.length > 1 ? `${activeIndex + 1} / ${activePhotos.length}` : "";
  const hasMultiple = activePhotos.length > 1;
  prevButton.style.display = hasMultiple ? "" : "none";
  nextButton.style.display = hasMultiple ? "" : "none";
}

function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImage.src = "";
  document.body.style.overflow = "";
}

function navigate(direction) {
  activeIndex = (activeIndex + direction + activePhotos.length) % activePhotos.length;
  lightboxImage.style.opacity = "0";
  setTimeout(() => { updateLightbox(); lightboxImage.style.opacity = "1"; }, 120);
}

// Card clicks — photo cards open lightbox; placeholder cards do nothing
document.querySelectorAll(".project-card").forEach((card) => {
  card.addEventListener("click", () => openLightbox(card.dataset.project, 0));
});

// Lightbox controls — stopPropagation so clicks don't bubble to backdrop
closeButton.addEventListener("click", (e) => { e.stopPropagation(); closeLightbox(); });
prevButton.addEventListener("click",  (e) => { e.stopPropagation(); navigate(-1); });
nextButton.addEventListener("click",  (e) => { e.stopPropagation(); navigate(1); });

lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });

document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("open")) return;
  if (e.key === "Escape")     closeLightbox();
  if (e.key === "ArrowLeft")  navigate(-1);
  if (e.key === "ArrowRight") navigate(1);
});

// Touch swipe
let touchStartX = 0;
lightbox.addEventListener("touchstart", (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
lightbox.addEventListener("touchend",   (e) => {
  const delta = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(delta) > 50) navigate(delta > 0 ? 1 : -1);
});

// Touch: two-stage tap (first tap = show info, second tap = open lightbox)
if (window.matchMedia("(hover: none)").matches) {
  document.querySelectorAll(".project-card").forEach((card) => {
    card.replaceWith(card.cloneNode(true));
  });
  document.querySelectorAll(".project-card").forEach((card) => {
    card.addEventListener("click", (e) => {
      if (!card.classList.contains("info-open")) {
        document.querySelectorAll(".project-card.info-open").forEach((c) => c.classList.remove("info-open"));
        card.classList.add("info-open");
        e.stopPropagation();
      } else {
        openLightbox(card.dataset.project, 0);
      }
    });
  });
  document.addEventListener("click", () => {
    document.querySelectorAll(".project-card.info-open").forEach((c) => c.classList.remove("info-open"));
  });
}
