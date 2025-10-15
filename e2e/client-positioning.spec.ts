import { test, expect } from '@playwright/test';

test.describe('Client Dashboard Positioning Tests', () => {
  const clientPages = [
    '/client-dashboard',
    '/client-dashboard/pets',
    '/client-dashboard/consultas',
    '/client-dashboard/exames',
    '/client-dashboard/historico',
    '/client-dashboard/meus-dados'
  ];

  const viewports = [
    { name: 'Desktop', width: 1920, height: 1080 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Mobile', width: 375, height: 667 }
  ];

  // Helper function to login as client
  async function loginAsClient(page: any) {
    await page.goto('/');
    await page.click('text=Consultar Resultados');
    await page.fill('input#public-cpf', '123.456.789-00');
    await page.fill('input#public-code', 'TEST123');
    await page.click('button:has-text("Consultar Resultado")');
    await page.waitForURL('**/client-dashboard', { timeout: 10000 });
  }

  test.describe('Desktop Positioning', () => {
    test.use({ viewport: { width: 1920, height: 1080 } });

    clientPages.forEach(pagePath => {
      test(`desktop layout check for ${pagePath}`, async ({ page }) => {
        await loginAsClient(page);
        await page.goto(pagePath);

        // Take a screenshot for visual reference
        await page.screenshot({
          path: `test-results/desktop-${pagePath.replace(/\//g, '-')}.png`,
          fullPage: true
        });

        // Check sidebar positioning
        const sidebar = page.locator('.fixed.inset-y-0.left-0, .lg\\:static');
        await expect(sidebar).toBeVisible();

        const sidebarBoundingBox = await sidebar.boundingBox();
        console.log(`Desktop ${pagePath} - Sidebar:`, sidebarBoundingBox);

        // Check main content positioning
        const mainContent = page.locator('.lg\\:ml-64, .flex-1');
        await expect(mainContent).toBeVisible();

        const mainBoundingBox = await mainContent.boundingBox();
        console.log(`Desktop ${pagePath} - Main Content:`, mainBoundingBox);

        // Verify sidebar and main content don't overlap
        if (sidebarBoundingBox && mainBoundingBox) {
          expect(sidebarBoundingBox.x + sidebarBoundingBox.width).toBeLessThanOrEqual(mainBoundingBox.x + 10); // Allow 10px tolerance
        }

        // Check header positioning
        const header = page.locator('header');
        await expect(header).toBeVisible();

        const headerBoundingBox = await header.boundingBox();
        console.log(`Desktop ${pagePath} - Header:`, headerBoundingBox);

        // Verify header is at the top
        if (headerBoundingBox) {
          expect(headerBoundingBox.y).toBeLessThan(100);
        }

        // Check content is properly contained within viewport
        const bodyBoundingBox = await page.locator('body').boundingBox();
        if (bodyBoundingBox) {
          expect(mainBoundingBox!.x + mainBoundingBox!.width).toBeLessThanOrEqual(bodyBoundingBox.width + 20);
        }
      });
    });
  });

  test.describe('Mobile Positioning', () => {
    test.use({ viewport: { width: 375, height: 667 } });

    clientPages.forEach(pagePath => {
      test(`mobile layout check for ${pagePath}`, async ({ page }) => {
        await loginAsClient(page);
        await page.goto(pagePath);

        // Take a screenshot for visual reference
        await page.screenshot({
          path: `test-results/mobile-${pagePath.replace(/\//g, '-')}.png`,
          fullPage: true
        });

        // Check sidebar is hidden by default on mobile
        const sidebar = page.locator('.fixed.inset-y-0.left-0');
        await expect(sidebar).not.toBeVisible();

        // Check hamburger menu is visible
        const hamburgerButton = page.locator('button:has(svg path[d*="M4 6h16"])');
        await expect(hamburgerButton).toBeVisible();

        // Check main content takes full width
        const mainContent = page.locator('.flex-1, div:not(.lg\\:ml-64)');
        await expect(mainContent).toBeVisible();

        const mainBoundingBox = await mainContent.boundingBox();
        console.log(`Mobile ${pagePath} - Main Content:`, mainBoundingBox);

        // Verify content fits within mobile viewport
        if (mainBoundingBox) {
          expect(mainBoundingBox.width).toBeGreaterThan(300); // Should be close to viewport width
          expect(mainBoundingBox.width).toBeLessThan(400); // But not larger than mobile viewport
        }

        // Test mobile sidebar interaction
        await hamburgerButton.click();
        await expect(sidebar).toBeVisible();

        const sidebarBoundingBox = await sidebar.boundingBox();
        console.log(`Mobile ${pagePath} - Sidebar (open):`, sidebarBoundingBox);

        // Sidebar should overlay content on mobile
        if (sidebarBoundingBox) {
          expect(sidebarBoundingBox.width).toBeLessThanOrEqual(300); // Mobile sidebar width
        }

        // Check overlay is present
        const overlay = page.locator('.fixed.inset-0.z-40.bg-gray-600');
        await expect(overlay).toBeVisible();

        // Close sidebar by clicking overlay
        await overlay.click();
        await expect(sidebar).not.toBeVisible();

        // Check header positioning on mobile
        const header = page.locator('header');
        await expect(header).toBeVisible();

        const headerBoundingBox = await header.boundingBox();
        console.log(`Mobile ${pagePath} - Header:`, headerBoundingBox);

        // Verify header height is reasonable for mobile
        if (headerBoundingBox) {
          expect(headerBoundingBox.height).toBeLessThan(100);
          expect(headerBoundingBox.y).toBeLessThan(10);
        }
      });
    });
  });

  test.describe('Tablet Positioning', () => {
    test.use({ viewport: { width: 768, height: 1024 } });

    clientPages.forEach(pagePath => {
      test(`tablet layout check for ${pagePath}`, async ({ page }) => {
        await loginAsClient(page);
        await page.goto(pagePath);

        // Take a screenshot for visual reference
        await page.screenshot({
          path: `test-results/tablet-${pagePath.replace(/\//g, '-')}.png`,
          fullPage: true
        });

        // On tablet, sidebar should be visible (like desktop)
        const sidebar = page.locator('.fixed.inset-y-0.left-0');
        await expect(sidebar).toBeVisible();

        // Check main content positioning
        const mainContent = page.locator('.lg\\:ml-64, .flex-1');
        await expect(mainContent).toBeVisible();

        const mainBoundingBox = await mainContent.boundingBox();
        const sidebarBoundingBox = await sidebar.boundingBox();

        console.log(`Tablet ${pagePath} - Sidebar:`, sidebarBoundingBox);
        console.log(`Tablet ${pagePath} - Main Content:`, mainBoundingBox);

        // Verify proper layout
        if (sidebarBoundingBox && mainBoundingBox) {
          expect(sidebarBoundingBox.x + sidebarBoundingBox.width).toBeLessThanOrEqual(mainBoundingBox.x + 10);
        }

        // Content should fit within tablet viewport
        if (mainBoundingBox) {
          expect(mainBoundingBox.width).toBeGreaterThan(400); // Reasonable width for tablet
          expect(mainBoundingBox.width).toBeLessThan(800);
        }
      });
    });
  });

  test.describe('Responsive Behavior', () => {
    test('responsive sidebar behavior across viewports', async ({ page }) => {
      // Start with desktop
      await page.setViewportSize({ width: 1920, height: 1080 });
      await loginAsClient(page);
      await page.goto('/client-dashboard');

      // Desktop: sidebar should be visible
      const sidebar = page.locator('.fixed.inset-y-0.left-0');
      await expect(sidebar).toBeVisible();

      // Resize to tablet
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.waitForTimeout(500); // Allow for responsive adjustments

      // Tablet: sidebar should still be visible
      await expect(sidebar).toBeVisible();

      // Resize to mobile
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForTimeout(500);

      // Mobile: sidebar should be hidden
      await expect(sidebar).not.toBeVisible();

      // Resize back to desktop
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.waitForTimeout(500);

      // Desktop: sidebar should be visible again
      await expect(sidebar).toBeVisible();
    });
  });

  test.describe('Layout Consistency', () => {
    viewports.forEach(viewport => {
      test(`consistent header and navigation across all pages at ${viewport.name}`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await loginAsClient(page);

        for (const pagePath of clientPages) {
          await page.goto(pagePath);
          await page.waitForTimeout(1000); // Allow page to fully render

          // Check header is present and properly positioned
          const header = page.locator('header');
          await expect(header).toBeVisible();

          const headerBoundingBox = await header.boundingBox();
          expect(headerBoundingBox?.y).toBeLessThan(100); // Should be at top

          // Check main content area
          const mainContent = page.locator('main, .flex-1, div:not(.fixed)');
          await expect(mainContent).toBeVisible();

          // Check content doesn't extend beyond viewport
          const bodyBoundingBox = await page.locator('body').boundingBox();
          const contentBoundingBox = await mainContent.boundingBox();

          if (bodyBoundingBox && contentBoundingBox) {
            expect(contentBoundingBox.width).toBeLessThanOrEqual(bodyBoundingBox.width + 50);
          }

          console.log(`${viewport.name} - ${pagePath} - Layout verified`);
        }
      });
    });
  });
});