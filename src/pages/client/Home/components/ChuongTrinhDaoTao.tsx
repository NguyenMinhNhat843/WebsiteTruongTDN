import React from "react";
import { Link } from "react-router-dom";
import {
  Monitor,
  Languages,
  Compass,
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  type LucideIcon,
} from "lucide-react";

// Định nghĩa Interface cho dữ liệu Ngành học
interface NganhHoc {
  tenNganh: string;
  slug: string;
  icon: LucideIcon;
  tagline: string;
  description: string;
  anh: string;
  diemNoiBat: string[];
  badge: string;
  link: string;
}

// 1. Data rút gọn tập trung vào 3 ngành chính theo yêu cầu
const danhSachNganhHot: NganhHoc[] = [
  {
    tenNganh: "Tin học ứng dụng",
    slug: "tin-hoc-ung-dung",
    icon: Monitor,
    tagline: "Đón đầu xu hướng công nghệ 4.0",
    description:
      "Đào tạo kỹ năng thực hành chuyên sâu về phát triển phần mềm, quản trị mạng, thiết kế đồ họa và ứng dụng CNTT vào quản lý doanh nghiệp.",
    anh: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
    diemNoiBat: [
      "Học thực hành phòng LAB hiện đại",
      "Cam kết việc làm CNTT sau tốt nghiệp",
      "Cấp chứng chỉ nghề chuẩn quốc gia",
    ],
    badge: "Mũi nhọn công nghệ",
    link: "/chuong-trinh-dao-tao/tin-hoc-ung-dung",
  },
  {
    tenNganh: "Tiếng Anh thương mại",
    slug: "tieng-anh-thuong-mai",
    icon: Languages,
    tagline: "Chìa khóa hội nhập quốc tế",
    description:
      "Bứt phá kỹ năng giao tiếp phản xạ, tiếng Anh chuyên ngành thương mại, dịch thuật và kỹ năng văn phòng trong môi trường đa quốc gia.",
    anh: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&q=80",
    diemNoiBat: [
      "Giảng viên bản ngữ đứng lớp",
      "Phương pháp phản xạ tương tác phản hồi",
      "Chuẩn đầu ra TOEIC / IELTS quốc tế",
    ],
    badge: "Xuương toàn cầu",
    link: "/chuong-trinh-dao-tao/tieng-anh-thuong-mai",
  },
  {
    tenNganh: "Dịch vụ du lịch & Lữ hành",
    slug: "dich-vu-du-lich-va-lu-hanh",
    icon: Compass,
    tagline: "Nghề dịch chuyển vững tương lai",
    description:
      "Trang bị kiến thức nghiệp vụ hướng dẫn viên, quản trị nhà hàng - khách sạn, thiết kế và điều hành tour du lịch thực tế chuyên nghiệp.",
    anh: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    diemNoiBat: [
      "Thực tập hưởng lương tại resort 5*",
      "Cọ xát dẫn tour thực tế từ năm nhất",
      "Thẻ hướng dẫn viên quốc tế/nội địa",
    ],
    badge: "Thực tiễn 100%",
    link: "/chuong-trinh-dao-tao/dich-vu-du-lich",
  },
];

