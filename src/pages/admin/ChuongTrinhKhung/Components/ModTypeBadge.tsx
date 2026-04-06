import { MODULE_TYPE_META } from "../chuongTrinhKhung.constant";
import type { ModuleType } from "../chuongTrinhKhung.type";

export function ModTypeBadge({ type }: { type: ModuleType }) {
  const m = MODULE_TYPE_META[type];
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${m.color}`}
    >
      {m.label}
    </span>
  );
}
