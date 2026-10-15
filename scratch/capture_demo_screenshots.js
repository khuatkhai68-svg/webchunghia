const { chromium } = require('playwright');
const path = require('path');

async function captureDemo() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto('http://localhost:3000/');
  await page.waitForTimeout(500);

  // 1. Unpin to demonstrate normal auto-hide mode
  await page.evaluate(() => {
    const s = document.getElementById('leftSidebar');
    s.classList.remove('pinned');
    localStorage.removeItem('redmind_sidebar_pinned');
    window.app.updateSidebarPinUI();
  });
  await page.waitForTimeout(300);

  // Move mouse away to ensure it's hidden
  await page.mouse.move(700, 400);
  await page.waitForTimeout(400);

  // Capture State 1: Sidebar auto-hidden, 100% canvas space, peek tab visible
  const shot1Path = path.resolve(__dirname, 'screenshot_sidebar_hidden.png');
  await page.screenshot({ path: shot1Path });
  console.log('Saved Screenshot 1 (Hidden):', shot1Path);

  // 2. Hover over Peek Tab or left edge to reveal sidebar
  await page.hover('#sidebarPeekTab');
  await page.waitForTimeout(400);

  // Capture State 2: Sidebar smoothly slid out on hover
  const shot2Path = path.resolve(__dirname, 'screenshot_sidebar_revealed.png');
  await page.screenshot({ path: shot2Path });
  console.log('Saved Screenshot 2 (Revealed on Hover):', shot2Path);

  await browser.close();
}

captureDemo().catch(err => {
  console.error(err);
  process.exit(1);
});
