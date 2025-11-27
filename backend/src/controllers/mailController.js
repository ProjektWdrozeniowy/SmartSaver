const { validationResult } = require('express-validator');
const mailService = require('../services/mailService');

/**
 * Obsługuje wysyłanie wiadomości kontaktowej
 * POST /api/mail/contact
 */
const sendContactMessage = async (req, res) => {
  try {
    // Sprawdź wyniki walidacji
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        ok: false,
        message: 'Błąd walidacji danych',
        errors: errors.array().map(err => ({
          field: err.path,
          message: err.msg,
        })),
      });
    }

    // Pobierz dane z ciała żądania
    const { name, email, subject, message } = req.body;

    // Wyślij email kontaktowy
    await mailService.sendContactEmail(name, email, subject, message);

    // Zwróć odpowiedź sukcesu
    return res.status(201).json({
      ok: true,
      message: 'Wiadomość została wysłana pomyślnie',
    });
  } catch (error) {
    console.error('Błąd podczas wysyłania wiadomości kontaktowej:', error);
    return res.status(500).json({
      ok: false,
      message: 'Wystąpił błąd podczas wysyłania wiadomości',
      error: error.message,
      stack: error.stack,
    });
  }
};

module.exports = {
  sendContactMessage,
};
