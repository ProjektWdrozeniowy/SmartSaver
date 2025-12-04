# Quick Start - Szybka konfiguracja VPS

Skrócona wersja przewodnika wdrożenia. Dla pełnych instrukcji zobacz [VPS_SETUP_GUIDE.md](./VPS_SETUP_GUIDE.md).

## Wymagania

- Ubuntu 22.04 LTS
- Domena wskazująca na IP serwera (opcjonalnie)
- Dostęp SSH jako root lub sudo user

## 1. Wstępna konfiguracja (5 min)

```bash
# Aktualizacja systemu
sudo apt update && sudo apt upgrade -y

# Firewall
sudo apt install ufw -y
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

## 2. Instalacja zależności (10 min)

```bash
# Node.js 20.x LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# MySQL
sudo apt install mysql-server -y
sudo mysql_secure_installation

# Nginx
sudo apt install nginx -y
sudo systemctl enable nginx

# PM2
sudo npm install -g pm2

# Git
sudo apt install git -y
```

## 3. Konfiguracja bazy danych (5 min)

```bash
sudo mysql -u root -p
```

W konsoli MySQL:

```sql
CREATE DATABASE smartsaver CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'smartsaver_user'@'localhost' IDENTIFIED BY 'TWOJE_MOCNE_HASŁO';
GRANT ALL PRIVILEGES ON smartsaver.* TO 'smartsaver_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## 4. Konfiguracja projektu (10 min)

```bash
# Klonowanie (do /var/www/ zamiast ~/!)
sudo mkdir -p /var/www
cd /var/www
sudo git clone https://github.com/ProjektWdrozeniowy/SmartSaver.git
sudo chown -R www-data:www-data SmartSaver
sudo chmod -R 755 SmartSaver
cd SmartSaver

# Instalacja zależności
npm install
npm run install:all

# ⚠️ POPRAWKA KODU - Usuń localhost z frontendu
cd frontend/src/api
sed -i "s|'http://localhost:4000'|''|g" *.js
cd /var/www/SmartSaver/frontend
sed -i "s|'http://localhost:4000/api/mail/contact'|'/api/mail/contact'|g" src/views/ContactPage.jsx

# ⚠️ POPRAWKA KODU - Fix CORS w backendzie
# Edytuj backend/server.js ~linia 66-77
# Dodaj: if (allowedOrigin && origin === allowedOrigin) return callback(null, true);
# Zobacz: deployment/CODE_CHANGES_FOR_PRODUCTION.md

# Konfiguracja .env
cd /var/www/SmartSaver/backend
nano .env
```

Zawartość `.env` (dostosuj wartości):

**Z domeną:**
```env
PORT=4000
APP_ORIGIN=https://twoja-domena.com
DATABASE_URL="mysql://smartsaver_user:TWOJE_HASŁO@localhost:3306/smartsaver"
JWT_SECRET="WYGENERUJ_NOWY_64_ZNAKOWY_STRING"
JWT_EXPIRES_IN="7d"
EMAIL_ADDRESS=twoj-email@gmail.com
EMAIL_APP_PASSWORD="hasło_aplikacji_gmail"
FRONTEND_BASE_URL=https://twoja-domena.com
```

**Bez domeny (tylko IP):**
```env
PORT=4000
APP_ORIGIN=http://TWÓJ_IP
DATABASE_URL="mysql://smartsaver_user:TWOJE_HASŁO@localhost:3306/smartsaver"
JWT_SECRET="WYGENERUJ_NOWY_64_ZNAKOWY_STRING"
JWT_EXPIRES_IN="7d"
EMAIL_ADDRESS=twoj-email@gmail.com
EMAIL_APP_PASSWORD="hasło_aplikacji_gmail"
FRONTEND_BASE_URL=http://TWÓJ_IP
```

**⚠️ Ważne:** Jeśli hasło w DATABASE_URL ma znaki specjalne (@, :, /, ?), zakoduj je:
```bash
node -e "console.log(encodeURIComponent('TwojeHasło'))"
```

Wygeneruj JWT_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

```bash
# WAŻNE: Wygeneruj Prisma Client przed migracją!
npx prisma generate

# Migracja bazy (lub db push jeśli migracje w .gitignore)
npx prisma migrate deploy
# LUB: npx prisma db push

# Build frontendu
cd ../frontend
npm run build

# Weryfikacja - localhost:4000 powinno być PUSTE
grep -o "localhost:4000" dist/assets/*.js
```

## 5. Konfiguracja Nginx (5 min)

