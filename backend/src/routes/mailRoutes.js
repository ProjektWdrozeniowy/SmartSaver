const express = require('express');
const { body } = require('express-validator');
const mailController = require('../controllers/mailController');

const router = express.Router();

/**
 * POST /api/mail/contact
 * Endpoint do wysyłania wiadomości kontaktowej
 *
 * Body:
 * - name: string (wymagane, min 2 znaki)
 * - email: string (wymagane, poprawny format email)
 * - subject: string (wymagane, min 3 znaki)
 * - message: string (wymagane, min 10 znaków)
 */
router.post(
  '/contact',
  [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Imię jest wymagane')
      .isLength({ min: 2 })
      .withMessage('Imię musi mieć minimum 2 znaki'),

    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email jest wymagany')
      .isEmail()
      .withMessage('Nieprawidłowy format adresu email')
      .normalizeEmail(),

    body('subject')
      .trim()
      .notEmpty()
      .withMessage('Temat jest wymagany')
      .isLength({ min: 3 })
      .withMessage('Temat musi mieć minimum 3 znaki'),

    body('message')
      .trim()
      .notEmpty()
      .withMessage('Wiadomość jest wymagana')
      .isLength({ min: 10 })
      .withMessage('Wiadomość musi mieć minimum 10 znaków')
      .isLength({ max: 5000 })
      .withMessage('Wiadomość nie może być dłuższa niż 5000 znaków'),
  ],
  mailController.sendContactMessage
);

module.exports = router;
