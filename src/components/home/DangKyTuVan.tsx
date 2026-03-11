import { Trophy, Users, Zap } from "lucide-react";
import ConsultationForm from "./ConsulationForm";

const DangKyTuVan = () => {
  const benefits = [
    {
      icon: <Trophy className="w-6 h-6 text-yellow-500" />,
      title: "Chương trình đào tạo thực tiễn",
      desc: "Nội dung học được xây dựng gắn với nhu cầu thực tế của doanh nghiệp, giúp sinh viên dễ dàng áp dụng kiến thức vào công việc.",
    },
    {
      icon: <Users className="w-6 h-6 text-blue-500" />,
      title: "Môi trường học tập năng động",
      desc: "Sinh viên được học tập trong môi trường hiện đại, có nhiều hoạt động học thuật và kết nối với cộng đồng sinh viên.",
    },
    {
      icon: <Zap className="w-6 h-6 text-orange-500" />,
      title: "Chú trọng thực hành",
      desc: "Thời lượng thực hành cao, giúp sinh viên rèn luyện kỹ năng nghề nghiệp và làm quen với các tình huống thực tế.",
    },
  ];

  return (
    <section className="min-h-150 bg-slate-50 py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* BÊN TRÁI: NỘI DUNG THU HÚT */}
        <div className="space-y-8 animate-in fade-in slide-in-from-left duration-700">
          <div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
              Học để phát triển{" "}
              <span className="text-blue-600 italic">sự nghiệp</span> của bạn
            </h2>

            <p className="mt-4 text-lg text-slate-600 leading-relaxed">
              Nhà trường cung cấp các chương trình đào tạo nghề, trung cấp, cao
              đẳng và liên kết đại học với định hướng thực tiễn, giúp sinh viên
              xây dựng nền tảng kiến thức và kỹ năng cho tương lai.
            </p>
          </div>

          <div className="grid gap-6">
            {benefits.map((item, index) => (
              <div
                key={index}
                className="flex gap-4 p-4 rounded-2xl bg-white shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
              >
                <div className="shrink-0 p-3 bg-slate-50 rounded-xl">
                  {item.icon}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">{item.title}</h4>
                  <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <ConsultationForm />
      </div>
    </section>
  );
};

export default DangKyTuVan;
