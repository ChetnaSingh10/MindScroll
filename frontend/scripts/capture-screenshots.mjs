import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const VIEWPORTS = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];

const THEMES = ['light', 'dark'];

const PAGES = [
  { id: 'landing', label: 'Landing' },
  { id: 'predictor', label: 'Predictor' },
  { id: 'result', label: 'Result' },
  { id: 'simulator', label: 'Simulator' },
  { id: 'insights', label: 'Insights' },
  { id: 'model-card', label: 'ModelCard' },
];

async function run() {
  const outputDir = path.resolve('./screenshots');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('Beginning multi-viewport, multi-theme capture...');

  for (const vp of VIEWPORTS) {
    await page.setViewportSize({ width: vp.width, height: vp.height });

    for (const theme of THEMES) {
      for (const p of PAGES) {
        // Open app
        await page.goto('http://localhost:4173');
        await page.waitForSelector('html[data-theme]');

        // Set theme
        await page.evaluate((t) => {
          document.documentElement.setAttribute('data-theme', t);
          document.documentElement.style.colorScheme = t;
          localStorage.setItem('mindscroll-theme', t);
        }, theme);

        // Navigate using internal router
        await page.evaluate((pageId) => {
          if (window.__navigate) {
            window.__navigate(pageId);
          }
        }, p.id);

        await page.waitForTimeout(350);

        // Check horizontal overflow
        const hasOverflow = await page.evaluate(() => {
          return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });

        if (hasOverflow) {
          console.warn(`[OVERFLOW WARNING] Page: ${p.label}, Viewport: ${vp.width}px, Theme: ${theme}`);
        }

        const filename = `${p.id}-${vp.width}px-${theme}.png`;
        const filepath = path.join(outputDir, filename);

        await page.screenshot({ path: filepath, fullPage: false });
        console.log(`Captured: ${filename}`);
      }
    }
  }

  await browser.close();
  console.log('All screenshots captured successfully.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
