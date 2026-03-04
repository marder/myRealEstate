# TODO - Projekt Portal Mienia Komunalnego (myRealEstate)

Poniżej znajduje się lista zadań do wykonania przed oficjalnym uruchomieniem portalu dla Urzędu Miejskiego w Dobrej.

## 🔒 BEZPIECZEŃSTWO (PRIORYTET)

1.  **__Konfiguracja certyfikatu SSL (HTTPS)__**  
    *Należy zainstalować bezpłatny certyfikat Let's Encrypt (np. za pomocą narzędzia Certbot), aby cała komunikacja z panelem CMS była szyfrowana.*

2.  **__Przywrócenie flagi `secure: true` w sesji__**  
    *Po poprawnym skonfigurowaniu HTTPS w pliku `backend/server.js` należy zmienić `secure: false` z powrotem na `secure: true` (lub `process.env.NODE_ENV === "production"`), aby uniemożliwić przechwycenie ciasteczek sesji.*

3.  **__Zmiana `SESSION_SECRET` w `.env`__**  
    *Obecny klucz sesji w pliku `.env` jest przykładowy. Należy go zmienić na długi, losowy ciąg znaków, aby zabezpieczyć sesje przed podrobieniem.*

4.  **__Weryfikacja hasła administratora__**  
    *Upewnij się, że `ADMIN_PASSWORD` w pliku `.env` odpowiada silnemu hasłu (wygenerowanemu przez bcrypt).*

---

## ⚙️ KONFIGURACJA SERWERA

1.  **Wymuszenie przekierowania HTTP -> HTTPS**  
    *W konfiguracji Nginx należy dodać regułę przekierowującą cały ruch z portu 80 na 443.*

2.  **Konfiguracja PM2 (Autostart)**  
    *Upewnij się, że proces backendu jest dodany do listy startowej systemu (`pm2 save` i `pm2 startup`), aby serwer wstał automatycznie po restarcie maszyny.*

3.  **Optymalizacja zdjęć (Sharp)**  
    *Sprawdzić, czy wszystkie przesłane wcześniej zdjęcia zostały przetworzone do formatu WebP w celu przyspieszenia ładowania strony.*

---

## 📧 POCZTA I FORMULARZE

1.  **Testy końcowe mailera**  
    *Wykonać testową wysyłkę z formularza kontaktowego, aby upewnić się, że Urząd otrzymuje powiadomienia, a klient potwierdzenia (sprawdzić folder Spam).*

2.  **Aktualizacja haseł aplikacyjnych Gmail**  
    *Jeśli konto Gmail zostanie zmienione, należy wygenerować nowe "Hasło aplikacji" (App Password) i zaktualizować `EMAIL_PASS` w `.env`.*
