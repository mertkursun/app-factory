-- Seed data: maddeler tablosu icin kapsamli veri
-- ~450+ madde: gida (~200), kozmetik (~150), temizlik (~100)
-- Her INSERT blogu max 30 satir

-- =============================================
-- Mevcut 3 kayit (korunuyor)
-- =============================================
INSERT INTO public.maddeler (ad, es_anlamlilar, kategori, islev, risk_seviyesi, kaynak, kitle_bayraklari)
VALUES
  ('Sodyum Benzoat', ARRAY['Sodium Benzoate', 'E211'], 'gida', 'Koruyucu madde', 'dikkat', 'https://efsa.europa.eu', '{"bebek": "sakincali", "hamile": "dikkat"}'::jsonb),
  ('Askorbik Asit', ARRAY['Ascorbic Acid', 'E300', 'Vitamin C'], 'gida', 'Antioksidan, vitamin takviyesi', 'guvenli', null, null),
  ('Sodyum Lauril Sülfat', ARRAY['Sodium Lauryl Sulfate', 'SLS'], 'kozmetik', 'Köpürtücü yüzey aktif madde', 'dikkat', null, '{"hassas_cilt": "sakincali", "bebek": "sakincali"}'::jsonb);

-- =============================================
-- GIDA - Blok 1: Antioksidanlar ve vitaminler (guvenli)
-- =============================================
INSERT INTO public.maddeler (ad, es_anlamlilar, kategori, islev, risk_seviyesi, kaynak, kitle_bayraklari) VALUES
  ('Sitrik Asit', ARRAY['Citric Acid', 'E330'], 'gida', 'Asitlik düzenleyici, antioksidan', 'guvenli', 'EFSA', null),
  ('Tokoferol', ARRAY['Tocopherol', 'E307', 'Vitamin E', 'Alpha-Tocopherol'], 'gida', 'Antioksidan', 'guvenli', 'EFSA', null),
  ('Beta-Karoten', ARRAY['Beta-Carotene', 'E160a', 'Provitamin A'], 'gida', 'Doğal renklendirici, antioksidan', 'guvenli', 'EFSA', null),
  ('Riboflavin', ARRAY['Riboflavine', 'E101', 'Vitamin B2'], 'gida', 'Doğal sarı renklendirici, vitamin', 'guvenli', 'EFSA', null),
  ('Nikotinamid', ARRAY['Nicotinamide', 'Niacin', 'Vitamin B3'], 'gida', 'Vitamin takviyesi', 'guvenli', 'EFSA', null),
  ('Pantotenik Asit', ARRAY['Pantothenic Acid', 'Vitamin B5', 'Calcium Pantothenate'], 'gida', 'Vitamin takviyesi', 'guvenli', 'EFSA', null),
  ('Piridoksin', ARRAY['Pyridoxine', 'Vitamin B6', 'Pyridoxine Hydrochloride'], 'gida', 'Vitamin takviyesi', 'guvenli', 'EFSA', null),
  ('Folik Asit', ARRAY['Folic Acid', 'Vitamin B9', 'Folate'], 'gida', 'Vitamin takviyesi', 'guvenli', 'EFSA', null),
  ('Siyanokobalamin', ARRAY['Cyanocobalamin', 'Vitamin B12'], 'gida', 'Vitamin takviyesi', 'guvenli', 'EFSA', null),
  ('Tiamin', ARRAY['Thiamine', 'Vitamin B1', 'Thiamine Hydrochloride'], 'gida', 'Vitamin takviyesi', 'guvenli', 'EFSA', null),
  ('Retinol', ARRAY['Retinol', 'Vitamin A', 'Retinyl Palmitate'], 'gida', 'Vitamin takviyesi', 'guvenli', 'EFSA', '{"hamile": "dikkat"}'::jsonb),
  ('Kolekalsiferol', ARRAY['Cholecalciferol', 'Vitamin D3', 'Vitamin D'], 'gida', 'Vitamin takviyesi', 'guvenli', 'EFSA', null),
  ('Alfa-Tokoferol Asetat', ARRAY['Alpha-Tocopheryl Acetate', 'E307', 'dl-Alpha-Tocopheryl Acetate'], 'gida', 'Antioksidan, vitamin E formu', 'guvenli', 'EFSA', null),
  ('Fitomenadion', ARRAY['Phytomenadione', 'Vitamin K1', 'Phylloquinone'], 'gida', 'Vitamin takviyesi', 'guvenli', 'EFSA', null),
  ('Biotin', ARRAY['Biotin', 'Vitamin B7', 'Vitamin H'], 'gida', 'Vitamin takviyesi', 'guvenli', 'EFSA', null),
  ('Karotenoidler', ARRAY['Carotenoids', 'E160'], 'gida', 'Doğal renklendirici, antioksidan', 'guvenli', 'EFSA', null),
  ('Lutein', ARRAY['Lutein', 'E161b'], 'gida', 'Doğal renklendirici', 'guvenli', 'EFSA', null),
  ('Likopen', ARRAY['Lycopene', 'E160d'], 'gida', 'Doğal kırmızı renklendirici', 'guvenli', 'EFSA', null),
  ('Demir Fumarat', ARRAY['Ferrous Fumarate', 'Iron'], 'gida', 'Mineral takviyesi', 'guvenli', 'EFSA', null),
  ('Çinko Glukonat', ARRAY['Zinc Gluconate', 'Zinc'], 'gida', 'Mineral takviyesi', 'guvenli', 'EFSA', null),
  ('Kalsiyum Karbonat', ARRAY['Calcium Carbonate', 'E170'], 'gida', 'Kalsiyum kaynağı, beyaz renklendirici', 'guvenli', 'EFSA', null),
  ('Magnezyum Oksit', ARRAY['Magnesium Oxide', 'Magnesium'], 'gida', 'Mineral takviyesi', 'guvenli', 'EFSA', null),
  ('Selenyum', ARRAY['Selenium', 'Sodium Selenite'], 'gida', 'Eser mineral takviyesi', 'guvenli', 'EFSA', null),
  ('Potasyum İyodür', ARRAY['Potassium Iodide', 'Iodine'], 'gida', 'İyot kaynağı', 'guvenli', 'EFSA', null),
  ('Bakır Glukonat', ARRAY['Copper Gluconate', 'Copper'], 'gida', 'Eser mineral takviyesi', 'guvenli', 'EFSA', null);

-- =============================================
-- GIDA - Blok 2: Asitlik düzenleyiciler ve stabilizatörler (guvenli)
-- =============================================
INSERT INTO public.maddeler (ad, es_anlamlilar, kategori, islev, risk_seviyesi, kaynak, kitle_bayraklari) VALUES
  ('Malik Asit', ARRAY['Malic Acid', 'E296'], 'gida', 'Asitlik düzenleyici', 'guvenli', 'EFSA', null),
  ('Tartarik Asit', ARRAY['Tartaric Acid', 'E334'], 'gida', 'Asitlik düzenleyici', 'guvenli', 'EFSA', null),
  ('Laktik Asit', ARRAY['Lactic Acid', 'E270'], 'gida', 'Asitlik düzenleyici, koruyucu', 'guvenli', 'EFSA', null),
  ('Asetik Asit', ARRAY['Acetic Acid', 'E260', 'Sirke Asidi'], 'gida', 'Asitlik düzenleyici, koruyucu', 'guvenli', 'EFSA', null),
  ('Sodyum Bikarbonat', ARRAY['Sodium Bicarbonate', 'E500', 'Karbonat'], 'gida', 'Kabartma maddesi', 'guvenli', 'EFSA', null),
  ('Sodyum Karbonat', ARRAY['Sodium Carbonate', 'E500i'], 'gida', 'Asitlik düzenleyici', 'guvenli', 'EFSA', null),
  ('Potasyum Karbonat', ARRAY['Potassium Carbonate', 'E501'], 'gida', 'Asitlik düzenleyici', 'guvenli', 'EFSA', null),
  ('Kalsiyum Klorür', ARRAY['Calcium Chloride', 'E509'], 'gida', 'Sertleştirici, stabilizatör', 'guvenli', 'EFSA', null),
  ('Sodyum Sitrat', ARRAY['Sodium Citrate', 'E331', 'Trisodium Citrate'], 'gida', 'Asitlik düzenleyici, emülgatör', 'guvenli', 'EFSA', null),
  ('Potasyum Sitrat', ARRAY['Potassium Citrate', 'E332'], 'gida', 'Asitlik düzenleyici', 'guvenli', 'EFSA', null),
  ('Kalsiyum Sitrat', ARRAY['Calcium Citrate', 'E333'], 'gida', 'Asitlik düzenleyici, kalsiyum kaynağı', 'guvenli', 'EFSA', null),
  ('Sodyum Laktat', ARRAY['Sodium Lactate', 'E325'], 'gida', 'Nem tutucu, asitlik düzenleyici', 'guvenli', 'EFSA', null),
  ('Potasyum Laktat', ARRAY['Potassium Lactate', 'E326'], 'gida', 'Antioksidan sinerjist', 'guvenli', 'EFSA', null),
  ('Kalsiyum Laktat', ARRAY['Calcium Lactate', 'E327'], 'gida', 'Asitlik düzenleyici, sertleştirici', 'guvenli', 'EFSA', null),
  ('Fumrik Asit', ARRAY['Fumaric Acid', 'E297'], 'gida', 'Asitlik düzenleyici', 'guvenli', 'EFSA', null),
  ('Glukono Delta-Lakton', ARRAY['Glucono Delta-Lactone', 'E575', 'GDL'], 'gida', 'Asitlik düzenleyici, pıhtılaştırıcı', 'guvenli', 'EFSA', null),
  ('Sodyum Hidroksit', ARRAY['Sodium Hydroxide', 'E524', 'Kostik Soda'], 'gida', 'Asitlik düzenleyici', 'guvenli', 'EFSA', null),
  ('Potasyum Hidroksit', ARRAY['Potassium Hydroxide', 'E525'], 'gida', 'Asitlik düzenleyici', 'guvenli', 'EFSA', null),
  ('Kalsiyum Hidroksit', ARRAY['Calcium Hydroxide', 'E526'], 'gida', 'Asitlik düzenleyici', 'guvenli', 'EFSA', null),
  ('Amonyum Bikarbonat', ARRAY['Ammonium Bicarbonate', 'E503'], 'gida', 'Kabartma maddesi', 'guvenli', 'EFSA', null),
  ('Sodyum Fosfat', ARRAY['Sodium Phosphate', 'E339'], 'gida', 'Emülgatör, asitlik düzenleyici', 'dikkat', 'EFSA', null),
  ('Fosforik Asit', ARRAY['Phosphoric Acid', 'E338'], 'gida', 'Asitlik düzenleyici', 'dikkat', 'EFSA', '{"bebek": "dikkat"}'::jsonb),
  ('Adipik Asit', ARRAY['Adipic Acid', 'E355'], 'gida', 'Asitlik düzenleyici', 'guvenli', 'EFSA', null),
  ('Sodyum Asetat', ARRAY['Sodium Acetate', 'E262'], 'gida', 'Koruyucu, asitlik düzenleyici', 'guvenli', 'EFSA', null),
  ('Potasyum Asetat', ARRAY['Potassium Acetate', 'E261'], 'gida', 'Koruyucu, asitlik düzenleyici', 'guvenli', 'EFSA', null);

