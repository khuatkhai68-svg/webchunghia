const fs = require('fs');

let appJs = fs.readFileSync('app.js', 'utf8');

// 1. Update closeModal to clear debateModal timer
const oldCloseModalPres = `    if (modalId === 'presentationModal') {
      if (this.presentTimerInterval) {
        clearInterval(this.presentTimerInterval);
        this.presentTimerInterval = null;
      }
      this.presentTimerSeconds = 900;
      const timerEl = document.getElementById('presentTimer');
      if (timerEl) timerEl.textContent = '15:00';
    }`;

const newCloseModalPres = `    if (modalId === 'presentationModal') {
      if (this.presentTimerInterval) {
        clearInterval(this.presentTimerInterval);
        this.presentTimerInterval = null;
      }
      this.presentTimerSeconds = 900;
      const timerEl = document.getElementById('presentTimer');
      if (timerEl) timerEl.textContent = '15:00';
    }

    if (modalId === 'debateModal') {
      if (this.arenaTimerInterval) {
        clearInterval(this.arenaTimerInterval);
        this.arenaTimerInterval = null;
      }
      this.isArenaRunning = false;
      this.arenaTimerSeconds = 300;
      const timerEl = document.getElementById('modalTimer');
      if (timerEl) timerEl.textContent = '05:00';
    }`;

if (appJs.includes(oldCloseModalPres)) {
  appJs = appJs.replace(oldCloseModalPres, newCloseModalPres);
  console.log('✅ Updated closeModal in app.js');
} else {
  // Normalize line endings for replacement
  const normApp = appJs.replace(/\r\n/g, '\n');
  const normOld = oldCloseModalPres.replace(/\r\n/g, '\n');
  const normNew = newCloseModalPres.replace(/\r\n/g, '\n');
  if (normApp.includes(normOld)) {
    appJs = normApp.replace(normOld, normNew);
    console.log('✅ Updated closeModal in app.js (normalized)');
  } else {
    console.warn('⚠️ Could not find closeModal block directly');
  }
}

