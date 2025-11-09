// Simple API test script
const BASE_URL = 'http://localhost:4000/api';

let authToken = '';
let testUserId = 0;
let testCategoryId = 0;
let testExpenseId = 0;
let testIncomeId = 0;
let testGoalId = 0;

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (authToken && !options.skipAuth) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    const data = await response.json();
    return { ok: response.ok, status: response.status, data };
  } catch (error) {
    console.error(`Error calling ${endpoint}:`, error.message);
    return { ok: false, status: 0, error: error.message };
  }
}

async function testAuth() {
  console.log('\n=== Testing Authentication ===');

  // Test registration with unique email
  const timestamp = Date.now();
  const testEmail = `test${timestamp}@example.com`;

  console.log('1. Testing registration...');
  const registerResult = await request('/register', {
    method: 'POST',
    skipAuth: true,
    body: JSON.stringify({
      username: `TestUser${timestamp}`,
      email: testEmail,
      password: 'testpassword123'
    })
  });

  if (registerResult.ok) {
    console.log('✓ Registration successful');
    authToken = registerResult.data.token;
    testUserId = registerResult.data.user.id;
  } else {
    console.log('✗ Registration failed:', registerResult.data);
    return false;
  }

  // Test login
  console.log('2. Testing login...');
  const loginResult = await request('/login', {
    method: 'POST',
    skipAuth: true,
    body: JSON.stringify({
      email: testEmail,
      password: 'testpassword123'
    })
  });

  if (loginResult.ok) {
    console.log('✓ Login successful');
  } else {
    console.log('✗ Login failed:', loginResult.data);
    return false;
  }

  return true;
}

async function testCategories() {
  console.log('\n=== Testing Categories ===');

  // Get default categories (should exist after registration)
  console.log('1. Getting categories...');
  const getCategoriesResult = await request('/categories');

  if (getCategoriesResult.ok && getCategoriesResult.data.categories) {
    console.log(`✓ Got ${getCategoriesResult.data.categories.length} categories`);
    if (getCategoriesResult.data.categories.length > 0) {
      testCategoryId = getCategoriesResult.data.categories[0].id;
    }
  } else {
    console.log('✗ Get categories failed:', getCategoriesResult.data);
  }

  // Create a new category
  console.log('2. Creating new category...');
  const createCategoryResult = await request('/categories', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Test Category',
      color: '#ff0000',
      icon: '🧪'
    })
  });

  if (createCategoryResult.ok) {
    console.log('✓ Category created successfully');
  } else {
    console.log('✗ Create category failed:', createCategoryResult.data);
  }
}

async function testExpenses() {
  console.log('\n=== Testing Expenses ===');

  // Create expense
  console.log('1. Creating expense...');
  const createExpenseResult = await request('/expenses', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Test Expense',
      categoryId: testCategoryId,
      date: '2025-11-07',
      amount: 100.50,
      description: 'Test expense description'
    })
  });

  if (createExpenseResult.ok) {
    console.log('✓ Expense created successfully');
    testExpenseId = createExpenseResult.data.expense.id;
  } else {
    console.log('✗ Create expense failed:', createExpenseResult.data);
  }

  // Get expenses
  console.log('2. Getting expenses...');
  const getExpensesResult = await request('/expenses');

  if (getExpensesResult.ok) {
    console.log(`✓ Got ${getExpensesResult.data.expenses.length} expenses`);
  } else {
    console.log('✗ Get expenses failed:', getExpensesResult.data);
  }
}

async function testBudget() {
  console.log('\n=== Testing Budget/Income ===');

  // Create income
  console.log('1. Creating income...');
  const createIncomeResult = await request('/budget/income', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Test Income',
      amount: 5000.00,
      date: '2025-11-07',
      description: 'Test income description'
    })
  });

  if (createIncomeResult.ok) {
    console.log('✓ Income created successfully');
    testIncomeId = createIncomeResult.data.income.id;
  } else {
    console.log('✗ Create income failed:', createIncomeResult.data);
  }

  // Get incomes
  console.log('2. Getting incomes...');
  const getIncomesResult = await request('/budget/income');

  if (getIncomesResult.ok) {
    console.log(`✓ Got ${getIncomesResult.data.incomes.length} incomes`);
  } else {
    console.log('✗ Get incomes failed:', getIncomesResult.data);
  }

  // Get budget summary
  console.log('3. Getting budget summary...');
  const getSummaryResult = await request('/budget/summary');

  if (getSummaryResult.ok) {
    console.log('✓ Budget summary retrieved:', getSummaryResult.data);
  } else {
    console.log('✗ Get budget summary failed:', getSummaryResult.data);
  }
}