-- =============================================
-- GIDA - Blok 3: Emülgatörler ve kıvam artırıcılar (guvenli)
-- =============================================
INSERT INTO public.maddeler (ad, es_anlamlilar, kategori, islev, risk_seviyesi, kaynak, kitle_bayraklari) VALUES
  ('Lesitin', ARRAY['Lecithin', 'E322', 'Soya Lecithin'], 'gida', 'Emülgatör', 'guvenli', 'EFSA', '{"fistik_alerjisi": "dikkat"}'::jsonb),
  ('Pektin', ARRAY['Pectin', 'E440'], 'gida', 'Jelleştirici, stabilizatör', 'guvenli', 'EFSA', null),
  ('Ksantan Gam', ARRAY['Xanthan Gum', 'E415'], 'gida', 'Kıvam artırıcı, stabilizatör', 'guvenli', 'EFSA', null),
  ('Guar Gam', ARRAY['Guar Gum', 'E412'], 'gida', 'Kıvam artırıcı, stabilizatör', 'guvenli', 'EFSA', null),
  ('Arap Zamkı', ARRAY['Gum Arabic', 'E414', 'Acacia Gum'], 'gida', 'Emülgatör, stabilizatör', 'guvenli', 'EFSA', null),
  ('Agar Agar', ARRAY['Agar', 'E406'], 'gida', 'Jelleştirici, stabilizatör', 'guvenli', 'EFSA', null),
  ('Keçiboynuzu Gamı', ARRAY['Locust Bean Gum', 'E410', 'Carob Bean Gum'], 'gida', 'Kıvam artırıcı, stabilizatör', 'guvenli', 'EFSA', null),
  ('Jellan Gam', ARRAY['Gellan Gum', 'E418'], 'gida', 'Jelleştirici, stabilizatör', 'guvenli', 'EFSA', null),
  ('Tara Gamı', ARRAY['Tara Gum', 'E417'], 'gida', 'Kıvam artırıcı', 'guvenli', 'EFSA', null),
  ('Selüloz', ARRAY['Cellulose', 'E460'], 'gida', 'Dolgu maddesi, kıvam artırıcı', 'guvenli', 'EFSA', null),
  ('Metil Selüloz', ARRAY['Methylcellulose', 'E461'], 'gida', 'Kıvam artırıcı, emülgatör', 'guvenli', 'EFSA', null),
  ('Karboksimetil Selüloz', ARRAY['Carboxymethyl Cellulose', 'E466', 'CMC'], 'gida', 'Kıvam artırıcı, stabilizatör', 'guvenli', 'EFSA', null),
  ('Hidroksipropil Selüloz', ARRAY['Hydroxypropyl Cellulose', 'E463'], 'gida', 'Kıvam artırıcı, emülgatör', 'guvenli', 'EFSA', null),
  ('Mono ve Digliseritler', ARRAY['Mono- and Diglycerides of Fatty Acids', 'E471'], 'gida', 'Emülgatör', 'guvenli', 'EFSA', null),
  ('Sodyum Stearoil Laktilat', ARRAY['Sodium Stearoyl Lactylate', 'E481', 'SSL'], 'gida', 'Emülgatör, hamur iyileştirici', 'guvenli', 'EFSA', null),
  ('Kalsiyum Stearoil Laktilat', ARRAY['Calcium Stearoyl Lactylate', 'E482', 'CSL'], 'gida', 'Emülgatör', 'guvenli', 'EFSA', null),
  ('Diaçetil Tartarik Asit Esterleri', ARRAY['DATEM', 'E472e', 'Diacetyl Tartaric Acid Esters'], 'gida', 'Emülgatör, hamur iyileştirici', 'guvenli', 'EFSA', null),
  ('Sükroz Esterleri', ARRAY['Sucrose Esters', 'E473'], 'gida', 'Emülgatör', 'guvenli', 'EFSA', null),
  ('Polisorbat 80', ARRAY['Polysorbate 80', 'E433', 'Tween 80'], 'gida', 'Emülgatör', 'dikkat', 'EFSA', '{"bebek": "dikkat"}'::jsonb),
  ('Polisorbat 60', ARRAY['Polysorbate 60', 'E435', 'Tween 60'], 'gida', 'Emülgatör', 'dikkat', 'EFSA', '{"bebek": "dikkat"}'::jsonb),
  ('Sorbitan Monostearat', ARRAY['Sorbitan Monostearate', 'E491', 'Span 60'], 'gida', 'Emülgatör', 'guvenli', 'EFSA', null),
  ('Gliserol', ARRAY['Glycerol', 'E422', 'Glycerin'], 'gida', 'Nem tutucu, tatlandırıcı', 'guvenli', 'EFSA', null),
  ('Sorbitol', ARRAY['Sorbitol', 'E420'], 'gida', 'Tatlandırıcı, nem tutucu', 'guvenli', 'EFSA', '{"diyabet": "dikkat"}'::jsonb),
  ('Mannitol', ARRAY['Mannitol', 'E421'], 'gida', 'Tatlandırıcı', 'guvenli', 'EFSA', '{"diyabet": "dikkat"}'::jsonb),
  ('Maltitol', ARRAY['Maltitol', 'E965'], 'gida', 'Tatlandırıcı', 'guvenli', 'EFSA', '{"diyabet": "dikkat"}'::jsonb);

-- =============================================
-- GIDA - Blok 4: Nişasta, un ve doğal katkılar (guvenli)
-- =============================================
INSERT INTO public.maddeler (ad, es_anlamlilar, kategori, islev, risk_seviyesi, kaynak, kitle_bayraklari) VALUES
  ('Mısır Nişastası', ARRAY['Corn Starch', 'Maize Starch'], 'gida', 'Kıvam artırıcı, bağlayıcı', 'guvenli', 'EFSA', null),
  ('Modifiye Nişasta', ARRAY['Modified Starch', 'E1404', 'E1422', 'E1442'], 'gida', 'Kıvam artırıcı, stabilizatör', 'guvenli', 'EFSA', null),
  ('Maltodekstrin', ARRAY['Maltodextrin'], 'gida', 'Dolgu maddesi, kıvam artırıcı', 'guvenli', 'EFSA', '{"diyabet": "dikkat"}'::jsonb),
  ('Dekstroz', ARRAY['Dextrose', 'Glucose', 'D-Glucose'], 'gida', 'Tatlandırıcı', 'guvenli', 'EFSA', '{"diyabet": "dikkat"}'::jsonb),
  ('İnülin', ARRAY['Inulin'], 'gida', 'Prebiyotik lif', 'guvenli', 'EFSA', null),
  ('Polidekstroz', ARRAY['Polydextrose', 'E1200'], 'gida', 'Lif kaynağı, dolgu maddesi', 'guvenli', 'EFSA', null),
  ('Jelatin', ARRAY['Gelatin', 'Gelatine'], 'gida', 'Jelleştirici, stabilizatör', 'guvenli', 'EFSA', '{"vegan": "sakincali"}'::jsonb),
  ('Kolajen', ARRAY['Collagen', 'Hydrolyzed Collagen'], 'gida', 'Protein takviyesi', 'guvenli', 'EFSA', '{"vegan": "sakincali"}'::jsonb),
  ('Kazein', ARRAY['Casein', 'Sodium Caseinate', 'Caseinates'], 'gida', 'Protein kaynağı, emülgatör', 'guvenli', 'EFSA', '{"laktoz_intoleransi": "dikkat", "vegan": "sakincali"}'::jsonb),
  ('Peynir Altı Suyu Tozu', ARRAY['Whey Powder', 'Whey Protein', 'Lactoserum'], 'gida', 'Protein kaynağı', 'guvenli', 'EFSA', '{"laktoz_intoleransi": "sakincali", "vegan": "sakincali"}'::jsonb),
  ('Laktoz', ARRAY['Lactose', 'Milk Sugar'], 'gida', 'Tatlandırıcı, dolgu', 'guvenli', 'EFSA', '{"laktoz_intoleransi": "sakincali", "vegan": "sakincali"}'::jsonb),
  ('Süt Tozu', ARRAY['Milk Powder', 'Dried Milk', 'Skimmed Milk Powder'], 'gida', 'Protein ve kalsiyum kaynağı', 'guvenli', 'EFSA', '{"laktoz_intoleransi": "sakincali", "vegan": "sakincali"}'::jsonb),
  ('Soya Proteini', ARRAY['Soy Protein', 'Soy Protein Isolate'], 'gida', 'Protein kaynağı', 'guvenli', 'EFSA', null),
  ('Buğday Proteini', ARRAY['Wheat Protein', 'Wheat Gluten', 'Vital Wheat Gluten'], 'gida', 'Yapı verici, protein kaynağı', 'guvenli', 'EFSA', '{"gluten_alerjisi": "sakincali"}'::jsonb),
  ('Malt Özütü', ARRAY['Malt Extract', 'Barley Malt Extract'], 'gida', 'Tatlandırıcı, renklendirici', 'guvenli', 'EFSA', '{"gluten_alerjisi": "sakincali"}'::jsonb),
  ('Buğday Unu', ARRAY['Wheat Flour', 'Enriched Wheat Flour'], 'gida', 'Temel hammadde', 'guvenli', 'EFSA', '{"gluten_alerjisi": "sakincali"}'::jsonb),
  ('Fıstık Yağı', ARRAY['Peanut Oil', 'Arachis Hypogaea Oil', 'Groundnut Oil'], 'gida', 'Bitkisel yağ', 'guvenli', 'EFSA', '{"fistik_alerjisi": "sakincali"}'::jsonb),
  ('Fıstık Proteini', ARRAY['Peanut Protein', 'Arachis Hypogaea'], 'gida', 'Protein kaynağı', 'guvenli', 'EFSA', '{"fistik_alerjisi": "sakincali"}'::jsonb),
  ('Palm Yağı', ARRAY['Palm Oil', 'Palm Fat', 'Elaeis Guineensis'], 'gida', 'Bitkisel yağ', 'dikkat', 'WHO', null),
  ('Ayçiçek Yağı', ARRAY['Sunflower Oil', 'Helianthus Annuus Oil'], 'gida', 'Bitkisel yağ', 'guvenli', 'EFSA', null),
  ('Zeytinyağı', ARRAY['Olive Oil', 'Extra Virgin Olive Oil', 'Olea Europaea'], 'gida', 'Bitkisel yağ', 'guvenli', 'EFSA', null),
  ('Hindistancevizi Yağı', ARRAY['Coconut Oil', 'Cocos Nucifera Oil'], 'gida', 'Bitkisel yağ', 'guvenli', 'EFSA', null),
  ('Kakao Yağı', ARRAY['Cocoa Butter', 'Theobroma Cacao Butter'], 'gida', 'Bitkisel yağ', 'guvenli', 'EFSA', null),
  ('Kolza Yağı', ARRAY['Rapeseed Oil', 'Canola Oil'], 'gida', 'Bitkisel yağ', 'guvenli', 'EFSA', null);

-- =============================================
-- GIDA - Blok 5: Koruyucular (dikkat + sakincali)
-- =============================================
INSERT INTO public.maddeler (ad, es_anlamlilar, kategori, islev, risk_seviyesi, kaynak, kitle_bayraklari) VALUES
  ('Sodyum Nitrit', ARRAY['Sodium Nitrite', 'E250'], 'gida', 'Koruyucu, renk sabitleyici', 'dikkat', 'EFSA', '{"bebek": "sakincali", "hamile": "dikkat"}'::jsonb),
  ('Sodyum Nitrat', ARRAY['Sodium Nitrate', 'E251'], 'gida', 'Koruyucu', 'dikkat', 'EFSA', '{"bebek": "sakincali", "hamile": "dikkat"}'::jsonb),
  ('Potasyum Nitrit', ARRAY['Potassium Nitrite', 'E249'], 'gida', 'Koruyucu', 'dikkat', 'EFSA', '{"bebek": "sakincali", "hamile": "dikkat"}'::jsonb),
  ('Potasyum Nitrat', ARRAY['Potassium Nitrate', 'E252'], 'gida', 'Koruyucu', 'dikkat', 'EFSA', '{"bebek": "sakincali", "hamile": "dikkat"}'::jsonb),
  ('Sorbik Asit', ARRAY['Sorbic Acid', 'E200'], 'gida', 'Koruyucu', 'dikkat', 'EFSA', '{"bebek": "dikkat"}'::jsonb),
  ('Potasyum Sorbat', ARRAY['Potassium Sorbate', 'E202'], 'gida', 'Koruyucu', 'dikkat', 'EFSA', '{"bebek": "dikkat"}'::jsonb),
  ('Kalsiyum Sorbat', ARRAY['Calcium Sorbate', 'E203'], 'gida', 'Koruyucu', 'dikkat', 'EFSA', '{"bebek": "dikkat"}'::jsonb),
  ('Sülfür Dioksit', ARRAY['Sulfur Dioxide', 'E220', 'SO2'], 'gida', 'Koruyucu, antioksidan', 'dikkat', 'EFSA', '{"bebek": "sakincali", "hassas_cilt": "dikkat"}'::jsonb),
  ('Sodyum Metabisülfit', ARRAY['Sodium Metabisulfite', 'E223'], 'gida', 'Koruyucu, antioksidan', 'dikkat', 'EFSA', '{"bebek": "sakincali", "hassas_cilt": "dikkat"}'::jsonb),
  ('Potasyum Metabisülfit', ARRAY['Potassium Metabisulfite', 'E224'], 'gida', 'Koruyucu', 'dikkat', 'EFSA', '{"bebek": "sakincali"}'::jsonb),
  ('Natamisin', ARRAY['Natamycin', 'E235'], 'gida', 'Koruyucu (peynir, et yüzeyi)', 'dikkat', 'EFSA', '{"bebek": "dikkat"}'::jsonb),
  ('Propiyonik Asit', ARRAY['Propionic Acid', 'E280'], 'gida', 'Koruyucu (küf önleyici)', 'guvenli', 'EFSA', null),
  ('Sodyum Propiyonat', ARRAY['Sodium Propionate', 'E281'], 'gida', 'Koruyucu (küf önleyici)', 'guvenli', 'EFSA', null),
  ('Kalsiyum Propiyonat', ARRAY['Calcium Propionate', 'E282'], 'gida', 'Koruyucu (küf önleyici)', 'guvenli', 'EFSA', null),
  ('Potasyum Benzoat', ARRAY['Potassium Benzoate', 'E212'], 'gida', 'Koruyucu', 'dikkat', 'EFSA', '{"bebek": "sakincali"}'::jsonb),
  ('Benzoik Asit', ARRAY['Benzoic Acid', 'E210'], 'gida', 'Koruyucu', 'dikkat', 'EFSA', '{"bebek": "sakincali"}'::jsonb),
  ('Nisin', ARRAY['Nisin', 'E234'], 'gida', 'Doğal koruyucu', 'guvenli', 'EFSA', null),
  ('Lizozim', ARRAY['Lysozyme', 'E1105'], 'gida', 'Doğal koruyucu', 'guvenli', 'EFSA', null);

