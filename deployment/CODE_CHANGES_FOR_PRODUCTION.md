# Zmiany w kodzie wymagane dla produkcji

Ten dokument opisuje **wszystkie zmiany w kodzie źródłowym**, które są konieczne do wdrożenia aplikacji SmartSaver na serwerze produkcyjnym (VPS).

## Spis treści

1. [Frontend - Usunięcie hardcoded localhost](#1-frontend---usunięcie-hardcoded-localhost)
2. [Backend - Poprawka CORS dla produkcji](#2-backend---poprawka-cors-dla-produkcji)
3. [Prisma - Migracje w repozytorium](#3-prisma---migracje-w-repozytorium)
4. [Opcjonalnie - Zmienne środowiskowe Vite](#4-opcjonalnie---zmienne-środowiskowe-vite)

---

## 1. Frontend - Usunięcie hardcoded localhost

### Problem

Wszystkie pliki API w `frontend/src/api/` mają zahardcodowany fallback na `http://localhost:4000`, co powoduje błędy połączenia w produkcji.

### Pliki do zmiany (9 plików)

```
frontend/src/api/auth.js
frontend/src/api/budget.js
frontend/src/api/categories.js
frontend/src/api/dashboard.js
frontend/src/api/expenses.js
frontend/src/api/goals.js
frontend/src/api/notifications.js
frontend/src/api/settings.js
frontend/src/api/analysis.js
```

### Jak zmienić

W **każdym** z tych plików znajdź:

```javascript
const BASE_URL =
  (import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.replace(/\/+$/, '')) ||
  'http://localhost:4000';  // ← USUŃ TO
```

Zamień na:

```javascript
const BASE_URL =
  (import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.replace(/\/+$/, '')) ||
  '';  // ← Pusty string = relative URL
```

### Skrypt do automatycznej zmiany

```bash
cd frontend/src/api

# Zamień we wszystkich plikach
sed -i "s|'http://localhost:4000'|''|g" *.js

# Weryfikacja
grep "localhost:4000" *.js
# Powinno być puste
```

---

### Dodatkowe: ContactPage.jsx

Plik `frontend/src/views/ContactPage.jsx` ma osobny hardcoded URL:

**Znajdź:**
```javascript
const response = await fetch('http://localhost:4000/api/mail/contact', {
```

**Zamień na:**
```javascript
const response = await fetch('/api/mail/contact', {
```

**Skrypt:**
```bash
sed -i "s|'http://localhost:4000/api/mail/contact'|'/api/mail/contact'|g" frontend/src/views/ContactPage.jsx
```

---

### Opcjonalnie: Komentarze w SignInPage i SignUpPage

Te pliki mają komentarze z `localhost:4000` - nie wpływają na działanie, ale można je zmienić:

```bash
sed -i 's|http://localhost:4000/api/login|/api/login|g' frontend/src/views/SignInPage.jsx
sed -i 's|http://localhost:4000/api/register|/api/register|g' frontend/src/views/SignUpPage.jsx
```

---

## 2. Backend - Poprawka CORS dla produkcji

### Problem

Kod CORS w `backend/server.js` **nie używa** zmiennej `APP_ORIGIN` z `.env`, tylko sprawdza hardcoded `localhost` i `127.0.0.1`.

### Plik do zmiany

```
backend/server.js
```

### Lokalizacja

Około **linii 66-77** w pliku `server.js`.

### Obecny kod (NIEPOPRAWNY)

```javascript
// Elastyczna konfiguracja CORS dla development
app.use(cors({
  origin: (origin, callback) => {
    // Pozwól na requesty bez origin (np. Postman, curl)
    if (!origin) return callback(null, true);
    // Pozwól na wszystkie localhost i 127.0.0.1 na dowolnym porcie
    if (origin.match(/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/)) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
```

### Poprawiony kod (DZIAŁA W PRODUKCJI)

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

### Co się zmieniło?

Dodano sprawdzanie `process.env.APP_ORIGIN`:
```javascript
// Pozwól na APP_ORIGIN z .env (PRODUKCJA)
const allowedOrigin = process.env.APP_ORIGIN;
if (allowedOrigin && origin === allowedOrigin) {
  return callback(null, true);
}
```

---

## 3. Prisma - Migracje w repozytorium

### Problem

Folder `backend/prisma/migrations/` jest w `.gitignore`, więc migracje nie są commitowane do repozytorium.

Gdy klonujesz projekt na serwerze, `npx prisma migrate deploy` nie ma czego zastosować.

### Rozwiązanie

Usuń `migrations` z `.gitignore` i commitnij migracje.

### Kroki

**1. Edytuj `.gitignore` w głównym katalogu projektu:**

```bash
nano .gitignore
```

**Znajdź i usuń/zakomentuj linie:**
```gitignore
# Usuń lub zakomentuj:
**/prisma/migrations
prisma/migrations/
backend/prisma/migrations/
```

**2. Commitnij migracje:**

```bash
git add backend/prisma/migrations/
git commit -m "Add Prisma migrations to repository for production deployment"
git push
```

**3. Na serwerze po `git pull`:**

```bash
cd backend
npx prisma generate
npx prisma migrate deploy
```

---

### Alternatywnie: Użyj `db push` na produkcji

Jeśli nie chcesz commitować migracji, na serwerze użyj:

```bash
npx prisma db push
```

To zastosuje schemat bezpośrednio do bazy danych, pomijając system migracji.

**UWAGA:** `db push` nie zachowuje historii zmian schematu.

---

## 4. Opcjonalnie - Zmienne środowiskowe Vite

### Dla development (.env.development)

```env
VITE_API_URL=http://localhost:4000
```

### Dla production (.env.production)

**NIE commituj tego pliku!** Utwórz go tylko na serwerze produkcyjnym.

```bash
# Na serwerze VPS
cd frontend
nano .env.production
```

Zawartość:
```env
# Pusta wartość = użyje relative URLs (/api/)
VITE_API_URL=

# LUB dla konkretnego IP/domeny:
# VITE_API_URL=http://87.106.75.172
# VITE_API_URL=https://twoja-domena.com
```

**Rebuild po zmianie:**
```bash
npm run build
```

---

## Podsumowanie zmian

### Frontend (11 plików)

| Plik | Zmiana | Linia/Sekcja |
|------|--------|--------------|
| `src/api/auth.js` | `'http://localhost:4000'` → `''` | ~line 3 |
| `src/api/budget.js` | `'http://localhost:4000'` → `''` | ~line 3 |
| `src/api/categories.js` | `'http://localhost:4000'` → `''` | ~line 3 |
| `src/api/dashboard.js` | `'http://localhost:4000'` → `''` | ~line 3 |
| `src/api/expenses.js` | `'http://localhost:4000'` → `''` | ~line 3 |
| `src/api/goals.js` | `'http://localhost:4000'` → `''` | ~line 3 |
| `src/api/notifications.js` | `'http://localhost:4000'` → `''` | ~line 3 |
| `src/api/settings.js` | `'http://localhost:4000'` → `''` | ~line 3 |
| `src/api/analysis.js` | `'http://localhost:4000'` → `''` | ~line 3 |
| `src/views/ContactPage.jsx` | `'http://localhost:4000/api/mail/contact'` → `'/api/mail/contact'` | fetch URL |
| `src/views/SignInPage.jsx` | Komentarz (opcjonalnie) | ~line 50-60 |
| `src/views/SignUpPage.jsx` | Komentarz (opcjonalnie) | ~line 50-60 |

### Backend (1 plik)

| Plik | Zmiana | Linia |
|------|--------|-------|
| `server.js` | Dodaj sprawdzanie `process.env.APP_ORIGIN` w CORS | ~line 66-77 |

### Konfiguracja (1 plik)

| Plik | Zmiana |
|------|--------|
| `.gitignore` | Usuń `**/prisma/migrations` |

---

## Skrypt do automatycznego zastosowania wszystkich zmian

Stwórz plik `fix-production.sh` w katalogu głównym projektu:

```bash
#!/bin/bash

echo "Fixing frontend localhost URLs..."
cd frontend/src/api
sed -i "s|'http://localhost:4000'|''|g" *.js
cd ../../..

echo "Fixing ContactPage localhost URL..."
sed -i "s|'http://localhost:4000/api/mail/contact'|'/api/mail/contact'|g" frontend/src/views/ContactPage.jsx

echo "Fixing comments in SignIn/SignUp pages..."
sed -i 's|http://localhost:4000/api/login|/api/login|g' frontend/src/views/SignInPage.jsx
sed -i 's|http://localhost:4000/api/register|/api/register|g' frontend/src/views/SignUpPage.jsx

echo "Done! Now manually fix backend/server.js CORS section (line 66-77)"
echo "See CODE_CHANGES_FOR_PRODUCTION.md for exact code to use"
```

**Użycie:**
```bash
chmod +x fix-production.sh
./fix-production.sh
```

**UWAGA:** CORS w `server.js` musisz zmienić ręcznie!

---

## Weryfikacja zmian

### Po zmianach w frontendzie

```bash
cd frontend

# Sprawdź czy localhost zniknął
grep -r "localhost:4000" src/

# Rebuild
npm run build

# Sprawdź zbudowane pliki
grep -o "localhost:4000" dist/assets/*.js
# Powinno być PUSTE
```

### Po zmianach w backendzie

```bash
# Sprawdź kod CORS
grep -A 10 "APP_ORIGIN" backend/server.js
# Powinno pokazać nowy kod sprawdzający process.env.APP_ORIGIN
```

### Po commitnięciu migracji

```bash
# Sprawdź czy migracje są w repo
git ls-files | grep migrations
# Powinno pokazać pliki migracji
```

---

## Dlaczego te zmiany są konieczne?

### Frontend - localhost:4000

- **Development:** Frontend (port 5173) łączy się z backendem (port 4000) przez `http://localhost:4000`
- **Production:** Frontend i backend są za Nginx, więc muszą używać relative URLs (`/api/`)

### Backend - CORS

- **Development:** Backend akceptuje requesty z `localhost:5173`
- **Production:** Backend musi akceptować requesty z IP serwera lub domeny

### Prisma - Migracje

- **Development:** Migracje lokalne
- **Production:** Bez migracji w repo, baza danych nie ma pełnego schematu

---

## Kontakt

W razie problemów:
- GitHub Issues: https://github.com/ProjektWdrozeniowy/SmartSaver/issues
- Dokumentacja: [VPS_SETUP_GUIDE.md](./VPS_SETUP_GUIDE.md)
- Troubleshooting: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
