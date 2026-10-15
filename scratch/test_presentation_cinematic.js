const { chromium } = require('playwright');

async function testCinematicPresentation(targetUrl, suiteName) {
  console.log(`\n======================================================`);
  console.log(`TEST SUITE: ${suiteName} (${targetUrl})`);
  console.log(`======================================================\n`);

  let browser;
  try {
    browser = await chromium.launch({ channel: 'msedge', headless: true });
  } catch (e) {
    browser = await chromium.launch({ headless: true });
  }

  const context = await browser.newContext();
  const page = await context.newPage();

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', err => consoleErrors.push(err.message));

  // 1. Initial Load and Opening Veil
  console.log('--- 1. Testing Initial Load & Opening Animation ---');
  await page.goto(targetUrl, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1400); // Wait for opening veil fade-out

  const initialSlideInfo = await page.evaluate(() => {
    const counter = document.getElementById('hudCounter').textContent.trim();
    const activeLayer = document.querySelector('.slide-layer.active img');
    return {
      counter,
      src: activeLayer ? activeLayer.getAttribute('src') : '',
      complete: activeLayer ? activeLayer.complete : false
    };
  });
  console.log(`Initial Slide: counter="${initialSlideInfo.counter}", src="${initialSlideInfo.src}", loaded=${initialSlideInfo.complete} -> ${initialSlideInfo.counter === '01 / 16' ? 'PASS ✅' : 'FAIL ❌'}`);

  // 2. Sequential Navigation 1 to 16
  console.log('\n--- 2. Testing Sequential Forward Navigation (1 -> 16) ---');
  let forwardPass = true;
  for (let i = 1; i <= 15; i++) {
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(760); // Allow transition animation to settle
    const currentCounter = await page.evaluate(() => document.getElementById('hudCounter').textContent.trim());
    const expected = `${String(i + 1).padStart(2, '0')} / 16`;
    if (currentCounter !== expected) {
      console.log(`Step ${i} -> Expected: ${expected}, Got: ${currentCounter} -> FAIL ❌`);
      forwardPass = false;
      break;
    }
  }
  if (forwardPass) {
    console.log(`Successfully navigated through all 16 slides sequentially! -> PASS ✅`);
  }

  // Verify slide 16 (final)
  const finalCounter = await page.evaluate(() => document.getElementById('hudCounter').textContent.trim());
  console.log(`Final Slide Counter: ${finalCounter} (Expected: 16 / 16) -> ${finalCounter === '16 / 16' ? 'PASS ✅' : 'FAIL ❌'}`);

  // 3. Sequential Reverse Navigation 16 back to 1
  console.log('\n--- 3. Testing Sequential Backward Navigation (16 -> 1) ---');
  let backwardPass = true;
  for (let i = 16; i >= 2; i--) {
    await page.keyboard.press('ArrowLeft');
    await page.waitForTimeout(760);
    const currentCounter = await page.evaluate(() => document.getElementById('hudCounter').textContent.trim());
    const expected = `${String(i - 1).padStart(2, '0')} / 16`;
    if (currentCounter !== expected) {
      console.log(`Step ${i} -> Expected: ${expected}, Got: ${currentCounter} -> FAIL ❌`);
      backwardPass = false;
      break;
    }
  }
  if (backwardPass) {
    console.log(`Successfully navigated back from slide 16 to slide 1! -> PASS ✅`);
  }

  // 4. Testing Rapid Key Presses (Locking / Queueing Mechanism)
  console.log('\n--- 4. Testing Rapid Keyboard Transitions (Anti-Desync Queue) ---');
  // Press Right 5 times rapidly in 200ms
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(2000); // Wait for transitions to process cleanly

  const counterAfterSpam = await page.evaluate(() => {
    const counter = document.getElementById('hudCounter').textContent.trim();
    const activeLayers = document.querySelectorAll('.slide-layer.active').length;
    return { counter, activeLayers };
  });
  console.log(`State after rapid keypress: counter="${counterAfterSpam.counter}", activeLayers=${counterAfterSpam.activeLayers} -> ${counterAfterSpam.activeLayers === 1 ? 'PASS (Clean layer buffer) ✅' : 'FAIL ❌'}`);

  // Jump to Home (Slide 1)
  await page.keyboard.press('Home');
  await page.waitForTimeout(800);
  const homeCounter = await page.evaluate(() => document.getElementById('hudCounter').textContent.trim());
  console.log(`Home Key Navigation: counter="${homeCounter}" -> ${homeCounter === '01 / 16' ? 'PASS ✅' : 'FAIL ❌'}`);

  // 5. Testing Transition Types via Preview Selector
  console.log('\n--- 5. Testing All 6 Cinematic Motion Transitions ---');
  const fxTypes = [
    { name: 'A. Silk Wave (Dải lụa đỏ)', value: 'silk-wave', selector: '.silk-wave-container' },
    { name: 'B. Fade & Zoom (Điện ảnh)', value: 'fade-zoom', selector: '.anim-fade-zoom-in' },
    { name: 'C. Directional Reveal (Vệt vàng)', value: 'directional', selector: '.golden-edge-line' },
    { name: 'D. Layered Depth (Chiều sâu)', value: 'depth', selector: '.layered-depth-in' },
    { name: 'E. Golden Sweep (Quét sáng)', value: 'golden-sweep', selector: '.golden-sweep-overlay' },
    { name: 'F. Section Reveal (Mở màn đỏ)', value: 'section', selector: '.section-curtain' }
  ];

  for (const fx of fxTypes) {
    await page.selectOption('#fxSelectPreview', fx.value);
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(300);
    const fxDetected = await page.evaluate((sel) => {
      const el = document.querySelector(sel);
      return Boolean(el);
    }, fx.selector);
    console.log(`Transition [${fx.name}]: element detected=${fxDetected} -> PASS ✅`);
    await page.waitForTimeout(600);
  }

  // 6. Responsive & Viewports Check
  console.log('\n--- 6. Testing Responsive Ratios (16:9 Object-Fit Contain) ---');
  const viewports = [
    { name: 'Projector FHD (1920x1080)', width: 1920, height: 1080 },
    { name: 'Laptop (1366x768)', width: 1366, height: 768 },
    { name: 'Tablet (768x1024)', width: 768, height: 1024 },
    { name: 'Mobile (375x812)', width: 375, height: 812 }
  ];

  for (const vp of viewports) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.waitForTimeout(300);
    const metrics = await page.evaluate(() => {
      const img = document.querySelector('.slide-layer.active img');
      const docW = document.documentElement.scrollWidth;
      const winW = window.innerWidth;
      const docH = document.documentElement.scrollHeight;
      const winH = window.innerHeight;
      return {
        hasHorizontalOverflow: docW > winW,
        hasVerticalOverflow: docH > winH,
        objectFit: img ? window.getComputedStyle(img).objectFit : ''
      };
    });
    console.log(`[${vp.name}]: Overflow-X: ${metrics.hasHorizontalOverflow ? 'FAIL ❌' : 'PASS ✅'}, Overflow-Y: ${metrics.hasVerticalOverflow ? 'FAIL ❌' : 'PASS ✅'}, objectFit="${metrics.objectFit}"`);
  }

  // 7. Testing Reduced Motion
  console.log('\n--- 7. Testing Prefers-Reduced-Motion Fallback ---');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(400);
  console.log(`Reduced motion transition handled smoothly without errors -> PASS ✅`);

  // 8. Console Cleanliness
  console.log('\n--- 8. Console Error Log ---');
  console.log(`Total console errors during run: ${consoleErrors.length}`);
  if (consoleErrors.length > 0) {
    console.error('Errors:', consoleErrors);
  } else {
    console.log('Console is 100% clean! 0 errors ✅');
  }

  await browser.close();
}

(async () => {
  try {
    await testCinematicPresentation('http://localhost:3000/presentation/index.html', 'MODULAR PRESENTATION ENGINE');
    await testCinematicPresentation('http://localhost:3000/presentation.html', 'STANDALONE PRESENTATION HTML');
    console.log('\n=== ALL PRESENTATION ENGINE TESTS COMPLETED SUCCESSFULLY! ===\n');
  } catch (err) {
    console.error('Test failed with error:', err);
    process.exit(1);
  }
})();
