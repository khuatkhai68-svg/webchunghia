# RED MIND 2.0 / HaUI — Operational Rules & Memory

Tài liệu này ghi nhớ toàn bộ tiêu chuẩn thiết kế, bối cảnh học thuật và nguyên tắc vận hành của dự án website thuyết trình **RED MIND 2.0 / HaUI**.

---

## 1. Bối cảnh dự án (Core Context)
- **Học phần**: Chủ nghĩa xã hội khoa học — Đại học Công nghiệp Hà Nội (HaUI).
- **Chủ đề**: *"Phân tích bản chất nền dân chủ xã hội chủ nghĩa ở Việt Nam"*.
- **Mục đích**: Website hỗ trợ thuyết trình tương tác trên giảng đường, phục vụ sinh viên và giảng viên đánh giá trực tiếp.
- **Phong cách cốt lõi**: **Academic · Interactive · Minimal**.
  - Không xây dựng như một SaaS thương mại hay hệ thống quản trị sinh viên cồng kềnh.
  - Không quảng bá "AI 24/7", "AI kiểm chứng tự động" hay sinh số liệu giả khi chưa có backend AI thực tế. Nếu là mô phỏng, gắn nhãn rõ ràng hoặc sử dụng dữ liệu học thuật chuẩn bị sẵn.

---

## 2. Tiêu chuẩn UI/UX & Thẩm mỹ
- **Bảng màu**:
  - Màu nền: Trắng / Xám nhạt dịu mắt (`#F8FAFC`, `#FFFFFF`).
  - Màu nhấn: Đỏ HaUI (`#B91C2A` hoặc `#991B1B`).
  - Đường viền mỏng (`#E2E8F0`, `#CBD5E1`), hạn chế đổ bóng đa tầng và gradient lòe loẹt.
- **Typography**: Google Fonts Inter, kích thước chữ rõ ràng, phân cấp thị giác mạch lạc.
- **Khung nhìn Desktop (1920×1080)**:
  - Các màn hình thuyết trình chính (đặc biệt là trang **Hành động**) phải nằm trọn trong 1 khung nhìn (~950px chiều cao), hạn chế tối đa cuộn chuột dài khi thuyết trình.
- **Mobile Responsive (375px / 390px)**:
  - Tuyệt đối không để xảy ra tràn viền ngang (`scrollWidth > innerWidth`).
  - Các thành phần offcanvas/drawer khi đóng (`.closed`) phải có `visibility: hidden;` để tránh lỗi layout engine tính kích thước sai.

---

## 3. Cấu trúc chuẩn trang Hành động (Academic Minimal)
Chỉ gồm 3 khu vực chính:
1. **Khu vực 1 — Tiêu đề**:
   - Tiêu đề: *“Từ lý luận đến thực tiễn”*
   - Mô tả: *“Sinh viên HaUI thực hành dân chủ trong học tập và đời sống như thế nào?”*
2. **Khu vực 2 — Ba nội dung trọng tâm**:
   - **Nhận thức**: Hiểu quyền, nghĩa vụ và trách nhiệm sinh viên.
   - **Tham gia**: Đóng góp ý kiến qua các kênh chính thống của Nhà trường.
   - **Phản biện**: Phản biện văn minh, có căn cứ xây dựng.
3. **Khu vực 3 — Một tình huống tương tác thực tế**:
   - Tình huống: Dự kiến thay đổi lịch học và phản ứng của sinh viên.
   - 3 lựa chọn (A, B, C chuẩn mực) + 1 nút `Xem phân tích & liên hệ bài học`.
   - Phân tích đối chiếu trực tiếp với nguyên tắc *"Dân biết, dân bàn, dân làm, dân kiểm tra"* và kỷ luật, pháp chế XHCN.
   - Thông điệp kết thúc: *“Hiểu đúng · Tham gia có trách nhiệm · Phản biện có căn cứ”*.

---

## 4. Quy chuẩn Kỹ thuật & Kiểm thử (QA Protocol)
- **Công nghệ**: HTML5 ngữ nghĩa, Vanilla CSS, Vanilla JavaScript (`app.js`).
- **An toàn bảo mật (XSS Prevention)**:
  - Tuyệt đối không chèn trực tiếp `innerHTML` từ input người dùng. Dùng `textContent` hoặc hàm sanitize an toàn.
- **Bộ test tự động bắt buộc**:
  - Chạy `scratch/test_suite.js` và `scratch/test_academic_actions.js` qua Headless Chromium.
  - Phải vượt qua 100% test cases:
    - 0 lỗi Console (`console.error = 0`).
    - 0 lỗi tràn viền ngang trên tất cả viewports (375x812, 390x844, 768x1024, 1024x768, 1366x768, 1536x864, 1920x1080).
    - Không làm hỏng các tính năng cũ (Mindmap, Drawer, Guide modal, Library search, Timer slides, Mastery).
