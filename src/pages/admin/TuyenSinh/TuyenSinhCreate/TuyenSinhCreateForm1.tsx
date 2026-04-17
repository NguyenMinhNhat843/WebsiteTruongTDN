import type {
  AdmissionMethod,
  AdmissionRound,
  AdmissionStatus,
  TrainingSystem,
} from "../type";
import {
  METHOD_LABELS,
  STATUS_LABELS,
  TRAINING_SYSTEM_LABELS,
} from "../constants";
import {
  CreateDotTuyenSinhProvider,
  useCreateDotTuyenSinhContext,
} from "./CreatDotTuyenSinhProvider";
import Input from "../../../../components/ui/Form/Input";
import { SelectOption } from "../../../../components/ui/Form/SelectOption";
import DateInput from "../../../../components/ui/Form/DateInput";
import ButtonAction from "../../../../components/ui/ButtonAction";
import { Plus } from "lucide-react";

const CreateDotTuyenSinh = ({
  initial,
  onCancel,
}: {
  initial?: AdmissionRound;
  onCancel: () => void;
}) => {
  return (
    <CreateDotTuyenSinhProvider initial={initial}>
      <Inner onCancel={onCancel} />
    </CreateDotTuyenSinhProvider>
  );
};

function Inner({ onCancel }: { onCancel: () => void }) {
  const {
    addMajor,
    errors,
    form,
    handleSave,
    inputCls,
    majorInput,
    removeMajor,
    set,
    setMajorInput,
    initial,
  } = useCreateDotTuyenSinhContext();

  return (
    <div className="bg-white rounded-2xl border border-gray-100 flex flex-col max-h-[90vh] overflow-hidden">
      {/* HEADER: Cố định */}
      <div className="p-6 border-b border-gray-50">
        <h2 className="text-lg font-semibold">
          {initial ? "Chỉnh sửa đợt tuyển sinh" : "Tạo đợt tuyển sinh mới"}
        </h2>
      </div>

      {/* BODY: Cho phép cuộn */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        {/* Basic info */}
        <section className="space-y-4">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Thông tin cơ bản
          </h3>
          <Input
            label="Tên đợt tuyển sinh"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="VD: Đợt tuyển sinh Cao đẳng - Kỳ 1/2025"
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <SelectOption
              label="Hệ đào tạo *"
              options={Object.entries(TRAINING_SYSTEM_LABELS).map(([k, v]) => ({
                value: k,
                label: v,
              }))}
              value={form.trainingSystem}
              onChange={(e) =>
                set("trainingSystem", e.target.value as TrainingSystem)
              }
            />
            <SelectOption
              label="Hình thức xét tuyển *"
              options={Object.entries(METHOD_LABELS).map(([k, v]) => ({
                value: k,
                label: v,
              }))}
              value={form.admissionMethod}
              onChange={(e) =>
                set("admissionMethod", e.target.value as AdmissionMethod)
              }
            />
            <SelectOption
              label="Trạng thái"
              options={Object.entries(STATUS_LABELS).map(([k, v]) => ({
                value: k,
                label: v,
              }))}
              value={form.status}
              onChange={(e) => set("status", e.target.value as AdmissionStatus)}
            />
          </div>
        </section>

        {/* Dates */}
        <section className="space-y-4">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Thời gian
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {(
              [
                { id: "openDate", label: "Ngày mở *" },
                { id: "closeDate", label: "Ngày đóng *" },
                { id: "examDate", label: "Ngày thi (nếu có)" },
              ] as const
            ).map((field) => (
              <DateInput
                key={field.id}
                label={field.label}
                value={(form[field.id as keyof typeof form] as string) ?? ""}
                onChange={(e) => set(field.id as any, e.target.value)}
                error={errors[field.id as keyof typeof errors]}
              />
            ))}
          </div>
        </section>

        {/* Quota & Fee */}
        <section className="space-y-4">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Chỉ tiêu & Học phí
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Tổng chỉ tiêu *"
              type="number"
              value={form.totalQuota}
              onChange={(e) => set("totalQuota", parseInt(e.target.value) || 0)}
              error={errors.totalQuota}
            />
            <Input
              label="Học phí (VNĐ/năm)"
              type="number"
              value={form.tuitionFee}
              onChange={(e) => set("tuitionFee", parseInt(e.target.value) || 0)}
            />
            <Input
              label="Điểm chuẩn tối thiểu"
              type="number"
              step={0.5}
              value={form.minScore ?? ""}
              onChange={(e) =>
                set(
                  "minScore",
                  e.target.value ? parseFloat(e.target.value) : undefined,
                )
              }
            />
          </div>
        </section>

        {/* Location */}
        <section className="space-y-4">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Địa điểm & Ghi chú
          </h3>
          <Input
            label="Đại điểm thi/học"
            value={form.location ?? ""}
            onChange={(e) => set("location", e.target.value)}
            placeholder="VD: Cơ sở 1 - 123 Nguyễn Huệ..."
          />
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Ghi chú
            </label>
            <textarea
              rows={2}
              className={`${inputCls("note")} resize-none`}
              value={form.note ?? ""}
              onChange={(e) => set("note", e.target.value)}
            />
          </div>
        </section>

        {/* Majors */}
        <section className="space-y-3 pb-4">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Ngành tuyển sinh
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
            <Input
              placeholder="Tên ngành / nghề"
              value={majorInput.name}
              onChange={(e) =>
                setMajorInput((p) => ({ ...p, name: e.target.value }))
              }
              onKeyDown={(e) => e.key === "Enter" && addMajor()}
            />
            <Input
              type="number"
              containerClassName="!w-32"
              placeholder="Chỉ tiêu"
              value={majorInput.quota}
              onChange={(e) =>
                setMajorInput((p) => ({ ...p, quota: e.target.value }))
              }
              onKeyDown={(e) => e.key === "Enter" && addMajor()}
            />
            <ButtonAction onClick={addMajor} icon={<Plus size={16} />}>
              Thêm
            </ButtonAction>
          </div>
        </section>
      </div>

      {/* FOOTER: Cố định */}
      <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50 rounded-b-2xl">
        <ButtonAction
          label="Hủy"
          onClick={onCancel}
          className="bg-red-500 hover:bg-red-800"
        />
        <ButtonAction
          label={initial ? "Lưu thay đổi" : "Tạo đợt tuyển sinh"}
          onClick={handleSave}
        />
      </div>
    </div>
  );
}

export default CreateDotTuyenSinh;
