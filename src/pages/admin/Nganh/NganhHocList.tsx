import type { nganhHocResponse } from "./NganhProvider";
import { FolderOpen, Building2, FileText } from "lucide-react";

interface Props {
  data: nganhHocResponse[];
  renderActions?: (item: nganhHocResponse) => React.ReactNode;
}

const NganhHocList = ({ data, renderActions }: Props) => {
  // Empty State - Cỡ chữ to và rõ ràng hơn
  if (!data || data.length === 0) {
    return (
      <div className="w-full py-20 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-slate-400">
        <div className="p-5 bg-slate-50 text-slate-400 rounded-2xl mb-4 border border-slate-100">
          <FolderOpen size={40} strokeWidth={1.5} />
        </div>
        <p className="text-base font-bold text-slate-700">
          Không tìm thấy dữ liệu ngành học
        </p>
        <p className="text-sm text-slate-500 mt-1.5">
          Vui lòng nhấn nút thêm mới hoặc thử bộ lọc khác.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((item, index) => (
        <div
          key={item.id || index}
          className="group relative bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-emerald-300 hover:bg-emerald-50/5 transition-all duration-200 flex flex-col justify-between overflow-hidden"
        >
          {/* Header Card: Mã ngành (To hơn) & Hành động */}
          <div>
            <div className="flex items-start justify-between gap-3 mb-4">
              <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-bold bg-emerald-50 text-emerald-800 border border-emerald-100">
                {item.majorCode}
              </span>

              {/* Vùng hành động (Sửa / Xóa) */}
              {renderActions && (
                <div className="opacity-80 group-hover:opacity-100 transition-opacity">
                  {renderActions(item)}
                </div>
              )}
            </div>

            {/* Tên ngành học (Tăng từ text-base lên text-lg, đậm và rõ nét) */}
            <h3 className="text-lg font-extrabold text-slate-800 mb-4 line-clamp-2 group-hover:text-emerald-700 transition-colors tracking-tight leading-snug">
              {item.majorName}
            </h3>

            {/* Đường gạch ngang tách biệt */}
            <hr className="border-slate-100 my-4" />

            {/* Chi tiết thông tin (Tăng từ text-xs lên text-sm để đọc cực kỳ dễ dàng) */}
            <div className="space-y-3.5 text-sm text-slate-600">
              {/* Khoa phụ trách */}
              <div className="flex items-start gap-3">
                <Building2
                  size={16}
                  className="text-slate-400 mt-0.5 shrink-0"
                />
                <div className="flex flex-wrap items-center gap-2 min-w-0">
                  <span className="font-extrabold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200 text-xs">
                    ID: {item.deptId}
                  </span>
                  <span
                    className="text-slate-700 font-semibold truncate"
                    title={item.department?.deptName || ""}
                  >
                    {item.department?.deptName || (
                      <span className="text-slate-400 italic font-normal">
                        Chưa cập nhật khoa
                      </span>
                    )}
                  </span>
                </div>
              </div>

              {/* Mô tả tóm tắt (Cỡ chữ to hơn và đổi màu text đậm hơn chút cho tương phản tốt) */}
              <div className="flex items-start gap-3">
                <FileText
                  size={16}
                  className="text-slate-400 mt-0.5 shrink-0"
                />
                <p
                  className="text-slate-600 line-clamp-2 leading-relaxed font-medium"
                  title={item.description || ""}
                >
                  {item.description ||
                    "Chưa có mô tả chi tiết cho ngành học này."}
                </p>
              </div>
            </div>
          </div>

          {/* Nhãn số hiệu nhỏ tinh tế ở góc phải dưới */}
          <div className="absolute bottom-2.5 right-4 text-xs font-black text-slate-100 group-hover:text-emerald-100/60 select-none transition-colors">
            #{String(index + 1).padStart(2, "0")}
          </div>
        </div>
      ))}
    </div>
  );
};

export default NganhHocList;
