import { useState } from "react";
import { ChevronRight, Map, Plus, Pencil, Trash2 } from "lucide-react";
import { $api } from "../../../../api/client";
import WardNode from "./WardNode";

function ProvinceNode({
  province,
  onEdit,
  onAddChild,
  onDelete,
  openModal,
  handleDelete,
}: {
  province: any;
  onEdit: (data: any) => void;
  onAddChild: (code: string) => void;
  onDelete: (code: string) => void;
  openModal: (
    type: "create" | "update",
    level: "province" | "ward" | "village",
    parentCode?: string,
    currentData?: any,
  ) => void;
  handleDelete: (
    level: "province" | "ward" | "village",
    code: string,
  ) => Promise<void>;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const { data: wards, refetch: refetchWards } = $api.useQuery(
    "get",
    "/wards",
    { params: { query: { provinceCode: province.code } }, enabled: isExpanded },
  );

  return (
    <div className="group border border-slate-200 rounded-lg bg-slate-50/40 overflow-hidden transition-all duration-200 hover:border-slate-300 shadow-sm">
      {/* CẤP 1 - TỈNH / THÀNH PHỐ */}
      <div className="flex items-center justify-between p-3.5 bg-white hover:bg-slate-50/80 transition-colors duration-150">
        <div
          className="flex items-center gap-3 cursor-pointer flex-1 select-none"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {/* Mũi tên điều hướng với hiệu ứng xoay mượt mà */}
          <div className="flex items-center justify-center w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors">
            <ChevronRight
              size={16}
              className={`transition-transform duration-200 stroke-[2.5] ${isExpanded ? "rotate-90 text-slate-600" : ""}`}
            />
          </div>

          <div className="flex items-center gap-2">
            <Map size={18} className="text-slate-500 stroke-[1.8]" />
            <span className="font-bold text-slate-800 tracking-tight text-sm">
              {province.fullName}
            </span>
          </div>

          <span className="text-[10px] tracking-wider bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-mono border border-slate-200/60 font-semibold">
            {province.code}
          </span>
        </div>

        {/* Thanh công cụ hành động cấp Tỉnh */}
        <div className="flex items-center gap-0.5 opacity-90 group-hover:opacity-100 transition-opacity">
          <button
            title="Thêm Xã/Phường"
            onClick={() => {
              setIsExpanded(true);
              onAddChild(province.code);
            }}
            className="p-1.5 text-blue-600 hover:bg-blue-50 active:bg-blue-100 rounded-md transition-colors"
          >
            <Plus size={16} className="stroke-[2.5]" />
          </button>
          <button
            title="Sửa Tỉnh"
            onClick={() => onEdit(province)}
            className="p-1.5 text-amber-600 hover:bg-amber-50 active:bg-amber-100 rounded-md transition-colors"
          >
            <Pencil size={15} className="stroke-[2]" />
          </button>
          <button
            title="Xóa Tỉnh"
            onClick={async () => {
              if (
                confirm(
                  `Bạn có chắc chắn muốn xóa tỉnh/thành phố ${province.fullName}?`,
                )
              ) {
                await onDelete(province.code);
              }
            }}
            className="p-1.5 text-rose-600 hover:bg-rose-50 active:bg-rose-100 rounded-md transition-colors"
          >
            <Trash2 size={15} className="stroke-[2]" />
          </button>
        </div>
      </div>

      {/* CẤP 2 - DANH SÁCH XÃ PHƯỜNG */}
      {isExpanded && (
        <div className="pl-6 pr-3 pb-3 pt-2 bg-slate-50/30 border-t border-slate-100 space-y-2">
          {wards && wards.length > 0 ? (
            wards.map((ward: any) => (
              <WardNode
                key={ward.code}
                ward={ward}
                onEdit={() => openModal("update", "ward", undefined, ward)}
                onAddChild={() => openModal("create", "village", ward.code)}
                onDelete={() => handleDelete("ward", ward.code)}
                openModal={openModal}
                handleDelete={handleDelete}
                refetchWards={refetchWards}
              />
            ))
          ) : (
            <div className="flex items-center gap-2 py-2.5 pl-6 text-xs text-slate-400 italic">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
              Chưa có Xã/Phường trực thuộc.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ProvinceNode;
