---
name: rn-conventions
description: Bu fabrikadaki Expo/React Native kod standartları — klasör yapısı, state, stil, test, erişilebilirlik kalıpları. RN kodu yazarken veya incelerken başvur.
user-invocable: false
paths:
  - "apps/**/*.ts"
  - "apps/**/*.tsx"
---

# React Native / Expo Kod Standartları

## Klasör yapısı (her app)
```
apps/<slug>/
  app/                  # Expo Router — sadece route dosyaları, mantık yok
    _layout.tsx
    (tabs)/
      _layout.tsx
      index.tsx
    [id].tsx
  src/
    components/         # Saf UI bileşenleri (ui/ altında atomik: Button, Card, Input)
    features/<feature>/ # Özelliğe özgü bileşen + hook + tip
    hooks/              # Paylaşılan hook'lar
    store/              # Zustand store'ları (useXStore.ts)
    services/           # API istemcileri, storage sarmalayıcıları
    lib/                # Yardımcılar, sabitler, zod şemaları
    types/              # Global tipler
  __tests__/
  assets/
  docs/                 # PRD.md, STORE.md, PRIVACY.md
  CLAUDE.md, PLAN.md, CHANGELOG.md
```

## Ekran şablonu
```tsx
// app/(tabs)/index.tsx
import { View, Text, FlatList } from "react-native";
import { useItems } from "@/features/items/useItems";
import { EmptyState, ErrorState, Loading } from "@/components/ui";

export default function HomeScreen() {
  const { data, isLoading, error, refetch } = useItems();
  if (isLoading) return <Loading />;
  if (error) return <ErrorState onRetry={refetch} />;
  if (!data?.length) return <EmptyState title="Henüz öğe yok" />;
  return (
    <FlatList
      data={data}
      keyExtractor={(i) => i.id}
      renderItem={({ item }) => <ItemCard item={item} />}
      contentContainerClassName="p-4 gap-3"
    />
  );
}
```
Her ekran bu üç durumu (loading / error / empty) işler. İstisna yok.

## Supabase (backend, DB, auth, API — her app'te)
```
apps/<slug>/
  supabase/
    config.toml
    migrations/        # 0001_init.sql ... — şema burada, dashboard'dan elle değişiklik yok
    seed.sql
  src/
    lib/supabase.ts    # tek client
    services/<domain>.ts  # tablo başına servis: list/get/create/update/remove
    types/database.ts  # `npx supabase gen types typescript` çıktısı — elle düzenleme
```
- Client:
  ```ts
  // src/lib/supabase.ts
  import { createClient } from "@supabase/supabase-js";
  import * as SecureStore from "expo-secure-store";
  import type { Database } from "@/types/database";

  const storage = {
    getItem: (k: string) => SecureStore.getItemAsync(k),
    setItem: (k: string, v: string) => SecureStore.setItemAsync(k, v),
    removeItem: (k: string) => SecureStore.deleteItemAsync(k),
  };
  export const supabase = createClient<Database>(
    process.env.EXPO_PUBLIC_SUPABASE_URL!,
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { storage, autoRefreshToken: true, persistSession: true, detectSessionInUrl: false } },
  );
  ```
- Env: `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY` → `.env.example`'da şablon. Service role key **asla** app'e girmez.
- **RLS her tabloda açık.** Her migration'da tablo + policy birlikte yazılır. Policy yoksa review'da KRİTİK.
- Auth: `supabase.auth` (email magic link varsayılan; sosyal login PRD'de belirtilirse). Oturum `useAuthStore` (Zustand) ile izlenir, `onAuthStateChange` root layout'ta.
- Veri erişimi: ekran → hook (`useItems`) → TanStack Query → servis → supabase. Ekran doğrudan `supabase.from()` çağırmaz.
- Realtime: sadece PRD'de "canlı" denen veriler için `channel().on('postgres_changes')`; sonra query invalidate.
- Storage: dosya yükleme `supabase.storage.from(bucket)`; bucket policy migration'da.
- Edge Functions: üçüncü taraf API çağrıları ve secret gerektiren işler için (`supabase/functions/<ad>/index.ts`). Client'tan secret'lı istek yasak.
- Tip üretimi: şema değişince `npm run db:types` (`supabase gen types typescript --local > src/types/database.ts`).
- Yerel geliştirme: `npx supabase start` (Docker). Testlerde supabase client mock'lanır; gerçek DB'ye test yazılmaz.

## State
- **Client state** → Zustand. Store başına tek dosya, `persist` middleware ile AsyncStorage (hassas veri değilse).
- **Server state** → TanStack Query. `queryKey` sabitleri `src/lib/queryKeys.ts`'de. Tüm Supabase okuma/yazma buradan geçer.
- **Hassas veri** (token, PII) → `expo-secure-store`. Asla AsyncStorage.
- Form state → `react-hook-form` + Zod resolver.

## Stil
- NativeWind `className`. Tema token'ları `tailwind.config.js`'de; renk hex'i bileşen içine yazma.
- Dark mode: `dark:` varyantları her bileşende düşünülür.
- Safe area: `react-native-safe-area-context`'ten `SafeAreaView` veya `useSafeAreaInsets`.

## TypeScript
- `strict: true`. `any` yasak; bilinmiyorsa `unknown` + narrowing.
- Veri tipleri Zod'dan türer: `const Item = z.object({...}); type Item = z.infer<typeof Item>;`
- Import alias `@/` → `src/`.

## Performans
- Listeler: `FlatList` (veya `@shopify/flash-list`). `ScrollView` + `map` yasak (10+ öğe için).
- `renderItem` bileşeni `React.memo`.
- Resimler `expo-image`.
- Ağır hesap `useMemo`, callback prop'ları `useCallback` (sadece gerçekten listede/memo'da kullanılıyorsa).

## Erişilebilirlik
- Her `Pressable`/`TouchableOpacity`: `accessibilityRole` + `accessibilityLabel`.
- Dokunma hedefi ≥ 44x44.
- Metin ölçekleme: `allowFontScaling` kapatma.

## Test
- `jest-expo` preset. `__tests__/` altında modül başına dosya.
- RNTL: `getByRole`, `getByLabelText` öncelikli; `getByTestId` son çare.
- Async: `waitFor` / `findBy*`. Sabit `setTimeout` yok.
- Snapshot yok.

## Komut scriptleri (package.json)
```json
"scripts": {
  "start": "expo start",
  "typecheck": "tsc --noEmit",
  "lint": "eslint . --ext .ts,.tsx",
  "test": "jest",
  "check": "npm run typecheck && npm run lint && npm test -- --silent",
  "db:start": "supabase start",
  "db:reset": "supabase db reset",
  "db:types": "supabase gen types typescript --local > src/types/database.ts",
  "db:migration": "supabase migration new"
}
```

## Git
- Conventional Commits. Scope = feature adı (`feat(auth): add login screen`).
- Her görev bir commit. Büyük görevler bölünür.
