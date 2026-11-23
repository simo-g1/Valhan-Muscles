# VALHAN MUSCLES — Consolidated Feature Expansion

## Added
- `pages/dashboard.html`: unified Training Center for workout logging, history, calendar, progress, activity, timers, supersets, notes, comparison, alternatives, equipment, saved items, glossary, nutrition education, energy education/calculation, backup/import, and share cards.
- `js/features/training-center.js`: dashboard feature logic and versioned LocalStorage data stores.
- `css/pages/training-center.css`: responsive dashboard styling.

## Updated
- `index.html` and existing pages: Dashboard navigation entry; home page also gets a Training Dashboard feature card.
- `js/workout-builder.js`: receives a saved superset from Training Center and inserts its exercises into the first non-rest day with editable default sets/reps.
- `IMPLEMENTATION_PROGRESS.md`: records delivered work and remaining limitations.
- `KNOWN_ISSUES.md`: explicit remaining functional and QA limitations.

## Data preservation
- `js/articles-data.js` is byte-identical to the supplied `all.zip` baseline.
- No Academy article text was changed.
- The Training Volume educational article remains untouched; no Training Volume Calculator was added.
- Existing LocalStorage keys are preserved. New features use separate versioned keys.

## Important behavior notes
- Session history is local to the current browser/device unless exported.
- Backup import validates app/schema, limits files to 5 MB, allow-lists keys, and merges rather than replacing current data.
- Energy estimates use Mifflin–St Jeor and an adult-only (18+) age gate. Minors are directed to educational information only.
- Alternative exercises are suggestions based on available data, not guaranteed equivalents.
