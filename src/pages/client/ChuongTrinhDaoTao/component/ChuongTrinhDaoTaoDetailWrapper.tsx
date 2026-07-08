import React, { useState } from "react";
// Import toàn bộ icon cần dùng từ lucide-react để map động
import * as LucideIcons from "lucide-react";

// Khai báo kiểu dữ liệu TypeScript (Nếu dùng JavaScript thuần, bạn có thể xóa phần interface này)
interface ThongSo {
  label: string;
  value: string;
  iconName: string;
}

interface ChuongTrinh {
  tieuDe: string;
  iconName: string;
  moTa: string;
  chiTiet: string[];
}

interface NgheNghiep {
  chucDanh: string;
  noiLamViec: string;
}

interface DataNganhType {
  tenNganh: string;
  tagline: string;
  badge: string;
  description: string;
  anh: string;
  thongSo: ThongSo[];
  diemNoiBat: string[];
  chuongTrinhHoc: ChuongTrinh[];
  coHoiNgheNghiep: NgheNghiep[];
}

interface ComponentProps {
  data: DataNganhType;
}

// Hàm bổ trợ render Icon động từ chuỗi string cấu hình trong JSON
const DynamicIcon = ({
  name,
  size = 20,
  className = "",
  strokeWidth = 2,
}: {
  name: string;
  size?: number;
  className?: string;
  strokeWidth?: number;
}) => {
  const IconComponent = (LucideIcons as any)[name];
  if (!IconComponent)
    return <LucideIcons.HelpCircle size={size} className={className} />; // Icon dự phòng
  return (
    <IconComponent
      size={size}
      className={className}
      strokeWidth={strokeWidth}
    />
  );
};

