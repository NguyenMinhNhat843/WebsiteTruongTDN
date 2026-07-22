import type { NavItem } from "../../../components/navTree/navTree.type";

const navItems: NavItem[] = [
  {
    id: "home",
    label: "Home",
    icon: "⬡",
    href: "/admin/home",
    roles: ["admin", "teacher", "student", "staff"], // Tất cả mọi người đều xem được trang Home
  },
  // --- NHÓM ĐÀO TẠO & HỌC TẬP ---
  {
    id: "quan-ly-dao-tao",
    label: "Quản lý Đào tạo",
    icon: "📚",
    children: [
      {
        id: "chuong-trinh-khung",
        label: "Chương trình khung",
        href: "/admin/dao-tao/chuong-trinh-khung",
        roles: ["admin", "staff"], // Chỉ Admin và Staff Đào tạo được cấu hình gốc
      },
      {
        id: "tao-chuong-trinh-khung",
        label: "Tạo chương trình khung",
        href: "/admin/dao-tao/tao-chuong-trinh-khung",
        roles: ["admin", "staff"],
      },
      {
        id: "mon-hoc",
        label: "Môn học",
        href: "/admin/mon-hoc",
        roles: ["admin", "staff", "teacher"], // Giáo viên cần vào xem danh sách môn được phân công
      },
      {
        id: "lop-hoc",
        label: "Lớp học",
        href: "/admin/dao-tao/lop-hoc",
        roles: ["admin", "staff", "teacher"], // Giáo viên cần vào quản lý lớp chủ nhiệm/bộ môn
      },
      {
        id: "diem-ren-luyen",
        label: "Điểm rèn luyện",
        href: "/admin/diem-ren-luyen",
        roles: ["admin", "staff"],
      },
      {
        id: "tien-do-dao-tao",
        label: "Tiến độ đào tạo",
        href: "/admin/dao-tao/tien-do-dao-tao",
        roles: ["admin", "staff", "teacher"],
      },
      {
        id: "thoi-khoa-bieu",
        label: "Thời khóa biểu",
        href: "/admin/dao-tao/thoi-khoa-bieu",
        roles: ["admin", "staff", "teacher"],
      },
    ],
  },
  // --- NHÓM DANH MỤC (TÁCH HẲN RA CẤP 1) ---
  {
    id: "danh-muc-he-thong",
    label: "Danh mục",
    icon: "🗂️",
    roles: ["admin", "staff"], // Chỉ Admin và Staff quản lý danh mục chung
    children: [
      {
        id: "khoa",
        label: "Khoa",
        href: "/admin/dao-tao/khoa",
        roles: ["admin", "staff"],
      },
      {
        id: "khoa-dao-tao",
        label: "Khóa đào tạo",
        href: "/admin/khoa-dao-tao",
        roles: ["admin", "staff"],
      },
      {
        id: "nganh",
        label: "Ngành học",
        href: "/admin/nganh-hoc",
        roles: ["admin", "staff"],
      },
      {
        id: "phong-hoc",
        label: "Phòng học",
        href: "/admin/phong-hoc",
        roles: ["admin", "staff"],
      },
      {
        id: "nam-hoc",
        label: "Năm học",
        href: "/admin/nam-hoc",
        roles: ["admin", "staff"],
      },
      {
        id: "hoc-ky",
        label: "Học kỳ",
        href: "/admin/hoc-ky",
        roles: ["admin", "staff"],
      },
      {
        id: "dia-chi",
        label: "Địa chỉ",
        href: "/admin/dia-chi",
        roles: ["admin", "staff"],
      },
      {
        id: "tieu-chi-danh-gia-diem-ren-luyen",
        label: "Tiêu chí đánh giá điểm rèn luyện",
        href: "/admin/diem-ren-luyen/tieu-chi-danh-gia",
        roles: ["admin", "staff"],
      },
    ],
  },
  {
    id: "hoc-phi",
    label: "Học phí",
    icon: "💰",
    children: [
      {
        id: "dot-hoc-phi",
        label: "Đợt học phí",
        href: "/admin/hoc-phi",
        roles: ["admin", "staff"],
      },
      {
        id: "tong-quan-hoc-phi",
        label: "Tổng quan học phí",
        href: "/admin/hoc-phi/tong-quan",
        roles: ["admin", "staff"],
      },
    ],
  },
  // --- NHÓM TUYỂN SINH ---
  {
    id: "quan-ly-tuyen-sinh",
    label: "Tuyển sinh",
    icon: "🎯",
    roles: ["admin", "staff"],
    children: [
      {
        id: "dot-tuyen-sinh",
        label: "Đợt tuyển sinh",
        href: "/admin/tuyen-sinh/dot-tuyen-sinh",
        roles: ["admin", "staff"],
      },
      {
        id: "to-hop-mon",
        label: "Tổ hợp môn xét tuyển",
        href: "/admin/tuyen-sinh/to-hop-mon",
        roles: ["admin", "staff"],
      },
      {
        id: "ho-so-tuyen-sinh",
        label: "Quản lý hồ sơ tuyển sinh",
        href: "/admin/tuyen-sinh/ho-so-tuyen-sinh",
        roles: ["admin", "staff"],
      },
      {
        id: "tao-ho-so-tuyen-sinh",
        label: "Tạo hồ sơ mới",
        href: "/admin/tuyen-sinh/ho-so-tuyen-sinh/tao-moi",
        roles: ["admin", "staff"],
      },
      {
        id: "cau-hinh-tuyen-sinh",
        label: "Cấu hình & Tư vấn tuyển sinh",
        href: "/admin/tuyen-sinh/cau-hinh-tuyen-sinh",
        roles: ["admin", "staff"],
      },
    ],
  },
  // --- NHÓM CÔNG TÁC HỌC SINH & TUYỂN SINH ---
  {
    id: "quan-ly-hoc-sinh",
    label: "Công tác Học sinh",
    icon: "🎓",
    roles: ["admin", "staff", "teacher"],
    children: [
      {
        id: "ho-so-hoc-sinh",
        label: "Hồ sơ học sinh",
        href: "/admin/hoc-sinh/ho-so",
        roles: ["admin", "staff"],
      },
      {
        id: "ho-so-hoc-sinh/create",
        label: "Tạo hồ sơ học sinh",
        href: "/admin/hoc-sinh/ho-so/create",
        roles: ["admin", "staff"],
      },
      {
        id: "phan-lop",
        label: "Phân lớp",
        href: "/admin/hoc-sinh/phan-lop",
        roles: ["admin", "staff"],
      },
    ],
  },
  // --- TRUYỀN THÔNG & TIN TỨC ---
  {
    id: "truyen-thong-bao-chi",
    label: "Truyền thông",
    icon: "📰",
    roles: ["admin", "staff"],
    children: [
      {
        id: "bai-viet",
        label: "Bài viết",
        href: "/admin/truyen-thong-bao-chi/bai-viet",
        roles: ["admin", "staff"],
      },
      {
        id: "tao-bai-viet",
        label: "Tạo bài viết",
        href: "/admin/truyen-thong-bao-chi/tao-bai-viet",
        roles: ["admin", "staff"],
      },
    ],
  },
  // --- QUẢN TRỊ NHÂN SỰ ---
  {
    id: "quan-tri-giang-vien",
    label: "Quản trị giảng viên",
    icon: "👔",
    roles: ["admin"],
    children: [
      {
        id: "quan-ly-nguoi-dung",
        label: "Quản lý giảng viên",
        icon: "👥",
        href: "/admin/users",
        roles: ["admin"],
      },
      {
        id: "quan-ly-tai-khoan",
        label: "Quản lý tài khoản",
        icon: "🔐",
        href: "/admin/account",
        roles: ["admin"],
      },
    ],
  },
  // --- HỆ THỐNG ---
  {
    id: "he-thong",
    label: "Cài đặt hệ thống",
    icon: "⚙",
    roles: ["admin"],
    children: [
      {
        id: "cau-hinh-chung",
        label: "Cấu hình chung",
        href: "/admin/cai-dat/cau-hinh-chung",
        roles: ["admin"],
      },
      {
        id: "huong-dan-su-dung",
        label: "Hướng dẫn sử dụng",
        href: "/admin/cai-dat/huong-dan-su-dung",
        roles: ["admin", "student", "teacher", "staff"],
      },
    ],
  },
];

export default navItems;
