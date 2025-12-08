# SmartSaver 💰

Aplikacja do zarządzania finansami osobistymi z zaawansowanymi funkcjami analizy, budżetowania i planowania oszczędności. Monorepo zawierające frontend (React + Vite) i backend (Node.js/Express + Prisma).

## ✨ Funkcjonalności

- 📊 **Pulpit główny** - Przegląd finansów w jednym miejscu
- 💸 **Zarządzanie wydatkami** - Kategoryzacja i śledzenie wydatków
- 💰 **Zarządzanie przychodami** - Rejestrowanie źródeł dochodów
- 🎯 **Cele oszczędnościowe** - Planowanie i monitorowanie celów
- 📈 **Analizy i statystyki** - Wykresy wzrostu oszczędności, porównanie przychodów i wydatków
- 🔔 **Powiadomienia** - Przypomnienia o celach i alerty budżetowe
- 🔄 **Transakcje cykliczne** - Automatyczne powtarzanie wydatków i przychodów
- 🎨 **Tryb ciemny/jasny** - Dostosowanie wyglądu do preferencji
- 📱 **Responsywny design** - Pełna obsługa urządzeń mobilnych
- 🔐 **Bezpieczna autentykacja** - JWT + Argon2 hashing
- 📖 **Interaktywny samouczek** - Przewodnik po aplikacji dla nowych użytkowników (19 kroków)

## 🚀 Szybki start

### Wymagania
- Node.js (v18 lub nowszy)
- npm (v9 lub nowszy)
- MySQL (v8 lub nowszy)

### Instalacja

1. **Sklonuj repozytorium:**
```bash
git clone https://github.com/ProjektWdrozeniowy/SmartSaver.git
cd SmartSaver
```

2. **Zainstaluj wszystkie zależności:**
```bash
npm install
```

To zainstaluje zależności w root oraz w obu workspace'ach (frontend i backend).

3. **Skonfiguruj backend:**

Przykładowa zawartość `backend/.env`:
```env
PORT=4000
APP_ORIGIN=http://localhost:5173
DATABASE_URL="mysql://user:password@localhost:3306/smartsaver"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"
EMAIL_ADDRESS=your-email@gmail.com
EMAIL_APP_PASSWORD=your-app-password
FRONTEND_BASE_URL=http://localhost:5173
NODE_ENV=development
```

**Uwaga:** Zmień `user` i `password` na swoje dane dostępowe do MySQL.

4. **Utwórz bazę danych:**
```bash
mysql -u root -p
CREATE DATABASE smartsaver;
EXIT;
```

5. **Uruchom migracje bazy danych:**
```bash
cd backend
npm run migrate
```

**Jeśli migracje nie wygenerują automatycznie Prisma Client, uruchom:**
```bash
npx prisma generate
```

### Uruchomienie aplikacji

#### Uruchom frontend i backend jedną komendą:
```bash
npm run dev
```

To uruchomi:
- **Backend** na `http://localhost:4000`
- **Frontend** na `http://localhost:5173` (lub innym dostępnym porcie)

#### Uruchom osobno:

**Backend:**
```bash
npm run dev:backend
```

**Frontend:**
```bash
npm run dev:frontend
```

## 📦 Struktura projektu

