import { Target, Users, Gem, CheckCircle2 } from "lucide-react";

const VisionMissionPage = () => {
  return (
    <div className="bg-slate-50 font-sans text-slate-900 min-h-screen">
      {/* 1. Hero Section - Full màn hình trừ 138px Header */}
      <section className="relative min-h-[calc(100vh-138px)] flex items-center justify-center text-white bg-[url('/trandainghia_anh1.jpg')] bg-cover bg-center">
        {/* Lớp Overlay tối: Giúp chữ nổi bật tuyệt đối */}
        <div className="absolute inset-0 bg-black/60 shadow-inner"></div>

        {/* Nội dung Banner */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 uppercase tracking-wider drop-shadow-xl">
            Tầm Nhìn & Sứ Mệnh
          </h1>
          {/* Đường kẻ phân cách nhỏ */}
          <div className="w-24 h-1.5 bg-yellow-400 mx-auto mb-6 rounded-full"></div>
          <p className="text-slate-200 text-lg md:text-xl font-light tracking-wide max-w-2xl mx-auto italic drop-shadow-md">
            "Chất lượng vàng – Niềm tin vàng" <br /> Đào tạo gắn liền với nền
            móng sự nghiệp vững chắc tương lai.
          </p>
        </div>
      </section>

      {/* 2. Main Content - 3 Cards Cân Bằng Đồng Bộ */}
      <section className="py-20 container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {/* CARD 1: SỨ MẠNG */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col border border-slate-100">
            <div className="h-48 overflow-hidden relative">
              <img
                src="/trandainghia_sumenh.png"
                alt="Sứ mệnh Trần Đại Nghĩa"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 bg-blue-600 text-white p-2.5 rounded-xl shadow-lg">
                <Users className="w-6 h-6" />
              </div>
            </div>
            <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-bold text-blue-900 uppercase tracking-wide mb-4 pb-2 border-b border-slate-100">
                  Sứ Mạng Giáo Dục
                </h2>
                <p className="text-slate-600 text-sm leading-relaxed text-justify mb-5">
                  Sứ mệnh cốt lõi của Trần Đại Nghĩa là giúp người học tự xây
                  dựng một nền móng vững chắc lâu dài cho sự nghiệp thông qua
                  các cam kết hành động cụ thể:
                </p>

                {/* List nội dung dưới của Card 1 */}
                <ul className="space-y-3 pt-1 border-t border-slate-50">
                  <li className="flex items-start gap-2.5 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Nghiệp vụ tiên tiến:</strong> Tiếp cận và làm chủ
                      những kỹ năng nghề nghiệp mới nhất hiện nay.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Nền tảng sâu sắc:</strong> Trang bị hệ thống lý
                      luận vững chắc hỗ trợ học viên thăng tiến dài hạn.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Sức cạnh tranh cao:</strong> Đảm bảo năng lực
                      thích ứng cao, không lo bị đào thải trong nền kinh tế số.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* CARD 2: TẦM NHÌN */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col border border-slate-100">
            <div className="h-48 overflow-hidden relative">
              <img
                src="/trandainghia_tamnhin.png"
                alt="Tầm nhìn Trần Đại Nghĩa"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 bg-emerald-600 text-white p-2.5 rounded-xl shadow-lg">
                <Target className="w-6 h-6" />
              </div>
            </div>
            <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-bold text-emerald-700 uppercase tracking-wide mb-4 pb-2 border-b border-slate-100">
                  Tầm Nhìn Chiến Lược
                </h2>
                <p className="text-slate-600 text-sm leading-relaxed text-justify mb-5">
                  Nhà trường nỗ lực khẳng định niềm tin sâu sắc từ học viên và
                  phụ huynh, hướng tới mục tiêu xây dựng thương hiệu giáo dục
                  nghề nghiệp hàng đầu:
                </p>

                {/* List nội dung dưới của Card 2 */}
                <ul className="space-y-3 pt-1 border-t border-slate-50">
                  <li className="flex items-start gap-2.5 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Chất lượng hàng đầu:</strong> Đặt ưu tiên tối cao
                      cho việc cải tiến liên tục sản phẩm dịch vụ đào tạo.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Tiên phong Du lịch - Nhà hàng:</strong> Tập trung
                      dẫn đầu khối ngành Du lịch – Khách sạn – Nhà hàng – Bếp.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Phát triển kỹ năng:</strong> Biến Trần Đại Nghĩa
                      thành điểm đến lý tưởng để trau dồi tay nghề thực tế.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* CARD 3: GIÁ TRỊ CỐT LÕI */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col border border-slate-100">
            <div className="h-48 overflow-hidden relative">
              <img
                src="/trandainghia_giatri.png"
                alt="Giá trị cốt lõi Trần Đại Nghĩa"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 bg-amber-500 text-white p-2.5 rounded-xl shadow-lg">
                <Gem className="w-6 h-6" />
              </div>
            </div>
            <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-bold text-amber-600 uppercase tracking-wide mb-4 pb-2 border-b border-slate-100">
                  Giá Trị Cốt Lõi
                </h2>
                <p className="text-slate-600 text-sm leading-relaxed text-justify mb-5">
                  Mọi hoạt động tại Trần Đại Nghĩa đều xoay quanh trục giá trị
                  nhân văn và phát triển bền vững, nhằm kiến tạo môi trường học
                  đường chất lượng cao:
                </p>

                {/* List nội dung dưới của Card 3 */}
                <ul className="space-y-3 pt-1 border-t border-slate-50">
                  <li className="flex items-start gap-2.5 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Sinh viên là trọng tâm:</strong> Mọi lợi ích và sự
                      thành công của người học luôn là kim chỉ nam.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Đổi mới và sáng tạo:</strong> Liên tục nghiên cứu
                      cải tiến phương pháp giảng dạy để luôn dẫn đầu.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Cộng tác & Xuất sắc:</strong> Kết nối doanh nghiệp
                      chặt chẽ kết hợp đội ngũ cán bộ giảng viên giỏi nghề.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VisionMissionPage;
