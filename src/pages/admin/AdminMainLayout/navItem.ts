export interface NavItem {
  id: string;
  label: string;
  icon?: string; // emoji hoặc ký tự icon
  href?: string;
  badge?: string | number;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: "⬡",
    href: "/admin/dashboard",
  },
  {
    id: "truyen-thong-bao-chi",
    label: "Truyền thông",
    icon: "📰",
    href: "/admin/truyen-thong-bao-chi",
    children: [
      {
        id: "bai-viet",
        label: "Bài viết",
        href: "/admin/truyen-thong-bao-chi/bai-viet",
      },
      {
        id: "tao-bai-viet",
        label: "Tạo bài viết",
        href: "/admin/truyen-thong-bao-chi/tao-bai-viet",
      },
    ],
  },
  {
    id: "quanlychuongtrinhdaotao",
    label: "Chương trình đào tạo",
    icon: "📚",
    href: "/admin/quanlychuongtrinhdaotao",
  },
  {
    id: "quan-ly-nguoi-dung",
    label: "Quản lý người dùng",
    icon: "👥",
    href: "/admin/users",
  },
  {
    id: "test",
    label: "Test menu",
    icon: "⚙",
    badge: "New",
    children: [
      {
        id: "menuchildren1",
        label: "Menu con 1",
        href: "/admin/menu1",
      },
      {
        id: "menuchildren2",
        label: "Menu con 2",
        href: "/admin/menu2",
      },
      {
        id: "menuchildren3",
        label: "Menu con 3",
        href: "/admin/menu3",
      },
    ],
  },
];

export default navItems;
