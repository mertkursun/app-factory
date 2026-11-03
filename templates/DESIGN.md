# {{APP_NAME}} — Tasarım

**Önizleme:** `docs/design-preview.html` · **Token'lar:** `docs/tokens.json`

## 1. Tasarım dili
<!-- 3-5 kelime + 2 cümle gerekçe. Hedef kullanıcıdan türet. -->

## 2. Renk token'ları

| Token | Light | Dark | Kullanım |
|-------|-------|------|----------|
| primary | | | Ana aksiyon, aktif tab |
| background | | | Ekran zemini |
| surface | | | Kart, sheet |
| text | | | Birincil metin |
| muted | | | İkincil metin, placeholder |
| border | | | Ayırıcı, input kenarı |
| success | | | |
| danger | | | |

Kontrast: text/background = __:1, muted/background = __:1 (AA ≥ 4.5)

## 3. Tipografi
**Aile:** <!-- Expo Google Fonts'ta olan tek aile -->

| Stil | Boyut | Ağırlık | Satır |
|------|-------|---------|-------|
| display | 32 | 700 | 38 |
| title | 22 | 600 | 28 |
| body | 16 | 400 | 24 |
| caption | 13 | 400 | 18 |
| label | 14 | 500 | 20 |

## 4. Boşluk ve biçim
- Grid: 4pt. Ölçek: 4 / 8 / 12 / 16 / 24 / 32 / 48
- Radius: sm 8 · md 12 · lg 20 · full
- Gölge: yok / card / sheet

## 5. Bileşen envanteri

| Bileşen | Konum | Varyantlar | Durumlar |
|---------|-------|------------|----------|
| Button | ui/ | primary, secondary, ghost | default, pressed, disabled, loading |
| Card | ui/ | | |
| Input | ui/ | | default, focus, error |
| EmptyState | ui/ | | |
| ErrorState | ui/ | | |
| Loading | ui/ | | |

## 6. Ekranlar

### 6.1 Home — `app/(tabs)/index.tsx`
```
┌──────────────────────────────────┐
│ ◀ Başlık                    ⋯   │
├──────────────────────────────────┤
│                                  │
│  ┌────────────────────────────┐  │
│  │ Kart                       │  │
│  └────────────────────────────┘  │
│                                  │
│                            (+)   │
├──────────────────────────────────┤
│   ⌂        ◎        ☰            │
└──────────────────────────────────┘
```
**Bölgeler:**
1. Header — title, action ikonu
2. Liste — Card ×n, FlatList
3. FAB — primary, sağ alt 16pt

**Durumlar:** Boş → EmptyState (ikon + "…" + CTA) · Yükleniyor → 3 skeleton kart · Hata → ErrorState + Tekrar dene

**Etkileşim:** Kart tap → detay (push). FAB → oluşturma sheet'i (modal, alttan).

## 7. Hareket
- Ekran geçişi: native stack default
- Liste öğesi ekleme: fade+slide 200ms ease-out
- Buton pressed: opacity 0.7, scale 0.98

## 8. Öneriler (PRD dışı)
-
