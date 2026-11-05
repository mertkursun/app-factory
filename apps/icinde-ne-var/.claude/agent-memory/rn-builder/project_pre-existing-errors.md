---
name: project_pre-existing-errors
description: Known pre-existing TS/lint errors that are NOT caused by current work - FamilyProfile components, notifications, ingredient-confirm, settings
metadata:
  type: project
---

Pre-existing TS/lint errors as of 2026-11-06 (post notification feature):
- `app/(tabs)/profile.tsx:181`: Property 'familyCard' does not exist on StyleSheet (parallel family feature)
- `app/analysis/[id].tsx:190`: Cannot find name 'handleSpeak' + prettier (parallel voice feature)
- `src/components/family/FamilyProfileCard.tsx`: react-hooks/static-components + prettier
- `src/components/family/FamilyProfileModal.tsx:17`: unused FamilyIconKey import
- `src/lib/familyIcons.ts`: prettier formatting
- `app/ingredient-confirm.tsx:135`: missing deps in useCallback

**Why:** These errors come from parallel features (family profiles, voice assistant). They should not block commits for notification feature work.
**How to apply:** When running `npm run check`, expect these errors. Focus on verifying zero new errors in changed files.
