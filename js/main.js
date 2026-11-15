/* ==========================================================
   main.js — الكود المشترك بين كل صفحات الموقع
   يبني الـ Header والـ Footer بدل تكرارهما في كل ملف HTML
   ========================================================== */

/* ---------- 1) الإعدادات (غيّر البيانات من هنا فقط) ---------- */

// كل صفحة تضع في وسم body الخاصية data-root:
//   في index.html:   data-root="."
//   في pages/*.html: data-root=".."
const siteRoot = document.body.dataset.root || ".";
const currentPage = document.body.dataset.page || "";

const BRAND_NAME = "VALHAN MUSCLES";
const BRAND_DESCRIPTION =
  "منصتك المتكاملة للياقة البدنية: خطط تدريب جاهزة، منشئ خطط، ومكتبة تمارين وشرح مبسّط.";

// روابط التواصل: استبدل القيم التالية بروابطك الحقيقية
const CONTACT_LINKS = {
  coach: "mailto:coach@example.com",
  developer: "mailto:developer@example.com",
};

const SOCIAL_LINKS = [
  { label: "Instagram", icon: "fa-instagram", url: "https://www.instagram.com/" },
  { label: "Facebook", icon: "fa-facebook-f", url: "https://www.facebook.com/" },
  { label: "YouTube", icon: "fa-youtube", url: "https://www.youtube.com/" },
  { label: "TikTok", icon: "fa-tiktok", url: "https://www.tiktok.com/" },
];

// عناصر القائمة. العنصر الذي يحتوي children يصبح قائمة منسدلة
const NAV_ITEMS = [
  { id: "home", label: "الرئيسية", path: "index.html" },
  { id: "plans", label: "الخطط التدريبية", path: "pages/workout-plans.html" },
  { id: "exercises", label: "مكتبة التمارين", path: "pages/exercises.html" },
  { id: "academy", label: "الأكاديمية", path: "pages/academy.html" },
  {
    id: "tools",
    label: "الأدوات",
    children: [
      { id: "builder", label: "منشئ الخطط", path: "pages/workout-builder.html" },
      { id: "calculator", label: "حاسبة الحجم التدريبي", path: "pages/volume-calculator.html" },
    ],
  },
  { id: "about", label: "من نحن", path: "pages/about.html" },
];

/* ---------- 2) دوال مساعدة ---------- */

// تبني الرابط الصحيح حسب مكان الصفحة الحالية (الجذر أو داخل pages)
function buildUrl(path) {
  return `${siteRoot}/${path}`;
}

// تتحقق هل الصفحة الحالية هي صفحة هذا العنصر (أو أحد أبنائه)
function isActive(item) {
  if (item.children) {
    return item.children.some((child) => child.id === currentPage);
  }
  return item.id === currentPage;
}

/* ---------- 3) بناء الـ HTML ---------- */

function renderNavItem(item) {
  // عنصر عادي: رابط
  if (!item.children) {
    const activeClass = isActive(item) ? " is-active" : "";
    const ariaCurrent = item.id === currentPage ? ' aria-current="page"' : "";
    return `<li><a class="nav-link${activeClass}" href="${buildUrl(item.path)}"${ariaCurrent}>${item.label}</a></li>`;
  }

  // عنصر له قائمة منسدلة: زر + قائمة فرعية
  const childrenHtml = item.children
    .map((child) => renderNavItem(child))
    .join("");
  const activeClass = isActive(item) ? " is-active" : "";
  return `
    <li class="has-dropdown">
      <button class="dropdown-toggle${activeClass}" type="button" aria-expanded="false">
        ${item.label} <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
      </button>
      <ul class="dropdown-menu">${childrenHtml}</ul>
    </li>`;
}

function renderSocialLinks() {
  return SOCIAL_LINKS.map(
    (social) => `
      <a class="social-link" href="${social.url}" target="_blank" rel="noopener noreferrer" aria-label="${social.label}">
        <i class="fa-brands ${social.icon}" aria-hidden="true"></i>
      </a>`
  ).join("");
}

