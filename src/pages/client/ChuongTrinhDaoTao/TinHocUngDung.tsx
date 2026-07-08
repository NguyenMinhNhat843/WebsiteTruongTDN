import ChiTietNganhHoc from "./component/ChuongTrinhDaoTaoDetailWrapper";

const data = {
  tenNganh: "Tin học ứng dụng",
  tagline: "Đón đầu xu hướng công nghệ 4.0",
  badge: "Mũi nhọn công nghệ",
  description:
    "Chương trình đào tạo được thiết kế bám sát thực tiễn năng lực nghề nghiệp, giúp học sinh làm chủ kỹ năng phát triển phần mềm, quản trị mạng doanh nghiệp, thiết kế đồ họa truyền thông và thành thạo các ứng dụng CNTT văn phòng cao cấp.",
  anh: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80",
  thongSo: [
    { label: "Mã ngành tuyển sinh", value: "5480203", iconName: "Terminal" },
    { label: "Thời gian đào tạo", value: "1.5 - 2 Năm", iconName: "Clock" },
    {
      label: "Tỷ lệ thực hành",
      value: "70% Tổng thời lượng",
      iconName: "Code",
    },
  ],
  diemNoiBat: [
    "Học tập trực tiếp tại hệ thống phòng LAB hiện đại, máy cấu hình cao trang bị đầy đủ thiết bị mạng Cisco, Server chuyên dụng.",
    "Đội ngũ giảng viên là các chuyên gia, kỹ sư CNTT có kinh nghiệm thực chiến từ các doanh nghiệp phần mềm lớn.",
    "Nhà trường cam kết bằng văn bản ký kết giới thiệu việc làm đúng chuyên ngành tại các đối tác công nghệ ngay sau khi tốt nghiệp.",
    "Chương trình tích hợp ôn luyện và cấp chứng chỉ nghề quốc gia cùng chứng chỉ Tin học văn phòng chuẩn quốc tế MOS.",
  ],
  chuongTrinhHoc: [
    {
      tieuDe: "Học phần 1: Nền tảng kỹ thuật & Thiết kế giao diện (UI/UX)",
      iconName: "Layout",
      moTa: "Xây dựng tư duy logic máy tính cơ bản và làm chủ các công cụ đồ họa ứng dụng trong truyền thông thương hiệu doanh nghiệp.",
      chiTiet: [
        "Tin học văn phòng nâng cao: Thành thạo kỹ năng xử lý văn bản, bảng tính quản trị dữ liệu Excel nâng cao ứng dụng trong kế toán, hành chính doanh nghiệp.",
        "Cấu trúc máy tính & Lắp ráp cài đặt phần cứng: Hiểu rõ cơ chế hoạt động của phần cứng, kỹ năng chẩn đoán, sửa chữa và tối ưu hóa hiệu năng máy vi tính.",
        "Thiết kế đồ họa ứng dụng (Photoshop & Illustrator): Xử lý hình ảnh chuyên nghiệp, thiết kế bộ nhận diện thương hiệu, banner quảng cáo mạng xã hội.",
        "Cơ sở mỹ thuật web & Thiết kế giao diện ứng dụng: Nguyên lý layout, cách phối màu sắc, phông chữ và tư duy bố cục trải nghiệm người dùng trực quan.",
      ],
    },
    {
      tieuDe: "Học phần 2: Tư duy lập trình & Quản trị cơ sở dữ liệu",
      iconName: "Code",
      moTa: "Bước chân vào thế giới mã nguồn. Học sinh được học cách viết mã, kiểm thử phần mềm và tổ chức lưu trữ dữ liệu an toàn.",
      chiTiet: [
        "Nhập môn kỹ thuật lập trình: Xây dựng thuật toán logic cấu trúc dữ liệu nền tảng bằng các ngôn ngữ hiện đại (Python / C++ / Java).",
        "Lập trình phát triển giao diện Web (HTML5, CSS3, JavaScript): Tự tay xây dựng các trang web landing page, website bán hàng tối ưu hiển thị đa thiết bị.",
        "Cơ sở dữ liệu & Hệ quản trị SQL Server: Thiết kế mô hình dữ liệu, viết câu lệnh truy vấn dữ liệu lớn và tối ưu hóa hệ thống lưu trữ thông tin.",
        "Phân tích thiết kế hệ thống phần mềm: Quy trình khảo sát yêu cầu khách hàng, sơ đồ hóa chức năng và quy trình phát triển một phần mềm hoàn chỉnh.",
      ],
    },
    {
      tieuDe: "Học phần 3: Quản trị mạng doanh nghiệp & An ninh hệ thống",
      iconName: "Database",
      moTa: "Lĩnh vực cốt lõi giúp học sinh làm chủ hạ tầng kết nối, cấu hình phần cứng mạng và bảo vệ dữ liệu trước các nguy cơ tấn công mạng.",
      chiTiet: [
        "Thiết kế và triểnkai mạng nội bộ (LAN/WAN): Kỹ thuật bấm cáp, phân chia dải IP, cấu hình thiết bị định tuyến Router và chuyển mạch Switch của Cisco.",
        "Quản trị hệ điều hành mạng (Windows Server / Linux): Xây dựng hệ thống quản lý tài khoản người dùng, phân quyền chia sẻ tài liệu trong văn phòng.",
        "An toàn và bảo mật thông tin: Cấu hình tường lửa (Firewall), thiết lập VPN kết nối từ xa an toàn, phòng chống mã độc và sao lưu dự phòng dữ liệu.",
        "Thực hành Quản trị văn phòng điện tử: Triển khai vận hành các phần mềm quản lý nội bộ, mail server doanh nghiệp, hệ thống đám mây Cloud.",
      ],
    },
    {
      tieuDe: "Học phần 4: Đồ án tốt nghiệp thực tế & Thực tập doanh nghiệp",
      iconName: "Briefcase",
      moTa: "Giai đoạn chuyển giao bản lề đưa học sinh tiếp cận môi trường làm việc thực tế tại các công ty đối tác chiến lược.",
      chiTiet: [
        "Thực tập tốt nghiệp (3-5 tháng): Làm việc trực tiếp tại các phòng kỹ thuật, bộ phận IT của doanh nghiệp đối tác, cọ xát công việc thực tế.",
        "Đồ án tốt nghiệp chuyên ngành: Tự chọn xây dựng một ứng dụng phần mềm, một website hoàn chỉnh hoặc thiết kế một hạ tầng mạng cho doanh nghiệp.",
        "Kỹ năng mềm cho Kỹ sư CNTT: Phương pháp làm việc nhóm, kỹ năng phỏng vấn tuyển dụng, viết CV công nghệ và giao tiếp xử lý sự cố kỹ thuật.",
      ],
    },
  ],
  coHoiNgheNghiep: [
    {
      chucDanh: "Kỹ thuật viên quản trị mạng",
      noiLamViec:
        "Bộ phận IT tại các công ty, xí nghiệp, trường học, bệnh viện.",
    },
    {
      chucDanh: "Chuyên viên phát triển Website",
      noiLamViec:
        "Các công ty thiết kế web, đơn vị kinh doanh thương mại điện tử.",
    },
    {
      chucDanh: "Nhân viên đồ họa quảng cáo",
      noiLamViec:
        "Các studio chụp ảnh, công ty truyền thông event, xưởng in ấn quảng cáo.",
    },
    {
      chucDanh: "Chuyên viên dữ liệu văn phòng",
      noiLamViec:
        "Vị trí thư ký tòa thị chính, hành chính nhân sự, quản lý kho bãi dữ liệu.",
    },
  ],
};

const TinHocUngDung = () => {
  return <ChiTietNganhHoc data={data} />;
};

export default TinHocUngDung;
