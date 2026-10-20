# Jelajah Aman 🌤️

Aplikasi cuaca dan kualitas udara berbasis React Native (Expo) dengan fitur **offline-first** menggunakan SQLite sebagai cache lokal.

## Tentang Proyek

Jelajah Aman memungkinkan pengguna mencari cuaca dan kualitas udara berdasarkan kota, menyimpan data lokal di perangkat, serta tetap dapat membuka data terakhir meskipun tanpa koneksi internet.

## Penjelasan Status Data (Pertemuan 7)

Aplikasi menampilkan label status yang jujur kepada pengguna berdasarkan asal data yang ditampilkan:

- **`cache-segar`** — Data diambil dari cache lokal (SQLite) yang masih segar (umur < 30 menit). Jaringan *tidak* dipanggil. Label tampil dengan latar hijau: *"Data tersimpan (masih segar)"*. Ini menghemat kuota dan mempercepat tampilan.

- **`cache-basi`** — Cache ada, tetapi aplikasi gagal memperbarui dari internet (offline). Data lama tetap ditampilkan agar pengguna tidak melihat layar kosong, namun label oranye *"Mode offline - data tersimpan mungkin sudah usang"* memberi tahu bahwa angkanya bisa berbeda dari kondisi nyata. Label ini penting karena data cuaca berubah setiap jam — pengguna berhak tahu jika informasi sudah tidak segar.

- **First-run offline** — Tidak ada cache sama sekali dan tidak ada koneksi. Kondisi ini terjadi saat pertama kali membuka kota tanpa pernah ada data tersimpan. Aplikasi menampilkan pesan error dan tombol *Coba Lagi* agar pengguna tahu bahwa mereka perlu koneksi internet minimal sekali sebelum data bisa diakses offline. Tanpa label status yang jujur, pengguna mungkin bingung apakah aplikasinya rusak atau kotanya tidak ditemukan.

## Arsitektur Offline-First

```
Layar → cuacaRepository.ts → cacheRepository.ts → SQLite (src/db/database.ts)
                          ↘ weatherService.ts + airQualityService.ts → Open-Meteo API
```

Data dari jaringan selalu menimpa cache lama (INSERT OR REPLACE). Cache hanya dipakai saat jaringan tidak tersedia atau data masih segar (TTL 30 menit). Cache otomatis dihapus setelah 7 hari.

---

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
