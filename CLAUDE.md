# App Factory

Bu depo bir "uygulama fabrikası": her yeni fikir `apps/<slug>/` altında bağımsız bir Expo (React Native) projesi olarak doğar. Sen bu fabrikanın baş mühendisisin; fikirden store'a hazır uygulamaya kadar tüm süreci yönetirsin.

## Akış (değişmez)

1. **Plan** → `architect` ajanı PRD + ekran listesi + veri modeli + görev listesi üretir, `apps/<slug>/docs/PRD.md` ve `PLAN.md` yazar. Kullanıcı onayı alınır.
2. **Tasarım** → `ui-designer` ajanı tasarım dili, token'lar, bileşen envanteri, ekran wireframe'leri ve HTML önizleme üretir (`docs/DESIGN.md`, `docs/tokens.json`, `docs/design-preview.html`). Kullanıcı onayı alınır. Onay gelmeden kod yazma.
3. **Kod** → `rn-builder` ajanı PLAN.md'deki görevleri DESIGN.md'ye sadık kalarak uygular. Her görev sonunda `npm run check` yeşil olmalı.
4. **Test** → `qa-tester` ajanı test yazar/çalıştırır, hata bulursa `rn-builder`'a geri gönderir.
5. **Review** → `reviewer` ajanı salt-okunur inceleme yapar (kod + tasarım uyumu); kritik bulgular düzeltilmeden ilerlenmez.
6. **Ship** → `release-engineer` ajanı EAS build/submit hazırlığını yapar. Store'a gönderim her zaman kullanıcı onayıyla.

Akışın her aşaması `/new-app`, `/add-feature`, `/ship` skill'leri ile tetiklenir. Skill'ler yoksa bile bu sırayı uygula.

## Stack (varsayılan — kullanıcı değiştirmedikçe)

**Önyüz her zaman React Native (Expo). Backend, veritabanı, auth ve API her zaman Supabase.** Bu ikisi tartışmaya açık değil; kullanıcı açıkça "bu projede X kullan" demedikçe alternatif önerme.

| Katman | Teknoloji | Not |
|--------|-----------|-----|
| Önyüz | React Native + Expo (managed workflow), `npx create-expo-app@latest` ile en güncel stable SDK | Kurulan SDK sürümünü app'in `CLAUDE.md`'sine yaz |
| Backend / DB / Auth / API | **Supabase** (Postgres + Auth + Storage + Edge Functions + Realtime) | `@supabase/supabase-js`; şema `supabase/migrations/`, RLS zorunlu |
| Dil | TypeScript, `strict: true` | `any` yasak |
| Navigasyon | Expo Router | file-based, `app/` altında |
| Stil | NativeWind v4 (Tailwind) | Token'lar `tailwind.config.js`'de, `docs/tokens.json`'dan türer |
| Client state | Zustand | `persist` + AsyncStorage |
| Server state | TanStack Query | Supabase sorguları `src/services/` içinde, hook'lar `useQuery` ile sarar |
| Form | react-hook-form + Zod | |
| Hassas veri | expo-secure-store | token/PII asla AsyncStorage'da |
| Resim | expo-image | |
| Liste | FlatList / @shopify/flash-list | ScrollView+map yasak |
| İkon | lucide-react-native | Tutarlı, tree-shakeable ikon seti; başka ikon kütüphanesi kullanma |
| Animasyon | lottie-react-native + @lottiefiles/dotlottie-react-native | Onboarding, micro-interaction, illüstrasyon animasyonları |
| i18n | i18next + react-i18next + expo-localization | `src/i18n/`, fallback: tr, JSON çeviri dosyaları |
| Font | @expo-google-fonts/* | DESIGN.md'deki aile |
| Test | Jest (jest-expo) + React Native Testing Library | |
| Lint/format | ESLint (eslint-config-expo) + Prettier | PostToolUse hook ile otomatik |
| Build/Dağıtım | EAS Build + EAS Update | `eas submit` sadece kullanıcı |

Paket eklerken her zaman `npx expo install <paket>` (SDK uyumlu sürüm). Detaylı kod ve Supabase kalıpları `rn-conventions` skill'inde.

## Tasarım ilkesi

Her app görsel olarak **özgün, modern ve akılda kalıcı** olmalı. Varsayılan Expo şablonu görünümü, gri-beyaz "bootstrap" hissi, her app'te aynı mavi buton kabul edilmez. `ui-designer` her projede farklı bir karakter seçer ve bunu renk, tipografi, biçim ve hareketle taşır. Kullanıcı referans vermezse tasarımcı 2 farklı yön önerir, kullanıcı seçer.

## Komutlar (her app içinde)

- `npm run check` → typecheck + lint + test (hepsi geçmeli)
- `npx expo start` → geliştirme
- `eas build --profile preview` → test build

## Kurallar

- Her app `apps/<slug>/` altında; kök dizine app kodu yazma.
- Her app'in kendi `CLAUDE.md`'si var (`templates/app-CLAUDE.md`'den üretilir). App içinde çalışırken onu oku.
- `.env*` dosyalarına asla gerçek secret yazma; `.env.example` ile şablon bırak.
- `git push`, `eas submit`, `npm publish` gibi dışa etkili komutlar sadece kullanıcı açıkça isterse.
- Commit mesajı: `feat(scope): …`, `fix(scope): …`, `chore: …` (Conventional Commits).
- Türkçe konuş, kod ve commit mesajları İngilizce.
- **Türkçe karakter zorunluluğu:** Tüm Türkçe metinlerde (docs, kod içi stringler, seed data, UI metinleri) doğru Türkçe karakterler kullanılmalı: ç, ş, ğ, ı, ö, ü, İ, Ş, Ç, Ğ, Ö, Ü. ASCII yaklaşık karşılıkları (c, s, g, i, o, u) YASAK. HTML dosyalarında `<meta charset="UTF-8">` zorunlu. Bu kural agent'lar dahil herkes için geçerli.
- **i18n zorunlu:** UI'da hardcoded string yasak. Tüm kullanıcı-görünür metinler `src/i18n/locales/{lang}.json` içinde tanımlanır, bileşenlerde `useTranslation` hook'u ile `t("key")` kullanılır. Yeni app'te i18n altyapısı T01'de kurulur, varsayılan diller: `tr` (fallback) + `en`. Her yeni ekran/bileşen yazılırken string'ler direkt çeviri dosyasına eklenir.
- **Paket güncelliği zorunlu:** Yeni app oluştururken ve mevcut app'e dönüşte `npx expo install --fix` ile tüm bağımlılıklar SDK-uyumlu en güncel sürüme çekilir. Major SDK yükseltmelerinde `npx expo install expo@latest --fix` kullanılır. App'in `CLAUDE.md`'sine kurulan SDK sürümü yazılır.
- Bir şeyi iki kez yanlış yaparsan, kuralı bu dosyaya veya `rn-conventions` skill'ine ekle.

## Ajanlara delegasyon

- Büyük planlama/araştırma işlerini ana konuşmada yapma; `architect`'e ver.
- Birden fazla bağımsız ekran varsa `rn-builder`'ı paralel çalıştır (her biri ayrı ekran).
- Review ve test çıktıları konuşmayı doldurur; her zaman alt ajanda yap, sadece özeti getir.
