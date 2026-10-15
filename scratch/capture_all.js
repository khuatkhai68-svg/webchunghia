const { chromium } = require('playwright');

async function captureAllPages() {
    let browser;
    try {
        browser = await chromium.launch({ channel: 'msedge', headless: true });
    } catch (e) {
        browser = await chromium.launch({ headless: true });
    }
    const context = await browser.newContext({ viewport: { width: 1536, height: 864 } });
    const page = await context.newPage();

    console.log('1. Navigating to http://localhost:3000/...');
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
    await page.screenshot({ path: 'scratch/screen_1_mindmap.png' });

    console.log('2. Clicking Branch 1 (Center Popup)...');
    await page.click('#branch1 .branch-card');
    await page.waitForTimeout(400);
    await page.screenshot({ path: 'scratch/screen_2_branch_popup.png' });
    await page.click('#btnCloseDrawer');
    await page.waitForTimeout(300);

    console.log('3. Opening Presentation (16 slides)...');
    await page.click('#btnPresentationMode');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'scratch/screen_3_presentation_16slides.png' });
    await page.click('#btnClosePresentation');
    await page.waitForTimeout(300);

    console.log('4. Opening Actions page (Hôm nay tôi nên làm gì?)...');
    await page.evaluate(() => window.app.switchView('actions'));
    await page.waitForTimeout(400);
    await page.screenshot({ path: 'scratch/screen_4_today_ai_actions.png' });

    console.log('5. Opening Debate page...');
    await page.evaluate(() => window.app.openDebateModal(1));
    await page.waitForTimeout(400);
    await page.screenshot({ path: 'scratch/screen_5_debate_arena.png' });

    console.log('All screenshots captured!');
    await browser.close();
}

captureAllPages().catch(err => {
    console.error(err);
    process.exit(1);
});
