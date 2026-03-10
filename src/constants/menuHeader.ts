export const menuHeader = [
  {
    label: "Trang Chủ",
    href: "/",
  },
  {
    label: "Giới Thiệu",
    href: "/about",
    children: [
      { label: "Lịch sử hình thành", href: "/about/history" },
      { label: "Ban giám hiệu", href: "/about/board" },
    ],
  },
  {
    label: "Đào Tạo",
    href: "#",
    children: [
      {
        label: "Khối Tiểu Học",
        href: "/primary",
        children: [
          { label: "Chương trình học", href: "/primary/curriculum" },
          { label: "Học phí", href: "/primary/fees" },
        ],
      },
      { label: "Khối Trung Học", href: "/secondary" },
    ],
  },
  {
    label: "Liên Hệ",
    href: "/contact",
  },
];
