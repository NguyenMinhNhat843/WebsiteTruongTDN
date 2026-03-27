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
    id: "posts",
    label: "Bài viết",
    icon: "📝",
    href: "/admin/posts",
  },
  {
    id: "createpost",
    label: "Tạo bài viết",
    icon: "✍",
    href: "/admin/create-post",
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
        href: "/admin/settings/profile",
      },
      {
        id: "menuchildren2",
        label: "Menu con 2",
        href: "/admin/settings/security",
      },
      {
        id: "menuchildren3",
        label: "Menu con 3",
        href: "/admin/settings/billing",
      },
      { id: "menuchildren4", label: "Menu con 4", href: "/admin/settings/api" },
    ],
  },
];

export default navItems;
