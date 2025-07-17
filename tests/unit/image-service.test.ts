import { Test, TestingModule } from '@nestjs/testing';
import { CleanImageService } from '../../backend/domains/image-management/src/clean-image.service';
import { BadRequestException } from '@nestjs/common';

describe('CleanImageService', () => {
  let service: CleanImageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CleanImageService],
    }).compile();

    service = module.get<CleanImageService>(CleanImageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('uploadImage', () => {
    it('should throw BadRequestException when no file provided', async () => {
      await expect(service.uploadImage(null, {})).rejects.toThrow(BadRequestException);
    });

    it('should process valid image file', async () => {
      const mockFile = {
        originalname: 'test.jpg',
        buffer: Buffer.from('fake image data'),
        size: 1024,
        mimetype: 'image/jpeg',
      };

      const mockUploadDto = {
        entityType: 'product',
        description: 'Test image',
        altText: 'Test alt text',
        tags: 'test,image',
      };

      // Mock file system operations
      jest.spyOn(require('fs'), 'writeFileSync').mockImplementation(() => {});
      jest.spyOn(require('fs'), 'existsSync').mockReturnValue(false);
      jest.spyOn(require('fs'), 'mkdirSync').mockImplementation(() => {});

      const result = await service.uploadImage(mockFile, mockUploadDto);

      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('image');
      expect(result.image).toHaveProperty('filename');
      expect(result.image).toHaveProperty('originalFilename', 'test.jpg');
    });

    it('should handle invalid file buffer', async () => {
      const mockFile = {
        originalname: 'test.jpg',
        buffer: null,
        size: 0,
        mimetype: 'image/jpeg',
      };

      await expect(service.uploadImage(mockFile, {})).rejects.toThrow();
    });
  });

  describe('getImages', () => {
    it('should return paginated images list', async () => {
      const result = await service.getImages(1, 20, {});

      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('pagination');
      expect(Array.isArray(result.data)).toBe(true);
    });
  });

  describe('getStats', () => {
    it('should return image statistics', async () => {
      const result = await service.getStats();

      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('stats');
      expect(result.stats).toHaveProperty('totalImages');
      expect(result.stats).toHaveProperty('totalSize');
    });
  });

  describe('deleteImage', () => {
    it('should throw error for invalid UUID', async () => {
      await expect(service.deleteImage('invalid-uuid')).rejects.toThrow();
    });
  });
});