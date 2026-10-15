const fs = require('fs');

console.log('=== PURGING 7-SLIDE LEGACY ARTIFACTS FOREVER ===\n');

// 1. UPDATE index.html
let indexHtml = fs.readFileSync('index.html', 'utf8');

// Add immediate localStorage purge in <head>
const purgeScript = `<script>
    try {
      localStorage.removeItem('REDMIND_CUSTOM_SLIDES_V2');
      localStorage.removeItem('REDMIND_CUSTOM_SLIDES');
      localStorage.removeItem('REDMIND_CUSTOM_SCENARIOS_V2');
      localStorage.removeItem('REDMIND_CUSTOM_SCENARIOS');
    } catch(e) {}
  </script>`;

if (!indexHtml.includes("localStorage.removeItem('REDMIND_CUSTOM_SLIDES_V2')")) {
  indexHtml = indexHtml.replace('<head>', '<head>\n  ' + purgeScript);
  console.log('✅ Added immediate localStorage purge script to <head> of index.html');
}

// Remove contentEditorModal from index.html if present
const editorModalRegex = /<!-- =+ MODAL: BIÊN TẬP NỘI DUNG[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;
if (editorModalRegex.test(indexHtml)) {
  indexHtml = indexHtml.replace(editorModalRegex, '<!-- Legacy Content Editor Removed -->');
  console.log('✅ Removed #contentEditorModal from index.html');
}

fs.writeFileSync('index.html', indexHtml, 'utf8');

// 2. UPDATE app.js
let appJs = fs.readFileSync('app.js', 'utf8');

// A. Insert top-level localStorage clear
const topClear = `// ==========================================================================
// IMMEDIATE STORAGE PURGE — FORCE PRISTINE 16 SLIDES (NO 7-SLIDE CACHE)
// ==========================================================================
try {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('REDMIND_CUSTOM_SLIDES_V2');
    localStorage.removeItem('REDMIND_CUSTOM_SLIDES');
    localStorage.removeItem('REDMIND_CUSTOM_SCENARIOS_V2');
    localStorage.removeItem('REDMIND_CUSTOM_SCENARIOS');
  }
} catch (e) {}

`;

if (!appJs.includes('IMMEDIATE STORAGE PURGE')) {
  appJs = topClear + appJs;
  console.log('✅ Added top-level localStorage purge in app.js');
}

// B. Replace getStoredSlides and getStoredScenarios with direct assignment
const oldGetStored = /function getStoredSlides\(\)[\s\S]*?let SCENARIOS = getStoredScenarios\(\);/;
const newGetStored = `// PERMANENT 16 SLIDES — DIRECT ASSIGNMENT (NEVER OVERRIDDEN BY LOCALSTORAGE)
const SLIDES = DEFAULT_SLIDES;
const SCENARIOS = DEFAULT_SCENARIOS;`;

if (oldGetStored.test(appJs)) {
  appJs = appJs.replace(oldGetStored, newGetStored);
  console.log('✅ Replaced getStoredSlides with direct const SLIDES = DEFAULT_SLIDES');
}

// C. Remove bindContentEditor() call and implementation if present
appJs = appJs.replace(/this\.bindContentEditor\(\);?/g, '// Content editor removed');
const editorMethodRegex = /bindContentEditor\(\)[\s\S]*?openContentEditor\(\)[\s\S]*?(?=\/\/ =+[\r\n\s]+\/\/ DEBATE ARENA)/;
if (editorMethodRegex.test(appJs)) {
  appJs = appJs.replace(editorMethodRegex, '// Legacy content editor removed\n  ');
  console.log('✅ Removed bindContentEditor method from app.js');
}

// D. Remove stage game call from slide 5 inside renderSlide
appJs = appJs.replace(/if\s*\(index\s*===\s*5\)\s*\{\s*this\.renderStageGame\(\);\s*\}/g, '// Slide 5 is PNG slide');

// E. In openPresentationModal, ensure SLIDES is DEFAULT_SLIDES and counter is 16
const openPresOld = `openPresentationModal(slideIndex = 0) {
    audio.success();
    this.currentSlideIndex = slideIndex;
    this.renderSlide(slideIndex);
    this.openModal('presentationModal');
    this.startPresentTimer();
  }`;

const openPresNew = `openPresentationModal(slideIndex = 0) {
    audio.success();
    // Guarantee 16 slides are active
    try {
      localStorage.removeItem('REDMIND_CUSTOM_SLIDES_V2');
      localStorage.removeItem('REDMIND_CUSTOM_SLIDES');
    } catch(e) {}
    this.currentSlideIndex = slideIndex;
    this.renderSlide(slideIndex);
    this.openModal('presentationModal');
    this.startPresentTimer();
  }`;

appJs = appJs.replace(openPresOld, openPresNew);

fs.writeFileSync('app.js', appJs, 'utf8');
console.log('✅ Successfully updated app.js to enforce 16 slides permanently!');
