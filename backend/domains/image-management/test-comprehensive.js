#!/usr/bin/env node

/**
 * COMPREHENSIVE IMAGE MANAGEMENT SERVICE TEST
 * This script performs end-to-end testing of the image management system
 * including real image uploads, processing, and gateway integration
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

class ImageManagementTester {
  constructor() {
    this.baseUrl = 'http://localhost:5000';
    this.directUrl = 'http://127.0.0.1:3035';
    this.testImage = path.join(__dirname, '../../../test-upload.jpg');
    this.results = [];
  }

  async testHealthCheck() {
    console.log('🔍 Testing Health Check...');
    
    // Test direct connection first
    try {
      const response = await this.makeRequest(`${this.directUrl}/api/image-management/health`);
      console.log('✅ Direct Health Check: SUCCESS');
      console.log('📊 Response:', response);
      this.results.push({ test: 'Direct Health Check', status: 'PASS', data: response });
    } catch (error) {
      console.log('❌ Direct Health Check: FAILED');
      console.log('🔍 Error:', error.message);
      this.results.push({ test: 'Direct Health Check', status: 'FAIL', error: error.message });
    }

    // Test gateway connection
    try {
      const response = await this.makeRequest(`${this.baseUrl}/api/image-management/health`);
      console.log('✅ Gateway Health Check: SUCCESS');
      console.log('📊 Response:', response);
      this.results.push({ test: 'Gateway Health Check', status: 'PASS', data: response });
    } catch (error) {
      console.log('❌ Gateway Health Check: FAILED');
      console.log('🔍 Error:', error.message);
      this.results.push({ test: 'Gateway Health Check', status: 'FAIL', error: error.message });
    }
  }

  async testImageUpload() {
    console.log('🔍 Testing Image Upload...');
    
    if (!fs.existsSync(this.testImage)) {
      console.log('❌ Test image not found:', this.testImage);
      this.results.push({ test: 'Image Upload', status: 'FAIL', error: 'Test image not found' });
      return;
    }

    try {
      const response = await this.uploadImage(this.testImage);
      console.log('✅ Image Upload: SUCCESS');
      console.log('📊 Response:', response);
      this.results.push({ test: 'Image Upload', status: 'PASS', data: response });
      return response;
    } catch (error) {
      console.log('❌ Image Upload: FAILED');
      console.log('🔍 Error:', error.message);
      this.results.push({ test: 'Image Upload', status: 'FAIL', error: error.message });
      return null;
    }
  }

  async testStats() {
    console.log('🔍 Testing Stats Endpoint...');
    
    try {
      const response = await this.makeRequest(`${this.baseUrl}/api/image-management/stats`);
      console.log('✅ Stats Endpoint: SUCCESS');
      console.log('📊 Response:', response);
      this.results.push({ test: 'Stats Endpoint', status: 'PASS', data: response });
    } catch (error) {
      console.log('❌ Stats Endpoint: FAILED');
      console.log('🔍 Error:', error.message);
      this.results.push({ test: 'Stats Endpoint', status: 'FAIL', error: error.message });
    }
  }

  async testImageList() {
    console.log('🔍 Testing Image List...');
    
    try {
      const response = await this.makeRequest(`${this.baseUrl}/api/image-management/images`);
      console.log('✅ Image List: SUCCESS');
      console.log('📊 Response:', response);
      this.results.push({ test: 'Image List', status: 'PASS', data: response });
    } catch (error) {
      console.log('❌ Image List: FAILED');
      console.log('🔍 Error:', error.message);
      this.results.push({ test: 'Image List', status: 'FAIL', error: error.message });
    }
  }

  async makeRequest(url) {
    return new Promise((resolve, reject) => {
      const req = http.get(url, { timeout: 10000 }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            resolve(parsed);
          } catch (e) {
            resolve(data);
          }
        });
      });
      
      req.on('error', reject);
      req.on('timeout', () => reject(new Error('Request timeout')));
    });
  }

  async uploadImage(imagePath) {
    return new Promise((resolve, reject) => {
      const form = new FormData();
      form.append('image', fs.createReadStream(imagePath));
      
      const options = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/image-management/upload',
        method: 'POST',
        headers: form.getHeaders(),
        timeout: 30000
      };

      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            resolve(parsed);
          } catch (e) {
            resolve(data);
          }
        });
      });

      req.on('error', reject);
      req.on('timeout', () => reject(new Error('Upload timeout')));
      
      form.pipe(req);
    });
  }

  async runAllTests() {
    console.log('🚀 Starting Comprehensive Image Management System Test...\n');
    
    await this.testHealthCheck();
    console.log('');
    
    await this.testStats();
    console.log('');
    
    await this.testImageList();
    console.log('');
    
    await this.testImageUpload();
    console.log('');
    
    this.generateReport();
  }

  generateReport() {
    console.log('📊 TEST RESULTS SUMMARY');
    console.log('='.repeat(50));
    
    let passed = 0;
    let failed = 0;
    
    this.results.forEach(result => {
      const status = result.status === 'PASS' ? '✅' : '❌';
      console.log(`${status} ${result.test}: ${result.status}`);
      
      if (result.status === 'PASS') passed++;
      else failed++;
      
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
    });
    
    console.log('\n📈 SUMMARY:');
    console.log(`✅ Tests Passed: ${passed}`);
    console.log(`❌ Tests Failed: ${failed}`);
    console.log(`📊 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
    
    if (failed === 0) {
      console.log('\n🎉 All tests passed! Image Management System is fully operational.');
    } else {
      console.log('\n⚠️  Some tests failed. Please review the errors above.');
    }
  }
}

// Run the comprehensive test
const tester = new ImageManagementTester();
tester.runAllTests().catch(console.error);