// Health check tests
const request = require('supertest');
const express = require('express');
const healthController = require('@controllers/healthController');

// Create test app
const app = express();
app.get('/api/health', healthController.getHealth);

describe('Health Check API', () => {
  it('should return health status', async () => {
    const response = await request(app)
      .get('/api/health')
      .expect(200);

    expect(response.body).toHaveProperty('message', 'Server is running');
    expect(response.body).toHaveProperty('status', 'healthy');
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body).toHaveProperty('uptime');
    expect(typeof response.body.uptime).toBe('number');
  });
});
