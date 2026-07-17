export interface DataRow {
  monHocId: number;
  tenMonHoc: string;
  giaoVienGiangDay: string;
  giaoVienGiangDayId: number;
  tinChi: number;
  tongSoTiet: number;
  sessions: {
    maPhongHoc: string;
    idPhongHoc: number;
    thu: string;
    tiet: string;
    [week: string]: any;
  }[];
}
