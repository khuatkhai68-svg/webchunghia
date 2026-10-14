const fs = require('fs');

let appJs = fs.readFileSync('app.js', 'utf8');

// Build the new presentation, projector game, and content editor methods
const newEngineCode = `
  // ==========================================================================
  // PRESENTATION ENGINE & PROJECTOR STAGE (16:9 LECTURE HALL)
  // ==========================================================================
  openPresentationModal(slideIndex = 0) {
    audio.success();
    this.currentSlideIndex = slideIndex;
    this.renderSlide(slideIndex);
    this.openModal('presentationModal');
    this.startPresentTimer();
  }

  openSlideForBranch(branchId) {
    const slideIdx = (branchId >= 1 && branchId <= 6) ? branchId : 0;
    this.openPresentationModal(slideIdx);
  }

  renderSlide(index) {
    if (index < 0) index = 0;
    if (index >= SLIDES.length) index = SLIDES.length - 1;
    this.currentSlideIndex = index;
    const slide = SLIDES[index];
    if (!slide) return;

    const titleEl = document.getElementById('slideTitle');
    const badgeEl = document.getElementById('slideBadge');
    const screenEl = document.getElementById('slideScreen');
    const indicatorEl = document.getElementById('slideIndicator');
    const notesBody = document.getElementById('notesBody');
    const scrimEl = document.getElementById('presentStageScrim');
    const progressBar = document.getElementById('presentProgressBar');

    if (titleEl) titleEl.textContent = slide.title;
    if (badgeEl && slide.badge) badgeEl.textContent = slide.badge;
    if (screenEl) screenEl.innerHTML = slide.html;
    if (indicatorEl) {
      indicatorEl.textContent = \`\${String(index + 1).padStart(2, '0')} / \${String(SLIDES.length).padStart(2, '0')}\`;
    }
    if (notesBody) notesBody.textContent = slide.notes || '';

    // Update Projector Dynamic Background
    if (scrimEl) {
      const bg = slide.bgImage || 'assets/bg-intro.jpg';
      scrimEl.style.backgroundImage = \`url('\${bg}')\`;
    }

    // Update Bottom Progress Bar
    if (progressBar) {
      const pct = ((index + 1) / SLIDES.length) * 100;
      progressBar.style.width = \`\${pct}%\`;
    }

    // If on Slide 5 (Interactive Game Scene), bind the interactive stage game
    if (index === 5) {
      this.renderStageGame();
    }

    // Also highlight corresponding card on the mindmap
    if (index >= 1 && index <= 6) {
      document.querySelectorAll('.branch-card').forEach(c => c.classList.remove('active-selected'));
      const activeCard = document.querySelector(\`#branch\${index} .branch-card\`);
      if (activeCard) activeCard.classList.add('active-selected');

      document.querySelectorAll('.branch-connector').forEach(p => p.classList.remove('active'));
      document.querySelectorAll('.connector-dot').forEach(d => d.classList.remove('active'));
      const activePath = document.getElementById(\`path\${index}\`);
      const activeDot = document.getElementById(\`dot\${index}\`);
      if (activePath) activePath.classList.add('active');
      if (activeDot) activeDot.classList.add('active');
    }
  }

  // ==========================================================================
  // PROJECTOR STAGE INTERACTIVE GAME ENGINE ("BẠN SẼ LÀM GÌ?")
  // ==========================================================================
  renderStageGame(scenarioIdx = 0) {
    if (!SCENARIOS || SCENARIOS.length === 0) return;
    if (scenarioIdx < 0) scenarioIdx = 0;
    if (scenarioIdx >= SCENARIOS.length) scenarioIdx = 0;
    this.stageGameIndex = scenarioIdx;
    this.stageGameSelected = null;

    const cur = SCENARIOS[scenarioIdx];
    const tagEl = document.getElementById('stageGameTag');
    const qEl = document.getElementById('stageGameQuestion');
    const gridEl = document.getElementById('stageGameOptionsGrid');
    const resultBox = document.getElementById('stageGameResultBox');
    const clockEl = document.getElementById('stageGameClock');

    if (tagEl) tagEl.textContent = cur.tag || \`TÌNH HUỐNG \${scenarioIdx + 1} / \${SCENARIOS.length}\`;
    if (qEl) qEl.textContent = cur.question;
    if (resultBox) resultBox.classList.add('hidden');

    // Reset countdown clock to 60s
    this.stageGameTimerSeconds = 60;
    if (clockEl) clockEl.textContent = '60s';
    if (this.stageGameInterval) clearInterval(this.stageGameInterval);

    this.stageGameInterval = setInterval(() => {
      if (this.stageGameTimerSeconds > 0) {
        this.stageGameTimerSeconds--;
        if (clockEl) clockEl.textContent = \`\${this.stageGameTimerSeconds}s\`;
      } else {
        clearInterval(this.stageGameInterval);
      }
    }, 1000);

    // Render 4 Options
    if (gridEl) {
      gridEl.innerHTML = cur.options.map(opt => \`
        <div class="proj-game-option-btn" data-key="\${opt.key}">
          <div class="proj-game-opt-letter">\${opt.key}</div>
          <div class="proj-game-opt-text">\${opt.text}</div>
        </div>
      \`).join('');

      // Add click listeners to option buttons
      gridEl.querySelectorAll('.proj-game-option-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          audio.pop();
          gridEl.querySelectorAll('.proj-game-option-btn').forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
          this.stageGameSelected = btn.getAttribute('data-key');
        });
      });
    }

    // Bind Stage Submit Button
    const btnSubmit = document.getElementById('btnStageSubmitAnswer');
    if (btnSubmit) {
      btnSubmit.onclick = () => {
        audio.click();
        if (!this.stageGameSelected) {
          this.showToast('Vui lòng chọn một phương án (A, B, C hoặc D) trước khi xác nhận!', 'warning');
          return;
        }

        if (this.stageGameInterval) clearInterval(this.stageGameInterval);

        const chosenOpt = cur.options.find(o => o.key === this.stageGameSelected);
        const isCorrect = this.stageGameSelected === cur.correctOpt;

        // Reveal styling on options
        gridEl.querySelectorAll('.proj-game-option-btn').forEach(b => {
          const k = b.getAttribute('data-key');
          if (k === cur.correctOpt) {
            b.classList.add('correct-reveal');
          } else if (k === this.stageGameSelected && !isCorrect) {
            b.classList.add('incorrect-reveal');
          }
        });

        // Show result box
        const badgeEl = document.getElementById('stageResultBadge');
        const anaEl = document.getElementById('stageResultAnalysis');
        const theoEl = document.getElementById('stageResultTheory');

        if (resultBox) {
          resultBox.classList.remove('hidden', 'correct', 'incorrect');
          resultBox.classList.add(isCorrect ? 'correct' : 'incorrect');
        }

        if (badgeEl) {
          badgeEl.textContent = chosenOpt ? chosenOpt.badge : (isCorrect ? 'Lựa chọn chuẩn mực' : 'Chưa chuẩn mực');
        }
        if (anaEl && chosenOpt) anaEl.textContent = chosenOpt.analysis;
        if (theoEl && chosenOpt) theoEl.innerHTML = \`<strong>⚖️ Liên hệ bản chất Dân chủ XHCN:</strong> \${chosenOpt.theory}\`;

        if (isCorrect) {
          try {
            if (typeof confetti === 'function') confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
          } catch (e) {}
        }
      };
    }

    // Bind Next Scenario Button
    const btnNext = document.getElementById('btnStageNextScenario');
    if (btnNext) {
      btnNext.onclick = () => {
        audio.pop();
        const nextIdx = (this.stageGameIndex + 1) % SCENARIOS.length;
        this.renderStageGame(nextIdx);
      };
    }
  }

  // ==========================================================================
  // BIND PRESENTATION STAGE CONTROLS & HOTKEYS
  // ==========================================================================
  bindPresentation() {
    const btnNext = document.getElementById('btnNextSlide');
    const btnPrev = document.getElementById('btnPrevSlide');
    const btnClosePres = document.getElementById('btnClosePresentation');
    const btnFullscreen = document.getElementById('btnToggleFullscreen');

    if (btnClosePres) {
      btnClosePres.addEventListener('click', () => {
        audio.click();
        this.closeModal('presentationModal');
        if (this.stageGameInterval) clearInterval(this.stageGameInterval);
      });
    }

    if (btnFullscreen) {
      btnFullscreen.addEventListener('click', () => {
        audio.click();
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
        } else {
          document.exitFullscreen().catch(() => {});
        }
      });
    }

    if (btnNext) {
      btnNext.addEventListener('click', () => {
        if (this.currentSlideIndex < SLIDES.length - 1) {
          audio.pop();
          this.renderSlide(this.currentSlideIndex + 1);
        }
      });
    }

    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        if (this.currentSlideIndex > 0) {
          audio.pop();
          this.renderSlide(this.currentSlideIndex - 1);
        }
      });
    }

    // Global Projector Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      const presModal = document.getElementById('presentationModal');
      const isPresOpen = presModal && !presModal.classList.contains('hidden');

      if (isPresOpen) {
        if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
          e.preventDefault();
          btnNext?.click();
        } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
          e.preventDefault();
          btnPrev?.click();
        } else if (e.key === 'Escape') {
          this.closeModal('presentationModal');
        }
      } else {
        // Hotkey 'P' to quickly start presentation from anywhere
        if ((e.key === 'p' || e.key === 'P') && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
          e.preventDefault();
          this.openPresentationModal(0);
        }
        // Hotkey 'Ctrl + Shift + E' to open Content Editor
        if (e.ctrlKey && e.shiftKey && (e.key === 'e' || e.key === 'E')) {
          e.preventDefault();
          this.openContentEditor();
        }
      }
    });

    // Content Editor Nav Button
    const btnNavEditor = document.getElementById('btnNavEditor');
    if (btnNavEditor) {
      btnNavEditor.addEventListener('click', () => {
        audio.click();
        this.openContentEditor();
      });
    }

    const btnCloseEditor = document.getElementById('btnCloseContentEditor');
    if (btnCloseEditor) {
      btnCloseEditor.addEventListener('click', () => {
        audio.click();
        this.closeModal('contentEditorModal');
      });
    }
  }

  // ==========================================================================
  // CONTENT EDITOR CONTROLLER (ADMIN / PRESENTER DECK EDITOR)
  // ==========================================================================
  openContentEditor() {
    this.openModal('contentEditorModal');
    this.initContentEditorUI();
  }

  initContentEditorUI() {
    const editorBody = document.getElementById('editorBody');
    const tabSlides = document.getElementById('tabEditSlides');
    const tabScenarios = document.getElementById('tabEditScenarios');
    const tabRawJson = document.getElementById('tabEditRawJson');
    const btnSave = document.getElementById('btnEditorSave');
    const btnReset = document.getElementById('btnEditorResetDefaults');
    const btnExport = document.getElementById('btnEditorExportJson');
    const btnPreview = document.getElementById('btnEditorPreview');

    let currentTab = 'slides';

    const renderTab = () => {
      tabSlides?.classList.toggle('active', currentTab === 'slides');
      tabScenarios?.classList.toggle('active', currentTab === 'scenarios');
      tabRawJson?.classList.toggle('active', currentTab === 'rawjson');

      if (currentTab === 'slides') {
        editorBody.innerHTML = \`
          <div class="editor-form-group">
            <label class="editor-label">Chọn Cảnh Trình Chiếu Để Chỉnh Sửa:</label>
            <select class="editor-select" id="editorSelectSlide">
              \${SLIDES.map((s, idx) => \`<option value="\${idx}">Cảnh \${idx + 1}: \${s.title}</option>\`).join('')}
            </select>
          </div>
          <div class="editor-form-group">
            <label class="editor-label">Tiêu Đề Cảnh:</label>
            <input type="text" class="editor-input" id="editorSlideTitle" value="\${SLIDES[0].title}">
          </div>
          <div class="editor-form-group">
            <label class="editor-label">Huy Hiệu / Chủ Đề (Badge):</label>
            <input type="text" class="editor-input" id="editorSlideBadge" value="\${SLIDES[0].badge}">
          </div>
          <div class="editor-form-group">
            <label class="editor-label">Đường Dẫn Hình Nền Tư Liệu (Background Image):</label>
            <input type="text" class="editor-input" id="editorSlideBg" value="\${SLIDES[0].bgImage || 'assets/bg-intro.jpg'}">
          </div>
          <div class="editor-form-group">
            <label class="editor-label">Ghi Chú Cho Diễn Giả (Speaker Notes):</label>
            <textarea class="editor-textarea" id="editorSlideNotes">\${SLIDES[0].notes || ''}</textarea>
          </div>
          <div class="editor-form-group">
            <label class="editor-label">Mã HTML Nội Dung Slide (Đảm bảo cấu trúc .proj-* để scale trên máy chiếu):</label>
            <textarea class="editor-textarea" style="min-height: 220px; font-family: monospace;" id="editorSlideHtml">\${SLIDES[0].html.trim()}</textarea>
          </div>
        \`;

        const selectEl = document.getElementById('editorSelectSlide');
        selectEl.onchange = (e) => {
          const idx = parseInt(e.target.value, 10);
          const s = SLIDES[idx];
          if (s) {
            document.getElementById('editorSlideTitle').value = s.title;
            document.getElementById('editorSlideBadge').value = s.badge;
            document.getElementById('editorSlideBg').value = s.bgImage || 'assets/bg-intro.jpg';
            document.getElementById('editorSlideNotes').value = s.notes || '';
            document.getElementById('editorSlideHtml').value = s.html.trim();
          }
        };
      } else if (currentTab === 'scenarios') {
        editorBody.innerHTML = \`
          <div class="editor-form-group">
            <label class="editor-label">Chọn Tình Huống Trò Chơi Để Chỉnh Sửa:</label>
            <select class="editor-select" id="editorSelectScenario">
              \${SCENARIOS.map((sc, idx) => \`<option value="\${idx}">\${sc.tag}: \${sc.question.substring(0, 50)}...</option>\`).join('')}
            </select>
          </div>
          <div class="editor-form-group">
            <label class="editor-label">Thẻ Phân Loại (Tag):</label>
            <input type="text" class="editor-input" id="editorScenarioTag" value="\${SCENARIOS[0].tag}">
          </div>
          <div class="editor-form-group">
            <label class="editor-label">Câu Hỏi Tình Huống Giảng Đường:</label>
            <textarea class="editor-textarea" id="editorScenarioQuestion">\${SCENARIOS[0].question}</textarea>
          </div>
          <div class="editor-form-group">
            <label class="editor-label">Đáp Án Chuẩn Mực (A, B, C hoặc D):</label>
            <input type="text" class="editor-input" style="max-width: 100px;" id="editorScenarioCorrect" value="\${SCENARIOS[0].correctOpt}">
          </div>
          <div style="border-top: 1px solid #344155; padding-top: 14px; margin-top: 14px;">
            <label class="editor-label">Nội Dung 4 Phương Án & Giải Thích (JSON Format):</label>
            <textarea class="editor-textarea" style="min-height: 220px; font-family: monospace;" id="editorScenarioOptionsJson">\${JSON.stringify(SCENARIOS[0].options, null, 2)}</textarea>
          </div>
        \`;

        const selectSc = document.getElementById('editorSelectScenario');
        selectSc.onchange = (e) => {
          const idx = parseInt(e.target.value, 10);
          const sc = SCENARIOS[idx];
          if (sc) {
            document.getElementById('editorScenarioTag').value = sc.tag;
            document.getElementById('editorScenarioQuestion').value = sc.question;
            document.getElementById('editorScenarioCorrect').value = sc.correctOpt;
            document.getElementById('editorScenarioOptionsJson').value = JSON.stringify(sc.options, null, 2);
          }
        };
      } else if (currentTab === 'rawjson') {
        const fullBackup = { slides: SLIDES, scenarios: SCENARIOS };
        editorBody.innerHTML = \`
          <p style="color: #cbd5e1; font-size: 14px; margin-top: 0;">
            Dán hoặc sao chép toàn bộ cấu trúc dữ liệu JSON bên dưới để đồng bộ dữ liệu giữa các máy tính trình chiếu:
          </p>
          <textarea class="editor-textarea" style="min-height: 380px; font-family: monospace; font-size: 13px;" id="editorRawJsonArea">\${JSON.stringify(fullBackup, null, 2)}</textarea>
        \`;
      }
    };

    tabSlides.onclick = () => { currentTab = 'slides'; renderTab(); };
    tabScenarios.onclick = () => { currentTab = 'scenarios'; renderTab(); };
    tabRawJson.onclick = () => { currentTab = 'rawjson'; renderTab(); };

    // Save Action
    btnSave.onclick = () => {
      audio.success();
      try {
        if (currentTab === 'slides') {
          const idx = parseInt(document.getElementById('editorSelectSlide').value, 10);
          SLIDES[idx].title = document.getElementById('editorSlideTitle').value;
          SLIDES[idx].badge = document.getElementById('editorSlideBadge').value;
          SLIDES[idx].bgImage = document.getElementById('editorSlideBg').value;
          SLIDES[idx].notes = document.getElementById('editorSlideNotes').value;
          SLIDES[idx].html = document.getElementById('editorSlideHtml').value;
          localStorage.setItem('REDMIND_CUSTOM_SLIDES_V2', JSON.stringify(SLIDES));
        } else if (currentTab === 'scenarios') {
          const idx = parseInt(document.getElementById('editorSelectScenario').value, 10);
          SCENARIOS[idx].tag = document.getElementById('editorScenarioTag').value;
          SCENARIOS[idx].question = document.getElementById('editorScenarioQuestion').value;
          SCENARIOS[idx].correctOpt = document.getElementById('editorScenarioCorrect').value.toUpperCase().trim();
          SCENARIOS[idx].options = JSON.parse(document.getElementById('editorScenarioOptionsJson').value);
          localStorage.setItem('REDMIND_CUSTOM_SCENARIOS_V2', JSON.stringify(SCENARIOS));
        } else if (currentTab === 'rawjson') {
          const parsed = JSON.parse(document.getElementById('editorRawJsonArea').value);
          if (parsed.slides) {
            SLIDES = parsed.slides;
            localStorage.setItem('REDMIND_CUSTOM_SLIDES_V2', JSON.stringify(SLIDES));
          }
          if (parsed.scenarios) {
            SCENARIOS = parsed.scenarios;
            localStorage.setItem('REDMIND_CUSTOM_SCENARIOS_V2', JSON.stringify(SCENARIOS));
          }
        }
        this.showToast('Đã lưu thành công và cập nhật nội dung bài thuyết trình!', 'success');
      } catch (err) {
        alert('Lỗi định dạng dữ liệu: ' + err.message);
      }
    };

    // Reset Defaults Action
    btnReset.onclick = () => {
      if (confirm('Bạn có chắc chắn muốn khôi phục toàn bộ nội dung về chuẩn học thuật mặc định?')) {
        audio.click();
        localStorage.removeItem('REDMIND_CUSTOM_SLIDES_V2');
        localStorage.removeItem('REDMIND_CUSTOM_SCENARIOS_V2');
        SLIDES = JSON.parse(JSON.stringify(DEFAULT_SLIDES));
        SCENARIOS = JSON.parse(JSON.stringify(DEFAULT_SCENARIOS));
        renderTab();
        this.showToast('Đã khôi phục dữ liệu gốc thành công!', 'info');
      }
    };

    // Export Action
    btnExport.onclick = () => {
      const data = { slides: SLIDES, scenarios: SCENARIOS };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'REDMIND_NOI_DUNG_THUYET_TRINH.json';
      a.click();
      URL.revokeObjectURL(url);
    };

    // Preview Action
    btnPreview.onclick = () => {
      audio.pop();
      this.closeModal('contentEditorModal');
      const idx = currentTab === 'slides' ? parseInt(document.getElementById('editorSelectSlide').value, 10) : 0;
      this.openPresentationModal(idx);
    };

    // Initial render
    renderTab();
  }
`;

// Replace lines from 'openPresentationModal' down to 'bindPresentation' in app.js
const targetPattern = /openPresentationModal\(slideIndex = 0\) \{[\s\S]*?startPresentTimer\(\) \{/;

if (!targetPattern.test(appJs)) {
  console.error('Target pattern for presentation engine not found in app.js');
  process.exit(1);
}

appJs = appJs.replace(targetPattern, newEngineCode + '\\n  startPresentTimer() {');

// Also hook up #btnNavLibrary in bindHeaderButtons
if (!appJs.includes('btnNavLibrary')) {
  appJs = appJs.replace('const btnGuide = document.getElementById(\'btnNavGuide\');', 
    `const btnGuide = document.getElementById('btnNavGuide');
    const btnNavLib = document.getElementById('btnNavLibrary');
    if (btnNavLib) {
      btnNavLib.addEventListener('click', () => {
        audio.click();
        this.openLibraryModal();
      });
    }`);
}

fs.writeFileSync('app.js', appJs, 'utf8');
console.log('Successfully patched presentation engine, projector game, and content editor in app.js!');
