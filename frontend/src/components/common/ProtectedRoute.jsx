// src/components/common/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { getToken } from '../../api/auth';

/**
 * Komponent chroniący route - wymaga zalogowania
 * Jeśli użytkownik nie jest zalogowany, przekierowuje do /signin
 */
const ProtectedRoute = ({ children }) => {
  const token = getToken();

  if (!token) {
    // Użytkownik nie jest zalogowany - przekieruj do logowania
    return <Navigate to="/signin" replace />;
  }

  // Użytkownik zalogowany - pokaż chronioną stronę
  return children;
};

export default ProtectedRoute;
