export interface Application {
  id: string;
  applicantName: string;
  birthDate: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
  idCard: string;
  batch: string;
  batchLabel: string;
  system: string;
  major: string;
  graduationYear: string;
  previousSchool: string;
  gpa: number;
  status: "submitted" | "reviewing" | "approved" | "rejected";
  submitDate: string;
  reviewDate?: string;
  reviewer?: string;
  documents: {
    name: string;
    uploaded: boolean;
  }[];
  notes?: string;
}

export type BatchStat = {
  batch: string;
  total: number;
  approved: number;
  pending: number;
};

export type SystemStat = {
  system: string;
  count: number;
  approved: number;
};
