(() => {
  'use strict';

  const lang = () => localStorage.getItem('valhan-lang') || 'ar';
  const t = (ar, en) => lang() === 'ar' ? ar : en;

  const applyLanguage = () => {
    const currentLang = lang();
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';

    document.querySelectorAll('[data-ar][data-en]').forEach(element => {
      element.textContent = currentLang === 'ar'
        ? element.dataset.ar
        : element.dataset.en;
    });

    ['placeholder', 'aria-label', 'title', 'alt'].forEach(attribute => {
      document.querySelectorAll(`[data-ar-${attribute}][data-en-${attribute}]`).forEach(element => {
        const key = attribute.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
        const prefix = currentLang === 'ar' ? 'ar' : 'en';
        element.setAttribute(attribute, element.dataset[`${prefix}${key[0].toUpperCase()}${key.slice(1)}`]);
      });
    });

    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) {
      langToggle.textContent = currentLang === 'ar' ? 'EN' : 'ع';
      langToggle.setAttribute('aria-label', t('تغيير اللغة', 'Change language'));
    }
  };

  applyLanguage();

  const menuToggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('main-nav');

  if (menuToggle && nav) {
    const closeMenu = () => {
      nav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    };

    menuToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    nav.addEventListener('click', event => {
      if (event.target.closest('a')) closeMenu();
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && nav.classList.contains('open')) {
        closeMenu();
        menuToggle.focus();
      }
    });
  }

  const themeToggle = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('valhan-theme');
  if (savedTheme === 'light') document.body.classList.add('light');

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('light');
      localStorage.setItem(
        'valhan-theme',
        document.body.classList.contains('light') ? 'light' : 'dark'
      );
    });
  }

  const langToggle = document.getElementById('lang-toggle');
  if (langToggle) {
    langToggle.addEventListener('click', () => {
      localStorage.setItem('valhan-lang', lang() === 'ar' ? 'en' : 'ar');
      location.reload();
    });
  }

  const year = document.getElementById('current-year');
  if (year) year.textContent = new Date().getFullYear();

  window.ValhanLang = lang;
  window.ValhanT = t;
})();
