---
name: project_pre-existing-errors
description: Known pre-existing TS/lint errors that are NOT caused by current work
metadata:
  type: project
---

Pre-existing lint errors as of 2026-11-06:
- `app/encyclopedia.tsx`: prettier formatting, unused imports (useMemo, BookOpen, typography, shadow, isLoading)
- `app/ingredient-confirm.tsx:135`: missing deps in useCallback (routeBrand, routeCountryOfOrigin)

**Why:** These errors come from other features and are not related to family profiles work.
**How to apply:** When running `npm run check`, expect these errors. Focus on verifying zero new errors in changed files.
