/**
 * Comprehensive Integration Tests for Image Management Service
 * Tests all endpoints, database integration, file operations, and error scenarios
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import http from 'http';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:5000';
const SERVICE_URL = 'http://localhost:3035';

describe('Image Management Service - Complete Integration Tests', () => {
  let testImageId: string;
  
  beforeAll(async () => {
    // Wait for service to be ready
    await new Promise(resolve => setTimeout(resolve, 2000));
  });

  describe('Health and Service Status', () => {
    it('should return healthy status from gateway', async () => {
      const response = await fetch(`${BASE_URL}/api/image-management/health`);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.status).toBe('healthy');
      expect(data.service).toBe('Image Management Service');
      expect(data.port).toBe('3035');
      expect(Array.isArray(data.features)).toBe(true);
    });

    it('should return healthy status from direct service', async () => {
      const response = await fetch(`${SERVICE_URL}/api/image-management/health`);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.status).toBe('healthy');
    });
  });

  describe('Statistics Endpoint', () => {
    it('should return valid statistics', async () => {
      const response = await fetch(`${BASE_URL}/api/image-management/stats`);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.stats).toBeDefined();
      expect(typeof data.stats.totalImages).toBe('number');
      expect(typeof data.stats.totalSize).toBe('string');
      expect(typeof data.stats.formattedSize).toBe('string');
      expect(Array.isArray(data.stats.recentImages)).toBe(true);
    });
  });

  describe('Image Listing', () => {
    it('should return paginated image list', async () => {
      const response = await fetch(`${BASE_URL}/api/image-management/images`);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
      expect(data.pagination).toBeDefined();
      expect(data.pagination.page).toBe(1);
      expect(data.pagination.limit).toBe(20);
    });

    it('should handle pagination parameters', async () => {
      const response = await fetch(`${BASE_URL}/api/image-management/images?page=1&limit=5`);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.pagination.limit).toBe(5);
    });

    it('should handle search filters', async () => {
      const response = await fetch(`${BASE_URL}/api/image-management/images?search=organic`);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });
  });

  describe('File Upload Operations', () => {
    it('should reject upload without file', async () => {
      const formData = new FormData();
      formData.append('entityType', 'product');
      formData.append('description', 'Test without file');
      
      const response = await fetch(`${BASE_URL}/api/image-management/upload`, {
        method: 'POST',
        body: formData,
      });
      
      expect(response.status).toBe(400);
    });

    it('should successfully upload valid image file', async () => {
      // Create a small test image buffer
      const testImageBuffer = Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
        'base64'
      );
      
      const formData = new FormData();
      formData.append('file', testImageBuffer, {
        filename: 'test-integration.png',
        contentType: 'image/png',
      });
      formData.append('entityType', 'product');
      formData.append('description', 'Integration test image');
      formData.append('altText', 'Test image for integration');
      formData.append('tags', 'test,integration,automated');
      
      const response = await fetch(`${BASE_URL}/api/image-management/upload`, {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.image).toBeDefined();
      expect(data.data.image.id).toBeDefined();
      expect(data.data.image.filename).toContain('test-integration.png');
      
      testImageId = data.data.image.id;
    });

    it('should reject invalid file types', async () => {
      const formData = new FormData();
      formData.append('file', Buffer.from('not an image'), {
        filename: 'test.txt',
        contentType: 'text/plain',
      });
      formData.append('entityType', 'product');
      
      const response = await fetch(`${BASE_URL}/api/image-management/upload`, {
        method: 'POST',
        body: formData,
      });
      
      expect(response.status).toBe(400);
    });
  });

  describe('Image Retrieval and Serving', () => {
    it('should retrieve image by ID', async () => {
      if (!testImageId) {
        // Use existing image if test upload failed
        const imagesResponse = await fetch(`${BASE_URL}/api/image-management/images`);
        const imagesData = await imagesResponse.json();
        testImageId = imagesData.data[0]?.id;
      }

      if (testImageId) {
        const response = await fetch(`${BASE_URL}/api/image-management/images/${testImageId}`);
        const data = await response.json();
        
        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        expect(data.data.id).toBe(testImageId);
      }
    });

    it('should handle preview requests', async () => {
      if (testImageId) {
        const response = await fetch(`${BASE_URL}/api/image-management/images/${testImageId}/preview`);
        const data = await response.json();
        
        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
      }
    });

    it('should serve image files', async () => {
      // Test serving existing image
      const imagesResponse = await fetch(`${BASE_URL}/api/image-management/images`);
      const imagesData = await imagesResponse.json();
      
      if (imagesData.data.length > 0) {
        const firstImage = imagesData.data[0];
        const serveResponse = await fetch(`${BASE_URL}/api/image-management/serve/${firstImage.filename}`);
        
        expect(serveResponse.status).toBe(200);
        expect(serveResponse.headers.get('content-type')).toContain('image');
      }
    });
  });

  describe('Bulk Operations', () => {
    it('should handle bulk delete requests', async () => {
      const response = await fetch(`${BASE_URL}/api/image-management/bulk-delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageIds: [] }),
      });
      
      expect(response.status).toBe(200);
    });

    it('should handle optimization requests', async () => {
      const response = await fetch(`${BASE_URL}/api/image-management/optimize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageIds: [] }),
      });
      
      expect(response.status).toBe(200);
    });

    it('should handle bulk tagging requests', async () => {
      const response = await fetch(`${BASE_URL}/api/image-management/bulk-tag`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageIds: [], tags: ['test'] }),
      });
      
      expect(response.status).toBe(200);
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid image ID', async () => {
      const response = await fetch(`${BASE_URL}/api/image-management/images/invalid-uuid`);
      expect(response.status).toBe(400);
    });

    it('should handle non-existent image file serving', async () => {
      const response = await fetch(`${BASE_URL}/api/image-management/serve/non-existent.jpg`);
      expect(response.status).toBe(404);
    });

    it('should handle malformed requests gracefully', async () => {
      const response = await fetch(`${BASE_URL}/api/image-management/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invalid: 'data' }),
      });
      
      expect(response.status).toBe(400);
    });
  });

  describe('Database Integration', () => {
    it('should maintain data consistency across requests', async () => {
      const statsResponse = await fetch(`${BASE_URL}/api/image-management/stats`);
      const statsData = await statsResponse.json();
      
      const imagesResponse = await fetch(`${BASE_URL}/api/image-management/images`);
      const imagesData = await imagesResponse.json();
      
      expect(statsData.stats.totalImages).toBe(imagesData.pagination.total);
    });

    it('should handle concurrent requests properly', async () => {
      const requests = Array(5).fill(null).map(() => 
        fetch(`${BASE_URL}/api/image-management/stats`)
      );
      
      const responses = await Promise.all(requests);
      
      responses.forEach(response => {
        expect(response.status).toBe(200);
      });
    });
  });

  afterAll(async () => {
    // Cleanup test image if created
    if (testImageId) {
      await fetch(`${BASE_URL}/api/image-management/images/${testImageId}`, {
        method: 'DELETE',
      });
    }
  });
});