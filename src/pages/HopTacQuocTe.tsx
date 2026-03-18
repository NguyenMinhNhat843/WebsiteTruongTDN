import { Handshake, BookOpen, PlaneTakeoff, Microscope } from "lucide-react";

const HopTacQuocTe = () => {
  const functions = [
    "Tư vấn Ban giám hiệu về liên kết đào tạo, nghiên cứu khoa học và chuyển giao công nghệ.",
    "Quản lý và tổ chức thực hiện các chương trình liên kết quốc tế và tư vấn du học.",
  ];

  const missionGroups = [
    {
      title: "Liên kết Đào tạo",
      icon: <Handshake className="w-6 h-6" />,
      items: [
        "Chương trình liên kết trong và ngoài nước",
        "Bậc đào tạo: Đại học, Thạc sĩ, Tiến sĩ",
      ],
    },
    {
      title: "Tư vấn Du học",
      icon: <PlaneTakeoff className="w-6 h-6" />,
      items: [
        "Học bổng & Trao đổi sinh viên",
        "Thực tập tốt nghiệp quốc tế",
        "Khóa học ngắn hạn chuyên ngành",
      ],
    },
    {
      title: "Đào tạo Ngắn hạn",
      icon: <BookOpen className="w-6 h-6" />,
      items: [
        "Chứng chỉ quốc tế",
        "Bồi dưỡng ngoại ngữ",
        "Chương trình Study-tour (Tham quan học tập)",
      ],
    },
    {
      title: "Nghiên cứu & Công nghệ",
      icon: <Microscope className="w-6 h-6" />,
      items: [
        "Dự án hợp tác nước ngoài",
        "Chuyển giao công nghệ",
        "Tư vấn kinh tế cho doanh nghiệp",
      ],
    },
  ];

  return (
    <div className="bg-white font-sans text-slate-900">
      {/* Hero Section - Giới thiệu chung */}
      <section className="relative h-75 md:h-100 flex items-center justify-center text-white bg-[url('/banner_header.png')] bg-cover bg-center">
        {/* Lớp Overlay tối: Giúp chữ nổi bật tuyệt đối trên mọi nền ảnh */}
        <div className="absolute inset-0 bg-black/50 md:bg-black/40 shadow-inner"></div>

        {/* Nội dung */}
        <div className="relative z-10 text-center px-4">
          <h1 className="text-3xl md:text-5xl font-bold leading-tight max-w-4xl">
            Trung tâm Đào tạo, Hợp tác Quốc tế <br />& Phát triển Nguồn nhân lực
            ASIA
          </h1>

          {/* Đường kẻ phân cách nhỏ */}
          <div className="w-20 h-1 bg-school-blue-700 mx-auto mb-4 rounded-full"></div>
        </div>
      </section>
      {/* Intro & Functions */}
      <section className="py-16 container mx-auto px-6">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold text-blue-900 mb-4 flex items-center">
              <div className="w-2 h-8 bg-blue-600 mr-3"></div>
              Về Chúng Tôi
            </h2>
            <p className="text-slate-600 leading-relaxed italic">
              Đơn vị chiến lược thuộc trường Trung cấp Kinh tế Kỹ thuật Trần Đại
              Nghĩa, đóng vai trò cầu nối đưa tri thức Việt vươn tầm thế giới.
            </p>
            <div className="mt-8 rounded-2xl overflow-hidden border border-slate-200">
              <img
                src="/banner_header.png"
                alt="International Collaboration"
                className="w-full h-48 object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
            {functions.map((func, index) => (
              <div
                key={index}
                className="bg-blue-50 p-8 rounded-2xl flex flex-col justify-center border-b-4 border-blue-600"
              >
                <div className="text-blue-600 mb-4 font-bold text-lg uppercase tracking-wider">
                  Chức năng {index + 1}
                </div>
                <p className="text-slate-800 font-medium leading-relaxed">
                  {func}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Missions Grid */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-slate-800 uppercase tracking-tight">
                Nhiệm vụ trọng tâm
              </h2>
              <p className="text-blue-600 font-medium">
                Đa dạng hóa lộ trình phát triển cho học viên
              </p>
            </div>
            <div className="h-px flex-1 bg-slate-200 mx-8 hidden md:block"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {missionGroups.map((mission, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group"
              >
                <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  {mission.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-4">
                  {mission.title}
                </h3>
                <ul className="space-y-3">
                  {mission.items.map((item, idx) => (
                    <li
                      key={idx}
                      className="text-slate-600 text-sm flex items-start"
                    >
                      <span className="text-blue-500 mr-2">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Call to Action - Tư vấn du học */}
      <section className="py-20 container mx-auto px-6 text-center">
        <div className="max-w-3xl mx-auto bg-blue-900 rounded-3xl p-10 text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Bạn đang tìm kiếm cơ hội học tập quốc tế?
            </h2>
            <p className="text-blue-100 mb-8 opacity-90">
              ASIA Center cung cấp đầy đủ thông tin về học bổng, các khóa học
              ngắn hạn và trao đổi sinh viên tại nhiều quốc gia.
            </p>
            <button className="bg-white text-blue-900 px-8 py-3 rounded-full font-bold hover:bg-blue-50 transition-colors uppercase text-sm tracking-widest">
              Liên hệ tư vấn ngay
            </button>
          </div>
          {/* Decorative circles */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-800 rounded-full opacity-50"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-700 rounded-full opacity-50"></div>
        </div>
      </section>
    </div>
  );
};

export default HopTacQuocTe;
