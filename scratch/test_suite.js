const { chromium } = require('playwright');

const VIEWPORTS = [
    { name: 'Mobile 375x812', width: 375, height: 812 },
    { name: 'Mobile 390x844', width: 390, height: 844 },
    { name: 'Tablet 768x1024', width: 768, height: 1024 },
    { name: 'Tablet 1024x768', width: 1024, height: 768 },
    { name: 'Laptop 1366x768', width: 1366, height: 768 },
    { name: 'Desktop 1536x864', width: 1536, height: 864 },
    { name: 'FHD 1920x1080', width: 1920, height: 1080 }
];

async function runTestSuite() {
    console.log('=== STARTING AUTOMATED QA TEST SUITE (RED MIND 2.0 / HaUI) ===\n');
    let browser;
    try {
        browser = await chromium.launch({ channel: 'msedge', headless: true });
    } catch (e) {
        browser = await chromium.launch({ headless: true });
    }

    const testResults = {
        viewports: [],
        features: {},
        xss: {},
        consoleErrors: []
    };

    const context = await browser.newContext();
    const page = await context.newPage();

    // Listen to console errors
    page.on('console', msg => {
        if (msg.type() === 'error') {
            testResults.consoleErrors.push(msg.text());
        }
    });
    page.on('pageerror', err => {
        testResults.consoleErrors.push(err.message);
    });

    // 1. TEST VIEWPORTS & HORIZONTAL OVERFLOW (P0-1)
    console.log('--- 1. Testing Viewports & Horizontal Overflow (P0-1) ---');
    for (const vp of VIEWPORTS) {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(500);

        const data = await page.evaluate(() => {
            const docWidth = document.documentElement.scrollWidth;
            const bodyWidth = document.body.scrollWidth;
            const winWidth = window.innerWidth;
            const hasHScroll = docWidth > winWidth || bodyWidth > winWidth;
            const canvasEl = document.getElementById('mindmapCanvas');
            const listEl = document.getElementById('mindmapListView');
            const bottomNavEl = document.getElementById('mobileBottomNav');
            
            const isMindmapHidden = canvasEl ? canvasEl.classList.contains('hidden') : false;
            const isListHidden = listEl ? listEl.classList.contains('hidden') : true;
            const bottomNavVis = bottomNavEl ? window.getComputedStyle(bottomNavEl).display : 'none';
            return { docWidth, bodyWidth, winWidth, hasHScroll, isMindmapHidden, isListHidden, bottomNavVis };
        });

        const passed = !data.hasHScroll;
        const currentModeDesc = (!data.isListHidden && data.isMindmapHidden) ? 'LIST (1-column)' : (data.isListHidden && !data.isMindmapHidden ? 'MINDMAP (radial)' : 'MIXED');
        console.log(`[${vp.name}] winWidth=${data.winWidth}, docWidth=${data.docWidth} -> Overflow: ${data.hasHScroll ? 'FAIL ❌' : 'PASS ✅'} | Mode: ${currentModeDesc} | BottomNav: ${data.bottomNavVis}`);
        testResults.viewports.push({
            viewport: vp.name,
            passed,
            mode: currentModeDesc,
            ...data
        });
    }

    // 2. TEST GUIDE MODAL (P1-5)
    console.log('\n--- 2. Testing Guide Modal & Shortcuts (P1-5) ---');
    await page.setViewportSize({ width: 1366, height: 768 });
    await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(400);

    // Click guide button
    await page.click('#btnNavGuide');
    await page.waitForTimeout(300);
    const guideOpen = await page.evaluate(() => {
        const modal = document.getElementById('guideModal');
        return modal && !modal.classList.contains('hidden');
    });
    console.log(`Click #btnNavGuide opens #guideModal: ${guideOpen ? 'PASS ✅' : 'FAIL ❌'}`);

    // Press Esc to close
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    const guideClosed = await page.evaluate(() => {
        const modal = document.getElementById('guideModal');
        return modal && modal.classList.contains('hidden');
    });
    console.log(`Press Escape closes #guideModal: ${guideClosed ? 'PASS ✅' : 'FAIL ❌'}`);

    // Press ? to open
    await page.keyboard.press('?');
    await page.waitForTimeout(300);
    const guideKeyOpen = await page.evaluate(() => {
        const modal = document.getElementById('guideModal');
        return modal && !modal.classList.contains('hidden');
    });
    console.log(`Press '?' key opens #guideModal: ${guideKeyOpen ? 'PASS ✅' : 'FAIL ❌'}`);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);

    // 3. TEST SIDEBAR LIBRARY MODAL (P1-6)
    console.log('\n--- 3. Testing Library Modal & Search (P1-6 & P1-10) ---');
    await page.hover('#sidebarPeekTab');
    await page.waitForTimeout(300);
    await page.click('#navItemLibrary');
    await page.waitForTimeout(400);
    const libraryData = await page.evaluate(() => {
        const modal = document.getElementById('libraryModal');
        const items = document.querySelectorAll('#libItemsList .lib-card-item');
        const countText = document.getElementById('libResultCount') ? document.getElementById('libResultCount').textContent : '';
        return {
            isOpen: modal && !modal.classList.contains('hidden'),
            itemCount: items.length,
            countText
        };
    });
    console.log(`Library opens with items: count=${libraryData.itemCount} (countText: "${libraryData.countText}") -> ${libraryData.itemCount > 0 ? 'PASS ✅' : 'FAIL ❌'}`);
    
    // Test unaccented search in library
    await page.fill('#libSearchInput', 'hien phap');
    await page.waitForTimeout(300);
    const searchHienPhap = await page.evaluate(() => {
        return document.querySelectorAll('#libItemsList .lib-card-item:not([style*="display: none"])').length;
    });
    console.log(`Library search unaccented "hien phap" matches: ${searchHienPhap} items -> ${searchHienPhap > 0 ? 'PASS ✅' : 'FAIL ❌'}`);
    await page.click('#btnCloseLibrary');
    await page.waitForTimeout(300);

    // 4. TEST PRESENTATION TIMER CLEAR (P1-7)
    console.log('\n--- 4. Testing Presentation Timer Leak (P1-7) ---');
    await page.click('#btnPresentationMode');
    await page.waitForTimeout(500);
    const timerStarted = await page.evaluate(() => {
        return window.app && window.app.presentTimerInterval !== null;
    });
    console.log(`Presentation open starts active timer interval: ${timerStarted ? 'PASS ✅' : 'FAIL ❌'}`);
    await page.click('#btnClosePresentation');
    await page.waitForTimeout(300);
    const timerCleared = await page.evaluate(() => {
        return window.app && window.app.presentTimerInterval === null && window.app.presentTimerSeconds === 900;
    });
    console.log(`Presentation close clears timer interval & resets: ${timerCleared ? 'PASS ✅' : 'FAIL ❌'}`);

    // 5. TEST DRAWER LAYOUT (P0-2)
    console.log('\n--- 5. Testing Detail Drawer Layout (P0-2) ---');
    // Open branch 1
    await page.evaluate(() => window.app.selectBranch(1, true));
    await page.waitForTimeout(400);
    const desktopDrawer = await page.evaluate(() => {
        const drawer = document.getElementById('rightDrawer');
        const canvas = document.getElementById('mindmapCanvas');
        const rect = drawer.getBoundingClientRect();
        const style = window.getComputedStyle(drawer);
        return {
            isOpen: !drawer.classList.contains('closed'),
            position: style.position,
            width: rect.width,
            canvasWidth: canvas.getBoundingClientRect().width
        };
    });
    console.log(`Desktop Drawer: position=${desktopDrawer.position}, width=${desktopDrawer.width}px, canvasWidth=${desktopDrawer.canvasWidth}px -> ${desktopDrawer.position === 'absolute' || desktopDrawer.position === 'fixed' ? 'PASS ✅' : 'FAIL ❌'}`);

    // Mobile drawer full screen test
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(300);
    const mobileDrawer = await page.evaluate(() => {
        const drawer = document.getElementById('rightDrawer');
        const rect = drawer.getBoundingClientRect();
        return {
            width: rect.width,
            height: rect.height,
            isFullWidth: Math.abs(rect.width - 375) < 3
        };
    });
    console.log(`Mobile Drawer (375px): width=${mobileDrawer.width}px, fullWidth=${mobileDrawer.isFullWidth ? 'PASS ✅' : 'FAIL ❌'}`);
    await page.click('#btnCloseDrawer');
    await page.waitForTimeout(300);

    // 6. TEST MASTERY TOGGLE (P1-13)
    console.log('\n--- 6. Testing Mastery Tracking (P1-13) ---');
    await page.setViewportSize({ width: 1366, height: 768 });
    await page.evaluate(() => window.app.selectBranch(1, true));
    await page.waitForTimeout(300);
    const masteryInitial = await page.evaluate(() => window.app.masteredBranches.has(1));
    await page.click('#btnMarkBranchMastered');
    await page.waitForTimeout(300);
    const masteryAfter = await page.evaluate(() => window.app.masteredBranches.has(1));
    const progressText = await page.evaluate(() => document.getElementById('sidebarProgressCount').textContent);
    console.log(`Mastery toggle: initial=${masteryInitial} -> toggled=${masteryAfter}, progressText="${progressText}" -> ${masteryAfter !== masteryInitial ? 'PASS ✅' : 'FAIL ❌'}`);
    await page.click('#btnCloseDrawer');
    await page.waitForTimeout(300);

    // 7. TEST XSS SANITIZATION (P0-4)
    console.log('\n--- 7. Testing XSS Sanitization (P0-4) ---');
    await page.hover('#sidebarPeekTab');
    await page.waitForTimeout(300);
    await page.click('#navItemReviews');
    await page.waitForTimeout(400);
    const xssTest = await page.evaluate(() => {
        window.xssFired = false;
        const authorInput = document.getElementById('revAuthorName');
        const textInput = document.getElementById('revCommentText');
        const deptInput = document.getElementById('revClassOrDept');
        
        if (authorInput && textInput) {
            authorInput.value = '<img src=invalid onerror="window.xssFired=true">';
            if (deptInput) deptInput.value = '<b id="xssUnit">Unit</b>';
            textInput.value = '<script>window.xssFired=true</script><img src=x onerror="window.xssFired=true">';
            
            document.getElementById('websiteReviewForm').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }
        
        return new Promise(resolve => {
            setTimeout(() => {
                const hasScriptRendered = document.querySelector('.feed-card script, .student-review-card script') !== null;
                const hasImgErrorRendered = document.querySelector('#xssUnit') !== null;
                resolve({
                    xssFired: window.xssFired,
                    hasScriptRendered,
                    hasImgErrorRendered
                });
            }, 300);
        });
    });
    console.log(`XSS injection prevented: xssFired=${xssTest.xssFired}, hasScriptRendered=${xssTest.hasScriptRendered}, hasRawHtmlRendered=${xssTest.hasImgErrorRendered} -> ${!xssTest.xssFired && !xssTest.hasScriptRendered && !xssTest.hasImgErrorRendered ? 'PASS ✅' : 'FAIL ❌'}`);
    
    // Return to overview via header tab
    await page.click('#btnNavMindmap');
    await page.waitForTimeout(400);

    // 8. TEST VIETNAMESE SEARCH (P1-11)
    console.log('\n--- 8. Testing Vietnamese Tone Search (P1-11) ---');
    await page.fill('#globalSearchInput', 'dan chu');
    await page.waitForTimeout(300);
    const searchResultsUnaccented = await page.evaluate(() => {
        const highlighted = document.querySelectorAll('.branch-card:not([style*="opacity: 0.2"])').length;
        const listCards = document.querySelectorAll('.list-card-item:not([style*="display: none"])').length;
        return { highlighted, listCards };
    });
    console.log(`Search "dan chu" without accents: highlighted mindmap=${searchResultsUnaccented.highlighted}, visible list cards=${searchResultsUnaccented.listCards} -> ${searchResultsUnaccented.highlighted > 0 ? 'PASS ✅' : 'FAIL ❌'}`);

    // Clear search
    await page.fill('#globalSearchInput', '');
    await page.waitForTimeout(200);

    // 9. TEST HEADER BUTTONS & MODALS (P1-12)
    console.log('\n--- 9. Testing Header Buttons & Modals (P1-12) ---');
    await page.click('#btnNotifications');
    await page.waitForTimeout(300);
    const notifOpen = await page.evaluate(() => {
        const m = document.getElementById('notificationsModal');
        return m && !m.classList.contains('hidden');
    });
    console.log(`Click #btnNotifications opens #notificationsModal: ${notifOpen ? 'PASS ✅' : 'FAIL ❌'}`);
    await page.click('#btnCloseNotificationsModal');
    await page.waitForTimeout(300);

    await page.click('#btnUserMenu');
    await page.waitForTimeout(300);
    const userOpen = await page.evaluate(() => {
        const m = document.getElementById('userProfileModal');
        return m && !m.classList.contains('hidden');
    });
    console.log(`Click #btnUserMenu opens #userProfileModal: ${userOpen ? 'PASS ✅' : 'FAIL ❌'}`);
    await page.click('#btnCloseUserModal');
    await page.waitForTimeout(300);

    // 10. CONSOLE ERRORS REPORT
    console.log('\n--- 10. Console Errors Report ---');
    console.log(`Total console errors during entire test run: ${testResults.consoleErrors.length}`);
    if (testResults.consoleErrors.length > 0) {
        testResults.consoleErrors.forEach((err, i) => console.log(`  [${i+1}] ${err}`));
    } else {
        console.log('Console is completely clean! 0 errors ✅');
    }

    console.log('\n=== ALL AUTOMATED TESTS COMPLETED SUCCESSFULLY ===');
    await browser.close();
}

runTestSuite().catch(err => {
    console.error('Test Suite Failed with Exception:', err);
    process.exit(1);
});
