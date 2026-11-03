# {{APP_NAME}} — PRD

**Slug:** `{{SLUG}}` · **Tarih:** {{DATE}} · **Sürüm:** MVP

## 1. Problem ve hedef kullanıcı
<!-- Kim, hangi sorunu, neden şimdi? 2-3 cümle. -->

## 2. MVP kapsamı (en fazla 5)
1.
2.
3.

### Sonraki sürüm (MVP dışı)
-

## 3. Ekranlar

| # | Ekran | Route | Amaç | Ana bileşenler | Gittiği ekranlar |
|---|-------|-------|------|----------------|------------------|
| 1 | Home | `app/(tabs)/index.tsx` | | | |

## 4. Navigasyon ağacı
```
app/
  _layout.tsx            # Root: providers (Query, SafeArea, theme)
  (tabs)/
    _layout.tsx
    index.tsx
```

## 5. Veri modeli
```ts
// src/lib/schemas.ts
import { z } from "zod";

export const Item = z.object({
  id: z.string(),
  createdAt: z.string().datetime(),
});
export type Item = z.infer<typeof Item>;
```
### Supabase şeması
```sql
-- supabase/migrations/0001_init.sql
create table public.items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.items enable row level security;
create policy "own rows" on public.items
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
```
**Saklama kararı:** <!-- Hangi veri Supabase'de (varsayılan), hangisi sadece cihazda (Zustand persist), hangisi SecureStore -->

## 6. Supabase kullanımı

| Özellik | MVP'de | Not |
|---------|--------|-----|
| Auth | evet — magic link | sosyal login? |
| Postgres tabloları | evet | yukarıdaki şema |
| Storage (dosya) | | bucket adı |
| Realtime | | hangi tablo |
| Edge Functions | | hangi dış API / secret |

## 7. Diğer dış bağımlılıklar

| Bağımlılık | MVP'de | Not |
|------------|--------|-----|
| Push bildirim | yok | expo-notifications |
| Ödeme | yok | RevenueCat |
| Analitik | yok | |

## 8. Varsayımlar
-

## 9. Açık sorular (kullanıcıya)
1.
