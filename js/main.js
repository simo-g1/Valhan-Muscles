(() => {
  'use strict';
  const root = document.body.dataset.root || '.';
  const page = document.body.dataset.page || 'home';
  const links = [
    ['home', 'الرئيسية', 'Home', 'index.html'],
    ['plans', 'الخطط', 'Plans', 'pages/workout-plans.html'],
    ['builder', 'أنشئ خطتك', 'Builder', 'pages/workout-builder.html'],
    ['exercises', 'التمارين', 'Exercises', 'pages/exercises.html'],
    ['academy', 'الأكاديمية', 'Academy', 'pages/academy.html'],
    ['team', 'فريق العمل', 'Our Team', 'pages/our-team.html'],
    ['about', 'من نحن', 'About', 'pages/about.html']
  ];

  const lang = () => localStorage.getItem('valhan-lang') || 'ar';
  const t = (a, b) => lang() === 'ar' ? a : b;

  // Set html lang & dir dynamically
  document.documentElement.lang = lang();
  document.documentElement.dir = lang() === 'ar' ? 'rtl' : 'ltr';

  const header = document.getElementById('site-header');
  if (header) {
    header.innerHTML = `
      <div class="container header-inner">
        <a class="brand" href="${root}/index.html">
          <img src="${root}/assets/logos/logo.webp" alt="VALHAN MUSCLES">
          <span>VALHAN <b>MUSCLES</b></span>
        </a>
        <nav class="nav" id="main-nav">
          ${links.map(x => {
            const isActive = page === x[0] || (x[0] === 'team' && (page === 'developer' || page === 'coach'));
            return `<a class="${isActive ? 'active' : ''}" href="${root}/${x[3]}">${t(x[1], x[2])}</a>`;
          }).join('')}
        </nav>
        <div class="head-actions">
          <button class="icon-btn" id="lang-toggle" type="button" aria-label="Change language">${lang() === 'ar' ? 'EN' : 'ع'}</button>
          <button class="icon-btn" id="theme-toggle" type="button" aria-label="Toggle theme">☼</button>
          <button class="menu-btn" id="menu-toggle" type="button" aria-label="Open menu">☰</button>
        </div>
      </div>`;
  }

  const footer = document.getElementById('site-footer');
  if (footer) {
    footer.innerHTML = `
      <div class="container">
        <div class="footer-grid">
          <div>
            <a class="brand" href="${root}/index.html">
              <img src="${root}/assets/logos/logo.webp" alt="VALHAN MUSCLES">
              <span>VALHAN <b>MUSCLES</b></span>
            </a>
            <p>${t('خطط أوضح. تدريب أذكى. تقدم مستمر.', 'Clear plans. Smarter training. Consistent progress.')}</p>
          </div>
          <div>
            <h3 class="footer-title">${t('استكشف', 'Explore')}</h3>
            <ul class="footer-links">
              ${links.slice(1).map(x => `<li><a href="${root}/${x[3]}">${t(x[1], x[2])}</a></li>`).join('')}
            </ul>
          </div>
          <div>
            <h3 class="footer-title">${t('فريق العمل', 'Our Team')}</h3>
            <ul class="footer-links">
              <li><a href="${root}/pages/our-team.html">${t('فريق المشروع', 'Team Hub')}</a></li>
              <li><a href="${root}/pages/developer.html">${t('المطور: سيمو', 'Developer: Simo')}</a></li>
              <li><a href="${root}/pages/coach.html">${t('المدرب: محمد حاتم', 'Coach: Mohamed Hatem')}</a></li>
            </ul>
          </div>
          <div>
            <h3 class="footer-title">${t('معلومة مهمة', 'Note')}</h3>
            <p>${t('المحتوى تعليمي ورياضي ولا يغني عن استشارة مختص طبي عند الحاجة.', 'Educational and fitness content; seek professional medical advice when needed.')}</p>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© ${new Date().getFullYear()} VALHAN MUSCLES</span>
          <span>Build Your Strength. Master Your Fitness.</span>
        </div>
      </div>`;
  }

  const menuToggle = document.getElementById('menu-toggle');
  if (menuToggle) {
    menuToggle.onclick = () => document.getElementById('main-nav')?.classList.toggle('open');
  }

  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.onclick = () => {
      document.body.classList.toggle('light');
      localStorage.setItem('valhan-theme', document.body.classList.contains('light') ? 'light' : 'dark');
    };
  }

  if (localStorage.getItem('valhan-theme') === 'light') {
    document.body.classList.add('light');
  }

  const langToggle = document.getElementById('lang-toggle');
  if (langToggle) {
    langToggle.onclick = () => {
      localStorage.setItem('valhan-lang', lang() === 'ar' ? 'en' : 'ar');
      location.reload();
    };
  }

  window.ValhanLang = lang;
  window.ValhanT = t;
})();