const ChiTietNganhHoc: React.FC<ComponentProps> = ({ data }) => {
  const [activeModule, setActiveModule] = useState<number | null>(0);

  const toggleModule = (idx: number) => {
    setActiveModule(activeModule === idx ? null : idx);
  };

  // Tránh lỗi crash nếu data chưa được truyền kịp hoặc bị bóc tách sai cấu trúc
  if (!data)
    return (
      <div className="p-8 text-center text-slate-500">
        Đang tải dữ liệu ngành học...
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-blue-800 selection:text-white">
      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-950 to-slate-900 text-white py-16 md:py-20 shadow-inner min-h-[calc(100vh-138px)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.08),transparent_50%)]"></div>

        <div className="max-w-6xl mx-auto px-4 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold bg-amber-400 text-blue-950 uppercase tracking-wider">
              <DynamicIcon name="Award" size={13} strokeWidth={2.5} />{" "}
              {data.badge}
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Ngành <span className="text-amber-400">{data.tenNganh}</span>
            </h1>
            <p className="text-lg font-medium text-amber-300/90 italic border-l-4 border-amber-400 pl-4">
              "{data.tagline}"
            </p>
            <p className="text-base text-slate-200 leading-relaxed max-w-2xl">
              {data.description}
            </p>

            {/* Thông số tuyển sinh */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-blue-800/60">
              {data.thongSo.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 bg-blue-900/40 p-3 rounded-xl border border-blue-800/30"
                >
                  <div className="h-10 w-10 rounded-lg bg-amber-400/10 flex items-center justify-center text-amber-400 shrink-0">
                    <DynamicIcon name={item.iconName} size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-blue-200">{item.label}</p>
                    <p className="text-sm font-bold text-white mt-0.5">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Banner hình ảnh góc phải */}
          <div className="lg:col-span-5">
            <div className="relative aspect-video lg:aspect-[4/3] w-full rounded-2xl overflow-hidden border-4 border-white/10 shadow-2xl">
              <img
                src={data.anh}
                alt={data.tenNganh}
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
          {/* CỘT TRÁI */}
          <div className="lg:col-span-2 space-y-10">
            {/* Lợi thế khác biệt */}
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5">
              <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2.5 text-blue-950 border-b border-slate-100 pb-3">
                <DynamicIcon
                  name="ShieldCheck"
                  className="text-amber-500"
                  size={26}
                />
                Lợi Thế Khác Biệt Tại Trần Đại Nghĩa
              </h2>
              <div className="grid grid-cols-1 gap-3.5">
                {data.diemNoiBat.map((diem, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-xl bg-blue-50/40 border border-blue-100/40"
                  >
                    <DynamicIcon
                      name="CheckCircle2"
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

            {/* Khung chương trình đào tạo Accordion */}
            <div className="space-y-4">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-blue-950">
                  Chương Trình Đào Tạo Chi Tiết
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Khung chương trình chuẩn hóa, học thực tiễn tích hợp kỹ năng
                  chuyên sâu.
                </p>
              </div>

              <div className="space-y-3">
                {data.chuongTrinhHoc.map((module, idx) => {
                  const isOpen = activeModule === idx;
                  return (
                    <div
                      key={idx}
                      className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-200"
                    >
                      <button
                        onClick={() => toggleModule(idx)}
                        className="w-full text-left p-4 md:p-5 flex items-center justify-between gap-4 bg-white hover:bg-slate-50/80 transition-colors"
                      >
                        <div className="flex items-center gap-3.5">
                          <div
                            className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${isOpen ? "bg-amber-400 text-blue-950" : "bg-blue-50 text-blue-800"}`}
                          >
                            <DynamicIcon name={module.iconName} size={20} />
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
                        <DynamicIcon
                          name="ChevronDown"
                          size={18}
                          className={`text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180 text-amber-500" : ""}`}
                        />
                      </button>

                      {isOpen && (
                        <div className="px-5 pb-5 pt-2 border-t border-slate-100 bg-slate-50/50 space-y-3 animate-fadeIn">
                          <p className="text-xs sm:text-sm text-slate-600 italic font-medium mb-2">
                            Chi tiết các học phần nghiệp vụ bắt buộc:
                          </p>
                          <div className="grid grid-cols-1 gap-2.5 pl-2">
                            {module.chiTiet.map((item, i) => {
                              const parts = item.split(":");
                              return (
                                <div
                                  key={i}
                                  className="flex items-start gap-2.5 text-sm leading-relaxed"
                                >
                                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-500 mt-2 shrink-0"></span>
                                  <p className="text-slate-700">
                                    {parts.length > 1 ? (
                                      <>
                                        <strong className="text-slate-900">
                                          {parts[0]}:
                                        </strong>
                                        {parts.slice(1).join(":")}
                                      </>
                                    ) : (
                                      item
                                    )}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Vị trí việc làm */}
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-lg md:text-xl font-bold flex items-center gap-2 text-blue-950">
                <DynamicIcon
                  name="Briefcase"
                  className="text-amber-500"
                  size={22}
                />
                Vị Trí Việc Làm Rộng Mở Sau Khi Tốt Nghiệp
              </h3>
              <p className="text-sm text-slate-600">
                Cơ hội nghề nghiệp rộng mở, đáp ứng nhu cầu thị trường lao động
                thực tế:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {data.coHoiNgheNghiep.map((item, i) => (
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

          {/* CỘT PHẢI: Form Đăng Ký */}
          <div className="lg:col-span-1 lg:sticky lg:top-24">
            <div className="bg-white rounded-2xl border-2 border-blue-800 shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-blue-700">
              {/* Header Widget */}
              <div className="bg-blue-900 p-5 text-white text-center relative">
                <div className="absolute top-0 inset-x-0 h-1 bg-amber-400"></div>
                <span className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                  ĐANG TUYỂN SINH
                </span>
                <DynamicIcon
                  name="GraduationCap"
                  size={36}
                  className="mx-auto mb-2 text-amber-400"
                />
                <h3 className="text-xl font-black tracking-wide text-amber-400">
                  XÉT TUYỂN HỌC BẠ 2026
                </h3>
                <p className="text-xs text-slate-200 font-medium mt-1 uppercase tracking-wider">
                  Trường Trung Cấp Trần Đại Nghĩa
                </p>
              </div>

              {/* Nội dung bảng thông tin thu hút */}
              <div className="p-5 space-y-4">
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
                  <p className="text-xs font-semibold text-amber-900">
                    Điều kiện đơn giản
                  </p>
                  <p className="text-base font-bold text-blue-950 mt-0.5">
                    Tốt nghiệp THCS trở lên
                  </p>
                </div>

                {/* Danh sách quyền lợi nổi bật */}
                <div className="space-y-3 py-1">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 bg-emerald-100 text-emerald-700 p-1 rounded-lg mt-0.5">
                      <DynamicIcon name="Check" size={16} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">
                        Miễn 100% học phí nghề
                      </h4>
                      <p className="text-xs text-slate-500">
                        Áp dụng trực tiếp cho hệ tốt nghiệp THCS (Học 2 năm)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 bg-emerald-100 text-emerald-700 p-1 rounded-lg mt-0.5">
                      <DynamicIcon name="Check" size={16} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">
                        Thời gian đào tạo tối ưu
                      </h4>
                      <p className="text-xs text-slate-500">
                        Chỉ từ 1.5 - 2 năm, nhận bằng Trung cấp chính quy
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 bg-emerald-100 text-emerald-700 p-1 rounded-lg mt-0.5">
                      <DynamicIcon name="Check" size={16} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">
                        Lịch học linh hoạt
                      </h4>
                      <p className="text-xs text-slate-500">
                        Có lớp ngày hoặc lớp tối/cuối tuần cho người đi làm
                      </p>
                    </div>
                  </div>
                </div>

                <hr className="border-slate-100" />

                {/* Nút hành động chính */}
                <div className="pt-1">
                  <a
                    href="/dang-ky-tuyen-sinh"
                    className="w-full bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white text-sm font-black py-3.5 px-4 rounded-xl shadow-lg shadow-red-600/20 transition-all flex items-center justify-center gap-2 group"
                  >
                    ĐĂNG KÝ XÉT TUYỂN NGAY
                    <DynamicIcon
                      name="ArrowRight"
                      size={18}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </a>
                </div>

                {/* Footer nhỏ tạo độ tin cậy */}
                <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                  <DynamicIcon
                    name="ShieldCheck"
                    size={14}
                    className="text-emerald-600"
                  />
                  <span>Hồ sơ trực tuyến nhận kết quả trong 24h làm việc</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ChiTietNganhHoc;
