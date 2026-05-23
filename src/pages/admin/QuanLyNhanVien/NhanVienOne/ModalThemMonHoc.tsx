import { useState, useMemo } from "react";
import type { SubjectResponseDto } from "../QuanLyNguoiDungContext";

interface ModalMonHocGiangDayProps {
  data: SubjectResponseDto[];
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
  onSubmit?: (subjectIds: number[], onSuccess: () => void) => void; // Đổi thành mảng để gửi nhiều môn đã chọn
}

const ModalMonHocGiangDay = ({
  data,
  onSubmit,
  isOpen,
  setIsOpen,
}: ModalMonHocGiangDayProps) => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Chuẩn hóa dữ liệu hiển thị
  const dataHienThi = useMemo(() => {
    return data.map((sub) => ({
      id: sub.id,
      code: sub.subjectCode,
      name: sub.subjectName,
      fullName: `${sub.subjectCode} - ${sub.subjectName}`,
    }));
  }, [data]);

  // Lọc môn học theo từ khóa tìm kiếm
  const filteredData = useMemo(() => {
    return dataHienThi.filter((item) =>
      item.fullName.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [dataHienThi, searchTerm]);

  if (!isOpen || !setIsOpen) return null;

  const handleToggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleClose = () => {
    setIsOpen(false);
    setSearchTerm(""); // Reset tìm kiếm khi đóng
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(selectedIds, handleClose);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop nền mờ phía sau */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={handleClose}
      />

      {/* Khung Modal chính */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-100 flex flex-col max-h-[85vh] transform transition-all overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Đăng ký môn học giảng dạy
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Chọn các môn học bạn muốn phân công giảng dạy
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Thanh tìm kiếm nhanh */}
        <div className="px-6 py-3 border-b border-slate-50 bg-slate-50/50">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Tìm kiếm theo mã hoặc tên môn học..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm placeholder-slate-400 text-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Danh sách môn học (Cuộn độc lập) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-2.5 custom-scrollbar">
          {filteredData.length > 0 ? (
            filteredData.map((subject) => {
              const isSelected = selectedIds.includes(subject.id);
              return (
                <div
                  key={subject.id}
                  className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer select-none transition-all duration-200 group ${
                    isSelected
                      ? "bg-indigo-50/60 border-indigo-200 ring-1 ring-indigo-200"
                      : "bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50/80 shadow-sm"
                  }`}
                  onClick={() => handleToggleSelect(subject.id)}
                >
                  <div className="flex flex-col pr-4">
                    <span className="text-xs font-bold tracking-wider text-indigo-600 uppercase mb-0.5">
                      {subject.code}
                    </span>
                    <span
                      className={`text-sm font-medium ${isSelected ? "text-indigo-900" : "text-slate-700"}`}
                    >
                      {subject.name}
                    </span>
                  </div>

                  {/* Custom Checkbox */}
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                      isSelected
                        ? "bg-indigo-600 border-indigo-600 shadow-sm shadow-indigo-200"
                        : "border-slate-300 bg-white group-hover:border-slate-400"
                    }`}
                  >
                    {isSelected && (
                      <svg
                        className="w-3.5 h-3.5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2.5"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-slate-400">
                Không tìm thấy môn học nào phù hợp.
              </p>
            </div>
          )}
        </div>

        {/* Footer chứa các nút hành động */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">
            Đã chọn:{" "}
            <span className="text-indigo-600 font-semibold">
              {selectedIds.length}
            </span>{" "}
            môn học
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={selectedIds.length === 0}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-indigo-100 transition-all"
            >
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalMonHocGiangDay;
