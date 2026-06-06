/* eslint-disable @typescript-eslint/no-explicit-any */
export type TienDoDaoTaoRow = {
  id: string; // ID độc nhất của dòng (string) phục vụ sinh dòng động
  classSubjectId: number; // ID gốc của môn học từ API để gộp nhóm dữ liệu
  isSubRow?: boolean; // Cờ kiểm tra dòng được thêm để xử lý UI ẩn/hiện hợp lý
  stt?: number;
  tenMonHoc?: string;
  giaoVienGiangDay?: string;
  phongHoc?: string;
  tongGioMonHoc: number; // Tổng số tiết quy chuẩn môn học
  thu?: string;
  tiet?: string;
  [key: string]: any; // Xử lý các cột tuần động tuan_1, tuan_2,...
};
