import {
  BookOpen,
  Award,
  CheckCircle,
  GraduationCap,
  Briefcase,
  ShieldCheck,
  MapPin,
  Users,
  Building,
} from "lucide-react";

const GioiThieuVeTruong = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* 1. Hero Section: Chiếm trọn màn hình (trừ khoảng header ~80px) */}
      <section className="relative min-h-[calc(100vh-138px)] flex items-center justify-center text-white bg-[url('/trandainghia_anh1.jpg')] bg-cover bg-center">
        {/* Lớp Overlay tối giúp nổi bật chữ */}
        <div className="absolute inset-0 bg-black/60 shadow-inner"></div>

        {/* Nội dung Banner */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <span className="bg-red-600 text-white text-xs md:text-sm font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-4 inline-block shadow-md">
            Hơn 15 Năm Uy Tín & Phát Triển
          </span>
          <h1 className="text-3xl md:text-6xl font-extrabold mb-4 uppercase tracking-wider drop-shadow-xl leading-tight">
            Trường Trung cấp Kinh tế – Kỹ thuật{" "}
            <br className="hidden md:inline" />
            <span className="text-yellow-400">Trần Đại Nghĩa</span>
          </h1>

          <div className="w-24 h-1.5 bg-yellow-400 mx-auto mb-6 rounded-full"></div>

          <p className="text-base md:text-xl font-light tracking-wide opacity-95 drop-shadow-md max-w-2xl mx-auto mb-8">
            "Môi trường học tập hiện đại, uy tín hàng đầu tại Khánh Hòa, kiến
            tạo tương lai vững chắc cho học sinh sinh viên."
          </p>

          <div className="inline-flex flex-col md:flex-row items-center justify-center gap-4 text-sm md:text-base bg-black/30 backdrop-blur-sm p-4 rounded-xl border border-white/10">
            <span className="flex items-center gap-2">
              <MapPin size={18} className="text-red-400 flex-shrink-0" />
              1028 đường 2/4, phường Vĩnh Phước, TP. Nha Trang, tỉnh Khánh Hòa
            </span>
          </div>
        </div>
      </section>

      {/* 2. Lịch sử hình thành & Pháp lý */}
      <section className="py-20 container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="lg:w-1/2 space-y-6">
            <div className="inline-block bg-blue-50 text-blue-800 text-xs font-bold px-3 py-1 rounded uppercase">
              Tổng quan về trường
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 border-l-4 border-red-500 pl-4 uppercase">
              Lịch sử hình thành & Pháp lý
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed text-justify">
              <p>
                Trường Trung cấp Kinh tế Kỹ thuật Trần Đại Nghĩa (Viết tắt:{" "}
                <strong>TDN</strong>) được thành lập theo Quyết định số{" "}
                <strong>2154/QĐ-UBND</strong> ngày 28 tháng 08 năm 2008 của UBND
                tỉnh Khánh Hòa. Trụ sở chính của nhà trường đóng tại vị trí đắc
                địa số 1028 đường 2/4, phường Vĩnh Phước, TP. Nha Trang.
              </p>
              <p>
                Kể từ ngày 01/3/2017, theo quy định của Luật Giáo dục nghề
                nghiệp và Quyết định của UBND tỉnh Khánh Hòa, trường chính thức
                trực thuộc{" "}
                <strong>
                  Sở Lao động – Thương binh và Xã hội tỉnh Khánh Hòa
                </strong>
                .
              </p>
              <p>
                Hiện nay, nhà trường đang tổ chức và hoạt động nghiêm túc theo
                Điều lệ trường trung cấp được ban hành tại{" "}
                <strong>Thông tư số 14/2021/TT-BLĐTBXH</strong> ngày 21/10/2021
                của Bộ Lao động – Thương binh và Xã hội, đảm bảo mọi tiêu chuẩn
                khắt khe về chất lượng giảng dạy quốc gia.
              </p>
            </div>
          </div>
          <div className="lg:w-1/2 relative w-full">
            <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-100">
              <img
                src="/trandainghia_anh1.jpg"
                alt="Trụ sở trường Trần Đại Nghĩa"
                className="w-full h-72 md:h-96 object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-blue-900 text-white p-6 rounded-xl hidden md:block shadow-xl max-w-xs border border-blue-800">
              <p className="text-sm opacity-80 uppercase font-bold tracking-wider mb-1">
                Mục tiêu chiến lược
              </p>
              <p className="text-base font-medium italic">
                "Xây dựng môi trường học tập hiện đại, theo tiêu chuẩn quốc tế
                tạo điều kiện để sinh viên phát triển toàn diện."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Thống kê & Cam kết Đơn đặt hàng Doanh nghiệp */}
      <section className="py-12 bg-blue-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <p className="text-4xl md:text-5xl font-extrabold text-yellow-400">
                15+
              </p>
              <p className="text-sm md:text-base font-medium opacity-90">
                Năm uy tín đào tạo nghề
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl md:text-5xl font-extrabold text-yellow-400">
                &gt; 90%
              </p>
              <p className="text-sm md:text-base font-medium opacity-90">
                Sinh viên có việc làm sau tốt nghiệp
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl md:text-5xl font-extrabold text-yellow-400">
                &gt; 63%
              </p>
              <p className="text-sm md:text-base font-medium opacity-90">
                Sinh viên có việc làm khi đang học
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl md:text-5xl font-extrabold text-yellow-400">
                100%
              </p>
              <p className="text-sm md:text-base font-medium opacity-90">
                Cam kết đạt chuẩn đầu ra
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Hệ thống Ngành nghề đào tạo */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 uppercase tracking-wide">
              Hệ thống ngành nghề đào tạo
            </h2>
            <p className="text-gray-600 mt-3 text-base">
              Đơn vị dẫn đầu khối trung cấp, cao đẳng trong tỉnh về đào tạo, bồi
              dưỡng nguồn lao động chất lượng cao gắn liền với thị trường việc
              làm.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Khối 1: Ngành Trung cấp chủ lực & Mở rộng */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all border-t-4 border-blue-600 flex flex-col justify-between">
              <div>
                <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                  <GraduationCap className="text-blue-600" size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2 text-blue-900">
                  Hệ Trung cấp Chính quy
                </h3>
                <p className="text-xs text-red-600 font-bold uppercase mb-4">
                  Ngành chủ lực: Hướng dẫn Du lịch & Kế toán doanh nghiệp
                </p>
                <ul className="space-y-2.5 text-gray-600 text-sm">
                  <li className="flex items-start gap-2">
                    ✔ Điện công nghiệp và dân dụng
                  </li>
                  <li className="flex items-start gap-2">
                    ✔ Kế toán doanh nghiệp / Kế toán tin học
                  </li>
                  <li className="flex items-start gap-2">
                    ✔ Tài chính – Ngân hàng
                  </li>
                  <li className="flex items-start gap-2">✔ Tin học ứng dụng</li>
                  <li className="flex items-start gap-2">
                    ✔ Công nghệ kỹ thuật điện, điện tử
                  </li>
                  <li className="flex items-start gap-2">
                    ✔ Nghiệp vụ khách sạn
                  </li>
                </ul>
              </div>

              {/* Phân khúc đặc biệt bổ sung từ dữ liệu gốc */}
              <div className="mt-6 pt-4 border-t border-gray-100 bg-red-50/50 p-3 rounded-lg">
                <p className="text-xs font-bold text-red-800 mb-1">
                  ⭐ Chỉ tiêu mở rộng (Xét tuyển đặc biệt):
                </p>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Dành riêng chỉ tiêu cho các em{" "}
                  <strong>không đủ điểm tốt nghiệp THPT</strong> với các ngành:
                  Hướng dẫn du lịch, Tin học ứng dụng, Tiếng Anh.
                </p>
              </div>
            </div>

            {/* Khối 2: Sơ cấp & Đào tạo ngắn hạn dưới 3 tháng */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all border-t-4 border-red-500">
              <div className="bg-red-100 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                <BookOpen className="text-red-600" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-4 text-red-900">
                Sơ cấp & Ngắn hạn (&lt; 3 tháng)
              </h3>
              <ul className="space-y-2.5 text-gray-600 text-sm">
                <li className="flex items-center gap-2">
                  ▪ Nghiệp vụ buồng phòng khách sạn
                </li>
                <li className="flex items-center gap-2">
                  ▪ Phục vụ Nhà hàng / Nghiệp vụ Bếp
                </li>
                <li className="flex items-center gap-2">
                  ▪ Nghiệp vụ Pha chế / Nghiệp vụ Lễ tân
                </li>
                <li className="flex items-center gap-2">
                  ▪ Quản lý Nhà hàng Khách sạn
                </li>
                <li className="flex items-center gap-2">▪ An ninh Khách sạn</li>
                <li className="flex items-center gap-2">
                  ▪ Kế toán doanh nghiệp ngắn hạn
                </li>
                <li className="flex items-center gap-2">
                  ▪ Quản trị mạng máy tính
                </li>
                <li className="flex items-center gap-2">
                  ▪ Lắp ráp, cài đặt, sửa chữa máy tính
                </li>
              </ul>
            </div>

            {/* Khối 3: Liên kết Đào tạo Liên thông */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all border-t-4 border-yellow-500 flex flex-col justify-between">
              <div>
                <div className="bg-yellow-100 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                  <Award className="text-yellow-700" size={24} />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">
                  Liên kết Đào tạo Liên thông
                </h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  Nhà trường mở rộng liên kết đào tạo liên thông từ xa với các
                  đại học lớn uy tín quốc gia, giúp học sinh mở rộng con đường
                  học vấn lên Cao đẳng, Đại học:
                </p>
                <ul className="space-y-3 text-gray-700 text-sm font-medium">
                  <li className="flex items-center gap-2 text-blue-800">
                    <CheckCircle size={16} className="text-yellow-600" /> Đại
                    học Mở Hà Nội
                  </li>
                  <li className="flex items-center gap-2 text-blue-800">
                    <CheckCircle size={16} className="text-yellow-600" /> Đại
                    học Mỏ Địa Chất
                  </li>
                </ul>
              </div>
              <div className="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-100 text-xs text-yellow-800 leading-relaxed">
                Phương thức học linh hoạt giúp tối ưu thời gian, vừa đi làm tại
                doanh nghiệp vừa nâng cao bằng cấp dễ dàng.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Đào tạo gắn liền việc làm & Mạng lưới Đối tác Khách sạn 5 sao */}
      <section className="py-20 container mx-auto px-4">
        <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-3xl overflow-hidden p-8 md:p-12 shadow-2xl">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-1/2 space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-yellow-400">
                Cam kết Đào tạo gắn liền với việc làm
              </h2>
              <p className="opacity-90 leading-relaxed text-justify text-sm md:text-base">
                Với đội ngũ giáo viên có trình độ chuyên môn cao, uy tín và
                nhiều năm kinh nghiệm, nhà trường đang từng bước kết nối chặt
                chẽ với doanh nghiệp theo mô hình{" "}
                <strong>“đơn đặt hàng” nguồn nhân lực</strong>.
              </p>
              <p className="opacity-90 leading-relaxed text-justify text-sm md:text-base">
                Sự thừa nhận tay nghề học sinh từ các cơ quan đơn vị, doanh
                nghiệp lớn chính là nền tảng cốt lõi giúp TDN khẳng định vị thế
                vị trí, thương hiệu dẫn đầu khối giáo dục nghề nghiệp tỉnh nhà.
                Hiện tại trường đã thiết lập quan hệ đối tác chiến lược thân hữu
                sâu rộng, bảo đảm cơ sở thực tập thực tế chất lượng cao đẳng cấp
                quốc tế cho toàn bộ học sinh sinh viên.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="flex items-center gap-3">
                  <ShieldCheck
                    className="text-yellow-400 flex-shrink-0"
                    size={20}
                  />
                  <span className="text-sm font-medium">
                    Đội ngũ chuyên gia dày dặn kinh nghiệm
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Briefcase
                    className="text-yellow-400 flex-shrink-0"
                    size={20}
                  />
                  <span className="text-sm font-medium">
                    Đào tạo chuẩn theo nhu cầu thị trường
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="text-yellow-400 flex-shrink-0" size={20} />
                  <span className="text-sm font-medium">
                    90% Đầu ra sinh viên có việc làm ngay
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Building
                    className="text-yellow-400 flex-shrink-0"
                    size={20}
                  />
                  <span className="text-sm font-medium">
                    Môi trường thực hành chuẩn quốc tế
                  </span>
                </div>
              </div>
            </div>

            {/* Danh sách Khách sạn Đối tác Đẳng cấp */}
            <div className="lg:w-1/2 w-full bg-white/5 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-white/10 space-y-6">
              <h4 className="text-lg font-bold uppercase tracking-wider text-center text-white border-b border-white/20 pb-3">
                Mạng lưới Đối tác Đẳng cấp chiến lược
              </h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl hover:bg-black/30 transition-colors">
                  <div className="font-semibold text-base">Resort Duyên Hà</div>
                  <div className="text-xs font-bold text-yellow-400 bg-yellow-400/10 px-2.5 py-1 rounded border border-yellow-400/20">
                    ⭐⭐⭐⭐⭐ 5 SAO
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl hover:bg-black/30 transition-colors">
                  <div className="font-semibold text-base">
                    Khách sạn Boton (Boton Blue)
                  </div>
                  <div className="text-xs font-bold text-yellow-400 bg-yellow-400/10 px-2.5 py-1 rounded border border-yellow-400/20">
                    ⭐⭐⭐⭐⭐ 5 SAO
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl hover:bg-black/30 transition-colors">
                  <div className="font-semibold text-base">
                    Khách sạn Annova
                  </div>
                  <div className="text-xs font-bold text-yellow-400 bg-yellow-400/10 px-2.5 py-1 rounded border border-yellow-400/20">
                    ⭐⭐⭐⭐⭐ 5 SAO
                  </div>
                </div>
              </div>
              <p className="text-center text-xs opacity-70 italic">
                ... cùng hàng loạt hệ thống nhà hàng, công ty lữ hành và tập
                đoàn kinh tế lớn trên cả nước.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GioiThieuVeTruong;
