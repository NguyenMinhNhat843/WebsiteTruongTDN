import type { NavItem } from "../../components/navTree/navTree.type";

export const navItemStudent: NavItem[] = [
  {
    id: "dashboard",
    label: "Tổng quan",
    icon: "📊",
    href: "/student/dashboard",
  },
  {
    id: "classes",
    label: "Lớp học phần",
    icon: "🏫",
    href: "/student/lop-hoc-phan",
  },
  {
    id: "thoikhoabieu",
    label: "Thời khóa biểu",
    icon: "📅",
    href: "/student/thoi-khoa-bieu",
  },
  {
    id: "chươngtrinhkhung",
    label: "Chương trình khung",
    icon: "📚",
    href: "/student/chuong-trinh-khung",
  },
];
