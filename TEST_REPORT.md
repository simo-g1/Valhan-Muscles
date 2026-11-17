# VALHAN MUSCLES — Test Report
**Date:** November 17, 2026

## Automated checks performed

| Check | Result | Notes |
|---|---|---|
| JavaScript syntax | PASS | Every `.js` file under `js/` passes `node --check`. |
| Local HTML references | PASS | All local `src` and `href` references across 12 HTML pages resolve. |
| Shared feature integration | PASS | `platform.js` and `saved-content.js` are included on all 12 pages. |
| Dashboard assets | PASS | Dashboard HTML and platform stylesheet exist at referenced paths. |
| Exercise records | PASS | 25 exercise records load. |
| Muscle records | PASS | 19 muscle records load. |
| Equipment records | PASS | 9 equipment records load. |
| Workout plans | PASS | 8 plan records load. |
| Exercise → muscle references | PASS | No primary/secondary muscle IDs missing from muscle data. |
| Exercise → equipment references | PASS | No equipment IDs missing from equipment data. |
| Plan → exercise references | PASS | No normalized plan exercise references missing from exercise data. |
| Article content preservation | PASS | `js/articles-data.js` is byte-for-byte unchanged from supplied `all.zip`. |
| Review-state remnants | PASS with note | No review workflow was reintroduced. Historical documentation may describe prior removal. |
| Training Volume Calculator | PASS | Not present/reintroduced; educational article retained. |

## Browser / runtime checks
- A local HTTP server returned HTTP 200 for `pages/dashboard.html`.
- A headless Chromium dump attempt did not complete within the environment timeout; no browser console-clean claim is made.
- No successful real-browser interaction test, visual regression, keyboard-only, screen-reader, mobile-device, or cross-browser test was completed in this environment.

## Manual QA required before production
1. Open Dashboard in Arabic and English; check RTL/LTR and mobile layout.
2. Save and remove an article and exercise from their respective pages; verify the header count and saved drawer update on every page and after reload.
3. Confirm browser storage failure behavior if storage is disabled/full.
4. Export JSON, import into a test browser profile, and verify merge prompts and data preservation.
5. Log a workout, edit a session note, delete a session, and verify calendar/progress update.
6. Add/delete notes linked to a real exercise, plan, and builder day.
7. Compare exercises and inspect alternatives; verify wording does not imply equivalence.
8. Run the timer, switch tabs, return, pause, and reset.
9. Save/delete a superset; create a bilingual SVG share card.
10. Verify equipment explorer and glossary search.
11. Have the coach review all fitness/nutrition educational wording and all exercise alternatives before publication.
12. Re-check anatomy mapping and its license/provenance before commercial distribution.

## Known limitations
- All data is local to the current browser/device unless exported.
- Supersets are saved as group definitions and are not automatically inserted into builder days.
- Alternatives are data-driven suggestions based on shared primary muscles; not certified equivalents.
- Progress reflects recorded sessions/sets only and does not infer physical outcomes.
- Glossary and new nutrition education are starter content requiring coach review.
- Energy section is education-only and intentionally has no personalized calorie calculation.
