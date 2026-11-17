(() => {
  'use strict';

  const page = document.body.dataset.page;
  const root = document.body.dataset.root || '.';
  const t = window.ValhanT;
  const plans = window.ValhanPlans || [];

  // Handle Plans Page Interactions
  if (page === 'plans') {
    const grid = document.getElementById('plans-grid');
    const planModal = document.getElementById('plan-modal');

    const filter = () => {
      const d = document.getElementById('plan-days').value;
      const l = document.getElementById('plan-level').value;
      const q = document.getElementById('plan-search').value.toLowerCase();
      grid.querySelectorAll('.plan-card').forEach((c, i) => {
        const p = plans[i];
        const matchDays = d === 'all' || p.days === +d;
        const matchLevel = l === 'all' || p.level === l;
        const matchQuery = p.name.toLowerCase().includes(q) || (p.arabicName && p.arabicName.toLowerCase().includes(q));
        c.hidden = !(matchDays && matchLevel && matchQuery);
      });
    };

    ['plan-days', 'plan-level', 'plan-search'].forEach(id => {
      document.getElementById(id)?.addEventListener('input', filter);
    });

    grid?.addEventListener('click', e => {
      const b = e.target.closest('[data-plan]');
      if (!b) return;
      const p = plans.find(x => x.id === b.dataset.plan);
      if (!p) return;

      const scheduleHtml = p.schedule.map((dayObj, i) => `
        <div class="pdf-modal-day">
          <div class="pdf-modal-day-head">
            <span>${t('اليوم', 'Day')} ${i + 1}: ${dayObj.day}</span>
            <span style="font-size:.8rem; opacity:.85;">${dayObj.exercises.length ? dayObj.exercises.length + ' ' + t('تمارين', 'exercises') : t('راحة', 'Rest')}</span>
          </div>
          ${dayObj.exercises.length ? `
            <table>
              <thead>
                <tr style="background:var(--card); font-size:.8rem; color:var(--muted);">
                  <th style="padding:6px 16px; text-align:start;">${t('التمرين', 'Exercise')}</th>
                  <th style="padding:6px 16px; text-align:end;">${t('عدد المجاميع', 'Sets')}</th>
                </tr>
              </thead>
              <tbody>
                ${dayObj.exercises.map(ex => `
                  <tr>
                    <td><strong>${ex[0]}</strong> <span style="color:var(--muted); font-size:.8rem;">(${ex[1]})</span></td>
                    <td style="text-align:end;"><span class="tag">${ex[2]}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          ` : `
            <div style="padding:14px 16px; color:var(--muted); font-size:.9rem;">${t('يوم راحة مخصص للاستشفاء العضلي والجهاز العصبي.', 'Scheduled rest day for muscle and nervous system recovery.')}</div>
          `}
        </div>
      `).join('');

      document.getElementById('plan-detail').innerHTML = `
        <span class="eyebrow" style="color:var(--red2);"><i class="fa-solid fa-calendar-check"></i> ${p.days} ${t('أيام تدريب أسبوعياً', 'TRAINING DAYS')}</span>
        <h2 style="margin: 8px 0 12px;">${t(p.arabicName, p.name)}</h2>
        <p class="muted" style="margin-bottom: 20px;">${t(p.desc, p.descEn || p.desc)}</p>
        <h3 style="margin: 18px 0 12px; font-size:1.15rem; border-inline-start:3px solid #1a56db; padding-inline-start:10px;">
          ${t('تفاصيل جدول الحصص الأسبوعية (من الدليل الشامل المعتمد)', 'Weekly Session Breakdown (From Certified Reference Guide)')}
        </h3>
        <div>${scheduleHtml}</div>
        <div style="margin-top:24px; display:flex; gap:12px; flex-wrap:wrap;">
          <button type="button" class="btn btn-primary" data-use-plan="${p.id}">
            <i class="fa-solid fa-wrench"></i> ${t('أنشئ خطتك من هذه الخطة', 'Create your plan from this one')}
          </button>
          <button type="button" class="btn btn-quiet" data-pdf="${p.id}">
            <i class="fa-solid fa-file-pdf"></i> ${t('تحميل PDF', 'Download PDF')}
          </button>
        </div>`;

      planModal?.classList.add('open');
    });

    // PDF download + hand-off to the builder (works from cards and from the modal)
    document.addEventListener('click', e => {
      const pdf = e.target.closest('[data-pdf]');
      if (pdf) {
        const p = plans.find(x => x.id === pdf.dataset.pdf);
        if (p) window.ValhanPDF?.(window.ValhanPlanToBuilder(p));
        return;
      }
      const use = e.target.closest('[data-use-plan]');
      if (use) {
        const p = plans.find(x => x.id === use.dataset.usePlan);
        if (!p) return;
        if (!window.ValhanStore.set('valhan-builder-import', window.ValhanPlanToBuilder(p))) {
          return window.ValhanToast?.(t('تعذر نقل الخطة (التخزين غير متاح).', 'Could not transfer the plan (storage unavailable).'));
        }
        location.href = `${root}/pages/workout-builder.html`;
      }
    });

    document.querySelector('[data-close]')?.addEventListener('click', () => planModal?.classList.remove('open'));
    planModal?.addEventListener('click', e => { if (e.target === planModal) planModal.classList.remove('open'); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') planModal?.classList.remove('open'); });
  }


  window.ValhanReveal = () => {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal').forEach(element => element.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    document.querySelectorAll('.reveal:not(.is-visible)').forEach(element => observer.observe(element));
  };

  window.ValhanReveal();
})();
