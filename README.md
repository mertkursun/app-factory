# App Factory

Claude Code ile fikirden store'a React Native (Expo) uygulaması üreten ajan sistemi.

## Kurulum

```bash
# 1. Bu klasörü bir yere koy ve içine gir
cd app-factory
git init

# 2. Hook'ları çalıştırılabilir yap
chmod +x .claude/hooks/*.sh

# 3. Gerekli araçlar
npm i -g eas-cli supabase # EAS build + Supabase CLI (Docker gerekir: npx supabase start)
# jq kurulu olmalı (hook'lar kullanıyor): brew install jq / apt install jq

# 4. Claude Code'u başlat
claude
```

İlk açılışta klasöre güven ver (trust dialog); hook'lar ve ajanlar o zaman aktif olur.

## Kullanım

```
/new-app habit-tracker "Günlük alışkanlıkları takip eden, streak gösteren basit uygulama"
```
→ architect plan çıkarır → onaylarsın → ui-designer tasarlar (tarayıcıda önizleme) → onaylarsın → rn-builder kodlar → qa-tester test eder → reviewer inceler → özet.

```
/add-feature habit-tracker "Haftalık istatistik ekranı"
```
→ branch açar, plan ekler, onay alır, kodlar, test eder, review yapar.

```
/ship habit-tracker minor
```
→ kalite kapısı, metadata, sürüm artışı, store listing, EAS build (onayla).

## Yapı

```
app-factory/
  CLAUDE.md                  # Fabrika kuralları — her oturumda yüklenir
  .claude/
    settings.json            # İzinler + hook kayıtları
    agents/
      architect.md           # Plan + PRD (kod yazmaz)
      ui-designer.md         # Tasarım dili, token'lar, wireframe, HTML önizleme (kod yazmaz)
      rn-builder.md          # Kodlar, lint/test geçirir, commit atar
      qa-tester.md           # Test yazar/çalıştırır (Sonnet — ucuz)
      reviewer.md            # Salt-okunur review
      release-engineer.md    # Store hazırlığı
    skills/
      new-app/               # /new-app — uçtan uca akış
      add-feature/           # /add-feature
      ship/                  # /ship
      rn-conventions/        # Kod standartları (ajanlara preload edilir)
      better-*/              # jakubkrehel/skills'ten (MIT): renk, tipografi, UI polish, layout, metin, a11y
      _vendor/               # Lisans + güncelleme notu
    hooks/
      guard-dangerous.sh     # eas submit, npm publish, force push → engel
      protect-env.sh         # .env yazımı → engel
      lint-after-edit.sh     # Her .ts/.tsx düzenlemesinde prettier + eslint
  templates/
    app-CLAUDE.md            # Her yeni app'e kopyalanır
    PRD.md                   # architect doldurur
    DESIGN.md                # ui-designer doldurur
  apps/                      # Üretilen uygulamalar buraya
```

## Nasıl çalışıyor

| Katman | Ne yapar |
|--------|----------|
| **CLAUDE.md** | Her oturumda yüklenir; stack, akış ve kurallar burada |
| **Skill'ler** | `/new-app` gibi komutlar; akışı adım adım tarif eder, ajanları sırayla çağırır |
| **Ajanlar** | Her biri kendi context'inde çalışır, sadece özet döner. `memory: project` olanlar projeler arası öğrenir |
| **Hook'lar** | Prompt değil, garanti: `.env`'e yazmak veya `eas submit` çalıştırmak fiziksel olarak engellenir |
| **settings.json** | Rutin komutlar (npm, git add/commit, expo) sorusuz; tehlikeliler deny |

## Özelleştirme

- Stack değiştirmek → `CLAUDE.md` "Stack" bölümü + `rn-conventions/SKILL.md`
- Yeni ajan → `.claude/agents/<ad>.md` (name + description zorunlu)
- Kural ihlali tekrarlıyorsa → prompt'a değil, hook'a yaz
- Ajanlar bir şey öğrendikçe `.claude/agent-memory/<ajan>/` altında not tutar; commit'leyebilirsin

## Notlar

- Stack sabit: önyüz React Native/Expo, backend/DB/auth Supabase. Her app `supabase/migrations/` ile gelir; `supabase db push` hook ile engelli, prod'a şemayı sen gönderirsin.
- Tasarım: `ui-designer` her projede özgün bir görsel karakter seçer, 2 yön sunar, HTML önizleme üretir. "Şablon gibi" tasarım kabul edilmez. Tasarımcıya ve builder'a `better-*` referans skill'leri preload edilir (web odaklı; ajan içinde RN çeviri tablosu var).
- İlk `/new-app` çalıştırmasında `npx create-expo-app` ağ erişimi ister; EAS için `eas login` yapmış olmalısın.
- Ajan açıklamaları Türkçe; Claude Türkçe konuşur, kod ve commit İngilizce.
- Varsayılan `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH=2`: ana → skill'in çağırdığı ajan → o ajanın yardımcısı. Daha derin gerekirse `settings.json`'dan artır.
