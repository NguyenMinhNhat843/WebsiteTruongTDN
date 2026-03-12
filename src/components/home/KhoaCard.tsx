import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface Nganh {
  label: string;
  slug: string;
}

interface KhoaCardProps {
  tenKhoa: string;
  anh: string;
  nganh: Nganh[];
  khoaSlug: string;
  description?: string;
}

export default function KhoaCard({
  tenKhoa,
  anh,
  khoaSlug,
  description,
}: KhoaCardProps) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/chuong-trinh-dao-tao/${khoaSlug}`)}
      className="group relative flex flex-col rounded-2xl overflow-hidden bg-white shadow-sm border border-slate-100 cursor-pointer hover:shadow-2xl hover:border-blue-200 transition-all duration-500 ease-out"
    >
      {/* Container Ảnh với hiệu ứng Zoom */}
      <div className="relative h-60 overflow-hidden">
        <img
          src={anh}
          alt={tenKhoa}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Overlay gradient xịn hơn */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-blue-900/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

        {/* Badge trang trí góc trên */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
          <span className="text-[10px] font-bold text-blue-900 uppercase tracking-tighter">
            Chương trình đào tạo
          </span>
        </div>
      </div>

      {/* Nội dung Card */}
      <div className="p-6 flex-1 flex flex-col relative bg-white">
        {/* Divider vàng nhỏ trang trí nằm phía trên tiêu đề */}
        <div className="w-12 h-1 bg-amber-400 rounded-full mb-4 group-hover:w-20 transition-all duration-500" />

        <h3 className="text-lg font-black text-blue-900 uppercase tracking-tight leading-tight mb-3 group-hover:text-blue-700">
          {tenKhoa}
        </h3>

        {description && (
          <p className="text-slate-500 text-sm line-clamp-2 mb-6">
            {description}
          </p>
        )}

        {/* Nút bấm giả ở dưới cùng */}
        <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-50">
          <span className="text-xs font-bold text-slate-400 group-hover:text-blue-600 uppercase tracking-widest transition-colors">
            Khám phá các ngành
          </span>
          <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
            <ArrowRight
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
