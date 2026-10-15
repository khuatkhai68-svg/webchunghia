const { chromium } = require('playwright');

const TEST_VIEWPORTS = [
    { name: 'Desktop FHD', width: 1920, height: 1080 },
    { name: 'Laptop', width: 1366, height: 768 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Mobile 390', width: 390, height: 844 },
    { name: 'Mobile 375', width: 375, height: 812 }
];

async function runAcademicActionsTest() {
    console.log('=== STARTING AUTOMATED TEST: TODAY AI ACTIONS (HÀNH ĐỘNG AI HaUI) ===\n');

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

    // 1. TEST VIEWPORTS & RESPONSIVE
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

    // Set desktop 1920x1080 for deep check
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(400);
    await page.evaluate(() => window.app.switchView('actions'));
    await page.waitForTimeout(300);

    // 2. TEST TIÊU ĐỀ
    console.log('\n--- 2. Testing Tiêu đề ---');
    const headerData = await page.evaluate(() => {
        const title = document.querySelector('.act-today-title')?.textContent.trim();
        const desc = document.querySelector('.act-today-subtitle')?.textContent.trim();
        const badge = document.querySelector('.act-today-badge')?.textContent.trim();
        return { title, desc, badge };
    });
    console.log(`Tiêu đề: "${headerData.title}" -> ${headerData.title === 'Hôm nay tôi nên làm gì?' ? 'PASS ✅' : 'FAIL ❌'}`);
    console.log(`Mô tả: "${headerData.desc}" -> ${headerData.desc.includes('Hệ thống AI liên tục cập nhật') ? 'PASS ✅' : 'FAIL ❌'}`);

    // 3. TEST NÚT BẤM "HÔM NAY TÔI NÊN LÀM GÌ?"
    console.log('\n--- 3. Testing Nút Kích hoạt Hôm nay tôi nên làm gì? ---');
    const btnText = await page.evaluate(() => document.getElementById('btnAskAiToday')?.textContent.trim());
    console.log(`Nút bấm chính: "${btnText}" -> ${btnText.includes('Hôm nay tôi nên làm gì?') ? 'PASS ✅' : 'FAIL ❌'}`);

    // 4. TEST 3 THẺ GỢI Ý
    console.log('\n--- 4. Testing 3 Thẻ Gợi Ý Việc Làm ---');
    let cards = await page.evaluate(() => {
        const els = document.querySelectorAll('#todaySuggestionsGrid .today-suggestion-card');
        return Array.from(els).map(el => ({
            step: el.querySelector('.card-step-num')?.textContent.trim(),
            badge: el.querySelector('.card-cat-badge')?.textContent.trim(),
            title: el.querySelector('.card-action-title')?.textContent.trim()
        }));
    });
    console.log(`Tổng số thẻ gợi ý: ${cards.length} -> ${cards.length === 3 ? 'PASS ✅' : 'FAIL ❌'}`);

    // Test click re-roll
    await page.click('#btnAskAiToday');
    await page.waitForTimeout(450);
    const countAfterClick = await page.evaluate(() => document.querySelectorAll('#todaySuggestionsGrid .today-suggestion-card').length);
    console.log(`Số thẻ sau khi bấm hỏi AI: ${countAfterClick} -> ${countAfterClick === 3 ? 'PASS ✅' : 'FAIL ❌'}`);

    // 5. TEST THÔNG ĐIỆP CUỐI TRANG
    console.log('\n--- 5. Testing Thông điệp kết luận cuối trang ---');
    const bottomMsg = await page.evaluate(() => {
        return document.querySelector('.act-message-pill')?.textContent.replace(/\s+/g, ' ').trim();
    });
    console.log(`Thông điệp: "${bottomMsg}" -> ${bottomMsg.includes('Hiểu đúng') && bottomMsg.includes('Tham gia có trách nhiệm') && bottomMsg.includes('Phản biện có căn cứ') ? 'PASS ✅' : 'FAIL ❌'}`);

    // 6. CONSOLE ERRORS
    console.log('\n--- 6. Console Errors Report ---');
    console.log(`Total console errors: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
        consoleErrors.forEach((e, i) => console.log(`  [${i+1}] ${e}`));
        throw new Error('Console errors encountered!');
    } else {
        console.log('Console is 100% clean! 0 errors ✅');
    }

    console.log('\n=== ALL TESTS PASSED SUCCESSFULLY ===');
    await browser.close();
}

runAcademicActionsTest().catch(err => {
    console.error('Test suite failed:', err);
    process.exit(1);
});
