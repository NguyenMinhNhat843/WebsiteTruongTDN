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
