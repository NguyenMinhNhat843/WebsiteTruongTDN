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
    children: [
      {
        id: "my-classes",
        label: "Danh sách lớp",
        href: "/teacher/lop-hoc",
      },
    ],
  },
  {
    id: "grades",
    label: "Quản lý điểm",
    icon: "📝",
    children: [
      {
        id: "grade-entry",
        label: "Nhập điểm",
        href: "/teacher/grades/input",
      },
      {
        id: "grade-review",
        label: "Xem & chỉnh sửa",
        href: "/teacher/grades/review",
      },
      {
        id: "grade-submit",
        label: "Gửi duyệt",
        href: "/teacher/grades/submit",
        badge: "!",
      },
    ],
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
