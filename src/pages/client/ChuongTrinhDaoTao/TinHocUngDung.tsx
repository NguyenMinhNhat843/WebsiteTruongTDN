import React, { useState } from "react";
import {
  Monitor,
  CheckCircle2,
  Clock,
  BookOpen,
  Briefcase,
  GraduationCap,
  Code,
  Database,
  Layout,
  Terminal,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  Cpu,
  Globe,
  FileSpreadsheet,
  Layers,
} from "lucide-react";

const NganhTinHocChiTiet = () => {
  // Trạng thái đóng mở các module học tập để tăng trải nghiệm tương tác
  const [activeModule, setActiveModule] = useState<number | null>(0);

  const toggleModule = (idx: number) => {
    setActiveModule(activeModule === idx ? null : idx);
  };

  const thongTinNganh = {
    tenNganh: "Tin học ứng dụng",
    tagline: "Đón đầu xu hướng công nghệ 4.0",
    badge: "Mũi nhọn công nghệ",
    description:
      "Chương trình đào tạo được thiết kế bám sát thực tiễn năng lực nghề nghiệp, giúp học sinh làm chủ kỹ năng phát triển phần mềm, quản trị mạng doanh nghiệp, thiết kế đồ họa truyền thông và thành thạo các ứng dụng CNTT văn phòng cao cấp.",
    anh: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80",

    thongSo: [
      { label: "Mã ngành tuyển sinh", value: "5480203", icon: Terminal },
      { label: "Thời gian đào tạo", value: "1.5 - 2 Năm", icon: Clock },
      { label: "Tỷ lệ thực hành", value: "70% Tổng thời lượng", icon: Code },
    ],

    diemNoiBat: [
      "Học tập trực tiếp tại hệ thống phòng LAB hiện đại, máy cấu hình cao trang bị đầy đủ thiết bị mạng Cisco, Server chuyên dụng.",
      "Đội ngũ giảng viên là các chuyên gia, kỹ sư CNTT có kinh nghiệm thực chiến từ các doanh nghiệp phần mềm lớn.",
      "Nhà trường cam kết bằng văn bản ký kết giới thiệu việc làm đúng chuyên ngành tại các đối tác công nghệ ngay sau khi tốt nghiệp.",
      "Chương trình tích hợp ôn luyện và cấp chứng chỉ nghề quốc gia cùng chứng chỉ Tin học văn phòng chuẩn quốc tế MOS.",
    ],

    // Nội dung kiến thức được đào tạo mở rộng chuyên sâu và chi tiết
    chuongTrinhHoc: [
      {
        tieuDe: "Học phần 1: Nền tảng kỹ thuật & Thiết kế giao diện (UI/UX)",
        icon: Layout,
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
        icon: Code,
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
        icon: Database,
        moTa: "Lĩnh vực cốt lõi giúp học sinh làm chủ hạ tầng kết nối, cấu hình phần cứng mạng và bảo vệ dữ liệu trước các nguy cơ tấn công mạng.",
        chiTiet: [
          "Thiết kế và triển khai mạng nội bộ (LAN/WAN): Kỹ thuật bấm cáp, phân chia dải IP, cấu hình thiết bị định tuyến Router và chuyển mạch Switch của Cisco.",
          "Quản trị hệ điều hành mạng (Windows Server / Linux): Xây dựng hệ thống quản lý tài khoản người dùng, phân quyền chia sẻ tài liệu trong văn phòng.",
          "An toàn và bảo mật thông tin: Cấu hình tường lửa (Firewall), thiết lập VPN kết nối từ xa an toàn, phòng chống mã độc và sao lưu dự phòng dữ liệu.",
          "Thực hành Quản trị văn phòng điện tử: Triển khai vận hành các phần mềm quản lý nội bộ, mail server doanh nghiệp, hệ thống đám mây Cloud.",
        ],
      },
      {
        tieuDe: "Học phần 4: Đồ án tốt nghiệp thực tế & Thực tập doanh nghiệp",
        icon: Briefcase,
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-blue-800 selection:text-white">
      {/* 1. HERO SECTION - Tông màu xanh đậm truyền thống kết hợp màu vàng hổ phách nhấn */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-950 to-slate-900 text-white py-16 md:py-20 shadow-inner">
        {/* Điểm nhấn visual nhẹ nhàng tinh tế không dùng màu tối thui */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.08),transparent_50%)]"></div>

        <div className="max-w-6xl mx-auto px-4 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold bg-amber-400 text-blue-950 uppercase tracking-wider">
              <Monitor size={13} strokeWidth={2.5} /> {thongTinNganh.badge}
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

            {/* Thông số tuyển sinh hàng ngang sạch sẽ */}
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

          {/* Banner hình ảnh minh họa góc phải */}
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

      {/* 2. CHÚA KHỐI NỘI DUNG CHÍNH */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* CỘT TRÁI: Chi tiết kiến thức học & Lợi thế đào tạo */}
          <div className="lg:col-span-2 space-y-10">
            {/* Box 1: Điểm nổi bật về chất lượng */}
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

            {/* Box 2: Chi tiết khung chương trình đào tạo mở rộng dài chi tiết */}
            <div className="space-y-4">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-blue-950">
                  Chương Trình Đào Tạo Chi Tiết
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Nội dung học tập được chia nhỏ theo mô hình cuốn chiếu từ cơ
                  bản đến nâng cao, tập trung sâu vào kỹ năng thực hành nghề.
                </p>
              </div>

              {/* Accordion List cho các module học tập chi tiết sâu */}
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

                      {/* Nội dung chi tiết các kiến thức được học bên trong */}
                      {isOpen && (
                        <div className="px-5 pb-5 pt-2 border-t border-slate-100 bg-slate-50/50 space-y-3 animate-fadeIn">
                          <p className="text-xs sm:text-sm text-slate-600 italic font-medium mb-2">
                            Các môn học cốt lõi sinh viên sẽ được học và làm chủ
                            trực tiếp trên máy:
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

            {/* Box 3: Cơ hội việc làm đầu ra */}
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-lg md:text-xl font-bold flex items-center gap-2 text-blue-950">
                <Briefcase size={22} className="text-amber-500" />
                Vị Trí Việc Làm Sau Khi Tốt Nghiệp
              </h3>
              <p className="text-sm text-slate-600">
                Với khối lượng kiến thức thực tiễn toàn diện, sau khi ra trường
                các em tự tin nộp hồ sơ ứng tuyển vào các vị trí:
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

          {/* CỘT PHẢI: Form Đăng Ký Tuyển Sinh (Tông màu xanh đậm + viền nhấn vàng cực kỳ trang nhã) */}
          <div className="lg:col-span-1 lg:sticky lg:top-24">
            <div className="bg-white rounded-2xl border-2 border-blue-800 shadow-xl overflow-hidden">
              <div className="bg-blue-900 p-5 text-white text-center relative">
                <div className="absolute top-0 inset-x-0 h-1 bg-amber-400"></div>{" "}
                {/* Đường kẻ vàng tinh tế trên đỉnh */}
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
                    placeholder="Ví dụ: Nguyễn Văn A"
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
                    placeholder="Ví dụ: 0912345xxx"
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

export default NganhTinHocChiTiet;
