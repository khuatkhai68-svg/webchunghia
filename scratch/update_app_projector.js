const fs = require('fs');

let appJs = fs.readFileSync('app.js', 'utf8');

// Define revised MASTER_SLIDES
const masterSlidesCode = `// ==========================================================================
// 3. MASTER SLIDES DATA FOR PROJECTOR PRESENTATION (16:9 LECTURE HALL)
// ==========================================================================
const DEFAULT_SLIDES = [
  // CẢNH 0: TỔNG QUAN & MỞ ĐẦU
  {
    title: "BẢN CHẤT CỦA NỀN DÂN CHỦ XÃ HỘI CHỦ NGHĨA Ở VIỆT NAM",
    badge: "HaUI 2026 • BÀI THUYẾT TRÌNH GIẢNG ĐƯỜNG",
    bgImage: "assets/bg-intro.jpg",
    notes: "Chào giảng viên và các bạn sinh viên. Hôm nay nhóm xin trình bày đề tài Bản chất nền dân chủ xã hội chủ nghĩa ở Việt Nam và hành động của sinh viên Đại học Công nghiệp Hà Nội.",
    html: \`
      <div class="proj-hero-header">
        <div class="proj-badge-flag">
          <span style="font-size: 20px;">🇻🇳</span>
          <span class="proj-badge-text">ĐẠI HỌC CÔNG NGHIỆP HÀ NỘI • CHỦ NGHĨA XÃ HỘI KHOA HỌC</span>
        </div>
        <h1 class="proj-title-hero">BẢN CHẤT NỀN DÂN CHỦ XÃ HỘI CHỦ NGHĨA</h1>
        <h2 class="proj-subtitle-hero">TỪ LÝ LUẬN ĐẾN THỰC TIỄN SINH VIÊN HaUI</h2>
      </div>

      <div class="proj-cards-grid">
        <div class="proj-card-item">
          <span class="proj-card-icon">🏛️</span>
          <h3 class="proj-card-title">1. Bản chất Toàn diện</h3>
          <ul class="proj-point-list">
            <li class="proj-point-item">Quyền lực tối cao thuộc về Nhân dân.</li>
            <li class="proj-point-item">Kinh tế công hữu TLSX chủ yếu; văn hóa giải phóng con người.</li>
          </ul>
          <span class="proj-citation-tag">Điều 2 Hiến pháp 2013</span>
        </div>

        <div class="proj-card-item">
          <span class="proj-card-icon">⚖️</span>
          <h3 class="proj-card-title">2. Kỷ cương Pháp chế</h3>
          <ul class="proj-point-list">
            <li class="proj-point-item">Dân chủ đi đôi với kỷ cương, pháp luật.</li>
            <li class="proj-point-item">Chu trình 6 bước: Dân biết, dân bàn, dân làm, kiểm tra, giám sát, thụ hưởng.</li>
          </ul>
          <span class="proj-citation-tag">Văn kiện Đại hội XIII của Đảng</span>
        </div>

        <div class="proj-card-item">
          <span class="proj-card-icon">🎓</span>
          <h3 class="proj-card-title">3. Hành động Sinh viên</h3>
          <ul class="proj-point-list">
            <li class="proj-point-item">Thực hành dân chủ cơ sở tại HaUI.</li>
            <li class="proj-point-item">Trách nhiệm công dân số, đạo đức kỹ sư 4.0 'Vừa hồng vừa chuyên'.</li>
          </ul>
          <span class="proj-citation-tag">Quy chế 31/NQ-HĐT HaUI</span>
        </div>
      </div>
    \`
  },

  // CẢNH 1: BẢN CHẤT TOÀN DIỆN (CHÍNH TRỊ, KINH TẾ, VĂN HÓA)
  {
    title: "1. BẢN CHẤT CỦA NỀN DÂN CHỦ XÃ HỘI CHỦ NGHĨA",
    badge: "LÝ LUẬN MÁC - LÊNIN & TƯ TƯỞNG HỒ CHÍ MINH",
    bgImage: "assets/bg-nature.jpg",
    notes: "Phân tích 3 trụ cột hữu cơ: Bản chất Chính trị (giai cấp công nhân, Đảng lãnh đạo), Bản chất Kinh tế (công hữu TLSX), Bản chất Văn hóa - Xã hội (con người là trung tâm).",
    html: \`
      <div class="proj-scene-header">
        <h2 class="proj-scene-title">1. BẢN CHẤT TOÀN DIỆN CỦA NỀN DÂN CHỦ XHCN</h2>
        <div class="proj-question-banner">
          <span class="proj-question-text">Bản chất vs Tuyên bố: Quyền lực thực sự thuộc về ai?</span>
          <span style="font-size: 15px; color: #cbd5e1; font-weight: 700;">3 TRỤ CỘT HỮU CƠ</span>
        </div>
      </div>

      <div class="proj-cards-grid">
        <div class="proj-card-item">
          <span class="proj-card-icon">🚩</span>
          <h3 class="proj-card-title">Bản chất Chính trị</h3>
          <ul class="proj-point-list">
            <li class="proj-point-item">Mang bản chất giai cấp công nhân, đặt dưới sự lãnh đạo của Đảng Cộng sản.</li>
            <li class="proj-point-item">Nhà nước của Nhân dân, do Nhân dân, vì Nhân dân.</li>
            <li class="proj-point-item">Khác biệt về chất với dân chủ tư sản (chỉ phục vụ thiểu số tài phiệt).</li>
          </ul>
          <span class="proj-citation-tag">Cơ sở chính trị: Hiến pháp 2013</span>
        </div>

        <div class="proj-card-item">
          <span class="proj-card-icon">📈</span>
          <h3 class="proj-card-title">Bản chất Kinh tế</h3>
          <ul class="proj-point-list">
            <li class="proj-point-item">Dựa trên chế độ công hữu về các tư liệu sản xuất chủ yếu.</li>
            <li class="proj-point-item">Kinh tế thị trường định hướng XHCN nhằm giải phóng sức sản xuất.</li>
            <li class="proj-point-item">Phân phối theo kết quả lao động; an sinh xã hội không ai bị bỏ lại.</li>
          </ul>
          <span class="proj-citation-tag">Cơ sở kinh tế: Đại hội XIII</span>
        </div>

        <div class="proj-card-item">
          <span class="proj-card-icon">🌱</span>
          <h3 class="proj-card-title">Bản chất Văn hóa - XH</h3>
          <ul class="proj-point-list">
            <li class="proj-point-item">Lấy con người làm trung tâm, chủ thể và mục tiêu phát triển.</li>
            <li class="proj-point-item">Giải phóng triệt để sức sáng tạo của người lao động.</li>
            <li class="proj-point-item">Hệ giá trị chuẩn mực: Công bằng, bình đẳng, văn minh và tiến bộ.</li>
          </ul>
          <span class="proj-citation-tag">Hệ tư tưởng Mác - Lênin & TT Hồ Chí Minh</span>
        </div>
      </div>
    \`
  },

  // CẢNH 2: MỐI QUAN HỆ VỚI NHÀ NƯỚC PHÁP QUYỀN
  {
    title: "2. MỐI QUAN HỆ GIỮA DÂN CHỦ VÀ PHÁP LUẬN KỶ CƯƠNG",
    badge: "NHÀ NƯỚC PHÁP QUYỀN XÃ HỘI CHỦ NGHĨA",
    bgImage: "assets/bg-law.jpg",
    notes: "Làm rõ: Không có dân chủ đứng ngoài pháp luật. Dân chủ đại diện và dân chủ trực tiếp là hai phương thức song hành.",
    html: \`
      <div class="proj-scene-header">
        <h2 class="proj-scene-title">2. DÂN CHỦ ĐI ĐÔI VỚI PHÁP CHẾ & THƯỢNG TÔN PHÁP LUẬT</h2>
        <div class="proj-question-banner">
          <span class="proj-question-text">Pháp luật là phương thức thể chế hóa và bảo đảm quyền làm chủ</span>
          <span style="font-size: 15px; color: #cbd5e1; font-weight: 700;">CƠ CHẾ THỰC THI</span>
        </div>
      </div>

      <div class="proj-cards-grid">
        <div class="proj-card-item">
          <span class="proj-card-icon">🏛️</span>
          <h3 class="proj-card-title">Dân chủ Đại diện</h3>
          <ul class="proj-point-list">
            <li class="proj-point-item">Nhân dân ủy quyền quyền lực thông qua bầu cử Quốc hội và HĐND.</li>
            <li class="proj-point-item">Cơ chế phân công, phối hợp và kiểm soát quyền lực nhà nước.</li>
            <li class="proj-point-item">Nghĩa vụ giải trình công khai của người đứng đầu cơ quan công quyền.</li>
          </ul>
          <span class="proj-citation-tag">Luật Bầu cử ĐBQH & ĐBHĐND</span>
        </div>

        <div class="proj-card-item">
          <span class="proj-card-icon">🗳️</span>
          <h3 class="proj-card-title">Dân chủ Trực tiếp</h3>
          <ul class="proj-point-list">
            <li class="proj-point-item">Quyền biểu quyết trực tiếp khi Nhà nước tổ chức trưng cầu ý dân.</li>
            <li class="proj-point-item">Đóng góp ý kiến sửa đổi Hiến pháp, văn bản quy phạm pháp luật.</li>
            <li class="proj-point-item">Giám sát và phản biện xã hội qua Mặt trận Tổ quốc và các đoàn thể.</li>
          </ul>
          <span class="proj-citation-tag">Luật Thực hiện dân chủ ở cơ sở 2022</span>
        </div>

        <div class="proj-card-item">
          <span class="proj-card-icon">⚖️</span>
          <h3 class="proj-card-title">Kỷ luật & Kỷ cương</h3>
          <ul class="proj-point-list">
            <li class="proj-point-item">Dân chủ không đồng nghĩa với tự do vô kỷ luật, tùy tiện cá nhân.</li>
            <li class="proj-point-item">Quyền của mỗi công dân bị giới hạn bởi quyền lợi của cộng đồng.</li>
            <li class="proj-point-item">Nghiêm trị mọi hành vi lợi dụng dân chủ để xâm phạm an ninh quốc gia.</li>
          </ul>
          <span class="proj-citation-tag">Điều 15 Hiến pháp 2013</span>
        </div>
      </div>
    \`
  },

  // CẢNH 3: NỘI DUNG CHU TRÌNH 6 BƯỚC "DÂN"
  {
    title: "3. CHU TRÌNH 6 CHỮ DÂN TRONG THỰC TIỄN",
    badge: "NGUYÊN TẮC HÀNH ĐỘNG ĐẠI HỘI XIII",
    bgImage: "assets/bg-law.jpg",
    notes: "Nhấn mạnh chu trình khép kín: Dân biết, dân bàn, dân làm, dân kiểm tra, dân giám sát, và đích đến tối thượng là DÂN THỤ HƯỞNG.",
    html: \`
      <div class="proj-scene-header">
        <h2 class="proj-scene-title">3. CHU TRÌNH THỰC HÀNH DÂN CHỦ: TỪ 'BIẾT' ĐẾN 'THỤ HƯỞNG'</h2>
        <div class="proj-question-banner">
          <span class="proj-question-text">Phương châm hành động thực chất: 'Dân là gốc'</span>
          <span style="font-size: 15px; color: #cbd5e1; font-weight: 700;">ĐẠI HỘI XIII CỦA ĐẢNG</span>
        </div>
      </div>

      <div class="proj-cards-grid">
        <div class="proj-card-item">
          <span class="proj-card-icon">📢</span>
          <h3 class="proj-card-title">1. Dân Biết & Dân Bàn</h3>
          <ul class="proj-point-list">
            <li class="proj-point-item"><strong>Dân biết:</strong> Công khai, minh bạch quy hoạch, ngân sách, học phí và chính sách.</li>
            <li class="proj-point-item"><strong>Dân bàn:</strong> Thảo luận dân chủ, hiến kế giải pháp trước khi ban hành quyết định.</li>
          </ul>
          <span class="proj-citation-tag">Luật Tiếp cận thông tin 2016</span>
        </div>

        <div class="proj-card-item">
          <span class="proj-card-icon">🛠️</span>
          <h3 class="proj-card-title">2. Dân Làm & Kiểm Tra</h3>
          <ul class="proj-point-list">
            <li class="proj-point-item"><strong>Dân làm:</strong> Trực tiếp tham gia lao động sản xuất, học tập và sáng tạo kỹ thuật.</li>
            <li class="proj-point-item"><strong>Kiểm tra & Giám sát:</strong> Thanh tra nhân dân kiểm toán; cộng đồng giám sát thường xuyên.</li>
          </ul>
          <span class="proj-citation-tag">Phân biệt rành mạch Kiểm tra vs Giám sát</span>
        </div>

        <div class="proj-card-item">
          <span class="proj-card-icon">🎁</span>
          <h3 class="proj-card-title">3. Dân Thụ Hưởng</h3>
          <ul class="proj-point-list">
            <li class="proj-point-item">Mục tiêu tối thượng: Mọi thành quả phát triển phải quay về phục vụ nhân dân.</li>
            <li class="proj-point-item">Thụ hưởng giáo dục tiên tiến, y tế công bằng, an sinh xã hội vững chắc.</li>
          </ul>
          <span class="proj-citation-tag">Mục tiêu giải phóng & phát triển con người</span>
        </div>
      </div>
    \`
  },

  // CẢNH 4: THỰC TIỄN TẠI ĐẠI HỌC CÔNG NGHIỆP HÀ NỘI
  {
    title: "4. THỰC HÀNH DÂN CHỦ TẠI ĐẠI HỌC CÔNG NGHIỆP HÀ NỘI",
    badge: "THỰC TIỄN SINH VIÊN HaUI 2026",
    bgImage: "assets/bg-haui.jpg",
    notes: "Liên hệ trực tiếp với cơ sở đào tạo: Cổng sinh viên sv.haui.edu.vn, Hội nghị đối thoại BGH, an toàn xưởng CNC và đánh giá giảng viên.",
    html: \`
      <div class="proj-scene-header">
        <h2 class="proj-scene-title">4. THỰC HÀNH DÂN CHỦ TẠI ĐẠI HỌC CÔNG NGHIỆP HÀ NỘI</h2>
        <div class="proj-question-banner">
          <span class="proj-question-text">Tự chủ đại học gắn liền với quyền làm chủ của người học</span>
          <span style="font-size: 15px; color: #cbd5e1; font-weight: 700;">QUY CHẾ 31/NQ-HĐT</span>
        </div>
      </div>

      <div class="proj-cards-grid">
        <div class="proj-card-item">
          <span class="proj-card-icon">💻</span>
          <h3 class="proj-card-title">Cổng e-HaUI & Khảo sát</h3>
          <ul class="proj-point-list">
            <li class="proj-point-item">Đánh giá giảng viên 100% bảo mật cuối mỗi học kỳ.</li>
            <li class="proj-point-item">Gửi phản ánh học vụ trực tuyến, theo dõi tiến độ giải quyết minh bạch.</li>
          </ul>
          <span class="proj-citation-tag">Hệ thống quản trị số HaUI</span>
        </div>

        <div class="proj-card-item">
          <span class="proj-card-icon">🤝</span>
          <h3 class="proj-card-title">Hội Nghị Đối Thoại BGH</h3>
          <ul class="proj-point-list">
            <li class="proj-point-item">Diễn đàn định kỳ giữa Ban Giám hiệu và đại diện sinh viên toàn trường.</li>
            <li class="proj-point-item">Trách nhiệm giải trình trực tiếp về học phí, cơ sở vật chất, lịch học.</li>
          </ul>
          <span class="proj-citation-tag">Quyền đối thoại dân chủ trực tiếp</span>
        </div>

        <div class="proj-card-item">
          <span class="proj-card-icon">⚙️</span>
          <h3 class="proj-card-title">Giám Sát Cơ Sở Vật Chất</h3>
          <ul class="proj-point-list">
            <li class="proj-point-item">Giám sát tiêu chuẩn bảo hộ và an toàn điện xưởng công nghệ CNC.</li>
            <li class="proj-point-item">Thụ hưởng lab IoT, thư viện số và khu thực hành kỹ thuật cao.</li>
          </ul>
          <span class="proj-citation-tag">Bảo vệ quyền lợi học tập thực chất</span>
        </div>
      </div>
    \`
  },

  // CẢNH 5: TRÒ CHƠI TƯƠNG TÁC TÌNH HUỐNG
  {
    title: "5. TƯƠNG TÁC GIẢNG ĐƯỜNG: BẠN SẼ LÀM GÌ?",
    badge: "ĐẤU TRƯỜNG TÌNH HUỐNG THỰC TẾ",
    bgImage: "assets/bg-intro.jpg",
    notes: "Mời cả lớp tương tác trực tiếp. Người thuyết trình đọc câu hỏi tình huống, mời các bạn chọn đáp án A/B/C/D và bấm xem phân tích.",
    html: \`
      <div class="proj-game-container">
        <div class="proj-game-header">
          <span class="proj-game-scenario-badge" id="stageGameTag">TÌNH HUỐNG 1 / 5 • HỌC VỤ & LỊCH HỌC</span>
          <div class="proj-game-timer-pill" id="stageGameTimerWrap">
            <span>⏱️</span>
            <span id="stageGameClock">60s</span>
          </div>
        </div>

        <div class="proj-game-question-box">
          <h3 class="proj-game-question-text" id="stageGameQuestion">
            Nếu nhà trường dự kiến điều chỉnh lịch học thực hành xưởng và sinh viên có nhiều ý kiến trái chiều, bạn sẽ xử lý như thế nào?
          </h3>
        </div>

        <div class="proj-game-options-grid" id="stageGameOptionsGrid">
          <!-- Dynamic 4 Options A, B, C, D rendered by JS -->
        </div>

        <div class="proj-game-action-bar">
          <button type="button" class="btn-game-submit" id="btnStageSubmitAnswer">
            ✓ Xác nhận lựa chọn
          </button>
          <button type="button" class="btn-game-next" id="btnStageNextScenario">
            Sang tình huống tiếp theo &rarr;
          </button>
        </div>

        <div class="proj-game-result-box hidden" id="stageGameResultBox">
          <div class="proj-result-header">
            <span class="proj-result-badge" id="stageResultBadge">Đánh giá học thuật</span>
            <span style="font-size: 14px; color: #94a3b8;">Cơ sở lý luận XHCN</span>
          </div>
          <p class="proj-result-analysis" id="stageResultAnalysis"></p>
          <p class="proj-result-theory" id="stageResultTheory"></p>
        </div>
      </div>
    \`
  },

  // CẢNH 6: KẾT LUẬN & TRÁCH NHIỆM SINH VIÊN
  {
    title: "6. KẾT LUẬN: TRÁCH NHIỆM VÀ SỨ MỆNH KỸ SƯ TRẺ",
    badge: "TỔNG KẾT BÀI BÁO CÁO • HaUI 2026",
    bgImage: "assets/bg-conclusion.jpg",
    notes: "Tổng kết bài học: Hiểu đúng bản chất, tham gia có trách nhiệm, phản biện có căn cứ. Trở thành kỹ sư HaUI vừa hồng vừa chuyên.",
    html: \`
      <div class="proj-hero-header" style="margin-bottom: 20px;">
        <h1 class="proj-title-hero" style="color: #fbbf24;">HIỂU ĐÚNG • THAM GIA CÓ TRÁCH NHIỆM • PHẢN BIỆN CÓ CĂN CỨ</h1>
        <h2 class="proj-subtitle-hero" style="color: #f6f3ed;">SỨ MỆNH SINH VIÊN ĐẠI HỌC CÔNG NGHIỆP HÀ NỘI TRONG KỶ NGUYÊN SỐ</h2>
      </div>

      <div class="proj-cards-grid">
        <div class="proj-card-item">
          <span class="proj-card-icon">🧠</span>
          <h3 class="proj-card-title">1. Nhận thức Chính trị</h3>
          <ul class="proj-point-list">
            <li class="proj-point-item">Nắm vững lý luận Chủ nghĩa xã hội khoa học và quan điểm của Đảng.</li>
            <li class="proj-point-item">Phân biệt rõ bản chất ưu việt của dân chủ XHCN so với dân chủ tư sản.</li>
          </ul>
          <span class="proj-citation-tag">Bản lĩnh tư tưởng vững vàng</span>
        </div>

        <div class="proj-card-item">
          <span class="proj-card-icon">🤝</span>
          <h3 class="proj-card-title">2. Văn hóa Đối thoại</h3>
          <ul class="proj-point-list">
            <li class="proj-point-item">Tôn trọng pháp luật, quy chế nhà trường và ý kiến khác biệt.</li>
            <li class="proj-point-item">Phản ánh trung thực qua kênh chính thức, tẩy chay tin xấu độc.</li>
          </ul>
          <span class="proj-citation-tag">Trách nhiệm công dân số</span>
        </div>

        <div class="proj-card-item">
          <span class="proj-card-icon">🚀</span>
          <h3 class="proj-card-title">3. Khát vọng Cống hiến</h3>
          <ul class="proj-point-list">
            <li class="proj-point-item">Học tập xuất sắc, làm chủ công nghệ cao và khoa học kỹ thuật.</li>
            <li class="proj-point-item">Cống hiến tài năng xây dựng đất nước phồn vinh, hạnh phúc.</li>
          </ul>
          <span class="proj-citation-tag">Kỹ sư HaUI 'Vừa hồng vừa chuyên'</span>
        </div>
      </div>
    \`
  }
];

// ==========================================================================
// 4. MASTER 5 LECTURE HALL INTERACTIVE SCENARIOS
// ==========================================================================
const DEFAULT_SCENARIOS = [
  {
    id: 1,
    tag: "TÌNH HUỐNG 1 / 5 • HỌC VỤ & LỊCH HỌC",
    question: "Nhà trường dự kiến điều chỉnh khung giờ thực hành tại xưởng kỹ thuật và sinh viên có nhiều ý kiến trái chiều. Bạn sẽ xử lý như thế nào?",
    correctOpt: "C",
    options: [
      {
        key: "A",
        text: "Đăng bài ẩn danh lên diễn đàn mạng xã hội bày tỏ bức xúc gay gắt để thu hút sự chú ý.",
        badge: "Chưa chuẩn mực • Tự do vô kỷ luật",
        analysis: "Đăng tải ẩn danh công kích trên mạng xã hội dễ gây hoang mang, làm méo mó bản chất sự việc và có nguy cơ vi phạm Luật An ninh mạng.",
        theory: "Dân chủ XHCN không đồng nghĩa với tự do tùy tiện. Quyền tự do biểu đạt phải đi đôi với kỷ cương pháp luật và trách nhiệm thông tin."
      },
      {
        key: "B",
        text: "Giữ im lặng, chấp nhận thụ động vì nghĩ tiếng nói cá nhân không thay đổi được quyết định.",
        badge: "Thụ động • Chưa phát huy quyền làm chủ",
        analysis: "Thái độ buông xuôi khiến người học tự đánh mất quyền lợi chính đáng và tiếng nói đại diện của mình trước các quyết sách học đường.",
        theory: "Bản chất dân chủ XHCN khẳng định người dân (sinh viên) là chủ thể. Quyền làm chủ chỉ có ý nghĩa khi cá nhân chủ động tham gia."
      },
      {
        key: "C",
        text: "Cùng lớp tổng hợp ý kiến, gửi kiến nghị có căn cứ qua Cố vấn học tập và Cổng e-HaUI.",
        badge: "Lựa chọn chuẩn mực • Dân chủ cơ sở",
        analysis: "Rất chuẩn xác! Tiếp cận thông tin chính thức và phản hồi qua kênh đại diện hợp pháp là phương pháp văn minh, có giá trị pháp lý cao nhất.",
        theory: "Biểu hiện sinh động của phương châm 'Dân biết, dân bàn, dân làm, dân kiểm tra' theo Luật Thực hiện dân chủ ở cơ sở 2022."
      },
      {
        key: "D",
        text: "Rủ một nhóm bạn tự ý bỏ buổi thực hành đầu tiên để gây áp lực.",
        badge: "Vi phạm quy chế • Thiếu ý thức tổ chức",
        analysis: "Tự ý bỏ học là hành vi vi phạm kỷ luật học đường, làm ảnh hưởng tiến độ đào tạo của tập thể và uy tín của sinh viên.",
        theory: "Dân chủ chân chính luôn đối lập với các hành vi vô tổ chức, cực đoan làm tổn hại đến lợi ích chung của tập thể."
      }
    ]
  },
  {
    id: 2,
    tag: "TÌNH HUỐNG 2 / 5 • AN TOÀN XƯỞNG MÁY CNC",
    question: "Tại xưởng thực hành CNC (Cơ sở 2 HaUI), bạn phát hiện một máy công cụ có dấu hiệu rò điện nhẹ và thiếu nút dừng khẩn cấp. Bạn sẽ làm gì?",
    correctOpt: "B",
    options: [
      {
        key: "A",
        text: "Im lặng tiếp tục làm bài thực hành vì sợ báo cáo sẽ làm trễ tiến độ nộp bài của nhóm.",
        badge: "Nguy hiểm • Thiếu trách nhiệm an toàn",
        analysis: "Sự im lặng có thể dẫn đến tai nạn lao động nghiêm trọng, đe dọa trực tiếp tính mạng của chính bạn và các bạn cùng xưởng.",
        theory: "Quyền thụ hưởng môi trường giáo dục an toàn đòi hỏi nghĩa vụ giám sát và cảnh báo rủi ro vì lợi ích cộng đồng."
      },
      {
        key: "B",
        text: "Ngắt cầu dao khẩn cấp, gắn biển cảnh báo và báo cáo ngay cho giảng viên phụ trách xưởng.",
        badge: "Lựa chọn chuẩn mực • Bảo vệ an toàn tập thể",
        analysis: "Hành động kịp thời, chính xác theo đúng quy trình an toàn lao động và thể hiện tinh thần làm chủ môi trường học tập kỹ thuật.",
        theory: "Thực hành quyền kiểm tra, giám sát cơ sở vật chất theo Quy chế 31/NQ-HĐT của Hội đồng trường HaUI."
      },
      {
        key: "C",
        text: "Chụp ảnh quay video chế giễu máy cũ đăng lên TikTok để bạn bè né tránh.",
        badge: "Tiêu cực • Thiếu tinh thần xây dựng",
        analysis: "Đưa hình ảnh lên mạng nhằm câu view mà không giải quyết được sự cố, gây ảnh hưởng xấu đến hình ảnh nhà trường.",
        theory: "Phản biện có căn cứ đòi hỏi hành động đúng người, đúng kênh để khắc phục triệt để vấn đề thực tế."
      },
      {
        key: "D",
        text: "Tự mang kìm và băng keo cá nhân ra quấn lại dây điện rò rỉ.",
        badge: "Tự ý sai quy trình • Nguy cơ tai nạn cao",
        analysis: "Sửa chữa thiết bị điện công nghiệp khi chưa có thẩm quyền và dụng cụ chuyên dụng cách điện là hành vi nguy hiểm.",
        theory: "Dân chủ trong lao động kỹ thuật đòi hỏi tôn trọng quy trình nghiêm ngặt và phân công trách nhiệm rõ ràng."
      }
    ]
  },
  {
    id: 3,
    tag: "TÌNH HUỐNG 3 / 5 • ĐÁNH GIÁ GIẢNG VIÊN",
    question: "Hệ thống mở cổng đánh giá giảng viên cuối kỳ. Một số bạn rủ đánh giá 1 sao vì thầy kỷ luật nghiêm khắc về điểm danh. Bạn ứng xử ra sao?",
    correctOpt: "C",
    options: [
      {
        key: "A",
        text: "Nghe theo số đông đánh giá 1 sao vì nghĩ tập thể cùng vote thì không ai biết mình là ai.",
        badge: "Bầy đàn • Thiếu trung thực học thuật",
        analysis: "A dua bè phái làm sai lệch kết quả đo lường chất lượng đào tạo, gây tổn thương đến giảng viên tâm huyết và nghiêm túc.",
        theory: "Quyền dân chủ của cá nhân không được biến thành công cụ trả đũa cá nhân hoặc phục vụ động cơ thiếu trong sáng."
      },
      {
        key: "B",
        text: "Bỏ qua không tham gia đánh giá để khỏi phải suy nghĩ.",
        badge: "Thờ ơ • Bỏ rơi quyền dân chủ",
        analysis: "Không tham gia khảo sát là từ bỏ cơ hội góp phần nâng cao chất lượng giảng dạy của Nhà trường.",
        theory: "Quyền phản hồi của người học chỉ có giá trị thực chất khi được thực thi đầy đủ và có trách nhiệm."
      },
      {
        key: "C",
        text: "Đánh giá công tâm dựa trên chuẩn đầu ra, sự tận tâm và phương pháp truyền đạt của thầy.",
        badge: "Lựa chọn chuẩn mực • Khách quan & Xây dựng",
        analysis: "Rất chuẩn mực! Tôn trọng kỷ luật giảng đường đồng thời ghi nhận công tâm chất lượng giảng dạy giúp trường hoàn thiện đào tạo.",
        theory: "Biểu hiện của văn hóa dân chủ văn minh: Đánh giá bằng lương tâm nghề nghiệp, tôn trọng chân lý và sự thật khách quan."
      },
      {
        key: "D",
        text: "Nhắn tin riêng mặc cả với thầy: nếu thầy cho điểm A thì cả nhóm sẽ đánh giá 5 sao.",
        badge: "Vi phạm đạo đức nghiêm trọng",
        analysis: "Thương lượng điểm số là hành vi vi phạm nghiêm trọng quy chế thi cử và đạo đức người học.",
        theory: "Dân chủ XHCN triệt để bài trừ tiêu cực, hối lộ và chủ nghĩa cơ hội trong mọi lĩnh vực đời sống."
      }
    ]
  },
  {
    id: 4,
    tag: "TÌNH HUỐNG 4 / 5 • TIN GIẢ HỌC ĐƯỜNG TRÊN MẠNG",
    question: "Xuất hiện bài đăng không rõ nguồn trên mạng xã hội cho rằng trường tăng học phí đột ngột 50% trong học kỳ tới. Bạn xử lý thế nào?",
    correctOpt: "A",
    options: [
      {
        key: "A",
        text: "Kiểm tra thông báo trên Cổng sv.haui.edu.vn, giải thích cho bạn bè và báo cáo tin sai lệch.",
        badge: "Lựa chọn chuẩn mực • Bản lĩnh công dân số",
        analysis: "Xác minh thông tin từ nguồn chính thống và chủ động định hướng dư luận lành mạnh là hành động trách nhiệm cao.",
        theory: "Thực hiện quyền tiếp cận thông tin chính xác theo Luật Tiếp cận thông tin và Luật An ninh mạng 2018."
      },
      {
        key: "B",
        text: "Chia sẻ ngay bài viết về trang cá nhân kèm bình luận bức xúc mà không cần đối chiếu.",
        badge: "Tiếp tay tin giả • Vi phạm an ninh mạng",
        analysis: "Lan truyền thông tin chưa kiểm chứng khiến dư luận hoang mang, người chia sẻ có thể bị phạt hành chính theo Nghị định 15.",
        theory: "Tự do ngôn luận luôn đi kèm trách nhiệm pháp lý trước mỗi nút bấm 'Chia sẻ' trên không gian số."
      },
      {
        key: "C",
        text: "Bình luận thêm bớt tình tiết để bài viết tăng tương tác cho vui.",
        badge: "Xuyên tạc • Vô trách nhiệm",
        analysis: "Thổi phồng thông tin sai lệch gây tổn hại uy tín nhà trường và gây bất ổn tâm lý sinh viên toàn trường.",
        theory: "Bảo đảm kỷ cương pháp luật là điều kiện tiên quyết để giữ gìn môi trường dân chủ trong sạch."
      },
      {
        key: "D",
        text: "Kêu gọi bạn bè đóng băng tài khoản học phí để biểu tình phản đối.",
        badge: "Kích động cực đoan • Vi phạm kỷ luật",
        analysis: "Kêu gọi chống đối dựa trên tin thất thiệt là hành vi vi phạm pháp luật và kỷ luật sinh viên ở mức độ rất nghiêm trọng.",
        theory: "Dân chủ XHCN kiên quyết ngăn ngừa các thủ đoạn kích động, chia rẽ tập thể dưới vỏ bọc đấu tranh."
      }
    ]
  },
  {
    id: 5,
    tag: "TÌNH HUỐNG 5 / 5 • BẦU CỬ BAN CÁN SỰ & ĐOÀN HỘI",
    question: "Đại hội Chi đoàn / Lớp tổ chức bầu Ban cán sự mới cho năm học, bạn nhìn nhận quyền bầu cử của mình như thế nào?",
    correctOpt: "C",
    options: [
      {
        key: "A",
        text: "Điểm danh có mặt rồi bỏ phiếu trắng cho xong việc để kịp ra về.",
        badge: "Thờ ơ chính trị • Bỏ rơi quyền đại diện",
        analysis: "Bỏ phiếu chiếu lệ thể hiện sự thiếu trách nhiệm với tập thể lớp và đánh mất quyền lựa chọn người đại diện xứng đáng.",
        theory: "Bầu cử là quyền lực chính trị trực tiếp của công dân, đòi hỏi tinh thần trách nhiệm và sự lựa chọn có ý thức."
      },
      {
        key: "B",
        text: "Bầu cho bạn thân cùng phòng trọ dù bạn ấy thường xuyên nghỉ học và thiếu kỹ năng.",
        badge: "Cảm tính cá nhân • Thiếu công tâm",
        analysis: "Lựa chọn theo quan hệ thân quen mà bỏ qua năng lực lãnh đạo sẽ làm suy yếu phong trào và quyền lợi chung của lớp.",
        theory: "Dân chủ đại diện chỉ phát huy hiệu quả khi người được ủy quyền có đủ đức, đủ tài và tinh thần phụng sự."
      },
      {
        key: "C",
        text: "Nghiên cứu chương trình hành động, năng lực và uy tín của ứng viên để bỏ phiếu công tâm.",
        badge: "Lựa chọn chuẩn mực • Phát huy dân chủ đại diện",
        analysis: "Rất chuẩn xác! Cân nhắc thấu đáo dựa trên phẩm chất và năng lực thực tế tạo nên bộ máy tự quản vững mạnh cho tập thể.",
        theory: "Quyền bầu cử là hòn đá tảng của nền dân chủ, gắn liền với quyền kiểm tra và bãi miễn khi người đại diện không hoàn thành nhiệm vụ."
      },
      {
        key: "D",
        text: "Tổ chức lôi kéo bạn bè bỏ phiếu cho mình để sau này được ưu tiên chấm điểm rèn luyện.",
        badge: "Vận động tiêu cực • Chủ nghĩa cơ hội",
        analysis: "Trục lợi cá nhân từ chức danh tập thể làm băng hoại đạo đức sinh viên và phá vỡ sự đoàn kết của tập thể.",
        theory: "Dân chủ XHCN đối lập triệt để với các biểu hiện tham quyền, trục lợi và dân chủ hình thức."
      }
    ]
  }
];

// Helper functions for localized persistence
function getStoredSlides() {
  try {
    const raw = localStorage.getItem('REDMIND_CUSTOM_SLIDES_V2');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return DEFAULT_SLIDES;
}

function getStoredScenarios() {
  try {
    const raw = localStorage.getItem('REDMIND_CUSTOM_SCENARIOS_V2');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return DEFAULT_SCENARIOS;
}

let SLIDES = getStoredSlides();
let SCENARIOS = getStoredScenarios();
`;

// Replace old SLIDES definition
const oldSlidesRegex = /\/\/ 3\. SLIDES DATA FOR PRESENTATION MODE \(16:9\)[\s\S]*?const SLIDES = \[[\s\S]*?\];\s+const PROVOCATION_BANK = \[/;
appJs = appJs.replace(oldSlidesRegex, masterSlidesCode + '\nconst PROVOCATION_BANK = [');

fs.writeFileSync('app.js', appJs, 'utf8');
console.log('Successfully replaced SLIDES and SCENARIOS in app.js!');
