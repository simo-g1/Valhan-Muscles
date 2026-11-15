(() => {
  'use strict';
  const root = document.body.dataset.root || '..';
  const $ = s => document.querySelector(s);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // Default splits matching the 7 reference PDF systems + PPL 5 Days
  const defaults = {
    'Upper / Lower — 4 Days': ['Upper A', 'Lower A', 'Upper B', 'Lower B'],
    'Upper / Lower — 5 Days': ['Upper 1 (Chest & Back Focus)', 'Lower 1', 'Upper 2 (Back, Delts & Arms)', 'Lower 2', 'Upper 3 (Complementary)'],
    'PPL + Upper / Lower — 5 Days': ['Push', 'Pull', 'Legs', 'Upper', 'Lower'],
    'Anterior / Posterior — 4 Days': ['Anterior A', 'Posterior A', 'Anterior B', 'Posterior B'],
    'Anterior / Posterior — 5 Days': ['Anterior 1', 'Posterior 1', 'Anterior 2', 'Posterior 2', 'Anterior 3'],
    'Arnold Split — 6 Days': ['Chest & Back 1', 'Shoulders & Arms 1', 'Legs 1', 'Chest & Back 2', 'Shoulders & Arms 2', 'Legs 2'],
    'Full Body — 4 Days': ['Full Body 1', 'Full Body 2', 'Full Body 3', 'Full Body 4'],
    'Push / Pull / Legs — 5 Days': ['Push A', 'Pull A', 'Legs', 'Push B', 'Pull B']
  };

  const exs = () => window.ValhanExercises || [];
  const key = 'valhan-builder-v3';
  const get = () => window.ValhanStore.get(key, null);
  const set = p => window.ValhanStore.set(key, p);

  let plan = null;
  let pickTarget = null;

  const makeDay = n => ({ name: n, notes: '', exercises: [] });

  function blank(split = 'Upper / Lower — 4 Days') {
    const list = defaults[split] || defaults['Upper / Lower — 4 Days'];
    return {
      name: 'VALHAN ' + split,
      split,
      days: list.map(makeDay)
    };
  }

  function template(split) {
    const p = blank(split);
    const find = n => exs().find(e => e.name.toLowerCase().includes(n.toLowerCase()));
    const add = (day, n, sets, reps = '8-12', notes = '') => {
      const e = find(n);
      day.exercises.push({
        id: e?.id || '',
        name: e?.name || n,
        sets,
        reps,
        warm: 1,
        warmReps: '10',
        notes
      });
    };

    if (split === 'Upper / Lower — 4 Days') {
      const [uA, lA, uB, lB] = p.days;
      const upperExs = [
        ['Incline Chest Press (Smith)', 2, '8-10', 'صدر عالي'],
        ['Machine Chest Fly', 3, '10-12', 'تفتيح صدر'],
        ['Lat Pulldown', 3, '8-12', 'سحب علوي واسع'],
        ['T-Bar Row', 3, '8-10', 'سحب أرضي تي بار'],
        ['Close Grip Lat Pulldown', 2, '10-12', 'سحب علوي ضيق'],
        ['Cable Lateral Raise', 3, '12-15', 'كتف جانبي'],
        ['Machine Shoulder Press', 2, '8-10', 'كتف أمامي'],
        ['Rear Delt Fly', 2, '12-15', 'كتف خلفي'],
        ['Dumbbell Shrugs', 2, '10-12', 'ترابيس'],
        ['Triceps Pushdown', 4, '10-12', 'ترايسبس'],
        ['Cable Biceps Curl', 3, '10-12', 'بايسبس']
      ];
      const lowerExs = [
        ['Leg Press', 2, '10-12', 'دفع رجل'],
        ['Leg Extension', 3, '12-15', 'أماميات رجل'],
        ['Romanian Deadlift', 2, '8-10', 'خلفيات رجل إطالة'],
        ['Seated Leg Curl', 2, '10-12', 'خلفيات رجل عزل'],
        ['Hip Adductor', 3, '12-15', 'ضامة'],
        ['Standing Calf Raise', 2, '12-15', 'سمانة'],
        ['Back Extension', 2, '12-15', 'أسفل الظهر']
      ];
      upperExs.forEach(x => add(uA, ...x));
      lowerExs.forEach(x => add(lA, ...x));
      upperExs.forEach(x => add(uB, ...x));
      lowerExs.forEach(x => add(lB, ...x));
    } else if (split === 'Upper / Lower — 5 Days') {
      const [u1, l1, u2, l2, u3] = p.days;
      [['Incline Chest Press (Smith)', 2], ['Machine Chest Fly', 3], ['Lat Pulldown', 3], ['T-Bar Row', 3], ['Cable Lateral Raise', 3], ['Triceps Pushdown', 4]].forEach(x => add(u1, ...x));
      [['Leg Press', 2], ['Leg Extension', 3], ['Romanian Deadlift', 2], ['Seated Leg Curl', 2], ['Hip Adductor', 3], ['Standing Calf Raise', 2], ['Back Extension', 2]].forEach(x => add(l1, ...x));
      [['Lat Pulldown', 3], ['Close Grip Lat Pulldown', 2], ['Machine Shoulder Press', 2], ['Rear Delt Fly', 2], ['Dumbbell Shrugs', 2], ['Cable Biceps Curl', 3], ['Triceps Pushdown', 4]].forEach(x => add(u2, ...x));
      [['Leg Press', 2], ['Leg Extension', 3], ['Romanian Deadlift', 2], ['Seated Leg Curl', 2], ['Hip Adductor', 3], ['Standing Calf Raise', 2], ['Back Extension', 2]].forEach(x => add(l2, ...x));
      [['Incline Chest Press (Smith)', 2], ['Machine Chest Fly', 3], ['T-Bar Row', 3], ['Close Grip Lat Pulldown', 2], ['Cable Lateral Raise', 3], ['Machine Shoulder Press', 2], ['Rear Delt Fly', 2], ['Dumbbell Shrugs', 2], ['Cable Biceps Curl', 3]].forEach(x => add(u3, ...x));
    } else if (split === 'PPL + Upper / Lower — 5 Days') {
      const [push, pull, legs, upper, lower] = p.days;
      [['Incline Chest Press (Smith)', 2], ['Machine Chest Fly', 3], ['Machine Shoulder Press', 2], ['Cable Lateral Raise', 3], ['Triceps Pushdown', 4]].forEach(x => add(push, ...x));
      [['Lat Pulldown', 3], ['T-Bar Row', 3], ['Close Grip Lat Pulldown', 2], ['Rear Delt Fly', 2], ['Dumbbell Shrugs', 2], ['Cable Biceps Curl', 3], ['Back Extension', 2]].forEach(x => add(pull, ...x));
      [['Leg Press', 2], ['Leg Extension', 3], ['Romanian Deadlift', 2], ['Seated Leg Curl', 2], ['Hip Adductor', 3], ['Standing Calf Raise', 2]].forEach(x => add(legs, ...x));
      [['Incline Chest Press (Smith)', 2], ['Machine Chest Fly', 3], ['Lat Pulldown', 3], ['T-Bar Row', 3], ['Close Grip Lat Pulldown', 2], ['Machine Shoulder Press', 2], ['Cable Lateral Raise', 3], ['Rear Delt Fly', 2], ['Dumbbell Shrugs', 2], ['Triceps Pushdown', 4], ['Cable Biceps Curl', 3]].forEach(x => add(upper, ...x));
      [['Leg Press', 2], ['Leg Extension', 3], ['Romanian Deadlift', 2], ['Seated Leg Curl', 2], ['Hip Adductor', 3], ['Standing Calf Raise', 2], ['Back Extension', 2]].forEach(x => add(lower, ...x));
    } else if (split === 'Anterior / Posterior — 4 Days') {
      const [antA, postA, antB, postB] = p.days;
      const antExs = [['Incline Chest Press (Smith)', 2], ['Machine Chest Fly', 3], ['Machine Shoulder Press', 2], ['Cable Lateral Raise', 3], ['Triceps Pushdown', 4], ['Leg Press', 2], ['Leg Extension', 3], ['Hip Adductor', 3], ['Standing Calf Raise', 2]];
      const postExs = [['Lat Pulldown', 3], ['T-Bar Row', 3], ['Close Grip Lat Pulldown', 2], ['Rear Delt Fly', 2], ['Dumbbell Shrugs', 2], ['Cable Biceps Curl', 3], ['Romanian Deadlift', 2], ['Seated Leg Curl', 2], ['Back Extension', 2]];
      antExs.forEach(x => add(antA, ...x));
      postExs.forEach(x => add(postA, ...x));
      antExs.forEach(x => add(antB, ...x));
      postExs.forEach(x => add(postB, ...x));
    } else if (split === 'Arnold Split — 6 Days') {
      const [cb1, sa1, l1, cb2, sa2, l2] = p.days;
      const cb = [['Incline Chest Press (Smith)', 2], ['Machine Chest Fly', 3], ['Lat Pulldown', 3], ['T-Bar Row', 3], ['Close Grip Lat Pulldown', 2], ['Back Extension', 2]];
      const sa = [['Machine Shoulder Press', 2], ['Cable Lateral Raise', 3], ['Rear Delt Fly', 2], ['Dumbbell Shrugs', 2], ['Triceps Pushdown', 4], ['Cable Biceps Curl', 3]];
      const legs = [['Leg Press', 2], ['Leg Extension', 3], ['Romanian Deadlift', 2], ['Seated Leg Curl', 2], ['Hip Adductor', 3], ['Standing Calf Raise', 2]];
      cb.forEach(x => add(cb1, ...x));
      sa.forEach(x => add(sa1, ...x));
      legs.forEach(x => add(l1, ...x));
      cb.forEach(x => add(cb2, ...x));
      sa.forEach(x => add(sa2, ...x));
      legs.forEach(x => add(l2, ...x));
    } else if (split === 'Full Body — 4 Days') {
      const [fb1, fb2, fb3, fb4] = p.days;
      [['Incline Chest Press (Smith)', 2], ['Lat Pulldown', 3], ['Cable Lateral Raise', 3], ['Triceps Pushdown', 2], ['Cable Biceps Curl', 2], ['Leg Press', 2], ['Seated Leg Curl', 2], ['Standing Calf Raise', 2]].forEach(x => add(fb1, ...x));
      [['Machine Chest Fly', 3], ['T-Bar Row', 3], ['Machine Shoulder Press', 2], ['Rear Delt Fly', 2], ['Triceps Pushdown', 2], ['Cable Biceps Curl', 1], ['Leg Extension', 3], ['Romanian Deadlift', 2], ['Hip Adductor', 3]].forEach(x => add(fb2, ...x));
      [['Incline Chest Press (Smith)', 2], ['Lat Pulldown', 3], ['Close Grip Lat Pulldown', 2], ['Cable Lateral Raise', 3], ['Dumbbell Shrugs', 2], ['Triceps Pushdown', 2], ['Cable Biceps Curl', 2], ['Leg Press', 2], ['Seated Leg Curl', 2], ['Back Extension', 2]].forEach(x => add(fb3, ...x));
      [['Machine Chest Fly', 3], ['T-Bar Row', 3], ['Close Grip Lat Pulldown', 2], ['Machine Shoulder Press', 2], ['Rear Delt Fly', 2], ['Dumbbell Shrugs', 2], ['Triceps Pushdown', 2], ['Cable Biceps Curl', 1], ['Leg Extension', 3], ['Romanian Deadlift', 2], ['Hip Adductor', 3], ['Standing Calf Raise', 2], ['Back Extension', 2]].forEach(x => add(fb4, ...x));
    } else {
      // Push / Pull / Legs — 5 Days
      const [a, b, c, d, e] = p.days;
      [['Incline Chest Press (Smith)', 2], ['Machine Chest Fly', 3], ['Cable Lateral Raise', 3], ['Machine Shoulder Press', 2], ['Triceps Pushdown', 4]].forEach(x => add(a, ...x));
      [['Lat Pulldown', 3], ['T-Bar Row', 3], ['Close Grip Lat Pulldown', 2], ['Rear Delt Fly', 2], ['Dumbbell Shrugs', 2], ['Cable Biceps Curl', 3], ['Back Extension', 2]].forEach(x => add(b, ...x));
      [['Leg Press', 2], ['Seated Leg Curl', 2], ['Romanian Deadlift', 2], ['Leg Extension', 3], ['Hip Adductor', 3], ['Standing Calf Raise', 2]].forEach(x => add(c, ...x));
      [['Incline Chest Press (Smith)', 2], ['Machine Chest Fly', 3], ['Cable Lateral Raise', 3], ['Machine Shoulder Press', 2], ['Triceps Pushdown', 4]].forEach(x => add(d, ...x));
      [['Lat Pulldown', 3], ['T-Bar Row', 3], ['Close Grip Lat Pulldown', 2], ['Rear Delt Fly', 2], ['Dumbbell Shrugs', 2], ['Cable Biceps Curl', 3], ['Back Extension', 2]].forEach(x => add(e, ...x));
    }
    return p;
  }

  function toast(s) {
    const t = $('#toast');
    if (!t) return;
    t.textContent = s;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2300);
  }

  function render() {
    const host = $('#builder-days');
    if (!host) return;
    host.innerHTML = plan.days.map((d, di) => `
      <article class="day-card reveal" data-day="${di}">
        <div class="day-head">
          <h3>${esc(d.name)}</h3>
          <div class="reorder">
            <button data-action="up-day" ${di === 0 ? 'disabled' : ''} title="Move Day Up">↑</button>
            <button data-action="down-day" ${di === plan.days.length - 1 ? 'disabled' : ''} title="Move Day Down">↓</button>
            <button class="remove-btn" data-action="remove-day" title="Delete Day">×</button>
          </div>
        </div>
        <label class="field day-note">
          ${window.ValhanT('اسم اليوم التدريبي', 'Day Name')}
          <input class="day-name" value="${esc(d.name)}">
        </label>
        <label class="field day-note">
          ${window.ValhanT('ملاحظات اليوم (التركيز أو الإرشادات)', 'Day Notes (Focus / Instructions)')}
          <textarea class="day-notes" rows="2">${esc(d.notes)}</textarea>
        </label>
        ${d.exercises.map((x, ei) => exercise(x, di, ei)).join('')}
        <button class="btn btn-outline" data-action="add-ex" style="margin-top:12px;">
          ＋ ${window.ValhanT('إضافة تمرين', 'Add exercise')}
        </button>
      </article>
    `).join('');

    $('#builder-name').value = plan.name;
    set(plan);
    window.ValhanReveal?.();
  }

  function exercise(x, di, ei) {
    const img = x.id ? window.ValhanExerciseImage(x.id) : '';
    return `
      <div class="exercise-row" data-ex="${ei}">
        <div class="exercise-head">
          <div class="picked">
            ${img ? `<img src="${img}" alt="">` : ''}
            <span>${esc(x.name || window.ValhanT('اختر تمريناً', 'Choose exercise'))}</span>
          </div>
          <div class="reorder">
            <button data-action="pick" title="Pick from library">▧</button>
            <button data-action="up-ex" ${ei === 0 ? 'disabled' : ''} title="Move Up">↑</button>
            <button data-action="down-ex" ${ei === plan.days[di].exercises.length - 1 ? 'disabled' : ''} title="Move Down">↓</button>
            <button class="remove-btn" data-action="remove-ex" title="Remove Exercise">×</button>
          </div>
        </div>
        <div class="exercise-fields">
          <label>
            ${window.ValhanT('اسم التمرين', 'Exercise')}
            <input class="ex-name" value="${esc(x.name)}">
          </label>
          <label>
            ${window.ValhanT('مجموعات العمل', 'Working sets')}
            <input class="sets" type="number" min="0" max="30" value="${x.sets}">
          </label>
          <label>
            ${window.ValhanT('التكرارات', 'Reps')}
            <input class="reps" value="${esc(x.reps)}">
          </label>
          <label>
            ${window.ValhanT('مجموعات الإحماء', 'Warm-up sets')}
            <input class="warm" type="number" min="0" max="10" value="${x.warm}">
          </label>
          <label>
            ${window.ValhanT('تكرارات الإحماء', 'Warm-up reps')}
            <input class="warm-reps" value="${esc(x.warmReps)}">
          </label>
        </div>
        <label class="field" style="margin-top:6px;">
          ${window.ValhanT('ملاحظات الأداء أو الحمل', 'Exercise Notes / Form Cues')}
          <input class="notes" value="${esc(x.notes)}">
        </label>
      </div>`;
  }

  function sync() {
    document.querySelectorAll('.day-card').forEach(card => {
      const di = +card.dataset.day;
      const d = plan.days[di];
      if (!d) return;
      d.name = card.querySelector('.day-name').value;
      d.notes = card.querySelector('.day-notes').value;
      card.querySelectorAll('.exercise-row').forEach(row => {
        const ei = +row.dataset.ex;
        const x = d.exercises[ei];
        if (!x) return;
        x.name = row.querySelector('.ex-name').value;
        x.sets = +row.querySelector('.sets').value || 0;
        x.reps = row.querySelector('.reps').value;
        x.warm = +row.querySelector('.warm').value || 0;
        x.warmReps = row.querySelector('.warm-reps').value;
        x.notes = row.querySelector('.notes').value;
      });
    });
    plan.name = $('#builder-name').value;
    set(plan);
  }

  function move(arr, from, to) {
    if (to < 0 || to >= arr.length) return;
    const [item] = arr.splice(from, 1);
    arr.splice(to, 0, item);
  }

  function openPicker(di, ei) {
    pickTarget = { di, ei };
    $('#picker-modal').classList.add('open');
    $('#picker-search').value = '';
    pickerRender();
  }

  function pickerRender() {
    const q = $('#picker-search').value.toLowerCase();
    $('#picker-grid').innerHTML = exs()
      .filter(e => e.name.toLowerCase().includes(q) || e.muscle.toLowerCase().includes(q))
      .map(e => `
        <button class="picker-item" data-pick="${e.id}">
          <img src="${window.ValhanExerciseImage(e.id)}" alt="${e.name}">
          <span>${e.name}</span>
          <small>${e.muscle}</small>
        </button>
      `).join('');
  }

  // Export PDF with design matching reference-workout.pdf
  function exportPDF() {
    sync();
    const w = open('', '_blank');
    if (!w) return toast(window.ValhanT('اسمح بالنوافذ المنبثقة لتصدير PDF.', 'Allow pop-ups to export PDF.'));

    const isAr = (window.ValhanLang ? window.ValhanLang() : 'ar') === 'ar';
    const totalWorkingSets = plan.days.reduce((acc, d) => acc + d.exercises.reduce((sa, x) => sa + (+x.sets || 0), 0), 0);

    w.document.write(`<!doctype html>
<html lang="${isAr ? 'ar' : 'en'}" dir="${isAr ? 'rtl' : 'ltr'}">
<head>
  <meta charset="utf-8">
  <title>${esc(plan.name)} — VALHAN MUSCLES</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Cairo", Arial, sans-serif;
      color: #0f172a;
      background: #ffffff;
      padding: 32px 36px;
      line-height: 1.6;
      margin: 0;
    }
    .header-bar {
      border-bottom: 3px solid #1a56db;
      padding-bottom: 18px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .brand-title {
      font-size: 24px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: .5px;
      margin: 0;
    }
    .brand-title span { color: #e10600; }
    .brand-subtitle {
      font-size: 13px;
      color: #64748b;
      margin: 4px 0 0;
    }
    .plan-meta-badge {
      text-align: ${isAr ? 'left' : 'right'};
      font-size: 12px;
      color: #475569;
    }
    .plan-meta-badge strong {
      font-size: 15px;
      color: #1e293b;
      display: block;
    }
    .intro-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px 18px;
      margin-bottom: 26px;
      font-size: 12px;
      color: #334155;
    }
    .day-section {
      margin-bottom: 28px;
      page-break-inside: avoid;
    }
    .day-heading {
      border-inline-start: 4px solid #1a56db;
      padding-inline-start: 12px;
      margin: 0 0 10px;
      font-size: 18px;
      font-weight: 700;
      color: #1e293b;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .day-notes {
      font-size: 12px;
      color: #64748b;
      margin: -4px 0 10px 16px;
      font-style: italic;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      overflow: hidden;
      margin-bottom: 8px;
    }
    thead th {
      background: #1e293b;
      color: #ffffff;
      padding: 10px 14px;
      text-align: ${isAr ? 'right' : 'left'};
      font-weight: 700;
      font-size: 12px;
      letter-spacing: .3px;
    }
    thead th:last-child {
      text-align: ${isAr ? 'left' : 'right'};
    }
    tbody td {
      padding: 9px 14px;
      border-bottom: 1px solid #e2e8f0;
      color: #1e293b;
    }
    tbody tr:nth-child(even) {
      background: #f8fafc;
    }
    tbody tr:last-child td {
      border-bottom: none;
    }
    .ex-title {
      font-weight: 700;
    }
    .ex-cues {
      font-size: 11px;
      color: #64748b;
      margin-top: 2px;
    }
    .sets-col {
      text-align: ${isAr ? 'left' : 'right'};
      white-space: nowrap;
      font-weight: 700;
      color: #0f172a;
    }
    .warmup-badge {
      font-size: 10px;
      background: #e2e8f0;
      padding: 2px 6px;
      border-radius: 4px;
      color: #475569;
      font-weight: normal;
      display: inline-block;
      margin-inline-start: 6px;
    }
    .footer-doc {
      border-top: 1px solid #e2e8f0;
      padding-top: 12px;
      margin-top: 30px;
      display: flex;
      justify-content: space-between;
      color: #94a3b8;
      font-size: 11px;
    }
    @page {
      size: A4;
      margin: 14mm 16mm;
    }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header-bar">
    <div>
      <h1 class="brand-title">VALHAN <span>MUSCLES</span></h1>
      <p class="brand-subtitle">${isAr ? 'دليل الجداول التدريبية الشامل — توزيع الحجم التدريبي المعتمد' : 'Comprehensive Workout Guide — Unified Volume System'}</p>
    </div>
    <div class="plan-meta-badge">
      <strong>${esc(plan.name)}</strong>
      <span>${esc(plan.split)} · ${plan.days.length} ${isAr ? 'أيام تدريب' : 'Days'} · ${totalWorkingSets} ${isAr ? 'مجموعات عمل' : 'Working Sets'}</span>
    </div>
  </div>

  <div class="intro-box">
    ${isAr 
      ? 'تم تصميم هذا الدليل بناءً على الحجم التدريبي الأسبوعي المعتمد في VALHAN MUSCLES لضمان استمرار الحمل التدريبي والتوازن العضلي بين الأنظمة. مجموعات الإحماء منفصلة ولا تُحسب ضمن مجموعات العمل الفعلية.'
      : 'Designed strictly according to the certified VALHAN MUSCLES weekly volume standards to preserve muscular balance and recovery. Warm-up sets are separate and excluded from working volume.'}
  </div>

  ${plan.days.map((d, i) => `
    <section class="day-section">
      <div class="day-heading">
        <span>${isAr ? `اليوم ${i + 1}: ${esc(d.name)}` : `Day ${i + 1}: ${esc(d.name)}`}</span>
        <span style="font-size:12px; font-weight:normal; color:#64748b;">${d.exercises.length} ${isAr ? 'تمارين' : 'exercises'}</span>
      </div>
      ${d.notes ? `<div class="day-notes">${esc(d.notes)}</div>` : ''}
      <table>
        <thead>
          <tr>
            <th>${isAr ? 'التمرين / الحركة' : 'Exercise / Movement'}</th>
            <th style="width: 140px; text-align: center;">${isAr ? 'التكرار المستهدف' : 'Target Reps'}</th>
            <th>${isAr ? 'المجاميع (عمل / إحماء)' : 'Sets (Work / Warm-up)'}</th>
          </tr>
        </thead>
        <tbody>
          ${d.exercises.map(x => `
            <tr>
              <td>
                <div class="ex-title">${esc(x.name)}</div>
                ${x.notes ? `<div class="ex-cues">${esc(x.notes)}</div>` : ''}
              </td>
              <td style="text-align: center; color: #475569;">${esc(x.reps || '8-12')}</td>
              <td class="sets-col">
                <span>${x.sets} ${isAr ? 'مجموعات' : 'sets'}</span>
                ${+x.warm > 0 ? `<span class="warmup-badge">+${x.warm} ${isAr ? 'إحماء' : 'warm'} (${esc(x.warmReps || '10')})</span>` : ''}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </section>
  `).join('')}

  <div class="footer-doc">
    <span>VALHAN MUSCLES — Build Your Strength. Master Your Fitness.</span>
    <span>${isAr ? 'دليل الجداول التدريبية الشامل' : 'Certified Training Protocol'}</span>
  </div>

  <script>
    window.onload = () => setTimeout(() => window.print(), 350);
  </script>
</body>
</html>`);
    w.document.close();
  }

  function init() {
    if (document.body.dataset.page !== 'builder') return;
    plan = get() || blank();

    const splitSelect = $('#builder-split');
    if (splitSelect) {
      splitSelect.innerHTML = Object.keys(defaults)
        .map(s => `<option value="${s}" ${plan.split === s ? 'selected' : ''}>${s}</option>`)
        .join('');

      splitSelect.onchange = e => {
        sync();
        plan = template(e.target.value);
        render();
      };
    }

    const nameInput = $('#builder-name');
    if (nameInput) nameInput.oninput = sync;

    const loadBtn = $('#load-template');
    if (loadBtn) {
      loadBtn.onclick = () => {
        plan = template($('#builder-split').value);
        render();
        toast(window.ValhanT('تم تحميل النموذج التدريبي المعتمد.', 'Official template loaded.'));
      };
    }

    const addDayBtn = $('#add-day');
    if (addDayBtn) {
      addDayBtn.onclick = () => {
        sync();
        plan.days.push(makeDay('Day ' + (plan.days.length + 1)));
        render();
      };
    }

    const clearBtn = $('#clear-plan');
    if (clearBtn) {
      clearBtn.onclick = () => {
        if (confirm(window.ValhanT('هل ترغب في مسح جميع التمارين؟', 'Clear all exercises?'))) {
          plan.days.forEach(d => d.exercises = []);
          render();
        }
      };
    }

    const exportBtn = $('#export-pdf');
    if (exportBtn) exportBtn.onclick = exportPDF;

    const daysHost = $('#builder-days');
    if (daysHost) {
      daysHost.addEventListener('input', sync);
      daysHost.addEventListener('click', e => {
        const b = e.target.closest('[data-action]');
        if (!b) return;
        sync();
        const card = b.closest('.day-card');
        const di = +card.dataset.day;
        const day = plan.days[di];
        const row = b.closest('.exercise-row');
        const ei = row ? +row.dataset.ex : -1;
        const a = b.dataset.action;

        if (a === 'add-ex') day.exercises.push({ id: '', name: '', sets: 3, reps: '8-12', warm: 1, warmReps: '10', notes: '' });
        if (a === 'remove-day' && plan.days.length > 1) plan.days.splice(di, 1);
        if (a === 'up-day' || a === 'down-day') move(plan.days, di, di + (a === 'up-day' ? -1 : 1));
        if (a === 'remove-ex') day.exercises.splice(ei, 1);
        if (a === 'up-ex' || a === 'down-ex') move(day.exercises, ei, ei + (a === 'up-ex' ? -1 : 1));
        if (a === 'pick') return openPicker(di, ei);
        render();
      });
    }

    const pickerSearch = $('#picker-search');
    if (pickerSearch) pickerSearch.oninput = pickerRender;

    const pickerGrid = $('#picker-grid');
    if (pickerGrid) {
      pickerGrid.onclick = e => {
        const b = e.target.closest('[data-pick]');
        if (!b || !pickTarget) return;
        const ex = exs().find(x => x.id === b.dataset.pick);
        if (ex && plan.days[pickTarget.di] && plan.days[pickTarget.di].exercises[pickTarget.ei]) {
          const x = plan.days[pickTarget.di].exercises[pickTarget.ei];
          x.id = ex.id;
          x.name = ex.name;
        }
        $('#picker-modal').classList.remove('open');
        render();
      };
    }

    document.querySelectorAll('[data-close-modal]').forEach(b => {
      b.onclick = () => $('#picker-modal').classList.remove('open');
    });

    render();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
