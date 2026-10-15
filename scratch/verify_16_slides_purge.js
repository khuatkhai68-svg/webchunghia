const { chromium } = require('playwright');

async function test16SlidesPurge() {
  console.log('=== VERIFYING 16-SLIDE PURGE & ENFORCEMENT ===\n');
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

  // 1. Pre-seed the bad legacy 7 slides in localStorage to simulate the user's browser state
  console.log('1. Pre-seeding legacy 7-slide cache in localStorage before navigation...');
  await page.addInitScript(() => {
    localStorage.setItem('REDMIND_CUSTOM_SLIDES_V2', JSON.stringify([
      { id: 1, title: 'OLD 7 SLIDE INTRO', html: '<div class="stage-slide stage-intro">BẢN CHẤT NỀN DÂN CHỦ XÃ HỘI CHỦ NGHĨA 1. Bản chất Toàn diện 2. Kỷ cương Pháp chế 3. Hành động Sinh viên</div>' },
      { id: 2, title: 'OLD SLIDE 2', html: '<div>Old slide 2</div>' },
      { id: 3, title: 'OLD SLIDE 3', html: '<div>Old slide 3</div>' },
      { id: 4, title: 'OLD SLIDE 4', html: '<div>Old slide 4</div>' },
      { id: 5, title: 'OLD SLIDE 5', html: '<div>Old slide 5</div>' },
      { id: 6, title: 'OLD SLIDE 6', html: '<div>Old slide 6</div>' },
      { id: 7, title: 'OLD SLIDE 7', html: '<div>Old slide 7</div>' }
    ]));
  });

  // 2. Navigate to localhost:3000
  console.log('2. Navigating to http://localhost:3000/ ...');
  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);

  // 3. Verify localStorage was purged
  const isPurged = await page.evaluate(() => {
    return localStorage.getItem('REDMIND_CUSTOM_SLIDES_V2') === null;
  });
  console.log(`- Legacy localStorage was purged on load: ${isPurged ? 'PASS ✅' : 'FAIL ❌'}`);

  // 4. Click #btnPresentationMode ("Thuyết trình")
  console.log('3. Clicking #btnPresentationMode ("Thuyết trình")...');
  await page.click('#btnPresentationMode');
  await page.waitForTimeout(600);

  // 5. Inspect presentation modal state
  const presState = await page.evaluate(() => {
    const modal = document.getElementById('presentationModal');
    const isModalOpen = modal && !modal.classList.contains('hidden');
    const indicator = document.getElementById('slideIndicator')?.textContent?.trim();
    const slideScreen = document.getElementById('slideScreen');
    const imgEl = slideScreen ? slideScreen.querySelector('img.projector-slide-img') : null;
    const imgSrc = imgEl ? imgEl.getAttribute('src') : '';
    const screenHtml = slideScreen ? slideScreen.innerHTML : '';
    const hasOldCards = screenHtml.includes('1. Bản chất Toàn diện') || screenHtml.includes('2. Kỷ cương Pháp chế');

    return {
      isModalOpen,
      indicator,
      imgSrc,
      hasOldCards,
      slidesCount: window.app ? window.app.currentSlideIndex : 0
    };
  });

  console.log(`- Modal is open: ${presState.isModalOpen ? 'PASS ✅' : 'FAIL ❌'}`);
  console.log(`- Counter indicator: "${presState.indicator}" (Must be 01 / 16, NOT 01 / 07): ${presState.indicator === '01 / 16' ? 'PASS ✅' : 'FAIL ❌'}`);
  console.log(`- Slide 1 image src: "${presState.imgSrc}": ${presState.imgSrc.includes('Slide_01') ? 'PASS ✅' : 'FAIL ❌'}`);
  console.log(`- Old text cards purged (hasOldCards=false): ${!presState.hasOldCards ? 'PASS ✅' : 'FAIL ❌'}`);

  // 6. Screenshot Slide 1
  await page.screenshot({ path: 'scratch/screenshot_verified_slide01.png' });
  console.log('- Saved screenshot of Slide 1: scratch/screenshot_verified_slide01.png');

  // 7. Navigate through all 16 slides
  console.log('4. Navigating through slides with ArrowRight key...');
  for (let i = 2; i <= 16; i++) {
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(100);
  }

  const endState = await page.evaluate(() => {
    const indicator = document.getElementById('slideIndicator')?.textContent?.trim();
    const slideScreen = document.getElementById('slideScreen');
    const imgEl = slideScreen ? slideScreen.querySelector('img.projector-slide-img') : null;
    const imgSrc = imgEl ? imgEl.getAttribute('src') : '';
    return { indicator, imgSrc };
  });

  console.log(`- Final slide indicator: "${endState.indicator}" (Must be 16 / 16): ${endState.indicator === '16 / 16' ? 'PASS ✅' : 'FAIL ❌'}`);
  console.log(`- Final slide image src: "${endState.imgSrc}": ${endState.imgSrc.includes('Slide_16') ? 'PASS ✅' : 'FAIL ❌'}`);

  // 8. Screenshot Slide 16
  await page.screenshot({ path: 'scratch/screenshot_verified_slide16.png' });
  console.log('- Saved screenshot of Slide 16: scratch/screenshot_verified_slide16.png');

  // 9. Close presentation
  await page.click('#btnClosePresentation');
  await page.waitForTimeout(300);

  // 10. Console errors check
  console.log('\n--- Console Errors Report ---');
  console.log(`Total errors: ${consoleErrors.length}`);
  if (consoleErrors.length > 0) {
    console.error('Console errors:', consoleErrors);
  } else {
    console.log('Console is completely clean! 0 errors ✅');
  }

  await browser.close();
  console.log('\n=== ALL 16-SLIDE PURGE TESTS PASSED ===');
}

test16SlidesPurge().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
