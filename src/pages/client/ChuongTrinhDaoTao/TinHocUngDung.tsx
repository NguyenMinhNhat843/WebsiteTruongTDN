import ChiTietNganhHoc from "./component/ChuongTrinhDaoTaoDetailWrapper";

const data = {
  tenNganh: "Tin học ứng dụng",
  tagline: "Vững chắc tay nghề - Rút ngắn thời gian - Cơ hội mở rộng",
  badge: "Hệ Trung Cấp",
  description:
    "Chương trình đào tạo Trung cấp Tin học ứng dụng chú trọng tối ưu hóa thời gian và tập trung hoàn toàn vào thực hành cọ xát. Với phương châm tuyển dụng cốt lõi của ngành CNTT là 'chỉ cần tay nghề vững vàng là được nhận', khóa học trang bị trọn vẹn từ tin học văn phòng, thiết kế đồ họa, phát triển web cho đến quản trị mạng doanh nghiệp.",
  anh: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80",
  thongSo: [
    {
      label: "Trình độ đào tạo",
      value: "Trung cấp chính quy",
      iconName: "Terminal",
    },
    { label: "Thời gian học ngắn", value: "1 - 1.5 Năm", iconName: "Clock" },
    {
      label: "Tiêu chí đào tạo",
      value: "Trọng tâm 100% tay nghề",
      iconName: "Code",
    },
  ],
  diemNoiBat: [
    "Đặc thù ngành CNTT chỉ cần tay nghề vững vàng là được nhận làm việc ngay mà không quá quan tâm, đặt nặng bằng cấp.",
    "Hồ sơ tốt nghiệp với tấm bằng Trung cấp chính quy là đủ điều kiện ký kết hợp đồng lao động cùng đầy đủ chế độ đãi ngộ, thưởng và bảo hiểm.",
    "Chương trình đào tạo thực tế, lược bỏ lý thuyết hàn lâm, học viên được học trực tiếp kỹ năng chuyên môn từ cơ bản đến nâng cao.",
    "Tích hợp chuỗi học phần kỹ năng mềm cực kỳ đa dạng giúp học viên tự tin giao tiếp, xử lý phàn nàn và tạo dựng mối quan hệ công việc.",
  ],
  chuongTrinhHoc: [
    {
      tieuDe: "Học phần 1: Module Đại cương & Tin học ứng dụng văn phòng",
      iconName: "Layout",
      moTa: "Xây dựng nền tảng kiến thức pháp luật, chính trị cùng kỹ năng tin học ứng dụng và thuật toán cơ sở.",
      chiTiet: [
        "Các môn học chung bắt buộc: Chính trị, Pháp luật, Giáo dục thể chất, Giáo dục quốc phòng, Ngoại ngữ cơ bản.",
        "Tin học đại cương & Tin học văn phòng nâng cao: Làm chủ các công cụ, ứng dụng phần mềm có sẵn trong Windows phục vụ quản lý dữ liệu.",
        "Internet & Anh văn chuyên ngành: Kỹ năng khai thác tài nguyên số Internet, đọc hiểu thuật ngữ và tài liệu kỹ thuật CNTT.",
        "Toán ứng dụng & An toàn vệ sinh công nghiệp: Xây dựng tư duy giải thuật máy tính kết hợp nguyên tắc bảo hộ, an toàn lao động.",
      ],
    },
    {
      tieuDe: "Học phần 2: Thiết kế đồ họa ứng dụng & Phát triển giao diện Web",
      iconName: "Code",
      moTa: "Làm chủ các phần mềm đồ họa truyền thông đa phương tiện phổ biến và xây dựng trang web hoàn chỉnh.",
      chiTiet: [
        "Xử lý ảnh chuyên nghiệp bằng Photoshop: Kỹ thuật chỉnh sửa, cắt ghép và tối ưu hóa hình ảnh truyền thông thương hiệu.",
        "Thiết kế vector với Illustrator: Sáng tạo mẫu thiết kế vẽ phẳng, bộ nhận diện, logo quảng cáo thương mại.",
        "Thiết kế bản vẽ kỹ thuật 2D với Autocad & Macromedia Flash MX: Xây dựng bản vẽ kỹ thuật cơ bản và tạo chuyển động ảnh động ứng dụng.",
        "Thiết kế và phát triển Web chuyên nghiệp: Xây dựng, cấu hình giao diện web tối ưu, đáp ứng nhu cầu doanh nghiệp.",
      ],
    },
    {
      tieuDe: "Học phần 3: Hạ tầng phần cứng, Quản trị mạng & An ninh hệ thống",
      iconName: "Database",
      moTa: "Nội dung trọng tâm về cấu trúc phần cứng máy tính và vận hành, triển khai hệ thống mạng LAN/WAN.",
      chiTiet: [
        "Lắp ráp và cài đặt máy tính: Hiểu rõ nguyên lý thiết bị ngoại vi, thành thạo lắp đặt, bảo trì máy tính PC và Laptop.",
        "Vận hành đa hệ điều hành: Thực hành cấu hình hệ thống trên các môi trường Windows, Linux, MAC OS, Ubuntu.",
        "Thiết kế xây dựng và Quản trị mạng LAN: Cấu hình thiết bị kết nối hạ tầng (Cisco, router, switch, bấm dây mạng, cấp địa chỉ IPv4/IPv6).",
        "An toàn mạng & Dịch vụ mạng doanh nghiệp: Triển khai tường lửa (Firewall), hệ thống mã hóa, chống virus, quản trị Mail, HTTP, FTP, DNS, VPN.",
      ],
    },
    {
      tieuDe:
        "Học phần 4: Module Kỹ năng bổ trợ & Thực tập thực tế doanh nghiệp",
      iconName: "Briefcase",
      moTa: "Trang bị các kỹ năng bổ trợ mềm và đưa học viên trải nghiệm môi trường làm việc thực chiến tại các đơn vị.",
      chiTiet: [
        "Phát triển kỹ năng mềm xã hội: Kỹ năng sinh hoạt cộng đồng, múa hát tập thể, giao tiếp và kỹ năng ca hát.",
        "Kỹ năng xử lý tình huống chuyên nghiệp: Kỹ năng giao tiếp khách hàng, giải quyết than phiền - phàn nàn trong công việc.",
        "Kỹ năng quản trị công việc: Phương pháp nghiên cứu, kỹ năng tổ chức sắp xếp công việc, lên kế hoạch và quản trị dự án.",
        "Thực hành & Thực tập thực tế tại doanh nghiệp: Làm việc trực tiếp tại các công ty để cọ xát năng lực thực tế trước khi tốt nghiệp.",
      ],
    },
  ],
  coHoiNgheNghiep: [
    {
      chucDanh: "Chuyên viên Quản trị mạng & Hệ thống",
      noiLamViec:
        "Bộ phận IT, quản lý kỹ thuật phần cứng, hạ tầng mạng tại các cơ quan, xí nghiệp, trường học, bệnh viện.",
    },
    {
      chucDanh: "Kỹ thuật viên Thiết kế và Phát triển Web",
      noiLamViec:
        "Các công ty phần mềm, đơn vị thiết kế website, agency hoặc các doanh nghiệp vận hành sàn thương mại điện tử.",
    },
    {
      chucDanh: "Nhân viên Thiết kế đồ họa & Quảng cáo",
      noiLamViec:
        "Cơ sở in ấn quảng cáo, studio ảnh, công ty truyền thông tổ chức sự kiện, phòng Marketing nội bộ.",
    },
    {
      chucDanh: "Chuyên viên Digital Marketing",
      noiLamViec:
        "Đảm nhận các vị trí tối ưu hóa tìm kiếm SEO, quản trị chiến dịch Facebook Marketing, Google Adwords tại các doanh nghiệp thương mại.",
    },
  ],
};

const TinHocUngDung = () => {
  return <ChiTietNganhHoc data={data} />;
};

export default TinHocUngDung;
