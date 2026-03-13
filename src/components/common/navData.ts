import type { MenuItem } from "./types";

export const navData: MenuItem[] = [
  {
    id: "home",
    label: "TRANG CHỦ",
    href: "/",
  },
  {
    id: "gioi-thieu",
    label: "GIỚI THIỆU",
    href: "#",
    children: [
      {
        id: "gioi-thieu-ve-truong-kt-kt-tran-dai-nghia",
        label: "Giới thiệu về Trường KT-KT Trần Đại Nghĩa",
        href: "/gioi-thieu-chung",
      },
      {
        id: "bo-may-to-chuc",
        label: "Bộ máy tổ chức",
        href: "/bo-may-to-chuc",
      },
      {
        id: "tam-nhin-su-mang-gia-tri-cot-loi",
        label: "Tầm nhìn, sứ mệnh, giá trị cốt lõi",
        href: "/tam-nhin-su-mang-gia-tri-cot-loi",
      },
      {
        id: "so-do-to-chuc",
        label: "Sơ đồ tổ chức",
        href: "/so-do-to-chuc",
      },
      {
        id: "hop-tac-quoc-te",
        label:
          "Trung tâm Đào tạo, Hợp tác quốc tế và Phát triển nguồn nhân lực ASIA",
        href: "/hop-tac-quoc-te",
      },
    ],
  },
  {
    id: "dao-tao",
    label: "ĐÀO TẠO",
    href: "#",
    layout: "dropdown",
    children: [
      {
        id: "trinh-do-trung-cap",
        label: "Trình độ Trung cấp",
        href: "/chuong-trinh-dao-tao/trinh-do-trung-cap",
      },
      {
        id: "trinh-do-cao-dang",
        label: "Trình độ Cao đẳng liên kết",
        href: "/chuong-trinh-dao-tao/trinh-do-cao-dang-lien-ket",
      },
      {
        id: "trinh-do-dai-hoc-lien-ket",
        label: "Trình độ Đại học liên kết",
        href: "/chuong-trinh-dao-tao/trinh-do-dai-hoc-lien-ket",
      },
      {
        id: "trinh-do-so-cap",
        label: "Trình độ sơ cấp",
        href: "/chuong-trinh-dao-tao/trinh-do-so-cap",
      },
      {
        id: "dao-tao-nghe-bo-doi-xuat-ngu",
        label: "Đào tạo nghề cho bộ đội xuất ngũ",
        href: "/chuong-trinh-dao-tao/dao-tao-nghe-bo-doi-xuat-ngu",
      },
      {
        id: "boi-duong-ky-nang-nghiep-vu",
        label: "Bồi dưỡng kỹ năng nghiệp vụ",
        href: "/chuong-trinh-dao-tao/boi-duong-ky-nang-quan-ly",
      },
    ],
  },
  {
    id: "tin-tuc",
    label: "TIN TỨC",
    href: "/tin-tuc",
  },
  {
    id: "thong-tin-hoc-sinh-sinh-vien",
    label: "THÔNG TIN HỌC SINH - SINH VIÊN",
    href: "#",
    children: [
      {
        id: "thoi-khoa-bieu",
        label: "Thời khóa biểu",
        href: "#",
      },
      {
        id: "thong-bao",
        label: "Thông báo",
        href: "#",
      },
      {
        id: "lich-thi",
        label: "Lịch thi",
        href: "#",
      },
      {
        id: "cuu-hoc-sinh-sinh-vien",
        label: "Cứu học sinh - Sinh viên",
        href: "#",
      },
      {
        id: "hoat-dong-hs-sv",
        label: "Hoạt động học sinh - Sinh viên",
        href: "#",
      },
      {
        id: "chia-se-kinh-nghiem",
        label: "Chia sẻ kinh nghiệm",
        href: "#",
      },
      {
        id: "doanh-nghiep-viec-lam",
        label: "Doanh nghiệp - Việc làm",
        href: "#",
      },
    ],
  },
  {
    id: "tuyen-sinh",
    label: "TUYỂN SINH",
    href: "#",
    layout: "dropdown", // Hiển thị 1 cột dọc
    children: [
      {
        id: "tuyen-sinh-he-trung-cap-9+",
        label: "Tuyển sinh hệ trung cấp 9+",
        // href: "tuyen-sinh/tuyen-sinh-he-trung-cap-9+",
        href: "#",
      },
      {
        id: "tuyen-sinh-trung-cap-nghe",
        label: "Tuyển sinh trung cấp nghề",
        // href: "tuyen-sinh/tuyen-sinh-trung-cap-nghe",
        href: "#",
      },
      {
        id: "tuyen-sinh-dai-hoc-e-learning",
        label: "Tuyển sinh Đại học E-Learning (Học Online)",
        // href: "tuyen-sinh/tuyen-sinh-dai-hoc-e-learning",
        href: "#",
      },
      {
        id: "tuyen-sinh-cac-lop-nghe-ngan-han",
        label: "Tuyển sinh các lớp nghề ngắn hạn",
        // href: "/tuyen-sinh/tuyen-sinh-cac-lop-nghe-ngan-han",
        href: "#",
      },
      {
        id: "tuyen-sinh-dao-tao-nghe-cho-bo-doi-xuat-ngu",
        label: "Tuyển sinh đào tạo nghề cho bộ đội xuất ngũ",
        // href: "/tuyen-sinh/tuyen-sinh-dao-tao-nghe-cho-bo-doi-xuat-ngu",
        href: "#",
      },
      {
        id: "tuyen-sinh-cao-dang-chinh-quy",
        label: "Tuyển sinh cao đẳng chính quy (Bách khoa Sài Gòn)",
        // href: "/tuyen-sinh/tuyen-sinh-cao-dang-chinh-quy",
        href: "#",
      },
      {
        id: "tuyen-sinh-cao-dang-9+",
        label: "Tuyển sinh cao đẳng 9+ (Bách Khoa Sài Gòn)",
        // href: "/tuyen-sinh/tuyen-sinh-cao-dang-9+",
        href: "#",
      },
    ],
  },
  {
    id: "lien-he",
    label: "LIÊN HỆ",
    href: "/dang-ky-tu-van",
    children: [
      {
        id: "lien-he-cong-tac",
        label: "Liên hệ công tác",
        href: "/dang-ky-tuyen-sinh",
      },
      {
        id: "dang-ky-thong-tin-xet-tuyen-truc-tuyen",
        label: "Đăng ký thông tin xét tuyển trực tuyến",
        href: "/dang-ky-tuyen-sinh",
      },
    ],
  },
  {
    id: "tuyen-dung",
    label: "TUYỂN DỤNG",
    href: "/tuyen-dung",
    children: [
      {
        id: "tuyen-dung-giao-vien",
        label: "Tuyển dụng giáo viên",
        href: "/tuyen-dung/giao-vien",
      },
      {
        id: "tuyen-dung-can-bo-quan-ly",
        label: "Tuyển dụng cán bộ quản lý",
        href: "/tuyen-dung/can-bo-quan-ly",
      },
    ],
  },
];
