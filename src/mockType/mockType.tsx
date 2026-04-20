export type TrainingType = "9+" | "Trung cấp nghề" | "Sơ cấp nghề" | "";

export type CurriculumStatus = "active" | "inactive";

// Ngành học
export interface Major {
  id: string;
  name: string;
  department: string;
}

// Chương trình khung
export interface Curriculum {
  code: string;
  name: string;
  version: number;
  trainingType: TrainingType;
  majorId: string;
  status: CurriculumStatus;
}