function renderHeader() {
  const headerEl = document.getElementById("site-header");
  if (!headerEl) return; // حماية: الصفحة لا تحتوي مكان الهيدر

  headerEl.className = "site-header";
  headerEl.innerHTML = `
    <div class="container">
      <a class="brand" href="${buildUrl("index.html")}" aria-label="${BRAND_NAME} - الرئيسية">
        <img src="${siteRoot}/assets/imgs/logo.webp" alt="" width="42" height="42">
        <p>VALHAN <span>MUSCLES</span></p>
      </a>

      <nav class="main-nav" id="main-nav" aria-label="القائمة الرئيسية">
        <ul class="nav-list">${NAV_ITEMS.map(renderNavItem).join("")}</ul>
      </nav>

      <div class="header-actions">
        <div class="header-social">${renderSocialLinks()}</div>
        <a class="btn btn-primary header-cta" href="${buildUrl("pages/workout-builder.html")}">ابدأ خطتك</a>
        <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="main-nav" aria-label="فتح القائمة">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>`;
}

function renderFooter() {
  const footerEl = document.getElementById("site-footer");
  if (!footerEl) return;

  // روابط الفوتر: نسطّح القائمة (نخرج الأبناء من القائمة المنسدلة)
  const flatLinks = NAV_ITEMS.flatMap((item) => item.children || [item]);
  const linksHtml = flatLinks
    .map((item) => `<li><a href="${buildUrl(item.path)}">${item.label}</a></li>`)
    .join("");

  footerEl.className = "site-footer";
  footerEl.innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <div class="footer-about">
          <a class="brand" href="${buildUrl("index.html")}">
            <img src="${siteRoot}/assets/imgs/logo.webp" alt="" width="42" height="42" loading="lazy">
            <p>VALHAN <span>MUSCLES</span></p>
          </a>
          <p>${BRAND_DESCRIPTION}</p>
          <div class="footer-social">${renderSocialLinks()}</div>
        </div>

        <div>
          <h2 class="footer-title">روابط سريعة</h2>
          <ul class="footer-links">${linksHtml}</ul>
        </div>

        <div>
          <h2 class="footer-title">تواصل معنا</h2>
          <ul class="footer-links">
            <li><a href="${CONTACT_LINKS.coach}"><i class="fa-solid fa-dumbbell" aria-hidden="true"></i> تواصل مع المدرب</a></li>
            <li><a href="${CONTACT_LINKS.developer}"><i class="fa-solid fa-code" aria-hidden="true"></i> تواصل مع المطوّر</a></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; ${new Date().getFullYear()} ${BRAND_NAME}. جميع الحقوق محفوظة.</p>
        <a href="${buildUrl("pages/privacy.html")}">سياسة الخصوصية</a>
      </div>
    </div>`;
}

/* ---------- 4) السلوك (Behavior) ---------- */

// فتح وإغلاق قائمة الموبايل
function setupMobileMenu() {
  const toggleBtn = document.querySelector(".menu-toggle");
  const nav = document.getElementById("main-nav");
  if (!toggleBtn || !nav) return;

  function setMenuState(isOpen) {
    nav.classList.toggle("is-open", isOpen);
    toggleBtn.setAttribute("aria-expanded", String(isOpen));
    toggleBtn.setAttribute("aria-label", isOpen ? "إغلاق القائمة" : "فتح القائمة");
    document.body.style.overflow = isOpen ? "hidden" : ""; // منع تمرير الصفحة خلف القائمة
  }

  toggleBtn.addEventListener("click", () => {
    setMenuState(!nav.classList.contains("is-open"));
  });

  // إغلاق بزر Escape
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("is-open")) {
      setMenuState(false);
      toggleBtn.focus();
    }
  });

  // إغلاق القائمة عند الانتقال إلى شاشة كبيرة
  window.matchMedia("(min-width: 992px)").addEventListener("change", (event) => {
    if (event.matches) setMenuState(false);
  });
}

// القوائم المنسدلة بالنقر (مهمة للموبايل وللكيبورد)
function setupDropdowns() {
  document.querySelectorAll(".has-dropdown").forEach((dropdown) => {
    const button = dropdown.querySelector(".dropdown-toggle");
    button.addEventListener("click", () => {
      const isOpen = dropdown.classList.toggle("is-open");
      button.setAttribute("aria-expanded", String(isOpen));
    });
  });
}

// إظهار ظل وخط للهيدر عند النزول
function setupHeaderScrollEffect() {
  const header = document.getElementById("site-header");
  if (!header) return;

  function updateHeaderState() {
    header.classList.toggle("is-scrolled", window.scrollY > 10);
  }

  updateHeaderState();
  window.addEventListener("scroll", updateHeaderState, { passive: true });
}

/* ---------- 5) التشغيل ---------- */

renderHeader();
renderFooter();
setupMobileMenu();
setupDropdowns();
setupHeaderScrollEffect();
