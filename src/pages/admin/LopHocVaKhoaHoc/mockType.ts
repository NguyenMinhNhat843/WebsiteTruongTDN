export const EnumHeDaoTao = {
  "9plus": "Hệ 9+",
  trungcap: "Trung cấp nghề",
  caodang: "Cao đẳng",
  daihoc: "ĐH liên kết",
} as const;
export type HeDaoTao = keyof typeof EnumHeDaoTao;

export const EnumStatus = {
  "Đang học": "Đang học",
  "Đang tuyển": "Đang tuyển",
  "Đã kết thúc": "Đã kết thúc",
} as const;
export type Status = keyof typeof EnumStatus;

export interface LopHoc {
  ma: string;
  ten: string;
  he: HeDaoTao;
  khoa: string;
  nganh: string;
  siso: number;
  max: number;
  status: Status;
  gvcn: string;
}
