# Instrukcja Wdrożenia (Deploy)

## 1. Konfiguracja Bazy Danych
Zmień `DATABASE_URL` w pliku `backend/.env` na adres Twojej zewnętrznej bazy danych (np. MongoDB Atlas).

## 2. Zasilenie Bazy (Seeding)
Uruchom skrypt, aby wstawić domyślną treść stron i tagi SEO do nowej bazy:
```bash
cd backend
npm install
node seed.js
```

## 3. Budowa Frontendu
1. Upewnij się, że w `frontend/.env.production` masz poprawne adresy URL do swojego serwera.
2. Zbuduj wersję produkcyjną:
```bash
cd frontend
npm install
npm run build
```
Wynikowy folder `dist` należy umieścić w lokalizacji wskazanej w Nginx (np. `/var/www/surveyorsPage/frontend/dist`).

## 4. Uruchomienie Backend (PM2)
Zaleca się użycie PM2 do utrzymania procesu serwera w tle:
```bash
cd backend
npm install --production
pm2 start server.js --name "surveyors-api"
pm2 save
```

## 5. Nginx
1. Skopiuj zawartość pliku `nginx.conf` do `/etc/nginx/sites-available/surveyorsPage`.
2. Aktywuj stronę: `ln -s /etc/nginx/sites-available/surveyorsPage /etc/nginx/sites-enabled/`.
3. Przetestuj: `nginx -t`.
4. Przeładuj: `systemctl reload nginx`.

---
**Wskazówka:** Pamiętaj o ustawieniu silnego `SESSION_SECRET` w pliku `.env` na produkcji!
