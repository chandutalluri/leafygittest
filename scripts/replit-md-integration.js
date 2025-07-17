
/**
 * Replit.md Integration Middleware
 * Ensures continuous compliance with replit.md specifications
 */

const SystemConfigEnforcer = require('./system-config-enforcer');

class ReplitMdIntegration {
  constructor() {
    this.enforcer = new SystemConfigEnforcer();
    this.watchFiles = [
      'frontend/apps/*/src/**/*.{ts,tsx}',
      'backend/domains/*/src/**/*.ts',
      'server/*.js',
      'shared/**/*.ts'
    ];
  }

  // Middleware to validate every file change
  validateFileChange(filePath, content) {
    console.log(`🔍 Validating ${filePath} against replit.md...`);
    
    const violations = this.enforcer.validateFile(filePath);
    
    if (violations.length > 0) {
      console.log(`❌ Violations found in ${filePath}:`);
      violations.forEach(violation => {
        console.log(`  - ${violation.message}`);
      });
      return false;
    }
    
    console.log(`✅ ${filePath} complies with replit.md specifications`);
    return true;
  }

  // Pre-commit hook
  preCommitValidation() {
    console.log('🚀 Running pre-commit replit.md validation...');
    
    const isCompliant = this.enforcer.validateProject();
    
    if (!isCompliant) {
      console.log('❌ Commit blocked due to replit.md violations');
      console.log('📋 Run: npm run fix-compliance');
      process.exit(1);
    }
    
    console.log('✅ All files comply with replit.md specifications');
  }

  // Development server middleware
  devMiddleware() {
    return (req, res, next) => {
      // Validate incoming requests against replit.md patterns
      if (req.url.includes('/api/') && !req.url.startsWith('/api/')) {
        console.log('⚠️ Direct microservice access detected, should use gateway');
      }
      
      next();
    };
  }

  // Auto-fix common violations
  autoFix() {
    console.log('🔧 Auto-fixing replit.md violations...');
    this.enforcer.enforceConfiguration();
  }
}

module.exports = ReplitMdIntegration;
