/**
 * RED MIND / HaUI - SƠ ĐỒ TƯ DUY SỐNG • 2026
 * Interactive Logic Engine
 * Đại học Công nghiệp Hà Nội • Bộ môn Chủ nghĩa xã hội khoa học
 */

// ==========================================================================
// 0. SECURITY & STRING UTILITIES (XSS Sanitizer & Vietnamese Search Normalizer)
// ==========================================================================
function escapeHTML(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function removeVietnameseTones(str) {
  if (!str) return '';
  str = String(str).toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, '');
  str = str.replace(/\u02C6|\u0306|\u031B/g, '');
  return str.trim();
}

// ==========================================================================
// 1. WEB AUDIO SYNTHESIZER (Sound Effects)
// ==========================================================================
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTone(freq = 440, type = 'sine', duration = 0.1, gainVal = 0.12) {
    if (!this.enabled) return;
    this.init();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio tone err:', e);
    }
  }

  click() { this.playTone(600, 'sine', 0.05, 0.08); }
  pop() { this.playTone(850, 'triangle', 0.08, 0.12); }
  alert() { 
    this.playTone(440, 'sawtooth', 0.15, 0.2); 
    setTimeout(() => this.playTone(330, 'sawtooth', 0.2, 0.2), 120);
  }
  success() {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
      setTimeout(() => this.playTone(f, 'sine', 0.2, 0.15), i * 100);
    });
  }
}

const audio = new SoundEngine();

// ==========================================================================
// 2. DATA SYSTEM: 6 BRANCHES WITH DEEP SCIENTIFIC SOCIALISM CONTENT
// ==========================================================================
const BRANCH_DATA = {
  1: {
    title: "1. BẢN CHẤT CỦA NỀN DÂN CHỦ XHCN Ở VIỆT NAM",
    question: "Bản chất vs Tuyên bố?",
    questionSubtitle: "Bản chất chính trị, kinh tế, văn hóa - tư tưởng",
    bulbTitle: "Quyền lực thuộc về Nhân dân",
    bulbText: "Dân chủ XHCN là nền dân chủ mang bản chất của giai cấp công nhân, phục vụ lợi ích của đa số nhân dân lao động, khác biệt hoàn toàn với dân chủ tư sản.",
    arguments: [
      "Bản chất chính trị: Do Đảng Cộng sản Việt Nam lãnh đạo; Nhà nước là công cụ chủ yếu thực thi quyền làm chủ của nhân dân.",
      "Bản chất kinh tế: Dựa trên chế độ công hữu về các tư liệu sản xuất chủ yếu; phát triển kinh tế thị trường định hướng XHCN nhằm giải phóng sức sản xuất và phân phối công bằng.",
      "Bản chất tư tưởng - văn hóa - xã hội: Lấy chủ nghĩa Mác - Lênin và tư tưởng Hồ Chí Minh làm nền tảng; phát huy quyền con người, quyền công dân gắn liền với kỷ cương pháp luật.",
      "Dân chủ không chỉ là quyền trên giấy mà phải được bảo đảm bằng thực lực kinh tế và hoàn thiện thể chế pháp luật."
    ],
    evidence: `
      <h4>⚖️ Căn cứ Văn kiện & Pháp lý:</h4>
      <ul class="evidence-list">
        <li><strong>Văn kiện Đại hội XIII của Đảng:</strong> "Dân là gốc", phát huy sức mạnh đại đoàn kết toàn dân tộc và quyền làm chủ của nhân dân.</li>
        <li><strong>Hiến pháp năm 2013 (Điều 2):</strong> "Nhà nước Cộng hòa xã hội chủ nghĩa Việt Nam là nhà nước pháp quyền xã hội chủ nghĩa của Nhân dân, do Nhân dân, vì Nhân dân."</li>
        <li><strong>Nghị quyết số 27-NQ/TW (Khóa XIII):</strong> Tiếp tục xây dựng và hoàn thiện Nhà nước pháp quyền XHCN Việt Nam trong giai đoạn mới.</li>
      </ul>
    `,
    lead: `
      <h4>🎙️ Lời Dẫn Thuyết Trình:</h4>
      <p class="lead-script">
        "Thưa Thầy Cô và các bạn, khi tiếp cận đề tài này, điều đầu tiên chúng ta phải làm rõ là: Nền dân chủ XHCN ở Việt Nam có bản chất là gì? Đó là nền dân chủ sâu sắc, rộng rãi, đặt con người vào vị trí trung tâm, bảo đảm quyền lực thực sự thuộc về nhân dân chứ không phải của thiểu số tài phiệt."
      </p>
    `,
    suggestions: [
      { id: "001", name: "Quyền dân chủ trong Hiến pháp 2013 (Điều 2, Điều 4)" },
      { id: "041", name: "Văn kiện Đại hội XIII về phát huy dân chủ XHCN" },
      { id: "045", name: "Bản chất giai cấp công nhân của nền dân chủ XHCN" },
      { id: "081", name: "Mối quan hệ giữa đổi mới kinh tế và đổi mới chính trị" }
    ]
  },

  2: {
    title: "2. CƠ CHẾ & PHÁP LUẬT THỰC HIỆN DÂN CHỦ",
    question: "Quyền ≠ Hiệu quả?",
    questionSubtitle: "Câu hỏi phản biện trung tâm",
    bulbTitle: "Quyền → Hiệu quả",
    bulbText: "Được thừa nhận quyền dân chủ không đồng nghĩa với việc quyền đó tự động được thực thi hiệu quả trong thực tiễn nếu thiếu cơ chế bảo đảm.",
    arguments: [
      "Quyền dân chủ được ghi nhận trong Hiến pháp và pháp luật là cơ sở quan trọng, nhưng việc thực thi còn phụ thuộc vào năng lực bộ máy và trách nhiệm giải trình.",
      "Tồn tại khoảng cách giữa 'quyền trên giấy' và 'hiệu quả trong đời sống' nếu thiếu cơ chế thanh tra, giám sát độc lập và minh bạch thông tin.",
      "Cơ chế dân chủ trực tiếp (bầu cử, trưng cầu ý dân) và dân chủ đại diện (Quốc hội, HĐND) phải được vận hành đồng bộ và kiểm soát quyền lực chặt chẽ.",
      "Để quyền dân chủ thực sự hiệu quả, cần sự vào cuộc đồng bộ của Nhà nước pháp quyền, các tổ chức chính trị - xã hội và ý thức công dân."
    ],
    evidence: `
      <h4>⚖️ Căn cứ Pháp lý & Thể chế:</h4>
      <ul class="evidence-list">
        <li><strong>Luật Thực hiện dân chủ ở cơ sở năm 2022:</strong> Quy định bắt buộc công khai thông tin, trách nhiệm người đứng đầu và quy trình Ban Thanh tra nhân dân hoạt động.</li>
        <li><strong>Nghị quyết số 203/2025/QH15 của Quốc hội:</strong> Về sửa đổi, bổ sung một số điều của Hiến pháp 2013 liên quan đến kiểm soát quyền lực và phòng chống tham nhũng tiêu cực.</li>
        <li><strong>Luật Tiếp cận thông tin 2016:</strong> Công dân có quyền được cung cấp thông tin minh bạch từ các cơ quan nhà nước và đơn vị sự nghiệp công lập.</li>
      </ul>
    `,
    lead: `
      <h4>🎙️ Lời Dẫn Thuyết Trình:</h4>
      <p class="lead-script">
        "Tại sao chúng tôi đặt câu hỏi 'Quyền có đồng nghĩa với Hiệu quả không?' Bởi vì một đạo luật dù tiến bộ đến đâu cũng sẽ trở nên vô nghĩa nếu người dân không biết cách sử dụng quyền của mình, hoặc các cơ quan thực thi né tránh trách nhiệm giải trình..."
      </p>
    `,
    suggestions: [
      { id: "002", name: "Luật Thực hiện dân chủ ở cơ sở 2022 (Luật số 10/2022/QH15)" },
      { id: "004", name: "Nghị quyết 203/2025/QH15 về cơ chế giám sát của Nhân dân" },
      { id: "051", name: "Cơ chế kiểm soát quyền lực nhà nước chống lạm quyền" },
      { id: "082", name: "Chuyển đổi số trong công khai, minh bạch thủ tục hành chính" }
    ]
  },

  3: {
    title: "3. NỘI DUNG PHƯƠNG CHÂM 'DÂN'",
    question: "Thụ hưởng có tự đến?",
    questionSubtitle: "Biết • Bàn • Làm • Kiểm tra • Giám sát • Thụ hưởng",
    bulbTitle: "Khép kín chu trình làm chủ",
    bulbText: "Đại hội XIII bổ sung hai khâu then chốt: 'Dân giám sát' và 'Dân thụ hưởng', hoàn thiện chu trình từ nhận thức đến kết quả thực tiễn.",
    arguments: [
      "Dân biết: Công khai, minh bạch các chủ trương, dự án, ngân sách và chính sách xã hội.",
      "Dân bàn: Lấy ý kiến nhân dân, đối thoại mở, không hình thức hóa các buổi tiếp xúc cử tri.",
      "Dân làm: Huy động sức sáng tạo và nguồn lực xã hội vào phát triển quê hương, đất nước.",
      "Dân kiểm tra & Dân giám sát: Kích hoạt vai trò Mặt trận Tổ quốc và từng công dân trong giám sát cán bộ, đảng viên.",
      "Dân thụ hưởng: Mọi thành quả của đổi mới phải được chia sẻ công bằng đến người dân, đặc biệt là y tế, giáo dục, an sinh xã hội."
    ],
    evidence: `
      <h4>⚖️ Căn cứ Lý luận & Đổi mới:</h4>
      <ul class="evidence-list">
        <li><strong>Văn kiện Đại hội XIII:</strong> Khẳng định phương châm hoàn chỉnh 6 vế: "Dân biết, dân bàn, dân làm, dân kiểm tra, dân giám sát, dân thụ hưởng".</li>
        <li><strong>Luật Mặt trận Tổ quốc Việt Nam 2015:</strong> Quy định về quyền và trách nhiệm phản biện xã hội đối với các dự thảo văn bản quy phạm pháp luật.</li>
      </ul>
    `,
    lead: `
      <h4>🎙️ Lời Dẫn Thuyết Trình:</h4>
      <p class="lead-script">
        "Một bước tiến vượt bậc của tư duy lý luận Đảng ta là bổ sung 'Dân thụ hưởng'. Dân chủ không thể là một khẩu hiệu suông; người dân đóng góp công sức thì thành quả phát triển kinh tế phải quay trở lại phục vụ đời sống ấm no, hạnh phúc của người dân..."
      </p>
    `,
    suggestions: [
      { id: "042", name: "Phân tích 6 vế phương châm Dân biết, dân bàn, dân làm..." },
      { id: "048", name: "Mối quan hệ giữa Dân giám sát và Dân thụ hưởng" },
      { id: "052", name: "Phản biện xã hội của Mặt trận Tổ quốc và các đoàn thể" },
      { id: "083", name: "Đo lường sự hài lòng của người dân qua chỉ số PAPI và SIPAS" }
    ]
  },

  4: {
    title: "4. THỰC TIỄN TẠI ĐẠI HỌC CÔNG NGHIỆP HÀ NỘI (HaUI)",
    question: "Thờ ơ học đường?",
    questionSubtitle: "Đời sống thực tế • Tình huống • Câu chuyện sinh viên",
    bulbTitle: "Tự chủ gắn liền Dân chủ",
    bulbText: "Tại HaUI, mô hình tự chủ đại học đòi hỏi sinh viên phải từ vị thế người thụ động sang vị thế chủ thể kiểm định chất lượng đào tạo.",
    arguments: [
      "Tình huống phòng thực hành: Khi thiết bị xưởng CNC hoặc phòng máy tính gặp sự cố, sinh viên chủ động phản ánh qua cổng sv.haui.edu.vn chính là thực hành quyền 'Dân kiểm tra'.",
      "Khảo sát đánh giá giảng viên: Đánh giá trung thực, khách quan cuối mỗi kỳ học là kênh phản hồi chất lượng đào tạo của sinh viên.",
      "Quy chế đối thoại định kỳ: Ban Giám hiệu và các Khoa tổ chức đối thoại trực tiếp hàng kỳ với đại diện các lớp.",
      "Thực hiện công khai tài chính và học bổng: Tiêu chí xét học bổng khuyến khích học tập và miễn giảm học phí được niêm yết rõ ràng theo Quy chế 31/NQ-HĐT."
    ],
    evidence: `
      <h4>⚖️ Căn cứ Quy chế HaUI & Thực tiễn:</h4>
      <ul class="evidence-list">
        <li><strong>Quy chế số 31/NQ-HĐT của Hội đồng trường HaUI:</strong> Quy định chi tiết quyền của người học về phản hồi chất lượng đào tạo và giám sát cơ sở vật chất.</li>
        <li><strong>Hệ thống Đại học điện tử HaUI (e-HaUI):</strong> Kênh tiếp nhận ý kiến đóng góp trực tuyến 24/7 của sinh viên tại cổng <code>sv.haui.edu.vn</code>.</li>
        <li><strong>Đoàn Thanh niên - Hội Sinh viên HaUI:</strong> Cầu nối đại diện bảo vệ quyền và lợi ích hợp pháp của hơn 30.000 sinh viên toàn trường.</li>
      </ul>
    `,
    lead: `
      <h4>🎙️ Lời Dẫn Thuyết Trình:</h4>
      <p class="lead-script">
        "Thưa các bạn sinh viên HaUI, dân chủ không nằm ở đâu xa xôi. Nó hiện hữu ngay trong phòng lab xưởng máy cơ khí, phòng máy tính khoa CNTT, trong việc chúng ta góp ý thời khóa biểu và đánh giá môn học..."
      </p>
    `,
    suggestions: [
      { id: "101", name: "Quy chế số 31/NQ-HĐT của Hội đồng trường HaUI" },
      { id: "102", name: "Quy định đối thoại học đường định kỳ giữa Ban Giám hiệu và sinh viên" },
      { id: "105", name: "Cổng thông tin sinh viên HaUI và kênh phản ánh trực tuyến" },
      { id: "110", name: "Khảo sát ý kiến sinh viên về chất lượng giảng dạy và cơ sở vật chất" }
    ]
  },

  5: {
    title: "5. PHẢN BIỆN CÓ CHIỀU SÂU",
    question: "Phản biện hay Bất mãn?",
    questionSubtitle: "Tư duy độc lập • Tranh luận văn minh • Đấu tranh chống ngụy biện",
    bulbTitle: "Phản biện mang tính xây dựng",
    bulbText: "Phản biện dân chủ chân chính khác biệt bản chất với tư tưởng bất mãn, công kích cá nhân hay lợi dụng tự do để chống phá.",
    arguments: [
      "Phản biện dựa trên chứng cứ khoa học, văn bản pháp luật và tinh thần xây dựng giải pháp thay vì chỉ trích tiêu cực.",
      "Đấu tranh chống lại các luận điệu xuyên tạc, phủ nhận bản chất ưu việt của nền dân chủ XHCN hoặc cổ xúy dân chủ đa nguyên tư sản.",
      "Nhận diện ngụy biện 'tự do vô chính phủ': Quyền tự do của một người không được xâm phạm đến quyền và lợi ích hợp pháp của người khác và cộng đồng.",
      "Kỹ năng tranh luận văn minh của sinh viên: Lắng nghe đa chiều, dùng lý lẽ thuyết phục, tôn trọng sự thật khách quan."
    ],
    evidence: `
      <h4>⚖️ Căn cứ Pháp lý & Bảo vệ Nền tảng:</h4>
      <ul class="evidence-list">
        <li><strong>Nghị quyết số 35-NQ/TW của Bộ Chính trị:</strong> Về tăng cường bảo vệ nền tảng tư tưởng của Đảng, đấu tranh phản bác các quan điểm sai trái, thù địch.</li>
        <li><strong>Luật An ninh mạng năm 2018:</strong> Xử phạt nghiêm các hành vi tán phát tin giả, vu khống, xúc phạm danh dự nhân phẩm trên không gian mạng.</li>
      </ul>
    `,
    lead: `
      <h4>🎙️ Lời Dẫn Thuyết Trình:</h4>
      <p class="lead-script">
        "Làm thế nào để sinh viên kỹ thuật rèn luyện tư duy phản biện sắc sảo mà không rơi vào cái bẫy của sự bất mãn mù quáng? Đó chính là văn hóa phản biện có căn cứ, văn minh và hướng tới sự tiến bộ chung..."
      </p>
    `,
    suggestions: [
      { id: "049", name: "Nghị quyết 35-NQ/TW về bảo vệ nền tảng tư tưởng của Đảng" },
      { id: "050", name: "Nhận diện và phê phán các luận điệu xuyên tạc về dân chủ ở Việt Nam" },
      { id: "084", name: "Kỹ năng phản biện xã hội trên không gian mạng của giới trẻ" },
      { id: "090", name: "Đạo đức tranh luận học thuật và quy tắc ứng xử văn minh" }
    ]
  },

  6: {
    title: "6. SINH VIÊN CẦN LÀM GÌ ĐỂ PHÁT HUY BẢN CHẤT DÂN CHỦ XHCN?",
    question: "Hành động thiết thực?",
    questionSubtitle: "Nhận thức • Tham gia • Trách nhiệm • Sáng tạo",
    bulbTitle: "Từ Nhận Thức đến Hành Động",
    bulbText: "Sinh viên không đứng ngoài cuộc; mỗi hành động thượng tôn pháp luật và trách nhiệm cộng đồng đều góp phần bồi đắp nền dân chủ.",
    arguments: [
      "Nâng cao nhận thức chính trị: Học tập nghiêm túc các môn lý luận chính trị, hiểu đúng quyền và nghĩa vụ công dân.",
      "Chủ động thực hành dân chủ học đường: Tham gia bầu Ban cán sự lớp, đóng góp ý kiến xây dựng Đoàn - Hội, tham gia khảo sát chất lượng giảng dạy.",
      "Thực hiện lối sống thượng tôn pháp luật: Tuân thủ nội quy trường học, Luật Giao thông, Luật An ninh mạng.",
      "Trách nhiệm xã hội và cộng đồng: Tích cực tham gia các hoạt động tình nguyện hè, hiến máu nhân đạo, ứng dụng chuyên môn kỹ thuật vào phục vụ xã hội."
    ],
    evidence: `
      <h4>⚖️ Căn cứ Chương trình Hành động:</h4>
      <ul class="evidence-list">
        <li><strong>Chiến lược phát triển thanh niên Việt Nam giai đoạn 2021 - 2030:</strong> Xây dựng thế hệ thanh niên giàu lòng yêu nước, có bản lĩnh chính trị và tri thức cao.</li>
        <li><strong>Chương trình công tác Đoàn & Phong trào thanh niên HaUI 2026:</strong> Đẩy mạnh phong trào "Sinh viên 5 tốt" và nghiên cứu khoa học phục vụ cộng đồng.</li>
      </ul>
    `,
    lead: `
      <h4>🎙️ Lời Dẫn Thuyết Trình:</h4>
      <p class="lead-script">
        "Kết thúc bài thuyết trình, chúng em xin khẳng định: Dân chủ XHCN không phải là điều gì trừu tượng. Với sinh viên Đại học Công nghiệp Hà Nội, phát huy dân chủ bắt đầu từ việc học thật, thi thật, dám nói lên tiếng nói xây dựng vì một mái trường HaUI văn minh, hiện đại!"
      </p>
    `,
    suggestions: [
      { id: "005", name: "Chiến lược phát triển thanh niên Việt Nam 2021 - 2030" },
      { id: "103", name: "Tiêu chí phong trào Sinh viên 5 tốt tại HaUI" },
      { id: "108", name: "Ứng dụng chuyên môn kỹ thuật vào hoạt động tình nguyện vì cộng đồng" },
      { id: "120", name: "Sổ tay văn hóa học đường và quy tắc ứng xử sinh viên HaUI" }
    ]
  }
};

// ==========================================================================
// 3. SLIDES DATA FOR PRESENTATION MODE (16:9)
// ==========================================================================
// ==========================================================================
// 3. MASTER SLIDES DATA FOR PROJECTOR PRESENTATION (16:9 LECTURE HALL)
// ==========================================================================
const DEFAULT_SLIDES = [
  // CẢNH 0: TỔNG QUAN & MỞ ĐẦU
  {
    title: "BẢN CHẤT CỦA NỀN DÂN CHỦ XÃ HỘI CHỦ NGHĨA Ở VIỆT NAM",
    badge: "HaUI 2026 • BÀI THUYẾT TRÌNH GIẢNG ĐƯỜNG",
    bgImage: "assets/bg-intro.jpg",
    notes: "Chào giảng viên và các bạn sinh viên. Hôm nay nhóm xin trình bày đề tài Bản chất nền dân chủ xã hội chủ nghĩa ở Việt Nam và hành động của sinh viên Đại học Công nghiệp Hà Nội.",
    html: `
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
    `
  },

  // CẢNH 1: BẢN CHẤT TOÀN DIỆN (CHÍNH TRỊ, KINH TẾ, VĂN HÓA)
  {
    title: "1. BẢN CHẤT CỦA NỀN DÂN CHỦ XÃ HỘI CHỦ NGHĨA",
    badge: "LÝ LUẬN MÁC - LÊNIN & TƯ TƯỞNG HỒ CHÍ MINH",
    bgImage: "assets/bg-nature.jpg",
    notes: "Phân tích 3 trụ cột hữu cơ: Bản chất Chính trị (giai cấp công nhân, Đảng lãnh đạo), Bản chất Kinh tế (công hữu TLSX), Bản chất Văn hóa - Xã hội (con người là trung tâm).",
    html: `
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
    `
  },

  // CẢNH 2: MỐI QUAN HỆ VỚI NHÀ NƯỚC PHÁP QUYỀN
  {
    title: "2. MỐI QUAN HỆ GIỮA DÂN CHỦ VÀ PHÁP LUẬN KỶ CƯƠNG",
    badge: "NHÀ NƯỚC PHÁP QUYỀN XÃ HỘI CHỦ NGHĨA",
    bgImage: "assets/bg-law.jpg",
    notes: "Làm rõ: Không có dân chủ đứng ngoài pháp luật. Dân chủ đại diện và dân chủ trực tiếp là hai phương thức song hành.",
    html: `
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
    `
  },

  // CẢNH 3: NỘI DUNG CHU TRÌNH 6 BƯỚC "DÂN"
  {
    title: "3. CHU TRÌNH 6 CHỮ DÂN TRONG THỰC TIỄN",
    badge: "NGUYÊN TẮC HÀNH ĐỘNG ĐẠI HỘI XIII",
    bgImage: "assets/bg-law.jpg",
    notes: "Nhấn mạnh chu trình khép kín: Dân biết, dân bàn, dân làm, dân kiểm tra, dân giám sát, và đích đến tối thượng là DÂN THỤ HƯỞNG.",
    html: `
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
    `
  },

  // CẢNH 4: THỰC TIỄN TẠI ĐẠI HỌC CÔNG NGHIỆP HÀ NỘI
  {
    title: "4. THỰC HÀNH DÂN CHỦ TẠI ĐẠI HỌC CÔNG NGHIỆP HÀ NỘI",
    badge: "THỰC TIỄN SINH VIÊN HaUI 2026",
    bgImage: "assets/bg-haui.jpg",
    notes: "Liên hệ trực tiếp với cơ sở đào tạo: Cổng sinh viên sv.haui.edu.vn, Hội nghị đối thoại BGH, an toàn xưởng CNC và đánh giá giảng viên.",
    html: `
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
    `
  },

  // CẢNH 5: TRÒ CHƠI TƯƠNG TÁC TÌNH HUỐNG
  {
    title: "5. TƯƠNG TÁC GIẢNG ĐƯỜNG: BẠN SẼ LÀM GÌ?",
    badge: "ĐẤU TRƯỜNG TÌNH HUỐNG THỰC TẾ",
    bgImage: "assets/bg-intro.jpg",
    notes: "Mời cả lớp tương tác trực tiếp. Người thuyết trình đọc câu hỏi tình huống, mời các bạn chọn đáp án A/B/C/D và bấm xem phân tích.",
    html: `
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
    `
  },

  // CẢNH 6: KẾT LUẬN & TRÁCH NHIỆM SINH VIÊN
  {
    title: "6. KẾT LUẬN: TRÁCH NHIỆM VÀ SỨ MỆNH KỸ SƯ TRẺ",
    badge: "TỔNG KẾT BÀI BÁO CÁO • HaUI 2026",
    bgImage: "assets/bg-conclusion.jpg",
    notes: "Tổng kết bài học: Hiểu đúng bản chất, tham gia có trách nhiệm, phản biện có căn cứ. Trở thành kỹ sư HaUI vừa hồng vừa chuyên.",
    html: `
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
    `
  }
];

