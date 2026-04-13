import type { EnumHeDaoTao } from "../../../type/enum";

export interface Student {
  id: string;
  name: string;
  class: string;
  system: EnumHeDaoTao;
  totalFee: number;
  paid: number;
  remaining: number;
  status: "paid" | "partial" | "unpaid";
  dueDate: string;
  phone: string;
  email: string;
  paymentHistory: Payment[];
}

export interface Payment {
  id: string;
  date: string;
  amount: number;
  method: string;
  receiver: string;
  note: string;
}
