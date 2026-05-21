import React, { useState } from "react";
import { useLopHocContext } from "./LopHocProvider";
import {
  Search,
  Loader2,
  UserPlus,
  X,
  GraduationCap,
  Calendar,
  Hash,
} from "lucide-react";

interface ModelThemHocSinhProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModelThemHocSinh = ({ isOpen, onClose }: ModelThemHocSinhProps) => {
  const {
    addStudentToLopHoc,
    isAddingStudentToLopHoc,
    findStudentByMssv,
    isFindingStudentByMssv,
    studentFound,
    idLopHocNumber,
  } = useLopHocContext();

  const [mssvInput, setMssvInput] = useState<string>("");

  // Tránh hiển thị dữ liệu cũ nếu chưa tìm kiếm hoặc không có kết quả
  const hasStudent = !!studentFound;

  const dataHienThi = {
    id: studentFound?.id,
    tenHocSinh: studentFound?.fullName || "N/A",
    maSinhVien: studentFound?.studentCode || "N/A",
    khoa: studentFound?.batch?.batchName || "N/A",
  };

  // Hàm xử lý tìm kiếm khi bấm Enter hoặc click nút Tìm
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mssvInput.trim()) return;

    // Gọi hàm tìm kiếm từ Context (truyền mssv vào)
    findStudentByMssv({
      params: {
        query: {
          studentCode: mssvInput.trim(),
        },
      },
    });
  };

  // Hàm xử lý thêm học sinh vào lớp
  const handleAdd = async (studentId: number) => {
    if (!studentId) return;

    addStudentToLopHoc(
      {
        params: {
          path: {
            classId: idLopHocNumber,
          },
          query: {
            studentId,
          },
        },
      },
      {
        // Callback nếu hook của bạn hỗ trợ (ví dụ: react-query)
        onSuccess: () => {
          setMssvInput(""); // Reset ô nhập
          onClose(); // Đóng modal
        },
      },
    );
  };

  // Nếu trạng thái đóng thì không render modal
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Lớp nền mờ (Backdrop) */}
      <div
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Khung nội dung Modal */}
      <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all border border-gray-100 space-y-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Tiêu đề & Nút đóng */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <UserPlus className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              Thêm học sinh mới
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form tìm kiếm mã sinh viên */}
        <form onSubmit={handleSearch} className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Nhập Mã Số Sinh Viên (MSSV)
          </label>
          <div className="relative flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Ví dụ: SV10234..."
                value={mssvInput}
                onChange={(e) => setMssvInput(e.target.value)}
                disabled={isFindingStudentByMssv || isAddingStudentToLopHoc}
                className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50 disabled:text-gray-400"
              />
            </div>
            <button
              type="submit"
              disabled={isFindingStudentByMssv || !mssvInput.trim()}
              className="inline-flex items-center justify-center rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors disabled:bg-gray-200 disabled:text-gray-400"
            >
              {isFindingStudentByMssv ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Tìm"
              )}
            </button>
          </div>
        </form>

        {/* Khu vực hiển thị kết quả tìm kiếm */}
        <div className="min-h-[120px] flex flex-col justify-center border-2 border-dashed border-gray-100 rounded-xl p-4 bg-gray-50/50">
          {isFindingStudentByMssv ? (
            <div className="flex flex-col items-center justify-center gap-2 text-sm text-gray-400 py-4">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
              <span>Đang tìm kiếm dữ liệu...</span>
            </div>
          ) : hasStudent ? (
            // Thẻ thông tin học sinh khi tìm thấy
            <div className="space-y-4 w-full">
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-sm">
                  <GraduationCap className="h-4 w-4 text-gray-400 shrink-0" />
                  <span className="text-gray-500 w-20">Họ và tên:</span>
                  <span className="font-semibold text-gray-900">
                    {dataHienThi.tenHocSinh}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Hash className="h-4 w-4 text-gray-400 shrink-0" />
                  <span className="text-gray-500 w-20">Mã SV:</span>
                  <span className="font-mono font-medium text-gray-700 bg-white border border-gray-200 px-1.5 py-0.5 rounded-md text-xs">
                    {dataHienThi.maSinhVien}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-400 shrink-0" />
                  <span className="text-gray-500 w-20">Khóa học:</span>
                  <span className="text-gray-700 font-medium">
                    {dataHienThi.khoa}
                  </span>
                </div>
              </div>

              {/* Nút xác nhận thêm học sinh này */}
              <button
                type="button"
                onClick={() => handleAdd(Number(dataHienThi.id))}
                disabled={isAddingStudentToLopHoc || !dataHienThi.id}
                className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm py-2.5 rounded-xl shadow-sm shadow-blue-100 transition-all active:scale-[0.99] disabled:bg-gray-300 disabled:shadow-none"
              >
                {isAddingStudentToLopHoc ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Đang thêm vào lớp...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4" />
                    <span>Xác nhận thêm học sinh</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            // Trạng thái trống ban đầu hoặc không tìm thấy
            <div className="text-center py-4 text-sm text-gray-400">
              Chưa có dữ liệu. Vui lòng nhập MSSV chính xác để tìm học sinh.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModelThemHocSinh;
