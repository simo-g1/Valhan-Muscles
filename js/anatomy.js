(() => {
  'use strict';
  if (document.body.dataset.page !== 'anatomy') return;

  const muscles = window.ValhanMuscles || [];
  const exercises = window.ValhanExercises || [];
  const lang = () => window.ValhanLang?.() || 'ar';
  const t = (ar, en) => lang() === 'ar' ? ar : en;
  const nameOf = item => item?.name?.[lang()] || item?.name?.ar || item?.name?.en || '';
  const groups = [
    { id: 'chest', ar: 'الصدر', en: 'Chest', icon: 'fa-solid fa-heart-pulse', color: 'chest', ids: ['chest'] },
    { id: 'back', ar: 'الظهر', en: 'Back', icon: 'fa-solid fa-person', color: 'back', ids: ['traps', 'mid-back', 'lats', 'lower-back'] },
    { id: 'shoulders', ar: 'الأكتاف', en: 'Shoulders', icon: 'fa-solid fa-dumbbell', color: 'shoulders', ids: ['front-delts', 'side-delts', 'rear-delts'] },
    { id: 'arms', ar: 'الذراعين', en: 'Arms', icon: 'fa-solid fa-hand-fist', color: 'arms', ids: ['biceps', 'triceps'] },
    { id: 'legs', ar: 'الساقين', en: 'Legs', icon: 'fa-solid fa-person-walking', color: 'legs', ids: ['quads', 'hamstrings', 'glutes', 'adductors', 'calves'] },
    { id: 'core', ar: 'البطن والجذع', en: 'Core', icon: 'fa-solid fa-shield-halved', color: 'core', ids: ['core'] }
  ];

  const groupList = document.getElementById('anatomy-group-list');
  const muscleList = document.getElementById('anatomy-muscle-list');
  const title = document.getElementById('anatomy-title');
  const description = document.getElementById('anatomy-description');
  const meta = document.getElementById('anatomy-selected-meta');
  const related = document.getElementById('anatomy-exercises');
  const count = document.getElementById('anatomy-exercise-count');
  const people = [...document.querySelectorAll('[data-person]')];
  let activeGroup = null;
  let selectedMuscle = null;

  const groupForMuscle = id => groups.find(group => group.ids.includes(id));
  const clearSelection = () => {
    selectedMuscle = null;
    document.querySelectorAll('.anatomy-zones [data-muscle]').forEach(zone => zone.classList.remove('is-selected'));
    muscleList.querySelectorAll('[data-muscle]').forEach(button => button.setAttribute('aria-pressed', 'false'));
    meta.textContent = '';
    count.textContent = '0';
    related.innerHTML = `<p class="muted">${t('اختر عضلة لعرض التمارين المرتبطة بها.', 'Choose a muscle to see related exercises.')}</p>`;
  };

  const renderMuscles = group => {
    const items = muscles.filter(muscle => group.ids.includes(muscle.id));
    muscleList.innerHTML = items.map(muscle => `
      <button type="button" class="anatomy-muscle-option" data-muscle="${muscle.id}" aria-pressed="${selectedMuscle === muscle.id}">
        <span>${nameOf(muscle)}</span><small>${muscle.reviewStatus === 'approved' ? t('تمت المراجعة', 'Reviewed') : t('قيد المراجعة', 'Pending')}</small>
      </button>`).join('');
  };

  const selectGroup = group => {
    activeGroup = group.id;
    selectedMuscle = null;
    groupList.querySelectorAll('[data-group]').forEach(button => button.classList.toggle('active', button.dataset.group === group.id));
    title.textContent = lang() === 'ar' ? group.ar : group.en;
    description.textContent = t('اختر عضلة من القائمة أو من الخريطة لعرض تفاصيلها والتمارين المرتبطة بها.', 'Choose a muscle from the list or map to view its details and related exercises.');
    clearSelection();
    renderMuscles(group);
    document.querySelectorAll('.anatomy-zones [data-muscle]').forEach(zone => zone.classList.toggle('group-highlight', group.ids.includes(zone.dataset.muscle)));
  };

  const selectMuscle = id => {
    const muscle = muscles.find(item => item.id === id);
    if (!muscle) return;
    const group = groupForMuscle(id);
    if (group && activeGroup !== group.id) selectGroup(group);
    selectedMuscle = id;
    title.textContent = nameOf(muscle);
    description.textContent = t('المعلومات التشريحية وارتباطات التمارين المعروضة قيد مراجعة الكوتش.', 'Anatomy details and exercise associations are pending coach review.');
    meta.innerHTML = `<span class="anatomy-review-badge">${t('قيد مراجعة الكوتش', 'Pending coach review')}</span>`;
    muscleList.querySelectorAll('[data-muscle]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.muscle === id)));
    document.querySelectorAll('.anatomy-zones [data-muscle]').forEach(zone => {
      zone.classList.toggle('is-selected', zone.dataset.muscle === id);
      zone.classList.remove('group-highlight');
    });
    const matches = exercises.filter(ex => [...(ex.primaryMuscles || []), ...(ex.secondaryMuscles || [])].includes(id));
    count.textContent = String(matches.length);
    related.innerHTML = matches.length ? matches.map(ex => `
      <a class="anatomy-exercise" href="./exercises.html?exercise=${encodeURIComponent(ex.id)}">
        <span class="anatomy-exercise-name">${window.ValhanExerciseName?.(ex) || ex.legacyName || nameOf(ex)}</span><span class="anatomy-exercise-arrow" aria-hidden="true">↗</span>
      </a>`).join('') : `<p class="muted">${t('لا توجد تمارين مرتبطة حاليًا.', 'No linked exercises yet.')}</p>`;
  };

  groupList.innerHTML = groups.map(group => `
    <button type="button" class="anatomy-group-option ${group.color}" data-group="${group.id}">
      <span class="anatomy-group-icon"><i class="${group.icon}" aria-hidden="true"></i></span>
      <span>${lang() === 'ar' ? group.ar : group.en}</span><i class="fa-solid fa-circle anatomy-group-dot" aria-hidden="true"></i>
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
  document.querySelector('.anatomy-figure')?.addEventListener('click', event => {
    const zone = event.target.closest('[data-muscle]');
    if (zone) selectMuscle(zone.dataset.muscle);
  });

  document.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => {
    const view = button.dataset.view;
    people.forEach(person => { person.hidden = view !== 'all' && person.dataset.person !== view; });
    document.querySelectorAll('[data-view]').forEach(tab => {
      const active = tab === button;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-pressed', String(active));
    });
  }));

  if (groups.length) selectGroup(groups[0]);
})();
