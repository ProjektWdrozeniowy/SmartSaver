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

// Categories and Expenses validation
const CategorySchema = z.object({
  name: z.string().min(1).max(100),
  color: z.string().regex(/^#([0-9A-Fa-f]{6})$/),
  icon: z.string().min(1).max(4)
});

const ExpenseSchema = z.object({
  name: z.string().min(1).max(200),
  categoryId: z.number().int().positive(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  amount: z.number().positive(),
  description: z.string().max(1000).optional()
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

    // create default categories for new user
    try {
      const defaultCategories = [
        { name: 'Jedzenie', color: '#ff6b9d', icon: '🍕' },
        { name: 'Transport', color: '#00f0ff', icon: '🚗' },
        { name: 'Rozrywka', color: '#a8e6cf', icon: '🎬' },
        { name: 'Rachunki', color: '#ffd93d', icon: '⚡' },
        { name: 'Zakupy', color: '#c77dff', icon: '🛒' }
      ];

      // map to include userId
      const categoriesToCreate = defaultCategories.map((c) => ({ ...c, userId: newUser.id }));
      await prisma.category.createMany({ data: categoriesToCreate });
    } catch (err) {
      console.warn('Warning: could not create default categories', err?.message || err);
    }

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

// -------------------- Categories --------------------
// GET /api/categories
app.get('/api/categories', authenticateToken, async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ ok: true, categories });
  } catch (err) {
    console.error('[GET_CATEGORIES_ERROR]', err);
    res.status(500).json({ ok: false, message: 'Błąd serwera' });
  }
});

// POST /api/categories
app.post('/api/categories', authenticateToken, async (req, res) => {
  try {
    const { name, color, icon } = CategorySchema.parse(req.body);

    const exists = await prisma.category.findFirst({ where: { userId: req.user.id, name } });
    if (exists) {
      return res.status(400).json({ ok: false, message: 'Kategoria o tej nazwie już istnieje' });
    }

    const category = await prisma.category.create({
      data: { userId: req.user.id, name, color, icon }
    });

    res.status(201).json({ message: 'Kategoria została dodana', category });
  } catch (err) {
    console.error('[CREATE_CATEGORY_ERROR]', err);
    if (err?.name === 'ZodError') {
      return res.status(400).json({ ok: false, message: 'Nieprawidłowe dane' });
    }
    res.status(500).json({ ok: false, message: 'Błąd serwera' });
  }
});

// -------------------- Expenses --------------------
// GET /api/expenses?month=YYYY-MM
app.get('/api/expenses', authenticateToken, async (req, res) => {
  try {
    const { month } = req.query;
    const where = { userId: req.user.id };

    if (month) {
      // month expected format YYYY-MM
      const [y, m] = String(month).split('-').map(Number);
      if (!y || !m) return res.status(400).json({ ok: false, message: 'Nieprawidłowy format miesiąca' });
      const start = new Date(Date.UTC(y, m - 1, 1));
      const end = new Date(Date.UTC(y, m, 0, 23, 59, 59, 999));
      where.date = { gte: start, lte: end };
    }

    const expenses = await prisma.expense.findMany({
      where,
      orderBy: { date: 'desc' }
    });

    // format dates to YYYY-MM-DD
    const formatted = expenses.map((e) => ({
      id: e.id,
      name: e.name,
      categoryId: e.categoryId,
      date: e.date.toISOString().split('T')[0],
      description: e.description,
      amount: e.amount
    }));

    res.json({ expenses: formatted });
  } catch (err) {
    console.error('[GET_EXPENSES_ERROR]', err);
    res.status(500).json({ ok: false, message: 'Błąd serwera' });
  }
});

// POST /api/expenses
app.post('/api/expenses', authenticateToken, async (req, res) => {
  try {
    const parsed = ExpenseSchema.parse(req.body);

    // check category exists and belongs to user
    const category = await prisma.category.findUnique({ where: { id: parsed.categoryId } });
    if (!category || category.userId !== req.user.id) {
      return res.status(400).json({ ok: false, message: 'Nieprawidłowa kategoria' });
    }

    const created = await prisma.expense.create({
      data: {
        userId: req.user.id,
        categoryId: parsed.categoryId,
        name: parsed.name,
        amount: parsed.amount,
        date: new Date(parsed.date),
        description: parsed.description || null
      }
    });

    res.status(201).json({ message: 'Wydatek został dodany', expense: created });
  } catch (err) {
    console.error('[CREATE_EXPENSE_ERROR]', err);
    if (err?.name === 'ZodError') {
      return res.status(400).json({ ok: false, message: 'Nieprawidłowe dane' });
    }
    res.status(500).json({ ok: false, message: 'Błąd serwera' });
  }
});

// PUT /api/expenses/:id
app.put('/api/expenses/:id', authenticateToken, async (req, res) => {
  try {
    const expenseId = Number(req.params.id);
    if (!expenseId) return res.status(400).json({ ok: false, message: 'Nieprawidłowe id' });

    const parsed = ExpenseSchema.parse(req.body);

    const existing = await prisma.expense.findUnique({ where: { id: expenseId } });
    if (!existing || existing.userId !== req.user.id) {
      return res.status(404).json({ message: 'Wydatek nie został znaleziony' });
    }

    const category = await prisma.category.findUnique({ where: { id: parsed.categoryId } });
    if (!category || category.userId !== req.user.id) {
      return res.status(400).json({ ok: false, message: 'Nieprawidłowa kategoria' });
    }

    const updated = await prisma.expense.update({
      where: { id: expenseId },
      data: {
        name: parsed.name,
        categoryId: parsed.categoryId,
        amount: parsed.amount,
        date: new Date(parsed.date),
        description: parsed.description || null
      }
    });

    res.json({ message: 'Wydatek został zaktualizowany', expense: updated });
  } catch (err) {
    console.error('[UPDATE_EXPENSE_ERROR]', err);
    if (err?.name === 'ZodError') return res.status(400).json({ ok: false, message: 'Nieprawidłowe dane' });
    res.status(500).json({ ok: false, message: 'Błąd serwera' });
  }
});

// DELETE /api/expenses/:id
app.delete('/api/expenses/:id', authenticateToken, async (req, res) => {
  try {
    const expenseId = Number(req.params.id);
    if (!expenseId) return res.status(400).json({ ok: false, message: 'Nieprawidłowe id' });

    const existing = await prisma.expense.findUnique({ where: { id: expenseId } });
    if (!existing || existing.userId !== req.user.id) {
      return res.status(404).json({ message: 'Wydatek nie został znaleziony' });
    }

    await prisma.expense.delete({ where: { id: expenseId } });
    res.json({ message: 'Wydatek został usunięty' });
  } catch (err) {
    console.error('[DELETE_EXPENSE_ERROR]', err);
    res.status(500).json({ ok: false, message: 'Błąd serwera' });
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