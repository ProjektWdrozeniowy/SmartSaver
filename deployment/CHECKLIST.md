# Checklist wdrożenia SmartSaver na VPS

Użyj tej listy kontrolnej, aby upewnić się, że wykonałeś wszystkie niezbędne kroki podczas wdrażania aplikacji SmartSaver na serwer VPS.

## Przed rozpoczęciem

- [ ] Posiadasz serwer VPS z Ubuntu 22.04 LTS lub nowszym
- [ ] Masz dostęp SSH do serwera (jako root lub user z sudo)
- [ ] Domena wskazuje na adres IP serwera (opcjonalnie, dla SSL)
- [ ] Serwer ma minimum 1GB RAM, 1 vCPU, 20GB dysku

---

## 1. Wstępna konfiguracja serwera

- [ ] System zaktualizowany (`sudo apt update && sudo apt upgrade -y`)
- [ ] Firewall UFW zainstalowany i skonfigurowany
  - [ ] Dozwolony SSH (`sudo ufw allow OpenSSH`)
  - [ ] Dozwolony Nginx (`sudo ufw allow 'Nginx Full'`)
  - [ ] Firewall włączony (`sudo ufw enable`)
- [ ] Użytkownik 'deploy' utworzony (opcjonalnie)
- [ ] Klucze SSH skonfigurowane

---

## 2. Instalacja wymaganych komponentów

- [ ] **Node.js 20.x LTS** zainstalowany
  - [ ] Weryfikacja: `node --version` (oczekiwane: v20.x.x)
  - [ ] Weryfikacja: `npm --version` (oczekiwane: 10.x.x)

- [ ] **MySQL Server** zainstalowany
  - [ ] `mysql_secure_installation` wykonany
  - [ ] MySQL uruchomiony: `sudo systemctl status mysql`

- [ ] **Nginx** zainstalowany
  - [ ] Nginx uruchomiony: `sudo systemctl status nginx`
  - [ ] Nginx działa na starcie: `sudo systemctl is-enabled nginx`

- [ ] **PM2** zainstalowany globalnie
  - [ ] Weryfikacja: `pm2 --version`

- [ ] **Git** zainstalowany
  - [ ] Weryfikacja: `git --version`

---

## 3. Konfiguracja bazy danych

- [ ] Baza danych `smartsaver` utworzona
- [ ] Użytkownik `smartsaver_user` utworzony z bezpiecznym hasłem
- [ ] Uprawnienia nadane użytkownikowi
- [ ] Połączenie testowane: `mysql -u smartsaver_user -p smartsaver`

**Wykonane komendy SQL:**
```sql
CREATE DATABASE smartsaver CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'smartsaver_user'@'localhost' IDENTIFIED BY 'HASŁO';
GRANT ALL PRIVILEGES ON smartsaver.* TO 'smartsaver_user'@'localhost';
FLUSH PRIVILEGES;
```

---

## 4. Konfiguracja projektu

- [ ] Repozytorium sklonowane: `git clone https://github.com/ProjektWdrozeniowy/SmartSaver.git`
- [ ] Katalog projektu: `~/SmartSaver`
- [ ] Zależności główne zainstalowane: `npm install`
- [ ] Zależności workspace'ów zainstalowane: `npm run install:all`

---

## 5. Konfiguracja zmiennych środowiskowych

- [ ] Plik `backend/.env` utworzony
- [ ] Wszystkie wymagane zmienne skonfigurowane:

  **PORT**
  - [ ] `PORT=4000`

  **CORS i Frontend**
  - [ ] `APP_ORIGIN` - ustawiony na domenę produkcyjną (np. `https://twoja-domena.com`)
  - [ ] `FRONTEND_BASE_URL` - ustawiony na domenę produkcyjną

  **Baza danych**
  - [ ] `DATABASE_URL` - poprawne dane dostępowe MySQL
  - [ ] Format: `mysql://smartsaver_user:HASŁO@localhost:3306/smartsaver`

  **JWT**
  - [ ] `JWT_SECRET` - nowy, losowy string (min. 64 znaki)
  - [ ] Wygenerowany przez: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
  - [ ] `JWT_EXPIRES_IN=7d`

  **Email**
  - [ ] `EMAIL_ADDRESS` - adres email Gmail
  - [ ] `EMAIL_APP_PASSWORD` - hasło aplikacji Gmail
  - [ ] Hasło aplikacji wygenerowane w Google Account Settings

- [ ] Plik `.env` ma odpowiednie uprawnienia (nie jest publicznie dostępny)
- [ ] Plik `.env` NIE jest w repozytorium Git

---

## 6. Migracja bazy danych i build

- [ ] **Prisma Client wygenerowany:** `cd backend && npx prisma generate`
  - [ ] Brak błędu podczas generowania
