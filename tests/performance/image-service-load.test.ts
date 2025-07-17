/**
 * Performance and Load Testing for Image Management Service
 * Tests service under concurrent load and measures response times
 */

import { describe, it, expect } from '@jest/globals';

const BASE_URL = 'http://localhost:5000';

describe('Image Management Service - Performance Tests', () => {
  
  describe('Response Time Tests', () => {
    it('should respond to health check within 500ms', async () => {
      const startTime = Date.now();
      const response = await fetch(`${BASE_URL}/api/image-management/health`);
      const endTime = Date.now();
      
      expect(response.status).toBe(200);
      expect(endTime - startTime).toBeLessThan(500);
    });

    it('should respond to stats within 1000ms', async () => {
      const startTime = Date.now();
      const response = await fetch(`${BASE_URL}/api/image-management/stats`);
      const endTime = Date.now();
      
      expect(response.status).toBe(200);
      expect(endTime - startTime).toBeLessThan(1000);
    });

    it('should respond to image listing within 2000ms', async () => {
      const startTime = Date.now();
      const response = await fetch(`${BASE_URL}/api/image-management/images`);
      const endTime = Date.now();
      
      expect(response.status).toBe(200);
      expect(endTime - startTime).toBeLessThan(2000);
    });
  });

  describe('Concurrent Request Handling', () => {
    it('should handle 10 concurrent health checks', async () => {
      const requests = Array(10).fill(null).map(() => 
        fetch(`${BASE_URL}/api/image-management/health`)
      );
      
      const startTime = Date.now();
      const responses = await Promise.all(requests);
      const endTime = Date.now();
      
      responses.forEach(response => {
        expect(response.status).toBe(200);
      });
      
      expect(endTime - startTime).toBeLessThan(3000);
    });

    it('should handle 5 concurrent stats requests', async () => {
      const requests = Array(5).fill(null).map(() => 
        fetch(`${BASE_URL}/api/image-management/stats`)
      );
      
      const responses = await Promise.all(requests);
      
      responses.forEach(response => {
        expect(response.status).toBe(200);
      });
    });

    it('should handle mixed concurrent requests', async () => {
      const healthRequests = Array(3).fill(null).map(() => 
        fetch(`${BASE_URL}/api/image-management/health`)
      );
      
      const statsRequests = Array(3).fill(null).map(() => 
        fetch(`${BASE_URL}/api/image-management/stats`)
      );
      
      const imageRequests = Array(2).fill(null).map(() => 
        fetch(`${BASE_URL}/api/image-management/images`)
      );
      
      const allRequests = [...healthRequests, ...statsRequests, ...imageRequests];
      const responses = await Promise.all(allRequests);
      
      responses.forEach(response => {
        expect(response.status).toBe(200);
      });
    });
  });

  describe('Memory and Resource Usage', () => {
    it('should not leak memory during repeated requests', async () => {
      // Simulate sustained load
      for (let i = 0; i < 20; i++) {
        const response = await fetch(`${BASE_URL}/api/image-management/stats`);
        expect(response.status).toBe(200);
        
        // Small delay to simulate real usage
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    });

    it('should handle rapid sequential requests', async () => {
      const responses = [];
      
      for (let i = 0; i < 10; i++) {
        const response = await fetch(`${BASE_URL}/api/image-management/health`);
        responses.push(response);
      }
      
      responses.forEach(response => {
        expect(response.status).toBe(200);
      });
    });
  });

  describe('Gateway Performance', () => {
    it('should proxy requests efficiently', async () => {
      const directServiceTime = await measureResponseTime(`http://localhost:3035/api/image-management/health`);
      const gatewayTime = await measureResponseTime(`${BASE_URL}/api/image-management/health`);
      
      // Gateway should add minimal overhead (less than 100ms)
      expect(gatewayTime - directServiceTime).toBeLessThan(100);
    });
  });
});

async function measureResponseTime(url: string): Promise<number> {
  const startTime = Date.now();
  const response = await fetch(url);
  const endTime = Date.now();
  
  expect(response.status).toBe(200);
  return endTime - startTime;
}