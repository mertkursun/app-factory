---
name: new-app
description: Bir fikirden store'a hazır Expo/React Native uygulaması üretir — plan, onay, kod, test, review. Yeni uygulama başlatırken kullan.
argument-hint: "<slug> \"fikir açıklaması\""
disable-model-invocation: true
allowed-tools: Bash(mkdir *) Bash(git init *) Bash(git add *) Bash(git commit *) Bash(npx create-expo-app *) Bash(npx expo install *) Bash(npm install *) Bash(npm run *) Bash(npm test *)
---

Yeni uygulama üretimi başlıyor.

**Slug:** `$0`
**Fikir:** $1

Hedef dizin: `apps/$0/`

## Aşama 1 — Plan
1. `apps/$0/docs/` oluştur.
2. `architect` alt ajanını çalıştır. Ona fikri ve hedef dizini ver; `docs/PRD.md` ve `PLAN.md` üretmesini iste. Sonucunu bekle.
3. PRD'yi oku. Kullanıcıya şu formatta özet sun ve **dur**:
   - MVP özellikleri (madde madde)
   - Ekran listesi
   - Açık sorular (varsa)
   - "Bu planla devam edeyim mi? Değiştirmek istediğin bir şey var mı?"

Kullanıcı onaylamadan Aşama 2'ye geçme. Kullanıcı değişiklik isterse `architect`'i güncellemeyle tekrar çalıştır.

## Aşama 2 — Tasarım
4. `ui-designer` alt ajanını çalıştır; PRD'yi ve varsa kullanıcının verdiği referansları ilet. `docs/DESIGN.md`, `docs/design-preview.html`, `docs/tokens.json` üretmesini iste.
5. Kullanıcıya sun ve **dur**:
   - Tasarım dili (1 cümle) ve ana renk/font
   - Önizleme: tasarımcı Design artifact ürettiyse linkini ver ("Claude uygulamasında aç, canvas'ta yorum bırakabilirsin"); HTML'e düştüyse "tarayıcıda aç: `apps/$0/docs/design-preview.html`"
   - Tasarımcının tercih soruları (varsa)
   - "Bu tasarımla devam edeyim mi?"

   Kullanıcı değişiklik isterse `ui-designer`'ı geri bildirimle tekrar çalıştır. "Tasarımı atla / varsayılan olsun" derse ajanı yine çalıştır ama soru sormadan geç.

## Aşama 3 — İskelet
6. `templates/app-CLAUDE.md`'yi `apps/$0/CLAUDE.md` olarak kopyala, `{{APP_NAME}}` ve `{{SLUG}}` alanlarını doldur.
7. `rn-builder`'a **sadece T01**'i ver (proje iskeleti). `tokens.json`'u `tailwind.config.js`'e taşımasını ve `ui/` atomik bileşenlerini DESIGN.md envanterine göre kurmasını söyle. `npm run check` yeşil olmadan ilerleme.
8. `cd apps/$0 && git init && git add -A && git commit -m "chore: scaffold $0"` (kök repo yoksa).

## Aşama 4 — Kod
9. PLAN.md'deki kalan görevleri grupla:
   - `[P]` işaretli bağımsız görevleri **paralel** `rn-builder` ajanlarıyla çalıştır (her ajana tek görev, dosya çakışması olmadığından emin ol).
   - Bağımlı görevleri sırayla.
10. Her 2-3 görev grubundan sonra `qa-tester`'ı çalıştır. Uygulama hatası raporlarsa ilgili görevi `rn-builder`'a "düzelt" diye geri ver. En fazla 3 tur; hâlâ kırmızıysa kullanıcıya sor.
11. Kullanıcıya her aşama sonunda 2-3 satır ilerleme yaz: "T03-T05 bitti, 12 test geçiyor, sırada profil ekranı."

## Aşama 5 — Review
12. Tüm görevler `[x]` olunca `reviewer`'ı çalıştır. Reviewer'a DESIGN.md'yi de ver; ekranların tasarıma uyumunu da kontrol etsin.
13. KRİTİK bulgu varsa `rn-builder`'a düzelttir, `qa-tester` ile doğrula, `reviewer`'ı tekrar çalıştır. UYARI'ları kullanıcıya listele, düzeltip düzeltmeyeceğini sor.

## Aşama 6 — Teslim
14. Kullanıcıya özet:
    - Ne yapıldı (ekranlar, özellikler)
    - Nasıl çalıştırılır: `cd apps/$0 && npx expo start`
    - Test durumu
    - Review'dan kalan uyarılar
    - Sonraki adım: `/ship $0` ile store hazırlığı

## Kurallar
- Her aşama geçişinde `npm run check` yeşil olmalı.
- Kullanıcı "sorma, devam et" derse Aşama 1 ve 2 onayları hariç hiçbir yerde durma; plan ve tasarım onayı her zaman alınır.
- Alt ajanların tam çıktısını ana konuşmaya taşıma; sadece özet.
