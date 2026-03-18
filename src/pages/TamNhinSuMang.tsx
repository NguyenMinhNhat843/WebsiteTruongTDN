import {
  Target,
  Lightbulb,
  Users,
  Rocket,
  ShieldCheck,
  Zap,
} from "lucide-react";

const VisionMissionPage = () => {
  const coreValues = [
    {
      title: "NHIỆT HUYẾT",
      icon: <Zap className="w-8 h-8 text-school-blue-600" />,
      desc: "Đặt 100% năng lượng để theo đuổi mục tiêu. Đam mê và nỗ lực không ngừng để chạm đến vạch đích cuối cùng.",
    },
    {
      title: "NĂNG ĐỘNG",
      icon: <Rocket className="w-8 h-8 text-school-blue-600" />,
      desc: "Chủ động, tích cực, dám nghĩ dám làm và thích nghi nhanh chóng với môi trường thay đổi.",
    },
    {
      title: "SÁNG TẠO",
      icon: <Lightbulb className="w-8 h-8 text-school-blue-600" />,
      desc: "Luôn nghiên cứu và cải tiến để tạo ra giá trị khác biệt và bản sắc riêng trong mỗi chương trình đào tạo.",
    },
    {
      title: "TRÁCH NHIỆM",
      icon: <ShieldCheck className="w-8 h-8 text-school-blue-600" />,
      desc: "Cam kết chất lượng đào tạo, lấy học viên làm trung tâm và coi sự hài lòng là thước đo thành công.",
    },
    {
      title: "LINH HOẠT",
      icon: <Users className="w-8 h-8 text-school-blue-600" />,
      desc: "Phản ứng nhanh trước cơ hội và thách thức. Sàng lọc bộ máy, đặt đúng người vào đúng việc.",
    },
  ];

  return (
    <div className="bg-slate-50 font-sans text-slate-900">
      {/* Hero Section - Giới thiệu chung */}
      <section className="relative h-75 md:h-100 flex items-center justify-center text-white bg-[url('/banner_header.png')] bg-cover bg-center">
        {/* Lớp Overlay tối: Giúp chữ nổi bật tuyệt đối trên mọi nền ảnh */}
        <div className="absolute inset-0 bg-black/50 md:bg-black/40 shadow-inner"></div>

        {/* Nội dung */}
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Tầm Nhìn & Sứ Mệnh
          </h1>

          {/* Đường kẻ phân cách nhỏ */}
          <div className="w-20 h-1 bg-school-blue-700 mx-auto mb-4 rounded-full"></div>

          <p className="text-school-blue-100 text-lg max-w-3xl mx-auto italic">
            "Chất lượng vàng – Niềm tin vàng" – Đào tạo gắn liền với việc làm.
          </p>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="py-16 container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border-l-4 border-school-blue-600">
              <h2 className="flex items-center text-2xl font-bold text-school-blue-700 mb-4">
                <Target className="mr-3" /> TẦM NHÌN 2030
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Đến năm 2030, Trường Trung Cấp Kinh tế Kỹ thuật Trần Đại Nghĩa
                trở thành trường có uy tín hàng đầu trong lĩnh vực đào tạo khu
                vực Miền trung và Tây Nguyên Việt Nam.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border-l-4 border-emerald-500">
              <h2 className="flex items-center text-2xl font-bold text-emerald-600 mb-4">
                <Users className="mr-3" /> SỨ MẠNG
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Xây dựng môi trường trường học gắn liền với doanh nghiệp và thực
                tiễn đời sống xã hội. Giúp sinh viên có kiến thức chuyên môn
                vững chắc và tác phong công nghiệp chuyên nghiệp.
              </p>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1000"
              alt="Students Learning"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-16 bg-school-blue-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-school-blue-800">
              GIÁ TRỊ CỐT LÕI
            </h2>
            <div className="w-24 h-1 bg-school-blue-600 mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {coreValues.map((value, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md hover:-translate-y-2 transition-all duration-300"
              >
                <div className="mb-4 bg-school-blue-50 w-16 h-16 flex items-center justify-center rounded-lg">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">
                  {value.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed italic">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-16 container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-800 mb-8 underline decoration-school-blue-500 underline-offset-8">
            PHƯƠNG CHÂM HOẠT ĐỘNG
          </h2>
          <p className="text-slate-600 leading-loose mb-10">
            Trường phát triển phương pháp{" "}
            <span className="font-semibold text-school-blue-700">
              “Học đi đôi với hành”
            </span>
            , nội dung giảng dạy bám sát thực tế. Chúng tôi không chỉ đào tạo
            chuyên môn mà còn rèn luyện đạo đức, tác phong công nghiệp và kỹ
            năng ngoại ngữ để sinh viên sẵn sàng làm việc trong môi trường quốc
            tế.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <img
              src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=400"
              className="rounded-lg shadow aspect-video object-cover"
              alt="Work 1"
            />
            <img
              src="https://images.unsplash.com/photo-1573161559521-450cf10b6d21?auto=format&fit=crop&q=80&w=400"
              className="rounded-lg shadow aspect-video object-cover"
              alt="Work 2"
            />
            <img
              src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=400"
              className="rounded-lg shadow aspect-video object-cover"
              alt="Work 3"
            />
            <img
              src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=400"
              className="rounded-lg shadow aspect-video object-cover"
              alt="Work 4"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default VisionMissionPage;
