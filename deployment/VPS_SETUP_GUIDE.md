# Przewodnik konfiguracji VPS dla SmartSaver

## Wymagania wstępne

- Serwer VPS z Ubuntu 22.04 LTS lub nowszym
- Dostęp SSH do serwera (jako root lub sudo user)
- Domena wskazująca na adres IP serwera (opcjonalnie, dla SSL)
- Minimum 1GB RAM, 1 vCPU, 20GB dysku

## Spis treści

1. [Wstępna konfiguracja serwera](#1-wstępna-konfiguracja-serwera)
2. [Instalacja Node.js](#2-instalacja-nodejs)
3. [Instalacja MySQL](#3-instalacja-mysql)
4. [Instalacja Nginx](#4-instalacja-nginx)
5. [Instalacja PM2](#5-instalacja-pm2)
6. [Konfiguracja projektu](#6-konfiguracja-projektu)
7. [Konfiguracja Nginx jako reverse proxy](#7-konfiguracja-nginx-jako-reverse-proxy)
8. [Konfiguracja SSL (HTTPS)](#8-konfiguracja-ssl-https)
9. [Uruchomienie aplikacji](#9-uruchomienie-aplikacji)
10. [Monitorowanie i utrzymanie](#10-monitorowanie-i-utrzymanie)

---

## 1. Wstępna konfiguracja serwera

### Aktualizacja systemu

```bash
sudo apt update && sudo apt upgrade -y
```

### Tworzenie użytkownika deploy (opcjonalne, ale zalecane)

```bash
# Utwórz nowego użytkownika
sudo adduser deploy

# Dodaj do grupy sudo
sudo usermod -aG sudo deploy

# Przełącz się na nowego użytkownika
su - deploy
```

### Konfiguracja firewalla

```bash
# Zainstaluj ufw jeśli nie jest zainstalowany
sudo apt install ufw -y

# Zezwól na SSH
sudo ufw allow OpenSSH

# Zezwól na HTTP i HTTPS
sudo ufw allow 'Nginx Full'

# Włącz firewall
sudo ufw enable

# Sprawdź status
sudo ufw status
```

---

## 2. Instalacja Node.js

```bash
# Instalacja Node.js 20.x (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Weryfikacja instalacji
node --version  # powinno pokazać v20.x.x
npm --version   # powinno pokazać npm w wersji 10.x.x
```

---

## 3. Instalacja MySQL

```bash
# Instalacja MySQL Server
sudo apt install mysql-server -y

# Uruchom skrypt bezpieczeństwa
sudo mysql_secure_installation
```

Podczas konfiguracji:
- Ustaw mocne hasło root
- Usuń anonimowych użytkowników: **Y**
- Nie zezwalaj na zdalne logowanie root: **Y**
- Usuń testową bazę danych: **Y**
- Przeładuj tabele uprawnień: **Y**

### Konfiguracja bazy danych dla SmartSaver

```bash
# Zaloguj się do MySQL jako root
sudo mysql -u root -p
```

W konsoli MySQL wykonaj:

```sql
-- Utwórz bazę danych
CREATE DATABASE smartsaver CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Utwórz użytkownika
CREATE USER 'smartsaver_user'@'localhost' IDENTIFIED BY 'TWOJE_MOCNE_HASŁO';

-- Nadaj uprawnienia
GRANT ALL PRIVILEGES ON smartsaver.* TO 'smartsaver_user'@'localhost';

-- Zastosuj zmiany
FLUSH PRIVILEGES;

-- Wyjdź
EXIT;
```

### Testowanie połączenia

```bash
mysql -u smartsaver_user -p smartsaver
```

---

## 4. Instalacja Nginx

```bash
# Instalacja Nginx
sudo apt install nginx -y

# Uruchom i włącz Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Sprawdź status
sudo systemctl status nginx
```

Sprawdź czy Nginx działa, otwierając w przeglądarce: `http://TWÓJ_IP_SERWERA`

---

## 5. Instalacja PM2

PM2 to menedżer procesów Node.js, który zapewni automatyczne restarty i działanie aplikacji w tle.

```bash
# Instalacja PM2 globalnie
sudo npm install -g pm2

# Weryfikacja instalacji
pm2 --version
```

---

## 6. Konfiguracja projektu

### Instalacja Git

```bash
sudo apt install git -y
```

### Klonowanie repozytorium

**WAŻNE:** Klonuj do `/var/www/` zamiast `/root/` - Nginx potrzebuje dostępu do plików!

```bash
# Utwórz katalog (jeśli nie istnieje)
sudo mkdir -p /var/www

# Przejdź do katalogu
cd /var/www

# Klonuj repozytorium
sudo git clone https://github.com/ProjektWdrozeniowy/SmartSaver.git

# Ustaw uprawnienia
sudo chown -R www-data:www-data /var/www/SmartSaver
sudo chmod -R 755 /var/www/SmartSaver

# Przejdź do katalogu projektu
cd SmartSaver
```

**Dlaczego `/var/www/`?**
- Nginx działa jako user `www-data` i **nie ma dostępu** do `/root/`
- Klonowanie do `/root/` spowoduje błąd **403 Forbidden**

### Instalacja zależności

```bash
# Przejdź do katalogu projektu
cd /var/www/SmartSaver

# Instalacja zależności dla całego monorepo
npm install

# Instalacja zależności dla workspace'ów
npm run install:all
```

### Konfiguracja zmiennych środowiskowych

```bash
# Utwórz plik .env dla produkcji
cd /var/www/SmartSaver/backend
nano .env
```

Zawartość pliku `.env` dla produkcji (przykład - **dostosuj do swoich wartości**):

**Jeśli masz domenę:**
```env
# Port aplikacji backend
PORT=4000

# Origin frontendu (zmień na swoją domenę)
APP_ORIGIN=https://twoja-domena.com

# Database URL (zaktualizuj hasło)
DATABASE_URL="mysql://smartsaver_user:TWOJE_HASŁO@localhost:3306/smartsaver"

# JWT Configuration (WYGENERUJ NOWY SEKRET!)
JWT_SECRET="WYGENERUJ_SILNY_LOSOWY_STRING_MIN_32_ZNAKI"
JWT_EXPIRES_IN="7d"

# Email Configuration (Gmail SMTP)
EMAIL_ADDRESS=kontaktsmartsaver@gmail.com
EMAIL_APP_PASSWORD="twoje_hasło_aplikacji_gmail"

# Frontend URL (zmień na swoją domenę)
FRONTEND_BASE_URL=https://twoja-domena.com
```

**Jeśli używasz tylko IP (bez domeny):**
```env
# Port aplikacji backend
PORT=4000

# Origin frontendu (ZAMIEŃ na swój IP)
APP_ORIGIN=http://TWÓJ_IP_SERWERA

# Database URL (zaktualizuj hasło)
DATABASE_URL="mysql://smartsaver_user:TWOJE_HASŁO@localhost:3306/smartsaver"

# JWT Configuration (WYGENERUJ NOWY SEKRET!)
JWT_SECRET="WYGENERUJ_SILNY_LOSOWY_STRING_MIN_32_ZNAKI"
JWT_EXPIRES_IN="7d"

# Email Configuration (Gmail SMTP)
EMAIL_ADDRESS=kontaktsmartsaver@gmail.com
EMAIL_APP_PASSWORD="twoje_hasło_aplikacji_gmail"

# Frontend URL (ZAMIEŃ na swój IP)
FRONTEND_BASE_URL=http://TWÓJ_IP_SERWERA
```

**WAŻNE - DATABASE_URL:**

Format: `mysql://UŻYTKOWNIK:HASŁO@host:port/baza`

⚠️ **Częsty błąd:** Jeśli hasło zawiera znaki specjalne (`@`, `:`, `/`, `?`, `#`, `&`, `%`), musisz je zakodować w URL:

| Znak | Zakodowany |
|------|------------|
| `@` | `%40` |
| `:` | `%3A` |
| `/` | `%2F` |
| `?` | `%3F` |
| `#` | `%23` |
| `&` | `%26` |
| `%` | `%25` |

**Przykład:**
- Hasło: `MyP@ss:word!`
- DATABASE_URL: `mysql://smartsaver_user:MyP%40ss%3Aword%21@localhost:3306/smartsaver`

**Narzędzie do kodowania hasła:**
```bash
node -e "console.log(encodeURIComponent('TwojeHasło'))"
```

**WAŻNE - JWT_SECRET:**

Wygeneruj nowy, silny JWT_SECRET (min. 64 znaki):

```bash
# Generowanie bezpiecznego JWT_SECRET
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Generowanie Prisma Client

**WAŻNE:** Ten krok jest konieczny przed migracją!

```bash
cd /var/www/SmartSaver/backend
npx prisma generate
```

Ten krok generuje Prisma Client na podstawie `schema.prisma`. Bez tego backend nie uruchomi się.

### Migracja bazy danych

```bash
cd /var/www/SmartSaver/backend
npx prisma migrate deploy
```

Jeśli wystąpi błąd `P1013: The provided database string is invalid`, sprawdź:
1. Format `DATABASE_URL` - musi być: `mysql://user:password@host:port/database`
2. Czy hasło zawiera znaki specjalne - jeśli tak, zakoduj je (patrz wyżej)
3. Czy użytkownik i baza danych zostały utworzone w MySQL

**⚠️ UWAGA:** Jeśli folder `prisma/migrations/` jest w `.gitignore`, migracje nie będą na serwerze!

**Rozwiązanie:**
```bash
# Opcja A: Użyj db push (zastosuje schemat bez migracji)
npx prisma db push

# Opcja B: Commitnij migracje do repo (zalecane)
# Zobacz: deployment/CODE_CHANGES_FOR_PRODUCTION.md
```

### Build frontendu

```bash
cd /var/www/SmartSaver/frontend
npm run build
```

To utworzy folder `dist` z zbudowaną aplikacją frontendową.

**Uwaga:** Możesz zobaczyć żółte ostrzeżenie o dużych plikach (chunk size warning):
```
(!) Some chunks are larger than 500 kB after minification.
```
To **nie jest błąd** - aplikacja będzie działać poprawnie. To ostrzeżenie o optymalizacji performance, którą możesz wykonać później. Build jest zakończony sukcesem jeśli widzisz `✓ built in X.XXs` na końcu.

**⚠️ WAŻNE - Zmiany w kodzie dla produkcji:**

Frontend ma zahardcodowane `http://localhost:4000` w plikach API. **Musisz to zmienić przed buildem!**

Zobacz instrukcje: [CODE_CHANGES_FOR_PRODUCTION.md](../deployment/CODE_CHANGES_FOR_PRODUCTION.md)

**Szybka poprawka:**
```bash
cd /var/www/SmartSaver/frontend/src/api
sed -i "s|'http://localhost:4000'|''|g" *.js
cd /var/www/SmartSaver/frontend
sed -i "s|'http://localhost:4000/api/mail/contact'|'/api/mail/contact'|g" src/views/ContactPage.jsx

# Teraz zrób build
npm run build

# Weryfikacja - powinno być PUSTE
grep -o "localhost:4000" dist/assets/*.js
```

---

## 7. Konfiguracja Nginx jako reverse proxy

**Wybierz jedną z dwóch opcji:**
- **7A** - Jeśli masz domenę i chcesz SSL/HTTPS
- **7B** - Jeśli masz tylko adres IP (bez domeny)

---

### 7A. Konfiguracja z domeną (HTTPS)

#### Utwórz plik konfiguracyjny dla aplikacji

```bash
sudo nano /etc/nginx/sites-available/smartsaver
```

Zawartość pliku (dla HTTPS - **zaktualizuj domenę**):

```nginx
# Przekierowanie HTTP -> HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name twoja-domena.com www.twoja-domena.com;

    # Przekieruj całość na HTTPS
    return 301 https://$server_name$request_uri;
}

# Serwer HTTPS
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name twoja-domena.com www.twoja-domena.com;

    # Certyfikaty SSL (będą dodane przez Certbot)
    ssl_certificate /etc/letsencrypt/live/twoja-domena.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/twoja-domena.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Zwiększ maksymalny rozmiar pliku upload (opcjonalne)
    client_max_body_size 10M;

    # Ścieżka do statycznych plików frontendu
    root /home/deploy/SmartSaver/frontend/dist;
    index index.html;

    # Logi
    access_log /var/log/nginx/smartsaver_access.log;
    error_log /var/log/nginx/smartsaver_error.log;

    # Backend API - reverse proxy
    location /api/ {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Timeouty
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Frontend - pliki statyczne i SPA routing
    location / {
        try_files $uri $uri/ /index.html;

        # Cache dla statycznych assetów
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

#### Aktywuj konfigurację

```bash
# Utwórz symlink
sudo ln -s /etc/nginx/sites-available/smartsaver /etc/nginx/sites-enabled/

# Usuń domyślną konfigurację (opcjonalne)
sudo rm /etc/nginx/sites-enabled/default

# Testuj konfigurację
sudo nginx -t

# Jeśli test OK, przeładuj Nginx
sudo systemctl reload nginx
```

Następnie przejdź do **kroku 8** (Konfiguracja SSL).

---

### 7B. Konfiguracja dla samego IP (HTTP, bez SSL)

**Jeśli nie masz domeny**, użyj tej uproszczonej konfiguracji:

#### Utwórz plik konfiguracyjny

```bash
sudo nano /etc/nginx/sites-available/smartsaver
```

Zawartość pliku (dla HTTP, dostęp przez IP):

```nginx
# Konfiguracja HTTP (bez SSL) dla dostępu przez IP
server {
    listen 80;
    listen [::]:80;
    server_name _;  # Akceptuj wszystkie requesty (dla IP)

    # Zwiększ maksymalny rozmiar pliku upload
    client_max_body_size 10M;

    # Ścieżka do statycznych plików frontendu
    # UWAGA: Zmień ścieżkę w zależności od lokalizacji projektu
    root /var/www/SmartSaver/frontend/dist;
    index index.html;

    # Logi
    access_log /var/log/nginx/smartsaver_access.log;
    error_log /var/log/nginx/smartsaver_error.log;

    # Kompresja Gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;

    # Backend API - reverse proxy
    location /api/ {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Timeouty
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Frontend - pliki statyczne i SPA routing
    location / {
        try_files $uri $uri/ /index.html;

        # Cache dla statycznych assetów
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # Wyłącz cache dla index.html
        location = /index.html {
            add_header Cache-Control "no-cache, no-store, must-revalidate";
            expires 0;
        }
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Blokuj dostęp do ukrytych plików
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
}
```

#### Aktywuj konfigurację

```bash
# Utwórz symlink
sudo ln -s /etc/nginx/sites-available/smartsaver /etc/nginx/sites-enabled/

# Usuń domyślną konfigurację (opcjonalne)
sudo rm /etc/nginx/sites-enabled/default

# Testuj konfigurację
sudo nginx -t

# Jeśli test OK, przeładuj Nginx
sudo systemctl reload nginx
```

**Pomiń krok 8 (SSL)** - nie potrzebujesz go bez domeny. Przejdź bezpośrednio do **kroku 9**.

---

## 8. Konfiguracja SSL (HTTPS)

**Uwaga:** Ten krok jest tylko dla opcji 7A (z domeną). Jeśli używasz tylko IP (opcja 7B), pomiń ten krok.

### Instalacja Certbot

```bash
sudo apt install certbot python3-certbot-nginx -y
```

### Uzyskanie certyfikatu SSL

```bash
# Certbot automatycznie skonfiguruje Nginx
sudo certbot --nginx -d twoja-domena.com -d www.twoja-domena.com
```

Postępuj zgodnie z instrukcjami:
- Podaj email
- Zaakceptuj Terms of Service
- Wybierz przekierowanie HTTP -> HTTPS (opcja 2)

### Automatyczne odnawianie certyfikatów

```bash
# Test automatycznego odnawiania
sudo certbot renew --dry-run

# Certbot automatycznie skonfiguruje cron job dla odnawiania
```

---

## 9. Uruchomienie aplikacji

### Czemu tylko backend?

**Frontend nie wymaga uruchomienia** - został zbudowany do statycznych plików HTML/JS/CSS w katalogu `frontend/dist/`, które Nginx serwuje automatycznie.

**Backend musi działać** jako aktywny proces - obsługuje API, łączy się z bazą danych i przetwarza logikę biznesową.

### Uruchomienie backendu z PM2

**⚠️ WAŻNE - Poprawka CORS:**

Backend ma błąd w kodzie CORS - **nie sprawdza** `APP_ORIGIN` z `.env`!

Zobacz: [CODE_CHANGES_FOR_PRODUCTION.md](../deployment/CODE_CHANGES_FOR_PRODUCTION.md#2-backend---poprawka-cors-dla-produkcji)

**Szybka poprawka:**
```bash
nano /var/www/SmartSaver/backend/server.js
```

Znajdź sekcję CORS (~linia 66-77) i dodaj sprawdzanie `process.env.APP_ORIGIN`:
```javascript
// Pozwól na APP_ORIGIN z .env (PRODUKCJA)
const allowedOrigin = process.env.APP_ORIGIN;
if (allowedOrigin && origin === allowedOrigin) {
  return callback(null, true);
}
```

**Po poprawce uruchom:**

```bash
# Przejdź do katalogu backend
cd /var/www/SmartSaver/backend

# Uruchom aplikację z PM2
pm2 start server.js --name "smartsaver-backend"

# Zapisz konfigurację PM2
pm2 save

# Skonfiguruj PM2 do automatycznego uruchamiania po restarcie systemu
pm2 startup

# Wykonaj komendę, którą pokaże pm2 startup (będzie podobna do):
# sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u root --hp /root
```

### Sprawdzanie statusu aplikacji

```bash
# Status PM2
pm2 status

# Logi aplikacji
pm2 logs smartsaver-backend

# Monitorowanie w czasie rzeczywistym
pm2 monit
```

**Status powinien być: `online`**

Jeśli widzisz `errored` lub ciągłe restarty, sprawdź logi:
```bash
pm2 logs smartsaver-backend --err --lines 30
```

### Najczęstsze błędy przy uruchomieniu

#### Błąd: `@prisma/client did not initialize yet`

**Rozwiązanie:**
```bash
cd ~/SmartSaver/backend
npx prisma generate
pm2 restart smartsaver-backend
```

#### Błąd: `P1013: The provided database string is invalid`

**Rozwiązanie:** Sprawdź format `DATABASE_URL` w pliku `.env`:
- Musi być: `mysql://user:password@host:port/database`
- Jeśli hasło ma znaki specjalne, zakoduj je (patrz sekcja 6)

#### Błąd: `Port 4000 already in use`

**Rozwiązanie:**
```bash
# Znajdź proces na porcie 4000
sudo netstat -tulpn | grep 4000

# Zabij proces (zamień PID)
kill -9 PID
```

### Testowanie aplikacji

**Z domeną:** Otwórz przeglądarkę i przejdź do: `https://twoja-domena.com`

**Z IP:** Otwórz przeglądarkę i przejdź do: `http://TWÓJ_IP`

---

## 10. Monitorowanie i utrzymanie

### Przydatne komendy PM2

```bash
# Restart aplikacji
pm2 restart smartsaver-backend

# Stop aplikacji
pm2 stop smartsaver-backend

# Usuń aplikację z PM2
pm2 delete smartsaver-backend

# Wyświetl informacje o aplikacji
pm2 info smartsaver-backend

# Logi w czasie rzeczywistym
pm2 logs smartsaver-backend --lines 100
```

### Aktualizacja aplikacji

```bash
# Przejdź do katalogu projektu
cd ~/SmartSaver

# Pobierz najnowsze zmiany
git pull origin main

# Instalacja/aktualizacja zależności
npm install
npm run install:all

# Migracje bazy danych (jeśli są)
cd backend
npx prisma migrate deploy

# Build frontendu
cd ../frontend
npm run build

# Restart backendu
pm2 restart smartsaver-backend

# Opcjonalnie: reload Nginx
sudo systemctl reload nginx
```

### Backup bazy danych

```bash
# Utwórz katalog na backupy
mkdir -p ~/backups

# Backup bazy danych
mysqldump -u smartsaver_user -p smartsaver > ~/backups/smartsaver_$(date +%Y%m%d_%H%M%S).sql

# Zautomatyzuj backupy przez crontab
crontab -e
```

Dodaj linię (backup codziennie o 2:00):

```cron
0 2 * * * mysqldump -u smartsaver_user -p'TWOJE_HASŁO' smartsaver > ~/backups/smartsaver_$(date +\%Y\%m\%d_\%H\%M\%S).sql
```

### Monitorowanie logów

```bash
# Logi Nginx
sudo tail -f /var/log/nginx/smartsaver_access.log
sudo tail -f /var/log/nginx/smartsaver_error.log

# Logi aplikacji (PM2)
pm2 logs smartsaver-backend

# Logi systemowe
sudo journalctl -u nginx -f
```

### Monitorowanie zasobów systemowych

```bash
# Użycie CPU i RAM
htop

# Użycie dysku
df -h

# Użycie pamięci
free -h

# Statystyki PM2
pm2 monit
```

---

## Rozwiązywanie problemów

### 1. Backend crashuje - status `errored` w PM2

**Objaw:**
```bash
pm2 status
# pokazuje: status: errored, restarts: 15+
```

**Diagnoza:**
```bash
# Sprawdź logi błędów
pm2 logs smartsaver-backend --err --lines 30

# Lub uruchom bezpośrednio aby zobaczyć błąd
pm2 delete smartsaver-backend
cd ~/SmartSaver/backend
node server.js
```

#### Błąd A: `@prisma/client did not initialize yet`

**Pełny komunikat:**
```
Error: @prisma/client did not initialize yet. Please run "prisma generate"
```

**Rozwiązanie:**
```bash
cd ~/SmartSaver/backend
npx prisma generate
pm2 start server.js --name smartsaver-backend
pm2 save
```

#### Błąd B: `P1013: The provided database string is invalid`

**Pełny komunikat:**
```
Error: P1013: The provided database string is invalid. invalid port number in database URL
```

**Przyczyna:** Nieprawidłowy format `DATABASE_URL` w `.env`

**Rozwiązanie:**
```bash
nano ~/SmartSaver/backend/.env
```

Sprawdź/popraw `DATABASE_URL`:
```env
# POPRAWNY format:
DATABASE_URL="mysql://smartsaver_user:HASŁO@localhost:3306/smartsaver"

# NIE używaj:
DATABASE_URL="mysql://root@localhost:3306/smartsaver"  # brak hasła
DATABASE_URL="mysql://user:p@ss@localhost:3306/db"     # hasło ze znakami specjalnymi
```

**Jeśli hasło zawiera znaki specjalne**, zakoduj je:
```bash
# Narzędzie do kodowania
node -e "console.log(encodeURIComponent('TwojeHasło'))"

# Przykład: hasło "MyP@ss" staje się "MyP%40ss"
DATABASE_URL="mysql://smartsaver_user:MyP%40ss@localhost:3306/smartsaver"
```

**Jeśli zapomniałeś hasła**, zresetuj je:
```bash
sudo mysql -u root -p
```
```sql
ALTER USER 'smartsaver_user'@'localhost' IDENTIFIED BY 'NoweHaslo123';
FLUSH PRIVILEGES;
EXIT;
```

### 2. Błędy połączenia z bazą danych

```bash
# Sprawdź czy MySQL działa
sudo systemctl status mysql

# Sprawdź logi MySQL
sudo tail -f /var/log/mysql/error.log

# Testuj połączenie
mysql -u smartsaver_user -p smartsaver

# Sprawdź czy baza istnieje
sudo mysql -u root -p -e "SHOW DATABASES;"
```

### 3. Problemy z Nginx

#### 502 Bad Gateway

**Przyczyna:** Backend nie działa lub Nginx nie może się z nim połączyć

**Rozwiązanie:**
```bash
# 1. Sprawdź czy backend działa
pm2 status

# 2. Sprawdź czy backend odpowiada
curl http://localhost:4000

# 3. Sprawdź konfigurację Nginx
sudo nginx -t

# 4. Sprawdź logi Nginx
sudo tail -f /var/log/nginx/smartsaver_error.log
```

#### 404 Not Found dla plików statycznych

**Przyczyna:** Nieprawidłowa ścieżka do `frontend/dist` w Nginx

**Rozwiązanie:**
```bash
# Sprawdź czy folder dist istnieje
ls -la ~/SmartSaver/frontend/dist/

# Popraw ścieżkę w Nginx
sudo nano /etc/nginx/sites-available/smartsaver
# Zmień 'root' na poprawną ścieżkę:
# root /root/SmartSaver/frontend/dist;  # dla root user
# root /home/deploy/SmartSaver/frontend/dist;  # dla user deploy

# Przeładuj Nginx
sudo nginx -t
sudo systemctl reload nginx
```

### 4. CORS errors w przeglądarce

**Objaw:**
```
Access to fetch at 'http://IP:4000/api/...' from origin 'http://IP' has been blocked by CORS policy
```

**Rozwiązanie:**
Upewnij się, że w `backend/.env`:
```env
# Dla domeny:
APP_ORIGIN=https://twoja-domena.com

# Dla IP (BEZ http://):
APP_ORIGIN=http://123.45.67.89
```

**Zrestartuj backend:**
```bash
pm2 restart smartsaver-backend
```

### 5. Build frontendu - ostrzeżenie o dużych plikach

**Objaw:**
```
(!) Some chunks are larger than 500 kB after minification.
✓ built in 15.98s
```

**To NIE jest błąd!** Build zakończył się sukcesem. To tylko ostrzeżenie o optymalizacji performance, którą możesz zrobić później.

### 6. SSL nie działa

**Tylko dla opcji z domeną:**

```bash
# Sprawdź certyfikaty
sudo certbot certificates

# Odnów certyfikat manualnie
sudo certbot renew

# Sprawdź daty ważności
echo | openssl s_client -servername twoja-domena.com -connect twoja-domena.com:443 2>/dev/null | openssl x509 -noout -dates
```

### 7. Port 4000 już zajęty

```bash
# Znajdź proces
sudo netstat -tulpn | grep 4000

# Zabij proces (zamień PID na rzeczywisty)
kill -9 PID

# Lub użyj PM2
pm2 delete smartsaver-backend
pm2 start ~/SmartSaver/backend/server.js --name smartsaver-backend
```

### 8. Frontend się ładuje, ale API nie działa

**Sprawdź:**
1. Backend działa: `pm2 status`
2. Backend odpowiada: `curl http://localhost:4000/api/`
3. Nginx proxy działa: sprawdź logi `sudo tail -f /var/log/nginx/smartsaver_error.log`
4. `.env` ma poprawne wartości

---

## Checklist końcowy

- [ ] Serwer zaktualizowany (`apt update && apt upgrade`)
- [ ] Firewall skonfigurowany (UFW)
- [ ] Node.js zainstalowany
- [ ] MySQL zainstalowany i skonfigurowany
- [ ] Baza danych i użytkownik utworzone
- [ ] Nginx zainstalowany i skonfigurowany
- [ ] PM2 zainstalowany globalnie
- [ ] Repozytorium sklonowane
- [ ] Zależności zainstalowane
- [ ] Plik `.env` skonfigurowany z właściwymi wartościami produkcyjnymi
- [ ] Migracje bazy danych wykonane
- [ ] Frontend zbudowany (`npm run build`)
- [ ] Nginx skonfigurowany jako reverse proxy
- [ ] SSL certyfikat zainstalowany (jeśli używasz domeny)
- [ ] Backend uruchomiony przez PM2
- [ ] PM2 skonfigurowany do autostartu
- [ ] Aplikacja testowana i działa poprawnie
- [ ] Backupy bazy danych skonfigurowane

---

## Dodatkowe zasoby

- [Dokumentacja PM2](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [Dokumentacja Nginx](https://nginx.org/en/docs/)
- [Dokumentacja Prisma](https://www.prisma.io/docs/)
- [Let's Encrypt / Certbot](https://certbot.eff.org/)

---

## Kontakt i wsparcie

W razie problemów z aplikacją SmartSaver:
- GitHub Issues: https://github.com/ProjektWdrozeniowy/SmartSaver/issues
