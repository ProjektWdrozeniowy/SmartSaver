// src/api/analysis.js
import { getToken } from './auth';

const BASE_URL =
  (import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.replace(/\/+$/, '')) ||
  '';

/**
 * Pobiera statystyki analizy (średnie wydatki, przychody, oszczędności, stopa oszczędności)
 * GET /api/analysis/statistics?period=last6months
 */
export async function getAnalysisStatistics(period = 'last6months') {
  const token = getToken();
  if (!token) {
    throw new Error('Brak tokenu autoryzacji');
  }

  const url = `${BASE_URL}/api/analysis/statistics?period=${period}`;
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
 * Pobiera dane dla wykresu wzrostu oszczędności
 * GET /api/analysis/savings-growth?period=last6months
 */
export async function getSavingsGrowth(period = 'last6months') {
  const token = getToken();
  if (!token) {
    throw new Error('Brak tokenu autoryzacji');
  }

  const url = `${BASE_URL}/api/analysis/savings-growth?period=${period}`;
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
 * Pobiera dane dla wykresu przychody vs wydatki
 * GET /api/analysis/income-vs-expenses?period=last6months
 */
export async function getIncomeVsExpenses(period = 'last6months') {
  const token = getToken();
  if (!token) {
    throw new Error('Brak tokenu autoryzacji');
  }

  const url = `${BASE_URL}/api/analysis/income-vs-expenses?period=${period}`;
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
 * Pobiera wydatki tygodniowe
 * GET /api/analysis/weekly-expenses?weeks=8
 */
export async function getWeeklyExpenses(weeks = 8) {
  const token = getToken();
  if (!token) {
    throw new Error('Brak tokenu autoryzacji');
  }

  const url = `${BASE_URL}/api/analysis/weekly-expenses?weeks=${weeks}`;
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
