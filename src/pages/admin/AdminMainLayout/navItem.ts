import type { NavItem } from "../../../components/navTree/navTree.type";

const navItems: NavItem[] = [
  {
    id: "home",
    label: "Home",
    icon: "⬡",
    href: "/admin/home",
    roles: ["admin", "teacher", "student"],
  },
  // --- NHÓM ĐÀO TẠO & HỌC TẬP ---
  {
    id: "quan-ly-dao-tao",
    label: "Quản lý Đào tạo",
    icon: "📚",
    roles: ["admin", "teacher"],
    children: [
      {
        id: "chuong-trinh-khung",
        label: "Chương trình khung",
        href: "/admin/dao-tao/chuong-trinh-khung",
        roles: ["admin"],
      },
      {
        id: "tao-chuong-trinh-khung",
        label: "Tạo chương trình khung",
        href: "/admin/dao-tao/tao-chuong-trinh-khung",
        roles: ["admin", "teacher"],
      },
      {
        id: "lop-hoc",
        label: "Lớp học",
        href: "/admin/dao-tao/lop-hoc",
      },
      {
        id: "khoa",
        label: "Khoa",
        href: "/admin/dao-tao/khoa",
        roles: ["admin", "teacher"],
      },
      {
        id: "mon-hoc",
        label: "Môn học",
        href: "/admin/mon-hoc",
        roles: ["admin", "teacher"],
      },
      {
        id: "khoa-dao-tao",
        label: "Khóa đào tạo",
        href: "/admin/khoa-dao-tao",
        roles: ["admin", "teacher"],
      },
      {
        id: "nganh",
        label: "Ngành học",
        href: "/admin/nganh-hoc",
        roles: ["admin", "teacher"],
      },
      {
        id: "hoc-ky",
        label: "Học kỳ",
        href: "/admin/hoc-ky",
        roles: ["admin", "teacher"],
      },
      {
        id: "tieu-chuan-tuyen-sinh",
        label: "Tiêu chuẩn tuyển sinh",
        href: "/admin/tieu-chuan-tuyen-sinh",
        roles: ["admin", "teacher"],
      },
      {
        id: "tien-do-dao-tao",
        label: "Tiến độ đào tạo",
        href: "/admin/dao-tao/tien-do-dao-tao",
        roles: ["admin", "teacher"],
      },
      {
        id: "thoi-khoa-bieu",
        label: "Thời khóa biểu",
        href: "/admin/dao-tao/thoi-khoa-bieu",
        roles: ["admin", "teacher"],
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
        id: "phan-lop",
        label: "Phân lớp",
        href: "/admin/hoc-sinh/phan-lop",
      },
      {
        id: "quan-ly-tot-nghiep",
        label: "Xét tốt nghiệp",
        href: "/admin/hoc-sinh/tot-nghiep",
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
    roles: ["admin"],
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
    roles: ["admin"],
    children: [
      {
        id: "quan-ly-nguoi-dung",
        label: "Cán bộ & Nhân viênssss",
        icon: "👥",
        href: "/admin/users",
      },
      {
        id: "quan-ly-tai-khoan",
        label: "Quản lý tài khoản",
        icon: "🔐",
        href: "/admin/account",
      },
      {
        id: "phan-cong-giang-day",
        label: "Phân công giảng dạy",
        icon: "📖",
        href: "/admin/phan-cong-giang-day",
      },
    ],
  },
  {
    id: "he-thong",
    label: "Cài đặt hệ thống",
    icon: "⚙",
    roles: ["admin"],
    children: [
      {
        id: "phan-quyen",
        label: "Phân quyền (Roles)",
        href: "/admin/cai-dat/phan-quyen",
        roles: ["admin"],
      },
      {
        id: "nhat-ky-hoat-dong",
        label: "Nhật ký hệ thống",
        href: "/admin/nhat-ky-he-thong",
        roles: ["admin"],
      },
    ],
  },
];

export default navItems;
