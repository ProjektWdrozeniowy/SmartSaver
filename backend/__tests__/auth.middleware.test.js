const jwt = require('jsonwebtoken');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key-for-jwt-tokens';

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  describe('authenticateToken', () => {
    it('should return 401 if no token is provided', () => {
      authenticateToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        ok: false,
        message: 'Brak tokenu autoryzacji'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 403 if token is invalid', (done) => {
      req.headers['authorization'] = 'Bearer invalid-token';

      authenticateToken(req, res, next);

      // Wait for async verification
      setTimeout(() => {
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
          ok: false,
          message: 'Nieprawidłowy lub wygasły token'
        });
        expect(next).not.toHaveBeenCalled();
        done();
      }, 100);
    });

    it('should call next() and attach user data if token is valid', (done) => {
      const userData = { id: 1, username: 'testuser', email: 'test@example.com' };
      const token = jwt.sign(userData, JWT_SECRET, { expiresIn: '1h' });
      req.headers['authorization'] = `Bearer ${token}`;

      authenticateToken(req, res, next);

      setTimeout(() => {
        expect(req.user).toBeDefined();
        expect(req.user.id).toBe(userData.id);
        expect(req.user.username).toBe(userData.username);
        expect(req.user.email).toBe(userData.email);
        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        done();
      }, 100);
    });
  });

  describe('optionalAuth', () => {
    it('should call next() even if no token is provided', () => {
      optionalAuth(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.user).toBeUndefined();
    });

    it('should attach user data if valid token is provided', (done) => {
      const userData = { id: 2, username: 'optionaluser', email: 'optional@example.com' };
      const token = jwt.sign(userData, JWT_SECRET, { expiresIn: '1h' });
      req.headers['authorization'] = `Bearer ${token}`;

      optionalAuth(req, res, next);

      setTimeout(() => {
        expect(req.user).toBeDefined();
        expect(req.user.id).toBe(userData.id);
        expect(next).toHaveBeenCalled();
        done();
      }, 100);
    });

    it('should call next() even if token is invalid', (done) => {
      req.headers['authorization'] = 'Bearer invalid-token';

      optionalAuth(req, res, next);

      setTimeout(() => {
        expect(next).toHaveBeenCalled();
        expect(req.user).toBeUndefined();
        done();
      }, 100);
    });
  });
});
