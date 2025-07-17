import { ZodValidationPipe } from '../../shared/pipes/zod-validation.pipe';
import { LoginSchema, RegisterSchema } from '../../shared/validation/schemas';
import { BadRequestException } from '@nestjs/common';

describe('Authentication Validation', () => {
  describe('LoginSchema', () => {
    const pipe = new ZodValidationPipe(LoginSchema);

    it('should validate correct login data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const result = pipe.transform(validData, { type: 'body' });
      expect(result).toEqual(validData);
    });

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'password123',
      };

      expect(() => pipe.transform(invalidData, { type: 'body' })).toThrow(BadRequestException);
    });

    it('should reject short password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: '123',
      };

      expect(() => pipe.transform(invalidData, { type: 'body' })).toThrow(BadRequestException);
    });

    it('should reject missing fields', () => {
      const invalidData = {
        email: 'test@example.com',
      };

      expect(() => pipe.transform(invalidData, { type: 'body' })).toThrow(BadRequestException);
    });
  });

  describe('RegisterSchema', () => {
    const pipe = new ZodValidationPipe(RegisterSchema);

    it('should validate correct registration data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
        fullName: 'Test User',
        userType: 'customer' as const,
      };

      const result = pipe.transform(validData, { type: 'body' });
      expect(result).toEqual(validData);
    });

    it('should use default userType', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
        fullName: 'Test User',
      };

      const result = pipe.transform(validData, { type: 'body' });
      expect(result.userType).toBe('customer');
    });

    it('should reject invalid userType', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'password123',
        fullName: 'Test User',
        userType: 'invalid_type',
      };

      expect(() => pipe.transform(invalidData, { type: 'body' })).toThrow(BadRequestException);
    });

    it('should reject short password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: '123',
        fullName: 'Test User',
      };

      expect(() => pipe.transform(invalidData, { type: 'body' })).toThrow(BadRequestException);
    });
  });
});