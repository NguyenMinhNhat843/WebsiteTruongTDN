import React from "react";
import { useLopHocPhanOneContext } from "./LopHocPhanOneProvider";

// Hàm hỗ trợ format ngày tháng hiển thị trực quan
const formatDate = (dateString: string) => {
  if (!dateString) return "---";
  return new Date(dateString).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Cấu hình Badge màu sắc tươi sáng cho giao diện Light Mode
const statusConfig = {
  PENDING: {
    text: "Chờ phê duyệt",
    bg: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
  APPROVED: {
    text: "Đã phê duyệt",
    bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  REJECTED: {
    text: "Đã từ chối",
    bg: "bg-rose-50 text-rose-700 border-rose-200",
    dot: "bg-rose-500",
  },
};

const SectionSubmissionHistory = () => {
  const { submissionHistory, isLoadingSubmissionHistory } =
    useLopHocPhanOneContext();

  // 1. Trạng thái Đang tải dữ liệu (Skeleton Loading UI tông màu sáng)
  if (isLoadingSubmissionHistory) {
    return (
      <div className="space-y-4">
        {[1, 2].map((n) => (
          <div
            key={n}
            className="p-6 border border-slate-100 rounded-2xl bg-white animate-pulse"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-2 w-1/3">
                <div className="h-5 bg-slate-200 rounded-md"></div>
                <div className="h-4 bg-slate-100 rounded-md w-2/3"></div>
              </div>
              <div className="h-7 bg-slate-200 rounded-full w-24"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-50">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-1.5">
                  <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 2. Trạng thái Không có lịch sử (Empty State màu sáng sạch sẽ)
  if (!submissionHistory || submissionHistory.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-200 bg-slate-50/50 rounded-2xl text-center">
        <div className="w-12 h-12 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center mb-3">
          <svg
            className="w-6 h-6 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-slate-800">
          Chưa có lịch sử nộp điểm
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Mọi lượt gửi yêu cầu nhập/sửa điểm sẽ được ghi nhận tại đây.
        </p>
      </div>
    );
  }

  // 3. Render danh sách lịch sử chính (Giao diện màu sáng tinh tế)
  return (
    <div className="space-y-4">
      {submissionHistory.map((history) => {
        const status = statusConfig[history.status] || statusConfig.PENDING;

        return (
          <div
            key={history.id}
            className="group relative overflow-hidden bg-white border border-slate-200/80 hover:border-indigo-200 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl shadow-sm transition-all duration-300 p-5 md:p-6"
          >
            {/* Hiệu ứng thanh màu highlight mỏng ở cạnh trái khi hover */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Header của Card */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold tracking-wider text-indigo-600 uppercase bg-indigo-50 px-2 py-0.5 rounded-md">
                    Yêu cầu #{history.id}
                  </span>
                </div>
              </div>

              {/* Status Badge */}
              <div
                className={`self-start sm:self-center inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${status.bg}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                {status.text}
              </div>
            </div>

            {/* Grid thông tin chi tiết */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 pt-4 text-xs">
              <div className="bg-slate-50/60 p-2.5 rounded-xl border border-slate-100/80">
                <p className="text-slate-400 font-medium">Người nộp</p>
                <p className="text-slate-700 font-bold mt-1 flex items-center gap-1.5">
                  <svg
                    className="w-3.5 h-3.5 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  ID: {history.submitedBy}
                </p>
              </div>

              <div className="bg-slate-50/60 p-2.5 rounded-xl border border-slate-100/80">
                <p className="text-slate-400 font-medium">Người duyệt</p>
                <p className="text-slate-700 font-semibold mt-1">
                  {history.approvedBy ? (
                    <span className="text-slate-700 font-bold">Hệ thống</span>
                  ) : (
                    <span className="text-slate-400 font-normal italic">
                      Chưa duyệt
                    </span>
                  )}
                </p>
              </div>

              <div className="bg-slate-50/60 p-2.5 rounded-xl border border-slate-100/80">
                <p className="text-slate-400 font-medium">Thời gian nộp</p>
                <p className="text-slate-700 font-semibold mt-1">
                  {formatDate(history.createdAt)}
                </p>
              </div>

              <div className="bg-slate-50/60 p-2.5 rounded-xl border border-slate-100/80">
                <p className="text-slate-400 font-medium">Cập nhật cuối</p>
                <p className="text-slate-700 font-semibold mt-1">
                  {history.updatedAt ? (
                    formatDate(history.createdAt)
                  ) : (
                    <span className="text-slate-400 font-normal italic">
                      Chưa có
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SectionSubmissionHistory;
