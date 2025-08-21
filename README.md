# 🎯 ATAPDF - Modern PDF İşleme Uygulaması

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.0+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.18+-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![PDF-lib](https://img.shields.io/badge/pdf--lib-1.17+-red?style=for-the-badge)](https://pdf-lib.js.org/)
[![Styled Components](https://img.shields.io/badge/Styled_Components-5.3+-DB7093?style=for-the-badge&logo=styled-components&logoColor=white)](https://styled-components.com/)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/ATAGRSL/atapdf-web)

> **7 farklı PDF işlemi ile tam fonksiyonel, modern ve profesyonel PDF işleme platformu** - PDF'lerinizi kolayca birleştirin, sıkıştırın, bölün ve dönüştürün.

ATAPDF, **React 18** ve **Node.js** tabanlı gelişmiş bir PDF işleme uygulamasıdır. Türkçe arayüzü, responsive tasarımı ve güçlü backend altyapısı ile PDF işlemlerini web tarayıcınızda gerçekleştirebilirsiniz.

## 🎯 Proje Amacı

Bu proje, modern web teknolojilerinin gücünü kullanarak tarayıcıda çalışan tam fonksiyonel bir PDF işleme platformu geliştirmek amacıyla oluşturulmuştur. Amacımız:

- ✅ **7 farklı PDF işlem türünü** tek platformda sunmak
- ✅ **Türkçe arayüz** ile yerel kullanıcılara hitap etmek
- ✅ **Responsive tasarım** ile tüm cihazlarda mükemmel deneyim
- ✅ **Modern web teknolojilerini** pratikte göstermek
- ✅ **Açık kaynak** olarak geliştiricilere örnek olmak

## 🚀 Özellikler

### 🎨 **Gelişmiş PDF İşlemleri**
- **PDF Birleştirme** - Birden fazla PDF dosyasını tek dosyada birleştirme
- **PDF Sıkıştırma** - Dosya boyutunu optimize ederek alan tasarrufu
- **PDF Bölme** - PDF'leri sayfa bazında bağımsız dosyalara bölme
- **Filigran Ekleme** - Metin filigranı ekleme (pozisyon ve şeffaflık ayarları)
- **PDF Şifre Kaldırma** - Parola korumalı PDF'leri şifre kaldırma
- **PDF'den Word'e** - PDF metinlerini DOCX formatına çevirme
- **Word'den PDF'e** - DOCX belgelerini profesyonel PDF'e çevirme

### 🔄 **Akıllı Kullanıcı Deneyimi**
- **Sürükle & Bırak** - Resimleri sürükleyip bırakarak yükleme
- **Gerçek Zamanlı Önizleme** - Tüm değişiklikler anında görüntülenir
- **İlerleme Takibi** - Real-time progress bar ile işlem durumu
- **Toast Bildirimleri** - Başarı/hata durumları için anlık geri bildirim
- **Responsive Tasarım** - Mobil, tablet ve desktop için optimize edilmiş
- **Türkçe Arayüz** - Tamamen yerelleştirilmiş kullanıcı deneyimi

### 💾 **Güçlü Backend Altyapısı**
- **RESTful API** - Temiz ve dokümante edilmiş endpoint'ler
- **Dosya Validasyonu** - Güvenli dosya yükleme ve format kontrolü
- **Hata Yönetimi** - Detaylı hata mesajları ve loglama
- **Memory Management** - Verimli dosya işleme ve temizlik
- **10MB Limit** - Dosya boyutu sınırlaması ile performans optimizasyonu

### 🏗️ Teknik Altyapı
- **Frontend**: React 18 + Styled Components + Framer Motion
- **Backend**: Node.js + Express.js
- **PDF İşleme**: pdf-lib, pdf-merger-js, officegen, pdf-parse, mammoth
- **File Upload**: Multer with file type validation
- **API**: RESTful endpoints with error handling

## 📁 Proje Yapısı

```
ATAPDF-Final/
├── backend/                    # Node.js Backend
│   ├── server.js              # Ana server dosyası
│   ├── package.json           # Backend dependencies
│   ├── uploads/               # Geçici yükleme klasörü
│   └── processed/             # İşlenmiş dosyalar
└── frontend/                  # React Frontend
    ├── public/
    │   └── index.html         # Ana HTML template
    ├── src/
    │   ├── components/        # React bileşenleri
    │   │   ├── Header.js      # Navigasyon
    │   │   ├── Hero.js        # Ana bölüm
    │   │   ├── ToolCard.js    # PDF araçları
    │   │   ├── ToolModal.js   # Dosya yükleme modalı
    │   │   └── Toast.js       # Bildirim sistemi
    │   ├── services/          # API servisleri
    │   │   └── api.js         # Backend iletişimi
    │   └── App.js             # Ana uygulama
    └── package.json           # Frontend dependencies
```

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler
- Node.js (v16+ önerilen)
- npm veya yarn

### Backend Kurulumu
```bash
cd backend
npm install
npm start
```

### Frontend Kurulumu
```bash
cd frontend
npm install
npm start
```

### Uygulamaya Erişim
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001

## 📖 Kullanım

### 🚀 **Hızlı Başlangıç**

1. **Ana sayfaya gidin**: http://localhost:3000
2. **PDF Aracını seçin**: Kullanılabilir 7 araçtan birini seçin
3. **Dosya yükleyin**: Modal açılacak, PDF dosyalarınızı seçin
4. **İşlemi başlatın**: "İşlemi Başlat" butonuna tıklayın
5. **Sonucu indirin**: İşlem tamamlandığında indirme linki görünecek

### 🎯 **Detaylı Kullanım Adımları**

#### **1. PDF Birleştirme**
- Ana sayfadan **"PDF Birleştir"** seçin
- En az 2, en fazla 10 PDF dosyası seçin
- Dosya sırası, birleştirme sonrası korunur
- İşlem tamamlandığında tek PDF dosyası indirilir

#### **2. PDF Sıkıştırma**
- Ana sayfadan **"PDF Sıkıştır"** seçin
- Tek PDF dosyası yükleyin
- Sistem otomatik olarak en iyi sıkıştırma oranını belirler
- Orijinal kalite korunarak boyut azaltılır

#### **3. PDF Bölme**
- Ana sayfadan **"PDF Böl"** seçin
- Tek PDF dosyası yükleyin
- Her sayfa ayrı PDF dosyası olarak çıkarılır
- Tüm sayfalar otomatik olarak indirilir

#### **4. Filigran Ekleme**
- Ana sayfadan **"Filigran Ekle"** seçin
- Tek PDF dosyası yükleyin
- Filigran metnini girin
- Pozisyon ve şeffaflık ayarlarını yapın
- 5 farklı pozisyon seçeneği mevcut

#### **5. PDF Şifre Kaldırma**
- Ana sayfadan **"PDF Kilidini Aç"** seçin
- Şifrelenmiş PDF dosyasını yükleyin
- PDF şifresini girin
- Şifre doğru ise kilidi açılmış PDF indirilir

#### **6. PDF'den Word'e**
- Ana sayfadan **"PDF'den Word'e"** seçin
- Tek PDF dosyası yükleyin
- PDF içindeki metinler DOCX formatına çevrilir
- Microsoft Word uyumlu dosya indirilir

#### **7. Word'den PDF'e**
- Ana sayfadan **"Word'den PDF'e"** seçin
- Tek DOCX dosyası yükleyin
- Profesyonel PDF formatına dönüştürülür
- Sayfa numaraları ve footer eklenir

### ⌨️ **Klavye Kısayolları**
- `ESC`: Modal pencereleri kapat
- `Enter`: Formları submit et
- `Tab`: Elementler arası geçiş

### 📱 **Mobil Kullanım**
- Tüm araçlar mobil cihazlarda tam uyumlu
- Touch-friendly arayüz tasarımı
- Responsive dosya yükleme

## 🔧 API Endpoints

### 🎯 **Backend API Dokümantasyonu**

#### **Sistem API'leri**
- `GET /api/health` - Sistem durumu kontrolü
  - **Response**: `{ status: "OK", message: "ATAPDF Backend is running" }`

#### **PDF İşlem API'leri**

##### **PDF Birleştirme**
- `POST /api/merge`
- **Body**: `FormData` with `files` (min 2, max 10 PDF files)
- **Response**: `{ success: true, message: "...", downloadUrl: "...", filename: "..." }`

##### **PDF Sıkıştırma**
- `POST /api/compress`
- **Body**: `FormData` with `file` (single PDF file)
- **Response**: `{ success: true, message: "...", downloadUrl: "...", filename: "...", originalSize: "...", compressedSize: "...", compressionRatio: "..." }`

##### **PDF Bölme**
- `POST /api/split`
- **Body**: `FormData` with `file` (single PDF file)
- **Response**: `{ success: true, message: "...", files: [...] }`

##### **Filigran Ekleme**
- `POST /api/watermark`
- **Body**: `FormData` with `file`, `text`, `opacity`, `position`
- **Response**: `{ success: true, message: "...", downloadUrl: "...", filename: "..." }`

##### **PDF Şifre Kaldırma**
- `POST /api/unlock`
- **Body**: `FormData` with `file`, `password`
- **Response**: `{ success: true, message: "...", downloadUrl: "...", filename: "..." }`

##### **PDF'den Word'e**
- `POST /api/pdf-to-word`
- **Body**: `FormData` with `file` (single PDF file)
- **Response**: `{ success: true, message: "...", downloadUrl: "...", filename: "...", pages: 6 }`

##### **Word'den PDF'e**
- `POST /api/word-to-pdf`
- **Body**: `FormData` with `file` (single DOCX file)
- **Response**: `{ success: true, message: "...", downloadUrl: "...", filename: "...", pages: 3 }`

##### **Dosya İndirme**
- `GET /download/:filename`
- **Response**: PDF/DOCX file download

### 🎨 **Frontend API Service**

#### **PDF İşlemleri**
```javascript
import { pdfOperations } from './services/api';

// PDF Birleştirme
const result = await pdfOperations.merge(pdfFilesArray);

// PDF Sıkıştırma
const result = await pdfOperations.compress(pdfFile);

// PDF Bölme
const result = await pdfOperations.split(pdfFile);

// Filigran Ekleme
const result = await pdfOperations.watermark(pdfFile, {
  text: "CONFIDENTIAL",
  opacity: 0.3,
  position: "center"
});

// PDF Şifre Kaldırma
const result = await pdfOperations.unlock(pdfFile, "password123");

// PDF'den Word'e
const result = await pdfOperations.pdfToWord(pdfFile);

// Word'den PDF'e
const result = await pdfOperations.wordToPdf(docxFile);
```

#### **Sistem Kontrolleri**
```javascript
import { healthCheck } from './services/api';

// Sistem durumu kontrolü
const status = await healthCheck();
console.log(status); // { status: "OK", message: "ATAPDF Backend is running" }
```

## 🎨 Bileşenler

### Header
- Responsive navigasyon
- Logo ve menü
- Mobile hamburger menü

### Hero Section
- Ana başlık ve açıklama
- Call-to-action butonları
- Özellik ikonları

### ToolCard
- PDF araçları kartları
- Hover efektleri
- Kategori bilgisi

### ToolModal
- Dosya yükleme arayüzü
- Sürükle-bırak desteği
- İlerleme gösterimi
- Sonuç indirme
- Filigran ayarları (metin, pozisyon, şeffaflık)
- Şifre kaldırma arayüzü
- Dosya türü validasyonu

### Toast
- Başarı/hata bildirimleri
- Otomatik kapanma
- Stack sistemi

## 🛠️ Geliştirme

### Backend Geliştirme
```bash
cd backend
npm run dev  # Nodemon ile otomatik yeniden başlatma
```

### Frontend Geliştirme
```bash
cd frontend
npm start    # Hot reload ile geliştirme sunucusu
```

### Build
```bash
# Frontend build
cd frontend
npm run build

# Backend production
cd backend
npm start
```

## 📝 Yapılacak Geliştirmeler

- [ ] Kullanıcı kayıt/giriş sistemi
- **Workflow Builder** - Sürükle-bırak araç zinciri
- [ ] Premium özellikler
- [ ] Dosya geçmişi
- [ ] Batch işlemler
- [ ] Cloud storage entegrasyonu

## 🐛 Sorun Giderme

### Port Çakışması
Eğer port 3000 veya 3001 kullanılıyorsa:
```bash
# Process kontrolü
lsof -i :3000
lsof -i :3001

# Process sonlandırma
kill -9 PID_NUMBER
```

### Node Modules Sorunu
```bash
# Cache temizleme
cd frontend && rm -rf node_modules package-lock.json
cd ../backend && rm -rf node_modules package-lock.json

# Tekrar kurulum
cd frontend && npm install
cd ../backend && npm install
```

### PDF İşleme Hatası
- Sadece PDF dosyaları yükleyin
- Dosya boyutu limiti: 10MB
- Desteklenen format: .pdf

## 📄 Lisans

Bu proje eğitim amaçlı geliştirilmiştir.

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/yeni-ozellik`)
3. Değişikliklerinizi commit edin (`git commit -am 'Yeni özellik eklendi'`)
4. Branch'inizi push edin (`git push origin feature/yeni-ozellik`)
5. Pull Request oluşturun

---

## 👨‍💻 Geliştirici

### 👤 **Ata Gürsel**
**Full-Stack Web Developer & UI/UX Enthusiast**

**GitHub**: https://github.com/ATAGRSL  
**LinkedIn**: https://www.linkedin.com/in/atagursel/

### 💼 **Hakkımda**
Modern web teknolojileri ile kullanıcı dostu ve performanslı uygulamalar geliştiriyorum. React, Node.js ve PDF işleme teknolojileri konularına özel ilgi duyuyorum.

### 🎯 **Bu Projedeki Rolüm**
- 🎨 **UI/UX Tasarım**: Modern, responsive ve Türkçe arayüz tasarımı
- 💻 **Frontend Development**: React 18, Styled Components, Framer Motion
- 🔧 **Backend Development**: Node.js, Express.js, RESTful API
- 📚 **PDF İşleme**: pdf-lib, officegen, pdf-merger-js entegrasyonları
- 📱 **Mobil Optimizasyon**: Cross-platform uyumluluk ve responsive design
- 📖 **Dokümantasyon**: Detaylı README ve API dokümantasyonu

---

## 📊 Proje İstatistikleri

### 📈 **Kod Metrikleri**
- **Toplam Dosya**: 26+
- **Frontend Kod Satırları**: ~2,000+
- **Backend Kod Satırları**: ~650+
- **React Bileşenleri**: 5 ana bileşen
- **API Endpoint'leri**: 8 adet
- **PDF İşlem Türleri**: 7 farklı işlem

### 🎯 **Özellik Sayıları**
- **PDF İşlemleri**: 7 farklı tip
- **API Endpoint'leri**: 8 adet (7 işlem + 1 sistem)
- **Responsive Breakpoint**: 3 farklı ekran boyutu
- **Türkçe String'ler**: 50+ adet
- **Error Handling**: 10+ farklı hata durumu

### 🎨 **UI/UX Metrikleri**
- **CSS Variables**: 15+ tasarım token'ı
- **Animasyonlar**: 10+ Framer Motion efekti
- **Responsive Grids**: 5 farklı grid sistemi
- **Color Palette**: 8 renk kategorisi
- **Typography Scale**: 6 farklı font boyutu

### 📱 **Tarayıcı Desteği**
- **Chrome**: 90+ ✅
- **Firefox**: 88+ ✅
- **Safari**: 14+ ✅
- **Edge**: 90+ ✅
- **Mobile Browsers**: iOS Safari, Chrome Mobile ✅

---

## 🙏 Teşekkürler

Bu projeyi kullanmanız ve ilgilenmeniz için teşekkür ederim! Proje geliştirme sürecinde kullandığım teknolojilere ve kaynaklara minnettarım:

### 🛠️ **Kullanılan Teknolojiler**
- **React 18**: Modern kullanıcı arayüzü geliştirme
- **Node.js**: Server-side JavaScript runtime
- **pdf-lib**: PDF oluşturma ve düzenleme
- **officegen**: DOCX dosya işlemleri
- **Styled Components**: CSS-in-JS çözümü
- **Framer Motion**: Modern animasyonlar

### 📚 **Kaynaklar**
- **MDN Web Docs**: Web API referansları
- **React Documentation**: Component geliştirme rehberi
- **Node.js Docs**: Backend geliştirme dokümantasyonu
- **PDF-lib Docs**: PDF işleme teknikleri

### ⭐ **Destek**
Eğer bu proje hoşunuza gittiyse, lütfen GitHub'da **yıldız** vermeyi unutmayın! Bu, projenin daha fazla geliştirici tarafından keşfedilmesine yardımcı olacaktır.

---

**ATAPDF** - Modern PDF işlemleri için güçlü ve kullanıcı dostu çözüm! 🎉
