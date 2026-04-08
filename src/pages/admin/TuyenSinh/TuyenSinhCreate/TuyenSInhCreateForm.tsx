import { useState } from "react";
import type {
  AdmissionMethod,
  AdmissionRound,
  AdmissionStatus,
  Major,
  TrainingSystem,
} from "../type";
import {
  METHOD_LABELS,
  STATUS_LABELS,
  TRAINING_SYSTEM_LABELS,
} from "../constants";

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

function AdmissionForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: AdmissionRound;
  onSave: (data: Omit<AdmissionRound, "id" | "createdAt">) => void;
  onCancel: () => void;
}) {
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

  const [majorInput, setMajorInput] = useState<{ name: string; quota: string }>(
    { name: "", quota: "" },
  );
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
    const totalQuota =
      form.majors.reduce((s, m) => s + m.quota, 0) || form.totalQuota;
    onSave({ ...form, totalQuota });
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

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">
        {initial ? "Chỉnh sửa đợt tuyển sinh" : "Tạo đợt tuyển sinh mới"}
      </h2>

      {/* Basic info */}
      <section className="space-y-4">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
          Thông tin cơ bản
        </h3>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Tên đợt tuyển sinh *
          </label>
          <input
            className={inputCls("name")}
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="VD: Đợt tuyển sinh Cao đẳng - Kỳ 1/2025"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Hệ đào tạo *
            </label>
            <select
              className={inputCls("trainingSystem")}
              value={form.trainingSystem}
              onChange={(e) =>
                set("trainingSystem", e.target.value as TrainingSystem)
              }
            >
              {(
                Object.entries(TRAINING_SYSTEM_LABELS) as [
                  TrainingSystem,
                  string,
                ][]
              ).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Hình thức xét tuyển *
            </label>
            <select
              className={inputCls("admissionMethod")}
              value={form.admissionMethod}
              onChange={(e) =>
                set("admissionMethod", e.target.value as AdmissionMethod)
              }
            >
              {(
                Object.entries(METHOD_LABELS) as [AdmissionMethod, string][]
              ).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Trạng thái
          </label>
          <select
            className={inputCls("status")}
            value={form.status}
            onChange={(e) => set("status", e.target.value as AdmissionStatus)}
          >
            {(Object.entries(STATUS_LABELS) as [AdmissionStatus, string][]).map(
              ([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ),
            )}
          </select>
        </div>
      </section>

      {/* Dates */}
      <section className="space-y-4">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
          Thời gian
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Ngày mở *
            </label>
            <input
              type="date"
              className={inputCls("openDate")}
              value={form.openDate}
              onChange={(e) => set("openDate", e.target.value)}
            />
            {errors.openDate && (
              <p className="text-red-500 text-xs mt-1">{errors.openDate}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Ngày đóng *
            </label>
            <input
              type="date"
              className={inputCls("closeDate")}
              value={form.closeDate}
              onChange={(e) => set("closeDate", e.target.value)}
            />
            {errors.closeDate && (
              <p className="text-red-500 text-xs mt-1">{errors.closeDate}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Ngày thi (nếu có)
            </label>
            <input
              type="date"
              className={inputCls("examDate")}
              value={form.examDate ?? ""}
              onChange={(e) => set("examDate", e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Quota & Fee */}
      <section className="space-y-4">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
          Chỉ tiêu & Học phí
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Tổng chỉ tiêu *
            </label>
            <input
              type="number"
              min={0}
              className={inputCls("totalQuota")}
              value={form.totalQuota}
              onChange={(e) => set("totalQuota", parseInt(e.target.value) || 0)}
            />
            {errors.totalQuota && (
              <p className="text-red-500 text-xs mt-1">{errors.totalQuota}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Học phí (VNĐ/năm)
            </label>
            <input
              type="number"
              min={0}
              className={inputCls("tuitionFee")}
              value={form.tuitionFee}
              onChange={(e) => set("tuitionFee", parseInt(e.target.value) || 0)}
            />
            {errors.tuitionFee && (
              <p className="text-red-500 text-xs mt-1">{errors.tuitionFee}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Điểm chuẩn tối thiểu
            </label>
            <input
              type="number"
              min={0}
              max={30}
              step={0.5}
              className={inputCls("minScore")}
              value={form.minScore ?? ""}
              onChange={(e) =>
                set(
                  "minScore",
                  e.target.value ? parseFloat(e.target.value) : undefined,
                )
              }
            />
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="space-y-4">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
          Địa điểm & Ghi chú
        </h3>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Địa điểm thi / học
          </label>
          <input
            className={inputCls("location")}
            value={form.location ?? ""}
            onChange={(e) => set("location", e.target.value)}
            placeholder="VD: Cơ sở 1 - 123 Nguyễn Huệ, TP. Nha Trang"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Ghi chú
          </label>
          <textarea
            rows={2}
            className={`${inputCls("note")} resize-none`}
            value={form.note ?? ""}
            onChange={(e) => set("note", e.target.value)}
            placeholder="Thông tin thêm về đợt tuyển sinh..."
          />
        </div>
      </section>

      {/* Majors */}
      <section className="space-y-3">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
          Ngành / Nghề tuyển sinh
        </h3>
        {form.majors.length > 0 && (
          <div className="border border-gray-100 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 font-medium text-gray-600">
                    Tên ngành
                  </th>
                  <th className="text-right px-4 py-2 font-medium text-gray-600">
                    Chỉ tiêu
                  </th>
                  <th className="px-3 py-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {form.majors.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-gray-800">{m.name}</td>
                    <td className="px-4 py-2 text-right font-medium text-gray-700">
                      {m.quota}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <button
                        onClick={() => removeMajor(m.id)}
                        className="text-red-400 hover:text-red-600 transition-colors text-xs"
                      >
                        Xoá
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="flex gap-2">
          <input
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Tên ngành / nghề"
            value={majorInput.name}
            onChange={(e) =>
              setMajorInput((p) => ({ ...p, name: e.target.value }))
            }
            onKeyDown={(e) => e.key === "Enter" && addMajor()}
          />
          <input
            type="number"
            min={1}
            className="w-24 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Chỉ tiêu"
            value={majorInput.quota}
            onChange={(e) =>
              setMajorInput((p) => ({ ...p, quota: e.target.value }))
            }
            onKeyDown={(e) => e.key === "Enter" && addMajor()}
          />
          <button
            onClick={addMajor}
            className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
          >
            + Thêm
          </button>
        </div>
      </section>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
        <button
          onClick={onCancel}
          className="px-5 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Huỷ
        </button>
        <button
          onClick={handleSave}
          className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {initial ? "Lưu thay đổi" : "Tạo đợt tuyển sinh"}
        </button>
      </div>
    </div>
  );
}

export default AdmissionForm;
