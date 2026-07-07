import type {
  PostCategoryType,
  PostStatus,
} from "../create/CreatePostProvider";

const CATEGORY_CONFIG: Record<
  PostCategoryType,
  { classes: string; label: string }
> = {
  NEWS: {
    label: "Tin tức",
    classes: "bg-blue-50 text-blue-700 border-blue-200",
  },
  ADMISSION: {
    label: "Tuyển sinh",
    classes: "bg-purple-50 text-purple-700 border-purple-200",
  },
  EVENT: {
    label: "Sự kiện",
    classes: "bg-amber-50 text-amber-700 border-amber-200",
  },
  INTERNAL: {
    label: "Tin nội bộ",
    classes: "bg-slate-100 text-slate-700 border-slate-300",
  },
  ACHIEVEMENT: {
    label: "Thành tích",
    classes: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  MENU: {
    label: "Thực đơn",
    classes: "bg-pink-50 text-pink-700 border-pink-200",
  },
  RECRUITMENT: {
    label: "Tuyển dụng",
    classes: "bg-cyan-50 text-cyan-700 border-cyan-200",
  },
};

export const getCategoryBadge = (category: PostCategoryType) => {
  const config = CATEGORY_CONFIG[category] || {
    label: category,
    classes: "bg-gray-50 text-gray-600 border-gray-200",
  };

  return (
    <span
      className={`px-2 py-0.5 text-xs font-semibold rounded-md border inline-flex items-center tracking-wide ${config.classes}`}
    >
      {config.label}
    </span>
  );
};

const STATUS_CONFIG: Record<PostStatus, { classes: string; label: string }> = {
  DRAFT: {
    label: "Bản nháp",
    classes: "bg-slate-50 text-slate-600 border-slate-200", // Màu xám trung tính cho bản nháp
  },
  PENDING: {
    label: "Chờ xét duyệt",
    classes: "bg-amber-50 text-amber-700 border-amber-200 animate-pulse-slow", // Màu vàng cam cảnh báo đang đợi duyệt
  },
  PUBLISHED: {
    label: "Đã xuất bản",
    classes: "bg-emerald-50 text-emerald-700 border-emerald-200", // Màu xanh lá biểu thị trạng thái online/thành công
  },
  ARCHIVED: {
    label: "Lưu trữ / Ẩn",
    classes: "bg-rose-50 text-rose-700 border-rose-200", // Màu đỏ/hồng cho bài viết đã hạ xuống hoặc đóng lại
  },
};

export const getStatusBadge = (status: PostStatus) => {
  const config = STATUS_CONFIG[status] || {
    label: status,
    classes: "bg-gray-50 text-gray-600 border-gray-200",
  };

  return (
    <span
      className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border inline-flex items-center gap-1.5 tracking-wide shadow-sm ${config.classes}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          status === "PUBLISHED"
            ? "bg-emerald-500"
            : status === "PENDING"
              ? "bg-amber-500"
              : status === "ARCHIVED"
                ? "bg-rose-500"
                : "bg-slate-400"
        }`}
      />
      {config.label}
    </span>
  );
};
