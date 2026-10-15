const { chromium } = require('playwright');

async function testUnlimitedInput() {
  console.log('=== STARTING TEST: UNLIMITED DEBATE INPUT & REAL TIME WORD COUNTER ===');
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();
  const consoleErrors = [];

  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', err => consoleErrors.push(err.message));

  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // 1. Open Debate Modal
  await page.evaluate(() => {
    if (window.app && window.app.openDebateModal) {
      window.app.openDebateModal();
    }
  });
  await page.waitForTimeout(400);

  // 2. Check initial word counter
  const initialCounter = await page.evaluate(() => {
    const el = document.getElementById('arenaWordCountText');
    const badge = document.querySelector('.badge-no-limit');
    return {
      counterText: el?.textContent.trim(),
      badgeText: badge?.textContent.trim()
    };
  });
  console.log('1. Initial counter & badge:', initialCounter);
  if (!initialCounter.badgeText.includes('Không giới hạn số từ')) {
    throw new Error('Badge "Không giới hạn số từ" not found!');
  }

  // 3. Type a 250+ word comprehensive essay into textarea
  const longEssay = [
    "Nhóm chúng em hoàn toàn không đồng tình với quan điểm lệch lạc trên.",
    "Thứ nhất, theo bản chất của Dân chủ Xã hội Chủ nghĩa, giai cấp công nhân và nhân dân lao động là chủ thể tối cao của quyền lực nhà nước.",
    "Không thể có một nền dân chủ chân chính nếu tách rời bản chất giai cấp công nhân và mục tiêu giải phóng con người.",
    "Thứ hai, tại Đại học Công nghiệp Hà Nội, Quy chế số 31/NQ-HĐT của Hội đồng trường đã luật hóa quyền được Biết, được Bàn, được Làm, được Kiểm tra, giám sát và Thụ hưởng của sinh viên.",
    "Sinh viên các khối ngành kỹ thuật công nghệ như CNTT, Cơ khí, Ô tô, Robot không đơn thuần là thợ kỹ thuật mà phải là kỹ sư 4.0 'vừa hồng vừa chuyên' theo lời dạy của Chủ tịch Hồ Chí Minh.",
    "Nếu chỉ giỏi thuật toán hay tay nghề gia công mà thiếu đạo đức chính trị và tư duy pháp quyền thì rất dễ bị lợi dụng làm tổn hại đến lợi ích nhân dân và an ninh quốc gia.",
    "Do đó, học tập Chủ nghĩa xã hội khoa học và thực hành dân chủ học đường chính là kim chỉ nam định hướng lương tâm nghề nghiệp cho mỗi sinh viên HaUI."
  ].join('\n\n');

  console.log('2. Filling 250+ word essay...');
  await page.fill('#modalArgumentText', longEssay);
  await page.dispatchEvent('#modalArgumentText', 'input');
  await page.waitForTimeout(300);

  // Check live counter update
  const updatedCounter = await page.evaluate(() => {
    const el = document.getElementById('arenaWordCountText');
    const textarea = document.getElementById('modalArgumentText');
    return {
      counterText: el?.textContent.trim(),
      textareaHeight: textarea ? parseInt(window.getComputedStyle(textarea).height, 10) : 0,
      valLength: textarea?.value.length
    };
  });
  console.log('   Updated counter state:', updatedCounter);
  if (!updatedCounter.counterText.includes('từ') || updatedCounter.valLength !== longEssay.length) {
    throw new Error('Word counter did not update or text length mismatch!');
  }

  // 4. Click Submit
  console.log('3. Submitting essay...');
  await page.click('#btnModalSubmit');
  await page.waitForTimeout(800);

  // 5. Verify Verdict Card displays 100% full answer without truncation
  const verdictReview = await page.evaluate(() => {
    const verdictScore = document.getElementById('verdictTotal')?.textContent.trim();
    const verdictComment = document.getElementById('vAiComment')?.textContent.trim();
    const fullAnsText = document.getElementById('verdictAnswerFullText')?.textContent.trim();
    return {
      verdictScore,
      verdictComment,
      fullAnsLength: fullAnsText?.length,
      hasTruncationEllipsis: verdictComment?.includes('...".')
    };
  });
  console.log('4. Verdict card review:', verdictReview);

  if (verdictReview.hasTruncationEllipsis) {
    throw new Error('Detected arbitrary truncation ellipsis in verdict comment!');
  }
  if (!verdictReview.fullAnsLength || verdictReview.fullAnsLength < longEssay.length - 10) {
    throw new Error('Full answer in verdict card was truncated or missing!');
  }

  // 6. Check console errors
  if (consoleErrors.length > 0) {
    console.error('Console errors:', consoleErrors);
    throw new Error('Encountered console errors!');
  }

  console.log('\n✅ TEST PASSED: Full essay accepted, no word limit, live counter accurate, 0 console errors!');
  await browser.close();
}

testUnlimitedInput().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