// 4. MASTER 5 LECTURE HALL INTERACTIVE SCENARIOS
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

function getStoredSlides() {
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
}

function getStoredScenarios() {
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem('REDMIND_CUSTOM_SCENARIOS_V2');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    }
  } catch (e) {}
  return JSON.parse(JSON.stringify(DEFAULT_SCENARIOS));
}

let SLIDES = getStoredSlides();
let SCENARIOS = getStoredScenarios();


// ==========================================================================
// 4. DEBATE ARENA TOPICS & SAMPLE TEAMS DATA
// ==========================================================================
const PROVOCATION_BANK = [
  {
    id: 1,
    badge: "Nhánh 1 • Bản chất Giai cấp",
    title: "Nhánh 1: Bản chất Giai cấp & Dân chủ XHCN vs Dân chủ Tư sản",
    statement: "Nhiều người cho rằng: Nước ta chỉ có một Đảng cầm quyền thì làm sao có dân chủ thật sự? Muốn có dân chủ thì phải đa nguyên, đa đảng cạnh tranh như các nước tư sản phương Tây, vì chỉ khi có nhiều đảng đối lập thì người dân mới có quyền tự do lựa chọn và quyền lực mới không bị tha hóa.",
    target: "Bẻ gãy luận điệu đánh đồng 'đa đảng = dân chủ'; khẳng định bản chất giai cấp công nhân bảo vệ đại đa số nhân dân lao động của Dân chủ XHCN; vạch trần bản chất dân chủ tư sản bị chi phối bởi các tập đoàn tài phiệt (Super PACs) và tiền tệ.",
    legalHints: "Giáo trình CNXHKH (Bộ GD&ĐT); Báo cáo Oxfam (1% người giàu nhất chiếm 40% tài sản toàn cầu); Bản chất kinh tế dựa trên chế độ công hữu tư liệu sản xuất chủ yếu; Lịch sử cách mạng Việt Nam.",
    sample: "Luận điểm trên ngụy biện khi đánh đồng hình thức 'đa đảng' với bản chất 'dân chủ'. Thứ nhất, về bản chất giai cấp, Dân chủ tư sản dù có nhiều đảng cạnh tranh thì bản chất vẫn là nền dân chủ của thiểu số giai cấp tư sản. Thực tiễn các nước phương Tây cho thấy chính trường bị chi phối bởi các siêu ủy ban hành động chính trị (Super PACs) và vận động hành lang tiền tệ (lobbying); báo cáo Oxfam chỉ ra 1% tài phiệt nắm giữ hơn 40% tài sản toàn cầu. Thứ hai, Dân chủ XHCN ở Việt Nam mang bản chất giai cấp công nhân, đại diện và bảo vệ quyền lợi của tuyệt đại đa số nhân dân lao động. Vai trò lãnh đạo duy nhất của Đảng Cộng sản Việt Nam là sự lựa chọn lịch sử của toàn thể dân tộc qua các cuộc kháng chiến giải phóng đất nước. Quyền lực nhà nước không phân chia cho các phe phái tư bản đấu đá mà thuộc trọn vẹn về Nhân dân, với mục tiêu cao nhất là công bằng xã hội, giải phóng con người và không ai bị bỏ lại phía sau."
  },
  {
    id: 2,
    badge: "Nhánh 2 • Kỷ cương Pháp quyền",
    title: "Nhánh 2: Dân chủ & Kỷ cương Pháp quyền XHCN (Hiến pháp 2013)",
    statement: "Có ý kiến tuyên bố: Đã gọi là dân chủ thì công dân và sinh viên phải có quyền tự do ngôn luận tuyệt đối, muốn viết gì trên mạng xã hội hay nói gì ở giảng đường cũng được. Việc Nhà nước áp dụng Luật An ninh mạng và xử lý các phát ngôn sai lệch thực chất là đang bóp nghẹt quyền tự do dân chủ của người dân.",
    target: "Bẻ gãy tư tưởng tự do vô chính phủ; làm rõ mối quan hệ biện chứng giữa Dân chủ và Kỷ cương Pháp quyền; khẳng định quyền tự do của mỗi cá nhân luôn bị giới hạn bởi quyền lợi hợp pháp của người khác và an ninh quốc gia.",
    legalHints: "Hiến pháp năm 2013 (Điều 2, Điều 8, Điều 14); Nghị quyết 203/2025/QH15; Luật An ninh mạng 2018 (Điều 8, Điều 16); Bộ luật Dân sự 2015 (bảo vệ danh dự, nhân phẩm).",
    sample: "Quan điểm trên hoàn toàn sai lầm khi nhầm lẫn giữa 'dân chủ' với 'tự do vô chính phủ'. Thứ nhất, theo triết học Mác - Lênin và luật học hiện đại, không có nền dân chủ hay quyền tự do nào là tuyệt đối, phi giai cấp và đứng ngoài pháp luật. Điều 14 Hiến pháp 2013 quy định rõ: Quyền con người, quyền công dân chỉ có thể bị hạn chế theo quy định của luật vì lý do quốc phòng, an ninh quốc gia, trật tự an toàn xã hội, đạo đức xã hội và sức khỏe của cộng đồng. Thứ hai, tự do của một cá nhân kết thúc ở nơi quyền lợi hợp pháp của người khác bắt đầu. Việc xử lý các hành vi vu khống, phát tán tin giả hay kích động bạo lực theo Luật An ninh mạng 2018 không hề bóp nghẹt dân chủ, mà trái lại chính là biện pháp pháp quyền tối thượng để bảo vệ quyền được sống an toàn, tiếp cận thông tin trung thực của 100 triệu người dân. Dân chủ mà thiếu kỷ cương pháp luật sẽ biến thành sự hỗn loạn và độc tài của tin giả."
  },
  {
    id: 3,
    badge: "Nhánh 3 • Vế 'Dân thụ hưởng'",
    title: "Nhánh 3: Cơ chế 6 chữ Dân & Vế 'Dân thụ hưởng' (Đại hội XIII)",
    statement: "Có người lập luận: Phương châm 'Dân biết, dân bàn, dân làm, dân kiểm tra, dân giám sát, dân thụ hưởng' của Đảng chỉ là khẩu hiệu tuyên truyền cho hay. Trong nền kinh tế thị trường, kẻ nào có tiền người đó mới được hưởng, người dân lao động và sinh viên nghèo làm sao có thể 'thụ hưởng' được thành quả phát triển gì thực chất?",
    target: "Bẻ gãy thái độ hoài nghi yếm thế; làm nổi bật bước phát triển lý luận đột phá của Đại hội XIII khi bổ sung vế 'Dân thụ hưởng' làm thước đo hiệu quả của hệ thống chính trị; chứng minh bản chất ưu việt phân phối công bằng XHCN.",
    legalHints: "Văn kiện Đại hội XIII của Đảng; Thành tựu giảm nghèo đa chiều bền vững (UNDP công nhận); Độ bao phủ BHYT toàn dân >93%; Chính sách tín dụng sinh viên và đầu tư phòng lab máy tính HaUI.",
    sample: "Lập luận trên thể hiện cái nhìn phiến diện và phủ nhận những bước tiến lý luận cũng như thành quả cách mạng thực tế. Thứ nhất, việc Đại hội XIII bổ sung thành tố 'Dân thụ hưởng' vào phương châm hành động đã biến dân chủ từ khẩu hiệu chính trị thành thước đo kiểm định thực chất của mọi chính sách: Lấy sự hài lòng, hạnh phúc và ấm no của nhân dân làm tiêu chuẩn tối cao. Thứ hai, thành quả 'thụ hưởng' không chỉ là tiền mặt trong túi, mà là hệ thống hạ tầng y tế, giao thông công cộng, chính sách BHYT bao phủ trên 93% dân số, và chương trình giảm nghèo đa chiều được Liên Hợp Quốc công nhận là điểm sáng toàn cầu. Đối với sinh viên, 'dân thụ hưởng' thể hiện qua chính sách tín dụng đào tạo ưu đãi, phòng lab máy tính hiện đại được đầu tư bằng ngân sách công và quyền được học tập trong môi trường hòa bình, ổn định. Bản chất kinh tế thị trường định hướng XHCN bảo đảm của cải xã hội không bị thâu tóm vào túi một nhóm thiểu số mà quay lại phục vụ cuộc sống nhân dân."
  },
  {
    id: 4,
    badge: "Nhánh 4 • HaUI & Quy chế 31",
    title: "Nhánh 4: Thực tiễn Tự chủ HaUI & Quy chế 31/NQ-HĐT",
    statement: "Có ý kiến cho rằng: Sinh viên HaUI bỏ tiền đóng học phí thì chỉ đơn thuần là 'khách hàng' mua dịch vụ đào tạo, việc quản lý trường học và thực hiện Quy chế 31/NQ-HĐT là việc của Ban Giám hiệu và Hội đồng trường. Sinh viên chỉ cần tập trung học cho qua môn, việc gì phải quan tâm đến dân chủ học đường hay giám sát thiết bị phòng máy xưởng lab?",
    target: "Bẻ gãy tư duy thương mại hóa giáo dục biến người học thành khách hàng thụ động; khẳng định sinh viên là chủ thể trung tâm của tự chủ đại học; phân tích quyền và nghĩa vụ kiểm tra, giám sát theo Quy chế 31/NQ-HĐT của Hội đồng trường HaUI.",
    legalHints: "Quy chế 31/NQ-HĐT Hội đồng trường HaUI; Cổng thông tin đào tạo sv.haui.edu.vn; App MyHaUI; Hội nghị đối thoại thường niên với Hiệu trưởng; Case study giám sát thiết bị phòng lab IoT và xưởng CNC.",
    sample: "Quan điểm trên hoàn toàn lệch lạc, biến mối quan hệ giáo dục cao quý thành mối quan hệ mua bán thương mại tầm thường. Thứ nhất, theo bản chất của Dân chủ XHCN và Luật Giáo dục Đại học, người học là trung tâm và là chủ thể của nhà trường, chứ không phải khách hàng đứng ngoài lề. Thứ hai, Quy chế số 31/NQ-HĐT của Hội đồng trường HaUI quy định rõ sinh viên có quyền và nghĩa vụ được 'Biết' về định mức cơ sở vật chất, được 'Bàn' về kế hoạch đào tạo, và được 'Kiểm tra, giám sát' trang thiết bị giảng đường. Nếu sinh viên thờ ơ không phản ánh máy xưởng CNC rò điện, máy tính lab IoT hỏng hóc qua cổng sv.haui.edu.vn, người chịu thiệt hại đầu tiên về an toàn lao động và kỹ năng nghề nghiệp chính là bản thân sinh viên. Tham gia thực hành dân chủ học đường chính là bài thực tập làm chủ xã hội quan trọng nhất của mỗi kỹ sư HaUI trước khi bước vào thị trường lao động."
  },
  {
    id: 5,
    badge: "Nhánh 5 • Điểm nghẽn & Giải trình",
    title: "Nhánh 5: 4 Điểm nghẽn Thể chế & Trách nhiệm giải trình SLA",
    statement: "Có sinh viên nhận xét: Việc lấy ý kiến đánh giá giảng viên cuối kỳ và hòm thư phản ánh ở trường chỉ là 'thủ tục hình thức làm màu'. Nếu phản ánh thật thì sợ bị thầy cô trù dập điểm số, nên tốt nhất là 'im lặng là vàng', chấm 5/5 cho xong chuyện hoặc nếu bức xúc thì lên hội nhóm confession ẩn danh bóc phốt là nhanh nhất!",
    target: "Bẻ gãy tâm lý tiêu cực thỏa hiệp với bệnh hình thức; vạch rõ tác hại và rủi ro pháp lý của confession ẩn danh; đề xuất giải pháp pháp quyền dựa trên Luật Thực hiện dân chủ ở cơ sở 2022 và quy chế bảo vệ người phản ánh.",
    legalHints: "Luật Thực hiện dân chủ ở cơ sở 2022 (Điều 8, Điều 9); Luật Tố cáo 2018 (bảo vệ danh tính và nghiêm cấm trù dập người phản ánh); Chuẩn SLA giải trình không quá 7 ngày; Kênh phản ánh bảo mật của Phòng Thanh tra - Khảo thí HaUI.",
    sample: "Quan điểm này vừa biểu hiện của sự thụ động thỏa hiệp, vừa thể hiện sự thiếu hiểu biết về văn hóa pháp quyền. Thứ nhất, việc đánh giá giảng viên chiếu lệ 5/5 cho xong chính là hành vi dung túng cho bệnh hình thức - một trong 4 điểm nghẽn thể chế nghiêm trọng nhất, làm suy giảm trực tiếp chất lượng bằng cấp của toàn thể sinh viên HaUI. Thứ hai, Điều 8 và Điều 9 Luật Thực hiện dân chủ ở cơ sở 2022 cùng Luật Tố cáo 2018 quy định nghiêm cấm mọi hành vi trù dập người phản ánh; hệ thống khảo sát của HaUI hoàn toàn ẩn danh và phân quyền chặt chẽ. Thứ ba, việc lên confession bóc phốt ẩn danh không giải quyết được gốc rễ vấn đề mà còn có nguy cơ vi phạm Luật An ninh mạng vì lan truyền thông tin một chiều, bôi nhọ uy tín tổ chức. Con đường đúng đắn của người trí thức là sử dụng các kênh chính danh theo Quy chế 31/NQ-HĐT, yêu cầu nhà trường thực hiện trách nhiệm giải trình minh bạch theo đúng chuẩn SLA không quá 7 ngày."
  },
  {
    id: 6,
    badge: "Nhánh 6 • Kỹ sư Vừa Hồng Vừa Chuyên",
    title: "Nhánh 6: Sứ mệnh & Đạo đức Kỹ sư 4.0 'Vừa Hồng Vừa Chuyên'",
    statement: "Có ý kiến khẳng định: Sinh viên các khối ngành kỹ thuật công nghệ như CNTT, Cơ khí, Robot, Ô tô của HaUI chỉ cần cày thuật toán giỏi, tay nghề thực hành cơ khí siêu để ra trường kiếm lương nghìn đôla. Học Chủ nghĩa xã hội khoa học và rèn luyện đạo đức chính trị dân chủ chỉ là lý thuyết suông, không giúp gì cho việc viết code hay gia công chi tiết máy!",
    target: "Bẻ gãy tư tưởng kỹ trị phi chính trị; chứng minh mối quan hệ hữu cơ giữa kỹ thuật và lý luận chính trị; khẳng định chuẩn mực kỹ sư thế hệ mới 4.0 'vừa hồng vừa chuyên' của Chủ tịch Hồ Chí Minh trong kỷ nguyên số.",
    legalHints: "Lời dạy của Chủ tịch Hồ Chí Minh: 'Có tài mà không có đức là người vô dụng, có đức mà không có tài thì làm việc gì cũng khó'; Đạo đức công nghệ (AI Ethics), an ninh mạng và chủ quyền số quốc gia; Nghị quyết 52-NQ/TW về tham gia CMCN 4.0; Sứ mệnh Đại học Công nghiệp Hà Nội.",
    sample: "Lập luận này mắc sai lầm nghiêm trọng của tư duy kỹ trị mù quáng. Bác Hồ từng căn dặn: 'Có tài mà không có đức là người vô dụng, có đức mà không có tài thì làm việc gì cũng khó'. Một kỹ sư CNTT giỏi lập trình nhưng thiếu thế giới quan Mác - Lênin và đạo đức công dân có thể dễ dàng bị lôi kéo viết mã độc tấn công hạ tầng quốc gia, thiết kế app cờ bạc lừa đảo nhân dân hoặc tạo ra thuật toán phân biệt đối xử. Một kỹ sư cơ khí giỏi tay nghề nhưng thiếu ý thức dân chủ và kỷ cương an toàn lao động sẽ bỏ qua quy trình kỹ thuật, gây tai nạn thảm khốc cho đồng đội. Môn Chủ nghĩa xã hội khoa học không dạy cách viết dòng lệnh hay đứng máy phay, nhưng trang bị cho sinh viên HaUI kim chỉ nam: Công nghệ làm ra để phục vụ ai? Kỹ thuật phát triển để giải phóng con người hay để nô dịch con người? Một kỹ sư HaUI đích thực thời đại 4.0 bắt buộc phải 'vừa hồng vừa chuyên', dùng công nghệ số để xây dựng đất nước Việt Nam hùng cường và bảo vệ chủ quyền số quốc gia."
  }
];

let debateTeams = [
  {
    rank: 1,
    team: "Nhóm 1 - Khoa CNTT",
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
    team: "Nhóm 2 - Khoa Cơ khí",
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
    team: "Nhóm 3 - Khoa Điện",
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
    team: "Nhóm 4 - Khoa QLKD",
    leader: "Đỗ Mai Trang",
    score: 82,
    crit1: 32,
    crit2: 28,
    crit3: 22,
    type: "Khá",
    argument: "Tự chủ đại học đòi hỏi trách nhiệm giải trình và sự tham gia của các bên liên quan, trong đó sinh viên là khách hàng và chủ thể trung tâm của chất lượng giáo dục.",
    remark: "Góc nhìn quản trị kinh doanh khá tốt, nhưng cần nhấn mạnh hơn bản chất chính trị XHCN."
  }
];

