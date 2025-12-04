// src/api/dashboard.js
import { getToken } from './auth';

const BASE_URL =
  (import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.replace(/\/+$/, '')) ||
  '';

/**
 * Pobiera statystyki dashboardu (saldo, przychody, wydatki, oszczędności, cele)
 * GET /api/dashboard/stats
 */
export async function getDashboardStats() {
  const token = getToken();
  if (!token) {
    throw new Error('Brak tokenu autoryzacji');
  }

  const url = `${BASE_URL}/api/dashboard/stats`;
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
 * Pobiera ostatnie transakcje
 * GET /api/dashboard/transactions?limit=5
 */
export async function getRecentTransactions(limit = 5) {
  const token = getToken();
  if (!token) {
    throw new Error('Brak tokenu autoryzacji');
  }

  const url = `${BASE_URL}/api/dashboard/transactions?limit=${limit}`;
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
 * Pobiera wydatki według kategorii dla wykresu (dla wybranego miesiąca)
 * GET /api/dashboard/expenses-by-category?month=YYYY-MM
 */
export async function getExpensesByCategory(month) {
  const token = getToken();
  if (!token) {
    throw new Error('Brak tokenu autoryzacji');
  }

  const url = month
    ? `${BASE_URL}/api/dashboard/expenses-by-category?month=${month}`
    : `${BASE_URL}/api/dashboard/expenses-by-category`;

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
