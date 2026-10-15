const { chromium } = require('playwright');
const fs = require('fs');

async function testRealDebateRecords() {
  console.log('=== TEST REAL PERSISTENT DEBATE SYSTEM & RECORDS VIEW (RED MIND 2.0) ===\n');
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

  // Clear backend API data first for a fresh clean test
  try {
    await fetch('http://localhost:3000/api/debate-answers', { method: 'DELETE' });
    console.log('🧹 Cleaned backend test data');
  } catch (e) {}

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  // 1. Verify Sidebar Navigation Item
  console.log('1. Checking Sidebar Navigation for "Dữ liệu phản biện"...');
  const navItemVis = await page.evaluate(() => {
    const btn = document.getElementById('navItemDebateRecords');
    const badge = document.getElementById('sidebarDebateCount');
    return {
      exists: !!btn,
      text: btn ? btn.textContent.trim() : '',
      badge: badge ? badge.textContent.trim() : ''
    };
  });
  console.log(`- Nav Item exists: ${navItemVis.exists ? 'PASS ✅' : 'FAIL ❌'} (Badge: ${navItemVis.badge})`);

  // 2. Click Nav Item to switch to viewDebateRecords
  console.log('2. Switching to #viewDebateRecords...');
  await page.evaluate(() => document.getElementById('navItemDebateRecords').click());
  await page.waitForTimeout(500);

  const viewDebateRecState = await page.evaluate(() => {
    const view = document.getElementById('viewDebateRecords');
    const isVisible = view && !view.classList.contains('hidden');
    const emptyState = document.querySelector('.dr-empty-state');
    const statSub = document.getElementById('statSubmittedCount')?.textContent?.trim();
    const statPen = document.getElementById('statPendingCount')?.textContent?.trim();
    return { isVisible, hasEmptyState: !!emptyState, statSub, statPen };
  });

  console.log(`- #viewDebateRecords is visible: ${viewDebateRecState.isVisible ? 'PASS ✅' : 'FAIL ❌'}`);
  console.log(`- Empty state shown initially: ${viewDebateRecState.hasEmptyState ? 'PASS ✅' : 'FAIL ❌'}`);
  console.log(`- Initial Stats: Submitted = ${viewDebateRecState.statSub}, Pending = ${viewDebateRecState.statPen}`);

  // Capture screenshot of empty state
  await page.screenshot({ path: 'scratch/screenshot_debate_records_empty.png', fullPage: false });

  // 3. Open Debate Modal and Submit real answer for Nhóm 1
  console.log('3. Opening Debate Modal and submitting real argument for Nhóm 1...');
  await page.click('#btnOpenDebateFromRec');
  await page.waitForTimeout(500);

  // Ensure modal is open and clean (no mock text)
  const initialModalState = await page.evaluate(() => {
    const textVal = document.getElementById('modalArgumentText')?.value || '';
    const placeholderVis = !document.getElementById('leaderboardPlaceholder')?.classList.contains('hidden');
    const activeLeaderboardVis = !document.getElementById('leaderboardActiveContent')?.classList.contains('hidden');
    return { textVal, placeholderVis, activeLeaderboardVis };
  });

  console.log(`- Initial textarea is blank: ${initialModalState.textVal === '' ? 'PASS ✅' : 'FAIL ❌'}`);
  console.log(`- Initial placeholder visible: ${initialModalState.placeholderVis ? 'PASS ✅' : 'FAIL ❌'}`);

  // Enter real, substantial answer
  const realAnswerTeam1 = 'Căn cứ vào bản chất giai cấp công nhân của nền Dân chủ XHCN và Hiến pháp 2013, quyền lực nhà nước thực sự thuộc về Nhân dân. Tại Đại học Công nghiệp Hà Nội (HaUI), sinh viên thực hành quyền làm chủ thông qua Quy chế số 31/NQ-HĐT, cổng đào tạo sv.haui.edu.vn và các diễn đàn đối thoại với Ban Giám hiệu. Luận điểm đòi hỏi đa nguyên đa đảng tư sản là sự ngụy biện nhằm làm suy yếu nhà nước pháp quyền XHCN.';
  
  await page.fill('#modalArgumentText', realAnswerTeam1);
  await page.click('#btnModalSubmit');
  await page.waitForTimeout(900);

  // Check verdict score and rank for Nhóm 1
  const submission1Result = await page.evaluate(() => {
    const verdictScore = document.getElementById('verdictTotal')?.textContent?.trim();
    const verdictComment = document.getElementById('vAiComment')?.textContent?.trim();
    const activeLeaderboardVis = !document.getElementById('leaderboardActiveContent')?.classList.contains('hidden');
    const rankingRows = document.querySelectorAll('#modalRankingTbody tr').length;
    return { verdictScore, verdictComment, activeLeaderboardVis, rankingRows };
  });

  console.log(`- Nhóm 1 Graded Score: ${submission1Result.verdictScore}`);
  console.log(`- Nhóm 1 Evaluation: ${submission1Result.verdictComment}`);
  console.log(`- Active Leaderboard Revealed: ${submission1Result.activeLeaderboardVis ? 'PASS ✅' : 'FAIL ❌'}`);

  await page.screenshot({ path: 'scratch/screenshot_debate_modal_submitted.png', fullPage: false });

  // 4. Close Debate modal and check #viewDebateRecords
  console.log('4. Checking #viewDebateRecords after Nhóm 1 submission...');
  await page.click('#btnCloseDebateModal');
  await page.waitForTimeout(400);

  // Ensure viewDebateRecords reflects submission
  await page.evaluate(() => document.getElementById('navItemDebateRecords').click());
  await page.waitForTimeout(400);

  const recordsViewState = await page.evaluate(() => {
    const cards = document.querySelectorAll('.dr-card');
    const firstCardTeam = cards[0]?.querySelector('.dr-team-badge')?.textContent?.trim();
    const firstCardScore = cards[0]?.querySelector('.dr-score-badge')?.textContent?.trim();
    const firstCardAnswer = cards[0]?.querySelector('.dr-answer-text')?.textContent?.trim();
    const statSub = document.getElementById('statSubmittedCount')?.textContent?.trim();
    const statPen = document.getElementById('statPendingCount')?.textContent?.trim();
    const sidebarBadge = document.getElementById('sidebarDebateCount')?.textContent?.trim();
    return {
      cardCount: cards.length,
      firstCardTeam,
      firstCardScore,
      firstCardAnswer,
      statSub,
      statPen,
      sidebarBadge
    };
  });

  console.log(`- Cards in view: ${recordsViewState.cardCount} (Expected 1)`);
  console.log(`- Team on Card: ${recordsViewState.firstCardTeam}`);
  console.log(`- Score on Card: ${recordsViewState.firstCardScore}`);
  console.log(`- Full Answer recorded correctly: ${recordsViewState.firstCardAnswer?.length > 100 ? 'PASS ✅' : 'FAIL ❌'}`);
  console.log(`- Sidebar count badge: ${recordsViewState.sidebarBadge}`);

  await page.screenshot({ path: 'scratch/screenshot_debate_records_populated.png', fullPage: false });

  // 5. Test another submission for Nhóm 2 via quick pending chip
  console.log('5. Testing quick submission for Nhóm 2 via pending chip...');
  await page.click('.dr-pending-chip'); // clicks first pending chip (Nhóm 2)
  await page.waitForTimeout(500);

  const selectedTeamName = await page.evaluate(() => document.getElementById('modalSelectTeam')?.value);
  console.log(`- Modal opened preselected with: ${selectedTeamName}`);

  const realAnswerTeam2 = 'Nhóm 2 đối chiếu với cơ chế dân biết, dân bàn, dân làm, dân kiểm tra, dân giám sát, dân thụ hưởng theo Văn kiện Đại hội XIII. Sinh viên HaUI thực hành quyền giám sát chất lượng đào tạo và an toàn máy móc tại xưởng thực hành CNC để đảm bảo quyền thụ hưởng thiết thực nhất.';
  await page.fill('#modalArgumentText', realAnswerTeam2);
  await page.click('#btnModalSubmit');
  await page.waitForTimeout(900);

  await page.click('#btnCloseDebateModal');
  await page.waitForTimeout(300);

  // Re-check view records
  await page.evaluate(() => document.getElementById('navItemDebateRecords').click());
  await page.waitForTimeout(400);

  const twoSubmissionsState = await page.evaluate(() => {
    const cards = document.querySelectorAll('.dr-card').length;
    const statSub = document.getElementById('statSubmittedCount')?.textContent?.trim();
    const statPen = document.getElementById('statPendingCount')?.textContent?.trim();
    const statAvg = document.getElementById('statAvgScore')?.textContent?.trim();
    return { cards, statSub, statPen, statAvg };
  });

  console.log(`- Cards after 2nd submission: ${twoSubmissionsState.cards} (Expected 2)`);
  console.log(`- Stats: Submitted = ${twoSubmissionsState.statSub}, Pending = ${twoSubmissionsState.statPen}, Avg = ${twoSubmissionsState.statAvg}`);

  // 6. Check "Xem câu trả lời của nhóm khác" in Debate Modal
  console.log('6. Checking "Xem câu trả lời của nhóm khác"...');
  await page.click('#btnOpenDebateFromRec');
  await page.waitForTimeout(400);
  await page.selectOption('#modalSelectTeam', 'Nhóm 2');
  await page.waitForTimeout(300);
  await page.click('#btnViewOtherTeamsAnswers');
  await page.waitForTimeout(400);

  const otherAnswersCheck = await page.evaluate(() => {
    const cards = document.querySelectorAll('.other-team-card');
    const firstOtherTeam = cards[0]?.querySelector('.other-team-name')?.textContent?.trim();
    return { count: cards.length, firstOtherTeam };
  });

  console.log(`- Other answers shown for Nhóm 2: ${otherAnswersCheck.count} (Should only be Nhóm 1)`);
  console.log(`- First other team: ${otherAnswersCheck.firstOtherTeam}`);

  await page.screenshot({ path: 'scratch/screenshot_debate_other_teams_real.png', fullPage: false });

  console.log(`\nConsole Errors: ${consoleErrors.length}`);
  if (consoleErrors.length > 0) {
    console.error('Console Errors:', consoleErrors);
  }

  await browser.close();
  console.log('=== TEST REAL PERSISTENT DEBATE SYSTEM COMPLETE ===');
}

testRealDebateRecords().catch(console.error);
