(() => {
  'use strict';
  if (document.body.dataset.page !== 'anatomy') return;

  const muscles = window.ValhanMuscles || [];
  const exercises = window.ValhanExercises || [];
  const relations = window.ValhanRelations || null;

  const lang = () => window.ValhanLang?.() || 'ar';
  const t = (ar, en) => lang() === 'ar' ? ar : en;
  const nameOf = item => item?.name?.[lang()] || item?.name?.ar || item?.name?.en || item?.legacyName || '';

  // Region adjustments applied on top of js/data/anatomy-map.js
  // - front neck polygons are the upper-trapezius slope  -> traps (visible from the front too)
  // - back "abductor" polygons are the posterior inner thigh -> adductors
  const REGION_OVERRIDES = {
    'front-neck-1': { muscleIds: ['traps'], precision: 'partial' },
    'front-neck-2': { muscleIds: ['traps'], precision: 'partial' },
    'back-abductor-1': { muscleIds: ['adductors'], precision: 'partial' },
    'back-abductor-2': { muscleIds: ['adductors'], precision: 'partial' }
  };
  const regions = (window.ValhanAnatomyMap?.regions || []).map(region =>
    REGION_OVERRIDES[region.id] ? { ...region, ...REGION_OVERRIDES[region.id] } : region);

  const SHOULDER_IDS = ['front-delts', 'side-delts', 'rear-delts'];
  const isInteractive = region => !['base', 'unmapped'].includes(region.precision);

  // `view` = the body side that shows the group best (null = keep the current side)
  const groups = [
    { id: 'all', ar: 'الكل', en: 'All Muscles', icon: 'fa-solid fa-shapes', color: 'all', view: null, ids: muscles.map(m => m.id) },
    { id: 'chest', ar: 'الصدر', en: 'Chest', icon: 'fa-solid fa-heart-pulse', color: 'chest', view: 'front', ids: ['chest'] },
    { id: 'back', ar: 'الظهر', en: 'Back', icon: 'fa-solid fa-person', color: 'back', view: 'back', ids: ['traps', 'mid-back', 'lats', 'lower-back'] },
    { id: 'shoulders', ar: 'الأكتاف', en: 'Shoulders', icon: 'fa-solid fa-dumbbell', color: 'shoulders', view: 'front', ids: ['shoulders', 'front-delts', 'side-delts', 'rear-delts'] },
    { id: 'arms', ar: 'الذراعين', en: 'Arms', icon: 'fa-solid fa-hand-fist', color: 'arms', view: 'front', ids: ['biceps', 'triceps', 'forearms'] },
    { id: 'legs', ar: 'الساقين والفخذ', en: 'Legs & Hips', icon: 'fa-solid fa-person-walking', color: 'legs', view: 'front', ids: ['quads', 'hamstrings', 'glutes', 'adductors', 'abductors', 'calves'] },
    { id: 'core', ar: 'البطن والجذع', en: 'Core & Abs', icon: 'fa-solid fa-shield-halved', color: 'core', view: 'front', ids: ['core', 'obliques'] }
  ];

  const stage = document.getElementById('anatomy-stage-canvas');
  const groupList = document.getElementById('anatomy-group-list');
  const muscleList = document.getElementById('anatomy-muscle-list');
  const title = document.getElementById('anatomy-title');
  const description = document.getElementById('anatomy-description');
  const meta = document.getElementById('anatomy-selected-meta');
  const related = document.getElementById('anatomy-exercises');
  const count = document.getElementById('anatomy-exercise-count');
  if (!stage || !groupList || !muscleList || !related) return;

  let activeGroup = 'all';
  let selectedMuscle = null;
  let currentView = 'front';
  let exercisePage = 0;

  const zoneMuscles = zone => (zone.dataset.muscle || '').split(/\s+/).filter(Boolean);
  const matchesMuscle = (ids, id) => ids.includes(id) || (id === 'shoulders' && ids.some(m => SHOULDER_IDS.includes(m)));
  const groupForMuscle = id => groups.find(group => group.id !== 'all' && group.ids.includes(id));
  const viewsForMuscle = id => [...new Set(regions
    .filter(region => isInteractive(region) && matchesMuscle(region.muscleIds || [], id))
    .map(region => region.view))];

  // ---------- Body SVG ----------
  function renderSvgFigures() {
    const view = currentView;
    const viewRegions = regions.filter(region => region.view === view);
    stage.innerHTML = `
      <div class="anatomy-stage-grid view-${view}">
        <div class="anatomy-figure-box anatomy-figure-${view}" data-figure="${view}">
          <div class="anatomy-figure-header">
            <span class="anatomy-figure-tag">${view === 'front' ? t('الأمام (Front View)', 'Front View') : t('الخلف (Back View)', 'Back View')}</span>
          </div>
          <svg class="anatomy-body-svg" viewBox="0 0 100 220" role="group" focusable="false" aria-label="${view === 'front' ? 'Anterior Anatomical View' : 'Posterior Anatomical View'}">
            <g class="anatomy-zones" data-anatomy-view="${view}">
              ${viewRegions.map(region => {
                const interactive = isInteractive(region);
                const muscleAttr = region.muscleIds.length ? `data-muscle="${region.muscleIds.join(' ')}"` : '';
                const interactiveClass = interactive ? 'is-interactive' : (region.precision === 'base' ? 'is-base' : 'is-unmapped');
                let labelText = region.source;
                if (region.muscleIds.length) {
                  const muscle = muscles.find(item => item.id === region.muscleIds[0]);
                  if (muscle) labelText = nameOf(muscle);
                }
                return `<polygon id="${region.id}" class="anatomy-zone precision-${region.precision} ${interactiveClass}"
                  data-region-id="${region.id}" ${muscleAttr} data-precision="${region.precision}" data-view="${view}"
                  points="${region.points}" ${interactive ? 'tabindex="0" role="button" aria-pressed="false"' : 'role="presentation"'}
                  aria-label="${labelText}"><title>${labelText}</title></polygon>`;
              }).join('\n')}
            </g>
          </svg>
        </div>
      </div>`;
  }

  // Selected muscle = strong light; muscles of the chosen group = soft light
  function applyHighlights() {
    const group = groups.find(item => item.id === activeGroup);
    const groupIds = group && group.id !== 'all' ? group.ids : [];
    stage.querySelectorAll('.anatomy-zone').forEach(zone => {
      const ids = zoneMuscles(zone);
      const selected = Boolean(selectedMuscle) && matchesMuscle(ids, selectedMuscle);
      const inGroup = groupIds.length > 0 && ids.some(id => groupIds.includes(id));
      zone.classList.toggle('is-selected', selected);
      zone.classList.toggle('group-highlight', inGroup && !selected);
      if (zone.classList.contains('is-interactive')) zone.setAttribute('aria-pressed', String(selected));
    });
  }

  function setView(view) {
    currentView = view;
    document.querySelectorAll('.anatomy-tabs button[data-view]').forEach(tab => {
      const active = tab.dataset.view === view;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-pressed', String(active));
    });
    renderSvgFigures();
    applyHighlights();
  }

  // ---------- Panel ----------
  const resetRelated = () => {
    count.textContent = '0';
    exercisePage = 0;
    related.innerHTML = `<p class="muted">${t('اختر عضلة من القائمة أو من خريطة الجسم لعرض التمارين المرتبطة بها.', 'Choose a muscle from the list or body map to view related exercises.')}</p>`;
  };

  const clearSelection = () => {
    selectedMuscle = null;
    muscleList.querySelectorAll('[data-muscle]').forEach(button => button.setAttribute('aria-pressed', 'false'));
    meta.innerHTML = '';
    resetRelated();
    applyHighlights();
  };

  const renderMuscles = group => {
    const items = group.id === 'all' ? muscles : muscles.filter(muscle => group.ids.includes(muscle.id));
    muscleList.innerHTML = items.map(muscle => `
      <button type="button" class="anatomy-muscle-option" data-muscle="${muscle.id}" aria-pressed="${selectedMuscle === muscle.id}">
        <span>${nameOf(muscle)}</span>
        ${muscle.id === 'side-delts' ? `<span class="tag tag-sm">${t('عزل جانبي', 'Lateral')}</span>` : ''}
      </button>`).join('');
  };

  const selectGroup = (group, { autoView = true } = {}) => {
    activeGroup = group.id;
    selectedMuscle = null;
    groupList.querySelectorAll('[data-group]').forEach(button => {
      button.classList.toggle('active', button.dataset.group === group.id);
      button.setAttribute('aria-pressed', String(button.dataset.group === group.id));
    });
    title.textContent = lang() === 'ar' ? group.ar : group.en;
    description.textContent = t(
      'اختر عضلة لعرض تفاصيلها والتمارين المرتبطة بها.',
      'Select a muscle to view detailed anatomy cues and related exercises.'
    );
    meta.innerHTML = '';
    resetRelated();
    renderMuscles(group);

    // switch Front/Back automatically, then light up the group's muscles
    if (autoView && group.view && group.view !== currentView) setView(group.view);
    else applyHighlights();
  };

  const metaFor = id => {
    if (id === 'lats' || id === 'mid-back') {
      return `
        <div class="anatomy-note-box shared-notice">
          <i class="fa-solid fa-circle-info"></i>
          <div>
            <strong>${t('منطقة عرض مشتركة:', 'Shared Visual Region:')}</strong>
            <p>${t(
              'يشترك هذا الجزء في الخريطة البصرية بين عضلات الظهر العريضة ومنتصف الظهر لعدم وجود فاصل سطحي في هذا النموذج، مع الحفاظ على تصنيفهما المستقل في قاعدة البيانات.',
              'This vector region is shared visually between Latissimus Dorsi and Mid-Back in this model, while remaining separate database identities.'
            )}</p>
          </div>
        </div>`;
    }
    if (['side-delts', 'adductors', 'abductors', 'shoulders'].includes(id)) {
      return `
        <div class="anatomy-note-box side-delts-notice">
          <i class="fa-solid fa-circle-exclamation"></i>
          <div>
            <strong>${t('ملاحظة حول العرض التشريحي:', 'Anatomy display note:')}</strong>
            <p>${t(
              'بعض الرؤوس والمجموعات لا تملك حدودًا مستقلة في الرسم الحالي؛ يتم تمييز أقرب منطقة ممثلة لها مع إبقاء شكل الخريطة كما هو.',
              'Some muscle heads and groups do not have dedicated boundaries in this illustration. Their closest represented region is highlighted without changing the map geometry.'
            )}</p>
          </div>
        </div>`;
    }
    return '';
  };

  // ---------- Related exercises: arrow carousel (rendered once, then slid) ----------
  const carouselParts = () => ({
    track: related.querySelector('.anatomy-carousel-track'),
    prev: related.querySelector('[data-exercise-step="-1"]'),
    next: related.querySelector('[data-exercise-step="1"]'),
    counter: related.querySelector('.anatomy-carousel-count')
  });
  const isRtl = el => (getComputedStyle(el).direction || document.documentElement.dir) === 'rtl';

  function updateCarousel() {
    const { track, prev, next, counter } = carouselParts();
    if (!track) return;
    const total = track.children.length;
    exercisePage = Math.max(0, Math.min(exercisePage, total - 1));
    // RTL: the next slide sits on the left, so the track moves right
    track.style.transform = `translateX(${(isRtl(track) ? 1 : -1) * exercisePage * 100}%)`;
    [...track.children].forEach((slide, index) => {
      const active = index === exercisePage;
      slide.setAttribute('aria-hidden', String(!active));
      slide.toggleAttribute('inert', !active);
    });
    if (prev) prev.disabled = exercisePage === 0;
    if (next) next.disabled = exercisePage >= total - 1;
    if (counter) counter.textContent = `${exercisePage + 1} / ${total}`;
  }

  const renderCard = (ex, role) => {
    const root = document.body.dataset.root || '.';
    const img = window.ValhanExerciseImage ? window.ValhanExerciseImage(ex.id) : '';
    const exName = lang() === 'ar' ? (ex.name?.ar || ex.legacyName || ex.name) : (ex.name?.en || ex.legacyName || ex.name);
    const isSaved = window.ValhanSavedHub?.isExerciseSaved(ex.id);
    return `
      <div class="anatomy-exercise-card">
        <a class="anatomy-exercise-link" href="${root}/pages/exercises.html?exercise=${encodeURIComponent(ex.id)}">
          ${img ? `<img src="${img}" alt="${exName}" class="anatomy-ex-thumb">` : ''}
          <div class="anatomy-ex-info">
            <span class="anatomy-ex-title">${exName}</span>
            <div class="anatomy-ex-tags">
              <span class="tag tag-sm ${role === 'primary' ? 'tag-primary' : 'tag-secondary'}">${role === 'primary' ? t('أساسي', 'Primary') : t('مساعد', 'Secondary')}</span>
              <span class="tag tag-sm">${ex.equipment || ex.legacy?.equipment || ''}</span>
            </div>
          </div>
        </a>
        <button type="button" class="bookmark-btn ${isSaved ? 'is-saved' : ''}" data-bookmark-exercise="${ex.id}" aria-pressed="${Boolean(isSaved)}" aria-label="${t('حفظ التمرين', 'Save exercise')}">
          <i class="fa-${isSaved ? 'solid' : 'regular'} fa-bookmark" aria-hidden="true"></i>
        </button>
      </div>`;
  };

  function renderRelated(id) {
    const relationId = id === 'abductors' ? 'glutes' : id;
    let primaryEx;
    let secondaryEx;
    if (relations) {
      const res = relations.getExercisesForMuscle(relationId);
      primaryEx = res.primary;
      secondaryEx = res.secondary;
    } else {
      primaryEx = exercises.filter(ex => (ex.primaryMuscles || []).includes(relationId));
      secondaryEx = exercises.filter(ex => (ex.secondaryMuscles || []).includes(relationId));
    }

    const cards = [...primaryEx.map(e => renderCard(e, 'primary')), ...secondaryEx.map(e => renderCard(e, 'secondary'))];
    count.textContent = String(cards.length);
    exercisePage = 0;

    if (!cards.length) {
      related.innerHTML = `<p class="muted">${t('لا توجد تمارين مسجلة حاليًا لهذه العضلة.', 'No exercises linked to this muscle yet.')}</p>`;
      return;
    }

    related.innerHTML = `
      <div class="anatomy-carousel" role="group" aria-roledescription="carousel" aria-label="${t('التمارين المرتبطة', 'Related exercises')}">
        <button type="button" class="anatomy-carousel-arrow" data-exercise-step="-1" aria-label="${t('التمرين السابق', 'Previous exercise')}"><i class="fa-solid fa-chevron-right" aria-hidden="true"></i></button>
        <div class="anatomy-carousel-window" tabindex="0">
          <div class="anatomy-carousel-track">${cards.map((card, index) => `<div class="anatomy-carousel-slide" data-slide="${index}">${card}</div>`).join('')}</div>
        </div>
        <button type="button" class="anatomy-carousel-arrow" data-exercise-step="1" aria-label="${t('التمرين التالي', 'Next exercise')}"><i class="fa-solid fa-chevron-left" aria-hidden="true"></i></button>
      </div>
      <p class="anatomy-carousel-count" aria-live="polite"></p>`;
    updateCarousel();
  }

  const stepCarousel = step => {
    exercisePage += step;
    updateCarousel();
  };

  related.addEventListener('click', event => {
    const button = event.target.closest('[data-exercise-step]');
    if (!button || button.disabled) return;
    stepCarousel(Number(button.dataset.exerciseStep));
  });

  related.addEventListener('keydown', event => {
    if (!event.target.closest('.anatomy-carousel-window')) return;
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    const { track } = carouselParts();
    if (!track) return;
    event.preventDefault();
    stepCarousel((event.key === 'ArrowRight' ? 1 : -1) * (isRtl(track) ? -1 : 1));
  });

  // swipe on touch screens
  let swipeStartX = null;
  related.addEventListener('pointerdown', event => {
    swipeStartX = event.pointerType === 'touch' && event.target.closest('.anatomy-carousel-window') ? event.clientX : null;
  });
  related.addEventListener('pointerup', event => {
    if (swipeStartX === null) return;
    const dx = event.clientX - swipeStartX;
    swipeStartX = null;
    const { track } = carouselParts();
    if (!track || Math.abs(dx) < 45) return;
    // dragging content left reveals the slide on the right (LTR: next, RTL: previous)
    stepCarousel((dx < 0 ? 1 : -1) * (isRtl(track) ? -1 : 1));
  });

  // ---------- Select a muscle ----------
  const selectMuscle = id => {
    const muscle = muscles.find(item => item.id === id);
    if (!muscle) return;

    selectedMuscle = id;
    title.textContent = nameOf(muscle);
    description.textContent = muscle.description?.[lang()] || muscle.description?.ar || t(
      'التمارين المرتبطة بهذه العضلة معروضة أدناه مع التمييز بين الاستهداف الأساسي والثانوي.',
      'Exercises linked to this muscle are listed below, separated by primary and secondary targets.'
    );
    meta.innerHTML = metaFor(id);
    muscleList.querySelectorAll('[data-muscle]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.muscle === id));
    });

    // show the side of the body where this muscle is actually drawn
    const views = viewsForMuscle(id);
    if (views.length && !views.includes(currentView)) setView(views[0]);
    else applyHighlights();

    renderRelated(id);
  };

  // A zone can hold several muscles (e.g. lats + mid-back): repeated activation cycles through them
  function activateZone(zone) {
    const ids = zoneMuscles(zone);
    if (!ids.length) return;
    const index = ids.indexOf(selectedMuscle);
    selectMuscle(index === -1 ? ids[0] : ids[(index + 1) % ids.length]);
  }

  // ---------- Events ----------
  groupList.innerHTML = groups.map(group => `
    <button type="button" class="anatomy-group-option ${group.color}" data-group="${group.id}" aria-pressed="false">
      <span class="anatomy-group-icon"><i class="${group.icon}" aria-hidden="true"></i></span>
      <span>${lang() === 'ar' ? group.ar : group.en}</span>
      <i class="fa-solid fa-circle anatomy-group-dot" aria-hidden="true"></i>
    </button>`).join('');

  groupList.addEventListener('click', event => {
    const button = event.target.closest('[data-group]');
    const group = groups.find(item => item.id === button?.dataset.group);
    if (group) selectGroup(group);
  });

  muscleList.addEventListener('click', event => {
    const button = event.target.closest('[data-muscle]');
    if (button) selectMuscle(button.dataset.muscle);
  });

  stage.addEventListener('click', event => {
    const zone = event.target.closest('.anatomy-zone');
    if (zone) {
      if (zone.classList.contains('is-interactive')) activateZone(zone);
      return; // head / knees / unmapped parts do nothing
    }
    if (selectedMuscle) clearSelection(); // click on the empty background
  });

  stage.addEventListener('keydown', event => {
    const zone = event.target.closest?.('.anatomy-zone.is-interactive');
    if (event.key === 'Escape' && selectedMuscle) {
      clearSelection();
      return;
    }
    if (!zone || (event.key !== 'Enter' && event.key !== ' ')) return;
    event.preventDefault();
    const regionId = zone.dataset.regionId;
    activateZone(zone); // SVG elements have no click(): call the handler directly
    stage.querySelector(`[data-region-id="${regionId}"]`)?.focus({ preventScroll: true });
  });

  document.querySelectorAll('.anatomy-tabs button[data-view]').forEach(button => {
    button.addEventListener('click', () => setView(button.dataset.view));
  });

  // ---------- Init ----------
  renderSvgFigures();
  if (groups.length) {
    selectGroup(groups[0], { autoView: false });
    const requestedMuscle = new URLSearchParams(location.search).get('muscle');
    if (requestedMuscle && muscles.some(muscle => muscle.id === requestedMuscle)) {
      const targetGroup = groupForMuscle(requestedMuscle);
      if (targetGroup) selectGroup(targetGroup, { autoView: false });
      selectMuscle(requestedMuscle);
    }
  }
})();
