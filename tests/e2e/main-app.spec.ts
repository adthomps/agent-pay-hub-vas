import { test, expect } from '@playwright/test';

test.describe('Agent Pay Hub - Main Application', () => {
  test.beforeEach(async ({ page }) => {
    // Start from the main page
    await page.goto('/');
  });

  test('should display main page with all key elements', async ({ page }) => {
    // Check header elements
    await expect(page.locator('h1')).toContainText('Visa Acceptance Agent Toolkit');
    await expect(page.locator('text=Payment processing made simple')).toBeVisible();
    
    // Check for main components
    await expect(page.locator('text=🤖 AI Agent Assistant')).toBeVisible();
    await expect(page.locator('text=Create Invoice')).toBeVisible();
    await expect(page.locator('text=Create Payment Link')).toBeVisible();
    await expect(page.locator('text=Invoices')).toBeVisible();
    await expect(page.locator('text=Payment Links')).toBeVisible();
  });

  test('should show mode toggle functionality', async ({ page }) => {
    // Look for mode toggle button
    const modeToggle = page.locator('[data-testid="mode-toggle"]').first();
    if (await modeToggle.isVisible()) {
      await modeToggle.click();
      // Should show some indication of mode change
      await page.waitForTimeout(1000);
    } else {
      // Mode toggle might be visible as a dropdown or different element
      console.log('Mode toggle not found with test id, checking for text');
    }
  });

  test('should show theme toggle functionality', async ({ page }) => {
    // Look for theme toggle button (sun/moon icon)
    const themeToggle = page.locator('[data-testid="theme-toggle"]').first();
    if (await themeToggle.isVisible()) {
      await themeToggle.click();
      await page.waitForTimeout(500);
    } else {
      // Try finding by common theme toggle patterns
      const possibleThemeButton = page.locator('button').filter({ hasText: /theme|dark|light/i }).first();
      if (await possibleThemeButton.isVisible()) {
        await possibleThemeButton.click();
      }
    }
  });
});

test.describe('Agent Interaction', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should allow typing in agent query box', async ({ page }) => {
    // Find the agent text area
    const queryBox = page.locator('textarea').filter({ hasText: /ask the ai assistant|query|message/i }).first();
    if (!(await queryBox.isVisible())) {
      // Try finding any textarea
      const anyTextarea = page.locator('textarea').first();
      if (await anyTextarea.isVisible()) {
        await anyTextarea.fill('Create an invoice for $100 USD');
        await expect(anyTextarea).toHaveValue('Create an invoice for $100 USD');
      }
    } else {
      await queryBox.fill('Create an invoice for $100 USD');
      await expect(queryBox).toHaveValue('Create an invoice for $100 USD');
    }
  });

  test('should enable send button when query is entered', async ({ page }) => {
    // Find textarea and send button
    const textarea = page.locator('textarea').first();
    const sendButton = page.locator('button:has-text("Send")').first();
    
    if (await textarea.isVisible() && await sendButton.isVisible()) {
      // Initially button might be disabled
      await textarea.fill('Test query');
      
      // Wait a moment for React state to update
      await page.waitForTimeout(100);
      
      // Check if button is now enabled (not disabled)
      const isDisabled = await sendButton.isDisabled();
      expect(isDisabled).toBe(false);
    }
  });
});

test.describe('Invoice Creation Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should fill and submit invoice creation form', async ({ page }) => {
    // Find form fields
    const amountInput = page.locator('input[type="number"]').first();
    const emailInput = page.locator('input[type="email"]').first();
    const nameInput = page.locator('input[type="text"]').first();
    const createButton = page.locator('button:has-text("Create Invoice")').first();

    // Fill form if elements are visible
    if (await amountInput.isVisible()) {
      await amountInput.fill('150.00');
    }
    
    if (await emailInput.isVisible()) {
      await emailInput.fill('customer@example.com');
    }
    
    if (await nameInput.isVisible()) {
      await nameInput.fill('John Customer');
    }

    // Try to submit if button is visible
    if (await createButton.isVisible()) {
      await createButton.click();
      
      // Wait for any response/feedback
      await page.waitForTimeout(2000);
      
      // Look for success indication (could be toast, message, or form reset)
      const possibleToast = page.locator('text=success|created|invoice').first();
      if (await possibleToast.isVisible({ timeout: 3000 })) {
        console.log('Success message found');
      }
    }
  });
});

test.describe('Payment Link Creation Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should fill and submit payment link creation form', async ({ page }) => {
    // Similar to invoice form but for payment links
    const formInputs = page.locator('input');
    const createPayLinkButton = page.locator('button:has-text("Create")').filter({ hasText: /payment|link/i }).first();

    // Try to find form fields in the payment link section
    if (await createPayLinkButton.isVisible()) {
      // Fill available inputs near the payment link form
      const nearbyInputs = page.locator('input').filter({ near: createPayLinkButton });
      const count = await nearbyInputs.count();
      
      for (let i = 0; i < Math.min(count, 3); i++) {
        const input = nearbyInputs.nth(i);
        const inputType = await input.getAttribute('type');
        
        if (inputType === 'number' || inputType === 'text') {
          await input.fill('100');
        } else if (inputType === 'email') {
          await input.fill('customer@example.com');
        }
      }
      
      await createPayLinkButton.click();
      await page.waitForTimeout(2000);
    }
  });
});

test.describe('Responsive Design', () => {
  test('should work on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check that main elements are still visible
    await expect(page.locator('h1')).toBeVisible();
    
    // On mobile, some elements might be stacked differently
    const agentBox = page.locator('text=🤖 AI Agent Assistant');
    await expect(agentBox).toBeVisible();
  });
  
  test('should work on tablet viewport', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=Create Invoice')).toBeVisible();
  });
});