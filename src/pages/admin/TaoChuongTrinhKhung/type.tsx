/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TrainingType = "9+" | "Trung cấp nghề" | "Sơ cấp nghề" | "";

export type CurriculumStatus = "active" | "inactive";

export interface Major {
  id: string;
  name: string;
  department: string;
}

export interface Curriculum {
  code: string;
  name: string;
  version: number;
  trainingType: TrainingType;
  majorId: string;
  status: CurriculumStatus;
}

export const MAJORS: Major[] = [
  { id: "cntt", name: "Công nghệ thông tin", department: "Khoa Công nghệ" },
  { id: "ktoto", name: "Kỹ thuật ô tô", department: "Khoa Cơ khí" },
  { id: "qtks", name: "Quản trị khách sạn", department: "Khoa Du lịch" },
  { id: "tkdh", name: "Thiết kế đồ họa", department: "Khoa Mỹ thuật" },
];
