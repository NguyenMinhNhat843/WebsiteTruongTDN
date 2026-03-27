import { Trophy, Users, Zap, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const BENEFITS = [
  {
    icon: Trophy,
    title: "Chương trình thực tiễn",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: Users,
    title: "Môi trường năng động",
    color: "bg-cyan-100 text-cyan-600",
  },
  {
    icon: Zap,
    title: "70% thời lượng thực hành",
    color: "bg-orange-100 text-orange-600",
  },
];

// Component con cho từng dòng lợi ích
const BenefitItem = ({ icon: Icon, title, color }: (typeof BENEFITS)[0]) => (
  <div className="flex items-center gap-4 group">
    <div
      className={`p-2 rounded-lg ${color} transition-transform group-hover:scale-110`}
    >
      <Icon size={20} />
    </div>
    <span className="text-slate-900 font-medium">{title}</span>
  </div>
);

const DangKyTuVan = () => {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="rounded-[2.5rem] overflow-hidden shadow-2xl bg-white grid grid-cols-1 lg:grid-cols-2">
          {/* CỘT TRÁI: NỘI DUNG */}
          <div className="p-8 md:p-14 lg:p-16 space-y-8 relative z-10">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-blue-500 font-semibold tracking-wider uppercase text-sm">
                <Sparkles size={18} />
                <span>Cơ hội nghề nghiệp rộng mở</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 leading-[1.1]">
                Sẵn sàng cho <br />
                <span className="text-blue-600">hành trình tương lai?</span>
              </h2>
              <p className="text-slate-600 text-lg max-w-md leading-relaxed">
                Đừng bỏ lỡ đợt tuyển sinh lớn nhất trong năm. Hãy để chúng tôi
                đồng hành cùng bạn xây dựng sự nghiệp vững chắc.
              </p>
            </div>

            <div className="space-y-4">
              {BENEFITS.map((item) => (
                <BenefitItem key={item.title} {...item} />
              ))}
            </div>
          </div>

          {/* CỘT PHẢI: CTA & IMAGE */}
          <div className="relative min-h-87.5 lg:min-h-full flex items-center justify-center p-8 bg-linear-to-br from-blue-600/5 to-transparent">
            {/* Background Image Optimized */}
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1000&auto=format&fit=crop"
                alt="Students"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover opacity-30 grayscale hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 to-transparent" />
            </div>

            {/* CTA Button */}
            <div className="relative z-10 text-center space-y-6 w-full max-w-xs">
              <p className="text-white text-xl font-medium tracking-wide">
                Bạn đã sẵn sàng?
              </p>

              <Link
                to="/dang-ky-tuyen-sinh"
                className="group relative flex items-center justify-center gap-3 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-2xl shadow-[0_0_20px_rgba(30,88,180,0.4)] uppercase tracking-wider transition-all hover:scale-105 active:scale-95 overflow-hidden"
              >
                <span className="relative z-10">ĐĂNG KÝ TƯ VẤN NGAY</span>
                <ArrowRight
                  size={22}
                  className="relative z-10 group-hover:translate-x-2 transition-transform"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DangKyTuVan;
