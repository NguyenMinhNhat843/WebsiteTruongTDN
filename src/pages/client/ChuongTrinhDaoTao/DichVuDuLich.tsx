import ChiTietNganhHoc from "./component/ChuongTrinhDaoTaoDetailWrapper";

const data = {
  tenNganh: "Hướng dẫn du lịch",
  tagline: "Nghề dịch chuyển vững tương lai - Cơ hội làm việc khối ASEAN",
  badge: "Thực tiễn địa phương",
  description:
    "Chương trình đào tạo Hướng dẫn du lịch hệ Trung cấp được thiết kế đặc biệt giúp sinh viên 'học nhanh – làm được việc ngay'. Khóa học tập trung rèn luyện tay nghề thực tế, năng lực thuyết minh, bản lĩnh xử lý tình huống linh hoạt và kỹ năng hoạt náo, sẵn sàng đáp ứng nhu cầu tuyển dụng lữ hành năng động tại Khánh Hòa cũng như thị trường quốc tế khu vực Đông Nam Á.",
  anh: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80",
  thongSo: [
    {
      label: "Trình độ đào tạo",
      value: "Trung cấp chính quy",
      iconName: "Compass",
    },
    { label: "Thời gian đào tạo", value: "1 - 1.5 Năm", iconName: "Clock" },
    {
      label: "Lợi thế thực hành",
      value: "Cọ xát tại điểm liên tục",
      iconName: "MapPin",
    },
  ],
  diemNoiBat: [
    "Học từ thực tế địa phương: Sinh viên được dẫn dắt trực tiếp bởi những hướng dẫn viên dày dạn kinh nghiệm đang làm việc tại các công ty lữ hành lớn ở Nha Trang.",
    "Thực hành tại điểm liên tục: Tham gia dẫn tour thực tế tại các địa danh nổi tiếng của 'Xứ Trầm Hương' như Tháp Bà Ponagar, Viện Hải dương học, Chùa Long Sơn...",
    "Rèn luyện kỹ năng toàn diện: Đào tạo chuyên sâu về thuyết minh tuyến điểm, tổ chức Team Building bãi biển, thiết kế Gameshow và kỹ năng làm MC sự kiện, Gala Dinner.",
    "Cơ hội hội nhập ASEAN: Trang bị năng lực chuyên môn để tự tin cầm thẻ hướng dẫn viên, đóng vai trò 'đại sứ văn hóa' kết nối khách du lịch trong nước và quốc tế.",
  ],
  chuongTrinhHoc: [
    {
      tieuDe: "Học phần 1: Kiến thức nền tảng & Cơ sở văn hóa du lịch",
      iconName: "Layout",
      moTa: "Xây dựng khối kiến thức bệ phóng về lịch sử, địa lý, văn hóa và tư duy tổng quan ngành dịch vụ lữ hành.",
      chiTiet: [
        "Module đại cương bắt buộc: Chính trị, Pháp luật, Giáo dục thể chất, Giáo dục quốc phòng, Tin học ứng dụng.",
        "Tổng quan du lịch - khách sạn & Văn hóa ẩm thực: Nắm bắt kiến thức cốt lõi về chuỗi cung ứng dịch vụ và văn hóa ẩm thực các vùng miền.",
        "Địa lý du lịch, Văn hóa & Các dân tộc Việt Nam: Hiểu sâu sắc bản sắc 54 dân tộc, tập quán lối sống phục vụ việc giới thiệu đến du khách.",
        "Tiến trình lịch sử Việt Nam & Lịch sử văn minh thế giới: Tiếp cận hệ thống di tích, danh thắng, tái hiện sống động giá trị lịch sử qua bài thuyết minh.",
      ],
    },
    {
      tieuDe: "Học phần 2: Nghiệp vụ hướng dẫn & Quản trị dịch vụ lữ hành",
      iconName: "HeartHandshake",
      moTa: "Đi sâu vào quy trình kỹ năng nghề, các bước tổ chức điều hành tua và tâm lý khách hàng.",
      chiTiet: [
        "Nghiệp vụ hướng dẫn & Nghiệp vụ lữ hành: Quy trình tổ chức, vận hành, kiểm soát chất lượng chương trình du lịch theo chuẩn mực.",
        "Tâm lý và kỹ năng ứng xử với khách du lịch: Nắm bắt tâm lý nhóm khách nội địa/quốc tế để tạo lập, duy trì mối quan hệ tốt đẹp.",
        "Nghiệp vụ thanh toán & Nghiệp vụ lưu trú: Trang bị kiến thức bổ trợ về kế toán, lập dự toán kinh phí tour và quy trình dịch vụ lưu trú khách sạn.",
        "Môi trường an ninh – an toàn trong du lịch: Nhận diện, phòng ngừa rủi ro, bảo vệ an toàn tối đa cho đoàn khách suốt hành trình.",
      ],
    },
    {
      tieuDe:
        "Học phần 3: Quản trị dịch vụ giải trí, Sự kiện & Kỹ năng hoạt náo",
      iconName: "Code",
      moTa: "Nâng cao năng lực tổ chức sự kiện, dịch vụ thể thao giải trí và khả năng làm chủ sân khấu.",
      chiTiet: [
        "Thiết kế dịch vụ giải trí & Tổ chức sự kiện: Xây dựng ý tưởng, kịch bản chương trình phù hợp với điều kiện doanh nghiệp và nhu cầu khách hàng.",
        "Quảng bá, xúc tiến & Điều hành sự kiện: Tổ chức thực hiện hoạt động tiếp thị, xúc tiến bán, lập dự toán kinh phí cho các chương trình giải trí.",
        "Kỹ năng mềm bổ trợ nghề nghiệp: Kỹ năng truyền thông, giải quyết than phiền - phàn nàn, thiết lập mối quan hệ và khả năng phối hợp làm việc nhóm.",
        "Nghệ thuật sinh hoạt cộng đồng: Thực hành hoạt náo, múa hát tập thể, kỹ năng ca hát phục vụ các đêm Gala, sự kiện bãi biển.",
      ],
    },
    {
      tieuDe:
        "Học phần 4: Ngoại ngữ chuyên ngành & Thực tập chuyên sâu thực tế",
      iconName: "Briefcase",
      moTa: "Hoàn thiện kỹ năng ngôn ngữ hội nhập ASEAN và cọ xát trực tiếp tại các doanh nghiệp lữ hành.",
      chiTiet: [
        "Ngoại ngữ chuyên ngành du lịch: Sử dụng ngoại ngữ thành thạo trong giao tiếp thông thường và trong một số hoạt động cụ thể của nghề.",
        "Thực hành dẫn tour thực chiến tại Nha Trang: Trực tiếp thuyết minh, xử lý các tình huống phát sinh tại điểm dưới sự hướng dẫn của các chuyên gia.",
        "Thực tập chuyên sâu tại doanh nghiệp lữ hành: Tham gia vào quy trình làm việc thực tế, trải nghiệm vị trí điều hành hoặc trợ lý hướng dẫn.",
        "Đánh giá và tổng kết nhiệm vụ nghề: Học cách kiểm tra, chăm sóc khách hàng sau tour, hoàn thiện tác phong của một người đại sứ du lịch chuyên nghiệp.",
      ],
    },
  ],
  coHoiNgheNghiep: [
    {
      chucDanh: "Hướng dẫn viên du lịch (Nội địa & Quốc tế)",
      noiLamViec:
        "Trực tiếp dẫn các tour tham quan, đóng vai trò cầu nối, mang lại trải nghiệm tuyệt vời cho du khách tại các công ty lữ hành lớn trong nước và khối ASEAN.",
    },
    {
      chucDanh: "Chuyên viên Tổ chức sự kiện & Dịch vụ giải trí",
      noiLamViec:
        "Các công ty truyền thông sự kiện, khu du lịch nghỉ dưỡng phức hợp, các đơn vị chuyên tổ chức Team Building và Gala Dinner bãi biển.",
    },
    {
      chucDanh: "Chuyên viên Điều hành & Thiết kế Tour",
      noiLamViec:
        "Bộ phận kinh doanh, thiết kế chương trình, khảo sát tuyến điểm và quản lý dịch vụ tại các doanh nghiệp lữ hành, đại lý du lịch.",
    },
    {
      chucDanh: "Nhân viên Dịch vụ khách hàng & Tiền sảnh",
      noiLamViec:
        "Trung tâm thông tin du lịch, bộ phận chăm sóc khách hàng, quan hệ công chúng tại các khách sạn, resort, tổ hợp vui chơi giải trí cao cấp.",
    },
  ],
};

const NganhDuLichPage = () => {
  return <ChiTietNganhHoc data={data} />;
};

export default NganhDuLichPage;
