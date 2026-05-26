import { useFieldArray, useWatch } from "react-hook-form";
import { Plus, Trash2, X, Target, BookOpen } from "lucide-react";
import { useDotTuyenSinhContext } from "./DotTuyenSinhProvider";
import ButtonAction from "../../components/ui/ButtonAction";
import Input from "../../components/ui/Form/Input";
import { SelectOption } from "../../components/ui/Form/SelectOption";

const CreateDotTuyenSinhModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const {
    nganhs,
    register,
    control,
    handleSubmit,
    errors,
    itemFields,
    appendItem,
    removeItem,
    onSubmit,
    batches,
    isBatchesPending,
    isCreatingDotTuyenSinh,
  } = useDotTuyenSinhContext();

  if (!isOpen) return null;

  // Map danh sách ngành học sang định dạng Option cho component SelectOption  420]
  const nganhOptions = [
    { value: "", label: "-- Chọn ngành --" },
    ...(nganhs?.map((nganh) => ({
      value: nganh.id,
      label: nganh.majorName,
    })) || []),
  ];

  // Map danh sách đợt (batches) sang định dạng Option  420]
  const batchOptions = isBatchesPending
    ? [{ value: "", label: "Đang tải dữ liệu..." }]
    : [
        { value: "", label: "-- Chọn đợt --" },
        ...(batches?.map((batch) => ({
          value: batch.batchCode,
          label: `${batch.batchCode} (${batch.status})`,
        })) || []),
      ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-xl shadow-xl flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex justify-between items-center z-10">
          <h2 className="text-lg font-bold text-slate-800">
            Tạo Đợt Tuyển Sinh Mới
          </h2>
          <ButtonAction
            variant="secondary"
            size="sm"
            icon={<X className="w-4 h-4 text-slate-500" />}
            onClick={onClose}
            className="rounded-full"
          />
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 space-y-6 flex-1"
        >
          {/* Section 1: Thông tin chung */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-xl border border-slate-100">
            <div className="md:col-span-2">
              <Input
                label="Tên đợt tuyển sinh"
                placeholder="VD: Tuyển sinh khóa K24 - Đợt 1"
                require
                error={errors.name?.message as string}
                {...register("name", { required: "Vui lòng nhập tên đợt" })}
              />
            </div>
            <div>
              <Input
                type="date"
                label="Ngày bắt đầu"
                {...register("startDate")}
              />
            </div>
            <div>
              <Input
                type="date"
                label="Ngày kết thúc"
                {...register("endDate")}
              />
            </div>
          </div>

          {/* Section 2: Danh sách chi tiết ngành (Items) */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-700 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-slate-500" /> Chi tiết đợt &
                Chỉ tiêu
              </h3>
              <ButtonAction
                type="button"
                variant="primary"
                size="sm"
                icon={<Plus className="w-4 h-4" />}
                label="Thêm ngành đào tạo"
                onClick={() =>
                  appendItem({
                    majorId: 0,
                    batchName: "",
                    quota: 0,
                    criteria: [],
                  })
                }
              />
            </div>

            {itemFields.map((field, index) => (
              <div
                key={field.id}
                className="border border-slate-200 rounded-xl p-5 space-y-4 relative bg-white"
              >
                {/* Nút xóa Item ngành */}
                <div className="absolute top-4 right-4">
                  <ButtonAction
                    type="button"
                    variant="outline"
                    size="sm"
                    icon={<Trash2 className="w-4 h-4 text-red-500" />}
                    onClick={() => removeItem(index)}
                    className="h-8 w-8 p-0 border-slate-200 hover:bg-red-50"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pr-10">
                  {/* Ngành đào tạo */}
                  <SelectOption
                    label="Ngành đào tạo"
                    options={nganhOptions}
                    error={
                      errors.items?.[index]?.majorId
                        ? "Vui lòng chọn ngành"
                        : undefined
                    }
                    {...register(`items.${index}.majorId`, {
                      valueAsNumber: true,
                    })}
                  />

                  {/* Tên đợt (Batch Code) */}
                  <SelectOption
                    label="Tên đợt (Batch Code)"
                    options={batchOptions}
                    disabled={isBatchesPending}
                    {...register(`items.${index}.batchName`)}
                  />

                  {/* Chỉ tiêu (Quota) */}
                  <Input
                    type="number"
                    label="Chỉ tiêu (Quota)"
                    {...register(`items.${index}.quota`, {
                      valueAsNumber: true,
                    })}
                  />
                </div>

                {/* Tiêu chí lồng bên trong */}
                <CriteriaFieldArray
                  nestIndex={index}
                  control={control}
                  register={register}
                />
              </div>
            ))}
          </div>

          {/* Footer Actions */}
          <div className="sticky bottom-0 bg-white border-t border-slate-100 pt-4 flex justify-end gap-3 z-10">
            <ButtonAction
              type="button"
              variant="outline"
              label="Hủy bỏ"
              onClick={onClose}
            />
            <ButtonAction
              type="submit"
              variant="primary"
              label="Lưu đợt tuyển sinh"
              loading={isCreatingDotTuyenSinh}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

// Component con để xử lý Criteria lồng bên trong
/* eslint-disable @typescript-eslint/no-explicit-any */
const CriteriaFieldArray = ({ nestIndex, control, register }: any) => {
  const { tieuChiTuyenSinh } = useDotTuyenSinhContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `items.${nestIndex}.criteria`,
  });

  const watchedCriteria = useWatch({
    control,
    name: `items.${nestIndex}.criteria`,
  });

  // Map danh sách tiêu chí sang định dạng Option  420]
  const tcOptions = [
    { value: "", label: "-- Chọn tiêu chí --" },
    ...(tieuChiTuyenSinh?.map((tc: any) => ({
      value: tc.id,
      label: `${tc.criterionName} (${tc.type})`,
    })) || []),
  ];

  return (
    <div className="mt-2 pl-4 border-l-2 border-slate-200 space-y-3 bg-slate-50/50 p-3 rounded-lg">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
          <Target className="w-3.5 h-3.5 text-slate-500" /> Tiêu chí xét tuyển
        </span>
        <button
          type="button"
          onClick={() =>
            append({
              criterionId: "",
              minValue: 0,
              isRequired: true,
              weight: 1,
            })
          }
          className="text-xs text-blue-600 font-semibold hover:text-blue-700 transition-colors"
        >
          + Thêm tiêu chí
        </button>
      </div>

      {fields.map((item, k) => {
        const selectedId = watchedCriteria?.[k]?.criterionId;
        const selectedDetail = tieuChiTuyenSinh?.find(
          (tc: any) => tc.id === Number(selectedId),
        );
        const isNumberType = selectedDetail?.type === "NUMBER";

        return (
          <div
            key={item.id}
            className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end bg-white p-3 
            rounded-lg border border-slate-200 shadow-xs relative group"
          >
            {/* Chọn Tiêu chí */}
            <div className={isNumberType ? "md:col-span-4" : "md:col-span-6"}>
              {" "}
              <SelectOption
                label="Tên tiêu chí"
                options={tcOptions}
                className="h-9 py-1"
                {...register(`items.${nestIndex}.criteria.${k}.criterionId`, {
                  valueAsNumber: true,
                  required: true,
                })}
              />
            </div>

            {/* Các field động khi type là 'NUMBER' */}
            {isNumberType ? (
              <>
                <div className="md:col-span-2">
                  <Input
                    type="number"
                    step="0.1"
                    label="Min Score"
                    className="h-9 py-1"
                    {...register(`items.${nestIndex}.criteria.${k}.minValue`, {
                      valueAsNumber: true,
                    })}
                  />
                </div>
                <div className="md:col-span-2">
                  <Input
                    type="number"
                    step="0.1"
                    label="Hệ số (Weight)"
                    className="h-9 py-1"
                    {...register(`items.${nestIndex}.criteria.${k}.weight`, {
                      valueAsNumber: true,
                    })}
                  />
                </div>
              </>
            ) : (
              <div className="md:col-span-4 text-xs italic text-slate-400 pb-2.5">
                Tiêu chí định tính (Đạt/Không đạt)
              </div>
            )}

            {/* Nút xóa tiêu chí */}
            <div className="md:col-span-2 text-right md:text-center pb-0.5">
              <ButtonAction
                type="button"
                variant="outline"
                size="sm"
                icon={
                  <Trash2 className="w-3.5 h-3.5 text-slate-400 hover:text-red-500" />
                }
                onClick={() => remove(k)}
                className="h-8 w-8 p-0 border-slate-200 hover:bg-slate-50"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CreateDotTuyenSinhModal;
