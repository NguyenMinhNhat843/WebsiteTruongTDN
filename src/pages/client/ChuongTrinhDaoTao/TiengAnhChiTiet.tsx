import ChiTietNganhHoc from "./component/ChuongTrinhDaoTaoDetailWrapper";

const data = {
  tenNganh: "Tiếng Anh",
  tagline: "Học thực chất - Làm thực tế - Làm chủ ngôn ngữ toàn cầu",
  badge: "Ứng dụng Dịch vụ & Du lịch",
  description:
    "Chương trình đào tạo Trung cấp Tiếng Anh được tối ưu hóa theo hướng thực hành chuyên sâu, lược bỏ lý thuyết hàn lâm. Khóa học trang bị cho học sinh nền tảng ngôn ngữ vững chắc, kỹ năng Biên - Phiên dịch ứng dụng, cùng hệ thống thuật ngữ chuyên ngành Dịch vụ, Du lịch và Thương mại. Học sinh sớm ra trường, tự tin ứng tuyển vào các môi trường làm việc quốc tế năng động tại Khánh Hòa.",
  anh: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=1200&q=80",
  thongSo: [
    {
      label: "Trình độ đào tạo",
      value: "Trung cấp chính quy",
      iconName: "Languages",
    },
    { label: "Thời gian đào tạo", value: "1 - 1.5 Năm", iconName: "Clock" },
    {
      label: "Định hướng việc làm",
      value: "Trọng tâm hành nghề thực tế",
      iconName: "Award",
    },
  ],
  diemNoiBat: [
    "Đào tạo trọng tâm, nhanh chóng đi làm: Hệ Trung cấp rút ngắn thời gian, tập trung tối đa vào kỹ năng thực hành nghề để sinh viên sớm tốt nghiệp, đi làm ngay.",
    "Tận dụng môi trường bản ngữ địa phương: Lợi thế là thành phố du lịch biển Nha Trang giúp sinh viên có không gian lý tưởng để cọ xát, thực hành giao tiếp hàng ngày với khách nước ngoài, xóa bỏ rào cản tự ti.",
    "Tiếng Anh ứng dụng chuyên sâu: Chương trình đi thẳng vào các kỹ năng thực tế doanh nghiệp cần như Tiếng Anh chuyên ngành Nhà hàng - Khách sạn, kỹ năng đón tiếp khách quốc tế và giao tiếp thương mại văn phòng.",
    "Mô hình đa ngôn ngữ hội nhập: Bên cạnh việc master Tiếng Anh, học sinh được trang bị thêm Module Tiếng Trung (1 và 2) cùng định hướng các chứng chỉ bổ trợ (Nhật/Hàn) để tối đa hóa cơ hội việc làm.",
  ],
  chuongTrinhHoc: [
    {
      tieuDe: "Học phần 1: Nền tảng Ngôn ngữ & Chuẩn hóa Phát âm",
      iconName: "MessageSquare",
      moTa: "Chuẩn hóa hệ thống ngữ âm cơ bản, củng cố cấu trúc ngữ pháp và tư duy tổng quan ngành.",
      chiTiet: [
        "Khối kiến thức chung: Chính trị, Pháp luật, Giáo dục thể chất, Giáo dục quốc phòng và an ninh.",
        "Tổng quan ngành Tiếng Anh & Cơ sở văn hóa Việt Nam: Tìm hiểu bối cảnh ngành nghề và nền tảng văn hóa cơ sở phục vụ công tác dịch thuật.",
        "Luyện âm (1 & 2) & Kỹ năng phát âm chuyên sâu: Sửa ngọng, chuẩn hóa phát âm, trọng âm và ngữ điệu tự nhiên.",
        "Ngữ pháp & Cú pháp học ứng dụng: Làm chủ hệ thống cấu trúc câu, từ loại và nguyên lý tổ chức văn bản tiếng Anh chuẩn mực.",
      ],
    },
    {
      tieuDe:
        "Học phần 2: Phát triển Kỹ năng Giao tiếp & Ngoại ngữ phụ (Tiếng Trung)",
      iconName: "Presentation",
      moTa: "Tăng cường phản xạ Nghe - Nói, Đọc - Viết kết hợp trang bị ngôn ngữ thứ hai.",
      chiTiet: [
        "Kỹ năng Nghe và Nói chuyên sâu: Rèn luyện khả năng nghe hiểu phản xạ, đàm thoại lưu loát trong môi trường giao tiếp xã hội.",
        "Tích hợp hai kỹ năng Đọc hiểu & Viết: Nâng cao vốn từ vựng, đọc hiểu văn bản thương mại và thực hành viết câu, đoạn văn hành chính.",
        "Tiếng Trung 1 & Tiếng Trung 2: Tiếp cận các học phần ngoại ngữ phụ bắt buộc, giao tiếp cơ bản phục vụ làn sóng du khách Đông Á.",
        "Tin học văn phòng & Tiếng Việt thực hành: Đạt chứng chỉ ứng dụng CNTT cơ bản và trau dồi năng lực sử dụng ngôn từ tiếng Việt chuẩn xác.",
      ],
    },
    {
      tieuDe:
        "Học phần 3: Nghiệp vụ Dịch thuật chuyên ngành (Biên dịch & Phiên dịch)",
      iconName: "Globe",
      moTa: "Đi sâu vào kỹ năng chuyển ngữ văn bản và phiên dịch cabin, xử lý tình huống phản xạ tức thì.",
      chiTiet: [
        "Nghiệp vụ Phiên dịch ứng dụng: Rèn luyện đầu óc nhạy bén để chuyển đổi ngôn ngữ dạng nói ngay lập tức, giúp khách nước ngoài dễ hiểu trong thời gian ngắn nhất.",
        "Nghiệp vụ Biên dịch & Kỹ năng chuyển ngữ văn bản: Dịch thuật hệ thống văn bản trung thực với bản gốc, trang trọng và đúng phong cách văn phong chuyên ngành.",
        "Kiến thức bổ trợ quốc tế: Lồng ghép văn hóa, lịch sử, chính trị giáo dục của các quốc gia nói tiếng Anh để bổ sung lượng từ vựng thực tế.",
        "Kỹ năng xử lý tình huống: Học hỏi về văn hóa giao tế, thời trang, gu ăn uống của khách hàng quốc tế nhằm bổ sung kỹ năng mềm thuận lợi cho công việc.",
      ],
    },
    {
      tieuDe: "Học phần 4: Kỹ năng bổ trợ doanh nghiệp & Thực tập chuyên sâu",
      iconName: "Briefcase",
      moTa: "Tích hợp các module kỹ năng công sở, an toàn lao động và trực tiếp cọ xát tại các dự án thực tế.",
      chiTiet: [
        "Kỹ năng mềm doanh nghiệp: Kỹ năng truyền thông, tổ chức công việc, làm việc nhóm, thuyết trình và xử lý sự cố phát sinh tại công sở.",
        "An toàn lao động & Môi trường an ninh trong dịch vụ: Đảm bảo các nguyên tắc an toàn, vệ sinh công nghiệp trong môi trường làm việc chuyên nghiệp.",
        "Cọ xát dự án thực tế: Tham gia hỗ trợ dịch thuật tại các sự kiện văn hóa địa phương, hội chợ du lịch quốc tế và các khu nghỉ dưỡng lớn tại Nha Trang.",
        "Thực tập chuyên sâu thực tế: Đưa học sinh vào làm việc trực tiếp tại các doanh nghiệp, văn phòng đại diện hoặc các tập đoàn du lịch dịch vụ để hoàn thiện năng lực đầu ra.",
      ],
    },
  ],
  coHoiNgheNghiep: [
    {
      chucDanh: "Chuyên viên Biên – Phiên dịch viên",
      noiLamViec:
        "Làm việc tại các trung tâm dịch thuật, tòa soạn, các cơ quan ngoại giao hoặc bộ phận soạn thảo hồ sơ, dịch hợp đồng của các doanh nghiệp FDI.",
    },
    {
      chucDanh: "Nhân viên Dịch vụ khách hàng & Lễ tân quốc tế",
      noiLamViec:
        "Hệ thống tiền sảnh, đón tiếp khách quốc tế tại các khách sạn 4-5 sao, resort cao cấp và các tập đoàn du lịch dịch vụ lớn tại Nha Trang, Khánh Hòa.",
    },
    {
      chucDanh: "Điều phối viên Du lịch & Sự kiện quốc tế",
      noiLamViec:
        "Các công ty lữ hành, đơn vị tổ chức sự kiện, hội nghị quốc tế, đảm nhận vị trí kết nối, xử lý tình huống bằng ngoại ngữ với đối tác nước ngoài.",
    },
    {
      chucDanh: "Trợ lý văn phòng / Nhân viên đối ngoại",
      noiLamViec:
        "Các văn phòng đại diện nước ngoài, bộ phận hành chính, nhân sự, chăm sóc khách hàng toàn cầu của các doanh nghiệp trong và ngoài nước.",
    },
  ],
};

const TiengAnhChiTiet = () => {
  return <ChiTietNganhHoc data={data} />;
};

export default TiengAnhChiTiet;