async function testGoals() {
  console.log('\n=== Testing Goals ===');

  // Create goal
  console.log('1. Creating goal...');
  const createGoalResult = await request('/goals', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Test Goal',
      targetAmount: 10000.00,
      currentAmount: 0,
      dueDate: '2026-12-31',
      description: 'Test goal description'
    })
  });

  if (createGoalResult.ok) {
    console.log('✓ Goal created successfully');
    testGoalId = createGoalResult.data.goal.id;
  } else {
    console.log('✗ Create goal failed:', createGoalResult.data);
  }

  // Add contribution
  if (testGoalId) {
    console.log('2. Adding contribution to goal...');
    const contributeResult = await request(`/goals/${testGoalId}/contribute`, {
      method: 'POST',
      body: JSON.stringify({
        amount: 500.00
      })
    });

    if (contributeResult.ok) {
      console.log('✓ Contribution added successfully');
    } else {
      console.log('✗ Add contribution failed:', contributeResult.data);
    }
  }
}

async function testDashboard() {
  console.log('\n=== Testing Dashboard ===');

  // Get stats
  console.log('1. Getting dashboard stats...');
  const getStatsResult = await request('/dashboard/stats');

  if (getStatsResult.ok) {
    console.log(`✓ Got ${getStatsResult.data.stats.length} stats`);
  } else {
    console.log('✗ Get dashboard stats failed:', getStatsResult.data);
  }

  // Get transactions
  console.log('2. Getting recent transactions...');
  const getTransactionsResult = await request('/dashboard/transactions?limit=5');

  if (getTransactionsResult.ok) {
    console.log(`✓ Got ${getTransactionsResult.data.transactions.length} transactions`);
  } else {
    console.log('✗ Get transactions failed:', getTransactionsResult.data);
  }

  // Get expenses by category
  console.log('3. Getting expenses by category...');
  const getExpensesByCategoryResult = await request('/dashboard/expenses-by-category');

  if (getExpensesByCategoryResult.ok) {
    console.log(`✓ Got ${getExpensesByCategoryResult.data.categories.length} categories with expenses`);
  } else {
    console.log('✗ Get expenses by category failed:', getExpensesByCategoryResult.data);
  }
}

async function testAnalysis() {
  console.log('\n=== Testing Analysis ===');

  // Get statistics
  console.log('1. Getting analysis statistics...');
  const getStatsResult = await request('/analysis/statistics?period=last6months');

  if (getStatsResult.ok) {
    console.log('✓ Analysis statistics retrieved');
  } else {
    console.log('✗ Get analysis statistics failed:', getStatsResult.data);
  }

  // Get savings growth
  console.log('2. Getting savings growth...');
  const getSavingsGrowthResult = await request('/analysis/savings-growth?period=last6months');

  if (getSavingsGrowthResult.ok) {
    console.log('✓ Savings growth data retrieved');
  } else {
    console.log('✗ Get savings growth failed:', getSavingsGrowthResult.data);
  }

  // Get income vs expenses
  console.log('3. Getting income vs expenses...');
  const getIncomeVsExpensesResult = await request('/analysis/income-vs-expenses?period=last6months');

  if (getIncomeVsExpensesResult.ok) {
    console.log('✓ Income vs expenses data retrieved');
  } else {
    console.log('✗ Get income vs expenses failed:', getIncomeVsExpensesResult.data);
  }
}

async function testUser() {
  console.log('\n=== Testing User/Settings ===');

  // Get profile
  console.log('1. Getting user profile...');
  const getProfileResult = await request('/user/profile');

  if (getProfileResult.ok) {
    console.log('✓ User profile retrieved');
  } else {
    console.log('✗ Get user profile failed:', getProfileResult.data);
  }

  // Get notifications settings
  console.log('2. Getting notification settings...');
  const getNotificationsResult = await request('/user/notifications');

  if (getNotificationsResult.ok) {
    console.log('✓ Notification settings retrieved');
  } else {
    console.log('✗ Get notifications failed:', getNotificationsResult.data);
  }
}

async function runTests() {
  console.log('Starting API Tests...\n');

  const authSuccess = await testAuth();
  if (!authSuccess) {
    console.log('\n❌ Authentication tests failed. Stopping tests.');
    return;
  }

  await testCategories();
  await testExpenses();
  await testBudget();
  await testGoals();
  await testDashboard();
  await testAnalysis();
  await testUser();

  console.log('\n✅ All tests completed!');
}

runTests().catch(console.error);