// 2. Component NganhHocCard (Internal Component) viết bằng TypeScript
const NganhHocCard: React.FC<NganhHoc> = ({
  tenNganh,
  icon: Icon,
  tagline,
  description,
  anh,
  diemNoiBat,
  badge,
  link,
}) => {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col transform hover:-translate-y-2">
      {/* Khối ảnh nền + Badge thông minh */}
      <div className="relative h-52 overflow-hidden bg-slate-900">
        <img
          src={anh}
          alt={tenNganh}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-90 group-hover:opacity-100"
        />
        {/* Lớp phủ gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />

        {/* Badge màu vàng cam tạo điểm nhấn mạnh */}
        <span className="absolute top-4 left-4 bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm">
          {badge}
        </span>

        {/* Khối Icon tương tác nổi bật */}
        <div className="absolute -bottom-6 right-6 bg-blue-900 text-amber-400 p-4 rounded-xl shadow-lg border border-blue-800 transition-all duration-300 group-hover:bg-amber-400 group-hover:text-blue-900 group-hover:rotate-6">
          <Icon className="w-6 h-6" />
        </div>
      </div>

      {/* Khối Nội Dung Chi Tiết */}
      <div className="p-6 pt-8 flex-1 flex flex-col">
        <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 mb-1">
          {tagline}
        </span>
        <h3 className="text-xl font-bold text-blue-950 group-hover:text-blue-900 transition-colors duration-200 line-clamp-1 mb-3">
          {tenNganh}
        </h3>
        <p className="text-sm text-slate-600 line-clamp-3 mb-6 flex-1">
          {description}
        </p>

        {/* Các cam kết ưu thế của nhà trường */}
        <div className="space-y-2 mb-6 border-t border-slate-50 pt-4">
          {diemNoiBat.map((diem, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2 text-xs text-slate-700"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>{diem}</span>
            </div>
          ))}
        </div>

        {/* Nút hành động tương tác */}
        <Link
          to={link}
          className="inline-flex items-center justify-between w-full font-semibold text-sm text-blue-900 bg-slate-50 group-hover:bg-blue-900 group-hover:text-white px-4 py-3 rounded-xl transition-all duration-300"
        >
          <span>Xem chi tiết lộ trình</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
};

// 3. Component Chính ChuongTrinhDaoTao
const ChuongTrinhDaoTao: React.FC = () => {
  return (
    <section className="py-20 bg-slate-50" id="chuong-trinh-dao-tao">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header Section */}
        <div className="text-center mb-16 relative">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-900 font-semibold px-4 py-1.5 rounded-full text-xs uppercase tracking-widest mb-4">
            <GraduationCap className="w-4 h-4 text-blue-800" />
            Hệ Trung Cấp Chính Quy
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-blue-950 mb-4 uppercase tracking-tight">
            Chương trình đào tạo{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-blue-700">
              Trọng Điểm
            </span>
          </h2>

          {/* Thanh kẻ ngang điểm xuyết Xanh - Vàng cam */}
          <div className="relative w-32 h-1 bg-blue-200 mx-auto mb-6 rounded-full overflow-hidden">
            <div className="absolute left-1/3 w-1/3 h-full bg-amber-400"></div>
          </div>

          <p className="text-slate-600 text-base max-w-2xl mx-auto leading-relaxed">
            Mô hình đào tạo thực chiến ngắn hạn, tinh gọn lý thuyết, bám sát đơn
            đặt hàng của doanh nghiệp. Học viên vững tay nghề, sẵn sàng làm việc
            ngay sau khi tốt nghiệp.
          </p>
        </div>

        {/* Grid 3 ngành chủ đạo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {danhSachNganhHot.map((nganh) => (
            <NganhHocCard key={nganh.slug} {...nganh} />
          ))}
        </div>

        {/* Hệ thống CTA tăng chuyển đổi ở cuối khối */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-16 w-full">
          <Link
            to="/dang-ky-tuyen-sinh"
            className="w-full sm:w-auto text-center bg-blue-900 text-white px-8 py-4 rounded-xl font-bold text-base hover:bg-blue-950 transition-all duration-200 shadow-md hover:shadow-xl active:scale-[0.98] cursor-pointer border border-blue-900"
          >
            Đăng ký xét tuyển ngay
          </Link>
          <Link
            to="/tu-van-nghe-nghiep"
            className="w-full sm:w-auto text-center bg-white text-blue-900 px-8 py-4 rounded-xl font-bold text-base hover:bg-slate-50 transition-all duration-200 shadow-sm border border-slate-200 active:scale-[0.98]"
          >
            Nhận tư vấn hướng nghiệp miễn phí
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ChuongTrinhDaoTao;
