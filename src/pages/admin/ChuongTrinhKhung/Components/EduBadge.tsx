import { EDU_SYSTEM_META } from "../chuongTrinhKhung.constant";
import type { EduSystem } from "../chuongTrinhKhung.type";

export function EduBadge({ sys }: { sys: EduSystem }) {
  const m = EDU_SYSTEM_META[sys];
  return (
    <span
      className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black border ${m.bg} ${m.color} ${m.border}`}
    >
      {m.short} · {m.label}
    </span>
  );
}
