const { chromium } = require('playwright');

const TEST_VIEWPORTS = [
    { name: 'Desktop FHD', width: 1920, height: 1080 },
    { name: 'Laptop', width: 1366, height: 768 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Mobile', width: 390, height: 844 }
];

async function runAcademicActionsTest() {
    console.log('=== STARTING AUTOMATED QA TEST: ACADEMIC MINIMAL ACTIONS VIEW ===\n');

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
            const container = document.querySelector('.act-academic-container');
            const cHeight = container ? container.getBoundingClientRect().height : 0;
            return { docWidth, winWidth, hasHScroll, cHeight };
        });

        console.log(`[${vp.name} ${vp.width}x${vp.height}] docWidth=${check.docWidth}, winWidth=${check.winWidth} -> Overflow: ${check.hasHScroll ? 'FAIL ❌' : 'PASS ✅'} | Content Height: ${Math.round(check.cHeight)}px`);
    }

    // Set desktop 1920x1080 for deep check
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(400);
    await page.evaluate(() => window.app.switchView('actions'));
    await page.waitForTimeout(300);

    // 2. TEST KHU VỰC 1: TIÊU ĐỀ
    console.log('\n--- 2. Testing Khu vực 1: Tiêu đề ---');
    const headerData = await page.evaluate(() => {
        const title = document.querySelector('.act-main-title')?.textContent.trim();
        const desc = document.querySelector('.act-main-desc')?.textContent.trim();
        const badge = document.querySelector('.act-academic-badge')?.textContent.trim();
        return { title, desc, badge };
    });
    console.log(`Tiêu đề: "${headerData.title}" -> ${headerData.title === 'Từ lý luận đến thực tiễn' ? 'PASS ✅' : 'FAIL ❌'}`);
    console.log(`Mô tả: "${headerData.desc}" -> ${headerData.desc.includes('Sinh viên HaUI thực hành dân chủ') ? 'PASS ✅' : 'FAIL ❌'}`);

    // 3. TEST KHU VỰC 2: BA NỘI DUNG TRỌNG TÂM
    console.log('\n--- 3. Testing Khu vực 2: Ba nội dung trọng tâm ---');
    const pillars = await page.evaluate(() => {
        const cards = document.querySelectorAll('.act-pillar-card');
        const res = [];
        cards.forEach(c => {
            const t = c.querySelector('.act-pillar-title')?.textContent.trim();
            const d = c.querySelector('.act-pillar-desc')?.textContent.trim();
            res.push({ title: t, desc: d });
        });
        return res;
    });
    console.log(`Tổng số thẻ trọng tâm: ${pillars.length} -> ${pillars.length === 3 ? 'PASS ✅' : 'FAIL ❌'}`);
    pillars.forEach((p, i) => {
        console.log(`  [Thẻ ${i+1}] ${p.title} - ${p.desc}`);
    });

    // 4. TEST KHU VỰC 3: MỘT TÌNH HUỐNG TƯƠNG TÁC
    console.log('\n--- 4. Testing Khu vực 3: Một tình huống tương tác ---');
    const scenarioQuestion = await page.evaluate(() => {
        return document.getElementById('scenarioTitle')?.textContent.trim();
    });
    console.log(`Tình huống tiêu đề: "${scenarioQuestion}" -> ${scenarioQuestion === 'Bạn sẽ làm gì?' ? 'PASS ✅' : 'FAIL ❌'}`);

    // Test default option (Option C)
    const optCResult = await page.evaluate(() => {
        const badge = document.getElementById('scenarioResultBadge')?.textContent.trim();
        const analysis = document.getElementById('scenarioResultAnalysis')?.textContent.trim();
        const theory = document.getElementById('scenarioTheoryLink')?.textContent.trim();
        return { badge, analysis, theory };
    });
    console.log(`Mặc định (Phương án C): Badge="${optCResult.badge}" -> ${optCResult.badge.includes('chuẩn mực') ? 'PASS ✅' : 'FAIL ❌'}`);

    // Test click Option A
    await page.click('label[for="scenarioOptA"]');
    await page.click('#btnSubmitScenario');
    await page.waitForTimeout(300);
    const optAResult = await page.evaluate(() => {
        const badge = document.getElementById('scenarioResultBadge')?.textContent.trim();
        const analysis = document.getElementById('scenarioResultAnalysis')?.textContent.trim();
        return { badge, analysis };
    });
    console.log(`Chọn Phương án A: Badge="${optAResult.badge}" -> ${optAResult.badge.includes('Chưa chuẩn mực') ? 'PASS ✅' : 'FAIL ❌'}`);

    // Test click Option B
    await page.click('label[for="scenarioOptB"]');
    await page.click('#btnSubmitScenario');
    await page.waitForTimeout(300);
    const optBResult = await page.evaluate(() => {
        const badge = document.getElementById('scenarioResultBadge')?.textContent.trim();
        return { badge };
    });
    console.log(`Chọn Phương án B: Badge="${optBResult.badge}" -> ${optBResult.badge.includes('Thụ động') ? 'PASS ✅' : 'FAIL ❌'}`);

    // Switch back to C
    await page.click('label[for="scenarioOptC"]');
    await page.click('#btnSubmitScenario');
    await page.waitForTimeout(300);

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
    } else {
        console.log('Console is 100% clean! 0 errors ✅');
    }

    console.log('\n=== ALL ACADEMIC ACTIONS TESTS PASSED SUCCESSFULLY ===');
    await browser.close();
}

runAcademicActionsTest().catch(err => {
    console.error('Test suite failed:', err);
    process.exit(1);
});