```
SmartSaver/
├── frontend/                    # Aplikacja React + Vite
│   ├── src/
│   │   ├── api/                # Funkcje komunikacji z API
│   │   │   ├── auth.js         # Autentykacja (login, register)
│   │   │   ├── dashboard.js    # Dane dla pulpitu
│   │   │   ├── expenses.js     # Zarządzanie wydatkami
│   │   │   ├── budget.js       # Zarządzanie budżetem i przychodami
│   │   │   ├── goals.js        # Cele oszczędnościowe
│   │   │   ├── categories.js   # Kategorie wydatków
│   │   │   ├── analysis.js     # Analizy i statystyki
│   │   │   ├── notifications.js # Powiadomienia
│   │   │   └── settings.js     # Ustawienia użytkownika
│   │   ├── components/
│   │   │   ├── common/         # Komponenty wspólne
│   │   │   ├── dashboard/      # Sekcje dashboardu
│   │   │   │   └── Tutorial.jsx # Interaktywny samouczek (React Joyride)
│   │   │   └── landing/        # Strona landing page
│   │   ├── views/              # Strony aplikacji
│   │   ├── context/            # Context API (Theme)
│   │   ├── assets/             # Zasoby statyczne
│   │   ├── App.jsx             # Główny komponent
│   │   └── main.jsx            # Entry point
│   ├── e2e/                    # Testy E2E (Playwright)
│   │   ├── landing.spec.js     # Testy strony landing page
│   │   └── navigation.spec.js  # Testy nawigacji
│   ├── playwright.config.js    # Konfiguracja Playwright
│   └── package.json
├── backend/                     # Serwer Express + Prisma
│   ├── middleware/
│   │   └── auth.js             # Middleware autoryzacji JWT
│   ├── prisma/
│   │   ├── schema.prisma       # Schema bazy danych
│   │   └── migrations/         # Migracje
│   ├── routes/                 # Endpointy API
│   │   ├── user.js             # Profile i ustawienia
│   │   ├── dashboard.js        # Dashboard stats
│   │   ├── expenses.js         # Wydatki
│   │   ├── budget.js           # Przychody i podsumowanie
│   │   ├── goals.js            # Cele oszczędnościowe
│   │   ├── categories.js       # Kategorie
│   │   ├── analysis.js         # Analizy
│   │   └── notifications.js    # Powiadomienia
│   ├── src/                    # Dodatkowe moduły
│   │   ├── controllers/        # Kontrolery (mail)
│   │   ├── routes/             # Dodatkowe routy (mail)
│   │   ├── services/           # Serwisy (mail)
│   │   └── templates/          # Szablony (handlebars)
│   ├── server.js               # Główny plik serwera
│   └── package.json
├── package.json                 # Główny package.json (monorepo)
├── README.md                    # Ten plik
└── API_DOCUMENTATION.md         # Dokumentacja API
```

## 🛠️ Dostępne komendy

### Główne komendy (z root):

```bash
# Uruchom frontend i backend razem
npm run dev

# Uruchom tylko backend
npm run dev:backend

# Uruchom tylko frontend
npm run dev:frontend

# Zbuduj frontend do produkcji
npm run build

# Uruchom migracje Prisma
npm run prisma:migrate

# Wygeneruj Prisma Client
npx prisma generate --workspace=backend

# Otwórz Prisma Studio (GUI do bazy danych)
npm run prisma:studio

# Zainstaluj wszystkie zależności
npm install

# Uruchom testy E2E
npm run test:e2e --workspace=frontend

# Uruchom testy jednostkowe
npm run test --workspace=frontend
```

### Komendy dla workspace'ów:

```bash
# Uruchom komendę w konkretnym workspace
npm run <script> --workspace=frontend
npm run <script> --workspace=backend

# Przykłady:
npm run build --workspace=frontend
npm run migrate --workspace=backend
```

## 🔧 Technologie

### Frontend:
- **React 19** - Biblioteka UI
- **Vite** - Build tool i dev server
- **Material-UI (MUI) 7** - Komponenty UI
- **Recharts 3** - Wykresy i wizualizacje
- **React Router 7** - Routing
- **Framer Motion 12** - Animacje
- **React Joyride 2** - Interaktywny samouczek i przewodnik po aplikacji
- **Day.js** - Manipulacja datami
- **React TSParticles** - Efekty wizualne (particles)
- **Fetch API** - Komunikacja z backend
- **Playwright** - Testy end-to-end (E2E)
- **Vitest** - Testy jednostkowe

