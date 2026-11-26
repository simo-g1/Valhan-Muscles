(() => {
  'use strict';

  const exercises = [
    // ── CHEST ──────────────────────────────────────────────────────────────────
    ['incline-chest-smith', 'Incline Chest Press (Smith)', 'الصدر', 'Smith Machine', 'machines/incline-press-machine.webp', 'اضبط المقعد بزاوية مائلة، وثبّت لوحي الكتف ثم ادفع البار لأعلى بتحكم.', 'Upper chest'],
    ['chest-fly-machine', 'Machine Chest Fly', 'الصدر', 'Machine', 'machines/pec-deck-fly.webp', 'اجمع الذراعين أمام الصدر دون مبالغة في مدى الحركة.', 'Chest'],
    ['barbell-bench-press', 'Barbell Bench Press', 'الصدر', 'Barbell', 'benches-racks/flat-bench.webp', 'اخفض البار بتحكم إلى منتصف الصدر ثم ادفع لأعلى.', 'Chest'],
    ['incline-dumbbell-press', 'Incline Dumbbell Press', 'الصدر', 'Dumbbells', 'benches-racks/incline-bench.webp', 'اضغط الدمبل لأعلى مع تثبيت الكتفين.', 'Upper chest'],
    ['chest-press-machine', 'Chest Press Machine', 'الصدر', 'Machine', 'machines/machine-chest-press.webp', 'ادفع المقابض لأمام حتى تمديد الكوع مع تثبيت الظهر.', 'Chest'],

    // ── SHOULDERS ──────────────────────────────────────────────────────────────
    ['cable-lateral-raise', 'Cable Lateral Raise', 'الكتف الجانبي', 'Cable', null, 'ارفع الذراع جانبًا مع ثبات الجذع ومرفق مثني قليلًا.', 'Side delts'],
    ['machine-shoulder-press', 'Machine Shoulder Press', 'الكتف الأمامي', 'Machine', 'machines/shoulder-press.webp', 'ادفع المقابض لأعلى مع إبقاء الظهر مستندًا للمقعد.', 'Front delts'],
    ['rear-delt-fly', 'Rear Delt Fly', 'الكتف الخلفي', 'Machine / Dumbbells', null, 'افتح الذراعين للخلف مع تقليل مشاركة الترابيس.', 'Rear delts'],
    ['overhead-press', 'Overhead Press', 'الأكتاف', 'Barbell', 'free-weights/barbell-with-plates.webp', 'ادفع البار فوق الرأس مع شد الجذع وعدم المبالغة في تقوس الظهر.', 'Shoulders'],
    ['shrugs', 'Dumbbell Shrugs', 'الترابيس', 'Dumbbells', 'additional-equipment/dumbbell-pair.webp', 'ارفع الكتفين لأعلى دون تدويرهما ثم انزل ببطء.', 'Traps'],

    // ── ARMS ───────────────────────────────────────────────────────────────────
    ['triceps-pushdown', 'Triceps Pushdown', 'الترايسبس', 'Cable', 'attachments-accessories/triceps-rope.webp', 'ثبّت المرفقين بجانب الجسم وادفع المقبض لأسفل.', 'Triceps'],
    ['cable-biceps-curl', 'Cable Biceps Curl', 'البايسبس', 'Cable', 'attachments-accessories/single-d-handle.webp', 'اثنِ المرفقين مع تثبيت العضد وتجنب دفع الورك.', 'Biceps'],
    ['dumbbell-curl', 'Dumbbell Curl', 'البايسبس', 'Dumbbells', 'additional-equipment/dumbbell-pair.webp', 'ارفع الدمبل دون تحريك المرفقين للأمام.', 'Biceps'],
    ['preacher-curl-machine', 'Preacher Curl Machine', 'البايسبس', 'Machine', 'machines/machine-preacher-curl.webp', 'ضع الذراعين على المنصة المائلة وثنِ المرفقين ببطء.', 'Biceps'],

    // ── BACK ───────────────────────────────────────────────────────────────────
    ['lat-pulldown', 'Lat Pulldown', 'الظهر', 'Cable', 'machines/lat-pulldown.webp', 'اسحب المقبض نحو أعلى الصدر دون تأرجح أو سحب خلف الرقبة.', 'Lats'],
    ['close-grip-lat-pulldown', 'Close Grip Lat Pulldown', 'الظهر', 'Cable', 'machines/lat-pulldown.webp', 'اسحب المقبض الضيق نحو أعلى الصدر مع تحكم في الرجوع.', 'Lats'],
    ['t-bar-row', 'T-Bar Row', 'الظهر', 'T-Bar / Barbell', null, 'اسحب المقبض نحو الجذع مع الحفاظ على الظهر محايدًا.', 'Mid back'],
    ['seated-cable-row', 'Seated Cable Row', 'الظهر', 'Cable', 'machines/seated-cable-row.webp', 'اسحب المقبض نحو الجذع مع ضم لوحي الكتف.', 'Mid back'],
    ['lower-back-extension', 'Back Extension', 'أسفل الظهر', 'Bench', 'machines/back-extension.webp', 'تحرك من مفصل الورك بمدى مريح مع ظهر محايد.', 'Lower back'],
    ['assisted-pull-up', 'Assisted Pull-Up', 'الظهر', 'Machine', 'machines/assisted-pull-up.webp', 'اسحب الجسم لأعلى بمساعدة الجهاز حتى مستوى الذقن مع الشريط.', 'Lats'],

    // ── LEGS & GLUTES ──────────────────────────────────────────────────────────
    ['leg-press', 'Leg Press', 'الأرجل', 'Machine', 'machines/leg-press.webp', 'انزل بالمنصة حتى مدى مريح مع ثبات الحوض والقدمين.', 'Quads / Glutes'],
    ['leg-curl', 'Seated Leg Curl', 'خلفية الرجل', 'Machine', null, 'اثنِ الركبتين بتحكم ثم عد ببطء دون ارتداد.', 'Hamstrings'],
    ['leg-extension', 'Leg Extension', 'أمامية الرجل', 'Machine', 'machines/leg-extension.webp', 'مد الركبتين بسلاسة وتجنب قفل المفصل بعنف.', 'Quads'],
    ['romanian-deadlift', 'Romanian Deadlift', 'خلفية الرجل', 'Barbell', 'free-weights/barbell-with-plates.webp', 'ادفع الورك للخلف مع انثناء بسيط للركبة وظهر محايد.', 'Hamstrings / Glutes'],
    ['hip-adductor', 'Hip Adductor', 'العضلات الضامة', 'Machine', 'machines/hip-adductor.webp', 'قرّب الفخذين بتحكم مع الحفاظ على وضع الجلوس.', 'Adductors'],
    ['hip-abductor', 'Hip Abductor', 'العضلات المبعِّدة', 'Machine', 'machines/hip-abductor.webp', 'ابعد الفخذين بتحكم مع الحفاظ على وضع الجلوس.', 'Abductors'],
    ['glute-kickback-machine', 'Glute Kickback Machine', 'المؤخرة', 'Machine', 'machines/glute-kickback-machine.webp', 'ثبّت الجذع على المسند وادفع الساق للخلف بتحكم مع عصر عضلة المؤخرة.', 'Glutes'],
    ['standing-calf-raise', 'Standing Calf Raise', 'السمانة', 'Machine', 'machines/calf-raise.webp', 'ارفع الكعبين لأعلى ثم انزل ببطء خلال مدى مريح.', 'Calves'],
    ['squat', 'Barbell Squat', 'الأرجل', 'Barbell', 'benches-racks/squat-rack.webp', 'انزل بتحكم مع توزيع الوزن على كامل القدم.', 'Quads / Glutes'],
    ['hack-squat', 'Hack Squat', 'الأرجل', 'Machine', 'machines/hack-squat.webp', 'ضع الكتفين تحت الألواح وانزل حتى مدى مريح.', 'Quads'],
    ['lying-leg-curl', 'Lying Leg Curl', 'خلفية الرجل', 'Machine', 'machines/lying-leg-curl.webp', 'اثنِ الركبتين في وضع الاستلقاء مع تثبيت الحوض.', 'Hamstrings'],

    // ── CORE ──────────────────────────────────────────────────────────────────
    ['plank', 'Plank', 'البطن', 'Bodyweight', 'additional-equipment/exercise-mat.webp', 'حافظ على خط مستقيم من الرأس حتى الكعبين مع شد الجذع.', 'Core'],
    ['vertical-knee-raise', 'Vertical Knee Raise', 'البطن', 'Machine', 'machines/vertical-knee-raise.webp', 'ارفع الركبتين نحو الصدر مع تثبيت الكوعين على المتكآت.', 'Core / Hip flexors'],

    // ── CARDIO ────────────────────────────────────────────────────────────────
    ['treadmill-cardio', 'Treadmill', 'الكارديو', 'Cardio Machine', 'cardio/treadmill.webp', 'ابدأ بسرعة مريحة وارفعها تدريجيًا مع الحفاظ على خطوة منتظمة.', 'Cardiovascular'],
    ['rowing-ergometer', 'Rowing Ergometer', 'الكارديو', 'Cardio Machine', null, 'ادفع بالرجلين أولًا ثم اسحب المقبض نحو الجذع بتسلسل صحيح.', 'Full body / Cardiovascular'],
    ['spin-bike', 'Spin Bike', 'الكارديو', 'Cardio Machine', null, 'اضبط ارتفاع المقعد بحيث تبقى الركبة شبه ممدودة عند القمة.', 'Cardiovascular / Legs'],
    ['elliptical-trainer', 'Elliptical Trainer', 'الكارديو', 'Cardio Machine', 'cardio/recumbent-bike.webp', 'تحرك بحركة بيضاوية منتظمة مع توزيع الجهد بين الذراعين والرجلين.', 'Cardiovascular'],
    ['stair-climber', 'Stair Climber', 'الكارديو', 'Cardio Machine', 'cardio/rowing-ergometer.webp', 'تسلّق الدرجات بوتيرة ثابتة مع تجنب الاعتماد الكامل على المقبض.', 'Cardiovascular / Legs'],
    ['air-bike', 'Air Bike', 'الكارديو', 'Cardio Machine', null, 'استخدم الذراعين والرجلين معًا بوتيرة عالية لتحقيق أقصى جهد قلبي.', 'Full body / Cardiovascular'],
    ['recumbent-bike', 'Recumbent Bike', 'الكارديو', 'Cardio Machine', null, 'اجلس مع دعم الظهر الكامل واضبط المقاومة بما يناسبك.', 'Cardiovascular / Legs'],

  ].map(([id, name, muscle, equipment, image, how, target]) => {
    const arabicNames = {
      'incline-chest-smith': 'ضغط صدر مائل (سميث)',
      'cable-lateral-raise': 'رفرفة جانبي كيبل',
      'chest-fly-machine': 'تفتيح صدر جهاز',
      'machine-shoulder-press': 'ضغط كتف جهاز',
      'triceps-pushdown': 'دفع ترايسبس كيبل',
      'lat-pulldown': 'سحب علوي',
      't-bar-row': 'سحب تي بار',
      'close-grip-lat-pulldown': 'سحب علوي ضيق',
      'rear-delt-fly': 'رفرفة كتف خلفي',
      'shrugs': 'هز الكتفين بالدمبل',
      'cable-biceps-curl': 'ثني بايسبس كيبل',
      'lower-back-extension': 'تمديد أسفل الظهر',
      'leg-press': 'دفع الأرجل',
      'leg-curl': 'ثني خلفية الفخذ جالس',
      'leg-extension': 'تمديد الركبة',
      'romanian-deadlift': 'ديدليفت روماني',
      'hip-adductor': 'تقريب الفخذين',
      'hip-abductor': 'تبعيد الفخذين',
      'glute-kickback-machine': 'دفع المؤخرة للخلف جهاز',
      'standing-calf-raise': 'رفع السمانة واقف',
      'barbell-bench-press': 'ضغط صدر بالبار',
      'incline-dumbbell-press': 'ضغط صدر مائل بالدمبل',
      'seated-cable-row': 'سحب كيبل جالس',
      'overhead-press': 'ضغط فوق الرأس',
      'dumbbell-curl': 'ثني بايسبس بالدمبل',
      'squat': 'سكوات بالبار',
      'plank': 'بلانك',
      'chest-press-machine': 'ضغط صدر جهاز',
      'preacher-curl-machine': 'ثني بايسبس جهاز بريتشر',
      'assisted-pull-up': 'عقلة بمساعدة الجهاز',
      'hack-squat': 'سكوات هاك',
      'lying-leg-curl': 'ثني خلفية الفخذ مستلقيًا',
      'vertical-knee-raise': 'رفع الركبتين عموديًا',
      'treadmill-cardio': 'جهاز الجري (تريدميل)',
      'rowing-ergometer': 'جهاز التجديف',
      'spin-bike': 'دراجة سبين',
      'elliptical-trainer': 'جهاز الإليبتيكال',
      'stair-climber': 'جهاز تسلق الدرج',
      'air-bike': 'دراجة الهواء',
      'recumbent-bike': 'دراجة مائلة',
    };

    const muscleMap = {
      'الصدر': ['chest'],
      'الكتف الجانبي': ['side-delts'],
      'الكتف الأمامي': ['front-delts'],
      'الترايسبس': ['triceps'],
      'الظهر': ['lats'],
      'الكتف الخلفي': ['rear-delts'],
      'الترابيس': ['traps'],
      'البايسبس': ['biceps'],
      'أسفل الظهر': ['lower-back'],
      'الأرجل': ['quads'],
      'خلفية الرجل': ['hamstrings'],
      'العضلات الضامة': ['adductors'],
      'العضلات المبعِّدة': ['abductors'],
      'المؤخرة': ['glutes'],
      'السمانة': ['calves'],
      'الأكتاف': ['shoulders'],
      'البطن': ['core'],
      'أمامية الرجل': ['quads'],
      'الكارديو': ['cardiovascular'],
    };

    // Specific verified primary & secondary muscles per exercise
    const detailedPrimaryMap = {
      't-bar-row': ['mid-back', 'lats'],
      'seated-cable-row': ['mid-back', 'lats'],
      'lat-pulldown': ['lats'],
      'close-grip-lat-pulldown': ['lats'],
      'leg-press': ['quads', 'glutes'],
      'squat': ['quads', 'glutes'],
      'hack-squat': ['quads', 'glutes'],
      'romanian-deadlift': ['hamstrings', 'glutes'],
      'overhead-press': ['front-delts', 'shoulders'],
      'assisted-pull-up': ['lats'],
      'lying-leg-curl': ['hamstrings'],
      'glute-kickback-machine': ['glutes'],
      'treadmill-cardio': ['cardiovascular'],
      'rowing-ergometer': ['cardiovascular', 'mid-back'],
      'spin-bike': ['cardiovascular', 'quads'],
      'elliptical-trainer': ['cardiovascular'],
      'stair-climber': ['cardiovascular', 'glutes'],
      'air-bike': ['cardiovascular'],
      'recumbent-bike': ['cardiovascular', 'quads'],
    };

    const detailedSecondaryMap = {
      'incline-chest-smith': ['front-delts', 'triceps'],
      'barbell-bench-press': ['front-delts', 'triceps'],
      'incline-dumbbell-press': ['front-delts', 'triceps'],
      'chest-fly-machine': ['front-delts'],
      'chest-press-machine': ['front-delts', 'triceps'],
      'machine-shoulder-press': ['triceps'],
      'overhead-press': ['triceps', 'traps'],
      'lat-pulldown': ['biceps', 'forearms'],
      'close-grip-lat-pulldown': ['biceps', 'forearms'],
      't-bar-row': ['biceps', 'traps', 'forearms'],
      'seated-cable-row': ['biceps', 'rear-delts', 'forearms'],
      'assisted-pull-up': ['biceps', 'forearms'],
      'cable-biceps-curl': ['forearms'],
      'dumbbell-curl': ['forearms'],
      'preacher-curl-machine': ['forearms'],
      'shrugs': ['forearms'],
      'leg-press': ['hamstrings', 'calves'],
      'squat': ['hamstrings', 'calves', 'core'],
      'hack-squat': ['hamstrings', 'calves'],
      'romanian-deadlift': ['lower-back', 'forearms'],
      'lower-back-extension': ['glutes', 'hamstrings'],
      'glute-kickback-machine': ['hamstrings'],
      'plank': ['obliques', 'shoulders'],
      'vertical-knee-raise': ['obliques'],
      'rowing-ergometer': ['biceps', 'legs', 'core'],
      'spin-bike': ['calves', 'hamstrings'],
      'stair-climber': ['quads', 'calves'],
    };

    const equipmentMap = {
      'Smith Machine': ['smith-machine'],
      'Cable': ['cable'],
      'Machine': ['machine'],
      'T-Bar / Barbell': ['t-bar', 'barbell'],
      'Machine / Dumbbells': ['machine', 'dumbbells'],
      'Dumbbells': ['dumbbells'],
      'Bench': ['bench'],
      'Barbell': ['barbell'],
      'Bodyweight': ['bodyweight'],
      'Cardio Machine': ['cardio'],
    };

    const primaryMuscles = detailedPrimaryMap[id] || muscleMap[muscle] || [];
    const secondaryMuscles = detailedSecondaryMap[id] || [];

    return {
      id,
      name: { ar: arabicNames[id] || name, en: name },
      legacyName: name,
      primaryMuscles,
      secondaryMuscles,
      equipmentOptions: equipmentMap[equipment] || [],
      movementPattern: null,
      image,
      instructions: { ar: how, en: '' },
      // Backward-compatible fields used by existing views
      legacy: { name, muscle, equipment, how, target },
      muscle,
      equipment,
      how,
      target
    };
  });

  window.ValhanExercises = exercises;
})();
