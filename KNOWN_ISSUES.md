# VALHAN MUSCLES — Known Issues & Deferred Work

This file deliberately separates implemented surfaces from work that remains incomplete or requires manual verification.

## Known implementation limitations
- Workout completion is currently a manual log of a selected non-rest day from the saved builder plan; there is no guided live workout session with per-set completion, rest transitions, or exercise-by-exercise progression.
- The timer is a rest countdown, not a full workout/session timer with interval programming or persistent session state.
- Superset groups can be saved, listed, and deleted, but are not yet inserted into Workout Builder days or reflected in plan exports.
- Calendar currently renders the current month; navigation across months is not implemented.
- Activity tracking covers supported navigation and selected platform actions, not every user interaction.
- Exercise alternatives are data-driven suggestions based on available shared primary-muscle/movement-pattern fields; they are not coach-certified substitutions.
- Equipment Explorer depends on normalized equipment references already present in exercise data; incomplete mappings may produce empty results.
- The glossary is a starter glossary, not a comprehensive reference.
- Nutrition content is introductory and requires coach review before publication as authoritative fitness guidance.
- Energy education explains BMR/TDEE concepts but does not calculate personal energy requirements or calorie targets. This is intentional for a teen-accessible product.
- Saved content supports articles and exercises only; saving muscles/equipment was discussed but is not implemented as a distinct saved-item type.
- JSON import uses a safe merge flow but needs manual testing with malformed, older-version, and large backup files.

## Verification limitations
- No completed real-browser end-to-end test was available in this run.
- No confirmed screen-reader, keyboard-only, or physical mobile-device QA.
- Storage quota/private-browsing failure behavior needs manual verification in target browsers.
- Cross-tab storage synchronization was improved in code but needs manual browser verification.
- Anatomy mapping provenance and license attribution should be reviewed before commercial distribution.
- All educational content and exercise substitution wording should be reviewed by the coach.

## Data and content safeguards
- Existing Academy article data is preserved byte-for-byte relative to the supplied project baseline.
- Existing Training Volume educational content remains; the removed Training Volume Calculator is not reintroduced.
- Existing LocalStorage keys are preserved. New platform data remains browser/device-local unless exported.
