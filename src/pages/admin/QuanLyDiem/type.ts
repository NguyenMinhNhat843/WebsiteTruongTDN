export const TRANG_THAI_OPTIONS = [
  "Chờ duyệt",
  "Đã duyệt",
  "Cần chỉnh sửa",
  "Đã khóa",
] as const;
export type TrangThai = (typeof TRANG_THAI_OPTIONS)[number];

export const DIEM_FIELDS = ["chuyenCan", "thuongKy", "gk", "ck"] as const;
export type DiemField = (typeof DIEM_FIELDS)[number];

export interface DiemSinhVien {
  id: number;
  mssv: string;
  hoTen: string;
  monHoc: string;
  chuyenCan: number;
  thuongKy: number;
  gk: number;
  ck: number;
  trangThai: TrangThai;
  daChot: boolean;
}
