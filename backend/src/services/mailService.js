const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

/**
 * Konfiguracja transportera nodemailer dla Gmail SMTP
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // SSL
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });
};

/**
 * Wysyła email z podaną treścią HTML
 * @param {string} to - Adres odbiorcy
 * @param {string} subject - Temat wiadomości
 * @param {string} mailTemplate - Treść maila w formie HTML string
 * @returns {Promise<Object>} - Informacje o wysłanej wiadomości
 */
const sendEmail = async (to, subject, mailTemplate) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: {
        name: 'SmartSaver',
        address: process.env.EMAIL_ADDRESS,
      },
      to: to,
      subject: subject,
      html: mailTemplate,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email wysłany pomyślnie:', info.messageId);
    return info;
  } catch (error) {
    console.error('Błąd podczas wysyłania emaila:', error);
    throw new Error('Nie udało się wysłać emaila: ' + error.message);
  }
};

/**
 * Wysyła email kontaktowy z danymi z formularza
 * @param {string} name - Imię nadawcy
 * @param {string} email - Email nadawcy
 * @param {string} subject - Temat wiadomości
 * @param {string} message - Treść wiadomości
 * @returns {Promise<Object>} - Informacje o wysłanej wiadomości
 */
const sendContactEmail = async (name, email, subject, message) => {
  try {
    // Wczytaj szablon Handlebars
    const templatePath = path.join(__dirname, '../templates/contact.hbs');
    const templateSource = fs.readFileSync(templatePath, 'utf8');

    // Kompiluj szablon
    const template = handlebars.compile(templateSource);

    // Przygotuj dane dla szablonu
    const templateData = {
      name: name,
      email: email,
      subject: subject,
      message: message,
    };

    // Wygeneruj HTML z szablonu
    const htmlContent = template(templateData);

    // Wyślij email do administratora
    const emailSubject = `[Kontakt] ${subject}`;
    const result = await sendEmail(process.env.EMAIL_ADDRESS, emailSubject, htmlContent);

    return result;
  } catch (error) {
    console.error('Błąd podczas wysyłania emaila kontaktowego:', error);
    throw error;
  }
};

module.exports = {
  sendEmail,
  sendContactEmail,
};
