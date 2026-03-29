import { Link } from "react-router-dom";
import { danhSachKhoa } from "./DaoTaoDataTemplate";
import KhoaCard from "./KhoaCard";

const ChuongTrinhDaoTao = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <section className="py-20" id="chuong-trinh-dao-tao">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4 uppercase">
            Chương trình đào tạo
          </h2>
          <div className="w-24 h-0.5 bg-blue-500 mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Chương trình đào tạo thực tiễn, bám sát nhu cầu doanh nghiệp. Cung
            cấp nền tảng kiến thức và kỹ năng chuyên sâu giúp bạn tự tin làm chủ
            sự nghiệp.
          </p>
        </div>

        {/* Grid danh sách khoa */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {danhSachKhoa.map((k) => (
            <KhoaCard key={k.tenKhoa} {...k} />
          ))}
        </div>
        <div className="flex justify-center mt-12 w-full">
          <Link
            to="/dang-ky-tuyen-sinh"
            className="bg-blue-900 text-white px-8 py-3 rounded-full font-medium hover:bg-blue-800 transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
          >
            Đăng ký tư vấn ngay
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ChuongTrinhDaoTao;
