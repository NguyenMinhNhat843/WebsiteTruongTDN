// Định nghĩa danh sách tên các file ảnh logo đối tác (bạn có thể đổi tên file theo thực tế)
const partners = [
  {
    id: 1,
    name: "Doanh nghiệp đối tác 1",
    fileName: "/DoiTacTuyenDung/doitactuyendung_anh1.jpg",
  },
  {
    id: 2,
    name: "Doanh nghiệp đối tác 2",
    fileName: "/DoiTacTuyenDung/doitactuyendung_anh2.png",
  },
  {
    id: 3,
    name: "Doanh nghiệp đối tác 3",
    fileName: "/DoiTacTuyenDung/doitactuyendung_anh3.png",
  },
  {
    id: 4,
    name: "Doanh nghiệp đối tác 4",
    fileName: "/DoiTacTuyenDung/doitactuyendung_anh4.png",
  },
  {
    id: 5,
    name: "Doanh nghiệp đối tác 5",
    fileName: "/DoiTacTuyenDung/doitactuyendung_anh5.png",
  },
  {
    id: 6,
    name: "Doanh nghiệp đối tác 6",
    fileName: "/DoiTacTuyenDung/doitactuyendung_anh6.png",
  },
  {
    id: 7,
    name: "Doanh nghiệp đối tác 7",
    fileName: "/DoiTacTuyenDung/doitactuyendung_anh7.png",
  },
  {
    id: 8,
    name: "Doanh nghiệp đối tác 8",
    fileName: "/DoiTacTuyenDung/doitactuyendung_anh8.png",
  },
  {
    id: 9,
    name: "Doanh nghiệp đối tác 9",
    fileName: "/DoiTacTuyenDung/doitactuyendung_anh9.png",
  },
  {
    id: 10,
    name: "Doanh nghiệp đối tác 10",
    fileName: "/DoiTacTuyenDung/doitactuyendung_anh10.jpg",
  },
];

export default function DoiTacTuyenDung() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* SECTION 1: HERO BANNER */}
      <section className="relative bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <span className="text-amber-400 font-semibold tracking-wider uppercase text-sm block mb-3">
            Kết nối doanh nghiệp — Vững bước tương lai
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            ĐỐI TÁC ĐÀO TẠO VÀ TUYỂN DỤNG
          </h1>
          <p className="max-w-3xl mx-auto text-blue-100 text-lg leading-relaxed">
            Hợp tác chiến lược chặt chẽ giữa nhà trường và doanh nghiệp là chìa
            khóa vàng giúp mở ra cánh cửa việc làm bền vững cho sinh viên ngay
            sau khi tốt nghiệp.
          </p>
        </div>
      </section>

      {/* SECTION 2: GIỚI THIỆU CHÍNH */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-slate-100 -mt-24 relative z-20">
          <div className="grid md:grid-cols-3 gap-8 items-center">
            {/* Nội dung text chiếm 2 phần */}
            <div className="md:col-span-2">
              <h2 className="text-2xl md:text-3xl font-bold text-blue-950 mb-6 relative pb-3 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-1 after:bg-amber-500">
                Cam Kết Lộ Trình Nghề Nghiệp Bền Vững
              </h2>
              <p className="text-slate-600 mb-4 text-justify leading-relaxed">
                Trường Trung cấp Kinh tế – Kỹ thuật Trần Đại Nghĩa tập trung xây
                dựng mối quan hệ hợp tác sâu rộng với các đối tác tuyển dụng
                trọng điểm tại Khánh Hòa. Hiện nay, nhà trường đang đồng hành
                cùng hàng chục doanh nghiệp uy tín trong khu vực để tổ chức các
                hoạt động kiến tập và thực tập chuyên sâu.
              </p>
              <p className="text-slate-600 mb-4 text-justify leading-relaxed">
                Điều này giúp sinh viên không chỉ vững tay nghề mà còn có cơ hội
                tiếp cận trực tiếp với môi trường làm việc thực tế, mở ra lộ
                trình nghề nghiệp bền vững ngay tại địa phương.
              </p>
            </div>

            {/* Khối thông số nổi bật chiếm 1 phần */}
            <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white p-6 rounded-xl text-center shadow-md">
              <div className="mb-4">
                <span className="text-4xl md:text-5xl font-extrabold text-amber-400">
                  100%
                </span>
                <p className="text-sm uppercase tracking-wide text-blue-200 font-medium mt-1">
                  Sinh viên được bố trí thực tập
                </p>
              </div>
              <div className="border-t border-blue-800/60 my-4"></div>
              <div>
                <span className="text-4xl md:text-5xl font-extrabold text-amber-400">
                  50+
                </span>
                <p className="text-sm uppercase tracking-wide text-blue-200 font-medium mt-1">
                  Doanh nghiệp liên kết lớn
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: LƯỚI LOGO ĐỐI TÁC (Mỗi dòng 5 hình trên Desktop) */}
      <section className="bg-slate-100 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-950 mb-4">
              Mạng Lưới Đối Tác Chiến Lược
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Các tập đoàn, nhà hàng, khách sạn và doanh nghiệp tiêu biểu liên
              kết toàn diện cùng nhà trường
            </p>
          </div>

          {/* Lưới Logo: 2 cột trên Mobile, 3 cột trên Tablet, 5 cột trên Desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {partners.map((partner) => (
              <div
                key={partner.id}
                className="group bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-center items-center aspect-[4/3] hover:shadow-lg hover:border-blue-500 hover:-translate-y-1 transition-all duration-300"
              >
                {/* Đường dẫn hình ảnh lấy từ /public/DoiTacDaoTao/... */}
                <img
                  src={`${partner.fileName}`}
                  alt={partner.name}
                  className="max-w-full max-h-[70%] object-contain filter grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-300"
                />

                {/* Khung Text Placeholder khi chưa có hình ảnh thực tế */}
                <div className="hidden group-[.is-placeholder]:flex flex-col items-center text-center text-slate-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 mb-2 stroke-slate-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  <span className="text-xs font-semibold px-2 font-sans tracking-tight text-slate-500 line-clamp-2">
                    {partner.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: LỢI ÍCH HỢP TÁC */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-2xl md:text-3xl font-bold text-blue-950">
            Quyền Lợi Của Sinh Viên Khi Thực Tập
          </h3>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="w-12 h-12 bg-blue-100 text-blue-900 rounded-lg flex items-center justify-center font-bold text-xl mb-4">
              01
            </div>
            <h4 className="text-lg font-bold text-blue-950 mb-2">
              Cọ xát thực tế sớm
            </h4>
            <p className="text-slate-600 text-sm leading-relaxed">
              Được trực tiếp làm việc tại các nhà hàng, khách sạn lớn, áp dụng
              lý thuyết vào quy trình nghiệp vụ thực tế.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-lg flex items-center justify-center font-bold text-xl mb-4">
              02
            </div>
            <h4 className="text-lg font-bold text-blue-950 mb-2">
              Mở rộng mối quan hệ
            </h4>
            <p className="text-slate-600 text-sm leading-relaxed">
              Kết nối với các chuyên gia, quản lý cấp cao trong ngành, học hỏi
              tác phong làm việc chuẩn doanh nghiệp.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-lg flex items-center justify-center font-bold text-xl mb-4">
              03
            </div>
            <h4 className="text-lg font-bold text-blue-950 mb-2">
              Cơ hội tuyển dụng thẳng
            </h4>
            <p className="text-slate-600 text-sm leading-relaxed">
              Rất nhiều đối tác có chính sách giữ lại sinh viên có biểu hiện
              xuất sắc ngay sau kỳ thực tập kết thúc.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
