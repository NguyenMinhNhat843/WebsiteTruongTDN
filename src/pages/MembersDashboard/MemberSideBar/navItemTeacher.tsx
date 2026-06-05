import type { NavItem } from "../../../components/navTree/navTree.type";

export const navItemTeacher: NavItem[] = [
  {
    id: "dashboard",
    label: "Tổng quan",
    icon: "📊",
    href: "/teacher/home",
  },
  {
    id: "classes",
    label: "Lớp giảng dạy",
    icon: "🏫",
    href: "/teacher/lop-hoc",
  },
  {
    id: "thoikhoabieu",
    label: "Thời khóa biểu",
    icon: "📅",
    href: "/teacher/thoi-khoa-bieu",
  },
];
