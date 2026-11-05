---
name: project_pre-existing-errors
description: Known pre-existing TS/lint errors that are NOT caused by current work - FamilyProfile components, notifications, ingredient-confirm, settings
metadata:
  type: project
---

Pre-existing lint errors as of 2026-11-06:
- `src/components/family/FamilyProfileCard.tsx`: react-hooks/static-components + prettier
- `src/components/family/FamilyProfileModal.tsx`: unused import FamilyIconKey
- `src/lib/familyIcons.ts`: prettier formatting
- `src/lib/notifications.ts`: prettier formatting
- `app/ingredient-confirm.tsx`: missing deps in useCallback
- `app/settings.tsx`: unused variable handleNotificationToggle

**Why:** These errors existed before voice assistant work. They should not block commits for new feature work.
**How to apply:** When running `npm run check`, expect these errors. Focus on verifying zero new errors in changed files.
