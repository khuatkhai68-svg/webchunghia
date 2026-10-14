const { chromium } = require('playwright');
const fs = require('fs');

const PROJECTOR_VIEWPORTS = [
  { name: 'FHD_1920x1080', width: 1920, height: 1080 },
  { name: 'Laptop_1366x768', width: 1366, height: 768 },
  { name: 'HD_1280x720', width: 1280, height: 720 },
  { name: 'XGA_1024x768', width: 1024, height: 768 }
];

async function runProjectorTests() {
  console.log('=== STARTING PROJECTOR STAGE & PRESENTATION QA SUITE ===\n');
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

  // 1. TEST PROJECTOR RESOLUTIONS & SCROLLBAR ABSENCE
  console.log('--- 1. Testing Projector Viewports & Zero Scrollbar ---');
  for (const vp of PROJECTOR_VIEWPORTS) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(400);

    // Open presentation modal
    await page.click('#btnPresentationMode');
    await page.waitForTimeout(400);

    const stageData = await page.evaluate(() => {
      const modal = document.getElementById('presentationModal');
      const screen = document.getElementById('slideScreen');
      const hasModalScroll = modal ? modal.scrollHeight > modal.clientHeight + 2 : false;
      const hasScreenScroll = screen ? screen.scrollHeight > screen.clientHeight + 2 : false;
      const title = document.getElementById('slideTitle') ? document.getElementById('slideTitle').textContent : '';
      const indicator = document.getElementById('slideIndicator') ? document.getElementById('slideIndicator').textContent : '';
      return {
        isOpen: modal && !modal.classList.contains('hidden'),
        hasModalScroll,
        hasScreenScroll,
        modalW: modal ? modal.clientWidth : 0,
        modalH: modal ? modal.clientHeight : 0,
        title,
        indicator
      };
    });

    const passedScroll = !stageData.hasModalScroll && !stageData.hasScreenScroll;
    console.log('[' + vp.name + '] Size=' + stageData.modalW + 'x' + stageData.modalH + ' | Zero Scrollbar: ' + (passedScroll ? 'PASS ✅' : 'FAIL ❌') + ' | Indicator: ' + stageData.indicator);

    // Close presentation
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
  }

  // 2. TEST SLIDE PROGRESSION & DYNAMIC BACKGROUNDS (1920x1080)
  console.log('\n--- 2. Testing 7 Scenes Progression & Dynamic Scrim Backgrounds ---');
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(400);

  await page.click('#btnPresentationMode');
  await page.waitForTimeout(400);

  for (let scene = 0; scene < 7; scene++) {
    const sceneInfo = await page.evaluate(() => {
      const scrim = document.getElementById('presentStageScrim');
      const title = document.getElementById('slideTitle') ? document.getElementById('slideTitle').textContent : '';
      const indicator = document.getElementById('slideIndicator') ? document.getElementById('slideIndicator').textContent : '';
      const bg = scrim ? window.getComputedStyle(scrim).backgroundImage : '';
      return { title, indicator, bg };
    });

    console.log('Scene ' + (scene + 1) + '/7: "' + sceneInfo.title.substring(0, 45) + '..." | ' + sceneInfo.indicator + ' | Bg: ' + (sceneInfo.bg.includes('assets') ? 'Local Asset ✅' : sceneInfo.bg));

    // Capture screenshot of key slides
    if (scene === 0 || scene === 1 || scene === 4 || scene === 5) {
      if (!fs.existsSync('scratch/screenshots')) fs.mkdirSync('scratch/screenshots', { recursive: true });
      await page.screenshot({ path: 'scratch/screenshots/scene_' + scene + '.png' });
    }

    if (scene < 6) {
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(350);
    }
  }

  // 3. TEST SLIDE 5 INTERACTIVE GAME
  console.log('\n--- 3. Testing Slide 5 Projector Scenario Game ---');
  // We are currently on Scene 6, let's go back to Scene 5 (Slide index 5)
  await page.keyboard.press('ArrowLeft');
  await page.waitForTimeout(400);

  const gameInit = await page.evaluate(() => {
    const q = document.getElementById('stageGameQuestion') ? document.getElementById('stageGameQuestion').textContent : '';
    const opts = document.querySelectorAll('.proj-game-option-btn').length;
    const timer = document.getElementById('stageGameClock') ? document.getElementById('stageGameClock').textContent : '';
    return { q: q.substring(0, 50), opts, timer };
  });
  console.log('Game Question: "' + gameInit.q + '..." | Options Count: ' + gameInit.opts + ' | Timer: ' + gameInit.timer + ' -> ' + (gameInit.opts === 4 ? 'PASS ✅' : 'FAIL ❌'));

  // Select option C
  await page.click('.proj-game-option-btn[data-key="C"]');
  await page.waitForTimeout(300);

  // Click Submit
  await page.click('#btnStageSubmitAnswer');
  await page.waitForTimeout(400);

  const gameResult = await page.evaluate(() => {
    const box = document.getElementById('stageGameResultBox');
    const badge = document.getElementById('stageResultBadge') ? document.getElementById('stageResultBadge').textContent : '';
    const analysis = document.getElementById('stageResultAnalysis') ? document.getElementById('stageResultAnalysis').textContent : '';
    const theory = document.getElementById('stageResultTheory') ? document.getElementById('stageResultTheory').textContent : '';
    const isVisible = box && !box.classList.contains('hidden');
    return { isVisible, badge, hasAnalysis: analysis.length > 20, hasTheory: theory.includes('Dân') };
  });
  console.log('Game Answer Reveal: Visible=' + gameResult.isVisible + ' | Badge: "' + gameResult.badge + '" | Theory Link: ' + (gameResult.hasTheory ? 'PASS ✅' : 'FAIL ❌'));

  // Test Next Scenario
  await page.click('#btnStageNextScenario');
  await page.waitForTimeout(400);
  const nextScenario = await page.evaluate(() => {
    return document.getElementById('stageGameTag') ? document.getElementById('stageGameTag').textContent : '';
  });
  console.log('Next Scenario Click advances to: "' + nextScenario + '" -> ' + (nextScenario.includes('2') ? 'PASS ✅' : 'FAIL ❌'));

  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);

  // 4. TEST CONTENT EDITOR MODAL
  console.log('\n--- 4. Testing Content Editor Modal ---');
  await page.click('#btnNavEditor');
  await page.waitForTimeout(400);

  const editorOpen = await page.evaluate(() => {
    const m = document.getElementById('contentEditorModal');
    const hasSelect = !!document.getElementById('editorSelectSlide');
    return m && !m.classList.contains('hidden') && hasSelect;
  });
  console.log('Open Content Editor Modal: ' + (editorOpen ? 'PASS ✅' : 'FAIL ❌'));

  // Test Tab Switching in Editor
  await page.click('#tabEditScenarios');
  await page.waitForTimeout(300);
  const scenarioTabActive = await page.evaluate(() => {
    return !!document.getElementById('editorSelectScenario');
  });
  console.log('Switch to Scenarios Tab in Editor: ' + (scenarioTabActive ? 'PASS ✅' : 'FAIL ❌'));

  // Close Editor
  await page.click('#btnCloseContentEditor');
  await page.waitForTimeout(300);

  // 5. CONSOLE ERRORS
  console.log('\n--- 5. Console Error Report ---');
  console.log('Total Console Errors: ' + consoleErrors.length);
  if (consoleErrors.length > 0) {
    consoleErrors.forEach((e, idx) => console.log('[' + (idx + 1) + '] ' + e));
  } else {
    console.log('Zero console errors! Console is completely clean. ✅');
  }

  console.log('\n=== PROJECTOR QA SUITE COMPLETED SUCCESSFULLY ===');
  await browser.close();
}

runProjectorTests().catch(err => {
  console.error('Test failed with error:', err);
  process.exit(1);
});
