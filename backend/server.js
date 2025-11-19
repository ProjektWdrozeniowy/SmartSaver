require('dotenv').config();
const express = require('express');
const cors = require('cors');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('./middleware/auth');
const mailRoutes = require('./src/routes/mailRoutes');

const prisma = new PrismaClient();
const app = express();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Funkcja pomocnicza do generowania JWT
function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

// Elastyczna konfiguracja CORS dla development
app.use(cors({
  origin: (origin, callback) => {
    // Pozwól na requesty bez origin (np. Postman, curl)
    if (!origin) return callback(null, true);
    // Pozwól na wszystkie localhost i 127.0.0.1 na dowolnym porcie
    if (origin.match(/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/)) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json());

// Mail routes
app.use('/api/mail', mailRoutes);

const RegisterSchema = z.object({
  username: z.string().min(3).max(32),
  email: z.string().email(),
  password: z.string().min(8)
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

const ForgotPasswordSchema = z.object({
  email: z.string().email()
});

const ResetPasswordSchema = z.object({
  token: z.string().min(1),
  newPassword: z.string().min(8)
});

// 👇 tu dodajesz
app.get('/', (_req, res) => {
  res.type('html').send(`
    <h1>Auth API działa ✅</h1>
    <p>POST <code>/api/register</code> aby zarejestrować użytkownika.</p>
    <p>Healthcheck: <a href="/healthz">/healthz</a></p>
  `);
});

app.get('/healthz', (_req, res) => res.json({ ok: true }));

app.post('/api/register', async (req, res) => {
  try {
    console.log('Received registration request:', req.body);
    const { username, email, password } = RegisterSchema.parse(req.body);

    // Sprawdź czy email już istnieje (username może się powtarzać)
    const existingUser = await prisma.account.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(409).json({ ok: false, message: 'Użytkownik z tym adresem email już istnieje' });
    }

    const passwordHash = await argon2.hash(password);
    const newUser = await prisma.account.create({
      data: {
        username,
        email,
        passwordHash
      }
    });

    // Create default categories for the new user
    const defaultCategories = [
      { name: 'Jedzenie', color: '#ff6b9d', icon: '🍕' },
      { name: 'Transport', color: '#00f0ff', icon: '🚗' },
      { name: 'Rozrywka', color: '#a8e6cf', icon: '🎬' },
      { name: 'Rachunki', color: '#ffd93d', icon: '⚡' },
      { name: 'Zakupy', color: '#c77dff', icon: '🛒' }
    ];

    await prisma.category.createMany({
      data: defaultCategories.map(cat => ({
        userId: newUser.id,
        ...cat
      }))
    });

    // Generuj JWT token
    const token = generateToken(newUser);

    console.log('User registered successfully:', { id: newUser.id, username, email });
    res.status(201).json({
      ok: true,
      token,
      user: { id: newUser.id, username, email }
    });
  } catch (err) {
    console.error('Registration error:', err);
    if (err.name === 'ZodError') {
      return res.status(400).json({ ok: false, message: 'Nieprawidłowe dane: ' + err.errors.map(e => e.message).join(', ') });
    }
    res.status(400).json({ ok: false, message: err.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    console.log('Received login request:', { email: req.body.email });
    const { email, password } = LoginSchema.parse(req.body);

    const user = await prisma.account.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ ok: false, message: 'Nieprawidłowy email lub hasło' });
    }

    const isPasswordValid = await argon2.verify(user.passwordHash, password);
    if (!isPasswordValid) {
      return res.status(401).json({ ok: false, message: 'Nieprawidłowy email lub hasło' });
    }

    // Generuj JWT token
    const token = generateToken(user);

    console.log('User logged in successfully:', { id: user.id, username: user.username });
    res.status(200).json({
      ok: true,
      token,
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (err) {
    console.error('Login error:', err);
    if (err.name === 'ZodError') {
      return res.status(400).json({ ok: false, message: 'Nieprawidłowe dane: ' + err.errors.map(e => e.message).join(', ') });
    }
    res.status(400).json({ ok: false, message: err.message });
  }
});

// Przykładowy chroniony endpoint - wymaga JWT
app.get('/api/me', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.account.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        username: true,
        email: true
      }
    });

    if (!user) {
      return res.status(404).json({ ok: false, message: 'Użytkownik nie znaleziony' });
    }

    res.json({ ok: true, user });
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ ok: false, message: 'Błąd serwera' });
  }
});

