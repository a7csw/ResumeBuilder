#!/usr/bin/env node

/**
 * Generate a secure JWT secret for production
 * Run with: node generate-secret.js
 */

const crypto = require('crypto');

// Generate a 64-character random hex string
const secret = crypto.randomBytes(64).toString('hex');

console.log('\n🔐 Generated Secure JWT Secret:');
console.log('=====================================');
console.log(secret);
console.log('=====================================');
console.log('\n📋 Copy this value to your JWT_SECRET environment variable');
console.log('⚠️  Keep this secret secure and never commit it to version control\n');
