import ChiTietNganhHoc from "./component/ChuongTrinhDaoTaoDetailWrapper";

const data = {
  tenNganh: "Tiếng Anh thương mại",
  tagline: "Chìa khóa hội nhập quốc tế",
  badge: "Xu hướng toàn cầu",
  description:
    "Chương trình đào tạo đột phá tích hợp giữa năng lực Anh ngữ chuyên sâu và kiến thức quản trị kinh doanh thực tiễn. Học sinh được bứt phá kỹ năng giao tiếp phản xạ, thành thạo kỹ năng văn phòng và nghiệp vụ thương mại quốc tế để tự tin làm việc trong môi trường đa quốc gia.",
  anh: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=1200&q=80",
  thongSo: [
    { label: "Mã ngành tuyển sinh", value: "5220201", iconName: "Languages" },
    { label: "Thời gian đào tạo", value: "1.5 - 2 Năm", iconName: "Clock" },
    {
      label: "Chuẩn đầu ra cam kết",
      value: "TOEIC / IELTS quốc tế",
      iconName: "Award",
    },
  ],
  diemNoiBat: [
    "Tương tác trực tiếp với giảng viên bản ngữ và các chuyên gia ngôn ngữ trong 50% thời lượng các học phần giao tiếp phản xạ.",
    "Áp dụng phương pháp phản xạ tương tác chủ động (Interactive Reflection), học qua tình huống giả định, xử lý case-study thực tế của doanh nghiệp.",
    "Cam kết chuẩn đầu ra tiếng Anh giao tiếp lưu loát và hỗ trợ ôn luyện chứng chỉ quốc tế (TOEIC/IELTS) ngay trong chương trình chính khóa.",
    "Tích hợp đào tạo trọn bộ kỹ năng tin học văn phòng quốc tế MOS và kỹ năng mềm thiết yếu cho môi trường công sở toàn cầu.",
  ],
  chuongTrinhHoc: [
    {
      tieuDe: "Học phần 1: Phát triển Ngôn ngữ nền tảng & Phản xạ giao tiếp",
      iconName: "MessageSquare",
      moTa: "Chuẩn hóa phát âm và xây dựng sự tự tin, phản xạ tự nhiên trong giao tiếp xã hội hàng ngày.",
      chiTiet: [
        "Ngữ âm và trọng âm chuyên sâu: Từng bước chuẩn hóa phát âm theo bảng ký tự quốc tế IPA, luyện ngữ điệu kết nối câu tự nhiên như người bản xứ.",
        "Nghe - Nói phản xạ chủ động: Phát triển kỹ năng nghe hiểu đa chất giọng (Anh-Anh, Anh-Mỹ) và phản xạ trả lời lập tức không qua dịch nhẩm.",
        "Đọc hiểu & Ngữ pháp ứng dụng: Củng cố hệ thống ngữ pháp cốt lõi, nâng cao vốn từ vựng học thuật thông qua các bài đọc báo chí, tạp chí kinh tế.",
        "Kỹ năng dịch thuật cơ bản: Làm quen với tư duy chuyển ngữ Anh - Việt, Việt - Anh một cách chính xác, mạch lạc và hợp văn phong.",
      ],
    },
    {
      tieuDe: "Học phần 2: Tiếng Anh giao tiếp Văn phòng & Kỹ năng làm việc",
      iconName: "Presentation",
      moTa: "Làm chủ các công cụ truyền thông và ngôn ngữ giao tế chuẩn mực trong nội bộ môi trường doanh nghiệp.",
      chiTiet: [
        "Tiếng Anh giao tiếp công sở (Office English): Ngôn ngữ dùng trong đón tiếp đối tác, đàm thoại điện thoại, sắp xếp lịch hẹn và điều phối cuộc họp.",
        "Viết thư tín thương mại & Email (Business Writing): Quy chuẩn soạn thảo email công việc chuyên nghiệp, viết biên bản cuộc họp (Minutes) và báo cáo tiến độ.",
        "Thuyết trình và nói trước công chúng: Kỹ thuật xây dựng slide (Powerpoint) bằng tiếng Anh, cấu trúc bài nói và nghệ thuật làm chủ sân khấu.",
        "Kỹ năng soạn thảo văn bản hành chính: Thực hành biên dịch hồ sơ, hợp đồng lao động đơn giản và các form mẫu quy trình làm việc chung.",
      ],
    },
    {
      tieuDe: "Học phần 3: Tiếng Anh chuyên ngành Thương mại & Kinh doanh",
      iconName: "Globe",
      moTa: "Đi sâu vào thuật ngữ chuyên ngành kinh tế, kỹ năng thương thảo và vận hành chuỗi cung ứng.",
      chiTiet: [
        "Tiếng Anh Xuất nhập khẩu & Logistics: Làm quen thuật ngữ Incoterms, quy trình khai báo hải quan, vận đơn (Bill of Lading) và thanh toán quốc tế.",
        "Tiếng Anh Tiếp thị & Quản trị (Marketing & Sales): Phân tích chiến lược thương hiệu, viết nội dung quảng cáo (Copywriting) và nghiên cứu hành vi khách hàng ngoại quốc.",
        "Nghệ thuật Đàm phán & Thương lượng (Negotiation): Chiến thuật thương lượng giá cả, ký kết hợp đồng, giải quyết xung đột lợi ích bằng tiếng Anh.",
        "Văn hóa kinh doanh đa quốc gia: Tìm hiểu sự khác biệt về văn hóa công sở, giao tế kinh doanh giữa các nước Á Đông, Âu Mỹ để tránh xung đột.",
      ],
    },
    {
      tieuDe: "Học phần 4: Thực tập nghiệp vụ & Đồ án tốt nghiệp ứng dụng",
      iconName: "Briefcase",
      moTa: "Cọ xát thực tế tại các doanh nghiệp FDI, công ty đa quốc gia để hoàn thiện năng lực đầu ra.",
      chiTiet: [
        "Thực tập tốt nghiệp (3-5 tháng): Trực tiếp làm việc tại bộ phận nhân sự, hành chính, xuất nhập khẩu hoặc dịch vụ khách hàng của các doanh nghiệp.",
        "Báo cáo tốt nghiệp chuyên ngành: Khảo sát, phân tích quy trình xử lý công việc bằng tiếng Anh thực tế tại cơ quan thực tập và đề xuất giải pháp cải tiến.",
        "Luyện thi chứng chỉ quốc tế (TOEIC / IELTS): Học phần bổ trợ tăng cường kỹ năng làm bài thi, mẹo quản lý thời gian để đạt điểm số mục tiêu.",
        "Kỹ năng chinh phục nhà tuyển dụng: Viết CV tiếng Anh ấn tượng, thực hành phỏng vấn thử (Mock Interview) trực tiếp với các chuyên gia nhân sự.",
      ],
    },
  ],
  coHoiNgheNghiep: [
    {
      chucDanh: "Thư ký / Trợ lý giám đốc nước ngoài",
      noiLamViec:
        "Hỗ trợ quản lý lịch trình, biên dịch tài liệu, sắp xếp cuộc họp nội bộ và đối ngoại.",
    },
    {
      chucDanh: "Chuyên viên Xuất nhập khẩu / Logistics",
      noiLamViec:
        "Làm việc với các đối tác vận chuyển ngoại quốc, xử lý chứng từ vận đơn và thủ tục hải quan.",
    },
    {
      chucDanh: "Nhân viên Dịch vụ khách hàng quốc tế",
      noiLamViec:
        "Các trung tâm chăm sóc khách hàng toàn cầu, bộ phận Inbound/Outbound của các tập đoàn lớn.",
    },
    {
      chucDanh: "Chuyên viên Truyền thông & Đối ngoại",
      noiLamViec:
        "Các công ty quảng cáo, tổ chức phi chính phủ (NGO), bộ phận truyền thông doanh nghiệp FDI.",
    },
  ],
};

const TiengAnhChiTiet = () => {
  return <ChiTietNganhHoc data={data} />;
};

export default TiengAnhChiTiet;
