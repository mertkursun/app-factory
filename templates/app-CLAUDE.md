# {{APP_NAME}}

Bu dosya `apps/{{SLUG}}/` içinde çalışırken yüklenir. Fabrika kuralları kök `CLAUDE.md`'de; burası app'e özel.

## Ne yapıyor
<!-- architect PRD'den 2 cümle yazar -->

## Durum
- Plan: `PLAN.md` (açık görevler `[ ]`)
- PRD: `docs/PRD.md`
- Sürüm: `app.json` → `version`

## Komutlar
```
npm run check        # typecheck + lint + test — commit öncesi zorunlu
npx expo start       # geliştirme
npm test -- --watch  # test döngüsü
```

## App'e özel kararlar
<!-- Projede verilen ve tekrar sorulmaması gereken kararlar. Örn:
- Auth: Supabase magic link, MVP'de sosyal login yok
- Tema: sadece dark
-->

## Bilinen tuzaklar
<!-- rn-builder ve reviewer buraya ekler. Örn:
- expo-camera v16 ile NativeWind className çalışmıyor, style prop kullan
-->
