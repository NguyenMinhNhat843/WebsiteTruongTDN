import type { NavItem } from "../../../components/navTree/navTree.type";

export const navItemTeacher: NavItem[] = [
  {
    id: "home",
    label: "Tổng quan",
    icon: "🏠",
    href: "/teacher/home",
  },
  {
    id: "lop-giang-day",
    label: "Các lớp học",
    icon: "📖",
    href: "/teacher/lop-hoc",
  },
  {
    id: "thoi-khoa-bieu",
    label: "Thời khóa biểu",
    icon: "📅",
    href: "/teacher/thoi-khoa-bieu",
  },
];
