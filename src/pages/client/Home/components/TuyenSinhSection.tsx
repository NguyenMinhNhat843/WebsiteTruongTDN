import React from "react";
import { Link } from "react-router-dom";
import {
  Monitor,
  Languages,
  Compass,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

// Định nghĩa cấu trúc dữ liệu tuyển sinh thực tế cho 3 ngành
interface AdmissionItem {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  icon: React.ComponentType<{ className?: string }>;
  slug: string;
  badge: string;
  target: string;
}

const admissionsData: AdmissionItem[] = [
  {
    id: 1,
    title: "Ngành Tin học ứng dụng",
    subtitle: "Chuyên gia Thực hành Công nghệ số",
    description:
      "Tập trung mài giũa tay nghề thực tế thông qua các mảng cực HOT: Lập trình, thiết kế Web, Đồ họa và Digital Marketing. Cam kết chuẩn đầu ra có việc làm ngay không nặng nề bằng cấp.",
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1000&q=80",
    icon: Monitor,
    slug: "tin-hoc-ung-dung",
    badge: "Tay nghề vàng",
    target: "Đảm bảo vững tay nghề thực tế",
  },
  {
    id: 2,
    title: "Ngành Tiếng Anh",
    subtitle: "Bứt phá sự nghiệp toàn cầu",
    description:
      "Xóa bỏ hoàn toàn lối học vẹt truyền thống. Lộ trình học bám sát môi trường công sở thực tế, tối ưu phản xạ ngôn ngữ tự nhiên giúp bạn tự tin hội nhập và làm việc trong các doanh nghiệp quốc tế.",
    image:
      "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&q=80",
    icon: Languages,
    slug: "tieng-anh",
    badge: "Chuẩn quốc tế",
    target: "Giao tiếp tự tin - Sẵn sàng hội nhập",
  },
  {
    id: 3,
    title: "Ngành Hướng dẫn du lịch",
    subtitle: "Bản lĩnh Hướng dẫn viên Quốc tế",
    description:
      "Đào tạo toàn diện từ thuyết minh tuyến điểm đến kỹ năng làm MC sự kiện, thiết kế Gameshow, Team Building bãi biển. Sẵn sàng cầm thẻ hướng dẫn viên làm việc khắp Đông Nam Á.",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    icon: Compass,
    slug: "huong-dan-du-lich",
    badge: "Học nhanh - Làm ngay",
    target: "Cọ xát dẫn tour thực tế tại điểm",
  },
];

const TuyenSinhSection: React.FC = () => {
  return (
    <section
      className="py-20 bg-slate-50 relative overflow-hidden"
      id="thong-tin-tuyen-sinh"
    >
      {/* Các họa tiết trang trí nền tinh tế */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-100/30 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Tiêu đề Section thiết kế chỉn chu */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 font-bold px-4 py-1.5 rounded-full text-xs uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
            Chỉ tiêu tuyển sinh 2026
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-blue-950 mb-4 uppercase tracking-tight">
            Thông tin tuyển sinh{" "}
            <span className="text-blue-700">chính quy</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-900 to-amber-400 mx-auto mb-6 rounded-full"></div>
          <p className="text-slate-600 max-w-2xl mx-auto text-base leading-relaxed">
            Hệ thống tuyển sinh xét tuyển học bạ đơn giản, nhanh chóng cho 3
            ngành trọng điểm cốt lõi. Nhận hồ sơ xét tuyển trực tuyến ngay hôm
            nay.
          </p>
        </div>

        {/* Bố cục Bento Grid: Ô thứ nhất to chiếm 1 cột riêng, 2 ô sau chia đôi hoặc xếp dọc */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* 1. NGÀNH TIN HỌC ỨNG DỤNG (CHIẾM Ô TO TRÁI - 7/12 cột trên màn hình lớn) */}
          <div className="lg:col-span-7 group relative overflow-hidden rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col min-h-[460px] bg-slate-900">
            <img
              src={admissionsData[0].image}
              alt={admissionsData[0].title}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-40 group-hover:opacity-30"
            />
            {/* Lớp phủ dải màu dốc để đảm bảo tương phản chữ đạt chuẩn 4.5:1 (WCAG A11y) */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />

            {/* Nội dung ô to nằm trên */}
            <div className="relative p-8 md:p-10 mt-auto flex flex-col items-start z-10">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-amber-400 text-slate-950 text-xs font-extrabold uppercase px-3 py-1 rounded-md">
                  {admissionsData[0].badge}
                </span>
                <span className="bg-white/10 backdrop-blur-md text-white text-xs font-medium px-3 py-1 rounded-md">
                  {admissionsData[0].target}
                </span>
              </div>

              <div className="flex items-center gap-3 text-amber-400 mb-2">
                {React.createElement(admissionsData[0].icon, {
                  className: "w-6 h-6",
                })}
                <span className="text-sm font-semibold tracking-wider uppercase opacity-90">
                  {admissionsData[0].subtitle}
                </span>
              </div>

              <h3 className="text-2xl md:text-3xl font-black text-white mb-4 tracking-tight">
                {admissionsData[0].title}
              </h3>

              <p className="text-slate-200 text-sm md:text-base leading-relaxed max-w-xl mb-6 opacity-90">
                {admissionsData[0].description}
              </p>

              <Link
                to={`/dang-ky-tuyen-sinh`}
                target="__blank"
                className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-5 py-3 rounded-xl transition-all duration-200 shadow-md active:scale-[0.98]"
              >
                <span>Nộp hồ sơ xét tuyển</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>

          {/* CỘT PHẢI: CHỨA 2 NGÀNH CÒN LẠI (CHIẾM 5/12 cột trên màn hình lớn) */}
          <div className="lg:col-span-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
            {admissionsData.slice(1, 3).map((item) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={item.id}
                  className="group relative overflow-hidden rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-end min-h-[240px] bg-blue-950"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-40"
                  />
                  {/* Lớp phủ bảo vệ tương phản */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

                  {/* Nội dung ô nhỏ */}
                  <div className="relative p-6 z-10 flex flex-col items-start">
                    <span className="bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded mb-3">
                      {item.badge}
                    </span>

                    <div className="flex items-center gap-2 text-amber-400 mb-1">
                      <IconComponent className="w-5 h-5" />
                      <h3 className="text-xl font-bold text-white tracking-tight">
                        {item.title}
                      </h3>
                    </div>

                    <p className="text-slate-200 text-xs leading-relaxed mb-4 line-clamp-2 opacity-90">
                      {item.description}
                    </p>

                    <Link
                      to={`/dang-ky-tuyen-sinh`}
                      target="__blank"
                      className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-bold hover:text-amber-300 transition-colors duration-200"
                    >
                      <span>Chi tiết tuyển sinh</span>
                      <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Khối Thông báo nhanh chân trang kích cầu nộp hồ sơ */}
        <div className="mt-12 bg-blue-900 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md border border-blue-800">
          <div className="text-center md:text-left">
            <h4 className="text-white font-bold text-lg mb-1">
              Bạn cần hỗ trợ chuẩn bị hồ sơ xét học bạ?
            </h4>
            <p className="text-blue-100 text-sm">
              Liên hệ trực tiếp với ban tuyển sinh để nhận kết quả xét duyệt sau
              15 phút.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 shrink-0 w-full md:w-auto">
            <a
              href="tel:081 4393 535"
              className="w-full sm:w-auto text-center bg-transparent border border-white text-white font-bold px-6 py-3 rounded-xl text-sm hover:bg-white/10 transition-colors"
            >
              Hotline: 081 4393 535
            </a>
            <Link
              to="/dang-ky-tuyen-sinh"
              target="__blank"
              className="w-full sm:w-auto text-center bg-amber-400 hover:bg-amber-500 text-slate-950 font-extrabold px-6 py-3 rounded-xl text-sm transition-all shadow-sm active:scale-95"
            >
              Đăng ký xét tuyển trực tuyến
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TuyenSinhSection;
