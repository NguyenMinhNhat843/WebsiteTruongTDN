import type { nganhHocResponse } from "./NganhProvider";

interface Props {
  data: nganhHocResponse[];
  renderActions?: (item: nganhHocResponse) => React.ReactNode;
}

const NganhHocList = ({ data, renderActions }: Props) => {
  if (!data || data.length === 0) {
    return (
      <div className="w-full py-16 bg-white rounded-2xl border border-gray-100 shadow-xs flex flex-col items-center justify-center text-gray-400">
        <span className="text-4xl mb-2">📁</span>
        <p className="text-sm font-medium">
          Không có dữ liệu ngành học hiển thị
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {data.map((item, index) => (
        <div
          key={item.id || index}
          className="group relative bg-white border border-gray-100 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-purple-100 transition-all duration-200 flex flex-col justify-between"
        >
          {/* Header Card: Mã ngành & Hành động */}
          <div>
            <div className="flex items-start justify-between gap-3 mb-3">
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-50 text-purple-600 border border-purple-100/50">
                {item.majorCode}
              </span>

              {/* Vùng hành động (Sửa / Xóa) */}
              {renderActions && (
                <div className="opacity-80 group-hover:opacity-100 transition-opacity">
                  {renderActions(item)}
                </div>
              )}
            </div>

            {/* Tên ngành */}
            <h3 className="text-base font-bold text-gray-800 mb-4 line-clamp-2 group-hover:text-purple-700 transition-colors">
              {item.majorName}
            </h3>

            <hr className="border-gray-50 my-3" />

            {/* Chi tiết Khoa chủ quản */}
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <span className="text-gray-400 font-medium w-16">Khoa:</span>
                <span className="font-semibold text-gray-700 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                  {item.deptId}
                </span>
                <span className="text-gray-500 truncate">
                  {item.department?.deptName || (
                    <span className="text-gray-400 italic">Chưa cập nhật</span>
                  )}
                </span>
              </div>

              {/* Mô tả ngắn */}
              <div className="flex items-start gap-2 pt-1">
                <span className="text-gray-400 font-medium w-16 shrink-0">
                  Mô tả:
                </span>
                <p
                  className="text-gray-500 line-clamp-2"
                  title={item.description || ""}
                >
                  {item.description || "---"}
                </p>
              </div>
            </div>
          </div>

          {/* Số thứ tự nhỏ tinh tế ở góc dưới */}
          <div className="absolute bottom-2 right-4 text-[10px] font-bold text-gray-200 select-none">
            #{index + 1}
          </div>
        </div>
      ))}
    </div>
  );
};

export default NganhHocList;
