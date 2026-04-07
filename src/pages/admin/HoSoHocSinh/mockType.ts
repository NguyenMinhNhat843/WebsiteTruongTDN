export type HeDaoTao =
  | "Trung cấp nghề"
  | "Sơ cấp nghề"
  | "Cao đẳng"
  | "Đại học liên kết";
export type TrangThaiHocSinh =
  | "Đang học"
  | "Bảo lưu"
  | "Thôi học"
  | "Tốt nghiệp";
export type GioiTinh = "Nam" | "Nữ" | "Khác";
export type SortDir = "asc" | "desc";
export type ViewMode = "table" | "card";

export interface HocSinhRow {
  id: string;
  maSoHocSinh: string;
  hoTen: string;
  ngaySinh: string;
  gioiTinh: GioiTinh;
  soDienThoai: string;
  heDaoTao: HeDaoTao;
  nganh: string;
  lop: string;
  khoaHoc: string;
  trangThai: TrangThaiHocSinh;
  soGiayToNop: number;
  soGiayToChuaNop: number;
  hocBong: boolean;
  diemTB: number;
}

export interface FilterState {
  heDaoTao: HeDaoTao | "";
  trangThai: TrangThaiHocSinh | "";
  lop: string;
  hocBong: "" | "co" | "khong";
  hoSoThieu: "" | "co" | "khong";
}

export interface SortState {
  field: keyof HocSinhRow | "";
  dir: SortDir;
}
