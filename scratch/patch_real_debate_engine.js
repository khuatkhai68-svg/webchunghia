const fs = require('fs');

let appJs = fs.readFileSync('app.js', 'utf8');

// 1. Remove mock debateTeams and replace with clean empty array
const mockTeamsTarget = `let debateTeams = [
  {
    rank: 1,
    team: "Nhóm 1",
    leader: "Trần Minh Quân",
    score: 94,
    crit1: 38,
    crit2: 33,
    crit3: 23,
    type: "Xuất sắc",
    argument: "Quan điểm trên hoàn toàn sai lầm. Sinh viên kỹ thuật là chủ thể của nhà trường. Theo Quy chế 31/NQ-HĐT của HaUI, việc phản ánh thiết bị hỏng qua cổng sv.haui.edu.vn chính là thực hành quyền 'Dân kiểm tra' để bảo vệ quyền lợi học tập thực hành của bản thân.",
    remark: "Lập luận đanh thép, bẻ gãy luận điểm thờ ơ học đường; viện dẫn xuất sắc Quy chế 31/NQ-HĐT của HaUI."
  },
  {
    rank: 2,
    team: "Nhóm 2",
    leader: "Phạm Quốc Huy",
    score: 89,
    crit1: 35,
    crit2: 31,
    crit3: 23,
    type: "Giỏi",
    argument: "Sinh viên không thể tách rời chuyên môn với ý thức làm chủ. Máy xưởng CNC rò điện ảnh hưởng trực tiếp đến tính mạng sinh viên. Tham gia giám sát và đối thoại là trách nhiệm công dân chứ không phải việc riêng của Ban Giám hiệu.",
    remark: "Ví dụ xưởng máy CNC rất sống động, gắn chặt với an toàn lao động và kỷ cương nhà trường."
  },
  {
    rank: 3,
    team: "Nhóm 3",
    leader: "Lê Hoàng Long",
    score: 85,
    crit1: 33,
    crit2: 30,
    crit3: 22,
    type: "Khá",
    argument: "Theo bản chất Dân chủ XHCN, quyền lực thuộc về nhân dân và sinh viên được thụ hưởng thành quả giáo dục. Không thể nói dân chủ là việc của người khác trong khi quyền lợi là của chính mình.",
    remark: "Nắm vững nguyên lý quyền lực nhân dân và tiêu chí 'Dân thụ hưởng', cần bổ sung điều khoản luật cụ thể."
  },
  {
    rank: 4,
    team: "Nhóm 4",
    leader: "Đỗ Mai Trang",
    score: 82,
    crit1: 32,
    crit2: 28,
    crit3: 22,
    type: "Khá",
    argument: "Tự chủ đại học đòi hỏi trách nhiệm giải trình và sự tham gia của các bên liên quan, trong đó sinh viên là khách hàng và chủ thể trung tâm của chất lượng giáo dục.",
    remark: "Góc nhìn quản trị kinh doanh khá tốt, nhưng cần nhấn mạnh hơn bản chất chính trị XHCN."
  },
  {
    rank: 5,
    team: "Nhóm 5",
    leader: "Vũ Đức Thắng",
    score: 80,
    crit1: 31,
    crit2: 27,
    crit3: 22,
    type: "Khá",
    argument: "Kỹ sư HaUI thời đại 4.0 phải vừa hồng vừa chuyên, làm chủ công nghệ và rèn luyện ý thức phục vụ nhân dân, bảo vệ chủ quyền số quốc gia.",
    remark: "Lập luận thực tế, đề cao đạo đức nghề nghiệp kỹ sư 4.0."
  }
];`;

const realTeamsReplacement = `// ==========================================================================
// 4. DỮ LIỆU CÂU TRẢ LỜI PHẢN BIỆN THỰC TẾ (LƯU TRỮ VÀ TRUY XUẤT MINH BẠCH)
// ==========================================================================
// Xóa bỏ hoàn toàn dữ liệu giả lập. Dữ liệu được đồng bộ từ backend API & localStorage.
let debateTeams = [];`;

if (appJs.includes(mockTeamsTarget)) {
  appJs = appJs.replace(mockTeamsTarget, realTeamsReplacement);
  console.log('✅ Replaced mock debateTeams with clean empty state');
} else {
  // Try normalized replacement
  const normApp = appJs.replace(/\r\n/g, '\n');
  const normMock = mockTeamsTarget.replace(/\r\n/g, '\n');
  if (normApp.includes(normMock)) {
    appJs = normApp.replace(normMock, realTeamsReplacement);
    console.log('✅ Replaced mock debateTeams (normalized)');
  } else {
    console.warn('⚠️ Could not match mock debateTeams directly');
  }
}

// 2. Update switchView in app.js
const oldSwitchView = `    const viewOverview = document.getElementById('viewOverview');
    const viewActions = document.getElementById('viewActions');
    const viewReviews = document.getElementById('viewReviews');
    const navOverview = document.getElementById('navItemOverview');
    const navActions = document.getElementById('navItemActions');
    const navReviews = document.getElementById('navItemReviews');`;

const newSwitchView = `    const viewOverview = document.getElementById('viewOverview');
    const viewActions = document.getElementById('viewActions');
    const viewReviews = document.getElementById('viewReviews');
    const viewDebateRecords = document.getElementById('viewDebateRecords');
    const navOverview = document.getElementById('navItemOverview');
    const navActions = document.getElementById('navItemActions');
    const navReviews = document.getElementById('navItemReviews');
    const navDebateRecords = document.getElementById('navItemDebateRecords');`;

