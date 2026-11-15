(() => {
  'use strict';
  const root = document.body.dataset.root || '.';
  const page = document.body.dataset.page;
  const t = window.ValhanT;

  const head = (ey, title, desc) => `
    <section class="page-hero">
      <div class="container">
        <span class="eyebrow">${ey}</span>
        <h1>${title}</h1>
        <p>${desc}</p>
      </div>
    </section>`;

  const btn = (txt, url, outline = false) => `
    <a class="btn ${outline ? 'btn-outline' : 'btn-primary'}" href="${url}">${txt} ←</a>`;

  // Approved unified weekly volume summary from reference-workout.pdf (Page 1)
  const unifiedVolume = [
    { exercise: 'Incline Chest', arabic: 'صدر عالي', sets: 4, category: 'Chest' },
    { exercise: 'Fly Machine', arabic: 'تفتيح صدر', sets: 6, category: 'Chest' },
    { exercise: 'Lateral Raises', arabic: 'كتف جانبي', sets: 6, category: 'Shoulders' },
    { exercise: 'Front Delts', arabic: 'كتف أمامي', sets: 4, category: 'Shoulders' },
    { exercise: 'Triceps', arabic: 'ترايسبس', sets: 8, category: 'Arms' },
    { exercise: 'Lat Pulldown', arabic: 'سحب علوي واسع', sets: 6, category: 'Back' },
    { exercise: 'T-Bar Row', arabic: 'سحب أرضي / تي بار', sets: 6, category: 'Back' },
    { exercise: 'Close-Grip Pulldown', arabic: 'سحب علوي ضيق', sets: 4, category: 'Back' },
    { exercise: 'Rear Delts', arabic: 'كتف خلفي', sets: 4, category: 'Shoulders' },
    { exercise: 'Traps', arabic: 'ترابيس', sets: 4, category: 'Back' },
    { exercise: 'Biceps', arabic: 'بايسبس', sets: 6, category: 'Arms' },
    { exercise: 'Lower Back', arabic: 'أسفل الظهر', sets: 4, category: 'Back' },
    { exercise: 'Leg Press', arabic: 'دفع رجل', sets: 4, category: 'Legs' },
    { exercise: 'Leg Extension', arabic: 'أماميات رجل', sets: 6, category: 'Legs' },
    { exercise: 'Leg Curl', arabic: 'خلفيات رجل - عزل', sets: 4, category: 'Legs' },
    { exercise: 'RDL', arabic: 'خلفيات رجل - إطالة', sets: 4, category: 'Legs' },
    { exercise: 'Adductors', arabic: 'ضامة', sets: 6, category: 'Legs' },
    { exercise: 'Calves', arabic: 'سمانة', sets: 4, category: 'Calves' }
  ];

  // Comprehensive 7 Workout Systems directly from reference-workout.pdf + PPL 5 Days
  const plans = [
    {
      id: 'ul4',
      name: 'Upper / Lower — 4 Days',
      arabicName: 'جدول علوي / سفلي - 4 أيام',
      level: 'Intermediate',
      days: 4,
      desc: 'توزيع الحجم المعتمد على 4 أيام: يومين علوي ويومين سفلي مع فترات راحة كافية للاستشفاء.',
      descEn: 'Unified volume across 4 days: 2 Upper and 2 Lower sessions with balanced recovery.',
      split: 'Upper / Lower',
      schedule: [
        {
          day: 'Upper A',
          exercises: [
            ['Incline Chest', 'صدر عالي', '2 مجموعات'],
            ['Fly Machine', 'تفتيح صدر', '3 مجاميع'],
            ['Lat Pulldown', 'سحب علوي واسع', '3 مجاميع'],
            ['T-Bar Row', 'سحب أرضي / تي بار', '3 مجاميع'],
            ['Close-Grip Pulldown', 'سحب علوي ضيق', '2 مجموعات'],
            ['Lateral Raises', 'كتف جانبي', '3 مجاميع'],
            ['Front Delts', 'كتف أمامي', '2 مجموعات'],
            ['Rear Delts', 'كتف خلفي', '2 مجموعات'],
            ['Traps', 'ترابيس', '2 مجموعات'],
            ['Triceps', 'ترايسبس', '4 مجاميع'],
            ['Biceps', 'بايسبس', '3 مجاميع']
          ]
        },
        {
          day: 'Lower A',
          exercises: [
            ['Leg Press', 'دفع رجل', '2 مجموعات'],
            ['Leg Extension', 'أماميات رجل', '3 مجاميع'],
            ['RDL', 'خلفيات رجل - إطالة', '2 مجموعات'],
            ['Leg Curl', 'خلفيات رجل - عزل', '2 مجموعات'],
            ['Adductors', 'ضامة', '3 مجاميع'],
            ['Calves', 'سمانة', '2 مجموعات'],
            ['Lower Back', 'أسفل الظهر', '2 مجموعات']
          ]
        },
        { day: 'Rest', exercises: [] },
        {
          day: 'Upper B',
          exercises: [
            ['Incline Chest', 'صدر عالي', '2 مجموعات'],
            ['Fly Machine', 'تفتيح صدر', '3 مجاميع'],
            ['Lat Pulldown', 'سحب علوي واسع', '3 مجاميع'],
            ['T-Bar Row', 'سحب أرضي / تي بار', '3 مجاميع'],
            ['Close-Grip Pulldown', 'سحب علوي ضيق', '2 مجموعات'],
            ['Lateral Raises', 'كتف جانبي', '3 مجاميع'],
            ['Front Delts', 'كتف أمامي', '2 مجموعات'],
            ['Rear Delts', 'كتف خلفي', '2 مجموعات'],
            ['Traps', 'ترابيس', '2 مجموعات'],
            ['Triceps', 'ترايسبس', '4 مجاميع'],
            ['Biceps', 'بايسبس', '3 مجاميع']
          ]
        },
        {
          day: 'Lower B',
          exercises: [
            ['Leg Press', 'دفع رجل', '2 مجموعات'],
            ['Leg Extension', 'أماميات رجل', '3 مجاميع'],
            ['RDL', 'خلفيات رجل - إطالة', '2 مجموعات'],
            ['Leg Curl', 'خلفيات رجل - عزل', '2 مجموعات'],
            ['Adductors', 'ضامة', '3 مجاميع'],
            ['Calves', 'سمانة', '2 مجموعات'],
            ['Lower Back', 'أسفل الظهر', '2 مجموعات']
          ]
        },
        { day: 'Rest', exercises: [] },
        { day: 'Rest', exercises: [] }
      ]
    },
    {
      id: 'ul5',
      name: 'Upper / Lower — 5 Days',
      arabicName: 'جدول علوي / سفلي - 5 أيام',
      level: 'Intermediate',
      days: 5,
      desc: 'لتقليل طول حصة العلوي وتوزيع الضغط، يتم تقسيم الحجم على 3 أيام علوي ويومين سفلي.',
      descEn: 'Splits upper volume into 3 focused days and 2 lower days to reduce session fatigue.',
      split: 'Upper / Lower',
      schedule: [
        {
          day: 'Upper 1 (تركيز صدر وظهر)',
          exercises: [
            ['Incline Chest', 'صدر عالي', '2 مجموعات'],
            ['Fly Machine', 'تفتيح صدر', '3 مجاميع'],
            ['Lat Pulldown', 'سحب علوي واسع', '3 مجاميع'],
            ['T-Bar Row', 'تي بار', '3 مجاميع'],
            ['Lateral Raises', 'كتف جانبي', '3 مجاميع'],
            ['Triceps', 'ترايسبس', '4 مجاميع']
          ]
        },
        {
          day: 'Lower 1',
          exercises: [
            ['Leg Press', 'دفع رجل', '2 مجموعات'],
            ['Leg Extension', 'أماميات رجل', '3 مجاميع'],
            ['RDL', 'خلفيات رجل - إطالة', '2 مجموعات'],
            ['Leg Curl', 'خلفيات رجل - عزل', '2 مجموعات'],
            ['Adductors', 'ضامة', '3 مجاميع'],
            ['Calves', 'سمانة', '2 مجموعات'],
            ['Lower Back', 'أسفل الظهر', '2 مجموعات']
          ]
        },
        {
          day: 'Upper 2 (تركيز ظهر وأكتاف وذراع)',
          exercises: [
            ['Lat Pulldown', 'سحب علوي واسع', '3 مجاميع'],
            ['Close-Grip Pulldown', 'سحب علوي ضيق', '2 مجموعات'],
            ['Front Delts', 'كتف أمامي', '2 مجموعات'],
            ['Rear Delts', 'كتف خلفي', '2 مجموعات'],
            ['Traps', 'ترابيس', '2 مجموعات'],
            ['Biceps', 'بايسبس', '3 مجاميع'],
            ['Triceps', 'ترايسبس', '4 مجاميع']
          ]
        },
        {
          day: 'Lower 2',
          exercises: [
            ['Leg Press', 'دفع رجل', '2 مجموعات'],
            ['Leg Extension', 'أماميات رجل', '3 مجاميع'],
            ['RDL', 'خلفيات رجل - إطالة', '2 مجموعات'],
            ['Leg Curl', 'خلفيات رجل - عزل', '2 مجموعات'],
            ['Adductors', 'ضامة', '3 مجاميع'],
            ['Calves', 'سمانة', '2 مجموعات'],
            ['Lower Back', 'أسفل الظهر', '2 مجموعات']
          ]
        },
        {
          day: 'Upper 3 (تكميلي)',
          exercises: [
            ['Incline Chest', 'صدر عالي', '2 مجموعات'],
            ['Fly Machine', 'تفتيح صدر', '3 مجاميع'],
            ['T-Bar Row', 'تي بار', '3 مجاميع'],
            ['Close-Grip Pulldown', 'سحب علوي ضيق', '2 مجموعات'],
            ['Lateral Raises', 'كتف جانبي', '3 مجاميع'],
            ['Front Delts', 'كتف أمامي', '2 مجموعات'],
            ['Rear Delts', 'كتف خلفي', '2 مجموعات'],
            ['Traps', 'ترابيس', '2 مجموعات'],
            ['Biceps', 'بايسبس', '3 مجاميع']
          ]
        }
      ]
    },
    {
      id: 'ulppl',
      name: 'Push / Pull / Legs + Upper / Lower — 5 Days',
      arabicName: 'جدول دفع / سحب / أرجل + علوي / سفلي - 5 أيام',
      level: 'Intermediate',
      days: 5,
      desc: 'توزيع هجين يجمع بين مرونة PPL في النصف الأول وقوة Upper/Lower في النصف الثاني.',
      descEn: 'Hybrid split combining push, pull, legs with an upper and lower finish.',
      split: 'PPL + Upper/Lower',
      schedule: [
        {
          day: 'Push (دفع)',
          exercises: [
            ['Incline Chest', 'صدر عالي', '2 مجموعات'],
            ['Fly Machine', 'تفتيح صدر', '3 مجاميع'],
            ['Front Delts', 'كتف أمامي', '2 مجموعات'],
            ['Lateral Raises', 'كتف جانبي', '3 مجاميع'],
            ['Triceps', 'ترايسبس', '4 مجاميع']
          ]
        },
        {
          day: 'Pull (سحب)',
          exercises: [
            ['Lat Pulldown', 'سحب علوي واسع', '3 مجاميع'],
            ['T-Bar Row', 'تي بار', '3 مجاميع'],
            ['Close-Grip Pulldown', 'سحب علوي ضيق', '2 مجموعات'],
            ['Rear Delts', 'كتف خلفي', '2 مجموعات'],
            ['Traps', 'ترابيس', '2 مجموعات'],
            ['Biceps', 'بايسبس', '3 مجاميع'],
            ['Lower Back', 'أسفل الظهر', '2 مجموعات']
          ]
        },
        {
          day: 'Legs (أرجل)',
          exercises: [
            ['Leg Press', 'دفع رجل', '2 مجموعات'],
            ['Leg Extension', 'أماميات رجل', '3 مجاميع'],
            ['RDL', 'خلفيات رجل - إطالة', '2 مجموعات'],
            ['Leg Curl', 'خلفيات رجل - عزل', '2 مجموعات'],
            ['Adductors', 'ضامة', '3 مجاميع'],
            ['Calves', 'سمانة', '2 مجموعات']
          ]
        },
        {
          day: 'Upper (علوي)',
          exercises: [
            ['Incline Chest', 'صدر عالي', '2 مجموعات'],
            ['Fly Machine', 'تفتيح صدر', '3 مجاميع'],
            ['Lat Pulldown', 'سحب علوي واسع', '3 مجاميع'],
            ['T-Bar Row', 'تي بار', '3 مجاميع'],
            ['Close-Grip Pulldown', 'سحب علوي ضيق', '2 مجموعات'],
            ['Front Delts', 'كتف أمامي', '2 مجموعات'],
            ['Lateral Raises', 'كتف جانبي', '3 مجاميع'],
            ['Rear Delts', 'كتف خلفي', '2 مجموعات'],
            ['Traps', 'ترابيس', '2 مجموعات'],
            ['Triceps', 'ترايسبس', '4 مجاميع'],
            ['Biceps', 'بايسبس', '3 مجاميع']
          ]
        },
        {
          day: 'Lower (سفلي)',
          exercises: [
            ['Leg Press', 'دفع رجل', '2 مجموعات'],
            ['Leg Extension', 'أماميات رجل', '3 مجاميع'],
            ['RDL', 'خلفيات رجل - إطالة', '2 مجموعات'],
            ['Leg Curl', 'خلفيات رجل - عزل', '2 مجموعات'],
            ['Adductors', 'ضامة', '3 مجاميع'],
            ['Calves', 'سمانة', '2 مجموعات'],
            ['Lower Back', 'أسفل الظهر', '2 مجموعات']
          ]
        }
      ]
    },
    {
      id: 'ap4',
      name: 'Anterior / Posterior — 4 Days',
      arabicName: 'جدول أمامي / خلفي - 4 أيام',
      level: 'Intermediate',
      days: 4,
      desc: 'تقسيم يعتمد على السلسلة الحركية الأمامية والخلفية بتردد مرتين أسبوعياً.',
      descEn: 'Anterior-chain and posterior-chain balance across 4 sessions per week.',
      split: 'Anterior / Posterior',
      schedule: [
        {
          day: 'Anterior A (أمامي)',
          exercises: [
            ['Incline Chest', 'صدر عالي', '2 مجموعات'],
            ['Fly Machine', 'تفتيح صدر', '3 مجاميع'],
            ['Front Delts', 'كتف أمامي', '2 مجموعات'],
            ['Lateral Raises', 'كتف جانبي', '3 مجاميع'],
            ['Triceps', 'ترايسبس', '4 مجاميع'],
            ['Leg Press', 'دفع رجل', '2 مجموعات'],
            ['Leg Extension', 'أماميات رجل', '3 مجاميع'],
            ['Adductors', 'ضامة', '3 مجاميع'],
            ['Calves', 'سمانة', '2 مجموعات']
          ]
        },
        {
          day: 'Posterior A (خلفي)',
          exercises: [
            ['Lat Pulldown', 'سحب علوي واسع', '3 مجاميع'],
            ['T-Bar Row', 'تي بار', '3 مجاميع'],
            ['Close-Grip Pulldown', 'سحب علوي ضيق', '2 مجموعات'],
            ['Rear Delts', 'كتف خلفي', '2 مجموعات'],
            ['Traps', 'ترابيس', '2 مجموعات'],
            ['Biceps', 'بايسبس', '3 مجاميع'],
            ['RDL', 'خلفيات رجل - إطالة', '2 مجموعات'],
            ['Leg Curl', 'خلفيات رجل - عزل', '2 مجموعات'],
            ['Lower Back', 'أسفل الظهر', '2 مجموعات']
          ]
        },
        { day: 'Rest', exercises: [] },
        {
          day: 'Anterior B (أمامي)',
          exercises: [
            ['Incline Chest', 'صدر عالي', '2 مجموعات'],
            ['Fly Machine', 'تفتيح صدر', '3 مجاميع'],
            ['Front Delts', 'كتف أمامي', '2 مجموعات'],
            ['Lateral Raises', 'كتف جانبي', '3 مجاميع'],
            ['Triceps', 'ترايسبس', '4 مجاميع'],
            ['Leg Press', 'دفع رجل', '2 مجموعات'],
            ['Leg Extension', 'أماميات رجل', '3 مجاميع'],
            ['Adductors', 'ضامة', '3 مجاميع'],
            ['Calves', 'سمانة', '2 مجموعات']
          ]
        },
        {
          day: 'Posterior B (خلفي)',
          exercises: [
            ['Lat Pulldown', 'سحب علوي واسع', '3 مجاميع'],
            ['T-Bar Row', 'تي بار', '3 مجاميع'],
            ['Close-Grip Pulldown', 'سحب علوي ضيق', '2 مجموعات'],
            ['Rear Delts', 'كتف خلفي', '2 مجموعات'],
            ['Traps', 'ترابيس', '2 مجموعات'],
            ['Biceps', 'بايسبس', '3 مجاميع'],
            ['RDL', 'خلفيات رجل - إطالة', '2 مجموعات'],
            ['Leg Curl', 'خلفيات رجل - عزل', '2 مجموعات'],
            ['Lower Back', 'أسفل الظهر', '2 مجموعات']
          ]
        }
      ]
    },
    {
      id: 'ap5',
      name: 'Anterior / Posterior — 5 Days',
      arabicName: 'جدول أمامي / خلفي - 5 أيام',
      level: 'Advanced',
      days: 5,
      desc: 'يتم توزيع الحجم على 3 أيام أمامي ويومين خلفي لتقليل مدة الحصة التدريبية ورفع الكفاءة.',
      descEn: 'Five-day anterior and posterior split for manageable session length.',
      split: 'Anterior / Posterior',
      schedule: [
        {
          day: 'Anterior 1 (أمامي)',
          exercises: [
            ['Incline Chest', 'صدر عالي', '2 مجموعات'],
            ['Fly Machine', 'تفتيح صدر', '3 مجاميع'],
            ['Front Delts', 'كتف أمامي', '2 مجموعات'],
            ['Triceps', 'ترايسبس', '4 مجاميع'],
            ['Leg Press', 'دفع رجل', '2 مجموعات'],
            ['Adductors', 'ضامة', '3 مجاميع']
          ]
        },
        {
          day: 'Posterior 1 (خلفي)',
          exercises: [
            ['Lat Pulldown', 'سحب علوي واسع', '3 مجاميع'],
            ['T-Bar Row', 'تي بار', '3 مجاميع'],
            ['Close-Grip Pulldown', 'سحب علوي ضيق', '2 مجموعات'],
            ['Rear Delts', 'كتف خلفي', '2 مجموعات'],
            ['Traps', 'ترابيس', '2 مجموعات'],
            ['Biceps', 'بايسبس', '3 مجاميع'],
            ['RDL', 'خلفيات رجل - إطالة', '2 مجموعات'],
            ['Leg Curl', 'خلفيات رجل - عزل', '2 مجموعات'],
            ['Lower Back', 'أسفل الظهر', '2 مجموعات']
          ]
        },
        {
          day: 'Anterior 2 (أمامي)',
          exercises: [
            ['Incline Chest', 'صدر عالي', '2 مجموعات'],
            ['Lateral Raises', 'كتف جانبي', '3 مجاميع'],
            ['Triceps', 'ترايسبس', '4 مجاميع'],
            ['Leg Extension', 'أماميات رجل', '3 مجاميع'],
            ['Calves', 'سمانة', '2 مجموعات']
          ]
        },
        {
          day: 'Posterior 2 (خلفي)',
          exercises: [
            ['Lat Pulldown', 'سحب علوي واسع', '3 مجاميع'],
            ['T-Bar Row', 'تي بار', '3 مجاميع'],
            ['Close-Grip Pulldown', 'سحب علوي ضيق', '2 مجموعات'],
            ['Rear Delts', 'كتف خلفي', '2 مجموعات'],
            ['Traps', 'ترابيس', '2 مجموعات'],
            ['Biceps', 'بايسبس', '3 مجاميع'],
            ['RDL', 'خلفيات رجل - إطالة', '2 مجموعات'],
            ['Leg Curl', 'خلفيات رجل - عزل', '2 مجموعات'],
            ['Lower Back', 'أسفل الظهر', '2 مجموعات']
          ]
        },
        {
          day: 'Anterior 3 (أمامي)',
          exercises: [
            ['Fly Machine', 'تفتيح صدر', '3 مجاميع'],
            ['Front Delts', 'كتف أمامي', '2 مجموعات'],
            ['Lateral Raises', 'كتف جانبي', '3 مجاميع'],
            ['Leg Press', 'دفع رجل', '2 مجموعات'],
            ['Leg Extension', 'أماميات رجل', '3 مجاميع'],
            ['Adductors', 'ضامة', '3 مجاميع'],
            ['Calves', 'سمانة', '2 مجموعات']
          ]
        }
      ]
    },
    {
      id: 'arnold',
      name: 'Arnold Split — 6 Days',
      arabicName: 'جدول أرنولد - 6 أيام',
      level: 'Advanced',
      days: 6,
      desc: 'التوزيع الكلاسيكي الأشهر: (صدر وظهر) ثم (أكتاف وذراع) ثم (أرجل)، وتكرر الدورة مرتين في الأسبوع.',
      descEn: 'Chest & Back, Shoulders & Arms, and Legs in a rotating twice-weekly 6-day cycle.',
      split: 'Arnold Split',
      schedule: [
        {
          day: 'Chest & Back 1 (صدر وظهر)',
          exercises: [
            ['Incline Chest', 'صدر عالي', '2 مجموعات'],
            ['Fly Machine', 'تفتيح صدر', '3 مجاميع'],
            ['Lat Pulldown', 'سحب علوي واسع', '3 مجاميع'],
            ['T-Bar Row', 'تي بار', '3 مجاميع'],
            ['Close-Grip Pulldown', 'سحب علوي ضيق', '2 مجموعات'],
            ['Lower Back', 'أسفل الظهر', '2 مجموعات']
          ]
        },
        {
          day: 'Shoulders & Arms 1 (أكتاف وذراع)',
          exercises: [
            ['Front Delts', 'كتف أمامي', '2 مجموعات'],
            ['Lateral Raises', 'كتف جانبي', '3 مجاميع'],
            ['Rear Delts', 'كتف خلفي', '2 مجموعات'],
            ['Traps', 'ترابيس', '2 مجموعات'],
            ['Triceps', 'ترايسبس', '4 مجاميع'],
            ['Biceps', 'بايسبس', '3 مجاميع']
          ]
        },
        {
          day: 'Legs 1 (أرجل)',
          exercises: [
            ['Leg Press', 'دفع رجل', '2 مجموعات'],
            ['Leg Extension', 'أماميات رجل', '3 مجاميع'],
            ['RDL', 'خلفيات رجل - إطالة', '2 مجموعات'],
            ['Leg Curl', 'خلفيات رجل - عزل', '2 مجموعات'],
            ['Adductors', 'ضامة', '3 مجاميع'],
            ['Calves', 'سمانة', '2 مجموعات']
          ]
        },
        {
          day: 'Chest & Back 2 (صدر وظهر)',
          exercises: [
            ['Incline Chest', 'صدر عالي', '2 مجموعات'],
            ['Fly Machine', 'تفتيح صدر', '3 مجاميع'],
            ['Lat Pulldown', 'سحب علوي واسع', '3 مجاميع'],
            ['T-Bar Row', 'تي بار', '3 مجاميع'],
            ['Close-Grip Pulldown', 'سحب علوي ضيق', '2 مجموعات'],
            ['Lower Back', 'أسفل الظهر', '2 مجموعات']
          ]
        },
        {
          day: 'Shoulders & Arms 2 (أكتاف وذراع)',
          exercises: [
            ['Front Delts', 'كتف أمامي', '2 مجموعات'],
            ['Lateral Raises', 'كتف جانبي', '3 مجاميع'],
            ['Rear Delts', 'كتف خلفي', '2 مجموعات'],
            ['Traps', 'ترابيس', '2 مجموعات'],
            ['Triceps', 'ترايسبس', '4 مجاميع'],
            ['Biceps', 'بايسبس', '3 مجاميع']
          ]
        },
        {
          day: 'Legs 2 (أرجل)',
          exercises: [
            ['Leg Press', 'دفع رجل', '2 مجموعات'],
            ['Leg Extension', 'أماميات رجل', '3 مجاميع'],
            ['RDL', 'خلفيات رجل - إطالة', '2 مجموعات'],
            ['Leg Curl', 'خلفيات رجل - عزل', '2 مجموعات'],
            ['Adductors', 'ضامة', '3 مجاميع'],
            ['Calves', 'سمانة', '2 مجموعات']
          ]
        }
      ]
    },
    {
      id: 'fullbody4',
      name: 'Full Body — 4 Days',
      arabicName: 'جدول الجسم الكامل - 4 أيام',
      level: 'Intermediate',
      days: 4,
      desc: 'يتم تدريب الجسم بالكامل في كل حصة مع توزيع الفوليوم الأسبوعي بالتساوي لضمان الاستشفاء المثالي.',
      descEn: 'Full-body sessions with weekly volume distributed evenly across 4 workouts.',
      split: 'Full Body',
      schedule: [
        {
          day: 'Full Body 1',
          exercises: [
            ['Incline Chest', 'صدر عالي', '2 مجموعات'],
            ['Lat Pulldown', 'سحب علوي واسع', '3 مجاميع'],
            ['Lateral Raises', 'كتف جانبي', '3 مجاميع'],
            ['Triceps', 'ترايسبس', '2 مجموعات'],
            ['Biceps', 'بايسبس', '2 مجموعات'],
            ['Leg Press', 'دفع رجل', '2 مجموعات'],
            ['Leg Curl', 'خلفيات رجل - عزل', '2 مجموعات'],
            ['Calves', 'سمانة', '2 مجموعات']
          ]
        },
        {
          day: 'Full Body 2',
          exercises: [
            ['Fly Machine', 'تفتيح صدر', '3 مجاميع'],
            ['T-Bar Row', 'تي بار', '3 مجاميع'],
            ['Front Delts', 'كتف أمامي', '2 مجموعات'],
            ['Rear Delts', 'كتف خلفي', '2 مجموعات'],
            ['Triceps', 'ترايسبس', '2 مجموعات'],
            ['Biceps', 'بايسبس', '1 مجموعة'],
            ['Leg Extension', 'أماميات رجل', '3 مجاميع'],
            ['RDL', 'خلفيات رجل - إطالة', '2 مجموعات'],
            ['Adductors', 'ضامة', '3 مجاميع']
          ]
        },
        {
          day: 'Full Body 3',
          exercises: [
            ['Incline Chest', 'صدر عالي', '2 مجموعات'],
            ['Lat Pulldown', 'سحب علوي واسع', '3 مجاميع'],
            ['Close-Grip Pulldown', 'سحب علوي ضيق', '2 مجموعات'],
            ['Lateral Raises', 'كتف جانبي', '3 مجاميع'],
            ['Traps', 'ترابيس', '2 مجموعات'],
            ['Triceps', 'ترايسبس', '2 مجموعات'],
            ['Biceps', 'بايسبس', '2 مجموعات'],
            ['Leg Press', 'دفع رجل', '2 مجموعات'],
            ['Leg Curl', 'خلفيات رجل - عزل', '2 مجموعات'],
            ['Lower Back', 'أسفل الظهر', '2 مجموعات']
          ]
        },
        {
          day: 'Full Body 4',
          exercises: [
            ['Fly Machine', 'تفتيح صدر', '3 مجاميع'],
            ['T-Bar Row', 'تي بار', '3 مجاميع'],
            ['Close-Grip Pulldown', 'سحب علوي ضيق', '2 مجموعات'],
            ['Front Delts', 'كتف أمامي', '2 مجموعات'],
            ['Rear Delts', 'كتف خلفي', '2 مجموعات'],
            ['Traps', 'ترابيس', '2 مجموعات'],
            ['Triceps', 'ترايسبس', '2 مجموعات'],
            ['Biceps', 'بايسبس', '1 مجموعة'],
            ['Leg Extension', 'أماميات رجل', '3 مجاميع'],
            ['RDL', 'خلفيات رجل - إطالة', '2 مجموعات'],
            ['Adductors', 'ضامة', '3 مجاميع'],
            ['Calves', 'سمانة', '2 مجموعات'],
            ['Lower Back', 'أسفل الظهر', '2 مجموعات']
          ]
        }
      ]
    },
    {
      id: 'ppl5',
      name: 'Push / Pull / Legs — 5 Days',
      arabicName: 'جدول دفع / سحب / أرجل - 5 أيام',
      level: 'Intermediate',
      days: 5,
      desc: 'نموذج فال هان المطلوب: دفع مرتين، سحب مرتين، ويوم أرجل عالي الكثافة.',
      descEn: 'Push twice, Pull twice, and Legs once per week.',
      split: 'PPL',
      schedule: [
        {
          day: 'Push A',
          exercises: [
            ['Incline Chest Press (Smith)', 'ضغط صدر عالي سميث', '2 مجموعات'],
            ['Machine Chest Fly', 'تفتيح صدر جهاز', '3 مجاميع'],
            ['Cable Lateral Raise', 'رفرفة جانبي كيبل', '3 مجاميع'],
            ['Machine Shoulder Press', 'ضغط كتف جهاز', '2 مجموعات'],
            ['Triceps Pushdown', 'ترايسبس كيبل', '4 مجاميع']
          ]
        },
        {
          day: 'Pull A',
          exercises: [
            ['Lat Pulldown', 'سحب علوي واسع', '3 مجاميع'],
            ['T-Bar Row', 'تي بار رو', '3 مجاميع'],
            ['Close Grip Lat Pulldown', 'سحب علوي ضيق', '2 مجموعات'],
            ['Rear Delt Fly', 'رفرفة كتف خلفي', '2 مجموعات'],
            ['Dumbbell Shrugs', 'شراغز دمبل ترابيس', '2 مجموعات'],
            ['Cable Biceps Curl', 'بايسبس كيبل', '3 مجاميع'],
            ['Back Extension', 'تمديد أسفل الظهر', '2 مجموعات']
          ]
        },
        {
          day: 'Legs',
          exercises: [
            ['Leg Press', 'دفع أرجل جهاز', '2 مجموعات'],
            ['Seated Leg Curl', 'خلفيات فخذ جالس', '2 مجموعات'],
            ['Romanian Deadlift', 'ديدليفت روماني', '2 مجموعات'],
            ['Leg Extension', 'أماميات فخذ جهاز', '3 مجاميع'],
            ['Hip Adductor', 'عضلات ضامة جهاز', '3 مجاميع'],
            ['Standing Calf Raise', 'سمانة واقف', '2 مجموعات']
          ]
        },
        {
          day: 'Push B',
          exercises: [
            ['Incline Chest Press (Smith)', 'ضغط صدر عالي سميث', '2 مجموعات'],
            ['Machine Chest Fly', 'تفتيح صدر جهاز', '3 مجاميع'],
            ['Cable Lateral Raise', 'رفرفة جانبي كيبل', '3 مجاميع'],
            ['Machine Shoulder Press', 'ضغط كتف جهاز', '2 مجموعات'],
            ['Triceps Pushdown', 'ترايسبس كيبل', '4 مجاميع']
          ]
        },
        {
          day: 'Pull B',
          exercises: [
            ['Lat Pulldown', 'سحب علوي واسع', '3 مجاميع'],
            ['T-Bar Row', 'تي بار رو', '3 مجاميع'],
            ['Close Grip Lat Pulldown', 'سحب علوي ضيق', '2 مجموعات'],
            ['Rear Delt Fly', 'رفرفة كتف خلفي', '2 مجموعات'],
            ['Dumbbell Shrugs', 'شراغز دمبل ترابيس', '2 مجموعات'],
            ['Cable Biceps Curl', 'بايسبس كيبل', '3 مجاميع'],
            ['Back Extension', 'تمديد أسفل الظهر', '2 مجموعات']
          ]
        }
      ]
    }
  ];

  function home() {
    return `
      <section class="hero">
        <div class="container hero-content">
          <span class="eyebrow"><i class="fa-solid fa-fire"></i> TRAIN WITH PURPOSE</span>
          <h1>BUILD YOUR <em>STRENGTH.</em><br>MASTER YOUR FITNESS.</h1>
          <p>${t(
            'منصة رياضية متكاملة تساعدك على اختيار وتقسيم جدولك التدريبي، وفهم زوايا التمارين، وضبط الحجم التدريبي المعتمد (88 مجموعة أسبوعياً).',
            'A comprehensive fitness platform helping you organize workout splits, understand movements, and maintain verified weekly volume (88 weekly sets).'
          )}</p>
          <div class="actions">
            ${btn(t('أنشئ خطتك الآن', 'Build your plan'), `${root}/pages/workout-builder.html`)}
            ${btn(t('اكتشف الجداول والخطط', 'Explore plans'), `${root}/pages/workout-plans.html`, true)}
            <a class="btn btn-outline" href="${root}/pages/our-team.html" style="border-color: rgba(0,210,255,0.4); color: var(--text);">
              <i class="fa-solid fa-users"></i> ${t('فريق العمل', 'Our Team')}
            </a>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="section-head">
            <span class="eyebrow">VALHAN TRAINING SYSTEM</span>
            <h2 class="section-title">${t('كل أدوات تدريبك في مكان واحد', 'Your training tools in one place')}</h2>
            <p class="muted">${t('من اختيار التقسيمة العلمية إلى فهم تفاصيل التمرين ومراجعة فريق العمل.', 'From selecting scientific splits to mastering execution and exploring our team.')}</p>
          </div>
          <div class="grid feature-grid" style="grid-template-columns: repeat(4, 1fr);">
            <a class="card feature reveal" href="${root}/pages/workout-plans.html">
              <b>01</b>
              <h3>${t('جداول التدريب الشاملة', 'Comprehensive Plans')}</h3>
              <p>${t('7 أنظمة متكاملة مبنية على الحجم التدريبي الموحد (88 مجموعة).', '7 unified systems based on verified weekly volume.')}</p>
            </a>
            <a class="card feature reveal" href="${root}/pages/workout-builder.html">
              <b>02</b>
              <h3>${t('منشئ الخطط وتصدير PDF', 'Workout Builder & PDF')}</h3>
              <p>${t('كوّن أيامك، اختر تمارينك وصدّر ملف PDF مطابق للنموذج المعتمد.', 'Build your sessions and export clean print-ready PDFs.')}</p>
            </a>
            <a class="card feature reveal" href="${root}/pages/exercises.html">
              <b>03</b>
              <h3>${t('مكتبة التمارين التفاعلية', 'Exercise Library')}</h3>
              <p>${t('صور توضيحية، إرشادات أداء، وبحث مباشر عن الفيديوهات.', 'Movement guides, cues, and direct tutorial search.')}</p>
            </a>
            <a class="card feature reveal" href="${root}/pages/our-team.html" style="border-top: 3px solid #00d2ff;">
              <b>04</b>
              <h3>${t('فريق العمل والبورتفوليو', 'Our Team & Portfolios')}</h3>
              <p>${t('تعرف على المطور Simo والمدرب Mohamed Hatem وأدوات المشروع.', 'Meet Developer Simo, Coach Mohamed Hatem and project stack.')}</p>
            </a>
          </div>
        </div>
      </section>

      <section class="section" style="border-top: 1px solid var(--line);">
        <div class="container split">
          <div>
            <span class="eyebrow">PLAN. TRAIN. PROGRESS.</span>
            <h2 class="section-title">${t('التقدم ليس عشوائياً', 'Progress is not random')}</h2>
            <p class="muted">${t(
              'تم بناء VALHAN MUSCLES بواسطة فريق متكامل: كابتن محمد حاتم في الجانب الرياضي وهندسة الأحمال، وسيمو في تطوير الواجهة والتجربة التفاعلية.',
              'VALHAN MUSCLES is built by a dedicated team: Mohamed Hatem on fitness architecture and Simo on front-end engineering.'
            )}</p>
            <div style="display:flex; gap:12px; flex-wrap:wrap; margin-top:20px;">
              ${btn(t('تعرف على فريق العمل', 'Meet the team'), `${root}/pages/our-team.html`)}
              ${btn(t('تصفح مكتبة التمارين', 'Browse exercises'), `${root}/pages/exercises.html`, true)}
            </div>
          </div>
          <div class="about-panel">
            <span class="eyebrow">VALHAN MUSCLES PHILOSOPHY</span>
            <h2>BUILD YOUR STRENGTH.</h2>
            <p class="muted">${t(
              'قوة في التركيز. وضوح في التدريب. 88 مجموعة أسبوعياً موزعة بدقة لضمان الاستشفاء والتطور العضلي المستمر.',
              'Strength in focus. Clarity in training. 88 weekly sets carefully allocated for recovery and hypertrophy.'
            )}</p>
          </div>
        </div>
      </section>`;
  }

  function plansPage() {
    return `
      ${head(
        'TRAINING PROGRAMS',
        t('دليل الجداول التدريبية الشامل', 'Comprehensive Training Programs'),
        t(
          'توزيع الحجم التدريبي الموحد (تردد مرتين أسبوعياً) على 7 أنظمة تدريبية متكاملة لضمان ثبات الحمل التدريبي وسهولة التنقل بين الأنظمة.',
          'Unified weekly training volume (twice-weekly frequency) distributed across 7 complete systems for consistent stimulus.'
        )
      )}

      <!-- Approved Unified Weekly Volume Summary from reference-workout.pdf -->
      <section class="section" style="padding-bottom: 20px;">
        <div class="container">
          <div class="volume-summary-box reveal">
            <div class="volume-summary-header">
              <h2>${t('ملخص الحجم التدريبي الأسبوعي المعتمد (الفوليوم)', 'Approved Weekly Training Volume Summary')}</h2>
              <p>${t(
                'تم تصميم هذا الدليل بناءً على الحجم التدريبي الأسبوعي المحدد بدقة (إجمالي 88 مجموعة أسبوعياً)، مع توزيع نفس إجمالي المجاميع على كافة أنظمة التدريب.',
                'Designed with precise weekly volume (total 88 sets/week), distributing the exact same sets across all training systems.'
              )}</p>
            </div>

            <div class="volume-table-wrap">
              <table class="volume-table">
                <thead>
                  <tr>
                    <th>${t('التمرين / العضلة المستهدفة', 'Exercise / Target Muscle')}</th>
                    <th>${t('الفئة العضلية', 'Muscle Group')}</th>
                    <th style="text-align: center;">${t('إجمالي المجاميع الأسبوعي', 'Total Weekly Sets')}</th>
                  </tr>
                </thead>
                <tbody>
                  ${unifiedVolume.map(v => `
                    <tr>
                      <td><strong>${v.exercise}</strong> <span style="color:var(--muted); font-size:.85rem;">(${v.arabic})</span></td>
                      <td><span class="tag">${v.category}</span></td>
                      <td style="text-align: center;"><span class="volume-total-badge">${v.sets} ${t('مجاميع', 'sets')}</span></td>
                    </tr>
                  `).join('')}
                  <tr style="background: rgba(225,6,0,0.08); font-weight: bold;">
                    <td><strong>${t('الإجمالي الأسبوعي المعتمد', 'Total Unified Weekly Volume')}</strong></td>
                    <td><span class="tag" style="background:var(--red); color:#fff;">18 ${t('تمرين', 'Exercises')}</span></td>
                    <td style="text-align: center;"><span class="volume-total-badge" style="font-size:1rem; padding: 4px 14px;">88 ${t('مجموعة أسبوعياً', 'Sets / Week')}</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <!-- Plans Directory -->
      <section class="section" style="padding-top: 10px;">
        <div class="container">
          <div class="filter-bar">
            <label class="field">${t('عدد الأيام', 'Training days')}
              <select id="plan-days">
                <option value="all">${t('الكل', 'All')}</option>
                ${[4, 5, 6].map(n => `<option>${n}</option>`)}
              </select>
            </label>
            <label class="field">${t('المستوى', 'Level')}
              <select id="plan-level">
                <option value="all">${t('الكل', 'All')}</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </label>
            <label class="field">${t('بحث', 'Search')}
              <input id="plan-search" type="search" placeholder="${t('ابحث بالاسم...', 'Search split...')}">
            </label>
          </div>

          <div class="grid plan-grid" id="plans-grid">
            ${plans.map(p => `
              <article class="card plan-card reveal">
                <span class="tag">${p.level}</span>
                <h3>${t(p.arabicName, p.name)}</h3>
                <p>${t(p.desc, p.descEn || p.desc)}</p>
                <div class="plan-meta">
                  <span><i class="fa-solid fa-calendar-days"></i> ${p.days} ${t('أيام / أسبوع', 'days / week')}</span>
                  <span><i class="fa-solid fa-dumbbell"></i> ${p.split}</span>
                </div>
                <button class="btn btn-outline" data-plan="${p.id}" style="margin-top:auto;">
                  <i class="fa-solid fa-list-check"></i> ${t('عرض تفاصيل وجدول الحصص', 'View weekly schedule')}
                </button>
              </article>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- Plan Detail Modal -->
      <div class="modal" id="plan-modal">
        <div class="modal-box" style="max-width: 760px; max-height: 85vh; overflow-y: auto;">
          <button class="modal-close" data-close aria-label="Close modal">×</button>
          <div id="plan-detail"></div>
        </div>
      </div>`;
  }

  function builderPage() {
    return `
      ${head(
        'WORKOUT BUILDER',
        t('ابنِ خطتك التدريبية بنفسك', 'Build Your Workout Program'),
        t(
          'اختر نموذجاً معتمداً من الـ 7 أنظمة في الدليل الشامل أو أنشئ أيامك الخاصة وصدّر ملف PDF بجودة طباعة عالية.',
          'Select an official template from the 7 reference systems or customize your days, then export a print-ready PDF.'
        )
      )}
      <section class="section">
        <div class="container">
          <div class="builder-toolbar">
            <label class="field">${t('اسم الخطة', 'Plan name')}
              <input id="builder-name" value="My VALHAN Program">
            </label>
            <label class="field">${t('التقسيمة التدريبية', 'Training split')}
              <select id="builder-split"></select>
            </label>
            <button class="btn btn-outline" id="load-template">
              <i class="fa-solid fa-arrows-rotate"></i> ${t('تحميل النموذج المعتمد', 'Load official template')}
            </button>
          </div>

          <div id="builder-days"></div>

          <div class="builder-actions">
            <button class="btn btn-outline" id="add-day">＋ ${t('إضافة يوم جديد', 'Add day')}</button>
            <button class="btn btn-outline" id="clear-plan">${t('مسح التمارين', 'Clear exercises')}</button>
            <button class="btn btn-primary" id="export-pdf" style="margin-inline-start: auto;">
              <i class="fa-solid fa-file-pdf"></i> ${t('تحميل وتصدير PDF المعتمد', 'Download workout PDF')}
            </button>
          </div>
          <p class="muted">
            ${t(
              'يتم حفظ التعديلات محلياً في متصفحك. التصدير مطابق لتصميم وألوان دليل الجداول التدريبية الشامل (PDF).',
              'Your changes save automatically in your browser. PDF export strictly follows the official VALHAN MUSCLES design.'
            )}
          </p>
        </div>
      </section>

      <div class="modal" id="picker-modal">
        <div class="modal-box">
          <button class="modal-close" data-close-modal aria-label="Close picker">×</button>
          <h2>${t('اختر تمريناً من المكتبة', 'Choose an exercise')}</h2>
          <input id="picker-search" class="modal-search" type="search" placeholder="Search exercises...">
          <div class="grid picker-grid" id="picker-grid"></div>
        </div>
      </div>`;
  }

  function academy() {
    const articles = [
      [
        t('كيف تختار تقسيمة مناسبة؟', 'How to choose a split'),
        t('ابدأ بعدد أيام تستطيع الالتزام به، ثم وزّع العضلات والحركات بحيث تحصل على وقت كافٍ للتعافي.', 'Start with a weekly frequency you can sustain, then distribute muscle groups and movements with enough recovery.')
      ],
      [
        t('اختيار التمارين بعناية', 'Exercise selection'),
        t('اجمع بين الحركات المركبة وتمارين العزل، واختر بدائل تناسب المعدات المتاحة وقدرتك على أداء الحركة بثبات.', 'Combine compound and isolation movements. Choose variations that match available equipment and joint stability.')
      ],
      [
        t('تنظيم أيام التدريب والراحة', 'Organizing training days'),
        t('وازن بين الأيام المجهدة وأيام الراحة، وتجنب تكرار إجهاد نفس العضلات دون تعافٍ كافٍ.', 'Balance demanding sessions with rest and avoid repeatedly stressing the same muscles without adequate recovery.')
      ],
      [
        t('المجموعات والتكرارات', 'Sets and reps'),
        t('اختيار المجموعات والتكرارات يعتمد على الهدف والخبرة وقرب المجموعة من الفشل مع الحفاظ على جودة الأداء.', 'Sets and reps depend on goals, experience and effort while maintaining sound technique.')
      ],
      [
        t('الحجم التدريبي المعتمد (88 مجموعة)', 'Understanding unified volume (88 sets)'),
        t('الحجم التدريبي الأسبوعي المعتمد في VALHAN MUSCLES يبلغ 88 مجموعة أسبوعياً موزعة بالتساوي مرتين أسبوعياً لكل عضلة.', 'The certified VALHAN volume standard is 88 working sets per week, distributed twice weekly per muscle group.')
      ],
      [
        t('تتبع التقدم والاستمرارية', 'Tracking progress & consistency'),
        t('سجل الأوزان والتكرارات وجودة الأداء، وراقب الاتجاه على مدى أسابيع بدل الحكم من حصة واحدة. الاستمرارية هي الأساس.', 'Record loads, reps and execution quality. Look at trends over weeks rather than judging one session.')
      ]
    ];

    return `
      ${head('FITNESS ACADEMY', t('أكاديمية التدريب الرياضي', 'Fitness Academy'), t('مفاهيم تدريبية ومبادئ علمية لبناء فهم رياضي متين.', 'Practical guides and scientific foundations for smarter training.'))}
      <section class="section">
        <div class="container grid academy-grid">
          ${articles.map((a, i) => `
            <article class="card article reveal">
              <span class="eyebrow">GUIDE 0${i + 1}</span>
              <h3>${a[0]}</h3>
              <p>${a[1]}</p>
            </article>
          `).join('')}
        </div>
      </section>`;
  }

  function about() {
    return `
      ${head('ABOUT VALHAN', t('عن المنصة', 'About VALHAN MUSCLES'), t('منصة تعليمية وأدوات عملية لتنظيم رحلة التدريب والقوة البدنية.', 'An educational space with practical tools for organizing your fitness journey.'))}
      <section class="section">
        <div class="container">
          <div class="about-panel reveal">
            <span class="eyebrow">OUR MISSION</span>
            <h2 class="section-title">BUILD YOUR STRENGTH. MASTER YOUR FITNESS.</h2>
            <p>${t(
              'هدفنا تبسيط التخطيط التدريبي وإتاحة أدوات عملية سهلة الاستخدام تساعد المتدرب على فهم التمارين وبناء جدول يناسب ظروفه. نؤمن أن الاستمرارية والمعرفة أهم من مطاردة الحلول السريعة.',
              'Our mission is to make training organization easier through accessible tools that help people understand exercises and build plans that fit their circumstances. We value consistency and knowledge over quick fixes.'
            )}</p>
            <p class="muted">${t(
              'الموقع لا يقدم تشخيصاً أو علاجاً طبياً، والمعلومات عامة وتعليمية. اختر أحمالاً مناسبة لمستواك واستشر مختصاً عند وجود إصابة أو حالة صحية.',
              'This website does not provide medical diagnosis or treatment. Information is general and educational. Consult a professional if you have injuries or medical conditions.'
            )}</p>
            <div style="margin-top: 24px;">
              <a class="btn btn-primary" href="${root}/pages/our-team.html">
                <i class="fa-solid fa-users"></i> ${t('تعرف على فريق العمل (Simo & Mohamed Hatem)', 'Meet Our Team (Simo & Mohamed Hatem)')}
              </a>
            </div>
          </div>
        </div>
      </section>`;
  }

  function teamPage() {
    return `
      <section class="page-hero">
        <div class="container">
          <span class="eyebrow"><i class="fa-solid fa-users"></i> VALHAN MUSCLES TEAM</span>
          <h1>${t('فريق عمل المنصة', 'The Minds Behind VALHAN MUSCLES')}</h1>
          <p>${t(
            'تعرف على الفريق وراء VALHAN MUSCLES — المطور سيمو والمدرب محمد حاتم، وتعرف على الأدوات والتقنيات المستخدمة في بناء المشروع.',
            'Meet the team behind VALHAN MUSCLES — Front-End Developer Simo and Fitness Coach Mohamed Hatem, and discover the tools and technologies behind the project.'
          )}</p>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="section-head">
            <span class="eyebrow">PORTFOLIO DIRECTORY</span>
            <h2 class="section-title">${t('اختر البورتفوليو للاستكشاف', 'Explore Portfolios')}</h2>
            <p class="muted">${t(
              'يمثل مشروع VALHAN MUSCLES نتاج تعاون تكاملي بين خبرة التدريب الرياضي وتطوير واجهات الويب الحديثة.',
              'VALHAN MUSCLES is built upon the synergy between fitness coaching methodology and modern front-end web engineering.'
            )}</p>
          </div>

          <div class="team-grid">
            <!-- Developer Simo Card -->
            <article class="team-card team-card-dev reveal">
              <div class="team-card-image-wrap">
                <img src="${root}/assets/images/developer.jpg" alt="Developer Simo" onerror="this.src='${root}/assets/developer.jpg'">
                <div class="team-card-overlay"></div>
              </div>
              <div class="team-card-body">
                <span class="role-badge"><i class="fa-solid fa-laptop-code"></i> Front-End Developer</span>
                <h3 class="team-card-name">Simo</h3>
                <p class="team-card-desc">${t(
                  'مطور واجهات أمامية مهتم ببناء وتطوير تجارب ويب تفاعلية وسريعة تجمع بين الهيكلة البرمجية النظيفة والتصميم المتجاوب وسهولة الاستخدام عبر مختلف الأجهزة.',
                  'Front-End Developer focused on building responsive, clean, and interactive web experiences with high performance and modular architecture.'
                )}</p>
                <a class="btn btn-dev" href="${root}/pages/developer.html">
                  <span>${t('استكشف بورتفوليو المطور', 'Explore Developer Portfolio')}</span>
                  <i class="fa-solid fa-arrow-left"></i>
                </a>
              </div>
            </article>

            <!-- Coach Mohamed Hatem Card -->
            <article class="team-card team-card-coach reveal">
              <div class="team-card-image-wrap">
                <img src="${root}/assets/images/coach.jpg" alt="Coach Mohamed Hatem" onerror="this.src='${root}/assets/coach.jpg'">
                <div class="team-card-overlay"></div>
              </div>
              <div class="team-card-body">
                <span class="role-badge"><i class="fa-solid fa-dumbbell"></i> Fitness Coach</span>
                <h3 class="team-card-name">Mohamed Hatem</h3>
                <p class="team-card-desc">${t(
                  'مدرب لياقة بدنية مسؤول عن الهيكلة العلمية للجداول التدريبية، إدارة الفوليوم التدريبي (88 مجموعة)، والتوزيع المتوازن لمجموعات التمارين المعتمدة في منصة VALHAN MUSCLES.',
                  'Fitness Coach responsible for the scientific workout architecture, weekly volume allocation (88 sets), and approved exercise programming in VALHAN MUSCLES.'
                )}</p>
                <a class="btn btn-coach" href="${root}/pages/coach.html">
                  <span>${t('استكشف بورتفوليو المدرب', 'Explore Coach Portfolio')}</span>
                  <i class="fa-solid fa-arrow-left"></i>
                </a>
              </div>
            </article>
          </div>

          <div class="team-synergy-banner reveal">
            <div>
              <strong><i class="fa-solid fa-circle-check" style="color:var(--green)"></i> ${t('تعاون تخصصي واضح:', 'Clear Specialized Collaboration:')}</strong>
              <p class="muted">${t(
                'شخصان منفصلان بأدوار تخصصية واضحة — هندسة وتطوير الواجهة الأمامية بواسطة Simo، والتخطيط التدريبي والأنظمة الرياضية بواسطة Mohamed Hatem.',
                'Two distinct individuals with dedicated responsibilities — Front-End engineering by Simo, and workout architecture & fitness systems by Mohamed Hatem.'
              )}</p>
            </div>
            <a class="btn btn-outline" href="${root}/index.html">${t('العودة للرئيسية', 'Back to Home')}</a>
          </div>
        </div>
      </section>

      <!-- Tools & Technologies Section -->
      <section class="section tech-section" style="border-top: 1px solid var(--line);">
        <div class="container">
          <div class="section-head">
            <span class="eyebrow">STACK & WORKFLOW</span>
            <h2 class="section-title">${t('الأدوات والتقنيات المستخدمة في بناء VALHAN MUSCLES', 'Tools & Technologies Behind VALHAN MUSCLES')}</h2>
            <p class="muted">${t(
              'استعراض حقيقي للأدوات، التقنيات البرمجية، ومنهجية العمل المتبعة لتطوير منصة VALHAN MUSCLES وفق معايير الويب الحديثة.',
              'Authentic breakdown of the actual development tools, web technologies, and workflow used in building VALHAN MUSCLES.'
            )}</p>
          </div>

          <!-- Development Tools -->
          <h3 class="tech-group-title"><i class="fa-solid fa-screwdriver-wrench"></i> ${t('أدوات التطوير (Development Tools)', 'Development Tools')}</h3>
          <div class="tech-grid">
            <div class="tech-card reveal">
              <div class="tech-card-header">
                <div class="tech-icon-box"><i class="fa-solid fa-code"></i></div>
                <div>
                  <h4 class="tech-card-title">Visual Studio Code</h4>
                  <span class="tech-card-type">Code Editor</span>
                </div>
              </div>
              <p class="tech-card-desc">${t(
                'محرر الأكواد الأساسي المستخدم في كتابة، تنظيم، وهيكلة جميع ملفات الويب البرمجية للمشروع بكفاءة وسرعة.',
                'The primary code editor used for writing, organizing, and structuring all front-end codebase files efficiently.'
              )}</p>
            </div>

            <div class="tech-card reveal">
              <div class="tech-card-header">
                <div class="tech-icon-box"><i class="fa-solid fa-robot"></i></div>
                <div>
                  <h4 class="tech-card-title">ChatGPT (GPT)</h4>
                  <span class="tech-card-type">AI Assistant</span>
                </div>
              </div>
              <p class="tech-card-desc">${t(
                'استُخدم كأداة ذكاء اصطناعي للمساعدة في العصف الذهني، صياغة النصوص التوضيحية، ومراجعة المحتوى اللغوي.',
                'Used for ideation, drafting explanatory copy, and linguistic content refinement.'
              )}</p>
            </div>

            <div class="tech-card reveal">
              <div class="tech-card-header">
                <div class="tech-icon-box"><i class="fa-solid fa-brain"></i></div>
                <div>
                  <h4 class="tech-card-title">Claude</h4>
                  <span class="tech-card-type">AI Reasoning</span>
                </div>
              </div>
              <p class="tech-card-desc">${t(
                'استُخدم كأداة ذكاء اصطناعي للمساعدة في التحليل المعماري للمتطلبات، وتدقيق تعليمات البرمجة، وتنظيم التناسق العام للمنصة.',
                'Leveraged for architectural reasoning, prompt instruction audit, and UI consistency evaluation.'
              )}</p>
            </div>
          </div>

          <!-- Web Technologies -->
          <h3 class="tech-group-title"><i class="fa-solid fa-layer-group"></i> ${t('تقنيات الويب البرمجية (Web Technologies)', 'Web Technologies')}</h3>
          <div class="tech-grid">
            <div class="tech-card reveal">
              <div class="tech-card-header">
                <div class="tech-icon-box" style="color:#e34f26"><i class="fa-brands fa-html5"></i></div>
                <div>
                  <h4 class="tech-card-title">HTML5</h4>
                  <span class="tech-card-type">Markup Language</span>
                </div>
              </div>
              <p class="tech-card-desc">${t(
                'بناء الهيكل الدلالي (Semantic HTML) وتوفير أسس إمكانية الوصول والتنقل السلس وتوافق محركات البحث.',
                'Semantic markup ensuring accessibility standards, accessible layouts, and clean web structure.'
              )}</p>
            </div>

            <div class="tech-card reveal">
              <div class="tech-card-header">
                <div class="tech-icon-box" style="color:#1572b6"><i class="fa-brands fa-css3-alt"></i></div>
                <div>
                  <h4 class="tech-card-title">CSS3</h4>
                  <span class="tech-card-type">Styling & Design System</span>
                </div>
              </div>
              <p class="tech-card-desc">${t(
                'تصميم عصري متجاوب بالكامل باستخدام CSS Grid وFlexbox، ودعم النمطين الداكن والفاتح (Dark/Light Modes) ومتغيرات الألوان.',
                'Fluid responsive layouts using CSS Grid and Flexbox, with native dark/light theme switching.'
              )}</p>
            </div>

            <div class="tech-card reveal">
              <div class="tech-card-header">
                <div class="tech-icon-box" style="color:#f7df1e"><i class="fa-brands fa-js"></i></div>
                <div>
                  <h4 class="tech-card-title">Vanilla JavaScript</h4>
                  <span class="tech-card-type">Core Scripting (ES6+)</span>
                </div>
              </div>
              <p class="tech-card-desc">${t(
                'برمجة منطق الموقع بالكامل بدون أطر عمل خارجية ثقيلة، لإدارة الحالة محلياً، وتصفية التمارين، وتوليد وطباعة ملفات PDF.',
                'Zero-dependency modern JavaScript handling client-side routing, filtering, offline local storage, and PDF rendering.'
              )}</p>
            </div>
          </div>

          <!-- Development Workflow -->
          <h3 class="tech-group-title"><i class="fa-solid fa-code-branch"></i> ${t('منهجية وسير العمل (Development Workflow)', 'Development Workflow')}</h3>
          <div class="tech-grid" style="grid-template-columns: repeat(2, 1fr);">
            <div class="tech-card reveal">
              <div class="tech-card-header">
                <div class="tech-icon-box" style="color:#f05032"><i class="fa-brands fa-git-alt"></i></div>
                <div>
                  <h4 class="tech-card-title">Git</h4>
                  <span class="tech-card-type">Version Control System</span>
                </div>
              </div>
              <p class="tech-card-desc">${t(
                'نظام إدارة ومتابعة النسخ الموزع لتسجيل التعديلات والتحكم بإصدارات الكود وتتبع التطور الزمني للمشروع بدقة.',
                'Distributed version control tracking revisions, branch workflows, and codebase history.'
              )}</p>
            </div>

            <div class="tech-card reveal">
              <div class="tech-card-header">
                <div class="tech-icon-box" style="color:#fff"><i class="fa-brands fa-github"></i></div>
                <div>
                  <h4 class="tech-card-title">GitHub</h4>
                  <span class="tech-card-type">Cloud Repository & Collaboration</span>
                </div>
              </div>
              <p class="tech-card-desc">${t(
                'المنصة السحابية لاستضافة المستودع البرمجي، ومراجعة سجل الالتزامات (Commits)، وإدارة المشروع وتوثيقه.',
                'Cloud hosting platform for repository management, version control archiving, and collaboration.'
              )}</p>
            </div>
          </div>
        </div>
      </section>`;
  }

  function developerPage() {
    return `
      <div class="container" style="padding-top: 20px;">
        <div class="nav-back-bar">
          <a class="nav-back-link" href="${root}/pages/our-team.html">
            <i class="fa-solid fa-arrow-right"></i>
            <span>${t('العودة لصفحة فريق العمل (Our Team)', 'Back to Team Hub')}</span>
          </a>
          <a class="nav-back-link" href="${root}/index.html">
            <span>${t('الرئيسية | VALHAN MUSCLES', 'Main Website')}</span>
            <i class="fa-solid fa-house"></i>
          </a>
        </div>
      </div>

      <section class="portfolio-hero dev-hero">
        <div class="container portfolio-hero-inner">
          <div class="profile-avatar-wrap reveal">
            <img src="${root}/assets/images/developer.jpg" alt="Developer Simo" onerror="this.src='${root}/assets/developer.jpg'">
          </div>

          <div class="portfolio-info reveal">
            <span class="role-badge" style="background:rgba(0,210,255,0.15);color:#00d2ff;border:1px solid rgba(0,210,255,0.35);">
              <i class="fa-solid fa-code"></i> Front-End Developer
            </span>
            <h1>Simo</h1>
            <p class="portfolio-intro">${t(
              'مطور واجهات أمامية (Front-End Developer) مهتم ببناء وتطوير مواقع وتطبيقات ويب سريعة، متجاوبة وتفاعلية. أركز على كتابة كود نظيف ومعياري يحقق تجربة مستخدم سلسة وأداءً عاليًا عبر مختلف الشاشات والأجهزة.',
              'Front-End Developer passionate about building responsive, interactive, and high-performance web experiences. Focused on clean, modular architecture and intuitive UX across devices.'
            )}</p>

            <div>
              <span class="eyebrow" style="color:var(--muted);"><i class="fa-solid fa-link"></i> ${t('قنوات التواصل الرسمية', 'Official Contact & Links')}</span>
              <div class="social-links-bar">
                <a class="social-btn btn-gh" href="https://github.com/simo-g1" target="_blank" rel="noopener noreferrer">
                  <i class="fa-brands fa-github"></i>
                  <span>GitHub</span>
                </a>
                <a class="social-btn btn-wa" href="https://wa.me/201010356493" target="_blank" rel="noopener noreferrer">
                  <i class="fa-brands fa-whatsapp"></i>
                  <span>WhatsApp</span>
                </a>
                <a class="social-btn btn-ig" href="https://www.instagram.com/simo.g3" target="_blank" rel="noopener noreferrer">
                  <i class="fa-brands fa-instagram"></i>
                  <span>Instagram</span>
                </a>
                <a class="social-btn btn-tt" href="https://www.tiktok.com/@simo.dev3" target="_blank" rel="noopener noreferrer">
                  <i class="fa-brands fa-tiktok"></i>
                  <span>TikTok</span>
                </a>
                <a class="social-btn btn-fb" href="https://www.facebook.com/simo.g3.dev" target="_blank" rel="noopener noreferrer">
                  <i class="fa-brands fa-facebook"></i>
                  <span>Facebook</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="section-head">
            <span class="eyebrow">PORTFOLIO WORK</span>
            <h2 class="section-title">${t('المشاريع الحقيقية (Featured Projects)', 'Real Projects')}</h2>
            <p class="muted">${t(
              'مشاريع ويب حقيقية مطورة تركز على تصميم الواجهات التفاعلية، سرعة التحميل، والتجربة الشاملة للمستخدم.',
              'Real projects focused on responsive front-end design, speed, and intuitive user experiences.'
            )}</p>
          </div>

          <div class="projects-grid">
            <!-- Project 1: HyperNest -->
            <article class="project-card reveal">
              <div class="project-preview" style="background: linear-gradient(135deg, #09131d, #0d2838);">
                <div class="project-preview-mockup">
                  <div class="mockup-bar">
                    <span></span><span></span><span></span>
                  </div>
                  <div class="mockup-screen-title">HyperNest</div>
                  <p style="color:#64748b;font-size:.8rem;margin:6px 0 0;">Modern Responsive Web Platform</p>
                </div>
              </div>
              <div class="project-card-body">
                <h3 class="project-card-title">HyperNest</h3>
                <p class="project-card-desc">${t(
                  'مشروع واجهة ويب حديث يتميز بتصميم هيكلي متجاوب وجذاب، مع تركيز دقيق على انسيابية التنقل، وتناسق الألوان والعناصر التفاعلية لتوفير تجربة مستخدم عصرية ومميزة.',
                  'A modern web interface project highlighting responsive layouts, sleek visual aesthetics, and intuitive section navigation.'
                )}</p>
                <div class="tech-tags-row">
                  <span class="tech-tag"><i class="fa-brands fa-html5"></i> HTML5</span>
                  <span class="tech-tag"><i class="fa-brands fa-css3-alt"></i> CSS3</span>
                  <span class="tech-tag"><i class="fa-brands fa-js"></i> JavaScript</span>
                  <span class="tech-tag">Responsive UI</span>
                </div>
                <div class="project-actions">
                  <a class="btn btn-outline" href="https://github.com/simo-g1/HyperNest" target="_blank" rel="noopener noreferrer">
                    <i class="fa-brands fa-github"></i>
                    <span>GitHub</span>
                  </a>
                  <a class="btn btn-primary" href="https://simo-g1.github.io/HyperNest/" target="_blank" rel="noopener noreferrer">
                    <i class="fa-solid fa-arrow-up-right-from-square"></i>
                    <span>Live Demo</span>
                  </a>
                </div>
              </div>
            </article>

            <!-- Project 2: Mr.Ahmed -->
            <article class="project-card reveal">
              <div class="project-preview" style="background: linear-gradient(135deg, #1b120c, #2e1a10);">
                <div class="project-preview-mockup" style="border-color: rgba(245, 158, 11, 0.4);">
                  <div class="mockup-bar">
                    <span></span><span></span><span></span>
                  </div>
                  <div class="mockup-screen-title" style="color:#f59e0b;">Mr.Ahmed</div>
                  <p style="color:#64748b;font-size:.8rem;margin:6px 0 0;">Interactive Educational Portal</p>
                </div>
              </div>
              <div class="project-card-body">
                <h3 class="project-card-title">Mr.Ahmed</h3>
                <p class="project-card-desc">${t(
                  'منصة ويب تعليمية تفاعلية مصممة لتقديم المناهج الدراسية والمواد التعليمية للطلاب بأسلوب منظم وسهل الوصول، مع واجهة مستخدم مبسطة تخدم العملية التعليمية بكفاءة.',
                  'An interactive educational web platform designed to present study content, lessons, and resources in an organized, user-friendly layout.'
                )}</p>
                <div class="tech-tags-row">
                  <span class="tech-tag"><i class="fa-brands fa-html5"></i> HTML5</span>
                  <span class="tech-tag"><i class="fa-brands fa-css3-alt"></i> CSS3</span>
                  <span class="tech-tag"><i class="fa-brands fa-js"></i> JavaScript</span>
                  <span class="tech-tag">Education Web</span>
                </div>
                <div class="project-actions">
                  <a class="btn btn-outline" href="https://github.com/simo-g1/Mr.Ahmed" target="_blank" rel="noopener noreferrer">
                    <i class="fa-brands fa-github"></i>
                    <span>GitHub</span>
                  </a>
                  <a class="btn btn-primary" href="https://simo-g1.github.io/Mr.Ahmed/" target="_blank" rel="noopener noreferrer">
                    <i class="fa-solid fa-arrow-up-right-from-square"></i>
                    <span>Live Demo</span>
                  </a>
                </div>
              </div>
            </article>
          </div>

          <div style="margin-top: 50px; text-align: center;">
            <a class="btn btn-outline" href="${root}/pages/our-team.html">
              <i class="fa-solid fa-arrow-right"></i>
              <span>${t('العودة لصفحة الفريق', 'Back to Team Hub')}</span>
            </a>
            <a class="btn btn-outline" href="${root}/pages/coach.html" style="margin-inline-start: 12px;">
              <span>${t('زيارة بورتفوليو المدرب Mohamed Hatem', 'Visit Coach Portfolio')}</span>
              <i class="fa-solid fa-arrow-left"></i>
            </a>
          </div>
        </div>
      </section>`;
  }

  function coachPage() {
    return `
      <div class="container" style="padding-top: 20px;">
        <div class="nav-back-bar">
          <a class="nav-back-link" href="${root}/pages/our-team.html">
            <i class="fa-solid fa-arrow-right"></i>
            <span>${t('العودة لصفحة فريق العمل (Our Team)', 'Back to Team Hub')}</span>
          </a>
          <a class="nav-back-link" href="${root}/index.html">
            <span>${t('الرئيسية | VALHAN MUSCLES', 'Main Website')}</span>
            <i class="fa-solid fa-house"></i>
          </a>
        </div>
      </div>

      <section class="portfolio-hero">
        <div class="container portfolio-hero-inner">
          <div class="profile-avatar-wrap reveal" style="border-color: rgba(225,6,0,0.4);">
            <img src="${root}/assets/images/coach.jpg" alt="Coach Mohamed Hatem" onerror="this.src='${root}/assets/coach.jpg'">
          </div>

          <div class="portfolio-info reveal">
            <span class="role-badge" style="background:rgba(225,6,0,0.15);color:var(--red2);border:1px solid rgba(225,6,0,0.35);">
              <i class="fa-solid fa-dumbbell"></i> Fitness Coach
            </span>
            <h1>Mohamed Hatem</h1>
            <p class="portfolio-intro">${t(
              'مدرب لياقة بدنية (Fitness Coach) ومصمم الأنظمة التدريبية في منصة VALHAN MUSCLES. أعمل على وضع برامج تدريبية مدروسة تعتمد على توزيع الفوليوم الأسبوعي المتوازن، واختيار التمارين الفعالة، وبناء خطط تساعد المتدرب على الاستمرار وتحقيق نتائج حقيقية بعيداً عن العشوائية.',
              'Fitness Coach and workout system designer for VALHAN MUSCLES. Focused on evidence-based training programs, balanced weekly volume distribution, and sustainable progressive routines.'
            )}</p>

            <div style="margin-top: 14px;">
              <a class="social-btn btn-ig" href="https://www.instagram.com/_mohameddhatem1" target="_blank" rel="noopener noreferrer" style="padding: 13px 24px; font-size: 1rem; border-radius: 12px; display: inline-flex; align-items: center; gap: 10px;">
                <i class="fa-brands fa-instagram" style="font-size: 1.3rem;"></i>
                <span>${t('تواصل عبر Instagram (@_mohameddhatem1)', 'Connect on Instagram (@_mohameddhatem1)')}</span>
                <i class="fa-solid fa-arrow-up-right-from-square" style="font-size: .85rem; margin-inline-start: 4px;"></i>
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- About The Coach in VALHAN MUSCLES -->
      <section class="section">
        <div class="container">
          <div class="about-panel reveal">
            <span class="eyebrow"><i class="fa-solid fa-clipboard-check"></i> ROLE IN VALHAN MUSCLES</span>
            <h2 class="section-title">${t('دور المدرب في مشروع VALHAN MUSCLES', 'Role in VALHAN MUSCLES')}</h2>
            <p>${t(
              'تتمحور مساهمة كابتن محمد حاتم في منصة VALHAN MUSCLES حول بناء وتدقيق الأسس التدريبية للموقع؛ بداية من تحديد <strong>الحجم التدريبي المعتمد (88 مجموعة أسبوعياً)</strong> وتوزيعه بتردد متكافئ على الأنظمة التدريبية المختلفة، وصولاً إلى اختيار زوايا التمارين المناسبة وإرشادات الأداء الحركي.',
              'Coach Mohamed Hatem engineered the training methodology of VALHAN MUSCLES: establishing the <strong>approved unified volume (88 sets/week)</strong> across the 7 training systems, selecting optimal exercise variations, and providing form execution cues.'
            )}</p>
            <p class="muted">${t(
              'الهدف الأساسي هو تقديم محتوى تدريبي واقعي ومنظم يمكن لأي متدرب تطبيقه والالتزام به، مع مراعاة التعافي العضلي وتجنب الإجهاد الزائد، والابتعاد تماماً عن الممارسات العشوائية أو الوعود غير المنطقية.',
              'The core mission is providing realistic, structured workout plans with adequate recovery intervals, eliminating random routines and unverified promises.'
            )}</p>
            <div style="margin-top: 20px;">
              <a class="btn btn-primary" href="${root}/pages/workout-plans.html">
                <span>${t('تصفح الجداول التدريبية المعتمدة', 'Explore Certified Workout Plans')}</span>
                <i class="fa-solid fa-arrow-left"></i>
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- Coaching Philosophy Section -->
      <section class="section" style="border-top: 1px solid var(--line); padding-top: 60px;">
        <div class="container">
          <div class="section-head">
            <span class="eyebrow">COACHING PILLARS</span>
            <h2 class="section-title">${t('فلسفة ومنهجية التدريب (Coaching Philosophy)', 'Coaching Philosophy')}</h2>
            <p class="muted">${t(
              'مبادئ تدريبية علمية تضمن سلامة الأداء، فاعلية التحفيز العضلي، والتطور المستمر على المدى البعيد.',
              'Fundamental training principles ensuring joint safety, effective muscle stimulus, and sustainable long-term progression.'
            )}</p>
          </div>

          <div class="philosophy-grid">
            <article class="philosophy-card reveal">
              <span class="philosophy-number">01</span>
              <h3 class="philosophy-title">${t('التخطيط التدريبي المنظم', 'Structured Workout Planning')}</h3>
              <p class="philosophy-desc">${t(
                'تنظيم الحصص الأسبوعية بناءً على أيام التدريب وفترات الراحة يضمن استشفاء العضلات والجهاز العصبي، ويمنع تراكم الإجهاد السلبي الذي يعيق التطور.',
                'Scheduling sessions with planned rest intervals guarantees muscle and central nervous system recovery, preventing cumulative fatigue.'
              )}</p>
            </article>

            <article class="philosophy-card reveal">
              <span class="philosophy-number">02</span>
              <h3 class="philosophy-title">${t('اختيار التمارين المناسبة', 'Exercise Selection')}</h3>
              <p class="philosophy-desc">${t(
                'اختيار التمارين التي توفر ثباتاً مفصلياً ومقاومة ملائمة لطبيعة الجسم الحركية، والجمع المتوازن بين التمارين المركبة ذات العائد العالي وتمارين العزل المستهدفة.',
                'Selecting movements that provide joint stability and optimal resistance curves, balancing high-yield compound lifts with targeted isolation.'
              )}</p>
            </article>

            <article class="philosophy-card reveal">
              <span class="philosophy-number">03</span>
              <h3 class="philosophy-title">${t('التنظيم الصحيح للحصة', 'Proper Training Organization')}</h3>
              <p class="philosophy-desc">${t(
                'ترتيب التمارين داخل الحصة بذكاء؛ تقديم الحركات التي تتطلب طاقة وتركيزاً أعلى أولاً، مع موازنة حجم التدريب وتفادي التكرار غير المفيد.',
                'Sequencing exercises strategically: placing high-demand compound lifts first, balancing session volume, and avoiding redundant fatigue.'
              )}</p>
            </article>

            <article class="philosophy-card reveal">
              <span class="philosophy-number">04</span>
              <h3 class="philosophy-title">${t('التطور والتحميل التدريجي', 'Progressive Development')}</h3>
              <p class="philosophy-desc">${t(
                'التركيز على إتقان التكنيك الحركي، ومدى الحركة الكامل، والتحكم في مرحلة النزول، ثم التدرج المحسوب في الأوزان أو التكرارات عبر الأسابيع.',
                'Mastering movement execution, full range of motion, and eccentric control, followed by measured increases in weight or repetitions over time.'
              )}</p>
            </article>

            <article class="philosophy-card reveal" style="grid-column: span 2;">
              <span class="philosophy-number">05</span>
              <h3 class="philosophy-title">${t('الاستمرارية والالتزام', 'Consistency & Adherence')}</h3>
              <p class="philosophy-desc">${t(
                'أفضل خطة تدريبية هي الخطة التي تستطيع الالتزام بها بانتظام على مدار الشهور والسنوات. الاستمرارية في أداء الأساسيات والتغذية والراحة هي جوهر البناء البدني الحقيقي.',
                'The best training program is the one you can adhere to consistently over months and years. Consistency in basics, nutrition, and rest drives true physical development.'
              )}</p>
            </article>
          </div>
        </div>
      </section>

      <!-- Coach Contact Section -->
      <section class="section" style="border-top: 1px solid var(--line);">
        <div class="container">
          <div class="coach-contact-card reveal">
            <span class="eyebrow" style="color:var(--red2);"><i class="fa-solid fa-envelope-open-text"></i> CONTACT & INQUIRIES</span>
            <h2>${t('تواصل مع كابتن محمد حاتم', 'Get in Touch with Coach Mohamed Hatem')}</h2>
            <p>${t(
              'للاستفسارات الرياضية ومتابعة المحتوى التدريبي اليومي والنصائح العملية، يمكنك التواصل مباشرة عبر الحساب الرسمي على Instagram:',
              'For coaching inquiries, daily training tips, and practical workout guidance, connect directly via Instagram:'
            )}</p>

            <div style="margin-bottom: 24px;">
              <a class="social-btn btn-ig" href="https://www.instagram.com/_mohameddhatem1" target="_blank" rel="noopener noreferrer" style="padding: 14px 28px; font-size: 1.05rem; display: inline-flex;">
                <i class="fa-brands fa-instagram" style="font-size: 1.4rem;"></i>
                <span>Instagram: @_mohameddhatem1</span>
                <i class="fa-solid fa-arrow-up-right-from-square" style="font-size: .85rem; margin-inline-start: 6px;"></i>
              </a>
            </div>

            <div style="display:flex; justify-content:center; gap:12px; flex-wrap:wrap;">
              <a class="btn btn-outline" href="${root}/pages/our-team.html">
                <i class="fa-solid fa-arrow-right"></i>
                <span>${t('العودة لصفحة الفريق', 'Back to Team Hub')}</span>
              </a>
              <a class="btn btn-outline" href="${root}/index.html">
                <span>${t('العودة للصفحة الرئيسية', 'Back to Home')}</span>
                <i class="fa-solid fa-house"></i>
              </a>
              <a class="btn btn-outline" href="${root}/pages/developer.html">
                <span>${t('بورتفوليو المطور Simo', 'Developer Simo Portfolio')}</span>
                <i class="fa-solid fa-arrow-left"></i>
              </a>
            </div>
          </div>
        </div>
      </section>`;
  }

  const main = document.getElementById('main-content');
  if (main) {
    if (page === 'home') main.innerHTML = home();
    if (page === 'plans') main.innerHTML = plansPage();
    if (page === 'builder') main.innerHTML = builderPage();
    if (page === 'academy') main.innerHTML = academy();
    if (page === 'about') main.innerHTML = about();
    if (page === 'team') main.innerHTML = teamPage();
    if (page === 'developer') main.innerHTML = developerPage();
    if (page === 'coach') main.innerHTML = coachPage();
  }

  // Handle Plans Page Interactions
  if (page === 'plans') {
    const grid = document.getElementById('plans-grid');
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
          <a class="btn btn-primary" href="${root}/pages/workout-builder.html">
            <i class="fa-solid fa-wrench"></i> ${t('فتح في منشئ الخطط والتعديل', 'Open in Workout Builder')}
          </a>
          <a class="btn btn-outline" href="${root}/assets/reference-workout.pdf" target="_blank">
            <i class="fa-solid fa-file-pdf"></i> ${t('عرض الدليل المرجعي الكامل PDF', 'View Full Reference PDF')}
          </a>
        </div>`;

      document.getElementById('plan-modal')?.classList.add('open');
    });

    document.querySelector('[data-close]')?.addEventListener('click', () => {
      document.getElementById('plan-modal')?.classList.remove('open');
    });
  }

  // Scroll reveal observer
  window.ValhanReveal = () => {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: .08 });

    document.querySelectorAll('.reveal:not(.is-visible)').forEach(el => io.observe(el));
  };
  window.ValhanReveal();
})();
