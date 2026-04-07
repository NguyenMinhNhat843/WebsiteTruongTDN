import type { DiemField, DiemSinhVien, TrangThai } from "../type";

export type DiemEditableFields = Pick<DiemSinhVien, DiemField | "trangThai">;

export type DiemBufferRow = {
  chuyenCan: string;
  thuongKy: string;
  gk: string;
  ck: string;
  trangThai: TrangThai;
};

export type EditBuffer = Record<DiemSinhVien["id"], DiemBufferRow>;
