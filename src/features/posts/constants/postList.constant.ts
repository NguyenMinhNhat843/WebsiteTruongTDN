import type { AudienceValue, CategoryValue, Post } from "../types/Post.types";

export const MOCK_POSTS: Post[] = [
  {
    id: "1",
    title: "Thông báo lịch thi học kỳ I năm học 2024-2025",
    category: "thong-bao",
    audience: "toan-truong",
    status: "da-duyet",
    author: "Phòng Đào tạo",
    createdAt: "2024-11-15",
    views: 1240,
  },
  {
    id: "2",
    title:
      "Tuyển sinh lớp 10 năm học 2025-2026 — Chỉ tiêu và phương thức xét tuyển",
    category: "tuyen-sinh",
    audience: "hoc-sinh",
    status: "da-duyet",
    author: "Ban Giám hiệu",
    createdAt: "2024-11-20",
    views: 3870,
  },
  {
    id: "3",
    title: "Tuyển dụng giáo viên Toán, Lý, Hóa năm học 2025",
    category: "tuyen-dung",
    audience: "giao-vien",
    status: "cho-duyet",
    author: "Phòng Nhân sự",
    createdAt: "2024-12-01",
    views: 542,
  },
  {
    id: "4",
    title:
      "Lễ kỷ niệm 40 năm thành lập trường — Chương trình và đăng ký tham dự",
    category: "su-kien",
    audience: "toan-truong",
    status: "da-duyet",
    author: "Đoàn trường",
    createdAt: "2024-11-28",
    views: 2190,
  },
  {
    id: "5",
    title: "Hướng dẫn ôn tập môn Ngữ văn kỳ thi tốt nghiệp THPT 2025",
    category: "hoc-tap",
    audience: "hoc-sinh",
    status: "da-duyet",
    author: "Tổ Văn",
    createdAt: "2026-12-03",
    views: 1875,
  },
  {
    id: "6",
    title: "Tin tức: Trường đạt chuẩn quốc gia mức độ 2",
    category: "tin-tuc",
    audience: "toan-truong",
    status: "da-duyet",
    author: "Ban Truyền thông",
    createdAt: "2024-12-05",
    views: 4210,
  },
  {
    id: "7",
    title: "Thông báo nghỉ Tết Nguyên Đán 2025",
    category: "thong-bao",
    audience: "toan-truong",
    status: "cho-duyet",
    author: "Văn phòng",
    createdAt: "2024-12-10",
    views: 88,
  },
  {
    id: "8",
    title: "Cuộc thi Olympic Toán học cấp tỉnh — Danh sách học sinh tham dự",
    category: "hoc-tap",
    audience: "hoc-sinh",
    status: "cho-duyet",
    author: "Tổ Toán",
    createdAt: "2024-12-08",
    views: 320,
  },
  {
    id: "9",
    title:
      "Hội thảo chuyên môn: Đổi mới phương pháp giảng dạy theo chương trình 2018",
    category: "su-kien",
    audience: "giao-vien",
    status: "da-duyet",
    author: "Phòng Chuyên môn",
    createdAt: "2024-11-22",
    views: 610,
  },
  {
    id: "10",
    title: "Kết quả thi học sinh giỏi cấp trường năm học 2024-2025",
    category: "tin-tuc",
    audience: "toan-truong",
    status: "da-duyet",
    author: "Phòng Đào tạo",
    createdAt: "2024-12-12",
    views: 1540,
  },
  {
    id: "11",
    title: "Thông báo thu học phí học kỳ II năm học 2024-2025",
    category: "thong-bao",
    audience: "hoc-sinh",
    status: "cho-duyet",
    author: "Phòng Tài vụ",
    createdAt: "2024-12-14",
    views: 45,
  },
  {
    id: "12",
    title: "Chương trình tập huấn giáo viên sử dụng phần mềm LMS",
    category: "hoc-tap",
    audience: "giao-vien",
    status: "da-duyet",
    author: "Phòng CNTT",
    createdAt: "2024-11-30",
    views: 415,
  },
];

export const AUDIENCE_META: Record<
  AudienceValue,
  { label: string; icon: string; color: string }
> = {
  "toan-truong": { label: "Toàn trường", icon: "🏫", color: "text-sky-600" },
  "hoc-sinh": { label: "Học sinh", icon: "🧑‍🎒", color: "text-indigo-600" },
  "giao-vien": { label: "Giáo viên", icon: "👩‍🏫", color: "text-teal-600" },
};

export const CATEGORY_META: Record<
  CategoryValue,
  { label: string; color: string; bg: string; icon: string }
> = {
  "thong-bao": {
    label: "Thông báo",
    color: "text-amber-700",
    bg: "bg-amber-50 border-amber-200",
    icon: "📢",
  },
  "tuyen-sinh": {
    label: "Tuyển sinh",
    color: "text-blue-700",
    bg: "bg-blue-50 border-blue-200",
    icon: "🎓",
  },
  "tuyen-dung": {
    label: "Tuyển dụng",
    color: "text-violet-700",
    bg: "bg-violet-50 border-violet-200",
    icon: "💼",
  },
  "su-kien": {
    label: "Sự kiện",
    color: "text-rose-700",
    bg: "bg-rose-50 border-rose-200",
    icon: "🎉",
  },
  "hoc-tap": {
    label: "Học tập",
    color: "text-emerald-700",
    bg: "bg-emerald-50 border-emerald-200",
    icon: "📚",
  },
  "tin-tuc": {
    label: "Tin tức",
    color: "text-slate-700",
    bg: "bg-slate-100 border-slate-200",
    icon: "📰",
  },
};
