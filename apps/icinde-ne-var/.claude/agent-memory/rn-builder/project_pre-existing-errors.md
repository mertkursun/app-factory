---
name: project_pre-existing-errors
description: Known pre-existing TS/lint errors that are NOT caused by current work - SplashAnimation SharedValue, tokens.ts type mismatch, verify-otp setCanResend, ingredient-confirm TextInput ref, test files missing jest types
metadata:
  type: project
---

Pre-existing TypeScript errors as of 2026-11-04 (updated):
- `src/components/splash/SplashAnimation.tsx`: SharedValue namespace not exported from reanimated
- `src/theme/tokens.ts:234`: ThemeColors type mismatch between light/dark (literal string types)
- `app/(auth)/verify-otp.tsx:59`: Cannot find name 'setCanResend'
- `app/ingredient-confirm.tsx:66,210`: TextInput ref type incompatibility
- `src/__tests__/**`: Missing jest type definitions (describe, it, expect)
- `app/(tabs)/favorites.tsx`: Missing modules `@/components/favorites/FavoriteCard` and `EmptyFavorites` (untracked file from another parallel feature)

Pre-existing lint errors:
- `SecondaryButton.tsx`: react-hooks/immutability on Reanimated shared values + prettier
- `tokens.ts`: prettier formatting
- Multiple files: Reanimated `scale.value = withTiming(...)` triggers react-hooks/immutability

**Why:** These errors existed before the UI redesign work. They should not block commits for new feature work.
**How to apply:** When running `npm run check`, expect these errors. Focus on verifying zero new errors in changed files using targeted `npx tsc --noEmit | grep "error TS" | grep "<myfile>"`.
