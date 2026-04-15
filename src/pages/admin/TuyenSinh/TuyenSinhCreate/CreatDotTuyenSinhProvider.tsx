import { useState } from "react";
import { createContextProvider } from "../../../../util/createContextProvider";
import type { AdmissionRound, Major } from "../type";

const EMPTY_FORM: Omit<AdmissionRound, "id" | "createdAt"> = {
  name: "",
  trainingSystem: "trung_cap_nghe",
  admissionMethod: "xet_tuyen",
  openDate: "",
  closeDate: "",
  examDate: "",
  totalQuota: 0,
  totalRegistered: 0,
  tuitionFee: 0,
  minScore: undefined,
  location: "",
  majors: [],
  status: "draft",
  note: "",
};

interface AdmissionProps {
  initial?: AdmissionRound | null; // Tham số 1
}

export const [CreateDotTuyenSinhProvider, useCreateDotTuyenSinhContext] =
  createContextProvider(({ initial }: AdmissionProps) => {
    const [form, setForm] = useState<Omit<AdmissionRound, "id" | "createdAt">>(
      initial
        ? {
            name: initial.name,
            trainingSystem: initial.trainingSystem,
            admissionMethod: initial.admissionMethod,
            openDate: initial.openDate,
            closeDate: initial.closeDate,
            examDate: initial.examDate ?? "",
            totalQuota: initial.totalQuota,
            totalRegistered: initial.totalRegistered,
            tuitionFee: initial.tuitionFee,
            minScore: initial.minScore,
            location: initial.location ?? "",
            majors: initial.majors,
            status: initial.status,
            note: initial.note ?? "",
          }
        : { ...EMPTY_FORM },
    );

    const [majorInput, setMajorInput] = useState<{
      name: string;
      quota: string;
    }>({ name: "", quota: "" });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
      setForm((f) => ({ ...f, [k]: v }));

    const validate = () => {
      const e: Record<string, string> = {};
      if (!form.name.trim()) e.name = "Vui lòng nhập tên đợt tuyển sinh";
      if (!form.openDate) e.openDate = "Vui lòng chọn ngày mở";
      if (!form.closeDate) e.closeDate = "Vui lòng chọn ngày đóng";
      if (form.openDate && form.closeDate && form.openDate >= form.closeDate)
        e.closeDate = "Ngày đóng phải sau ngày mở";
      if (form.totalQuota <= 0) e.totalQuota = "Chỉ tiêu phải lớn hơn 0";
      if (form.tuitionFee < 0) e.tuitionFee = "Học phí không hợp lệ";
      setErrors(e);
      return Object.keys(e).length === 0;
    };

    const handleSave = () => {
      if (!validate()) return;
    };

    const addMajor = () => {
      const name = majorInput.name.trim();
      const quota = parseInt(majorInput.quota, 10);
      if (!name || isNaN(quota) || quota <= 0) return;
      const newMajor: Major = {
        id: `m${Date.now()}`,
        name,
        quota,
        registered: 0,
      };
      set("majors", [...form.majors, newMajor]);
      setMajorInput({ name: "", quota: "" });
    };

    const removeMajor = (id: string) =>
      set(
        "majors",
        form.majors.filter((m) => m.id !== id),
      );

    const inputCls = (field: string) =>
      `w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        errors[field] ? "border-red-400 bg-red-50" : "border-gray-200"
      }`;

    return {
      form,
      setForm,
      majorInput,
      setMajorInput,
      errors,
      setErrors,
      set,
      validate,
      handleSave,
      addMajor,
      removeMajor,
      inputCls,
      initial,
    };
  });
