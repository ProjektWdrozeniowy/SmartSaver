# SmartSaver - Dokumentacja API dla Backend

## 📋 Spis treści
1. [Ogólne informacje](#ogólne-informacje)
2. [Autoryzacja](#autoryzacja)
3. [Dashboard Endpoints](#dashboard-endpoints)
4. [Expenses Endpoints](#expenses-endpoints)
5. [Categories Endpoints](#categories-endpoints)
6. [Struktury danych](#struktury-danych)

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
