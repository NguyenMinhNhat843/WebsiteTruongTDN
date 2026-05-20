import type { GradeStatus } from "./LopHocPhanOneProvider";

export const renderStatusIcon = (status: GradeStatus | null | undefined) => {
  switch (status) {
    case "PENDING":
      return (
        <span
          className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center justify-center w-4 h-4 text-amber-500 bg-amber-50 rounded-full border border-amber-200 animate-pulse"
          title="Lưu nháp (Chưa chốt)"
        >
          {/* Icon bút chì biểu thị cho việc đang lưu nháp / có thể chỉnh sửa */}
          <svg
            className="w-2.5 h-2.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
            />
          </svg>
        </span>
      );

    case "APPROVED":
      return (
        <span
          className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center justify-center w-4 h-4 text-emerald-600"
          title="Đã chốt điểm"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </span>
      );

    default:
      return null;
  }
};
