// Health check controller
class HealthController {
  // Get server health status
  async getHealth(req, res) {
    try {
      res.json({ 
        message: 'Server is running', 
        timestamp: new Date().toISOString(),
        status: 'healthy',
        uptime: process.uptime()
      });
    } catch (error) {
      console.error('Health check error:', error);
      res.status(500).json({ 
        error: 'Health check failed',
        status: 'unhealthy'
      });
    }
  }
}

module.exports = new HealthController();
