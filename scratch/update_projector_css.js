const fs = require('fs');

let css = fs.readFileSync('style.css', 'utf8');

// 1. Update :root variables for Documentary Academic Palette
const rootDocAcademic = `  /* ==========================================================================
     DOCUMENTARY ACADEMIC THEME (HaUI Presentation Projector)
     Palette: #A71930 (Đỏ trầm) | #181C23 (Đen than) | #F6F3ED (Trắng ấm)
              #D7AE65 (Vàng nhẹ) | #344155 (Xanh xám)
     ========================================================================== */
  --primary-red: #A71930;
  --primary-red-dark: #871325;
  --primary-red-hover: #871325;
  --primary-red-active: #6E0E1D;
  --primary-red-light: #FDF2F4;
  --primary-red-border: #F8C2C9;

  --stage-dark: #181C23;
  --stage-dark-card: #222731;
  --stage-dark-border: #344155;
  --warm-white: #F6F3ED;
  --gold-light: #D7AE65;
  --gold-border: rgba(215, 174, 101, 0.4);
  --slate-blue: #344155;
  --slate-blue-light: #475569;
`;

// Replace root section
css = css.replace(/\/\* ==========================================================================\s+RED MIND 2\.0: Academic · Interactive · Minimal[\s\S]*?--primary-red-border: #FECACA;/, rootDocAcademic);

// 2. Append the comprehensive Projector Stage, Documentary Aesthetics, Game and Editor styles
const additionalStyles = `
/* ==========================================================================
   DOCUMENTARY ACADEMIC - PROJECTOR STAGE & AUDIENCE OPTIMIZATIONS
   ========================================================================== */

/* Fullscreen Presentation Stage (Replacing small modal) */
#presentationModal {
  position: fixed !important;
  inset: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  max-width: 100vw !important;
  max-height: 100vh !important;
  margin: 0 !important;
  padding: 0 !important;
  border-radius: 0 !important;
  background-color: var(--stage-dark) !important;
  z-index: 99999 !important;
  overflow: hidden !important;
  display: flex !important;
  flex-direction: column !important;
}

#presentationModal.hidden {
  display: none !important;
}

.presentation-stage-scrim {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  filter: brightness(0.38) saturate(0.9);
  transform: scale(1.02);
  transition: all 0.5s ease-out;
  z-index: 1;
}

.presentation-stage-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, rgba(24, 28, 35, 0.6) 0%, rgba(24, 28, 35, 0.94) 85%),
              linear-gradient(180deg, rgba(24, 28, 35, 0.85) 0%, rgba(24, 28, 35, 0.5) 50%, rgba(24, 28, 35, 0.95) 100%);
  z-index: 2;
  pointer-events: none;
}

.presentation-container {
  position: relative !important;
  z-index: 3 !important;
  width: 100% !important;
  height: 100% !important;
  max-width: 100% !important;
  background: transparent !important;
  box-shadow: none !important;
  border-radius: 0 !important;
  display: flex !important;
  flex-direction: column !important;
  padding: 0 !important;
  overflow: hidden !important;
}

/* Minimalist Floating Top Control Bar (Subtle & clean) */
.present-stage-header {
  height: 60px;
  min-height: 60px;
  padding: 0 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(24, 28, 35, 0.45);
  backdrop-filter: blur(10px);
  z-index: 10;
  transition: opacity 0.3s ease;
}

.present-stage-brand {
  display: flex;
  align-items: center;
  gap: 14px;
}

.present-stage-badge {
  background: var(--primary-red);
  color: #ffffff;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.8px;
  padding: 4px 12px;
  border-radius: 4px;
  text-transform: uppercase;
}

.present-stage-topic {
  color: rgba(246, 243, 237, 0.8);
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.4px;
}

.present-stage-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.present-scene-counter {
  font-family: var(--font-brand);
  font-size: 16px;
  font-weight: 800;
  color: var(--gold-light);
  letter-spacing: 1px;
}

.btn-stage-icon {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: var(--warm-white);
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-stage-icon:hover {
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  border-color: var(--gold-light);
}

.btn-stage-close {
  background: rgba(167, 25, 48, 0.25);
  border-color: var(--primary-red);
  color: #ffffff;
}

.btn-stage-close:hover {
  background: var(--primary-red);
}

/* Center Stage Canvas - 16:9 Projector Safe Area */
.presentation-stage-viewport {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 24px 70px;
  box-sizing: border-box;
}

.slide-screen {
  width: 100% !important;
  height: 100% !important;
  max-width: 1720px !important;
  max-height: 940px !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: center !important;
  padding: 0 !important;
  margin: 0 auto !important;
  overflow: hidden !important; /* NO SCROLLBAR */
  box-sizing: border-box !important;
}

/* Prev/Next Projector Floating Chevron Navigation */
.stage-nav-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 20;
  width: 54px;
  height: 90px;
  background: rgba(24, 28, 35, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--warm-white);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0.35;
  transition: all 0.25s ease;
}

.stage-nav-arrow:hover {
  opacity: 1;
  background: rgba(167, 25, 48, 0.7);
  border-color: var(--gold-light);
  color: #ffffff;
}

.stage-nav-prev { left: 16px; }
.stage-nav-next { right: 16px; }

/* Subtle Bottom Progress Bar */
.present-stage-progress-track {
  height: 4px;
  width: 100%;
  background: rgba(255, 255, 255, 0.08);
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 30;
}

.present-stage-progress-bar {
  height: 100%;
  width: 14%;
  background: linear-gradient(90deg, var(--primary-red) 0%, var(--gold-light) 100%);
  transition: width 0.35s ease;
}

.present-stage-hint {
  position: absolute;
  bottom: 12px;
  right: 28px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 0.5px;
  z-index: 25;
  pointer-events: none;
}

/* ==========================================================================
   PROJECTOR TYPOGRAPHY SCALING (16:9 Lecture Hall Standards)
   ========================================================================== */
.proj-hero-header {
  text-align: center;
  margin-bottom: 24px;
}

.proj-badge-flag {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: rgba(167, 25, 48, 0.28);
  border: 1.5px solid var(--primary-red);
  padding: 8px 24px;
  border-radius: 999px;
  margin-bottom: 18px;
}

.proj-badge-text {
  font-size: clamp(14px, 1.4vw, 20px);
  font-weight: 800;
  color: #fca5a5;
  letter-spacing: 1px;
}

.proj-title-hero {
  font-size: clamp(38px, 4.2vw, 76px) !important;
  font-weight: 900 !important;
  color: var(--warm-white) !important;
  text-transform: uppercase !important;
  line-height: 1.15 !important;
  letter-spacing: -0.5px !important;
  margin: 0 0 16px 0 !important;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.7);
}

.proj-subtitle-hero {
  font-size: clamp(20px, 2.2vw, 36px) !important;
  font-weight: 700 !important;
  color: var(--gold-light) !important;
  line-height: 1.3 !important;
  margin: 0 0 24px 0 !important;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

.proj-scene-header {
  margin-bottom: 22px;
}

.proj-scene-title {
  font-size: clamp(26px, 2.6vw, 48px) !important;
  font-weight: 900 !important;
  color: var(--warm-white) !important;
  line-height: 1.2 !important;
  margin: 0 0 10px 0 !important;
  letter-spacing: -0.3px !important;
}

.proj-question-banner {
  background: rgba(167, 25, 48, 0.22);
  border: 1.5px solid rgba(167, 25, 48, 0.7);
  border-left: 6px solid var(--primary-red);
  border-radius: 10px;
  padding: 14px 24px;
  margin-bottom: 22px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.proj-question-text {
  font-size: clamp(22px, 2.3vw, 40px);
  font-weight: 800;
  color: var(--gold-light);
  line-height: 1.28;
  margin: 0;
}

/* 3-Column Balanced Slide Cards */
.proj-cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 24px;
}

.proj-card-item {
  background: rgba(24, 28, 35, 0.78);
  border: 1.5px solid var(--slate-blue);
  border-radius: 16px;
  padding: 26px 24px;
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.proj-card-item:hover {
  border-color: var(--gold-light);
  transform: translateY(-3px);
  background: rgba(34, 39, 49, 0.9);
}

.proj-card-icon {
  font-size: clamp(30px, 3vw, 48px);
  margin-bottom: 12px;
  display: block;
}

.proj-card-title {
  font-size: clamp(20px, 2vw, 32px) !important;
  font-weight: 800 !important;
  color: var(--warm-white) !important;
  margin: 0 0 12px 0 !important;
}

.proj-point-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.proj-point-item {
  font-size: clamp(16px, 1.6vw, 26px);
  color: #e2e8f0;
  line-height: 1.55;
  margin-bottom: 10px;
  position: relative;
  padding-left: 20px;
}

.proj-point-item::before {
  content: "•";
  color: var(--gold-light);
  font-size: 1.3em;
  position: absolute;
  left: 0;
  top: -2px;
}

.proj-citation-tag {
  font-size: clamp(13px, 1.2vw, 20px);
  color: #94a3b8;
  font-style: italic;
  display: block;
  margin-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-top: 8px;
}

/* ==========================================================================
   INTERACTIVE PROJECTOR GAME: BẠN SẼ LÀM GÌ?
   ========================================================================== */
.proj-game-container {
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
}

.proj-game-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.proj-game-scenario-badge {
  background: rgba(215, 174, 101, 0.2);
  border: 1px solid var(--gold-light);
  color: var(--gold-light);
  font-size: clamp(14px, 1.3vw, 20px);
  font-weight: 800;
  padding: 6px 18px;
  border-radius: 999px;
  letter-spacing: 0.5px;
}

.proj-game-timer-pill {
  background: rgba(167, 25, 48, 0.3);
  border: 1.5px solid var(--primary-red);
  color: #ffffff;
  font-size: clamp(16px, 1.6vw, 24px);
  font-weight: 800;
  font-family: monospace;
  padding: 6px 20px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.proj-game-question-box {
  background: rgba(24, 28, 35, 0.88);
  border: 2px solid var(--slate-blue);
  border-left: 8px solid var(--gold-light);
  border-radius: 14px;
  padding: 22px 30px;
  margin-bottom: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.proj-game-question-text {
  font-size: clamp(24px, 2.5vw, 42px);
  font-weight: 800;
  color: var(--warm-white);
  line-height: 1.32;
  margin: 0;
}

.proj-game-options-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}

.proj-game-option-btn {
  background: rgba(34, 39, 49, 0.85);
  border: 2px solid var(--slate-blue);
  border-radius: 14px;
  padding: 18px 22px;
  display: flex;
  align-items: center;
  gap: 18px;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #e2e8f0;
}

.proj-game-option-btn:hover {
  border-color: var(--gold-light);
  background: rgba(45, 52, 65, 0.95);
  transform: translateY(-2px);
}

.proj-game-option-btn.selected {
  border-color: var(--gold-light);
  background: rgba(215, 174, 101, 0.15);
  color: #ffffff;
  box-shadow: 0 0 0 1px var(--gold-light);
}

.proj-game-option-btn.correct-reveal {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.2);
  color: #ffffff;
}

.proj-game-option-btn.incorrect-reveal {
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.18);
  opacity: 0.7;
}

.proj-game-opt-letter {
  width: 44px;
  height: 44px;
  min-width: 44px;
  background: var(--slate-blue);
  color: var(--warm-white);
  border-radius: 50%;
  font-size: clamp(18px, 1.8vw, 26px);
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.proj-game-option-btn.selected .proj-game-opt-letter {
  background: var(--gold-light);
  color: var(--stage-dark);
}

.proj-game-option-btn.correct-reveal .proj-game-opt-letter {
  background: #10b981;
  color: #ffffff;
}

.proj-game-opt-text {
  font-size: clamp(17px, 1.7vw, 28px);
  font-weight: 600;
  line-height: 1.35;
}

.proj-game-action-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.btn-game-submit {
  background: var(--primary-red);
  color: #ffffff;
  font-size: clamp(18px, 1.8vw, 28px);
  font-weight: 800;
  padding: 14px 36px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 6px 20px rgba(167, 25, 48, 0.5);
}

.btn-game-submit:hover {
  background: var(--primary-red-hover);
  transform: translateY(-2px);
}

.btn-game-next {
  background: var(--slate-blue);
  color: var(--warm-white);
  font-size: clamp(16px, 1.6vw, 24px);
  font-weight: 700;
  padding: 12px 28px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-game-next:hover {
  background: var(--slate-blue-light);
  color: #ffffff;
}

/* Feedback Analysis Box */
.proj-game-result-box {
  background: rgba(24, 28, 35, 0.95);
  border: 2px solid var(--slate-blue);
  border-radius: 14px;
  padding: 22px 28px;
  margin-top: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
  animation: fadeIn 0.3s ease;
}

.proj-game-result-box.correct {
  border-color: #10b981;
  border-left: 8px solid #10b981;
}

.proj-game-result-box.incorrect {
  border-color: #f59e0b;
  border-left: 8px solid #f59e0b;
}

.proj-result-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.proj-result-badge {
  font-size: clamp(14px, 1.4vw, 22px);
  font-weight: 800;
  padding: 4px 16px;
  border-radius: 6px;
}

.proj-result-analysis {
  font-size: clamp(16px, 1.6vw, 26px);
  color: #f1f5f9;
  line-height: 1.55;
  margin: 0 0 10px 0;
}

.proj-result-theory {
  font-size: clamp(15px, 1.4vw, 22px);
  color: var(--gold-light);
  line-height: 1.5;
  border-top: 1px dashed rgba(255, 255, 255, 0.15);
  padding-top: 10px;
  margin: 0;
}

/* ==========================================================================
   CONTENT EDITOR MODAL (Secret Admin / Presenter Deck Editor)
   ========================================================================== */
#contentEditorModal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  z-index: 100000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
}

#contentEditorModal.hidden {
  display: none !important;
}

.editor-card {
  background: #181c23;
  color: #f6f3ed;
  border: 1.5px solid #344155;
  border-radius: 16px;
  width: 95vw;
  max-width: 1100px;
  height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8);
  overflow: hidden;
}

.editor-header {
  padding: 16px 24px;
  background: #222731;
  border-bottom: 1px solid #344155;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.editor-title {
  font-size: 18px;
  font-weight: 800;
  color: #f6f3ed;
  display: flex;
  align-items: center;
  gap: 10px;
}

.editor-tabs {
  display: flex;
  gap: 8px;
  padding: 12px 24px;
  background: #181c23;
  border-bottom: 1px solid #344155;
}

.editor-tab-btn {
  background: #222731;
  color: #cbd5e1;
  border: 1px solid #344155;
  padding: 8px 18px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.editor-tab-btn.active {
  background: var(--primary-red);
  color: #ffffff;
  border-color: #a71930;
}

.editor-body {
  flex: 1;
  padding: 20px 24px;
  overflow-y: auto;
  box-sizing: border-box;
}

.editor-form-group {
  margin-bottom: 18px;
}

.editor-label {
  display: block;
  font-size: 14px;
  font-weight: 700;
  color: #d7ae65;
  margin-bottom: 6px;
}

.editor-input, .editor-textarea, .editor-select {
  width: 100%;
  background: #222731;
  border: 1px solid #344155;
  color: #f6f3ed;
  padding: 10px 14px;
  border-radius: 8px;
  font-family: inherit;
  font-size: 14px;
  box-sizing: border-box;
}

.editor-textarea {
  min-height: 100px;
  resize: vertical;
}

.editor-footer {
  padding: 14px 24px;
  background: #222731;
  border-top: 1px solid #344155;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.editor-actions-left, .editor-actions-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn-editor-primary {
  background: var(--primary-red);
  color: #ffffff;
  border: none;
  padding: 9px 20px;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
}

.btn-editor-secondary {
  background: #344155;
  color: #f6f3ed;
  border: none;
  padding: 9px 18px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

/* ==========================================================================
   MEDIA QUERIES FOR PROJECTOR RESOLUTIONS (1366x768, 1280x720, 1024x768)
   ========================================================================== */
@media (max-height: 800px) {
  .presentation-stage-viewport {
    padding: 12px 50px;
  }
  .proj-title-hero {
    margin-bottom: 8px !important;
  }
  .proj-subtitle-hero {
    margin-bottom: 14px !important;
  }
  .proj-cards-grid {
    gap: 14px;
    margin-bottom: 14px;
  }
  .proj-card-item {
    padding: 16px 18px;
  }
  .proj-game-question-box {
    padding: 14px 20px;
    margin-bottom: 14px;
  }
  .proj-game-options-grid {
    gap: 10px;
    margin-bottom: 14px;
  }
  .proj-game-option-btn {
    padding: 12px 16px;
  }
}
`;

fs.writeFileSync('style.css', css + additionalStyles, 'utf8');
console.log('Successfully updated style.css with Documentary Academic & Projector Stage tokens!');
