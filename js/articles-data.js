/* VALHAN Academy — article content. Pairs are [arabic, english]. */
window.ValhanArticles = {
  cats: [
    { id: 'training', icon: 'fa-dumbbell', n: ['التدريب', 'Training'] },
    { id: 'nutrition', icon: 'fa-apple-whole', n: ['التغذية', 'Nutrition'] },
    { id: 'recovery', icon: 'fa-moon', n: ['الاستشفاء', 'Recovery'] },
    { id: 'science', icon: 'fa-flask', n: ['علوم التمرين', 'Exercise Science'] },
    { id: 'basics', icon: 'fa-seedling', n: ['أساسيات اللياقة', 'Fitness Basics'] }
  ],
  list: [
    {
      slug: 'calories-energy-balance', cat: 'nutrition', min: 5, disc: true,
      related: ['bmr-tdee', 'macronutrients', 'food-labels'],
      title: ['فهم السعرات الحرارية وميزان الطاقة', 'Understanding Calories and Energy Balance'],
      intro: ['السعرة الحرارية مجرد وحدة لقياس الطاقة، لكن فهمها يساعدك على اتخاذ قرارات غذائية أوضح دون هوس بالأرقام.', 'A calorie is simply a unit of energy. Understanding it helps you make clearer food choices without obsessing over numbers.'],
      sections: [
        { h: ['ما هي السعرة الحرارية؟', 'What is a calorie?'], p: [['السعرة (kcal) هي كمية الطاقة التي يمنحها الطعام لجسمك. تأتي من البروتين والكربوهيدرات والدهون (وكذلك الكحول)، ويستخدمها الجسم في وظائفه الحيوية وهضم الطعام والحركة والتمرين.', 'A calorie (kcal) is the amount of energy food gives your body. It comes from protein, carbohydrates and fat (and alcohol), and is used for vital functions, digestion, movement and training.']] },
        { h: ['ميزان الطاقة', 'Energy balance'], p: [['عندما تتقارب الطاقة الداخلة مع المصروفة يميل الوزن إلى الثبات. وعندما تزيد الداخلة باستمرار يزداد الوزن تدريجيًا، وعندما تقل باستمرار يقل تدريجيًا.', 'When intake roughly matches expenditure, weight tends to stay stable. Consistently higher intake leads to gradual gain; consistently lower intake leads to gradual loss.'], ['الواقع أكثر تعقيدًا: الوزن اليومي يتأثر بالماء والملح والجلايكوجين، وتقدير سعرات الطعام تقريبي، لذلك راقب الاتجاه على مدى أسابيع.', 'Reality is more complex: daily weight shifts with water, salt and glycogen, and food calorie estimates are approximate, so watch the trend over weeks.']], fig: 'balance', cap: ['ثلاث حالات لميزان الطاقة (رسم توضيحي مبسّط)', 'Three energy-balance states (simplified illustration)'] },
        { h: ['كيف تستفيد منها عمليًا؟', 'Using it in practice'], ul: [
          ['راقب متوسط وزنك عبر أسابيع لا أيام.', 'Watch your weight trend over weeks, not days.'],
          ['اجعل التعديلات صغيرة وتدريجية، وقيّم النتيجة قبل أي تغيير جديد.', 'Keep changes small and gradual, and judge the result before changing again.'],
          ['اهتم بجودة الطعام: بروتين كافٍ، ألياف، وأطعمة تشبعك.', 'Care about food quality: enough protein, fibre and filling foods.'],
          ['تجنب العجز الحاد والحميات القاسية؛ فهي صعبة الاستمرار وقد تضر بالأداء والصحة.', 'Avoid severe deficits and crash diets; they are hard to sustain and can harm performance and health.']
        ] }
      ]
    },
    {
      slug: 'bmr-tdee', cat: 'nutrition', min: 6, disc: true,
      related: ['calories-energy-balance', 'macronutrients', 'training-volume'],
      title: ['كيف يُحسب الإنفاق اليومي للطاقة: BMR و TDEE', 'How Daily Energy Expenditure Works: BMR and TDEE'],
      intro: ['يحرق جسمك طاقة طوال اليوم حتى وأنت ساكن. إليك كيف تُقدَّر هذه الطاقة ولماذا تبقى الأرقام مجرد نقطة بداية.', 'Your body burns energy all day, even at rest. Here is how that energy is estimated and why the numbers are only a starting point.'],
      sections: [
        { h: ['ما هو BMR؟', 'What is BMR?'], p: [['معدل الأيض الأساسي (BMR) هو الطاقة التي يحتاجها جسمك في راحة تامة لدعم التنفس والدورة الدموية ووظائف الأعضاء. يُقدَّر بمعادلات تنبؤية، من أشهرها معادلة Mifflin–St Jeor:', 'Basal metabolic rate (BMR) is the energy your body needs at complete rest for breathing, circulation and organ function. It is estimated with predictive equations, a well-known one being Mifflin–St Jeor:']], code: 'BMR (men)   = 10 × kg + 6.25 × cm − 5 × age + 5\nBMR (women) = 10 × kg + 6.25 × cm − 5 × age − 161', post: [['هذه متوسطات لمجموعات سكانية، وقد يختلف جسمك عنها بفارق ملحوظ.', 'These are population averages; your body may differ noticeably.']] },
        { h: ['مكونات TDEE', 'Components of TDEE'], p: [['إجمالي الإنفاق اليومي (TDEE) هو مجموع ما يحرقه جسمك في اليوم: BMR، والتأثير الحراري للطعام (TEF)، ونشاط الحياة اليومية خارج التمرين (NEAT)، والتمرين المنظم (EAT).', 'Total daily energy expenditure (TDEE) is everything your body burns in a day: BMR, the thermic effect of food (TEF), non-exercise activity (NEAT) and structured exercise (EAT).']], fig: 'tdee', cap: ['نسب تقريبية تختلف من شخص لآخر', 'Approximate shares that vary between people'] },
        { h: ['من BMR إلى TDEE', 'From BMR to TDEE'], p: [['يُقدَّر TDEE بضرب BMR في معامل النشاط:', 'TDEE is estimated by multiplying BMR by an activity factor:']], code: 'TDEE = BMR × activity factor', ul: [
          ['1.2 — خامل: عمل مكتبي وتمرين قليل', '1.2 — Sedentary: desk work, little exercise'],
          ['1.375 — نشاط خفيف: 1–3 حصص خفيفة أسبوعيًا', '1.375 — Light: 1–3 light sessions weekly'],
          ['1.55 — متوسط: 3–5 حصص أسبوعيًا', '1.55 — Moderate: 3–5 sessions weekly'],
          ['1.725 — مرتفع: 6–7 حصص شاقة أسبوعيًا', '1.725 — High: 6–7 hard sessions weekly'],
          ['1.9 — مرتفع جدًا: عمل بدني مع تمرين يومي', '1.9 — Very high: physical job plus daily training']
        ], post: [['مثال حسابي توضيحي فقط: رجل عمره 25 سنة، 70 كجم، 175 سم ← BMR ≈ 1,674 كالوري، وبمعامل 1.55 يصبح TDEE ≈ 2,594 كالوري. هذه أرقام للتوضيح وليست توصية شخصية.', 'Illustrative arithmetic only: a 25-year-old man, 70 kg, 175 cm → BMR ≈ 1,674 kcal; with a 1.55 factor, TDEE ≈ 2,594 kcal. These numbers are for illustration, not a personal recommendation.']] },
        { h: ['حدود هذه الأرقام', 'Limits of these numbers'], ul: [
          ['هي تقديرات، وليست قياسًا فعليًا لجسمك.', 'They are estimates, not measurements of your body.'],
          ['قارنها بتغير وزنك الفعلي على مدى 2–3 أسابيع قبل أي تعديل.', 'Compare them with your real weight trend over 2–3 weeks before adjusting.'],
          ['الساعات وأجهزة التتبع قد تبالغ في تقدير الحرق.', 'Watches and trackers can overestimate calories burned.'],
          ['إذا كانت لديك حالة صحية أو حمل أو تاريخ مع اضطرابات الأكل، فاستشر مختصًا قبل أي تغيير غذائي.', 'If you have a medical condition, are pregnant, or have a history of disordered eating, consult a professional before changing your diet.']
        ] }
      ]
    },
    {
      slug: 'macronutrients', cat: 'nutrition', min: 6, disc: true,
      related: ['calories-energy-balance', 'food-labels', 'recovery-sleep'],
      title: ['فهم المغذيات الكبرى (Macronutrients)', 'Understanding Macronutrients'],
      intro: ['البروتين والكربوهيدرات والدهون هي المصادر الثلاثة لطاقة الغذاء، ولكل منها دور مختلف في الأداء والاستشفاء والصحة.', 'Protein, carbohydrates and fat are the three sources of food energy, each with a different role in performance, recovery and health.'],
      sections: [
        { h: ['ثلاثة مصادر للطاقة', 'Three energy sources'], p: [['يمنح الجرام الواحد من البروتين والكربوهيدرات نحو 4 كالوري، أما الدهون فنحو 9 كالوري. لذلك تحمل الأطعمة الدهنية سعرات أكثر في حجم أصغر.', 'One gram of protein or carbohydrate gives about 4 kcal, while fat gives about 9 kcal. That is why fatty foods carry more calories in a smaller volume.']], fig: 'macros', cap: ['الطاقة لكل جرام', 'Energy per gram'] },
        { h: ['دور كل منها', 'What each one does'], ul: [
          ['البروتين: بناء وإصلاح الأنسجة ويزيد الإحساس بالشبع.', 'Protein: builds and repairs tissue and increases fullness.'],
          ['الكربوهيدرات: الوقود الرئيسي للتمارين عالية الشدة وتدعم تخزين الجلايكوجين.', 'Carbohydrates: the main fuel for high-intensity training; they support glycogen storage.'],
          ['الدهون: ضرورية للهرمونات وامتصاص الفيتامينات الذائبة في الدهون.', 'Fat: essential for hormones and absorbing fat-soluble vitamins.']
        ] },
        { h: ['كم نحتاج؟ مبادئ عامة', 'How much? General principles'], p: [['تشير أبحاث كثيرة على المتدربين بالمقاومة إلى أن نحو 1.6–2.2 جم بروتين لكل كجم من وزن الجسم يوميًا نطاق شائع الاستخدام. أما الكربوهيدرات والدهون فيُوزَّع الباقي بينهما حسب التفضيل ومستوى النشاط.', 'Much research on resistance-trained people points to roughly 1.6–2.2 g of protein per kg of body weight per day as a commonly used range. Carbohydrates and fat share the remainder according to preference and activity level.']], ul: [
          ['لا تخفض الدهون إلى مستوى منخفض جدًا لفترات طويلة.', 'Do not push fat very low for long periods.'],
          ['لا تهمل الألياف والخضروات والفاكهة والسوائل.', 'Do not neglect fibre, vegetables, fruit and fluids.'],
          ['أصحاب أمراض الكلى أو الحالات الخاصة يستشيرون الطبيب قبل رفع البروتين.', 'People with kidney disease or other conditions should ask a doctor before raising protein.']
        ] }
      ]
    },
    {
      slug: 'food-labels', cat: 'basics', min: 5, disc: true,
      related: ['macronutrients', 'calories-energy-balance', 'bmr-tdee'],
      title: ['كيف تقرأ ملصقات الأغذية', 'How to Read Food Labels'],
      intro: ['ملصق القيم الغذائية يختصر معلومات كثيرة إذا عرفت أين تنظر. هذه الخطوات تجعل المقارنة بين المنتجات أسرع وأدق.', 'The nutrition label packs a lot of information if you know where to look. These steps make comparing products faster and more accurate.'],
      sections: [
        { h: ['ابدأ بحجم الحصة', 'Start with serving size'], p: [['كل الأرقام في الملصق مرتبطة بحجم الحصة. أكثر الأخطاء شيوعًا أن تأكل العبوة كلها وتحسب سعرات حصة واحدة. انتبه إلى عدد الحصص في العبوة.', 'Every number on the label refers to the serving size. The most common mistake is eating the whole pack but counting one serving. Check the servings per container.']] },
        { h: ['أهم الأسطر', 'The lines that matter'], ul: [
          ['السعرات الحرارية لكل حصة.', 'Calories per serving.'],
          ['البروتين: قارنه بالسعرات لمعرفة كثافته الغذائية.', 'Protein: compare it with calories to judge its density.'],
          ['السكريات المضافة والدهون المشبعة: الأفضل ألا تكون مرتفعة.', 'Added sugars and saturated fat: better kept modest.'],
          ['الألياف: كلما زادت كان ذلك أفضل عمومًا.', 'Fibre: generally the more the better.'],
          ['الصوديوم: انتبه له خاصة في الأطعمة المصنعة.', 'Sodium: watch it, especially in processed foods.']
        ] },
        { h: ['المكونات والعبارات التسويقية', 'Ingredients and marketing claims'], p: [['تُرتَّب المكونات من الأكثر وزنًا إلى الأقل. وعبارات مثل «طبيعي» أو «خفيف» أو «عالي البروتين» ليست دائمًا مقياسًا موحدًا، فاحكم من الأرقام الفعلية.', 'Ingredients are listed from most to least by weight. Claims such as “natural”, “light” or “high protein” are not always standardised, so judge by the actual numbers.']] },
        { h: ['روتين سريع', 'A quick routine'], ul: [
          ['قارن المنتجات باستخدام قيم «لكل 100 جم».', 'Compare products using the “per 100 g” values.'],
          ['تحقق من حجم الحصة وعدد الحصص.', 'Check serving size and number of servings.'],
          ['انظر إلى البروتين والألياف والسكريات المضافة والصوديوم.', 'Look at protein, fibre, added sugars and sodium.'],
          ['اقرأ أول ثلاثة مكونات.', 'Read the first three ingredients.']
        ] }
      ]
    },
    {
      slug: 'choose-split', cat: 'training', min: 6,
      related: ['training-volume', 'progressive-overload', 'recovery-sleep'],
      cta: ['workout-plans.html', 'تصفح الجداول الجاهزة', 'Browse ready-made plans'],
      title: ['كيف تختار تقسيمة تدريب مناسبة؟', 'Choosing a Suitable Workout Split'],
      intro: ['أفضل تقسيمة هي التي تلتزم بها بانتظام وتمنح كل عضلة تحفيزًا كافيًا ووقتًا للتعافي.', 'The best split is the one you can follow consistently that gives each muscle enough stimulus and time to recover.'],
      sections: [
        { h: ['ابدأ من جدولك الواقعي', 'Start from your real schedule'], p: [['حدّد عدد الأيام التي تستطيع الالتزام بها فعلًا في الأسبوع ومدة الحصة المناسبة لك، ثم اختر التقسيمة التي تناسب ذلك لا العكس.', 'Decide how many days you can truly commit to each week and how long a session can last, then pick the split that fits, not the other way round.']] },
        { h: ['أشهر التقسيمات', 'Common splits'], ul: [
          ['Full Body (2–4 أيام): تردد عالٍ لكل عضلة، مناسب للمبتدئين وضيق الوقت.', 'Full Body (2–4 days): high frequency per muscle, great for beginners and tight schedules.'],
          ['Upper / Lower (4 أيام): توازن جيد بين الحجم والتعافي.', 'Upper / Lower (4 days): a good balance of volume and recovery.'],
          ['Push / Pull / Legs (3–6 أيام): مرن ويتيح حجمًا أكبر لكل عضلة.', 'Push / Pull / Legs (3–6 days): flexible and allows more volume per muscle.'],
          ['Anterior / Posterior (4–5 أيام): توزيع حسب السلسلة الحركية الأمامية والخلفية.', 'Anterior / Posterior (4–5 days): organised by front and back movement chains.'],
          ['Arnold Split (6 أيام): صدر وظهر، ثم أكتاف وذراع، ثم أرجل، وتتكرر.', 'Arnold Split (6 days): chest & back, shoulders & arms, legs, repeated.']
        ], fig: 'week', cap: ['مثال أسبوعي: Upper / Lower بأربعة أيام', 'Weekly example: 4-day Upper / Lower'] },
        { h: ['قواعد بسيطة للاختيار', 'Simple selection rules'], ul: [
          ['تدريب كل عضلة نحو مرتين أسبوعيًا نقطة بداية جيدة لمعظم المتدربين.', 'Training each muscle about twice a week is a good default for most people.'],
          ['كلما قلّت الأيام المتاحة مال الاختيار إلى Full Body أو Upper / Lower.', 'The fewer days you have, the more Full Body or Upper / Lower makes sense.'],
          ['لا تغيّر التقسيمة إلا عند توقف التقدم أو عدم ملاءمتها لجدولك.', 'Change your split only when progress stalls or it no longer fits your schedule.']
        ] }
      ]
    },
    {
      slug: 'progressive-overload', cat: 'science', min: 5,
      related: ['training-volume', 'recovery-sleep', 'choose-split'],
      cta: ['workout-builder.html', 'أنشئ خطتك وسجّل تقدمك', 'Build your plan and track progress'],
      title: ['التحميل التدريجي (Progressive Overload)', 'Progressive Overload'],
      intro: ['العضلات تتكيف مع ما يُطلب منها. للاستمرار في التطور يجب أن يزيد المطلوب منها تدريجيًا بمرور الأسابيع.', 'Muscles adapt to what is asked of them. To keep improving, the demand must increase gradually over the weeks.'],
      sections: [
        { h: ['الفكرة الأساسية', 'The core idea'], p: [['إذا كررت نفس الحصة بنفس الأوزان إلى ما لا نهاية فسيتوقف التكيف. التحميل التدريجي يعني رفع التحدي بخطوات صغيرة يمكن للجسم استيعابها.', 'If you repeat the same session with the same weights forever, adaptation stops. Progressive overload means raising the challenge in small steps the body can absorb.']] },
        { h: ['طرق زيادة التحدي', 'Ways to raise the challenge'], ul: [
          ['زيادة الوزن.', 'Add weight.'],
          ['زيادة التكرارات بنفس الوزن.', 'Add reps at the same weight.'],
          ['زيادة عدد المجموعات تدريجيًا.', 'Add sets gradually.'],
          ['تحسين جودة الأداء ومدى الحركة والتحكم.', 'Improve technique, range of motion and control.'],
          ['تقليل فترات الراحة مع الحفاظ على جودة الأداء.', 'Shorten rest while keeping quality.']
        ], fig: 'overload', cap: ['تقدم تدريجي عبر الأسابيع (رسم توضيحي)', 'Gradual progress across weeks (illustration)'] },
        { h: ['التدرج المزدوج: مثال', 'Double progression: an example'], p: [['اختر نطاق تكرارات، ولا ترفع الوزن إلا عندما تبلغ أعلى النطاق في كل المجموعات:', 'Pick a rep range and only add weight once you reach the top of the range on every set:']], code: '3 sets × 8–12 reps\nWeek 1: 8, 8, 7   → keep weight\nWeek 3: 12, 12, 11 → keep weight\nWeek 4: 12, 12, 12 → add a small load, restart near 8' },
        { h: ['تنبيهات مهمة', 'Important cautions'], ul: [
          ['سجّل تمارينك لتعرف أين تتقدم.', 'Log your training so you can see where you progress.'],
          ['لا تضحِّ بجودة الأداء من أجل رقم أكبر.', 'Do not sacrifice form for a bigger number.'],
          ['يبطؤ التقدم مع الخبرة، وهذا طبيعي.', 'Progress slows with experience, which is normal.'],
          ['عند تراكم الإجهاد فكّر في أسبوع تخفيف (Deload).', 'When fatigue accumulates, consider a deload week.']
        ] }
      ]
    },
    {
      slug: 'recovery-sleep', cat: 'recovery', min: 6,
      related: ['progressive-overload', 'training-volume', 'calories-energy-balance'],
      title: ['الاستشفاء والنوم', 'Recovery and Sleep'],
      intro: ['العضلات لا تنمو أثناء التمرين بل أثناء التعافي منه. النوم والراحة جزء من البرنامج وليسا رفاهية.', 'Muscles do not grow during the workout but while recovering from it. Sleep and rest are part of the program, not a luxury.'],
      sections: [
        { h: ['دورة التكيف', 'The adaptation cycle'], p: [['التمرين يسبب إجهادًا مؤقتًا، ثم يأتي التعافي، ثم يتكيف الجسم ليصبح أقوى قليلًا. الإخلال بأي حلقة يبطئ التقدم.', 'Training causes temporary stress, recovery follows, and the body adapts to become slightly stronger. Breaking any link slows progress.']], fig: 'recovery', cap: ['حلقة التدريب والتعافي والتكيف', 'The train–recover–adapt loop'] },
        { h: ['النوم', 'Sleep'], p: [['يحتاج معظم البالغين إلى نحو 7–9 ساعات نوم ليلًا. قلة النوم ترتبط بانخفاض الأداء والتركيز وتغير الشهية.', 'Most adults need about 7–9 hours of sleep a night. Short sleep is linked with lower performance, poorer focus and changes in appetite.']], ul: [
          ['حافظ على مواعيد نوم واستيقاظ ثابتة.', 'Keep consistent sleep and wake times.'],
          ['تجنب الكافيين في ساعات المساء المتأخرة.', 'Avoid caffeine late in the day.'],
          ['اجعل الغرفة مظلمة وهادئة ومعتدلة الحرارة.', 'Keep the room dark, quiet and cool.'],
          ['قلل الشاشات قبل النوم بوقت كافٍ.', 'Cut screen time well before bed.']
        ] },
        { h: ['عوامل أخرى للاستشفاء', 'Other recovery levers'], ul: [
          ['طاقة وبروتين كافيان على مدار اليوم.', 'Enough energy and protein through the day.'],
          ['الترطيب وإدارة التوتر.', 'Hydration and stress management.'],
          ['أيام راحة مجدولة وأسابيع تخفيف عند الحاجة.', 'Scheduled rest days and deload weeks when needed.']
        ] },
        { h: ['علامات نقص التعافي', 'Signs of under-recovery'], p: [['إرهاق مستمر، تراجع الأداء لأسابيع، اضطراب النوم أو المزاج. خفّف الحمل وحسّن النوم. وإذا استمر الألم أو ظهرت إصابة فاستشر مختصًا.', 'Persistent fatigue, performance dropping for weeks, disturbed sleep or mood. Reduce load and improve sleep. If pain persists or an injury appears, see a professional.']] }
      ]
    },
    {
      slug: 'training-volume', cat: 'training', min: 6,
      related: ['choose-split', 'progressive-overload', 'recovery-sleep'],
      cta: ['workout-builder.html', 'اضبط حجمك في المنشئ', 'Tune your volume in the builder'],
      title: ['فهم الحجم التدريبي (Training Volume)', 'Understanding Training Volume'],
      intro: ['الحجم التدريبي من أهم متغيرات البرنامج، لكن «الأكثر» ليس دائمًا «الأفضل». المهم هو الحجم الذي تستطيع التعافي منه.', 'Training volume is one of the most important program variables, but “more” is not always “better”. What matters is the volume you can recover from.'],
      sections: [
        { h: ['ما هو الحجم؟', 'What is volume?'], p: [['يُقاس الحجم عادةً بعدد المجموعات الفعلية الشاقة لكل عضلة في الأسبوع. وهناك مقياس آخر هو الحمل الكلي (المجموعات × التكرارات × الوزن).', 'Volume is usually measured as the number of hard working sets per muscle per week. Another measure is volume load (sets × reps × weight).']] },
        { h: ['العلاقة بين الحجم والنتائج', 'Volume versus results'], p: [['تشير الأبحاث إلى أن زيادة المجموعات ترتبط عمومًا بنمو أكبر حتى حد معين، ثم تقل الفائدة المضافة. تختلف النقطة المثلى من شخص لآخر.', 'Research suggests more sets generally relate to more growth up to a point, after which the added benefit shrinks. The sweet spot differs between people.']], fig: 'volume', cap: ['منحنى توضيحي لتناقص العائد (بدون أرقام دقيقة)', 'Illustrative diminishing-returns curve (no exact numbers)'] },
        { h: ['كيف تضبط حجمك؟', 'How to tune your volume'], ul: [
          ['ابدأ من الجزء المنخفض من نطاقك وارفع تدريجيًا.', 'Start at the lower end of your range and build gradually.'],
          ['أضف مجموعة أو مجموعتين فقط عند توقف التقدم مع بقاء التعافي جيدًا.', 'Add one or two sets only when progress stalls and recovery is still good.'],
          ['خفّض الحجم إذا تراجع الأداء أو النوم.', 'Reduce volume if performance or sleep declines.'],
          ['وزّع الحجم على حصتين أو أكثر في الأسبوع لكل عضلة.', 'Spread volume over two or more sessions per muscle each week.'],
          ['احسب المجموعات الجادة القريبة من الفشل، وتذكر أن بعض التمارين تُدرِّب عضلات إضافية.', 'Count hard sets near failure, and remember some lifts also train secondary muscles.']
        ] }
      ]
    }
  ]
};

// Metadata is intentionally pending until the coach confirms authorship, review and sources.
window.ValhanArticles.list.forEach(article => {
  article.id = article.id || article.slug;
  article.author = article.author || null;
  article.reviewer = article.reviewer || null;
  article.reviewDate = article.reviewDate || null;
  article.sources = Array.isArray(article.sources) ? article.sources : [];
  article.reviewStatus = article.reviewStatus || 'pending';
  article.difficulty = article.difficulty || 'unrated';
});