-- =============================================
-- GIDA - Blok 6: Tatlandırıcılar (dikkat + sakincali)
-- =============================================
INSERT INTO public.maddeler (ad, es_anlamlilar, kategori, islev, risk_seviyesi, kaynak, kitle_bayraklari) VALUES
  ('Aspartam', ARRAY['Aspartame', 'E951', 'NutraSweet'], 'gida', 'Yapay tatlandırıcı', 'dikkat', 'EFSA', '{"bebek": "sakincali", "hamile": "dikkat"}'::jsonb),
  ('Asesülfam-K', ARRAY['Acesulfame K', 'E950', 'Acesulfame Potassium'], 'gida', 'Yapay tatlandırıcı', 'dikkat', 'EFSA', '{"bebek": "sakincali"}'::jsonb),
  ('Sükraloz', ARRAY['Sucralose', 'E955', 'Splenda'], 'gida', 'Yapay tatlandırıcı', 'dikkat', 'EFSA', '{"bebek": "sakincali"}'::jsonb),
  ('Sakarin', ARRAY['Saccharin', 'E954', 'Sodium Saccharin'], 'gida', 'Yapay tatlandırıcı', 'dikkat', 'EFSA', '{"bebek": "sakincali", "hamile": "dikkat"}'::jsonb),
  ('Siklamat', ARRAY['Cyclamate', 'E952', 'Sodium Cyclamate'], 'gida', 'Yapay tatlandırıcı', 'sakincali', 'EFSA', '{"bebek": "sakincali", "hamile": "sakincali"}'::jsonb),
  ('Neotam', ARRAY['Neotame', 'E961'], 'gida', 'Yapay tatlandırıcı', 'dikkat', 'EFSA', '{"bebek": "sakincali"}'::jsonb),
  ('Steviol Glikozitleri', ARRAY['Steviol Glycosides', 'E960', 'Stevia'], 'gida', 'Doğal tatlandırıcı', 'guvenli', 'EFSA', null),
  ('Eritritol', ARRAY['Erythritol', 'E968'], 'gida', 'Doğal şeker alkolü tatlandırıcı', 'guvenli', 'EFSA', null),
  ('Ksilitol', ARRAY['Xylitol', 'E967'], 'gida', 'Şeker alkolü tatlandırıcı', 'guvenli', 'EFSA', '{"diyabet": "guvenli"}'::jsonb),
  ('Taumatine', ARRAY['Thaumatin', 'E957'], 'gida', 'Doğal tatlandırıcı', 'guvenli', 'EFSA', null),
  ('İzomalt', ARRAY['Isomalt', 'E953'], 'gida', 'Şeker alkolü tatlandırıcı', 'guvenli', 'EFSA', '{"diyabet": "dikkat"}'::jsonb),
  ('Sukroz', ARRAY['Sucrose', 'Sugar', 'Table Sugar', 'Seker'], 'gida', 'Tatlandırıcı', 'guvenli', 'WHO', '{"diyabet": "sakincali"}'::jsonb),
  ('Fruktoz', ARRAY['Fructose', 'Fruit Sugar'], 'gida', 'Tatlandırıcı', 'guvenli', 'WHO', '{"diyabet": "dikkat"}'::jsonb),
  ('Glikoz Şurubu', ARRAY['Glucose Syrup', 'Corn Syrup', 'Glucose-Fructose Syrup'], 'gida', 'Tatlandırıcı', 'dikkat', 'WHO', '{"diyabet": "sakincali", "bebek": "dikkat"}'::jsonb),
  ('Yüksek Fruktozlu Mısır Şurubu', ARRAY['High Fructose Corn Syrup', 'HFCS', 'Isoglucose'], 'gida', 'Tatlandırıcı', 'sakincali', 'WHO', '{"diyabet": "sakincali", "bebek": "sakincali"}'::jsonb),
  ('İnvert Şeker', ARRAY['Invert Sugar', 'Inverted Sugar Syrup'], 'gida', 'Tatlandırıcı', 'guvenli', 'EFSA', '{"diyabet": "sakincali"}'::jsonb);

-- =============================================
-- GIDA - Blok 7: Sentetik renklendiriciler (sakincali) ve doğal renklendiriciler
-- =============================================
INSERT INTO public.maddeler (ad, es_anlamlilar, kategori, islev, risk_seviyesi, kaynak, kitle_bayraklari) VALUES
  ('Tartrazin', ARRAY['Tartrazine', 'E102', 'FD&C Yellow 5', 'CI 19140'], 'gida', 'Sentetik sarı renklendirici', 'sakincali', 'EFSA', '{"bebek": "sakincali", "hassas_cilt": "dikkat"}'::jsonb),
  ('Kinolin Sarısı', ARRAY['Quinoline Yellow', 'E104', 'CI 47005'], 'gida', 'Sentetik sarı renklendirici', 'sakincali', 'EFSA', '{"bebek": "sakincali", "hassas_cilt": "dikkat"}'::jsonb),
  ('Günbatımı Sarısı', ARRAY['Sunset Yellow', 'E110', 'FD&C Yellow 6', 'CI 15985'], 'gida', 'Sentetik turuncu renklendirici', 'sakincali', 'EFSA', '{"bebek": "sakincali", "hassas_cilt": "dikkat"}'::jsonb),
  ('Azorubin', ARRAY['Azorubine', 'E122', 'Carmoisine', 'CI 14720'], 'gida', 'Sentetik kırmızı renklendirici', 'sakincali', 'EFSA', '{"bebek": "sakincali", "hassas_cilt": "dikkat"}'::jsonb),
  ('Ponso 4R', ARRAY['Ponceau 4R', 'E124', 'CI 16255'], 'gida', 'Sentetik kırmızı renklendirici', 'sakincali', 'EFSA', '{"bebek": "sakincali", "hassas_cilt": "dikkat"}'::jsonb),
  ('Allura Red', ARRAY['Allura Red AC', 'E129', 'FD&C Red 40', 'CI 16035'], 'gida', 'Sentetik kırmızı renklendirici', 'sakincali', 'EFSA', '{"bebek": "sakincali", "hassas_cilt": "dikkat"}'::jsonb),
  ('Brilliant Blue', ARRAY['Brilliant Blue FCF', 'E133', 'FD&C Blue 1', 'CI 42090'], 'gida', 'Sentetik mavi renklendirici', 'sakincali', 'EFSA', '{"bebek": "sakincali", "hassas_cilt": "dikkat"}'::jsonb),
  ('Patent Blue', ARRAY['Patent Blue V', 'E131', 'CI 42051'], 'gida', 'Sentetik mavi renklendirici', 'sakincali', 'EFSA', '{"bebek": "sakincali", "hassas_cilt": "dikkat"}'::jsonb),
  ('İndigotin', ARRAY['Indigotine', 'E132', 'FD&C Blue 2', 'CI 73015'], 'gida', 'Sentetik mavi renklendirici', 'sakincali', 'EFSA', '{"bebek": "sakincali"}'::jsonb),
  ('Yeşil S', ARRAY['Green S', 'E142', 'CI 44090'], 'gida', 'Sentetik yeşil renklendirici', 'sakincali', 'EFSA', '{"bebek": "sakincali"}'::jsonb),
  ('Eritrosin', ARRAY['Erythrosine', 'E127', 'FD&C Red 3', 'CI 45430'], 'gida', 'Sentetik kırmızı renklendirici', 'sakincali', 'FDA', '{"bebek": "sakincali", "hamile": "dikkat"}'::jsonb),
  ('Amaranth', ARRAY['Amaranth', 'E123', 'CI 16185', 'FD&C Red 2'], 'gida', 'Sentetik kırmızı renklendirici', 'sakincali', 'EFSA', '{"bebek": "sakincali", "hamile": "sakincali"}'::jsonb),
  ('Karmin', ARRAY['Carmine', 'E120', 'Cochineal', 'CI 75470', 'Koşnil'], 'gida', 'Doğal kırmızı renklendirici (böcek)', 'dikkat', 'EFSA', '{"vegan": "sakincali", "hassas_cilt": "dikkat"}'::jsonb),
  ('Klorofil', ARRAY['Chlorophyll', 'E140', 'Chlorophyllin'], 'gida', 'Doğal yeşil renklendirici', 'guvenli', 'EFSA', null),
  ('Bakır Klorofilin', ARRAY['Copper Chlorophyllin', 'E141'], 'gida', 'Doğal yeşil renklendirici', 'guvenli', 'EFSA', null),
  ('Annatto', ARRAY['Annatto', 'E160b', 'Bixin', 'Norbixin'], 'gida', 'Doğal sarı-turuncu renklendirici', 'guvenli', 'EFSA', null),
  ('Paprika Özütü', ARRAY['Paprika Extract', 'E160c', 'Capsanthin'], 'gida', 'Doğal kırmızı renklendirici', 'guvenli', 'EFSA', null),
  ('Karamel', ARRAY['Caramel Color', 'E150a', 'E150b', 'E150c', 'E150d'], 'gida', 'Renklendirici', 'dikkat', 'EFSA', '{"bebek": "dikkat"}'::jsonb),
  ('Titanyum Dioksit', ARRAY['Titanium Dioxide', 'E171', 'CI 77891'], 'gida', 'Beyaz renklendirici', 'sakincali', 'EFSA', '{"bebek": "sakincali", "hamile": "dikkat"}'::jsonb),
  ('Aktif Kömür', ARRAY['Vegetable Carbon', 'E153', 'Activated Charcoal'], 'gida', 'Siyah renklendirici', 'guvenli', 'EFSA', null),
  ('Pancar Kırmızısı', ARRAY['Beetroot Red', 'E162', 'Betanin'], 'gida', 'Doğal kırmızı renklendirici', 'guvenli', 'EFSA', null),
  ('Antosiyaninler', ARRAY['Anthocyanins', 'E163'], 'gida', 'Doğal mor-kırmızı renklendirici', 'guvenli', 'EFSA', null),
  ('Kurkumin', ARRAY['Curcumin', 'E100', 'Turmeric'], 'gida', 'Doğal sarı renklendirici', 'guvenli', 'EFSA', null);

