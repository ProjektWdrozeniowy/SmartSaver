// src/api/budget.js
import { getToken } from './auth';

const BASE_URL =
  (import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.replace(/\/+$/, '')) ||
  'http://localhost:4000';

/**
 * Pobiera listę przychodów (opcjonalnie filtrowane po miesiącu)
 * GET /api/budget/income?month=YYYY-MM
 */
export async function getIncome(month = null) {
  const token = getToken();
  if (!token) {
    throw new Error('Brak tokenu autoryzacji');
  }

  const url = month
    ? `${BASE_URL}/api/budget/income?month=${month}`
    : `${BASE_URL}/api/budget/income`;

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
 * Dodaje nowy przychód
 * POST /api/budget/income
 * @param {Object} incomeData - { name, amount, date, description }
 */
export async function createIncome(incomeData) {
  const token = getToken();
  if (!token) {
    throw new Error('Brak tokenu autoryzacji');
  }

  const url = `${BASE_URL}/api/budget/income`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(incomeData),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || `Błąd ${res.status}`);

  return data;
}

/**
 * Aktualizuje przychód
 * PUT /api/budget/income/:id
 * @param {string|number} id - ID przychodu
 * @param {Object} incomeData - { name, amount, date, description }
 */
export async function updateIncome(id, incomeData) {
  const token = getToken();
  if (!token) {
    throw new Error('Brak tokenu autoryzacji');
  }

  const url = `${BASE_URL}/api/budget/income/${id}`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(incomeData),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || `Błąd ${res.status}`);

  return data;
}

/**
 * Usuwa przychód
 * DELETE /api/budget/income/:id
 * @param {string|number} id - ID przychodu
 */
export async function deleteIncome(id) {
  const token = getToken();
  if (!token) {
    throw new Error('Brak tokenu autoryzacji');
  }

  const url = `${BASE_URL}/api/budget/income/${id}`;
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
 * Pobiera podsumowanie budżetu (saldo, przychody, wydatki)
 * GET /api/budget/summary?month=YYYY-MM
 */
export async function getBudgetSummary(month = null) {
  const token = getToken();
  if (!token) {
    throw new Error('Brak tokenu autoryzacji');
  }

  const url = month
    ? `${BASE_URL}/api/budget/summary?month=${month}`
    : `${BASE_URL}/api/budget/summary`;

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
 * Sprawdza i tworzy cykliczne przychody
 * POST /api/budget/income/check-recurring
 */
export async function checkRecurringIncomes() {
  const token = getToken();
  if (!token) {
    throw new Error('Brak tokenu autoryzacji');
  }

  const url = `${BASE_URL}/api/budget/income/check-recurring`;
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
