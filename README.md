# 🛒 TechStore - Modern E-ticaret Platform

Lisans dersi için geliştirilmiş tam özellikli modern e-ticaret platformu. Node.js ve Express.js kullanılarak backend, modern HTML/CSS/JavaScript ile frontend geliştirilmiştir.
Emre Şık - Hilmi Özbay
## ✨ Özellikler

### 🎨 **Kullanıcı Arayüzü**
- **Modern ve Responsive Tasarım**: Tüm cihazlarda mükemmel görünüm
- **Gradient Animasyonlar**: Profesyonel görsel efektler
- **Sticky Navigation**: Sabit menü çubuğu
- **Modal Dialoglar**: Modern popup pencereler
- **Loading Animasyonları**: Kullanıcı deneyimi iyileştirmeleri

### 🔍 **Arama ve Filtreleme**
- **Gelişmiş Arama**: Ürün adı ve açıklamasında arama
- **Kategori Filtreleme**: Ürünleri kategorilere göre filtreleme
- **Fiyat Filtreleme**: Fiyat aralığına göre filtreleme
- **Gerçek Zamanlı Arama**: Anlık arama sonuçları

### 🛍️ **Alışveriş Sistemi**
- **Sepet İşlemleri**: Ürün ekleme, çıkarma, miktar güncelleme
- **Sepet Kalıcılığı**: LocalStorage ile sepet verilerini saklama
- **Fiyat Hesaplama**: Dinamik toplam fiyat hesaplama
- **Ürün Stok Kontrolü**: Stok durumu gösterimi

### 👤 **Kullanıcı Sistemi**
- **Kullanıcı Kayıt/Giriş**: Tam kimlik doğrulama sistemi
- **Session Yönetimi**: Güvenli oturum kontrolü
- **Profil Yönetimi**: Kullanıcı bilgileri gösterimi
- **Role-based Access**: Admin ve kullanıcı rolleri

### 💝 **Sosyal Özellikler**
- **Ürün Yorumları**: Kullanıcı değerlendirmeleri ve yorumları
- **Yıldızlı Puanlama**: 5 yıldız puanlama sistemi
- **Favoriler**: Beğenilen ürünleri favorilere ekleme
- **Sosyal Etkileşim**: Kullanıcı geri bildirimleri

### 🚀 **Admin Paneli**
- **Modern Dashboard**: İstatistikler ve analitik veriler
- **Ürün Yönetimi**: CRUD işlemleri (Ekleme, Düzenleme, Silme)
- **Kullanıcı Yönetimi**: Kullanıcı listesi ve yönetimi
- **Sidebar Navigation**: Kolay gezinme menüsü
- **Responsive Admin Panel**: Mobil uyumlu yönetim paneli
- **Güvenli Erişim**: Admin yetkisi kontrolü

## 🚀 Kurulum

1. **Projeyi klonlayın:**
```bash
git clone <repository-url>
cd web_proje
```

2. **Bağımlılıkları yükleyin:**
```bash
npm install
```

3. **Uygulamayı başlatın:**
```bash
npm start
```

4. **Tarayıcınızda açın:**
```
http://localhost:3000
```

## 🔐 Test Hesapları

### Admin Hesabı
- **Email**: admin@techstore.com
- **Şifre**: admin123
- **Yetki**: Admin paneline erişim

### Kullanıcı Hesabı
- **Email**: emre@example.com
- **Şifre**: 123456
- **Yetki**: Normal kullanıcı

## 🛠️ Teknolojiler

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **CORS**: Cross-origin resource sharing
- **Body-parser**: HTTP request parsing
- **Session Management**: Oturum yönetimi

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Modern styling (Flexbox, Grid, Animations)
- **JavaScript (ES6+)**: Modern JavaScript features
- **Font Awesome**: Icon library
- **Google Fonts**: Typography (Poppins)

### Veri Yönetimi
- **JSON Files**: Hafif veri depolama
- **localStorage**: Client-side veri saklama
- **Session Storage**: Oturum verileri

## 📁 Proje Yapısı