-- =============================================
-- GIDA - Blok 8: Lezzet artırıcılar, antioksidanlar ve diğer katkılar
-- =============================================
INSERT INTO public.maddeler (ad, es_anlamlilar, kategori, islev, risk_seviyesi, kaynak, kitle_bayraklari) VALUES
  ('Monosodyum Glutamat', ARRAY['Monosodium Glutamate', 'MSG', 'E621'], 'gida', 'Lezzet artırıcı', 'dikkat', 'EFSA', '{"bebek": "sakincali"}'::jsonb),
  ('Disodyum Guanilat', ARRAY['Disodium Guanylate', 'E627'], 'gida', 'Lezzet artırıcı', 'dikkat', 'EFSA', '{"bebek": "dikkat"}'::jsonb),
  ('Disodyum İnosinat', ARRAY['Disodium Inosinate', 'E631'], 'gida', 'Lezzet artırıcı', 'dikkat', 'EFSA', '{"bebek": "dikkat"}'::jsonb),
  ('Disodyum 5-Ribonükleotidler', ARRAY['Disodium 5-Ribonucleotides', 'E635'], 'gida', 'Lezzet artırıcı', 'dikkat', 'EFSA', '{"bebek": "dikkat"}'::jsonb),
  ('BHT', ARRAY['Butylated Hydroxytoluene', 'E321'], 'gida', 'Sentetik antioksidan', 'dikkat', 'EFSA', '{"bebek": "sakincali", "hamile": "dikkat"}'::jsonb),
  ('BHA', ARRAY['Butylated Hydroxyanisole', 'E320'], 'gida', 'Sentetik antioksidan', 'dikkat', 'EFSA', '{"bebek": "sakincali", "hamile": "dikkat"}'::jsonb),
  ('TBHQ', ARRAY['Tert-Butylhydroquinone', 'E319'], 'gida', 'Sentetik antioksidan', 'dikkat', 'FDA', '{"bebek": "sakincali"}'::jsonb),
  ('Potasyum Bromat', ARRAY['Potassium Bromate', 'E924'], 'gida', 'Hamur iyileştirici', 'sakincali', 'WHO', '{"bebek": "sakincali", "hamile": "sakincali"}'::jsonb),
  ('Azodikarbonamid', ARRAY['Azodicarbonamide', 'E927a', 'ADA'], 'gida', 'Hamur iyileştirici, ağartıcı', 'sakincali', 'EFSA', '{"bebek": "sakincali", "hamile": "sakincali"}'::jsonb),
  ('Bromlanmış Bitkisel Yağ', ARRAY['Brominated Vegetable Oil', 'E443', 'BVO'], 'gida', 'Emülgatör, stabilizatör', 'sakincali', 'FDA', '{"bebek": "sakincali", "hamile": "sakincali"}'::jsonb),
  ('Karragenan', ARRAY['Carrageenan', 'E407'], 'gida', 'Kıvam artırıcı, jelleştirici', 'dikkat', 'EFSA', '{"bebek": "sakincali"}'::jsonb),
  ('Sodyum Alüminosilikat', ARRAY['Sodium Aluminosilicate', 'E554'], 'gida', 'Topaklanma önleyici', 'dikkat', 'EFSA', '{"bebek": "dikkat"}'::jsonb),
  ('Kalsiyum Alüminosilikat', ARRAY['Calcium Aluminosilicate', 'E556'], 'gida', 'Topaklanma önleyici', 'dikkat', 'EFSA', null),
  ('Silikon Dioksit', ARRAY['Silicon Dioxide', 'E551'], 'gida', 'Topaklanma önleyici', 'guvenli', 'EFSA', null),
  ('Sodyum Aljinat', ARRAY['Sodium Alginate', 'E401'], 'gida', 'Kıvam artırıcı, stabilizatör', 'guvenli', 'EFSA', null),
  ('Kalsiyum Aljinat', ARRAY['Calcium Alginate', 'E404'], 'gida', 'Jelleştirici', 'guvenli', 'EFSA', null),
  ('Balmumu', ARRAY['Beeswax', 'E901', 'Cera Alba'], 'gida', 'Kaplama maddesi', 'guvenli', 'EFSA', '{"vegan": "sakincali"}'::jsonb),
  ('Karnauba Mumu', ARRAY['Carnauba Wax', 'E903'], 'gida', 'Kaplama maddesi', 'guvenli', 'EFSA', null),
  ('Şellak', ARRAY['Shellac', 'E904'], 'gida', 'Kaplama maddesi', 'guvenli', 'EFSA', '{"vegan": "sakincali"}'::jsonb),
  ('Lanolin', ARRAY['Lanolin', 'Wool Wax'], 'gida', 'Kaplama maddesi', 'guvenli', 'EFSA', '{"vegan": "sakincali"}'::jsonb),
  ('Tuz', ARRAY['Salt', 'Sodium Chloride', 'NaCl'], 'gida', 'Lezzet verici, koruyucu', 'guvenli', 'WHO', null),
  ('Kafein', ARRAY['Caffeine', 'Guarana Extract'], 'gida', 'Uyarıcı', 'dikkat', 'EFSA', '{"bebek": "sakincali", "hamile": "dikkat"}'::jsonb),
  ('Taurin', ARRAY['Taurine', '2-Aminoethane Sulfonic Acid'], 'gida', 'Amino asit türevi', 'guvenli', 'EFSA', '{"bebek": "dikkat"}'::jsonb),
  ('L-Karnitin', ARRAY['L-Carnitine', 'Levocarnitine'], 'gida', 'Amino asit türevi', 'guvenli', 'EFSA', null),
  ('Keratin', ARRAY['Keratin', 'Hydrolyzed Keratin'], 'gida', 'Protein kaynağı', 'guvenli', 'EFSA', '{"vegan": "dikkat"}'::jsonb);

-- =============================================
-- GIDA - Blok 9: Ek gıda katkı maddeleri
-- =============================================
INSERT INTO public.maddeler (ad, es_anlamlilar, kategori, islev, risk_seviyesi, kaynak, kitle_bayraklari) VALUES
  ('Sodyum Eritorbat', ARRAY['Sodium Erythorbate', 'E316'], 'gida', 'Antioksidan', 'guvenli', 'EFSA', null),
  ('Eritorbik Asit', ARRAY['Erythorbic Acid', 'E315'], 'gida', 'Antioksidan', 'guvenli', 'EFSA', null),
  ('Propil Gallat', ARRAY['Propyl Gallate', 'E310'], 'gida', 'Antioksidan', 'dikkat', 'EFSA', '{"bebek": "dikkat"}'::jsonb),
  ('Oktil Gallat', ARRAY['Octyl Gallate', 'E311'], 'gida', 'Antioksidan', 'dikkat', 'EFSA', '{"bebek": "dikkat"}'::jsonb),
  ('Dodekil Gallat', ARRAY['Dodecyl Gallate', 'E312'], 'gida', 'Antioksidan', 'dikkat', 'EFSA', '{"bebek": "dikkat"}'::jsonb),
  ('Diasetil', ARRAY['Diacetyl', '2,3-Butanedione'], 'gida', 'Aroma maddesi (tereyağı aroması)', 'dikkat', 'FDA', null),
  ('Sodyum Tripolifosfat', ARRAY['Sodium Tripolyphosphate', 'E451', 'STPP'], 'gida', 'Emülgatör, su tutucu', 'dikkat', 'EFSA', null),
  ('Sodyum Pirofosfat', ARRAY['Sodium Pyrophosphate', 'E450'], 'gida', 'Emülgatör, kabartma maddesi', 'dikkat', 'EFSA', null),
  ('Polifosfatlar', ARRAY['Polyphosphates', 'E452'], 'gida', 'Su tutucu, emülgatör', 'dikkat', 'EFSA', null),
  ('Transglutaminaz', ARRAY['Transglutaminase', 'TG', 'Meat Glue'], 'gida', 'Protein bağlayıcı (et yapıştırıcı)', 'dikkat', 'FDA', null),
  ('Sodyum Kazeinat', ARRAY['Sodium Caseinate'], 'gida', 'Protein kaynağı, emülgatör', 'guvenli', 'EFSA', '{"laktoz_intoleransi": "dikkat", "vegan": "sakincali"}'::jsonb),
  ('Potasyum Klorür', ARRAY['Potassium Chloride', 'E508'], 'gida', 'Tuz ikamesi, mineral', 'guvenli', 'EFSA', null),
  ('Magnezyum Klorür', ARRAY['Magnesium Chloride', 'E511', 'Nigari'], 'gida', 'Pıhtılaştırıcı (tofu)', 'guvenli', 'EFSA', null),
  ('Magnezyum Stearat', ARRAY['Magnesium Stearate', 'E470b'], 'gida', 'Kaydırıcı, topaklanma önleyici', 'guvenli', 'EFSA', null),
  ('Konjak Gam', ARRAY['Konjac Gum', 'E425', 'Glucomannan'], 'gida', 'Kıvam artırıcı, jelleştirici', 'guvenli', 'EFSA', null),
  ('Tragakant Gam', ARRAY['Tragacanth Gum', 'E413'], 'gida', 'Kıvam artırıcı, stabilizatör', 'guvenli', 'EFSA', null),
  ('Karaya Gam', ARRAY['Karaya Gum', 'E416'], 'gida', 'Kıvam artırıcı', 'guvenli', 'EFSA', null),
  ('Sodyum Aljinat', ARRAY['Sodium Alginate', 'E401', 'Alginic Acid'], 'gida', 'Kıvam artırıcı, jelleştirici', 'guvenli', 'EFSA', null),
  ('Aljinik Asit', ARRAY['Alginic Acid', 'E400'], 'gida', 'Kıvam artırıcı', 'guvenli', 'EFSA', null),
  ('Asetillenmiş Nişasta', ARRAY['Acetylated Starch', 'E1420'], 'gida', 'Modifiye nişasta', 'guvenli', 'EFSA', null),
  ('Oksijenlenmiş Nişasta', ARRAY['Oxidised Starch', 'E1404'], 'gida', 'Modifiye nişasta', 'guvenli', 'EFSA', null),
  ('Hidroksipropil Nişasta', ARRAY['Hydroxypropyl Starch', 'E1442'], 'gida', 'Modifiye nişasta, kıvam artırıcı', 'guvenli', 'EFSA', null),
  ('Bitkisel Gliserin', ARRAY['Vegetable Glycerin', 'VG', 'Glycerol'], 'gida', 'Nem tutucu, tatlandırıcı', 'guvenli', 'EFSA', null),
  ('İpek Proteini', ARRAY['Silk Protein', 'Sericin', 'Hydrolyzed Silk'], 'gida', 'Protein takviyesi', 'guvenli', 'EFSA', '{"vegan": "sakincali"}'::jsonb);

-- =============================================
-- KOZMETİK - Blok 1: Nemlendirciler ve emolyanlar (guvenli)
-- =============================================
INSERT INTO public.maddeler (ad, es_anlamlilar, kategori, islev, risk_seviyesi, kaynak, kitle_bayraklari) VALUES
  ('Gliserin', ARRAY['Glycerin', 'Glycerol', 'Vegetable Glycerin'], 'kozmetik', 'Humektant, nemlendirici', 'guvenli', 'CIR', null),
  ('Hyaluronik Asit', ARRAY['Hyaluronic Acid', 'Sodium Hyaluronate', 'HA'], 'kozmetik', 'Humektant, nemlendirici', 'guvenli', 'CIR', null),
  ('Shea Yağı', ARRAY['Shea Butter', 'Butyrospermum Parkii Butter'], 'kozmetik', 'Emolyan, nemlendirici', 'guvenli', 'CIR', null),
  ('Aloe Vera', ARRAY['Aloe Barbadensis Leaf Juice', 'Aloe Vera Extract'], 'kozmetik', 'Yatıştırıcı, nemlendirici', 'guvenli', 'CIR', null),
  ('Panthenol', ARRAY['Panthenol', 'Provitamin B5', 'Dexpanthenol', 'D-Panthenol'], 'kozmetik', 'Nemlendirici, iyileştirici', 'guvenli', 'CIR', null),
  ('Jojoba Yağı', ARRAY['Jojoba Oil', 'Simmondsia Chinensis Seed Oil'], 'kozmetik', 'Emolyan, nemlendirici', 'guvenli', 'CIR', null),
  ('Argan Yağı', ARRAY['Argan Oil', 'Argania Spinosa Kernel Oil'], 'kozmetik', 'Emolyan, besleyici', 'guvenli', 'CIR', null),
  ('Squalane', ARRAY['Squalane', 'Squalene', 'Olive Squalane'], 'kozmetik', 'Emolyan, nemlendirici', 'guvenli', 'CIR', null),
  ('Seramid', ARRAY['Ceramide', 'Ceramide NP', 'Ceramide AP', 'Ceramide EOP'], 'kozmetik', 'Bariyer onarıcı, nemlendirici', 'guvenli', 'CIR', null),
  ('Allantoin', ARRAY['Allantoin', 'Comfrey Extract'], 'kozmetik', 'Yatıştırıcı, iyileştirici', 'guvenli', 'CIR', null),
  ('Bisabolol', ARRAY['Bisabolol', 'Alpha-Bisabolol', 'Levomenol'], 'kozmetik', 'Yatıştırıcı, anti-enflamatuar', 'guvenli', 'CIR', null),
  ('Karite Yağı', ARRAY['Shea Butter', 'Karite Butter', 'Butyrospermum Parkii'], 'kozmetik', 'Emolyan', 'guvenli', 'CIR', null),
  ('Kakao Yağı', ARRAY['Cocoa Butter', 'Theobroma Cacao Seed Butter'], 'kozmetik', 'Emolyan, nemlendirici', 'guvenli', 'CIR', null),
  ('Hindistancevizi Yağı', ARRAY['Coconut Oil', 'Cocos Nucifera Oil'], 'kozmetik', 'Emolyan, temizleyici', 'guvenli', 'CIR', null),
  ('Badem Yağı', ARRAY['Sweet Almond Oil', 'Prunus Amygdalus Dulcis Oil'], 'kozmetik', 'Emolyan, yumuşatıcı', 'guvenli', 'CIR', null),
  ('Zeytinyağı', ARRAY['Olive Oil', 'Olea Europaea Fruit Oil'], 'kozmetik', 'Emolyan', 'guvenli', 'CIR', null),
  ('Avokado Yağı', ARRAY['Avocado Oil', 'Persea Gratissima Oil'], 'kozmetik', 'Emolyan, besleyici', 'guvenli', 'CIR', null),
  ('Çay Ağacı Yağı', ARRAY['Tea Tree Oil', 'Melaleuca Alternifolia Leaf Oil'], 'kozmetik', 'Antiseptik, arındırıcı', 'guvenli', 'CIR', '{"hassas_cilt": "dikkat"}'::jsonb),
  ('E Vitamini', ARRAY['Tocopherol', 'Tocopheryl Acetate', 'Vitamin E'], 'kozmetik', 'Antioksidan, nemlendirici', 'guvenli', 'CIR', null),
  ('C Vitamini', ARRAY['Ascorbic Acid', 'Ascorbyl Glucoside', 'L-Ascorbic Acid', 'Ethyl Ascorbic Acid'], 'kozmetik', 'Antioksidan, aydınlatıcı', 'guvenli', 'CIR', null),
  ('Niasinamid', ARRAY['Niacinamide', 'Nicotinamide', 'Vitamin B3'], 'kozmetik', 'Gözenek sıkılaştırıcı, aydınlatıcı', 'guvenli', 'CIR', null),
  ('Peptitler', ARRAY['Peptides', 'Copper Peptides', 'Palmitoyl Pentapeptide'], 'kozmetik', 'Anti-aging, onarıcı', 'guvenli', 'CIR', null),
  ('Üre', ARRAY['Urea', 'Carbamide'], 'kozmetik', 'Humektant, keratolitik', 'guvenli', 'CIR', null),
  ('Propilen Glikol', ARRAY['Propylene Glycol', 'PG', '1,2-Propanediol'], 'kozmetik', 'Humektant, çözücü', 'dikkat', 'CIR', '{"hassas_cilt": "dikkat"}'::jsonb),
  ('Butilen Glikol', ARRAY['Butylene Glycol', '1,3-Butanediol'], 'kozmetik', 'Humektant, çözücü', 'guvenli', 'CIR', null);

