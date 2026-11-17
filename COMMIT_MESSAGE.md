fix(saved-content): improve validation and cross-page bookmark synchronization

- validate article and exercise identifiers before changing saved state
- create accessible toast feedback when a page has no toast host
- refresh saved-content UI when LocalStorage changes in another tab
- refresh an open saved-content drawer after same-tab or cross-tab changes
- preserve existing saved-content storage keys and stored records