- [ ] Migracje wykonane: `npx prisma migrate deploy`
- [ ] Brak błędów podczas migracji
- [ ] Tabele utworzone w bazie danych (sprawdź: `mysql -u smartsaver_user -p smartsaver`)
- [ ] Frontend zbudowany: `cd frontend && npm run build`
- [ ] Folder `frontend/dist` utworzony i zawiera pliki
- [ ] Warning o dużych plikach jest OK (nie jest błędem)

---

## 7. Konfiguracja Nginx

- [ ] Plik konfiguracyjny skopiowany do `/etc/nginx/sites-available/smartsaver`
- [ ] Domena zamieniona na prawdziwą w pliku konfiguracyjnym
- [ ] Ścieżki do projektu zaktualizowane (jeśli używasz innego użytkownika niż 'deploy')
- [ ] Symlink utworzony: `sudo ln -s /etc/nginx/sites-available/smartsaver /etc/nginx/sites-enabled/`
- [ ] Domyślna konfiguracja usunięta: `sudo rm /etc/nginx/sites-enabled/default`
- [ ] Konfiguracja przetestowana: `sudo nginx -t` (brak błędów)
- [ ] Nginx przeładowany: `sudo systemctl reload nginx`

**Kluczowe elementy konfiguracji:**
- [ ] Reverse proxy dla `/api/` kieruje na `http://localhost:4000`
- [ ] Root ustawiony na `frontend/dist`
- [ ] SPA routing skonfigurowany (`try_files $uri $uri/ /index.html`)

---

## 8. SSL/HTTPS (opcjonalnie, ale zalecane)

- [ ] Certbot zainstalowany: `sudo apt install certbot python3-certbot-nginx`
- [ ] Certyfikat SSL uzyskany: `sudo certbot --nginx -d domena.com -d www.domena.com`
- [ ] Email podany podczas konfiguracji Certbot
- [ ] Przekierowanie HTTP -> HTTPS włączone
- [ ] Certyfikaty działają (sprawdź w przeglądarce)
- [ ] Auto-renewal skonfigurowany (sprawdź: `sudo certbot renew --dry-run`)

---

## 9. Uruchomienie aplikacji

- [ ] Backend uruchomiony przez PM2: `pm2 start server.js --name smartsaver-backend`
- [ ] Status sprawdzony: `pm2 status` (status: "online")
- [ ] Konfiguracja PM2 zapisana: `pm2 save`
- [ ] PM2 skonfigurowany do autostartu: `pm2 startup`
- [ ] Komenda z `pm2 startup` wykonana (jako sudo)
- [ ] Aplikacja działa po restarcie serwera (opcjonalnie przetestuj: `sudo reboot`)

**Weryfikacja:**
- [ ] `pm2 status` pokazuje aplikację jako "online"
- [ ] `pm2 logs smartsaver-backend` nie pokazuje krytycznych błędów
- [ ] Backend odpowiada na port 4000: `curl http://localhost:4000/api/health` (jeśli endpoint istnieje)

---

## 10. Testowanie aplikacji

- [ ] Aplikacja dostępna pod domeną/IP w przeglądarce
- [ ] Frontend ładuje się poprawnie
- [ ] Możliwe logowanie/rejestracja użytkownika
- [ ] Backend API odpowiada (sprawdź Network tab w DevTools)
- [ ] Brak błędów CORS w konsoli przeglądarki
- [ ] Brak błędów 502/503/504 (Bad Gateway)
- [ ] HTTPS działa (jeśli skonfigurowano)
- [ ] Przekierowanie HTTP -> HTTPS działa

**Sprawdź:**
- [ ] `/api/*` endpoints działają
- [ ] Statyczne assety ładują się (JS, CSS, obrazki)
- [ ] Routing SPA działa (odśwież stronę na podstronie)

---

## 11. Bezpieczeństwo i optymalizacja

- [ ] `.env` zawiera silne hasła i sekrety
- [ ] `JWT_SECRET` jest unikalny i losowy
- [ ] Hasło bazy danych jest silne
- [ ] Firewall ogranicza dostęp tylko do potrzebnych portów (22, 80, 443)
- [ ] MySQL nie akceptuje zdalnych połączeń (tylko localhost)
- [ ] Nginx security headers skonfigurowane
- [ ] Rate limiting włączony w backend (sprawdź `server.js`)

---

## 12. Backupy i monitoring

- [ ] Skrypt backup bazy danych skopiowany i przetestowany (`deployment/backup.sh`)
- [ ] Cron job dla automatycznych backupów skonfigurowany
  - [ ] Edycja: `crontab -e`
  - [ ] Dodana linia: `0 2 * * * /home/deploy/SmartSaver/deployment/backup.sh`
- [ ] Katalog backupów utworzony: `~/backups`
- [ ] Test backupu wykonany ręcznie
- [ ] Monitoring logów skonfigurowany:
  - [ ] PM2: `pm2 logs`
  - [ ] Nginx: `/var/log/nginx/smartsaver_*.log`