-- =============================================
-- KOZMETİK - Blok 2: UV filtreler ve güneş koruyucular
-- =============================================
INSERT INTO public.maddeler (ad, es_anlamlilar, kategori, islev, risk_seviyesi, kaynak, kitle_bayraklari) VALUES
  ('Çinko Oksit', ARRAY['Zinc Oxide', 'ZnO', 'CI 77947'], 'kozmetik', 'Fiziksel UV filtre, yatıştırıcı', 'guvenli', 'CIR', null),
  ('Titanyum Dioksit', ARRAY['Titanium Dioxide', 'TiO2', 'CI 77891'], 'kozmetik', 'Fiziksel UV filtre, beyazlatıcı', 'guvenli', 'CIR', null),
  ('Oktinoksat', ARRAY['Octinoxate', 'Ethylhexyl Methoxycinnamate', 'OMC'], 'kozmetik', 'Kimyasal UVB filtre', 'dikkat', 'EWG', '{"hamile": "dikkat", "hassas_cilt": "dikkat"}'::jsonb),
  ('Oksibenson', ARRAY['Oxybenzone', 'Benzophenone-3', 'BP-3'], 'kozmetik', 'Kimyasal UVA/UVB filtre', 'sakincali', 'EWG', '{"hamile": "sakincali", "bebek": "sakincali", "hassas_cilt": "sakincali"}'::jsonb),
  ('Avobenzon', ARRAY['Avobenzone', 'Butyl Methoxydibenzoylmethane'], 'kozmetik', 'Kimyasal UVA filtre', 'dikkat', 'CIR', '{"hassas_cilt": "dikkat"}'::jsonb),
  ('Oktokilen', ARRAY['Octocrylene'], 'kozmetik', 'Kimyasal UVB filtre', 'dikkat', 'EWG', '{"hassas_cilt": "dikkat"}'::jsonb),
  ('Homosalat', ARRAY['Homosalate'], 'kozmetik', 'Kimyasal UVB filtre', 'dikkat', 'EWG', '{"hamile": "dikkat"}'::jsonb),
  ('Tinosorb S', ARRAY['Tinosorb S', 'Bis-Ethylhexyloxyphenol Methoxyphenyl Triazine'], 'kozmetik', 'Kimyasal UVA/UVB filtre', 'guvenli', 'CIR', null),
  ('Tinosorb M', ARRAY['Tinosorb M', 'Methylene Bis-Benzotriazolyl Tetramethylbutylphenol'], 'kozmetik', 'Kimyasal UVA/UVB filtre', 'guvenli', 'CIR', null),
  ('Uvinül A Plus', ARRAY['Uvinul A Plus', 'Diethylamino Hydroxybenzoyl Hexyl Benzoate'], 'kozmetik', 'Kimyasal UVA filtre', 'guvenli', 'CIR', null),
  ('Ensülizon', ARRAY['Ensulizole', 'Phenylbenzimidazole Sulfonic Acid'], 'kozmetik', 'Kimyasal UVB filtre', 'dikkat', 'CIR', '{"hassas_cilt": "dikkat"}'::jsonb),
  ('Mexoryl SX', ARRAY['Mexoryl SX', 'Ecamsule', 'Terephthalylidene Dicamphor Sulfonic Acid'], 'kozmetik', 'Kimyasal UVA filtre', 'guvenli', 'CIR', null);

-- =============================================
-- KOZMETİK - Blok 3: Aktif bileşenler (dikkat)
-- =============================================
INSERT INTO public.maddeler (ad, es_anlamlilar, kategori, islev, risk_seviyesi, kaynak, kitle_bayraklari) VALUES
  ('Retinol', ARRAY['Retinol', 'Vitamin A', 'Retinyl Palmitate', 'Retinaldehyde'], 'kozmetik', 'Anti-aging, hücre yenileme', 'dikkat', 'CIR', '{"hamile": "sakincali", "hassas_cilt": "dikkat"}'::jsonb),
  ('Salisilik Asit', ARRAY['Salicylic Acid', 'BHA', 'Beta Hydroxy Acid'], 'kozmetik', 'Keratolitik, akne tedavisi', 'dikkat', 'CIR', '{"hamile": "dikkat", "hassas_cilt": "dikkat"}'::jsonb),
  ('Glikolik Asit', ARRAY['Glycolic Acid', 'AHA', 'Alpha Hydroxy Acid'], 'kozmetik', 'Keratolitik, peeling', 'dikkat', 'CIR', '{"hassas_cilt": "dikkat"}'::jsonb),
  ('Laktik Asit', ARRAY['Lactic Acid', 'AHA'], 'kozmetik', 'Keratolitik, nemlendirici peeling', 'dikkat', 'CIR', '{"hassas_cilt": "dikkat"}'::jsonb),
  ('Benzoil Peroksit', ARRAY['Benzoyl Peroxide', 'BPO'], 'kozmetik', 'Akne tedavisi, antibakteriyel', 'dikkat', 'CIR', '{"hassas_cilt": "sakincali", "hamile": "dikkat"}'::jsonb),
  ('Hidrokinon', ARRAY['Hydroquinone', 'HQ'], 'kozmetik', 'Cilt beyazlatıcı', 'sakincali', 'FDA', '{"hamile": "sakincali", "bebek": "sakincali"}'::jsonb),
  ('Azelaik Asit', ARRAY['Azelaic Acid'], 'kozmetik', 'Akne ve rosasea tedavisi', 'guvenli', 'CIR', null),
  ('Mandik Asit', ARRAY['Mandelic Acid'], 'kozmetik', 'Hafif AHA, peeling', 'guvenli', 'CIR', '{"hassas_cilt": "dikkat"}'::jsonb),
  ('Bakuchiol', ARRAY['Bakuchiol', 'Psoralea Corylifolia'], 'kozmetik', 'Bitkisel retinol alternatifi', 'guvenli', 'CIR', null),
  ('Tranexamik Asit', ARRAY['Tranexamic Acid', 'TXA'], 'kozmetik', 'Leke karşıtı, aydınlatıcı', 'guvenli', 'CIR', null),
  ('Arbutin', ARRAY['Arbutin', 'Alpha-Arbutin', 'Beta-Arbutin'], 'kozmetik', 'Aydınlatıcı, leke karşıtı', 'guvenli', 'CIR', null),
  ('Kojik Asit', ARRAY['Kojic Acid'], 'kozmetik', 'Aydınlatıcı, leke karşıtı', 'dikkat', 'CIR', '{"hassas_cilt": "dikkat"}'::jsonb),
  ('Resveratrol', ARRAY['Resveratrol', 'Trans-Resveratrol'], 'kozmetik', 'Antioksidan, anti-aging', 'guvenli', 'CIR', null),
  ('Ferulik Asit', ARRAY['Ferulic Acid'], 'kozmetik', 'Antioksidan', 'guvenli', 'CIR', null),
  ('Koenzim Q10', ARRAY['Coenzyme Q10', 'Ubiquinone', 'CoQ10'], 'kozmetik', 'Antioksidan, anti-aging', 'guvenli', 'CIR', null),
  ('Kafein', ARRAY['Caffeine', 'Coffee Extract'], 'kozmetik', 'Göz altı karşıtı, sıkılaştırıcı', 'dikkat', 'CIR', '{"hamile": "dikkat"}'::jsonb);

-- =============================================
-- KOZMETİK - Blok 4: Koruyucular ve zararlılar (sakincali)
-- =============================================
INSERT INTO public.maddeler (ad, es_anlamlilar, kategori, islev, risk_seviyesi, kaynak, kitle_bayraklari) VALUES
  ('Formaldehit', ARRAY['Formaldehyde', 'Formalin', 'Methylene Glycol'], 'kozmetik', 'Koruyucu (yasaklanan)', 'sakincali', 'CIR', '{"hamile": "sakincali", "bebek": "sakincali", "hassas_cilt": "sakincali"}'::jsonb),
  ('Metilparaben', ARRAY['Methylparaben', 'Methyl 4-Hydroxybenzoate'], 'kozmetik', 'Koruyucu', 'sakincali', 'EWG', '{"hamile": "dikkat", "bebek": "sakincali"}'::jsonb),
  ('Propilparaben', ARRAY['Propylparaben', 'Propyl 4-Hydroxybenzoate'], 'kozmetik', 'Koruyucu', 'sakincali', 'EWG', '{"hamile": "sakincali", "bebek": "sakincali"}'::jsonb),
  ('Butilparaben', ARRAY['Butylparaben', 'Butyl 4-Hydroxybenzoate'], 'kozmetik', 'Koruyucu', 'sakincali', 'EWG', '{"hamile": "sakincali", "bebek": "sakincali"}'::jsonb),
  ('Etilparaben', ARRAY['Ethylparaben', 'Ethyl 4-Hydroxybenzoate'], 'kozmetik', 'Koruyucu', 'dikkat', 'EWG', '{"hamile": "dikkat", "bebek": "dikkat"}'::jsonb),
  ('Triklosan', ARRAY['Triclosan', 'Irgasan'], 'kozmetik', 'Antibakteriyel koruyucu', 'sakincali', 'FDA', '{"hamile": "sakincali", "bebek": "sakincali"}'::jsonb),
  ('Triklokarban', ARRAY['Triclocarban', 'TCC'], 'kozmetik', 'Antibakteriyel', 'sakincali', 'FDA', '{"hamile": "sakincali", "bebek": "sakincali"}'::jsonb),
  ('Toluen', ARRAY['Toluene', 'Methylbenzene'], 'kozmetik', 'Çözücü (tırnak ürünleri)', 'sakincali', 'EWG', '{"hamile": "sakincali", "bebek": "sakincali"}'::jsonb),
  ('Dibutilftalat', ARRAY['Dibutyl Phthalate', 'DBP', 'Phthalate'], 'kozmetik', 'Plastikleştirici', 'sakincali', 'EWG', '{"hamile": "sakincali", "bebek": "sakincali"}'::jsonb),
  ('Dietilftalat', ARRAY['Diethyl Phthalate', 'DEP'], 'kozmetik', 'Çözücü, koku sabitleyici', 'dikkat', 'EWG', '{"hamile": "dikkat", "bebek": "dikkat"}'::jsonb),
  ('DMDM Hidantoin', ARRAY['DMDM Hydantoin', 'Dimethylol Dimethyl Hydantoin'], 'kozmetik', 'Formaldehit salıcı koruyucu', 'sakincali', 'EWG', '{"hamile": "sakincali", "hassas_cilt": "sakincali"}'::jsonb),
  ('İmidazolidinül Üre', ARRAY['Imidazolidinyl Urea', 'Germall 115'], 'kozmetik', 'Formaldehit salıcı koruyucu', 'sakincali', 'EWG', '{"hamile": "sakincali", "hassas_cilt": "sakincali"}'::jsonb),
  ('Diazolidinül Üre', ARRAY['Diazolidinyl Urea', 'Germall II'], 'kozmetik', 'Formaldehit salıcı koruyucu', 'sakincali', 'EWG', '{"hamile": "sakincali", "hassas_cilt": "sakincali"}'::jsonb),
  ('Kuaterniyum-15', ARRAY['Quaternium-15', 'Dowicil 200'], 'kozmetik', 'Formaldehit salıcı koruyucu', 'sakincali', 'EWG', '{"hamile": "sakincali", "hassas_cilt": "sakincali"}'::jsonb),
  ('Sodyum Lauret Sülfat', ARRAY['Sodium Laureth Sulfate', 'SLES'], 'kozmetik', 'Köpürtücü yüzey aktif madde', 'sakincali', 'EWG', '{"hassas_cilt": "sakincali", "bebek": "sakincali"}'::jsonb),
  ('Mineral Yağ', ARRAY['Mineral Oil', 'Paraffinum Liquidum', 'Petrolatum'], 'kozmetik', 'Emolyan, oklüzif', 'dikkat', 'CIR', '{"bebek": "dikkat"}'::jsonb),
  ('Vazelin', ARRAY['Petrolatum', 'Petroleum Jelly', 'Vaseline'], 'kozmetik', 'Oklüzif, nemlendirici', 'guvenli', 'CIR', null),
  ('Silikon Yağı', ARRAY['Dimethicone', 'Cyclomethicone', 'Silicone'], 'kozmetik', 'Yumuşatıcı, kaydırıcı', 'guvenli', 'CIR', null),
  ('Dimetikon', ARRAY['Dimethicone', 'Polydimethylsiloxane', 'PDMS'], 'kozmetik', 'Emolyan, saç yumuşatıcı', 'guvenli', 'CIR', null),
  ('Siklometikon', ARRAY['Cyclomethicone', 'Cyclopentasiloxane', 'D5'], 'kozmetik', 'Uçucu silikon, kaydırıcı', 'dikkat', 'EWG', null);

