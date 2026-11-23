# VALHAN MUSCLES — Remaining QA & Product Limitations

## Functional limitations
- Guided workout mode currently tracks one exercise per run. A full multi-exercise session flow with automatic rest transitions remains future work.
- Superset handoff inserts exercises into the first non-rest builder day with editable defaults; the builder/PDF does not yet visually preserve paired superset blocks.
- Comparison and alternative suggestions depend on the available legacy muscle/equipment fields; incomplete data may yield limited results. Suggestions are not coach-certified substitutions.
- Equipment Explorer only shows existing normalized/legacy mappings and does not infer missing equipment.
- Recent activity records dashboard visits and supported session actions, not every click across the entire site.
- Personal notes are currently standalone notes; direct entity linking to exercise/plan/day is not yet available.
- Glossary and nutrition content are starter educational material and require coach review before publication as authoritative guidance.
- Adult BMR/TDEE output uses Mifflin–St Jeor estimates and activity multipliers; it is not a medical measurement or prescription. The form enforces age 18+.

## Verification limitations
- JavaScript syntax and static link checks can be run locally; this does not replace full manual browser interaction testing.
- Screen-reader, keyboard-only, and physical mobile-device QA remain outstanding.
- Storage quota/private-browsing failure behavior requires manual verification in target browsers.
- Cross-tab synchronization of all new data stores requires manual browser verification.
- Anatomy artwork provenance/license attribution should be reviewed before commercial distribution.

## Preserved data safeguards
- Academy article data is not modified by this release.
- Existing Training Volume educational content remains; the removed Training Volume Calculator is not reintroduced.
- Existing LocalStorage keys remain preserved; new data uses separate versioned keys.
- JSON import uses an allow-list, schema version check, size limit, and non-destructive merge.
