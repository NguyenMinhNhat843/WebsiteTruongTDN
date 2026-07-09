import { Building, Monitor, Briefcase, BedDouble, Award } from "lucide-react";

// Dữ liệu sơ đồ các tầng tại cơ sở Lê Lợi
const floorData = [
  {
    floor: "Tầng 1",
    desc: "Phòng thực hành nghiệp vụ Lễ tân chuyên nghiệp",
    Icon: Building,
  },
  {
    floor: "Tầng 2",
    desc: "02 Phòng học lý thuyết & 01 Phòng thực hành (Tin học / Tiếng Anh)",
    Icon: Monitor,
  },
  {
    floor: "Tầng 3",
    desc: "02 Phòng học lý thuyết & 01 Phòng thực hành (Tin học / Tiếng Anh)",
    Icon: Monitor,
  },
  {
    floor: "Tầng 4",
    desc: "02 Phòng học lý thuyết & 01 Phòng thực hành (Tin học / Tiếng Anh)",
    Icon: Monitor,
  },
  {
    floor: "Tầng 5",
    desc: "Khu hành chính: Phòng Ban Giám Hiệu, Phòng Đào tạo, Phòng Hành chính, Phòng Giảng viên, Phòng Chiêu sinh",
    Icon: Briefcase,
  },
  {
    floor: "Tầng 6",
    desc: "05 Phòng thực hành nghiệp vụ Buồng phòng đạt chuẩn",
    Icon: BedDouble,
  },
  {
    floor: "Tầng 9",
    desc: "Phòng Hội trường lớn phục vụ hội nghị và sự kiện",
    Icon: Award,
  },
];

// Mảng chứa các đường dẫn ảnh cơ sở vật chất (Ảnh nằm trong /public/CoSoVatChat/)
const imageSources = [
  "/CoSoVatChat/trandainghia_cosovatchat_anh1.jpg",
  "/CoSoVatChat/trandainghia_cosovatchat_anh2.jpg",
  "/CoSoVatChat/trandainghia_cosovatchat_anh3.jpg",
  "/CoSoVatChat/trandainghia_cosovatchat_anh4.jpg",
  "/CoSoVatChat/trandainghia_cosovatchat_anh5.jpg",
  "/CoSoVatChat/trandainghia_cosovatchat_anh6.jpg",
  "/CoSoVatChat/trandainghia_cosovatchat_anh7.jpg",
  "/CoSoVatChat/trandainghia_cosovatchat_anh8.jpg",
  "/CoSoVatChat/trandainghia_cosovatchat_anh9.jpg",
];

