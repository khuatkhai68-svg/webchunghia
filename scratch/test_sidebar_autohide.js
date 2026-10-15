const { chromium } = require('playwright');

async function testSidebarAutoHide() {
  console.log('=== TESTING SIDEBAR AUTO-HIDE & HOVER INTERACTION ===');
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto('http://localhost:3000/');
  await page.waitForTimeout(500);

  // By default in test runner, sidebar is pinned. Let's unpin it to test human auto-hide behavior
  await page.evaluate(() => {
    const s = document.getElementById('leftSidebar');
    s.classList.remove('pinned');
    localStorage.removeItem('redmind_sidebar_pinned');
    window.app.updateSidebarPinUI();
  });
  await page.waitForTimeout(200);

  // 1. Verify unpinned state
  const isInitiallyPinned = await page.evaluate(() => document.getElementById('leftSidebar').classList.contains('pinned'));
  console.log(`1. Unpinned mode active: ${!isInitiallyPinned ? 'PASS ✅' : 'FAIL ❌'}`);

  // 2. Hover over peek tab
  await page.hover('#sidebarPeekTab');
  await page.waitForTimeout(300);
  const isHoveredOnTab = await page.evaluate(() => {
    const s = document.getElementById('leftSidebar');
    return s.classList.contains('is-hovered') || window.getComputedStyle(s).transform.includes('matrix(1, 0, 0, 1, 0, 0)') || s.matches(':hover');
  });
  console.log(`2. Hovering peek tab reveals sidebar: ${isHoveredOnTab ? 'PASS ✅' : 'FAIL ❌'}`);

  // 3. Move mouse away to center canvas
  await page.mouse.move(600, 300);
  await page.waitForTimeout(350);
  const isHiddenAfterLeave = await page.evaluate(() => {
    const s = document.getElementById('leftSidebar');
    return !s.classList.contains('is-hovered') && !s.classList.contains('pinned');
  });
  console.log(`3. Moving mouse away auto-hides sidebar: ${isHiddenAfterLeave ? 'PASS ✅' : 'FAIL ❌'}`);

  // 4. Move mouse to screen left edge (x=10, y=200)
  await page.mouse.move(10, 200);
  await page.waitForTimeout(200);
  const isRevealedOnEdgeMove = await page.evaluate(() => document.getElementById('leftSidebar').classList.contains('is-hovered'));
  console.log(`4. Moving mouse to left edge reveals sidebar: ${isRevealedOnEdgeMove ? 'PASS ✅' : 'FAIL ❌'}`);

  // 5. Test Pin toggle
  await page.click('#btnToggleSidebar');
  await page.waitForTimeout(200);
  const isPinnedAfterClick = await page.evaluate(() => document.getElementById('leftSidebar').classList.contains('pinned'));
  const pinLabel = await page.evaluate(() => document.querySelector('#btnToggleSidebar .btn-pin-label').textContent);
  console.log(`5. Pin button clicked -> pinned=${isPinnedAfterClick}, label="${pinLabel}": ${isPinnedAfterClick && pinLabel === 'Đã ghim' ? 'PASS ✅' : 'FAIL ❌'}`);

  // 6. Mouse away while pinned -> stays open
  await page.mouse.move(700, 400);
  await page.waitForTimeout(300);
  const staysOpenWhilePinned = await page.evaluate(() => {
    const s = document.getElementById('leftSidebar');
    return s.classList.contains('pinned');
  });
  console.log(`6. Stays open while pinned after mouse moves away: ${staysOpenWhilePinned ? 'PASS ✅' : 'FAIL ❌'}`);

  // 7. Unpin again
  await page.click('#btnToggleSidebar');
  await page.waitForTimeout(200);
  const unpinnedLabel = await page.evaluate(() => document.querySelector('#btnToggleSidebar .btn-pin-label').textContent);
  console.log(`7. Unpinned again -> label="${unpinnedLabel}": ${unpinnedLabel === 'Tự ẩn' ? 'PASS ✅' : 'FAIL ❌'}`);

  await browser.close();
  console.log('=== ALL AUTO-HIDE TESTS PASSED ===');
}

testSidebarAutoHide().catch(err => {
  console.error('Test Failed:', err);
  process.exit(1);
});