-- =============================================
-- KOZMETİK - Blok 5: Temizleyiciler ve yüzey aktif maddeler
-- =============================================
INSERT INTO public.maddeler (ad, es_anlamlilar, kategori, islev, risk_seviyesi, kaynak, kitle_bayraklari) VALUES
  ('Kokamidopropil Betain', ARRAY['Cocamidopropyl Betaine', 'CAPB'], 'kozmetik', 'Yumuşak yüzey aktif, köpürtücü', 'guvenli', 'CIR', null),
  ('Desil Glukozit', ARRAY['Decyl Glucoside'], 'kozmetik', 'Yumuşak yüzey aktif (doğal)', 'guvenli', 'CIR', null),
  ('Kokoil Glusinat', ARRAY['Sodium Cocoyl Glutamate', 'Cocoyl Glutamate'], 'kozmetik', 'Aminoasit bazlı yumuşak yüzey aktif', 'guvenli', 'CIR', null),
  ('Lauril Glukozit', ARRAY['Lauryl Glucoside'], 'kozmetik', 'Yumuşak yüzey aktif (doğal)', 'guvenli', 'CIR', null),
  ('Sodyum Kokosülfat', ARRAY['Sodium Coco-Sulfate', 'SCS'], 'kozmetik', 'Yüzey aktif madde', 'dikkat', 'CIR', '{"hassas_cilt": "dikkat"}'::jsonb),
  ('Sodyum Lauroil Sarkozin', ARRAY['Sodium Lauroyl Sarcosinate'], 'kozmetik', 'Yumuşak köpürtücü', 'guvenli', 'CIR', null),
  ('Cetil Alkol', ARRAY['Cetyl Alcohol', 'Cetearyl Alcohol'], 'kozmetik', 'Emülgatör, kıvam artırıcı', 'guvenli', 'CIR', null),
  ('Setearil Alkol', ARRAY['Cetearyl Alcohol', 'C16-18 Fatty Alcohol'], 'kozmetik', 'Emülgatör, kıvam artırıcı', 'guvenli', 'CIR', null),
  ('Stearik Asit', ARRAY['Stearic Acid'], 'kozmetik', 'Emülgatör, kıvam artırıcı', 'guvenli', 'CIR', null),
  ('Oleik Asit', ARRAY['Oleic Acid', 'Omega-9'], 'kozmetik', 'Emolyan, nüfuz artırıcı', 'guvenli', 'CIR', null),
  ('Polietilen Glikol', ARRAY['PEG', 'Polyethylene Glycol', 'PEG-40', 'PEG-100'], 'kozmetik', 'Emülgatör, humektant', 'dikkat', 'EWG', '{"hassas_cilt": "dikkat"}'::jsonb),
  ('Etanol', ARRAY['Ethanol', 'Alcohol Denat', 'Denatured Alcohol', 'SD Alcohol'], 'kozmetik', 'Çözücü, antiseptik', 'dikkat', 'CIR', '{"hassas_cilt": "dikkat"}'::jsonb),
  ('İzopropil Alkol', ARRAY['Isopropyl Alcohol', 'IPA', 'Rubbing Alcohol'], 'kozmetik', 'Çözücü, antiseptik', 'dikkat', 'CIR', '{"hassas_cilt": "dikkat"}'::jsonb),
  ('Mentol', ARRAY['Menthol', 'Mentha Piperita'], 'kozmetik', 'Serinletici, ferahlatıcı', 'dikkat', 'CIR', '{"hassas_cilt": "dikkat", "bebek": "dikkat"}'::jsonb),
  ('Kamfor', ARRAY['Camphor', 'Cinnamomum Camphora'], 'kozmetik', 'Serinletici, antiseptik', 'dikkat', 'CIR', '{"bebek": "sakincali", "hassas_cilt": "dikkat"}'::jsonb),
  ('Fenoksietanol', ARRAY['Phenoxyethanol', '2-Phenoxyethanol'], 'kozmetik', 'Koruyucu', 'guvenli', 'CIR', '{"bebek": "dikkat"}'::jsonb),
  ('Etilheksilgliserin', ARRAY['Ethylhexylglycerin'], 'kozmetik', 'Koruyucu yardımcı, nemlendirici', 'guvenli', 'CIR', null),
  ('Sodyum Benzoat', ARRAY['Sodium Benzoate'], 'kozmetik', 'Koruyucu', 'guvenli', 'CIR', null),
  ('Potasyum Sorbat', ARRAY['Potassium Sorbate'], 'kozmetik', 'Koruyucu', 'guvenli', 'CIR', null),
  ('Benzilalkol', ARRAY['Benzyl Alcohol'], 'kozmetik', 'Koruyucu, çözücü', 'guvenli', 'CIR', '{"hassas_cilt": "dikkat"}'::jsonb);

-- =============================================
-- KOZMETİK - Blok 6: Parfüm, boyar maddeler ve diğer kozmetik katkılar
-- =============================================
INSERT INTO public.maddeler (ad, es_anlamlilar, kategori, islev, risk_seviyesi, kaynak, kitle_bayraklari) VALUES
  ('Parfüm', ARRAY['Fragrance', 'Parfum', 'Aroma'], 'kozmetik', 'Koku verici', 'dikkat', 'EWG', '{"hassas_cilt": "dikkat", "bebek": "dikkat"}'::jsonb),
  ('Linalol', ARRAY['Linalool', 'Linalol'], 'kozmetik', 'Koku bileşeni', 'dikkat', 'CIR', '{"hassas_cilt": "dikkat"}'::jsonb),
  ('Limonene', ARRAY['Limonene', 'D-Limonene'], 'kozmetik', 'Koku bileşeni, çözücü', 'dikkat', 'CIR', '{"hassas_cilt": "dikkat"}'::jsonb),
  ('Sitronelol', ARRAY['Citronellol'], 'kozmetik', 'Koku bileşeni', 'dikkat', 'CIR', '{"hassas_cilt": "dikkat"}'::jsonb),
  ('Geraniol', ARRAY['Geraniol'], 'kozmetik', 'Koku bileşeni', 'dikkat', 'CIR', '{"hassas_cilt": "dikkat"}'::jsonb),
  ('Kumarin', ARRAY['Coumarin'], 'kozmetik', 'Koku bileşeni', 'dikkat', 'CIR', '{"hassas_cilt": "dikkat"}'::jsonb),
  ('Demir Oksitler', ARRAY['Iron Oxides', 'CI 77491', 'CI 77492', 'CI 77499'], 'kozmetik', 'Renklendirici (kırmızı, sarı, siyah)', 'guvenli', 'CIR', null),
  ('Mika', ARRAY['Mica', 'CI 77019'], 'kozmetik', 'Parıltı verici, renklendirici', 'guvenli', 'CIR', null),
  ('Ultramarin', ARRAY['Ultramarines', 'CI 77007'], 'kozmetik', 'Mavi-mor renklendirici', 'guvenli', 'CIR', null),
  ('Krom Oksit', ARRAY['Chromium Oxide Greens', 'CI 77288'], 'kozmetik', 'Yeşil renklendirici', 'guvenli', 'CIR', null),
  ('Karnauba Mumu', ARRAY['Carnauba Wax', 'Copernicia Cerifera Wax'], 'kozmetik', 'Kıvam artırıcı, kaplama', 'guvenli', 'CIR', null),
  ('Balmumu', ARRAY['Beeswax', 'Cera Alba', 'Cera Flava'], 'kozmetik', 'Kıvam artırıcı, emolyan', 'guvenli', 'CIR', '{"vegan": "sakincali"}'::jsonb),
  ('Lanolin', ARRAY['Lanolin', 'Wool Fat', 'Adeps Lanae'], 'kozmetik', 'Emolyan, nemlendirici', 'dikkat', 'CIR', '{"vegan": "sakincali", "hassas_cilt": "dikkat"}'::jsonb),
  ('Talk', ARRAY['Talc', 'Talcum', 'Magnesium Silicate'], 'kozmetik', 'Absorban, kayganlaştırıcı', 'dikkat', 'CIR', '{"bebek": "dikkat"}'::jsonb),
  ('Oksibenson', ARRAY['Oxybenzone', 'Benzophenone-3'], 'kozmetik', 'UV emici', 'sakincali', 'EWG', '{"hamile": "sakincali", "bebek": "sakincali"}'::jsonb),
  ('Çinko Pirition', ARRAY['Zinc Pyrithione', 'ZPT', 'Pyrithione Zinc'], 'kozmetik', 'Kepek karşıtı, antifungal', 'dikkat', 'CIR', '{"bebek": "dikkat"}'::jsonb),
  ('Ketokonazol', ARRAY['Ketoconazole'], 'kozmetik', 'Antifungal (kepek şampuanı)', 'dikkat', 'CIR', '{"hamile": "dikkat"}'::jsonb),
  ('Pantotenik Asit', ARRAY['Pantothenic Acid', 'Calcium Pantothenate'], 'kozmetik', 'Saç güçlendirici', 'guvenli', 'CIR', null),
  ('Biotin', ARRAY['Biotin', 'Vitamin B7', 'Vitamin H'], 'kozmetik', 'Saç ve tırnak güçlendirici', 'guvenli', 'CIR', null),
  ('Keratin', ARRAY['Keratin', 'Hydrolyzed Keratin'], 'kozmetik', 'Saç onarıcı, güçlendirici', 'guvenli', 'CIR', '{"vegan": "dikkat"}'::jsonb);

-- =============================================
-- KOZMETİK - Blok 7: Ek kozmetik bileşenler
-- =============================================
INSERT INTO public.maddeler (ad, es_anlamlilar, kategori, islev, risk_seviyesi, kaynak, kitle_bayraklari) VALUES
  ('Poliheksametilen Biguanid', ARRAY['Polyaminopropyl Biguanide', 'PHMB'], 'kozmetik', 'Koruyucu', 'sakincali', 'EWG', '{"hassas_cilt": "sakincali"}'::jsonb),
  ('Metilizotiazolinon', ARRAY['Methylisothiazolinone', 'MIT', 'MI'], 'kozmetik', 'Koruyucu', 'sakincali', 'EWG', '{"hassas_cilt": "sakincali", "bebek": "sakincali"}'::jsonb),
  ('Metilkloroizotiazolinon', ARRAY['Methylchloroisothiazolinone', 'MCI', 'Kathon CG'], 'kozmetik', 'Koruyucu', 'sakincali', 'EWG', '{"hassas_cilt": "sakincali", "bebek": "sakincali"}'::jsonb),
  ('Benzofenon-4', ARRAY['Benzophenone-4', 'Sulisobenzone'], 'kozmetik', 'UV emici', 'dikkat', 'CIR', null),
  ('Silikoner', ARRAY['Silicones', 'Amodimethicone', 'Cyclotetrasiloxane', 'D4'], 'kozmetik', 'Yumuşatıcı, saç kaydırıcı', 'dikkat', 'EWG', null),
  ('Trietanolamin', ARRAY['Triethanolamine', 'TEA'], 'kozmetik', 'pH düzenleyici, emülgatör', 'dikkat', 'CIR', '{"hassas_cilt": "dikkat"}'::jsonb),
  ('Dietanolamin', ARRAY['Diethanolamine', 'DEA'], 'kozmetik', 'Köpürtücü, emülgatör', 'sakincali', 'EWG', '{"hamile": "sakincali"}'::jsonb),
  ('Setrimonium Klorür', ARRAY['Cetrimonium Chloride', 'CTAC'], 'kozmetik', 'Antistatik, saç yumuşatıcı', 'guvenli', 'CIR', null),
  ('Behentrimonium Metosülfat', ARRAY['Behentrimonium Methosulfate', 'BTMS'], 'kozmetik', 'Yumuşak emülgatör', 'guvenli', 'CIR', null),
  ('Heksilen Glikol', ARRAY['Hexylene Glycol', '2-Methyl-2,4-pentanediol'], 'kozmetik', 'Çözücü, emülgatör', 'guvenli', 'CIR', null),
  ('Pentilen Glikol', ARRAY['Pentylene Glycol', '1,2-Pentanediol'], 'kozmetik', 'Humektant, koruyucu yardımcı', 'guvenli', 'CIR', null),
  ('Kaprililglikol', ARRAY['Caprylyl Glycol', '1,2-Octanediol'], 'kozmetik', 'Koruyucu yardımcı, nemlendirici', 'guvenli', 'CIR', null),
  ('Tokoferil Asetat', ARRAY['Tocopheryl Acetate', 'Vitamin E Acetate'], 'kozmetik', 'Antioksidan', 'guvenli', 'CIR', null),
  ('Askorbil Fosfat', ARRAY['Sodium Ascorbyl Phosphate', 'SAP'], 'kozmetik', 'Stabil C vitamini türevi', 'guvenli', 'CIR', null),
  ('Adenozin', ARRAY['Adenosine'], 'kozmetik', 'Anti-aging, kırışıklık karşıtı', 'guvenli', 'CIR', null),
  ('Madekassosid', ARRAY['Madecassoside', 'Centella Asiatica', 'Cica'], 'kozmetik', 'Yatıştırıcı, onarıcı', 'guvenli', 'CIR', null),
  ('Asiatikoside', ARRAY['Asiaticoside', 'Centella Asiatica Extract'], 'kozmetik', 'Yatıştırıcı, onarıcı', 'guvenli', 'CIR', null),
  ('Snail Müsin', ARRAY['Snail Secretion Filtrate', 'Snail Mucin'], 'kozmetik', 'Nemlendirici, onarıcı', 'guvenli', 'CIR', '{"vegan": "sakincali"}'::jsonb);

