require('dotenv').config();
const express = require('express');
const cors = require('cors');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('./middleware/auth');

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

const RegisterSchema = z.object({
  username: z.string().min(3).max(32),
  email: z.string().email(),
  password: z.string().min(8)
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
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

    // Sprawdź czy użytkownik już istnieje
    const existingUser = await prisma.account.findFirst({
      where: {
        OR: [
          { username: username },
          { email: email }
        ]
      }
    });

    if (existingUser) {
      return res.status(409).json({ ok: false, message: 'Użytkownik już istnieje' });
    }

    const passwordHash = await argon2.hash(password);
    const newUser = await prisma.account.create({
      data: {
        username,
        email,
        passwordHash
      }
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