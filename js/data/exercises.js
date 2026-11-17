(() => {
  'use strict';

  const exercises = [
    ['incline-chest-smith', 'Incline Chest Press (Smith)', 'الصدر', 'Smith Machine', 'machines/smith-machine.webp', 'اضبط المقعد بزاوية مائلة، وثبّت لوحي الكتف ثم ادفع البار لأعلى بتحكم.', 'Upper chest'], ['cable-lateral-raise', 'Cable Lateral Raise', 'الكتف الجانبي', 'Cable', 'machines/cable-crossover.webp', 'ارفع الذراع جانبًا مع ثبات الجذع ومرفق مثني قليلًا.', 'Side delts'], ['chest-fly-machine', 'Machine Chest Fly', 'الصدر', 'Machine', 'machines/pec-deck.webp', 'اجمع الذراعين أمام الصدر دون مبالغة في مدى الحركة.', 'Chest'], ['machine-shoulder-press', 'Machine Shoulder Press', 'الكتف الأمامي', 'Machine', 'machines/shoulder-press.webp', 'ادفع المقابض لأعلى مع إبقاء الظهر مستندًا للمقعد.', 'Front delts'], ['triceps-pushdown', 'Triceps Pushdown', 'الترايسبس', 'Cable', 'attachments-accessories/triceps-rope.webp', 'ثبّت المرفقين بجانب الجسم وادفع المقبض لأسفل.', 'Triceps'], ['lat-pulldown', 'Lat Pulldown', 'الظهر', 'Cable', 'machines/lat-pulldown.webp', 'اسحب المقبض نحو أعلى الصدر دون تأرجح أو سحب خلف الرقبة.', 'Lats'], ['t-bar-row', 'T-Bar Row', 'الظهر', 'T-Bar / Barbell', 'benches-racks/power-rack.webp', 'اسحب المقبض نحو الجذع مع الحفاظ على الظهر محايدًا.', 'Mid back'], ['close-grip-lat-pulldown', 'Close Grip Lat Pulldown', 'الظهر', 'Cable', 'machines/lat-pulldown.webp', 'اسحب المقبض الضيق نحو أعلى الصدر مع تحكم في الرجوع.', 'Lats'], ['rear-delt-fly', 'Rear Delt Fly', 'الكتف الخلفي', 'Machine / Dumbbells', 'machines/pec-deck.webp', 'افتح الذراعين للخلف مع تقليل مشاركة الترابيس.', 'Rear delts'], ['shrugs', 'Dumbbell Shrugs', 'الترابيس', 'Dumbbells', 'free-weights/adjustable-dumbbells.webp', 'ارفع الكتفين لأعلى دون تدويرهما ثم انزل ببطء.', 'Traps'], ['cable-biceps-curl', 'Cable Biceps Curl', 'البايسبس', 'Cable', 'attachments-accessories/d-handle.webp', 'اثنِ المرفقين مع تثبيت العضد وتجنب دفع الورك.', 'Biceps'], ['lower-back-extension', 'Back Extension', 'أسفل الظهر', 'Bench', 'benches-racks/preacher-curl-bench.webp', 'تحرك من مفصل الورك بمدى مريح مع ظهر محايد.', 'Lower back'], ['leg-press', 'Leg Press', 'الأرجل', 'Machine', 'machines/leg-press.webp', 'انزل بالمنصة حتى مدى مريح مع ثبات الحوض والقدمين.', 'Quads / Glutes'], ['leg-curl', 'Seated Leg Curl', 'خلفية الرجل', 'Machine', 'machines/seated-leg-curl.webp', 'اثنِ الركبتين بتحكم ثم عد ببطء دون ارتداد.', 'Hamstrings'], ['leg-extension', 'Leg Extension', 'أمامية الرجل', 'Machine', 'machines/leg-extension.webp', 'مد الركبتين بسلاسة وتجنب قفل المفصل بعنف.', 'Quads'], ['romanian-deadlift', 'Romanian Deadlift', 'خلفية الرجل', 'Barbell', 'free-weights/olympic-barbell.webp', 'ادفع الورك للخلف مع انثناء بسيط للركبة وظهر محايد.', 'Hamstrings / Glutes'], ['hip-adductor', 'Hip Adductor', 'العضلات الضامة', 'Machine', 'machines/hip-adductor.webp', 'قرّب الفخذين بتحكم مع الحفاظ على وضع الجلوس.', 'Adductors'], ['standing-calf-raise', 'Standing Calf Raise', 'السمانة', 'Machine', 'machines/standing-calf-raise.webp', 'ارفع الكعبين لأعلى ثم انزل ببطء خلال مدى مريح.', 'Calves'], ['barbell-bench-press', 'Barbell Bench Press', 'الصدر', 'Barbell', 'free-weights/flat-bench.webp', 'اخفض البار بتحكم إلى منتصف الصدر ثم ادفع لأعلى.', 'Chest'], ['incline-dumbbell-press', 'Incline Dumbbell Press', 'الصدر', 'Dumbbells', 'free-weights/adjustable-incline-bench.webp', 'اضغط الدمبل لأعلى مع تثبيت الكتفين.', 'Upper chest'], ['seated-cable-row', 'Seated Cable Row', 'الظهر', 'Cable', 'machines/seated-row.webp', 'اسحب المقبض نحو الجذع مع ضم لوحي الكتف.', 'Mid back'], ['overhead-press', 'Overhead Press', 'الأكتاف', 'Barbell', 'free-weights/olympic-barbell.webp', 'ادفع البار فوق الرأس مع شد الجذع وعدم المبالغة في تقوس الظهر.', 'Shoulders'], ['dumbbell-curl', 'Dumbbell Curl', 'البايسبس', 'Dumbbells', 'free-weights/adjustable-dumbbells.webp', 'ارفع الدمبل دون تحريك المرفقين للأمام.', 'Biceps'], ['squat', 'Barbell Squat', 'الأرجل', 'Barbell', 'benches-racks/squat-rack.webp', 'انزل بتحكم مع توزيع الوزن على كامل القدم.', 'Quads / Glutes'], ['plank', 'Plank', 'البطن', 'Bodyweight', 'benches-racks/aerobic-step.webp', 'حافظ على خط مستقيم من الرأس حتى الكعبين مع شد الجذع.', 'Core']
  ].map(([id, name, muscle, equipment, image, how, target]) => {
    const arabicNames = {
      'incline-chest-smith': 'ضغط صدر مائل (سميث)', 'cable-lateral-raise': 'رفرفة جانبي كيبل',
      'chest-fly-machine': 'تفتيح صدر جهاز', 'machine-shoulder-press': 'ضغط كتف جهاز',
      'triceps-pushdown': 'دفع ترايسبس كيبل', 'lat-pulldown': 'سحب علوي', 't-bar-row': 'سحب تي بار',
      'close-grip-lat-pulldown': 'سحب علوي ضيق', 'rear-delt-fly': 'رفرفة كتف خلفي',
      'shrugs': 'هز الكتفين بالدمبل', 'cable-biceps-curl': 'ثني بايسبس كيبل',
      'lower-back-extension': 'تمديد أسفل الظهر', 'leg-press': 'دفع الأرجل', 'leg-curl': 'ثني خلفية الفخذ جالس',
      'leg-extension': 'تمديد الركبة', 'romanian-deadlift': 'ديدليفت روماني', 'hip-adductor': 'تقريب الفخذين',
      'standing-calf-raise': 'رفع السمانة واقف', 'barbell-bench-press': 'ضغط صدر بالبار',
      'incline-dumbbell-press': 'ضغط صدر مائل بالدمبل', 'seated-cable-row': 'سحب كيبل جالس',
      'overhead-press': 'ضغط فوق الرأس', 'dumbbell-curl': 'ثني بايسبس بالدمبل',
      'squat': 'سكوات بالبار', 'plank': 'بلانك'
    };
    const muscleMap = {
      'الصدر': ['chest'], 'الكتف الجانبي': ['side-delts'], 'الكتف الأمامي': ['front-delts'],
      'الترايسبس': ['triceps'], 'الظهر': ['lats'], 'الكتف الخلفي': ['rear-delts'],
      'الترابيس': ['traps'], 'البايسبس': ['biceps'], 'أسفل الظهر': ['lower-back'],
      'الأرجل': ['quads'], 'خلفية الرجل': ['hamstrings'], 'العضلات الضامة': ['adductors'],
      'السمانة': ['calves'], 'الأكتاف': ['shoulders'], 'البطن': ['core'], 'أمامية الرجل': ['quads']
    };
    const equipmentMap = {
      'Smith Machine': ['smith-machine'], 'Cable': ['cable'], 'Machine': ['machine'],
      'Cable': ['cable'], 'T-Bar / Barbell': ['t-bar', 'barbell'],
      'Machine / Dumbbells': ['machine', 'dumbbells'], 'Dumbbells': ['dumbbells'],
      'Bench': ['bench'], 'Barbell': ['barbell'], 'Bodyweight': ['bodyweight']
    };
    const primaryMuscles = muscleMap[muscle] || [];
    return {
      id,
      name: { ar: arabicNames[id] || name, en: name },
      legacyName: name,
      primaryMuscles,
      secondaryMuscles: [],
      equipmentOptions: equipmentMap[equipment] || [],
      movementPattern: null,
      image,
      instructions: { ar: how, en: '' },
      reviewStatus: 'pending',
      // Backward-compatible fields used by the current Exercise Library and Builder.
      legacy: { name, muscle, equipment, how, target },
      muscle, equipment, how, target
    };
  });

  // Compatibility fields remain available to the existing Exercise Library and Builder.
  window.ValhanExerciseName = exercise => {
    const language = window.ValhanLang?.() || 'ar';
    return exercise?.name?.[language] || exercise?.name?.en || exercise?.legacyName || '';
  };
  window.ValhanExercises = exercises;
})();
