# Troubleshooting - Rozwiązywanie problemów SmartSaver

Ten dokument zawiera rozwiązania najczęstszych problemów napotkanych podczas wdrażania SmartSaver na VPS.

## Spis treści

1. [403 Forbidden - Nginx Permission Denied](#1-403-forbidden---nginx-permission-denied)
2. [Failed to fetch - Frontend łączy się z localhost](#2-failed-to-fetch---frontend-łączy-się-z-localhost)
3. [CORS Errors - Backend blokuje requesty](#3-cors-errors---backend-blokuje-requesty)
4. [Baza danych - Brakujące kolumny (createdAt)](#4-baza-danych---brakujące-kolumny-createdat)
5. [Backend crashuje - status "errored"](#5-backend-crashuje---status-errored)
6. [Błąd DATABASE_URL](#6-błąd-database_url)
7. [Błąd Prisma Client](#7-błąd-prisma-client)
8. [502 Bad Gateway](#8-502-bad-gateway)
9. [Frontend nie ładuje się](#9-frontend-nie-ładuje-się)
10. [Warning przy buildzie frontendu](#10-warning-przy-buildzie-frontendu)
11. [Port 4000 zajęty](#11-port-4000-zajęty)
12. [MySQL connection errors](#12-mysql-connection-errors)

---

## 1. 403 Forbidden - Nginx Permission Denied

### Objaw

Przeglądarka pokazuje: **403 Forbidden** przy otwarciu adresu IP serwera.

### Logi Nginx

```bash
sudo tail -f /var/log/nginx/smartsaver_error.log
```

Pokazuje:
```
[error] open() "/root/SmartSaver/frontend/dist/index.html" failed (13: Permission denied)
```

### Przyczyna

Nginx (działa jako user `www-data`) **nie ma dostępu** do katalogu `/root/`. To standardowe zabezpieczenie Linux - katalog `/root/` jest dostępny tylko dla root.

### Rozwiązanie

**Przenieś projekt do `/var/www/`:**

```bash
# 1. Utwórz katalog
sudo mkdir -p /var/www

# 2. Przenieś projekt
sudo mv /root/SmartSaver /var/www/

# 3. Ustaw właściciela na www-data
sudo chown -R www-data:www-data /var/www/SmartSaver

# 4. Ustaw uprawnienia
sudo chmod -R 755 /var/www/SmartSaver

# 5. Zaktualizuj ścieżkę w Nginx
sudo nano /etc/nginx/sites-available/smartsaver
```

Zmień:
```nginx
# Było:
root /root/SmartSaver/frontend/dist;

# Ma być:
root /var/www/SmartSaver/frontend/dist;
```

```bash
# 6. Test i reload
sudo nginx -t
sudo systemctl reload nginx

# 7. Zaktualizuj PM2
pm2 delete smartsaver-backend
cd /var/www/SmartSaver/backend
pm2 start server.js --name smartsaver-backend
pm2 save
```

### Weryfikacja

```bash
# Test jako www-data
sudo -u www-data ls /var/www/SmartSaver/frontend/dist/
# Powinno pokazać pliki bez błędów

# Odśwież stronę w przeglądarce
```

---

## 2. Failed to fetch - Frontend łączy się z localhost

### Objaw

W konsoli przeglądarki (F12):
```
Register URL -> http://localhost:4000/api/register
localhost:4000/api/register:1  Failed to load resource: net::ERR_CONNECTION_REFUSED
```

Formularz rejestracji/logowania nie działa.

### Przyczyna

Frontend ma zahardcodowany `http://localhost:4000` w plikach API. W produkcji `localhost` oznacza komputer użytkownika, nie serwer.

### Rozwiązanie

**Zmień kod frontendu:**

Zobacz szczegółowe instrukcje w: [CODE_CHANGES_FOR_PRODUCTION.md](./CODE_CHANGES_FOR_PRODUCTION.md#1-frontend---usunięcie-hardcoded-localhost)

**Szybkie rozwiązanie:**

```bash
cd /var/www/SmartSaver/frontend/src/api

# Zamień we wszystkich plikach API
sed -i "s|'http://localhost:4000'|''|g" *.js

# Zamień w ContactPage
cd /var/www/SmartSaver/frontend
sed -i "s|'http://localhost:4000/api/mail/contact'|'/api/mail/contact'|g" src/views/ContactPage.jsx

# Rebuild
npm run build

# Weryfikacja
grep -o "localhost:4000" dist/assets/*.js
# Powinno być PUSTE
```

### Po rebuildie

1. **Ctrl+Shift+R** w przeglądarce (hard refresh)
2. Sprawdź Console - powinno być: `Register URL -> /api/register`

---

## 3. CORS Errors - Backend blokuje requesty

### Objaw

W konsoli przeglądarki:
```
Access to fetch at 'http://87.106.75.172/api/register' has been blocked by CORS policy
```

W logach backendu:
```bash
pm2 logs smartsaver-backend --err
```

Pokazuje:
```
Error: Not allowed by CORS
    at origin (/var/www/SmartSaver/backend/server.js:74:14)
```

### Przyczyna

Kod CORS w `backend/server.js` **nie sprawdza** zmiennej `APP_ORIGIN` z `.env`. Akceptuje tylko `localhost`, ale nie IP/domenę serwera.

### Rozwiązanie A: Popraw .env (CZASOWE)

```bash
nano /var/www/SmartSaver/backend/.env
```

Upewnij się, że masz:
```env
APP_ORIGIN=http://87.106.75.172  # Twój IP
```

Ale to **nie zadziała**, bo kod nie sprawdza tej zmiennej!

### Rozwiązanie B: Popraw kod CORS (WŁAŚCIWE)

Zobacz szczegółowe instrukcje w: [CODE_CHANGES_FOR_PRODUCTION.md](./CODE_CHANGES_FOR_PRODUCTION.md#2-backend---poprawka-cors-dla-produkcji)

```bash
nano /var/www/SmartSaver/backend/server.js
```

Znajdź sekcję CORS (~linia 66-77) i zamień na:

```javascript
// Elastyczna konfiguracja CORS dla development i production
app.use(cors({
  origin: (origin, callback) => {
    // Pozwól na requesty bez origin (np. Postman, curl)
    if (!origin) return callback(null, true);

    // Pozwól na APP_ORIGIN z .env (PRODUKCJA)
    const allowedOrigin = process.env.APP_ORIGIN;
    if (allowedOrigin && origin === allowedOrigin) {
      return callback(null, true);
    }

    // Pozwól na wszystkie localhost i 127.0.0.1 na dowolnym porcie (DEVELOPMENT)
    if (origin.match(/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/)) {
      return callback(null, true);
    }

    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
```

```bash
# Restart backendu
pm2 restart smartsaver-backend

# Sprawdź czy nie ma błędów
pm2 logs smartsaver-backend --lines 20
```

---

## 4. Baza danych - Brakujące kolumny (createdAt)

### Objaw

Błąd przy rejestracji:
```
The column `smartsaver.accounts.createdAt` does not exist in the current database.
```

W przeglądarce: **400 Bad Request**

### Przyczyna

Migracje Prisma nie zostały zastosowane lub są w `.gitignore` i nie zostały sklonowane na serwer.

### Diagnoza

```bash
# Sprawdź kolumny w bazie
mysql -u smartsaver_user -p smartsaver -e "DESCRIBE accounts;"

# Jeśli brakuje createdAt, tutorialCompleted itp. - migracje nie zastosowane
```

### Rozwiązanie A: Prisma DB Push (SZYBKIE)

```bash
cd /var/www/SmartSaver/backend

# Zastosuj schemat bezpośrednio do bazy (USUWA DANE!)
npx prisma db push --force-reset

# Restart backendu
pm2 restart smartsaver-backend
```

### Rozwiązanie B: Commitnij migracje do repo (WŁAŚCIWE)

**Na lokalnym komputerze:**

```bash
# Edytuj .gitignore
nano .gitignore
# Usuń: **/prisma/migrations

# Commitnij migracje
git add backend/prisma/migrations/
git commit -m "Add Prisma migrations to repository"
git push
```

**Na serwerze:**

```bash
cd /var/www/SmartSaver
git pull
cd backend
npx prisma generate
npx prisma migrate deploy
pm2 restart smartsaver-backend
```

Zobacz: [CODE_CHANGES_FOR_PRODUCTION.md](./CODE_CHANGES_FOR_PRODUCTION.md#3-prisma---migracje-w-repozytorium)

---

## 5. Backend crashuje - status "errored"

### Objaw
```bash
pm2 status
# Pokazuje:
│ 0  │ smartsaver-backend │ fork     │ 15   │ errored   │ 0%       │ 0b       │
```

### Diagnoza
```bash
# Sprawdź dokładny błąd
pm2 logs smartsaver-backend --err --lines 30

# Lub uruchom bezpośrednio
pm2 delete smartsaver-backend
cd ~/SmartSaver/backend
node server.js
```

Uruchomienie przez `node server.js` pokaże dokładny błąd w konsoli.

---

## 2. Błąd DATABASE_URL

### Objaw
```
Error: P1013: The provided database string is invalid.
invalid port number in database URL
```

### Przyczyny i rozwiązania

#### A. Niepoprawny format DATABASE_URL

**Niepoprawne:**
```env
DATABASE_URL="mysql://root@localhost:3306/smartsaver"  # brak hasła
DATABASE_URL="mysql://smartsaver_user@localhost:3306/smartsaver"  # brak hasła
DATABASE_URL=mysql://smartsaver_user:pass:word@localhost:3306/smartsaver  # hasło ma ":"
```

**Poprawne:**
```env
DATABASE_URL="mysql://smartsaver_user:HASŁO@localhost:3306/smartsaver"
```

#### B. Hasło zawiera znaki specjalne

Jeśli hasło zawiera: `@`, `:`, `/`, `?`, `#`, `&`, `%`, musisz je zakodować.

**Tabela kodowania:**

| Znak | Zakodowany |
|------|------------|
| `@` | `%40` |
| `:` | `%3A` |
| `/` | `%2F` |
| `?` | `%3F` |
| `#` | `%23` |
| `&` | `%26` |
| `%` | `%25` |
| `!` | `%21` |

**Przykład:**
- Hasło: `MyP@ss:word!`
- Zakodowane: `MyP%40ss%3Aword%21`

**Narzędzie do kodowania:**
```bash
node -e "console.log(encodeURIComponent('TwojeHasło'))"
```

**Edytuj .env:**
```bash
nano ~/SmartSaver/backend/.env
```

Popraw DATABASE_URL:
```env
DATABASE_URL="mysql://smartsaver_user:MyP%40ss%3Aword%21@localhost:3306/smartsaver"
```

**Restart:**
```bash
pm2 restart smartsaver-backend
```

#### C. Zapomniałeś hasła

Zresetuj hasło w MySQL:
```bash
sudo mysql -u root -p
```

```sql
ALTER USER 'smartsaver_user'@'localhost' IDENTIFIED BY 'NoweHaslo123';
FLUSH PRIVILEGES;
EXIT;
```

Zaktualizuj `.env`:
```env
DATABASE_URL="mysql://smartsaver_user:NoweHaslo123@localhost:3306/smartsaver"
```

---

## 3. Błąd Prisma Client

### Objaw
```
Error: @prisma/client did not initialize yet.
Please run "prisma generate" and try to import it again.
```

### Rozwiązanie

```bash
cd ~/SmartSaver/backend

# Wygeneruj Prisma Client
npx prisma generate

# Restart aplikacji
pm2 restart smartsaver-backend

# Sprawdź status
pm2 status
```

### Dlaczego to się dzieje?

Prisma Client musi być wygenerowany po każdym:
- `npm install` na nowym serwerze
- Zmianie w `schema.prisma`
- Sklonowaniu repozytorium

**Dodaj do workflow deployment:**
```bash
npm install
npx prisma generate  # ← Ten krok jest kluczowy
npx prisma migrate deploy
```

---

## 4. 502 Bad Gateway

### Objaw

Przeglądarka pokazuje: **502 Bad Gateway** przy próbie dostępu do aplikacji.

### Przyczyny i rozwiązania

#### A. Backend nie działa

```bash
# Sprawdź status
pm2 status

# Jeśli status "errored" lub "stopped":
pm2 restart smartsaver-backend

# Sprawdź logi
pm2 logs smartsaver-backend
```

#### B. Backend nie odpowiada na localhost:4000

```bash
# Testuj połączenie
curl http://localhost:4000

# Jeśli timeout lub connection refused:
# - Backend nie działa (sprawdź pm2 status)
# - Port zajęty (sprawdź netstat)
```

#### C. Nginx nie może połączyć się z backendem

```bash
# Sprawdź konfigurację Nginx
sudo nginx -t

# Sprawdź logi Nginx
sudo tail -f /var/log/nginx/smartsaver_error.log

# Zrestartuj Nginx
sudo systemctl restart nginx
```

#### D. Firewall blokuje port 4000

```bash
# Backend działa tylko na localhost, więc to raczej nie jest problem
# Ale sprawdź:
sudo ufw status
```

---

## 5. CORS Errors

### Objaw

W konsoli przeglądarki (F12 → Console):
```
Access to fetch at 'http://123.45.67.89:4000/api/...'
from origin 'http://123.45.67.89' has been blocked by CORS policy
```

### Przyczyna

`APP_ORIGIN` w `.env` nie zgadza się z adresem, z którego korzystasz.

### Rozwiązanie

```bash
nano ~/SmartSaver/backend/.env
```

**Sprawdź i popraw:**

```env
# Dla IP (BEZ https, BEZ portu, BEZ trailing slash):
APP_ORIGIN=http://123.45.67.89

# Dla domeny:
APP_ORIGIN=https://twoja-domena.com

# NIEPOPRAWNE:
APP_ORIGIN=http://123.45.67.89:4000  # ❌ nie dodawaj portu
APP_ORIGIN=http://123.45.67.89/      # ❌ nie dodawaj trailing slash
APP_ORIGIN=123.45.67.89              # ❌ brak http://
```

**Restart backendu:**
```bash
pm2 restart smartsaver-backend
```

**Wyczyść cache przeglądarki:** Ctrl+Shift+R lub Ctrl+F5

---

## 6. Frontend nie ładuje się

### Objaw A: 404 Not Found dla wszystkich plików

**Przyczyna:** Niepoprawna ścieżka do `frontend/dist` w Nginx.

**Rozwiązanie:**
```bash
# Sprawdź czy folder dist istnieje
ls -la ~/SmartSaver/frontend/dist/

# Jeśli nie istnieje, zbuduj frontend
cd ~/SmartSaver/frontend
npm run build

# Sprawdź ścieżkę w Nginx
sudo nano /etc/nginx/sites-available/smartsaver

# Popraw linię "root" (około linia 15-20):
# Dla root user:
root /root/SmartSaver/frontend/dist;

# Dla user deploy:
root /home/deploy/SmartSaver/frontend/dist;

# Testuj i reload
sudo nginx -t
sudo systemctl reload nginx
```

### Objaw B: Biała strona, brak błędów w konsoli

**Rozwiązanie:**
```bash
# Sprawdź logi Nginx
sudo tail -f /var/log/nginx/smartsaver_error.log

# Sprawdź uprawnienia do plików
ls -la ~/SmartSaver/frontend/dist/

# Uprawnienia powinny być czytelne dla nginx (744 lub 755)
chmod -R 755 ~/SmartSaver/frontend/dist/
```

---

## 7. Warning przy buildzie frontendu

### Objaw

Podczas `npm run build` widzisz żółty tekst:
```
(!) Some chunks are larger than 500 kB after minification.
Consider:
- Using dynamic import() to code-split the application
- Use build.rollupOptions.output.manualChunks to improve chunking
✓ built in 15.98s
```

### To NIE jest błąd!

✅ Build zakończył się **sukcesem** - zobacz `✓ built in 15.98s`

⚠️ To tylko **ostrzeżenie o optymalizacji** - aplikacja będzie działać poprawnie

📊 Duże pliki wynikają z:
- Material-UI (duża biblioteka UI)
- Recharts (biblioteka wykresów)
- Framer Motion (animacje)
- Duże obrazy

### Co zrobić?

**Teraz:** Nic - kontynuuj wdrożenie. Aplikacja działa.

**Później (opcjonalnie):**
1. Optymalizuj obrazy (zmniejsz rozmiar, użyj WebP)
2. Implementuj lazy loading dla stron
3. Usuń nieużywane biblioteki

---

## 8. Port 4000 zajęty

### Objaw
```
Error: listen EADDRINUSE: address already in use :::4000
```

### Rozwiązanie

```bash
# Znajdź proces na porcie 4000
sudo netstat -tulpn | grep 4000

# Przykładowy output:
tcp6  0  0 :::4000  :::*  LISTEN  12345/node

# Zabij proces (zamień 12345 na rzeczywisty PID)
kill -9 12345

# Lub użyj PM2
pm2 delete smartsaver-backend
pm2 start ~/SmartSaver/backend/server.js --name smartsaver-backend
pm2 save
```

---

## 9. MySQL connection errors

### Objaw
```
Error: P1001: Can't reach database server at `localhost:3306`
```

### Diagnoza

```bash
# 1. Sprawdź czy MySQL działa
sudo systemctl status mysql

# Jeśli nie działa:
sudo systemctl start mysql
sudo systemctl enable mysql

# 2. Sprawdź czy możesz połączyć się przez CLI
mysql -u smartsaver_user -p smartsaver

# 3. Sprawdź czy baza istnieje
sudo mysql -u root -p -e "SHOW DATABASES;"

# 4. Sprawdź uprawnienia użytkownika
sudo mysql -u root -p
```

```sql
SHOW GRANTS FOR 'smartsaver_user'@'localhost';
-- Powinno pokazać: GRANT ALL PRIVILEGES ON smartsaver.*
```

### Jeśli użytkownik nie istnieje

```sql
CREATE USER 'smartsaver_user'@'localhost' IDENTIFIED BY 'TwojeHaslo';
GRANT ALL PRIVILEGES ON smartsaver.* TO 'smartsaver_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

## Szybka diagnostyka

### Checklist gdy coś nie działa

```bash
# 1. Backend działa?
pm2 status
# Powinien być: status "online"

# 2. Backend odpowiada?
curl http://localhost:4000
# Powinno zwrócić JSON lub HTML

# 3. Nginx działa?
sudo systemctl status nginx
# Powinien być: active (running)

# 4. Nginx konfiguracja OK?
sudo nginx -t
# Powinno być: syntax is ok, test is successful

# 5. MySQL działa?
sudo systemctl status mysql
# Powinien być: active (running)

# 6. .env poprawny?
cat ~/SmartSaver/backend/.env
# Sprawdź wszystkie zmienne

# 7. Logi błędów
pm2 logs smartsaver-backend --err --lines 20
sudo tail -f /var/log/nginx/smartsaver_error.log
```

---

## Potrzebujesz więcej pomocy?

1. **Pełna dokumentacja:** [VPS_SETUP_GUIDE.md](./VPS_SETUP_GUIDE.md)
2. **Szybki start:** [QUICK_START.md](./QUICK_START.md)
3. **Checklist:** [CHECKLIST.md](./CHECKLIST.md)
4. **GitHub Issues:** https://github.com/ProjektWdrozeniowy/SmartSaver/issues

---

## Przydatne komendy

```bash
# Status wszystkiego
pm2 status && sudo systemctl status nginx && sudo systemctl status mysql

# Restart wszystkiego
pm2 restart smartsaver-backend && sudo systemctl restart nginx

# Logi wszystkiego w czasie rzeczywistym
pm2 logs smartsaver-backend &
sudo tail -f /var/log/nginx/smartsaver_error.log

# Test połączenia backend
curl http://localhost:4000

# Test połączenia MySQL
mysql -u smartsaver_user -p smartsaver -e "SHOW TABLES;"
```