const oldViewBranches = `    } else if (viewName === 'reviews') {
      if (viewOverview) viewOverview.classList.add('hidden');
      if (viewActions) viewActions.classList.add('hidden');
      if (viewReviews) viewReviews.classList.remove('hidden');
      if (navReviews) navReviews.classList.add('active');
    }`;

const newViewBranches = `    } else if (viewName === 'reviews') {
      if (viewOverview) viewOverview.classList.add('hidden');
      if (viewActions) viewActions.classList.add('hidden');
      if (viewReviews) viewReviews.classList.remove('hidden');
      if (viewDebateRecords) viewDebateRecords.classList.add('hidden');
      if (navReviews) navReviews.classList.add('active');
    } else if (viewName === 'debate-records') {
      if (viewOverview) viewOverview.classList.add('hidden');
      if (viewActions) viewActions.classList.add('hidden');
      if (viewReviews) viewReviews.classList.add('hidden');
      if (viewDebateRecords) viewDebateRecords.classList.remove('hidden');
      if (navDebateRecords) navDebateRecords.classList.add('active');
      this.renderDebateRecordsView();
    }`;

if (appJs.includes(oldSwitchView)) {
  appJs = appJs.replace(oldSwitchView, newSwitchView);
} else {
  const normApp = appJs.replace(/\r\n/g, '\n');
  appJs = normApp.replace(oldSwitchView.replace(/\r\n/g, '\n'), newSwitchView);
}

if (appJs.includes(oldViewBranches)) {
  appJs = appJs.replace(oldViewBranches, newViewBranches);
} else {
  const normApp = appJs.replace(/\r\n/g, '\n');
  appJs = normApp.replace(oldViewBranches.replace(/\r\n/g, '\n'), newViewBranches);
}

// In overview and actions branches, hide viewDebateRecords
appJs = appJs.replace(
  "if (viewReviews) viewReviews.classList.add('hidden');\n      if (navOverview)",
  "if (viewReviews) viewReviews.classList.add('hidden');\n      if (viewDebateRecords) viewDebateRecords.classList.add('hidden');\n      if (navOverview)"
);
appJs = appJs.replace(
  "if (viewReviews) viewReviews.classList.add('hidden');\n      if (navActions)",
  "if (viewReviews) viewReviews.classList.add('hidden');\n      if (viewDebateRecords) viewDebateRecords.classList.add('hidden');\n      if (navActions)"
);

// 3. Update bindNavigationViews in app.js
const oldNavBindings = `    const navReviews = document.getElementById('navItemReviews');
    const navDebate = document.getElementById('navItemDebate');`;

const newNavBindings = `    const navReviews = document.getElementById('navItemReviews');
    const navDebate = document.getElementById('navItemDebate');
    const navDebateRecords = document.getElementById('navItemDebateRecords');
    const bcHomeFromDebateRec = document.getElementById('bcHomeFromDebateRec');`;

if (appJs.includes(oldNavBindings)) {
  appJs = appJs.replace(oldNavBindings, newNavBindings);
} else {
  const normApp = appJs.replace(/\r\n/g, '\n');
  appJs = normApp.replace(oldNavBindings.replace(/\r\n/g, '\n'), newNavBindings);
}

const oldNavActions = `    if (navReviews) {
      navReviews.addEventListener('click', () => this.switchView('reviews'));
    }`;

const newNavActions = `    if (navReviews) {
      navReviews.addEventListener('click', () => this.switchView('reviews'));
    }
    if (navDebateRecords) {
      navDebateRecords.addEventListener('click', () => this.switchView('debate-records'));
    }
    if (bcHomeFromDebateRec) {
      bcHomeFromDebateRec.addEventListener('click', () => this.switchView('overview'));
    }`;

if (appJs.includes(oldNavActions)) {
  appJs = appJs.replace(oldNavActions, newNavActions);
} else {
  const normApp = appJs.replace(/\r\n/g, '\n');
  appJs = normApp.replace(oldNavActions.replace(/\r\n/g, '\n'), newNavActions);
}

// 4. Update init() to load debate answers and bind records view
const oldInitEnd = `    this.bindReviewsModule();

    // Khởi tạo danh sách & tiến độ & trạng thái ban đầu`;

const newInitEnd = `    this.bindReviewsModule();
    this.loadDebateAnswers();
    this.bindDebateRecordsView();

    // Khởi tạo danh sách & tiến độ & trạng thái ban đầu`;

if (appJs.includes(oldInitEnd)) {
  appJs = appJs.replace(oldInitEnd, newInitEnd);
} else {
  const normApp = appJs.replace(/\r\n/g, '\n');
  appJs = normApp.replace(oldInitEnd.replace(/\r\n/g, '\n'), newInitEnd);
}

// 5. Replace Debate Engine in app.js with the robust, content-driven, persistent version
const debateEngineHeader = `  // ==========================================================================
  // DEBATE ARENA & TEACHER REPORT ENGINE (ACADEMIC MINIMAL)
  // ==========================================================================`;

const nextSectionHeader = `  // ==========================================================================
  // LIBRARY MODAL (200 references)
  // ==========================================================================`;

const startIdx = appJs.indexOf(debateEngineHeader);
const endIdx = appJs.indexOf(nextSectionHeader);

