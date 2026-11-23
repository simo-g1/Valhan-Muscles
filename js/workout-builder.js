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
  const exerciseName = exercise => window.ValhanExerciseName?.(exercise) || exercise?.legacyName || exercise?.name?.en || '';
  const key = 'valhan-builder-v3';
  const get = () => window.ValhanStore.get(key, null);
  const set = p => window.ValhanStore.set(key, p);

  let plan = null;
  let pickTarget = null;
  const collapsedDays = new Set();

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
    const find = n => exs().find(e => (e.legacyName || '').toLowerCase().includes(n.toLowerCase()) || exerciseName(e).toLowerCase().includes(n.toLowerCase()));
    const add = (day, n, sets, reps = '8-12', notes = '') => {
      const e = find(n);
      day.exercises.push({
        id: e?.id || '',
        name: e ? exerciseName(e) : n,
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

  const T = (a, b) => (window.ValhanT ? window.ValhanT(a, b) : a);
  const IMPORT_KEY = 'valhan-builder-import';   // handoff from Workout Plans page
  const BACKUP_KEY = 'valhan-builder-backup';   // previous plan kept before an import/replace
  const store = window.ValhanStore;

  function toast(s) {
    const el = $('#toast');
    if (!el) return;
    el.textContent = s;
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 2300);
  }
  window.ValhanToast = toast;

  const emptyPlan = () => ({ name: 'My VALHAN Program', split: 'custom', days: [makeDay('Day 1')] });
  const hasContent = p => !!(p && Array.isArray(p.days) && p.days.some(d => d.exercises && d.exercises.length));

  // ---- Ready-made plan (from app.js `plans`) -> builder format ----------
  const ISOLATION = /(raise|fly|extension|curl|calves|adductor|triceps|biceps|traps|delts|lower back|shrug)/i;
  function fromReady(p) {
    return {
      name: 'VALHAN ' + p.name,
      split: 'custom',
      source: p.name,
      days: (p.normalizedSchedule || []).map(d => ({
        name: d.day,
        notes: '',
        rest: !d.entries.length,
        exercises: d.entries.map(entry => {
          const exercise = entry.type === 'exercise' ? exs().find(item => item.id === entry.exerciseId) : null;
          return {
            id: entry.exerciseId || '',
            type: entry.type,
            muscleId: entry.muscleId || null,
            name: exercise ? exerciseName(exercise) : T(entry.label.ar, entry.label.en),
            sets: entry.sets || 0,
            reps: entry.reps || (ISOLATION.test(entry.label.en) ? '12-15' : '8-12'),
            warm: 0,
            warmReps: '10',
            notes: entry.type === 'muscle-focus' ? `${entry.label.ar} — ${entry.label.en}` : ''
          };
        })
      }))
    };
  }
  window.ValhanPlanToBuilder = fromReady;

  // ---- PDF (print-to-PDF window generated on demand) --------------------
  function printPlan(p) {
    const ar = (window.ValhanLang ? window.ValhanLang() : 'ar') === 'ar';
    const w = open('', '_blank');
    if (!w) return toast(T('اسمح بالنوافذ المنبثقة لتصدير PDF.', 'Allow pop-ups to export PDF.'));
    const total = p.days.reduce((a, d) => a + d.exercises.reduce((s, x) => s + (+x.sets || 0), 0), 0);
    const trainDays = p.days.filter(d => !d.rest).length;
    const label = p.split === 'custom' ? (p.source || T('خطة مخصصة', 'Custom plan')) : p.split;
    const dayHtml = p.days.map((d, i) => d.rest ? `
      <section class="day"><div class="dh"><span>${ar ? 'اليوم' : 'Day'} ${i + 1}: ${esc(d.name)}</span><span class="sub">${ar ? 'راحة' : 'Rest'}</span></div>
      <div class="rest">${ar ? 'يوم راحة للاستشفاء.' : 'Rest day for recovery.'}${d.notes ? ' ' + esc(d.notes) : ''}</div></section>` : `
      <section class="day"><div class="dh"><span>${ar ? 'اليوم' : 'Day'} ${i + 1}: ${esc(d.name)}</span><span class="sub">${d.exercises.length} ${ar ? 'تمارين' : 'exercises'}</span></div>
      ${d.notes ? `<div class="dn">${esc(d.notes)}</div>` : ''}
      <table><thead><tr><th>${ar ? 'التمرين' : 'Exercise'}</th><th class="c">${ar ? 'التكرارات' : 'Reps'}</th><th class="e">${ar ? 'المجاميع' : 'Sets'}</th></tr></thead><tbody>
      ${d.exercises.map(x => `<tr><td><b>${esc(x.name)}</b>${x.notes ? `<div class="cue">${esc(x.notes)}</div>` : ''}</td>
        <td class="c">${esc(x.reps || '8-12')}</td>
        <td class="e"><b>${x.sets}</b>${+x.warm > 0 ? `<span class="wu">+${x.warm} ${ar ? 'إحماء' : 'warm-up'}</span>` : ''}</td></tr>`).join('')}
      </tbody></table></section>`).join('');

    w.document.write(`<!doctype html><html lang="${ar ? 'ar' : 'en'}" dir="${ar ? 'rtl' : 'ltr'}"><head><meta charset="utf-8">
<title>${esc(p.name)} — VALHAN MUSCLES</title><style>
*{box-sizing:border-box}body{font-family:"Cairo",-apple-system,"Segoe UI",Roboto,Arial,sans-serif;color:#0f172a;margin:0;padding:28px 32px;line-height:1.6}
.top{border-bottom:3px solid #1a56db;padding-bottom:14px;margin-bottom:20px;display:flex;justify-content:space-between;align-items:flex-end;gap:12px;flex-wrap:wrap}
h1{margin:0;font-size:24px}h1 span{color:#e10600}.sm{font-size:12px;color:#64748b;margin:4px 0 0}
.meta{font-size:12px;color:#475569}.meta b{display:block;font-size:15px;color:#1e293b}
.day{margin-bottom:22px;page-break-inside:avoid}.dh{border-inline-start:4px solid #1a56db;padding-inline-start:12px;margin-bottom:8px;font-size:17px;font-weight:700;display:flex;justify-content:space-between}
.sub{font-size:12px;font-weight:400;color:#64748b}.dn{font-size:12px;color:#64748b;font-style:italic;margin:0 16px 8px}
table{width:100%;border-collapse:collapse;font-size:13px;border:1px solid #cbd5e1}
th{background:#1e293b;color:#fff;padding:9px 12px;text-align:start;font-size:12px}td{padding:8px 12px;border-bottom:1px solid #e2e8f0}
tr:nth-child(even) td{background:#f8fafc}.c{text-align:center}.e{text-align:end;white-space:nowrap}th.e{text-align:end}
.cue{font-size:11px;color:#64748b}.wu{font-size:10px;background:#e2e8f0;border-radius:4px;padding:1px 6px;margin-inline-start:6px;color:#475569}
.rest{border:1px dashed #94a3b8;border-radius:8px;padding:14px 16px;color:#475569;font-size:13px}
.ft{border-top:1px solid #e2e8f0;margin-top:26px;padding-top:10px;font-size:11px;color:#94a3b8;display:flex;justify-content:space-between}
@page{size:A4;margin:14mm 16mm}@media print{body{padding:0}}
</style></head><body>
<div class="top"><div><h1>VALHAN <span>MUSCLES</span></h1><p class="sm">${ar ? 'خطة تدريبية' : 'Workout plan'}</p></div>
<div class="meta"><b>${esc(p.name)}</b>${esc(label)} · ${trainDays} ${ar ? 'أيام تدريب' : 'training days'} · ${p.days.length - trainDays} ${ar ? 'راحة' : 'rest'} · ${total} ${ar ? 'مجموعة عمل' : 'working sets'}</div></div>
${dayHtml}
<div class="ft"><span>VALHAN MUSCLES — Build Your Strength. Master Your Fitness.</span><span>${ar ? 'محتوى تعليمي عام' : 'General educational content'}</span></div>
<script>onload=()=>setTimeout(()=>print(),350)<\/script></body></html>`);
    w.document.close();
  }
  window.ValhanPDF = printPlan;

  // ---- Rendering ---------------------------------------------------------
  function render() {
    const host = $('#builder-days');
    if (!host) return;
    host.innerHTML = plan.days.map((d, di) => `
      <article class="day-card reveal is-visible${d.rest ? ' is-rest' : ''}${collapsedDays.has(di) ? ' is-collapsed' : ''}" data-day="${di}">
        <div class="day-head">
          <div class="day-title-wrap"><span class="day-index">${T('اليوم', 'DAY')} ${di + 1}</span><h3>${esc(d.name)}${d.rest ? ' · ' + T('راحة', 'Rest') : ''}</h3><small class="day-summary">${d.rest ? T('يوم استشفاء', 'Recovery day') : `${d.exercises.length} ${T('تمارين', 'exercises')}`}</small></div>
          <div class="day-head-actions">
            <button type="button" class="day-collapse-btn" data-action="toggle-day" aria-expanded="${!collapsedDays.has(di)}" aria-label="${collapsedDays.has(di) ? T('توسيع اليوم','Expand day') : T('تصغير اليوم','Collapse day')}">${collapsedDays.has(di) ? '⌄' : '⌃'}</button>
          <div class="reorder">
            <button type="button" data-action="up-day" ${di === 0 ? 'disabled' : ''} aria-label="${T('تحريك اليوم لأعلى', 'Move day up')}">↑</button>
            <button type="button" data-action="down-day" ${di === plan.days.length - 1 ? 'disabled' : ''} aria-label="${T('تحريك اليوم لأسفل', 'Move day down')}">↓</button>
            <button type="button" class="remove-btn" data-action="remove-day" ${plan.days.length === 1 ? 'disabled' : ''} aria-label="${T('حذف اليوم', 'Delete day')}">×</button>
          </div>
          </div>
        </div>
        <div class="day-content">
        <label class="field day-note">${T('اسم اليوم', 'Day name')}<input class="day-name" value="${esc(d.name)}"></label>
        <label class="field day-note">${T('ملاحظات اليوم', 'Day notes')}<textarea class="day-notes" rows="2">${esc(d.notes)}</textarea></label>
        ${d.rest
        ? `<p class="rest-note">${T('يوم راحة: لا توجد تمارين. يمكنك حذفه أو تحريكه.', 'Rest day: no exercises. You can move or delete it.')}</p>`
        : `${d.exercises.map((x, ei) => exercise(x, di, ei)).join('')}
             <button type="button" class="btn btn-outline" data-action="add-ex" style="margin-top:12px">＋ ${T('إضافة تمرين', 'Add exercise')}</button>`}
        </div>
      </article>`).join('');
    $('#builder-name').value = plan.name;
    set(plan);
  }

  function exercise(x, di, ei) {
    const img = x.id ? window.ValhanExerciseImage(x.id) : '';
    const n = plan.days[di].exercises.length;
    return `
      <div class="exercise-row" data-ex="${ei}">
        <div class="exercise-head">
          <div class="picked">${img ? `<img src="${img}" alt="">` : ''}<span>${esc(x.name || T('اختر تمرينًا', 'Choose exercise'))}${x.type === 'muscle-focus' ? `<small class="focus-type">${T('تركيز عضلي — ليس تمرينًا محددًا', 'Muscle focus — not a specific exercise')}</small>` : ''}</span></div>
          <div class="reorder">
            <button type="button" data-action="pick" aria-label="${T('تغيير التمرين', 'Change exercise')}"><i class="fa-solid fa-dumbbell" aria-hidden="true"></i><span>${T('لو عايز تغير التمرين', 'Change exercise')}</span></button>
            <button type="button" data-action="up-ex" ${ei === 0 ? 'disabled' : ''} aria-label="${T('تحريك لأعلى', 'Move up')}">↑</button>
            <button type="button" data-action="down-ex" ${ei === n - 1 ? 'disabled' : ''} aria-label="${T('تحريك لأسفل', 'Move down')}">↓</button>
            <button type="button" class="remove-btn" data-action="remove-ex" aria-label="${T('حذف التمرين', 'Remove exercise')}">×</button>
          </div>
        </div>
        <div class="exercise-fields">
          <label>${T('اسم التمرين', 'Exercise')}<input class="ex-name" value="${esc(x.name)}"></label>
          <label>${T('مجموعات العمل', 'Working sets')}<input class="sets" type="number" min="0" max="30" value="${x.sets}"></label>
          <label>${T('التكرارات', 'Reps')}<input class="reps" value="${esc(x.reps)}"></label>
          <label>${T('مجموعات الإحماء', 'Warm-up sets')}<input class="warm" type="number" min="0" max="10" value="${x.warm}"></label>
          <label>${T('تكرارات الإحماء', 'Warm-up reps')}<input class="warm-reps" value="${esc(x.warmReps)}"></label>
        </div>
        <label class="field" style="margin-top:6px">${T('ملاحظات الأداء', 'Exercise notes')}<input class="notes" value="${esc(x.notes)}"></label>
      </div>`;
  }

  function sync() {
    document.querySelectorAll('.day-card').forEach(card => {
      const d = plan.days[+card.dataset.day];
      if (!d) return;
      d.name = card.querySelector('.day-name').value;
      d.notes = card.querySelector('.day-notes').value;
      card.querySelectorAll('.exercise-row').forEach(row => {
        const x = d.exercises[+row.dataset.ex];
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
    $('#picker-search').focus();
  }
  const closePicker = () => $('#picker-modal')?.classList.remove('open');

  function pickerRender() {
    const q = $('#picker-search').value.toLowerCase();
    $('#picker-grid').innerHTML = exs()
      .filter(e => exerciseName(e).toLowerCase().includes(q) || (e.legacyName || '').toLowerCase().includes(q) || e.muscle.toLowerCase().includes(q))
      .map(e => `<button type="button" class="picker-item" data-pick="${e.id}"><img src="${window.ValhanExerciseImage(e.id)}" alt="${esc(exerciseName(e))}"><span>${esc(exerciseName(e))}</span><small>${esc(e.muscle)}</small></button>`).join('');
  }

  const confirmReplace = () => !hasContent(plan) ||
    confirm(T('سيتم استبدال التمارين الحالية في المنشئ. هل تريد المتابعة؟', 'This will replace the exercises currently in the builder. Continue?'));

  // ---- Ready-made plans dropdown (accessible disclosure menu) ----------
  function setupMenu() {
    const btn = $('#tpl-btn'), panel = $('#tpl-menu');
    if (!btn || !panel) return;
    const arabicFor = k => {
      const p = (window.ValhanPlans || []).find(x => x.name === k || (k.startsWith('PPL +') && x.id === 'ulppl'));
      return p ? p.arabicName : '';
    };
    panel.innerHTML = Object.keys(defaults).map(k => `
      <li role="none"><button type="button" role="menuitem" class="menu-item" tabindex="-1" data-tpl="${esc(k)}">${esc(k)}${arabicFor(k) ? `<small>${esc(arabicFor(k))}</small>` : ''}</button></li>`).join('');
    const items = () => [...panel.querySelectorAll('[role="menuitem"]')];
    const isOpen = () => !panel.hidden;

    const close = (focusBtn) => {
      if (!isOpen()) return;
      panel.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
      if (focusBtn) btn.focus();
    };
    const open_ = () => {
      panel.hidden = false;
      btn.setAttribute('aria-expanded', 'true');
      panel.style.translate = '';
      const r = panel.getBoundingClientRect();           // keep inside the viewport
      const dx = r.left < 8 ? 8 - r.left : (r.right > innerWidth - 8 ? innerWidth - 8 - r.right : 0);
      if (dx) panel.style.translate = dx + 'px 0';
      items()[0]?.focus();
    };

    btn.addEventListener('click', () => (isOpen() ? close(true) : open_()));
    btn.addEventListener('keydown', e => {
      if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && !isOpen()) { e.preventDefault(); open_(); }
    });
    panel.addEventListener('keydown', e => {
      const list = items(), i = list.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); list[(i + 1) % list.length].focus(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); list[(i - 1 + list.length) % list.length].focus(); }
      else if (e.key === 'Home') { e.preventDefault(); list[0].focus(); }
      else if (e.key === 'End') { e.preventDefault(); list[list.length - 1].focus(); }
      else if (e.key === 'Tab') close(false);
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && isOpen()) close(true); });
    document.addEventListener('pointerdown', e => { if (isOpen() && !e.target.closest('.menu-wrap')) close(false); });
    panel.addEventListener('click', e => {
      const b = e.target.closest('[data-tpl]');
      if (!b) return;
      close(true);
      sync();
      if (!confirmReplace()) return;
      plan = template(b.dataset.tpl);
      render();
      toast(T('تم تحميل النموذج. يمكنك تعديله بحرية.', 'Template loaded. Edit it freely.'));
    });
  }

  // ---- Import from "Workout Plans" page ----------------------------------
  function applyImport() {
    const imp = store.get(IMPORT_KEY, null);
    if (!imp) return;
    store.remove(IMPORT_KEY);
    if (!imp.days || !imp.days.length) return;
    if (hasContent(plan)) {
      const ok = confirm(T('لديك خطة محفوظة بها تمارين. هل تريد استبدالها بالخطة المختارة؟ (ستُحفظ نسخة احتياطية من خطتك الحالية).', 'You have a saved plan with exercises. Replace it with the selected plan? (Your current plan will be backed up.)'));
      if (!ok) return toast(T('تم الإبقاء على خطتك الحالية.', 'Kept your current plan.'));
      store.set(BACKUP_KEY, plan);
    }
    plan = imp;
    toast(T('تم تحميل الخطة المختارة في المنشئ.', 'Selected plan loaded into the builder.'));
  }


  function init() {
    if (document.body.dataset.page !== 'builder') return;
    plan = get();
    if (!plan || !Array.isArray(plan.days) || !plan.days.length) plan = emptyPlan();   // blank custom plan by default
    applyImport();
    setupMenu();

    const restoreBtn = $('#restore-backup');
    const syncRestore = () => { if (restoreBtn) restoreBtn.hidden = !store.get(BACKUP_KEY, null); };
    syncRestore();
    if (restoreBtn) restoreBtn.onclick = () => {
      const b = store.get(BACKUP_KEY, null);
      if (!b || !confirm(T('استعادة خطتك السابقة؟ سيتم استبدال الخطة الحالية.', 'Restore your previous plan? This replaces the current one.'))) return;
      plan = b; store.remove(BACKUP_KEY); render(); syncRestore();
    };

    $('#builder-name').oninput = sync;

    $('#new-empty').onclick = () => {
      sync();
      if (!confirmReplace()) return;
      plan = emptyPlan();
      render();
    };
    $('#add-day').onclick = () => { sync(); plan.days.push(makeDay(T('يوم ', 'Day ') + (plan.days.length + 1))); render(); };
    $('#add-rest').onclick = () => { sync(); plan.days.push({ name: T('راحة', 'Rest'), notes: '', rest: true, exercises: [] }); render(); };
    $('#clear-plan').onclick = () => {
      if (confirm(T('هل ترغب في مسح جميع التمارين؟', 'Clear all exercises?'))) {
        plan.days.forEach(d => { d.exercises = []; });
        render();
      }
    };
    $('#export-pdf').onclick = () => { sync(); printPlan(plan); };

    const daysHost = $('#builder-days');
    daysHost.addEventListener('input', sync);
    daysHost.addEventListener('click', e => {
      const b = e.target.closest('[data-action]');
      if (!b || b.disabled) return;
      sync();
      const di = +b.closest('.day-card').dataset.day, day = plan.days[di];
      const row = b.closest('.exercise-row'), ei = row ? +row.dataset.ex : -1, a = b.dataset.action;
      if (a === 'toggle-day') {
        if (collapsedDays.has(di)) collapsedDays.delete(di); else collapsedDays.add(di);
        render();
        return;
      }
      if (a === 'add-ex') day.exercises.push({ id: '', name: '', sets: 3, reps: '8-12', warm: 1, warmReps: '10', notes: '' });
      if (a === 'remove-day' && plan.days.length > 1) plan.days.splice(di, 1);
      if (a === 'up-day' || a === 'down-day') move(plan.days, di, di + (a === 'up-day' ? -1 : 1));
      if (a === 'remove-ex') day.exercises.splice(ei, 1);
      if (a === 'up-ex' || a === 'down-ex') move(day.exercises, ei, ei + (a === 'up-ex' ? -1 : 1));
      if (a === 'pick') return openPicker(di, ei);
      render();
    });

    $('#picker-search').oninput = pickerRender;
    $('#picker-grid').onclick = e => {
      const b = e.target.closest('[data-pick]');
      if (!b || !pickTarget) return;
      const ex = exs().find(x => x.id === b.dataset.pick), x = plan.days[pickTarget.di]?.exercises[pickTarget.ei];
      if (ex && x) { x.id = ex.id; x.name = exerciseName(ex); x.type = 'exercise'; x.muscleId = null; x.notes = ''; }
      closePicker();
      render();
    };
    document.querySelectorAll('[data-close-modal]').forEach(b => { b.onclick = closePicker; });
    $('#picker-modal').addEventListener('click', e => { if (e.target.id === 'picker-modal') closePicker(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closePicker(); });

    render();
  }

  document.addEventListener('DOMContentLoaded', init);
})();