// backend/server.cjs
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { z } = require('zod');
const argon2 = require('argon2');
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

// --- Middleware
app.use(helmet());
app.use(express.json({ limit: '10kb' }));

// ✅ Naprawiony CORS (działa z Vite:5173 → backend:4000)
const ALLOWED_ORIGIN = process.env.APP_ORIGIN || 'http://localhost:5173';
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  res.header('Vary', 'Origin');
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204); // szybka odpowiedź na preflight
  }
  next();
});

app.use(rateLimit({ windowMs: 60_000, max: 60 }));

// --- Walidacja danych rejestracji
const RegisterSchema = z.object({
  username: z.string().min(3).max(32).regex(/^[a-zA-Z0-9._-]+$/),
  email: z.string().email().max(254),
  password: z.string().min(6).max(72),
});

// --- Status / health
app.get('/', (_req, res) => {
  res
    .type('html')
    .send(`<h1>Auth API ✅</h1><p>POST <code>/api/register</code></p><p><a href="/healthz">/healthz</a></p>`);
});

app.get('/healthz', (_req, res) => res.json({ ok: true }));

// --- Rejestracja użytkownika
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = RegisterSchema.parse(req.body);

    // sprawdź czy użytkownik lub email już istnieje
    const exists = await prisma.account.findFirst({
      where: { OR: [{ username }, { email }] },
      select: { id: true, username: true, email: true },
    });

    if (exists) {
      return res.status(409).json({
        ok: false,
        message:
          exists.username === username
            ? 'Nazwa użytkownika zajęta'
            : 'Email zajęty',
      });
    }

    // haszowanie hasła
    const passwordHash = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 19456,
      timeCost: 2,
      parallelism: 1,
    });

    // zapis w bazie danych
    const account = await prisma.account.create({
      data: { username, email, passwordHash },
      select: { id: true, username: true, email: true },
    });

    res.status(201).json({ ok: true, account });
  } catch (err) {
    if (err?.name === 'ZodError') {
      return res.status(400).json({
        ok: false,
        message: 'Błędne dane',
        issues: err.issues?.map((i) => ({
          path: i.path,
          message: i.message,
        })),
      });
    }
    console.error('[REGISTER_ERROR]', err);
    res.status(500).json({ ok: false, message: 'Błąd serwera' });
  }
});

// --- Start
const port = Number(process.env.PORT || 4000);
app.listen(port, () => {
  console.log(`✅ Auth API działa na http://localhost:${port}`);
});

// --- Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});