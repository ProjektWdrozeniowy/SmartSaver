const request = require('supertest');
const express = require('express');

// Create a minimal test app with just the healthcheck endpoint
const app = express();
app.use(express.json());

app.get('/healthz', (_req, res) => res.json({ ok: true }));

describe('Healthcheck Endpoint', () => {
  it('GET /healthz should return 200 with ok status', async () => {
    const response = await request(app)
      .get('/healthz')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toEqual({ ok: true });
  });

  it('GET /healthz should respond quickly', async () => {
    const start = Date.now();
    await request(app).get('/healthz');
    const duration = Date.now() - start;

    // Should respond in less than 100ms
    expect(duration).toBeLessThan(100);
  });
});
