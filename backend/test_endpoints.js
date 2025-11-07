// Simple test script to exercise register -> categories -> expenses
// Usage: node test_endpoints.js
const http = require('http');

function req(method, path, data, token) {
  return new Promise((resolve, reject) => {
    const body = data ? JSON.stringify(data) : null;
    const options = {
      hostname: 'localhost',
      port: 4000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    if (body) options.headers['Content-Length'] = Buffer.byteLength(body);
    if (token) options.headers['Authorization'] = `Bearer ${token}`;

    const r = http.request(options, (res) => {
      let d = '';
      res.on('data', (c) => (d += c));
      res.on('end', () => {
        let parsed = null;
        try { parsed = JSON.parse(d); } catch (e) { parsed = d; }
        resolve({ status: res.statusCode, body: parsed });
      });
    });
    r.on('error', reject);
    if (body) r.write(body);
    r.end();
  });
}

(async () => {
  try {
    const email = `test+${Date.now()}@example.com`;
    console.log('Registering user', email);
    const reg = await req('POST', '/api/register', { username: 'testuser', email, password: 'password123' });
    console.log('Register status', reg.status);
    console.log(reg.body);
    if (!reg.body || !reg.body.token) {
      console.error('Registration failed, aborting tests');
      process.exit(1);
    }
    const token = reg.body.token;

    // GET categories
    const cats = await req('GET', '/api/categories', null, token);
    console.log('\nGET /api/categories', cats.status);
    console.log(cats.body);

    // POST category
    const newCat = { name: 'Sport', color: '#84dcc6', icon: '🏋️' };
    const createCat = await req('POST', '/api/categories', newCat, token);
    console.log('\nPOST /api/categories', createCat.status);
    console.log(createCat.body);

    // pick a category id (first existing)
    const catId = (cats.body && cats.body.categories && cats.body.categories[0] && cats.body.categories[0].id) || (createCat.body && createCat.body.category && createCat.body.category.id);
    if (!catId) {
      console.error('No category id available, aborting');
      process.exit(1);
    }

    // POST expense
    const expensePayload = { name: 'Zakupy spozywcze', categoryId: catId, date: '2025-10-23', amount: 125.5, description: 'Testowy wydatek' };
    const createExp = await req('POST', '/api/expenses', expensePayload, token);
    console.log('\nPOST /api/expenses', createExp.status);
    console.log(createExp.body);

    const expId = createExp.body && createExp.body.expense && createExp.body.expense.id;
    if (!expId) {
      console.error('Expense creation failed, aborting');
      process.exit(1);
    }

    // GET expenses
    const getExp = await req('GET', '/api/expenses', null, token);
    console.log('\nGET /api/expenses', getExp.status);
    console.log(getExp.body);

    // PUT expense
    const upd = { name: 'Zakupy spozywcze - updated', categoryId: catId, date: '2025-10-23', amount: 150.0, description: 'Zaktualizowany' };
    const putExp = await req('PUT', `/api/expenses/${expId}`, upd, token);
    console.log(`\nPUT /api/expenses/${expId}`, putExp.status);
    console.log(putExp.body);

    // DELETE expense
    const delExp = await req('DELETE', `/api/expenses/${expId}`, null, token);
    console.log(`\nDELETE /api/expenses/${expId}`, delExp.status);
    console.log(delExp.body);

    console.log('\nAll tests completed');
    process.exit(0);
  } catch (err) {
    console.error('Test script error', err);
    process.exit(1);
  }
})();
