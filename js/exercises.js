(() => {
  'use strict';

  const root = document.body.dataset.root || '.';
  const exercises = window.ValhanExercises || [];
  const t = window.ValhanT;
  const lang = () => window.ValhanLang?.() || 'ar';
  const exName = ex => window.ValhanExerciseName?.(ex) || ex.legacyName || ex.name?.en || '';
  const muscleName = ex => ex.muscle;

  const imageFor = id => `${root}/assets/images/exercises/${exercises.find(item => item.id === id)?.image || 'machines/chest-press.webp'}`;
  window.ValhanExerciseImage = imageFor;
  const cardFor = exercise => {
    const saved = window.ValhanSavedHub?.isExerciseSaved(exercise.id) || false;
    return `
      <article class="card exercise-card reveal" data-exercise="${exercise.id}">
        <a class="exercise-card-link" href="?exercise=${encodeURIComponent(exercise.id)}">
          <img src="${imageFor(exercise.id)}" alt="${exName(exercise)}" loading="lazy">
          <div class="body">
            <h3>${exName(exercise)}</h3>
            <p>${muscleName(exercise)} · ${exercise.equipment}</p>
            <span class="tag">${t('التفاصيل والفيديوهات', 'Details & videos')} ←</span>
          </div>
        </a>
        <button type="button" class="bookmark-btn exercise-card-bookmark ${saved ? 'is-saved' : ''}" data-bookmark-exercise="${exercise.id}" aria-pressed="${saved}" aria-label="${t('حفظ التمرين', 'Save exercise')}">
          <i class="fa-${saved ? 'solid' : 'regular'} fa-bookmark" aria-hidden="true"></i>
        </button>
      </article>`;
  };

  const detailFor = exercise => {
    const query = encodeURIComponent(`${exName(exercise)} exercise tutorial`);
    const saved = window.ValhanSavedHub?.isExerciseSaved(exercise.id) || false;
    return `
      <section class="page-hero"><div class="container">
        <span class="eyebrow">EXERCISE GUIDE</span><h1>${exName(exercise)}</h1>
        <p>${muscleName(exercise)} · ${exercise.equipment}</p>
      </div></section>
      <section class="section"><div class="container detail-layout">
        <img class="detail-image" src="${imageFor(exercise.id)}" alt="${exName(exercise)}">
        <div><span class="eyebrow">HOW TO PERFORM</span><h2>${exName(exercise)}</h2>
          <div class="exercise-bookmark">
            <button type="button" class="btn btn-outline bookmark-btn ${saved ? 'is-saved' : ''}" data-bookmark-exercise="${exercise.id}" aria-pressed="${saved}" aria-label="${saved ? t('إزالة من المحفوظات', 'Remove bookmark') : t('حفظ التمرين', 'Save exercise')}">
              <i class="fa-${saved ? 'solid' : 'regular'} fa-bookmark" aria-hidden="true"></i>
            </button>
            <p>${t('حفظ التمرين', 'Save Exercise')}</p>
          </div>
          <p>${exercise.how}</p>
          <div class="badge-row"><span class="tag">${muscleName(exercise)}</span><span class="tag">${exercise.equipment}</span><span class="tag">${exercise.target}</span></div>
          <h3>${t('خطوات الأداء', 'Execution cues')}</h3>
          <ol>
            <li>${t('اضبط الجهاز أو وضع البداية بما يناسبك.', 'Set up the machine and starting position.')}</li>
            <li>${t(exercise.how, 'Move through a controlled range of motion.')}</li>
            <li>${t('حافظ على التحكم في مرحلة الرجوع وتوقف إذا شعرت بألم.', 'Control the return and stop if you feel pain.')}</li>
          </ol>
          <div class="video-list"><h3>${t('فيديوهات توضيحية', 'Video tutorials')}</h3>
            <a class="video-link" target="_blank" rel="noopener noreferrer" href="https://www.youtube.com/results?search_query=${query}">▶ ${t('ابحث عن شرح التمرين على YouTube', 'Find exercise demonstrations on YouTube')}</a>
            <a class="video-link" target="_blank" rel="noopener noreferrer" href="https://www.youtube.com/results?search_query=${encodeURIComponent(`${exName(exercise)} form mistakes`)}">▶ ${t('الأخطاء الشائعة وطريقة الأداء الصحيحة', 'Common mistakes and proper form')}</a>
          </div>
          <p class="muted" style="margin-top:14px;font-size:.82rem">${t('روابط البحث تفتح نتائج فيديوهات حديثة؛ اختر شرحًا من مدرب موثوق.', 'Search links open current video results; choose instruction from a qualified source.')}</p>
          ${exercise.primaryMuscles?.length ? `<a class="btn btn-outline" href="${root}/pages/anatomy.html?muscle=${encodeURIComponent(exercise.primaryMuscles[0])}">${t('استكشف العضلة تشريحيًا', 'Explore muscle anatomy')}</a>` : ''}
          <a class="btn btn-outline" href="${root}/pages/exercises.html">${t('العودة إلى مكتبة التمارين', 'Back to Exercise Library')}</a>
        </div>
      </div></section>`;
  };

  function populateFilters(select, values, label) {
    const unique = [...new Set(values)].sort((a, b) => a.localeCompare(b));
    select.insertAdjacentHTML('beforeend', unique.map(value => `<option value="${value}">${value}</option>`).join(''));
  }

  function init() {
    if (document.body.dataset.page !== 'exercises') return;
    const library = document.getElementById('exercise-library');
    const detail = document.getElementById('exercise-detail');
    const grid = document.getElementById('exercise-grid');
    const search = document.getElementById('ex-search');
    const muscle = document.getElementById('ex-muscle');
    const equipment = document.getElementById('ex-equipment');
    const empty = document.getElementById('ex-empty');
    if (!library || !detail || !grid || !search || !muscle || !equipment || !empty) return;

    populateFilters(muscle, exercises.map(item => item.muscle));
    populateFilters(equipment, exercises.map(item => item.equipment));

    const params = new URLSearchParams(location.search);
    const selected = params.get('exercise');
    if (selected) {
      const exercise = exercises.find(item => item.id === selected);
      if (exercise) {
        library.hidden = true;
        detail.hidden = false;
        detail.innerHTML = detailFor(exercise);
        document.title = `${exName(exercise)} | VALHAN MUSCLES`;
        window.ValhanSavedHub?.updateUI();
        return;
      }
    }

    const draw = () => {
      const query = search.value.trim().toLowerCase();
      const filtered = exercises.filter(item =>
        (exName(item).toLowerCase().includes(query) || item.legacyName.toLowerCase().includes(query) || item.muscle.toLowerCase().includes(query)) &&
        (muscle.value === 'all' || item.muscle === muscle.value) &&
        (equipment.value === 'all' || item.equipment === equipment.value)
      );
      grid.innerHTML = filtered.map(cardFor).join('');
      empty.hidden = filtered.length > 0;
      window.ValhanReveal?.();
      window.ValhanSavedHub?.updateUI();
    };

    [search, muscle, equipment].forEach(control => control.addEventListener('input', draw));
    draw();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
