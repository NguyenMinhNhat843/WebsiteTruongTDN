import { useMemo, useState } from "react";
import { createContextProvider } from "../../../util/createContextProvider";

// ================= MOCK DATA =================
export const SUBJECTS = [
  { id: 1, name: "OOP", credits: 3 },
  { id: 2, name: "Data Structure", credits: 3 },
  { id: 3, name: "Math", credits: 2 },
  { id: 4, name: "Database", credits: 3 },
  { id: 5, name: "English", credits: 2 },
];

export const MAJORS = [
  { id: 1, name: "CNTT", department: "Khoa Công nghệ thông tin" },
  { id: 2, name: "Kế toán", department: "Khoa Kinh tế" },
];

export const TRAINING_TYPES = ["9+", "Trung cấp nghề", "Sơ cấp nghề"];

export const [TaoChuongTrinhKhungProvider, useTaoChuongTrinhKhungContext] =
  createContextProvider(() => {
    const [curriculum, setCurriculum] = useState({
      code: "",
      name: "",
      version: 1,
      trainingType: "",
      status: "active",
      majorId: "",
      semesters: [
        { id: 1, subjects: [] },
        { id: 2, subjects: [] },
      ],
    });

    const selectedMajor = MAJORS.find(
      (m) => m.id === Number(curriculum.majorId),
    );

    // ===== AUTO CALC =====
    const totalCredits = useMemo(() => {
      return curriculum.semesters.reduce(
        (sum, s) =>
          sum +
          s.subjects.reduce((s2: number, sub: any) => s2 + sub.credits, 0),
        0,
      );
    }, [curriculum]);

    const totalSemesters = curriculum.semesters.length;

    // ===== ACTIONS =====
    const addSemester = () => {
      const nextId = curriculum.semesters.length + 1;
      setCurriculum({
        ...curriculum,
        semesters: [...curriculum.semesters, { id: nextId, subjects: [] }],
      });
    };

    const addSubject = (semesterId: number, subject: any) => {
      // tránh trùng môn toàn CTK
      const exists = curriculum.semesters.some((s) =>
        s.subjects.some((sub: any) => sub.id === subject.id),
      );
      if (exists) return alert("Môn đã tồn tại!");

      setCurriculum({
        ...curriculum,
        semesters: curriculum.semesters.map((s) =>
          s.id === semesterId
            ? { ...s, subjects: [...s.subjects, subject] }
            : s,
        ),
      });
    };

    const moveSubject = (from: number, to: number, subjectId: number) => {
      let moved: any;

      const updated = curriculum.semesters.map((s) => {
        if (s.id === from) {
          return {
            ...s,
            subjects: s.subjects.filter((sub: any) => {
              if (sub.id === subjectId) moved = sub;
              return sub.id !== subjectId;
            }),
          };
        }
        return s;
      });

      const final = updated.map((s) =>
        s.id === to ? { ...s, subjects: [...s.subjects, moved] } : s,
      );

      setCurriculum({ ...curriculum, semesters: final });
    };
    return {
      curriculum,
      setCurriculum,
      selectedMajor,
      totalCredits,
      totalSemesters,
      addSemester,
      addSubject,
      moveSubject,
    };
  });
