# Jelajah Aman 🌤️

Aplikasi pemantau cuaca dan kualitas udara (*Air Quality Index* - AQI) berbasis **React Native** dan **Expo Router** dengan pendekatan **Offline-First**. Aplikasi ini mengintegrasikan **SQLite** dan **AsyncStorage** untuk menjamin data cuaca lokal tetap dapat diakses kapan saja meski tanpa koneksi internet.

Proyek ini dikembangkan dan disempurnakan sebagai bagian dari **Ujian Tengah Semester (UTS) - Pemrograman Berbasis Platform (4 SKS)**, Program Studi S1 Informatika, UIN K.H. Abdurrahman Wahid Pekalongan.

---

## 🌟 Fitur Utama & Penyempurnaan UTS

Aplikasi Jelajah Aman telah mengimplementasikan seluruh **4 fitur tugas penyempurnaan UTS** sesuai modul:

### 1. 🧭 Kustomisasi Ikon Tab Bar & Navigasi (Tugas 1)
- Mengganti seluruh ikon tab navigasi default menjadi ikon representatif dari pustaka `@expo/vector-icons/Ionicons`.
  - **Beranda**: `partly-sunny` / `partly-sunny-outline`
  - **Riwayat & Favorit**: `time` / `time-outline`
  - **Pengaturan**: `settings` / `settings-outline`
  - **Tentang**: `information-circle` / `information-circle-outline`
- Merapikan label navigasi tab bar dan judul header agar alur penggunaan lebih intuitif.
- Tab bar terintegrasi dinamis dengan tema aktif (*Light* / *Dark mode*).

### 2. 🕒 Riwayat Pencarian Terakhir (*Recent Search History* - Tugas 2)
- Mekanisme penyimpanan lokal 10 kota pencarian terakhir menggunakan `AsyncStorage` (`@jelajah_aman:riwayat_pencarian`).
- **Deduplikasi Otomatis**: Jika kota yang sama dicari ulang, entri otomatis dipindahkan ke urutan teratas tanpa duplikasi.
- **Navigasi Otomatis**: Mengetuk salah satu item riwayat pencarian akan langsung membuka halaman **Beranda**, mengisi kotak pencarian, dan secara otomatis memunculkan data cuaca kota tersebut.
- Opsi untuk menghapus satu item riwayat tertentu maupun mengosongkan seluruh riwayat sekaligus dengan konfirmasi dialog.

### 3. 💾 Pengelolaan & Penghapusan Cache Kota (*Offline-First SQLite* - Tugas 3)
- Menampilkan daftar kota tersimpan di SQLite beserta informasi **suhu terkini** dan **kondisi cuaca** saat offline.
- **Penghapusan Cache per Item**: Terdapat tombol *Hapus Cache* pada setiap item kota di tab riwayat/tersimpan.
- **Konfirmasi Keamanan (Alert)**: Menampilkan dialog konfirmasi (*Alert*) sebelum data cache dihapus dari memori perangkat.
- **Pembersihan Massal**: Menu pengaturan menyediakan opsi untuk menghapus seluruh cache cuaca sekaligus.

### 4. 🌓 Sistem Tema Dinamis (*Light, Dark & System Default* - Tugas 4)
- Pilihan mode tampilan di menu **Pengaturan**:
  - ☀️ **Terang (Light Mode)**
  - 🌙 **Gelap (Dark Mode)**
  - ⚙️ **Ikuti Sistem (System Default)**
- Preferensi tema disimpan secara persisten di penyimpanan lokal perangkat (`@jelajah_aman:tema_mode`).
- Perubahan warna diterapkan secara dinamis dan konsisten ke seluruh layar:
  - Layar Beranda (*Home*)
  - Layar Riwayat & Favorit (*History*)
  - Layar Pengaturan (*Settings*)
  - Layar Tentang Aplikasi (*About*)
  - Komponen kartu cuaca, kotak pencarian, indikator AQI, modal, dan status bar.

### 5. 🌐 Kompatibilitas Universal (Mobile & Web)
- **Komponen Universal**: Semua komponen dibuat menggunakan komponen standar React Native (`View`, `Text`, dll.) sehingga bebas error di Android (Expo Go) dan Browser Web.
- **Web SQLite Support**: Dilengkapi konfigurasi `metro.config.js` untuk mendukung binary WebAssembly (`.wasm`) dan header COOP/COEP pada platform Web.

---

## 🏗️ Arsitektur & Alur Offline-First

Aplikasi Jelajah Aman menerapkan strategi *Cache-Aside* dengan alur:

```
Layar UI (Beranda / Riwayat)
       │
       ▼
cuacaRepository.ts
  ├── 1. Cek Cache Lokal (cacheRepository.ts ➔ SQLite)
  │      └── Jika cache masih segar (< 30 menit) ➔ Kembalikan data cache
  │
  └── 2. Request Jaringan (weatherService.ts + airQualityService.ts ➔ Open-Meteo API)
         ├── Sukses ➔ Simpan / Perbarui ke SQLite (INSERT OR REPLACE) ➔ Tampilkan data segar
         └── Gagal (Offline) ➔ Gunakan data lama dari SQLite (jika ada) atau tampilkan pesan first-run offline
```

### Penjelasan Status Data:
- **`cache-segar`** *(Latar Hijau)*: Data diambil langsung dari cache SQLite lokal yang masih segar (umur < 30 menit) tanpa memanggil jaringan.
- **`cache-basi`** *(Latar Oranye)*: Koneksi internet terputus, aplikasi menampilkan data tersimpan dari SQLite agar pengguna tidak melihat layar kosong, disertai label peringatan bahwa data mungkin sudah usang.
- **`first-run offline`**: Terjadi jika aplikasi dibuka tanpa internet dan belum pernah ada data tersimpan untuk kota tersebut. Aplikasi memberikan petunjuk yang jelas serta tombol coba lagi.

