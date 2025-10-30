# 🧩 Nutech API – Express.js & PostgreSQL

Proyek ini adalah implementasi sistem backend sederhana menggunakan **Express.js** dan **PostgreSQL**.
Fungsinya mencakup registrasi user, login, profil, banner, saldo, dan transaksi.

---

## ⚙️ Teknologi

* Node.js (Express.js)
* PostgreSQL
* JWT (Json Web Token)
* Multer (Upload gambar)
* dotenv (Konfigurasi environment)
* Railway (Deploy)

---

## ☁️ Deployment & DOC Postman

* Railway live API endpoint : https://nutech-production-ea9a.up.railway.app
* Postman : https://documenter.getpostman.com/view/20273551/2sB3Wnwgyd

## 📘 Fitur Utama

### 🔐 User

* `POST /api/register` → Registrasi user
* `POST /api/login` → Login dan mendapatkan token
* `GET /api/profile` → Melihat profil user
* `PUT /api/profile/update` → Update profil
* `POST /api/profile/image` → Upload foto profil

### 🖼️ Banner

* `GET /api/banner` → Menampilkan daftar banner

### 💰 Balance & Transaksi

* `GET /api/balance` → Menampilkan saldo user
* `POST /api/topup` → Menambah saldo
* `POST /api/transaction` → Melakukan transaksi
* `GET /api/transaction/history` → Melihat riwayat transaksi

---

## 🗄️ Database

File DDL: `database/ddl_nutech.sql`

Tabel:

* `users`
* `balance_history`
* `transactions`
* `banners`

---

## 🚀 Cara Menjalankan

### 1. Instalasi

```bash
npm install
```

### 2. Jalankan di lokal

Pastikan database sudah dibuat dan tabel diimpor dari `database/ddl_nutech.sql`,
lalu jalankan:

```bash
npm run dev
```


## ✅ Status

| Modul                   | Status |
| ----------------------- | :----: |
| Register & Login        |    ✅   |
| Profile & Upload Gambar |    ✅   |
| Banner                  |    ✅   |
| Balance & Transaksi     |    ✅   |
| Deploy ke Railway       |    ✅   |
| DDL Database            |    ✅   |