// Forgot password endpoint
app.post('/api/forgot-password', async (req, res) => {
  try {
    console.log('Received forgot password request:', { email: req.body.email });
    const { email } = ForgotPasswordSchema.parse(req.body);

    // Sprawdź czy użytkownik istnieje
    const user = await prisma.account.findUnique({
      where: { email }
    });

    // Ze względów bezpieczeństwa zawsze zwracamy sukces, nawet jeśli email nie istnieje
    // (aby nie ujawniać, które emaile są w systemie)
    if (!user) {
      console.log('User not found, but returning success for security');
      return res.status(200).json({
        ok: true,
        message: 'Jeśli konto istnieje, wysłano link do resetowania hasła'
      });
    }

    // Generuj token resetowania hasła (ważny 1 godzinę)
    const resetToken = jwt.sign(
      { id: user.id, email: user.email, purpose: 'password-reset' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // W produkcji, link powinien prowadzić do frontendu
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;

    // Wyślij email z linkiem resetującym
    const { sendEmail } = require('./src/services/mailService');

    const emailTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #0d1a2a 0%, #1a0d1f 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; padding: 15px 30px; background: #00f0ff; color: #000; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>SmartSaver</h1>
            <h2>Resetowanie hasła</h2>
          </div>
          <div class="content">
            <p>Witaj ${user.username}!</p>
            <p>Otrzymaliśmy prośbę o zresetowanie hasła do Twojego konta SmartSaver.</p>
            <p>Kliknij przycisk poniżej, aby ustawić nowe hasło:</p>
            <center>
              <a href="${resetLink}" class="button">Zresetuj hasło</a>
            </center>
            <p>Link będzie ważny przez 1 godzinę.</p>
            <p>Jeśli nie prosiłeś o reset hasła, zignoruj tę wiadomość.</p>
            <p>Pozdrawiamy,<br>Zespół SmartSaver</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} SmartSaver. Wszystkie prawa zastrzeżone.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await sendEmail(email, 'SmartSaver - Resetowanie hasła', emailTemplate);

    console.log('Password reset email sent successfully to:', email);
    res.status(200).json({
      ok: true,
      message: 'Email z linkiem do resetowania hasła został wysłany'
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    if (err.name === 'ZodError') {
      return res.status(400).json({
        ok: false,
        message: 'Nieprawidłowe dane: ' + err.errors.map(e => e.message).join(', ')
      });
    }
    res.status(500).json({
      ok: false,
      message: 'Wystąpił błąd podczas wysyłania emaila'
    });
  }
});

// Reset password endpoint
app.post('/api/reset-password', async (req, res) => {
  try {
    console.log('Received reset password request');
    const { token, newPassword } = ResetPasswordSchema.parse(req.body);

    // Zweryfikuj token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      console.error('Token verification failed:', err.message);
      return res.status(400).json({
        ok: false,
        message: 'Token jest nieprawidłowy lub wygasł'
      });
    }

    // Sprawdź czy token ma odpowiedni cel
    if (decoded.purpose !== 'password-reset') {
      return res.status(400).json({
        ok: false,
        message: 'Token nie jest tokenem resetowania hasła'
      });
    }

    // Sprawdź czy użytkownik istnieje
    const user = await prisma.account.findUnique({
      where: { id: decoded.id }
    });

    if (!user) {
      return res.status(404).json({
        ok: false,
        message: 'Użytkownik nie znaleziony'
      });
    }

    // Hashuj nowe hasło
    const newPasswordHash = await argon2.hash(newPassword);

    // Zaktualizuj hasło
    await prisma.account.update({
      where: { id: user.id },
      data: { passwordHash: newPasswordHash }
    });

    console.log('Password reset successfully for user:', user.email);
    res.status(200).json({
      ok: true,
      message: 'Hasło zostało pomyślnie zresetowane'
    });
  } catch (err) {
    console.error('Reset password error:', err);
    if (err.name === 'ZodError') {
      return res.status(400).json({
        ok: false,
        message: 'Nieprawidłowe dane: ' + err.errors.map(e => e.message).join(', ')
      });
    }
    res.status(500).json({
      ok: false,
      message: 'Wystąpił błąd podczas resetowania hasła'
    });
  }
});

// Import and use routes
console.log('Loading routes...');
const categoriesRouter = require('./routes/categories');
console.log('✓ Categories router loaded');
const expensesRouter = require('./routes/expenses');
console.log('✓ Expenses router loaded');
const budgetRouter = require('./routes/budget');
console.log('✓ Budget router loaded');
const goalsRouter = require('./routes/goals');
console.log('✓ Goals router loaded');
const dashboardRouter = require('./routes/dashboard');
console.log('✓ Dashboard router loaded');
const analysisRouter = require('./routes/analysis');
console.log('✓ Analysis router loaded');
const userRouter = require('./routes/user');
console.log('✓ User router loaded');
const notificationsRouter = require('./routes/notifications');
console.log('✓ Notifications router loaded');

console.log('Registering routes...');
app.use('/api/categories', categoriesRouter);
console.log('✓ Registered /api/categories');
app.use('/api/expenses', expensesRouter);
console.log('✓ Registered /api/expenses');
app.use('/api/budget', budgetRouter);
console.log('✓ Registered /api/budget');
app.use('/api/goals', goalsRouter);
console.log('✓ Registered /api/goals');
app.use('/api/dashboard', dashboardRouter);
console.log('✓ Registered /api/dashboard');
app.use('/api/analysis', analysisRouter);
console.log('✓ Registered /api/analysis');
app.use('/api/user', userRouter);
console.log('✓ Registered /api/user');
app.use('/api/notifications', notificationsRouter);
console.log('✓ Registered /api/notifications');
console.log('All routes registered successfully!');

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`✅ Backend działa na http://localhost:${PORT}`);
  console.log('📊 Połączono z bazą danych MySQL');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});