// ==========================================================================
// 5. THƯ VIỆN TƯ LIỆU THAM CHIẾU & QUY CHẾ CHUẨN XÁC (32 NGUỒN XÁC THỰC)
// ==========================================================================
const REFERENCES_DB = [
  // Nhóm 1: Pháp luật & Văn kiện Đảng (8 nguồn)
  {
    id: "001",
    category: "law",
    title: "Hiến pháp nước Cộng hòa Xã hội chủ nghĩa Việt Nam năm 2013 (Điều 2, Điều 4, Điều 14, Điều 28)",
    source: "Cổng Thông tin Điện tử Chính phủ",
    link: "https://chinhphu.vn"
  },
  {
    id: "002",
    category: "law",
    title: "Luật Thực hiện dân chủ ở cơ sở năm 2022 (Luật số 10/2022/QH15)",
    source: "Cổng Thông tin Điện tử Quốc hội",
    link: "https://quochoi.vn"
  },
  {
    id: "003",
    category: "law",
    title: "Nghị quyết số 27-NQ/TW về tiếp tục xây dựng và hoàn thiện Nhà nước pháp quyền XHCN Việt Nam",
    source: "Báo Điện tử Đảng Cộng sản Việt Nam",
    link: "https://dangcongsan.vn"
  },
  {
    id: "004",
    category: "law",
    title: "Luật Mặt trận Tổ quốc Việt Nam năm 2015 (Quy định về phản biện xã hội và giám sát nhân dân)",
    source: "Cổng Thông tin Điện tử Chính phủ",
    link: "https://chinhphu.vn"
  },
  {
    id: "005",
    category: "law",
    title: "Luật Tiếp cận thông tin năm 2016 (Luật số 104/2016/QH13 - Công khai minh bạch hoạt động cơ quan)",
    source: "Cổng Thông tin Điện tử Chính phủ",
    link: "https://chinhphu.vn"
  },
  {
    id: "006",
    category: "law",
    title: "Luật Thanh niên năm 2020 và Chiến lược phát triển thanh niên Việt Nam giai đoạn 2021 - 2030",
    source: "Bộ Nội vụ",
    link: "https://moha.gov.vn"
  },
  {
    id: "007",
    category: "law",
    title: "Luật An ninh mạng năm 2018 (Luật số 24/2018/QH14 - Trách nhiệm hành vi trên không gian số)",
    source: "Cổng Thông tin Điện tử Quốc hội",
    link: "https://quochoi.vn"
  },
  {
    id: "008",
    category: "law",
    title: "Nghị định số 59/2023/NĐ-CP quy định chi tiết một số điều của Luật Thực hiện dân chủ ở cơ sở",
    source: "Cơ sở dữ liệu Quốc gia về Văn bản Pháp luật",
    link: "https://vbpl.vn"
  },

  // Nhóm 2: Lý luận Học thuật Mác - Lênin & Tư tưởng Hồ Chí Minh (8 nguồn)
  {
    id: "041",
    category: "academic",
    title: "Giáo trình Chủ nghĩa xã hội khoa học (Bộ GD&ĐT, NXB Chính trị Quốc gia Sự thật)",
    source: "Nhà xuất bản Chính trị Quốc gia Sự thật",
    link: "https://nxbctqg.org.vn"
  },
  {
    id: "042",
    category: "academic",
    title: "Giáo trình Triết học Mác - Lênin (Bộ GD&ĐT dành cho bậc đại học hệ không chuyên)",
    source: "Nhà xuất bản Chính trị Quốc gia Sự thật",
    link: "https://nxbctqg.org.vn"
  },
  {
    id: "043",
    category: "academic",
    title: "V.I. Lênin: Toàn tập, Tập 33 - 'Nhà nước và Cách mạng' (Bàn về nền dân chủ vô sản)",
    source: "Thư viện Quốc gia Việt Nam",
    link: "https://nlv.gov.vn"
  },
  {
    id: "044",
    category: "academic",
    title: "Hồ Chí Minh Toàn tập, Tập 15: Bàn về Dân chủ và 'Bao nhiêu quyền hạn đều là của dân'",
    source: "Bảo tàng Hồ Chí Minh",
    link: "https://baotanghochiminh.vn"
  },
  {
    id: "045",
    category: "academic",
    title: "GS.TS. Nguyễn Phú Trọng: Một số vấn đề lý luận và thực tiễn về CNXH ở Việt Nam",
    source: "Tạp chí Cộng sản",
    link: "https://tapchicongsan.org.vn"
  },
  {
    id: "046",
    category: "academic",
    title: "Văn kiện Đại hội đại biểu toàn quốc lần thứ XIII của Đảng (Bổ sung vế 'Dân thụ hưởng')",
    source: "Báo Điện tử Đảng Cộng sản Việt Nam",
    link: "https://dangcongsan.vn"
  },
  {
    id: "047",
    category: "academic",
    title: "Báo cáo Chỉ số PAPI: Hiệu quả Quản trị và Hành chính công cấp tỉnh tại Việt Nam",
    source: "Chương trình Phát triển Liên Hợp Quốc (UNDP Việt Nam)",
    link: "https://papi.org.vn"
  },
  {
    id: "048",
    category: "academic",
    title: "Chỉ số SIPAS: Đo lường sự hài lòng của người dân đối với sự phục vụ của cơ quan nhà nước",
    source: "Bộ Nội vụ",
    link: "https://moha.gov.vn"
  },

  // Nhóm 3: Thực tiễn & Quy chế HaUI (8 nguồn)
  {
    id: "081",
    category: "haui",
    title: "Quy chế số 31/NQ-HĐT của Hội đồng trường Đại học Công nghiệp Hà Nội về tổ chức và hoạt động",
    source: "Trường Đại học Công nghiệp Hà Nội",
    link: "https://www.haui.edu.vn"
  },
  {
    id: "082",
    category: "haui",
    title: "Quy định công tác sinh viên và quyền phản ánh dân chủ học đường tại HaUI",
    source: "Phòng Công tác Sinh viên - HaUI",
    link: "https://www.haui.edu.vn"
  },
  {
    id: "083",
    category: "haui",
    title: "Cổng thông tin đào tạo và dịch vụ sinh viên trực tuyến sv.haui.edu.vn",
    source: "Đại học Công nghiệp Hà Nội",
    link: "https://sv.haui.edu.vn"
  },
  {
    id: "084",
    category: "haui",
    title: "Quy định về chế độ đối thoại định kỳ giữa Lãnh đạo Nhà trường và Đại diện người học",
    source: "Đoàn Thanh niên - Hội Sinh viên HaUI",
    link: "https://www.haui.edu.vn"
  },
  {
    id: "085",
    category: "haui",
    title: "Quy trình khảo sát trực tuyến ý kiến phản hồi của sinh viên về chất lượng giảng dạy cuối kỳ",
    source: "Phòng Khảo thí & Đảm bảo Chất lượng HaUI",
    link: "https://www.haui.edu.vn"
  },
  {
    id: "086",
    category: "haui",
    title: "Quy định an toàn lao động và bảo hộ tại xưởng thực hành Cơ khí, Ô tô, Điện - Điện tử HaUI",
    source: "Trung tâm Thực hành Cơ khí HaUI",
    link: "https://www.haui.edu.vn"
  },
  {
    id: "087",
    category: "haui",
    title: "Hệ thống Một cửa điện tử tiếp nhận và giải quyết thủ tục hành chính sinh viên HaUI",
    source: "Văn phòng Một cửa HaUI",
    link: "https://www.haui.edu.vn"
  },
  {
    id: "088",
    category: "haui",
    title: "Quy chế đánh giá kết quả rèn luyện của người học và bình xét học bổng khuyến khích HaUI",
    source: "Hội đồng Khen thưởng & Kỷ luật HaUI",
    link: "https://www.haui.edu.vn"
  },

  // Nhóm 4: Phương pháp Học tập & Trình chiếu Hiện đại (8 nguồn)
  {
    id: "121",
    category: "tech",
    title: "Mô hình Sơ đồ tư duy số (Interactive Mindmap) trong đổi mới dạy học Lý luận Chính trị",
    source: "Tạp chí Giáo dục & Xã hội",
    link: "https://tapchigiaoduc.edu.vn"
  },
  {
    id: "122",
    category: "tech",
    title: "Tiêu chuẩn đồ họa SVG và tương tác trực quan hóa dữ liệu theo chuẩn W3C",
    source: "World Wide Web Consortium (W3C)",
    link: "https://www.w3.org/Graphics/SVG/"
  },
  {
    id: "123",
    category: "tech",
    title: "Thiết kế trải nghiệm học tập thích ứng (Adaptive Learning UX) cho sinh viên kỹ thuật",
    source: "ACM Digital Library",
    link: "https://dl.acm.org"
  },
  {
    id: "124",
    category: "tech",
    title: "Khung năng lực số dành cho sinh viên đại học trong kỷ nguyên chuyển đổi số quốc gia",
    source: "Viện Khoa học Giáo dục Việt Nam",
    link: "https://vnies.edu.vn"
  },
  {
    id: "125",
    category: "tech",
    title: "Kiến trúc ứng dụng web hướng cục bộ (Offline-first) và bảo mật dữ liệu người dùng",
    source: "MDN Web Docs",
    link: "https://developer.mozilla.org"
  },
  {
    id: "126",
    category: "tech",
    title: "Quy chuẩn khả năng tiếp cận nội dung web WCAG 2.1 dành cho học liệu số trực tuyến",
    source: "W3C Web Accessibility Initiative (WAI)",
    link: "https://www.w3.org/WAI/"
  },
  {
    id: "127",
    category: "tech",
    title: "Phương pháp tranh biện học đường (Karl Popper Debate Model) trong giáo dục đại học",
    source: "International Debate Education Association",
    link: "https://idebate.org"
  },
  {
    id: "128",
    category: "tech",
    title: "Kỹ năng thiết kế slide thuyết trình 16:9 chuẩn học thuật và nghệ thuật dẫn dắt chuyên đề",
    source: "Oxford Academic Presentation Guides",
    link: "https://www.ox.ac.uk"
  }
];

// ==========================================================================
// 5.4. HÀNH ĐỘNG HÔM NAY (biên soạn sẵn — bản demo, chưa có backend AI)
// Khi tất cả đã hoàn thành, trang hiển thị trạng thái rỗng, không tự sinh hành động giả.
// ==========================================================================
const TODAY_ACTIONS = [
  {
    id: 'haui-notice-feedback',
    title: 'Đọc thông báo mới và đóng góp ý kiến cho nhà trường',
    desc: 'Mở cổng sinh viên, chọn một thông báo liên quan đến người học (lịch học, học phí, học bổng…). Nếu thấy điểm cần cải thiện, gửi một góp ý ngắn, có căn cứ qua kênh chính thức.',
    time: '10–15 phút',
    reasonShort: 'Thực hành “dân biết, dân bàn” ngay trong phạm vi nhà trường.',
    reasons: [
      'Gắn với phương châm “Dân biết, dân bàn, dân làm, dân kiểm tra” trong bài học về dân chủ XHCN.',
      'Luật Thực hiện dân chủ ở cơ sở 2022 đề cao quyền được biết thông tin và tham gia ý kiến.',
      'Việc nhỏ, làm được trong 10–15 phút, hoàn toàn trong khả năng của mỗi sinh viên.'
    ],
    url: 'https://sv.haui.edu.vn',
    steps: [
      'Tôi đã đọc ít nhất một thông báo gốc trên cổng sinh viên',
      'Tôi đã gửi góp ý qua kênh chính thức, hoặc ghi lại lý do không cần góp ý'
    ]
  }
];

// ==========================================================================
// ==========================================================================
// 5.4. KỊCH BẢN TÌNH HUỐNG TƯƠNG TÁC: BÀI THUYẾT TRÌNH DÂN CHỦ XHCN
// ==========================================================================
const PRESENTATION_SCENARIO_DATA = {
  A: {
    badge: 'Chưa chuẩn mực • Tự do vô kỷ luật',
    badgeClass: 'badge-warning',
    analysis: 'Đăng tải ẩn danh công kích trên mạng xã hội dễ dẫn đến lan truyền thông tin sai lệch, gây rối tâm lý tập thể và làm méo mó bản chất sự việc. Cách làm này không giải quyết được vấn đề thực tế mà còn có nguy cơ vi phạm Luật An ninh mạng và Quy chế người học.',
    theory: 'Dân chủ xã hội chủ nghĩa không đồng nghĩa với tự do tùy tiện, vô tổ chức. Dân chủ luôn đi đôi với kỷ luật, kỷ cương và thượng tôn pháp luật. Quyền tự do ngôn luận phải gắn liền với trách nhiệm công dân và đạo đức xã hội.'
  },
  B: {
    badge: 'Thụ động • Chưa phát huy quyền làm chủ',
    badgeClass: 'badge-muted',
    analysis: 'Thái độ thờ ơ, buông xuôi (“ai làm sao mình theo vậy”) khiến sinh viên tự đánh mất quyền lợi chính đáng và tiếng nói đại diện của mình trước các quyết sách liên quan trực tiếp đến đời sống học tập.',
    theory: 'Bản chất của nền dân chủ XHCN khẳng định Nhân dân (trong đó có sinh viên) là chủ thể của quyền lực. Quyền làm chủ chỉ thực chất khi mỗi cá nhân chủ động tham gia đóng góp ý kiến, thực hiện phương châm “Dân biết, dân bàn, dân làm, dân kiểm tra”.'
  },
  C: {
    badge: 'Lựa chọn chuẩn mực • Phát huy dân chủ cơ sở',
    badgeClass: 'badge-success',
    analysis: 'Rất chuẩn xác! Tiếp cận văn bản gốc giúp nắm rõ căn cứ; cùng tập thể tổng hợp kiến nghị và gửi qua kênh chính thức (Cố vấn học tập, Cổng e-HaUI, Đối thoại sinh viên) là phương pháp đấu tranh xây dựng, văn minh và hiệu quả nhất.',
    theory: 'Đây là biểu hiện sinh động của việc thực hành phương châm “Dân biết, dân bàn, dân làm, dân kiểm tra, dân thụ hưởng” ở cơ sở giáo dục đại học. Sinh viên vừa thực hiện quyền làm chủ của mình, vừa giữ vững kỷ cương học đường và thượng tôn pháp luật.'
  }
};

// 5.5. 5 TÌNH HUỐNG THỰC TIỄN SINH VIÊN HaUI (DECISION SIMULATOR)
// ==========================================================================
const SITUATIONS_DATA = {
  1: {
    title: "Tình huống 1: Thiết bị xưởng thực hành / lab IoT bị hỏng hoặc chập điện",
    context: "Bạn bước vào giờ thực hành máy công cụ CNC (Cơ sở 2). Phát hiện dây nối động cơ rò điện và nút dừng khẩn cấp bị kẹt. Giảng viên đang bận hướng dẫn nhóm khác.",
    dilemma: "Làm sao để vừa đảm bảo tiến độ bài thực hành, vừa bảo vệ an toàn tính mạng và thực hiện quyền 'Dân kiểm tra'?",
    quiz: {
      question: "Hành động chuẩn mực nhất theo Quy chế 31/NQ-HĐT và An toàn lao động HaUI là gì?",
      options: [
        { text: "A. Tự lấy kìm nối lại dây điện rồi tiếp tục gia công để không bị muộn bài nộp.", isCorrect: false, feedback: "❌ Sai! Vi phạm nghiêm trọng quy tắc an toàn điện xưởng thực hành, nguy cơ giật điện chết người." },
        { text: "B. Báo ngay cho Giảng viên đứng lớp & Cán bộ kỹ thuật xưởng, ngắt cầu dao khẩn cấp, chụp ảnh gửi phản ánh qua sv.haui.edu.vn.", isCorrect: true, feedback: "✅ Chính xác 100%! Đây là quy trình chuẩn thực hành quyền 'Dân kiểm tra' và bảo vệ an toàn tập thể." },
        { text: "C. Bỏ mặc máy đó, lẳng lặng chuyển sang đứng ké máy của nhóm bạn bên cạnh.", isCorrect: false, feedback: "❌ Sai! Thờ ơ vô cảm khiến sinh viên nhóm sau có thể gặp tai nạn nguy hiểm." }
      ]
    },
    legalRule: "Quy chuẩn kỹ thuật quốc gia về an toàn lao động trong cơ sở giáo dục đại học & Quy chế 31/NQ-HĐT."
  },
  2: {
    title: "Tình huống 2: Đề xuất cải thiện thời lượng thực hành và nâng cấp phần mềm",
    context: "Lớp bạn học môn Lập trình nhúng IoT nhưng thời lượng thực hành trên mạch thực tế chỉ có 20%, còn lại phải tự mô phỏng trên phần mềm cũ từ năm 2018.",
    dilemma: "Sinh viên có quyền yêu cầu nhà trường bổ sung kít thực hành mới và nâng cấp phần mềm không?",
    quiz: {
      question: "Kênh thực hành quyền 'Dân bàn, dân làm' hiệu quả và văn minh nhất là:",
      options: [
        { text: "A. Viết bài ẩn danh lên mạng xã hội chê bai phòng máy của trường để gây áp lực.", isCorrect: false, feedback: "❌ Sai! Gây mất uy tín trường, vi phạm quy tắc ứng xử văn hóa học đường và không giải quyết được vấn đề thực chất." },
        { text: "B. Ban cán sự lớp họp tổng hợp ý kiến, gửi bản đề xuất có số liệu cụ thể cho Thầy/Cô Trưởng Bộ môn và đại diện phát biểu tại Hội nghị Đối thoại Sinh viên cấp Khoa.", isCorrect: true, feedback: "✅ Xuất sắc! Tuân thủ đúng chu trình 'Dân bàn', phát huy đối thoại học đường thực chất." },
        { text: "C. Rủ nhau ký đơn bãi khóa không đi học môn đó nữa.", isCorrect: false, feedback: "❌ Sai! Hành vi bột phát tiêu cực, vi phạm kỷ luật học tập." }
      ]
    },
    legalRule: "Điều 15 Luật Thực hiện dân chủ ở cơ sở 2022 & Quy chế đối thoại học đường định kỳ HaUI."
  },
  3: {
    title: "Tình huống 3: Thực hiện quyền dân chủ khi đánh giá giảng viên cuối kỳ",
    context: "Cuối kỳ, cổng e-HaUI mở đợt khảo sát lấy ý kiến sinh viên về môn học. Một số bạn trong lớp rủ nhau: 'Cứ chấm tất cả 5/5 cho nhanh, chấm thấp sợ thầy trù'.",
    dilemma: "Thái độ đúng đắn của sinh viên khi thực hiện quyền 'Dân kiểm tra' chất lượng giảng dạy là gì?",
    quiz: {
      question: "Bạn sẽ ứng xử như thế nào?",
      options: [
        { text: "A. Đồng ý chấm 5/5 bừa cho xong để kịp đăng ký môn kỳ sau.", isCorrect: false, feedback: "❌ Sai! Dung túng cho bệnh hình thức, tự tước bỏ quyền kiểm định chất lượng đào tạo của chính mình." },
        { text: "B. Đánh giá trung thực, khách quan theo từng tiêu chí; ghi rõ những góp ý chân thành về phương pháp giảng dạy để Thầy/Cô hoàn thiện.", isCorrect: true, feedback: "✅ Rất chuẩn mực! Kết quả khảo sát được mã hóa ẩn danh 100%, là căn cứ nâng cao chất lượng đào tạo của trường." },
        { text: "C. Chấm 1/5 cho tất cả các mục vì ghét thầy kiểm tra bài đầu giờ nghiêm khắc.", isCorrect: false, feedback: "❌ Sai! Đánh giá cảm tính cá nhân, thiếu văn minh và thiếu trách nhiệm công dân." }
      ]
    },
    legalRule: "Thông tư 10/2016/TT-BGDĐT & Quy trình kiểm định chất lượng nội bộ HaUI."
  },
  4: {
    title: "Tình huống 4: Giải quyết thủ tục học vụ và miễn giảm học phí bị chậm trễ",
    context: "Bạn nộp hồ sơ xin miễn giảm học phí thuộc diện gia đình chính sách tại bộ phận một cửa. Đã quá hạn 10 ngày làm việc theo giấy hẹn nhưng chưa có kết quả.",
    dilemma: "Ứng xử thế nào để đảm bảo quyền lợi theo nguyên tắc Nhà nước pháp quyền và trách nhiệm giải trình?",
    quiz: {
      question: "Cách xử lý có căn cứ pháp lý và hiệu quả nhất:",
      options: [
        { text: "A. Cầm giấy hẹn đến gặp cán bộ tiếp nhận đối chiếu thời hạn; nếu tiếp tục bị đùn đẩy thì gửi đơn phản ánh qua hòm thư điện tử Phòng Thanh tra Giáo dục theo Quy chế 31/NQ-HĐT.", isCorrect: true, feedback: "✅ Rất bản lĩnh và đúng luật! Thể hiện tư duy công dân pháp quyền biết sử dụng cơ chế bảo vệ quyền lợi hợp pháp." },
        { text: "B. Làm ầm ĩ ở khu vực một cửa để gây sự chú ý.", isCorrect: false, feedback: "❌ Sai! Vi phạm nội quy trật tự cơ quan." },
        { text: "C. Chấp nhận chịu thiệt, coi như mất tiền hỗ trợ.", isCorrect: false, feedback: "❌ Sai! Thái độ cam chịu, không phát huy vai trò chủ thể quyền lực." }
      ]
    },
    legalRule: "Quy chuẩn một cửa điện tử HaUI & Luật Tiếp cận thông tin 2016."
  },
  5: {
    title: "Tình huống 5: Ứng xử khi có bất đồng quan điểm và thông tin xấu độc trên mạng",
    context: "Trên một hội nhóm sinh viên, xuất hiện một tài khoản ẩn danh đăng bài xuyên tạc về bản chất chế độ và kêu gọi biểu tình chống phá chính sách của Nhà nước.",
    dilemma: "Sinh viên kỹ thuật cần có bản lĩnh chính trị và kỹ năng phản biện thế nào?",
    quiz: {
      question: "Hành động đúng đắn của sinh viên HaUI là:",
      options: [
        { text: "A. Tham gia chia sẻ và hùa theo bình luận tiêu cực để tăng tương tác.", isCorrect: false, feedback: "❌ Sai! Vi phạm nghiêm trọng Luật An ninh mạng 2018 và Nghị quyết 35-NQ/TW." },
        { text: "B. Bình tĩnh, không tiếp tay lan truyền; sử dụng tri thức CNXHKH và số liệu thực tế để phản biện văn minh nếu cần; đồng thời báo cáo (report) vi phạm cho cơ quan chức năng.", isCorrect: true, feedback: "✅ Xuất sắc! Thể hiện bản lĩnh chính trị vững vàng, văn minh và thượng tôn pháp luật." },
        { text: "C. Dùng lời lẽ thô tục chửi bới lại tài khoản đó.", isCorrect: false, feedback: "❌ Sai! Dễ bị kích động cuốn vào bẫy vi phạm pháp luật." }
      ]
    },
    legalRule: "Luật An ninh mạng 2018 & Quy tắc ứng xử trên mạng xã hội của Bộ TT&TT."
  }
};

// ==========================================================================
// 6. MAIN APPLICATION CONTROLLER
// ==========================================================================
class AppController {
  constructor() {
    this.currentBranch = null; // Bắt đầu ở chế độ tổng quan, không ép chọn Nhánh 1
    // P0-1: Trạng thái hiển thị (sẽ được cấu hình chính xác theo breakpoint khi init)
    this.displayMode = null;
    this.zoomScale = 1.0;
    this.panX = 0;
    this.panY = 0;
    this.isPanning = false;
    this.hasDragged = false;
    this.dragStartX = 0;
    this.dragStartY = 0;
    this.panStartX = 0;
    this.panStartY = 0;
    this.currentSlideIndex = 0;
    this.presentTimerSeconds = 900; // 15 mins
    this.presentTimerInterval = null;
    this.isLaserOn = false;
    this.debateTopicIndex = 3; // Default to Nhánh 4 (HaUI & Quy chế 31)
    this.arenaTimerSeconds = 300; // 5 mins (300 seconds)
    this.arenaTimerInterval = null;
    this.isArenaRunning = false;
    this.currentView = 'overview';

    // P1-13: Phân biệt Đã xem (viewed) và Đã nắm vững (mastered có chủ đích)
    try {
      const savedV = localStorage.getItem('redmind_viewed_branches') || localStorage.getItem('redmind_studied_branches');
      this.viewedBranches = savedV ? new Set(JSON.parse(savedV)) : new Set();
    } catch {
      this.viewedBranches = new Set();
    }

    try {
      const savedM = localStorage.getItem('redmind_mastered_branches');
      this.masteredBranches = savedM ? new Set(JSON.parse(savedM)) : new Set();
    } catch {
      this.masteredBranches = new Set();
    }

    // Trạng thái thu gọn sidebar (lưu localStorage)
    this.sidebarCollapsed = localStorage.getItem('redmind_sidebar_collapsed') === 'true';
  }

  init() {
    this.applySidebarState();
    this.bindNavigationViews();
    this.bindBreadcrumbs();
    this.bindModeSwitcher();
    this.bindBranchClicks();
    this.bindCanvasControls();
    this.bindCanvasPanAndZoom();
    this.bindDrawerEvents();
    this.bindModals();
    this.bindSearch();
    this.bindDebateArena();
    this.bindPresentation();
    this.bindLibrary();
    this.bindNotes();

    // Initialize Specialized Modules
    this.bindSpecializedModals();
    this.bindDualAiEngine();
    this.bindActionScenario();
    this.bindSituations();
    this.bindCommitmentCard();
    this.bindPulsePoll();
    this.renderSituation(1);
    this.generateSvgCard();
    this.bindReviewsModule();

    // Khởi tạo danh sách & tiến độ & trạng thái ban đầu
    this.populateListView();
    this.updateStudyProgressUI();

    const initialMode = (window.innerWidth <= 768) ? 'list' : 'mindmap';
    this.switchDisplayMode(initialMode, true);
    if (initialMode === 'mindmap') {
      this.resetSelection();
      this.fitToScreen();
    }

    // Dynamic auto-layout observer when viewport/canvas resizes
    if (window.ResizeObserver) {
      const ro = new ResizeObserver(() => {
        if (this.displayMode === 'mindmap') {
          this.layoutMindmap();
        }
      });
      const vp = document.getElementById('mindmapViewport');
      const cv = document.getElementById('mindmapCanvas');
      if (vp) ro.observe(vp);
      if (cv) ro.observe(cv);
    }

    window.addEventListener('resize', () => {
      if (this.displayMode === 'mindmap') {
        this.layoutMindmap();
      }
    });
    window.addEventListener('orientationchange', () => {
      if (this.displayMode === 'mindmap') {
        this.layoutMindmap();
      }
    });

    // P1-5 & Accessible Keyboard Shortcuts (Esc, +, -, 0, 1-6, P, ?)
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
        if (e.key === 'Escape') e.target.blur();
        return;
      }

