import React from "react";
import CountUp from "react-countup";
import { InView } from "react-intersection-observer";
import {
  Users,
  GraduationCap,
  Briefcase,
  Building2,
  Sparkles,
  CheckCircle,
} from "lucide-react";

// Định nghĩa cấu trúc dữ liệu con số ấn tượng
interface StatItem {
  id: number;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  suffix: string;
  description: string;
  accentColor: string;
}

// Data thực tế, uy tín cao dành riêng cho trường đào tạo nghề 3 ngành trọng điểm
const statsData: StatItem[] = [
  {
    id: 1,
    icon: Users,
    label: "Học viên theo học",
    value: 2500,
    suffix: "+",
    description: "Sinh viên đã và đang đồng hành vững bước lập nghiệp",
    accentColor: "from-blue-600 to-sky-500",
  },
  {
    id: 2,
    icon: GraduationCap,
    label: "Tỷ lệ có việc làm",
    value: 98.6,
    suffix: "%",
    description: "Cam kết việc làm đúng chuyên ngành ngay khi nhận bằng",
    accentColor: "from-amber-500 to-orange-400",
  },
  {
    id: 3,
    icon: Building2,
    label: "Doanh nghiệp đối tác",
    value: 120,
    suffix: "+",
    description: "Tập đoàn công nghệ, chuỗi khách sạn và công ty lữ hành",
    accentColor: "from-emerald-600 to-teal-400",
  },
  {
    id: 4,
    icon: Briefcase,
    label: "Mức lương khởi điểm",
    value: 9.5,
    suffix: "Tr+",
    description: "Thu nhập bình quân thuộc top đầu trong khối trường nghề",
    accentColor: "from-indigo-600 to-purple-500",
  },
];

const ThanhTichSection: React.FC = () => {
  return (
    <section
      className="py-24 bg-white relative overflow-hidden"
      id="thong-ke-an-tuong"
    >
      {/* Background Gradients trang trí tinh xảo */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50/70 via-transparent to-slate-50/40 pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-blue-50 rounded-full blur-3xl -z-10 opacity-60" />
      <div className="absolute -bottom-20 -left-40 w-[500px] h-[500px] bg-amber-50/50 rounded-full blur-3xl -z-10 opacity-70" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        {/* Bố cục cấu trúc nâng cấp: Chia 2 khối lớn (Trái: Tiêu đề & Cam kết, Phải: Grid Chỉ số) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* KHỐI TRÁI: TIÊU ĐỀ CHẠY DỌC & ĐIỂM NHẤN (Chiếm 5/12 cột) */}
          <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-900 font-bold px-4 py-2 rounded-xl text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400 animate-pulse" />
              Cam kết chất lượng thực tế
            </div>

            <h2 className="text-3xl md:text-4xl font-black text-blue-950 uppercase tracking-tight leading-tight">
              Những con số <br className="hidden lg:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-900 via-blue-800 to-amber-500">
                Minh chứng
              </span>{" "}
              cho chất lượng
            </h2>

            <p className="text-slate-600 text-base leading-relaxed max-w-xl mx-auto lg:mx-0">
              Không chỉ dừng lại ở lý thuyết suông, uy tín của nhà trường được
              khẳng định vững chắc qua những số liệu thống kê thực tế từ phòng
              đào tạo và mạng lưới doanh nghiệp hợp tác liên kết.
            </p>

            {/* Các gạch đầu dòng cam kết gia tăng độ uy tín */}
            <div className="pt-4 space-y-3 max-w-md mx-auto lg:mx-0 text-left">
              <div className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                <CheckCircle className="w-5 h-5 text-amber-500 shrink-0" />
                <span>Chương trình chuẩn hóa theo chuẩn ASEAN</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                <CheckCircle className="w-5 h-5 text-amber-500 shrink-0" />
                <span>Ký hợp đồng cam kết việc làm khi nhập học</span>
              </div>
            </div>
          </div>

          {/* KHỐI PHẢI: BENTO GRID CHỈ SỐ HOVER SIÊU MƯỢT (Chiếm 7/12 cột) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {statsData.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.id}
                  className="group relative bg-slate-50/60 border border-slate-100 rounded-3xl p-8 flex flex-col items-start justify-between transition-all duration-300 hover:bg-white hover:border-blue-200/80 hover:shadow-xl hover:shadow-blue-900/[0.04] hover:-translate-y-1.5 overflow-hidden"
                >
                  {/* Lớp phủ gradient ẩn hiện tinh tế khi hover */}
                  <div
                    className={`absolute top-0 left-0 w-2 h-full bg-gradient-to-b ${stat.accentColor} opacity-80`}
                  />

                  {/* Top layout: Icon nằm gọn gàng bên góc trái */}
                  <div className="flex items-center justify-between w-full mb-6">
                    <div
                      className={`w-12 h-12 flex items-center justify-center rounded-2xl bg-gradient-to-br ${stat.accentColor} text-white shadow-md transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    {/* Chấm tròn hiệu ứng trang trí mờ phía sau */}
                    <div
                      className={`w-24 h-24 -mr-12 -mt-12 rounded-full bg-gradient-to-br ${stat.accentColor} opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-300`}
                    />
                  </div>

                  {/* Middle layout: Con số nhảy tự động chuẩn UX */}
                  <div className="mb-2">
                    <InView triggerOnce={true}>
                      {({ inView, ref }) => (
                        <div
                          ref={ref}
                          className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight tabular-nums"
                        >
                          {inView ? (
                            <CountUp
                              end={stat.value}
                              duration={2.5}
                              decimals={stat.value % 1 !== 0 ? 1 : 0} // Tự động xử lý số thập phân cho tỷ lệ % và mức lương
                              separator=","
                            />
                          ) : (
                            0
                          )}
                          <span className="text-blue-900 font-extrabold text-2xl md:text-3xl ml-1">
                            {stat.suffix}
                          </span>
                        </div>
                      )}
                    </InView>
                  </div>

                  {/* Bottom layout: Nhãn tên và mô tả chi tiết giải thích ý nghĩa */}
                  <div>
                    <h4 className="text-slate-900 font-bold text-base mb-1 tracking-wide">
                      {stat.label}
                    </h4>
                    <p className="text-slate-500 text-xs leading-relaxed">
                      {stat.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ThanhTichSection;
