/**
 * Final Production Validation Test Suite
 * Comprehensive validation of Image Management Service for production deployment
 */

import { describe, it, expect } from '@jest/globals';

const BASE_URL = 'http://localhost:5000';

describe('Image Management Service - Final Production Validation', () => {
  
  describe('API Health and Availability', () => {
    it('should be accessible through gateway', async () => {
      const response = await fetch(`${BASE_URL}/api/image-management/health`);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.status).toBe('healthy');
      expect(data.service).toBe('Image Management Service');
      expect(data.port).toBe('3035');
    });

    it('should return consistent statistics', async () => {
      const response = await fetch(`${BASE_URL}/api/image-management/stats`);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(typeof data.stats.totalImages).toBe('number');
      expect(typeof data.stats.totalSize).toBe('string');
      expect(Array.isArray(data.stats.recentImages)).toBe(true);
    });
  });

  describe('Error Handling Validation', () => {
    it('should reject upload without file', async () => {
      const formData = new FormData();
      formData.append('entityType', 'product');
      
      const response = await fetch(`${BASE_URL}/api/image-management/upload`, {
        method: 'POST',
        body: formData,
      });
      
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.message).toContain('No image file provided');
    });

    it('should reject invalid UUID format', async () => {
      const response = await fetch(`${BASE_URL}/api/image-management/images/invalid-uuid-format`);
      
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.message).toContain('Invalid image ID format');
    });

    it('should handle non-existent file serving', async () => {
      const response = await fetch(`${BASE_URL}/api/image-management/serve/non-existent-file.jpg`);
      
      expect(response.status).toBe(404);
    });

    it('should reject invalid file types', async () => {
      const textFile = new Blob(['this is not an image'], { type: 'text/plain' });
      const formData = new FormData();
      formData.append('file', textFile, 'test.txt');
      formData.append('entityType', 'product');
      
      const response = await fetch(`${BASE_URL}/api/image-management/upload`, {
        method: 'POST',
        body: formData,
      });
      
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.message).toContain('Only image files are allowed');
    });
  });

  describe('Database Integration', () => {
    it('should maintain data consistency', async () => {
      const statsResponse = await fetch(`${BASE_URL}/api/image-management/stats`);
      const statsData = await statsResponse.json();
      
      const imagesResponse = await fetch(`${BASE_URL}/api/image-management/images`);
      const imagesData = await imagesResponse.json();
      
      expect(statsData.stats.totalImages).toBe(imagesData.pagination.total);
    });

    it('should return paginated results', async () => {
      const response = await fetch(`${BASE_URL}/api/image-management/images?page=1&limit=5`);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.pagination.page).toBe(1);
      expect(data.pagination.limit).toBe(5);
      expect(Array.isArray(data.data)).toBe(true);
    });
  });

  describe('Bulk Operations', () => {
    it('should handle empty bulk delete', async () => {
      const response = await fetch(`${BASE_URL}/api/image-management/bulk-delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageIds: [] }),
      });
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.deleted).toBe(0);
    });

    it('should handle optimization requests', async () => {
      const response = await fetch(`${BASE_URL}/api/image-management/optimize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageIds: [] }),
      });
      
      expect(response.status).toBe(200);
    });

    it('should handle bulk tagging', async () => {
      const response = await fetch(`${BASE_URL}/api/image-management/bulk-tag`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageIds: [], tags: ['test'] }),
      });
      
      expect(response.status).toBe(200);
    });
  });

  describe('Performance Validation', () => {
    it('should respond quickly to health checks', async () => {
      const startTime = Date.now();
      const response = await fetch(`${BASE_URL}/api/image-management/health`);
      const endTime = Date.now();
      
      expect(response.status).toBe(200);
      expect(endTime - startTime).toBeLessThan(1000);
    });

    it('should handle concurrent requests', async () => {
      const requests = Array(10).fill(null).map(() => 
        fetch(`${BASE_URL}/api/image-management/health`)
      );
      
      const responses = await Promise.all(requests);
      
      responses.forEach(response => {
        expect(response.status).toBe(200);
      });
    });
  });

  describe('Gateway Integration', () => {
    it('should route requests correctly', async () => {
      const response = await fetch(`${BASE_URL}/api/image-management/health`);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.service).toBe('Image Management Service');
    });

    it('should include proper headers', async () => {
      const response = await fetch(`${BASE_URL}/api/image-management/health`);
      
      expect(response.headers.get('content-type')).toContain('application/json');
    });
  });

  describe('File Upload Validation', () => {
    it('should validate file size', async () => {
      // Create a file buffer that's too large
      const largeBuffer = Buffer.alloc(15 * 1024 * 1024); // 15MB
      const formData = new FormData();
      formData.append('file', new Blob([largeBuffer], { type: 'image/png' }), 'large.png');
      formData.append('entityType', 'product');
      
      const response = await fetch(`${BASE_URL}/api/image-management/upload`, {
        method: 'POST',
        body: formData,
      });
      
      // Should be rejected by multer or our validation
      expect([400, 413]).toContain(response.status);
    });

    it('should validate required fields', async () => {
      const testImage = new Blob([new Uint8Array([
        0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
        0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52, // IHDR chunk
        0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, // 1x1 image
        0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53,
        0xDE, 0x00, 0x00, 0x00, 0x0C, 0x49, 0x44, 0x41,
        0x54, 0x08, 0xD7, 0x63, 0xF8, 0x0F, 0x00, 0x00,
        0x01, 0x00, 0x01, 0x78, 0x9C, 0xFA, 0x83, 0x00,
        0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE,
        0x42, 0x60, 0x82
      ])], { type: 'image/png' });
      
      const formData = new FormData();
      formData.append('file', testImage, 'test.png');
      formData.append('entityType', 'product');
      formData.append('description', 'Valid test image');
      formData.append('altText', 'Test image');
      
      const response = await fetch(`${BASE_URL}/api/image-management/upload`, {
        method: 'POST',
        body: formData,
      });
      
      expect([200, 201]).toContain(response.status);
    });
  });
});