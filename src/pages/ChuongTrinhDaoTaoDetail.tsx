import { useParams, useNavigate, Link } from "react-router-dom";
import { BookOpen, CheckCircle2, GraduationCap } from "lucide-react";
import { danhSachKhoa } from "../components/home/DaoTaoDataTemplate";

const ChuongTrinhDaoTaoDetail = () => {
  const { heDaoTaoSlug } = useParams();
  const navigate = useNavigate();

  // Tìm khoa dựa trên slug từ URL
  const khoa = danhSachKhoa.find((k) => k.khoaSlug === heDaoTaoSlug);

  // Xử lý nếu không tìm thấy dữ liệu
  if (!khoa) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold">Không tìm thấy chương trình này</h2>
        <button onClick={() => navigate(-1)} className="mt-4 text-blue-600">
          Quay lại
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen font-['Be_Vietnam_Pro']">
      {/* 1. HERO SECTION: Ảnh và Tiêu đề */}
      <div className="relative h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden">
        <img
          src={khoa.anh}
          className="absolute inset-0 w-full h-full object-cover shadow-inner"
          alt={khoa.tenKhoa}
        />
        <div className="absolute inset-0 bg-blue-900/70" /> {/* Overlay */}
        <div className="relative z-10 text-center px-6">
          <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight">
            {khoa.tenKhoa}
          </h1>
          <div className="w-20 h-1.5 bg-amber-400 mx-auto mt-6 rounded-full" />
        </div>
      </div>

      {/* 2. GIỚI THIỆU CHUNG */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-3 gap-12 items-start">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-blue-900 mb-6 flex items-center gap-3">
              <BookOpen className="text-amber-500" /> Giới thiệu chương trình
            </h2>
            <p className="text-slate-600 leading-relaxed text-lg mb-8">
              {khoa.description} Chương trình được thiết kế nhằm cung cấp kiến
              thức nền tảng vững chắc cùng kỹ năng thực hành chuyên sâu, giúp
              học viên tự tin đáp ứng nhu cầu của thị trường lao động hiện đại.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              {[
                "Bằng cấp chính quy",
                "Hỗ trợ việc làm 100%",
                "Giảng viên giàu kinh nghiệm",
                "Cơ sở vật chất hiện đại",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 text-slate-700 font-medium"
                >
                  <CheckCircle2 className="text-green-500 shrink-0" size={20} />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
            <GraduationCap size={40} className="text-blue-600 mb-4" />
            <h4 className="font-bold text-lg text-blue-900 mb-2">
              Đăng ký ngay
            </h4>
            <p className="text-sm text-slate-500 mb-6">
              Liên hệ với bộ phận tuyển sinh để được tư vấn lộ trình học tập phù
              hợp nhất với bạn.
            </p>
            <Link
              to={"/dang-ky-tuyen-sinh"}
              className="w-full block text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-200"
            >
              Nhận tư vấn miễn phí
            </Link>
          </div>
        </div>
      </section>

      {/* 3. DANH SÁCH NGÀNH ĐÀO TẠO */}
      <section className="bg-slate-50 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-black text-blue-900 uppercase">
                Các ngành đào tạo
              </h2>
            </div>
            <p className="text-slate-500 text-sm max-w-md">
              Chọn ngành học phù hợp với đam mê và năng lực của bạn để bắt đầu
              hành trình sự nghiệp.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {khoa.nganh.map((n, index) => (
              <Link to={`${n.slug}`} key={index} className="group">
                <div
                  key={index}
                  className="group bg-white p-6 rounded-2xl border border-white hover:border-blue-100 shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <h3 className="text-lg font-bold text-slate-800 leading-snug group-hover:text-blue-700">
                    {n.label}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ChuongTrinhDaoTaoDetail;