### Backend:
- **Node.js** - Runtime środowisko
- **Express 5** - Framework webowy
- **Prisma ORM** - Narzędzie do zarządzania bazą danych
- **MySQL 8** - Baza danych relacyjna
- **JWT (jsonwebtoken)** - Autentykacja i autoryzacja
- **Argon2** - Haszowanie haseł
- **Zod** - Walidacja schematów
- **Nodemailer** - Wysyłanie emaili
- **Handlebars** - Szablony emaili
- **Helmet** - Bezpieczeństwo HTTP headers
- **Express Rate Limit** - Ochrona przed nadmiernym ruchem

## 📝 Zmienne środowiskowe

### Backend (`backend/.env`):

**Development (lokalnie):**
```env
# Port na którym działa backend
PORT=4000

# URL aplikacji frontendowej (CORS) - localhost dla developmentu
APP_ORIGIN=http://localhost:5173

# Connection string do MySQL
DATABASE_URL="mysql://user:password@localhost:3306/smartsaver"

# Klucz do szyfrowania JWT (zmień w produkcji!)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Ważność tokenu JWT
JWT_EXPIRES_IN="7d"

# Email Configuration (Gmail SMTP)
EMAIL_ADDRESS=your-email@gmail.com
EMAIL_APP_PASSWORD=your-app-password

# URL frontendu (używany w linkach resetowania hasła)
FRONTEND_BASE_URL=http://localhost:5173

# Środowisko
NODE_ENV=development
```

**Production (na serwerze):**
```env
PORT=4000

# WAŻNE: Użyj prawdziwej domeny/IP z SSL
APP_ORIGIN=https://your-domain.com

# MySQL na produkcji - zakoduj znaki specjalne w haśle!
DATABASE_URL="mysql://user:encoded_password@localhost:3306/smartsaver"

# ZMIEŃ na silny losowy klucz w produkcji!
JWT_SECRET="super-secure-random-key-generated-for-production"
JWT_EXPIRES_IN="7d"

# Email Configuration
EMAIL_ADDRESS=your-email@gmail.com
EMAIL_APP_PASSWORD=your-app-password

# URL frontendu na produkcji
FRONTEND_BASE_URL=https://your-domain.com

NODE_ENV=production
```

**Uwagi:**
- Plik `.env` **NIE jest commitowany** do repozytorium (znajduje się w `.gitignore`)
- Każde środowisko (dev/prod) ma swój własny plik `.env`
- Backend akceptuje zarówno `www.domain.com` jak i `domain.com` dzięki elastycznej konfiguracji CORS
- Jeśli hasło do MySQL zawiera znaki specjalne (`@`, `:`, `/`, etc.), zakoduj je URL-encode
- Użyj `node -e "console.log(encodeURIComponent('TwojeHasło'))"` do zakodowania hasła

### Frontend:

Frontend używa **Vite proxy** w development i bezpośrednich wywołań `/api/*` w production.

**Development (`vite.config.js`):**
```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:4000',
      changeOrigin: true,
    }
  }
}
```

**Production:**
- Nginx przekierowuje `/api/*` na backend (`http://localhost:4000`)
- Frontend nie potrzebuje znać URL backendu

## 📚 Dokumentacja API

Pełna dokumentacja API znajduje się w pliku [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).

### Główne endpointy:

- **Autentykacja:** `/api/register`, `/api/login`, `/api/forgot-password`, `/api/reset-password`
- **Dashboard:** `/api/dashboard/stats`, `/api/dashboard/transactions`, `/api/dashboard/expenses-by-category`
- **Wydatki:** `/api/expenses` (GET, POST, PUT, DELETE)
- **Kategorie:** `/api/categories` (GET, POST, DELETE)
- **Budżet:** `/api/budget/income`, `/api/budget/summary`
- **Cele:** `/api/goals`, `/api/goals/:id/contribute`
- **Analizy:** `/api/analysis/statistics`, `/api/analysis/savings-growth`, `/api/analysis/income-vs-expenses`
- **Powiadomienia:** `/api/notifications` (GET, PUT, DELETE)
- **Użytkownik:** `/api/user/profile`, `/api/user/change-password`, `/api/user/export`, `/api/user/delete`

## 🎯 Główne sekcje aplikacji

