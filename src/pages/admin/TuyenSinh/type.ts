export type TrainingSystem =
  | "trung_cap_nghe"
  | "so_cap_nghe"
  | "cao_dang"
  | "dai_hoc_lien_ket"
  | "dai_hoc"
  | "thac_si";

export type AdmissionStatus = "draft" | "open" | "closed" | "cancelled";

export type AdmissionMethod = "xet_tuyen" | "thi_tuyen" | "ket_hop";

export interface Major {
  id: string;
  name: string;
  quota: number;
  registered: number;
}

export interface AdmissionRound {
  id: string;
  name: string;
  trainingSystem: TrainingSystem;
  admissionMethod: AdmissionMethod;
  openDate: string;
  closeDate: string;
  examDate?: string;
  totalQuota: number;
  totalRegistered: number;
  tuitionFee: number;
  minScore?: number;
  location?: string;
  majors: Major[];
  status: AdmissionStatus;
  note?: string;
  createdAt: string;
}
