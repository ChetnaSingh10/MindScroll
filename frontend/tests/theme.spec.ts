import { test, expect } from '@playwright/test';

test.describe('Theme Switch & Persistence', () => {
  test('toggles theme, changes html data-theme and body background color, and persists across reload', async ({ page }) => {
    // 1. Open the app
    await page.goto('http://localhost:4173');

    // Wait for initial render
    await page.waitForSelector('html[data-theme]');
    const initialTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    const initialBg = await page.evaluate(() => window.getComputedStyle(document.body).backgroundColor);

    console.log(`Initial theme: ${initialTheme}, Initial body bg: ${initialBg}`);

    // 2. Click the toggle button in navbar
    const toggleButton = page.locator('button[aria-label*="Switch to"]');
    await expect(toggleButton).toBeVisible();
    await toggleButton.click();

    // 3. Assert that html data-theme value changed
    await page.waitForFunction(
      (prev) => document.documentElement.getAttribute('data-theme') !== prev,
      initialTheme
    );

    // Allow View Transition & CSS transition (350ms) to complete
    await page.waitForTimeout(500);

    const toggledTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    const toggledBg = await page.evaluate(() => window.getComputedStyle(document.body).backgroundColor);

    console.log(`Toggled theme: ${toggledTheme}, Toggled body bg: ${toggledBg}`);

    expect(toggledTheme).not.toBe(initialTheme);
    expect(toggledBg).not.toBe(initialBg);

    if (initialTheme === 'dark') {
      expect(toggledTheme).toBe('light');
      expect(toggledBg).toBe('rgb(250, 247, 242)');
    } else {
      expect(toggledTheme).toBe('dark');
      expect(toggledBg).toBe('rgb(11, 11, 12)');
    }

    // 4. Reload page and assert theme persisted
    await page.reload();
    await page.waitForSelector('html[data-theme]');
    await page.waitForTimeout(300);

    const reloadedTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    const reloadedBg = await page.evaluate(() => window.getComputedStyle(document.body).backgroundColor);

    console.log(`Reloaded theme: ${reloadedTheme}, Reloaded body bg: ${reloadedBg}`);

    expect(reloadedTheme).toBe(toggledTheme);
    expect(reloadedBg).toBe(toggledBg);
  });
});
