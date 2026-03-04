# 🚀 Node.js REST API — Full-Featured Tutorial

> **Build a production-ready API** with Node.js, Express, MongoDB & JWT Authentication — from zero to fully secured CRUD system.

---

## 📌 Daftar Isi

- [Tentang Project](#-tentang-project)
- [Tech Stack](#-tech-stack)
- [Fitur Utama](#-fitur-utama)
- [Struktur Project](#-struktur-project)
- [Getting Started](#-getting-started)
- [Autentikasi JWT](#-autentikasi-jwt)
- [API Endpoints](#-api-endpoints)
- [Middleware & Proteksi Route](#-middleware--proteksi-route)
- [CRUD Operations](#-crud-operations)
- [Environment Variables](#-environment-variables)

---

## 📖 Tentang Project

Tutorial ini membahas cara membangun **REST API lengkap dan aman** menggunakan teknologi modern Node.js. Kamu akan belajar dari awal hingga bisa mengelola autentikasi pengguna, proteksi route, dan operasi CRUD pada sistem blog.

Cocok untuk kamu yang ingin memahami:
- Arsitektur backend modern
- Keamanan API berbasis token
- Manajemen database dengan MongoDB
- Best practice Express.js

---

## 🛠 Tech Stack

| Teknologi | Kegunaan |
|-----------|----------|
| ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white) | Runtime JavaScript |
| ![Express](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white) | Web Framework |
| ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white) | Database NoSQL |
| ![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white) | Autentikasi Token |
| ![bcryptjs](https://img.shields.io/badge/bcryptjs-FF6B6B?style=flat) | Enkripsi Password |

---

## ✨ Fitur Utama

### 🔐 Autentikasi & Keamanan
- ✅ **User Sign Up** — Registrasi akun dengan validasi input
- ✅ **User Sign In** — Login dengan JWT token
- ✅ **Password Reset** — Alur reset password yang aman
- ✅ **Password Hashing** — Enkripsi dengan `bcryptjs`
- ✅ **JWT Middleware** — Proteksi route secara otomatis

### 📝 Sistem Blog (CRUD)
- ✅ **Create Post** — Buat artikel baru
- ✅ **Read Posts** — Ambil semua / satu post
- ✅ **Update Post** — Edit konten post
- ✅ **Delete Post** — Hapus post dengan otorisasi

---

## 📁 Struktur Project

```
api-project/
├── 📂 config/
│   └── db.js               # Koneksi MongoDB
├── 📂 controllers/
│   ├── authController.js   # Logic autentikasi
│   └── postController.js   # Logic CRUD post
├── 📂 middleware/
│   └── authMiddleware.js   # Verifikasi JWT token
├── 📂 models/
│   ├── User.js             # Schema user MongoDB
│   └── Post.js             # Schema post MongoDB
├── 📂 routes/
│   ├── authRoutes.js       # Route /api/auth
│   └── postRoutes.js       # Route /api/posts
├── .env                    # Environment variables
├── server.js               # Entry point aplikasi
└── package.json
```

---

## ⚡ Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/username/nodejs-api-tutorial.git
cd nodejs-api-tutorial
npm install
```

### 2. Setup Environment

```bash
cp .env.example .env
# Edit file .env sesuai konfigurasi kamu
```

### 3. Jalankan Server

```bash
# Development (dengan hot-reload)
npm run dev

# Production
npm start
```

Server berjalan di: `http://localhost:5000` 🎉

---

## 🔐 Autentikasi JWT

Sistem autentikasi menggunakan **JSON Web Token (JWT)** dengan alur berikut:

```
[Client] ──POST /sign-in──► [Server]
                                │
                         Validasi kredensial
                                │
                         Generate JWT Token
                                │
[Client] ◄──Token──────────── [Server]

[Client] ──GET /protected──► [Middleware]
    Header: Bearer <token>        │
                            Verifikasi Token
                                  │
                            ✅ Izinkan Akses
                            ❌ 401 Unauthorized
```

---

## 📡 API Endpoints

### 🔑 Auth Routes — `/api/auth`

| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| `POST` | `/sign-up` | Registrasi user baru | ❌ |
| `POST` | `/sign-in` | Login & dapatkan token | ❌ |
| `POST` | `/forgot-password` | Kirim link reset password | ❌ |
| `POST` | `/reset-password` | Reset password dengan token | ❌ |

### 📝 Post Routes — `/api/posts`

| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| `GET` | `/` | Ambil semua post | ❌ |
| `GET` | `/:id` | Ambil satu post | ❌ |
| `POST` | `/` | Buat post baru | ✅ |
| `PUT` | `/:id` | Update post | ✅ |
| `DELETE` | `/:id` | Hapus post | ✅ |

> ✅ = Membutuhkan JWT Token di header `Authorization: Bearer <token>`

---

## 🛡 Middleware & Proteksi Route

```javascript
// middleware/authMiddleware.js
const protect = async (req, res, next) => {
  let token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Tidak ada token, akses ditolak' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token tidak valid' });
  }
};
```

Gunakan middleware di route mana saja:

```javascript
router.post('/', protect, createPost);
router.delete('/:id', protect, deletePost);
```

---

## 🗄 CRUD Operations

### Create Post
```javascript
// POST /api/posts
{
  "title": "Judul Artikel",
  "content": "Isi konten artikel...",
  "tags": ["nodejs", "express", "api"]
}
```

### Read All Posts
```javascript
// GET /api/posts
// Response
{
  "success": true,
  "count": 10,
  "data": [ ...posts ]
}
```

### Update Post
```javascript
// PUT /api/posts/:id
{
  "title": "Judul Baru",
  "content": "Konten yang diperbarui"
}
```

### Delete Post
```javascript
// DELETE /api/posts/:id
// Response
{
  "success": true,
  "message": "Post berhasil dihapus"
}
```

---

## 🌐 Environment Variables

Buat file `.env` di root project:

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/mydb

# JWT
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=30d

# Email (untuk password reset)
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=your_email
EMAIL_PASS=your_password
```

---

## 📚 Apa yang Akan Kamu Pelajari

- [x] Cara setup server Express dari nol
- [x] Koneksi ke MongoDB menggunakan Mongoose
- [x] Implementasi sistem autentikasi lengkap
- [x] Hashing password dengan bcryptjs
- [x] Generate dan verifikasi JWT token
- [x] Membuat middleware proteksi route
- [x] Desain RESTful API yang baik
- [x] Operasi CRUD dengan MongoDB
- [x] Penanganan error yang proper
- [x] Struktur folder project yang scalable

---

## 🤝 Kontribusi

Pull request sangat disambut! Untuk perubahan besar, buka issue terlebih dahulu untuk mendiskusikan apa yang ingin kamu ubah.

---

## 📄 Lisensi

Didistribusikan di bawah lisensi **MIT**. Lihat `LICENSE` untuk informasi lebih lanjut.

---

<div align="center">

**Dibuat dengan ❤️ untuk para developer Indonesia**

⭐ Jangan lupa kasih bintang kalau tutorial ini membantu kamu!

</div>