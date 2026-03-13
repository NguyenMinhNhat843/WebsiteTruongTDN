import { Trophy, Users, Zap, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const DangKyTuVan = () => {
  const colors = {
    primary: "#1E4E8C", // deep blue
    primaryLight: "#3A78D8", // lighter blue for hover
    secondary: "#A5D8FF", // light sky blue
    secondaryDark: "#0D5E93", // dark blue for contrasts
    accent: "#10B981", // emerald/green accent (CTA subtle)
    bgPanel: "#F1F7FB", // very light blue-ish background
    text: "#0F1B2A", // dark slate for readability
    muted: "#64748B", // slate-500 for secondary text
  };

  const benefits = [
    {
      icon: <Trophy className="w-5 h-5" />,
      title: "Chương trình thực tiễn",
      bgColor: "bg-[#E7F0FF]", // soft blue background
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Môi trường năng động",
      bgColor: "bg-[#E6F6FF]", // very light blue
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "70% thời lượng thực hành",
      bgColor: "bg-[#FFF4E6]", // light amber
    },
  ];

  return (
    <section className="py-20 px-4" style={{ background: "#ffffff" }}>
      <div className="max-w-6xl mx-auto">
        <div
          className="relative rounded-[2.5rem] overflow-hidden shadow-2xl"
          style={{ background: colors.bgPanel }}
        >
          {/* Background Elements */}
          <div
            className="absolute top-0 right-0 w-1/2 h-full"
            style={{
              background: `linear-gradient(to left, rgba(14,94,168,0.25), transparent 60%)`,
            }}
          />
          <div
            className="absolute -bottom-24 -right-24 w-64 h-64"
            style={{
              background: colors.primary,
              borderRadius: "999px",
              filter: "blur(60px)",
              opacity: 0.2,
            }}
          />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* CỘT TRÁI: THÔNG TIN CHIÊU MỘ */}
            <div className="p-8 md:p-14 lg:p-16 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[#3B82F6] font-semibold tracking-wider uppercase text-sm">
                  <Sparkles size={18} />
                  <span>Cơ hội nghề nghiệp rộng mở</span>
                </div>
                <h2
                  className="text-3xl md:text-5xl font-bold"
                  style={{ color: "#0F1B2A", lineHeight: 1.1 }}
                >
                  Sẵn sàng cho <br />
                  <span style={{ color: colors.primary }}>
                    hành trình tương lai?
                  </span>
                </h2>
                <p
                  className="text-slate-600 text-lg max-w-md leading-relaxed"
                  style={{ color: "#475569" }}
                >
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
                    <span
                      className="text-slate-700 font-medium"
                      style={{ color: "#0F1B2A" }}
                    >
                      {item.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CỘT PHẢI: CHIẾN DỊCH HÌNH ẢNH + NÚT BẤM (CTA) */}
            <div
              className="relative min-h-87.5 lg:min-h-full flex items-center justify-center p-8"
              style={{
                background:
                  "linear-gradient(to bottom right, rgba(14,94,168,0.15), rgba(255,255,255,0))",
              }}
            >
              {/* Ảnh nền mờ ảo tạo vibe giáo dục */}
              <div className="absolute inset-0 z-0">
                <img
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1000&auto=format&fit=crop"
                  alt="Students"
                  className="w-full h-full object-cover opacity-30 grayscale hover:grayscale-0 transition-all duration-700"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(15,23,42,0.8), rgba(15,23,42,0.0))",
                  }}
                />
              </div>

              {/* NÚT BẤM TỔNG LỰC */}
              <div className="relative z-10 text-center space-y-6 w-full max-w-xs">
                <div className="space-y-2">
                  <p
                    className="text-white text-xl font-medium"
                    style={{ letterSpacing: 0.5 }}
                  >
                    Bạn đã sẵn sàng?
                  </p>
                </div>

                <Link
                  to="/dang-ky-tuyen-sinh"
                  className="group relative flex items-center justify-center gap-3 w-full"
                  style={{
                    background: colors.primary,
                    color: "white",
                    fontWeight: 700,
                    padding: "0.75rem 1.75rem",
                    borderRadius: "1.25rem",
                    boxShadow: "0 0 20px rgba(30,88,180,.4)",
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    transition: "transform .3s",
                  }}
                >
                  <span className="relative z-10">ĐĂNG KÝ TƯ VẤN NGAY</span>
                  <ArrowRight
                    size={22}
                    className="relative z-10 group-hover:translate-x-2 transition-transform"
                  />

                  {/* Hiệu ứng tia sáng quét qua nút */}
                  <div
                    className="absolute inset-0 rounded-2xl overflow-hidden"
                    aria-hidden="true"
                  >
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to right, transparent 0%, rgba(255,255,255,0.28) 50%, transparent 100%)",
                      }}
                    />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inline keyframes for shimmer (if needed) */}
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </section>
  );
};

export default DangKyTuVan;
