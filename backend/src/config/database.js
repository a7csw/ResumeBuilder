/**
 * Database Connection Configuration
 * Handles MongoDB connection using Mongoose
 */

const mongoose = require('mongoose');
const config = require('./config');

/**
 * Connect to MongoDB database
 * @returns {Promise<void>}
 */
const connectDatabase = async () => {
  try {
    const conn = await mongoose.connect(config.database.uri, config.database.options);
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        console.log('📴 MongoDB connection closed through app termination');
        process.exit(0);
      } catch (err) {
        console.error('❌ Error during database shutdown:', err);
        process.exit(1);
      }
    });

  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    
    // Provide helpful error messages
    if (error.message.includes('ENOTFOUND') || error.message.includes('querySrv')) {
      console.error('🔍 This looks like a DNS/connection issue:');
      console.error('   1. Check your MONGODB_URI environment variable');
      console.error('   2. Make sure you have a real MongoDB Atlas cluster');
      console.error('   3. See MONGODB_SETUP.md for step-by-step setup');
      console.error('   4. Verify your cluster URL is correct');
    } else if (error.message.includes('authentication failed')) {
      console.error('🔐 Authentication failed:');
      console.error('   1. Check your username and password in MONGODB_URI');
      console.error('   2. Make sure the database user exists in MongoDB Atlas');
      console.error('   3. Verify the password is correct');
    } else if (error.message.includes('IP not in whitelist')) {
      console.error('🚫 IP Address not allowed:');
      console.error('   1. Go to MongoDB Atlas → Network Access');
      console.error('   2. Add IP address: 0.0.0.0/0 (allow all)');
      console.error('   3. Or whitelist Render\'s specific IP addresses');
    }
    
    console.error('📖 Full setup guide: backend/MONGODB_SETUP.md');
    
    // Exit process with failure
    process.exit(1);
  }
};

/**
 * Disconnect from MongoDB database
 * @returns {Promise<void>}
 */
const disconnectDatabase = async () => {
  try {
    await mongoose.connection.close();
    console.log('📴 MongoDB connection closed');
  } catch (error) {
    console.error('❌ Error closing MongoDB connection:', error);
  }
};

/**
 * Check database connection health
 * @returns {Object} Connection status
 */
const getDatabaseStatus = () => {
  const state = mongoose.connection.readyState;
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  return {
    status: states[state] || 'unknown',
    host: mongoose.connection.host || 'unknown',
    name: mongoose.connection.name || 'unknown',
  };
};

module.exports = {
  connectDatabase,
  disconnectDatabase,
  getDatabaseStatus,
};
