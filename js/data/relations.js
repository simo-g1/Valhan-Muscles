(() => {
  'use strict';

  // Article to topics & plans relationship mapping using stable IDs
  const articleRelations = {
    'calories-energy-balance': {
      relatedExercises: [],
      relatedMuscles: [],
      relatedPlans: ['ul4', 'ul5', 'ulppl', 'fullbody4'],
      tags: ['nutrition', 'energy', 'health']
    },
    'bmr-tdee': {
      relatedExercises: [],
      relatedMuscles: [],
      relatedPlans: ['ul5', 'ppl5'],
      tags: ['nutrition', 'metabolism', 'tdee']
    },
    'macronutrients': {
      relatedExercises: [],
      relatedMuscles: [],
      relatedPlans: [],
      tags: ['nutrition', 'protein', 'recovery']
    },
    'food-labels': {
      relatedExercises: [],
      relatedMuscles: [],
      relatedPlans: [],
      tags: ['nutrition', 'education']
    },
    'choose-split': {
      relatedExercises: ['barbell-bench-press', 'squat', 'lat-pulldown', 'overhead-press'],
      relatedMuscles: ['chest', 'lats', 'quads', 'shoulders'],
      relatedPlans: ['ul4', 'ul5', 'ulppl', 'ap4', 'ap5', 'arnold', 'fullbody4', 'ppl5'],
      tags: ['training', 'splits', 'programming']
    },
    'progressive-overload': {
      relatedExercises: ['barbell-bench-press', 'squat', 't-bar-row', 'overhead-press', 'incline-chest-smith'],
      relatedMuscles: ['chest', 'quads', 'mid-back', 'shoulders'],
      relatedPlans: ['ul4', 'ul5', 'ppl5', 'arnold'],
      tags: ['training', 'overload', 'strength']
    },
    'recovery-sleep': {
      relatedExercises: [],
      relatedMuscles: [],
      relatedPlans: ['ul4', 'fullbody4'],
      tags: ['recovery', 'sleep', 'fatigue']
    },
    'training-volume': {
      relatedExercises: ['lat-pulldown', 'machine-shoulder-press', 'chest-fly-machine', 'leg-extension'],
      relatedMuscles: ['chest', 'lats', 'front-delts', 'triceps', 'quads'],
      relatedPlans: ['ul4', 'ul5', 'ulppl', 'ap4', 'ap5', 'arnold', 'fullbody4', 'ppl5'],
      tags: ['training', 'volume', 'hypertrophy']
    }
  };

  function getExercises() {
    return window.ValhanExercises || [];
  }

  function getMuscles() {
    return window.ValhanMuscles || [];
  }

  function getEquipment() {
    return window.ValhanEquipment || [];
  }

  function getPlans() {
    return window.ValhanWorkoutPlans || window.ValhanPlans || [];
  }

  function getArticles() {
    return window.ValhanArticles?.list || [];
  }

  const Relations = {
    // 1. Muscle -> Exercises
    getExercisesForMuscle(muscleId) {
      if (!muscleId) return { primary: [], secondary: [], all: [] };
      const allEx = getExercises();
      const primary = allEx.filter(e => (e.primaryMuscles || []).includes(muscleId));
      const secondary = allEx.filter(e => (e.secondaryMuscles || []).includes(muscleId));
      return {
        primary,
        secondary,
        all: [...primary, ...secondary.filter(s => !primary.some(p => p.id === s.id))]
      };
    },

    // 2. Exercise -> Muscles
    getMusclesForExercise(exerciseId) {
      const ex = getExercises().find(e => e.id === exerciseId);
      if (!ex) return { primary: [], secondary: [] };
      const muscles = getMuscles();
      return {
        primary: (ex.primaryMuscles || []).map(mid => muscles.find(m => m.id === mid)).filter(Boolean),
        secondary: (ex.secondaryMuscles || []).map(mid => muscles.find(m => m.id === mid)).filter(Boolean)
      };
    },

    // 3. Equipment -> Exercises
    getExercisesForEquipment(equipmentId) {
      if (!equipmentId) return [];
      return getExercises().filter(e => (e.equipmentOptions || []).includes(equipmentId));
    },

    // 4. Exercise -> Plans
    getPlansForExercise(exerciseId) {
      if (!exerciseId) return [];
      const plans = getPlans();
      return plans.filter(plan => {
        const days = plan.normalizedSchedule || [];
        return days.some(day =>
          (day.entries || []).some(entry =>
            entry.type === 'exercise' && entry.exerciseId === exerciseId
          )
        );
      });
    },

    // 5. Exercise -> Related Articles
    getArticlesForExercise(exerciseId) {
      if (!exerciseId) return [];
      const articles = getArticles();
      return articles.filter(a => {
        const rel = articleRelations[a.slug];
        return rel && rel.relatedExercises.includes(exerciseId);
      });
    },

    // 6. Muscle -> Related Articles
    getArticlesForMuscle(muscleId) {
      if (!muscleId) return [];
      const articles = getArticles();
      return articles.filter(a => {
        const rel = articleRelations[a.slug];
        return rel && rel.relatedMuscles.includes(muscleId);
      });
    },

    // 7. Plan -> Related Articles
    getArticlesForPlan(planId) {
      if (!planId) return [];
      const articles = getArticles();
      return articles.filter(a => {
        const rel = articleRelations[a.slug];
        return rel && rel.relatedPlans.includes(planId);
      });
    },

    // 8. Article -> Related Entities
    getRelatedContentForArticle(slug) {
      const rel = articleRelations[slug] || { relatedExercises: [], relatedMuscles: [], relatedPlans: [] };
      const allEx = getExercises();
      const allMuscles = getMuscles();
      const allPlans = getPlans();

      return {
        exercises: rel.relatedExercises.map(id => allEx.find(e => e.id === id)).filter(Boolean),
        muscles: rel.relatedMuscles.map(id => allMuscles.find(m => m.id === id)).filter(Boolean),
        plans: rel.relatedPlans.map(id => allPlans.find(p => p.id === id)).filter(Boolean)
      };
    }
  };

  window.ValhanRelations = Relations;
})();
