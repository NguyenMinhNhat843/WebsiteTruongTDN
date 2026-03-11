interface Nganh {
  label: string;
  slug: string;
}

interface KhoaCardProps {
  tenKhoa: string;
  anh: string;
  nganh: Nganh[];
}

export default function KhoaCard({ tenKhoa, anh, nganh }: KhoaCardProps) {
  return (
    <div className="group flex flex-col rounded-2xl overflow-hidden bg-white shadow-sm border border-slate-100">
      {/* Container Ảnh */}
      <div className="relative h-52 overflow-hidden">
        <img src={anh} alt={tenKhoa} className="w-full h-full object-cover" />
        {/* Overlay mờ để nổi bật chữ nếu cần */}
        <div className="absolute inset-0 bg-linear-to-t from-blue-900/40 to-transparent" />
      </div>

      {/* Nội dung Card */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-sm font-black text-blue-800 uppercase tracking-wider leading-tight">
          {tenKhoa}
        </h3>

        {/* Divider trang trí */}
        <div className="w-10 h-1 bg-amber-400 rounded-full my-4" />

        <ul className="flex-1">
          {nganh.map((n, i) => (
            <li key={i}>
              <a
                href={`/${n.slug}`}
                className="group/item flex items-start gap-3 py-2 text-slate-600 transition-all duration-300 ease-in-out hover:text-blue-700 hover:translate-x-1"
              >
                <span className="relative mt-2.5 flex h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500 transition-all duration-300 group-hover/item:w-4 group-hover/item:rounded-sm" />
                <div className="relative">
                  <span className="block leading-relaxed">{n.label}</span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
