// src/api/expenses.js
import { getToken } from './auth';

const BASE_URL =
  (import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.replace(/\/+$/, '')) ||
  '';

/**
 * Pobiera listę wydatków (opcjonalnie filtrowane po miesiącu)
 * GET /api/expenses?month=YYYY-MM
 */
export async function getExpenses(month = null) {
  const token = getToken();
  if (!token) {
    throw new Error('Brak tokenu autoryzacji');
  }

  const url = month
    ? `${BASE_URL}/api/expenses?month=${month}`
    : `${BASE_URL}/api/expenses`;

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || `Błąd ${res.status}`);

  return data;
}

/**
 * Dodaje nowy wydatek
 * POST /api/expenses
 * @param {Object} expenseData - { name, categoryId, date, amount, description }
 */
export async function createExpense(expenseData) {
  const token = getToken();
  if (!token) {
    throw new Error('Brak tokenu autoryzacji');
  }

  const url = `${BASE_URL}/api/expenses`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(expenseData),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || `Błąd ${res.status}`);

  return data;
}

/**
 * Aktualizuje wydatek
 * PUT /api/expenses/:id
 * @param {string|number} id - ID wydatku
 * @param {Object} expenseData - { name, categoryId, date, amount, description }
 */
export async function updateExpense(id, expenseData) {
  const token = getToken();
  if (!token) {
    throw new Error('Brak tokenu autoryzacji');
  }

  const url = `${BASE_URL}/api/expenses/${id}`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(expenseData),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || `Błąd ${res.status}`);

  return data;
}

/**
 * Usuwa wydatek
 * DELETE /api/expenses/:id
 * @param {string|number} id - ID wydatku
 */
export async function deleteExpense(id) {
  const token = getToken();
  if (!token) {
    throw new Error('Brak tokenu autoryzacji');
  }

  const url = `${BASE_URL}/api/expenses/${id}`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || `Błąd ${res.status}`);

  return data;
}

/**
 * Sprawdza i tworzy cykliczne wydatki
 * POST /api/expenses/check-recurring
 */
export async function checkRecurringExpenses() {
  const token = getToken();
  if (!token) {
    throw new Error('Brak tokenu autoryzacji');
  }

  const url = `${BASE_URL}/api/expenses/check-recurring`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || `Błąd ${res.status}`);

  return data;
}
