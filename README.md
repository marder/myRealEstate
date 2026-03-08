# 🏘️ Gmina Dobra - Municipal Property Portal
### Official system for management and presentation of real estate assets

![Vue.js](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=leaflet&logoColor=white)

---

## 🌟 Overview

A modern platform dedicated to the residents and investors of Gmina Dobra, providing transparent access to municipal property resources. The system integrates land registry data with an interactive Geoportal map, facilitating the location and analysis of municipal plots.

---

## ✨ Key Features

### 🗺️ Interactive Geoportal (Vue 3 + Leaflet)
- **📍 Plot Registry:** Full list of properties categorized by geodetic precincts.
- **🛰️ Hybrid View:** Toggle between standard map and orthophotomap (GUGiK).
- **🎨 Category Coloring:** Automatic plot coloring based on land use (R - agricultural, B - residential, DR - roads, etc.).
- **🔍 Advanced Search:** Search for plots by number or full TERYT identifier.
- **📱 Mobile Explorer:** Optimized map interface for smartphones with a collapsible side panel.

### 📱 Mobile-First Optimization
- **⚡ Compact Navigation:** Streamlined mobile menu with quick shortcuts.
- **🧭 Intuitive UX:** Automatic management of explorer visibility on small screens.
- **🎯 Precise Controls:** Ergonomic placement of map control buttons.

### 🛡️ Security and Performance
- **🚀 Vite 6:** Lightning-fast loading and frontend bundle optimization.
- **🔒 Backend Proxy:** Secure requests to external ULDK (GUGiK) services.
- **📊 Data Aggregation:** Real-time system for area statistics and property valuation.

---

## 🛠 Tech Stack

| Frontend | Backend | Data / Maps |
| :--- | :--- | :--- |
| Vue 3 (Composition API) | Node.js & Express | Leaflet (GIS) |
| Tailwind CSS v4 | MongoDB & Mongoose | Wicket (WKT Parsing) |
| Vue Router | REST API | GUGiK WMS/WMTS |
| AOS (Animations) | Proxy Service | TERYT Integration |

---

## 📂 Project Structure

```bash
myRealEstate/
├── 📁 backend/             # API server and business logic
│   ├── 📁 models/          # Mongoose schemas (Property, User)
│   ├── 📁 routes/          # API endpoints and Geoportal proxy
│   └── 📄 server.js        # Node.js entry point
├── 📁 frontend/            # Client application (Vite + Vue)
│   ├── 📁 src/
│   │   ├── 📁 components/  # GeoportalMap, Navbar, PropertyGrid
│   │   ├── 📁 views/       # MapView, HomeView, PropertyDetail
│   │   └── 📁 services/    # API communication
│   └── 📄 vite.config.js   # Environment configuration
└── 📄 README.md            # Project documentation
```

---

## ⚙️ Quick Start

### 1. 🟢 Backend Setup
```bash
cd backend
npm install
# Copy .env.example and fill in the data
npm start
```

### 2. 🔵 Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 📄 License

System developed for the **Municipal Office in Dobra**. All rights reserved. ⚖️
