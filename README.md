# 🚀 Portofolio Khansa Gunawan

Website portofolio pribadi dengan fitur AI Chatbot interaktif, Blog, dan Project Showcase.

🌐 **Live:** [portofolio-ecru-theta-25.vercel.app](https://portofolio-ecru-theta-25.vercel.app)

---

## ✨ Fitur

### 🤖 AI Chatbot
- Live chat widget dengan sistem antrian real-time
- Respon personal dengan sapaan nama
- Multi-model fallback untuk ketersediaan tinggi
- Markdown rendering untuk format teks yang rapi

### 📝 Blog
- Admin panel untuk manajemen artikel
- Markdown editor dengan preview
- Upload gambar otomatis
- SEO-friendly URLs

### 💼 Projects
- Showcase proyek dengan tech stack
- Link langsung ke live demo dan source code
- Featured projects highlighting

### 🔒 Keamanan
- JWT authentication untuk admin
- Password hashing dengan bcrypt
- Input validation ketat
- Security headers (CSP, HSTS, dll)
- Protected routes dengan middleware

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Database:** Neon PostgreSQL
- **Storage:** Vercel Blob
- **AI:** Groq / OpenRouter
- **Auth:** jose (JWT) + bcryptjs
- **Validation:** Zod
- **Deployment:** Vercel

---
```markdown
## 🚀 Quick Start

# Clone repository
git clone https://github.com/fixedc0de/Portofolio.git
cd Portofolio

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local dengan konfigurasi Anda

# Generate admin password hash
npm run hash:gen "your-password"

# Setup database (jalankan SQL di Neon)
# Lihat .env.example untuk detail

# Tambahkan foto profil di public/profile.jpg

# Run development server
npm run dev
```

Buka **http://localhost:3000**

---

## 🌐 Deploy ke Vercel

1. Push ke GitHub
2. Import project di Vercel Dashboard
3. Tambahkan environment variables:
   - `DATABASE_URL`
   - `GROQ_API_KEY`
   - `BLOB_READ_WRITE_TOKEN`
   - `ADMIN_PASSWORD_HASH`
   - `JWT_SECRET`
4. Deploy

---

## 📝 Lisensi

MIT License - Lihat file [LICENSE](LICENSE) untuk detail.

---

<div align="center">

**Dibuat dengan ❤️ oleh Khansa Gunawan**

</div>
