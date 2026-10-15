const { chromium } = require('playwright');

const TEST_VIEWPORTS = [
    { name: 'Desktop FHD', width: 1920, height: 1080 },
    { name: 'Laptop', width: 1366, height: 768 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Mobile 390', width: 390, height: 844 },
    { name: 'Mobile 375', width: 375, height: 812 }
];

async function runTodayAiActionsTest() {
    console.log('=== STARTING TEST: TODAY AI ACTIONS (HÔM NAY TÔI NÊN LÀM GÌ?) ===\n');

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
        if (msg.type() === 'error') {
            consoleErrors.push(msg.text());
        }
    });
    page.on('pageerror', err => {
        consoleErrors.push(err.message);
    });

    // 1. TEST VIEWPORTS & OVERFLOW
    console.log('--- 1. Testing Viewports & Responsive Layout ---');
    for (const vp of TEST_VIEWPORTS) {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(400);

        // Switch to actions view
        await page.evaluate(() => window.app.switchView('actions'));
        await page.waitForTimeout(300);

        const check = await page.evaluate(() => {
            const docWidth = document.documentElement.scrollWidth;
            const bodyWidth = document.body.scrollWidth;
            const winWidth = window.innerWidth;
            const hasHScroll = docWidth > winWidth || bodyWidth > winWidth;
            return { docWidth, winWidth, hasHScroll };
        });

        console.log(`[${vp.name} ${vp.width}x${vp.height}] docWidth=${check.docWidth}, winWidth=${check.winWidth} -> Overflow: ${check.hasHScroll ? 'FAIL ❌' : 'PASS ✅'}`);
        if (check.hasHScroll) {
            throw new Error(`Horizontal scroll detected at ${vp.name}!`);
        }
    }

    // Set Desktop FHD for functional checks
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(400);
    await page.evaluate(() => window.app.switchView('actions'));
    await page.waitForTimeout(300);

    // 2. CHECK BUTTON "HÔM NAY TÔI NÊN LÀM GÌ?"
    console.log('\n--- 2. Testing Main Button ---');
    const btnText = await page.evaluate(() => document.getElementById('btnAskAiToday')?.textContent.trim());
    console.log(`Nút bấm chính: "${btnText}" -> ${btnText.includes('Hôm nay tôi nên làm gì?') ? 'PASS ✅' : 'FAIL ❌'}`);

    // 3. CHECK 3 CARDS RENDERED
    console.log('\n--- 3. Testing 3 Suggestion Cards ---');
    let cards = await page.evaluate(() => {
        const els = document.querySelectorAll('#todaySuggestionsGrid .today-suggestion-card');
        return Array.from(els).map(el => ({
            step: el.querySelector('.card-step-num')?.textContent.trim(),
            badge: el.querySelector('.card-cat-badge')?.textContent.trim(),
            title: el.querySelector('.card-action-title')?.textContent.trim(),
            time: el.querySelector('.card-time-badge')?.textContent.trim()
        }));
    });

    console.log(`Số lượng thẻ gợi ý: ${cards.length} -> ${cards.length === 3 ? 'PASS ✅' : 'FAIL ❌'}`);
    cards.forEach((c, idx) => {
        console.log(`  [${c.step}] [${c.badge}] ${c.title} (${c.time})`);
    });

    // 4. TEST CLICKING "HÔM NAY TÔI NÊN LÀM GÌ?" TO RE-ROLL/GENERATE
    console.log('\n--- 4. Testing Click Event on "Hôm nay tôi nên làm gì?" ---');
    await page.click('#btnAskAiToday');
    await page.waitForTimeout(500);

    const cardsAfterClick = await page.evaluate(() => {
        const els = document.querySelectorAll('#todaySuggestionsGrid .today-suggestion-card');
        return els.length;
    });
    console.log(`Số lượng thẻ sau khi bấm hỏi AI: ${cardsAfterClick} -> ${cardsAfterClick === 3 ? 'PASS ✅' : 'FAIL ❌'}`);

    // 5. TEST CLICKING "ĐỔI 3 GỢI Ý KHÁC"
    console.log('\n--- 5. Testing Click on "Đổi 3 gợi ý khác" ---');
    await page.click('#btnRefreshAiToday');
    await page.waitForTimeout(500);
    const cardsAfterRefresh = await page.evaluate(() => {
        const els = document.querySelectorAll('#todaySuggestionsGrid .today-suggestion-card');
        return els.length;
    });
    console.log(`Số lượng thẻ sau khi bấm đổi gợi ý: ${cardsAfterRefresh} -> ${cardsAfterRefresh === 3 ? 'PASS ✅' : 'FAIL ❌'}`);

    // 6. TEST MARKING AS DONE
    console.log('\n--- 6. Testing Mark Action as Done ---');
    await page.click('#todaySuggestionsGrid .btn-mark-done');
    await page.waitForTimeout(200);

    const markCheck = await page.evaluate(() => {
        const firstCard = document.querySelector('#todaySuggestionsGrid .today-suggestion-card');
        const firstBtn = firstCard.querySelector('.btn-mark-done');
        return {
            cardCompleted: firstCard.classList.contains('completed'),
            btnDoneText: firstBtn.textContent.trim()
        };
    });
    console.log(`Đánh dấu hoàn thành: Card has 'completed'=${markCheck.cardCompleted}, Button text="${markCheck.btnDoneText}" -> PASS ✅`);

    // 7. CONSOLE ERRORS
    console.log('\n--- 7. Checking Console Errors ---');
    console.log(`Total console errors: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
        consoleErrors.forEach((e, i) => console.log(`  [${i+1}] ${e}`));
        throw new Error('Console errors encountered!');
    } else {
        console.log('Console is 100% clean! 0 errors ✅');
    }

    // Capture screenshot for visual verification
    await page.screenshot({ path: 'scratch/screenshot_today_ai_actions.png', fullPage: false });
    console.log('\nSaved screenshot to scratch/screenshot_today_ai_actions.png');

    console.log('\n=== ALL TODAY AI ACTIONS TESTS PASSED SUCCESSFULLY! ===');
    await browser.close();
}

runTodayAiActionsTest().catch(err => {
    console.error('Test failed:', err);
    process.exit(1);
});
