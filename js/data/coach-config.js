(() => {
  'use strict';

  // Single source of truth for all coach contact + pricing data.
  // Values below were read from the advertisement image unless marked otherwise.
  window.ValhanCoach = {
    nameAr: 'محمد حاتم',
    nameEn: 'Mohamed Hatem',

    whatsapp: {
      local: '01044967064',   // as printed in the ad (CALL / WHATSAPP)
      countryCode: '20'       // Egypt, used to build the international number
    },

    // NOT visible in the ad image. Taken from the existing coach.html link.
    // Replace here if the owner wants a different account.
    instagram: {
      username: '_mohameddhatem1',
      url: 'https://www.instagram.com/_mohameddhatem1'
    },

    currency: { ar: 'جنيه', en: 'EGP' },

    messages: {
      general: 'السلام عليكم كابتن {name}، أنا مهتم بالاشتراك في باقات التدريب أونلاين. ممكن أعرف تفاصيل الاشتراك؟',
      package: 'السلام عليكم كابتن {name}، أنا مهتم بالاشتراك في باقة {duration} بسعر {price} جنيه. ممكن أعرف تفاصيل الاشتراك؟'
    },

    // Same feature list for all four packages (matches the ad).
    features: [
      { ar: 'جدول تمرين مخصص حسب نقاط الضعف وأجهزة الجيم المتوفرة عندك', en: 'Custom training plan based on your weak points and available gym equipment', included: true },
      { ar: 'جدول تغذية مخصص حسب تفضيلاتك', en: 'Custom nutrition plan based on your preferences', included: true }, // ad text partly unclear
      { ar: 'متابعات على مدار التمارين', en: 'Ongoing follow-ups throughout training', included: true },
      { ar: 'مراجعة أداء التمارين وتصحيح الأخطاء وتحسين شدة التمرين', en: 'Form review, mistake correction and intensity tuning', included: true },
      { ar: 'متابعة أسبوعية', en: 'Weekly follow-up', included: true },
      { ar: 'فيديو كول لمراجعة البوزينج أو الاستشارات', en: 'Video call for posing review or consultations', included: false },
      { ar: 'مكالمات هاتفية', en: 'Phone calls', included: true }
    ],

    packages: [
      { id: 'm1',  durationAr: 'شهر',   durationEn: '1 Month',  label: '1 MONTH',  price: 150, oldPrice: 250 },
      { id: 'm3',  durationAr: '3 شهور', durationEn: '3 Months', label: '3 MONTHS', price: 250, oldPrice: 400 },
      { id: 'm6',  durationAr: '6 شهور', durationEn: '6 Months', label: '6 MONTHS', price: 450, oldPrice: 750 },
      // Which card carries "BEST VALUE" is not clear in the ad; kept configurable.
      { id: 'y1',  durationAr: 'سنة',   durationEn: '1 Year',   label: '1 YEAR',   price: 800, oldPrice: 1400, badge: 'BEST VALUE' }
    ],

    trust: [
      { ar: 'تدريب بجودة عالية', en: 'Quality coaching', icon: 'fa-shield-halved' },
      { ar: 'نتائج حقيقية', en: 'Real results', icon: 'fa-trophy' },
      { ar: 'لفترة محدودة', en: 'Limited time only', icon: 'fa-stopwatch' }
    ]
  };
})();
