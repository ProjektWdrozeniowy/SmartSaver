# SmartSaver 💰

Aplikacja do zarządzania finansami osobistymi - monorepo zawierające frontend (React) i backend (Node.js/Express).

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
DATABASE_URL="mysql://root@localhost:3306/smartsaver"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production-2024"
JWT_EXPIRES_IN="7d"
```

4. **Uruchom migracje bazy danych:**
```bash
npm run prisma:migrate
```

### Uruchomienie aplikacji

#### Uruchom frontend i backend jedną komendą:
```bash
npm run dev
```

To uruchomi:
- **Backend** na `http://localhost:4000`
- **Frontend** na `http://localhost:5174` (lub innym dostępnym porcie)

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
├── frontend/              # Aplikacja React + Vite
│   ├── src/
│   │   ├── api/          # Funkcje komunikacji z API
│   │   ├── components/   # Komponenty React
│   │   ├── views/        # Strony aplikacji
│   │   └── App.jsx       # Główny komponent
│   └── package.json
├── backend/              # Serwer Express + Prisma
│   ├── middleware/       # Middleware (auth, etc.)
│   ├── prisma/          # Schema i migracje bazy danych
│   ├── server.js        # Główny plik serwera
│   └── package.json
├── package.json          # Główny package.json (monorepo)
└── README.md
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
- React 19
- Vite
- Material-UI (MUI)
- React Router
- Framer Motion
- Fetch API

### Backend:
- Node.js
- Express 5
- Prisma ORM
- MySQL
- JWT (jsonwebtoken)
- Argon2
- Zod

## 📝 Zmienne środowiskowe

### Backend (`backend/.env`):
```env
PORT=4000                    # Port backendu
DATABASE_URL=                # Connection string do MySQL
JWT_SECRET=                  # Klucz do szyfrowania JWT
JWT_EXPIRES_IN=7d           # Ważność tokenu
```

### Frontend:
Frontend używa zmiennych z `import.meta.env`:
- `VITE_API_URL` - URL backendu (opcjonalne, domyślnie localhost:4000)


## 👥 Autorzy

Zespół ProjektWdrozeniowy

