export interface Exemption {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  system: string;
  type: string;
  typeLabel: string;
  amount: number;
  percentage: number;
  reason: string;
  documents: string[];
  status: "pending" | "approved" | "rejected";
  requestDate: string;
  reviewDate?: string;
  reviewer?: string;
  reviewNote?: string;
  phone: string;
  totalFee: number;
}
