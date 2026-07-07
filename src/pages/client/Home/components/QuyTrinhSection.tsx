import React from "react";
import { Link } from "react-router-dom";
import {
  ClipboardCheck,
  CalendarDays,
  GraduationCap,
  ArrowRight,
} from "lucide-react";

const QuyTrinhSection: React.FC = () => {
  const steps = [
    {
      id: "01",
      icon: ClipboardCheck,
      title: "Đăng ký trực tuyến",
      description:
        "Điền thông tin cơ bản tại form xét tuyển trực tuyến mất chưa đầy 2 phút.",
    },
    {
      id: "02",
      icon: CalendarDays,
      title: "Nộp hồ sơ & Xét tuyển",
      description:
        "Nhà trường liên hệ hướng dẫn chuẩn bị học bạ và làm thủ tục nhập học.",
    },
    {
      id: "03",
      icon: GraduationCap,
      title: "Chính thức nhập học",
      description:
        "Nhận lịch tập trung, nhận đồng phục và bắt đầu kỳ học thực chiến đầu tiên.",
    },
  ];

  return (
    <section className="py-20 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-blue-950 uppercase tracking-tight">
            Quy trình nhập học <span className="text-blue-700">Đơn giản</span>
          </h2>
          <div className="w-16 h-1 bg-amber-400 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.id}
                className="relative group bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-all"
              >
                {/* Đường nối giữa các bước (chỉ hiện trên desktop) */}
                {idx < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 -translate-y-1/2 z-10 text-slate-300">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                )}

                <div className="absolute top-4 right-6 text-5xl font-black text-slate-100 group-hover:text-amber-100 transition-colors">
                  {step.id}
                </div>

                <div className="w-12 h-12 bg-blue-50 text-blue-900 rounded-xl flex items-center justify-center mb-6 font-bold">
                  <Icon className="w-6 h-6" />
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default QuyTrinhSection;