---

## 13. Dokumentacja i utrzymanie

- [ ] Hasła i dane dostępowe zapisane w bezpiecznym miejscu (np. menedżer haseł)
- [ ] Dokumentacja przeczytana (`VPS_SETUP_GUIDE.md`)
- [ ] Skrypty deployment znane i przetestowane:
  - [ ] `deploy.sh` - aktualizacja aplikacji
  - [ ] `backup.sh` - backup bazy danych
- [ ] Procedura aktualizacji znana

**Zapisz następujące informacje:**
- [ ] IP serwera
- [ ] Domena (jeśli masz)
- [ ] Hasło użytkownika 'deploy' (jeśli utworzony)
- [ ] Hasło bazy danych MySQL
- [ ] `JWT_SECRET`
- [ ] Email i hasło aplikacji Gmail
- [ ] Format DATABASE_URL (sprawdź czy hasło jest zakodowane)

---

## 14. Opcjonalne ulepszenia

- [ ] Monitoring zasobów (htop, pm2 monit)
- [ ] Alerting (np. UptimeRobot dla monitorowania uptime)
- [ ] CDN dla statycznych assetów (np. Cloudflare)
- [ ] Log rotation skonfigurowany dla Nginx i PM2
- [ ] Automatyczne aktualizacje security patches (unattended-upgrades)
- [ ] Fail2ban dla ochrony przed bruteforce SSH
- [ ] Dodatkowy backup na zewnętrzny storage (S3, Backblaze)

---

## Troubleshooting - Znane problemy

Jeśli napotkasz problemy, sprawdź:

### Aplikacja nie uruchamia się - status "errored"
- [ ] Sprawdź logi: `pm2 logs smartsaver-backend --err`
- [ ] **Błąd "Prisma Client not initialized":**
  - [ ] Uruchom: `cd backend && npx prisma generate`
  - [ ] Restart: `pm2 restart smartsaver-backend`
- [ ] **Błąd "P1013: database string invalid":**
  - [ ] Sprawdź format DATABASE_URL: `mysql://user:password@host:port/database`
  - [ ] Zakoduj znaki specjalne w haśle: `node -e "console.log(encodeURIComponent('hasło'))"`
- [ ] Sprawdź czy port 4000 jest wolny: `sudo netstat -tulpn | grep 4000`

### 502 Bad Gateway
- [ ] Backend działa: `pm2 status` (powinien być "online")
- [ ] Backend odpowiada: `curl http://localhost:4000`
- [ ] Nginx konfiguracja poprawna: `sudo nginx -t`
- [ ] Sprawdź logi Nginx: `sudo tail -f /var/log/nginx/smartsaver_error.log`

### CORS errors
- [ ] `APP_ORIGIN` w `.env` ustawiony na poprawną domenę lub IP
- [ ] Dla IP: `APP_ORIGIN=http://123.45.67.89` (bez trailing slash)
- [ ] Dla domeny: `APP_ORIGIN=https://domena.com`
- [ ] Restart backendu po zmianie: `pm2 restart smartsaver-backend`

### Database connection errors
- [ ] MySQL działa: `sudo systemctl status mysql`
- [ ] `DATABASE_URL` poprawny w `.env`
- [ ] Użytkownik i baza istnieją: `mysql -u smartsaver_user -p smartsaver`
- [ ] Hasło w DATABASE_URL jest poprawne (lub zakodowane jeśli ma znaki specjalne)

### Frontend build warning (żółty tekst)
- [ ] To NIE jest błąd - aplikacja działa
- [ ] Warning o "chunks larger than 500 kB" to tylko sugestia optymalizacji
- [ ] Sprawdź czy build zakończył się: `✓ built in X.XXs`

---

## Podsumowanie

Po zakończeniu wszystkich kroków:

- [ ] Aplikacja działa i jest dostępna publicznie
- [ ] SSL skonfigurowany i działa (jeśli dotyczy)
- [ ] Monitoring i backupy działają
- [ ] Dokumentacja i dane dostępowe zapisane
- [ ] Zespół poinformowany o wdrożeniu

**Data wdrożenia:** _______________

**Wdrożył:** _______________

**URL produkcyjny:** _______________

---

## Przydatne komendy

```bash
# Status aplikacji
pm2 status
pm2 logs smartsaver-backend

# Restart
pm2 restart smartsaver-backend

# Aktualizacja
cd ~/SmartSaver && ./deployment/deploy.sh

# Backup
./deployment/backup.sh

# Logi Nginx
sudo tail -f /var/log/nginx/smartsaver_error.log

# Status serwisów
sudo systemctl status nginx
sudo systemctl status mysql
```

---

**Gratulacje! Aplikacja SmartSaver została pomyślnie wdrożona na VPS!** 🎉
