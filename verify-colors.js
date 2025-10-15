const { chromium } = require('@playwright/test');

async function verifyIconColors() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Navigate to the dashboard (may need to login first)
    await page.goto('http://localhost:3001/login');

    // Wait for page to load
    await page.waitForTimeout(2000);

    // Try to login - look for login form
    const emailInput = await page.$('input[type="email"], input[name="email"]');
    const passwordInput = await page.$('input[type="password"], input[name="password"]');

    if (emailInput && passwordInput) {
      await emailInput.fill('test@example.com');
      await passwordInput.fill('password123');

      const submitButton = await page.$('button[type="submit"]');
      if (submitButton) {
        await submitButton.click();
        await page.waitForTimeout(2000);
      }
    }

    // Navigate to dashboard if not already there
    await page.goto('http://localhost:3001/dashboard');
    await page.waitForTimeout(3000);

    // Get the four card icons
    const cardIcons = await page.$$('.w-10.h-10.rounded-lg');

    console.log(`Found ${cardIcons.length} card icons`);

    for (let i = 0; i < Math.min(4, cardIcons.length); i++) {
      const icon = cardIcons[i];
      const backgroundColor = await icon.evaluate(el =>
        getComputedStyle(el).backgroundColor
      );
      const backgroundClass = await icon.evaluate(el =>
        el.className
      );

      console.log(`Card ${i + 1}:`);
      console.log(`  Classes: ${backgroundClass}`);
      console.log(`  Background color: ${backgroundColor}`);

      // Check if it has emerald color
      const hasEmerald = backgroundClass.includes('emerald') ||
                        backgroundColor.includes('72, 187, 120') || // emerald-500
                        backgroundColor.includes('16, 185, 129') || // emerald-600
                        backgroundColor.includes('5, 150, 105') ||   // emerald-700
                        backgroundColor.includes('236, 253, 245');  // emerald-50

      console.log(`  Has emerald color: ${hasEmerald}`);
      console.log('');
    }

    // Take a screenshot for visual verification
    await page.screenshot({ path: 'dashboard-screenshot.png', fullPage: true });
    console.log('Screenshot saved as dashboard-screenshot.png');

  } catch (error) {
    console.error('Error during verification:', error);
  } finally {
    await browser.close();
  }
}

verifyIconColors();