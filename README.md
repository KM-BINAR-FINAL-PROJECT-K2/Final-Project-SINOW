![Logo](https://ik.imagekit.io/96gmelvyq/sinow_logo_fsw.svg?updatedAt=1704019334801)

# Apa itu SINOW?

SINOW adalah Platform yang menyediakan konten
pembelajaran online berupa video. Platform ini akan
menyediakan konten pembelajaran yang dapat diakses
secara gratis atau berlangganan, ditambah dengan fitur-fitur yang mudah digunakan.

SINOW berasal dari "Sinau," artinya belajar dalam bahasa Jawa. Nama produk ini terbentuk dari Sinau + Now, yang artinya "Belajar Sekarang." Brand guideline Sinow mencakup warna utama biru, melambangkan keamanan layanan, profesionalisme, dan teknologi. Karakter "Sizi," kucing robot, simbol dari kecerdasan, kecanggihan, dan kebahagiaan. Nama "Sizi" berasal dari "Siji" dalam bahasa Jawa, yang artinya Satu, menunjukkan bahwa mengikuti kelas pembelajaran disini maka akan selalu menjadi nomor satu.

# Tech Stack

**Client:** React, TailwindCSS, Vite, Axios, Sweetalert2, Flowbite React

**Server:** Node, Express, Nodemailer, Jest, Imagekit, Jsonwebtoken, Midtrans, Railway, Nodemon, Railway

# Database Diagram

![database diagram](https://ik.imagekit.io/96gmelvyq/SINOW%20-%20db%20diagram.svg?updatedAt=1704093336724)

# Features

- Login & Logout
- Tabel pembayaran
- Kelola kelas
- Kelola chapter
- Kelola modul
- Kelola kategory
- Kelola notifikasi
- Memfilter & mencari data
- Reset password
- Download/Cetak data transaksi

# Project Links

## Design

- [UI/UX Design - Figma](https://www.figma.com/file/30q0s9eenpfof4eoLlxLJI/SINOW?type=design&node-id=0%3A1&mode=design&t=ywr7k0gJFZfqPhc6-1)

## Project Management

- [Trello Board](https://trello.com/b/dm7s6SKM/final-project-c7)

## Source Code Repositories

- Android App: [GitHub Repository - SiNow](https://github.com/Budiart18/SiNow)
- FSW (Full Stack Web): [GitHub Repository - KM-BINAR-FINAL-PROJECT-K2](https://github.com/KM-BINAR-FINAL-PROJECT-K2)

## API Documentation/Swagger

- [API-Docs/Swagger](https://sinow-production.up.railway.app/api-docs)

# Menjalankan Projek Secara Lokal

## Menjalankan backend

Clone projek github

```bash
  git clone https://github.com/KM-BINAR-FINAL-PROJECT-K2/Final-Project-SINOW.git
```

Buka direktori project

```bash
  cd .\KM-BINAR-FINAL-PROJECT-K2/Final-Project-SINOW\
```

masuk ke folder backend

```bash
  cd .\backend\
```

Install dependencies backend

```bash
  npm install
```

Buat database

```bash
  npm run db:create
```

Migrate database

```bash
  npm run db:migrate
```

Seed database

```bash
  npm run db:seed
```

Jalankan server

```bash
  npm run dev
```

## Menjalankan frontend

Masuk ke folder frontend

```bash
  cd .\frontend\
```

Install dependencies frontend

```bash
  npm install
```

Build Project

```bash
  npm run build
```

Jalankan server

```bash
  npm run preview
```

# Menjalankan Unit Testing

Masuk ke direktori backend

```bash
  cd .\backend\
```

Buat database testing

```bash
  npm run db:create:test
```

Migrate database testing

```bash
  npm run db:migrate:test
```

Seed database testing

```bash
  npm run db:seed:test
```

Jalankan unit test

```bash
  npm run test
```
