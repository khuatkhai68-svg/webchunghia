const { chromium } = require('playwright');

(async () => {
  let browser;
  try {
    browser = await chromium.launch({ channel: 'msedge', headless: true });
  } catch (e) {
    browser = await chromium.launch({ headless: true });
  }

  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await context.newPage();

  await page.goto('http://localhost:3000/presentation/index.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500); // Wait for opening curtain

  // Trigger mouse move to show HUD
  await page.mouse.move(960, 540);
  await page.waitForTimeout(300);

  // 1. Capture Slide 01
  await page.screenshot({ path: 'scratch/screenshot_presentation_slide01.png' });
  console.log('Saved screenshot_presentation_slide01.png');

  // 2. Navigate to Slide 05 (Section Reveal)
  for (let i = 0; i < 4; i++) {
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(750);
  }
  await page.mouse.move(960, 540);
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'scratch/screenshot_presentation_slide05.png' });
  console.log('Saved screenshot_presentation_slide05.png');

  // 3. Navigate to Slide 10 (Silk Wave)
  for (let i = 0; i < 5; i++) {
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(750);
  }
  await page.mouse.move(960, 540);
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'scratch/screenshot_presentation_slide10.png' });
  console.log('Saved screenshot_presentation_slide10.png');

  // 4. Navigate to Slide 16 (Final conclusion)
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(750);
  }
  await page.mouse.move(960, 540);
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'scratch/screenshot_presentation_slide16.png' });
  console.log('Saved screenshot_presentation_slide16.png');

  await browser.close();
})();
