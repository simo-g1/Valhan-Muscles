(() => {
  'use strict';
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

  // Shared with workout-builder.js (conversion + PDF) so there is a single source of truth

  const exerciseIds = {
    'Incline Chest': 'incline-chest-smith', 'Incline Chest Press (Smith)': 'incline-chest-smith',
    'Fly Machine': 'chest-fly-machine', 'Machine Chest Fly': 'chest-fly-machine',
    'Lat Pulldown': 'lat-pulldown', 'T-Bar Row': 't-bar-row',
    'Close-Grip Pulldown': 'close-grip-lat-pulldown', 'Close Grip Lat Pulldown': 'close-grip-lat-pulldown',
    'Leg Press': 'leg-press', 'Leg Extension': 'leg-extension', 'RDL': 'romanian-deadlift',
    'Romanian Deadlift': 'romanian-deadlift', 'Leg Curl': 'leg-curl', 'Seated Leg Curl': 'leg-curl',
    'Hip Adductor': 'hip-adductor', 'Standing Calf Raise': 'standing-calf-raise',
    'Back Extension': 'lower-back-extension', 'Cable Biceps Curl': 'cable-biceps-curl',
    'Cable Lateral Raise': 'cable-lateral-raise', 'Dumbbell Shrugs': 'shrugs',
    'Rear Delt Fly': 'rear-delt-fly', 'Machine Shoulder Press': 'machine-shoulder-press',
    'Triceps Pushdown': 'triceps-pushdown'
  };
  const focusIds = {
    'Front Delts': 'front-delts', 'Lateral Raises': 'side-delts', 'Rear Delts': 'rear-delts',
    'Traps': 'traps', 'Biceps': 'biceps', 'Triceps': 'triceps', 'Calves': 'calves',
    'Adductors': 'adductors', 'Lower Back': 'lower-back'
  };
  plans.forEach(plan => {
    plan.normalizedSchedule = plan.schedule.map(day => ({
      day: day.day,
      entries: day.exercises.map(([label, arabicLabel, setsText]) => {
        const exerciseId = exerciseIds[label];
        const sets = Number((setsText.match(/\d+/) || [0])[0]);
        if (exerciseId) return { type: 'exercise', exerciseId, label: { ar: arabicLabel, en: label }, sets, reps: null };
        return { type: 'muscle-focus', muscleId: focusIds[label] || null, label: { ar: arabicLabel, en: label }, sets, reps: null, reviewStatus: 'pending' };
      })
    }));
  });
  window.ValhanPlans = plans;
})();
