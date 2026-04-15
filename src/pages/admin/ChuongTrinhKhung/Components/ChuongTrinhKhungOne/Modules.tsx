import { UNIT_LABEL } from "../../chuongTrinhKhung.constant";
import { useChuongTrinhKhungContext } from "../../ChuongTrinhKhungProvider";
import { ModTypeBadge } from "../ModTypeBadge";

const Modules = () => {
  const { selected } = useChuongTrinhKhungContext();
  if (!selected) return null;
  return (
    <div className="p-5 space-y-5">
      {selected.terms.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <p className="text-sm">Chưa có môn học / mô-đun nào.</p>
          <p className="text-xs mt-1">
            Cần tích hợp chức năng quản lý chi tiết từng học kỳ.
          </p>
        </div>
      )}
      {selected.terms.map((term) => (
        <div key={term.id}>
          <div
            className={`flex items-center gap-3 mb-2 pb-2 border-b ${term.internship ? "border-orange-200" : "border-slate-200"}`}
          >
            <h3
              className={`text-sm font-black ${term.internship ? "text-orange-600" : "text-slate-700"}`}
            >
              {term.internship ? "🏭 " : ""}
              {term.label}
            </h3>
            <span className="text-xs text-slate-400">
              {term.modules.length} MH/MĐ
            </span>
            <span className="text-xs font-bold text-slate-600">
              {term.modules.reduce((a, m) => a + m.units, 0)}{" "}
              {UNIT_LABEL[selected.unitType]}
            </span>
            <span className="text-xs text-slate-400 ml-auto">
              LT: {term.modules.reduce((a, m) => a + m.theory, 0)}t
              &nbsp;|&nbsp; TH:{" "}
              {term.modules.reduce((a, m) => a + m.practice, 0)}t
            </span>
          </div>
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-sm min-w-150">
              <thead>
                <tr className="bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-200">
                  <th className="text-left px-3 py-2">Mã</th>
                  <th className="text-left px-3 py-2">Tên môn học / mô-đun</th>
                  <th className="text-center px-3 py-2">
                    {UNIT_LABEL[selected.unitType]}
                  </th>
                  <th className="text-center px-3 py-2">LT</th>
                  <th className="text-center px-3 py-2">TH</th>
                  <th className="text-left px-3 py-2">Loại</th>
                  <th className="text-left px-3 py-2">Tiên quyết</th>
                </tr>
              </thead>
              <tbody>
                {term.modules.map((mod, i) => (
                  <tr
                    key={mod.id}
                    className={`border-b border-slate-100 last:border-0 ${mod.isKey ? "bg-blue-50/40" : i % 2 === 1 ? "bg-slate-50/50" : ""}`}
                  >
                    <td className="px-3 py-2.5 font-mono text-[11px] font-bold text-blue-600">
                      {mod.code}
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="font-semibold text-slate-700 text-sm">
                        {mod.name}
                      </span>
                      {mod.isKey && (
                        <span className="ml-2 text-[9px] font-black text-amber-700 bg-amber-100 border border-amber-200 px-1.5 py-0.5 rounded-full">
                          Trọng tâm
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-center font-black text-slate-700">
                      {mod.units}
                    </td>
                    <td className="px-3 py-2.5 text-center text-xs text-slate-500">
                      {mod.theory}
                    </td>
                    <td className="px-3 py-2.5 text-center text-xs text-slate-500">
                      {mod.practice}
                    </td>
                    <td className="px-3 py-2.5">
                      <ModTypeBadge type={mod.type} />
                    </td>
                    <td className="px-3 py-2.5">
                      {mod.prerequisite?.length ? (
                        mod.prerequisite.map((p) => (
                          <span
                            key={p}
                            className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded mr-1"
                          >
                            {p}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-300 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Modules;
