import { test, expect } from '@playwright/test';

test.describe('Comprehensive Client Dashboard Layout Test', () => {
  const clientPages = [
    { path: '/client-dashboard', name: 'dashboard' },
    { path: '/client-dashboard/pets', name: 'pets' },
    { path: '/client-dashboard/consultas', name: 'consultas' },
    { path: '/client-dashboard/exames', name: 'exames' },
    { path: '/client-dashboard/historico', name: 'historico' },
    { path: '/client-dashboard/meus-dados', name: 'meus-dados' }
  ];

  // Helper function to set up client session
  async function setupClientSession(page: any) {
    // Set localStorage to simulate logged-in client
    await page.addInitScript(() => {
      localStorage.setItem('clientData', JSON.stringify({
        tutor_cpf: '12345678900',
        tutor_name: 'João Silva',
        email: 'joao.silva@email.com',
        phone: '(11) 98765-4321'
      }));
      localStorage.setItem('clientSession', 'true');
    });
  }

  test.describe('Desktop Layout (1920x1080)', () => {
    test.use({ viewport: { width: 1920, height: 1080 } });

    clientPages.forEach(({ path, name }) => {
      test(`desktop layout for ${name}`, async ({ page }) => {
        await setupClientSession(page);
        await page.goto(path);
        await page.waitForLoadState('networkidle');

        // Take full page screenshot
        await page.screenshot({
          path: `test-results/comprehensive/desktop-${name}.png`,
          fullPage: true
        });

        // Analyze layout elements
        const sidebar = page.locator('nav').first();
        const header = page.locator('header').first();
        const mainContent = page.locator('main, .flex-1, main > div').first();

        const sidebarVisible = await sidebar.isVisible();
        const headerVisible = await header.isVisible();
        const mainVisible = await mainContent.isVisible();

        console.log(`Desktop ${name} - Sidebar: ${sidebarVisible}, Header: ${headerVisible}, Main: ${mainVisible}`);

        // Get positioning information
        if (sidebarVisible) {
          const sidebarBounds = await sidebar.boundingBox();
          console.log(`Desktop ${name} - Sidebar bounds:`, sidebarBounds);
        }

        if (headerVisible) {
          const headerBounds = await header.boundingBox();
          console.log(`Desktop ${name} - Header bounds:`, headerBounds);
        }

        if (mainVisible) {
          const mainBounds = await mainContent.boundingBox();
          console.log(`Desktop ${name} - Main bounds:`, mainBounds);
        }

        // Check for common layout issues
        const bodyBounds = await page.locator('body').boundingBox();
        if (bodyBounds && mainVisible) {
          const mainBounds = await mainContent.boundingBox();
          if (mainBounds) {
            const horizontalOverflow = (mainBounds.x + mainBounds.width) > bodyBounds.width;
            console.log(`Desktop ${name} - Horizontal overflow: ${horizontalOverflow}`);

            if (horizontalOverflow) {
              console.log(`ERROR: Desktop ${name} has horizontal overflow! Content width: ${mainBounds.width}, Body width: ${bodyBounds.width}`);
            }
          }
        }
      });
    });
  });

  test.describe('Mobile Layout (375x667)', () => {
    test.use({ viewport: { width: 375, height: 667 } });

    clientPages.forEach(({ path, name }) => {
      test(`mobile layout for ${name}`, async ({ page }) => {
        await setupClientSession(page);
        await page.goto(path);
        await page.waitForLoadState('networkidle');

        // Take full page screenshot
        await page.screenshot({
          path: `test-results/comprehensive/mobile-${name}.png`,
          fullPage: true
        });

        // Analyze layout elements
        const sidebar = page.locator('nav').first();
        const header = page.locator('header').first();
        const mainContent = page.locator('main, .flex-1, main > div').first();
        const hamburgerButton = page.locator('button:has(svg)').first();

        const sidebarVisible = await sidebar.isVisible();
        const headerVisible = await header.isVisible();
        const mainVisible = await mainContent.isVisible();
        const hamburgerVisible = await hamburgerButton.isVisible();

        console.log(`Mobile ${name} - Sidebar: ${sidebarVisible}, Header: ${headerVisible}, Main: ${mainVisible}, Hamburger: ${hamburgerVisible}`);

        // On mobile, sidebar should be hidden by default
        if (sidebarVisible) {
          console.log(`WARNING: Mobile ${name} - Sidebar is visible (should be hidden by default)`);
        }

        // Get positioning information
        if (headerVisible) {
          const headerBounds = await header.boundingBox();
          console.log(`Mobile ${name} - Header bounds:`, headerBounds);
        }

        if (mainVisible) {
          const mainBounds = await mainContent.boundingBox();
          console.log(`Mobile ${name} - Main bounds:`, mainBounds);

          // Check if content fits in mobile viewport
          const bodyBounds = await page.locator('body').boundingBox();
          if (bodyBounds) {
            const fitsInViewport = mainBounds.width <= bodyBounds.width + 10;
            console.log(`Mobile ${name} - Content fits in viewport: ${fitsInViewport}`);

            if (!fitsInViewport) {
              console.log(`ERROR: Mobile ${name} content does not fit in viewport! Content width: ${mainBounds.width}, Viewport width: ${bodyBounds.width}`);
            }
          }
        }

        // Test mobile sidebar interaction if hamburger is visible
        if (hamburgerVisible) {
          await hamburgerButton.click();
          await page.waitForTimeout(500);

          const sidebarVisibleAfterClick = await sidebar.isVisible();
          console.log(`Mobile ${name} - Sidebar visible after hamburger click: ${sidebarVisibleAfterClick}`);

          if (sidebarVisibleAfterClick) {
            // Take screenshot with open sidebar
            await page.screenshot({
              path: `test-results/comprehensive/mobile-${name}-sidebar-open.png`,
              fullPage: true
            });

            // Close sidebar by clicking overlay
            const overlay = page.locator('.fixed.inset-0.z-40').first();
            if (await overlay.isVisible()) {
              await overlay.click();
              await page.waitForTimeout(500);
            }
          }
        }
      });
    });
  });

  test.describe('Tablet Layout (768x1024)', () => {
    test.use({ viewport: { width: 768, height: 1024 } });

    clientPages.forEach(({ path, name }) => {
      test(`tablet layout for ${name}`, async ({ page }) => {
        await setupClientSession(page);
        await page.goto(path);
        await page.waitForLoadState('networkidle');

        // Take full page screenshot
        await page.screenshot({
          path: `test-results/comprehensive/tablet-${name}.png`,
          fullPage: true
        });

        // Analyze layout elements
        const sidebar = page.locator('nav').first();
        const header = page.locator('header').first();
        const mainContent = page.locator('main, .flex-1, main > div').first();

        const sidebarVisible = await sidebar.isVisible();
        const headerVisible = await header.isVisible();
        const mainVisible = await mainContent.isVisible();

        console.log(`Tablet ${name} - Sidebar: ${sidebarVisible}, Header: ${headerVisible}, Main: ${mainVisible}`);

        // Get positioning information
        if (sidebarVisible) {
          const sidebarBounds = await sidebar.boundingBox();
          console.log(`Tablet ${name} - Sidebar bounds:`, sidebarBounds);
        }

        if (headerVisible) {
          const headerBounds = await header.boundingBox();
          console.log(`Tablet ${name} - Header bounds:`, headerBounds);
        }

        if (mainVisible) {
          const mainBounds = await mainContent.boundingBox();
          console.log(`Tablet ${name} - Main bounds:`, mainBounds);

          // Check if content fits in tablet viewport
          const bodyBounds = await page.locator('body').boundingBox();
          if (bodyBounds) {
            const fitsInViewport = mainBounds.width <= bodyBounds.width + 10;
            console.log(`Tablet ${name} - Content fits in viewport: ${fitsInViewport}`);

            if (!fitsInViewport) {
              console.log(`ERROR: Tablet ${name} content does not fit in viewport! Content width: ${mainBounds.width}, Viewport width: ${bodyBounds.width}`);
            }
          }
        }
      });
    });
  });

  test.describe('Layout Consistency Analysis', () => {
    test('analyze layout consistency across all pages and viewports', async ({ page }) => {
      const viewports = [
        { name: 'desktop', width: 1920, height: 1080 },
        { name: 'tablet', width: 768, height: 1024 },
        { name: 'mobile', width: 375, height: 667 }
      ];

      const analysisResults = [];

      for (const viewport of viewports) {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await setupClientSession(page);

        console.log(`\n=== Analyzing ${viewport.name} viewport ===`);

        for (const { path, name } of clientPages) {
          await page.goto(path);
          await page.waitForLoadState('networkidle');

          const result = {
            viewport: viewport.name,
            page: name,
            path: path,
            sidebarVisible: false,
            headerVisible: false,
            mainContentVisible: false,
            sidebarX: null,
            mainX: null,
            mainWidth: null,
            overlap: false,
            horizontalOverflow: false
          };

          // Check sidebar
          try {
            const sidebar = page.locator('nav').first();
            result.sidebarVisible = await sidebar.isVisible();
            if (result.sidebarVisible) {
              const bounds = await sidebar.boundingBox();
              result.sidebarX = bounds?.x || null;
            }
          } catch (e) {
            console.log(`Error checking sidebar on ${viewport.name} ${name}:`, e.message);
          }

          // Check header
          try {
            const header = page.locator('header').first();
            result.headerVisible = await header.isVisible();
          } catch (e) {
            console.log(`Error checking header on ${viewport.name} ${name}:`, e.message);
          }

          // Check main content
          try {
            const mainContent = page.locator('main, .flex-1, main > div').first();
            result.mainContentVisible = await mainContent.isVisible();
            if (result.mainContentVisible) {
              const bounds = await mainContent.boundingBox();
              result.mainX = bounds?.x || null;
              result.mainWidth = bounds?.width || null;
            }
          } catch (e) {
            console.log(`Error checking main content on ${viewport.name} ${name}:`, e.message);
          }

          // Check for overlap and overflow
          if (result.sidebarX !== null && result.mainX !== null) {
            result.overlap = (result.sidebarX + 256) > result.mainX; // Assuming 256px sidebar width
          }

          // Check for horizontal overflow
          const bodyBounds = await page.locator('body').boundingBox();
          if (bodyBounds && result.mainWidth !== null) {
            result.horizontalOverflow = result.mainWidth > bodyBounds.width;
          }

          analysisResults.push(result);
        }
      }

      // Log analysis results
      console.log('\n=== LAYOUT ANALYSIS RESULTS ===');
      const issues = [];

      analysisResults.forEach(result => {
        console.log(`\n${result.viewport.toUpperCase()} - ${result.page}:`);
        console.log(`  Sidebar: ${result.sidebarVisible}`);
        console.log(`  Header: ${result.headerVisible}`);
        console.log(`  Main Content: ${result.mainContentVisible}`);

        if (result.overlap) {
          console.log(`  ❌ OVERLAP: Sidebar and main content overlap!`);
          issues.push(`${result.viewport} ${result.page}: Sidebar and main content overlap`);
        }

        if (result.horizontalOverflow) {
          console.log(`  ❌ HORIZONTAL OVERFLOW: Content exceeds viewport width!`);
          issues.push(`${result.viewport} ${result.page}: Horizontal overflow detected`);
        }

        if (!result.overlap && !result.horizontalOverflow) {
          console.log(`  ✅ Layout looks good`);
        }
      });

      if (issues.length > 0) {
        console.log(`\n=== LAYOUT ISSUES FOUND ===`);
        issues.forEach(issue => console.log(`❌ ${issue}`));
      } else {
        console.log(`\n=== NO LAYOUT ISSUES FOUND ===`);
        console.log(`✅ All pages look good across all viewports!`);
      }
    });
  });
});