# VALHAN MUSCLES — Implementation Progress
**Release candidate:** November 17, 2026

## Architecture
- Browser-only application using semantic HTML, CSS, Vanilla JavaScript, and LocalStorage.
- Arabic RTL / English LTR and dark/light themes remain supported by the existing shell.
- Shared page integration is loaded on all 12 site pages.
- Dashboard entry point: `pages/dashboard.html`.
- New feature controller: `js/features/platform.js`.

## Completed scope
### Foundation and existing systems
- Updates 1–10 remain in the supplied project foundation.
- Update 11 Related Content System: retained and stabilized; stable IDs connect exercises, muscles, equipment, plans, and articles.
- Update 12 Saved Articles & Exercises: hardened, shared across all pages, write failures reported, UI refresh event added.
- Anatomy visual and current muscle mapping retained. No silent replacement of the approved anatomy asset.

### New platform features
- Update 13 Dashboard Layout: complete initial dashboard.
- Update 14 Recent Activity: supported navigation and platform actions.
- Update 15 Export/Import JSON: schema-versioned allow-list, validation, explicit merge confirmation; unrelated keys are not cleared.
- Update 16 Workout Completion: log a selected non-rest day from the saved builder plan.
- Update 17 Training History: list, editable session notes, deletion.
- Update 18 Workout Calendar: current-month calendar with logged session counts.
- Update 19 Progress Dashboard: six-week logged-session consistency and aggregate logged working sets.
- Update 20 Personal Notes: general or linked to exercise, plan, or builder day.
- Update 21 Exercise Comparison: side-by-side available data.
- Update 22 Exercise Alternatives: shared-primary-muscle suggestions, clearly not equivalence claims.
- Update 23 Rest Timer: timestamp-based countdown; recalculates after background throttling.
- Update 24 Superset Builder: persistent create/list/delete of exercise groups.
- Update 25 Share Card: downloadable bilingual SVG plan summary.
- Update 26 Equipment Explorer: equipment-to-exercise filtering using normalized IDs.
- Update 27 Glossary: bilingual searchable starter glossary.
- Update 28 Nutrition Education: general educational material added to Dashboard; existing Academy article content untouched.
- Update 29 Energy Education: BMR/TDEE concepts only; no personal calorie calculator or target, especially for minors.

## Data keys
Existing keys preserved:
- `valhan-lang`
- `valhan-theme`
- `valhan-builder-v3`
- `valhan-builder-import`
- `valhan-builder-backup`
- `valhan-saved-articles-v1`
- `valhan-reading-progress-v1`

New keys:
- `valhan-saved-exercises-v1`
- `valhan-activity-v1`
- `valhan-training-history-v1`
- `valhan-personal-notes-v1`
- `valhan-training-calendar-v1`
- `valhan-supersets-v1`
- `valhan-comparisons-v1` (reserved for future saved comparisons; comparison currently runs live)

## Content and safety constraints
- `js/articles-data.js` remains byte-for-byte identical to the supplied project source.
- Do not remove or rewrite existing Academy content without coach review and owner approval.
- Training Volume educational article remains; Training Volume Calculator is not reintroduced.
- No review-status fields/badges or invented reviewer metadata are added.
- No personalized calorie targets are generated. Energy feature is educational-only.

## Release status
All planned update surfaces are implemented at an initial integrated level. Static validation is complete; manual visual and interaction QA remains necessary before treating this as production-ready. See `TEST_REPORT.md` for exact checks and limitations.
