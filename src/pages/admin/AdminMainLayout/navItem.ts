import type { NavItem } from "../../../components/navTree/navTree.type";

const navItems: NavItem[] = [
  {
    id: "home",
    label: "Home",
    icon: "⬡",
    href: "/admin/home",
    roles: ["ADMIN", "TEACHER", "STUDENT"], // Ai cũng thấy
  },
  // --- NHÓM ĐÀO TẠO & HỌC TẬP ---
  {
    id: "quan-ly-dao-tao",
    label: "Quản lý Đào tạo",
    icon: "📚",
    roles: ["ADMIN", "TEACHER"],
    children: [
      {
        id: "chuong-trinh-khung",
        label: "Chương trình khung",
        href: "/admin/dao-tao/chuong-trinh-khung",
        roles: ["ADMIN"], // Chỉ admin mới được xem chương trình khung
      },
      {
        id: "tao-chuong-trinh-khung",
        label: "Tạo chương trình khung",
        href: "/admin/dao-tao/tao-chuong-trinh-khung",
        roles: ["ADMIN", "TEACHER"],
      },
      {
        id: "quan-ly-lop-hoc",
        label: "Lớp học & Khóa học",
        href: "/admin/dao-tao/lop-hoc",
        roles: ["ADMIN", "TEACHER"],
      },
      {
        id: "lop-hoc-phan",
        label: "Tạo Lớp học phần",
        href: "/admin/dao-tao/lop-hoc-phan",
      },
      {
        id: "khoa",
        label: "Khoa",
        href: "/admin/dao-tao/khoa",
        roles: ["ADMIN", "TEACHER"],
      },
      {
        id: "thoi-khoa-bieu",
        label: "Thời khóa biểu",
        href: "/admin/dao-tao/thoi-khoa-bieu",
        roles: ["ADMIN", "TEACHER"],
      },
      {
        id: "quan-ly-diem",
        label: "Quản lý Điểm & Thi",
        href: "/admin/dao-tao/diem-thi",
        roles: ["ADMIN", "TEACHER"],
      },
    ],
  },
  // --- NHÓM CÔNG TÁC HỌC SINH ---
  {
    id: "quan-ly-hoc-sinh",
    label: "Công tác Học sinh",
    icon: "🎓",
    children: [
      {
        id: "ho-so-hoc-sinh",
        label: "Hồ sơ học sinh",
        href: "/admin/hoc-sinh/ho-so",
      },
      {
        id: "quan-ly-tot-nghiep",
        label: "Xét tốt nghiệp",
        href: "/admin/hoc-sinh/tot-nghiep",
      },
      {
        id: "dot-xet-tot-nghiep",
        label: "Đợt xét tốt nghiệp",
        href: "/admin/hoc-sinh/dot-xet-tot-nghiep",
      },
    ],
  },
  // --- NHÓM TUYỂN SINH ---
  {
    id: "tuyen-sinh",
    label: "Tuyển sinh",
    icon: "📝",
    badge: "Hot",
    children: [
      {
        id: "dot-tuyen-sinh",
        label: "Đợt tuyển sinh",
        href: "/admin/tuyen-sinh/dot-tuyen-sinh",
      },
      {
        id: "tao-dot-tuyen-sinh",
        label: "Tạo đợt tuyển sinh",
        href: "/admin/tuyen-sinh/tao-dot-tuyen-sinh",
      },
      {
        id: "tiep-nhan-ho-so",
        label: "Tiếp nhận hồ sơ",
        href: "/admin/tuyen-sinh/ho-so-moi",
      },
      {
        id: "thong-ke-tuyen-sinh",
        label: "Thống kê nguồn",
        href: "/admin/tuyen-sinh/thong-ke",
      },
    ],
  },
  // --- NHÓM TÀI CHÍNH ---
  {
    id: "tai-chinh",
    label: "Tài chính & Học phí",
    icon: "💳",
    children: [
      {
        id: "thu-hoc-phi",
        label: "Thu học phí",
        href: "/admin/tai-chinh/thu-hoc-phi",
      },
      {
        id: "mien-giam-hoc-phi",
        label: "Miễn giảm & Học bổng",
        href: "/admin/tai-chinh/mien-giam",
      },
    ],
  },
  // --- TRUYỀN THÔNG & TIN TỨC ---
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
      {
        id: "quan-ly-media",
        label: "Thư viện ảnh/video",
        href: "/admin/truyen-thong-bao-chi/media",
      },
    ],
  },
  {
    id: "quan-tri-nhan-su",
    label: "Quản trị nhân sự",
    icon: "👔",
    children: [
      {
        id: "quan-ly-nguoi-dung",
        label: "Cán bộ & Nhân viên",
        icon: "👥",
        href: "/admin/users",
      },
      {
        id: "phan-cong-giang-day",
        label: "Phân công giảng dạy",
        icon: "📖",
        href: "/admin/phan-cong-giang-day",
      },
    ],
  },
  // {
  //   id: "quan-ly-co-so-vat-chat",
  //   label: "Quản lý cơ sở vật chất",
  //   icon: "🏢",
  // },
  // --- HỆ THỐNG ---
  {
    id: "he-thong",
    label: "Cài đặt hệ thống",
    icon: "⚙",
    children: [
      {
        id: "cau-hinh-chung",
        label: "Cấu hình chung",
        href: "/admin/settings/general",
      },
      {
        id: "phan-quyen",
        label: "Phân quyền (Roles)",
        href: "/admin/cai-dat/phan-quyen",
      },
      {
        id: "nhat-ky-hoat-dong",
        label: "Nhật ký hệ thống",
        href: "/admin/settings/logs",
      },
    ],
  },
];

export default navItems;
