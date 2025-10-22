// backend/middleware/auth.js
require('dotenv').config();
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Middleware do weryfikacji JWT tokenu
 * Dodaje zdekodowane dane użytkownika do req.user
 */
function authenticateToken(req, res, next) {
  // Pobierz token z nagłówka Authorization
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({
      ok: false,
      message: 'Brak tokenu autoryzacji'
    });
  }

  // Weryfikuj token
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error('Token verification error:', err.message);
      return res.status(403).json({
        ok: false,
        message: 'Nieprawidłowy lub wygasły token'
      });
    }

    // Dodaj dane użytkownika do request
    req.user = user;
    next();
  });
}

/**
 * Opcjonalny middleware - weryfikuje token jeśli istnieje,
 * ale pozwala na kontynuację nawet jeśli token nie został podany
 */
function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (!err) {
      req.user = user;
    }
    next();
  });
}

module.exports = {
  authenticateToken,
  optionalAuth
};
