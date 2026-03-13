export type CategoryPost =
  | "Tin tuyển sinh"
  | "Tin tức - Sự kiện"
  | "Tin tuyển dụng";

export interface Post {
  id?: string;
  title?: string;
  slug?: string;
  category?: CategoryPost;
  image?: string;
  summary?: string;
  content?: string; // Nội dung HTML
  status?: string;
  published_at?: string;
}

export type Role =
  | "Lãnh đạo nhà trường"
  | "Phòng Tài chính - Kế toán"
  | "Phòng Đào tạo - Quản sinh"
  | "Phòng Hành chính - Nhân sự";

export interface Employee {
  readonly id: string;
  fullName: string;
  position: Role;
  phoneNumber: string;
  email: string;
  avatar?: string;
}
