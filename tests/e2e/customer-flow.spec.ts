import { test, expect } from '@playwright/test';

test.describe('Customer Registration and Shopping Flow', () => {
  test('should complete customer registration and checkout process', async ({ page }) => {
    // Navigate to customer app
    await page.goto('/customer');
    
    // Check homepage loads
    await expect(page).toHaveTitle(/LeafyHealth/);
    
    // Navigate to registration
    await page.click('[data-testid="register-button"]');
    
    // Fill registration form
    await page.fill('[data-testid="email-input"]', 'test@customer.com');
    await page.fill('[data-testid="password-input"]', 'testpassword123');
    await page.fill('[data-testid="fullname-input"]', 'Test Customer');
    
    // Submit registration
    await page.click('[data-testid="register-submit"]');
    
    // Should redirect to dashboard or login success
    await expect(page.url()).toContain('/dashboard');
    
    // Add product to cart
    await page.click('[data-testid="product-card"]:first-child [data-testid="add-to-cart"]');
    
    // Verify cart item count
    await expect(page.locator('[data-testid="cart-count"]')).toContainText('1');
    
    // Go to cart
    await page.click('[data-testid="cart-button"]');
    
    // Proceed to checkout
    await page.click('[data-testid="checkout-button"]');
    
    // Fill delivery details
    await page.fill('[data-testid="delivery-address"]', '123 Test Street, Test City');
    await page.selectOption('[data-testid="payment-method"]', 'card');
    
    // Place order
    await page.click('[data-testid="place-order-button"]');
    
    // Verify order confirmation
    await expect(page.locator('[data-testid="order-success"]')).toBeVisible();
  });
});