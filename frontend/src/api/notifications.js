// src/api/notifications.js
import { getToken } from './auth';

const BASE_URL =
  (import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.replace(/\/+$/, '')) ||
  'http://localhost:4000';

// Get all notifications
export const getNotifications = async (filter = 'all') => {
  const token = getToken();
  if (!token) {
    throw new Error('Brak tokenu autoryzacji');
  }

  const url = filter && filter !== 'all' ? `${BASE_URL}/api/notifications?filter=${filter}` : `${BASE_URL}/api/notifications`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Nie udało się pobrać powiadomień');
  }

  return response.json();
};

// Mark notification as read
export const markNotificationAsRead = async (notificationId) => {
  const token = getToken();
  if (!token) {
    throw new Error('Brak tokenu autoryzacji');
  }

  const response = await fetch(`${BASE_URL}/api/notifications/${notificationId}/read`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Nie udało się oznaczyć powiadomienia');
  }

  return response.json();
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async () => {
  const token = getToken();
  if (!token) {
    throw new Error('Brak tokenu autoryzacji');
  }

  const response = await fetch(`${BASE_URL}/api/notifications/read-all`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Nie udało się oznaczyć powiadomień');
  }

  return response.json();
};

// Delete a notification
export const deleteNotification = async (notificationId) => {
  const token = getToken();
  if (!token) {
    throw new Error('Brak tokenu autoryzacji');
  }

  const response = await fetch(`${BASE_URL}/api/notifications/${notificationId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Nie udało się usunąć powiadomienia');
  }

  return response.json();
};

// Delete all notifications
export const deleteAllNotifications = async () => {
  const token = getToken();
  if (!token) {
    throw new Error('Brak tokenu autoryzacji');
  }

  const response = await fetch(`${BASE_URL}/api/notifications`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Nie udało się usunąć powiadomień');
  }

  return response.json();
};

// Check and create goal reminders
export const checkGoalReminders = async () => {
  const token = getToken();
  if (!token) {
    throw new Error('Brak tokenu autoryzacji');
  }

  const response = await fetch(`${BASE_URL}/api/notifications/check-goal-reminders`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Nie udało się sprawdzić przypomnień');
  }

  return response.json();
};
