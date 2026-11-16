# SEM AUTO — Premium Araç Galerisi

Mobil uyumlu ikinci el otomobil vitrin sitesi ve yönetici paneli.

## Özellikler
- Supabase'den canlı araç ilanlarını listeleme
- Marka, model, yakıt, vites, kasa tipi ve fiyat filtreleri
- İlan detayları: yıl, kilometre, fiyat, değişen/boyalı parçalar ve hasar açıklaması
- Yönetici girişi (mevcut `public.admin_users` yetki listesiyle)
- Araç ekleme, düzenleme, silme ve yayından kaldırma
- Kapak ve galeri fotoğrafı yükleme (Supabase Storage `menu-images` kovasında `sem-auto/` klasörü)
- Satılık / rezerve / satıldı durumları

## Supabase
- Proje: GabbyGrills (`vplqyuswgedvuopnlllv`)
- Araç tablosu: `public.sem_auto_vehicles`
- İlan tablosu RLS ile korunur. Ziyaretçiler yalnızca yayındaki satılık ilanları görür; yönetim işlemleri `admin_users` tablosunda yetkili olan giriş yapmış hesaplarla sınırlıdır.
- Tarayıcıya yalnızca publishable key konur; service role anahtarı kullanılmaz.

## Yayınlama
GitHub Pages ayarlarından `main` dalı ve `/ (root)` klasörünü seçin. Site: https://hexspasium.github.io/semauto/ Yönetim: https://hexspasium.github.io/semauto/admin.html

## Notlar
- İlan veritabanı başlangıçta boştur; gerçek araçları yönetim panelinden ekleyin.
- `supabase-config.js` içindeki `SEM_AUTO_WHATSAPP` alanına işletmenin WhatsApp numarası ülke koduyla ve yalnızca rakam olarak yazılabilir.
- Supabase projesi GabbyGrills ile ortak kullanıldığı için SEM AUTO verileri ayrı `sem_auto_vehicles` tablosunda tutulur; mevcut menü tabloları değiştirilmez.

**Marka: SEM AUTO**