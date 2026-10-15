const { chromium } = require('playwright');

async function testCenteredBranchPopup() {
    console.log('=== TESTING CENTERED BRANCH POPUP MODAL ===\n');

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

    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);

    // Click on Branch 1 (Bản chất)
    console.log('Clicking on Branch 1: BẢN CHẤT...');
    await page.click('#branch1 .branch-card');
    await page.waitForTimeout(400);

    const check = await page.evaluate(() => {
        const drawer = document.getElementById('rightDrawer');
        const backdrop = document.getElementById('drawerBackdrop');
        const tabs = document.querySelector('.drawer-tabs');
        const qTitle = document.getElementById('questionTitle')?.textContent.trim();
        const bulbTitle = document.getElementById('bulbTitle')?.textContent.trim();
        const bullets = document.querySelectorAll('#argumentBulletsList .bullet-card').length;

        const rect = drawer.getBoundingClientRect();
        const winW = window.innerWidth;
        const winH = window.innerHeight;

        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const isHorizontallyCentered = Math.abs(centerX - winW / 2) < 10;
        const isVerticallyCentered = Math.abs(centerY - winH / 2) < 25;

        return {
            isOpen: !drawer.classList.contains('closed'),
            backdropVisible: !backdrop.classList.contains('hidden'),
            tabsHidden: window.getComputedStyle(tabs).display === 'none',
            rect: { left: rect.left, top: rect.top, width: rect.width, height: rect.height },
            win: { winW, winH },
            isHorizontallyCentered,
            isVerticallyCentered,
            qTitle,
            bulbTitle,
            bulletsCount: bullets
        };
    });

    console.log(`Popup Mở: ${check.isOpen ? 'PASS ✅' : 'FAIL ❌'}`);
    console.log(`Backdrop hiển thị: ${check.backdropVisible ? 'PASS ✅' : 'FAIL ❌'}`);
    console.log(`Căn giữa ngang (Horizontal center): ${check.isHorizontallyCentered ? 'PASS ✅' : 'FAIL ❌'} (Popup CenterX=${Math.round(check.rect.left + check.rect.width/2)}px vs Window CenterX=${check.win.winW/2}px)`);
    console.log(`Căn giữa dọc (Vertical center): ${check.isVerticallyCentered ? 'PASS ✅' : 'FAIL ❌'} (Popup CenterY=${Math.round(check.rect.top + check.rect.height/2)}px vs Window CenterY=${check.win.winH/2}px)`);
    console.log(`Tabs bị ẩn (chỉ giữ luận điểm & nội dung): ${check.tabsHidden ? 'PASS ✅' : 'FAIL ❌'}`);
    console.log(`Tiêu đề luận điểm: "${check.qTitle}"`);
    console.log(`Tóm tắt: "${check.bulbTitle}"`);
    console.log(`Số luận điểm chi tiết: ${check.bulletsCount} ý`);

    // Capture screenshot
    await page.screenshot({ path: 'scratch/screenshot_centered_branch_popup.png' });
    console.log('\nScreenshot saved to scratch/screenshot_centered_branch_popup.png');

    // Test close
    console.log('\nTesting Close Modal via [X]...');
    await page.click('#btnCloseDrawer');
    await page.waitForTimeout(300);

    const closedCheck = await page.evaluate(() => {
        const drawer = document.getElementById('rightDrawer');
        const backdrop = document.getElementById('drawerBackdrop');
        return {
            isClosed: drawer.classList.contains('closed'),
            backdropHidden: backdrop.classList.contains('hidden')
        };
    });
    console.log(`Đóng thành công: ${closedCheck.isClosed && closedCheck.backdropHidden ? 'PASS ✅' : 'FAIL ❌'}`);

    console.log(`\nTotal console errors: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
        throw new Error('Console errors occurred!');
    }

    console.log('=== TEST CENTERED BRANCH POPUP COMPLETED SUCCESSFULLY ===');
    await browser.close();
}

testCenteredBranchPopup().catch(err => {
    console.error('Test failed:', err);
    process.exit(1);
});
