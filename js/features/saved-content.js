(() => {
  'use strict';

  if (window.__valhanSavedHubLoaded) return;
  window.__valhanSavedHubLoaded = true;

  const ARTICLES_KEY = 'valhan-saved-articles-v1';
  const EXERCISES_KEY = 'valhan-saved-exercises-v1';

  const lang = () => window.ValhanLang?.() || 'ar';
  const t = (ar, en) => lang() === 'ar' ? ar : en;

  function readStore(key) {
    try {
      const parsed = JSON.parse(localStorage.getItem(key) || '{}');
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
    } catch {
      return {};
    }
  }

  function writeStore(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      window.dispatchEvent(new CustomEvent('valhan:saved-change', { detail: { key } }));
      return true;
    } catch {
      toast(t('تعذر الحفظ في المتصفح. تحقق من مساحة التخزين وإعدادات الخصوصية.', 'Could not save in browser storage. Check available space and privacy settings.'));
      return false;
    }
  }

  function toast(msg) {
    let el = document.getElementById('toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'toast';
      el.className = 'toast';
      el.setAttribute('role', 'status');
      el.setAttribute('aria-live', 'polite');
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(el._savedToastTimer);
    el._savedToastTimer = setTimeout(() => el.classList.remove('show'), 2400);
  }

  const SavedHub = {
    // Articles
    getSavedArticles() {
      return readStore(ARTICLES_KEY);
    },
    isArticleSaved(slug) {
      return Boolean(readStore(ARTICLES_KEY)[slug]);
    },
    toggleArticle(slug) {
      if (typeof slug !== 'string' || !slug.trim()) {
        toast(t('تعذر حفظ المقال: معرّف المقال غير صالح.', 'Could not save article: invalid article ID.'));
        return false;
      }
      const data = readStore(ARTICLES_KEY);
      let isNowSaved = false;
      if (data[slug]) { delete data[slug]; }
      else { data[slug] = { savedAt: Date.now() }; isNowSaved = true; }
      if (!writeStore(ARTICLES_KEY, data)) return Boolean(!isNowSaved);
      toast(isNowSaved ? t('تم حفظ المقال بنجاح', 'Article saved successfully') : t('تمت إزالة المقال من المحفوظات', 'Article removed from saved'));
      SavedHub.updateUI();
      return isNowSaved;
    },

    // Exercises
    getSavedExercises() {
      return readStore(EXERCISES_KEY);
    },
    isExerciseSaved(id) {
      return Boolean(readStore(EXERCISES_KEY)[id]);
    },
    toggleExercise(id) {
      if (typeof id !== 'string' || !id.trim()) {
        toast(t('تعذر حفظ التمرين: معرّف التمرين غير صالح.', 'Could not save exercise: invalid exercise ID.'));
        return false;
      }
      const data = readStore(EXERCISES_KEY);
      let isNowSaved = false;
      if (data[id]) { delete data[id]; }
      else { data[id] = { savedAt: Date.now() }; isNowSaved = true; }
      if (!writeStore(EXERCISES_KEY, data)) return Boolean(!isNowSaved);
      toast(isNowSaved ? t('تم حفظ التمرين بنجاح', 'Exercise saved successfully') : t('تمت إزالة التمرين من المحفوظات', 'Exercise removed from saved'));
      SavedHub.updateUI();
      return isNowSaved;
    },

    getCounts() {
      const articles = Object.keys(readStore(ARTICLES_KEY)).length;
      const exercises = Object.keys(readStore(EXERCISES_KEY)).length;
      return { articles, exercises, total: articles + exercises };
    },

    // Universal Drawer Modal HTML
    openDrawer(initialTab = 'articles') {
      let modal = document.getElementById('saved-hub-modal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'saved-hub-modal';
        modal.className = 'modal saved-hub-modal';
        document.body.appendChild(modal);
      }

      modal.innerHTML = `
        <div class="modal-box saved-hub-box" role="dialog" aria-modal="true" aria-labelledby="saved-hub-title">
          <div class="saved-hub-header">
            <div>
              <span class="eyebrow"><i class="fa-solid fa-bookmark"></i> VALHAN SAVED</span>
              <h2 id="saved-hub-title">${t('المحتوى المحفوظ', 'Saved Content')}</h2>
            </div>
            <button class="modal-close" id="close-saved-hub" aria-label="${t('إغلاق', 'Close')}">×</button>
          </div>

          <div class="saved-hub-tabs" role="tablist">
            <button class="saved-tab ${initialTab === 'articles' ? 'active' : ''}" data-tab="articles" role="tab" aria-selected="${initialTab === 'articles'}">
              <i class="fa-solid fa-book-open"></i>
              <span>${t('المقالات المحفوظة', 'Saved Articles')}</span>
              <span class="saved-count-pill" id="saved-articles-count">0</span>
            </button>
            <button class="saved-tab ${initialTab === 'exercises' ? 'active' : ''}" data-tab="exercises" role="tab" aria-selected="${initialTab === 'exercises'}">
              <i class="fa-solid fa-dumbbell"></i>
              <span>${t('التمارين المحفوظة', 'Saved Exercises')}</span>
              <span class="saved-count-pill" id="saved-exercises-count">0</span>
            </button>
          </div>

          <div class="saved-hub-content" id="saved-hub-content"></div>
        </div>`;

      modal.classList.add('open');

      const renderTab = tab => {
        modal.querySelectorAll('.saved-tab').forEach(b => {
          const isActive = b.dataset.tab === tab;
          b.classList.toggle('active', isActive);
          b.setAttribute('aria-selected', String(isActive));
        });

        const counts = SavedHub.getCounts();
        document.getElementById('saved-articles-count').textContent = counts.articles;
        document.getElementById('saved-exercises-count').textContent = counts.exercises;

        const content = document.getElementById('saved-hub-content');
        const root = document.body.dataset.root || '.';

        if (tab === 'articles') {
          const savedData = SavedHub.getSavedArticles();
          const slugs = Object.keys(savedData);
          const allArticles = window.ValhanArticles?.list || [];

          if (!slugs.length) {
            content.innerHTML = `
              <div class="saved-empty-state">
                <i class="fa-regular fa-bookmark"></i>
                <h3>${t('لا توجد مقالات محفوظة بعد', 'No saved articles yet')}</h3>
                <p class="muted">${t('يمكنك حفظ أي مقال من أكاديمية التدريب للرجوع إليه لاحقًا.', 'Bookmark articles from the Fitness Academy to review them anytime.')}</p>
                <a class="btn btn-outline" href="${root}/pages/academy.html">${t('تصفح الأكاديمية', 'Browse Academy')}</a>
              </div>`;
            return;
          }

          content.innerHTML = `
            <div class="saved-items-grid">
              ${slugs.map(slug => {
                const a = allArticles.find(item => item.slug === slug);
                if (!a) {
                  return `
                    <div class="saved-item-card">
                      <div class="saved-item-info">
                        <h4><a href="${root}/pages/article.html?a=${encodeURIComponent(slug)}">${slug}</a></h4>
                        <p class="muted" style="font-size:.84rem; margin:4px 0 0;">${t('قد يكون هذا المقال غير متاح حاليًا.', 'This article may no longer be available.')}</p>
                      </div>
                      <div class="saved-item-actions">
                        <a class="btn btn-outline btn-sm" href="${root}/pages/article.html?a=${encodeURIComponent(slug)}">${t('فتح', 'Open')}</a>
                        <button class="icon-btn remove-saved-btn" data-remove-article="${slug}" title="${t('حذف من المحفوظات', 'Remove')}">
                          <i class="fa-solid fa-trash-can"></i>
                        </button>
                      </div>
                    </div>`;
                }
                return `
                  <div class="saved-item-card">
                    <div class="saved-item-info">
                      <span class="tag" style="margin-bottom:6px;">${a.min} ${t('دقائق قراءة', 'min read')}</span>
                      <h4><a href="${root}/pages/article.html?a=${encodeURIComponent(a.slug)}">${lang() === 'ar' ? a.title[0] : a.title[1]}</a></h4>
                      <p class="muted" style="font-size:.84rem; margin:4px 0 0;">${lang() === 'ar' ? a.intro[0] : a.intro[1]}</p>
                    </div>
                    <div class="saved-item-actions">
                      <a class="btn btn-outline btn-sm" href="${root}/pages/article.html?a=${encodeURIComponent(a.slug)}">${t('قراءة', 'Read')}</a>
                      <button class="icon-btn remove-saved-btn" data-remove-article="${a.slug}" title="${t('حذف من المحفوظات', 'Remove')}">
                        <i class="fa-solid fa-trash-can"></i>
                      </button>
                    </div>
                  </div>`;
              }).join('')}
            </div>`;
        } else {
          // Exercises tab
          const savedData = SavedHub.getSavedExercises();
          const ids = Object.keys(savedData);
          const allExercises = window.ValhanExercises || [];

          if (!ids.length) {
            content.innerHTML = `
              <div class="saved-empty-state">
                <i class="fa-solid fa-dumbbell"></i>
                <h3>${t('لا توجد تمارين محفوظة بعد', 'No saved exercises yet')}</h3>
                <p class="muted">${t('اضغط على رمز الإشارة المرجعية لأي تمرين في المكتبة لحفظه هنا.', 'Click the bookmark icon on any movement in the library to save it here.')}</p>
                <a class="btn btn-outline" href="${root}/pages/exercises.html">${t('تصفح مكتبة التمارين', 'Browse Exercises')}</a>
              </div>`;
            return;
          }

          content.innerHTML = `
            <div class="saved-items-grid">
              ${ids.map(id => {
                const e = allExercises.find(item => item.id === id);
                if (!e) {
                  return `
                    <div class="saved-item-card">
                      <div class="saved-item-info">
                        <h4><a href="${root}/pages/exercises.html?exercise=${encodeURIComponent(id)}">${id}</a></h4>
                        <p class="muted" style="font-size:.84rem; margin:4px 0 0;">${t('قد يكون هذا التمرين غير متاح حاليًا.', 'This exercise may no longer be available.')}</p>
                      </div>
                      <div class="saved-item-actions">
                        <a class="btn btn-outline btn-sm" href="${root}/pages/exercises.html?exercise=${encodeURIComponent(id)}">${t('فتح', 'Open')}</a>
                        <button class="icon-btn remove-saved-btn" data-remove-exercise="${id}" title="${t('حذف من المحفوظات', 'Remove')}">
                          <i class="fa-solid fa-trash-can"></i>
                        </button>
                      </div>
                    </div>`;
                }
                const img = window.ValhanExerciseImage
                  ? window.ValhanExerciseImage(e.id)
                  : (e.image ? `${root}/assets/images/exercises/${e.image}` : '');
                const name = lang() === 'ar' ? (e.name?.ar || e.legacyName || e.name) : (e.name?.en || e.legacyName || e.name);
                return `
                  <div class="saved-item-card">
                    <div style="display:flex; gap:12px; align-items:center;">
                      ${img ? `<img src="${img}" alt="${name}" style="width:54px; height:54px; border-radius:8px; object-fit:cover; background:#222;">` : ''}
                      <div class="saved-item-info">
                        <h4><a href="${root}/pages/exercises.html?exercise=${encodeURIComponent(e.id)}">${name}</a></h4>
                        <div style="display:flex; gap:6px; flex-wrap:wrap; margin-top:4px;">
                          <span class="tag">${e.muscle || e.legacy?.muscle || ''}</span>
                          <span class="tag">${e.equipment || e.legacy?.equipment || ''}</span>
                        </div>
                      </div>
                    </div>
                    <div class="saved-item-actions">
                      <a class="btn btn-outline btn-sm" href="${root}/pages/exercises.html?exercise=${encodeURIComponent(e.id)}">${t('التفاصيل', 'Details')}</a>
                      <button class="icon-btn remove-saved-btn" data-remove-exercise="${e.id}" title="${t('حذف من المحفوظات', 'Remove')}">
                        <i class="fa-solid fa-trash-can"></i>
                      </button>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>`;
        }
      };

      renderTab(initialTab);

      modal._renderSavedTab = renderTab;
      if (!modal.dataset.eventsBound) {
        modal.addEventListener('click', e => {
          if (e.target.id === 'close-saved-hub' || e.target === modal) {
            modal.classList.remove('open');
          }

          const tabBtn = e.target.closest('.saved-tab');
          if (tabBtn) modal._renderSavedTab?.(tabBtn.dataset.tab);

          const removeArticle = e.target.closest('[data-remove-article]');
          if (removeArticle) {
            SavedHub.toggleArticle(removeArticle.dataset.removeArticle);
            modal._renderSavedTab?.('articles');
          }

          const removeExercise = e.target.closest('[data-remove-exercise]');
          if (removeExercise) {
            SavedHub.toggleExercise(removeExercise.dataset.removeExercise);
            modal._renderSavedTab?.('exercises');
          }
        });
        modal.dataset.eventsBound = 'true';
      }
    },

    updateUI() {
      // Sync bookmark buttons across page
      const savedArticles = SavedHub.getSavedArticles();
      document.querySelectorAll('[data-bookmark]').forEach(btn => {
        const slug = btn.dataset.bookmark;
        const isSaved = Boolean(savedArticles[slug]);
        btn.classList.toggle('is-saved', isSaved);
        btn.classList.toggle('active', isSaved);
        btn.setAttribute('aria-pressed', String(isSaved));
        btn.setAttribute('aria-label', isSaved ? t('إزالة من المحفوظات', 'Remove bookmark') : t('حفظ المقال', 'Save article'));
        const icon = btn.querySelector('i');
        if (icon) {
          icon.className = `fa-${isSaved ? 'solid' : 'regular'} fa-bookmark`;
        }
      });

      const savedExercises = SavedHub.getSavedExercises();
      document.querySelectorAll('[data-bookmark-exercise]').forEach(btn => {
        const id = btn.dataset.bookmarkExercise;
        const isSaved = Boolean(savedExercises[id]);
        btn.classList.toggle('is-saved', isSaved);
        btn.setAttribute('aria-pressed', String(isSaved));
        btn.setAttribute('aria-label', isSaved ? t('إزالة من المحفوظات', 'Remove bookmark') : t('حفظ التمرين', 'Save exercise'));
        const icon = btn.querySelector('i');
        if (icon) {
          icon.className = `fa-${isSaved ? 'solid' : 'regular'} fa-bookmark`;
        }
      });

      // Update header indicator if present
      const hubBtn = document.getElementById('header-saved-btn');
      if (hubBtn) {
        const counts = SavedHub.getCounts();
        let badge = hubBtn.querySelector('.hub-count-badge');
        if (!badge) {
          badge = document.createElement('span');
          badge.className = 'hub-count-badge';
          hubBtn.appendChild(badge);
        }
        badge.textContent = counts.total;
        badge.hidden = counts.total === 0;
      }
    }
  };

  window.ValhanSavedHub = SavedHub;

  function ensureHeaderButton() {
    const actions = document.querySelector('.head-actions');
    if (!actions || document.getElementById('header-saved-btn')) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.id = 'header-saved-btn';
    button.className = 'icon-btn header-saved-btn';
    button.dataset.openSaved = 'articles';
    button.setAttribute('aria-label', t('المحتوى المحفوظ', 'Saved content'));
    button.title = t('المحتوى المحفوظ', 'Saved content');
    button.innerHTML = '<i class="fa-regular fa-bookmark" aria-hidden="true"></i>';
    actions.insertBefore(button, actions.firstChild);
  }

  window.addEventListener('storage', event => {
    if (event.key !== ARTICLES_KEY && event.key !== EXERCISES_KEY) return;
    SavedHub.updateUI();
    const modal = document.getElementById('saved-hub-modal');
    if (modal?.classList.contains('open')) modal._renderSavedTab?.(modal.querySelector('.saved-tab.active')?.dataset.tab || 'articles');
  });

  window.addEventListener('valhan:saved-change', event => {
    const key = event.detail?.key;
    if (key !== ARTICLES_KEY && key !== EXERCISES_KEY) return;
    SavedHub.updateUI();
    const modal = document.getElementById('saved-hub-modal');
    if (modal?.classList.contains('open')) modal._renderSavedTab?.(modal.querySelector('.saved-tab.active')?.dataset.tab || 'articles');
  });

  document.addEventListener('DOMContentLoaded', () => {
    ensureHeaderButton();
    SavedHub.updateUI();

    // Global listener for exercise bookmarks
    document.addEventListener('click', e => {
      const articleBtn = e.target.closest('[data-bookmark]');
      if (articleBtn) {
        e.preventDefault();
        e.stopPropagation();
        SavedHub.toggleArticle(articleBtn.dataset.bookmark);
      }

      const btn = e.target.closest('[data-bookmark-exercise]');
      if (btn) {
        e.preventDefault();
        e.stopPropagation();
        SavedHub.toggleExercise(btn.dataset.bookmarkExercise);
      }

      const hubTrigger = e.target.closest('[data-open-saved]');
      if (hubTrigger) {
        e.preventDefault();
        SavedHub.openDrawer(hubTrigger.dataset.openSaved || 'articles');
      }
    });
  });
})();
