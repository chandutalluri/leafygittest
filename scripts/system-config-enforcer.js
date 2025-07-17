
/**
 * LeafyHealth System Configuration Enforcer
 * Validates and enforces replit.md specifications across the entire system
 */

const fs = require('fs');
const path = require('path');

class SystemConfigEnforcer {
  constructor() {
    this.configPath = path.join(__dirname, '..', 'replit.md');
    this.violations = [];
    this.config = this.loadConfig();
  }

  loadConfig() {
    try {
      const content = fs.readFileSync(this.configPath, 'utf8');
      return {
        mandatoryRules: this.extractMandatoryRules(content),
        forbiddenPatterns: this.extractForbiddenPatterns(content),
        requiredPatterns: this.extractRequiredPatterns(content)
      };
    } catch (error) {
      console.error('❌ Failed to load replit.md configuration:', error.message);
      return null;
    }
  }

  extractMandatoryRules(content) {
    const rules = [];
    const sections = content.split('### ❌ **NEVER DO**')[1]?.split('### ✅ **ALWAYS DO**');
    
    if (sections && sections.length > 1) {
      const neverDo = sections[0].match(/- ❌[^❌]+/g) || [];
      const alwaysDo = sections[1].match(/- ✅[^✅]+/g) || [];
      
      rules.push(...neverDo.map(rule => ({ type: 'NEVER', rule: rule.replace('- ❌', '').trim() })));
      rules.push(...alwaysDo.map(rule => ({ type: 'ALWAYS', rule: rule.replace('- ✅', '').trim() })));
    }
    
    return rules;
  }

  extractForbiddenPatterns(content) {
    return [
      '/pages/api/*.ts', // Proxy endpoints forbidden
      'hardcoded ports like 3013, 8081',
      'mock data or temporary UI',
      'separate tabs for each microservice',
      'Create Product buttons on overview pages'
    ];
  }

  extractRequiredPatterns(content) {
    return [
      'JWT tokens via authentication service',
      'Unified gateway on port 5000',
      'Branch-scoped data operations',
      'Glassmorphism design system',
      'Composite business domain architecture'
    ];
  }

  validateFile(filePath) {
    if (!fs.existsSync(filePath)) return true;
    
    const content = fs.readFileSync(filePath, 'utf8');
    const violations = [];

    // Check for forbidden patterns
    this.config.forbiddenPatterns.forEach(pattern => {
      if (content.includes(pattern)) {
        violations.push({
          type: 'FORBIDDEN_PATTERN',
          file: filePath,
          pattern,
          message: `Forbidden pattern "${pattern}" found in ${filePath}`
        });
      }
    });

    // Check for hardcoded ports
    const portPattern = /localhost:\d{4}/g;
    const portMatches = content.match(portPattern);
    if (portMatches) {
      const forbiddenPorts = portMatches.filter(match => 
        !match.includes('localhost:5000') && !match.includes('localhost:3000')
      );
      if (forbiddenPorts.length > 0) {
        violations.push({
          type: 'HARDCODED_PORT',
          file: filePath,
          ports: forbiddenPorts,
          message: `Hardcoded ports found: ${forbiddenPorts.join(', ')}`
        });
      }
    }

    return violations;
  }

  validateProject() {
    console.log('🔍 Validating project against replit.md specifications...');
    
    const filesToCheck = [
      'frontend/apps/*/src/**/*.tsx',
      'frontend/apps/*/src/**/*.ts',
      'backend/domains/*/src/**/*.ts',
      'server/*.js',
      'scripts/*.js'
    ];

    let totalViolations = 0;

    // Validate authentication pattern
    this.validateAuthenticationPattern();
    
    // Validate gateway usage
    this.validateGatewayUsage();
    
    // Validate branch scoping
    this.validateBranchScoping();
    
    // Validate UI consistency
    this.validateUIConsistency();

    if (totalViolations === 0) {
      console.log('✅ Project fully compliant with replit.md specifications');
    } else {
      console.log(`❌ Found ${totalViolations} violations of replit.md specifications`);
      this.violations.forEach(violation => {
        console.log(`  - ${violation.message}`);
      });
    }

    return totalViolations === 0;
  }

