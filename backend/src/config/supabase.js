/**
 * Supabase Client Configuration
 * Handles Supabase connection and provides database client
 */

const { createClient } = require('@supabase/supabase-js');
const config = require('./config');

/**
 * Initialize Supabase client
 */
let supabase = null;

const initializeSupabase = () => {
  try {
    // In development, allow missing Supabase config for testing
    if (config.server.nodeEnv === 'development' && (!config.supabase.url || !config.supabase.serviceRoleKey)) {
      console.warn('⚠️ Development mode: Supabase not configured, using mock client');
      supabase = null;
      return null;
    }

    if (!config.supabase.url || !config.supabase.serviceRoleKey) {
      throw new Error('Missing required Supabase configuration');
    }

    supabase = createClient(
      config.supabase.url,
      config.supabase.serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    console.log('✅ Supabase client initialized successfully');
    return supabase;

  } catch (error) {
    console.error('❌ Supabase initialization failed:', error.message);
    
    // Provide helpful error messages
    if (error.message.includes('Missing required Supabase configuration')) {
      console.error('🔍 Please check your environment variables:');
      console.error('   1. SUPABASE_URL - Your Supabase project URL');
      console.error('   2. SUPABASE_SERVICE_ROLE_KEY - Your service role key (not anon key)');
      console.error('   3. See SUPABASE_SETUP.md for complete setup guide');
    }
    
    throw error;
  }
};

/**
 * Get Supabase client instance
 * @returns {SupabaseClient} Supabase client
 */
const getSupabaseClient = () => {
  if (!supabase) {
    initializeSupabase();
  }
  return supabase;
};

/**
 * Check Supabase connection health
 * @returns {Promise<Object>} Connection status
 */
const getSupabaseStatus = async () => {
  try {
    const client = getSupabaseClient();
    
    // Test connection with a simple query
    const { data, error } = await client
      .from('profiles')
      .select('count')
      .limit(1);

    if (error) {
      return {
        status: 'error',
        message: error.message,
        connected: false
      };
    }

    return {
      status: 'connected',
      message: 'Supabase connection healthy',
      connected: true,
      url: config.supabase.url
    };

  } catch (error) {
    return {
      status: 'error',
      message: error.message,
      connected: false
    };
  }
};

/**
 * Test database operations
 */
const testDatabaseOperations = async () => {
  try {
    const client = getSupabaseClient();
    
    // If no client in development, skip test
    if (!client && config.server.nodeEnv === 'development') {
      console.log('🧪 Development mode: Skipping database operations test');
      return true;
    }
    
    console.log('🧪 Testing Supabase database operations...');
    
    // Test reading from profiles table
    const { data: profiles, error: profileError } = await client
      .from('profiles')
      .select('count')
      .limit(1);
      
    if (profileError) {
      console.error('❌ Error accessing profiles table:', profileError.message);
      return false;
    }
    
    // Test reading from user_plans table
    const { data: plans, error: planError } = await client
      .from('user_plans')
      .select('count')
      .limit(1);
      
    if (planError) {
      console.error('❌ Error accessing user_plans table:', planError.message);
      return false;
    }
    
    console.log('✅ Database operations test successful');
    return true;
    
  } catch (error) {
    console.error('❌ Database operations test failed:', error.message);
    return false;
  }
};

module.exports = {
  initializeSupabase,
  getSupabaseClient,
  getSupabaseStatus,
  testDatabaseOperations
};
