import React, { useEffect } from "react";
import type { components } from "../../../../api/v1";

// Giữ nguyên dòng type theo yêu cầu (đã hiểu ngầm cấu trúc mới)
export type DocumentConFigDetailDto =
  components["schemas"]["DocumentConfigWithItemsResponseDto"];

interface ModalDetailProps {
  isOpen: boolean;
  onClose: () => void;
  documentConfigDetail?: DocumentConFigDetailDto;
}

const ModalDetail: React.FC<ModalDetailProps> = ({
  isOpen,
  onClose,
  documentConfigDetail,
}) => {
  // Lắng nghe phím ESC để đóng modal nhanh (UX Escape Routes)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden"; // Ngăn cuộn trang nền khi modal mở
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Trường hợp dữ liệu chưa load kịp hoặc không tồn tại
  if (!documentConfigDetail) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
        <div className="bg-white rounded-xl p-6 shadow-xl max-w-sm w-full text-center">
          <p className="text-slate-500 font-medium">
            Không tìm thấy dữ liệu chi tiết.
          </p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    );
  }

  // Ép kiểu sang `any` hoặc mapping ngầm theo cấu trúc bạn đã đưa ra để tránh lỗi bóc tách nếu file OpenAPI chưa cập nhật
  const { id, name, startDate, items } = documentConfigDetail as any;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in"
      onClick={onClose} // Click vùng ngoài để đóng
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-3xl w-full overflow-hidden transform transition-all animate-slide-up flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()} // Chặn nổi bọt để click bên trong không bị đóng
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
              ID Nhóm: #{id}
            </span>
            <h3 className="text-lg font-bold text-slate-900 mt-1">
              Chi tiết cấu hình tài liệu
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Đóng modal"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Section 1: Thông tin nhóm cấu hình (Cha) */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Thông tin cấu hình chính
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl">
              <div>
                <span className="block text-xs font-medium text-slate-500">
                  Tên cấu hình
                </span>
                <span className="text-sm font-semibold text-slate-900 break-words">
                  {name || "—"}
                </span>
              </div>
              <div>
                <span className="block text-xs font-medium text-slate-500">
                  Ngày bắt đầu áp dụng
                </span>
                <span className="text-sm font-semibold text-slate-900 font-mono">
                  {startDate
                    ? new Date(startDate).toLocaleDateString("vi-VN")
                    : "—"}
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Danh sách thuộc tính con (Items) */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Danh sách thuộc tính thuộc nhóm ({items?.length || 0})
            </h4>

            {items && items.length > 0 ? (
              <div className="space-y-3">
                {items.map((item: any) => (
                  <div
                    key={item.id}
                    className="border border-slate-100 rounded-xl p-4 space-y-3 shadow-sm bg-white"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <span className="block text-xs font-medium text-slate-500">
                          Tên thuộc tính
                        </span>
                        <span className="text-sm font-bold text-indigo-950 break-words">
                          {item.name}
                        </span>
                      </div>
                      <span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600 shrink-0">
                        ID: #{item.id}
                      </span>
                    </div>

                    <div className="border-t border-slate-100 pt-2 grid grid-cols-2 gap-2 items-center">
                      <div>
                        <span className="block text-[11px] font-medium text-slate-400">
                          Thứ tự sắp xếp
                        </span>
                        <span className="text-xs font-semibold text-slate-700 font-mono">
                          {item.sortOrder !== null ? item.sortOrder : "—"}
                        </span>
                      </div>

                      <div className="flex justify-end">
                        {item.required ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            Bắt buộc
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                            Tùy chọn
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl">
                <span className="text-xs text-slate-400">
                  Không có thuộc tính nào thuộc nhóm này.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-200 shadow-sm min-h-[44px]"
          >
            Đóng cửa sổ
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalDetail;
