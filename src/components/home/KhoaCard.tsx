import { danhSachKhoa } from "./DaoTaoDataTemplate";

interface KhoaCardProps {
  tenKhoa: string;
  anh: string;
  nganh: string[];
}

function KhoaCard({ tenKhoa, anh, nganh }: KhoaCardProps) {
  return (
    <div className="group flex flex-col rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 border border-slate-100">
      {/* Container Ảnh */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={anh}
          alt={tenKhoa}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        {/* Overlay mờ để nổi bật chữ nếu cần */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent" />
      </div>

      {/* Nội dung Card */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-sm font-black text-blue-800 uppercase tracking-wider leading-tight">
          {tenKhoa}
        </h3>

        {/* Divider trang trí */}
        <div className="w-10 h-1 bg-amber-400 rounded-full my-4 group-hover:w-16 transition-all duration-300" />

        <ul className="flex-1 space-y-2.5">
          {nganh.map((n, i) => (
            <a
              key={i}
              className="flex items-start gap-3 text-slate-600 leading-relaxed"
            >
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500" />
              {n}
            </a>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function KhoaDaoTaoSection() {
  return (
    <section className="bg-slate-50 py-20 px-6 font-['Be_Vietnam_Pro']">
      {/* Header Section */}
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight italic">
          <span className="text-blue-900">Chương trình </span>
          <span className="text-blue-700">Đào Tạo</span>
        </h2>

        {/* Line trang trí kiểu giáo dục */}
        <div className="flex items-center justify-center gap-2 mt-4">
          <div className="h-1 w-12 bg-blue-900 rounded-full" />
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <div className="h-1 w-12 bg-blue-700 rounded-full" />
        </div>

        <p className="mt-6 text-slate-500 text-sm md:text-base max-w-xl mx-auto font-medium">
          Hệ thống ngành nghề đa dạng, chú trọng thực hành và kỹ năng chuyên
          sâu, đáp ứng tiêu chuẩn tuyển dụng khắt khe nhất.
        </p>
      </div>

      {/* Grid danh sách khoa */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {danhSachKhoa.map((k) => (
          <KhoaCard key={k.tenKhoa} {...k} />
        ))}
      </div>
    </section>
  );
}
