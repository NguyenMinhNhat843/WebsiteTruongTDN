import React, { useState } from "react";
import {
  Compass,
  CheckCircle2,
  Clock,
  Briefcase,
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  MapPin,
  Utensils,
  Plane,
  HeartHandshake,
  Award,
} from "lucide-react";

const DichVuDuLichChiTiet = () => {
  // Trạng thái đóng mở các module học tập để tăng trải nghiệm tương tác
  const [activeModule, setActiveModule] = useState<number | null>(0);

  const toggleModule = (idx: number) => {
    setActiveModule(activeModule === idx ? null : idx);
  };

  const thongTinNganh = {
    tenNganh: "Dịch vụ du lịch & Lữ hành",
    tagline: "Nghề dịch chuyển vững tương lai",
    badge: "Thực tiễn 100%",
    description:
      "Chương trình đào tạo chú trọng phát triển toàn diện năng lực hành nghề thực tế. Học sinh được trang bị kiến thức chuyên sâu về nghiệp vụ hướng dẫn du lịch, quản trị điều hành tour, thiết kế chương trình du lịch và nghệ thuật giao tiếp, chăm sóc khách hàng quốc tế.",
    anh: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80",

    thongSo: [
      { label: "Mã ngành tuyển sinh", value: "5810103", icon: Compass },
      { label: "Thời gian đào tạo", value: "1.5 - 2 Năm", icon: Clock },
      { label: "Cơ hội cọ xát", value: "Dẫn tour từ năm nhất", icon: MapPin },
    ],

    diemNoiBat: [
      "Cam kết 100% học sinh được bố trí thực tập có hưởng lương tại các hệ thống nhà hàng, khách sạn và resort chuẩn 4-5 sao đối tác.",
      "Chương trình học thực tế chiếm 70%, học sinh tham gia các chuyến đi tour thực địa xuyên Việt để rèn luyện kỹ năng hoạt náo và thuyết minh.",
      "Đủ điều kiện cấp Thẻ hướng dẫn viên du lịch nội địa và quốc tế ngay sau khi tốt nghiệp và tích lũy đủ thời gian thực địa theo quy định.",
      "Đào tạo bổ trợ kỹ năng mềm cốt lõi: xử lý tình huống khẩn cấp, ngoại ngữ giao tiếp du lịch chuyên ngành và tâm lý du khách.",
    ],

    // Nội dung kiến thức du lịch được chi tiết hóa sâu sắc
    chuongTrinhHoc: [
      {
        tieuDe: "Học phần 1: Tổng quan du lịch & Nghệ thuật giao tiếp",
        icon: HeartHandshake,
        moTa: "Xây dựng tác phong chuyên nghiệp và hiểu rõ nền tảng văn hóa, địa lý du lịch các vùng miền.",
        chiTiet: [
          "Tổng quan du lịch và lữ hành: Tìm hiểu lịch sử phát triển du lịch, cấu trúc ngành và xu hướng dịch chuyển toàn cầu.",
          "Địa lý du lịch & Tuyến điểm Việt Nam: Master hệ thống danh lam thắng cảnh, di sản văn hóa, phong tục tập quán đặc trưng 3 miền Bắc - Trung - Nam.",
          "Kỹ năng giao tiếp & Tâm lý du khách: Nắm bắt tâm lý khách du lịch theo độ tuổi, quốc tịch; nghệ thuật làm chủ ngôn ngữ cơ thể.",
          "Ngoại ngữ chuyên ngành du lịch: Trau dồi từ vựng, mẫu câu giao tiếp thông dụng trong đón tiễn khách, phục vụ nhà hàng và xử lý phàn nàn.",
        ],
      },
      {
        tieuDe: "Học phần 2: Nghiệp vụ Hướng dẫn viên & Điều hành Tour",
        icon: Plane,
        moTa: "Trọng tâm kỹ năng của một hướng dẫn viên thực chiến, từ khâu chuẩn bị, đón khách đến tổ chức sự kiện.",
        chiTiet: [
          "Nghiệp vụ hướng dẫn du lịch: Quy trình tổ chức thực hiện một chuyến tham quan, kỹ thuật thuyết minh tại điểm và trên xe.",
          "Thiết kế và tính giá Tour: Thực hành xây dựng lịch trình tour độc đáo, tối ưu chi phí và lập bảng báo giá hoàn chỉnh cho doanh nghiệp.",
          "Nghiệp vụ điều hành & Thiết lập mối quan hệ: Kỹ năng làm việc với các nhà cung ứng dịch vụ (vận chuyển, lưu trú, nhà hàng, vé tham quan).",
          "Tổ chức sự kiện & Gala Dinner: Kỹ năng hoạt náo, quản trò, thiết kế kịch bản trò chơi lớn (Team building) bãi biển và sân khấu.",
        ],
      },
      {
        tieuDe: "Học phần 3: Quản trị dịch vụ Nhà hàng - Khách sạn",
        icon: Utensils,
        moTa: "Mở rộng năng lực nghề nghiệp sang khối dịch vụ lưu trú và ẩm thực cao cấp.",
        chiTiet: [
          "Nghiệp vụ lễ tân và chăm sóc khách hàng: Quy trình check-in, check-out chuẩn quốc tế, kỹ năng vận hành phần mềm quản lý khách sạn.",
          "Nghiệp vụ phục vụ Nhà hàng (F&B): Kỹ thuật setup bàn tiệc Á - Âu, quy trình phục vụ rượu vang và kỹ năng giao tế bàn tiệc chuyên nghiệp.",
          "Quản trị dịch vụ lưu trú: Hiểu biết về cấu trúc buồng phòng, quy trình kiểm tra chất lượng vệ sinh, an toàn phòng dịch tại các resort.",
          "Giải quyết tình huống trong du lịch: Kỹ năng xử lý khi phát sinh sự cố mất hành lý, trễ chuyến bay, khách bị ốm đau hoặc tai nạn dọc đường.",
        ],
      },
      {
        tieuDe: "Học phần 4: Thực tế cuối khóa & Thực tập tốt nghiệp",
        icon: Briefcase,
        moTa: "Nhúng mình hoàn toàn vào môi trường làm việc của các công ty lữ hành và khách sạn hàng đầu.",
        chiTiet: [
          "Chuyến đi thực địa xuyên Việt (Tour kiến tập): Trực tiếp đóng vai trò làm hướng dẫn viên điều hành một chuyến đi thực tế dài ngày dưới sự chấm điểm của giảng viên.",
          "Thực tập tốt nghiệp chuyên sâu (3-6 tháng): Làm việc toàn thời gian tại các tập đoàn lữ hành lớn (Saigontourist, Vietravel...) hoặc các resort 5 sao.",
          "Nghệ thuật bán và tiếp thị du lịch (Marketing Du lịch): Ứng dụng công nghệ số, mạng xã hội để tìm kiếm khách hàng, tư vấn và chốt sale tour.",
          "Nghiệp vụ báo cáo & Tổng kết sau tour: Quy trình thanh quyết toán hóa đơn tài chính, lấy ý kiến phản hồi (feedback) để tối ưu chất lượng dịch vụ.",
        ],
      },
    ],

    coHoiNgheNghiep: [
      {
        chucDanh: "Hướng dẫn viên du lịch",
        noiLamViec:
          "Dẫn các tour nội địa hoặc đón khách quốc tế (Inbound) tại các công ty lữ hành.",
      },
      {
        chucDanh: "Chuyên viên điều hành & Thiết kế tour",
        noiLamViec:
          "Làm việc tại văn phòng, lên kế hoạch và quản lý chất lượng dịch vụ tour.",
      },
      {
        chucDanh: "Nhân viên Lễ tân / Giám sát buồng phòng",
        noiLamViec:
          "Khối tiền sảnh, dịch vụ khách hàng tại các khách sạn 3-5 sao, khu nghỉ dưỡng.",
      },
      {
        chucDanh: "Chuyên viên Tư vấn & Sale Tour",
        noiLamViec:
          "Bộ phận kinh doanh, phát triển thị trường du lịch cho các đại lý, doanh nghiệp lữ hành.",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-blue-800 selection:text-white">
      {/* 1. HERO SECTION - Tông màu xanh đậm phối điểm nhấn vàng tươi sáng, tràn đầy năng lượng du lịch */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-950 to-slate-900 text-white py-16 md:py-20 shadow-inner">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.08),transparent_50%)]"></div>

        <div className="max-w-6xl mx-auto px-4 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold bg-amber-400 text-blue-950 uppercase tracking-wider">
              <Award size={13} strokeWidth={2.5} /> {thongTinNganh.badge}
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Ngành{" "}
              <span className="text-amber-400">{thongTinNganh.tenNganh}</span>
            </h1>
            <p className="text-lg font-medium text-amber-300/90 italic border-l-4 border-amber-400 pl-4">
              "{thongTinNganh.tagline}"
            </p>
            <p className="text-base text-slate-200 leading-relaxed max-w-2xl">
              {thongTinNganh.description}
            </p>

            {/* Thông số hàng ngang tuyển sinh */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-blue-800/60">
              {thongTinNganh.thongSo.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-3 bg-blue-900/40 p-3 rounded-xl border border-blue-800/30"
                  >
                    <div className="h-10 w-10 rounded-lg bg-amber-400/10 flex items-center justify-center text-amber-400 shrink-0">
                      <Icon size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-blue-200">{item.label}</p>
                      <p className="text-sm font-bold text-white mt-0.5">
                        {item.value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Banner hình ảnh bãi biển / lữ hành góc phải */}
          <div className="lg:col-span-5">
            <div className="relative aspect-video lg:aspect-[4/3] w-full rounded-2xl overflow-hidden border-4 border-white/10 shadow-2xl">
              <img
                src={thongTinNganh.anh}
                alt={thongTinNganh.tenNganh}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-950/40 to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. KHỐI NỘI DUNG CHÍNH */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* CỘT TRÁI: Chi tiết kiến thức học & Lợi thế đào tạo ngành Du lịch */}
          <div className="lg:col-span-2 space-y-10">
            {/* Box 1: Lợi thế khác biệt của nhà trường */}
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5">
              <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2.5 text-blue-950 border-b border-slate-100 pb-3">
                <ShieldCheck className="text-amber-500" size={26} />
                Lợi Thế Khác Biệt Tại Trần Đại Nghĩa
              </h2>
              <div className="grid grid-cols-1 gap-3.5">
                {thongTinNganh.diemNoiBat.map((diem, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-xl bg-blue-50/40 border border-blue-100/40"
                  >
                    <CheckCircle2
                      size={18}
                      className="text-blue-800 shrink-0 mt-1"
                    />
                    <span className="text-sm md:text-base text-slate-700 leading-relaxed">
                      {diem}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Box 2: Khung chương trình đào tạo dạng Accordion gập mở khoa học */}
            <div className="space-y-4">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-blue-950">
                  Chương Trình Đào Tạo Chi Tiết
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Khung chương trình chuẩn hóa, cuốn chiếu từ lý thuyết văn hóa
                  đến thực hành nghiệp vụ dẫn tour, phục vụ nhà hàng khách sạn
                  cao cấp.
                </p>
              </div>

              <div className="space-y-3">
                {thongTinNganh.chuongTrinhHoc.map((module, idx) => {
                  const Icon = module.icon;
                  const isOpen = activeModule === idx;
                  return (
                    <div
                      key={idx}
                      className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-200"
                    >
                      {/* Tiêu đề thanh bấm */}
                      <button
                        onClick={() => toggleModule(idx)}
                        className="w-full text-left p-4 md:p-5 flex items-center justify-between gap-4 bg-white hover:bg-slate-50/80 transition-colors"
                      >
                        <div className="flex items-center gap-3.5">
                          <div
                            className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${isOpen ? "bg-amber-400 text-blue-950" : "bg-blue-50 text-blue-800"}`}
                          >
                            <Icon size={20} />
                          </div>
                          <div>
                            <h3 className="text-sm md:text-base font-bold text-blue-950 leading-snug">
                              {module.tieuDe}
                            </h3>
                            <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                              {module.moTa}
                            </p>
                          </div>
                        </div>
                        <ChevronDown
                          size={18}
                          className={`text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180 text-amber-500" : ""}`}
                        />
                      </button>

                      {/* Nội dung chi tiết các kỹ năng chuyên môn */}
                      {isOpen && (
                        <div className="px-5 pb-5 pt-2 border-t border-slate-100 bg-slate-50/50 space-y-3 animate-fadeIn">
                          <p className="text-xs sm:text-sm text-slate-600 italic font-medium mb-2">
                            Chi tiết các học phần nghiệp vụ bắt buộc để hoàn
                            thành năng lực hành nghề:
                          </p>
                          <div className="grid grid-cols-1 gap-2.5 pl-2">
                            {module.chiTiet.map((item, i) => (
                              <div
                                key={i}
                                className="flex items-start gap-2.5 text-sm leading-relaxed"
                              >
                                <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-500 mt-2 shrink-0"></span>
                                <p className="text-slate-700">
                                  <strong className="text-slate-900">
                                    {item.split(":")[0]}:
                                  </strong>
                                  {item.split(":")[1]}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Box 3: Cơ hội việc làm đầu ra ngành Du lịch */}
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-lg md:text-xl font-bold flex items-center gap-2 text-blue-950">
                <Briefcase size={22} className="text-amber-500" />
                Vị Trí Việc Làm Rộng Mở Sau Khi Tốt Nghiệp
              </h3>
              <p className="text-sm text-slate-600">
                Ngành Du lịch & Lữ hành khát nhân lực chất lượng cao, thành thạo
                kỹ năng. Sau khi ra trường, các em có thể làm việc ngay tại:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {thongTinNganh.coHoiNgheNghiep.map((item, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-blue-200 transition-all"
                  >
                    <h4 className="text-sm font-bold text-blue-950 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-800 rounded-full"></span>
                      {item.chucDanh}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 pl-3.5">
                      {item.noiLamViec}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: Form Đăng Ký Tuyển Sinh Học Bạ (Đồng bộ cấu trúc UI, bám dính khi cuộn màn hình) */}
          <div className="lg:col-span-1 lg:sticky lg:top-24">
            <div className="bg-white rounded-2xl border-2 border-blue-800 shadow-xl overflow-hidden">
              <div className="bg-blue-900 p-5 text-white text-center relative">
                <div className="absolute top-0 inset-x-0 h-1 bg-amber-400"></div>
                <GraduationCap
                  size={32}
                  className="mx-auto mb-2 text-amber-400"
                />
                <h3 className="text-lg font-bold tracking-wide">
                  XÉT TUYỂN HỌC BẠ 2026
                </h3>
                <p className="text-xs text-amber-300 font-medium mt-1">
                  Trường Trung Cấp Trần Đại Nghĩa
                </p>
              </div>

              <form
                className="p-5 space-y-4"
                onSubmit={(e) => e.preventDefault()}
              >
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Họ và tên thí sinh *
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Nguyễn Thị B"
                    className="w-full text-sm px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-800 bg-slate-50 focus:bg-white transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Số điện thoại liên hệ *
                  </label>
                  <input
                    type="tel"
                    placeholder="Ví dụ: 0987654xxx"
                    className="w-full text-sm px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-800 bg-slate-50 focus:bg-white transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Hệ đào tạo đăng ký
                  </label>
                  <select className="w-full text-sm px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-800 bg-slate-50 focus:bg-white transition-colors text-slate-700">
                    <option>
                      Hệ Tốt nghiệp THCS (Học 2 năm - Miễn 100% học phí nghề)
                    </option>
                    <option>Hệ Tốt nghiệp THPT (Học 1.5 năm)</option>
                    <option>Hệ Văn bằng 2 / Người đi làm học buổi tối</option>
                  </select>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-amber-400 hover:bg-amber-500 active:scale-[0.99] text-blue-950 text-sm font-bold py-3 px-4 rounded-lg shadow-md shadow-amber-400/20 transition-all flex items-center justify-center gap-1.5 group"
                  >
                    GỬI HỒ SƠ XÉT TUYỂN
                    <ArrowRight
                      size={16}
                      className="group-hover:translate-x-0.5 transition-transform"
                    />
                  </button>
                </div>

                <p className="text-[11px] text-slate-400 text-center leading-relaxed">
                  (*) Phòng Tuyển sinh sẽ liên hệ qua điện thoại để hướng dẫn
                  thí sinh chuẩn bị hồ sơ nhập học chi tiết.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DichVuDuLichChiTiet;
