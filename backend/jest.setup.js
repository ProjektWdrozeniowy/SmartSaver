// Setup file for Jest tests
// This runs before each test file

// Mock environment variables for testing
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key-for-jwt-tokens';
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
process.env.DATABASE_URL = process.env.DATABASE_URL || 'mysql://test:test@localhost:3306/test';
