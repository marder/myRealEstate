# 🏘️ Gmina Dobra - Portal Mienia Komunalnego
### Oficjalny system zarządzania i prezentacji zasobów nieruchomości

![Vue.js](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=leaflet&logoColor=white)

---

## 🌟 O projekcie

Nowoczesna platforma dedykowana mieszkańcom i inwestorom Gminy Dobra, umożliwiająca przejrzysty wgląd w zasoby mienia komunalnego. System integruje dane z ewidencji gruntów z interaktywną mapą Geoportalu, ułatwiając lokalizację i analizę działek gminnych.

---

## ✨ Kluczowe funkcje

### 🗺️ Interaktywny Geoportal (Vue 3 + Leaflet)
- **📍 Wykaz Działek:** Pełna lista nieruchomości z podziałem na obręby geodezyjne.
- **🛰️ Widok Hybrydowy:** Możliwość przełączania między mapą standardową a ortofotomapą (GUGiK).
- **🎨 Kolorystyka Kategorii:** Automatyczne kolorowanie działek na podstawie użytków (R - rolne, B - mieszkaniowe, DR - drogi, itp.).
- **🔍 Zaawansowana Wyszukiwarka:** Wyszukiwanie działek po numerze lub pełnym identyfikatorze TERYT.
- **📱 Mobilny Eksplorator:** Zoptymalizowany interfejs mapy dla smartfonów z chowanym panelem bocznym.

### 📱 Optymalizacja Mobile-First
- **⚡ Kompaktowa Nawigacja:** Usprawnione menu mobilne z szybkimi skrótami.
- **🧭 Intuicyjny UX:** Automatyczne zarządzanie widocznością eksploratora na małych ekranach.
- **🎯 Precyzyjne Sterowanie:** Ergonomiczne rozmieszczenie przycisków kontrolnych mapy.

### 🛡️ Bezpieczeństwo i Wydajność
- **🚀 Vite 6:** Błyskawiczne ładowanie i optymalizacja bundle'a frontendowego.
- **🔒 Backend Proxy:** Bezpieczne zapytania do zewnętrznych usług ULDK (GUGiK).
- **📊 Agregacja Danych:** System statystyk powierzchni i wyceny mienia w czasie rzeczywistym.

---

## 🛠 Stos Technologiczny

| Frontend | Backend | Dane / Mapy |
| :--- | :--- | :--- |
| Vue 3 (Composition API) | Node.js & Express | Leaflet (GIS) |
| Tailwind CSS v4 | MongoDB & Mongoose | Wicket (WKT Parsing) |
| Vue Router | REST API | GUGiK WMS/WMTS |
| AOS (Animations) | Proxy Service | TERYT Integration |

---

## 📂 Struktura Projektu

```bash
myRealEstate/
├── 📁 backend/             # Serwer API i logika biznesowa
│   ├── 📁 models/          # Schematy Mongoose (Property, User)
│   ├── 📁 routes/          # Endpointy API i Proxy do Geoportalu
│   └── 📄 server.js        # Punkt wejścia Node.js
├── 📁 frontend/            # Aplikacja kliencka (Vite + Vue)
│   ├── 📁 src/
│   │   ├── 📁 components/  # GeoportalMap, Navbar, PropertyGrid
│   │   ├── 📁 views/       # MapView, HomeView, PropertyDetail
│   │   └── 📁 services/    # Komunikacja z API
│   └── 📄 vite.config.js   # Konfiguracja środowiska
└── 📄 README.md            # Dokumentacja projektu
```

---

## ⚙️ Szybki Start

### 1. 🟢 Konfiguracja Backend
```bash
cd backend
npm install
# Skopiuj .env.example i uzupełnij dane
npm start
```

### 2. 🔵 Konfiguracja Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 📄 Licencja

System stworzony dla **Urzędu Miejskiego w Dobrej**. Wszelkie prawa zastrzeżone. ⚖️
