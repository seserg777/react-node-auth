// Simple tests that don't require database
const { asyncHandler } = require('@utils/asyncHandler');
const { errorHandler } = require('@middleware/errorHandler');

describe('Simple Tests', () => {
  describe('asyncHandler', () => {
    it('should handle sync functions', () => {
      const syncFn = (req, res, next) => {
        res.json({ success: true });
      };

      const wrappedFn = asyncHandler(syncFn);
      const req = {};
      const res = { json: jest.fn() };
      const next = jest.fn();

      wrappedFn(req, res, next);

      expect(res.json).toHaveBeenCalledWith({ success: true });
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle async functions', async () => {
      const asyncFn = async (req, res, next) => {
        res.json({ success: true });
      };

      const wrappedFn = asyncHandler(asyncFn);
      const req = {};
      const res = { json: jest.fn() };
      const next = jest.fn();

      await wrappedFn(req, res, next);

      expect(res.json).toHaveBeenCalledWith({ success: true });
      expect(next).not.toHaveBeenCalled();
    });

    it('should catch async errors', async () => {
      const asyncFn = async (req, res, next) => {
        throw new Error('Test error');
      };

      const wrappedFn = asyncHandler(asyncFn);
      const req = {};
      const res = {};
      const next = jest.fn();

      await wrappedFn(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('errorHandler', () => {
    it('should handle errors with status', () => {
      const error = new Error('Test error');
      error.status = 400;
      
      const req = { method: 'GET', originalUrl: '/test' };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Test error',
        status: 400,
        ok: false
      });
    });

    it('should use default status 500', () => {
      const error = new Error('Test error');
      
      const req = { method: 'GET', originalUrl: '/test' };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Test error',
        status: 500,
        ok: false
      });
    });
  });
});
