# 📐 Surveyor Practice Management System
### Dedicated for: Pracownia Geodezyjna Przemysław Junkiert

![Vue.js](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

---

## 🌟 Overview

A complete, production-ready full-stack ecosystem designed for a professional surveying practice. It features a high-performance **Vue 3** client-side application and a robust **Node.js** administration panel (**mySimpleCMS**). This system empowers the business owner to manage every aspect of the site—from hero slides to complex team structures—without touching a single line of code.

---

## ✨ Key Features

### 🖥️ Client Frontend (Vite + Vue 3)
- **⚡ Fully Dynamic:** Every section (Services, Team, Contact) is populated via API.
- **📰 Advanced Blog:** Complete news system with pagination and deep-link article views.
- **🎨 Modern UI:** Sleek, responsive design with interactive carousels and smooth animations.
- **🔍 SEO First:** Optimized meta tags and descriptive titles for high search engine visibility.
- **📱 Responsive:** Pixel-perfect performance on mobile, tablet, and desktop.

### 🛡️ mySimpleCMS (Admin Panel)
- **🖱️ Zero-JSON Management:** Dynamic list editors for slides and services (no raw code editing).
- **📝 WYSIWYG Editor:** Professional blog post creation using the Quill editor.
- **🌓 Adaptive UI:** Full Dark Mode support for a comfortable editing experience.
- **📂 Media Center:** Integrated image upload management for blog posts and team photos.
- **🚦 Workflow Control:** Manage publication states (Draft vs. Published) effortlessly.

---

## 🔒 Security Architecture

The system is built with a "Security First" mindset:
- **🛡️ Rate Limiting:** Advanced protection against Brute-Force attacks on login routes.
- **🍪 Secure Sessions:** HTTP-Only cookies and session ID regeneration to prevent Session Fixation.
- **🌐 Strict CORS:** API access restricted to authorized frontend origins.
- **🧪 Data Sanitization:** Global error handling and sanitized inputs to prevent information leakage.
- **🔑 Hashed Credentials:** Passwords stored using industry-standard Bcrypt hashing.

---

## 🛠 Tech Stack

| Frontend | Backend | DevOps/Security |
| :--- | :--- | :--- |
| Vue 3 (Composition API) | Node.js & Express | Bcrypt |
| Tailwind CSS | MongoDB & Mongoose | Helmet & Rate Limit |
| Vue Router | EJS Templates | CORS Policy |
| Vueper Slides | Multer (Uploads) | Dotenv |

---

## 📂 Project Directory Structure

```bash
surveyorsPage/
├── 📁 backend/             # Node.js CMS & API
│   ├── 📁 models/          # Data Schemas
│   ├── 📁 routes/          # Logic & Endpoints
│   ├── 📁 views/           # EJS Admin Templates
│   ├── 📁 public/          # Assets & Uploads
│   └── 📄 server.js        # Entry Point
├── 📁 frontend/            # Vue Client App
│   ├── 📁 src/
│   │   ├── 📁 components/  # Atomic UI Parts
│   │   ├── 📁 views/       # Full Page Views
│   │   └── 📁 services/    # API Layer
│   └── 📄 index.html       # Entry Point
└── 📄 README.md            # You are here
```

---

## ⚙️ Quick Start

### 1. 🟢 Backend Setup
```bash
cd backend
npm install
# Configure your .env file
node seed.js
npm start
```

### 2. 🔵 Frontend Setup
```bash
cd frontend
npm install
# Configure your .env file
npm run dev
```

---

## 📄 Environment Configuration

**Backend (`.env`):**
- `DATABASE_URL`: Your MongoDB connection string.
- `SESSION_SECRET`: A long, random string for session encryption.
- `FRONTEND_URL`: URL of your Vue application (e.g., `http://localhost:5173`).

**Frontend (`.env`):**
- `VITE_API_URL`: Your backend API URL.
- `VITE_UPLOADS_URL`: URL where images are served from.

---

## 📝 License

Custom-built for **Pracownia Geodezyjna Przemysław Junkiert**. All Rights Reserved. ⚖️
