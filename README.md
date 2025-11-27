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

Utwórz plik `backend/.env` z następującą zawartością:
```env
PORT=4000
APP_ORIGIN=http://localhost:5173
DATABASE_URL="mysql://user:password@localhost:3306/smartsaver"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"
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
│   │   │   └── landing/        # Strona landing page
│   │   ├── views/              # Strony aplikacji
│   │   ├── context/            # Context API (Theme)
│   │   ├── assets/             # Zasoby statyczne
│   │   ├── App.jsx             # Główny komponent
│   │   └── main.jsx            # Entry point
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
- **Day.js** - Manipulacja datami
- **React TSParticles** - Efekty wizualne (particles)
- **Fetch API** - Komunikacja z backend

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
```env
# Port na którym działa backend
PORT=4000

# URL aplikacji frontendowej (CORS)
APP_ORIGIN=http://localhost:5173

# Connection string do MySQL
DATABASE_URL="mysql://user:password@localhost:3306/smartsaver"

# Klucz do szyfrowania JWT (zmień w produkcji!)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Ważność tokenu JWT
JWT_EXPIRES_IN=7d

# Opcjonalne - konfiguracja email (Nodemailer)
# EMAIL_HOST=smtp.gmail.com
# EMAIL_PORT=587
# EMAIL_USER=your-email@gmail.com
# EMAIL_PASS=your-app-password
```

### Frontend:
Frontend używa zmiennych z `import.meta.env`:
- `VITE_API_URL` - URL backendu (opcjonalne, domyślnie `http://localhost:4000`)

Utwórz plik `frontend/.env.local` jeśli potrzebujesz nadpisać domyślne wartości:
```env
VITE_API_URL=http://localhost:4000
```

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
- **CORS:** Konfiguracja dla bezpiecznej komunikacji frontend-backend z credentials support
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

## 🌐 Deployment

### Frontend (Vercel/Netlify):
```bash
cd frontend
npm run build
# Deploy folder 'dist'
```

### Backend (Railway/Render/Heroku):
```bash
cd backend
# Ustaw zmienne środowiskowe na platformie
# DATABASE_URL, JWT_SECRET, etc.
npm start
```

### Baza danych:
- Lokalna: MySQL 8
- Produkcja: PlanetScale, Railway MySQL, lub Amazon RDS

## 🧪 Testowanie

```bash
# TODO: Dodać testy jednostkowe (Jest)
# TODO: Dodać testy E2E (Playwright/Cypress)
```

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

**Ostatnia aktualizacja:** Listopad 2025

⭐ Jeśli podoba Ci się projekt, zostaw gwiazdkę na GitHubie!
