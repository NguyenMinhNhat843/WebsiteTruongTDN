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
  {
    id: "attendance",
    label: "Điểm danh",
    icon: "📅",
    children: [
      {
        id: "attendance-take",
        label: "Điểm danh buổi học",
        href: "/teacher/attendance/take",
      },
      {
        id: "attendance-history",
        label: "Lịch sử điểm danh",
        href: "/teacher/attendance/history",
      },
    ],
  },
  {
    id: "announcements",
    label: "Thông báo",
    icon: "📢",
    children: [
      {
        id: "announcement-list",
        label: "Danh sách",
        href: "/teacher/announcements",
      },
      {
        id: "announcement-create",
        label: "Tạo thông báo",
        href: "/teacher/announcements/create",
      },
    ],
  },
  {
    id: "statistics",
    label: "Thống kê",
    icon: "📈",
    href: "/teacher/statistics",
  },
];
