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

  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Click branch 1 card ("1. Bản chất Giai cấp")
  await page.evaluate(() => window.app.selectBranch(1, true));
  await page.waitForTimeout(500);

  // Check state of drawer and backdrop
  const popupState = await page.evaluate(() => {
    const drawer = document.getElementById('rightDrawer');
    const backdrop = document.getElementById('drawerBackdrop');
    const rect = drawer.getBoundingClientRect();
    const style = window.getComputedStyle(drawer);
    return {
      isOpen: !drawer.classList.contains('closed'),
      backdropVisible: !backdrop.classList.contains('hidden'),
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      isCenteredX: Math.abs((rect.left + rect.width / 2) - window.innerWidth / 2) < 20,
      isCenteredY: Math.abs((rect.top + rect.height / 2) - window.innerHeight / 2) < 20,
      title: document.getElementById('questionTitle').textContent.trim()
    };
  });

  console.log('Centered Popup Modal State:', popupState);

  // Capture screenshot of the centered popup
  await page.screenshot({ path: 'scratch/screenshot_centered_branch_popup.png' });
  console.log('Saved screenshot_centered_branch_popup.png');

  // Test close by clicking backdrop
  await page.click('#drawerBackdrop', { position: { x: 50, y: 50 } });
  await page.waitForTimeout(400);

  const afterBackdropClick = await page.evaluate(() => {
    const drawer = document.getElementById('rightDrawer');
    const backdrop = document.getElementById('drawerBackdrop');
    return {
      isClosed: drawer.classList.contains('closed'),
      backdropHidden: backdrop.classList.contains('hidden')
    };
  });
  console.log('After Backdrop Click:', afterBackdropClick);

  await browser.close();
})();
