(() => {
  'use strict';

  const VERSION = 1;
  const KEYS = {
    activity: 'valhan-activity-v1', history: 'valhan-training-history-v1',
    notes: 'valhan-personal-notes-v1', calendar: 'valhan-training-calendar-v1',
    supersets: 'valhan-supersets-v1', comparisons: 'valhan-comparisons-v1'
  };
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const lang = () => window.ValhanLang?.() || document.documentElement.lang || 'ar';
  const ar = () => lang() === 'ar';
  const t = (a, e) => ar() ? a : e;
  const root = document.body.dataset.root || '..';
  const read = (key, fallback) => window.ValhanStore?.get(key, fallback) ?? fallback;
  const write = (key, value) => window.ValhanStore?.set(key, value) ?? false;
  const safe = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const exercises = () => window.ValhanExercises || [];
  const muscles = () => window.ValhanMuscles || [];
  const equipment = () => window.ValhanEquipment || [];
  const plans = () => window.ValhanPlans || window.ValhanWorkoutPlans || [];
  const name = ex => ar() ? (ex.name?.ar || ex.legacyName || ex.name) : (ex.name?.en || ex.legacyName || ex.name);
  const localDate = (date = new Date()) => {
    const d = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return d.toISOString().slice(0, 10);
  };
  const toast = message => {
    let el = $('#toast');
    if (!el) { el = document.createElement('div'); el.id = 'toast'; el.className = 'toast'; el.setAttribute('role','status'); el.setAttribute('aria-live','polite'); document.body.append(el); }
    el.textContent = message; el.classList.add('show'); clearTimeout(el._timer); el._timer = setTimeout(() => el.classList.remove('show'), 2600);
  };

  function activity(type, label, detail = '') {
    const items = read(KEYS.activity, []);
    items.unshift({ id: crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`, type, label, detail, at: Date.now() });
    write(KEYS.activity, items.slice(0, 80));
  }

  function injectNav() {
    const nav = $('#main-nav');
    if (!nav || nav.querySelector('[data-platform-nav]')) return;
    const link = document.createElement('a');
    link.href = `${root}/pages/dashboard.html`; link.dataset.platformNav = 'true';
    link.dataset.ar = 'لوحة التحكم'; link.dataset.en = 'Dashboard'; link.textContent = t('لوحة التحكم','Dashboard');
    nav.append(link);
  }

  function trackNavigation() {
    document.addEventListener('click', event => {
      const link = event.target.closest('a[href]');
      if (!link) return;
      const href = link.getAttribute('href') || '';
      if (/exercises\.html\?exercise=/.test(href)) activity('exercise-view', link.textContent.trim() || t('تمرين','Exercise'));
      else if (/article\.html\?a=/.test(href)) activity('article-view', link.textContent.trim() || t('مقال','Article'));
      else if (/workout-plans\.html/.test(href)) activity('plans-view', t('تصفح الخطط','Viewed plans'));
    });
  }

  function builderPlan() { return read('valhan-builder-v3', null); }
  function allExercisesInPlan(plan) { return (plan?.days || []).flatMap((day, dayIndex) => (day.exercises || []).map(ex => ({...ex, day: day.name || `Day ${dayIndex + 1}`, dayIndex}))); }
  function workingSets(plan) { return allExercisesInPlan(plan).reduce((sum, ex) => sum + Math.max(0, Number(ex.sets) || 0), 0); }

  function renderDashboard() {
    const host = $('#platform-dashboard');
    if (!host) return;
    const plan = builderPlan();
    const history = read(KEYS.history, []);
    const savedArticles = read('valhan-saved-articles-v1', {});
    const savedExercises = read('valhan-saved-exercises-v1', {});
    const activities = read(KEYS.activity, []);
    const totalSets = history.reduce((sum, item) => sum + (Number(item.workingSets) || 0), 0);
    const currentMonth = localDate().slice(0,7);
    const monthCount = history.filter(item => String(item.completedAt).startsWith(currentMonth)).length;
    const notes = read(KEYS.notes, []);
    const calendar = read(KEYS.calendar, {});
    const days = Object.keys(calendar).filter(day => day.startsWith(currentMonth)).length;
    host.innerHTML = `
      <section class="platform-stats">
        <article class="platform-stat"><span>${t('جلسات مكتملة','Completed sessions')}</span><strong>${history.length}</strong><small>${t('هذا الشهر','This month')}: ${monthCount}</small></article>
        <article class="platform-stat"><span>${t('مجموعات العمل المسجلة','Logged working sets')}</span><strong>${totalSets}</strong><small>${t('من سجل التدريب','From training history')}</small></article>
        <article class="platform-stat"><span>${t('عناصر محفوظة','Saved items')}</span><strong>${Object.keys(savedArticles).length + Object.keys(savedExercises).length}</strong><small>${t('مقالات وتمارين','Articles & exercises')}</small></article>
        <article class="platform-stat"><span>${t('ملاحظاتك','Your notes')}</span><strong>${notes.length}</strong><small>${t('أيام تدريب هذا الشهر','Training days this month')}: ${days}</small></article>
      </section>
      <section class="platform-panel progress-panel"><div class="platform-panel-head"><div><span class="eyebrow">PROGRESS OVERVIEW</span><h2>${t('اتساق التدريب خلال آخر 6 أسابيع','Training consistency — last 6 weeks')}</h2></div><span class="muted">${history.length} ${t('جلسة مسجلة إجمالًا','logged sessions total')}</span></div><div class="progress-weeks">${(() => { const buckets=[]; const now=new Date(); for(let i=5;i>=0;i--){const start=new Date(now);start.setDate(now.getDate()-((now.getDay()+6)%7)-i*7);start.setHours(0,0,0,0);const end=new Date(start);end.setDate(start.getDate()+7);const count=history.filter(item=>{const d=new Date(`${item.completedAt}T00:00:00`);return d>=start&&d<end;}).length;buckets.push({label:start.toLocaleDateString(ar()?'ar-EG':'en-US',{day:'numeric',month:'short'}),count});}const max=Math.max(1,...buckets.map(x=>x.count));return buckets.map(x=>`<div class="progress-week"><div class="progress-bar-track"><span style="height:${Math.max(4,x.count/max*100)}%"></span></div><b>${x.count}</b><small>${x.label}</small></div>`).join(''); })()}</div><p class="muted">${t('المخطط يعرض الجلسات المسجلة فقط، ولا يستنتج أداءً أو تقدمًا عضليًا غير موجود في البيانات.','This chart reflects logged sessions only; it does not infer strength or muscle gains that are not in the data.')}</p></section>
      <section class="platform-panel"><div class="platform-panel-head"><div><span class="eyebrow">TRAINING SPACE</span><h2>${t('خطتك الحالية','Current plan')}</h2></div><a class="btn btn-outline btn-sm" href="${root}/pages/workout-builder.html">${t('فتح المنشئ','Open builder')}</a></div>
        ${plan ? `<div class="platform-plan-summary"><h3>${safe(plan.name || 'VALHAN Plan')}</h3><p>${(plan.days || []).length} ${t('أيام في الخطة','days in plan')} · ${allExercisesInPlan(plan).length} ${t('تمارين','exercises')} · ${workingSets(plan)} ${t('مجموعة عمل','working sets')}</p><button class="btn btn-primary" id="complete-current-workout">${t('تسجيل إكمال جلسة','Log completed session')}</button></div>` : `<p class="muted">${t('لا توجد خطة محفوظة في المنشئ حتى الآن.','No saved builder plan yet.')}</p>`}
      </section>
      <section class="platform-grid">
        <article class="platform-panel"><h2>${t('النشاط الأخير','Recent activity')}</h2><div class="platform-list">${activities.length ? activities.slice(0,8).map(item=>`<div class="platform-list-row"><span>${safe(item.label)}</span><time>${new Date(item.at).toLocaleString(ar()?'ar-EG':'en-US',{dateStyle:'medium',timeStyle:'short'})}</time></div>`).join('') : `<p class="muted">${t('سيظهر نشاطك هنا أثناء استخدام الموقع.','Your activity will appear here as you use the site.')}</p>`}</div></article>
        <article class="platform-panel"><h2>${t('آخر جلسات التدريب','Recent training')}</h2><div class="platform-list">${history.length ? history.slice(0,6).map(item=>`<div class="platform-list-row"><span>${safe(item.planName)}</span><time>${safe(item.completedAt)}</time></div>`).join('') : `<p class="muted">${t('لم تسجل جلسات بعد.','No sessions logged yet.')}</p>`}</div><a class="text-link" href="#training-history">${t('عرض السجل والتقويم','View history & calendar')} ←</a></article>
      </section>`;
    $('#complete-current-workout')?.addEventListener('click', completeWorkout);
    renderHistory(); renderCalendar(); renderNotes();
  }

  function completeWorkout() {
    const plan = builderPlan();
    if (!plan || !(plan.days || []).length) { toast(t('لا توجد خطة لتسجيلها.','There is no plan to log.')); return; }
    const dayOptions = plan.days.map((day, index) => ({day,index})).filter(x => !x.day.rest);
    if (!dayOptions.length) { toast(t('الخطة لا تحتوي على أيام تدريب.','This plan has no training days.')); return; }
    const selected = prompt(t(`اكتب رقم يوم التدريب لإكماله (1-${dayOptions.length})`, `Enter the training day number to complete (1-${dayOptions.length})`), '1');
    if (selected === null) return;
    const chosen = dayOptions[Number(selected)-1];
    if (!chosen) { toast(t('رقم اليوم غير صحيح.','Invalid day number.')); return; }
    const record = { id: `${Date.now()}`, planName: plan.name || 'VALHAN Plan', dayName: chosen.day.name || `Day ${chosen.index+1}`, completedAt: localDate(), completedAtMs: Date.now(), exerciseCount: (chosen.day.exercises || []).length, workingSets: (chosen.day.exercises || []).reduce((sum, ex)=>sum+(Number(ex.sets)||0),0), exercises: (chosen.day.exercises || []).map(ex=>({id:ex.id||null,name:ex.name,sets:Number(ex.sets)||0,reps:ex.reps||''})), notes: '' };
    const history = read(KEYS.history, []); history.unshift(record); write(KEYS.history, history.slice(0,500));
    const calendar = read(KEYS.calendar, {}); calendar[record.completedAt] = (calendar[record.completedAt] || 0) + 1; write(KEYS.calendar, calendar);
    activity('workout-completed', record.dayName, record.planName); renderDashboard(); toast(t('تم تسجيل الجلسة بنجاح.','Workout session logged.'));
  }

  function renderHistory() {
    const host = $('#training-history-list'); if (!host) return;
    const history = read(KEYS.history, []);
    host.innerHTML = history.length ? history.map(item=>`<article class="history-item"><div><strong>${safe(item.dayName)}</strong><p>${safe(item.planName)} · ${safe(item.completedAt)} · ${item.workingSets} ${t('مجموعة','sets')}</p><label>${t('ملاحظات الجلسة','Session notes')}<input data-history-note="${safe(item.id)}" value="${safe(item.notes||'')}" placeholder="${t('أضف ملاحظة...','Add a note...')}"></label></div><button class="btn btn-quiet btn-sm" data-delete-history="${safe(item.id)}">${t('حذف','Delete')}</button></article>`).join('') : `<p class="muted">${t('سجل التدريب فارغ حاليًا.','Training history is empty.')}</p>`;
  }

  function renderCalendar() {
    const host = $('#training-calendar'); if (!host) return;
    const date = new Date(); const year = date.getFullYear(); const month = date.getMonth();
    const first = new Date(year,month,1).getDay(); const total = new Date(year,month+1,0).getDate();
    const data = read(KEYS.calendar, {}); const names = t(['أحد','إثنين','ثلاثاء','أربعاء','خميس','جمعة','سبت'],['Sun','Mon','Tue','Wed','Thu','Fri','Sat']);
    host.innerHTML = `<h3>${date.toLocaleDateString(ar()?'ar-EG':'en-US',{month:'long',year:'numeric'})}</h3><div class="calendar-grid">${names.map(n=>`<span class="calendar-day-name">${n}</span>`).join('')}${Array.from({length:first},()=>'<span></span>').join('')}${Array.from({length:total},(_,i)=>{const day=String(i+1).padStart(2,'0');const key=`${year}-${String(month+1).padStart(2,'0')}-${day}`;return `<span class="calendar-date ${data[key]?'has-workout':''}" title="${data[key]||0} ${t('جلسات','sessions')}">${i+1}${data[key]?`<b>${data[key]}</b>`:''}</span>`}).join('')}</div>`;
  }

  function renderNotes() {
    const host = $('#personal-notes-list'); if (!host) return;
    const notes = read(KEYS.notes, []);
    host.innerHTML = notes.length ? notes.map(note=>`<article class="note-item"><div><strong>${safe(note.title)}</strong><p>${safe(note.body)}</p><small>${safe(note.scopeLabel || note.scope)}${note.targetName ? ` · ${safe(note.targetName)}` : ''} · ${new Date(note.updatedAt).toLocaleDateString(ar()?'ar-EG':'en-US')}</small></div><button class="btn btn-quiet btn-sm" data-delete-note="${safe(note.id)}">${t('حذف','Delete')}</button></article>`).join('') : `<p class="muted">${t('لا توجد ملاحظات بعد.','No notes yet.')}</p>`;
  }

  function download(filename, content, type='application/json') {
    const blob = new Blob([content], {type}); const url = URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=filename; a.click(); setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  function exportData() {
    const keys = [...Object.values(KEYS),'valhan-lang','valhan-theme','valhan-builder-v3','valhan-builder-backup','valhan-saved-articles-v1','valhan-saved-exercises-v1','valhan-reading-progress-v1'];
    const payload = { app:'VALHAN MUSCLES', schemaVersion:VERSION, exportedAt:new Date().toISOString(), data:Object.fromEntries(keys.map(key=>[key,read(key,null)])) };
    download(`valhan-backup-${localDate()}.json`, JSON.stringify(payload,null,2)); activity('data-export',t('تصدير نسخة احتياطية','Data backup exported')); toast(t('تم تصدير النسخة الاحتياطية.','Backup exported.'));
  }
  function importData(file) {
    const reader = new FileReader(); reader.onload = () => {
      try {
        const payload=JSON.parse(reader.result);
        if(payload.app!=='VALHAN MUSCLES'||payload.schemaVersion!==VERSION||!payload.data||typeof payload.data!=='object') throw new Error('schema');
        const allowed=[...Object.values(KEYS),'valhan-lang','valhan-theme','valhan-builder-v3','valhan-builder-backup','valhan-saved-articles-v1','valhan-saved-exercises-v1','valhan-reading-progress-v1'];
        const entries=Object.entries(payload.data).filter(([key])=>allowed.includes(key));
        if(!entries.length) throw new Error('empty');
        if(!confirm(t(`سيتم دمج ${entries.length} مجموعة بيانات مع البيانات الحالية. لن يتم حذف مفاتيح أخرى. متابعة؟`,`Merge ${entries.length} data groups with current data? Other keys will not be deleted.`))) return;
        entries.forEach(([key,value])=>{ if(key==='valhan-builder-v3' && read(key,null) && !confirm(t('يوجد منشئ خطة حالي. استبداله بالنسخة المستوردة؟','A current builder plan exists. Replace it with the imported plan?'))) return; write(key,value); });
        activity('data-import',t('استيراد نسخة احتياطية','Backup imported')); toast(t('تم استيراد البيانات المتوافقة.','Compatible data imported.')); setTimeout(()=>location.reload(),700);
      } catch { toast(t('ملف غير صالح أو إصدار غير مدعوم. لم يتم تغيير البيانات.','Invalid file or unsupported version. No data was changed.')); }
    }; reader.readAsText(file);
  }

  function initDashboard() {
    renderDashboard();
    $('#export-data')?.addEventListener('click',exportData);
    $('#import-file')?.addEventListener('change',e=>{if(e.target.files?.[0]) importData(e.target.files[0]); e.target.value='';});
    const noteScope=$('#note-scope'),noteTarget=$('#note-target'),noteTargetWrap=$('#note-target-wrap');
    const refreshNoteTargets=()=>{if(!noteScope||!noteTarget)return;const scope=noteScope.value;let options=[];if(scope==='exercise')options=exercises().map(x=>({id:x.id,label:name(x)}));if(scope==='plan')options=plans().map(x=>({id:x.id,label:ar()?x.arabicName:x.name}));if(scope==='day'){const p=builderPlan();options=(p?.days||[]).map((x,i)=>({id:String(i),label:x.name||`${t('اليوم','Day')} ${i+1}`}));}noteTargetWrap.hidden=scope==='general';noteTarget.innerHTML=options.map(x=>`<option value="${safe(x.id)}">${safe(x.label)}</option>`).join('');};
    noteScope?.addEventListener('change',refreshNoteTargets);refreshNoteTargets();
    $('#add-personal-note')?.addEventListener('click',()=>{const title=$('#note-title').value.trim(),body=$('#note-body').value.trim(),scope=$('#note-scope').value,targetId=scope==='general'?'':noteTarget?.value||'';if(!title||!body){toast(t('اكتب عنوان ومحتوى الملاحظة.','Enter a title and note.'));return;}const targetLabel=scope==='exercise'?name(exercises().find(x=>x.id===targetId)||{}):scope==='plan'?(plans().find(x=>x.id===targetId)?.[ar()?'arabicName':'name']||''):scope==='day'?(builderPlan()?.days?.[Number(targetId)]?.name||''):'';const notes=read(KEYS.notes,[]);notes.unshift({id:`${Date.now()}`,title,body,scope,targetId,targetName:targetLabel,scopeLabel:({general:t('عام','General'),exercise:t('تمرين','Exercise'),plan:t('خطة','Plan'),day:t('يوم تدريبي','Workout day')})[scope],updatedAt:Date.now()});write(KEYS.notes,notes.slice(0,200));$('#note-title').value='';$('#note-body').value='';renderNotes();activity('note-added',title);});
    $('#training-history-list')?.addEventListener('change',e=>{const input=e.target.closest('[data-history-note]');if(!input)return;const history=read(KEYS.history,[]);const item=history.find(x=>x.id===input.dataset.historyNote);if(item){item.notes=input.value;write(KEYS.history,history);}});
    $('#training-history-list')?.addEventListener('click',e=>{const btn=e.target.closest('[data-delete-history]');if(!btn)return;write(KEYS.history,read(KEYS.history,[]).filter(x=>x.id!==btn.dataset.deleteHistory));renderHistory();renderDashboard();});
    $('#personal-notes-list')?.addEventListener('click',e=>{const btn=e.target.closest('[data-delete-note]');if(!btn)return;write(KEYS.notes,read(KEYS.notes,[]).filter(x=>x.id!==btn.dataset.deleteNote));renderNotes();renderDashboard();});
  }

  function initTools() {
    const compareA=$('#compare-a'), compareB=$('#compare-b'), compareOut=$('#comparison-result');
    if(compareA&&compareB){const options=exercises().map(ex=>`<option value="${ex.id}">${safe(name(ex))}</option>`).join('');compareA.innerHTML=options;compareB.innerHTML=options;compareB.selectedIndex=Math.min(1,compareB.options.length-1);const compare=()=>{const a=exercises().find(x=>x.id===compareA.value),b=exercises().find(x=>x.id===compareB.value);if(!a||!b)return;const details=ex=>`<article class="compare-card"><h3>${safe(name(ex))}</h3><p>${safe(ex.equipment||ex.legacy?.equipment||'—')}</p><b>${t('العضلات الأساسية','Primary muscles')}</b><p>${(ex.primaryMuscles||[]).map(id=>safe(muscles().find(m=>m.id===id)?.name?.[lang()]||id)).join('، ')||'—'}</p><b>${t('العضلات الثانوية','Secondary muscles')}</b><p>${(ex.secondaryMuscles||[]).map(id=>safe(muscles().find(m=>m.id===id)?.name?.[lang()]||id)).join('، ')||'—'}</p><b>${t('نمط الحركة','Movement pattern')}</b><p>${safe(ex.movementPattern||t('غير محدد في البيانات','Not specified in data'))}</p></article>`;compareOut.innerHTML=details(a)+details(b);};compareA.addEventListener('change',compare);compareB.addEventListener('change',compare);compare();}
    const altSelect=$('#alternative-exercise'),altOut=$('#alternatives-result');if(altSelect&&altOut){altSelect.innerHTML=exercises().map(ex=>`<option value="${ex.id}">${safe(name(ex))}</option>`).join('');const render=()=>{const source=exercises().find(x=>x.id===altSelect.value);if(!source)return;const candidates=exercises().filter(x=>x.id!==source.id).map(ex=>({ex,shared:(ex.primaryMuscles||[]).filter(id=>(source.primaryMuscles||[]).includes(id)).length,pattern:ex.movementPattern&&ex.movementPattern===source.movementPattern?1:0})).filter(x=>x.shared||x.pattern).sort((a,b)=>b.shared-a.shared+b.pattern-a.pattern);altOut.innerHTML=candidates.length?`<p class="muted">${t('اقتراحات بناءً على العضلات الأساسية ونمط الحركة المتاحين في البيانات، وليست بدائل مكافئة تلقائيًا.','Suggestions based on available primary-muscle and movement-pattern data; they are not automatically equivalent substitutes.')}</p>`+candidates.slice(0,8).map(x=>`<div class="platform-list-row"><strong>${safe(name(x.ex))}</strong><span>${x.shared} ${t('عضلات أساسية مشتركة','shared primary muscles')}</span></div>`).join(''):`<p class="muted">${t('لا توجد بيانات كافية لاقتراح بدائل.','Not enough data to suggest alternatives.')}</p>`;};altSelect.addEventListener('change',render);render();}
    const equipmentSelect=$('#equipment-filter'),equipmentOut=$('#equipment-results');if(equipmentSelect&&equipmentOut){equipmentSelect.innerHTML=equipment().map(item=>`<option value="${item.id}">${safe(item.name?.[lang()]||item.id)}</option>`).join('');const render=()=>{const id=equipmentSelect.value;const list=exercises().filter(ex=>(ex.equipmentOptions||[]).includes(id)||String(ex.equipment||'').toLowerCase().includes(id));equipmentOut.innerHTML=list.length?list.map(ex=>`<div class="platform-list-row"><a href="${root}/pages/exercises.html?exercise=${encodeURIComponent(ex.id)}">${safe(name(ex))}</a><span>${safe(ex.equipment||'')}</span></div>`).join(''):`<p class="muted">${t('لا توجد تمارين مرتبطة بهذه المعدة في البيانات الحالية.','No exercises linked to this equipment in current data.')}</p>`;};equipmentSelect.addEventListener('change',render);render();}
    const supersetSelect=$('#superset-exercises'),supersetOut=$('#superset-result'),savedSupersets=$('#saved-supersets');if(supersetSelect&&supersetOut){
      supersetSelect.innerHTML=exercises().map(ex=>`<option value="${ex.id}">${safe(name(ex))}</option>`).join('');
      const renderSupersets=()=>{const items=read(KEYS.supersets,[]);if(savedSupersets)savedSupersets.innerHTML=items.length?items.map(item=>`<div class="platform-list-row"><span>${(item.exerciseIds||[]).map(id=>safe(name(exercises().find(ex=>ex.id===id)||{}))).join(' + ')}</span><button class="btn btn-quiet btn-sm" data-delete-superset="${safe(item.id)}">${t('حذف','Delete')}</button></div>`).join(''):`<p class="muted">${t('لا توجد مجموعات محفوظة.','No saved supersets.')}</p>`;};
      $('#save-superset')?.addEventListener('click',()=>{const ids=[...supersetSelect.selectedOptions].map(o=>o.value);if(ids.length<2){toast(t('اختر تمرينين على الأقل.','Select at least two exercises.'));return;}const all=read(KEYS.supersets,[]);all.unshift({id:`${Date.now()}`,createdAt:Date.now(),exerciseIds:ids});write(KEYS.supersets,all.slice(0,50));supersetOut.innerHTML=`<p class="success-note">${t('تم حفظ المجموعة الفائقة.','Superset saved.')}</p>`;activity('superset-created',t('إنشاء مجموعة فائقة','Superset created'));renderSupersets();});
      savedSupersets?.addEventListener('click',event=>{const button=event.target.closest('[data-delete-superset]');if(!button)return;write(KEYS.supersets,read(KEYS.supersets,[]).filter(item=>item.id!==button.dataset.deleteSuperset));renderSupersets();});renderSupersets();
    }
    $('#share-workout')?.addEventListener('click',()=>{const plan=builderPlan();if(!plan){toast(t('أنشئ خطة أولًا.','Build a plan first.'));return;}const title=safe(plan.name||(ar()?'خطتي التدريبية':'My Workout Plan'));const summary=ar()?`${plan.days.length} أيام تدريب · ${allExercisesInPlan(plan).length} تمارين · ${workingSets(plan)} مجموعة عمل`:`${plan.days.length} training days · ${allExercisesInPlan(plan).length} exercises · ${workingSets(plan)} working sets`;const anchor=ar()?'end':'start',x=ar()?1110:90,dir=ar()?'rtl':'ltr';const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#101418"/><rect x="48" y="48" width="1104" height="534" rx="30" fill="#18232b" stroke="#00c8d7" stroke-width="3"/><text x="${x}" y="145" text-anchor="${anchor}" fill="#00d2df" font-family="Arial" font-size="34" font-weight="700">VALHAN MUSCLES</text><text x="${x}" y="245" text-anchor="${anchor}" direction="${dir}" fill="#fff" font-family="Arial" font-size="54" font-weight="700">${title}</text><text x="${x}" y="330" text-anchor="${anchor}" direction="${dir}" fill="#cbd5e1" font-family="Arial" font-size="30">${safe(summary)}</text><text x="${x}" y="500" text-anchor="${anchor}" fill="#94a3b8" font-family="Arial" font-size="24">${ar()?'قوة في التركيز. وضوح في التدريب.':'BUILD YOUR STRENGTH. MASTER YOUR FITNESS.'}</text></svg>`;download('valhan-workout-card.svg',svg,'image/svg+xml');});
    const timerDisplay=$('#timer-display');let timerEnd=0,timerRemaining=90,timerId=null;const draw=()=>{if(timerDisplay)timerDisplay.textContent=`${Math.floor(timerRemaining/60).toString().padStart(2,'0')}:${Math.floor(timerRemaining%60).toString().padStart(2,'0')}`;};const stop=()=>{clearInterval(timerId);timerId=null;};$('#timer-start')?.addEventListener('click',()=>{if(timerId)return;timerEnd=Date.now()+timerRemaining*1000;timerId=setInterval(()=>{timerRemaining=Math.max(0,Math.ceil((timerEnd-Date.now())/1000));draw();if(!timerRemaining){stop();toast(t('انتهت فترة الراحة.','Rest interval complete.'));}},200);});$('#timer-pause')?.addEventListener('click',()=>{if(timerId){timerRemaining=Math.max(0,Math.ceil((timerEnd-Date.now())/1000));stop();draw();}});$('#timer-reset')?.addEventListener('click',()=>{stop();timerRemaining=Math.max(5,Number($('#timer-seconds')?.value)||90);draw();});$('#timer-seconds')?.addEventListener('change',()=>{stop();timerRemaining=Math.max(5,Number($('#timer-seconds').value)||90);draw();});draw();
  }

  function initGlossary() {
    const terms=[['Progressive overload','التحميل التدريجي','زيادة متدرجة ومدروسة في متطلبات التدريب بمرور الوقت.','Gradually increasing training demands over time.'],['Range of motion','مدى الحركة','المسافة التي يتحرك خلالها المفصل أثناء أداء الحركة.','The distance a joint moves during an exercise.'],['Concentric','انقباضي','مرحلة تقصر فيها العضلة أثناء إنتاج القوة.','The muscle-shortening phase while producing force.'],['Eccentric','انبساطي','مرحلة تطول فيها العضلة أثناء مقاومة الحمل.','The muscle-lengthening phase while resisting load.'],['Isometric','ثابت','إنتاج قوة دون تغير واضح في طول العضلة أو حركة المفصل.','Producing force without appreciable muscle-length change or joint movement.'],['Hypertrophy','التضخم العضلي','زيادة حجم الألياف العضلية، وتتأثر بعوامل متعددة منها التدريب والتعافي والتغذية.','An increase in muscle-fiber size influenced by training, recovery, nutrition, and other factors.'],['Volume','الحجم التدريبي','كمية العمل التدريبي، ويُقاس بطرق مختلفة حسب السياق.','The amount of training work, measured in different ways depending on context.'],['RPE','مقياس الجهد المدرك','مقياس ذاتي لتقدير مدى صعوبة المجموعة.','A subjective scale for rating set difficulty.'],['Stability','الثبات','القدرة على التحكم في وضع الجسم أو المفصل أثناء الحركة.','The ability to control body or joint position during movement.'],['Recovery','الاستشفاء','العمليات التي تساعد الجسم على التعافي والتكيف بعد التدريب.','Processes that help the body recover and adapt after training.']];
    const input=$('#glossary-search'),host=$('#glossary-results');if(!input||!host)return;const render=()=>{const q=input.value.toLowerCase();host.innerHTML=terms.filter(x=>x.join(' ').toLowerCase().includes(q)).map(x=>`<article class="glossary-item"><h3>${ar()?safe(x[1]):safe(x[0])}</h3><small>${safe(x[0])}</small><p>${ar()?safe(x[2]):safe(x[3])}</p></article>`).join('')||`<p class="muted">${t('لا توجد نتائج.','No results.')}</p>`;};input.addEventListener('input',render);render();
  }

  function initGlobal() {
    injectNav(); trackNavigation();
    if(document.body.dataset.page==='dashboard'){initDashboard();initTools();initGlossary();}
    document.addEventListener('visibilitychange',()=>{if(!document.hidden) window.ValhanSavedHub?.updateUI?.();});
    window.addEventListener('storage',event=>{if(event.key?.startsWith('valhan-saved-'))window.ValhanSavedHub?.updateUI?.();});
    window.addEventListener('valhan:saved-change',event=>{if(String(event.detail?.key||'').startsWith('valhan-saved-')){activity('saved-content',t('تحديث المحتوى المحفوظ','Saved content updated'));if(document.body.dataset.page==='dashboard')renderDashboard();}});
  }

  window.ValhanPlatform={activity,keys:KEYS,exportData};
  document.addEventListener('DOMContentLoaded',initGlobal);
})();
