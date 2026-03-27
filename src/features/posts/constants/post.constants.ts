import type { AudienceValue, Category } from "../types/Post.types";

export const MAX_TAGS = 8;

export const CATEGORIES: Category[] = [
  {
    value: "thong-bao",
    label: "📢 Thông báo",
    color: "bg-blue-100 text-blue-700",
  },
  {
    value: "tin-tuc",
    label: "📰 Tin tức",
    color: "bg-green-100 text-green-700",
  },
  {
    value: "su-kien",
    label: "🎉 Sự kiện",
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    value: "hoc-tap",
    label: "📚 Học tập",
    color: "bg-purple-100 text-purple-700",
  },
  {
    value: "tuyen-sinh",
    label: "🎓 Tuyển sinh",
    color: "bg-red-100 text-red-700",
  },
  {
    value: "tuyen-dung",
    label: "💼 Tuyển dụng",
    color: "bg-orange-100 text-orange-700",
  },
];

export const AUDIENCES: AudienceValue[] = [
  "Toàn trường",
  "Học sinh",
  "Giáo viên",
  "Phụ huynh",
  "Ban giám hiệu",
];
