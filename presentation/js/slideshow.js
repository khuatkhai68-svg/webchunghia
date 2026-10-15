/**
 * 16 Slides Data Definition & Cache Store
 * Dân chủ xã hội chủ nghĩa ở Việt Nam & Trách nhiệm sinh viên HaUI
 */

const SLIDES = [
  { id: 1, title: "1. BẢN CHẤT CỦA NỀN DÂN CHỦ XÃ HỘI CHỦ NGHĨA Ở VIỆT NAM", src: "assets/slides/Slide_01.png", fallback: "../assets/slides/Slide_01.png", transition: "opening" },
  { id: 2, title: "2. MỤC TIÊU & BỐI CẢNH NỀN DÂN CHỦ XHCN", src: "assets/slides/Slide_02.png", fallback: "../assets/slides/Slide_02.png", transition: "directional" },
  { id: 3, title: "3. QUÁ TRÌNH HÌNH THÀNH & PHÁT TRIỂN NỀN DÂN CHỦ XHCN", src: "assets/slides/Slide_03.png", fallback: "../assets/slides/Slide_03.png", transition: "fade-zoom" },
  { id: 4, title: "4. BẢN CHẤT CHÍNH TRỊ CỦA NỀN DÂN CHỦ XHCN", src: "assets/slides/Slide_04.png", fallback: "../assets/slides/Slide_04.png", transition: "depth" },
  { id: 5, title: "5. BẢN CHẤT KINH TẾ — SỞ HỮU TOÀN DÂN VỀ TLSX", src: "assets/slides/Slide_05.png", fallback: "../assets/slides/Slide_05.png", transition: "section" },
  { id: 6, title: "6. BẢN CHẤT TƯ TƯỞNG, VĂN HÓA & XÃ HỘI", src: "assets/slides/Slide_06.png", fallback: "../assets/slides/Slide_06.png", transition: "directional" },
  { id: 7, title: "7. NHÀ NƯỚC PHÁP QUYỀN XHCN CỦA DÂN, DO DÂN, VÌ DÂN", src: "assets/slides/Slide_07.png", fallback: "../assets/slides/Slide_07.png", transition: "golden-sweep" },
  { id: 8, title: "8. MỐI QUAN HỆ ĐẢNG LÃNH ĐẠO - NHÀ NƯỚC QUẢN LÝ - NHÂN DÂN LÀM CHỦ", src: "assets/slides/Slide_08.png", fallback: "../assets/slides/Slide_08.png", transition: "fade-zoom" },
  { id: 9, title: "9. HÌNH THỨC DÂN CHỦ TRỰC TIẾP & DÂN CHỦ ĐẠI DIỆN", src: "assets/slides/Slide_09.png", fallback: "../assets/slides/Slide_09.png", transition: "depth" },
  { id: 10, title: "10. CƠ CHẾ 'DÂN BIẾT, DÂN BÀN, DÂN LÀM, KIỂM TRA, GIÁM SÁT, THỤ HƯỞNG'", src: "assets/slides/Slide_10.png", fallback: "../assets/slides/Slide_10.png", transition: "silk-wave" },
  { id: 11, title: "11. PHẦN II: THỰC TIỄN & TRÁCH NHIỆM SINH VIÊN HaUI", src: "assets/slides/Slide_11.png", fallback: "../assets/slides/Slide_11.png", transition: "section" },
  { id: 12, title: "12. THỰC HÀNH DÂN CHỦ TRONG MÔI TRƯỜNG ĐẠI HỌC CÔNG NGHIỆP HÀ NỘI", src: "assets/slides/Slide_12.png", fallback: "../assets/slides/Slide_12.png", transition: "directional" },
  { id: 13, title: "13. NÂNG CAO NHẬN THỨC VÀ ĐÓNG GÓP Ý KIẾN XÂY DỰNG NHÀ TRƯỜNG", src: "assets/slides/Slide_13.png", fallback: "../assets/slides/Slide_13.png", transition: "golden-sweep" },
  { id: 14, title: "14. PHẢN BIỆN VĂN MINH — ĐẤU TRANH PHẢN BÁC QUAN ĐIỂM SAI TRÁI", src: "assets/slides/Slide_14.png", fallback: "../assets/slides/Slide_14.png", transition: "depth" },
  { id: 15, title: "15. HÀNH ĐỘNG CỤ THỂ CỦA SINH VIÊN KỸ THUẬT & CÔNG NGHỆ HaUI", src: "assets/slides/Slide_15.png", fallback: "../assets/slides/Slide_15.png", transition: "fade-zoom" },
  { id: 16, title: "16. THÔNG ĐIỆP KẾT LUẬN — TRI THỨC • HÀNH ĐỘNG • SÁNG TẠO", src: "assets/slides/Slide_16.png", fallback: "../assets/slides/Slide_16.png", transition: "final" }
];

class SlideshowManager {
  constructor(slides) {
    this.slides = slides;
    this.imageCache = new Map();
  }

  getSlide(index) {
    if (index < 0 || index >= this.slides.length) return null;
    return this.slides[index];
  }

  get total() {
    return this.slides.length;
  }

  preload(index) {
    if (index < 0 || index >= this.slides.length) return;
    const slide = this.slides[index];
    if (this.imageCache.has(slide.src)) return;

    const img = new Image();
    img.src = slide.src;
    img.onerror = () => {
      img.src = slide.fallback;
    };
    this.imageCache.set(slide.src, img);
  }

  preloadSurroundings(currentIndex) {
    this.preload(currentIndex);
    this.preload(currentIndex + 1);
    this.preload(currentIndex + 2);
    this.preload(currentIndex - 1);
  }
}