**Z domeną i SSL:**
```bash
# Skopiuj przykładową konfigurację
sudo cp ~/SmartSaver/deployment/nginx.conf /etc/nginx/sites-available/smartsaver

# Edytuj i zamień "twoja-domena.com" na prawdziwą domenę
sudo nano /etc/nginx/sites-available/smartsaver

# Aktywuj
sudo ln -s /etc/nginx/sites-available/smartsaver /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# Test i restart
sudo nginx -t
sudo systemctl reload nginx
```

**Tylko IP (bez domeny/SSL):**
```bash
# Skopiuj konfigurację dla IP
sudo cp ~/SmartSaver/deployment/nginx-no-ssl.conf /etc/nginx/sites-available/smartsaver

# Sprawdź ścieżkę w pliku (zmień /root/ na /home/deploy/ jeśli używasz user deploy)
sudo nano /etc/nginx/sites-available/smartsaver

# Aktywuj
sudo ln -s /etc/nginx/sites-available/smartsaver /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# Test i restart
sudo nginx -t
sudo systemctl reload nginx
```

## 6. SSL (Tylko dla domeny, 5 min)

```bash
# Certbot
sudo apt install certbot python3-certbot-nginx -y

# Uzyskanie certyfikatu
sudo certbot --nginx -d twoja-domena.com -d www.twoja-domena.com
```

## 7. Uruchomienie aplikacji (5 min)

```bash
# Start z PM2
cd ~/SmartSaver/backend
pm2 start server.js --name "smartsaver-backend"

# Auto-start po restarcie
pm2 save
pm2 startup
# Wykonaj komendę pokazaną przez pm2 startup
```

## 8. Weryfikacja

```bash
# Status aplikacji (powinien być "online")
pm2 status

# Logi (sprawdź czy brak błędów)
pm2 logs smartsaver-backend

# Test w przeglądarce
# Z domeną: https://twoja-domena.com
# Z IP: http://TWÓJ_IP
```

## Szybkie rozwiązywanie problemów

**Backend status "errored":**
```bash
# Sprawdź błąd
pm2 logs smartsaver-backend --err

# Częsty błąd: Prisma Client not initialized
cd ~/SmartSaver/backend
npx prisma generate
pm2 restart smartsaver-backend

# Częsty błąd: DATABASE_URL invalid
nano ~/SmartSaver/backend/.env
# Sprawdź format: mysql://user:password@host:port/database
# Zakoduj znaki specjalne w haśle
```

**502 Bad Gateway:**
```bash
# Sprawdź czy backend działa
pm2 status
pm2 restart smartsaver-backend
```

**CORS errors:**
```bash
# Sprawdź .env
nano ~/SmartSaver/backend/.env
# APP_ORIGIN musi być: http://TWÓJ_IP lub https://domena.com
pm2 restart smartsaver-backend
```

## Przydatne komendy

```bash
# Restart aplikacji
pm2 restart smartsaver-backend

# Aktualizacja aplikacji
cd ~/SmartSaver
git pull
npm install && npm run install:all
cd backend && npx prisma migrate deploy
cd ../frontend && npm run build
pm2 restart smartsaver-backend

# Backup bazy danych
mysqldump -u smartsaver_user -p smartsaver > backup_$(date +%Y%m%d).sql

# Logi
pm2 logs smartsaver-backend
sudo tail -f /var/log/nginx/smartsaver_error.log
```

## Skrypty pomocnicze

W katalogu `deployment/` znajdziesz:

- `deploy.sh` - automatyczny deployment
- `backup.sh` - backup bazy danych
- `ecosystem.config.js` - zaawansowana konfiguracja PM2

Nadaj uprawnienia:
```bash
chmod +x ~/SmartSaver/deployment/*.sh
```

## ⚠️ WAŻNE - Zmiany w kodzie

**MUSISZ** wprowadzić zmiany w kodzie przed wdrożeniem!

1. **Frontend** - usuń `localhost:4000` z plików API
2. **Backend** - popraw CORS aby sprawdzał `APP_ORIGIN`
3. **Prisma** - commitnij migracje lub użyj `db push`

**Szczegóły:** [CODE_CHANGES_FOR_PRODUCTION.md](./CODE_CHANGES_FOR_PRODUCTION.md)

---

## Potrzebujesz pomocy?

- **Zmiany w kodzie:** [CODE_CHANGES_FOR_PRODUCTION.md](./CODE_CHANGES_FOR_PRODUCTION.md)
- **Rozwiązywanie problemów:** [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- **Pełna dokumentacja:** [VPS_SETUP_GUIDE.md](./VPS_SETUP_GUIDE.md)
