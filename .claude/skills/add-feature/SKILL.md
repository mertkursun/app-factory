---
name: add-feature
description: Mevcut bir uygulamaya yeni özellik ekler — küçük plan, onay, kod, test, review. Var olan app'e ekran/özellik eklerken kullan.
argument-hint: "<slug> \"özellik açıklaması\""
disable-model-invocation: true
allowed-tools: Bash(git add *) Bash(git commit *) Bash(git checkout *) Bash(git switch *) Bash(npx expo install *) Bash(npm run *) Bash(npm test *)
---

Özellik ekleme: `apps/$0/` → $1

## Mevcut durum
!`cat apps/$0/PLAN.md 2>/dev/null | tail -20 || echo "PLAN.md yok"`

## Adımlar
1. `apps/$0/CLAUDE.md`, `docs/PRD.md` ve `PLAN.md`'yi oku.
2. `git switch -c feat/<kısa-ad>` ile branch aç.
3. `architect`'e özelliği ver: PRD'ye yeni bölüm eklesin, PLAN.md'ye yeni görevler (T-numaralarını devam ettirerek) eklesin. Mevcut ekranlara etkisini belirtsin.
4. Kullanıcıya görev listesini ve etkilenen ekranları göster, onay al. Küçük özellikse (1-2 görev) onayı tek satırda al.
5. Yeni ekran veya yeni bileşen varsa `ui-designer`'ı çalıştır: mevcut `docs/DESIGN.md`'ye ekran bölümü eklesin, önizlemeyi güncellesin, token değiştirmesin. Sadece mevcut ekranda küçük değişiklikse bu adımı atla.
6. Görevleri `rn-builder`'a ver (bağımsızsa paralel).
7. `qa-tester` → hata varsa geri döngü (maks 3 tur).
8. `reviewer` → kritik varsa düzelt.
9. Kullanıcıya: ne eklendi, nasıl test edilir, branch adı. Merge'ü kullanıcı yapar veya ister.
