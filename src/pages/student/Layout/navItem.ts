import type { NavItem } from "../../../components/navTree/navTree.type";

export const studentNavItems: NavItem[] = [
  {
    id: "home",
    label: "Trang chủ",
    icon: "⬡",
    href: "/student/home",
    roles: ["student"],
  },
  {
    id: "hoc-tap",
    label: "Thông tin học tập",
    icon: "📚",
    children: [
      {
        id: "thoi-khoa-bieu-student",
        label: "Lịch học học kỳ",
        href: "/student/dao-tao/thoi-khoa-bieu",
        roles: ["student"],
      },
      {
        id: "chuong-trinh-hoc",
        label: "Khung chương trình",
        href: "/student/dao-tao/khung-chuong-trinh",
        roles: ["student"],
      },
      {
        id: "diem-so",
        label: "Bảng điểm",
        href: "/student/diem-so",
        roles: ["student"],
      },
      {
        id: "diem-ren-luyen-student",
        label: "Điểm rèn luyện",
        href: "/student/diem-ren-luyen",
        roles: ["student"],
      },
    ],
  },
];
