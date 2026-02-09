// script.js (FULL UPDATED)

// Footer year
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ========= Drawer (mobile nav) ========= */
const navToggle = document.getElementById("navToggle");
const drawer = document.getElementById("mobileDrawer");
const backdrop = document.getElementById("drawerBackdrop");
const closeBtn = document.getElementById("drawerClose");

function openDrawer(){
  if (!drawer || !navToggle) return;
  drawer.classList.add("open");
  document.body.classList.add("nav-open");
  drawer.setAttribute("aria-hidden", "false");
  navToggle.setAttribute("aria-expanded", "true");
}

function closeDrawer(){
  if (!drawer || !navToggle) return;
  drawer.classList.remove("open");
  document.body.classList.remove("nav-open");
  drawer.setAttribute("aria-hidden", "true");
  navToggle.setAttribute("aria-expanded", "false");
}

if (navToggle) navToggle.addEventListener("click", openDrawer);
if (backdrop) backdrop.addEventListener("click", closeDrawer);
if (closeBtn) closeBtn.addEventListener("click", closeDrawer);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && drawer && drawer.classList.contains("open")) closeDrawer();
});

/* ========= “Separate pages” routing ========= */
const pages = Array.from(document.querySelectorAll(".page"));
const navLinks = Array.from(document.querySelectorAll(".nav-link"));
const drawerLinks = Array.from(document.querySelectorAll(".drawer-links a"));
const goButtons = Array.from(document.querySelectorAll("[data-go]"));

function setActiveNav(route){
  navLinks.forEach(a => {
    const isActive = a.dataset.route === route;
    a.classList.toggle("active", isActive);
    a.setAttribute("aria-current", isActive ? "page" : "false");
  });
}

function showPage(route){
  const target = route || "home";
  pages.forEach(p => p.classList.toggle("active", p.dataset.page === target));
  setActiveNav(target);
  window.scrollTo(0, 0);
}

function routeFromHash(){
  const raw = (window.location.hash || "#home").replace("#", "").trim();
  const route = raw || "home";
  const exists = pages.some(p => p.dataset.page === route);
  showPage(exists ? route : "home");
}

window.addEventListener("hashchange", () => {
  routeFromHash();
  closeDrawer();
});

function attachRouteLinks(links){
  links.forEach(a => {
    a.addEventListener("click", (e) => {
      const route = a.dataset.route || (a.getAttribute("href") || "").replace("#","");
      if (!route) return;
      e.preventDefault();
      window.location.hash = route;
    });
  });
}

attachRouteLinks(navLinks);
attachRouteLinks(drawerLinks);

goButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const route = btn.dataset.go;
    if (route) window.location.hash = route;
  });
});

// Default to home on first load
if (!window.location.hash) {
  window.location.hash = "home";
} else {
  routeFromHash();
}

/* ========= Portfolio Guides image fallback ========= */
const guideCovers = Array.from(document.querySelectorAll(".guide-cover"));
guideCovers.forEach(img => {
  img.addEventListener("error", () => {
    const art = img.closest(".guide-art");
    if (art) art.classList.add("is-missing");
  });
});

/* ========= Portfolio Guides modal ========= */
const guideModal = document.getElementById("guideModal");
const guideModalBackdrop = document.getElementById("guideModalBackdrop");
const guideModalClose = document.getElementById("guideModalClose");
const guideModalBack = document.getElementById("guideModalBack");
const guideModalText = document.getElementById("guideModalText");

function openGuideModal(specialty){
  if (!guideModal) return;
  guideModal.classList.add("open");
  guideModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("nav-open");

  if (guideModalText) {
    guideModalText.textContent = `${specialty} portfolio guide is coming soon.`;
  }
}

function closeGuideModal(){
  if (!guideModal) return;
  guideModal.classList.remove("open");
  guideModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("nav-open");
}

const guideCards = Array.from(document.querySelectorAll(".guide-card[data-guide]"));
guideCards.forEach(card => {
  card.addEventListener("click", (e) => {
    e.preventDefault();
    const specialty = card.getAttribute("data-guide") || "This";
    openGuideModal(specialty);
  });

  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const specialty = card.getAttribute("data-guide") || "This";
      openGuideModal(specialty);
    }
  });
});

if (guideModalBackdrop) guideModalBackdrop.addEventListener("click", closeGuideModal);
if (guideModalClose) guideModalClose.addEventListener("click", closeGuideModal);
if (guideModalBack) guideModalBack.addEventListener("click", closeGuideModal);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && guideModal && guideModal.classList.contains("open")) {
    closeGuideModal();
  }
});
