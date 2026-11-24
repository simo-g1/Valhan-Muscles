(() => {
  'use strict';
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const lang = () => window.ValhanLang?.() || 'ar';
  const ar = () => lang() === 'ar';
  const tr = (a, e) => ar() ? a : e;
  const KEYS = { sessions:'valhan-training-sessions-v1', notes:'valhan-personal-notes-v1', activity:'valhan-recent-activity-v1', savedMuscles:'valhan-saved-muscles-v1', savedEquipment:'valhan-saved-equipment-v1' };
  const read = (key, fallback = []) => { try { const v = JSON.parse(localStorage.getItem(key) || 'null'); return v ?? fallback; } catch { return fallback; } };
  const write = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { toast(tr('مساحة التخزين غير متاحة. صدّر نسخة احتياطية قبل المتابعة.','Storage is unavailable. Export a backup before continuing.')); return false; } };
  const toast = msg => { const el = $('#toast'); if (!el) return; el.textContent = msg; el.classList.add('show'); setTimeout(() => el.classList.remove('show'), 2600); };
  const exercises = window.ValhanExercises || [];
  const muscles = window.ValhanMuscles || [];
  const equipment = window.ValhanEquipment || [];
  const nameOf = x => ar() ? (x?.name?.ar || x?.arabicName || x?.name || x?.id) : (x?.name?.en || x?.name || x?.id);
  const safe = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const dateISO = d => { const x = new Date(d); return `${x.getFullYear()}-${String(x.getMonth()+1).padStart(2,'0')}-${String(x.getDate()).padStart(2,'0')}`; };
  const sessions = () => read(KEYS.sessions, []);
  const fmtDate = d => new Intl.DateTimeFormat(ar()?'ar-EG':'en-US',{dateStyle:'medium'}).format(new Date(`${d}T12:00:00`));
  const logActivity = (type, label) => { const list = read(KEYS.activity, []); list.unshift({id:crypto.randomUUID?.() || String(Date.now()),type,label,at:Date.now()}); write(KEYS.activity,list.slice(0,100)); };

  // Dashboard and history
  function renderKPIs() {
    const list=sessions(), now=new Date(), month=dateISO(new Date(now.getFullYear(),now.getMonth(),1));
    const thisMonth=list.filter(x=>x.date>=month).length;
    const totalSets=list.reduce((n,x)=>n+(Number(x.sets)||0),0);
    const totalMinutes=list.reduce((n,x)=>n+(Number(x.duration)||0),0);
    const kpis=[[tr('إجمالي الجلسات','Total sessions'),list.length],[tr('جلسات هذا الشهر','This month'),thisMonth],[tr('مجموعات مسجلة','Logged sets'),totalSets],[tr('وقت التدريب','Training time'),`${Math.floor(totalMinutes/60)}h ${totalMinutes%60}m`]];
    $('#vc-kpis').innerHTML=kpis.map(([label,value])=>`<div class="vc-kpi"><span>${label}</span><strong>${value}</strong></div>`).join('');
  }
  function renderHistory(){
    const list=sessions().sort((a,b)=>b.date.localeCompare(a.date)||b.createdAt-a.createdAt), host=$('#history-list');
    host.innerHTML=list.length?list.map(x=>`<article class="vc-list-item"><div><strong>${safe(x.name)}</strong><p>${fmtDate(x.date)} · ${x.duration} min · ${x.sets} ${tr('مجموعة','sets')}${x.notes?`<br>${safe(x.notes)}`:''}</p></div><button class="icon-btn" data-delete-session="${safe(x.id)}" aria-label="${tr('حذف الجلسة','Delete session')}"><i class="fa-solid fa-trash"></i></button></article>`).join(''):`<div class="vc-empty">${tr('لا توجد جلسات مسجلة حتى الآن.','No sessions logged yet.')}</div>`;
  }
  $('#session-date').value=dateISO(new Date());
  $('#session-form').addEventListener('submit',e=>{e.preventDefault();const item={id:crypto.randomUUID?.()||String(Date.now()),name:$('#session-name').value.trim(),date:$('#session-date').value,duration:Number($('#session-duration').value)||0,sets:Number($('#session-sets').value)||0,notes:$('#session-notes').value.trim(),createdAt:Date.now()};if(!item.name||!item.date)return;const list=sessions();list.push(item);if(write(KEYS.sessions,list)){logActivity('session',item.name);e.target.reset();$('#session-date').value=dateISO(new Date());$('#session-duration').value=60;$('#session-sets').value=12;renderAll();toast(tr('تم حفظ الجلسة.','Workout session saved.'));}});
  $('#history-list').addEventListener('click',e=>{const b=e.target.closest('[data-delete-session]');if(!b)return;if(!confirm(tr('حذف هذه الجلسة؟','Delete this session?')))return;write(KEYS.sessions,sessions().filter(x=>x.id!==b.dataset.deleteSession));renderAll();});
  $('#export-history').addEventListener('click',()=>download('valhan-training-history.csv','text/csv;charset=utf-8','date,name,duration_minutes,sets,notes\n'+sessions().map(x=>[x.date,x.name,x.duration,x.sets,x.notes].map(v=>'"'+String(v??'').replace(/"/g,'""')+'"').join(',')).join('\n')));

  function renderActivity(){const list=read(KEYS.activity,[]).slice(0,8);$('#activity-list').innerHTML=list.length?list.map(x=>`<div class="vc-list-item"><div><strong>${safe(x.label||x.type)}</strong><p>${new Intl.DateTimeFormat(ar()?'ar-EG':'en-US',{dateStyle:'short',timeStyle:'short'}).format(new Date(x.at))}</p></div><span class="vc-pill">${safe(x.type)}</span></div>`).join(''):`<div class="vc-empty">${tr('لا يوجد نشاط مسجل بعد.','No recent activity yet.')}</div>`;}

  // Calendar (clickable days) and real progress metrics
  let calDate=new Date();
  let selectedDay=null;
  function renderCalendar(){
    const y=calDate.getFullYear(),m=calDate.getMonth(),first=new Date(y,m,1),last=new Date(y,m+1,0),offset=(first.getDay()+6)%7, days=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    $('#cal-label').textContent=new Intl.DateTimeFormat(ar()?'ar-EG':'en-US',{month:'long',year:'numeric'}).format(calDate);
    const perDay=new Map();sessions().forEach(x=>perDay.set(x.date,(perDay.get(x.date)||0)+1));
    const today=dateISO(new Date());
    let html=days.map((d)=>`<div class="vc-day-name">${ar()?['إث','ثلا','أر','خم','جم','سب','أح'][days.indexOf(d)]:d}</div>`).join('');
    for(let i=0;i<offset;i++)html+='<div class="vc-day muted-day"></div>';
    for(let n=1;n<=last.getDate();n++){
      const key=dateISO(new Date(y,m,n)),c=perDay.get(key)||0;
      const label=`${fmtDate(key)} — ${c?tr(`${c} جلسة مسجلة`,`${c} session(s) logged`):tr('لا توجد جلسات','No sessions')}`;
      html+=`<button type="button" class="vc-day${c?' has-session':''}${key===today?' is-today':''}${key===selectedDay?' is-selected':''}" data-date="${key}" aria-pressed="${key===selectedDay}" aria-label="${safe(label)}">${n}</button>`;
    }
    $('#calendar-grid').innerHTML=html;
  }
  function renderDayDetail(){
    const host=$('#calendar-detail');if(!host)return;
    if(!selectedDay){host.innerHTML=`<p class="vc-help muted">${tr('اضغط على أي يوم لعرض حالة التدريب والنشاط المسجل فيه.','Select a day to see its training status and logged activity.')}</p>`;return;}
    const list=sessions().filter(x=>x.date===selectedDay).sort((a,b)=>(a.createdAt||0)-(b.createdAt||0));
    const today=dateISO(new Date());
    let status,cls;
    if(list.length){status=tr(`تم التدريب — ${list.length} جلسة مسجلة`,`Trained — ${list.length} session(s) logged`);cls='is-done';}
    else if(selectedDay>today){status=tr('يوم قادم — لا يوجد تسجيل بعد','Upcoming day — nothing logged yet');cls='is-future';}
    else{status=tr('لا توجد جلسة مسجلة في هذا اليوم','No session logged on this day');cls='is-empty';}
    const mins=list.reduce((n,x)=>n+(Number(x.duration)||0),0),sets=list.reduce((n,x)=>n+(Number(x.sets)||0),0);
    const time=x=>x.createdAt?new Intl.DateTimeFormat(ar()?'ar-EG':'en-US',{timeStyle:'short'}).format(new Date(x.createdAt)):'';
    host.innerHTML=`<div class="vc-day-detail ${cls}"><div class="vc-day-detail-head"><strong>${fmtDate(selectedDay)}</strong><span class="vc-pill">${status}</span></div>`+
      (list.length?`<div class="vc-day-totals"><span>${tr('المدة','Duration')}: <b>${mins} min</b></span><span>${tr('المجموعات','Sets')}: <b>${sets}</b></span></div><div class="vc-list">${list.map(x=>`<article class="vc-list-item"><div><strong>${safe(x.name)}</strong><p>${x.duration} min · ${x.sets} ${tr('مجموعة','sets')}${time(x)?` · ${tr('وقت التسجيل','Logged at')} ${time(x)}`:''}${x.notes?`<br>${safe(x.notes)}`:''}</p></div></article>`).join('')}</div>`:'')+`</div>`;
  }
  $('#cal-prev').addEventListener('click',()=>{calDate=new Date(calDate.getFullYear(),calDate.getMonth()-1,1);renderCalendar();});$('#cal-next').addEventListener('click',()=>{calDate=new Date(calDate.getFullYear(),calDate.getMonth()+1,1);renderCalendar();});
  $('#calendar-grid').addEventListener('click',e=>{
    const b=e.target.closest('[data-date]');if(!b)return;
    selectedDay=b.dataset.date;renderCalendar();renderDayDetail();
    $(`#calendar-grid [data-date="${selectedDay}"]`)?.focus();
  });
  function renderProgress(){
    const list=sessions().sort((a,b)=>a.date.localeCompare(b.date));
    const buckets=[];
    const now=new Date();
    for(let i=5;i>=0;i--){
      const start=new Date(now);start.setDate(now.getDate()-((now.getDay()+6)%7)-i*7);start.setHours(0,0,0,0);
      const end=new Date(start);end.setDate(start.getDate()+7);
      const count=list.filter(item=>{const d=new Date(`${item.date}T12:00:00`);return d>=start&&d<end;}).length;
      buckets.push({label:start.toLocaleDateString(ar()?'ar-EG':'en-US',{day:'numeric',month:'short'}),count});
    }
    const max=Math.max(1,...buckets.map(x=>x.count));
    const sets=list.reduce((n,x)=>n+(+x.sets||0),0),mins=list.reduce((n,x)=>n+(+x.duration||0),0);
    $('#progress-content').innerHTML=`<div class="vc-progress-layout"><div class="vc-progress-chart"><div class="vc-consistency-chart">${buckets.map(x=>`<div class="vc-consistency-week"><div class="vc-consistency-track"><span style="height:${Math.max(4,x.count/max*100)}%"></span></div><b>${x.count}</b><small>${x.label}</small></div>`).join('')}</div></div><div class="vc-progress-stats"><div class="vc-stat-row"><span>${tr('إجمالي الجلسات المسجلة','Total logged sessions')}</span><strong>${list.length}</strong></div><div class="vc-stat-row"><span>${tr('إجمالي المجموعات المسجلة','Total logged sets')}</span><strong>${sets}</strong></div><div class="vc-stat-row"><span>${tr('إجمالي الساعات المسجلة','Total hours logged')}</span><strong>${(mins/60).toFixed(1)}</strong></div></div></div><p class="vc-help muted">${tr('يعرض المخطط الجلسات المسجلة خلال آخر 6 أسابيع فقط، ولا يستنتج تغيرًا عضليًا أو تقدمًا غير موجود في البيانات.','The chart shows logged sessions from the last 6 weeks only; it does not infer muscle changes or progress absent from the data.')}</p>`;
  }

  function renderCurrentPlan(){
    const host=$('#current-plan-content');if(!host)return;
    let plan=null;try{plan=JSON.parse(localStorage.getItem('valhan-builder-v3')||'null');}catch{}
    if(!plan||!Array.isArray(plan.days)||!plan.days.length){host.innerHTML=`<p class="muted">${tr('لم تحفظ خطة في منشئ الخطط بعد. ابدأ بإنشاء خطتك الأولى.','You have not saved a plan in the builder yet. Start by creating your first plan.')}</p>`;return;}
    const days=plan.days.length,training=plan.days.filter(d=>!d.rest),exerciseCount=training.reduce((n,d)=>n+(d.exercises||[]).length,0),sets=training.reduce((n,d)=>n+(d.exercises||[]).reduce((a,e)=>a+(Number(e.sets)||0),0),0);
    host.innerHTML=`<div class="vc-current-plan"><strong>${safe(plan.name||'VALHAN Plan')}</strong><div class="vc-plan-metrics"><span>${days} ${tr('أيام بالخطة','days in plan')}</span><span>${training.length} ${tr('أيام تدريب','training days')}</span><span>${exerciseCount} ${tr('تمارين','exercises')}</span><span>${sets} ${tr('مجموعة عمل','working sets')}</span></div><a class="btn btn-primary" href="workout-builder.html">${tr('تعديل الخطة','Edit plan')}</a></div>`;
  }

  // Superset groups saved in a reusable, exportable structure
  const exOptions=()=>exercises.map(e=>`<option value="${safe(e.id)}">${safe(nameOf(e))}</option>`).join('');
  // Guided exercise session with per-set completion
  $('#guided-exercise').innerHTML = exOptions();
  let guided = null;
  const guidedPaint = () => { if (!guided) return; $('#guided-status').textContent = `${nameOf(exercises.find(x=>x.id===guided.exerciseId)||{id:guided.exerciseId})}: ${guided.done}/${guided.total} ${tr('مجموعات مكتملة','sets completed')}`; $('#guided-complete-set').disabled = guided.done >= guided.total; $('#guided-finish').disabled = guided.done === 0; };
  $('#guided-begin').addEventListener('click',()=>{guided={exerciseId:$('#guided-exercise').value,total:Math.max(1,Math.min(20,Number($('#guided-total').value)||3)),done:0,startedAt:Date.now()};guidedPaint();});
  $('#guided-complete-set').addEventListener('click',()=>{if(!guided||guided.done>=guided.total)return;guided.done++;guidedPaint();if(guided.done===guided.total)toast(tr('اكتملت كل المجموعات المخططة.','All planned sets completed.'));});
  $('#guided-finish').addEventListener('click',()=>{if(!guided)return;const ex=exercises.find(x=>x.id===guided.exerciseId);const item={id:crypto.randomUUID?.()||String(Date.now()),name:nameOf(ex||{id:guided.exerciseId}),date:dateISO(new Date()),duration:Math.max(1,Math.round((Date.now()-guided.startedAt)/60000)),sets:guided.done,notes:tr('جلسة موجهة — ','Guided session — ')+nameOf(ex||{id:guided.exerciseId}),createdAt:Date.now()};const list=sessions();list.push(item);write(KEYS.sessions,list);logActivity('guided-session',item.name);guided=null;$('#guided-status').textContent=tr('تم حفظ الجلسة.','Session saved.');$('#guided-complete-set').disabled=true;$('#guided-finish').disabled=true;renderAll();});

  // Personal notes
  function renderNotes(){const list=read(KEYS.notes,[]);$('#notes-list').innerHTML=list.length?list.map(n=>`<article class="vc-list-item"><div><strong>${safe(n.title)}</strong><p>${safe(n.body)}</p></div><button class="icon-btn" data-note-delete="${safe(n.id)}" aria-label="Delete note"><i class="fa-solid fa-trash"></i></button></article>`).join(''):`<div class="vc-empty">${tr('لا توجد ملاحظات.','No notes yet.')}</div>`;}
  $('#note-form').addEventListener('submit',e=>{e.preventDefault();const list=read(KEYS.notes,[]);list.unshift({id:crypto.randomUUID?.()||String(Date.now()),title:$('#note-title').value.trim(),body:$('#note-body').value.trim(),createdAt:Date.now()});write(KEYS.notes,list);e.target.reset();renderNotes();});
  $('#notes-list').addEventListener('click',e=>{const b=e.target.closest('[data-note-delete]');if(!b)return;write(KEYS.notes,read(KEYS.notes,[]).filter(x=>x.id!==b.dataset.noteDelete));renderNotes();});

  // Exercise comparison and alternatives, with no equivalence claim
  const selectExercises=['#compare-one','#compare-two','#alternative-select'];selectExercises.forEach(s=>$(s).innerHTML=exOptions());
  const muscleText=e=>String(e?.targetMuscle||e?.muscle||e?.legacy?.muscle||e?.muscles?.join(' ')||'');
  const equipText=e=>String(e?.equipment||e?.legacy?.equipment||'');
  const renderCompare=()=>{const a=exercises.find(x=>x.id===$('#compare-one').value),b=exercises.find(x=>x.id===$('#compare-two').value);if(!a||!b)return;const rows=[[tr('العضلة المستهدفة','Target muscle'),muscleText(a),muscleText(b)],[tr('المعدات','Equipment'),equipText(a),equipText(b)],[tr('نمط الحركة','Movement pattern'),a.movementPattern||a.pattern||'—',b.movementPattern||b.pattern||'—'],[tr('المستوى','Difficulty'),a.difficulty||'—',b.difficulty||'—']];$('#compare-result').innerHTML=`<div class="vc-mini-grid">${rows.map(r=>`<div class="vc-mini-card"><h4>${safe(r[0])}</h4><p>${safe(r[1])}</p><p>${safe(r[2])}</p></div>`).join('')}</div>`;};
  $('#compare-run').addEventListener('click',renderCompare);
  function renderAlternatives(){const chosen=exercises.find(x=>x.id===$('#alternative-select').value);if(!chosen)return;const key=muscleText(chosen).toLowerCase(),pattern=(chosen.movementPattern||chosen.pattern||'').toLowerCase();const picks=exercises.filter(x=>x.id!==chosen.id&&((key&&muscleText(x).toLowerCase()===key)||(pattern&&(x.movementPattern||x.pattern||'').toLowerCase()===pattern))).slice(0,6);$('#alternative-result').innerHTML=picks.length?picks.map(x=>`<div class="vc-list-item"><div><strong>${safe(nameOf(x))}</strong><p>${safe(muscleText(x))} · ${safe(equipText(x))}</p></div><span class="vc-pill">${tr('تشابه بيانات','Data overlap')}</span></div>`).join(''):`<div class="vc-empty">${tr('لا توجد اقتراحات كافية في البيانات الحالية.','Not enough matching data for suggestions.')}</div>`;}
  $('#alternative-select').addEventListener('change',renderAlternatives);

  // Equipment explorer
  $('#equipment-select').innerHTML=equipment.map(x=>`<option value="${safe(x.id)}">${safe(nameOf(x))}</option>`).join('');
  function renderEquipment(){const item=equipment.find(x=>x.id===$('#equipment-select').value);if(!item)return;const q=nameOf(item).toLowerCase(),id=item.id;const matches=exercises.filter(x=>equipText(x).toLowerCase().includes(q)||equipText(x).toLowerCase().includes(id.replaceAll('-',' '))||equipText(x).toLowerCase()===id);$('#equipment-result').innerHTML=matches.length?matches.map(x=>`<div class="vc-list-item"><strong>${safe(nameOf(x))}</strong><span class="vc-pill">${safe(muscleText(x))}</span></div>`).join(''):`<div class="vc-empty">${tr('لا توجد تمارين مرتبطة بهذه المعدة في البيانات الحالية.','No exercises are currently mapped to this equipment.')}</div>`;}
  $('#equipment-select').addEventListener('change',renderEquipment);

  // Saved muscles and equipment (separate types, no alteration to existing article keys)
  function fillSavedSelect(){const type=$('#saved-type').value,list=type==='muscle'?muscles:equipment;$('#saved-item').innerHTML=list.map(x=>`<option value="${safe(x.id)}">${safe(nameOf(x))}</option>`).join('');}
  function renderSaved(){const a=read(KEYS.savedMuscles,[]),b=read(KEYS.savedEquipment,[]),items=[...a.map(id=>({id,type:'muscle',item:muscles.find(x=>x.id===id)})),...b.map(id=>({id,type:'equipment',item:equipment.find(x=>x.id===id)}))];$('#saved-list').innerHTML=items.length?items.map(x=>`<div class="vc-list-item"><div><strong>${safe(x.item?nameOf(x.item):x.id)}</strong><p>${x.type}</p></div><button class="icon-btn" data-unsave="${x.type}:${safe(x.id)}" aria-label="Remove"><i class="fa-solid fa-trash"></i></button></div>`).join(''):`<div class="vc-empty">${tr('لا توجد عناصر محفوظة.','No saved items.')}</div>`;}
  $('#saved-type').addEventListener('change',fillSavedSelect);fillSavedSelect();
  $('#save-item').addEventListener('click',()=>{const type=$('#saved-type').value,id=$('#saved-item').value,key=type==='muscle'?KEYS.savedMuscles:KEYS.savedEquipment,list=read(key,[]);if(!list.includes(id))list.push(id);write(key,list);renderSaved();toast(tr('تم الحفظ.','Saved.'));});
  $('#saved-list').addEventListener('click',e=>{const b=e.target.closest('[data-unsave]');if(!b)return;const [type,id]=b.dataset.unsave.split(':'),key=type==='muscle'?KEYS.savedMuscles:KEYS.savedEquipment;write(key,read(key,[]).filter(x=>x!==id));renderSaved();});

  // Bilingual starter glossary and safe educational nutrition notes
  const glossary=[['BMR','معدل الأيض الأساسي','Basal Metabolic Rate','تقدير الطاقة المستخدمة في الراحة.','Estimated energy used at rest.'],['TDEE','إجمالي الإنفاق اليومي','Total Daily Energy Expenditure','تقدير الطاقة المصروفة خلال اليوم كله.','Estimated total energy used throughout a day.'],['Progressive Overload','التحميل التدريجي','Progressive Overload','زيادة التحدي تدريجيًا بطريقة قابلة للاستشفاء.','Gradually increasing training challenge while allowing recovery.'],['Range of Motion','مدى الحركة','Range of Motion','المسافة التي يتحرك خلالها المفصل أثناء التمرين.','The movement distance a joint travels during an exercise.'],['RPE','مقياس الجهد المدرك','Rate of Perceived Exertion','تقييم شخصي لصعوبة الجهد.','A subjective rating of effort difficulty.'],['DOMS','ألم العضلات المتأخر','Delayed Onset Muscle Soreness','إحساس بالتيبس أو الانزعاج قد يظهر بعد تمرين غير معتاد.','Soreness that may occur after unfamiliar exercise.'],['Superset','سوبر سيت','Superset','أداء تمرينين متتاليين وفق تصميم الجلسة.','Two exercises performed consecutively as programmed.'],['Recovery','الاستشفاء','Recovery','العمليات التي تساعد الجسم على التعافي بين الجلسات.','Processes that help the body recover between sessions.']];
  function renderGlossary(){const q=$('#glossary-search').value.toLowerCase();$('#glossary-list').innerHTML=glossary.filter(x=>x.join(' ').toLowerCase().includes(q)).map(x=>`<div class="vc-list-item"><div><strong>${x[0]} · ${ar()?x[1]:x[2]}</strong><p>${ar()?x[3]:x[4]}</p></div></div>`).join('')||`<div class="vc-empty">${tr('لا توجد نتائج.','No results.')}</div>`;}
  $('#glossary-search').addEventListener('input',renderGlossary);renderGlossary();
  const nutrition=[['Balanced eating','التغذية المتوازنة','A varied pattern can include vegetables, fruits, grains, protein foods, dairy or fortified alternatives, and adequate fluids. Individual needs vary.','النمط المتوازن قد يشمل الخضراوات والفواكه والحبوب ومصادر البروتين ومنتجات الألبان أو بدائلها والسوائل الكافية. الاحتياجات تختلف بين الأشخاص.'],['Protein','البروتين','Protein supports tissue maintenance and repair. Food sources include beans, lentils, eggs, dairy, fish, and meat.','يساهم البروتين في صيانة الأنسجة وإصلاحها. من مصادره البقول والبيض ومنتجات الألبان والأسماك واللحوم.'],['Hydration','الترطيب','Drink regularly throughout the day; needs rise with heat, activity, and individual circumstances.','احرص على شرب السوائل بانتظام خلال اليوم؛ وقد تزيد الحاجة مع الحرارة والنشاط والظروف الفردية.'],['Recovery','الاستشفاء','Sleep, rest days, sufficient food, and manageable training loads all support recovery.','النوم وأيام الراحة والغذاء الكافي وتنظيم الحمل التدريبي عوامل تساعد على الاستشفاء.']];
  $('#nutrition-content').innerHTML=nutrition.map(x=>`<details><summary>${ar()?x[1]:x[0]}</summary><p>${ar()?x[3]:x[2]}</p></details>`).join('')+`<p class="vc-help muted">${tr('محتوى تثقيفي عام يحتاج مراجعة المدرب قبل اعتباره إرشادًا متخصصًا.','General educational content; coach review is needed before treating it as specialized guidance.')}</p>`;

  // Adult-only Mifflin–St Jeor estimate. Under-18 users receive education only.
  $('#energy-form').addEventListener('submit',e=>{e.preventDefault();const age=Number($('#energy-age').value),weight=Number($('#energy-weight').value),height=Number($('#energy-height').value),activity=Number($('#energy-activity').value),sex=$('#energy-sex').value,result=$('#energy-result');if(age<18){result.hidden=false;result.textContent=tr('الحاسبة الشخصية متاحة للبالغين 18 عامًا فأكثر فقط. استخدم الشرح التعليمي بالأعلى.','Personal estimates are available only to adults aged 18+. Please use the educational explanation above.');return;}if(!Number.isFinite(age)||!Number.isFinite(weight)||!Number.isFinite(height)||age>100||weight<30||weight>300||height<120||height>230){result.hidden=false;result.textContent=tr('راجع القيم المدخلة.','Please check the entered values.');return;}const bmr=10*weight+6.25*height-5*age+(sex==='male'?5:-161),tdee=bmr*activity;result.hidden=false;result.innerHTML=`<strong>${tr('تقدير للبالغين فقط','Adult estimate only')}</strong><div class="vc-stat-row"><span>BMR</span><strong>${Math.round(bmr)} kcal/day</strong></div><div class="vc-stat-row"><span>TDEE</span><strong>${Math.round(tdee)} kcal/day</strong></div><p class="vc-help">${tr('هذه تقديرات تقريبية وليست وصفة أو هدفًا غذائيًا.','These are rough estimates, not a prescription or dietary target.')}</p>`;});

  // Versioned backup: allow-list only, validated, non-destructive merge
  const BACKUP_KEYS=['valhan-lang','valhan-theme','valhan-builder-v3','valhan-builder-import','valhan-builder-backup','valhan-saved-articles-v1','valhan-saved-exercises-v1','valhan-saved-muscles-v1','valhan-saved-equipment-v1','valhan-reading-progress-v1',...Object.values(KEYS)];
  function backupData(){const data={};[...new Set(BACKUP_KEYS)].forEach(k=>{const raw=localStorage.getItem(k);if(raw!==null)data[k]=raw;});return {app:'VALHAN MUSCLES',schemaVersion:1,exportedAt:new Date().toISOString(),data};}
  $('#backup-export').addEventListener('click',()=>download('valhan-backup-'+dateISO(new Date())+'.json','application/json',JSON.stringify(backupData(),null,2)));
  $('#backup-import').addEventListener('change',async e=>{const file=e.target.files?.[0];if(!file)return;try{if(file.size>5*1024*1024)throw new Error('File too large (5 MB max)');const payload=JSON.parse(await file.text());if(payload.app!=='VALHAN MUSCLES'||payload.schemaVersion!==1||!payload.data||typeof payload.data!=='object'||Array.isArray(payload.data))throw new Error('Unsupported backup format');let merged=0;for(const [key,raw] of Object.entries(payload.data)){if(!BACKUP_KEYS.includes(key)||typeof raw!=='string')continue;let incoming;try{incoming=JSON.parse(raw);}catch{continue;}if(key=== 'valhan-lang'||key==='valhan-theme'){if(localStorage.getItem(key)===null){localStorage.setItem(key,raw);merged++;}continue;}const currentRaw=localStorage.getItem(key);if(currentRaw===null){localStorage.setItem(key,raw);merged++;continue;}let current;try{current=JSON.parse(currentRaw);}catch{continue;}if(Array.isArray(current)&&Array.isArray(incoming)){const map=new Map(current.map(x=>[x?.id??JSON.stringify(x),x]));incoming.forEach(x=>map.set(x?.id??JSON.stringify(x),x));localStorage.setItem(key,JSON.stringify([...map.values()]));merged++;}else if(current&&incoming&&typeof current==='object'&&typeof incoming==='object'&&!Array.isArray(current)&&!Array.isArray(incoming)){localStorage.setItem(key,JSON.stringify({...incoming,...current}));merged++;}}$('#backup-status').textContent=tr(`تم دمج ${merged} عنصر/مفتاح. أُعيد تحميل الصفحة لتحديث الواجهة.`,`Merged ${merged} key(s). Reloading to refresh the interface.`);setTimeout(()=>location.reload(),900);}catch(err){$('#backup-status').textContent=tr('تعذر استيراد الملف: ','Import failed: ')+err.message;}finally{e.target.value='';}});

  // Shareable SVG workout card (text-only, no external image dependency)
  $('#share-card').addEventListener('click',()=>{const list=sessions().slice().sort((a,b)=>b.date.localeCompare(a.date)).slice(0,4);const lines=list.length?list.map((x,i)=>`<text x="600" y="${310+i*62}" text-anchor="middle" fill="#e9e9ec" font-size="27">${safe(x.name)} · ${safe(x.date)}</text>`).join(''):`<text x="600" y="330" text-anchor="middle" fill="#aaa" font-size="25">${tr('ابدأ بتسجيل أول جلسة تدريب','Log your first workout')}</text>`;const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675"><defs><linearGradient id="g"><stop stop-color="#171719"/><stop offset="1" stop-color="#351111"/></linearGradient></defs><rect width="1200" height="675" rx="36" fill="url(#g)"/><text x="600" y="135" text-anchor="middle" fill="#ff5149" font-family="Arial" font-size="30" font-weight="700">VALHAN MUSCLES</text><text x="600" y="220" text-anchor="middle" fill="white" font-family="Arial" font-size="54" font-weight="700">${tr('رحلة التدريب','TRAINING JOURNEY')}</text>${lines}<text x="600" y="610" text-anchor="middle" fill="#aaa" font-family="Arial" font-size="20">Build Your Strength. Master Your Fitness.</text></svg>`;download('valhan-training-card.svg','image/svg+xml',svg);});
  function download(name,type,content){const blob=new Blob([content],{type}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  function renderAll(){renderKPIs();renderHistory();renderCalendar();renderDayDetail();renderProgress();renderCurrentPlan();renderActivity();renderNotes();renderSaved();}
  renderAll();renderEquipment();renderAlternatives();
  logActivity('visit','Training Dashboard');
})();
