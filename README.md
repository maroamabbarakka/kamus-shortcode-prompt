# Kamus Shortcode Prompt Pro (Visual Library & Prompt Studio)

Aplikasi web pustaka visual interaktif dan generator prompt profesional untuk kreator AI, desainer produk, dan sutradara video. Mengorganisasi **1.322 shortcode prompt multimodal** (Image, Video, Hybrid, Content) dalam antarmuka yang bersih, elegan, dan siap digunakan.

---

## 🌟 Fitur Utama

1. **Desain Bersih & Elegan (Clean Light Theme)**:
   - Antarmuka bertaraf internasional yang cerah, bebas penumpukan teks (*zero text clutter*), tipografi tajam, dan kenyamanan visual maksimal.
2. **42 Kelompok Visual Tematik (Termasuk Shortcut Prompt Logo)**:
   - Menampilkan contoh hasil nyata resolusi tinggi untuk Studio Logo & Brand Identity, iklan produk, CGI 3D, miniature world, UGC social, sinematik, sudut kamera, hingga lembar referensi poster asli.
3. **Live Subject Replacer (Ketik Subjek Langsung)**:
   - Ubah subjek default menjadi produk Anda (misal: *Kopi Espresso Dingin*, *Sepatu Sneakers*, *YBS FUTSAL CLUB*) langsung di dalam modal detail, dan seluruh prompt siap pakai akan diperbarui secara real-time.
4. **Kamus Lengkap (1.345+ Shortcode Explorer)**:
   - Akses pencarian kilat (tekan tombol `/`), filter media (Image, Video, Hybrid, Content), filter keluarga fungsi, dan paginasi responsif.
5. **Prompt Studio / Composer**:
   - Gabungkan beberapa shortcode sekaligus dengan preset industri (termasuk Logo & Brand Identity Studio), pemilihan rasio aspek (16:9, 9:16, 1:1, 4:5), durasi video, tata cahaya, dan batasan konsistensi.
6. **Responsif Mobile Native**:
   - Beradaptasi sempurna di ponsel cerdas dengan mobile topbar dan bottom navigation bar ala aplikasi iOS/Android.

---

## 🎨 Shortcut Prompt Logo (Brand Identity & Logo Studio)

Koleksi lengkap 23 shortcut prompt khusus untuk merancang konsep logo komersial, identitas brand, dan aset produksi:

| Shortcut | Fungsi / Arti |
|---|---|
| `/logo` | Buat konsep logo |
| `/brand` | Buat logo berdasarkan identitas brand |
| `/minimal` | Logo minimalis |
| `/modern` | Logo modern |
| `/premium` | Logo mewah/premium |
| `/3d` | Logo dengan efek 3D |
| `/badge` | Logo emblem/badge |
| `/mascot` | Logo maskot |
| `/sport` | Logo olahraga |
| `/esport` | Logo gaming/esport |
| `/luxury` | Logo elegan/luxury |
| `/bold` | Logo tegas dan kuat |
| `/icon` | Logo berbasis ikon |
| `/wordmark` | Logo berbasis tulisan |
| `/monogram` | Logo inisial |
| `/color` | Tentukan kombinasi warna |
| `/font` | Rekomendasi gaya tipografi |
| `/mockup` | Tampilkan pada mockup |
| `/print` | Siapkan konsep untuk produksi/cetak |
| `/vector` | Konsep logo bergaya vector |
| `/negative` | Buat negative prompt |
| `/5opsi` | Buat 5 konsep berbeda |
| `/revisi` | Revisi konsep sebelumnya |

### 🔥 Contoh Penggunaan

- `/logo /sport /bold /3d — YBS FUTSAL CLUB`  
  *Artinya: Buat konsep logo YBS Futsal Club dengan karakter sporty, tegas, dan 3D.*

- `/logo /premium /minimal /monogram — MDS STEEL`  
  *Artinya: Konsep logo MDS STEEL dengan gaya premium, minimalis, dan monogram.*

### ⚡ Shortcut Lengkap Workflow Desain Logo

```text
/logo /brand /style /icon /color /font /mockup /negative
```

---

## 🚀 Cara Menjalankan Secara Online (GitHub Pages)

Proyek ini dibangun murni dengan teknologi web statis tanpa dependensi backend, sehingga dapat langsung aktif online di **GitHub Pages**:

1. Buka repositori ini di GitHub.
2. Masuk ke menu **Settings** > **Pages**.
3. Pada bagian **Build and deployment > Source**, pilih **Deploy from a branch**.
4. Pilih branch **`main`** dan folder **`/ (root)`**, lalu klik **Save**.
5. Situs Anda akan langsung online dan dapat diakses publik dalam hitungan menit!

---

## 📁 Struktur Berkas

- `index.html` : Halaman aplikasi utama.
- `app-pro.css` : Sistem desain bersih, cerah, dan responsif.
- `app-pro.js` : Logika interaksi, pencarian instan, dan peramu prompt.
- `kamus-data-v4.js` : Basis data master 1.322 entri shortcode.
- `assets/` : Gambar kelompok visual dan lembar referensi poster.
- `kamus-shortcode-prompt-data-v3.json` : Master dataset format JSON.
- `kamus-shortcode-prompt-data-v3.csv` : Master dataset format CSV.