---

## 📁 Struktur Direktori

```text
orientasi-jelajah-aman/
├── metro.config.js                 # Konfigurasi Metro untuk aset WebAssembly (.wasm)
├── package.json                    # Dependensi proyek
├── README.md                       # Dokumentasi proyek
└── src/
    ├── app/                        # Rute aplikasi (Expo Router)
    │   ├── _layout.tsx             # Root layout (ThemeProvider & StatusBar)
    │   ├── index.tsx               # Redirect ke tabs
    │   ├── tambah-favorit.tsx      # Modal tambah kota favorit
    │   ├── detail/
    │   │   └── [kota].tsx          # Halaman rincian cuaca kota
    │   └── (tabs)/
    │       ├── _layout.tsx         # Kustomisasi Ikon Tab Bar & Navigasi (Tugas 1)
    │       ├── index.tsx           # Layar Beranda (Pencarian & Cuaca Terkini)
    │       ├── riwayat.tsx         # Layar Riwayat (Pencarian & Cache Offline) (Tugas 2 & 3)
    │       ├── pengaturan.tsx      # Layar Pengaturan Tema & Kelola Cache (Tugas 4)
    │       └── tentang.tsx         # Layar Informasi & Fitur Aplikasi
    ├── components/                 # Komponen UI modular
    │   ├── AtribusiCuaca.tsx       # Atribusi Open-Meteo
    │   ├── IndikatorAQI.tsx        # Indikator visual kualitas udara
    │   ├── SearchBox.tsx           # Input pencarian kota
    │   ├── StatusData.tsx          # Banner status data (Segar/Basi/Offline)
    │   └── WeatherCard.tsx         # Kartu informasi suhu dan parameter cuaca
    ├── constants/
    │   ├── theme.ts                # Palet token warna Light & Dark
    │   └── weatherCodes.ts         # Pemetaan WMO Weather Interpretation Codes
    ├── context/
    │   └── ThemeContext.tsx        # State management tema (Light/Dark/System)
    ├── db/
    │   └── database.ts             # Inisialisasi SQLite & migrasi tabel
    ├── hooks/
    │   ├── use-debounce.ts         # Hook debounce input teks
    │   └── use-theme.ts            # Hook pembaca warna tema aktif
    ├── services/
    │   ├── airQualityService.ts    # Service API Kualitas Udara (Open-Meteo)
    │   ├── cacheRepository.ts      # CRUD data cache di SQLite
    │   ├── cuacaRepository.ts      # Logika Offline-First cuaca
    │   ├── favoritStorage.ts       # Service kota favorit (AsyncStorage)
    │   ├── geocodingService.ts     # Service pencarian kota/koordinat
    │   ├── locationService.ts      # Service GPS/lokasi saat ini
    │   ├── riwayatPencarianStorage.ts # Service riwayat pencarian (AsyncStorage)
    │   └── weatherService.ts       # Service API Prakiraan Cuaca (Open-Meteo)
    ├── types/                      # Definisi TypeScript interface & tipe data
    └── utils/
        └── alertHelper.ts          # Dialog konfirmasi aksi universal (Mobile & Web)
```

---

## 🚀 Memulai & Menjalankan Aplikasi

### 1. Prasyarat
- **Node.js** (versi 18 ke atas disarankan)
- **npm** atau **yarn**
- Aplikasi **Expo Go** pada perangkat Android / iOS

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Menjalankan Aplikasi

#### A. Menjalankan di Browser Web:
```bash
npm run web
```
Aplikasi akan otomatis terbuka pada `http://localhost:8081`.

#### B. Menjalankan di Mobile (Expo Go / Emulator):
```bash
npx expo start
```
- Pindai (*scan*) QR code menggunakan aplikasi **Expo Go** pada perangkat Android.
- Tekan tombol `a` di terminal untuk membuka Android Emulator.
- Tekan tombol `w` di terminal untuk membuka Web Browser.

---

## 🛠️ Teknologi yang Digunakan

- **Framework**: [React Native](https://reactnative.dev/) dengan [Expo](https://expo.dev/) (SDK 57)
- **Routing**: [Expo Router](https://docs.expo.dev/router/introduction/) (File-based routing)
- **Database Lokal**: [expo-sqlite](https://docs.expo.dev/versions/latest/sdk/sqlite/) (Offline caching)
- **Key-Value Storage**: [@react-native-async-storage/async-storage](https://react-native-async-storage.github.io/async-storage/) (Tema, Riwayat, & Favorit)
- **Icon Library**: [@expo/vector-icons](https://icons.expo.fyi/) (Ionicons)
- **API Sumber Data**: [Open-Meteo API](https://open-meteo.com/) (Weather Forecast & Air Quality API, *Free & No API Key Required*)
- **Bahasa**: TypeScript

---

## 👨‍💻 Pengembang

- **Nama**: Azka Viero
- **Mata Kuliah**: Pemrograman Berbasis Platform (4 SKS)
- **Program Studi**: S1 Informatika
- **Institusi**: UIN K.H. Abdurrahman Wahid Pekalongan

---

*Dibuat dengan ❤️ untuk Ujian Tengah Semester (UTS) Pemrograman Berbasis Platform 2026.*


# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

### Other setup steps

- To set up ESLint for linting, run `npx expo lint`, or follow our guide on ["Using ESLint and Prettier"](https://docs.expo.dev/guides/using-eslint/)
- If you'd like to set up unit testing, follow our guide on ["Unit Testing with Jest"](https://docs.expo.dev/develop/unit-testing/)
- Learn more about the TypeScript setup in this template in our guide on ["Using TypeScript"](https://docs.expo.dev/guides/typescript/)

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.