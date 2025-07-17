import { test, expect } from '@playwright/test';

test.describe('Admin Product Management Flow', () => {
  test('should login as admin and create product with image upload', async ({ page }) => {
    // Navigate to login
    await page.goto('/login');
    
    // Login as operational admin
    await page.fill('[data-testid="email-input"]', 'ops.admin@leafyhealth.com');
    await page.fill('[data-testid="password-input"]', 'admin123');
    await page.click('[data-testid="login-submit"]');
    
    // Should redirect to operational dashboard
    await expect(page.url()).toContain('/operational-dashboard');
    
    // Navigate to Product Ecosystem
    await page.click('[data-testid="product-ecosystem-tab"]');
    
    // Navigate to Image Management
    await page.click('[data-testid="image-management-tab"]');
    
    // Upload image
    await page.click('[data-testid="upload-images-button"]');
    
    // Fill image upload form
    const fileInput = page.locator('[data-testid="image-file-input"]');
    await fileInput.setInputFiles('tests/fixtures/test-product.jpg');
    
    await page.fill('[data-testid="image-description"]', 'Test product image');
    await page.fill('[data-testid="image-alt-text"]', 'Test product');
    await page.fill('[data-testid="image-tags"]', 'test,product,organic');
    
    // Submit upload
    await page.click('[data-testid="upload-submit"]');
    
    // Verify upload success
    await expect(page.locator('[data-testid="upload-success"]')).toBeVisible();
    
    // Navigate to Product Catalog
    await page.click('[data-testid="product-catalog-tab"]');
    
    // Create new product
    await page.click('[data-testid="create-product-button"]');
    
    // Fill product form
    await page.fill('[data-testid="product-name"]', 'Test Organic Rice');
    await page.fill('[data-testid="product-description"]', 'Premium organic basmati rice');
    await page.fill('[data-testid="product-price"]', '299');
    await page.fill('[data-testid="product-cost-price"]', '250');
    await page.fill('[data-testid="product-sku"]', 'TEST-RICE-001');
    
    // Select category
    await page.selectOption('[data-testid="product-category"]', '1');
    
    // Submit product creation
    await page.click('[data-testid="product-submit"]');
    
    // Verify product created
    await expect(page.locator('[data-testid="product-success"]')).toBeVisible();
    
    // Verify product appears in list
    await expect(page.locator('[data-testid="product-list"]')).toContainText('Test Organic Rice');
  });
  
  test('should manage inventory levels', async ({ page }) => {
    // Login as admin
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', 'ops.admin@leafyhealth.com');
    await page.fill('[data-testid="password-input"]', 'admin123');
    await page.click('[data-testid="login-submit"]');
    
    // Navigate to Inventory Management
    await page.click('[data-testid="inventory-management-tab"]');
    
    // Verify inventory dashboard loads
    await expect(page.locator('[data-testid="inventory-overview"]')).toBeVisible();
    
    // Check for Telugu product names
    await expect(page.locator('[data-testid="inventory-table"]')).toContainText('బాస్మతి బియ్యం');
    
    // Perform stock adjustment
    await page.click('[data-testid="inventory-item"]:first-child [data-testid="adjust-stock"]');
    
    // Fill adjustment form
    await page.selectOption('[data-testid="adjustment-type"]', 'addition');
    await page.fill('[data-testid="adjustment-quantity"]', '10');
    await page.fill('[data-testid="adjustment-reason"]', 'Stock replenishment');
    
    // Submit adjustment
    await page.click('[data-testid="adjustment-submit"]');
    
    // Verify adjustment success
    await expect(page.locator('[data-testid="adjustment-success"]')).toBeVisible();
  });
});