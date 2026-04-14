import clsx from "clsx";
import { EduBadge } from "./EduBadge";
import { StatusBadge } from "./StatusBadge";
import { useChuongTrinhKhungContext } from "../ChuongTrinhKhungProvider";

const HeaderOne = () => {
  const {
    activeTab,
    setActiveTab,
    selected,
    handleDelete,
    handleOpenFormUpdateModal,
    handleApplyFramework,
  } = useChuongTrinhKhungContext();
  if (!selected) return null;

  return (
    <div className="p-5 border-b border-slate-100">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <EduBadge sys={selected.eduSystem} />
            <StatusBadge status={selected.status} />
            <span className="font-mono text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
              {selected.code}
            </span>
          </div>
          <h2 className="text-lg font-black text-slate-800">{selected.name}</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Ngành: <strong className="text-slate-600">{selected.major}</strong>{" "}
            · {selected.department} · Từ năm{" "}
            <strong className="text-slate-600">{selected.effectiveYear}</strong>
          </p>
          {selected.decisionNo !== "—" && (
            <p className="text-xs text-slate-400 mt-0.5">
              QĐ:{" "}
              <span className="font-mono text-slate-600">
                {selected.decisionNo}
              </span>
              {selected.issuedBy && <span> — {selected.issuedBy}</span>}
            </p>
          )}
        </div>
        <div className="flex gap-1.5 shrink-0 flex-wrap justify-end">
          <div className="flex gap-1.5 shrink-0 flex-wrap justify-end">
            {[
              {
                l: "Sửa",
                click: handleOpenFormUpdateModal,
                cls: "text-slate-600 border-slate-200 hover:border-blue-400 hover:text-blue-600",
              },
              {
                l: "✓ Áp dụng",
                click: handleApplyFramework,
                cls: "text-emerald-600 border-emerald-200 hover:bg-emerald-50",
                show: selected.status === "draft",
              },
              {
                l: "Xóa",
                click: () => handleDelete(selected.id),
                cls: "text-red-500 border-red-100 hover:bg-red-50",
              },
            ].map(
              (b, i) =>
                (b.show ?? true) && (
                  <button
                    key={i}
                    onClick={b.click}
                    className={clsx(
                      `text-xs font-semibold px-4 py-2 rounded-lg border transition-colors cursor-pointer`,
                      b.cls,
                    )}
                  >
                    {b.l}
                  </button>
                ),
            )}
          </div>
        </div>
      </div>
      <div className="flex gap-1">
        {(["overview", "modules"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-colors ${activeTab === t ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:bg-slate-100"}`}
          >
            {t === "overview" ? "Tổng quan" : "Danh mục môn học / mô-đun"}
          </button>
        ))}
      </div>
    </div>
  );
};

export default HeaderOne;
