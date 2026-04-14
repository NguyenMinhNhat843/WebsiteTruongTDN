import type { EnumHeDaoTao } from "../../../type/enum";

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

export interface HocSinh {
  id: string;
  maSoHocSinh: string;
  hoTen: string;
  ngaySinh: string;
  gioiTinh: GioiTinh;
  danToc: string;
  tonGiao: string;
  cccd: string;
  ngayCap: string;
  noiCap: string;
  diaChiThuongTru: string;
  diaChiTamTru: string;
  soDienThoai: string;
  email: string;
  // Gia đình
  hoTenCha: string;
  sdtCha: string;
  ngheNghiepCha: string;
  hoTenMe: string;
  sdtMe: string;
  ngheNghiepMe: string;
  nguoiLienHeKhac: string;
  sdtLienHe: string;
  // Học vấn
  heDaoTao: HeDaoTao;
  nganh: string;
  chuyenNganh: string;
  lop: string;
  khoaHoc: string;
  namNhapHoc: number;
  trangThai: TrangThaiHocSinh;
  hocBongHienTai: string;
  // Sức khỏe
  nhomMau: string;
  chieuCao: number;
  canNang: number;
  tinhTrangSucKhoe: string;
  // Hồ sơ
  daNopHoSo: string[];
  chuaNopHoSo: string[];
  ghiChu: string;
}

export interface HocSinhRow {
  id: string;
  maSoHocSinh: string;
  hoTen: string;
  ngaySinh: string;
  gioiTinh: GioiTinh;
  soDienThoai: string;
  heDaoTao: EnumHeDaoTao;
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
  heDaoTao: EnumHeDaoTao | "";
  trangThai: TrangThaiHocSinh | "";
  lop: string;
  hocBong: "" | "co" | "khong";
  hoSoThieu: "" | "co" | "khong";
}

export interface SortState {
  field: keyof HocSinhRow | "";
  dir: SortDir;
}
