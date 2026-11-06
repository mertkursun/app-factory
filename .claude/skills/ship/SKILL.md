---
name: ship
description: Uygulamayı store'a hazırlar — kalite kapısı, metadata, sürüm, EAS build, store listing. Kullanıcı "yayınla", "ship", "store'a gönder", "build al" dediğinde kullan.
argument-hint: "<slug> [patch|minor|major]"
allowed-tools: Bash(npm run *) Bash(git add *) Bash(git commit *) Bash(git tag *) Bash(eas build *)
---

Release hazırlığı: `apps/$0/` — sürüm artışı: ${1:-patch}

## Kalite kapısı
!`cd apps/$0 && npm run check 2>&1 | tail -15 || echo "check başarısız veya app yok"`

Yukarıdaki çıktı yeşil değilse **dur**, kullanıcıya hataları göster, `/add-feature` veya doğrudan düzeltme öner.

## Adımlar
1. `reviewer`'ı son kez çalıştır. KRİTİK varsa dur.
2. `release-engineer`'ı çalıştır; sürüm artışı tipini ($1, yoksa patch) ilet. Metadata, eas.json, STORE.md, PRIVACY.md, CHANGELOG.md üretsin.
3. Kullanıcıya göster:
   - Yeni sürüm numarası
   - Eksik olanlar (gerçek ikon, Apple/Google hesabı, sertifika vb.)
   - STORE.md özeti
4. Sor: "`eas build --profile preview --platform all` çalıştırayım mı?" Evet derse çalıştır, build URL'lerini raporla.
5. `git tag v<version>` at. **`eas submit` çalıştırma**; komutu kullanıcıya ver:
   ```
   cd apps/$0 && eas submit --platform ios --latest
   cd apps/$0 && eas submit --platform android --latest
   ```
