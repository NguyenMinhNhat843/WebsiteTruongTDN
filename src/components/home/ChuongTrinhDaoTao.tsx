import { danhSachKhoa } from "./DaoTaoDataTemplate";
import KhoaCard from "./KhoaCard";

const ChuongTrinhDaoTao = () => {
  return (
    <section
      className="bg-slate-50 py-20 px-6 font-['Be_Vietnam_Pro']"
      id="chuong-trinh-dao-tao"
    >
      {/* Header Section */}
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight italic">
          <span className="text-school-blue-800">Chương trình </span>
          <span className="text-school-blue-600">Đào Tạo</span>
        </h2>

        {/* Line trang trí kiểu giáo dục */}
        <div className="flex items-center justify-center gap-2 mt-4">
          <div className="h-1 w-12 bg-school-blue-900 rounded-full" />
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <div className="h-1 w-12 bg-school-blue-700 rounded-full" />
        </div>

        <p className="mt-6 text-slate-500 text-sm md:text-base max-w-xl mx-auto font-medium">
          Hệ thống ngành nghề đa dạng, chú trọng thực hành và kỹ năng chuyên
          sâu, đáp ứng tiêu chuẩn tuyển dụng khắt khe nhất.
        </p>
      </div>

      {/* Grid danh sách khoa */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {danhSachKhoa.map((k) => (
          <KhoaCard key={k.tenKhoa} {...k} />
        ))}
      </div>
    </section>
  );
};

export default ChuongTrinhDaoTao;
