export const EnumAudience = {
  TOAN_TRUONG: "toan-truong",
  HOC_SINH: "hoc-sinh",
  GIAO_VIEN: "giao-vien",
} as const;
export type EnumAudience = (typeof EnumAudience)[keyof typeof EnumAudience];

export const EnumCategoryPost = {
  THONG_BAO: "thong-bao",
  TUYEN_SINH: "tuyen-sinh",
  TUYEN_DUNG: "tuyen-dung",
  SU_KIEN: "su-kien",
  HOC_TAP: "hoc-tap",
  TIN_TUC: "tin-tuc",
} as const;
export type EnumCategoryPost =
  (typeof EnumCategoryPost)[keyof typeof EnumCategoryPost];

export const EnumTrangThaiHocPhi = {
  PAID: "paid",
  PARTIAL: "partial",
  UNPAID: "unpaid",
} as const;
export type EnumTrangThaiHocPhi =
  (typeof EnumTrangThaiHocPhi)[keyof typeof EnumTrangThaiHocPhi];

export const EnumHeDaoTao = {
  HE_9: "he9",
  TRUNG_CAP_NGHE: "trungCapNghenghiep",
  SOCAPNGHE: "socapnghe",
  DAI_HOC_LIEN_KET: "daiHocLienKet",
  CAO_DANG: "caoDang",
} as const;
export type EnumHeDaoTao = (typeof EnumHeDaoTao)[keyof typeof EnumHeDaoTao];

export const EnumExemptionStatus = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
} as const;
export type EnumExemptionStatus =
  (typeof EnumExemptionStatus)[keyof typeof EnumExemptionStatus];
