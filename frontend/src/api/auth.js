// src/api/auth.js
const BASE_URL =
  (import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.replace(/\/+$/, '')) ||
  'http://localhost:4000';

export async function registerUser({ username, email, password }) {
  const url = `${BASE_URL}/api/register`;
  console.log('Register URL ->', url); // sprawdzisz w konsoli przeglądarki

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || `Błąd ${res.status}`);
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
  return data;
}