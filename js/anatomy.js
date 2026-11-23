(() => {
  'use strict';
  if (document.body.dataset.page !== 'anatomy') return;

  const muscles = window.ValhanMuscles || [];
  const exercises = window.ValhanExercises || [];
  const anatomyMap = window.ValhanAnatomyMap || { regions: [] };
  const relations = window.ValhanRelations || null;

  const lang = () => window.ValhanLang?.() || 'ar';
  const t = (ar, en) => lang() === 'ar' ? ar : en;
  const nameOf = item => item?.name?.[lang()] || item?.name?.ar || item?.name?.en || item?.legacyName || '';

  const groups = [
    { id: 'all', ar: 'الكل', en: 'All Muscles', icon: 'fa-solid fa-shapes', color: 'all', ids: muscles.map(m => m.id) },
    { id: 'chest', ar: 'الصدر', en: 'Chest', icon: 'fa-solid fa-heart-pulse', color: 'chest', ids: ['chest'] },
    { id: 'back', ar: 'الظهر', en: 'Back', icon: 'fa-solid fa-person', color: 'back', ids: ['traps', 'mid-back', 'lats', 'lower-back'] },
    { id: 'shoulders', ar: 'الأكتاف', en: 'Shoulders', icon: 'fa-solid fa-dumbbell', color: 'shoulders', ids: ['shoulders', 'front-delts', 'side-delts', 'rear-delts'] },
    { id: 'arms', ar: 'الذراعين', en: 'Arms', icon: 'fa-solid fa-hand-fist', color: 'arms', ids: ['biceps', 'triceps', 'forearms'] },
    { id: 'legs', ar: 'الساقين والفخذ', en: 'Legs & Hips', icon: 'fa-solid fa-person-walking', color: 'legs', ids: ['quads', 'hamstrings', 'glutes', 'adductors', 'abductors', 'calves'] },
    { id: 'core', ar: 'البطن والجذع', en: 'Core & Abs', icon: 'fa-solid fa-shield-halved', color: 'core', ids: ['core', 'obliques'] }
  ];

  const stage = document.getElementById('anatomy-stage-canvas');
  const groupList = document.getElementById('anatomy-group-list');
  const muscleList = document.getElementById('anatomy-muscle-list');
  const title = document.getElementById('anatomy-title');
  const description = document.getElementById('anatomy-description');
  const meta = document.getElementById('anatomy-selected-meta');
  const related = document.getElementById('anatomy-exercises');
  const count = document.getElementById('anatomy-exercise-count');

  let activeGroup = 'all';
  let selectedMuscle = null;
  let currentView = 'front';
  let exercisePage = 0;

  // Render SVG Body Models (Candidate B Direction)
  function renderSvgFigures() {
    if (!stage) return;

    const buildFigure = view => {
      const regions = anatomyMap.regions.filter(r => r.view === view);
      return `
        <div class="anatomy-figure-box anatomy-figure-${view}" data-figure="${view}">
          <div class="anatomy-figure-header">
            <span class="anatomy-figure-tag">${view === 'front' ? t('الأمام (Front View)', 'Front View') : t('الخلف (Back View)', 'Back View')}</span>
          </div>
          <svg class="anatomy-body-svg" viewBox="0 0 100 220" role="group" aria-label="${view === 'front' ? 'Anterior Anatomical View' : 'Posterior Anatomical View'}">
            <defs>
              <filter id="glow-${view}" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="1.5" flood-color="#ff922e" flood-opacity="0.85"/>
              </filter>
            </defs>
            <g class="anatomy-zones" data-anatomy-view="${view}">
              ${regions.map(r => {
                const isInteractive = !['base', 'unmapped'].includes(r.precision);
                const muscleAttr = r.muscleIds.length ? `data-muscle="${r.muscleIds.join(' ')}"` : '';
                const precisionClass = `precision-${r.precision}`;
                const interactiveClass = isInteractive ? 'is-interactive' : (r.precision === 'base' ? 'is-base' : 'is-unmapped');
                
                // Accessible label
                let labelText = r.source;
                if (r.muscleIds.length) {
                  const mObj = muscles.find(m => m.id === r.muscleIds[0]);
                  if (mObj) labelText = nameOf(mObj);
                }

                return `
                  <polygon
                    id="${r.id}"
                    class="anatomy-zone ${precisionClass} ${interactiveClass}"
                    data-region-id="${r.id}"
                    data-source="${r.source}"
                    ${muscleAttr}
                    data-precision="${r.precision}"
                    data-view="${view}"
                    points="${r.points}"
                    ${isInteractive ? 'tabindex="0" role="button"' : 'role="presentation"'}
                    aria-label="${labelText}">
                    <title>${labelText}</title>
                  </polygon>`;
              }).join('\n')}
            </g>
          </svg>
        </div>`;
    };

    stage.innerHTML = `
      <div class="anatomy-stage-grid view-${currentView}">
        ${buildFigure(currentView)}
      </div>`;
  }

  const groupForMuscle = id => groups.find(group => group.id !== 'all' && group.ids.includes(id));

  const clearSelection = () => {
    selectedMuscle = null;
    document.querySelectorAll('.anatomy-zone').forEach(zone => {
      zone.classList.remove('is-selected', 'group-highlight');
    });
    muscleList.querySelectorAll('[data-muscle]').forEach(button => {
      button.setAttribute('aria-pressed', 'false');
    });
    meta.innerHTML = '';
    count.textContent = '0';
    exercisePage = 0;
    related.innerHTML = `<p class="muted">${t('اختر عضلة من القائمة أو من خريطة الجسم لعرض التمارين المرتبطة بها.', 'Choose a muscle from the list or body map to view related exercises.')}</p>`;
  };

  const renderMuscles = group => {
    const items = group.id === 'all' ? muscles : muscles.filter(muscle => group.ids.includes(muscle.id));
    muscleList.innerHTML = items.map(muscle => {
      const isSideDelts = muscle.id === 'side-delts';
      return `
        <button type="button" class="anatomy-muscle-option" data-muscle="${muscle.id}" aria-pressed="${selectedMuscle === muscle.id}">
          <span>${nameOf(muscle)}</span>
          ${isSideDelts ? `<span class="tag tag-sm">${t('عزل جانبي', 'Lateral')}</span>` : ''}
        </button>`;
    }).join('');
  };

  const selectGroup = group => {
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
    clearSelection();
    renderMuscles(group);

    // Group highlight on body
    document.querySelectorAll('.anatomy-zone').forEach(zone => {
      const zoneMuscles = (zone.dataset.muscle || '').split(/\s+/).filter(Boolean);
      const inGroup = group.id !== 'all' && zoneMuscles.some(m => group.ids.includes(m));
      zone.classList.toggle('group-highlight', inGroup);
    });
  };

  const selectMuscle = id => {
    const muscle = muscles.find(item => item.id === id);
    if (!muscle) return;

    const sameMuscle = selectedMuscle === id;
    selectedMuscle = id;
    if (!sameMuscle) exercisePage = 0;
    title.textContent = nameOf(muscle);
    description.textContent = muscle.description?.[lang()] || muscle.description?.ar || t(
      'التمارين المرتبطة بهذه العضلة معروضة أدناه مع التمييز بين الاستهداف الأساسي والثانوي.',
      'Exercises linked to this muscle are listed below, separated by primary and secondary targets.'
    );

    // Meta precision notes & warnings
    let metaHtml = '';
    if (id === 'lats' || id === 'mid-back') {
      metaHtml = `
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
    } else if (id === 'side-delts' || id === 'adductors' || id === 'abductors' || id === 'shoulders') {
      metaHtml = `
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

    meta.innerHTML = metaHtml;

    // Update list pressed state
    muscleList.querySelectorAll('[data-muscle]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.muscle === id));
    });

    // Update SVG zones
    document.querySelectorAll('.anatomy-zone').forEach(zone => {
      const zoneMuscles = (zone.dataset.muscle || '').split(/\s+/).filter(Boolean);
      // Strictly prevent side-delts from lighting on front/rear delts, and vice versa (Rule 4)
      const isMatch = zoneMuscles.includes(id) || (id === 'shoulders' && zoneMuscles.some(m => ['front-delts','side-delts','rear-delts'].includes(m))); 
      zone.classList.toggle('is-selected', isMatch);
      zone.classList.remove('group-highlight');
    });

    // Auto-view hint if target muscle is only on the opposite view
    const matchingRegions = anatomyMap.regions.filter(region => {
      const ids = region.muscleIds || [];
      return ids.includes(id) || (id === 'shoulders' && ids.some(m => ['front-delts','side-delts','rear-delts'].includes(m)));
    });
    if (matchingRegions.length) {
      const views = [...new Set(matchingRegions.map(region => region.view))];
      if (currentView !== 'all' && !views.includes(currentView)) {
        // Target muscle is on the other side
        const targetView = views[0];
        const viewTabs = document.querySelectorAll('.anatomy-tabs button[data-view]');
        const targetTab = [...viewTabs].find(t => t.dataset.view === targetView);
        if (targetTab) {
          targetTab.click();
        }
      }
    }

    // Related exercises query
    let primaryEx = [];
    let secondaryEx = [];

    if (relations) {
      const res = relations.getExercisesForMuscle(id === 'abductors' ? 'glutes' : id);
      primaryEx = res.primary;
      secondaryEx = res.secondary;
    } else {
      const relationId = id === 'abductors' ? 'glutes' : id;
      primaryEx = exercises.filter(ex => (ex.primaryMuscles || []).includes(relationId));
      secondaryEx = exercises.filter(ex => (ex.secondaryMuscles || []).includes(relationId));
    }

    const totalCount = primaryEx.length + secondaryEx.length;
    count.textContent = String(totalCount);

    const root = document.body.dataset.root || '.';

    if (!totalCount) {
      related.innerHTML = `<p class="muted">${t('لا توجد تمارين مسجلة حاليًا لهذه العضلة.', 'No exercises linked to this muscle yet.')}</p>`;
      return;
    }

    const renderCard = (ex, role) => {
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
          <button class="bookmark-btn ${isSaved ? 'is-saved' : ''}" data-bookmark-exercise="${ex.id}" aria-label="${t('حفظ التمرين', 'Save exercise')}">
            <i class="fa-${isSaved ? 'solid' : 'regular'} fa-bookmark"></i>
          </button>
        </div>`;
    };

    let html = '';
    if (primaryEx.length) {
      html += `
        <div class="anatomy-ex-group">
          <h4 class="anatomy-ex-group-title"><i class="fa-solid fa-bullseye"></i> ${t('تمارين الاستهداف الأساسي', 'Primary Target Exercises')} (${primaryEx.length})</h4>
          <div class="anatomy-ex-grid">${primaryEx.map(e => renderCard(e, 'primary')).join('')}</div>
        </div>`;
    }

    if (secondaryEx.length) {
      html += `
        <div class="anatomy-ex-group" style="margin-top:14px;">
          <h4 class="anatomy-ex-group-title"><i class="fa-solid fa-shield-halved"></i> ${t('تمارين تشارك فيها كعضلة مساعدة', 'Secondary / Synergist Target')} (${secondaryEx.length})</h4>
          <div class="anatomy-ex-grid">${secondaryEx.map(e => renderCard(e, 'secondary')).join('')}</div>
        </div>`;
    }

    const cards = [...primaryEx.map(e => renderCard(e, 'primary')), ...secondaryEx.map(e => renderCard(e, 'secondary'))];
    exercisePage = Math.min(exercisePage, Math.max(0, cards.length - 1));
    related.innerHTML = `
      <div class="anatomy-carousel" aria-label="${t('التمارين المرتبطة','Related exercises')}">
        <button type="button" class="anatomy-carousel-arrow" data-exercise-step="-1" aria-label="${t('التمرين السابق','Previous exercise')}" ${exercisePage === 0 ? 'disabled' : ''}><i class="fa-solid fa-chevron-right"></i></button>
        <div class="anatomy-carousel-window"><div class="anatomy-carousel-track" style="transform:translateX(${-exercisePage * 100}%)">${cards.map((card, index) => `<div class="anatomy-carousel-slide" data-slide="${index}">${card}</div>`).join('')}</div></div>
        <button type="button" class="anatomy-carousel-arrow" data-exercise-step="1" aria-label="${t('التمرين التالي','Next exercise')}" ${exercisePage >= cards.length - 1 ? 'disabled' : ''}><i class="fa-solid fa-chevron-left"></i></button>
      </div>
      <p class="anatomy-carousel-count">${exercisePage + 1} / ${cards.length}</p>`;
  };

  // Build group buttons
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

  related.addEventListener('click', event => {
    const button = event.target.closest('[data-exercise-step]');
    if (!button || button.disabled) return;
    exercisePage += Number(button.dataset.exerciseStep);
    selectMuscle(selectedMuscle);
  });

  // Body figure interaction
  stage?.addEventListener('click', event => {
    const zone = event.target.closest('.anatomy-zone.is-interactive');
    if (!zone) { clearSelection(); return; }

    const muscleIds = (zone.dataset.muscle || '').split(/\s+/).filter(Boolean);
    if (!muscleIds.length) return;

    if (muscleIds.length === 1) {
      selectMuscle(muscleIds[0]);
    } else {
      // Shared region (e.g. lats & mid-back)
      // Pick first or toggle
      if (selectedMuscle === muscleIds[0]) {
        selectMuscle(muscleIds[1]);
      } else {
        selectMuscle(muscleIds[0]);
      }
    }
  });

  // Keyboard accessibility on SVG zones
  stage?.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      const zone = event.target.closest('.anatomy-zone.is-interactive');
      if (zone) {
        event.preventDefault();
        zone.click();
      }
    }
  });

  // View switcher (all / front / back)
  document.querySelectorAll('.anatomy-tabs button[data-view]').forEach(button => {
    button.addEventListener('click', () => {
      const view = button.dataset.view;
      currentView = view;
      document.querySelectorAll('.anatomy-tabs button[data-view]').forEach(tab => {
        const active = tab === button;
        tab.classList.toggle('active', active);
        tab.setAttribute('aria-pressed', String(active));
      });

      renderSvgFigures();
      if (selectedMuscle) {
        const selected = selectedMuscle;
        document.querySelectorAll('.anatomy-zone').forEach(zone => {
          const ids = (zone.dataset.muscle || '').split(/\s+/).filter(Boolean);
          zone.classList.toggle('is-selected', ids.includes(selected) || (selected === 'shoulders' && ids.some(id => ['front-delts','side-delts','rear-delts'].includes(id))));
        });
      }
    });
  });

  // Initialize
  renderSvgFigures();
  if (groups.length) {
    selectGroup(groups[0]);
    const requestedMuscle = new URLSearchParams(location.search).get('muscle');
    if (requestedMuscle && muscles.some(muscle => muscle.id === requestedMuscle)) {
      const targetGroup = groupForMuscle(requestedMuscle);
      if (targetGroup) selectGroup(targetGroup);
      selectMuscle(requestedMuscle);
    }
  }
})();
