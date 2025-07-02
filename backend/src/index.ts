import app from './app';
import { testConnection } from './config/database';

const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    // Test database connection
    await testConnection();
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🌾 Field API: http://localhost:${PORT}/api/field`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer(); 