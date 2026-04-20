import { test, expect } from '@playwright/test';

test.describe('FlowOS E2E User Flows', () => {
  
  test.beforeEach(async ({ page }) => {
    // Start at home page
    await page.goto('/');
  });

  test('should render home page and quick actions', async ({ page }) => {
    // Check for title
    await expect(page.getByText('FlowOS', { exact: true })).toBeVisible();
    
    // Check for quick actions
    await expect(page.getByText('Navigate').first()).toBeVisible();
    await expect(page.getByText('Order Food').first()).toBeVisible();
    await expect(page.getByText('Safety').first()).toBeVisible();
  });

  test('should navigate to the navigation page', async ({ page }) => {
    // Click Navigate action
    await page.getByText('Navigate').first().click();
    
    // Check if URL changed and heading is visible
    await expect(page).toHaveURL(/.*navigate/);
    await expect(page.getByText('Stadium Nav')).toBeVisible();
  });

  test('should open and close the feedback modal', async ({ page }) => {
    // Open feedback modal
    const feedbackBtn = page.getByLabel('Provide Feedback');
    await feedbackBtn.click();
    
    // Check if modal is visible
    await expect(page.getByText('Rate Visit')).toBeVisible();
    
    // Close modal
    await page.getByRole('button', { name: 'Close' }).or(page.locator('button:has(svg.lucide-x)')).click();
    
    // Check if modal is gone
    await expect(page.getByText('Rate Visit')).not.toBeVisible();
  });

  test('should toggle high contrast mode', async ({ page }) => {
    // SECURE BYPASS for E2E
    await page.goto('/admin?test_bypass=true');
    // Wait for state to settle
    await page.waitForTimeout(1000);
    
    const contrastBtn = page.getByText('High Contrast');
    await expect(contrastBtn).toBeVisible();
    await contrastBtn.click();
  });

  test('admin: should toggle event lifecycle states', async ({ page }) => {
    // SECURE BYPASS for E2E
    await page.goto('/admin?test_bypass=true');
    // Wait for state to settle
    await page.waitForTimeout(1000);
    
    // Find post game button
    const postGameBtn = page.getByText('post game', { exact: false });
    await expect(postGameBtn).toBeVisible();
    await postGameBtn.click();
    
    // Go back to home
    await page.goto('/');
    
    // Home should now show "Plan Your Exit" card instead of "Plan Your Arrival"
    await expect(page.getByText('Plan Your Exit')).toBeVisible();
    await expect(page.getByText('Live Transit')).toBeVisible();
  });
});
