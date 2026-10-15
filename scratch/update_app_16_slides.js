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

const newSlides = slideTitles.map((title, idx) => {
  const num = String(idx + 1).padStart(2, '0');
  return `  {
    id: ${idx + 1},
    title: "${title}",
    badge: "HaUI 2026 • 16:9 CINEMATIC",
    bgImage: "assets/slides/Slide_${num}.png",
    notes: "Nội dung thuyết trình Slide ${idx + 1}: ${title}",
    html: \`<div class="projector-slide-canvas" style="width:100%; height:100%; display:flex; align-items:center; justify-content:center;"><img src="assets/slides/Slide_${num}.png" alt="Slide ${idx + 1}" class="projector-slide-img" style="max-width:100%; max-height:100%; object-fit:contain; aspect-ratio:16/9; border-radius:6px; box-shadow: 0 10px 30px rgba(0,0,0,0.6);" onerror="this.src='16_Slide_Dan_chu_XHCN_PNG_DAY_DU/Slide_${num}.png'" /></div>\`
  }`;
});

const defaultSlidesCode = `const DEFAULT_SLIDES = [
${newSlides.join(',\n')}
];`;

let appCode = fs.readFileSync('app.js', 'utf8');

// Replace DEFAULT_SLIDES block
const startMarker = 'const DEFAULT_SLIDES = [';
const endMarker = 'function getStoredSlides() {';

const startIndex = appCode.indexOf(startMarker);
const endIndex = appCode.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error('Could not find markers in app.js');
  process.exit(1);
}

const before = appCode.substring(0, startIndex);
const after = appCode.substring(endIndex);

// Also update getStoredSlides to check parsed.length === 16
const updatedAfter = after.replace(
  "if (Array.isArray(parsed) && parsed.length > 0) return parsed;",
  "if (Array.isArray(parsed) && parsed.length === 16) return parsed;"
);

const newAppCode = before + defaultSlidesCode + '\n\n' + updatedAfter;
fs.writeFileSync('app.js', newAppCode, 'utf8');
console.log('Successfully updated app.js with 16 slides!');