### 1. Pulpit (Dashboard)
- Karty z kluczowymi statystykami (saldo, przychody, wydatki, cele)
- Ostatnie transakcje
- Wykres wydatków według kategorii

### 2. Wydatki
- Lista wszystkich wydatków z filtrowaniem po miesiącu
- Dodawanie, edycja i usuwanie wydatków
- Kategorie kolorowe z emoji
- Obsługa transakcji cyklicznych (daily, weekly, monthly, yearly)

### 3. Budżet
- Zarządzanie przychodami
- Podsumowanie budżetu (całkowite przychody, wydatki, oszczędności)
- Obsługa cyklicznych przychodów

### 4. Cele oszczędnościowe
- Tworzenie celów z kwotą docelową i terminem
- Wpłaty do celów
- Wizualizacja postępu (progress bar)
- Przypomnienia o celach (weekly, monthly)

### 5. Analizy i statystyki
- Statystyki okresu (średnie wydatki, przychody, stopa oszczędności)
- Wykres wzrostu oszczędności
- Porównanie przychodów vs wydatki
- Wydatki według kategorii
- Wydatki według dni tygodnia

### 6. Powiadomienia
- System powiadomień (przypomnienia o celach, alerty budżetowe)
- Oznaczanie jako przeczytane
- Usuwanie powiadomień

### 7. Ustawienia
- Informacje o profilu (edycja nazwy i email)
- Zmiana hasła
- Ustawienia powiadomień
- Wybór motywu (ciemny/jasny)
- Eksport danych do JSON
- Usuwanie konta

### 8. Interaktywny samouczek
- **19-krokowy przewodnik** po wszystkich funkcjach aplikacji
- **Automatyczne przewijanie** do odpowiednich sekcji podczas samouczka
- **Wsparcie dla trybów ciemnego i jasnego** - Dynamiczne dostosowanie kolorów tooltipów
- **Responsywność** - Samouczek wyłączony na urządzeniach mobilnych (ekrany < 900px)
- **Biblioteka:** React Joyride - zaawansowane tooltips z nawigacją
- **Uruchomienie:** Dostępne z menu użytkownika w prawym górnym rogu (ikona pomocy)
- **Kroki samouczka obejmują:**
  - Witanie i przegląd aplikacji
  - Nawigacja po sekcjach (Wydatki, Budżet, Cele, Analizy)
  - Dodawanie wydatków i przychodów
  - Zarządzanie celami oszczędnościami
  - Przeglądanie statystyk i analiz
  - Zarządzanie kategoriami
  - Powiadomienia i alerty
  - Ustawienia konta

## 🔐 Bezpieczeństwo

### Zaimplementowane zabezpieczenia:

