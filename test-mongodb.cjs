const mongoose = require('mongoose');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

async function testConnection() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    console.log('URI:', process.env.MONGODB_URI?.substring(0, 30) + '...');
    
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.MONGODB_DB_NAME || 'portfolio',
    });
    
    console.log('✅ MongoDB connected successfully!');
    console.log('Database:', mongoose.connection.db.databaseName);
    console.log('Host:', mongoose.connection.host);
    
    // Close connection
    await mongoose.connection.close();
    console.log('🔒 Connection closed');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:');
    console.error(error.message);
    process.exit(1);
  }
}

testConnection();
