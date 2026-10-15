const fs = require('fs');

const slideTitles = [
  "1. BẢN CHẤT CỦA NỀN DÂN CHỦ XÃ HỘI CHỦ NGHĨA Ở VIỆT NAM",
  "2. MỤC TIÊU & BỐI CẢNH NỀN DÂN CHỦ XHCN",
  "3. QUÁ TRÌNH HÌNH THÀNH & PHÁT TRIỂN NỀN DÂN CHỦ XHCN",
  "4. BẢN CHẤT CHÍNH TRỊ CỦA NỀN DÂN CHỦ XHCN",
  "5. BẢN CHẤT KINH TẾ — SỞ HỮU TOÀN DÂN VỀ TLSX",
  "6. BẢN CHẤT TƯ TƯỞNG, VĂN HÓA & XÃ HỘI",
  "7. NHÀ NƯỚC PHÁP QUYỀN XHCN CỦA DÂN, DO DÂN, VÌ DÂN",
  "8. MỐI QUAN HỆ ĐẢNG LÃNH ĐẠO - NHÀ NƯỚC QUẢN LÝ - NHÂN DÂN LÀM CHỦ",
  "9. HÌNH THỨC DÂN CHỦ TRỰC TIẾP & DÂN CHỦ ĐẠI DIỆN",
  "10. CƠ CHẾ 'DÂN BIẾT, DÂN BÀN, DÂN LÀM, KIỂM TRA, GIÁM SÁT, THỤ HƯỞNG'",
  "11. PHẦN II: THỰC TIỄN & TRÁCH NHIỆM SINH VIÊN HaUI",
  "12. THỰC HÀNH DÂN CHỦ TRONG MÔI TRƯỜNG ĐẠI HỌC CÔNG NGHIỆP HÀ NỘI",
  "13. NÂNG CAO NHẬN THỨC VÀ ĐÓNG GÓP Ý KIẾN XÂY DỰNG NHÀ TRƯỜNG",
  "14. PHẢN BIỆN VĂN MINH — ĐẤU TRANH PHẢN BÁC QUAN ĐIỂM SAI TRÁI",
  "15. HÀNH ĐỘNG CỤ THỂ CỦA SINH VIÊN KỸ THUẬT & CÔNG NGHỆ HaUI",
  "16. THÔNG ĐIỆP KẾT LUẬN — TRI THỨC • HÀNH ĐỘNG • SÁNG TẠO"
];

const newSlidesArray = slideTitles.map((title, idx) => {
  const num = String(idx + 1).padStart(2, '0');
  return `  {
    id: ${idx + 1},
    title: "${title}",
    badge: "HaUI 2026 • 16:9 PRESENTATION",
    bgImage: "assets/slides/Slide_${num}.png",
    notes: "Nội dung thuyết trình Slide ${idx + 1}: ${title}",
    html: \`
      <div class="projector-slide-img-wrap">
        <img src="assets/slides/Slide_${num}.png" alt="Slide ${idx + 1}" class="projector-slide-img" onerror="this.src='16_Slide_Dan_chu_XHCN_PNG_DAY_DU/Slide_${num}.png'" />
      </div>
    \`
  }`;
}).join(',\n');

const newDefaultSlidesCode = `const DEFAULT_SLIDES = [\n${newSlidesArray}\n];`;

let appCode = fs.readFileSync('app.js', 'utf8');

const startMarker = 'const DEFAULT_SLIDES = [';
const endMarker = '// 4. MASTER 5 LECTURE HALL INTERACTIVE SCENARIOS';

const startIndex = appCode.indexOf(startMarker);
const endIndex = appCode.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error('Cannot find markers in app.js: startIndex=' + startIndex + ', endIndex=' + endIndex);
  process.exit(1);
}

const before = appCode.substring(0, startIndex);
const after = appCode.substring(endIndex);

let newAppCode = before + newDefaultSlidesCode + '\n\n' + after;

// Update getStoredSlides
newAppCode = newAppCode.replace(
  `function getStoredSlides() {
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem('REDMIND_CUSTOM_SLIDES_V2');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    }
  } catch (e) {}
  return JSON.parse(JSON.stringify(DEFAULT_SLIDES));
}`,
  `function getStoredSlides() {
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem('REDMIND_CUSTOM_SLIDES_V2');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length === 16) return parsed;
      }
    }
  } catch (e) {}
  return JSON.parse(JSON.stringify(DEFAULT_SLIDES));
}`
);

// In openPresentationModal, also ensure SLIDES length is 16
newAppCode = newAppCode.replace(
  `openPresentationModal(slideIndex = 0) {
    audio.success();
    this.currentSlideIndex = slideIndex;
    this.renderSlide(slideIndex);
    this.openModal('presentationModal');
    this.startPresentTimer();
  }`,
  `openPresentationModal(slideIndex = 0) {
    audio.success();
    if (SLIDES.length !== 16) {
      try { localStorage.removeItem('REDMIND_CUSTOM_SLIDES_V2'); } catch(e) {}
      SLIDES = JSON.parse(JSON.stringify(DEFAULT_SLIDES));
    }
    this.currentSlideIndex = slideIndex;
    this.renderSlide(slideIndex);
    this.openModal('presentationModal');
    this.startPresentTimer();
  }`
);

fs.writeFileSync('app.js', newAppCode, 'utf8');
console.log('app.js successfully updated with 16 slides!');