```
web_proje/
├── server.js              # Ana server dosyası
├── package.json           # Proje yapılandırması
├── README.md             # Proje dokümantasyonu
├── data/                 # Veri dosyaları
│   ├── products.json     # Ürün verileri
│   ├── categories.json   # Kategori verileri
│   ├── users.json        # Kullanıcı verileri
│   ├── reviews.json      # Ürün yorumları
│   └── favorites.json    # Favoriler listesi
└── public/               # Frontend dosyaları
    ├── index.html        # Ana sayfa
    ├── login.html        # Giriş/Kayıt sayfası
    ├── admin.html        # Admin paneli
    ├── css/
    │   └── style.css     # Ana CSS dosyası
    └── js/
        └── app.js        # Ana JavaScript dosyası
```

## 🎯 API Endpoints

### Ürünler
- `GET /api/products` - Tüm ürünleri getir
- `GET /api/products/:id` - Belirli bir ürünü getir
- `GET /api/products?category=Telefon` - Kategoriye göre filtrele
- `GET /api/products?search=iPhone` - Arama yap
- `GET /api/products?minPrice=1000&maxPrice=5000` - Fiyat aralığı

### Kategoriler
- `GET /api/categories` - Tüm kategorileri getir

### Kimlik Doğrulama
- `POST /api/auth/register` - Yeni kullanıcı kaydı
- `POST /api/auth/login` - Kullanıcı girişi
- `POST /api/auth/logout` - Çıkış yapma
- `GET /api/auth/session/:sessionId` - Oturum doğrulama

### Sosyal Özellikler
- `GET /api/products/:id/reviews` - Ürün yorumlarını getir
- `POST /api/products/:id/reviews` - Yeni yorum ekle
- `GET /api/favorites` - Favorileri getir
- `POST /api/favorites` - Favorilere ekle

### Admin Panel
- `POST /api/admin/products` - Yeni ürün ekle
- `PUT /api/admin/products/:id` - Ürün güncelle
- `DELETE /api/admin/products/:id` - Ürün sil

## 🎨 Tasarım Özellikleri

- **Modern UI/UX**: Kullanıcı dostu arayüz tasarımı
- **Gradient Renk Paleti**: Profesyonel renk geçişleri
- **Animasyonlar**: Smooth geçiş efektleri
- **Tipografi**: Poppins font ailesi
- **İkonlar**: Font Awesome icon set
- **Responsive Grid**: CSS Grid ve Flexbox
- **Glass Morphism**: Modern cam efektleri
- **Dark Mode Ready**: Koyu tema desteği hazır

## 📱 Responsive Tasarım

- **Desktop**: 1200px ve üzeri - Tam özellikli görünüm
- **Tablet**: 768px - 1199px - Optimize edilmiş tablet görünümü
- **Mobile**: 767px ve altı - Mobil-first yaklaşım

## 🔧 Admin Panel Kullanımı

1. **Admin Girişi**: `/admin` adresine gidin
2. **Giriş Yapın**: Admin hesabı ile giriş yapın
3. **Dashboard**: İstatistikleri ve son aktiviteleri görün
4. **Ürün Yönetimi**: Ürün ekleme, düzenleme, silme
5. **Form İşlemleri**: Modal popup ile kolay ürün yönetimi

### Admin Panel Özellikleri:
- 📊 **Dashboard**: Canlı istatistikler
- 🛍️ **Ürün CRUD**: Tam ürün yönetimi
- 📱 **Responsive**: Mobil uyumlu admin paneli
- 🔔 **Bildirimler**: İşlem geri bildirimleri
- 🎨 **Modern UI**: Profesyonel admin arayüzü

## 🎮 Kullanım Kılavuzu

### Kullanıcı İşlemleri:
1. **Kayıt Ol**: Yeni hesap oluşturun
2. **Giriş Yap**: Mevcut hesabınızla giriş yapın
3. **Ürün Arama**: Navbar'daki arama kutusunu kullanın
4. **Filtreleme**: Kategori ve fiyat filtrelerini kullanın
5. **Sepete Ekle**: Ürünleri sepete ekleyin
6. **Yorum Yap**: Ürünlere yorum ve puan verin
7. **Favorile**: Beğendiğiniz ürünleri favorilere ekleyin

