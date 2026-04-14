import { MODULE_TYPE_META, UNIT_LABEL } from "../../chuongTrinhKhung.constant";
import type { ModuleType } from "../../chuongTrinhKhung.type";
import { useChuongTrinhKhungContext } from "../../ChuongTrinhKhungProvider";

const Label = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[11px] font-black text-slate-600 uppercase tracking-widest mb-3">
    {children}
  </p>
);

const Overview = () => {
  const { selected, breakdown, hrs } = useChuongTrinhKhungContext();
  if (!selected || !breakdown) return null;

  const unit = UNIT_LABEL[selected.unitType];

  return (
    <div className="p-5 space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { l: `Tổng ${unit}`, v: selected.totalUnits },
          { l: "Thời gian", v: selected.duration },
          { l: "Tổng giờ (LT+TH)", v: `${hrs}h` },
          { l: "Học kỳ / Giai đoạn", v: selected.terms.length },
        ].map((s, i) => (
          <div
            key={i}
            className="bg-slate-50 rounded-xl p-3 text-center border border-slate-200"
          >
            <p className="text-lg font-black text-slate-800">{s.v}</p>
            <p className="text-[10px] text-slate-400 font-semibold uppercase">
              {s.l}
            </p>
          </div>
        ))}
      </div>

      {/* Volume Breakdown */}
      <div>
        <Label>Phân bổ khối lượng theo loại</Label>
        <div className="space-y-2.5">
          {(Object.keys(MODULE_TYPE_META) as ModuleType[]).map((t) => {
            const val = breakdown[t];
            if (!val) return null;
            const pct = Math.round((val / (selected.totalUnits || 1)) * 100);
            const { label, color, bar } = MODULE_TYPE_META[t];

            return (
              <div key={t} className="flex items-center gap-3 text-xs">
                <span
                  className={`text-[10px] px-2 py-1 rounded font-bold w-28 text-center ${color}`}
                >
                  {label}
                </span>
                <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full transition-all ${bar}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-28 text-right font-semibold text-slate-500">
                  {val} {unit}{" "}
                  <span className="text-slate-400 font-normal">({pct}%)</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Term Map */}
      {selected.terms.length > 0 && (
        <div>
          <Label>Sơ đồ học kỳ / giai đoạn</Label>
          <div className="flex gap-2 flex-wrap text-center">
            {selected.terms.map((term) => (
              <div
                key={term.id}
                className={`rounded-xl border px-3 py-3 min-w-30 flex-1 md:flex-none border-slate-200 bg-linear-to-b from-slate-50 to-white ${term.internship ? "border-orange-200 from-orange-50" : ""}`}
              >
                <p className="text-base font-black text-slate-700">
                  {term.modules.length}
                </p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                  {term.internship ? "🏭 Thực tập" : "môn / mô-đun"}
                </p>
                <p className="text-[10px] text-slate-400 my-1 leading-tight">
                  {term.label}
                </p>
                <div className="text-xs font-black text-slate-600 pt-1.5 border-t border-slate-100">
                  {term.modules.reduce((a, m) => a + m.units, 0)}{" "}
                  <small className="font-normal text-slate-400">{unit}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-[10px] text-slate-300 border-t border-slate-100 pt-3 italic text-right">
        Lần cuối: {selected.updatedAt} (Tạo: {selected.createdAt})
      </p>
    </div>
  );
};

export default Overview;