- **Haszowanie haseł:** Argon2 (bezpieczniejsze niż bcrypt) z indywidualnym salt dla każdego użytkownika
- **Autentykacja:** JWT tokens z ważnością 7 dni, przechowywane w localStorage
- **Silna walidacja haseł:**
  - Minimum 12 znaków
  - Wymagana mała litera (a-z)
  - Wymagana wielka litera (A-Z)
  - Wymagana cyfra (0-9)
  - Wymagany znak specjalny (!@#$%^&*...)
  - Walidacja zarówno na frontend (UI z wizualnymi wskaźnikami) jak i backend (Zod schema)
- **Rate limiting:**
  - Ochrona przed atakami brute-force na endpointy autoryzacji
  - 20 prób logowania/rejestracji na 15 minut na IP
  - `skipSuccessfulRequests: true` - liczymy tylko nieudane próby
- **Helmet:** Dodatkowe zabezpieczenia HTTP headers (Content-Security-Policy, X-Frame-Options, etc.)
- **CORS:** Elastyczna konfiguracja dla bezpiecznej komunikacji frontend-backend:
  - Akceptuje `APP_ORIGIN` z pliku `.env` (produkcja)
  - Akceptuje `localhost` na dowolnym porcie (development)
  - Automatyczne wsparcie dla `www` i bez `www` (np. `www.domain.com` i `domain.com`)
  - Credentials support dla ciasteczek i autoryzacji
- **Walidacja wejścia:** Zod schemas dla wszystkich input'ów z dokładnymi komunikatami błędów
- **SQL Injection:** Ochrona poprzez Prisma ORM (prepared statements)
- **Ochrona przed information disclosure:**
  - Ogólne komunikaty błędów przy logowaniu ("Nieprawidłowy email lub hasło")
  - Brak ujawniania czy email istnieje w systemie
  - Brak logowania wrażliwych danych (hasła, tokeny)
- **Dostępność (Accessibility):** Poprawna obsługa aria-hidden w modalach dla screen readers

### Potencjalne przyszłe ulepszenia:

- [ ] Migracja z localStorage do httpOnly cookies dla tokenów JWT (lepsza ochrona przed XSS)
- [ ] Content Security Policy (CSP) headers na produkcji

## 🔄 Development vs Production

### Development (lokalnie):
```bash
# Frontend: http://localhost:5173
npm run dev

# Backend: http://localhost:4000
# - CORS akceptuje localhost
# - Vite proxy przekierowuje /api/* na backend
# - Hot reload dla szybkiego developmentu
```

### Production (na serwerze):
```bash
# Frontend: dist/ (statyczne pliki)
# Backend: PM2 process manager

# - Nginx jako reverse proxy
# - CORS akceptuje domenę z APP_ORIGIN
# - Optimized production build
# - Process monitoring z PM2
# - SSL/TLS (HTTPS) z Let's Encrypt
```

**Kluczowe różnice:**
- **Development:** Vite proxy, localhost CORS, hot reload
- **Production:** Nginx proxy, domain CORS, optimized builds, SSL, PM2

## 🌐 Deployment

### Deployment na VPS (Rekomendowane)

SmartSaver jest zoptymalizowane do wdrożenia na własnym serwerze VPS z Nginx, PM2 i MySQL.

**Kompletna dokumentacja deployment:**
- 📖 [VPS Setup Guide](./deployment/VPS_SETUP_GUIDE.md) - Pełny przewodnik wdrożenia
- ✅ [Deployment Checklist](./deployment/CHECKLIST.md) - Lista kontrolna
- 🔧 [Troubleshooting Guide](./deployment/TROUBLESHOOTING.md) - Rozwiązywanie problemów
- 📝 [Code Changes for Production](./deployment/CODE_CHANGES_FOR_PRODUCTION.md) - Zmiany w kodzie

**Szybki start deployment:**

1. **Przygotuj serwer VPS** (Ubuntu 22.04 LTS):
```bash
# Zaloguj się na serwer
ssh root@YOUR_IP

# Uruchom automatyczny skrypt instalacji
bash <(curl -s https://raw.githubusercontent.com/ProjektWdrozeniowy/SmartSaver/main/deployment/server-setup.sh)
```

2. **Konfiguracja Nginx:**
```bash
# Skopiuj odpowiednią konfigurację
sudo cp ~/SmartSaver/deployment/nginx-no-ssl.conf /etc/nginx/sites-available/smartsaver

# Dla SSL/domeny użyj:
# sudo cp ~/SmartSaver/deployment/nginx.conf /etc/nginx/sites-available/smartsaver

sudo ln -s /etc/nginx/sites-available/smartsaver /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

3. **Skonfiguruj zmienne środowiskowe:**
```bash
nano /var/www/SmartSaver/backend/.env
# Ustaw APP_ORIGIN, DATABASE_URL, FRONTEND_BASE_URL, etc.
```

4. **Uruchom backend z PM2:**
```bash
pm2 start /var/www/SmartSaver/deployment/ecosystem.config.js
pm2 save
pm2 startup
```

**Stack technologiczny na produkcji:**
- **Nginx** - Reverse proxy i serwer statyczny
- **PM2** - Process manager dla Node.js
- **MySQL 8** - Baza danych
- **Certbot** - Darmowe certyfikaty SSL (Let's Encrypt)

### Alternatywne platformy

#### Frontend (Vercel/Netlify):
```bash
cd frontend
npm run build
# Deploy folder 'dist'
```

**Uwaga:** Musisz skonfigurować rewrites dla SPA routing:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

#### Backend (Railway/Render/Heroku):
```bash
cd backend
# Ustaw zmienne środowiskowe na platformie
# DATABASE_URL, JWT_SECRET, APP_ORIGIN, FRONTEND_BASE_URL
npm start
```

### Baza danych:
- **Lokalna:** MySQL 8
- **Produkcja VPS:** MySQL 8 na tym samym serwerze
- **Cloud:** PlanetScale, Railway MySQL, Amazon RDS, lub DigitalOcean Managed MySQL

## 🧪 Testowanie

Projekt wykorzystuje dwa typy testów: testy jednostkowe (Vitest) i testy end-to-end (Playwright).

### Testy E2E (Playwright)

Testy end-to-end weryfikują funkcjonalność aplikacji z perspektywy użytkownika.

**Dostępne testy:**
- `frontend/e2e/landing.spec.js` - Testy strony landing page
  - Ładowanie strony głównej
  - Widoczność elementów nawigacji
  - Funkcjonalność stopki i linków
  - Nawigacja do podstron (Regulamin, Kontakt)
  - Branding aplikacji

- `frontend/e2e/navigation.spec.js` - Testy nawigacji
  - Nawigacja między stronami przez linki w stopce
  - Obsługa przycisku "Wstecz" przeglądarki
  - Spójność layoutu na wszystkich stronach
  - Wyświetlanie aktualnego roku w copyright

**Uruchamianie testów E2E:**

```bash
# Uruchom wszystkie testy E2E (w trybie headless)
cd frontend
npm run test:e2e

# Uruchom testy E2E w trybie UI (interaktywny)
npm run test:e2e:ui

# Zobacz raport z ostatnich testów
npm run test:e2e:report
```

**Konfiguracja:**
- Plik konfiguracyjny: `frontend/playwright.config.js`
- Testy uruchamiane na przeglądarce Chromium
- Automatyczne uruchamianie dev servera przed testami
- Bazowy URL: `http://localhost:5173`
- Raport HTML generowany automatycznie

### Testy jednostkowe (Vitest)

Framework Vitest jest skonfigurowany do testów jednostkowych komponentów React.

**Uruchamianie testów jednostkowych:**

```bash
cd frontend

# Uruchom testy w trybie watch
npm run test

# Uruchom testy z interfejsem UI
npm run test:ui

# Uruchom testy jednokrotnie (CI mode)
npm run test:run

# Uruchom testy z coverage
npm run test:coverage
```

**Dodatkowe narzędzia:**
- `@testing-library/react` - Testy komponentów React
- `@testing-library/jest-dom` - Matchery dla Vitest
- `@testing-library/user-event` - Symulacja interakcji użytkownika
- `jsdom` - Środowisko DOM dla testów

## 📄 Licencja

ISC

## 👥 Autorzy

Szymon Głuszkowski, Filip Kubiak, Igor Gudaniec, Marcin Kruszyński

## 🤝 Contributing

1. Fork repozytorium
2. Utwórz branch dla swojej funkcjonalności (`git checkout -b feature/AmazingFeature`)
3. Commit zmiany (`git commit -m 'Add some AmazingFeature'`)
4. Push do branch (`git push origin feature/AmazingFeature`)
5. Otwórz Pull Request

## 🐛 Znane problemy

Zgłaszaj problemy na [GitHub Issues](https://github.com/ProjektWdrozeniowy/SmartSaver/issues)

## 📞 Kontakt

- GitHub: [@ProjektWdrozeniowy](https://github.com/ProjektWdrozeniowy)
- Email: [kontakt przez GitHub Issues]

---

**Ostatnia aktualizacja:** Grudzień 2025

⭐ Jeśli podoba Ci się projekt, zostaw gwiazdkę na GitHubie!
