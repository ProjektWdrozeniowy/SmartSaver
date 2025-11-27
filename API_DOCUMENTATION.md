# SmartSaver - Dokumentacja API dla Backend

## 📋 Spis treści
1. [Ogólne informacje](#ogólne-informacje)
2. [Autoryzacja](#autoryzacja)
3. [Authentication Endpoints](#authentication-endpoints)
4. [Dashboard Endpoints](#dashboard-endpoints)
5. [Expenses Endpoints](#expenses-endpoints)
6. [Categories Endpoints](#categories-endpoints)
7. [Goals Endpoints](#goals-endpoints)
8. [Analysis Endpoints](#analysis-endpoints)
9. [Budget Endpoints](#budget-endpoints)
10. [Notifications Endpoints](#notifications-endpoints)
11. [Settings/User Endpoints](#settingsuser-endpoints)
12. [Struktury danych](#struktury-danych)

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
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## Autoryzacja

Wszystkie endpointy (poza `/api/login`, `/api/register`, `/api/forgot-password` i `/api/reset-password`) wymagają tokenu JWT w headerze:

```http
Authorization: Bearer <token>
```

Token jest zwracany po zalogowaniu/rejestracji i przechowywany w `localStorage` po stronie frontendu.

---

## Authentication Endpoints

### 1. POST /api/register
Rejestruje nowego użytkownika.

**Request Body:**
```json
{
  "username": "Jan Kowalski",
  "email": "jan@example.com",
  "password": "haslo123"
}
```

**Validation:**
- `username` - wymagane, string (min 3 znaki)
- `email` - wymagane, string (format email, unikalny)
- `password` - wymagane, string (min 6 znaków)

**Response Body (201 Created):**
```json
{
  "message": "Użytkownik został zarejestrowany",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "Jan Kowalski",
    "email": "jan@example.com"
  }
}
```

---

### 2. POST /api/login
Loguje użytkownika.

**Request Body:**
```json
{
  "email": "jan@example.com",
  "password": "haslo123"
}
```

**Response Body (200 OK):**
```json
{
  "message": "Zalogowano pomyślnie",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "Jan Kowalski",
    "email": "jan@example.com"
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "message": "Nieprawidłowe dane logowania"
}
```

---

### 3. POST /api/forgot-password
Inicjuje proces resetowania hasła.

**Request Body:**
```json
{
  "email": "jan@example.com"
}
```

**Response Body (200 OK):**
```json
{
  "message": "Link do resetowania hasła został wysłany na adres email"
}
```

---

### 4. POST /api/reset-password
Resetuje hasło użytkownika.

**Request Body:**
```json
{
  "token": "reset-token-from-email",
  "newPassword": "nowe_haslo123"
}
```

**Response Body (200 OK):**
```json
{
  "message": "Hasło zostało zmienione"
}
```

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
      "color": "#00b8d4",
      "navigateTo": "budzet"
    },
    {
      "title": "Przychody (miesiąc)",
      "value": "5,730 zł",
      "change": "+12%",
      "positive": true,
      "iconKey": "income",
      "color": "#66bb6a",
      "navigateTo": "budzet"
    },
    {
      "title": "Wydatki (miesiąc)",
      "value": "3,280 zł",
      "change": "-15%",
      "positive": true,
      "iconKey": "expenses",
      "color": "#ef5350",
      "navigateTo": "wydatki",
      "budgetPercentage": "65.2"
    },
    {
      "title": "Twój cel",
      "value": "68%",
      "change": "+5%",
      "positive": true,
      "iconKey": "goal",
      "color": "#ab47bc",
      "navigateTo": "cele"
    }
  ]
}
```

**Uwagi:**
- `iconKey` musi być jednym z: `balance`, `income`, `expenses`, `goal`
- `budgetPercentage` - opcjonalne, pokazuje procent wykorzystanego budżetu dla wydatków
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
      "icon": "🛒",
      "type": "expense"
    },
    {
      "id": 2,
      "title": "Pensja",
      "category": "Przychód",
      "amount": 5730.00,
      "date": "2025-10-20",
      "icon": "💰",
      "type": "income"
    }
  ]
}
```

**Uwagi:**
- `amount` ujemne = wydatek, dodatnie = przychód
- `type` - typ transakcji: `expense` lub `income`
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
      "amount": 125.50,
      "isRecurring": false,
      "recurringFrequency": null
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
  "description": "Zakupy w Biedronce",
  "isRecurring": false,
  "recurringFrequency": null
}
```

**Validation:**
- `name` - wymagane, string
- `categoryId` - wymagane, number (musi istnieć)
- `date` - wymagane, string (format YYYY-MM-DD)
- `amount` - wymagane, number (> 0)
- `description` - opcjonalne, string
- `isRecurring` - opcjonalne, boolean (default: false)
- `recurringFrequency` - opcjonalne, string: `daily`, `weekly`, `monthly`, `yearly`

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
    "isRecurring": false,
    "recurringFrequency": null,
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
  "description": "Zakupy w Biedronce i Lidlu",
  "isRecurring": false
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

---

### 5. POST /api/expenses/check-recurring
Sprawdza i tworzy cykliczne wydatki (wywoływane automatycznie przez frontend).

**Request Headers:**
```http
Authorization: Bearer <token>
```

**Response Body (200 OK):**
```json
{
  "message": "Sprawdzono cykliczne wydatki",
  "created": 2
}
```

**Uwagi:**
- Endpoint automatycznie sprawdza wszystkie cykliczne wydatki użytkownika
- Tworzy nowe wpisy dla wydatków, które powinny się powtórzyć
- `created` - liczba utworzonych nowych wydatków

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

---

### 3. DELETE /api/categories/:id
Usuwa kategorię.

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
- Przed usunięciem sprawdza czy kategoria ma przypisane wydatki
- Jeśli kategoria ma wydatki, zwraca błąd 400

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
      "reminderEnabled": true,
      "reminderFrequency": "weekly",
      "createdAt": "2025-10-01T10:00:00.000Z",
      "updatedAt": "2025-10-23T14:30:00.000Z"
    }
  ]
}
```

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
  "description": "6-miesięczny fundusz awaryjny",
  "reminderEnabled": true,
  "reminderFrequency": "weekly"
}
```

**Validation:**
- `name` - wymagane, string (max 100 znaków)
- `targetAmount` - wymagane, number (> 0)
- `currentAmount` - wymagane, number (>= 0, domyślnie 0)
- `dueDate` - wymagane, string (format YYYY-MM-DD, musi być w przyszłości)
- `description` - opcjonalne, string (max 500 znaków)
- `reminderEnabled` - opcjonalne, boolean (default: false)
- `reminderFrequency` - opcjonalne, string: `weekly`, `monthly`

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
    "reminderEnabled": true,
    "reminderFrequency": "weekly",
    "userId": 1,
    "createdAt": "2025-10-24T15:00:00.000Z",
    "updatedAt": "2025-10-24T15:00:00.000Z"
  }
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
  "description": "Wyjazd do Grecji - 2 tygodnie",
  "reminderEnabled": true,
  "reminderFrequency": "monthly"
}
```

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
    "reminderEnabled": true,
    "reminderFrequency": "monthly",
    "userId": 1,
    "updatedAt": "2025-10-24T16:00:00.000Z"
  }
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

---

## Analysis Endpoints

### 1. GET /api/analysis/statistics
Pobiera statystyki analizy dla wybranego okresu.

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

---

### 2. GET /api/analysis/savings-growth
Pobiera dane dla wykresu wzrostu oszczędności w czasie.

**Query Parameters:**
- `period` (optional) - Okres analizy: `last3months`, `last6months`, `last12months`, `thisyear` (default: `last6months`)

**Request Headers:**
```http
Authorization: Bearer <token>
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

---

### 3. GET /api/analysis/income-vs-expenses
Pobiera dane dla wykresu porównania przychodów, wydatków i oszczędności.

**Query Parameters:**
- `period` (optional) - Okres analizy (default: `last6months`)

**Request Headers:**
```http
Authorization: Bearer <token>
```

**Response Body:**
```json
{
  "data": [
    { "month": "Sty", "income": 5200.00, "expenses": 3100.00, "savings": 1500.00 },
    { "month": "Lut", "income": 5300.00, "expenses": 3600.00, "savings": 1300.00 },
    { "month": "Mar", "income": 5100.00, "expenses": 2900.00, "savings": 1600.00 }
  ]
}
```

---

### 4. GET /api/analysis/weekly-expenses
Pobiera dane dla wykresu wydatków tygodniowych.

**Query Parameters:**
- `weeks` (optional) - Liczba ostatnich tygodni do analizy (default: 8)

**Request Headers:**
```http
Authorization: Bearer <token>
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

---

## Budget Endpoints

### 1. GET /api/budget/income
Pobiera listę przychodów użytkownika.

**Query Parameters:**
- `month` (optional) - Filtruj po miesiącu w formacie YYYY-MM

**Request Headers:**
```http
Authorization: Bearer <token>
```

**Response Body:**
```json
{
  "incomes": [
    {
      "id": 1,
      "name": "Wynagrodzenie",
      "amount": 5730.00,
      "date": "2025-10-25",
      "description": "Pensja za październik",
      "isRecurring": true,
      "recurringFrequency": "monthly"
    }
  ]
}
```

---

### 2. POST /api/budget/income
Tworzy nowy przychód.

**Request Headers:**
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Wynagrodzenie",
  "amount": 5730.00,
  "date": "2025-10-25",
  "description": "Pensja za październik",
  "isRecurring": true,
  "recurringFrequency": "monthly"
}
```

**Validation:**
- `name` - wymagane, string (max 100 znaków)
- `amount` - wymagane, number (> 0)
- `date` - wymagane, string (format YYYY-MM-DD)
- `description` - opcjonalne, string (max 500 znaków)
- `isRecurring` - opcjonalne, boolean (default: false)
- `recurringFrequency` - opcjonalne, string: `daily`, `weekly`, `monthly`, `yearly`

**Response Body (201 Created):**
```json
{
  "message": "Przychód został dodany",
  "income": {
    "id": 3,
    "name": "Wynagrodzenie",
    "amount": 5730.00,
    "date": "2025-10-25",
    "description": "Pensja za październik",
    "isRecurring": true,
    "recurringFrequency": "monthly",
    "userId": 1,
    "createdAt": "2025-10-25T10:00:00.000Z"
  }
}
```

---

### 3. PUT /api/budget/income/:id
Aktualizuje istniejący przychód.

**Request Headers:**
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Wynagrodzenie - zaktualizowane",
  "amount": 6000.00,
  "date": "2025-10-25",
  "description": "Pensja za październik + nadgodziny"
}
```

**Response Body (200 OK):**
```json
{
  "message": "Przychód został zaktualizowany",
  "income": {
    "id": 1,
    "name": "Wynagrodzenie - zaktualizowane",
    "amount": 6000.00,
    "date": "2025-10-25",
    "description": "Pensja za październik + nadgodziny",
    "userId": 1,
    "updatedAt": "2025-10-26T14:30:00.000Z"
  }
}
```

---

### 4. DELETE /api/budget/income/:id
Usuwa przychód.

**Request Headers:**
```http
Authorization: Bearer <token>
```

**Response Body (200 OK):**
```json
{
  "message": "Przychód został usunięty"
}
```

---

### 5. GET /api/budget/summary
Pobiera podsumowanie budżetu.

**Query Parameters:**
- `month` (optional) - Miesiąc w formacie YYYY-MM (domyślnie bieżący miesiąc)

**Request Headers:**
```http
Authorization: Bearer <token>
```

**Response Body:**
```json
{
  "totalIncome": 6730.00,
  "totalExpenses": 3280.00,
  "balance": 12450.00,
  "savings": 3450.00
}
```

---

### 6. POST /api/budget/income/check-recurring
Sprawdza i tworzy cykliczne przychody.

**Request Headers:**
```http
Authorization: Bearer <token>
```

**Response Body (200 OK):**
```json
{
  "message": "Sprawdzono cykliczne przychody",
  "created": 1
}
```

---

## Notifications Endpoints

### 1. GET /api/notifications
Pobiera listę powiadomień użytkownika.

**Query Parameters:**
- `filter` (optional) - Filtr: `all`, `unread`, lub typ powiadomienia (default: `all`)

**Request Headers:**
```http
Authorization: Bearer <token>
```

**Request Example:**
```http
GET /api/notifications?filter=unread
```

**Response Body:**
```json
{
  "notifications": [
    {
      "id": 1,
      "type": "goal_reminder",
      "title": "Przypomnienie o celu",
      "message": "Zbliżasz się do osiągnięcia celu: Wakacje 2026",
      "isRead": false,
      "createdAt": "2025-10-24T10:00:00.000Z"
    },
    {
      "id": 2,
      "type": "budget_alert",
      "title": "Przekroczenie budżetu",
      "message": "Przekroczyłeś 80% budżetu na kategorię: Transport",
      "isRead": false,
      "createdAt": "2025-10-23T15:30:00.000Z"
    }
  ],
  "unreadCount": 2
}
```

**Uwagi:**
- Typy powiadomień: `goal_reminder`, `budget_alert`, `goal_achieved`, `goal_deadline`
- `unreadCount` - liczba nieprzeczytanych powiadomień

---

### 2. PUT /api/notifications/:id/read
Oznacza powiadomienie jako przeczytane.

**Request Headers:**
```http
Authorization: Bearer <token>
```

**Response Body (200 OK):**
```json
{
  "message": "Powiadomienie zostało oznaczone jako przeczytane",
  "notification": {
    "id": 1,
    "type": "goal_reminder",
    "title": "Przypomnienie o celu",
    "message": "Zbliżasz się do osiągnięcia celu: Wakacje 2026",
    "isRead": true,
    "createdAt": "2025-10-24T10:00:00.000Z"
  }
}
```

---

### 3. PUT /api/notifications/read-all
Oznacza wszystkie powiadomienia jako przeczytane.

**Request Headers:**
```http
Authorization: Bearer <token>
```

**Response Body (200 OK):**
```json
{
  "message": "Wszystkie powiadomienia zostały oznaczone jako przeczytane"
}
```

---

### 4. DELETE /api/notifications/:id
Usuwa pojedyncze powiadomienie.

**Request Headers:**
```http
Authorization: Bearer <token>
```

**Response Body (200 OK):**
```json
{
  "message": "Powiadomienie zostało usunięte"
}
```

---

### 5. DELETE /api/notifications
Usuwa wszystkie powiadomienia użytkownika.

**Request Headers:**
```http
Authorization: Bearer <token>
```

**Response Body (200 OK):**
```json
{
  "message": "Wszystkie powiadomienia zostały usunięte"
}
```

---

### 6. POST /api/notifications/check-goal-reminders
Sprawdza cele i tworzy powiadomienia przypominające (wywoływane automatycznie).

**Request Headers:**
```http
Authorization: Bearer <token>
```

**Response Body (200 OK):**
```json
{
  "message": "Sprawdzono przypomnienia o celach",
  "created": 2
}
```

---

## Settings/User Endpoints

### 1. GET /api/user/profile
Pobiera dane profilu użytkownika.

**Request Headers:**
```http
Authorization: Bearer <token>
```

**Response Body:**
```json
{
  "id": 1,
  "username": "Jan Kowalski",
  "email": "jan.kowalski@example.com",
  "createdAt": "2025-01-15T10:00:00.000Z"
}
```

---

### 2. PUT /api/user/profile
Aktualizuje dane profilu użytkownika.

**Request Headers:**
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "username": "Jan Kowalski",
  "email": "jan.kowalski@example.com"
}
```

**Response Body (200 OK):**
```json
{
  "message": "Profil został zaktualizowany",
  "user": {
    "id": 1,
    "username": "Jan Kowalski",
    "email": "jan.kowalski@example.com",
    "updatedAt": "2025-10-27T14:30:00.000Z"
  }
}
```

---

### 3. PUT /api/user/change-password
Zmienia hasło użytkownika.

**Request Headers:**
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "currentPassword": "stare_haslo",
  "newPassword": "nowe_haslo"
}
```

**Response Body (200 OK):**
```json
{
  "message": "Hasło zostało zmienione"
}
```

---

### 4. GET /api/user/notifications
Pobiera ustawienia powiadomień użytkownika.

**Request Headers:**
```http
Authorization: Bearer <token>
```

**Response Body:**
```json
{
  "budgetAlerts": true,
  "goalReminders": true
}
```

---

### 5. PUT /api/user/notifications
Aktualizuje ustawienia powiadomień użytkownika.

**Request Headers:**
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "budgetAlerts": true,
  "goalReminders": true
}
```

**Response Body (200 OK):**
```json
{
  "message": "Ustawienia powiadomień zaktualizowane",
  "settings": {
    "budgetAlerts": true,
    "goalReminders": true
  }
}
```

---

### 6. GET /api/user/export
Eksportuje wszystkie dane użytkownika w formacie JSON.

**Request Headers:**
```http
Authorization: Bearer <token>
```

**Response Body:**
```json
{
  "user": {
    "id": 1,
    "username": "Jan Kowalski",
    "email": "jan.kowalski@example.com",
    "createdAt": "2025-01-15T10:00:00.000Z"
  },
  "expenses": [...],
  "incomes": [...],
  "categories": [...],
  "goals": [...]
}
```

---

### 7. DELETE /api/user/delete
Usuwa konto użytkownika i wszystkie powiązane dane.

**Request Headers:**
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "password": "haslo_uzytkownika"
}
```

**Response Body (200 OK):**
```json
{
  "message": "Konto zostało usunięte"
}
```

**Uwagi:**
- Operacja jest nieodwracalna
- Wymaga potwierdzenia hasłem

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
  "isRecurring": false,
  "recurringFrequency": null,
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
  "reminderEnabled": true,
  "reminderFrequency": "weekly",
  "userId": 1,
  "createdAt": "2025-10-01T10:00:00.000Z",
  "updatedAt": "2025-10-23T14:30:00.000Z"
}
```

### Income
```json
{
  "id": 1,
  "name": "Wynagrodzenie",
  "amount": 5730.00,
  "date": "2025-10-25",
  "description": "Pensja za październik",
  "isRecurring": true,
  "recurringFrequency": "monthly",
  "userId": 1,
  "createdAt": "2025-10-25T10:00:00.000Z",
  "updatedAt": "2025-10-25T10:00:00.000Z"
}
```

### Notification
```json
{
  "id": 1,
  "type": "goal_reminder",
  "title": "Przypomnienie o celu",
  "message": "Zbliżasz się do osiągnięcia celu: Wakacje 2026",
  "isRead": false,
  "userId": 1,
  "createdAt": "2025-10-24T10:00:00.000Z"
}
```

---

## 🔐 Uwagi bezpieczeństwa

1. **Weryfikacja tokenu JWT** - każdy endpoint musi weryfikować czy token jest ważny
2. **Weryfikacja userId** - upewnić się że użytkownik ma dostęp tylko do swoich danych
3. **Walidacja danych wejściowych** - sprawdzać typy danych, długość stringów, etc.
4. **SQL Injection** - używać Prisma ORM z parametryzowanymi zapytaniami
5. **Rate limiting** - zaimplementowane ograniczenie liczby requestów
6. **Haszowanie haseł** - używanie Argon2 do bezpiecznego przechowywania haseł

---

## 📞 Kontakt

W razie pytań dotyczących implementacji API, skontaktuj się z zespołem rozwojowym.

**Ostatnia aktualizacja:** Listopad 2025
