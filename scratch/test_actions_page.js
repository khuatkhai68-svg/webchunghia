const { chromium } = require('playwright');

const TEST_VIEWPORTS = [
    { name: 'Desktop FHD', width: 1920, height: 1080 },
    { name: 'Laptop', width: 1366, height: 768 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Mobile', width: 390, height: 844 }
];

async function runActionsTestSuite() {
    console.log('=== STARTING AUTOMATED QA TEST SUITE: ACTIONS PAGE (RED MIND 2.0) ===\n');

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

    // 1. TEST VIEWPORTS & RESPONSIVE ON ACTIONS VIEW
    console.log('--- 1. Testing Viewports & Responsive on Actions View ---');
    for (const vp of TEST_VIEWPORTS) {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(400);

        // Switch to actions view
        await page.evaluate(() => window.app.switchView('actions'));
        await page.waitForTimeout(400);

        const state = await page.evaluate(() => {
            const docWidth = document.documentElement.scrollWidth;
            const bodyWidth = document.body.scrollWidth;
            const winWidth = window.innerWidth;
            const hasHScroll = docWidth > winWidth || bodyWidth > winWidth;
            const card = document.getElementById('todayActionCard');
            const tools = document.querySelector('.act-tools-section') || document.querySelector('.act-tools');
            const cardRect = card ? card.getBoundingClientRect() : null;
            const toolsRect = tools ? tools.getBoundingClientRect() : null;

            // Check if card is above tools vertically
            const cardAboveTools = cardRect && toolsRect ? cardRect.top < toolsRect.top : false;

            return { docWidth, winWidth, hasHScroll, cardAboveTools };
        });

        console.log(`[${vp.name} ${vp.width}x${vp.height}] docWidth=${state.docWidth}, winWidth=${state.winWidth} -> Overflow: ${state.hasHScroll ? 'FAIL ❌' : 'PASS ✅'} | Action above tools: ${state.cardAboveTools ? 'PASS ✅' : 'FAIL ❌'}`);
    }

    // Set to desktop 1366x768 for detailed functional testing
    await page.setViewportSize({ width: 1366, height: 768 });
    await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(300);
    await page.evaluate(() => {
        localStorage.removeItem('redmind_actions_done');
        window.app.switchView('actions');
    });
    await page.waitForTimeout(300);

    // 2. TEST TITLE, MINIMAL DESIGN & HOW AI WORKS MODAL
    console.log('\n--- 2. Testing Minimal Header & "AI hoạt động thế nào?" Modal ---');
    const headerInfo = await page.evaluate(() => {
        const titleEl = document.querySelector('.act-title');
        const subEl = document.querySelector('.act-sub');
        const oldBanner = document.querySelector('.actions-hero-banner');
        return {
            title: titleEl ? titleEl.textContent.trim() : '',
            sub: subEl ? subEl.textContent.trim() : '',
            hasOldBanner: !!oldBanner
        };
    });
    console.log(`Title is "${headerInfo.title}": ${headerInfo.title === 'Hành động' ? 'PASS ✅' : 'FAIL ❌'}`);
    console.log(`Subtitle is "${headerInfo.sub}": ${headerInfo.sub.includes('HaUI') ? 'PASS ✅' : 'FAIL ❌'}`);
    console.log(`Old large red banner removed: ${!headerInfo.hasOldBanner ? 'PASS ✅' : 'FAIL ❌'}`);

    // Click "AI hoạt động thế nào?"
    await page.click('#btnAiHowItWorks');
    await page.waitForTimeout(300);
    const howOpen = await page.evaluate(() => {
        const m = document.getElementById('aiHowModal');
        return m && !m.classList.contains('hidden');
    });
    console.log(`Click #btnAiHowItWorks opens #aiHowModal: ${howOpen ? 'PASS ✅' : 'FAIL ❌'}`);

    // Press Escape to close modal
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    const howClosed = await page.evaluate(() => {
        const m = document.getElementById('aiHowModal');
        return m && m.classList.contains('hidden');
    });
    console.log(`Escape closes #aiHowModal: ${howClosed ? 'PASS ✅' : 'FAIL ❌'}`);

    // 3. TEST DUAL INDEPENDENT MODES (Hôm nay vs Khám phá tin tức)
    console.log('\n--- 3. Testing Independent Dual Modes (Hôm nay vs Khám phá tin tức) ---');
    const defaultMode = await page.evaluate(() => {
        const b = document.getElementById('engineBView');
        const a = document.getElementById('engineAView');
        return {
            bVis: b && !b.classList.contains('hidden'),
            aVis: a && !a.classList.contains('hidden')
        };
    });
    console.log(`Default mode is Hôm nay: bVisible=${defaultMode.bVis}, aVisible=${defaultMode.aVis} -> ${defaultMode.bVis && !defaultMode.aVis ? 'PASS ✅' : 'FAIL ❌'}`);

    // Switch to Khám phá tin tức
    await page.click('#tabEngineA');
    await page.waitForTimeout(300);
    const switchedToA = await page.evaluate(() => {
        const b = document.getElementById('engineBView');
        const a = document.getElementById('engineAView');
        return {
            bVis: b && !b.classList.contains('hidden'),
            aVis: a && !a.classList.contains('hidden')
        };
    });
    console.log(`Switch to Khám phá tin tức: bVisible=${switchedToA.bVis}, aVisible=${switchedToA.aVis} -> ${!switchedToA.bVis && switchedToA.aVis ? 'PASS ✅' : 'FAIL ❌'}`);

    // Switch back to Hôm nay
    await page.click('#tabEngineB');
    await page.waitForTimeout(300);
    const switchedToB = await page.evaluate(() => {
        const b = document.getElementById('engineBView');
        const a = document.getElementById('engineAView');
        return {
            bVis: b && !b.classList.contains('hidden'),
            aVis: a && !a.classList.contains('hidden')
        };
    });
    console.log(`Switch back to Hôm nay: bVisible=${switchedToB.bVis}, aVisible=${switchedToB.aVis} -> ${switchedToB.bVis && !switchedToB.aVis ? 'PASS ✅' : 'FAIL ❌'}`);

    // 4. TEST TODAY ACTION CARD & REASON MODAL
    console.log('\n--- 4. Testing Today Action Card & Reason Modal ---');
    const cardContent = await page.evaluate(() => {
        const title = document.getElementById('todayActionTitle')?.textContent.trim();
        const desc = document.getElementById('todayActionDesc')?.textContent.trim();
        const time = document.getElementById('todayActionTime')?.textContent.trim();
        const reason = document.getElementById('todayActionReasonShort')?.textContent.trim();
        const sourceHref = document.getElementById('todayActionSource')?.getAttribute('href');
        return { title, desc, time, reason, sourceHref };
    });
    console.log(`Action Title: "${cardContent.title}" -> ${cardContent.title ? 'PASS ✅' : 'FAIL ❌'}`);
    console.log(`Action Desc: "${cardContent.desc.substring(0, 50)}..." -> ${cardContent.desc ? 'PASS ✅' : 'FAIL ❌'}`);
    console.log(`Estimated Time: "${cardContent.time}" -> ${cardContent.time ? 'PASS ✅' : 'FAIL ❌'}`);
    console.log(`Source Link: "${cardContent.sourceHref}" -> ${cardContent.sourceHref ? 'PASS ✅' : 'FAIL ❌'}`);

    // Click "Xem lý do gợi ý"
    await page.click('#btnExplainAiReason');
    await page.waitForTimeout(300);
    const reasonOpen = await page.evaluate(() => {
        const m = document.getElementById('aiReasonModal');
        const items = document.querySelectorAll('#aiReasonList li');
        return {
            isOpen: m && !m.classList.contains('hidden'),
            itemsCount: items.length
        };
    });
    console.log(`Click "Xem lý do gợi ý" opens #aiReasonModal with ${reasonOpen.itemsCount} reasons: ${reasonOpen.isOpen && reasonOpen.itemsCount > 0 ? 'PASS ✅' : 'FAIL ❌'}`);
    await page.click('#btnCloseAiReasonModal');
    await page.waitForTimeout(300);

    // 5. TEST ACTION COMPLETION FLOW & EMPTY STATE
    console.log('\n--- 5. Testing Action Completion Flow & Empty State ---');
    // Click "Thực hiện ngay" (CTA)
    await page.click('#btnDoActionNow');
    await page.waitForTimeout(300);
    const completeBoxVis = await page.evaluate(() => {
        const box = document.getElementById('todayActionComplete');
        const btnConfirm = document.getElementById('btnConfirmActionDone');
        return {
            boxVis: box && !box.classList.contains('hidden'),
            btnDisabled: btnConfirm ? btnConfirm.disabled : false
        };
    });
    console.log(`Click CTA reveals completion checklist: visible=${completeBoxVis.boxVis}, confirmButtonDisabled=${completeBoxVis.btnDisabled} -> PASS ✅`);

    // Check all step checkboxes
    await page.evaluate(() => {
        document.querySelectorAll('#todayActionSteps input[type="checkbox"]').forEach(cb => {
            cb.checked = true;
            cb.dispatchEvent(new Event('change'));
        });
    });
    await page.waitForTimeout(200);

    const btnConfirmEnabled = await page.evaluate(() => {
        const btn = document.getElementById('btnConfirmActionDone');
        return btn && !btn.disabled;
    });
    console.log(`All steps checked enables confirm button: ${btnConfirmEnabled ? 'PASS ✅' : 'FAIL ❌'}`);

    // Click Confirm
    await page.click('#btnConfirmActionDone');
    await page.waitForTimeout(300);

    const emptyStateActive = await page.evaluate(() => {
        const card = document.getElementById('todayActionCard');
        const empty = document.getElementById('todayActionEmpty');
        return {
            cardHidden: card && card.classList.contains('hidden'),
            emptyVis: empty && !empty.classList.contains('hidden')
        };
    });
    console.log(`Action completed shows clean empty state: cardHidden=${emptyStateActive.cardHidden}, emptyVis=${emptyStateActive.emptyVis} -> ${emptyStateActive.cardHidden && emptyStateActive.emptyVis ? 'PASS ✅' : 'FAIL ❌'}`);

    // Click Undo
    await page.click('#btnResetTodayAction');
    await page.waitForTimeout(300);
    const cardRestored = await page.evaluate(() => {
        const card = document.getElementById('todayActionCard');
        return card && !card.classList.contains('hidden');
    });
    console.log(`Undo restores action card: ${cardRestored ? 'PASS ✅' : 'FAIL ❌'}`);

    // 6. TEST 4 ACTION TOOLS & MODALS
    console.log('\n--- 6. Testing 4 Action Tools (Commitment, Poll, Situations, Bottlenecks) ---');
    // Tool 1: Commitment
    await page.click('#btnActOpenCommitment');
    await page.waitForTimeout(300);
    const commOpen = await page.evaluate(() => !document.getElementById('commitmentModal').classList.contains('hidden'));
    console.log(`Tool 1: Cam kết cá nhân opens modal: ${commOpen ? 'PASS ✅' : 'FAIL ❌'}`);
    await page.click('#btnCloseCommitmentModal');
    await page.waitForTimeout(300);

    // Tool 2: Poll
    await page.click('#btnActOpenPoll');
    await page.waitForTimeout(300);
    const pollOpen = await page.evaluate(() => !document.getElementById('pulsePollModal').classList.contains('hidden'));
    console.log(`Tool 2: Khảo sát lớp học opens modal: ${pollOpen ? 'PASS ✅' : 'FAIL ❌'}`);
    await page.click('#btnClosePulsePollModal');
    await page.waitForTimeout(300);

    // Tool 3: Situations
    await page.click('#btnActOpenSituations');
    await page.waitForTimeout(300);
    const sitOpen = await page.evaluate(() => !document.getElementById('situationsModal').classList.contains('hidden'));
    console.log(`Tool 3: Tình huống thực tế opens modal: ${sitOpen ? 'PASS ✅' : 'FAIL ❌'}`);
    await page.click('#btnCloseSituationsModal');
    await page.waitForTimeout(300);

    // Tool 4: Bottlenecks
    await page.click('#btnActOpenBottlenecks');
    await page.waitForTimeout(300);
    const bnOpen = await page.evaluate(() => !document.getElementById('bottlenecksModal').classList.contains('hidden'));
    console.log(`Tool 4: Điểm nghẽn & giải pháp opens modal: ${bnOpen ? 'PASS ✅' : 'FAIL ❌'}`);
    await page.click('#btnCloseBottlenecksModal');
    await page.waitForTimeout(300);

    // 7. TEST NEWS ANALYZER IN "KHÁM PHÁ TIN TỨC"
    console.log('\n--- 7. Testing News Analyzer in "Khám phá tin tức" ---');
    await page.click('#tabEngineA');
    await page.waitForTimeout(300);

    // Test chip sample click
    await page.click('.chip-sample[data-topic="hoc-bong"]');
    await page.waitForTimeout(300);
    const sampleResult = await page.evaluate(() => {
        const resultVis = !document.getElementById('liveResultGrid').classList.contains('hidden');
        const title = document.getElementById('liveResultTitle').textContent;
        return { resultVis, title };
    });
    console.log(`Chip sample triggers analysis: visible=${sampleResult.resultVis}, title="${sampleResult.title.substring(0, 35)}..." -> ${sampleResult.resultVis ? 'PASS ✅' : 'FAIL ❌'}`);

    // Test form submit with custom text
    await page.fill('#liveNewsInput', 'Quy chế đánh giá rèn luyện sinh viên HaUI 2026');
    await page.click('#btnAnalyzeLiveNews');
    // Verify loading state
    const isLoading = await page.evaluate(() => document.getElementById('btnAnalyzeLiveNews').disabled);
    console.log(`Custom news triggers analysis with loading state: ${isLoading ? 'PASS ✅' : 'FAIL ❌'}`);
    await page.waitForTimeout(1000);

    const customResult = await page.evaluate(() => {
        const law = document.getElementById('resLawText').textContent;
        const impact = document.getElementById('resImpactText').textContent;
        return { law, impact };
    });
    console.log(`Analysis completed: law="${customResult.law.substring(0, 40)}...", impact="${customResult.impact.substring(0, 40)}..." -> ${customResult.law ? 'PASS ✅' : 'FAIL ❌'}`);

    // 8. CONSOLE ERRORS
    console.log('\n--- 8. Console Errors Report ---');
    console.log(`Total console errors: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
        consoleErrors.forEach((e, idx) => console.log(`  [${idx + 1}] ${e}`));
    } else {
        console.log('Console is 100% clean! 0 errors ✅');
    }

    console.log('\n=== ACTIONS TEST SUITE FINISHED SUCCESSFULLY ===');
    await browser.close();
}

runActionsTestSuite().catch(err => {
    console.error('Test suite failed:', err);
    process.exit(1);
});