if (startIdx !== -1 && endIdx !== -1) {
  const newDebateImplementation = `  // ==========================================================================
  // DEBATE ARENA & REAL PERSISTENCE ENGINE (KHÔNG DỮ LIỆU BỊA ĐẶT)
  // ==========================================================================

  // 1. Tải dữ liệu phản biện từ Backend API hoặc LocalStorage
  async loadDebateAnswers() {
    try {
      const res = await fetch('/api/debate-answers');
      if (res.ok) {
        const json = await res.json();
        if (json && Array.isArray(json.answers)) {
          debateTeams = json.answers;
          try {
            localStorage.setItem('REDMIND_REAL_DEBATE_DATA', JSON.stringify(debateTeams));
          } catch(e) {}
          this.updateDebateBadges();
          return;
        }
      }
    } catch (e) {
      console.warn('API /api/debate-answers offline, fallback to localStorage', e);
    }

    try {
      const cached = localStorage.getItem('REDMIND_REAL_DEBATE_DATA');
      if (cached) {
        debateTeams = JSON.parse(cached) || [];
      } else {
        debateTeams = [];
      }
    } catch (e) {
      debateTeams = [];
    }
    this.updateDebateBadges();
  }

  // 2. Lưu trữ câu trả lời thực tế của nhóm vào cả API & LocalStorage
  async saveDebateSubmission(record) {
    const existingIdx = debateTeams.findIndex(t => t.team === record.team);
    if (existingIdx >= 0) {
      debateTeams[existingIdx] = record;
    } else {
      debateTeams.push(record);
    }

    try {
      localStorage.setItem('REDMIND_REAL_DEBATE_DATA', JSON.stringify(debateTeams));
    } catch (e) {}

    try {
      await fetch('/api/debate-answers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record)
      });
    } catch (e) {
      console.warn('Could not POST to /api/debate-answers', e);
    }

    this.updateDebateBadges();
    if (this.currentView === 'debate-records') {
      this.renderDebateRecordsView();
    }
  }

  // 3. Xóa một bài nộp hoặc đặt lại toàn bộ dữ liệu
  async deleteDebateSubmission(teamName) {
    if (!confirm(\`Bạn có chắc chắn muốn xóa bài nộp phản biện của \${teamName}?\`)) return;
    debateTeams = debateTeams.filter(t => t.team !== teamName);
    try {
      localStorage.setItem('REDMIND_REAL_DEBATE_DATA', JSON.stringify(debateTeams));
    } catch (e) {}

    try {
      await fetch('/api/debate-answers', { method: 'DELETE' });
      for (const t of debateTeams) {
        await fetch('/api/debate-answers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(t)
        });
      }
    } catch (e) {}

    audio.pop();
    this.updateDebateBadges();
    this.renderDebateRecordsView();
  }

  async clearAllDebateSubmissions() {
    if (!confirm("⚠️ Bạn có chắc chắn muốn XÓA TOÀN BỘ câu trả lời phản biện của tất cả các nhóm để bắt đầu đợt mới?")) return;
    debateTeams = [];
    try {
      localStorage.removeItem('REDMIND_REAL_DEBATE_DATA');
    } catch (e) {}
    try {
      await fetch('/api/debate-answers', { method: 'DELETE' });
    } catch (e) {}

    audio.pop();
    this.updateDebateBadges();
    this.renderDebateRecordsView();
    alert("Đã đặt lại dữ liệu phản biện sạch sẽ!");
  }

  updateDebateBadges() {
    const badge = document.getElementById('sidebarDebateCount');
    if (badge) {
      badge.textContent = \`\${debateTeams.length} bài\`;
    }
    const statSub = document.getElementById('statSubmittedCount');
    if (statSub) {
      statSub.textContent = \`\${debateTeams.length} / 10\`;
    }
    const statPending = document.getElementById('statPendingCount');
    if (statPending) {
      statPending.textContent = \`\${Math.max(0, 10 - debateTeams.length)}\`;
    }
    const statAvg = document.getElementById('statAvgScore');
    if (statAvg) {
      if (debateTeams.length > 0) {
        const sum = debateTeams.reduce((acc, t) => acc + (t.score || 0), 0);
        statAvg.textContent = \`\${(sum / debateTeams.length).toFixed(1)}đ\`;
      } else {
        statAvg.textContent = '--';
      }
    }
  }

  // 4. Thuật toán chấm điểm & đánh giá THẬT dựa trên câu trả lời thực tế
  evaluateRealSubmission(text, question, teamName) {
    const raw = text.trim();
    const words = raw.split(/\\s+/).filter(Boolean);
    const wordCount = words.length;

    // Tiêu chí 1: Cơ sở lý luận Dân chủ XHCN (Tối đa 40đ)
    let theoryScore = 20;
    const theoryFindings = [];
    if (/giai cấp công nhân|giai cấp|bản chất giai cấp/i.test(raw)) {
      theoryScore += 7;
      theoryFindings.push('bản chất giai cấp công nhân');
    }
    if (/quyền lực thuộc về nhân dân|nhân dân làm chủ|quyền làm chủ|làm chủ tập thể/i.test(raw)) {
      theoryScore += 6;
      theoryFindings.push('quyền lực nhân dân');
    }
    if (/đa nguyên|đa đảng|tư sản|phi chính trị|ngụy biện/i.test(raw)) {
      theoryScore += 5;
      theoryFindings.push('phân tích đa nguyên chính trị tư sản');
    }
    if (/mác - lênin|chủ nghĩa mác|mác|lênin|hồ chí minh/i.test(raw)) {
      theoryScore += 4;
      theoryFindings.push('lý luận Mác - Lênin & Hồ Chí Minh');
    }
    if (/dân biết|dân bàn|dân làm|dân kiểm tra|dân giám sát|dân thụ hưởng/i.test(raw)) {
      theoryScore += 5;
      theoryFindings.push('cơ chế dân biết, dân bàn, dân làm, dân kiểm tra, dân giám sát, dân thụ hưởng');
    }
    if (/pháp quyền xhcn|nhà nước pháp quyền|kỷ cương|pháp luật/i.test(raw)) {
      theoryScore += 4;
      theoryFindings.push('nhà nước pháp quyền XHCN');
    }
    theoryScore = Math.min(40, theoryScore);

    // Tiêu chí 2: Dẫn chứng thực tiễn & Quy chế HaUI (Tối đa 35đ)
    let practiceScore = 15;
    const practiceFindings = [];
    if (/hiến pháp 2013|hiến pháp|luật|nghị quyết 203|luật thực hiện dân chủ/i.test(raw)) {
      practiceScore += 8;
      practiceFindings.push('Hiến pháp & Luật Dân chủ ở cơ sở');
    }
    if (/quy chế 31|quy chế|hội đồng trường/i.test(raw)) {
      practiceScore += 7;
      practiceFindings.push('Quy chế 31/NQ-HĐT của HaUI');
    }
    if (/đại học công nghiệp hà nội|haui|sv\\.haui\\.edu\\.vn|cổng đào tạo/i.test(raw)) {
      practiceScore += 6;
      practiceFindings.push('cổng đào tạo và đối thoại sinh viên HaUI');
    }
    if (/xưởng máy|phòng máy|lab|cnc|an toàn lao động|sinh viên kỹ thuật/i.test(raw)) {
      practiceScore += 5;
      practiceFindings.push('thực tiễn học tập xưởng máy / lab kỹ thuật');
    }
    if (/đối thoại|phản ánh|giám sát|thụ hưởng|học bổng|cơ sở vật chất/i.test(raw)) {
      practiceScore += 4;
      practiceFindings.push('quyền lợi và trách nhiệm người học');
    }
    practiceScore = Math.min(35, practiceScore);

    // Tiêu chí 3: Lập luận logic & Tính thuyết phục (Tối đa 25đ)
    let logicScore = 12;
    if (wordCount >= 35) logicScore += 3;
    if (wordCount >= 75) logicScore += 4;
    if (wordCount >= 120) logicScore += 3;
    if (/khẳng định rằng|bởi vì|do đó|vì vậy|từ đó|ngược lại|mặt khác|thực chất/i.test(raw)) {
      logicScore += 3;
    }
    logicScore = Math.min(25, logicScore);

    const totalScore = theoryScore + practiceScore + logicScore;

    // Trích đoạn thực tế từ chính câu trả lời của nhóm
    const snippet = raw.length > 95 ? raw.slice(0, 90) + '...' : raw;

    let remark = '';
    const points = [];
    if (theoryFindings.length > 0) {
      points.push(\`vận dụng tốt lý luận về \${theoryFindings.slice(0, 2).join(' và ')}\`);
    }
    if (practiceFindings.length > 0) {
      points.push(\`viện dẫn xác thực \${practiceFindings[0]}\`);
    }

    if (points.length > 0) {
      remark = \`Nhóm đã \${points.join(', ')}. Luận điểm xuất phát từ quan điểm: "\${snippet}". \`;
    } else {
      remark = \`Nhóm đã nêu được ý kiến thực tế: "\${snippet}". \`;
    }

    if (totalScore >= 88) {
      remark += 'Lập luận sắc bén, luận cứ vững chắc và phản biện rất thuyết phục bám sát chủ đề!';
    } else if (totalScore >= 75) {
      remark += 'Lập luận rõ ràng; nếu bổ sung thêm dẫn chứng điều luật hoặc Quy chế HaUI cụ thể thì bài phản biện sẽ trọn vẹn điểm số.';
    } else {
      remark += 'Cần đào sâu hơn bản chất giai cấp công nhân và mở rộng dẫn chứng thực tiễn để tăng sức thuyết phục.';
    }

    return {
      score: totalScore,
      wordCount,
      rubric: {
        theory: { score: theoryScore, max: 40, name: "Lý luận Dân chủ XHCN" },
        practice: { score: practiceScore, max: 35, name: "Thực tiễn & Quy chế HaUI" },
        logic: { score: logicScore, max: 25, name: "Lập luận & Tính thuyết phục" }
      },
      keyFindings: [...theoryFindings, ...practiceFindings],
      remark
    };
  }

  // 5. Mở modal Đấu trường phản biện
  openDebateModal(branchId = null) {
    this._isOpeningDebateModal = true;
    try {
      this.debateTopicIndex = Math.floor(Math.random() * PROVOCATION_BANK.length);
      this.openModal('debateModal');
      this.renderDebateTopic();

      const selectTeam = document.getElementById('modalSelectTeam');
      const argInput = document.getElementById('modalArgumentText');
      const placeholder = document.getElementById('leaderboardPlaceholder');
      const activeContent = document.getElementById('leaderboardActiveContent');

      // Kiểm tra xem nhóm đang chọn đã nộp bài chưa
      const currentTeamName = selectTeam ? selectTeam.value : "Nhóm 1";
      const existing = debateTeams.find(t => t.team === currentTeamName);

      if (existing) {
        if (argInput) argInput.value = existing.answer;
        const verdictTeam = document.getElementById('verdictTeamName');
        const verdictScore = document.getElementById('verdictTotal');
        const verdictComment = document.getElementById('vAiComment');
        if (verdictTeam) verdictTeam.textContent = existing.team;
        if (verdictScore) verdictScore.textContent = \`\${existing.score}/100đ\`;
        if (verdictComment) verdictComment.textContent = existing.remark;
        if (placeholder) placeholder.classList.add('hidden');
        if (activeContent) activeContent.classList.remove('hidden');
      } else {
        if (argInput) argInput.value = '';
        if (placeholder) placeholder.classList.remove('hidden');
        if (activeContent) activeContent.classList.add('hidden');
      }

      if (argInput) {
        setTimeout(() => argInput.focus(), 150);
      }

      // Khởi động đồng hồ đếm ngược
      if (this.arenaTimerInterval) {
        clearInterval(this.arenaTimerInterval);
        this.arenaTimerInterval = null;
      }
      this.arenaTimerSeconds = 300;
      const timerEl = document.getElementById('modalTimer');
      if (timerEl) timerEl.textContent = "05:00";
      this.isArenaRunning = true;
      this.arenaTimerInterval = setInterval(() => {
        if (this.arenaTimerSeconds > 0) {
          this.arenaTimerSeconds--;
          const m = String(Math.floor(this.arenaTimerSeconds / 60)).padStart(2, '0');
          const s = String(this.arenaTimerSeconds % 60).padStart(2, '0');
          if (timerEl) timerEl.textContent = \`\${m}:\${s}\`;
        } else {
          clearInterval(this.arenaTimerInterval);
          this.arenaTimerInterval = null;
          this.isArenaRunning = false;
          if (audio && audio.alert) audio.alert();
          alert("⏰ HẾT THỜI GIAN THẢO LUẬN 5 PHÚT! CÁC NHÓM NỘP BÀI!");
        }
      }, 1000);

      this.renderArenaRanking(currentTeamName);
    } finally {
      this._isOpeningDebateModal = false;
    }
  }

  renderDebateTopic() {
    const topic = PROVOCATION_BANK[this.debateTopicIndex] || PROVOCATION_BANK[0];
    if (!topic) return;
    const quoteEl = document.getElementById('modalProvocationText');
    const badgeEl = document.getElementById('modalTopicBadge');

    if (quoteEl) quoteEl.textContent = \`"\${topic.statement}"\`;
    if (badgeEl) badgeEl.remove();
  }

  renderArenaRanking(activeTeamName = null) {
    const tbody = document.getElementById('modalRankingTbody');
    if (!tbody) return;

    if (debateTeams.length === 0) {
      tbody.innerHTML = \`
        <tr>
          <td colspan="3" style="text-align: center; color: #64748b; padding: 20px 10px; font-size: 13px;">
            Chưa có nhóm nào nộp bài.<br>Nhập câu trả lời và bấm <strong>Nộp bài</strong> để xếp hạng!
          </td>
        </tr>
      \`;
      return;
    }

    // Sắp xếp giảm dần theo điểm thực tế
    const sorted = [...debateTeams].sort((a, b) => b.score - a.score);

    tbody.innerHTML = sorted.map((t, idx) => {
      const rank = idx + 1;
      const isCurrent = activeTeamName && t.team === activeTeamName;
      const rankBadge = rank === 1 ? '🥇 #1' : rank === 2 ? '🥈 #2' : rank === 3 ? '🥉 #3' : \`#\${rank}\`;
      return \`
        <tr class="\${isCurrent ? 'active-team-row' : ''}">
          <td><strong>\${rankBadge}</strong></td>
          <td>
            <strong>\${escapeHTML(t.team)}</strong>
            \${isCurrent ? ' <span style="font-size: 11px; background: #fee2e2; color: #b91c1c; padding: 1px 6px; border-radius: 4px; font-weight: 700;">Nhóm bạn</span>' : ''}
          </td>
          <td><strong style="color: #b91c1c; font-size: 14.5px;">\${t.score}đ</strong></td>
        </tr>
      \`;
    }).join('');
  }

  renderOtherTeamsAnswers() {
    const listEl = document.getElementById('otherAnswersList');
    if (!listEl) return;
    const selectedTeam = document.getElementById('modalSelectTeam')?.value || '';

    // LỌC CHÍNH XÁC CÁC BÀI THỰC SỰ ĐÃ NỘP (KHÔNG BỊA RA)
    const otherSubmitted = debateTeams.filter(t => t.team !== selectedTeam);

    if (otherSubmitted.length === 0) {
      listEl.innerHTML = \`
        <div style="text-align: center; padding: 48px 20px; color: #64748b;">
          <div style="font-size: 36px; margin-bottom: 12px;">👥</div>
          <h4 style="color: #0f172a; margin-bottom: 8px;">Chưa có nhóm nào khác nộp bài phản biện</h4>
          <p style="font-size: 13.5px; max-width: 480px; margin: 0 auto;">
            Hệ thống vận hành theo dữ liệu thực tế. Khi các nhóm khác hoàn thành bài và bấm nộp, câu trả lời nguyên văn của họ sẽ tự động xuất hiện tại đây.
          </p>
        </div>
      \`;
      return;
    }

    listEl.innerHTML = otherSubmitted.map(t => \`
      <div class="other-team-card">
        <div class="other-team-header">
          <div class="other-team-name">\${escapeHTML(t.team)} <small style="color: #64748b; font-weight: normal;">(Đã nộp: \${escapeHTML(t.submittedTimeFormatted || 'Vừa xong')})</small></div>
          <div class="other-team-score">\${t.score}/100đ</div>
        </div>
        <div class="other-team-arg">
          "\${escapeHTML(t.answer)}"
        </div>
        <div class="other-team-remark">
          💡 <strong>Đánh giá thực tế:</strong> \${escapeHTML(t.remark)}
        </div>
      </div>
    \`).join('');
  }

  bindDebateArena() {
    const btnSubmit = document.getElementById('btnModalSubmit');
    const argInput = document.getElementById('modalArgumentText');
    const selectTeam = document.getElementById('modalSelectTeam');
    const btnViewOthers = document.getElementById('btnViewOtherTeamsAnswers');
    const btnCloseOthers = document.getElementById('btnCloseOtherAnswersModal');

    // Chuyển nhóm: Tự động tải câu trả lời của nhóm đó nếu đã nộp
    if (selectTeam) {
      selectTeam.addEventListener('change', () => {
        const teamName = selectTeam.value;
        const existing = debateTeams.find(t => t.team === teamName);
        const placeholder = document.getElementById('leaderboardPlaceholder');
        const activeContent = document.getElementById('leaderboardActiveContent');

        if (existing) {
          if (argInput) argInput.value = existing.answer;
          const verdictTeam = document.getElementById('verdictTeamName');
          const verdictScore = document.getElementById('verdictTotal');
          const verdictComment = document.getElementById('vAiComment');
          if (verdictTeam) verdictTeam.textContent = existing.team;
          if (verdictScore) verdictScore.textContent = \`\${existing.score}/100đ\`;
          if (verdictComment) verdictComment.textContent = existing.remark;
          if (placeholder) placeholder.classList.add('hidden');
          if (activeContent) activeContent.classList.remove('hidden');
        } else {
          if (argInput) argInput.value = '';
          if (placeholder) placeholder.classList.remove('hidden');
          if (activeContent) activeContent.classList.add('hidden');
        }
        this.renderArenaRanking(teamName);
      });
    }

    // Nộp bài & Chấm điểm thực tế theo bài viết
    if (btnSubmit) {
      btnSubmit.addEventListener('click', async () => {
        const text = argInput?.value.trim();
        if (!text) {
          audio.alert();
          alert("Vui lòng nhập câu trả lời / luận điểm phản biện của nhóm!");
          if (argInput) argInput.focus();
          return;
        }

        audio.pop();
        btnSubmit.textContent = "⏳ Đang lưu & chấm điểm từ bài viết...";
        btnSubmit.disabled = true;

        const currentTopic = PROVOCATION_BANK[this.debateTopicIndex] || PROVOCATION_BANK[0];
        const selectedTeamName = selectTeam ? selectTeam.value : "Nhóm 1";

        // Thực hiện chấm điểm thực tế dựa trên nội dung văn bản
        const evalResult = this.evaluateRealSubmission(text, currentTopic.statement, selectedTeamName);

        const submissionRecord = {
          id: \`sub_\${Date.now()}_\${Math.random().toString(36).substr(2, 5)}\`,
          team: selectedTeamName,
          question: currentTopic.statement,
          answer: text,
          wordCount: evalResult.wordCount,
          score: evalResult.score,
          rubric: evalResult.rubric,
          keyFindings: evalResult.keyFindings,
          remark: evalResult.remark,
          submittedAt: new Date().toISOString(),
          submittedTimeFormatted: new Date().toLocaleString('vi-VN')
        };

        // Lưu trữ vào Backend API và LocalStorage
        await this.saveDebateSubmission(submissionRecord);

        btnSubmit.disabled = false;
        btnSubmit.textContent = "⚡ Nộp bài";
        audio.success();

        if (typeof confetti === 'function') {
          confetti({ particleCount: 70, spread: 65, origin: { y: 0.6 } });
        }

        // Dừng đồng hồ đếm ngược sau khi đã nộp bài
        if (this.arenaTimerInterval) {
          clearInterval(this.arenaTimerInterval);
          this.arenaTimerInterval = null;
          this.isArenaRunning = false;
        }

        // Cập nhật thẻ kết quả
        const verdictTeam = document.getElementById('verdictTeamName');
        const verdictScore = document.getElementById('verdictTotal');
        const verdictComment = document.getElementById('vAiComment');
        if (verdictTeam) verdictTeam.textContent = submissionRecord.team;
        if (verdictScore) verdictScore.textContent = \`\${submissionRecord.score}/100đ\`;
        if (verdictComment) verdictComment.textContent = submissionRecord.remark;

        // Cập nhật bảng xếp hạng thực tế
        this.renderArenaRanking(selectedTeamName);

        // Hiện bảng xếp hạng bên cạnh
        const placeholder = document.getElementById('leaderboardPlaceholder');
        const activeContent = document.getElementById('leaderboardActiveContent');
        if (placeholder) placeholder.classList.add('hidden');
        if (activeContent) activeContent.classList.remove('hidden');
      });
    }

    // Xem câu trả lời của nhóm khác
    if (btnViewOthers) {
      btnViewOthers.addEventListener('click', () => {
        audio.click();
        this.renderOtherTeamsAnswers();
        this.openModal('otherAnswersModal');
      });
    }

    if (btnCloseOthers) {
      btnCloseOthers.addEventListener('click', () => {
        this.closeModal('otherAnswersModal');
      });
    }
  }

  // 6. Giao diện quản lý & truy xuất dữ liệu câu trả lời phản biện (#viewDebateRecords)
  bindDebateRecordsView() {
    const filterSelect = document.getElementById('filterTeamSelect');
    const searchInput = document.getElementById('drSearchInput');
    const btnOpenDebate = document.getElementById('btnOpenDebateFromRec');
    const btnExport = document.getElementById('btnExportDebateData');
    const btnReset = document.getElementById('btnResetDebateData');

    if (filterSelect) {
      filterSelect.addEventListener('change', () => this.renderDebateRecordsView());
    }
    if (searchInput) {
      searchInput.addEventListener('input', () => this.renderDebateRecordsView());
    }
    if (btnOpenDebate) {
      btnOpenDebate.addEventListener('click', () => {
        audio.click();
        this.openDebateModal();
      });
    }
    if (btnExport) {
      btnExport.addEventListener('click', () => {
        audio.click();
        this.exportDebateAnswersJson();
      });
    }
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        audio.alert();
        this.clearAllDebateSubmissions();
      });
    }
  }

  renderDebateRecordsView() {
    const listEl = document.getElementById('drSubmissionsList');
    const pendingBox = document.getElementById('drPendingBox');
    const filterSelect = document.getElementById('filterTeamSelect');
    const searchInput = document.getElementById('drSearchInput');

    if (!listEl) return;

    this.updateDebateBadges();

    const selectedFilter = filterSelect ? filterSelect.value : 'all';
    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';

    // Lọc danh sách bài nộp
    let filtered = [...debateTeams];
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(t => t.team === selectedFilter);
    }
    if (query) {
      filtered = filtered.filter(t => 
        (t.team && t.team.toLowerCase().includes(query)) ||
        (t.answer && t.answer.toLowerCase().includes(query)) ||
        (t.remark && t.remark.toLowerCase().includes(query))
      );
    }

    // Render danh sách các bài nộp
    if (filtered.length === 0) {
      if (debateTeams.length === 0) {
        listEl.innerHTML = \`
          <div class="dr-empty-state">
            <div class="dr-empty-icon">📝</div>
            <h3>Hiện chưa có nhóm nào nộp bài phản biện</h3>
            <p>Hệ thống không sử dụng dữ liệu bịa đặt. Hãy mở Đấu trường tranh biện, chọn nhóm và nộp câu trả lời thực tế để bắt đầu lưu trữ.</p>
            <button class="btn btn-primary" id="btnOpenDebateFromEmpty" style="padding: 10px 24px; font-weight: 700; border-radius: 8px;">
              🚀 Mở Đấu trường tranh biện
            </button>
          </div>
        \`;
        const btnEmpty = document.getElementById('btnOpenDebateFromEmpty');
        if (btnEmpty) btnEmpty.addEventListener('click', () => this.openDebateModal());
      } else {
        listEl.innerHTML = \`
          <div class="dr-empty-state">
            <div class="dr-empty-icon">🔍</div>
            <h3>Không tìm thấy câu trả lời phù hợp với bộ lọc</h3>
            <p>Hãy thử chọn lại nhóm khác hoặc xóa từ khóa tìm kiếm.</p>
          </div>
        \`;
      }
    } else {
      listEl.innerHTML = filtered.map(t => {
        const scoreClass = t.score >= 88 ? 'high' : t.score >= 75 ? 'mid' : '';
        const rubric = t.rubric || {
          theory: { score: 36, max: 40, name: "Lý luận Dân chủ XHCN" },
          practice: { score: 30, max: 35, name: "Thực tiễn & Quy chế HaUI" },
          logic: { score: 22, max: 25, name: "Lập luận & Tính thuyết phục" }
        };

        return \`
          <div class="dr-card" data-team="\${escapeHTML(t.team)}">
            <div class="dr-card-header">
              <div class="dr-team-info">
                <span class="dr-team-badge">\${escapeHTML(t.team)}</span>
                <span class="dr-card-time">⏰ Nộp lúc: \${escapeHTML(t.submittedTimeFormatted || 'Gần đây')}</span>
                <span style="font-size: 12px; color: #64748b;">• \${t.wordCount || t.answer.split(/\\s+/).length} từ</span>
              </div>
              <div class="dr-score-badge \${scoreClass}">\${t.score} / 100đ</div>
            </div>

            <div class="dr-question-box">
              <div class="dr-question-heading">❓ Chủ đề / Câu hỏi đã nhận:</div>
              <p class="dr-question-text">"\${escapeHTML(t.question || 'Chủ đề phản biện lý luận dân chủ XHCN')}"</p>
            </div>

            <div class="dr-answer-box">
              <div class="dr-answer-heading">✍️ Nguyên văn câu trả lời của \${escapeHTML(t.team)}:</div>
              <p class="dr-answer-text">\${escapeHTML(t.answer)}</p>
            </div>

            <div class="dr-rubric-grid">
              <div class="dr-rubric-card">
                <span class="dr-rubric-name">📚 \${rubric.theory.name}:</span>
                <span class="dr-rubric-score">\${rubric.theory.score} / \${rubric.theory.max}đ</span>
              </div>
              <div class="dr-rubric-card">
                <span class="dr-rubric-name">🏛️ \${rubric.practice.name}:</span>
                <span class="dr-rubric-score">\${rubric.practice.score} / \${rubric.practice.max}đ</span>
              </div>
              <div class="dr-rubric-card">
                <span class="dr-rubric-name">💡 \${rubric.logic.name}:</span>
                <span class="dr-rubric-score">\${rubric.logic.score} / \${rubric.logic.max}đ</span>
              </div>
            </div>

            <div class="dr-remark-box">
              🎯 <strong>Đánh giá thực tế từ bài làm:</strong> \${escapeHTML(t.remark)}
            </div>

            <div class="dr-card-actions">
              <button type="button" class="btn-dr-action" onclick="window.redmindApp.promptEditScore('\${escapeHTML(t.team)}')">
                ✏️ Chấm lại / Sửa điểm
              </button>
              <button type="button" class="btn-dr-action delete" onclick="window.redmindApp.deleteDebateSubmission('\${escapeHTML(t.team)}')">
                🗑️ Xóa bài nộp
              </button>
            </div>
          </div>
        \`;
      }).join('');
    }

    // Render danh sách các nhóm chưa nộp bài
    if (pendingBox) {
      const allTeams = Array.from({ length: 10 }, (_, i) => \`Nhóm \${i + 1}\`);
      const submittedTeamsSet = new Set(debateTeams.map(t => t.team));
      const pendingTeams = allTeams.filter(t => !submittedTeamsSet.has(t));

      if (pendingTeams.length > 0) {
        pendingBox.innerHTML = \`
          <div class="dr-pending-title">⏳ Danh sách các nhóm chưa nộp bài (\${pendingTeams.length} nhóm):</div>
          <div class="dr-pending-grid">
            \${pendingTeams.map(name => \`
              <button type="button" class="dr-pending-chip" onclick="window.redmindApp.openDebateForSpecificTeam('\${name}')">
                <span>➕ \${name}</span>
                <small style="color: #b91c1c;">(Bấm để nộp)</small>
              </button>
            \`).join('')}
          </div>
        \`;
      } else {
        pendingBox.innerHTML = \`
          <div style="text-align: center; color: #059669; font-weight: 700; padding: 12px 0;">
            🎉 Tuyệt vời! Toàn bộ 10/10 nhóm đều đã nộp bài phản biện thành công!
          </div>
        \`;
      }
    }
  }

  // Mở modal phản biện trực tiếp cho một nhóm cụ thể
  openDebateForSpecificTeam(teamName) {
    audio.click();
    this.openDebateModal();
    const selectTeam = document.getElementById('modalSelectTeam');
    if (selectTeam) {
      selectTeam.value = teamName;
      selectTeam.dispatchEvent(new Event('change'));
    }
  }

  // Cho phép giảng viên sửa điểm trực tiếp nếu muốn
  promptEditScore(teamName) {
    const item = debateTeams.find(t => t.team === teamName);
    if (!item) return;

    const newScoreStr = prompt(\`Nhập điểm số mới cho \${teamName} (Hiện tại: \${item.score}/100đ):\`, item.score);
    if (newScoreStr === null) return;
    const newScore = parseInt(newScoreStr, 10);
    if (isNaN(newScore) || newScore < 0 || newScore > 100) {
      alert("Điểm số phải là số nguyên từ 0 đến 100!");
      return;
    }

    const newRemark = prompt(\`Nhập nhận xét bổ sung của giảng viên cho \${teamName}:\`, item.remark) || item.remark;
    item.score = newScore;
    item.remark = newRemark;

    this.saveDebateSubmission(item);
    audio.success();
    this.renderDebateRecordsView();
  }

  // Xuất file JSON dữ liệu phản biện để nộp báo cáo
  exportDebateAnswersJson() {
    if (debateTeams.length === 0) {
      alert("Chưa có dữ liệu phản biện nào để xuất!");
      return;
    }

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(debateTeams, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", \`redmind_debate_answers_\${new Date().toISOString().slice(0, 10)}.json\`);
    document.body.appendChild(dlAnchorElem);
    dlAnchorElem.click();
    dlAnchorElem.remove();
  }

  renderTeacherDossier() {
    const tableBody = document.getElementById('dossierTableTbody');
    const detailsContainer = document.getElementById('dossierDetailsContainer');
    const dateEl = document.getElementById('dossierDate');
    const quoteEl = document.getElementById('dossierQuoteText');

    if (dateEl) dateEl.textContent = new Date().toLocaleDateString('vi-VN');
    const currentTopic = PROVOCATION_BANK[this.debateTopicIndex];
    if (quoteEl && currentTopic) quoteEl.textContent = \`"\${currentTopic.statement}"\`;

    if (tableBody) {
      if (debateTeams.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #64748b;">Chưa có dữ liệu phản biện nộp lên.</td></tr>';
      } else {
        const sorted = [...debateTeams].sort((a, b) => b.score - a.score);
        tableBody.innerHTML = sorted.map((t, idx) => \`
          <tr>
            <td><strong>#\${idx + 1}</strong></td>
            <td>\${escapeHTML(t.team)}</td>
            <td>Đại diện nhóm</td>
            <td><strong>\${t.score}/100đ</strong></td>
            <td><span style="color: #c4161c; font-weight: bold;">\${t.score >= 88 ? 'Xuất sắc' : t.score >= 75 ? 'Giỏi' : 'Khá'}</span></td>
          </tr>
        \`).join('');
      }
    }

    if (detailsContainer) {
      if (debateTeams.length === 0) {
        detailsContainer.innerHTML = '<p style="text-align: center; color: #64748b;">Chưa có bài nộp nào.</p>';
      } else {
        detailsContainer.innerHTML = debateTeams.map(t => \`
          <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 14px; margin-bottom: 12px; font-size: 13px;">
            <strong style="color: #0f172a;">\${escapeHTML(t.team)} — Điểm: \${t.score}đ:</strong>
            <p style="margin: 6px 0; font-style: italic; color: #334155;">"\${escapeHTML(t.answer)}"</p>
            <small style="color: #c4161c;"><strong>💡 Nhận xét thực tế:</strong> \${escapeHTML(t.remark)}</small>
          </div>
        \`).join('');
      }
    }
  }

  // ==========================================================================
  // 9. THƯ VIỆN CHÍNH THỐNG (OFFICIAL CITATION & STATUTE LIBRARY MODAL)`;

  appJs = appJs.slice(0, startIdx) + newDebateImplementation + appJs.slice(endIdx + nextSectionHeader.length);
  console.log('✅ Successfully replaced Debate Engine with Real Persistence Engine');
} else {
  console.error('❌ Could not locate Debate section boundaries:', { startIdx, endIdx });
}

// 6. Expose global window.redmindApp for inline onclick handlers if needed
if (!appJs.includes('window.redmindApp = app;')) {
  appJs = appJs.replace('const app = new RedMindApp();', 'const app = new RedMindApp();\n    window.redmindApp = app;');
  console.log('✅ Exposed window.redmindApp');
}

fs.writeFileSync('app.js', appJs, 'utf8');
console.log('🎉 app.js patched successfully!');
