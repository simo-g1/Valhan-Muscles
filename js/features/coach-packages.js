(() => {
  'use strict';
  if (document.body.dataset.page !== 'coach') return;

  const C = window.ValhanCoach;
  if (!C) return;

  const lang = () => window.ValhanLang?.() || 'ar';
  const t = (ar, en) => (lang() === 'ar' ? ar : en);
  const fill = (tpl, vars) => tpl.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');
  const num = n => new Intl.NumberFormat(lang() === 'ar' ? 'en-US' : 'en-US').format(n);

  // 01044967064 -> 201044967064 (digits only, no "+" or leading 0)
  const normalizePhone = raw => {
    let d = String(raw).replace(/\D/g, '');
    if (d.startsWith('00')) d = d.slice(2);
    if (d.startsWith('0')) d = C.whatsapp.countryCode + d.slice(1);
    return d;
  };

  const waLink = message =>
    `https://wa.me/${normalizePhone(C.whatsapp.local)}?text=${encodeURIComponent(message)}`;

  const generalMessage = () => fill(C.messages.general, { name: C.nameAr });
  const packageMessage = p => fill(C.messages.package, {
    name: C.nameAr,
    duration: p.durationAr,
    price: p.price
  });

  const iconLink = (type, extraClass = '') => {
    const isWa = type === 'whatsapp';
    const href = isWa ? waLink(generalMessage()) : C.instagram.url;
    const icon = isWa ? 'fa-brands fa-whatsapp' : 'fa-brands fa-instagram';
    const label = isWa ? t('تواصل عبر واتساب', 'Contact on WhatsApp') : t('تابعنا على إنستجرام', 'Follow on Instagram');
    return `<a class="cp-btn cp-btn-${type} ${extraClass}" href="${href}" target="_blank" rel="noopener noreferrer">
      <i class="${icon}" aria-hidden="true"></i><span>${label}</span></a>`;
  };

  const featureList = () => C.features.map(f => `
    <li class="${f.included ? 'is-on' : 'is-off'}">
      <i class="fa-solid ${f.included ? 'fa-check' : 'fa-xmark'}" aria-hidden="true"></i>
      <span>${t(f.ar, f.en)}<span class="sr-only"> — ${f.included ? t('متضمن', 'included') : t('غير متضمن', 'not included')}</span></span>
    </li>`).join('');

  const packageCard = p => `
    <article class="cp-card reveal ${p.badge ? 'is-featured' : ''}" data-package="${p.id}">
      ${p.badge ? `<span class="cp-badge"><i class="fa-solid fa-star" aria-hidden="true"></i> ${p.badge}</span>` : ''}
      <h3 class="cp-duration">${t(p.durationAr, p.durationEn)}</h3>
      <div class="cp-price"><strong>${num(p.price)}</strong><span>${C.currency.en}</span></div>
      <div class="cp-old" aria-label="${t('السعر قبل الخصم', 'Original price')}"><s>${num(p.oldPrice)} ${C.currency.en}</s></div>
      <ul class="cp-features">${featureList()}</ul>
      <a class="cp-btn cp-btn-whatsapp cp-btn-block" href="${waLink(packageMessage(p))}" target="_blank" rel="noopener noreferrer"
         aria-label="${t('اشترك في باقة', 'Subscribe to')} ${t(p.durationAr, p.durationEn)} ${t('عبر واتساب', 'via WhatsApp')}">
        <i class="fa-brands fa-whatsapp" aria-hidden="true"></i><span>${t('اشترك في هذه الباقة', 'Choose this plan')}</span>
      </a>
    </article>`;

  // 1) Contact buttons near the intro
  const top = document.getElementById('coach-contact-top');
  if (top) {
    top.innerHTML = `<span class="eyebrow cp-eyebrow"><i class="fa-solid fa-link" aria-hidden="true"></i> ${t('تواصل مباشر', 'Direct contact')}</span>
      <div class="cp-actions">${iconLink('whatsapp')}${iconLink('instagram')}</div>`;
  }

  // 2) Packages + 3) contact block right below them
  const host = document.getElementById('coach-packages-root');
  if (host) {
    host.innerHTML = `
      <div class="section-head">
        <span class="eyebrow">ONLINE COACHING</span>
        <h2 class="section-title">${t('باقات التدريب الأونلاين', 'Online Coaching Packages')}</h2>
        <p class="muted">${t('قارن بين الباقات واختار الأنسب ليك.', 'Compare the plans and pick the one that fits you.')}</p>
      </div>
      <div class="cp-grid">${C.packages.map(packageCard).join('')}</div>
      <div class="cp-cta reveal">
        <h3>${t('جاهز تبدأ رحلتك؟', 'Ready to start your journey?')}</h3>
        <p>${t('اختار الباقة المناسبة ليك وتواصل مع الكابتن محمد حاتم لمعرفة تفاصيل الاشتراك.', 'Pick the right plan and contact Coach Mohamed Hatem for subscription details.')}</p>
        <div class="cp-actions cp-actions-center">
          <a class="cp-btn cp-btn-whatsapp cp-btn-lg" href="${waLink(generalMessage())}" target="_blank" rel="noopener noreferrer">
            <i class="fa-brands fa-whatsapp" aria-hidden="true"></i><span>${t('اشترك عبر واتساب', 'Subscribe on WhatsApp')}</span></a>
          <a class="cp-btn cp-btn-instagram cp-btn-lg" href="${C.instagram.url}" target="_blank" rel="noopener noreferrer">
            <i class="fa-brands fa-instagram" aria-hidden="true"></i><span>${t('تابعنا على إنستجرام', 'Follow on Instagram')}</span></a>
        </div>
      </div>
      <ul class="cp-trust">${C.trust.map(x => `<li><i class="fa-solid ${x.icon}" aria-hidden="true"></i> ${t(x.ar, x.en)}</li>`).join('')}</ul>`;
  }

  // Existing hardcoded Instagram links in coach.html now read from the config
  document.querySelectorAll('[data-coach-link="instagram"]').forEach(a => { a.href = C.instagram.url; });
  document.querySelectorAll('[data-coach-link="whatsapp"]').forEach(a => { a.href = waLink(generalMessage()); });

  window.ValhanReveal?.();
})();
