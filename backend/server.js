const express = require('express');
const cors = require('cors');
const argon2 = require('argon2');
const { z } = require('zod');

const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

const users = [];

const RegisterSchema = z.object({
  username: z.string().min(3).max(32),
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
    const { username, email, password } = RegisterSchema.parse(req.body);

    if (users.find(u => u.username === username || u.email === email)) {
      return res.status(409).json({ ok: false, message: 'Użytkownik już istnieje' });
    }

    const passwordHash = await argon2.hash(password);
    const newUser = { id: users.length + 1, username, email, passwordHash };
    users.push(newUser);

    res.status(201).json({ ok: true, user: { id: newUser.id, username, email } });
  } catch (err) {
    res.status(400).json({ ok: false, message: err.message });
  }
});

app.listen(4000, () => console.log('✅ Backend działa na http://localhost:4000'));