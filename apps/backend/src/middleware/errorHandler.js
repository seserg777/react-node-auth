// Centralized error handler middleware
function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;
  const isOperational = Boolean(err.isOperational);
  const message = err.message || 'Internal server error';

  if (process.env.NODE_ENV !== 'test') {
    // eslint-disable-next-line no-console
    console.error('Error:', {
      method: req.method,
      url: req.originalUrl,
      status,
      message,
      stack: err.stack,
    });
  }

  res.status(status).json({
    error: message,
    status,
    ok: false,
  });
}

module.exports = { errorHandler };


