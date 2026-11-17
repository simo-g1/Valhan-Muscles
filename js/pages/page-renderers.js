(() => {
  'use strict';
  if (document.body.dataset.page !== 'plans') return;

  const plans = window.ValhanPlans || [];
  const t = window.ValhanT;
  const grid = document.getElementById('plans-grid');
  if (!grid) return;

  grid.innerHTML = plans.map(plan => `
    <article class="card plan-card reveal">
      <span class="tag">${plan.level}</span>
      <h3>${t(plan.arabicName, plan.name)}</h3>
      <p>${t(plan.desc, plan.descEn || plan.desc)}</p>
      <div class="plan-meta">
        <span><i class="fa-solid fa-calendar-days" aria-hidden="true"></i> ${plan.days} ${t('أيام / أسبوع', 'days / week')}</span>
        <span><i class="fa-solid fa-dumbbell" aria-hidden="true"></i> ${plan.split}</span>
      </div>
      <div class="plan-actions">
        <button type="button" class="btn btn-outline" data-plan="${plan.id}">
          <i class="fa-solid fa-list-check" aria-hidden="true"></i> ${t('عرض تفاصيل وجدول الحصص', 'View weekly schedule')}
        </button>
        <button type="button" class="btn btn-quiet" data-pdf="${plan.id}" aria-label="PDF — ${t(plan.arabicName, plan.name)}">
          <i class="fa-solid fa-file-pdf" aria-hidden="true"></i> PDF
        </button>
      </div>
    </article>`).join('');
  window.ValhanReveal?.();
})();
