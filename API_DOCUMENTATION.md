# SmartSaver - Dokumentacja API dla Backend

## 📋 Spis treści
1. [Ogólne informacje](#ogólne-informacje)
2. [Autoryzacja](#autoryzacja)
3. [Dashboard Endpoints](#dashboard-endpoints)
4. [Expenses Endpoints](#expenses-endpoints)
5. [Categories Endpoints](#categories-endpoints)
6. [Goals Endpoints](#goals-endpoints)
7. [Analysis Endpoints](#analysis-endpoints)
8. [Struktury danych](#struktury-danych)

---

## Ogólne informacje

### Base URL
```
http://localhost:4000/api
```

### Content-Type
Wszystkie requesty i responsy używają:
```
Content-Type: application/json
```

### Kody odpowiedzi
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

---

## Autoryzacja

Wszystkie endpointy (poza `/api/login` i `/api/register`) wymagają tokenu JWT w headerze:

```http
Authorization: Bearer <token>
```

Token jest zwracany po zalogowaniu/rejestracji i przechowywany w `localStorage` po stronie frontendu.

---

## Dashboard Endpoints

### 1. GET /api/dashboard/stats
Pobiera statystyki dashboardu użytkownika.

**Request Headers:**
```http
Authorization: Bearer <token>
```

**Response Body:**
```json
{
  "stats": [
    {
      "title": "Aktualne saldo",
      "value": "12,450 zł",
      "change": "+2.5%",
      "positive": true,
      "iconKey": "balance",
      "color": "#00f0ff",
      "navigateTo": "budzet"
    },
    {
      "title": "Przychody (mies)",
      "value": "5,730 zł",
      "change": "+12%",
      "positive": true,
      "iconKey": "income",
      "color": "#a8e6cf",
      "navigateTo": "budzet"
    },
    {
      "title": "Wydatki (miesiąc)",
      "value": "3,280 zł",
      "change": "-15%",
      "positive": true,
      "iconKey": "expenses",
      "color": "#ff6b9d",
      "navigateTo": "wydatki"
    },
    {
      "title": "Twoje oszczędności",
      "value": "8,500 zł",
      "change": "+8%",
      "positive": true,
      "iconKey": "savings",
      "color": "#ffd93d",
      "navigateTo": "budzet"
    },
    {
      "title": "Twój cel (Wakacje)",
      "value": "68%",
      "change": "+5%",
      "positive": true,
      "iconKey": "goal",
      "color": "#c77dff",
      "navigateTo": "cele"
    }
  ]
}
```

**Uwagi:**
- `iconKey` musi być jednym z: `balance`, `income`, `expenses`, `savings`, `goal`
- Frontend mapuje te klucze na odpowiednie ikony Material-UI

---

### 2. GET /api/dashboard/transactions
Pobiera ostatnie transakcje użytkownika.

**Query Parameters:**
- `limit` (optional) - Liczba transakcji do zwrócenia (default: 5)

**Request Headers:**
```http
Authorization: Bearer <token>
```

**Request Example:**
```http
GET /api/dashboard/transactions?limit=5
```

**Response Body:**
```json
{
  "transactions": [
    {
      "id": 1,
      "title": "Zakupy spożywcze",
      "category": "Jedzenie",
      "amount": -125.50,
      "date": "2025-10-23",
      "icon": "🛒"
    },
    {
      "id": 2,
      "title": "Pensja",
      "category": "Przychód",
      "amount": 5730.00,
      "date": "2025-10-20",
      "icon": "💰"
    }
  ]
}
```

**Uwagi:**
- `amount` ujemne = wydatek, dodatnie = przychód
- `date` w formacie YYYY-MM-DD
- `icon` to emoji (string)

---

### 3. GET /api/dashboard/expenses-by-category
Pobiera wydatki według kategorii dla wykresu kołowego.

**Query Parameters:**
- `month` (optional) - Miesiąc w formacie YYYY-MM (domyślnie bieżący miesiąc)

**Request Headers:**
```http
Authorization: Bearer <token>
```

**Request Example:**
```http
GET /api/dashboard/expenses-by-category?month=2025-10
```

**Response Body:**
```json
{
  "categories": [
    { "name": "Jedzenie", "value": 850, "color": "#ff6b9d" },
    { "name": "Transport", "value": 420, "color": "#00f0ff" },
    { "name": "Rozrywka", "value": 320, "color": "#a8e6cf" },
    { "name": "Rachunki", "value": 980, "color": "#ffd93d" },
    { "name": "Zakupy", "value": 710, "color": "#c77dff" }
  ]
}
```

**Uwagi:**
- `value` to suma wydatków w danej kategorii
- `color` powinien pochodzić z kategorii użytkownika

---

## Expenses Endpoints

### 1. GET /api/expenses
Pobiera listę wydatków użytkownika.

**Query Parameters:**
- `month` (optional) - Filtruj po miesiącu w formacie YYYY-MM

**Request Headers:**
```http
Authorization: Bearer <token>
```

**Request Example:**
```http
GET /api/expenses?month=2025-10
```

**Response Body:**
```json
{
  "expenses": [
    {
      "id": 1,
      "name": "Zakupy spożywcze",
      "categoryId": 1,
      "date": "2025-10-23",
      "description": "Zakupy w Biedronce",
      "amount": 125.50
    },
    {
      "id": 2,
      "name": "Netflix",
      "categoryId": 3,
      "date": "2025-10-19",
      "description": "Subskrypcja miesięczna",
      "amount": 49.99
    }
  ]
}
```

---

### 2. POST /api/expenses
Tworzy nowy wydatek.

**Request Headers:**
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Zakupy spożywcze",
  "categoryId": 1,
  "date": "2025-10-23",
  "amount": 125.50,
  "description": "Zakupy w Biedronce"
}
```

**Validation:**
- `name` - wymagane, string
- `categoryId` - wymagane, number (musi istnieć)
- `date` - wymagane, string (format YYYY-MM-DD)
- `amount` - wymagane, number (> 0)
- `description` - opcjonalne, string

**Response Body (201 Created):**
```json
{
  "message": "Wydatek został dodany",
  "expense": {
    "id": 3,
    "name": "Zakupy spożywcze",
    "categoryId": 1,
    "date": "2025-10-23",
    "amount": 125.50,
    "description": "Zakupy w Biedronce",
    "userId": 1,
    "createdAt": "2025-10-23T10:30:00.000Z"
  }
}
```

---

### 3. PUT /api/expenses/:id
Aktualizuje istniejący wydatek.

**Request Headers:**
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Zakupy spożywcze - zaktualizowane",
  "categoryId": 1,
  "date": "2025-10-23",
  "amount": 150.00,
  "description": "Zakupy w Biedronce i Lidlu"
}
```

**Response Body (200 OK):**
```json
{
  "message": "Wydatek został zaktualizowany",
  "expense": {
    "id": 1,
    "name": "Zakupy spożywcze - zaktualizowane",
    "categoryId": 1,
    "date": "2025-10-23",
    "amount": 150.00,
    "description": "Zakupy w Biedronce i Lidlu",
    "userId": 1,
    "updatedAt": "2025-10-24T14:30:00.000Z"
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "message": "Wydatek nie został znaleziony"
}
```

---

### 4. DELETE /api/expenses/:id
Usuwa wydatek.

**Request Headers:**
```http
Authorization: Bearer <token>
```

**Response Body (200 OK):**
```json
{
  "message": "Wydatek został usunięty"
}
```

**Error Response (404 Not Found):**
```json
{
  "message": "Wydatek nie został znaleziony"
}
```

---

## Categories Endpoints

### 1. GET /api/categories
Pobiera listę wszystkich kategorii użytkownika.

**Request Headers:**
```http
Authorization: Bearer <token>
```

**Response Body:**
```json
{
  "categories": [
    { "id": 1, "name": "Jedzenie", "color": "#ff6b9d", "icon": "🍕" },
    { "id": 2, "name": "Transport", "color": "#00f0ff", "icon": "🚗" },
    { "id": 3, "name": "Rozrywka", "color": "#a8e6cf", "icon": "🎬" },
    { "id": 4, "name": "Rachunki", "color": "#ffd93d", "icon": "⚡" },
    { "id": 5, "name": "Zakupy", "color": "#c77dff", "icon": "🛒" }
  ]
}
```

---

### 2. POST /api/categories
Tworzy nową kategorię.

**Request Headers:**
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Sport",
  "color": "#84dcc6",
  "icon": "🏋️"
}
```

**Validation:**
- `name` - wymagane, string (unikalne dla użytkownika)
- `color` - wymagane, string (format hex #RRGGBB)
- `icon` - wymagane, string (emoji)

**Response Body (201 Created):**
```json
{
  "message": "Kategoria została dodana",
  "category": {
    "id": 6,
    "name": "Sport",
    "color": "#84dcc6",
    "icon": "🏋️",
    "userId": 1,
    "createdAt": "2025-10-24T10:00:00.000Z"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "message": "Kategoria o tej nazwie już istnieje"
}
```

---

### 3. DELETE /api/categories/:id
Usuwa kategorię (opcjonalne - można to zaimplementować później).

**Request Headers:**
```http
Authorization: Bearer <token>
```

**Response Body (200 OK):**
```json
{
  "message": "Kategoria została usunięta"
}
```

**Uwagi:**
- Przed usunięciem kategorii, należy sprawdzić czy nie ma wydatków z tą kategorią
- Można albo zabronić usuwania, albo przenieść wydatki do kategorii domyślnej

---

## Goals Endpoints

### 1. GET /api/goals
Pobiera listę wszystkich celów oszczędnościowych użytkownika.

**Request Headers:**
```http
Authorization: Bearer <token>
```

**Response Body:**
```json
{
  "goals": [
    {
      "id": 1,
      "name": "Wakacje 2026",
      "targetAmount": 5000.00,
      "currentAmount": 3500.00,
      "dueDate": "2026-06-30",
      "description": "Wyjazd do Grecji",
      "userId": 1,
      "createdAt": "2025-10-01T10:00:00.000Z",
      "updatedAt": "2025-10-23T14:30:00.000Z"
    },
    {
      "id": 2,
      "name": "Nowy laptop",
      "targetAmount": 4000.00,
      "currentAmount": 2100.00,
      "dueDate": "2025-12-31",
      "description": "MacBook Pro",
      "userId": 1,
      "createdAt": "2025-09-15T12:00:00.000Z",
      "updatedAt": "2025-10-20T10:15:00.000Z"
    }
  ]
}
```

**Uwagi:**
- Lista powinna zawierać wszystkie cele użytkownika (aktywne i ukończone)
- `dueDate` w formacie YYYY-MM-DD
- Kwoty jako liczby zmiennoprzecinkowe

---

### 2. POST /api/goals
Tworzy nowy cel oszczędnościowy.

**Request Headers:**
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Fundusz awaryjny",
  "targetAmount": 10000.00,
  "currentAmount": 0.00,
  "dueDate": "2026-12-31",
  "description": "6-miesięczny fundusz awaryjny"
}
```

**Validation:**
- `name` - wymagane, string (max 100 znaków)
- `targetAmount` - wymagane, number (> 0)
- `currentAmount` - wymagane, number (>= 0, domyślnie 0)
- `dueDate` - wymagane, string (format YYYY-MM-DD, musi być w przyszłości)
- `description` - opcjonalne, string (max 500 znaków)

**Response Body (201 Created):**
```json
{
  "message": "Cel został dodany",
  "goal": {
    "id": 3,
    "name": "Fundusz awaryjny",
    "targetAmount": 10000.00,
    "currentAmount": 0.00,
    "dueDate": "2026-12-31",
    "description": "6-miesięczny fundusz awaryjny",
    "userId": 1,
    "createdAt": "2025-10-24T15:00:00.000Z",
    "updatedAt": "2025-10-24T15:00:00.000Z"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "message": "Nieprawidłowe dane: targetAmount musi być większe od 0"
}
```

---

### 3. PUT /api/goals/:id
Aktualizuje istniejący cel oszczędnościowy.

**Request Headers:**
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Wakacje 2026 - zaktualizowane",
  "targetAmount": 6000.00,
  "currentAmount": 3500.00,
  "dueDate": "2026-07-15",
  "description": "Wyjazd do Grecji - 2 tygodnie"
}
```

**Validation:**
- Wszystkie pola są wymagane (jak w POST)
- `currentAmount` nie może być większe niż `targetAmount`
- Użytkownik musi być właścicielem celu

**Response Body (200 OK):**
```json
{
  "message": "Cel został zaktualizowany",
  "goal": {
    "id": 1,
    "name": "Wakacje 2026 - zaktualizowane",
    "targetAmount": 6000.00,
    "currentAmount": 3500.00,
    "dueDate": "2026-07-15",
    "description": "Wyjazd do Grecji - 2 tygodnie",
    "userId": 1,
    "updatedAt": "2025-10-24T16:00:00.000Z"
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "message": "Cel nie został znaleziony"
}
```

**Error Response (403 Forbidden):**
```json
{
  "message": "Brak uprawnień do edycji tego celu"
}
```

---

### 4. DELETE /api/goals/:id
Usuwa cel oszczędnościowy.

**Request Headers:**
```http
Authorization: Bearer <token>
```

**Response Body (200 OK):**
```json
{
  "message": "Cel został usunięty"
}
```

**Error Response (404 Not Found):**
```json
{
  "message": "Cel nie został znaleziony"
}
```

**Error Response (403 Forbidden):**
```json
{
  "message": "Brak uprawnień do usunięcia tego celu"
}
```

---

### 5. POST /api/goals/:id/contribute
Dodaje wpłatę do celu oszczędnościowego.

**Request Headers:**
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "amount": 500.00
}
```

**Validation:**
- `amount` - wymagane, number (> 0)
- Użytkownik musi być właścicielem celu
- Po wpłacie `currentAmount` nie może przekroczyć `targetAmount` (opcjonalnie można pozwolić)

**Response Body (200 OK):**
```json
{
  "message": "Wpłata została dodana",
  "goal": {
    "id": 1,
    "name": "Wakacje 2026",
    "targetAmount": 5000.00,
    "currentAmount": 4000.00,
    "dueDate": "2026-06-30",
    "description": "Wyjazd do Grecji",
    "userId": 1,
    "updatedAt": "2025-10-24T17:00:00.000Z"
  }
}
```

**Uwagi:**
- Ten endpoint zwiększa wartość `currentAmount` o podaną kwotę
- Możesz opcjonalnie prowadzić historię wpłat w osobnej tabeli (zalecane)
- Frontend wysyła tylko kwotę wpłaty, backend dodaje ją do `currentAmount`

**Error Response (400 Bad Request):**
```json
{
  "message": "Kwota wpłaty musi być większa od 0"
}
```

**Error Response (404 Not Found):**
```json
{
  "message": "Cel nie został znaleziony"
}
```

---

## Analysis Endpoints

### 1. GET /api/analysis/statistics
Pobiera statystyki analizy dla wybranego okresu (średnie wydatki, przychody, oszczędności, stopa oszczędności).

**Query Parameters:**
- `period` (optional) - Okres analizy: `last3months`, `last6months`, `last12months`, `thisyear` (default: `last6months`)

**Request Headers:**
```http
Authorization: Bearer <token>
```

**Request Example:**
```http
GET /api/analysis/statistics?period=last6months
```

**Response Body:**
```json
{
  "averageExpenses": 3400.00,
  "averageIncome": 5233.00,
  "averageSavings": 1917.00,
  "savingsRate": 36.0,
  "expensesChange": -8.0,
  "incomeChange": 9.0,
  "savingsChange": 12.0,
  "savingsRateChange": 5.0
}
```

**Uwagi:**
- `averageExpenses` - średnia wydatków w wybranym okresie
- `averageIncome` - średnia przychodów w wybranym okresie
- `averageSavings` - średnia oszczędności w wybranym okresie
- `savingsRate` - stopa oszczędności w % (savings/income * 100)
- `*Change` - zmiana procentowa w stosunku do poprzedniego okresu (może być ujemna lub dodatnia)

---

### 2. GET /api/analysis/savings-growth
Pobiera dane dla wykresu wzrostu oszczędności w czasie.

**Query Parameters:**
- `period` (optional) - Okres analizy: `last3months`, `last6months`, `last12months`, `thisyear` (default: `last6months`)

**Request Headers:**
```http
Authorization: Bearer <token>
```

**Request Example:**
```http
GET /api/analysis/savings-growth?period=last6months
```

**Response Body:**
```json
{
  "data": [
    { "month": "Sty", "savings": 7500.00 },
    { "month": "Lut", "savings": 10200.00 },
    { "month": "Mar", "savings": 12800.00 },
    { "month": "Kwi", "savings": 14500.00 },
    { "month": "Maj", "savings": 15800.00 },
    { "month": "Cze", "savings": 18000.00 }
  ]
}
```

**Uwagi:**
- `month` - skrócona nazwa miesiąca (3 znaki: Sty, Lut, Mar, etc.)
- `savings` - skumulowana wartość oszczędności do danego miesiąca
- Dane powinny być posortowane chronologicznie
- Liczba elementów zależy od wybranego okresu (3, 6, 12 miesięcy)

---

### 3. GET /api/analysis/income-vs-expenses
Pobiera dane dla wykresu porównania przychodów, wydatków i oszczędności w czasie.

**Query Parameters:**
- `period` (optional) - Okres analizy: `last3months`, `last6months`, `last12months`, `thisyear` (default: `last6months`)

**Request Headers:**
```http
Authorization: Bearer <token>
```

**Request Example:**
```http
GET /api/analysis/income-vs-expenses?period=last6months
```

**Response Body:**
```json
{
  "data": [
    { "month": "Sty", "income": 5200.00, "expenses": 3100.00, "savings": 1500.00 },
    { "month": "Lut", "income": 5300.00, "expenses": 3600.00, "savings": 1300.00 },
    { "month": "Mar", "income": 5100.00, "expenses": 2900.00, "savings": 1600.00 },
    { "month": "Kwi", "income": 5800.00, "expenses": 3500.00, "savings": 1200.00 },
    { "month": "Maj", "income": 5600.00, "expenses": 3200.00, "savings": 1300.00 },
    { "month": "Cze", "income": 5900.00, "expenses": 3000.00, "savings": 2000.00 }
  ]
}
```

**Uwagi:**
- `month` - skrócona nazwa miesiąca (3 znaki)
- `income` - suma przychodów w danym miesiącu
- `expenses` - suma wydatków w danym miesiącu
- `savings` - różnica między przychodami a wydatkami (income - expenses)
- Dane powinny być posortowane chronologicznie
- Wszystkie wartości jako liczby zmiennoprzecinkowe

---

### 4. GET /api/analysis/weekly-expenses
Pobiera dane dla wykresu wydatków tygodniowych (dni tygodnia).

**Query Parameters:**
- `weeks` (optional) - Liczba ostatnich tygodni do analizy (default: 8)

**Request Headers:**
```http
Authorization: Bearer <token>
```

**Request Example:**
```http
GET /api/analysis/weekly-expenses?weeks=8
```

**Response Body:**
```json
{
  "data": [
    { "week": "Pon", "amount": 120.00 },
    { "week": "Wt", "amount": 85.00 },
    { "week": "Śr", "amount": 140.00 },
    { "week": "Czw", "amount": 95.00 },
    { "week": "Pt", "amount": 190.00 },
    { "week": "Sob", "amount": 180.00 },
    { "week": "Ndz", "amount": 135.00 }
  ],
  "dailyAverage": 139.29
}
```

**Uwagi:**
- `week` - nazwa dnia tygodnia (Pon, Wt, Śr, Czw, Pt, Sob, Ndz)
- `amount` - średnia wydatków dla danego dnia tygodnia z ostatnich X tygodni
- `dailyAverage` - średnia dzienna wydatków ze wszystkich dni
- Obliczenie: dla każdego dnia tygodnia zsumować wydatki z ostatnich X wystąpień tego dnia i podzielić przez X
- Przykład: jeśli `weeks=8`, to dla poniedziałków zsumować wydatki z ostatnich 8 poniedziałków i podzielić przez 8

---

### 5. GET /api/dashboard/expenses-by-category (ponownie wykorzystany)
Wykres wydatków według kategorii w sekcji Analizy wykorzystuje ten sam endpoint co na dashboardzie.

**Endpoint szczegółowo opisany w:** [Dashboard Endpoints](#3-get-apidashboardexpenses-by-category)

**Uwagi dla sekcji Analizy:**
- Używa tego samego endpointu bez parametru `month`
- Zwraca wydatki według kategorii dla bieżącego miesiąca
- Frontend korzysta z `getExpensesByCategory()` z `api/dashboard.js`
- Wykres w sekcji Analizy ma identyczny format (donut chart) jak na pulpicie

---

## Struktury danych

### User
```json
{
  "id": 1,
  "username": "jan.kowalski",
  "email": "jan@example.com",
  "createdAt": "2025-01-15T10:00:00.000Z"
}
```

### Expense
```json
{
  "id": 1,
  "name": "Zakupy spożywcze",
  "categoryId": 1,
  "date": "2025-10-23",
  "amount": 125.50,
  "description": "Zakupy w Biedronce",
  "userId": 1,
  "createdAt": "2025-10-23T10:30:00.000Z",
  "updatedAt": "2025-10-23T10:30:00.000Z"
}
```

### Category
```json
{
  "id": 1,
  "name": "Jedzenie",
  "color": "#ff6b9d",
  "icon": "🍕",
  "userId": 1,
  "createdAt": "2025-01-15T10:00:00.000Z"
}
```

### Goal
```json
{
  "id": 1,
  "name": "Wakacje 2026",
  "targetAmount": 5000.00,
  "currentAmount": 3500.00,
  "dueDate": "2026-06-30",
  "description": "Wyjazd do Grecji",
  "userId": 1,
  "createdAt": "2025-10-01T10:00:00.000Z",
  "updatedAt": "2025-10-23T14:30:00.000Z"
}
```

---

## 🔐 Uwagi bezpieczeństwa

1. **Weryfikacja tokenu JWT** - każdy endpoint musi weryfikować czy token jest ważny
2. **Weryfikacja userId** - upewnić się że użytkownik ma dostęp tylko do swoich danych
3. **Walidacja danych wejściowych** - sprawdzać typy danych, długość stringów, etc.
4. **SQL Injection** - używać prepared statements/ORM
5. **Rate limiting** - opcjonalnie dodać ograniczenie liczby requestów

---

## 💡 Dodatkowe wskazówki

### Baza danych - przykładowe tabele

**users**
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**categories**
```sql
CREATE TABLE categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  icon TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE(user_id, name)
);
```

**expenses**
```sql
CREATE TABLE expenses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  category_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  amount REAL NOT NULL,
  date DATE NOT NULL,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (category_id) REFERENCES categories(id)
);
```

**goals**
```sql
CREATE TABLE goals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  target_amount REAL NOT NULL,
  current_amount REAL NOT NULL DEFAULT 0,
  due_date DATE NOT NULL,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

**goal_contributions** (opcjonalna tabela dla historii wpłat)
```sql
CREATE TABLE goal_contributions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  goal_id INTEGER NOT NULL,
  amount REAL NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (goal_id) REFERENCES goals(id)
);
```

### Domyślne kategorie

Przy rejestracji użytkownika, można automatycznie utworzyć podstawowe kategorie:
- Jedzenie (#ff6b9d, 🍕)
- Transport (#00f0ff, 🚗)
- Rozrywka (#a8e6cf, 🎬)
- Rachunki (#ffd93d, ⚡)
- Zakupy (#c77dff, 🛒)

---

## 📞 Kontakt

W razie pytań dotyczących implementacji API, skontaktuj się z zespołem frontendowym.
