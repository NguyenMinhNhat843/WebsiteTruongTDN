import React, { useState } from "react";
import {
  Languages,
  CheckCircle2,
  Clock,
  Briefcase,
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  Globe,
  FileText,
  MessageSquare,
  Award,
  Users,
  Presentation,
} from "lucide-react";

const TiengAnhChiTiet = () => {
  // Trạng thái đóng mở các module học tập để tăng trải nghiệm tương tác
  const [activeModule, setActiveModule] = useState<number | null>(0);

  const toggleModule = (idx: number) => {
    setActiveModule(activeModule === idx ? null : idx);
  };

  const thongTinNganh = {
    tenNganh: "Tiếng Anh thương mại",
    tagline: "Chìa khóa hội nhập quốc tế",
    badge: "Xu hướng toàn cầu",
    description:
      "Chương trình đào tạo đột phá tích hợp giữa năng lực Anh ngữ chuyên sâu và kiến thức quản trị kinh doanh thực tiễn. Học sinh được bứt phá kỹ năng giao tiếp phản xạ, thành thạo kỹ năng văn phòng và nghiệp vụ thương mại quốc tế để tự tin làm việc trong môi trường đa quốc gia.",
    anh: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=1200&q=80",

    thongSo: [
      { label: "Mã ngành tuyển sinh", value: "5220201", icon: Languages },
      { label: "Thời gian đào tạo", value: "1.5 - 2 Năm", icon: Clock },
      {
        label: "Chuẩn đầu ra cam kết",
        value: "TOEIC / IELTS quốc tế",
        icon: Award,
      },
    ],

    diemNoiBat: [
      "Tương tác trực tiếp với giảng viên bản ngữ và các chuyên gia ngôn ngữ trong 50% thời lượng các học phần giao tiếp phản xạ.",
      "Áp dụng phương pháp phản xạ tương tác chủ động (Interactive Reflection), học qua tình huống giả định, xử lý case-study thực tế của doanh nghiệp.",
      "Cam kết chuẩn đầu ra tiếng Anh giao tiếp lưu loát và hỗ trợ ôn luyện chứng chỉ quốc tế (TOEIC/IELTS) ngay trong chương trình chính khóa.",
      "Tích hợp đào tạo trọn bộ kỹ năng tin học văn phòng quốc tế MOS và kỹ năng mềm thiết yếu cho môi trường công sở toàn cầu.",
    ],

    // Nội dung kiến thức tiếng Anh thương mại được chi tiết hóa mở rộng
    chuongTrinhHoc: [
      {
        tieuDe: "Học phần 1: Phát triển Ngôn ngữ nền tảng & Phản xạ giao tiếp",
        icon: MessageSquare,
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
        icon: Presentation,
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
        icon: Globe,
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
        icon: Briefcase,
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-blue-800 selection:text-white">
      {/* 1. HERO SECTION - Tông màu xanh đậm truyền thống phối điểm nhấn vàng tươi sáng */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-950 to-slate-900 text-white py-16 md:py-20 shadow-inner">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.08),transparent_50%)]"></div>

        <div className="max-w-6xl mx-auto px-4 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold bg-amber-400 text-blue-950 uppercase tracking-wider">
              <Globe size={13} strokeWidth={2.5} /> {thongTinNganh.badge}
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

            {/* Thông số tuyển sinh hàng ngang */}
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
            {/* Box 1: Điểm nổi bật về chất lượng đào tạo tiếng Anh */}
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

            {/* Box 2: Khung chương trình đào tạo mở rộng chi tiết hệ thống Accordion */}
            <div className="space-y-4">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-blue-950">
                  Chương Trình Đào Tạo Chi Tiết
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Lộ trình học tập được thiết kế tối ưu, cân bằng giữa phát
                  triển kỹ năng ngôn ngữ tự nhiên và thực hành nghiệp vụ kinh tế
                  thương mại.
                </p>
              </div>

              {/* Accordion List */}
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
                            Học phần tập trung đào tạo chuyên sâu năng lực ứng
                            dụng thực tế:
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
                Sở hữu lợi thế song ngữ kết hợp kỹ năng văn phòng chuyên nghiệp,
                học sinh sau khi ra trường tự tin đón nhận cơ hội nghề nghiệp đa
                dạng:
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

          {/* CỘT PHẢI: Form Đăng Ký Tuyển Sinh Học Bạ (Đồng bộ, bám dính khi cuộn màn hình) */}
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

export default TiengAnhChiTiet;
