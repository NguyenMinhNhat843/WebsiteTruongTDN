import type { MenuItem } from "./types";

export const navData: MenuItem[] = [
  {
    id: "gioi-thieu",
    label: "GIỚI THIỆU",
    href: "#",
    children: [
      {
        id: "gioi-thieu-ve-truong-kt-kt-tran-dai-nghia",
        label: "Giới thiệu về Trường KT-KT Trần Đại Nghĩa",
        href: "/gioi-thieu/ve-truong",
      },
      {
        id: "bo-may-to-chuc",
        label: "Bộ máy tổ chức",
        href: "/gioi-thieu/bo-may-to-chuc",
      },
      {
        id: "tam-nhin-su-mang-gia-tri-cot-loi",
        label: "Tầm nhìn, sứ mệnh, giá trị cốt lõi",
        href: "/gioi-thieu/tam-nhin-su-mang-gia-tri-cot-loi",
      },
      {
        id: "so-do-to-chuc",
        label: "Sơ đồ tổ chức",
        href: "/gioi-thieu/so-do-to-chuc",
      },
      {
        id: "hop-tac-quoc-te",
        label:
          "Trung tâm Đào tạo, Hợp tác quốc tế và Phát triển nguồn nhân lực ASIA",
        href: "/gioi-thieu/hop-tac-quoc-te",
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
        href: "/dao-tao/trinh-do-trung-cap",
      },
      {
        id: "trinh-do-cao-dang",
        label: "Trình độ Cao đẳng",
        href: "/dao-tao/trinh-do-cao-dang",
      },
      {
        id: "trinh-do-dai-hoc-lien-ket",
        label: "Trình độ Đại học liên kết",
        href: "/dao-tao/trinh-do-dai-hoc-lien-ket",
      },
      {
        id: "trinh-do-so-cap",
        label: "Trình độ sơ cấp",
        href: "/dao-tao/trinh-do-so-cap",
      },
      {
        id: "dao-tao-nghe-bo-doi-xuat-ngu",
        label: "Đào tạo nghề cho bộ đội xuất ngũ",
        href: "/dao-tao/bo-doi-xuat-ngu",
      },
      {
        id: "boi-duong-ky-nang-nghiep-vu",
        label: "Bồi dưỡng kỹ năng nghiệp vụ",
        href: "/dao-tao/boi-duong-ky-nang",
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
    href: "/thong-tin-hoc-sinh-sinh-vien",
    children: [
      {
        id: "thoi-khoa-bieu",
        label: "Thời khóa biểu",
        href: "/thoi-khoa-bieu",
      },
      {
        id: "thong-bao",
        label: "Thông báo",
        href: "/thong-bao",
      },
      {
        id: "lich-thi",
        label: "Lịch thi",
        href: "/lich-thi",
      },
      {
        id: "cuu-hoc-sinh-sinh-vien",
        label: "Cứu học sinh - Sinh viên",
        href: "/cuu-hoc-sinh-sinh-vien",
      },
      {
        id: "hoat-dong-hs-sv",
        label: "Hoạt động học sinh - Sinh viên",
        href: "/hoat-dong-hs-sv",
      },
      {
        id: "chia-se-kinh-nghiem",
        label: "Chia sẻ kinh nghiệm",
        href: "/chia-se-kinh-nghiem",
      },
      {
        id: "doanh-nghiep-viec-lam",
        label: "Doanh nghiệp - Việc làm",
        href: "/doanh-nghiep-viec-lam",
      },
    ],
  },
  {
    id: "tuyen-sinh",
    label: "TUYỂN SINH",
    href: "/tuyen-sinh",
    layout: "dropdown", // Hiển thị 1 cột dọc
    children: [
      {
        id: "tuyen-sinh-he-trung-cap-9+",
        label: "Tuyển sinh hệ trung cấp 9+",
        href: "tuyen-sinh/tuyen-sinh-he-trung-cap-9+",
      },
      {
        id: "tuyen-sinh-trung-cap-nghe",
        label: "Tuyển sinh trung cấp nghề",
        href: "tuyen-sinh/tuyen-sinh-trung-cap-nghe",
      },
      {
        id: "tuyen-sinh-dai-hoc-e-learning",
        label: "Tuyển sinh Đại học E-Learning (Học Online)",
        href: "tuyen-sinh/tuyen-sinh-dai-hoc-e-learning",
      },
      {
        id: "tuyen-sinh-cac-lop-nghe-ngan-han",
        label: "Tuyển sinh các lớp nghề ngắn hạn",
        href: "/tuyen-sinh/tuyen-sinh-cac-lop-nghe-ngan-han",
      },
      {
        id: "tuyen-sinh-dao-tao-nghe-cho-bo-doi-xuat-ngu",
        label: "Tuyển sinh đào tạo nghề cho bộ đội xuất ngũ",
        href: "/tuyen-sinh/tuyen-sinh-dao-tao-nghe-cho-bo-doi-xuat-ngu",
      },
      {
        id: "tuyen-sinh-cao-dang-chinh-quy",
        label: "Tuyển sinh cao đẳng chính quy (Bách khoa Sài Gòn)",
        href: "/tuyen-sinh/tuyen-sinh-cao-dang-chinh-quy",
      },
      {
        id: "tuyen-sinh-cao-dang-9+",
        label: "Tuyển sinh cao đẳng 9+ (Bách Khoa Sài Gòn)",
        href: "/tuyen-sinh/tuyen-sinh-cao-dang-9+",
      },
    ],
  },
  {
    id: "lien-he",
    label: "LIÊN HỆ",
    href: "/lien-he",
    children: [
      {
        id: "lien-he-cong-tac",
        label: "Liên hệ công tác",
        href: "/lien-he/cong-tac",
      },
      {
        id: "dang-ky-thong-tin-xet-tuyen-truc-tuyen",
        label: "Đăng ký thông tin xét tuyển trực tuyến",
        href: "/lien-he/dang-ky-thong-tin-xet-tuyen-truc-tuyen",
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
