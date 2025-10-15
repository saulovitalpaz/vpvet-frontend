import { test, expect } from '@playwright/test';

test.describe('Client Dashboard Layout Screenshots', () => {
  const clientPages = [
    { path: '/client-dashboard', name: 'dashboard' },
    { path: '/client-dashboard/pets', name: 'pets' },
    { path: '/client-dashboard/consultas', name: 'consultas' },
    { path: '/client-dashboard/exames', name: 'exames' },
    { path: '/client-dashboard/historico', name: 'historico' },
    { path: '/client-dashboard/meus-dados', name: 'meus-dados' }
  ];

  // Helper function to login as client
  async function loginAsClient(page: any) {
    await page.goto('/');

    // Click on Consultar Resultados tab
    await page.click('text=Consultar Resultados');
    await page.waitForTimeout(500);

    // Wait for form to be visible
    await expect(page.locator('input#public-cpf')).toBeVisible();
    await expect(page.locator('input#public-code')).toBeVisible();

    // Fill in client credentials
    await page.fill('input#public-cpf', '123.456.789-00');
    await page.fill('input#public-code', 'TEST123');

    // Click login button
    await page.click('button:has-text("Consultar Resultado")');

    // Wait for navigation with extended timeout and retry logic
    try {
      await page.waitForURL('**/client-dashboard', { timeout: 15000 });
    } catch (e) {
      console.log('Navigation timeout reached, checking if we are on the right page...');
      // Check if we're still on the homepage (login might have failed)
      if (page.url().includes('localhost:3000/')) {
        // Try manual navigation as fallback
        await page.goto('/client-dashboard');
        await page.waitForLoadState('networkidle');
      }
    }

    // Verify we're logged in by checking for client dashboard elements
    // Try multiple possible welcome message variations
    const welcomeSelectors = [
      'text=Bem-vindo',
      'text=Bem vindo',
      'text=João Silva',
      'text=Dashboard',
      '[data-testid="client-dashboard"]',
      '.client-dashboard'
    ];

    let foundWelcome = false;
    for (const selector of welcomeSelectors) {
      try {
        await expect(page.locator(selector)).toBeVisible({ timeout: 3000 });
        foundWelcome = true;
        console.log(`Found welcome element with selector: ${selector}`);
        break;
      } catch (e) {
        // Continue trying other selectors
      }
    }

    if (!foundWelcome) {
      console.log('No explicit welcome message found, but proceeding anyway...');
      // Take a screenshot to debug what's on the page
      await page.screenshot({ path: 'test-results/debug/login-result.png' });
    }
  }

  test.describe('Desktop Screenshots', () => {
    test.use({ viewport: { width: 1920, height: 1080 } });

    clientPages.forEach(({ path, name }) => {
      test(`desktop screenshot for ${name}`, async ({ page }) => {
        // Login as client first
        await loginAsClient(page);

        // Navigate to the specific page
        await page.goto(path);

        // Wait for page to load
        await page.waitForLoadState('networkidle');

        // Take full page screenshot
        await page.screenshot({
          path: `test-results/screenshots/desktop-${name}.png`,
          fullPage: true
        });

        // Check key elements are present
        const sidebar = page.locator('nav').first();
        const header = page.locator('header').first();
        const mainContent = page.locator('main, .flex-1, main > div').first();

        console.log(`Desktop ${name} - Sidebar visible: ${await sidebar.isVisible()}`);
        console.log(`Desktop ${name} - Header visible: ${await header.isVisible()}`);
        console.log(`Desktop ${name} - Main content visible: ${await mainContent.isVisible()}`);

        // Get positioning information
        if (await sidebar.isVisible()) {
          const sidebarBounds = await sidebar.boundingBox();
          console.log(`Desktop ${name} - Sidebar bounds:`, sidebarBounds);
        }

        if (await header.isVisible()) {
          const headerBounds = await header.boundingBox();
          console.log(`Desktop ${name} - Header bounds:`, headerBounds);
        }

        if (await mainContent.isVisible()) {
          const mainBounds = await mainContent.boundingBox();
          console.log(`Desktop ${name} - Main content bounds:`, mainBounds);
        }
      });
    });
  });

  test.describe('Mobile Screenshots', () => {
    test.use({ viewport: { width: 375, height: 667 } });

    clientPages.forEach(({ path, name }) => {
      test(`mobile screenshot for ${name}`, async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });

        // Login as client first
        await loginAsClient(page);

        // Navigate to the specific page
        await page.goto(path);

        // Wait for page to load
        await page.waitForLoadState('networkidle');

        // Take full page screenshot
        await page.screenshot({
          path: `test-results/screenshots/mobile-${name}.png`,
          fullPage: true
        });

        // Check key elements are present
        const sidebar = page.locator('nav').first();
        const header = page.locator('header').first();
        const mainContent = page.locator('main, .flex-1, main > div').first();
        const hamburgerButton = page.locator('button:has(svg)').first();

        console.log(`Mobile ${name} - Sidebar visible: ${await sidebar.isVisible()}`);
        console.log(`Mobile ${name} - Header visible: ${await header.isVisible()}`);
        console.log(`Mobile ${name} - Main content visible: ${await mainContent.isVisible()}`);
        console.log(`Mobile ${name} - Hamburger button visible: ${await hamburgerButton.isVisible()}`);

        // Get positioning information
        if (await header.isVisible()) {
          const headerBounds = await header.boundingBox();
          console.log(`Mobile ${name} - Header bounds:`, headerBounds);
        }

        if (await mainContent.isVisible()) {
          const mainBounds = await mainContent.boundingBox();
          console.log(`Mobile ${name} - Main content bounds:`, mainBounds);

          // Check if content fits in mobile viewport
          const bodyBounds = await page.locator('body').boundingBox();
          if (bodyBounds && mainBounds) {
            const fitsInViewport = mainBounds.width <= bodyBounds.width + 10;
            console.log(`Mobile ${name} - Content fits in viewport: ${fitsInViewport}`);
          }
        }
      });
    });
  });

  test.describe('Tablet Screenshots', () => {
    test.use({ viewport: { width: 768, height: 1024 } });

    clientPages.forEach(({ path, name }) => {
      test(`tablet screenshot for ${name}`, async ({ page }) => {
        // Login as client first
        await loginAsClient(page);

        // Navigate to the specific page
        await page.goto(path);

        // Wait for page to load
        await page.waitForLoadState('networkidle');

        // Take full page screenshot
        await page.screenshot({
          path: `test-results/screenshots/tablet-${name}.png`,
          fullPage: true
        });

        // Check key elements are present
        const sidebar = page.locator('nav').first();
        const header = page.locator('header').first();
        const mainContent = page.locator('main, .flex-1, main > div').first();

        console.log(`Tablet ${name} - Sidebar visible: ${await sidebar.isVisible()}`);
        console.log(`Tablet ${name} - Header visible: ${await header.isVisible()}`);
        console.log(`Tablet ${name} - Main content visible: ${await mainContent.isVisible()}`);

        // Get positioning information
        if (await sidebar.isVisible()) {
          const sidebarBounds = await sidebar.boundingBox();
          console.log(`Tablet ${name} - Sidebar bounds:`, sidebarBounds);
        }

        if (await header.isVisible()) {
          const headerBounds = await header.boundingBox();
          console.log(`Tablet ${name} - Header bounds:`, headerBounds);
        }

        if (await mainContent.isVisible()) {
          const mainBounds = await mainContent.boundingBox();
          console.log(`Tablet ${name} - Main content bounds:`, mainBounds);
        }
      });
    });
  });

  test.describe('Navigation Test', () => {
    test('test mobile sidebar toggle on dashboard', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/client-dashboard');
      await page.waitForLoadState('networkidle');

      // Take initial screenshot
      await page.screenshot({
        path: 'test-results/screenshots/mobile-dashboard-initial.png',
        fullPage: true
      });

      // Click hamburger to open sidebar
      const hamburgerButton = page.locator('button:has(svg)').first();
      await hamburgerButton.click();
      await page.waitForTimeout(500);

      // Take screenshot with open sidebar
      await page.screenshot({
        path: 'test-results/screenshots/mobile-dashboard-sidebar-open.png',
        fullPage: true
      });

      // Check sidebar is visible
      const sidebar = page.locator('nav').first();
      console.log('Mobile sidebar open:', await sidebar.isVisible());

      // Close sidebar by clicking overlay
      const overlay = page.locator('.fixed.inset-0.z-40').first();
      if (await overlay.isVisible()) {
        await overlay.click();
        await page.waitForTimeout(500);
      }

      // Take screenshot with closed sidebar
      await page.screenshot({
        path: 'test-results/screenshots/mobile-dashboard-sidebar-closed.png',
        fullPage: true
      });
    });
  });

  test.describe('Layout Analysis', () => {
    test('analyze layout inconsistencies across pages', async ({ page }) => {
      const results = [];

      // Test desktop layout
      await page.setViewportSize({ width: 1920, height: 1080 });

      // Login as client first
      await loginAsClient(page);

      for (const { path, name } of clientPages) {
        await page.goto(path);
        await page.waitForLoadState('networkidle');

        const result = {
          page: name,
          path: path,
          viewport: 'desktop',
          sidebarVisible: false,
          headerVisible: false,
          mainContentVisible: false,
          sidebarX: null,
          mainX: null,
          mainWidth: null
        };

        try {
          const sidebar = page.locator('nav').first();
          result.sidebarVisible = await sidebar.isVisible();
          if (result.sidebarVisible) {
            const bounds = await sidebar.boundingBox();
            result.sidebarX = bounds?.x || null;
          }
        } catch (e) {
          console.log(`Error checking sidebar on ${name}:`, e.message);
        }

        try {
          const header = page.locator('header').first();
          result.headerVisible = await header.isVisible();
        } catch (e) {
          console.log(`Error checking header on ${name}:`, e.message);
        }

        try {
          const mainContent = page.locator('main, .flex-1, main > div').first();
          result.mainContentVisible = await mainContent.isVisible();
          if (result.mainContentVisible) {
            const bounds = await mainContent.boundingBox();
            result.mainX = bounds?.x || null;
            result.mainWidth = bounds?.width || null;
          }
        } catch (e) {
          console.log(`Error checking main content on ${name}:`, e.message);
        }

        results.push(result);
      }

      // Log results for analysis
      console.log('\n=== Desktop Layout Analysis ===');
      results.forEach(result => {
        console.log(`${result.page}:`);
        console.log(`  Sidebar: ${result.sidebarVisible}`);
        console.log(`  Header: ${result.headerVisible}`);
        console.log(`  Main Content: ${result.mainContentVisible}`);
        if (result.sidebarX !== null && result.mainX !== null) {
          const overlap = (result.sidebarX + 256) > result.mainX; // Assuming 256px sidebar width
          console.log(`  Layout Issue: ${overlap ? 'OVERLAP' : 'OK'}`);
        }
      });
    });
  });
});