      if (e.key === 'Escape') {
        // Ưu tiên đóng modal đang mở
        const openModal = document.querySelector('.modal-backdrop:not(.hidden)');
        if (openModal) {
          this.closeModal(openModal.id);
          return;
        }
        // Sau đó đóng drawer nếu đang mở
        const drawer = document.getElementById('rightDrawer');
        if (drawer && !drawer.classList.contains('closed')) {
          drawer.classList.add('closed');
          this.resetSelection();
        }
      } else if (e.key === '+' || e.key === '=') {
        this.zoomIn();
      } else if (e.key === '-') {
        this.zoomOut();
      } else if (e.key === '0') {
        this.resetZoom();
      } else if (['1', '2', '3', '4', '5', '6'].includes(e.key)) {
        const branchNum = parseInt(e.key, 10);
        this.selectBranch(branchNum);
      } else if (e.key.toLowerCase() === 'p') {
        this.openPresentationModal(0);
      } else if (e.key === '?' || e.key === '/' || (e.key.toLowerCase() === 'h' && !e.ctrlKey)) {
        this.openModal('guideModal');
      }
    });

    const canvas = document.getElementById('mindmapCanvas');
    if (canvas) {
      canvas.addEventListener('transitionend', () => this.updateConnectors());
    }
    const drawer = document.getElementById('rightDrawer');
    if (drawer) {
      drawer.addEventListener('transitionend', () => this.updateConnectors());
    }
  }

  // ==========================================================================
  // PROGRESS & SIDEBAR STATE MANAGEMENT
  // ==========================================================================
  updateStudyProgressUI() {
    const viewed = this.viewedBranches.size;
    const mastered = this.masteredBranches.size;
    const countEl = document.getElementById('sidebarProgressCount');
    const barEl = document.getElementById('sidebarProgressBar');
    const hintEl = document.getElementById('sidebarProgressHint');
    if (countEl) countEl.textContent = `Đã xem: ${viewed}/6 • Nắm vững: ${mastered}/6`;
    if (barEl) barEl.style.width = `${Math.round((mastered / 6) * 100)}%`;
    if (hintEl) {
      if (mastered === 0) hintEl.textContent = `Đã xem ${viewed}/6 nhánh. Bấm "Đánh dấu đã nắm vững" để ghi nhận.`;
      else if (mastered < 6) hintEl.textContent = `Đã nắm vững ${mastered}/6 nhánh lý luận & thực tiễn!`;
      else hintEl.textContent = 'Xuất sắc! Đã nắm vững toàn bộ 6/6 nhánh kiến thức.';
    }
  }

  applySidebarState() {
    const sidebar = document.getElementById('leftSidebar');
    if (sidebar) {
      sidebar.classList.toggle('collapsed', this.sidebarCollapsed);
    }
  }

  toggleSidebar() {
    audio.click();
    this.sidebarCollapsed = !this.sidebarCollapsed;
    localStorage.setItem('redmind_sidebar_collapsed', this.sidebarCollapsed);
    this.applySidebarState();
    setTimeout(() => {
      this.layoutMindmap();
      this.updateConnectors();
    }, 280);
  }

  // ==========================================================================
  // VIEW NAVIGATION ENGINE (TỔNG QUAN vs HÀNH ĐỘNG & AI vs ĐÁNH GIÁ & GÓP Ý)
  // ==========================================================================
  switchView(viewName) {
    audio.click();
    this.currentView = viewName;
    const viewOverview = document.getElementById('viewOverview');
    const viewActions = document.getElementById('viewActions');
    const viewReviews = document.getElementById('viewReviews');
    const navOverview = document.getElementById('navItemOverview');
    const navActions = document.getElementById('navItemActions');
    const navReviews = document.getElementById('navItemReviews');

    // Update sidebar navigation pills
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(btn => btn.classList.remove('active'));

    // Update top navbar segmented tab buttons
    document.querySelectorAll('.nav-segmented-group .nav-tab-btn').forEach(btn => btn.classList.remove('active'));

    if (viewName === 'overview') {
      if (viewOverview) viewOverview.classList.remove('hidden');
      if (viewActions) viewActions.classList.add('hidden');
      if (viewReviews) viewReviews.classList.add('hidden');
      if (navOverview) navOverview.classList.add('active');

      const tabOverview = document.getElementById('btnNavMindmap');
      if (tabOverview) tabOverview.classList.add('active');

      // Crucial: Recalculate mindmap auto-layout and SVG curves
      setTimeout(() => {
        this.layoutMindmap();
      }, 60);
    } else if (viewName === 'actions') {
      if (viewOverview) viewOverview.classList.add('hidden');
      if (viewActions) viewActions.classList.remove('hidden');
      if (viewReviews) viewReviews.classList.add('hidden');
      if (navActions) navActions.classList.add('active');

      const tabActions = document.getElementById('btnNavActions');
      if (tabActions) tabActions.classList.add('active');
    } else if (viewName === 'reviews') {
      if (viewOverview) viewOverview.classList.add('hidden');
      if (viewActions) viewActions.classList.add('hidden');
      if (viewReviews) viewReviews.classList.remove('hidden');
      if (navReviews) navReviews.classList.add('active');
    }
  }

  bindNavigationViews() {
    // Top Navbar Navigation Buttons
    const btnNavMindmap = document.getElementById('btnNavMindmap');
    const btnNavActions = document.getElementById('btnNavActions');

    if (btnNavMindmap) {
      btnNavMindmap.addEventListener('click', () => this.switchView('overview'));
    }
    if (btnNavActions) {
      btnNavActions.addEventListener('click', () => this.switchView('actions'));
    }

    // Sidebar Navigation Buttons
    const navOverview = document.getElementById('navItemOverview');
    const navActions = document.getElementById('navItemActions');
    const navReviews = document.getElementById('navItemReviews');
    const navDebate = document.getElementById('navItemDebate');
    const navLibrary = document.getElementById('navItemLibrary');
    const navFavorites = document.getElementById('navItemFavorites');
    const btnBack = document.getElementById('btnBackToOverview');
    const btnPresentAct = document.getElementById('btnPresentFromActions');
    const btnBackFromRev = document.getElementById('btnBackToOverviewFromReviews');
    const btnPresentFromRev = document.getElementById('btnPresentFromReviews');

    if (navOverview) {
      navOverview.addEventListener('click', () => this.switchView('overview'));
    }
    if (navActions) {
      navActions.addEventListener('click', () => this.switchView('actions'));
    }
    if (navReviews) {
      navReviews.addEventListener('click', () => this.switchView('reviews'));
    }
    if (btnBack) {
      btnBack.addEventListener('click', () => this.switchView('overview'));
    }
    if (btnPresentAct) {
      btnPresentAct.addEventListener('click', () => this.openPresentationModal(0));
    }
    if (btnBackFromRev) {
      btnBackFromRev.addEventListener('click', () => this.switchView('overview'));
    }
    if (btnPresentFromRev) {
      btnPresentFromRev.addEventListener('click', () => this.openPresentationModal(0));
    }
    if (navDebate) {
      navDebate.addEventListener('click', () => {
        audio.click();
        this.openDebateModal(this.currentBranch || 1);
      });
    }
    // P1-6: Gọi openLibraryModal() để render danh sách tư liệu thay vì mở modal rỗng
    if (navLibrary) {
      navLibrary.addEventListener('click', () => this.openLibraryModal());
    }
    if (navFavorites) {
      navFavorites.addEventListener('click', () => this.openModal('notesModal'));
    }

    // P1-12: Header Logo, Notifications & User Profile Menu Bindings
    const btnLogo = document.getElementById('btnLogo');
    if (btnLogo) {
      btnLogo.addEventListener('click', () => {
        audio.click();
        this.switchView('overview');
        const drawer = document.getElementById('rightDrawer');
        if (drawer) drawer.classList.add('closed');
        this.resetSelection();
        this.resetZoom();
      });
    }

    const btnNotifs = document.getElementById('btnNotifications');
    if (btnNotifs) {
      btnNotifs.addEventListener('click', () => this.openModal('notificationsModal'));
    }

    const btnUser = document.getElementById('btnUserMenu');
    if (btnUser) {
      btnUser.addEventListener('click', () => this.openModal('userProfileModal'));
    }

    // Mobile Bottom Navigation Bar Bindings
    const mbMindmap = document.getElementById('mbNavMindmap');
    const mbActions = document.getElementById('mbNavActions');
    const mbLib = document.getElementById('mbNavLibrary');
    const mbNotes = document.getElementById('mbNavNotes');

    const updateMobileNavPills = (activeId) => {
      document.querySelectorAll('.mb-nav-item').forEach(btn => {
        btn.classList.toggle('active', btn.id === activeId);
      });
    };

    if (mbMindmap) {
      mbMindmap.addEventListener('click', () => {
        this.switchView('overview');
        updateMobileNavPills('mbNavMindmap');
      });
    }
    if (mbActions) {
      mbActions.addEventListener('click', () => {
        this.switchView('actions');
        updateMobileNavPills('mbNavActions');
      });
    }
    if (mbLib) {
      mbLib.addEventListener('click', () => {
        this.openLibraryModal();
        updateMobileNavPills('mbNavLibrary');
      });
    }
    if (mbNotes) {
      mbNotes.addEventListener('click', () => {
        this.openModal('notesModal');
        updateMobileNavPills('mbNavNotes');
      });
    }

    // Bind action tool cards inside #viewActions
    const btnActComm = document.getElementById('btnActOpenCommitment');
    const btnActPoll = document.getElementById('btnActOpenPoll');
    const btnActSit = document.getElementById('btnActOpenSituations');
    const btnActBn = document.getElementById('btnActOpenBottlenecks');

    if (btnActComm) btnActComm.addEventListener('click', () => this.openModal('commitmentModal'));
    if (btnActPoll) btnActPoll.addEventListener('click', () => this.openModal('pulsePollModal'));
    if (btnActSit) btnActSit.addEventListener('click', () => this.openModal('situationsModal'));
    if (btnActBn) btnActBn.addEventListener('click', () => this.openModal('bottlenecksModal'));
  }

  // Interactive Clickable Breadcrumbs
  bindBreadcrumbs() {
    const bcHome = document.getElementById('bcHome');
    const bcTopic = document.getElementById('bcTopic');

    const handleReset = (e) => {
      if (e) e.preventDefault();
      audio.click();
      this.resetSelection();
    };

    if (bcHome) bcHome.addEventListener('click', handleReset);
    if (bcTopic) bcTopic.addEventListener('click', handleReset);
  }

  resetSelection() {
    this.currentBranch = null;
    document.querySelectorAll('.branch-card').forEach(c => c.classList.remove('active-selected'));
    document.querySelectorAll('.list-card-item').forEach(c => c.classList.remove('active-selected'));
    document.querySelectorAll('.branch-connector').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.connector-dot').forEach(d => d.classList.remove('active'));
    const bcBranchSep = document.getElementById('bcBranchSep');
    const bcBranchName = document.getElementById('bcBranchName');
    if (bcBranchSep) bcBranchSep.classList.add('hidden');
    if (bcBranchName) bcBranchName.classList.add('hidden');
    const drawer = document.getElementById('rightDrawer');
    if (drawer) drawer.classList.add('closed');
  }

  // ==========================================================================
  // VIEW MODE SWITCHER (SƠ ĐỒ TƯ DUY vs DẠNG DANH SÁCH TÁCH BIỆT HOÀN TOÀN)
  // ==========================================================================
  bindModeSwitcher() {
    const btnMindmap = document.getElementById('btnModeMindmap');
    const btnList = document.getElementById('btnModeList');

    if (btnMindmap) {
      btnMindmap.addEventListener('click', () => {
        audio.click();
        this.switchDisplayMode('mindmap');
      });
    }

    if (btnList) {
      btnList.addEventListener('click', () => {
        audio.click();
        this.switchDisplayMode('list');
      });
    }
  }

  switchDisplayMode(mode, force = false) {
    if (!force && mode === this.displayMode) return;
    this.displayMode = mode;

    const btnMindmap = document.getElementById('btnModeMindmap');
    const btnList = document.getElementById('btnModeList');
    const canvas = document.getElementById('mindmapCanvas');
    const listView = document.getElementById('mindmapListView');
    const zoomGroup = document.getElementById('zoomControlsGroup');

    if (mode === 'mindmap') {
      if (btnMindmap) {
        btnMindmap.classList.add('active');
        btnMindmap.setAttribute('aria-checked', 'true');
      }
      if (btnList) {
        btnList.classList.remove('active');
        btnList.setAttribute('aria-checked', 'false');
      }
      if (canvas) canvas.classList.remove('hidden');
      if (listView) listView.classList.add('hidden');
      if (zoomGroup) zoomGroup.style.display = 'inline-flex';

      this.layoutMindmap();
      this.updateConnectors();
    } else {
      if (btnList) {
        btnList.classList.add('active');
        btnList.setAttribute('aria-checked', 'true');
      }
      if (btnMindmap) {
        btnMindmap.classList.remove('active');
        btnMindmap.setAttribute('aria-checked', 'false');
      }
      if (canvas) canvas.classList.add('hidden');
      if (listView) listView.classList.remove('hidden');
      if (zoomGroup) zoomGroup.style.display = 'none';

      this.populateListView();
    }
  }

  populateListView() {
    const listGrid = document.getElementById('mindmapListGrid');
    if (!listGrid) return;

    const colorClasses = {
      1: { icon: 'icon-red', card: 'card-red' },
      2: { icon: 'icon-gold', card: 'card-gold' },
      3: { icon: 'icon-green', card: 'card-green' },
      4: { icon: 'icon-crimson', card: 'card-crimson' },
      5: { icon: 'icon-blue', card: 'card-blue' },
      6: { icon: 'icon-purple', card: 'card-purple' }
    };

    const notePills = {
      1: 'Vì con người • Vì nhân dân',
      2: 'Pháp luật là nền tảng',
      3: 'Dân là chủ thể • là trung tâm',
      4: 'Từ giảng đường đến cuộc sống',
      5: 'Tư duy độc lập • Tranh luận văn minh',
      6: 'Sinh viên HaUI: Hành động vì cộng đồng'
    };

    const iconSvgs = {
      1: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
      2: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="22" x2="21" y2="22"></line><line x1="6" y1="18" x2="6" y2="11"></line><line x1="10" y1="18" x2="10" y2="11"></line><line x1="14" y1="18" x2="14" y2="11"></line><line x1="18" y1="18" x2="18" y2="11"></line><polygon points="12 2 20 7 4 7 12 2"></polygon></svg>`,
      3: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>`,
      4: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`,
      5: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3.5z"></path></svg>`,
      6: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>`
    };

    listGrid.innerHTML = '';
    for (let i = 1; i <= 6; i++) {
      const data = BRANCH_DATA[i];
      if (!data) continue;
      const cInfo = colorClasses[i];
      const isSelected = this.currentBranch === i;
      const isMastered = this.masteredBranches.has(i);
      const isViewed = this.viewedBranches.has(i);
      let statusBadge = '';
      if (isMastered) {
        statusBadge = `<span class="mastery-badge">✓ Đã nắm vững</span>`;
      } else if (isViewed) {
        statusBadge = `<span class="mastery-badge" style="background:#eff6ff; color:#2563eb; border-color:#bfdbfe;">👁️ Đã xem</span>`;
      }

      const card = document.createElement('div');
      card.className = `list-card-item ${cInfo.card} ${isSelected ? 'active-selected' : ''}`;
      card.setAttribute('data-branch', i);
      card.innerHTML = `
        <div class="list-card-top">
          <div class="list-card-icon ${cInfo.icon}">
            ${iconSvgs[i]}
          </div>
          <div class="list-card-content">
            <div class="list-card-pill">
              <span>📌</span>
              <span>${notePills[i]}</span>
              ${statusBadge}
            </div>
            <h3 class="list-card-title">${data.title}</h3>
            <p class="list-card-sub">${data.questionSubtitle}</p>
          </div>
        </div>
        <div class="list-card-preview">
          ${data.bulbText}
        </div>
        <div class="list-card-footer">
          <span class="list-card-question">❓ ${data.question}</span>
          <button class="list-card-btn" data-branch="${i}">
            Nghiên cứu chi tiết &rarr;
          </button>
        </div>
      `;

      card.addEventListener('click', () => {
        audio.pop();
        this.selectBranch(i, true);
      });

      listGrid.appendChild(card);
    }
  }

  // ==========================================================================
  // DYNAMIC AUTO-LAYOUT ENGINE: Kích thước thực tế & Bố cục đồng bộ
  // ==========================================================================
  layoutMindmap() {
    const viewport = document.getElementById('mindmapViewport');
    const canvas = document.getElementById('mindmapCanvas');
    const centerNode = document.getElementById('centerNode');
    if (!viewport || !canvas || !centerNode) return;

    const vWidth = viewport.clientWidth;
    const vHeight = viewport.clientHeight;
    if (vWidth <= 0 || vHeight <= 0) return;

    // Center Node Optical Center
    const centerX = vWidth / 2;
    const centerY = vHeight * 0.46;

    centerNode.style.top = `${centerY}px`;
    centerNode.style.left = `${centerX}px`;

    const centerRect = centerNode.getBoundingClientRect();
    const halfCenterW = (centerRect.width > 0 ? centerRect.width : 320) / 2;

    const cardWidth = vWidth < 1200 ? 270 : 290;

    // Minimum clearance between center node boundary and branch card edges
    const availableSideSpace = (vWidth - (halfCenterW * 2) - (cardWidth * 2));
    const sideMargin = Math.max(16, Math.min(60, availableSideSpace * 0.25));
    const leftColLeft = sideMargin;
    const rightColLeft = vWidth - cardWidth - sideMargin;

    // Equal vertical distribution across 3 rows
    const topRowY = Math.max(16, vHeight * 0.12);
    const midRowY = Math.max(topRowY + 130, centerY - 45);
    const botRowY = Math.min(vHeight - 145, Math.max(midRowY + 130, vHeight * 0.77));

    const positions = {
      1: { left: `${leftColLeft}px`, top: `${topRowY}px` },
      2: { left: `${rightColLeft}px`, top: `${topRowY}px` },
      3: { left: `${leftColLeft}px`, top: `${midRowY}px` },
      4: { left: `${rightColLeft}px`, top: `${midRowY}px` },
      5: { left: `${leftColLeft}px`, top: `${botRowY}px` },
      6: { left: `${rightColLeft}px`, top: `${botRowY}px` },
    };

    for (let i = 1; i <= 6; i++) {
      const branch = document.getElementById(`branch${i}`);
      if (branch && positions[i]) {
        branch.style.left = positions[i].left;
        branch.style.top = positions[i].top;
        branch.style.right = 'auto';
        branch.style.bottom = 'auto';
      }
    }

    this.updateConnectors();
  }

  // Draw Smooth Bezier Connecting Lines between Center Node and 6 Branches
  // Guarantees lines always connect directly to each branch card edge with zero overlap
  updateConnectors() {
    const canvas = document.getElementById('mindmapCanvas');
    const centerNode = document.getElementById('centerNode');
    if (!canvas || !centerNode) return;

    const canvasRect = canvas.getBoundingClientRect();
    if (canvasRect.width === 0 || canvasRect.height === 0) return;

    // Effective scale of the canvas
    const scaleX = canvas.offsetWidth > 0 ? (canvasRect.width / canvas.offsetWidth) : 1.0;
    const scaleY = canvas.offsetHeight > 0 ? (canvasRect.height / canvas.offsetHeight) : 1.0;

    // Convert any DOM element's getBoundingClientRect into unscaled local canvas coordinate space
    const getLocalBox = (el) => {
      const r = el.getBoundingClientRect();
      const left = (r.left - canvasRect.left) / scaleX;
      const top = (r.top - canvasRect.top) / scaleY;
      const width = r.width / scaleX;
      const height = r.height / scaleY;
      return {
        left,
        top,
        width,
        height,
        right: left + width,
        bottom: top + height,
        centerX: left + width / 2,
        centerY: top + height / 2
      };
    };

    // Center node box
    const centerBox = getLocalBox(centerNode);

    // Anchor points on the central node:
    // Left branches (1, 3, 5) originate from the left edge of the center node
    // Right branches (2, 4, 6) originate from the right edge of the center node
    const centerAnchors = {
      1: { x: centerBox.left + 2,  y: centerBox.top + centerBox.height * 0.26 },
      2: { x: centerBox.right - 2, y: centerBox.top + centerBox.height * 0.26 },
      3: { x: centerBox.left,      y: centerBox.centerY },
      4: { x: centerBox.right,     y: centerBox.centerY },
      5: { x: centerBox.left + 2,  y: centerBox.bottom - centerBox.height * 0.26 },
      6: { x: centerBox.right - 2, y: centerBox.bottom - centerBox.height * 0.26 }
    };

    for (let i = 1; i <= 6; i++) {
      const branch = document.getElementById(`branch${i}`);
      const path = document.getElementById(`path${i}`);
      const dot = document.getElementById(`dot${i}`);
      if (!branch || !path) continue;

      const card = branch.querySelector('.branch-card') || branch;
      const cardBox = getLocalBox(card);
      const start = centerAnchors[i];

      let endX, endY, cp1x, cp1y, cp2x, cp2y;
      const isLeft = (i % 2 !== 0); // 1, 3, 5 are left; 2, 4, 6 are right

      if (isLeft) {
        // Line enters the RIGHT edge of the branch card directly at its vertical center
        endX = cardBox.right;
        endY = cardBox.centerY;

        const dx = Math.max(30, start.x - endX);
        const curveSpan = dx * 0.5;

        cp1x = start.x - curveSpan;
        cp1y = start.y + (endY - start.y) * 0.06;

        cp2x = endX + curveSpan;
        cp2y = endY;
      } else {
        // Line enters the LEFT edge of the branch card directly at its vertical center
        endX = cardBox.left;
        endY = cardBox.centerY;

        const dx = Math.max(30, endX - start.x);
        const curveSpan = dx * 0.5;

        cp1x = start.x + curveSpan;
        cp1y = start.y + (endY - start.y) * 0.06;

        cp2x = endX - curveSpan;
        cp2y = endY;
      }

      // Format SVG path
      const d = `M ${start.x.toFixed(1)} ${start.y.toFixed(1)} C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${endX.toFixed(1)} ${endY.toFixed(1)}`;
      path.setAttribute('d', d);

      // Position the contact dot directly at the card border
      if (dot) {
        dot.setAttribute('cx', endX.toFixed(1));
        dot.setAttribute('cy', endY.toFixed(1));
      }
    }
  }

  setupConnectors() {
    this.layoutMindmap();
    setTimeout(() => this.layoutMindmap(), 50);
    setTimeout(() => this.layoutMindmap(), 150);
    setTimeout(() => this.layoutMindmap(), 350);
    setTimeout(() => this.layoutMindmap(), 800);
  }

  // ==========================================================================
  // PAN, ZOOM & FIT VIEW ENGINE
  // ==========================================================================
  bindCanvasPanAndZoom() {
    const viewport = document.getElementById('mindmapViewport');
    if (!viewport) return;

    // Mouse Drag (Pan)
    viewport.addEventListener('mousedown', (e) => {
      if (this.displayMode !== 'mindmap') return;
      if (e.button !== 0) return; // Chỉ kéo bằng chuột trái
      if (e.target.closest('button') || e.target.closest('.zoom-pill') || e.target.closest('.canvas-actions')) return;

      this.isPanning = true;
      this.hasDragged = false;
      this.dragStartX = e.clientX;
      this.dragStartY = e.clientY;
      this.panStartX = this.panX;
      this.panStartY = this.panY;
      viewport.classList.add('panning');
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isPanning || this.displayMode !== 'mindmap') return;
      const dx = e.clientX - this.dragStartX;
      const dy = e.clientY - this.dragStartY;
      if (Math.hypot(dx, dy) > 5) {
        this.hasDragged = true;
      }
      this.panX = this.panStartX + dx;
      this.panY = this.panStartY + dy;
      this.applyTransform();
    });

    window.addEventListener('mouseup', () => {
      if (this.isPanning) {
        this.isPanning = false;
        viewport.classList.remove('panning');
        setTimeout(() => {
          this.hasDragged = false;
        }, 60);
      }
    });

    // Mouse Wheel Zoom
    viewport.addEventListener('wheel', (e) => {
      if (this.displayMode !== 'mindmap') return;
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.08 : 0.08;
      const newScale = Math.min(1.8, Math.max(0.55, this.zoomScale + delta));
      if (newScale !== this.zoomScale) {
        this.zoomScale = Math.round(newScale * 100) / 100;
        this.applyTransform();
      }
    }, { passive: false });

    // Touch Support (Mobile/Tablet Pan & Pinch)
    let initialTouchDist = 0;
    let initialTouchScale = 1.0;

    viewport.addEventListener('touchstart', (e) => {
      if (this.displayMode !== 'mindmap') return;
      if (e.touches.length === 1) {
        this.isPanning = true;
        this.hasDragged = false;
        this.dragStartX = e.touches[0].clientX;
        this.dragStartY = e.touches[0].clientY;
        this.panStartX = this.panX;
        this.panStartY = this.panY;
      } else if (e.touches.length === 2) {
        this.isPanning = false;
        initialTouchDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        initialTouchScale = this.zoomScale;
      }
    }, { passive: true });

    viewport.addEventListener('touchmove', (e) => {
      if (this.displayMode !== 'mindmap') return;
      if (e.touches.length === 1 && this.isPanning) {
        const dx = e.touches[0].clientX - this.dragStartX;
        const dy = e.touches[0].clientY - this.dragStartY;
        if (Math.hypot(dx, dy) > 5) {
          this.hasDragged = true;
        }
        this.panX = this.panStartX + dx;
        this.panY = this.panStartY + dy;
        this.applyTransform();
      } else if (e.touches.length === 2 && initialTouchDist > 0) {
        const currentDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const factor = currentDist / initialTouchDist;
        const newScale = Math.min(1.8, Math.max(0.55, initialTouchScale * factor));
        this.zoomScale = Math.round(newScale * 100) / 100;
        this.applyTransform();
      }
    }, { passive: true });

    viewport.addEventListener('touchend', () => {
      this.isPanning = false;
      initialTouchDist = 0;
      setTimeout(() => {
        this.hasDragged = false;
      }, 80);
    }, { passive: true });
  }

  applyTransform() {
    const canvas = document.getElementById('mindmapCanvas');
    const zoomText = document.getElementById('zoomLevel');
    if (canvas) {
      canvas.style.transform = `translate(${this.panX}px, ${this.panY}px) scale(${this.zoomScale})`;
    }
    if (zoomText) {
      zoomText.textContent = `${Math.round(this.zoomScale * 100)}%`;
    }
  }

  fitToScreen() {
    const viewport = document.getElementById('mindmapViewport');
    if (!viewport) return;
    const vWidth = viewport.clientWidth;
    const vHeight = viewport.clientHeight;
    if (vWidth <= 0 || vHeight <= 0) return;

    // Kích thước chuẩn bao trọn 6 nhánh: ~980px width, ~620px height
    const scaleX = (vWidth - 48) / 980;
    const scaleY = (vHeight - 48) / 620;
    const targetScale = Math.min(1.0, Math.min(scaleX, scaleY));
    this.zoomScale = Math.max(0.55, Math.min(1.15, Math.round(targetScale * 100) / 100));
    this.panX = 0;
    this.panY = 0;
    this.applyTransform();
    this.layoutMindmap();
  }

  resetZoom() {
    this.zoomScale = 1.0;
    this.panX = 0;
    this.panY = 0;
    this.applyTransform();
    this.layoutMindmap();
  }

  // Branch Click Handler (Kéo canvas không làm vô tình click node)
  bindBranchClicks() {
    for (let i = 1; i <= 6; i++) {
      const branch = document.getElementById(`branch${i}`);
      if (branch) {
        branch.addEventListener('click', (e) => {
          e.stopPropagation();
          if (this.hasDragged) return;
          audio.pop();
          this.selectBranch(i, true);
        });
      }
    }

    const centerNode = document.getElementById('centerNode');
    if (centerNode) {
      centerNode.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.hasDragged) return;
        audio.pop();
        this.openPresentationModal(0);
      });
    }
  }

  selectBranch(branchId, openDrawer = true) {
    this.currentBranch = branchId;
    const data = BRANCH_DATA[branchId];
    if (!data) return;

    // P1-13: Ghi nhận tiến độ "Đã xem" nhánh
    this.viewedBranches.add(branchId);
    try {
      localStorage.setItem('redmind_viewed_branches', JSON.stringify([...this.viewedBranches]));
    } catch {}
    this.updateStudyProgressUI();

    // Cập nhật trạng thái nút Nắm Vững
    const btnMastery = document.getElementById('btnMarkBranchMastered');
    const masteryText = document.getElementById('branchMasteryStatusText');
    const isMastered = this.masteredBranches.has(branchId);
    if (btnMastery) {
      btnMastery.classList.toggle('mastered', isMastered);
    }
    if (masteryText) {
      masteryText.textContent = isMastered ? '✓ Đã nắm vững nhánh này' : 'Đánh dấu đã nắm vững';
    }

    // Highlight selected card on mindmap
    document.querySelectorAll('.branch-card').forEach(c => c.classList.remove('active-selected'));
    const activeCard = document.querySelector(`#branch${branchId} .branch-card`);
    if (activeCard) activeCard.classList.add('active-selected');

    // Highlight active card in list view
    document.querySelectorAll('.list-card-item').forEach(c => {
      const bId = parseInt(c.getAttribute('data-branch'), 10);
      c.classList.toggle('active-selected', bId === branchId);
    });

    // Highlight active connector line and contact dot
    document.querySelectorAll('.branch-connector').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.connector-dot').forEach(d => d.classList.remove('active'));
    const activePath = document.getElementById(`path${branchId}`);
    const activeDot = document.getElementById(`dot${branchId}`);
    if (activePath) activePath.classList.add('active');
    if (activeDot) activeDot.classList.add('active');

    // Update clickable breadcrumb bar
    const bcBranchSep = document.getElementById('bcBranchSep');
    const bcBranchName = document.getElementById('bcBranchName');
    if (bcBranchSep) bcBranchSep.classList.remove('hidden');
    if (bcBranchName) {
      bcBranchName.classList.remove('hidden');
      const cleanTitle = data.title.replace(/^\d+\.\s*/, '');
      bcBranchName.textContent = `Nhánh ${branchId}: ${cleanTitle}`;
    }

    // Mở drawer chi tiết mượt mà
    const drawer = document.getElementById('rightDrawer');
    if (drawer && openDrawer) {
      drawer.classList.remove('closed');
    }

    // Populate Drawer Content
    const titleEl = document.getElementById('questionTitle');
    const subEl = document.getElementById('questionSubtitle');
    const bulbTitleEl = document.getElementById('bulbTitle');
    const bulbTextEl = document.getElementById('bulbText');
    const bulletsList = document.getElementById('argumentBulletsList');
    const paneEvidence = document.getElementById('paneEvidence');
    const paneLead = document.getElementById('paneLead');
    const suggList = document.getElementById('suggestionsList');

    if (titleEl) titleEl.textContent = data.question;
    if (subEl) subEl.textContent = data.questionSubtitle;
    if (bulbTitleEl) bulbTitleEl.textContent = data.bulbTitle;
    if (bulbTextEl) bulbTextEl.textContent = data.bulbText;

    if (bulletsList) {
      bulletsList.innerHTML = data.arguments.map(arg => `
        <div class="bullet-card">
          <span class="check-circle">✓</span>
          <p>${escapeHTML(arg)}</p>
        </div>
      `).join('');
    }

    if (paneEvidence) paneEvidence.innerHTML = `<div class="evidence-box">${data.evidence}</div>`;
    if (paneLead) paneLead.innerHTML = `<div class="lead-box">${data.lead}</div>`;

    if (suggList) {
      suggList.innerHTML = data.suggestions.map(s => `
        <a href="#" class="sugg-item" data-ref="${escapeHTML(s.id)}">
          <span class="file-icon">📄</span>
          <span class="sugg-name">${escapeHTML(s.name)}</span>
        </a>
      `).join('');

      suggList.querySelectorAll('.sugg-item').forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          audio.click();
          this.openLibraryModal(link.getAttribute('data-ref'));
        });
      });
    }

    this.updateConnectors();
  }

  // Drawer Tabs & Close Events
  bindDrawerEvents() {
    const btnClose = document.getElementById('btnCloseDrawer');
    const drawer = document.getElementById('rightDrawer');
    if (btnClose && drawer) {
      btnClose.addEventListener('click', () => {
        audio.click();
        drawer.classList.add('closed');
        this.resetSelection();
        let startTime = null;
        const animToggle = (time) => {
          if (!startTime) startTime = time;
          this.updateConnectors();
          if (time - startTime < 350) {
            requestAnimationFrame(animToggle);
          } else {
            this.updateConnectors();
          }
        };
        requestAnimationFrame(animToggle);
      });
    }

    // Tabs
    const tabs = ['Args', 'Evidence', 'Lead'];
    tabs.forEach(tabKey => {
      const btn = document.getElementById(`dTab${tabKey}`);
      if (btn) {
        btn.addEventListener('click', () => {
          audio.click();
          document.querySelectorAll('.d-tab').forEach(t => t.classList.remove('active'));
          document.querySelectorAll('.tab-pane').forEach(p => p.classList.add('hidden'));

          btn.classList.add('active');
          const targetPane = document.getElementById(`pane${tabKey}`);
          if (targetPane) targetPane.classList.remove('hidden');
        });
      }
    });

    // P1-13: Nút đánh dấu nắm vững có chủ đích
    const btnMastery = document.getElementById('btnMarkBranchMastered');
    if (btnMastery) {
      btnMastery.addEventListener('click', () => {
        if (!this.currentBranch) return;
        const bId = this.currentBranch;
        const masteryText = document.getElementById('branchMasteryStatusText');
        if (this.masteredBranches.has(bId)) {
          this.masteredBranches.delete(bId);
          audio.pop();
        } else {
          this.masteredBranches.add(bId);
          audio.success();
          if (typeof confetti === 'function') {
            confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
          }
        }
        try {
          localStorage.setItem('redmind_mastered_branches', JSON.stringify([...this.masteredBranches]));
        } catch {}
        this.updateStudyProgressUI();
        const isM = this.masteredBranches.has(bId);
        btnMastery.classList.toggle('mastered', isM);
        if (masteryText) {
          masteryText.textContent = isM ? '✓ Đã nắm vững nhánh này' : 'Đánh dấu đã nắm vững';
        }
        this.populateListView();
      });
    }

    // Go to Debate Button (Auto-synced to current branch)
    const btnDebate = document.getElementById('btnGoToDebateModal');
    if (btnDebate) {
      btnDebate.addEventListener('click', () => {
        audio.alert();
        this.openDebateModal(this.currentBranch || 1);
      });
    }

    // Present Current Branch Slide
    const btnPresentBranch = document.getElementById('btnPresentCurrentBranch');
    if (btnPresentBranch) {
      btnPresentBranch.addEventListener('click', () => {
        audio.success();
        this.openSlideForBranch(this.currentBranch || 1);
      });
    }

    // Save Branch Summary to Personal Notes
    const btnSaveNotes = document.getElementById('btnSaveBranchToNotes');
    if (btnSaveNotes) {
      btnSaveNotes.addEventListener('click', () => {
        const bId = this.currentBranch || 1;
        const data = BRANCH_DATA[bId];
        if (data) {
          audio.success();
          const curNotes = localStorage.getItem('redmind_haui_notes') || '';
          const entry = `\n\n📌 [Nhánh ${bId}: ${data.title}]\n• Câu hỏi: ${data.question}\n• Luận điểm mấu chốt: ${data.bulbText}\n• Lời dẫn: ${data.questionSubtitle}`;
          const updated = (curNotes + entry).trim();
          localStorage.setItem('redmind_haui_notes', updated);
          const textarea = document.getElementById('personalNotesText');
          if (textarea) textarea.value = updated;
          alert(`✓ Đã lưu tóm tắt Nhánh ${bId} vào Sổ tay ghi chú cá nhân!`);
        }
      });
    }

    // See more Library
    const btnMore = document.getElementById('btnSeeMoreLib');
    if (btnMore) {
      btnMore.addEventListener('click', () => {
        audio.click();
        this.openLibraryModal();
      });
    }
  }

  // Canvas Zoom, Focus & Fullscreen
  bindCanvasControls() {
    const btnIn = document.getElementById('btnZoomIn');
    const btnOut = document.getElementById('btnZoomOut');
    const btnFit = document.getElementById('btnZoomFit');
    const btnReset = document.getElementById('btnZoomReset');

    if (btnIn) {
      btnIn.addEventListener('click', () => {
        audio.click();
        this.zoomScale = Math.min(1.8, Math.round((this.zoomScale + 0.15) * 100) / 100);
        this.applyTransform();
      });
    }

    if (btnOut) {
      btnOut.addEventListener('click', () => {
        audio.click();
        this.zoomScale = Math.max(0.55, Math.round((this.zoomScale - 0.15) * 100) / 100);
        this.applyTransform();
      });
    }

    if (btnFit) {
      btnFit.addEventListener('click', () => {
        audio.click();
        this.fitToScreen();
      });
    }

    if (btnReset) {
      btnReset.addEventListener('click', () => {
        audio.click();
        this.resetZoom();
      });
    }

    // Focus Mode
    const btnFocus = document.getElementById('btnFocusMode');
    if (btnFocus) {
      let focused = false;
      btnFocus.addEventListener('click', () => {
        audio.click();
        focused = !focused;
        const sidebar = document.getElementById('leftSidebar');
        const navbar = document.querySelector('.top-navbar');
        if (sidebar) sidebar.style.display = focused ? 'none' : '';
        if (navbar) navbar.style.display = focused ? 'none' : '';
        btnFocus.classList.toggle('active', focused);
        setTimeout(() => this.layoutMindmap(), 100);
      });
    }

    // Fullscreen
    const btnFs = document.getElementById('btnFullscreen');
    if (btnFs) {
      btnFs.addEventListener('click', () => {
        audio.click();
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
        } else {
          document.exitFullscreen().catch(() => {});
        }
      });
    }
  }

  // Global Search Filter (Hỗ trợ tiếng Việt có/không dấu cho cả Sơ đồ & Danh sách)
  bindSearch() {
    const searchInput = document.getElementById('globalSearchInput');
    const clearBtn = document.getElementById('btnClearSearch');

    if (searchInput) {
      searchInput.addEventListener('input', () => {
        const rawQuery = searchInput.value.trim();
        const normQuery = removeVietnameseTones(rawQuery);
        if (clearBtn) {
          clearBtn.classList.toggle('hidden', rawQuery.length === 0);
        }

        for (let i = 1; i <= 6; i++) {
          const card = document.querySelector(`#branch${i} .branch-card`);
          const listCard = document.querySelector(`.list-card-item[data-branch="${i}"]`);
          const data = BRANCH_DATA[i];
          if (!data) continue;

          if (normQuery.length === 0) {
            if (card) {
              card.style.opacity = '1';
              card.style.transform = '';
            }
            if (listCard) {
              listCard.style.display = '';
              listCard.style.opacity = '1';
            }
          } else {
            const fullTextNorm = removeVietnameseTones(
              `${data.title} ${data.question} ${data.questionSubtitle} ${data.bulbTitle} ${data.bulbText} ${data.arguments.join(' ')}`
            );
            const match = fullTextNorm.includes(normQuery);

            if (card) {
              card.style.opacity = match ? '1' : '0.2';
              card.style.transform = match ? 'scale(1.03)' : '';
            }
            if (listCard) {
              listCard.style.display = match ? '' : 'none';
              listCard.style.opacity = match ? '1' : '0.2';
            }
          }
        }
      });

      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          searchInput.value = '';
          searchInput.dispatchEvent(new Event('input'));
          clearBtn.classList.add('hidden');
        });
      }
    }
  }

  // Modals Binding (Presentation, Debate, Dossier, Notes, Guide, Lib, Notifications, User)
  bindModals() {
    // Presentation
    const btnPresent = document.getElementById('btnPresentationMode');
    if (btnPresent) btnPresent.addEventListener('click', () => this.openPresentationModal());

    const btnClosePres = document.getElementById('btnClosePresentation');
    if (btnClosePres) btnClosePres.addEventListener('click', () => this.closeModal('presentationModal'));

    // Notes
    const btnNotes = document.getElementById('btnNavNotes');
    if (btnNotes) btnNotes.addEventListener('click', () => this.openModal('notesModal'));
    const btnCloseNotes = document.getElementById('btnCloseNotesModal');
    if (btnCloseNotes) btnCloseNotes.addEventListener('click', () => this.closeModal('notesModal'));

    // P1-5: Guide Modal
    const btnGuide = document.getElementById('btnNavGuide');
    const btnNavLib = document.getElementById('btnNavLibrary');
    if (btnNavLib) {
      btnNavLib.addEventListener('click', () => {
        audio.click();
        this.openLibraryModal();
      });
    }
    if (btnGuide) btnGuide.addEventListener('click', () => this.openModal('guideModal'));
    const btnCloseGuide = document.getElementById('btnCloseGuideModal');
    if (btnCloseGuide) btnCloseGuide.addEventListener('click', () => this.closeModal('guideModal'));
    const btnAckGuide = document.getElementById('btnGuideAcknowledge');
    if (btnAckGuide) btnAckGuide.addEventListener('click', () => this.closeModal('guideModal'));

    // P1-12: Notifications Modal
    const btnCloseNotifs = document.getElementById('btnCloseNotificationsModal');
    if (btnCloseNotifs) btnCloseNotifs.addEventListener('click', () => this.closeModal('notificationsModal'));
    const btnAckNotifs = document.getElementById('btnMarkAllNotifsRead');
    if (btnAckNotifs) btnAckNotifs.addEventListener('click', () => this.closeModal('notificationsModal'));

    // P1-12: User Profile Modal
    const btnCloseUser = document.getElementById('btnCloseUserModal');
    if (btnCloseUser) btnCloseUser.addEventListener('click', () => this.closeModal('userProfileModal'));
    const btnCloseUserBtn = document.getElementById('btnCloseUserModalBtn');
    if (btnCloseUserBtn) btnCloseUserBtn.addEventListener('click', () => this.closeModal('userProfileModal'));

    // Library
    const btnCloseLib = document.getElementById('btnCloseLibrary');
    if (btnCloseLib) btnCloseLib.addEventListener('click', () => this.closeModal('libraryModal'));

    // Debate Arena
    const btnCloseDebate = document.getElementById('btnCloseDebateModal');
    if (btnCloseDebate) btnCloseDebate.addEventListener('click', () => this.closeModal('debateModal'));

    // Dossier
    const btnCloseDossier = document.getElementById('btnCloseDossier');
    if (btnCloseDossier) btnCloseDossier.addEventListener('click', () => this.closeModal('dossierModal'));

    // Trang Hành động: popup "AI hoạt động thế nào?" & "Lý do gợi ý"
    const btnHow = document.getElementById('btnAiHowItWorks');
    if (btnHow) btnHow.addEventListener('click', () => this.openModal('aiHowModal'));
    const btnCloseHow = document.getElementById('btnCloseAiHowModal');
    if (btnCloseHow) btnCloseHow.addEventListener('click', () => this.closeModal('aiHowModal'));
    const btnCloseReason = document.getElementById('btnCloseAiReasonModal');
    if (btnCloseReason) btnCloseReason.addEventListener('click', () => this.closeModal('aiReasonModal'));

    // Bấm ra ngoài thẻ để đóng 2 popup nhỏ của trang Hành động
    ['aiHowModal', 'aiReasonModal'].forEach(id => {
      const m = document.getElementById(id);
      if (m) m.addEventListener('click', (e) => { if (e.target === m) this.closeModal(id); });
    });

    this.bindTodayAction();
  }

  // ==========================================================================
  // TRANG HÀNH ĐỘNG: "HÔM NAY" — một hành động trọng tâm, xác nhận hoàn thành có điều kiện
  // ==========================================================================
  
  // ==========================================================================
  // TRANG HÀNH ĐỘNG: TÌNH HUỐNG TƯƠNG TÁC THUYẾT TRÌNH CNXHKH
  // ==========================================================================
  bindActionScenario() {
    const btnSubmit = document.getElementById('btnSubmitScenario');
    const resultBox = document.getElementById('scenarioResultBox');
    const badgeEl = document.getElementById('scenarioResultBadge');
    const analysisEl = document.getElementById('scenarioResultAnalysis');
    const theoryEl = document.getElementById('scenarioTheoryLink');

    const renderChoice = (optVal) => {
      const data = PRESENTATION_SCENARIO_DATA[optVal];
      if (!data) return;

      if (badgeEl) {
        badgeEl.textContent = data.badge;
        badgeEl.className = 'scenario-result-badge ' + data.badgeClass;
      }
      if (analysisEl) analysisEl.textContent = data.analysis;
      if (theoryEl) theoryEl.textContent = data.theory;

      if (resultBox) {
        resultBox.classList.remove('hidden');
      }
    };

    const updateActiveOption = () => {
      document.querySelectorAll('.scenario-option').forEach(card => {
        const input = card.querySelector('input[type="radio"]');
        card.classList.toggle('active', input && input.checked);
      });
    };

    document.querySelectorAll('input[name="presentationScenario"]').forEach(radio => {
      radio.addEventListener('change', () => {
        audio.click();
        updateActiveOption();
        if (resultBox && !resultBox.classList.contains('hidden')) {
          renderChoice(radio.value);
        }
      });
    });

    if (btnSubmit) {
      btnSubmit.addEventListener('click', () => {
        audio.pop();
        const selected = document.querySelector('input[name="presentationScenario"]:checked');
        const val = selected ? selected.value : 'C';
        renderChoice(val);
        if (val === 'C' && typeof confetti === 'function') {
          confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
        }
      });
    }

    updateActiveOption();
    // Render default choice C
    renderChoice('C');
  }

  bindTodayAction() {
    this.actionStarted = new Set();
    try {
      this.actionsDone = JSON.parse(localStorage.getItem('redmind_actions_done') || '{}') || {};
    } catch (e) {
      this.actionsDone = {};
    }

    const btnDoNow = document.getElementById('btnDoActionNow');
    const btnExplain = document.getElementById('btnExplainAiReason');
    const btnConfirm = document.getElementById('btnConfirmActionDone');
    const btnReset = document.getElementById('btnResetTodayAction');

    if (btnDoNow) {
      btnDoNow.addEventListener('click', () => {
        const action = this.getCurrentTodayAction();
        if (!action) return;
        audio.pop();
        // Mở nguồn thực hiện thật (tab mới); nếu trình duyệt chặn popup, liên kết "Mở nguồn" vẫn dùng được
        window.open(action.url, '_blank', 'noopener');
        this.actionStarted.add(action.id);
        this.renderTodayAction();
        const panel = document.getElementById('todayActionComplete');
        if (panel) {
          panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          const firstBox = panel.querySelector('input[type="checkbox"]');
          if (firstBox) firstBox.focus({ preventScroll: true });
        }
      });
    }

    if (btnExplain) {
      btnExplain.addEventListener('click', () => {
        const action = this.getCurrentTodayAction();
        const list = document.getElementById('aiReasonList');
        if (!action || !list) return;
        list.replaceChildren(...action.reasons.map(r => {
          const li = document.createElement('li');
          li.textContent = r;
          return li;
        }));
        this.openModal('aiReasonModal');
      });
    }

    if (btnConfirm) {
      btnConfirm.addEventListener('click', () => {
        const action = this.getCurrentTodayAction();
        if (!action) return;
        const boxes = [...document.querySelectorAll('#todayActionSteps input[type="checkbox"]')];
        // Chỉ ghi nhận khi người dùng đã bấm "Thực hiện ngay" và tích đủ mọi bước
        if (!this.actionStarted.has(action.id) || boxes.length === 0 || !boxes.every(b => b.checked)) return;
        audio.success();
        this.actionsDone[action.id] = new Date().toISOString();
        this.lastCompletedActionId = action.id;
        localStorage.setItem('redmind_actions_done', JSON.stringify(this.actionsDone));
        this.renderTodayAction();
      });
    }

    if (btnReset) {
      btnReset.addEventListener('click', () => {
        const ids = Object.keys(this.actionsDone);
        const id = this.lastCompletedActionId && this.actionsDone[this.lastCompletedActionId]
          ? this.lastCompletedActionId
          : ids.sort((a, b) => (this.actionsDone[b] || '').localeCompare(this.actionsDone[a] || ''))[0];
        if (!id) return;
        audio.click();
        delete this.actionsDone[id];
        this.actionStarted.delete(id);
        localStorage.setItem('redmind_actions_done', JSON.stringify(this.actionsDone));
        this.renderTodayAction();
      });
    }

    this.renderTodayAction();
  }

  getCurrentTodayAction() {
    return TODAY_ACTIONS.find(a => !this.actionsDone[a.id]) || null;
  }

  renderTodayAction() {
    const card = document.getElementById('todayActionCard');
    const empty = document.getElementById('todayActionEmpty');
    if (!card || !empty) return;

    const action = this.getCurrentTodayAction();
    if (!action) {
      card.classList.add('hidden');
      empty.classList.remove('hidden');
      return;
    }
    card.classList.remove('hidden');
    empty.classList.add('hidden');

    const setText = (id, txt) => { const el = document.getElementById(id); if (el) el.textContent = txt; };
    setText('todayActionTitle', action.title);
    setText('todayActionDesc', action.desc);
    setText('todayActionTime', action.time);
    setText('todayActionReasonShort', action.reasonShort);
    const src = document.getElementById('todayActionSource');
    if (src) src.href = action.url;

    const panel = document.getElementById('todayActionComplete');
    const stepsWrap = document.getElementById('todayActionSteps');
    const btnConfirm = document.getElementById('btnConfirmActionDone');
    const started = this.actionStarted.has(action.id);
    if (panel) panel.classList.toggle('hidden', !started);

    if (stepsWrap && stepsWrap.dataset.actionId !== action.id) {
      stepsWrap.dataset.actionId = action.id;
      stepsWrap.replaceChildren(...action.steps.map((step, i) => {
        const label = document.createElement('label');
        label.className = 'act-step';
        const box = document.createElement('input');
        box.type = 'checkbox';
        box.id = `todayStep_${action.id}_${i}`;
        const span = document.createElement('span');
        span.textContent = step;
        label.append(box, span);
        box.addEventListener('change', () => {
          const all = [...stepsWrap.querySelectorAll('input[type="checkbox"]')];
          if (btnConfirm) btnConfirm.disabled = !all.every(b => b.checked);
        });
        return label;
      }));
      if (btnConfirm) btnConfirm.disabled = true;
    }
  }

  openModal(modalId) {
    audio.click();
    const m = document.getElementById(modalId);
    if (m) {
      // Lưu phần tử đang focus để trả lại khi đóng (a11y)
      if (m.classList.contains('hidden')) this.lastFocusedBeforeModal = document.activeElement;
      m.classList.remove('hidden');
      if (modalId === 'aiHowModal' || modalId === 'aiReasonModal') {
        const closeBtn = m.querySelector('.btn-close');
        if (closeBtn) closeBtn.focus();
      }
    }
  }

  // P1-7: Sửa lỗi rò rỉ setInterval khi đóng modal Presentation
  closeModal(modalId) {
    audio.click();
    const m = document.getElementById(modalId);
    if (m) m.classList.add('hidden');
    if ((modalId === 'aiHowModal' || modalId === 'aiReasonModal') && this.lastFocusedBeforeModal && document.contains(this.lastFocusedBeforeModal)) {
      this.lastFocusedBeforeModal.focus();
      this.lastFocusedBeforeModal = null;
    }

    if (modalId === 'presentationModal') {
      if (this.presentTimerInterval) {
        clearInterval(this.presentTimerInterval);
        this.presentTimerInterval = null;
      }
      this.presentTimerSeconds = 900;
      const timerEl = document.getElementById('presentTimer');
      if (timerEl) timerEl.textContent = '15:00';
    }
  }

  // ==========================================================================
  // PRESENTATION ENGINE
  // ==========================================================================
  
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
      indicatorEl.textContent = `${String(index + 1).padStart(2, '0')} / ${String(SLIDES.length).padStart(2, '0')}`;
    }
    if (notesBody) notesBody.textContent = slide.notes || '';

    // Update Projector Dynamic Background
    if (scrimEl) {
      const bg = slide.bgImage || 'assets/bg-intro.jpg';
      scrimEl.style.backgroundImage = `url('${bg}')`;
    }

    // Update Bottom Progress Bar
    if (progressBar) {
      const pct = ((index + 1) / SLIDES.length) * 100;
      progressBar.style.width = `${pct}%`;
    }

    // If on Slide 5 (Interactive Game Scene), bind the interactive stage game
    if (index === 5) {
      this.renderStageGame();
    }

    // Also highlight corresponding card on the mindmap
    if (index >= 1 && index <= 6) {
      document.querySelectorAll('.branch-card').forEach(c => c.classList.remove('active-selected'));
      const activeCard = document.querySelector(`#branch${index} .branch-card`);
      if (activeCard) activeCard.classList.add('active-selected');

      document.querySelectorAll('.branch-connector').forEach(p => p.classList.remove('active'));
      document.querySelectorAll('.connector-dot').forEach(d => d.classList.remove('active'));
      const activePath = document.getElementById(`path${index}`);
      const activeDot = document.getElementById(`dot${index}`);
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

    if (tagEl) tagEl.textContent = cur.tag || `TÌNH HUỐNG ${scenarioIdx + 1} / ${SCENARIOS.length}`;
    if (qEl) qEl.textContent = cur.question;
    if (resultBox) resultBox.classList.add('hidden');

    // Reset countdown clock to 60s
    this.stageGameTimerSeconds = 60;
    if (clockEl) clockEl.textContent = '60s';
    if (this.stageGameInterval) clearInterval(this.stageGameInterval);

    this.stageGameInterval = setInterval(() => {
      if (this.stageGameTimerSeconds > 0) {
        this.stageGameTimerSeconds--;
        if (clockEl) clockEl.textContent = `${this.stageGameTimerSeconds}s`;
      } else {
        clearInterval(this.stageGameInterval);
      }
    }, 1000);

    // Render 4 Options
    if (gridEl) {
      gridEl.innerHTML = cur.options.map(opt => `
        <div class="proj-game-option-btn" data-key="${opt.key}">
          <div class="proj-game-opt-letter">${opt.key}</div>
          <div class="proj-game-opt-text">${opt.text}</div>
        </div>
      `).join('');

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
        if (theoEl && chosenOpt) theoEl.innerHTML = `<strong>⚖️ Liên hệ bản chất Dân chủ XHCN:</strong> ${chosenOpt.theory}`;

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
        editorBody.innerHTML = `
          <div class="editor-form-group">
            <label class="editor-label">Chọn Cảnh Trình Chiếu Để Chỉnh Sửa:</label>
            <select class="editor-select" id="editorSelectSlide">
              ${SLIDES.map((s, idx) => `<option value="${idx}">Cảnh ${idx + 1}: ${s.title}</option>`).join('')}
            </select>
          </div>
          <div class="editor-form-group">
            <label class="editor-label">Tiêu Đề Cảnh:</label>
            <input type="text" class="editor-input" id="editorSlideTitle" value="${SLIDES[0].title}">
          </div>
          <div class="editor-form-group">
            <label class="editor-label">Huy Hiệu / Chủ Đề (Badge):</label>
            <input type="text" class="editor-input" id="editorSlideBadge" value="${SLIDES[0].badge}">
          </div>
          <div class="editor-form-group">
            <label class="editor-label">Đường Dẫn Hình Nền Tư Liệu (Background Image):</label>
            <input type="text" class="editor-input" id="editorSlideBg" value="${SLIDES[0].bgImage || 'assets/bg-intro.jpg'}">
          </div>
          <div class="editor-form-group">
            <label class="editor-label">Ghi Chú Cho Diễn Giả (Speaker Notes):</label>
            <textarea class="editor-textarea" id="editorSlideNotes">${SLIDES[0].notes || ''}</textarea>
          </div>
          <div class="editor-form-group">
            <label class="editor-label">Mã HTML Nội Dung Slide (Đảm bảo cấu trúc .proj-* để scale trên máy chiếu):</label>
            <textarea class="editor-textarea" style="min-height: 220px; font-family: monospace;" id="editorSlideHtml">${SLIDES[0].html.trim()}</textarea>
          </div>
        `;

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
        editorBody.innerHTML = `
          <div class="editor-form-group">
            <label class="editor-label">Chọn Tình Huống Trò Chơi Để Chỉnh Sửa:</label>
            <select class="editor-select" id="editorSelectScenario">
              ${SCENARIOS.map((sc, idx) => `<option value="${idx}">${sc.tag}: ${sc.question.substring(0, 50)}...</option>`).join('')}
            </select>
          </div>
          <div class="editor-form-group">
            <label class="editor-label">Thẻ Phân Loại (Tag):</label>
            <input type="text" class="editor-input" id="editorScenarioTag" value="${SCENARIOS[0].tag}">
          </div>
          <div class="editor-form-group">
            <label class="editor-label">Câu Hỏi Tình Huống Giảng Đường:</label>
            <textarea class="editor-textarea" id="editorScenarioQuestion">${SCENARIOS[0].question}</textarea>
          </div>
          <div class="editor-form-group">
            <label class="editor-label">Đáp Án Chuẩn Mực (A, B, C hoặc D):</label>
            <input type="text" class="editor-input" style="max-width: 100px;" id="editorScenarioCorrect" value="${SCENARIOS[0].correctOpt}">
          </div>
          <div style="border-top: 1px solid #344155; padding-top: 14px; margin-top: 14px;">
            <label class="editor-label">Nội Dung 4 Phương Án & Giải Thích (JSON Format):</label>
            <textarea class="editor-textarea" style="min-height: 220px; font-family: monospace;" id="editorScenarioOptionsJson">${JSON.stringify(SCENARIOS[0].options, null, 2)}</textarea>
          </div>
        `;

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
        editorBody.innerHTML = `
          <p style="color: #cbd5e1; font-size: 14px; margin-top: 0;">
            Dán hoặc sao chép toàn bộ cấu trúc dữ liệu JSON bên dưới để đồng bộ dữ liệu giữa các máy tính trình chiếu:
          </p>
          <textarea class="editor-textarea" style="min-height: 380px; font-family: monospace; font-size: 13px;" id="editorRawJsonArea">${JSON.stringify(fullBackup, null, 2)}</textarea>
        `;
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
  startPresentTimer() {
    if (this.presentTimerInterval) clearInterval(this.presentTimerInterval);
    const timerEl = document.getElementById('presentTimer');
    this.presentTimerInterval = setInterval(() => {
      if (this.presentTimerSeconds > 0) {
        this.presentTimerSeconds--;
        const m = String(Math.floor(this.presentTimerSeconds / 60)).padStart(2, '0');
        const s = String(this.presentTimerSeconds % 60).padStart(2, '0');
        if (timerEl) timerEl.textContent = `${m}:${s}`;
      } else {
        clearInterval(this.presentTimerInterval);
      }
    }, 1000);
  }

  // ==========================================================================
  // DEBATE ARENA & TEACHER REPORT ENGINE
  // ==========================================================================
  openDebateModal(branchId = null) {
    if (branchId !== null && branchId >= 1 && branchId <= 6) {
      this.debateTopicIndex = Math.min(PROVOCATION_BANK.length - 1, branchId - 1);
    }
    this.openModal('debateModal');
    this.renderDebateTopic();
    this.renderArenaRanking();
  }

  renderDebateTopic() {
    const topic = PROVOCATION_BANK[this.debateTopicIndex] || PROVOCATION_BANK[0];
    if (!topic) return;
    const quoteEl = document.getElementById('modalProvocationText');
    const badgeEl = document.getElementById('modalTopicBadge');
    const targetEl = document.getElementById('modalTargetText');
    const hintsEl = document.getElementById('modalLegalHints');
    const selectEl = document.getElementById('modalSelectTopic');

    if (quoteEl) quoteEl.textContent = `"${topic.statement}"`;
    if (badgeEl) badgeEl.textContent = topic.badge;
    if (targetEl) targetEl.textContent = topic.target;
    if (hintsEl) hintsEl.textContent = topic.legalHints;
    if (selectEl && selectEl.value !== String(this.debateTopicIndex)) {
      selectEl.value = String(this.debateTopicIndex);
    }
  }

  renderArenaRanking() {
    const tbody = document.getElementById('modalRankingTbody');
    if (!tbody) return;

    // Sort descending by score
    debateTeams.sort((a, b) => b.score - a.score);
    debateTeams.forEach((t, i) => t.rank = i + 1);

    tbody.innerHTML = debateTeams.map(t => `
      <tr>
        <td><strong>#${t.rank}</strong></td>
        <td>${escapeHTML(t.team)} <small>(${escapeHTML(t.leader)})</small></td>
        <td><strong style="color: #c4161c;">${t.score}đ</strong></td>
      </tr>
    `).join('');
  }

  bindDebateArena() {
    const btnSample = document.getElementById('btnModalSample');
    const btnSubmit = document.getElementById('btnModalSubmit');
    const argInput = document.getElementById('modalArgumentText');
    const selectTeam = document.getElementById('modalSelectTeam');
    const leaderInput = document.getElementById('modalLeaderName');
    const btnTimer = document.getElementById('btnModalStartTimer');
    const btnResetTimer = document.getElementById('btnModalResetTimer');
    const timerEl = document.getElementById('modalTimer');
    const selectTopic = document.getElementById('modalSelectTopic');
    const btnRandomTopic = document.getElementById('btnModalRandomTopic');

    // Topic Selector Dropdown
    if (selectTopic) {
      selectTopic.addEventListener('change', (e) => {
        audio.click();
        this.debateTopicIndex = parseInt(e.target.value, 10) || 0;
        this.renderDebateTopic();
        // Reset timer if not currently running
        if (!this.isArenaRunning) {
          this.arenaTimerSeconds = 300;
          if (timerEl) timerEl.textContent = "05:00";
        }
      });
    }

    // Random Topic Draw
    if (btnRandomTopic) {
      btnRandomTopic.addEventListener('click', () => {
        audio.pop();
        let nextIdx;
        do {
          nextIdx = Math.floor(Math.random() * PROVOCATION_BANK.length);
        } while (nextIdx === this.debateTopicIndex && PROVOCATION_BANK.length > 1);
        this.debateTopicIndex = nextIdx;
        this.renderDebateTopic();
        if (!this.isArenaRunning) {
          this.arenaTimerSeconds = 300;
          if (timerEl) timerEl.textContent = "05:00";
        }
      });
    }

    // Sample Fill (Loads sharp sample counter-argument for current topic)
    if (btnSample && argInput) {
      btnSample.addEventListener('click', () => {
        audio.click();
        const topic = PROVOCATION_BANK[this.debateTopicIndex] || PROVOCATION_BANK[0];
        argInput.value = topic.sample;
      });
    }

    // Timer Start / Pause (5 minutes = 300s)
    if (btnTimer) {
      btnTimer.addEventListener('click', () => {
        audio.alert();
        if (this.isArenaRunning) {
          clearInterval(this.arenaTimerInterval);
          this.isArenaRunning = false;
          btnTimer.textContent = "Tiếp tục";
        } else {
          this.isArenaRunning = true;
          btnTimer.textContent = "Tạm dừng";
          this.arenaTimerInterval = setInterval(() => {
            if (this.arenaTimerSeconds > 0) {
              this.arenaTimerSeconds--;
              const m = String(Math.floor(this.arenaTimerSeconds / 60)).padStart(2, '0');
              const s = String(this.arenaTimerSeconds % 60).padStart(2, '0');
              if (timerEl) timerEl.textContent = `${m}:${s}`;
            } else {
              clearInterval(this.arenaTimerInterval);
              this.isArenaRunning = false;
              this.arenaTimerSeconds = 300;
              if (btnTimer) btnTimer.textContent = "Bắt Đầu";
              if (timerEl) timerEl.textContent = "05:00";
              audio.alert();
              alert("⏰ HẾT THỜI GIAN TRANH LUẬN 5 PHÚT! CÁC NHÓM NỘP BÀI!");
            }
          }, 1000);
        }
      });
    }

    // Timer Reset Button
    if (btnResetTimer) {
      btnResetTimer.addEventListener('click', () => {
        audio.click();
        clearInterval(this.arenaTimerInterval);
        this.isArenaRunning = false;
        this.arenaTimerSeconds = 300;
        if (timerEl) timerEl.textContent = "05:00";
        if (btnTimer) btnTimer.textContent = "Bắt Đầu";
      });
    }

    // AI Evaluation Submit
    if (btnSubmit) {
      btnSubmit.addEventListener('click', () => {
        const text = argInput?.value.trim();
        if (!text || text.length < 20) {
          audio.alert();
          alert("Vui lòng nhập luận điểm phản biện chi tiết (ít nhất 20 ký tự)!");
          return;
        }

        audio.pop();
        btnSubmit.textContent = "🤖 AI ĐANG PHÂN TÍCH & CHẤM ĐIỂM...";
        btnSubmit.disabled = true;

        setTimeout(() => {
          btnSubmit.disabled = false;
          btnSubmit.textContent = "⚡ NỘP BÀI • AI CHẤM ĐIỂM";
          audio.success();

          if (typeof confetti === 'function') {
            confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
          }

          // Evaluate score
          const selectedTeamName = selectTeam ? selectTeam.value : "Nhóm Dự thi";
          const leaderName = leaderInput ? leaderInput.value : "Nhóm Trưởng";

          // Calculate score based on keyword depth & current topic
          const hasHaui = /haui|công nghiệp|quy chế 31|sv\.haui|phòng máy|lab|xưởng/i.test(text);
          const hasLaw = /hiến pháp|luật|nghị quyết|dân chủ|pháp quyền|kỷ cương|an ninh mạng|tố cáo/i.test(text);
          const hasTheory = /giai cấp|công nhân|tư sản|công hữu|mác - lênin|bản chất|thụ hưởng|bình đẳng/i.test(text);
          const hasBreakthrough = /bẻ gãy|ngụy biện|sai lầm|ngộ nhận|thực chất|giải trình|sla/i.test(text);

          let crit1 = 34 + Math.floor(Math.random() * 5); // Bẻ gãy ngụy biện (max 40)
          if (hasBreakthrough) crit1 = Math.min(40, crit1 + 2);

          let crit2 = 28 + Math.floor(Math.random() * 5); // Căn cứ pháp lý & HaUI (max 35)
          if (hasHaui || hasLaw) crit2 = Math.min(35, crit2 + 3);

          let crit3 = 20 + Math.floor(Math.random() * 4); // Thuyết phục & Văn minh (max 25)
          if (hasTheory) crit3 = Math.min(25, crit3 + 2);

          const total = crit1 + crit2 + crit3;

          let topicRemark = "";
          if (this.debateTopicIndex === 0) {
            topicRemark = hasTheory 
              ? "Lập luận sắc bén, phản bác chuẩn xác bản chất giai cấp công nhân vs tư sản; vạch trần ngụy biện đa đảng tư sản!" 
              : "Lập luận mạch lạc, cần làm rõ thêm bản chất kinh tế công hữu TLSX chủ yếu của Dân chủ XHCN.";
          } else if (this.debateTopicIndex === 1) {
            topicRemark = hasLaw 
              ? "Viện dẫn xuất sắc Hiến pháp 2013 và Luật An ninh mạng 2018; phân biệt rành mạch tự do và kỷ cương pháp quyền!" 
              : "Tư duy phản biện tốt, nên viện dẫn thêm Điều 14 Hiến pháp 2013 về giới hạn quyền công dân.";
          } else if (this.debateTopicIndex === 2) {
            topicRemark = "Làm nổi bật bước tiến lý luận của thành tố 'Dân thụ hưởng' tại Đại hội XIII; dẫn chứng an sinh xã hội rất thuyết phục!";
          } else if (this.debateTopicIndex === 3) {
            topicRemark = hasHaui 
              ? "Lập luận đanh thép, phản bác trúng tim đen tư tưởng thờ ơ học đường; viện dẫn xuất sắc Quy chế 31/NQ-HĐT của HaUI!" 
              : "Lập luận tốt, cần bổ sung ví dụ thực tế giám sát thiết bị phòng lab IoT và xưởng thực hành HaUI.";
          } else if (this.debateTopicIndex === 4) {
            topicRemark = "Nhận diện trúng 4 điểm nghẽn thể chế; đề xuất chuẩn SLA giải trình trong 7 ngày và cơ chế bảo vệ người phản ánh rất xác đáng!";
          } else {
            topicRemark = "Khắc họa sinh động chuẩn mực kỹ sư 4.0 'vừa hồng vừa chuyên' theo lời Bác dạy; tư duy đạo đức công nghệ rất tiến bộ!";
          }

          const teamEntry = {
            rank: 1,
            team: selectedTeamName,
            leader: leaderName,
            score: total,
            crit1: crit1,
            crit2: crit2,
            crit3: crit3,
            type: total >= 90 ? "Xuất sắc" : total >= 80 ? "Giỏi" : "Khá",
            argument: text,
            remark: topicRemark
          };

          // Update existing or add new
          const existingIdx = debateTeams.findIndex(t => t.team === selectedTeamName);
          if (existingIdx >= 0) {
            debateTeams[existingIdx] = teamEntry;
          } else {
            debateTeams.unshift(teamEntry);
          }

          // Update UI
          document.getElementById('verdictTeamName').textContent = teamEntry.team;
          document.getElementById('verdictLeader').textContent = `Nhóm trưởng: ${teamEntry.leader}`;
          document.getElementById('verdictTotal').textContent = `${teamEntry.score}/100đ`;
          document.getElementById('vCrit1').textContent = `${teamEntry.crit1}/40đ`;
          document.getElementById('vCrit2').textContent = `${teamEntry.crit2}/35đ`;
          document.getElementById('vCrit3').textContent = `${teamEntry.crit3}/25đ`;
          document.getElementById('vBar1').style.width = `${(teamEntry.crit1 / 40) * 100}%`;
          document.getElementById('vBar2').style.width = `${(teamEntry.crit2 / 35) * 100}%`;
          document.getElementById('vBar3').style.width = `${(teamEntry.crit3 / 25) * 100}%`;
          document.getElementById('vAiComment').textContent = teamEntry.remark;

          this.renderArenaRanking();
        }, 1200);
      });
    }

    // Open Teacher Dossier
    const btnDossier = document.getElementById('btnOpenTeacherDossier');
    if (btnDossier) {
      btnDossier.addEventListener('click', () => {
        audio.success();
        this.renderTeacherDossier();
        this.openModal('dossierModal');
      });
    }

    const btnPrint = document.getElementById('btnPrintDossier');
    if (btnPrint) {
      btnPrint.addEventListener('click', () => {
        window.print();
      });
    }

    const btnCopySummary = document.getElementById('btnCopyDossierSummary');
    if (btnCopySummary) {
      btnCopySummary.addEventListener('click', () => {
        audio.click();
        const top = debateTeams[0];
        const summary = `📋 BÁO CÁO PHẢN BIỆN LÝ LUẬN HaUI 2026\nĐề tài: Bản chất Dân chủ XHCN ở Việt Nam\nTop 1: ${top.team} (${top.leader}) - Điểm: ${top.score}/100đ\nNhận xét AI: ${top.remark}\n(Đã xác thực điện tử và trích xuất từ hệ thống RED MIND / HaUI)`;
        navigator.clipboard.writeText(summary).then(() => {
          alert("✅ Đã sao chép tóm tắt báo cáo! Bạn có thể dán vào nhóm Zalo để gửi Thầy/Cô.");
        });
      });
    }
  }

  renderTeacherDossier() {
    const tableBody = document.getElementById('dossierTableTbody');
    const detailsContainer = document.getElementById('dossierDetailsContainer');
    const dateEl = document.getElementById('dossierDate');
    const quoteEl = document.getElementById('dossierQuoteText');

    if (dateEl) dateEl.textContent = new Date().toLocaleDateString('vi-VN');
    const currentTopic = PROVOCATION_BANK[this.debateTopicIndex];
    if (quoteEl && currentTopic) quoteEl.textContent = `"${currentTopic.statement}"`;

    if (tableBody) {
      tableBody.innerHTML = debateTeams.map(t => `
        <tr>
          <td><strong>#${t.rank}</strong></td>
          <td>${escapeHTML(t.team)}</td>
          <td>${escapeHTML(t.leader)}</td>
          <td><strong>${t.score}/100đ</strong></td>
          <td><span style="color: #c4161c; font-weight: bold;">${escapeHTML(t.type)}</span></td>
        </tr>
      `).join('');
    }

    if (detailsContainer) {
      detailsContainer.innerHTML = debateTeams.map(t => `
        <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 14px; margin-bottom: 12px; font-size: 13px;">
          <strong style="color: #0f172a;">${escapeHTML(t.team)} (${escapeHTML(t.leader)}) — Điểm: ${t.score}đ:</strong>
          <p style="margin: 6px 0; font-style: italic; color: #334155;">"${escapeHTML(t.argument)}"</p>
          <small style="color: #c4161c;"><strong>💡 Nhận xét mô phỏng:</strong> ${escapeHTML(t.remark)}</small>
        </div>
      `).join('');
    }
  }

  // ==========================================================================
  // LIBRARY MODAL (200 references)
  // ==========================================================================
  openLibraryModal(highlightRefId = null) {
    this.openModal('libraryModal');
    this.renderLibraryItems('all', highlightRefId);
  }

  renderLibraryItems(category = 'all', highlightId = null) {
    const container = document.getElementById('libItemsList');
    if (!container) return;

    let items = REFERENCES_DB;
    if (category !== 'all') {
      items = items.filter(r => r.category === category);
    }

    container.innerHTML = items.map(r => `
      <div class="lib-card-item ${highlightId === r.id ? 'highlight-box' : ''}" id="libItem_${escapeHTML(r.id)}">
        <span class="item-id">#${escapeHTML(r.id)}</span>
        <div style="flex:1;">
          <h5>${escapeHTML(r.title)}</h5>
          <p>Nguồn: ${escapeHTML(r.source)}</p>
          <a href="${escapeHTML(r.link)}" target="_blank" rel="noopener noreferrer">🔗 Mở tài liệu gốc &rarr;</a>
        </div>
      </div>
    `).join('');

    if (highlightId) {
      const el = document.getElementById(`libItem_${highlightId}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  bindLibrary() {
    const filterTabs = document.getElementById('libFilterTabs');
    const searchInput = document.getElementById('libSearchInput');

    if (filterTabs) {
      filterTabs.querySelectorAll('.btn-chip').forEach(btn => {
        btn.addEventListener('click', () => {
          audio.click();
          filterTabs.querySelectorAll('.btn-chip').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const cat = btn.getAttribute('data-filter');
          this.renderLibraryItems(cat);
        });
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', () => {
        const rawQ = searchInput.value.trim();
        const normQ = removeVietnameseTones(rawQ);
        const container = document.getElementById('libItemsList');
        if (!container) return;

        const filtered = REFERENCES_DB.filter(r => 
          removeVietnameseTones(r.title).includes(normQ) || 
          r.id.toLowerCase().includes(normQ) || 
          removeVietnameseTones(r.source).includes(normQ)
        );

        if (filtered.length === 0) {
          container.innerHTML = `
            <div style="text-align: center; padding: 24px; color: #64748b;">
              <p>Không tìm thấy tư liệu nào khớp với từ khóa "${escapeHTML(rawQ)}".</p>
            </div>
          `;
          return;
        }

        container.innerHTML = filtered.map(r => `
          <div class="lib-card-item">
            <span class="item-id">#${escapeHTML(r.id)}</span>
            <div style="flex:1;">
              <h5>${escapeHTML(r.title)}</h5>
              <p>Nguồn: ${escapeHTML(r.source)}</p>
              <a href="${escapeHTML(r.link)}" target="_blank" rel="noopener noreferrer">🔗 Mở tài liệu gốc &rarr;</a>
            </div>
          </div>
        `).join('');
      });
    }
  }

  // ==========================================================================
  // STUDENT NOTES STORAGE
  // ==========================================================================
  bindNotes() {
    const textarea = document.getElementById('personalNotesText');
    const btnSave = document.getElementById('btnSaveNotes');

    // Load saved notes
    if (textarea) {
      const saved = localStorage.getItem('redmind_haui_notes');
      if (saved) textarea.value = saved;
    }

    if (btnSave && textarea) {
      btnSave.addEventListener('click', () => {
        audio.success();
        localStorage.setItem('redmind_haui_notes', textarea.value);
        alert("💾 Ghi chú cá nhân đã được lưu thành công trên trình duyệt của bạn!");
      });
    }
  }

  // ==========================================================================
  // SPECIALIZED MODULE 1 & 2: MODALS BINDING (Matrix & Bottlenecks)
  // ==========================================================================
  bindSpecializedModals() {
    // 1. Matrix Modal
    const btnOpenMatrix = document.getElementById('btnOpenMatrixModal');
    const btnCloseMatrix = document.getElementById('btnCloseMatrixModal');
    if (btnOpenMatrix) {
      btnOpenMatrix.addEventListener('click', () => this.openModal('triangleMatrixModal'));
    }
    if (btnCloseMatrix) {
      btnCloseMatrix.addEventListener('click', () => this.closeModal('triangleMatrixModal'));
    }

    const tabTriangle = document.getElementById('tabMatrixTriangle');
    const tabComp = document.getElementById('tabMatrixComparison');
    const viewTriangle = document.getElementById('viewMatrixTriangle');
    const viewComp = document.getElementById('viewMatrixComparison');

    if (tabTriangle && tabComp) {
      tabTriangle.addEventListener('click', () => {
        audio.click();
        tabTriangle.classList.add('active');
        tabComp.classList.remove('active');
        viewTriangle.classList.remove('hidden');
        viewComp.classList.add('hidden');
      });

      tabComp.addEventListener('click', () => {
        audio.click();
        tabComp.classList.add('active');
        tabTriangle.classList.remove('active');
        viewComp.classList.remove('hidden');
        viewTriangle.classList.add('hidden');
      });
    }

    // 2. Bottlenecks Modal
    const btnOpenBn = document.getElementById('btnOpenBottlenecksModal');
    const btnCloseBn = document.getElementById('btnCloseBottlenecksModal');
    if (btnOpenBn) {
      btnOpenBn.addEventListener('click', () => this.openModal('bottlenecksModal'));
    }
    if (btnCloseBn) {
      btnCloseBn.addEventListener('click', () => this.closeModal('bottlenecksModal'));
    }

    // 3. Situations Modal
    const btnOpenSit = document.getElementById('btnOpenSituationsModal');
    const btnCloseSit = document.getElementById('btnCloseSituationsModal');
    if (btnOpenSit) {
      btnOpenSit.addEventListener('click', () => this.openModal('situationsModal'));
    }
    if (btnCloseSit) {
      btnCloseSit.addEventListener('click', () => this.closeModal('situationsModal'));
    }

    // 4. Commitment Card Modal
    const btnOpenComm = document.getElementById('btnOpenCommitmentModal');
    const btnCloseComm = document.getElementById('btnCloseCommitmentModal');
    if (btnOpenComm) {
      btnOpenComm.addEventListener('click', () => this.openModal('commitmentModal'));
    }
    if (btnCloseComm) {
      btnCloseComm.addEventListener('click', () => this.closeModal('commitmentModal'));
    }

    // 5. Pulse Poll Modal
    const btnOpenPoll = document.getElementById('btnOpenPulsePollModal');
    const btnClosePoll = document.getElementById('btnClosePulsePollModal');
    if (btnOpenPoll) {
      btnOpenPoll.addEventListener('click', () => this.openModal('pulsePollModal'));
    }
    if (btnClosePoll) {
      btnClosePoll.addEventListener('click', () => this.closeModal('pulsePollModal'));
    }
  }

  // ==========================================================================
  // DUAL AI ENGINE: TRỤC B (AUTO) vs TRỤC A (LIVE ANALYZER)
  // ==========================================================================
  bindDualAiEngine() {
    const tabB = document.getElementById('tabEngineB');
    const tabA = document.getElementById('tabEngineA');
    const viewB = document.getElementById('engineBView');
    const viewA = document.getElementById('engineAView');
    const input = document.getElementById('liveNewsInput');
    const btnAnalyze = document.getElementById('btnAnalyzeLiveNews');

    const form = document.getElementById('liveNewsForm');
    const errEl = document.getElementById('liveNewsError');

    // Hai chế độ "Hôm nay" / "Khám phá tin tức": chỉ một panel hiển thị tại một thời điểm
    const activate = (which, focus = false) => {
      const isB = which === 'B';
      tabB.classList.toggle('active', isB);
      tabA.classList.toggle('active', !isB);
      tabB.setAttribute('aria-selected', String(isB));
      tabA.setAttribute('aria-selected', String(!isB));
      tabB.tabIndex = isB ? 0 : -1;
      tabA.tabIndex = isB ? -1 : 0;
      viewB?.classList.toggle('hidden', !isB);
      viewA?.classList.toggle('hidden', isB);
      if (focus) (isB ? tabB : tabA).focus();
    };

    if (tabB && tabA) {
      tabB.addEventListener('click', () => { audio.click(); activate('B'); });
      tabA.addEventListener('click', () => { audio.click(); activate('A'); });
      [tabB, tabA].forEach(t => t.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          e.preventDefault();
          activate(t === tabB ? 'A' : 'B', true);
        }
      }));
    }

    const showError = (msg) => {
      if (!errEl) return;
      errEl.textContent = msg;
      errEl.classList.toggle('hidden', !msg);
      if (input) input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    };

    const SAMPLES = {
      'dat-dai': {
        title: "Luật Đất đai 2024 có hiệu lực thi hành: Bồi thường minh bạch và quyền lợi người dân",
        law: "Hiến pháp 2013 (Điều 53, 54: Đất đai là tài sản công thuộc sở hữu toàn dân do Nhà nước đại diện chủ sở hữu), Luật Đất đai 2024, Luật Thực hiện dân chủ ở cơ sở 2022.",
        impact: "Tác động đến quyền lợi kinh tế của gia đình sinh viên, chính sách giải tỏa mặt bằng, quy hoạch ký túc xá và mở rộng cơ sở đào tạo của HaUI.",
        action: "1. Tuyên truyền cho người thân quy định công khai giá đất và niêm yết phương án bồi thường tại UBND xã/phường.\n2. Vận dụng kiến thức Pháp luật đại cương và CNXHKH để phản biện tin giả xuyên tạc trên mạng.",
        meta: "Cổng thông tin Quốc hội / Bộ TN&MT."
      },
      'tien-luong': {
        title: "Cải cách chính sách tiền lương và mở rộng lưới an sinh xã hội toàn dân",
        law: "Nghị quyết số 27-NQ/TW về cải cách chính sách tiền lương; Nguyên tắc phân phối theo lao động trong nền kinh tế thị trường định hướng XHCN (Dân thụ hưởng).",
        impact: "Ảnh hưởng trực tiếp đến thu nhập khi ra trường của kỹ sư HaUI, mức hỗ trợ chi phí sinh hoạt và các gói bảo hiểm y tế sinh viên.",
        action: "1. Nâng cao tay nghề và kỹ năng thực hành tại các xưởng CNC HaUI để đáp ứng bậc lương kỹ sư chất lượng cao.\n2. Tìm hiểu quyền lợi bảo hiểm y tế và an sinh xã hội sinh viên tại cổng e-HaUI.",
        meta: "Cổng Thông tin Chính phủ / Bộ LĐ-TB&XH."
      },
      'hoc-phi': {
        title: "Thực hiện tự chủ đại học và minh bạch cơ cấu học phí năm học 2026 tại HaUI",
        law: "Luật Giáo dục đại học (sửa đổi 2018), Nghị định 81/2021/NĐ-CP, Quy chế số 31/NQ-HĐT của Hội đồng trường HaUI.",
        impact: "Ảnh hưởng trực tiếp đến kế hoạch tài chính cá nhân và quyền được thụ hưởng cơ sở vật chất tương xứng với mức học phí chi trả.",
        action: "1. Tham dự buổi Đối thoại trực tuyến thường niên giữa Ban Giám hiệu và đại diện sinh viên.\n2. Gửi đề xuất điều chỉnh định mức sử dụng phòng thực hành và mở rộng thời gian thư viện điện tử qua sv.haui.edu.vn.",
        meta: "Hội đồng trường HaUI / Cổng sv.haui.edu.vn."
      },
      'hoc-bong': {
        title: "Kế hoạch xét cấp Học bổng khuyến khích học tập và Học bổng doanh nghiệp kỳ II/2026",
        law: "Thông tư 35/2014/TT-BGDĐT, Quy chế thi đua khen thưởng và Quy chế số 31/NQ-HĐT của HaUI.",
        impact: "Động lực học tập cho sinh viên đạt điểm rèn luyện và GPA cao; hỗ trợ sinh viên có hoàn cảnh khó khăn vươn lên.",
        action: "1. Kiểm tra kỹ bảng điểm và tiêu chí điểm rèn luyện cá nhân trên Cổng sinh viên trước ngày chốt dữ liệu.\n2. Nếu có sai sót, làm đơn phản hồi trực tuyến ngay trong thời hạn 7 ngày công khai kết quả dự kiến.",
        meta: "Phòng Công tác sinh viên HaUI."
      }
    };

    document.querySelectorAll('.chip-sample').forEach(chip => {
      chip.addEventListener('click', () => {
        audio.click();
        const topic = chip.getAttribute('data-topic');
        const data = SAMPLES[topic];
        if (data && input) {
          input.value = data.title;
          showError('');
          this.renderLiveAnalysis(data);
        }
      });
    });

    if (input) input.addEventListener('input', () => { if (input.value.trim()) showError(''); });

    const runAnalysis = () => {
      if (!input || !btnAnalyze || btnAnalyze.disabled) return;
      const q = input.value.trim();
      if (!q) {
        audio.alert();
        showError('Hãy nhập tiêu đề tin hoặc chọn một chủ đề gợi ý.');
        input.focus();
        return;
      }
      showError('');
      audio.pop();
      btnAnalyze.textContent = 'Đang phân tích…';
      btnAnalyze.disabled = true;
      btnAnalyze.setAttribute('aria-busy', 'true');

      setTimeout(() => {
        btnAnalyze.disabled = false;
        btnAnalyze.textContent = 'Phân tích';
        btnAnalyze.removeAttribute('aria-busy');
        audio.success();
        const shortQ = q.length > 60 ? `${q.substring(0, 60)}…` : q;
        this.renderLiveAnalysis({
          title: q,
          law: "Vận dụng Hiến pháp 2013 (Điều 2, 4), Luật Thực hiện dân chủ ở cơ sở 2022 và các quy định pháp luật chuyên ngành tương ứng.",
          impact: `Sự kiện "${shortQ}" có thể tác động đến môi trường sống, cơ hội việc làm và trách nhiệm công dân của người học HaUI.`,
          action: "1. Chủ động tìm hiểu văn bản gốc từ cơ quan ban hành, không chia sẻ tin đồn thất thiệt.\n2. Vận dụng kiến thức môn CNXHKH để nhận diện bản chất sự việc và phát huy vai trò xung kích vì cộng đồng.",
          meta: "Đoàn - Hội / Cố vấn học tập HaUI."
        });
      }, 700);
    };

    if (form) {
      form.addEventListener('submit', (e) => { e.preventDefault(); runAnalysis(); });
    } else if (btnAnalyze) {
      btnAnalyze.addEventListener('click', runAnalysis);
    }
  }

  // P0-4: Kết quả phân tích có chứa input người dùng → chỉ dùng textContent (CSS white-space: pre-line cho xuống dòng)
  renderLiveAnalysis(data) {
    const setText = (id, txt) => { const el = document.getElementById(id); if (el) el.textContent = txt || ''; };
    setText('liveResultTitle', data.title);
    setText('resLawText', data.law);
    setText('resImpactText', data.impact);
    setText('resActionText', data.action);
    setText('resMetaText', data.meta);

    document.getElementById('liveNewsEmpty')?.classList.add('hidden');
    document.getElementById('liveResultGrid')?.classList.remove('hidden');
  }

  // ==========================================================================
  // SPECIALIZED MODULE 3: 5 TÌNH HUỐNG THỰC TIỄN HaUI
  // ==========================================================================
  bindSituations() {
    const strip = document.getElementById('situationsTabStrip');
    if (strip) {
      strip.querySelectorAll('.sit-tab').forEach(tab => {
        tab.addEventListener('click', () => {
          audio.click();
          strip.querySelectorAll('.sit-tab').forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          const sitId = parseInt(tab.getAttribute('data-sit'), 10);
          this.renderSituation(sitId);
        });
      });
    }
  }

  renderSituation(sitId) {
    const data = SITUATIONS_DATA[sitId];
    const container = document.getElementById('situationDetailScreen');
    if (!data || !container) return;

    container.innerHTML = `
      <div style="margin-bottom: 14px;">
        <span class="badge-flag" style="background:#0284c7;">HaUI Case #${sitId}</span>
        <h3 style="font-size: 16px; font-weight: 800; color: #0f172a; margin: 4px 0 8px;">${data.title}</h3>
        <div style="background: #f8fafc; padding: 12px 14px; border-radius: 8px; border-left: 3px solid #0284c7; font-size: 13px; color: #334155; line-height: 1.5; margin-bottom: 10px;">
          <strong>📍 Bối cảnh thực tế:</strong> ${data.context}
        </div>
        <p style="font-size: 12.5px; color: #b91c1c; font-weight: 600;">⚠️ Tình thế lưỡng nan: ${data.dilemma}</p>
      </div>

      <div style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 10px; padding: 16px; margin-bottom: 14px;">
        <h4 style="font-size: 13.5px; font-weight: 800; color: #0f172a; margin-bottom: 10px;">
          ${data.quiz.question}
        </h4>
        <div class="sit-options-container" style="display: flex; flex-direction: column; gap: 8px;">
          ${data.quiz.options.map((opt, idx) => `
            <div class="sit-opt-item" data-opt-idx="${idx}" style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px 14px; cursor: pointer; transition: all 0.2s;">
              <span style="font-size: 12.5px; font-weight: 500; color: #1e293b;">${opt.text}</span>
              <div class="sit-opt-feedback hidden" style="margin-top: 6px; font-size: 12px; font-weight: 600; padding: 6px 10px; border-radius: 6px;"></div>
            </div>
          `).join('')}
        </div>
      </div>

      <div style="font-size: 12px; color: #64748b; background: #fafaf9; padding: 8px 12px; border-radius: 6px;">
        <strong>⚖️ Căn cứ quy định:</strong> ${data.legalRule}
      </div>
    `;

    // Bind option click
    container.querySelectorAll('.sit-opt-item').forEach(item => {
      item.addEventListener('click', () => {
        const idx = parseInt(item.getAttribute('data-opt-idx'), 10);
        const opt = data.quiz.options[idx];
        const fbEl = item.querySelector('.sit-opt-feedback');

        if (opt.isCorrect) {
          audio.success();
          item.style.borderColor = '#16a34a';
          item.style.background = '#f0fdf4';
          fbEl.className = 'sit-opt-feedback';
          fbEl.style.background = '#dcfce7';
          fbEl.style.color = '#15803d';
          fbEl.textContent = opt.feedback;
          fbEl.classList.remove('hidden');
          if (typeof confetti === 'function') confetti({ particleCount: 40, spread: 50 });
        } else {
          audio.alert();
          item.style.borderColor = '#dc2626';
          item.style.background = '#fef2f2';
          fbEl.className = 'sit-opt-feedback';
          fbEl.style.background = '#fee2e2';
          fbEl.style.color = '#b91c1c';
          fbEl.textContent = opt.feedback;
          fbEl.classList.remove('hidden');
        }
      });
    });
  }

  // ==========================================================================
  // SPECIALIZED MODULE 4: COMMITMENT SVG CARD GENERATOR
  // ==========================================================================
  bindCommitmentCard() {
    const btnGen = document.getElementById('btnGenerateSvgCard');
    const btnDl = document.getElementById('btnDownloadSvg');
    const btnPrint = document.getElementById('btnPrintCard');

    if (btnGen) {
      btnGen.addEventListener('click', () => {
        audio.success();
        this.generateSvgCard();
        if (typeof confetti === 'function') {
          confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
        }
      });
    }

    if (btnDl) {
      btnDl.addEventListener('click', () => {
        audio.click();
        const container = document.getElementById('svgCardContainer');
        const svg = container?.querySelector('svg');
        if (!svg) return;
        const serializer = new XMLSerializer();
        const svgBlob = new Blob([serializer.serializeToString(svg)], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `The_Cam_Ket_Dan_Chu_HaUI_${Date.now()}.svg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });
    }

    if (btnPrint) {
      btnPrint.addEventListener('click', () => {
        window.print();
      });
    }
  }

  generateSvgCard() {
    const rawName = document.getElementById('commStudentName')?.value.trim() || "Nguyễn Văn An";
    const rawMssv = document.getElementById('commStudentId')?.value.trim() || "2023601234";
    const rawClass = document.getElementById('commClass')?.value.trim() || "CNTT01 - K18";
    const dateStr = new Date().toLocaleDateString('vi-VN');

    // Gather checked commitments
    const checked = [];
    document.querySelectorAll('#commChecklist input[type="checkbox"]:checked').forEach(cb => {
      checked.push(cb.value);
    });
    const c1 = checked[0] || "Học thật, thi thật, trung thực trong học thuật.";
    const c2 = checked[1] || "Khách quan khi đánh giá môn học cuối kỳ.";
    const c3 = checked[2] || "Chủ động phản ánh máy hỏng qua sv.haui.edu.vn.";

    // P0-4: Chống HTML/SVG injection bằng escapeHTML
    const sName = escapeHTML(rawName.toUpperCase());
    const sMssv = escapeHTML(rawMssv);
    const sClass = escapeHTML(rawClass);
    const sc1 = escapeHTML(c1.substring(0, 48));
    const sc2 = escapeHTML(c2.substring(0, 48));
    const sc3 = escapeHTML(c3.substring(0, 48));
    const sDate = escapeHTML(dateStr);

    const svgMarkup = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 300" width="100%" style="height: auto; max-height: 300px; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.25);">
        <defs>
          <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#991016"/>
            <stop offset="60%" stop-color="#7f1d1d"/>
            <stop offset="100%" stop-color="#450a0a"/>
          </linearGradient>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fef08a"/>
            <stop offset="50%" stop-color="#f59e0b"/>
            <stop offset="100%" stop-color="#b45309"/>
          </linearGradient>
        </defs>

        <!-- Background -->
        <rect width="480" height="300" rx="12" fill="url(#bgGrad)"/>

        <!-- Border Frame -->
        <rect x="10" y="10" width="460" height="280" rx="8" fill="none" stroke="url(#goldGrad)" stroke-width="2"/>
        <rect x="14" y="14" width="452" height="272" rx="6" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>

        <!-- Top Header -->
        <text x="240" y="38" font-family="'Be Vietnam Pro', sans-serif" font-size="12" font-weight="700" fill="#fde68a" text-anchor="middle" letter-spacing="1">
          TRƯỜNG ĐẠI HỌC CÔNG NGHIỆP HÀ NỘI
        </text>
        <text x="240" y="58" font-family="'Be Vietnam Pro', 'Montserrat', sans-serif" font-size="14" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="0.5">
          THẺ CAM KẾT RÈN LUYỆN DÂN CHỦ CÁ NHÂN
        </text>
        <line x1="80" y1="68" x2="400" y2="68" stroke="url(#goldGrad)" stroke-width="1.5"/>

        <!-- Student Info -->
        <text x="32" y="94" font-family="'Be Vietnam Pro', sans-serif" font-size="11" font-weight="600" fill="#fde68a">HỌ VÀ TÊN:</text>
        <text x="110" y="94" font-family="'Be Vietnam Pro', sans-serif" font-size="12" font-weight="800" fill="#ffffff">${sName}</text>

        <text x="32" y="114" font-family="'Be Vietnam Pro', sans-serif" font-size="11" font-weight="600" fill="#fde68a">MSSV:</text>
        <text x="75" y="114" font-family="'Be Vietnam Pro', sans-serif" font-size="11" font-weight="700" fill="#ffffff">${sMssv}</text>

        <text x="180" y="114" font-family="'Be Vietnam Pro', sans-serif" font-size="11" font-weight="600" fill="#fde68a">LỚP / KHOA:</text>
        <text x="255" y="114" font-family="'Be Vietnam Pro', sans-serif" font-size="11" font-weight="700" fill="#ffffff">${sClass}</text>

        <!-- 3 Commitments -->
        <text x="32" y="142" font-family="'Be Vietnam Pro', sans-serif" font-size="10.5" font-weight="700" fill="#fde68a">NỘI DUNG CAM KẾT RÈN LUYỆN:</text>

        <circle cx="38" cy="162" r="3" fill="#fbbf24"/>
        <text x="48" y="165" font-family="'Be Vietnam Pro', sans-serif" font-size="9.5" fill="#f1f5f9">${sc1}...</text>

        <circle cx="38" cy="184" r="3" fill="#fbbf24"/>
        <text x="48" y="187" font-family="'Be Vietnam Pro', sans-serif" font-size="9.5" fill="#f1f5f9">${sc2}...</text>

        <circle cx="38" cy="206" r="3" fill="#fbbf24"/>
        <text x="48" y="209" font-family="'Be Vietnam Pro', sans-serif" font-size="9.5" fill="#f1f5f9">${sc3}...</text>

        <!-- QR Code Mock -->
        <rect x="360" y="90" width="80" height="80" rx="6" fill="#ffffff"/>
        <rect x="368" y="98" width="20" height="20" fill="#991016"/>
        <rect x="412" y="98" width="20" height="20" fill="#991016"/>
        <rect x="368" y="142" width="20" height="20" fill="#991016"/>
        <rect x="395" y="120" width="10" height="20" fill="#1e293b"/>
        <text x="400" y="182" font-family="monospace" font-size="7.5" fill="#fde68a" text-anchor="middle">MÔ PHỎNG SỐ</text>

        <!-- Red Commitment Stamp Circle -->
        <circle cx="400" cy="235" r="38" fill="none" stroke="#ef4444" stroke-width="2" stroke-dasharray="3 1"/>
        <circle cx="400" cy="235" r="34" fill="none" stroke="#ef4444" stroke-width="1"/>
        <text x="400" y="222" font-family="'Be Vietnam Pro', sans-serif" font-size="6.5" font-weight="900" fill="#ef4444" text-anchor="middle">ĐẠI HỌC CÔNG NGHIỆP HÀ NỘI</text>
        <text x="400" y="235" font-family="'Be Vietnam Pro', sans-serif" font-size="7" font-weight="900" fill="#ef4444" text-anchor="middle">★ CAM KẾT RÈN LUYỆN ★</text>
        <text x="400" y="246" font-family="'Be Vietnam Pro', sans-serif" font-size="6.5" font-weight="800" fill="#ef4444" text-anchor="middle">MÔ PHỎNG DÂN CHỦ</text>
        <text x="400" y="256" font-family="'Be Vietnam Pro', sans-serif" font-size="6" font-weight="700" fill="#ef4444" text-anchor="middle">2026</text>

        <!-- Footer -->
        <text x="32" y="270" font-family="'Be Vietnam Pro', sans-serif" font-size="9" fill="#cbd5e1">
          Ngày cấp: ${sDate} &bull; Hệ thống RED MIND / HaUI
        </text>
      </svg>
    `;

    const container = document.getElementById('svgCardContainer');
    if (container) container.innerHTML = svgMarkup;
  }

  // ==========================================================================
  // SPECIALIZED MODULE 5: CLASSROOM PULSE POLL QR (MÔ PHỎNG CỤC BỘ)
  // ==========================================================================
  bindPulsePoll() {
    let votes = { A: 33, B: 36, C: 12, D: 5 };
    try {
      const savedVotes = localStorage.getItem('redmind_poll_votes');
      if (savedVotes) votes = JSON.parse(savedVotes);
    } catch {}

    const hasVoted = localStorage.getItem('redmind_poll_voted');
    const votedNotice = document.getElementById('pollVotedNotice');

    const updatePollUI = () => {
      const total = votes.A + votes.B + votes.C + votes.D;
      const countEl = document.getElementById('pollTotalVotes');
      if (countEl) countEl.textContent = `${total} phiếu (Mô phỏng)`;

      ['A', 'B', 'C', 'D'].forEach(k => {
        const pct = Math.round((votes[k] / total) * 100);
        const pEl = document.getElementById(`pPercent${k}`);
        const barEl = document.getElementById(`pBar${k}`);
        if (pEl) pEl.textContent = `${pct}% (${votes[k]} phiếu)`;
        if (barEl) barEl.style.width = `${pct}%`;
      });
    };

    updatePollUI();

    // P1-8: Kiểm tra đã bỏ phiếu trên thiết bị này chưa
    if (hasVoted) {
      if (votedNotice) votedNotice.classList.remove('hidden');
      document.querySelectorAll('.btn-vote').forEach(btn => {
        const opt = btn.getAttribute('data-vote');
        if (opt === hasVoted) {
          btn.textContent = "✓ Bạn đã chọn phương án này";
          btn.classList.add('active');
        } else {
          btn.disabled = true;
          btn.style.opacity = '0.5';
        }
      });
    }

    document.querySelectorAll('.btn-vote').forEach(btn => {
      btn.addEventListener('click', () => {
        if (localStorage.getItem('redmind_poll_voted')) {
          alert('Bạn đã tham gia bỏ phiếu mô phỏng trên trình duyệt này rồi.');
          return;
        }
        audio.pop();
        const opt = btn.getAttribute('data-vote');
        if (votes[opt] !== undefined) {
          votes[opt]++;
          try {
            localStorage.setItem('redmind_poll_votes', JSON.stringify(votes));
            localStorage.setItem('redmind_poll_voted', opt);
          } catch {}
          updatePollUI();

          if (votedNotice) votedNotice.classList.remove('hidden');
          document.querySelectorAll('.btn-vote').forEach(b => {
            const bOpt = b.getAttribute('data-vote');
            if (bOpt === opt) {
              b.textContent = "✓ Đã ghi nhận phiếu!";
              b.classList.add('active');
            } else {
              b.disabled = true;
              b.style.opacity = '0.5';
            }
          });
          if (typeof confetti === 'function') confetti({ particleCount: 30, spread: 45 });
        }
      });
    });
  }

  // ==========================================================================
  // SPECIALIZED MODULE 6: WEBSITE REVIEWS & EVALUATION SYSTEM
  // ==========================================================================
  bindReviewsModule() {
    const INITIAL_REVIEWS = [
      {
        id: "rev-1",
        author: "TS. Nguyễn Minh Tuấn",
        role: "lecturer",
        roleName: "Giảng viên",
        unit: "Bộ môn Lý luận Chính trị - HaUI",
        stars: 5,
        critScores: [5, 5, 5, 5],
        tags: ["Lý luận đanh thép", "Thực tiễn HaUI sống động", "Học tập thiết thực"],
        text: "Sáng kiến số hóa bài thuyết trình rất đột phá và công phu! Điểm sáng nhất là đã gắn kết chặt chẽ vế 'Dân thụ hưởng' với mô hình tự chủ đại học và quy chế 31/NQ-HĐT của trường. Sinh viên không chỉ hiểu lý luận trừu tượng mà biết rõ mình được quyền gì và cần làm gì khi bước vào phòng lab xưởng máy.",
        time: "2 giờ trước",
        likes: 24,
        avatar: "👨‍🏫",
        isSample: true
      },
      {
        id: "rev-2",
        author: "ThS. Lê Thu Trang",
        role: "lecturer",
        roleName: "Giảng viên",
        unit: "Khoa Lý luận Chính trị - HaUI",
        stars: 5,
        critScores: [5, 5, 5, 4],
        tags: ["Sơ đồ tư duy trực quan", "Học tập thiết thực", "Slide 16:9 chuyên nghiệp"],
        text: "Đặc biệt khen ngợi bộ công cụ Trợ lý Học tập và Khung phân tích tình huống thực tế. Việc sử dụng Hiến pháp và Luật Thực hiện dân chủ ở cơ sở 2022 để định hướng nhận thức cho sinh viên trước thông tin đa chiều là phương pháp giáo dục chính trị rất tân tiến, trực quan.",
        time: "5 giờ trước",
        likes: 19,
        avatar: "👩‍🏫",
        isSample: true
      },
      {
        id: "rev-3",
        author: "Trần Đức Mạnh",
        role: "peer",
        roleName: "Nhóm phản biện",
        unit: "Trưởng nhóm 2 - Khoa Cơ khí (K18)",
        stars: 5,
        critScores: [5, 5, 5, 5],
        tags: ["Thực tiễn HaUI sống động", "Phản biện sâu sắc", "Slide 16:9 chuyên nghiệp"],
        text: "Các bạn chuẩn bị bài thuyết trình rất công phu! Phần phân biệt giữa 'Kiểm tra' và 'Giám sát' tại xưởng thực hành CNC rất chuẩn xác, gãi đúng chỗ ngứa của sinh viên kỹ thuật. Nhóm mình đánh giá cao các căn cứ pháp lý của các bạn.",
        time: "1 ngày trước",
        likes: 15,
        avatar: "⚙️",
        isSample: true
      },
      {
        id: "rev-4",
        author: "Vũ Hoàng Linh",
        role: "student",
        roleName: "Sinh viên",
        unit: "Lớp trưởng ĐH CNTT 3 - Khóa 18",
        stars: 5,
        critScores: [5, 5, 4, 5],
        tags: ["Sơ đồ tư duy trực quan", "Slide 16:9 chuyên nghiệp"],
        text: "Giao diện web mượt mà, bấm vào nhánh nào là bung slide 16:9 ngay trước mắt rất ấn tượng. Các nút xuất thẻ cam kết cá nhân SVG nhìn rất chuyên nghiệp. Hy vọng trường nhân rộng mô hình này cho các môn học khác!",
        time: "1 ngày trước",
        likes: 31,
        avatar: "💻",
        isSample: true
      },
      {
        id: "rev-5",
        author: "Phạm Thúy Nga",
        role: "student",
        roleName: "Sinh viên",
        unit: "Khoa Quản lý Kinh doanh - HaUI",
        stars: 5,
        critScores: [5, 5, 5, 4],
        tags: ["Lý luận đanh thép", "Phản biện sâu sắc"],
        text: "Nội dung phân tích 4 điểm nghẽn thực tiễn (bệnh hình thức, sợ trù dập...) và giải pháp pháp quyền theo Nghị định 59/2023/NĐ-CP rất sâu sắc, thể hiện tinh thần dân chủ xây dựng đúng nghĩa.",
        time: "2 ngày trước",
        likes: 12,
        avatar: "📊",
        isSample: true
      }
    ];

    // 1. Load reviews from localStorage or seed
    const saved = localStorage.getItem('haui_web_reviews');
    if (saved) {
      try {
        this.reviews = JSON.parse(saved);
      } catch (e) {
        this.reviews = [...INITIAL_REVIEWS];
      }
    } else {
      this.reviews = [...INITIAL_REVIEWS];
    }

    const container = document.getElementById('reviewsListContainer');
    const totalCountEl = document.getElementById('totalReviewsCount');
    const filterAllEl = document.getElementById('filterCountAll');

    // 2. Render reviews list with XSS escaping
    const renderList = (filter = 'all') => {
      if (!container) return;
      const filtered = (filter === 'all') 
        ? this.reviews 
        : this.reviews.filter(r => r.role === filter);

      if (filtered.length === 0) {
        container.innerHTML = `
          <div style="text-align: center; padding: 30px; color: #64748b; background: #ffffff; border-radius: 8px;">
            <span style="font-size: 28px;">📭</span>
            <p style="margin-top: 6px; font-size: 13px;">Chưa có nhận xét nào trong danh mục này.</p>
          </div>
        `;
        return;
      }

      container.innerHTML = filtered.map(r => `
        <div class="review-item-card ${r.isNew ? 'is-new' : ''}" id="${r.id}">
          <div class="rev-header">
            <div class="rev-user-info">
              <div class="rev-avatar">${r.avatar || '🎓'}</div>
              <div class="rev-names">
                <span class="rev-author-name">
                  ${escapeHTML(r.author)} 
                  <span class="rev-role-badge role-${r.role}">${escapeHTML(r.roleName || 'Sinh viên')}</span>
                </span>
                <span class="rev-unit">${escapeHTML(r.unit || 'HaUI')}</span>
              </div>
            </div>
            <div class="rev-meta-right">
              <div class="rev-stars">${'★'.repeat(r.stars || 5)}</div>
              <span class="rev-time">${r.time || 'Vừa xong'}</span>
            </div>
          </div>
          <div class="rev-body-text">${escapeHTML(r.text)}</div>
          ${r.tags && r.tags.length ? `
            <div class="rev-tags-row">
              ${r.tags.map(t => `<span class="rev-tag-badge">${escapeHTML(t)}</span>`).join('')}
            </div>
          ` : ''}
          <div class="rev-footer">
            <span>${r.isSample ? '📌 Ý kiến mẫu tham khảo' : '📝 Đánh giá người dùng (Lưu cục bộ)'}</span>
            <button class="btn-rev-like" data-id="${r.id}">
              <span>👍</span> Hữu ích (${r.likes || 0})
            </button>
          </div>
        </div>
      `).join('');

      // Bind like buttons
      container.querySelectorAll('.btn-rev-like').forEach(btn => {
        btn.addEventListener('click', () => {
          audio.pop();
          const rId = btn.getAttribute('data-id');
          const rev = this.reviews.find(item => item.id === rId);
          if (rev) {
            rev.likes = (rev.likes || 0) + 1;
            btn.innerHTML = `<span>👍</span> Hữu ích (${rev.likes})`;
            btn.classList.add('liked');
            localStorage.setItem('haui_web_reviews', JSON.stringify(this.reviews));
          }
        });
      });
    };

    const updateCounts = () => {
      const len = this.reviews.length;
      if (totalCountEl) totalCountEl.textContent = len;
      if (filterAllEl) filterAllEl.textContent = len;

      const totalStars = this.reviews.reduce((acc, r) => acc + (r.stars || 5), 0);
      const avg = len > 0 ? (totalStars / len).toFixed(1) : "5.0";
      const roundedStars = Math.round(parseFloat(avg));

      const avgEl = document.getElementById('heroAverageRating');
      if (avgEl) avgEl.innerHTML = `${avg}<span class="max-score">/5.0</span>`;

      const starsEl = document.getElementById('heroStarsDisplay');
      if (starsEl) starsEl.textContent = '★'.repeat(roundedStars) + '☆'.repeat(5 - roundedStars);

      const sidebarBadge = document.getElementById('sidebarReviewsRating');
      if (sidebarBadge) sidebarBadge.textContent = `${avg}★ (${len})`;
    };

    renderList('all');
    updateCounts();

    // 3. Interactive Star Rating Pickers for 4 Criteria
    const critScores = { 1: 5, 2: 5, 3: 5, 4: 5 };
    document.querySelectorAll('.star-rating-picker').forEach(picker => {
      const critId = parseInt(picker.getAttribute('data-crit'), 10);
      const btns = picker.querySelectorAll('.star-btn');
      const scoreTxt = picker.querySelector('.star-score-text');

      btns.forEach(btn => {
        btn.addEventListener('click', () => {
          audio.pop();
          const val = parseInt(btn.getAttribute('data-val'), 10);
          critScores[critId] = val;
          btns.forEach(b => {
            const bVal = parseInt(b.getAttribute('data-val'), 10);
            b.classList.toggle('active', bVal <= val);
          });
          if (scoreTxt) scoreTxt.textContent = `${val}/5`;
        });
      });
    });

    // 4. Role filter pills
    document.querySelectorAll('.feed-filters-bar .filter-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        audio.click();
        document.querySelectorAll('.feed-filters-bar .filter-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const filter = pill.getAttribute('data-filter');
        renderList(filter);
      });
    });

    // 5. Submit Review Form
    const form = document.getElementById('websiteReviewForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('revAuthorName')?.value.trim();
        const role = document.getElementById('revAuthorRole')?.value || 'student';
        const unit = document.getElementById('revClassOrDept')?.value.trim() || 'Sinh viên HaUI';
        const text = document.getElementById('revCommentText')?.value.trim();

        if (!name || !text) {
          audio.alert();
          alert('Vui lòng nhập họ tên và nhận xét chi tiết!');
          return;
        }

        const roleLabels = {
          student: 'Sinh viên HaUI',
          lecturer: 'Giảng viên',
          peer: 'Nhóm phản biện',
          visitor: 'Khách tham quan'
        };

        const roleAvatars = {
          student: '🎓',
          lecturer: '👨‍🏫',
          peer: '👥',
          visitor: '🌐'
        };

        // Gather checked tags
        const selectedTags = [];
        form.querySelectorAll('.review-tag-chips-group input[type="checkbox"]:checked').forEach(cb => {
          selectedTags.push(cb.value);
        });

        // Compute average stars
        const avgStars = Math.round((critScores[1] + critScores[2] + critScores[3] + critScores[4]) / 4);

        const newReview = {
          id: `rev-${Date.now()}`,
          author: name,
          role: role,
          roleName: roleLabels[role] || 'Sinh viên',
          unit: unit,
          stars: avgStars,
          critScores: [critScores[1], critScores[2], critScores[3], critScores[4]],
          tags: selectedTags,
          text: text,
          time: 'Vừa xong',
          likes: 1,
          avatar: roleAvatars[role] || '🎓',
          isNew: true
        };

        this.reviews.unshift(newReview);
        localStorage.setItem('haui_web_reviews', JSON.stringify(this.reviews));

        audio.success();
        if (typeof confetti === 'function') {
          confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
        }

        renderList('all');
        updateCounts();

        // Reset form
        document.getElementById('revCommentText').value = '';
        const submitBtn = document.getElementById('btnSubmitReview');
        if (submitBtn) {
          const originalText = submitBtn.textContent;
          submitBtn.textContent = '✓ Đã Gửi Thành Công! Cảm Ơn Bạn!';
          submitBtn.style.background = '#15803d';
          setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.style.background = '';
          }, 3000);
        }
      });
    }
  }
}

// Start application on DOM ready
let app;
document.addEventListener('DOMContentLoaded', () => {
  app = new AppController();
  window.app = app;
  app.init();
});
