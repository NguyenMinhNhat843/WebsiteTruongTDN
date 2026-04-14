// ─── Types ────────────────────────────────────────────────────────────────────

export type EduSystem =
  | "cao_dang"
  | "trung_cap"
  | "9_cong_10"
  | "dai_hoc_lien_ket"
  | "day_nghe_ngan_han"
  | "day_nghe_so_cap";

export type Status = "active" | "draft" | "archived";
export type ModuleType =
  | "chung"
  | "co_so"
  | "chuyen_mon"
  | "tu_chon"
  | "thuc_hanh"
  | "thuc_tap";
export type UnitType = "tin_chi" | "don_vi_hoc_trinh" | "gio";

export interface LearningModule {
  id: string;
  code: string;
  name: string;
  units: number;
  unitType: UnitType;
  theory: number;
  practice: number;
  type: ModuleType;
  semester: number;
  prerequisite?: string[];
  isKey?: boolean;
}

export interface Term {
  id: number;
  label: string;
  modules: LearningModule[];
  internship?: boolean;
}

export interface CurriculumFramework {
  id: string;
  code: string;
  name: string;
  major: string;
  eduSystem: EduSystem;
  department: string;
  totalUnits: number;
  unitType: UnitType;
  duration: string;
  terms: Term[];
  status: Status;
  effectiveYear: number;
  issuedBy: string;
  decisionNo: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateFormState = {
  code: string;
  name: string;
  major: string;
  department: string;
  eduSystem: EduSystem;
  totalUnits: number;
  unitType: UnitType;
  duration: string;
  status: Status;
  effectiveYear: number;
  issuedBy: string;
  decisionNo: string;
};