### Admin İşlemleri:
1. **Admin Paneli**: `/admin` adresine gidin
2. **Ürün Ekle**: "Yeni Ürün Ekle" butonunu kullanın
3. **Ürün Düzenle**: Ürün tablosundaki edit butonunu kullanın
4. **Ürün Sil**: Delete butonu ile ürün silin
5. **İstatistikler**: Dashboard'da verileri takip edin

## 🎯 Öne Çıkan Özellikler

- ✅ **Tam Responsive Tasarım**
- ✅ **Modern Admin Paneli** 
- ✅ **Kullanıcı Kimlik Doğrulama**
- ✅ **Sosyal Özellikler** (Yorumlar, Favoriler)
- ✅ **CRUD İşlemleri**
- ✅ **Session Yönetimi**
- ✅ **Loading States**
- ✅ **Error Handling**
- ✅ **Form Validation**
- ✅ **Real-time Updates**

## 🚧 Gelecek Geliştirmeler

- [ ] **MongoDB/PostgreSQL** entegrasyonu
- [ ] **Email Doğrulama** sistemi
- [ ] **Gerçek Ödeme** sistemi entegrasyonu
- [ ] **Push Notifications**
- [ ] **Multi-language** desteği
- [ ] **Advanced Analytics**
- [ ] **Export/Import** özellikleri
- [ ] **Advanced User Roles**

## 📊 Proje İstatistikleri

- **Toplam Dosya**: 10+ dosya
- **Kod Satır Sayısı**: 2000+ satır
- **JavaScript Functions**: 50+ fonksiyon
- **API Endpoints**: 15+ endpoint
- **Test Edilmiş Tarayıcılar**: Chrome, Firefox, Safari, Edge

## 🔍 Teknik Detaylar

### Frontend Optimizasyonları:
- **Lazy Loading**: Görsel yükleme optimizasyonu
- **Code Splitting**: JavaScript modülarizasyonu
- **CSS Optimizasyonu**: Minified ve optimize CSS
- **Image Optimization**: Responsive görseller

### Backend Optimizasyonları:
- **Error Handling**: Kapsamlı hata yönetimi
- **Input Validation**: Güvenli veri doğrulama
- **CORS Configuration**: Cross-origin güvenliği
- **Session Security**: Güvenli oturum yönetimi

## 🛡️ Güvenlik Özellikleri

- **Input Sanitization**: XSS koruması
- **Session Management**: Güvenli oturum kontrolü
- **Role-based Access**: Yetki tabanlı erişim
- **CORS Protection**: Cross-origin güvenliği


## 👨‍💻 Geliştiriciler


**Emre Şık** - Bilgisayar Mühendisi  
📧 Email: emre@example.com  
🌐 GitHub: [GitHub Profile]


**Hilmi Özbay** - Bilgisayar Mühendisi
📧 Email: ozbayyhilmi@gmail.com
🌐 GitHub: https://github.com/hilmiozbay

---

## 🎓 Eğitim Amaçlı Proje

Bu proje **Marmara Üniveristesi Bilgisayar mühendisliği web programlama lisans dersi kapsamında** geliştirilmiş kapsamlı bir e-ticaret platformudur. Modern web teknolojileri kullanılarak, gerçek dünya senaryolarına uygun bir şekilde tasarlanmıştır.

### Öğrenilen Teknolojiler:
- Node.js & Express.js backend geliştirme
- Modern JavaScript (ES6+) 
- Responsive CSS tasarımı
- API tasarımı ve implementasyonu
- Kullanıcı kimlik doğrulama
- Session yönetimi
- Admin panel geliştirme
- Modern UI/UX tasarım prensipleri

**⚠️ Not**: Bu proje eğitim amaçlı geliştirilmiştir ve gerçek bir e-ticaret sitesi değildir. 