-- =============================================
-- TEMİZLİK - Blok 1: Yumuşak ve doğal temizleyiciler (guvenli)
-- =============================================
INSERT INTO public.maddeler (ad, es_anlamlilar, kategori, islev, risk_seviyesi, kaynak, kitle_bayraklari) VALUES
  ('Sodyum Bikarbonat', ARRAY['Sodium Bicarbonate', 'Baking Soda', 'Karbonat'], 'temizlik', 'Doğal temizleyici, koku giderici', 'guvenli', 'WHO', null),
  ('Sitrik Asit', ARRAY['Citric Acid', 'Limon Tuzu'], 'temizlik', 'Doğal asit temizleyici, kireç çözücü', 'guvenli', 'WHO', null),
  ('Sodyum Karbonat', ARRAY['Sodium Carbonate', 'Washing Soda', 'Soda', 'Çamaşır Sodası'], 'temizlik', 'Yağ çözücü, bazik temizleyici', 'guvenli', 'WHO', null),
  ('Sirke', ARRAY['Vinegar', 'Acetic Acid', 'Asetik Asit'], 'temizlik', 'Doğal dezenfektan, kireç çözücü', 'guvenli', 'WHO', null),
  ('Hidrojen Peroksit (düşük %)', ARRAY['Hydrogen Peroxide', 'H2O2 3%', 'Oksijene Su'], 'temizlik', 'Ağartıcı, dezenfektan', 'guvenli', 'WHO', '{"bebek": "dikkat"}'::jsonb),
  ('Etanol', ARRAY['Ethanol', 'Ethyl Alcohol', 'Grain Alcohol'], 'temizlik', 'Dezenfektan', 'guvenli', 'WHO', null),
  ('İzopropil Alkol', ARRAY['Isopropyl Alcohol', 'IPA', 'Rubbing Alcohol'], 'temizlik', 'Dezenfektan, yüzey temizleyici', 'guvenli', 'WHO', '{"bebek": "dikkat"}'::jsonb),
  ('Sabun (Doğal)', ARRAY['Soap', 'Sodium Palmitate', 'Sodium Cocoate', 'Potassium Olivate'], 'temizlik', 'Doğal yüzey aktif, temizleyici', 'guvenli', 'WHO', null),
  ('Sodyum Perkarbonaat', ARRAY['Sodium Percarbonate', 'Oxygen Bleach'], 'temizlik', 'Oksijen bazlı ağartıcı', 'guvenli', 'WHO', null),
  ('Sodyum Metasilikat', ARRAY['Sodium Metasilicate'], 'temizlik', 'Yağ çözücü, bazik temizleyici', 'dikkat', 'WHO', '{"bebek": "dikkat"}'::jsonb),
  ('Alkil Poliglukozit', ARRAY['Alkyl Polyglucoside', 'APG', 'Decyl Glucoside'], 'temizlik', 'Bitkisel yüzey aktif madde', 'guvenli', 'WHO', null),
  ('Sodyum Kokoat', ARRAY['Sodium Cocoate', 'Coconut Soap'], 'temizlik', 'Doğal sabun bileşeni', 'guvenli', 'WHO', null),
  ('Sodyum Asetat', ARRAY['Sodium Acetate'], 'temizlik', 'pH düzenleyici, leke çıkarıcı', 'guvenli', 'WHO', null),
  ('Boraks', ARRAY['Borax', 'Sodium Borate', 'Sodium Tetraborate'], 'temizlik', 'Çok amaçlı temizleyici', 'dikkat', 'WHO', '{"bebek": "sakincali", "hamile": "dikkat"}'::jsonb),
  ('Glikol Eter', ARRAY['Glycol Ether', 'Butoxyethanol'], 'temizlik', 'Çözücü, yağ çözücü', 'dikkat', 'WHO', '{"hamile": "dikkat"}'::jsonb);

-- =============================================
-- TEMİZLİK - Blok 2: Yüzey aktif maddeler ve deterjanlar
-- =============================================
INSERT INTO public.maddeler (ad, es_anlamlilar, kategori, islev, risk_seviyesi, kaynak, kitle_bayraklari) VALUES
  ('Sodyum Lauril Sülfat', ARRAY['Sodium Lauryl Sulfate', 'SLS', 'Sodium Dodecyl Sulfate'], 'temizlik', 'Köpürtücü yüzey aktif madde', 'dikkat', 'WHO', '{"hassas_cilt": "sakincali", "bebek": "dikkat"}'::jsonb),
  ('Sodyum Lauret Sülfat', ARRAY['Sodium Laureth Sulfate', 'SLES'], 'temizlik', 'Köpürtücü yüzey aktif madde', 'dikkat', 'WHO', '{"hassas_cilt": "dikkat"}'::jsonb),
  ('Lineer Alkilbenzen Sülfonat', ARRAY['Linear Alkylbenzene Sulfonate', 'LAS', 'LABS'], 'temizlik', 'Anyonik yüzey aktif (deterjan)', 'dikkat', 'WHO', '{"hassas_cilt": "dikkat"}'::jsonb),
  ('Alkilbenzen Sülfonat', ARRAY['Alkylbenzene Sulfonate', 'ABS'], 'temizlik', 'Yüzey aktif madde', 'dikkat', 'WHO', '{"hassas_cilt": "dikkat"}'::jsonb),
  ('Sodyum Lauroil Sarkozin', ARRAY['Sodium Lauroyl Sarcosinate'], 'temizlik', 'Hafif yüzey aktif madde', 'guvenli', 'WHO', null),
  ('Kokamid DEA', ARRAY['Cocamide DEA', 'Coconut Diethanolamide'], 'temizlik', 'Köpük artırıcı, kıvam verici', 'dikkat', 'WHO', '{"hassas_cilt": "dikkat"}'::jsonb),
  ('Kokamid MEA', ARRAY['Cocamide MEA', 'Coconut Monoethanolamide'], 'temizlik', 'Köpük artırıcı', 'dikkat', 'WHO', null),
  ('Kokamidopropil Betain', ARRAY['Cocamidopropyl Betaine', 'CAPB'], 'temizlik', 'Amfoterik yüzey aktif', 'guvenli', 'WHO', null),
  ('Leuril Betain', ARRAY['Lauryl Betaine'], 'temizlik', 'Amfoterik yüzey aktif', 'guvenli', 'WHO', null),
  ('Nonilfenoletoksilat', ARRAY['Nonylphenol Ethoxylate', 'NPE', 'NPEO'], 'temizlik', 'Yüzey aktif (hormonal bozucu)', 'sakincali', 'WHO', '{"hamile": "sakincali", "bebek": "sakincali"}'::jsonb),
  ('Alkilfenol Etoksilatlar', ARRAY['Alkylphenol Ethoxylates', 'APEO'], 'temizlik', 'Yüzey aktif (hormonal bozucu)', 'sakincali', 'WHO', '{"hamile": "sakincali", "bebek": "sakincali"}'::jsonb),
  ('Sodyum Dodekil Benzen Sülfonat', ARRAY['Sodium Dodecylbenzene Sulfonate', 'SDBS'], 'temizlik', 'Deterjan ana maddesi', 'dikkat', 'WHO', null),
  ('Dietanolamin', ARRAY['Diethanolamine', 'DEA'], 'temizlik', 'Köpük artırıcı', 'sakincali', 'WHO', '{"hamile": "sakincali"}'::jsonb),
  ('Trietanolamin', ARRAY['Triethanolamine', 'TEA'], 'temizlik', 'pH düzenleyici', 'dikkat', 'WHO', '{"hassas_cilt": "dikkat"}'::jsonb),
  ('EDTA', ARRAY['Ethylenediaminetetraacetic Acid', 'Disodium EDTA', 'Tetrasodium EDTA'], 'temizlik', 'Şelatör, su yumuşatıcı', 'dikkat', 'WHO', null);

-- =============================================
-- TEMİZLİK - Blok 3: Dezenfektanlar ve ağartıcılar
-- =============================================
INSERT INTO public.maddeler (ad, es_anlamlilar, kategori, islev, risk_seviyesi, kaynak, kitle_bayraklari) VALUES
  ('Sodyum Hipoklorit (düşük %)', ARRAY['Sodium Hypochlorite', 'Bleach', 'Çamaşır Suyu', 'NaClO'], 'temizlik', 'Dezenfektan, ağartıcı (düşük konsantrasyon)', 'dikkat', 'WHO', '{"bebek": "dikkat", "hassas_cilt": "dikkat"}'::jsonb),
  ('Sodyum Hipoklorit (yüksek %)', ARRAY['Sodium Hypochlorite Concentrated', 'Industrial Bleach'], 'temizlik', 'Güçlü dezenfektan, ağartıcı', 'sakincali', 'WHO', '{"bebek": "sakincali", "hamile": "sakincali", "hassas_cilt": "sakincali"}'::jsonb),
  ('Benzalkonyum Klorür', ARRAY['Benzalkonium Chloride', 'BAC', 'Quaternary Ammonium'], 'temizlik', 'Kuaterner amonyum dezenfektan', 'dikkat', 'WHO', '{"bebek": "dikkat", "hassas_cilt": "dikkat"}'::jsonb),
  ('Didekildimetilamonyum Klorür', ARRAY['Didecyldimethylammonium Chloride', 'DDAC'], 'temizlik', 'Kuaterner amonyum dezenfektan', 'dikkat', 'WHO', '{"bebek": "dikkat"}'::jsonb),
  ('Kloramin-T', ARRAY['Chloramine-T', 'Tosylchloramide Sodium'], 'temizlik', 'Klor bazlı dezenfektan', 'dikkat', 'WHO', '{"bebek": "dikkat"}'::jsonb),
  ('Klorheksidin', ARRAY['Chlorhexidine', 'Chlorhexidine Gluconate'], 'temizlik', 'Antiseptik dezenfektan', 'guvenli', 'WHO', '{"bebek": "dikkat"}'::jsonb),
  ('Perasetik Asit', ARRAY['Peracetic Acid', 'PAA'], 'temizlik', 'Güçlü dezenfektan, ağartıcı', 'dikkat', 'WHO', '{"bebek": "sakincali"}'::jsonb),
  ('Sodyum Dikloroizosiyenürat', ARRAY['Sodium Dichloroisocyanurate', 'NaDCC'], 'temizlik', 'Klor bazlı dezenfektan', 'dikkat', 'WHO', '{"bebek": "dikkat"}'::jsonb),
  ('Glutaraldehit', ARRAY['Glutaraldehyde'], 'temizlik', 'Yüksek düzeyli dezenfektan', 'sakincali', 'WHO', '{"hamile": "sakincali", "bebek": "sakincali", "hassas_cilt": "sakincali"}'::jsonb),
  ('Ortoftalaldehit', ARRAY['Ortho-phthalaldehyde', 'OPA'], 'temizlik', 'Yüksek düzeyli dezenfektan', 'sakincali', 'WHO', '{"hassas_cilt": "sakincali"}'::jsonb),
  ('Kalsiyum Hipoklorit', ARRAY['Calcium Hypochlorite', 'Ca(ClO)2'], 'temizlik', 'Ağartıcı, su dezenfektanı', 'dikkat', 'WHO', '{"bebek": "dikkat"}'::jsonb),
  ('Ozon', ARRAY['Ozone', 'O3'], 'temizlik', 'Dezenfektan, koku giderici', 'dikkat', 'WHO', null),
  ('Sodyum Bisülfit', ARRAY['Sodium Bisulfite', 'Sodium Hydrogen Sulfite'], 'temizlik', 'Klor nötralizatör, koruyucu', 'dikkat', 'WHO', null);