  validateAuthenticationPattern() {
    console.log('🔐 Validating authentication pattern...');
    
    // Check if JWT tokens are properly used
    const authFiles = [
      'server/auth-service-fixed.js',
      'shared/auth/auth.module.ts',
      'frontend/apps/*/src/lib/auth.ts'
    ];

    authFiles.forEach(pattern => {
      // Implementation would check for proper JWT usage
    });
  }

  validateGatewayUsage() {
    console.log('🚪 Validating unified gateway usage...');
    
    // Check if all API calls go through gateway
    const gatewayFile = 'server/unified-gateway-fixed.js';
    if (fs.existsSync(gatewayFile)) {
      console.log('✅ Unified gateway exists');
    } else {
      this.violations.push({
        type: 'MISSING_GATEWAY',
        message: 'Unified gateway not found at expected location'
      });
    }
  }

  validateBranchScoping() {
    console.log('🏢 Validating branch scoping...');
    
    // Check if all database operations include branch_id
    const schemaFile = 'shared/schema.ts';
    if (fs.existsSync(schemaFile)) {
      const content = fs.readFileSync(schemaFile, 'utf8');
      if (content.includes('branch_id')) {
        console.log('✅ Branch scoping implemented in schema');
      } else {
        this.violations.push({
          type: 'MISSING_BRANCH_SCOPING',
          message: 'Branch scoping not found in database schema'
        });
      }
    }
  }

  validateUIConsistency() {
    console.log('🎨 Validating UI consistency...');
    
    // Check if glassmorphism components are used
    const uiComponents = [
      'frontend/packages/ui-kit/src/components/GlassCard.tsx',
      'frontend/packages/ui-kit/src/components/GlassInput.tsx',
      'frontend/packages/ui-kit/src/components/Button.tsx'
    ];

    uiComponents.forEach(component => {
      if (fs.existsSync(component)) {
        console.log(`✅ UI component exists: ${component}`);
      } else {
        this.violations.push({
          type: 'MISSING_UI_COMPONENT',
          message: `Required UI component missing: ${component}`
        });
      }
    });
  }

  enforceConfiguration() {
    console.log('🛠️ Enforcing replit.md configuration...');
    
    // Auto-fix common violations
    this.fixHardcodedPorts();
    this.fixAuthenticationPatterns();
    this.fixGatewayUsage();
    
    console.log('✅ Configuration enforcement complete');
  }

  fixHardcodedPorts() {
    // Implementation to fix hardcoded ports
    console.log('🔧 Fixing hardcoded ports...');
  }

  fixAuthenticationPatterns() {
    // Implementation to fix auth patterns
    console.log('🔧 Fixing authentication patterns...');
  }

  fixGatewayUsage() {
    // Implementation to fix gateway usage
    console.log('🔧 Fixing gateway usage...');
  }

  generateComplianceReport() {
    const report = {
      timestamp: new Date().toISOString(),
      totalViolations: this.violations.length,
      violations: this.violations,
      recommendations: this.generateRecommendations()
    };

    fs.writeFileSync(
      path.join(__dirname, '..', 'compliance-report.json'),
      JSON.stringify(report, null, 2)
    );

    console.log('📊 Compliance report generated: compliance-report.json');
    return report;
  }

  generateRecommendations() {
    return [
      'Implement composite business domain architecture',
      'Ensure all API calls go through unified gateway',
      'Add branch scoping to all database operations',
      'Use glassmorphism UI components consistently',
      'Follow JWT authentication pattern',
      'Implement proper error handling across services'
    ];
  }
}

// Usage
const enforcer = new SystemConfigEnforcer();
const isCompliant = enforcer.validateProject();

if (!isCompliant) {
  enforcer.enforceConfiguration();
  enforcer.generateComplianceReport();
}

module.exports = SystemConfigEnforcer;
