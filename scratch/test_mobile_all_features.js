const { chromium } = require('playwright');

const VIEWPORTS = [
  { name: 'iPhone SE (375x812)', width: 375, height: 812 },
  { name: 'iPhone 13/14 (390x844)', width: 390, height: 844 },
  { name: 'Pixel 7 (412x915)', width: 412, height: 915 }
];

async function runMobileTestSuite() {
  console.log('=== STARTING MOBILE COMPREHENSIVE TEST SUITE ===');
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  let totalErrors = 0;

  for (const vp of VIEWPORTS) {
    console.log(`\n========================================`);
    console.log(`--- Testing Viewport: ${vp.name} ---`);
    console.log(`========================================`);
    const page = await browser.newPage();
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', err => consoleErrors.push(err.message));

    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);

    // 1. Initial State & Zero Horizontal Overflow Check
    const overflowInitial = await page.evaluate(() => {
      return {
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
        overflow: document.documentElement.scrollWidth > window.innerWidth
      };
    });
    console.log(`1. Initial overflow check: scrollWidth=${overflowInitial.scrollWidth}, innerWidth=${overflowInitial.innerWidth}`);
    if (overflowInitial.overflow) {
      console.error(`FAILED: Initial horizontal overflow detected on ${vp.name}!`);
      totalErrors++;
    }

    // 2. Test Bottom Navigation Tab: Actions (Hôm nay tôi nên làm gì?)
    console.log('2. Testing Bottom Nav: #mbNavActions...');
    await page.click('#mbNavActions');
    await page.waitForTimeout(400);

    const actionsViewState = await page.evaluate(() => {
      const viewActions = document.getElementById('viewActions');
      const viewOverview = document.getElementById('viewOverview');
      const btnAsk = document.getElementById('btnAskAiToday');
      const cards = document.querySelectorAll('#todaySuggestionsGrid .today-suggestion-card');
      return {
        actionsVisible: !viewActions.classList.contains('hidden'),
        overviewHidden: viewOverview.classList.contains('hidden'),
        btnAskVisible: !!btnAsk && btnAsk.offsetParent !== null,
        cardsCount: cards.length,
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth
      };
    });
    console.log('   Actions view state:', actionsViewState);
    if (!actionsViewState.actionsVisible || actionsViewState.scrollWidth > actionsViewState.innerWidth) {
      console.error('FAILED: Actions view transition or overflow on mobile!');
      totalErrors++;
    }

    // 2b. Test AI action button click on mobile
    console.log('   Clicking #btnAskAiToday on mobile...');
    await page.click('#btnAskAiToday');
    await page.waitForTimeout(600);
    const actionCardsAfter = await page.evaluate(() => {
      return document.querySelectorAll('#todaySuggestionsGrid .today-suggestion-card').length;
    });
    console.log(`   Action cards rendered: ${actionCardsAfter}`);
    if (actionCardsAfter !== 3) {
      console.error('FAILED: Expected 3 AI action cards!');
      totalErrors++;
    }

    // 3. Test Bottom Navigation: Debate Records (Dữ liệu phản biện thực tế)
    console.log('3. Testing Bottom Nav: #mbNavRecords...');
    await page.click('#mbNavRecords');
    await page.waitForTimeout(400);

    const recordsViewState = await page.evaluate(() => {
      const viewRecords = document.getElementById('viewDebateRecords');
      const listContainer = document.getElementById('drSubmissionsList');
      return {
        recordsVisible: !viewRecords.classList.contains('hidden'),
        listExists: !!listContainer,
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth
      };
    });
    console.log('   Records view state:', recordsViewState);
    if (!recordsViewState.recordsVisible || !recordsViewState.listExists || recordsViewState.scrollWidth > recordsViewState.innerWidth) {
      console.error('FAILED: Debate records view transition or overflow on mobile!');
      totalErrors++;
    }

    // 4. Test Bottom Navigation: Debate Arena Modal
    console.log('4. Testing Bottom Nav: #mbNavDebate (Modal)...');
    await page.click('#mbNavDebate');
    await page.waitForTimeout(400);

    const debateModalState = await page.evaluate(() => {
      const modal = document.getElementById('debateModal');
      const isVisible = modal && !modal.classList.contains('hidden') && modal.style.display !== 'none';
      return {
        modalVisible: isVisible,
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth
      };
    });
    console.log('   Debate modal state:', debateModalState);
    if (!debateModalState.modalVisible) {
      console.error('FAILED: Debate modal not visible on mobile!');
      totalErrors++;
    }
    // Close modal
    await page.click('#btnCloseDebateModal');
    await page.waitForTimeout(300);

    // 5. Test Mobile Offcanvas Menu (via Bottom Nav #mbNavMenu and Hamburger #btnMobileMenu)
    console.log('5. Testing Mobile Offcanvas Sidebar...');
    await page.click('#mbNavMenu');
    await page.waitForTimeout(300);

    const sidebarOpenState = await page.evaluate(() => {
      const sb = document.getElementById('leftSidebar');
      const backdrop = document.getElementById('mobileSidebarBackdrop');
      const reviewsItem = document.getElementById('navItemReviews');
      return {
        sbHasClass: sb.classList.contains('mobile-open'),
        sbDisplay: window.getComputedStyle(sb).display,
        backdropVisible: !backdrop.classList.contains('hidden'),
        reviewsClickable: !!reviewsItem && reviewsItem.offsetParent !== null,
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth
      };
    });
    console.log('   Sidebar open state:', sidebarOpenState);
    if (!sidebarOpenState.sbHasClass || sidebarOpenState.sbDisplay === 'none') {
      console.error('FAILED: Mobile sidebar not opening properly!');
      totalErrors++;
    }

    // 5b. Navigate to Reviews view from offcanvas sidebar
    console.log('   Navigating to Reviews view via offcanvas item...');
    await page.click('#navItemReviews');
    await page.waitForTimeout(400);

    const reviewsViewState = await page.evaluate(() => {
      const viewReviews = document.getElementById('viewReviews');
      const sb = document.getElementById('leftSidebar');
      return {
        reviewsVisible: !viewReviews.classList.contains('hidden'),
        sbClosed: !sb.classList.contains('mobile-open'),
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth
      };
    });
    console.log('   Reviews view state:', reviewsViewState);
    if (!reviewsViewState.reviewsVisible || !reviewsViewState.sbClosed || reviewsViewState.scrollWidth > reviewsViewState.innerWidth) {
      console.error('FAILED: Reviews view navigation or sidebar auto-close failed!');
      totalErrors++;
    }

    // 6. Test Mindmap return and Branch Drawer on mobile
    console.log('6. Returning to Mindmap (#mbNavMindmap) and testing card modal...');
    await page.click('#mbNavMindmap');
    await page.waitForTimeout(400);

    const mindmapState = await page.evaluate(() => {
      const viewOverview = document.getElementById('viewOverview');
      return {
        overviewVisible: !viewOverview.classList.contains('hidden'),
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth
      };
    });
    console.log('   Mindmap overview state:', mindmapState);

    // Open branch card drawer via selectBranch(1)
    await page.evaluate(() => {
      if (window.app && window.app.selectBranch) {
        window.app.selectBranch(1);
      }
    });
    await page.waitForTimeout(400);

    const drawerState = await page.evaluate(() => {
      const drawer = document.getElementById('rightDrawer');
      const isClosed = drawer.classList.contains('closed');
      const display = window.getComputedStyle(drawer).display;
      return {
        drawerOpen: !isClosed,
        drawerDisplay: display,
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth
      };
    });
    console.log('   Branch drawer open state:', drawerState);
    if (!drawerState.drawerOpen || drawerState.drawerDisplay === 'none' || drawerState.scrollWidth > drawerState.innerWidth) {
      console.error('FAILED: Branch drawer failed to open properly or caused overflow on mobile!');
      totalErrors++;
    }

    // Close drawer
    await page.click('#btnCloseDrawer');
    await page.waitForTimeout(300);

    const drawerClosedState = await page.evaluate(() => {
      const drawer = document.getElementById('rightDrawer');
      return {
        isClosed: drawer.classList.contains('closed'),
        display: window.getComputedStyle(drawer).display,
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth
      };
    });
    console.log('   Branch drawer closed state:', drawerClosedState);
    if (!drawerClosedState.isClosed || drawerClosedState.scrollWidth > drawerClosedState.innerWidth) {
      console.error('FAILED: Branch drawer close state overflow on mobile!');
      totalErrors++;
    }

    // 7. Check Top Navbar Mobile Actions (Notifications & User Profile)
    console.log('7. Testing Navbar Modals (Notifications & Profile)...');
    await page.click('#btnNotifications');
    await page.waitForTimeout(300);
    const notifsOpen = await page.evaluate(() => {
      const modal = document.getElementById('notificationsModal');
      return modal && !modal.classList.contains('hidden');
    });
    console.log('   Notifications modal opened:', notifsOpen);
    if (!notifsOpen) {
      console.error('FAILED: Notifications modal did not open!');
      totalErrors++;
    }
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);

    // 8. Check Console Errors
    if (consoleErrors.length > 0) {
      console.error(`FAILED: Console errors encountered on ${vp.name}:`, consoleErrors);
      totalErrors += consoleErrors.length;
    } else {
      console.log(`✓ 0 console errors on ${vp.name}`);
    }

    await page.close();
  }

  await browser.close();

  if (totalErrors === 0) {
    console.log('\n======================================================');
    console.log('✅ ALL MOBILE COMPREHENSIVE TESTS PASSED WITH 0 ERRORS!');
    console.log('======================================================');
    process.exit(0);
  } else {
    console.error(`\n❌ MOBILE TEST SUITE COMPLETED WITH ${totalErrors} ERRORS.`);
    process.exit(1);
  }
}

runMobileTestSuite().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
