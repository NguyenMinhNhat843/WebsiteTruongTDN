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
        label: "Tầm nhì - Sứ mạng - Giá trị cốt lõi",
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
        id: "tin-hoc-ung-dung",
        label: "Tin học ứng dụng",
        href: "/chuong-trinh-dao-tao/tin-hoc-ung-dung",
      },
      {
        id: "tieng-anh-thuong-mai",
        label: "Tiếng Anh thương mại",
        href: "/chuong-trinh-dao-tao/tieng-anh-thuong-mai",
      },
      {
        id: "dich-vu-du-lich",
        label: "Dịch vụ du lịch",
        href: "/chuong-trinh-dao-tao/dich-vu-du-lich",
      },
    ],
  },
  {
    id: "tin-tuc",
    label: "TIN TỨC",
    href: "/tin-tuc",
  },
  {
    id: "lien-he",
    label: "LIÊN HỆ",
    href: "/lien-he-cong-tac",
  },
  {
    id: "tuyen-sinh-online",
    label: "TUYỂN SINH ONLINE",
    href: "/dang-ky-tuyen-sinh",
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
