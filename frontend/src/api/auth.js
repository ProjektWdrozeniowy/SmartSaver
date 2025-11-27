// src/api/auth.js
const BASE_URL =
  (import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.replace(/\/+$/, '')) ||
  'http://localhost:4000';

// Funkcje pomocnicze do zarządzania tokenem
export function saveToken(token) {
  localStorage.setItem('authToken', token);
}

export function getToken() {
  return localStorage.getItem('authToken');
}

export function removeToken() {
  localStorage.removeItem('authToken');
}

export function saveUser(user) {
  localStorage.setItem('user', JSON.stringify(user));
}

export function getUser() {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}

export function removeUser() {
  localStorage.removeItem('user');
}

export function logout() {
  removeToken();
  removeUser();
}

export async function registerUser({ username, email, password }) {
  const url = `${BASE_URL}/api/register`;
  console.log('Register URL ->', url);

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || `Błąd ${res.status}`);

  // Zapisz token i dane użytkownika
  if (data.token) {
    saveToken(data.token);
  }
  if (data.user) {
    saveUser(data.user);
  }

  return data;
}

export async function loginUser({ email, password }) {
  const url = `${BASE_URL}/api/login`;
  console.log('Login URL ->', url);

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || `Błąd ${res.status}`);

  // Zapisz token i dane użytkownika
  if (data.token) {
    saveToken(data.token);
  }
  if (data.user) {
    saveUser(data.user);
  }

  return data;
}

// Funkcja do pobierania danych aktualnego użytkownika (wymaga tokenu)
export async function getCurrentUser() {
  const token = getToken();
  if (!token) {
    throw new Error('Brak tokenu autoryzacji');
  }

  const url = `${BASE_URL}/api/me`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || `Błąd ${res.status}`);

  return data;
}

// Funkcja do resetowania hasła (forgot password)
export async function forgotPassword({ email }) {
  const url = `${BASE_URL}/api/forgot-password`;
  console.log('Forgot Password URL ->', url);

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || `Błąd ${res.status}`);

  return data;
}

// Funkcja do resetowania hasła z tokenem
export async function resetPassword({ token, newPassword }) {
  const url = `${BASE_URL}/api/reset-password`;
  console.log('Reset Password URL ->', url);

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, newPassword }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || `Błąd ${res.status}`);

  return data;
}