// 2. Replace the Debate section
const newDebateSection = `  // ==========================================================================
  // DEBATE ARENA & TEACHER REPORT ENGINE (ACADEMIC MINIMAL)
  // ==========================================================================
  openDebateModal(branchId = null) {
    // 1. Câu hỏi ngẫu nhiên theo chủ đề thuyết trình (không có nút đặt lại)
    this.debateTopicIndex = Math.floor(Math.random() * PROVOCATION_BANK.length);

    // 2. Reset dòng trả lời & trạng thái bảng xếp hạng (chỉ hiện sau khi trả lời xong)
    const argInput = document.getElementById('modalArgumentText');
    if (argInput) argInput.value = '';
    const placeholder = document.getElementById('leaderboardPlaceholder');
    const activeContent = document.getElementById('leaderboardActiveContent');
    if (placeholder) placeholder.classList.remove('hidden');
    if (activeContent) activeContent.classList.add('hidden');

    // 3. Mở modal & render câu hỏi
    this.openModal('debateModal');
    this.renderDebateTopic();

    // 4. Đồng hồ đếm ngược tự động bắt đầu đếm luôn khi vừa mở lên
    if (this.arenaTimerInterval) {
      clearInterval(this.arenaTimerInterval);
      this.arenaTimerInterval = null;
    }
    this.arenaTimerSeconds = 300; // 5 phút
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
  }

  renderDebateTopic() {
    const topic = PROVOCATION_BANK[this.debateTopicIndex] || PROVOCATION_BANK[0];
    if (!topic) return;
    const quoteEl = document.getElementById('modalProvocationText');
    const badgeEl = document.getElementById('modalTopicBadge');

    if (quoteEl) quoteEl.textContent = \`"\${topic.statement}"\`;
    if (badgeEl) badgeEl.textContent = \`Chủ đề: \${topic.title || topic.badge}\`;
  }

  renderArenaRanking(activeTeamName = null) {
    const tbody = document.getElementById('modalRankingTbody');
    if (!tbody) return;

    // Sort descending by score
    debateTeams.sort((a, b) => b.score - a.score);
    debateTeams.forEach((t, i) => t.rank = i + 1);

    tbody.innerHTML = debateTeams.map(t => {
      const isCurrent = activeTeamName && t.team === activeTeamName;
      const rankBadge = t.rank === 1 ? '🥇 #1' : t.rank === 2 ? '🥈 #2' : t.rank === 3 ? '🥉 #3' : \`#\${t.rank}\`;
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
    const currentTopic = PROVOCATION_BANK[this.debateTopicIndex] || PROVOCATION_BANK[0];
    const selectedTeam = document.getElementById('modalSelectTeam')?.value || '';

    // Sample counter-arguments from other class teams based on presentation topic
    const sampleAnswers = [
      {
        team: "Nhóm 1 - Khoa CNTT",
        leader: "Trần Minh Quân",
        score: 94,
        argument: \`Đối với chủ đề: "\${currentTopic.statement.slice(0, 75)}...": Nhóm 1 khẳng định đây là sự ngộ nhận. Căn cứ vào bản chất giai cấp của Dân chủ XHCN và Quy chế 31/NQ-HĐT HaUI, sinh viên chính là chủ thể trung tâm của tự chủ đại học. Việc tham gia phản biện xây dựng và giám sát giảng đường là trách nhiệm công dân của mỗi người học.\`,
        remark: "Lập luận sắc bén, luận chứng vững chắc và viện dẫn xác đáng Quy chế 31/NQ-HĐT của HaUI."
      },
      {
        team: "Nhóm 2 - Khoa Cơ khí",
        leader: "Phạm Quốc Huy",
        score: 89,
        argument: \`Nhóm 2 cho rằng tự do và dân chủ không thể tách rời kỷ cương pháp luật XHCN (Hiến pháp 2013). Sinh viên kỹ thuật thực hành dân chủ trước hết bằng việc tuân thủ quy trình an toàn lao động tại xưởng CNC, đồng thời chủ động đóng góp ý kiến nâng cấp thiết bị qua cổng đào tạo sv.haui.edu.vn.\`,
        remark: "Tư duy thực tế, gắn chặt dân chủ với văn hóa kỷ cương kỹ thuật và trách nhiệm thực hành."
      },
      {
        team: "Nhóm 3 - Khoa Điện",
        leader: "Lê Hoàng Long",
        score: 85,
        argument: \`Nhóm 3 đối chiếu với cơ chế "Dân biết, dân bàn, dân làm, dân kiểm tra, dân giám sát, dân thụ hưởng" theo Văn kiện Đại hội XIII. Thành quả thụ hưởng của sinh viên là hệ thống phòng lab hiện đại; muốn thụ hưởng thực chất thì sinh viên phải tham gia giám sát, phản biện xây dựng.\`,
        remark: "Làm nổi bật vế 'Dân thụ hưởng', dẫn chứng an sinh giáo dục sinh động."
      },
      {
        team: "Nhóm 4 - Khoa Quản lý Kinh doanh",
        leader: "Đỗ Mai Trang",
        score: 82,
        argument: \`Theo góc độ quản trị đại học hiện đại và Luật Thực hiện dân chủ ở cơ sở 2022, trường đại học tự chủ cần trách nhiệm giải trình theo chuẩn SLA minh bạch. Sinh viên cần sử dụng các kênh đối thoại chính danh của Nhà trường thay vì confession ẩn danh thiếu căn cứ.\`,
        remark: "Tiếp cận chuẩn thể chế và trách nhiệm giải trình theo chuẩn quản trị đại học."
      },
      {
        team: "Nhóm 5 - Khoa Công nghệ Ô tô",
        leader: "Vũ Đức Thắng",
        score: 88,
        argument: \`Kỹ sư tương lai phải thấm nhuần tư tưởng Hồ Chí Minh: "Vừa hồng vừa chuyên". Tay nghề kỹ thuật cao mà thiếu ý thức công dân, thiếu tinh thần làm chủ tập thể thì không thể trở thành người lao động mới trong nền dân chủ xã hội chủ nghĩa.\`,
        remark: "Khắc họa chuẩn mực đạo đức kỹ sư 4.0 'vừa hồng vừa chuyên' rất thuyết phục."
      }
    ];

    const otherTeams = sampleAnswers.filter(t => !selectedTeam.includes(t.team.slice(0, 6)));

    listEl.innerHTML = otherTeams.map(t => \`
      <div class="other-team-card">
        <div class="other-team-header">
          <div class="other-team-name">\${escapeHTML(t.team)} <small style="color: #64748b; font-weight: normal;">(NT: \${escapeHTML(t.leader)})</small></div>
          <div class="other-team-score">\${t.score}/100đ</div>
        </div>
        <div class="other-team-arg">
          "\${escapeHTML(t.argument)}"
        </div>
        <div class="other-team-remark">
          💡 <strong>Nhận xét:</strong> \${escapeHTML(t.remark)}
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

    // Nộp bài & Hiển thị Bảng xếp hạng ở bên cạnh
    if (btnSubmit) {
      btnSubmit.addEventListener('click', () => {
        const text = argInput?.value.trim();
        if (!text || text.length < 10) {
          audio.alert();
          alert("Vui lòng nhập câu trả lời / luận điểm phản biện của nhóm (ít nhất 10 ký tự)!");
          if (argInput) argInput.focus();
          return;
        }

        audio.pop();
        btnSubmit.textContent = "⏳ Đang nộp bài & AI chấm điểm...";
        btnSubmit.disabled = true;

        setTimeout(() => {
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

          const selectedTeamName = selectTeam ? selectTeam.value : "Nhóm Dự thi";

          // Chấm điểm dựa trên tính phong phú của luận cứ
          const hasHaui = /haui|công nghiệp|quy chế 31|sv\\.haui|phòng máy|lab|xưởng/i.test(text);
          const hasLaw = /hiến pháp|luật|nghị quyết|dân chủ|pháp quyền|kỷ cương|an ninh mạng|tố cáo/i.test(text);
          const hasTheory = /giai cấp|công nhân|tư sản|công hữu|mác - lênin|bản chất|thụ hưởng|bình đẳng/i.test(text);
          const hasBreakthrough = /bẻ gãy|ngụy biện|sai lầm|ngộ nhận|thực chất|giải trình|chủ thể/i.test(text);

          let score = 86;
          if (hasTheory) score += 4;
          if (hasLaw) score += 3;
          if (hasHaui) score += 3;
          if (hasBreakthrough) score += 2;
          score = Math.min(98, score + Math.floor(Math.random() * 2));

          let remark = "Lập luận sắc bén, luận cứ rõ ràng và phản biện rất thuyết phục bám sát chủ đề!";
          if (hasHaui && hasLaw) {
            remark = "Viện dẫn xuất sắc Quy chế 31/NQ-HĐT của HaUI và Hiến pháp 2013; phản bác rất đanh thép!";
          } else if (hasTheory) {
            remark = "Làm nổi bật bản chất giai cấp của nền Dân chủ XHCN; phê phán trúng tim đen luận điểm ngụy biện!";
          }

          const teamEntry = {
            rank: 1,
            team: selectedTeamName,
            leader: "Đại diện nhóm",
            score: score,
            argument: text,
            remark: remark
          };

          // Cập nhật đội thi vào danh sách
          const existingIdx = debateTeams.findIndex(t => t.team === selectedTeamName);
          if (existingIdx >= 0) {
            debateTeams[existingIdx] = teamEntry;
          } else {
            debateTeams.unshift(teamEntry);
          }

          // Cập nhật thẻ kết quả
          const verdictTeam = document.getElementById('verdictTeamName');
          const verdictScore = document.getElementById('verdictTotal');
          const verdictComment = document.getElementById('vAiComment');
          if (verdictTeam) verdictTeam.textContent = teamEntry.team;
          if (verdictScore) verdictScore.textContent = \`\${teamEntry.score}/100đ\`;
          if (verdictComment) verdictComment.textContent = teamEntry.remark;

          // Cập nhật bảng xếp hạng
          this.renderArenaRanking(selectedTeamName);

          // Hiện bảng xếp hạng bên cạnh, ẩn trạng thái chờ
          const placeholder = document.getElementById('leaderboardPlaceholder');
          const activeContent = document.getElementById('leaderboardActiveContent');
          if (placeholder) placeholder.classList.add('hidden');
          if (activeContent) activeContent.classList.remove('hidden');
        }, 700);
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

  renderTeacherDossier() {
    // Retained for academic dossier compatibility
    const tableBody = document.getElementById('dossierTableTbody');
    const detailsContainer = document.getElementById('dossierDetailsContainer');
    const dateEl = document.getElementById('dossierDate');
    const quoteEl = document.getElementById('dossierQuoteText');

    if (dateEl) dateEl.textContent = new Date().toLocaleDateString('vi-VN');
    const currentTopic = PROVOCATION_BANK[this.debateTopicIndex];
    if (quoteEl && currentTopic) quoteEl.textContent = \`"\${currentTopic.statement}"\`;

    if (tableBody) {
      tableBody.innerHTML = debateTeams.map(t => \`
        <tr>
          <td><strong>#\${t.rank}</strong></td>
          <td>\${escapeHTML(t.team)}</td>
          <td>\${escapeHTML(t.leader)}</td>
          <td><strong>\${t.score}/100đ</strong></td>
          <td><span style="color: #c4161c; font-weight: bold;">\${escapeHTML(t.type || 'Xuất sắc')}</span></td>
        </tr>
      \`).join('');
    }

    if (detailsContainer) {
      detailsContainer.innerHTML = debateTeams.map(t => \`
        <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 14px; margin-bottom: 12px; font-size: 13px;">
          <strong style="color: #0f172a;">\${escapeHTML(t.team)} (\${escapeHTML(t.leader)}) — Điểm: \${t.score}đ:</strong>
          <p style="margin: 6px 0; font-style: italic; color: #334155;">"\${escapeHTML(t.argument)}"\</p>
          <small style="color: #c4161c;"><strong>💡 Nhận xét mô phỏng:</strong> \${escapeHTML(t.remark)}</small>
        </div>
      \`).join('');
    }
  }
`;

const debateRegex = /\/\/ =+[\r\n\s]+\/\/ DEBATE ARENA & TEACHER REPORT ENGINE[\s\S]*?(?=\/\/ =+[\r\n\s]+\/\/ LIBRARY MODAL)/;

if (debateRegex.test(appJs)) {
  appJs = appJs.replace(debateRegex, newDebateSection + '\n  ');
  fs.writeFileSync('app.js', appJs, 'utf8');
  console.log('✅ Successfully replaced Debate Arena engine in app.js!');
} else {
  console.error('❌ Could not match debateRegex in app.js');
}