-- =============================================
-- TEMİZLİK - Blok 4: Tehlikeli kimyasallar (sakincali)
-- =============================================
INSERT INTO public.maddeler (ad, es_anlamlilar, kategori, islev, risk_seviyesi, kaynak, kitle_bayraklari) VALUES
  ('Amonyak', ARRAY['Ammonia', 'NH3', 'Ammonium Hydroxide'], 'temizlik', 'Cam ve yüzey temizleyici', 'sakincali', 'WHO', '{"bebek": "sakincali", "hamile": "sakincali"}'::jsonb),
  ('Kloroform', ARRAY['Chloroform', 'Trichloromethane', 'CHCl3'], 'temizlik', 'Endüstriyel çözücü (yasaklanan)', 'sakincali', 'WHO', '{"hamile": "sakincali", "bebek": "sakincali"}'::jsonb),
  ('Hidroflorik Asit', ARRAY['Hydrofluoric Acid', 'HF'], 'temizlik', 'Güçlü asit temizleyici (cam)', 'sakincali', 'WHO', '{"hamile": "sakincali", "bebek": "sakincali"}'::jsonb),
  ('Metanol', ARRAY['Methanol', 'Methyl Alcohol', 'Wood Alcohol', 'CH3OH'], 'temizlik', 'Endüstriyel çözücü (toksik)', 'sakincali', 'WHO', '{"hamile": "sakincali", "bebek": "sakincali"}'::jsonb),
  ('Fenol', ARRAY['Phenol', 'Carbolic Acid', 'C6H5OH'], 'temizlik', 'Dezenfektan (toksik)', 'sakincali', 'WHO', '{"hamile": "sakincali", "bebek": "sakincali", "hassas_cilt": "sakincali"}'::jsonb),
  ('Formaldehit', ARRAY['Formaldehyde', 'Formalin', 'CH2O'], 'temizlik', 'Dezenfektan, koruyucu (kanserojen)', 'sakincali', 'WHO', '{"hamile": "sakincali", "bebek": "sakincali"}'::jsonb),
  ('Toluen', ARRAY['Toluene', 'Methylbenzene', 'C7H8'], 'temizlik', 'Endüstriyel çözücü', 'sakincali', 'WHO', '{"hamile": "sakincali", "bebek": "sakincali"}'::jsonb),
  ('Ksilen', ARRAY['Xylene', 'Dimethylbenzene', 'Xylol'], 'temizlik', 'Endüstriyel çözücü', 'sakincali', 'WHO', '{"hamile": "sakincali", "bebek": "sakincali"}'::jsonb),
  ('Trikloroetilen', ARRAY['Trichloroethylene', 'TCE', 'Trichloroethene'], 'temizlik', 'Yağ çözücü (kanserojen)', 'sakincali', 'WHO', '{"hamile": "sakincali", "bebek": "sakincali"}'::jsonb),
  ('Perkloroetilen', ARRAY['Perchloroethylene', 'PCE', 'Tetrachloroethylene', 'PERC'], 'temizlik', 'Kuru temizleme çözücüsü', 'sakincali', 'WHO', '{"hamile": "sakincali", "bebek": "sakincali"}'::jsonb),
  ('Metilen Klorür', ARRAY['Methylene Chloride', 'Dichloromethane', 'DCM'], 'temizlik', 'Boya sökücü, çözücü', 'sakincali', 'WHO', '{"hamile": "sakincali", "bebek": "sakincali"}'::jsonb),
  ('Naftalin', ARRAY['Naphthalene', 'Mothballs'], 'temizlik', 'Güve ilacı (kanserojen)', 'sakincali', 'WHO', '{"hamile": "sakincali", "bebek": "sakincali"}'::jsonb),
  ('Paradiklorobenzen', ARRAY['Paradichlorobenzene', 'p-DCB', '1,4-Dichlorobenzene'], 'temizlik', 'Koku giderici, güve ilacı', 'sakincali', 'WHO', '{"hamile": "sakincali", "bebek": "sakincali"}'::jsonb);

-- =============================================
-- TEMİZLİK - Blok 5: Asitler, bazlar ve özel kimyasallar
-- =============================================
INSERT INTO public.maddeler (ad, es_anlamlilar, kategori, islev, risk_seviyesi, kaynak, kitle_bayraklari) VALUES
  ('Hidroklorik Asit', ARRAY['Hydrochloric Acid', 'HCl', 'Muriatic Acid', 'Tuz Ruhu'], 'temizlik', 'Güçlü asit temizleyici', 'sakincali', 'WHO', '{"bebek": "sakincali", "hamile": "dikkat"}'::jsonb),
  ('Sülfürik Asit', ARRAY['Sulfuric Acid', 'H2SO4', 'Battery Acid'], 'temizlik', 'Güçlü asit (tıkanıklık açıcı)', 'sakincali', 'WHO', '{"bebek": "sakincali", "hamile": "sakincali"}'::jsonb),
  ('Fosforik Asit', ARRAY['Phosphoric Acid', 'H3PO4'], 'temizlik', 'Kireç çözücü, pas sökücü', 'dikkat', 'WHO', '{"bebek": "dikkat"}'::jsonb),
  ('Oksalik Asit', ARRAY['Oxalic Acid', 'Ethanedioic Acid'], 'temizlik', 'Leke çıkarıcı, pas sökücü', 'dikkat', 'WHO', '{"bebek": "dikkat"}'::jsonb),
  ('Sodyum Hidroksit', ARRAY['Sodium Hydroxide', 'NaOH', 'Caustic Soda', 'Lye', 'Kostik'], 'temizlik', 'Güçlü baz (tıkanıklık açıcı, yağ çözücü)', 'sakincali', 'WHO', '{"bebek": "sakincali", "hassas_cilt": "sakincali"}'::jsonb),
  ('Potasyum Hidroksit', ARRAY['Potassium Hydroxide', 'KOH', 'Caustic Potash'], 'temizlik', 'Güçlü baz, yüzey temizleyici', 'dikkat', 'WHO', '{"bebek": "dikkat"}'::jsonb),
  ('Fosfatlar', ARRAY['Phosphates', 'Trisodium Phosphate', 'TSP', 'Sodium Tripolyphosphate'], 'temizlik', 'Su yumuşatıcı, yağ çözücü', 'dikkat', 'WHO', null),
  ('Sodyum Lauril Eter Sülfat', ARRAY['Sodium Lauryl Ether Sulfate', 'SLES'], 'temizlik', 'Köpürtücü yüzey aktif', 'dikkat', 'WHO', '{"hassas_cilt": "dikkat"}'::jsonb),
  ('Sodyum Perborat', ARRAY['Sodium Perborate', 'PBS'], 'temizlik', 'Ağartıcı (deterjan)', 'dikkat', 'WHO', '{"hamile": "dikkat"}'::jsonb),
  ('Enzimler (Proteaz)', ARRAY['Protease', 'Subtilisin', 'Enzyme'], 'temizlik', 'Protein leke çıkarıcı', 'guvenli', 'WHO', '{"hassas_cilt": "dikkat"}'::jsonb),
  ('Enzimler (Lipaz)', ARRAY['Lipase', 'Enzyme'], 'temizlik', 'Yağ leke çıkarıcı', 'guvenli', 'WHO', null),
  ('Enzimler (Amilaz)', ARRAY['Amylase', 'Enzyme'], 'temizlik', 'Nişasta leke çıkarıcı', 'guvenli', 'WHO', null),
  ('Optik Beyazlatıcı', ARRAY['Optical Brightener', 'Fluorescent Whitening Agent', 'FWA'], 'temizlik', 'Beyazlatıcı (UV absorplayıcı)', 'dikkat', 'WHO', '{"hassas_cilt": "dikkat", "bebek": "dikkat"}'::jsonb),
  ('D-Limonen', ARRAY['D-Limonene', 'Orange Oil', 'Citrus Solvent'], 'temizlik', 'Doğal çözücü, yağ çözücü', 'guvenli', 'WHO', '{"hassas_cilt": "dikkat"}'::jsonb),
  ('Sodyum Zeoliti', ARRAY['Sodium Zeolite A', 'Zeolite'], 'temizlik', 'Su yumuşatıcı (fosfat alternatifi)', 'guvenli', 'WHO', null),
  ('Dietilen Glikol', ARRAY['Diethylene Glycol', 'DEG'], 'temizlik', 'Çözücü (toksik)', 'sakincali', 'WHO', '{"hamile": "sakincali", "bebek": "sakincali"}'::jsonb),
  ('Butildiglikol', ARRAY['Butyl Diglycol', '2-(2-Butoxyethoxy)ethanol'], 'temizlik', 'Çözücü, yağ çözücü', 'dikkat', 'WHO', null),
  ('İzopropanolamin', ARRAY['Isopropanolamine', 'MIPA'], 'temizlik', 'pH düzenleyici, emülgatör', 'dikkat', 'WHO', null),
  ('Sodyum Dikromat', ARRAY['Sodium Dichromate', 'Chrome Yellow'], 'temizlik', 'Endüstriyel temizleyici (kanserojen)', 'sakincali', 'WHO', '{"hamile": "sakincali", "bebek": "sakincali"}'::jsonb),
  ('Kükürt Dioksit', ARRAY['Sulfur Dioxide', 'SO2'], 'temizlik', 'Ağartıcı, dezenfektan', 'dikkat', 'WHO', '{"bebek": "dikkat"}'::jsonb);

-- =============================================
-- TEMİZLİK - Blok 6: Ek temizlik maddeleri
-- =============================================
INSERT INTO public.maddeler (ad, es_anlamlilar, kategori, islev, risk_seviyesi, kaynak, kitle_bayraklari) VALUES
  ('Sodyum Tiosülfat', ARRAY['Sodium Thiosulfate', 'Na2S2O3'], 'temizlik', 'Klor nötralizatör', 'guvenli', 'WHO', null),
  ('Sodyum Silikat', ARRAY['Sodium Silicate', 'Water Glass', 'Sıvı Cam'], 'temizlik', 'Yapıştırıcı, koruyucu kaplama', 'guvenli', 'WHO', null),
  ('Poliakrilik Asit', ARRAY['Polyacrylic Acid', 'Carbomer'], 'temizlik', 'Kıvam artırıcı, dağıtıcı', 'guvenli', 'WHO', null),
  ('Tetrapotasyum Pirofosfat', ARRAY['Tetrapotassium Pyrophosphate', 'TKPP'], 'temizlik', 'Su yumuşatıcı, yağ emülgatörü', 'guvenli', 'WHO', null),
  ('Monopropilen Glikol', ARRAY['Monopropylene Glycol', '1,2-Propanediol'], 'temizlik', 'Çözücü, antifriz', 'guvenli', 'WHO', null),
  ('Glikolik Asit', ARRAY['Glycolic Acid'], 'temizlik', 'Asidik temizleyici, kireç çözücü', 'dikkat', 'WHO', '{"hassas_cilt": "dikkat"}'::jsonb),
  ('Sodyum Glükonat', ARRAY['Sodium Gluconate'], 'temizlik', 'Şelatör, su yumuşatıcı', 'guvenli', 'WHO', null),
  ('Nitrilotrisetik Asit', ARRAY['Nitrilotriacetic Acid', 'NTA'], 'temizlik', 'Şelatör (EDTA alternatifi)', 'dikkat', 'WHO', null),
  ('İzotridekanol Etoksilat', ARRAY['Isotridecanol Ethoxylate'], 'temizlik', 'Non-iyonik yüzey aktif', 'dikkat', 'WHO', null),
  ('Setiltrimetilamonyum Bromür', ARRAY['Cetyltrimethylammonium Bromide', 'CTAB'], 'temizlik', 'Katyonik yüzey aktif, dezenfektan', 'dikkat', 'WHO', '{"bebek": "dikkat"}'::jsonb),
  ('Klorheksidin Diglukonat', ARRAY['Chlorhexidine Digluconate', 'CHG'], 'temizlik', 'Antiseptik, dezenfektan', 'guvenli', 'WHO', null),
  ('Polivinil Alkol', ARRAY['Polyvinyl Alcohol', 'PVA', 'PVOH'], 'temizlik', 'Film oluşturucu, bağlayıcı', 'guvenli', 'WHO', null);
