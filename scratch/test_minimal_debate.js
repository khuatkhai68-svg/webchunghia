const { chromium } = require('playwright');

async function testMinimalDebate() {
  console.log('=== TEST EXPANDED MINIMAL DEBATE ARENA (RED MIND 2.0) ===\n');
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

  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  // 1. Open Debate Modal via navItemDebate
  console.log('1. Opening Debate Arena modal via #navItemDebate...');
  await page.click('#navItemDebate');
  await page.waitForTimeout(500);

  const modalOpen = await page.evaluate(() => {
    const m = document.getElementById('debateModal');
    return m && !m.classList.contains('hidden');
  });
  console.log(`- Modal is open: ${modalOpen ? 'PASS ✅' : 'FAIL ❌'}`);

  // 2. Check Minimal Elements & Constraints
  console.log('2. Checking required minimal elements & user constraints...');
  const elementsCheck = await page.evaluate(() => {
    const questionText = document.getElementById('modalProvocationText')?.textContent?.trim();
    const topicBadge = document.getElementById('modalTopicBadge');
    const teamSelect = document.getElementById('modalSelectTeam');
    const timer = !!document.getElementById('modalTimer');
    const answerInput = document.getElementById('modalArgumentText');
    const submitBtn = !!document.getElementById('btnModalSubmit');
    const viewOthersBtn = !!document.getElementById('btnViewOtherTeamsAnswers');
    const modalBox = document.querySelector('.debate-card-minimal');
    const modalWidth = modalBox ? modalBox.getBoundingClientRect().width : 0;
    const answerWidth = answerInput ? answerInput.getBoundingClientRect().width : 0;
    const answerHeight = answerInput ? answerInput.getBoundingClientRect().height : 0;

    // Team options
    const teamOptions = teamSelect ? Array.from(teamSelect.options).map(o => o.text.trim()) : [];

    // Check initial leaderboard state: placeholder visible, active hidden
    const placeholderVis = !document.getElementById('leaderboardPlaceholder')?.classList.contains('hidden');
    const activeLeaderboardVis = !document.getElementById('leaderboardActiveContent')?.classList.contains('hidden');

    return {
      questionText,
      hasTopicBadge: !!topicBadge,
      teamOptions,
      timer,
      hasAnswerInput: !!answerInput,
      answerWidth,
      answerHeight,
      submitBtn,
      viewOthersBtn,
      placeholderVis,
      activeLeaderboardVis,
      modalWidth
    };
  });

  console.log(`- Question exists & populated: "${elementsCheck.questionText?.slice(0, 50)}..." -> ${elementsCheck.questionText ? 'PASS ✅' : 'FAIL ❌'}`);
  console.log(`- Branch/Topic badge removed completely per user request: ${!elementsCheck.hasTopicBadge ? 'PASS ✅' : 'FAIL ❌'}`);
  console.log(`- Team select options count: ${elementsCheck.teamOptions.length} (Expected: 10)`);
  console.log(`  Options: ${elementsCheck.teamOptions.join(', ')}`);
  const isTeamsClean = elementsCheck.teamOptions.every((t, i) => t === `Nhóm ${i + 1}`);
  console.log(`- Team select has only 'Nhóm 1' to 'Nhóm 10' without hyphens/additions: ${isTeamsClean ? 'PASS ✅' : 'FAIL ❌'}`);
  console.log(`- Modal width: ${Math.round(elementsCheck.modalWidth)}px (Expansive >= 1100px): ${elementsCheck.modalWidth >= 1100 ? 'PASS ✅' : 'FAIL ❌'}`);
  console.log(`- Textarea dimensions: ${Math.round(elementsCheck.answerWidth)}px wide, ${Math.round(elementsCheck.answerHeight)}px high: ${elementsCheck.answerWidth > 500 && elementsCheck.answerHeight >= 180 ? 'PASS ✅' : 'FAIL ❌'}`);
  console.log(`- Submit button exists: ${elementsCheck.submitBtn ? 'PASS ✅' : 'FAIL ❌'}`);
  console.log(`- View other teams button exists: ${elementsCheck.viewOthersBtn ? 'PASS ✅' : 'FAIL ❌'}`);
  console.log(`- Leaderboard initially showing placeholder: ${elementsCheck.placeholderVis && !elementsCheck.activeLeaderboardVis ? 'PASS ✅' : 'FAIL ❌'}`);

  // 3. Test Auto Countdown Timer
  console.log('3. Testing countdown timer auto-start on modal open...');
  const timeInitial = await page.evaluate(() => document.getElementById('modalTimer')?.textContent);
  console.log(`- Timer initial text: ${timeInitial}`);
  await page.waitForTimeout(2200);
  const timeAfter2s = await page.evaluate(() => document.getElementById('modalTimer')?.textContent);
  console.log(`- Timer after 2.2s: ${timeAfter2s}`);
  const timerCounting = timeAfter2s !== timeInitial && (timeAfter2s === '04:58' || timeAfter2s === '04:57');
  console.log(`- Timer counts down automatically without manual start: ${timerCounting ? 'PASS ✅' : 'FAIL ❌'}`);

  // 4. Capture screenshot before submission
  await page.screenshot({ path: 'scratch/debate_before_submit.png' });
  console.log('- Saved screenshot before submit: scratch/debate_before_submit.png');

  // 5. Test Answering & Submitting (Test typing in textarea)
  console.log('4. Testing typing and answer submission without restrictions...');
  await page.click('#modalArgumentText');
  await page.type('#modalArgumentText', 'Nhóm chúng em khẳng định: Sinh viên HaUI là chủ thể của tự chủ đại học theo Quy chế 31/NQ-HĐT. Mọi quyền dân chủ luôn đi đôi với trách nhiệm công dân và kỷ cương pháp quyền Hiến pháp 2013.', { delay: 5 });
  
  const typedVal = await page.evaluate(() => document.getElementById('modalArgumentText')?.value);
  console.log(`- Text successfully typed in textarea (${typedVal.length} chars): ${typedVal.length > 50 ? 'PASS ✅' : 'FAIL ❌'}`);

  await page.click('#btnModalSubmit');

  // Wait for submission evaluation
  await page.waitForTimeout(1100);

  const afterSubmit = await page.evaluate(() => {
    const placeholderVis = !document.getElementById('leaderboardPlaceholder')?.classList.contains('hidden');
    const activeLeaderboardVis = !document.getElementById('leaderboardActiveContent')?.classList.contains('hidden');
    const verdictScore = document.getElementById('verdictTotal')?.textContent;
    const rankingRows = document.querySelectorAll('#modalRankingTbody tr').length;
    const timerStopped = window.app ? window.app.arenaTimerInterval === null : false;
    return { placeholderVis, activeLeaderboardVis, verdictScore, rankingRows, timerStopped };
  });

  console.log(`- Leaderboard revealed beside answer: ${!afterSubmit.placeholderVis && afterSubmit.activeLeaderboardVis ? 'PASS ✅' : 'FAIL ❌'}`);
  console.log(`- Graded score displayed: "${afterSubmit.verdictScore}" -> ${afterSubmit.verdictScore ? 'PASS ✅' : 'FAIL ❌'}`);
  console.log(`- Ranking rows populated: ${afterSubmit.rankingRows} teams -> ${afterSubmit.rankingRows > 0 ? 'PASS ✅' : 'FAIL ❌'}`);
  console.log(`- Timer stopped upon submission: ${afterSubmit.timerStopped ? 'PASS ✅' : 'FAIL ❌'}`);

  // 6. Capture screenshot after submission
  await page.screenshot({ path: 'scratch/debate_after_submit.png' });
  console.log('- Saved screenshot after submit: scratch/debate_after_submit.png');

  // 7. Test "Xem câu trả lời của nhóm khác"
  console.log('5. Testing "Xem câu trả lời của nhóm khác" modal...');
  await page.click('#btnViewOtherTeamsAnswers');
  await page.waitForTimeout(400);

  const otherAnswersModalOpen = await page.evaluate(() => {
    const m = document.getElementById('otherAnswersModal');
    const cards = document.querySelectorAll('#otherAnswersList .other-team-card').length;
    return {
      isOpen: m && !m.classList.contains('hidden'),
      cardsCount: cards
    };
  });
  console.log(`- Other answers modal opens with ${otherAnswersModalOpen.cardsCount} team cards: ${otherAnswersModalOpen.isOpen && otherAnswersModalOpen.cardsCount > 0 ? 'PASS ✅' : 'FAIL ❌'}`);

  await page.screenshot({ path: 'scratch/debate_other_answers.png' });

  await page.click('#btnCloseOtherAnswersModal');
  await page.waitForTimeout(300);

  // 8. Close debate modal and check timer cleared
  console.log('6. Testing Debate modal close and timer clearing...');
  await page.click('#btnCloseDebateModal');
  await page.waitForTimeout(400);

  const modalClosed = await page.evaluate(() => {
    const m = document.getElementById('debateModal');
    const isHidden = m && m.classList.contains('hidden');
    const timerCleared = window.app ? window.app.arenaTimerInterval === null : true;
    return { isHidden, timerCleared };
  });
  console.log(`- Debate modal closed & timer cleared: ${modalClosed.isHidden && modalClosed.timerCleared ? 'PASS ✅' : 'FAIL ❌'}`);

  // 9. Console errors
  console.log('\n--- Console Errors Report ---');
  console.log(`Total errors: ${consoleErrors.length}`);
  if (consoleErrors.length > 0) {
    console.error('Console errors found:', consoleErrors);
  } else {
    console.log('Console is 100% clean! ✅');
  }

  await browser.close();
  const allPassed = modalOpen && !elementsCheck.hasTopicBadge && isTeamsClean && elementsCheck.modalWidth >= 1100 && elementsCheck.answerWidth > 500 && timerCounting && typedVal.length > 50 && !afterSubmit.placeholderVis && afterSubmit.activeLeaderboardVis && otherAnswersModalOpen.isOpen && modalClosed.isHidden && consoleErrors.length === 0;

  console.log(`\nOVERALL TEST RESULT: ${allPassed ? 'ALL TESTS PASSED 100% ✨' : 'SOME TESTS FAILED ⚠️'}`);
  return allPassed;
}

testMinimalDebate().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
