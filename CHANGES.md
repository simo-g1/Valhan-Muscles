# VALHAN MUSCLES — Full Feature Release Candidate
**Date:** November 17, 2026

## Scope
This release candidate consolidates the previously stabilized foundation (anatomy, related content, saved articles/exercises) and implements the remaining roadmap features (Updates 13–29) as one integrated browser-only experience. The new Dashboard is the main home for tracking, tools, and educational utilities.

## Added
- `pages/dashboard.html` — unified dashboard and feature hub.
- `css/platform.css` — responsive dashboard, history, calendar, comparison, timer, glossary, and education styles.
- `js/features/platform.js` — activity tracking, dashboard metrics, workout completion, training history, monthly calendar, progress overview, personal notes linked to exercises/plans/days, safe JSON export/import, exercise comparison, data-driven alternatives, equipment explorer, persistent superset groups, rest timer, SVG workout share card, bilingual glossary, and age-safe energy/nutrition education UI.

## Updated
- All 12 site pages now load the shared saved-content and platform integration modules, including the home page. A Dashboard navigation entry is injected consistently.
- `js/features/saved-content.js` — storage write failures now surface an error instead of falsely reporting success; successful changes dispatch a cross-page update event and refresh bookmark UI.
- `pages/dashboard.html` and `css/platform.css` provide the new platform interface.
- `IMPLEMENTATION_PROGRESS.md` and `TEST_REPORT.md` document implementation and verification.

## Update coverage
- 11 Related Content System — retained/stabilized in existing relation layer.
- 12 Saved Articles & Exercises — hardened and loaded across all pages.
- 13 Dashboard Layout — implemented.
- 14 Recent Activity — implemented for navigation and key platform actions.
- 15 Export/Import JSON — versioned allow-listed backup and non-destructive merge flow.
- 16 Workout Completion — logs selected current-builder day.
- 17 Training History — list, notes, delete.
- 18 Workout Calendar — current-month view from completed-session records.
- 19 Progress Dashboard — session consistency over six weeks and recorded-set totals.
- 20 Personal Notes — general notes or notes attached to an exercise, plan, or builder day.
- 21 Exercise Comparison — side-by-side comparison using available exercise data.
- 22 Exercise Alternatives — data-driven suggestions based on shared primary muscles; explicitly not asserted equivalent.
- 23 Workout Timer — timestamp-based countdown that catches up after background-tab throttling.
- 24 Superset Builder — create, persist, list, and delete exercise groups.
- 25 Workout Share Card — downloadable SVG with Arabic/English text direction.
- 26 Equipment Explorer — filter exercises using normalized equipment IDs.
- 27 Fitness Glossary — bilingual searchable starter glossary.
- 28 Nutrition Education — general educational cards; existing articles were not rewritten.
- 29 Energy Education — BMR/TDEE concepts only; no individualized calorie estimate or target.

## Preserved
- `js/articles-data.js` is byte-for-byte unchanged from the supplied `all.zip`.
- Existing article titles, paragraphs, sections, and training-volume educational content remain unchanged.
- Existing LocalStorage keys are retained; new feature data uses versioned `valhan-*-v1` keys.
- Existing anatomy artwork and mapping are retained.
- No files are intentionally deleted.

## Known limitations
- This is a front-end/localStorage application; data remains browser/device-specific unless exported.
- Activity tracking records key navigation and supported feature actions, not every possible interaction.
- The calendar displays the current month only; history stores the full available log.
- Progress charts reflect logged sessions and recorded working sets only; they do not infer strength, body composition, or muscle growth.
- Exercise alternatives are suggestions from the available primary-muscle data, not coach-certified substitutions.
- The glossary is a starter set and should be expanded/reviewed by the coach before being treated as a comprehensive reference.
- Nutrition/energy content is educational and not individualized advice. The Energy section intentionally does not calculate calorie targets.
- Superset groups are saved as reusable group definitions in the dashboard; they are not automatically inserted into an existing builder day.
- Browser-based visual, keyboard, screen-reader, and cross-device QA still requires manual testing in the user's browser.
