import { Trophy, Users, Zap, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const DangKyTuVan = () => {
  const benefits = [
    {
      icon: <Trophy className="w-5 h-5 text-yellow-500" />,
      title: "Chương trình thực tiễn",
      bgColor: "bg-yellow-50",
    },
    {
      icon: <Users className="w-5 h-5 text-school-blue-500" />,
      title: "Môi trường năng động",
      bgColor: "bg-school-blue-50",
    },
    {
      icon: <Zap className="w-5 h-5 text-orange-500" />,
      title: "70% thời lượng thực hành",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <section className="py-20 px-4 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="relative bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-school-blue-900/20">
          {/* Background Elements */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-school-blue-600/20 to-transparent z-0" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-school-blue-500 rounded-full blur-[100px] opacity-20" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* CỘT TRÁI: THÔNG TIN CHIÊU MỘ */}
            <div className="p-8 md:p-14 lg:p-16 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-school-blue-400 font-semibold tracking-wider uppercase text-sm">
                  <Sparkles size={18} />
                  <span>Cơ hội nghề nghiệp rộng mở</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                  Sẵn sàng cho <br />
                  <span className="text-school-blue-400">
                    hành trình tương lai?
                  </span>
                </h2>
                <p className="text-slate-400 text-lg max-w-md leading-relaxed">
                  Đừng bỏ lỡ đợt tuyển sinh lớn nhất trong năm. Hãy để chúng tôi
                  đồng hành cùng bạn xây dựng sự nghiệp vững chắc.
                </p>
              </div>

              {/* Danh sách lợi ích rút gọn (dễ quét mắt) */}
              <div className="space-y-4">
                {benefits.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 group">
                    <div
                      className={`p-2 rounded-lg ${item.bgColor} transition-transform group-hover:scale-110`}
                    >
                      {item.icon}
                    </div>
                    <span className="text-slate-300 font-medium">
                      {item.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CỘT PHẢI: CHIẾN DỊCH HÌNH ẢNH + NÚT BẤM (CTA) */}
            <div className="relative min-h-87.5 lg:min-h-full flex items-center justify-center p-8 bg-slate-800/50">
              {/* Ảnh nền mờ ảo tạo vibe giáo dục */}
              <div className="absolute inset-0 z-0">
                <img
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1000&auto=format&fit=crop"
                  alt="Students"
                  className="w-full h-full object-cover opacity-30 grayscale hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/40 to-transparent" />
              </div>

              {/* NÚT BẤM TỔNG LỰC */}
              <div className="relative z-10 text-center space-y-6 w-full max-w-xs">
                <div className="space-y-2">
                  <p className="text-white text-xl font-medium">
                    Bạn đã sẵn sàng?
                  </p>
                  <p className="text-slate-400 text-sm">
                    Chỉ mất 1 phút để thay đổi tương lai
                  </p>
                </div>

                <Link
                  to="/dang-ky-tuyen-sinh"
                  className="group relative flex items-center justify-center gap-3 w-full bg-school-blue-600 hover:bg-school-blue-500 text-white font-bold py-5 px-8 rounded-2xl shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all duration-300 hover:-translate-y-1 active:scale-95"
                >
                  <span className="relative z-10">ĐĂNG KÝ TƯ VẤN NGAY</span>
                  <ArrowRight
                    size={22}
                    className="relative z-10 group-hover:translate-x-2 transition-transform"
                  />

                  {/* Hiệu ứng tia sáng quét qua nút */}
                  <div className="absolute inset-0 rounded-2xl overflow-hidden">
                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tailwind Animation Customization (Thêm vào file CSS của bạn nếu chưa có) */}
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </section>
  );
};

export default DangKyTuVan;
