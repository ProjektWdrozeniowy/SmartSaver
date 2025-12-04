// src/api/settings.js
import { getToken } from './auth';

const BASE_URL =
  (import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.replace(/\/+$/, '')) ||
  '';

// Pobierz dane użytkownika
export async function getUserProfile() {
  const token = getToken();
  if (!token) {
    throw new Error('Brak tokenu autoryzacji');
  }

  const res = await fetch(`${BASE_URL}/api/user/profile`, {
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

// Zaktualizuj dane użytkownika
export async function updateUserProfile({ username, email }) {
  const token = getToken();
  if (!token) {
    throw new Error('Brak tokenu autoryzacji');
  }

  const res = await fetch(`${BASE_URL}/api/user/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ username, email }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || `Błąd ${res.status}`);

  return data;
}

// Zmień hasło
export async function changePassword({ currentPassword, newPassword }) {
  const token = getToken();
  if (!token) {
    throw new Error('Brak tokenu autoryzacji');
  }

  const res = await fetch(`${BASE_URL}/api/user/change-password`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ currentPassword, newPassword }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || `Błąd ${res.status}`);

  return data;
}

// Pobierz ustawienia powiadomień
export async function getNotificationSettings() {
  const token = getToken();
  if (!token) {
    throw new Error('Brak tokenu autoryzacji');
  }

  const res = await fetch(`${BASE_URL}/api/user/notifications`, {
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

// Zaktualizuj ustawienia powiadomień
export async function updateNotificationSettings(settings) {
  const token = getToken();
  if (!token) {
    throw new Error('Brak tokenu autoryzacji');
  }

  const res = await fetch(`${BASE_URL}/api/user/notifications`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(settings),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || `Błąd ${res.status}`);

  return data;
}

// Eksportuj dane użytkownika
export async function exportUserData() {
  const token = getToken();
  if (!token) {
    throw new Error('Brak tokenu autoryzacji');
  }

  const res = await fetch(`${BASE_URL}/api/user/export`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.message || `Błąd ${res.status}`);
  }

  return res.json();
}

// Usuń konto użytkownika
export async function deleteAccount(password) {
  const token = getToken();
  if (!token) {
    throw new Error('Brak tokenu autoryzacji');
  }

  const res = await fetch(`${BASE_URL}/api/user/delete`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ password }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || `Błąd ${res.status}`);

  return data;
}
