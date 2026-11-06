---
name: project_pre-existing-errors
description: Known pre-existing TS/lint errors that are NOT caused by current work
metadata:
  type: project
---

Pre-existing lint errors as of 2026-11-06:
- `app/_layout.tsx:134` react-hooks/refs: queryClientRef.current access in render
- `app/settings.tsx:450` prettier: toUpperTR line formatting
- `src/components/family/FamilyProfileCard.tsx:104` prettier: style array formatting

**Why:** These errors come from other features and are not related to current work.
**How to apply:** When running `npm run check`, expect these 3 errors. Focus on verifying zero new errors in changed files.