export default function CoSoVatChat() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* SECTION 1: HERO BANNER */}
      <section className="relative bg-gradient-to-r from-blue-900 to-indigo-900 text-white py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <span className="text-amber-400 font-semibold tracking-wider uppercase text-sm block mb-3">
            Học tập trong môi trường hiện đại
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            CƠ SỞ VẬT CHẤT & TRANG THIẾT BỊ
          </h1>
          <p className="max-w-3xl mx-auto text-blue-100 text-lg leading-relaxed">
            Trường Trung cấp Kinh tế – Kỹ thuật Trần Đại Nghĩa tự hào sở hữu
            không gian đào tạo khang trang, đầy đủ trang thiết bị thực hành
            chuẩn quy trình nghề, giúp sinh viên vững tay nghề ngay từ khi còn
            ngồi trên ghế nhà trường.
          </p>
        </div>
      </section>

      {/* SECTION 2: TỔNG QUAN GIỚI THIỆU */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-slate-100 -mt-24 relative z-20">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-blue-950 mb-6 relative pb-3 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-1 after:bg-amber-500">
                Không Gian Đào Tạo Đạt Chuẩn
              </h2>
              <p className="text-slate-600 mb-4 leading-relaxed">
                Trường được đầu tư đồng bộ hệ thống phòng học lý thuyết và phòng
                thực hành chuyên biệt (tiếp tân, buồng phòng, phòng máy...). Tất
                cả đều tích hợp đầy đủ trang thiết bị giảng dạy tiên tiến theo
                từng nghiệp vụ chuyên môn riêng.
              </p>
              <div className="space-y-3 mt-6">
                <div className="flex items-start space-x-3">
                  <span className="text-emerald-500 mt-1">✔</span>
                  <p className="text-slate-700 font-medium">
                    Phòng thực hành mô phỏng 100% không gian doanh nghiệp thực
                    tế.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-emerald-500 mt-1">✔</span>
                  <p className="text-slate-700 font-medium">
                    Hệ thống máy tính, phòng ngoại ngữ trang bị mới hoàn toàn.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-emerald-500 mt-1">✔</span>
                  <p className="text-slate-700 font-medium">
                    Vị trí giao thông thuận tiện tại trung tâm tỉnh Khánh Hòa.
                  </p>
                </div>
              </div>
            </div>

            {/* Khối chọn hệ thống cơ sở */}
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <h3 className="text-lg font-bold text-blue-950 mb-4">
                Hệ thống các cơ sở đào tạo:
              </h3>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-600">
                  <h4 className="font-bold text-blue-900">
                    Cơ sở Trung tâm thực hành
                  </h4>
                  <p className="text-sm text-slate-600">
                    Số 25 Lê Lợi, Phường Xương Huân, TP. Nha Trang, Tỉnh Khánh
                    Hòa
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-amber-500">
                  <h4 className="font-bold text-amber-700">Cơ sở Cam Ranh</h4>
                  <p className="text-sm text-slate-600">
                    Số 198 Đường 22/8, Tổ dân phố Thuận Phát, Phường Cam Ranh,
                    Tỉnh Khánh Hòa
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: SƠ ĐỒ CHI TIẾT CÁC TẦNG (Cơ sở chính Lê Lợi) */}
      <section className="bg-slate-100 py-16 px-4">
        <div className="max-w-[90rem] mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-950 mb-4">
              Cấu Trúc Các Tầng Đào Tạo
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Sơ đồ bố trí khoa học tại Cơ sở 25 Lê Lợi giúp tối ưu hóa công
              năng giảng dạy lý thuyết và thực hành nghiệp vụ.
            </p>
          </div>

          {/* Một hàng duy nhất trên PC (7 cột), tự động chuyển thành 2 hoặc 1 cột trên Mobile/Tablet */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4 items-stretch">
            {floorData.map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-5 rounded-2xl shadow-md border-t-4 border-blue-600 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col text-center md:text-left h-full"
              >
                {/* Tiêu đề Tầng */}
                <h3 className="text-xl font-bold text-slate-900 mb-4 pt-2">
                  {item.floor}
                </h3>

                {/* Nội dung mô tả - dùng flex-grow giúp các card có độ cao bằng nhau tăm tắp */}
                <p className="text-sm text-slate-500 leading-relaxed flex-grow">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: THƯ VIỆN HÌNH ẢNH (9 ảnh thực tế) */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-blue-950 mb-4">
            Hình Ảnh Thực Tế Tại Trường
          </h2>
          <p className="text-slate-600">
            Cận cảnh không gian học tập trực quan sinh động của sinh viên Trần
            Đại Nghĩa
          </p>
        </div>

        {/* Lưới chứa 9 hình ảnh thực tế */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {imageSources.map((src, index) => (
            <div
              key={index}
              className="group relative bg-slate-200 aspect-[4/3] rounded-xl overflow-hidden shadow-md border border-slate-300 transition-all duration-300"
            >
              {/* Hiển thị hình ảnh thực tế */}
              <img
                src={src}
                alt={`Cơ sở vật chất Trần Đại Nghĩa - Hình ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Lớp Overlay phủ khi Hover tạo hiệu ứng cao cấp */}
              <div className="absolute inset-0 bg-gradient-to-t from-blue-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <span className="text-white text-sm font-medium tracking-wide">
                  Trường TC KT-KT Trần Đại Nghĩa
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
