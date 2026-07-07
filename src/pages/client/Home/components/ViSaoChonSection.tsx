import React from "react";
import { ShieldCheck, School, Handshake, Award } from "lucide-react";

const ViSaoChonSection: React.FC = () => {
  const giaTri = [
    {
      icon: ShieldCheck,
      title: "Cam kết việc làm",
      desc: "Ký hợp đồng đào tạo gắn liền với cam kết bố trí việc làm bằng văn bản.",
    },
    {
      icon: School,
      title: "Phòng LAB thực chiến",
      desc: "Phòng thực hành Tin học, buồng phòng du lịch đạt chuẩn doanh nghiệp.",
    },
    {
      icon: Handshake,
      title: "Học bổng đa dạng",
      desc: "Mạng lưới đối tác doanh nghiệp tài trợ nhiều suất học bổng giá trị cao.",
    },
    {
      icon: Award,
      title: "Bằng cấp chính quy",
      desc: "Hệ thống văn bằng chuẩn quốc gia, đủ điều kiện liên thông Đại học.",
    },
  ];

  return (
    <section className="py-20 bg-slate-900 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight">
            Tại sao học viên <span className="text-amber-400">Lựa chọn</span>{" "}
            chúng tôi?
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {giaTri.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors"
              >
                <div className="w-10 h-10 bg-amber-400 text-slate-950 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold mb-2 tracking-wide text-amber-400">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ViSaoChonSection;
