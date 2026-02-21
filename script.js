// script.js (FULL UPDATED)

// Footer year
const yearEls = document.querySelectorAll("#year");
yearEls.forEach(el => el.textContent = new Date().getFullYear());

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

/* ========= Dropdown menus (desktop) ========= */
const dropdowns = Array.from(document.querySelectorAll("[data-dd]"));

function closeAllDropdowns(){
  dropdowns.forEach(dd => {
    dd.classList.remove("open");
    const btn = dd.querySelector(".nav-dd-btn");
    if (btn) btn.setAttribute("aria-expanded", "false");
  });
}

dropdowns.forEach(dd => {
  const btn = dd.querySelector(".nav-dd-btn");
  if (!btn) return;

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const isOpen = dd.classList.contains("open");
    closeAllDropdowns();
    dd.classList.toggle("open", !isOpen);
    btn.setAttribute("aria-expanded", (!isOpen).toString());
  });
});

// close on outside click
document.addEventListener("click", (e) => {
  const target = e.target;
  const inside = dropdowns.some(dd => dd.contains(target));
  if (!inside) closeAllDropdowns();
});

// close on escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeAllDropdowns();
});

/* ========= “Separate pages” routing ========= */
const pages = Array.from(document.querySelectorAll(".page"));
const navLinks = Array.from(document.querySelectorAll(".nav-link[data-route]"));
const drawerLinks = Array.from(document.querySelectorAll(".drawer-links a[data-route]"));
const ddLinks = Array.from(document.querySelectorAll(".nav-dd-menu a[data-route]"));
const allRouteLinks = [...navLinks, ...drawerLinks, ...ddLinks];

function setActiveNav(route){
  navLinks.forEach(a => {
    const isActive = a.dataset.route === route;
    a.classList.toggle("active", isActive);
  });
}

function showPage(route){
  const target = route || "home";
  pages.forEach(p => p.classList.toggle("active", p.dataset.page === target));
  setActiveNav(target);
  window.scrollTo(0, 0);
  closeAllDropdowns();
}

function routeFromHash(){
  const raw = (window.location.hash || "#home").replace("#", "").trim();
  const route = raw || "home";
  const exists = pages.some(p => p.dataset.page === route);
  showPage(exists ? route : "home");
}

function attachRouteLinks(links){
  links.forEach(a => {
    a.addEventListener("click", (e) => {
      const route = a.dataset.route || (a.getAttribute("href") || "").replace("#","");
      if (!route) return;
      e.preventDefault();
      window.location.hash = route;
      closeDrawer();
    });
  });
}

attachRouteLinks(allRouteLinks);

window.addEventListener("hashchange", () => {
  routeFromHash();
  closeDrawer();
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

/* ========= Reveal on scroll ========= */
const reveals = Array.from(document.querySelectorAll(".reveal"));

const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in");
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

reveals.forEach(el => io.observe(el));

/* ========= Count-up stats ========= */
const counters = Array.from(document.querySelectorAll(".count[data-count]"));
let countersStarted = false;

function animateCount(el, target, duration = 1100){
  const start = 0;
  const t0 = performance.now();

  function tick(now){
    const p = Math.min((now - t0) / duration, 1);
    // ease out
    const eased = 1 - Math.pow(1 - p, 3);
    const val = Math.round(start + (target - start) * eased);
    el.textContent = String(val);
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const problemsSection = document.getElementById("home-problems");
if (problemsSection) {
  const ioStats = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersStarted) {
        countersStarted = true;
        counters.forEach(el => {
          const target = Number(el.getAttribute("data-count") || "0");
          animateCount(el, target);
        });
        ioStats.disconnect();
      }
    });
  }, { threshold: 0.25 });

  ioStats.observe(problemsSection);
}
