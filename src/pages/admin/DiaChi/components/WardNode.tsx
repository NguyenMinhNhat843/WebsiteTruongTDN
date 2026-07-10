import { useState } from "react";
import {
  ChevronRight,
  Building2,
  Home,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";
import { $api } from "../../../../api/client";

function WardNode({
  ward,
  onEdit,
  onAddChild,
  onDelete,
  openModal,
  handleDelete,
  refetchWards,
}: any) {
  const [isExpanded, setIsExpanded] = useState(false);

  const { data: villages, refetch: refetchVillages } = $api.useQuery(
    "get",
    "/villages",
    { params: { query: { wardCode: ward.code } }, enabled: isExpanded },
  );

  return (
    <div className="group border border-slate-200/80 rounded-lg bg-white shadow-sm overflow-hidden transition-all duration-200 hover:border-slate-300">
      {/* CẤP 2 - XÃ / PHƯỜNG */}
      <div className="flex items-center justify-between p-3 hover:bg-slate-50/60 transition-colors duration-150">
        <div
          className="flex items-center gap-2.5 cursor-pointer flex-1 select-none"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center justify-center w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors">
            <ChevronRight
              size={16}
              className={`transition-transform duration-200 stroke-[2.5] ${isExpanded ? "rotate-90 text-slate-600" : ""}`}
            />
          </div>
          <div className="flex items-center gap-2">
            <Building2 size={16} className="text-slate-500 stroke-[1.8]" />
            <span className="text-sm font-semibold text-slate-700 tracking-tight">
              {ward.fullName}
            </span>
          </div>
        </div>

        {/* Thanh công cụ hành động cấp Xã */}
        <div className="flex items-center gap-0.5 opacity-80 group-hover:opacity-100 transition-opacity">
          <button
            title="Thêm Thôn/Xóm"
            onClick={() => {
              setIsExpanded(true);
              onAddChild();
            }}
            className="p-1.5 text-blue-600 hover:bg-blue-50 active:bg-blue-100 rounded-md transition-colors"
          >
            <Plus size={16} className="stroke-[2.5]" />
          </button>
          <button
            title="Sửa Xã"
            onClick={onEdit}
            className="p-1.5 text-amber-600 hover:bg-amber-50 active:bg-amber-100 rounded-md transition-colors"
          >
            <Pencil size={15} className="stroke-[2]" />
          </button>
          <button
            title="Xóa Xã"
            onClick={async () => {
              if (confirm(`Bạn có chắc chắn muốn xóa xã ${ward.fullName}?`)) {
                await onDelete();
                refetchWards();
              }
            }}
            className="p-1.5 text-rose-600 hover:bg-rose-50 active:bg-rose-100 rounded-md transition-colors"
          >
            <Trash2 size={15} className="stroke-[2]" />
          </button>
        </div>
      </div>

      {/* CẤP 3 - DANH SÁCH THÔN/XÓM */}
      {isExpanded && (
        <div className="pl-9 pr-3 pb-3 pt-1.5 bg-slate-50/40 border-t border-slate-100 space-y-1">
          {villages && villages.length > 0 ? (
            villages.map((village: any) => (
              <div
                key={village.id}
                className="group/item flex items-center justify-between p-2 hover:bg-white border border-transparent hover:border-slate-200/60 rounded-md text-xs text-slate-600 transition-all duration-150 shadow-sm/none hover:shadow-sm"
              >
                <div className="flex items-center gap-2 font-medium">
                  <Home size={14} className="text-slate-400 stroke-[1.8]" />
                  <span>{village.name}</span>
                </div>

                {/* Thanh công cụ hành động cấp Thôn (Chỉ hiện khi hover dòng đó) */}
                <div className="flex items-center gap-0.5 opacity-0 group-hover/item:opacity-100 transition-opacity duration-150">
                  <button
                    title="Sửa Thôn"
                    onClick={() =>
                      openModal("update", "village", undefined, village)
                    }
                    className="p-1 text-amber-600 hover:bg-amber-50 rounded transition-colors"
                  >
                    <Pencil size={13} className="stroke-[2]" />
                  </button>
                  <button
                    title="Xóa Thôn"
                    onClick={async () => {
                      if (
                        confirm(
                          `Bạn có chắc chắn muốn xóa thôn ${village.name}?`,
                        )
                      ) {
                        await handleDelete("village", village.id);
                        refetchVillages();
                      }
                    }}
                    className="p-1 text-rose-600 hover:bg-rose-50 rounded transition-colors"
                  >
                    <Trash2 size={13} className="stroke-[2]" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center gap-2 py-2.5 pl-2 text-xs text-slate-400 italic">
              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
              Chưa có Thôn/Xóm trực thuộc.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default WardNode;
