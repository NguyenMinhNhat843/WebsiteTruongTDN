import { useFieldArray, useWatch } from "react-hook-form";
import { Plus, Trash2, X, Target, BookOpen } from "lucide-react"; // Dùng Lucide icon cho đẹp
import { useDotTuyenSinhContext } from "./DotTuyenSinhProvider";

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
  } = useDotTuyenSinhContext();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center z-10">
          <h2 className="text-xl font-bold text-gray-800">
            Tạo Đợt Tuyển Sinh Mới
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
          {/* Section 1: Thông tin chung */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-blue-50/50 p-5 rounded-xl border border-blue-100">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Tên đợt tuyển sinh
              </label>
              <input
                {...register("name", { required: "Vui lòng nhập tên đợt" })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="VD: Tuyển sinh khóa K24 - Đợt 1"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Ngày bắt đầu
              </label>
              <input
                type="date"
                {...register("startDate")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Ngày kết thúc
              </label>
              <input
                type="date"
                {...register("endDate")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          {/* Section 2: Danh sách chi tiết ngành (Items) */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-700 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-500" /> Chi tiết đợt &
                Chỉ tiêu
              </h3>
              <button
                type="button"
                onClick={() =>
                  appendItem({
                    majorId: 0,
                    batchName: "",
                    quota: 0,
                    criteria: [],
                  })
                }
                className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
              >
                <Plus className="w-4 h-4" /> Thêm ngành đào tạo
              </button>
            </div>

            {itemFields.map((field, index) => (
              <div
                key={field.id}
                className="border-2 border-gray-100 rounded-xl p-5 space-y-4 relative bg-white shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pr-8">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase">
                      Tên đợt (Batch Name)
                    </label>
                    <input
                      {...register(`items.${index}.batchName`)}
                      className="w-full mt-1 px-3 py-2 border rounded-md focus:border-indigo-500 outline-none"
                      placeholder="VD: Đợt xét học bạ"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase">
                      Ngành đào tạo
                    </label>
                    <select
                      {...register(`items.${index}.majorId`, {
                        valueAsNumber: true,
                      })}
                      className="w-full mt-1 px-3 py-2 border rounded-md bg-white focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
                    >
                      <option value="">-- Chọn ngành --</option>
                      {nganhs?.map((nganh) => (
                        <option key={nganh.id} value={nganh.id}>
                          {nganh.majorName}
                        </option>
                      ))}
                    </select>
                    {/* Hiển thị lỗi nếu có */}
                    {errors.items?.[index]?.majorId && (
                      <p className="text-red-500 text-[10px] mt-1">
                        Vui lòng chọn ngành
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase">
                      Chỉ tiêu (Quota)
                    </label>
                    <input
                      type="number"
                      {...register(`items.${index}.quota`, {
                        valueAsNumber: true,
                      })}
                      className="w-full mt-1 px-3 py-2 border rounded-md"
                    />
                  </div>
                </div>

                {/* Nested Criteria Section */}
                <CriteriaFieldArray
                  nestIndex={index}
                  control={control}
                  register={register}
                />
              </div>
            ))}
          </div>

          {/* Footer Actions */}
          <div className="sticky bottom-0 bg-white border-t border-gray-100 pt-4 flex justify-end gap-3 mt-8 pb-2">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-xl text-gray-600 font-semibold hover:bg-gray-50 transition-all"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-8 py-2 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:opacity-90 transition-all"
            >
              Lưu đợt tuyển sinh
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Component con để xử lý Criteria lồng bên trong mỗi Item
/* eslint-disable @typescript-eslint/no-explicit-any */
const CriteriaFieldArray = ({ nestIndex, control, register }: any) => {
  const { tieuChiTuyenSinh } = useDotTuyenSinhContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `items.${nestIndex}.criteria`,
  });

  // Theo dõi toàn bộ mảng criteria để lấy criterionId và ẩn/hiện field tương ứng
  const watchedCriteria = useWatch({
    control,
    name: `items.${nestIndex}.criteria`,
  });

  return (
    <div className="mt-4 pl-6 border-l-2 border-dashed border-gray-200 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-gray-600 flex items-center gap-2">
          <Target className="w-4 h-4 text-orange-500" /> Tiêu chí xét tuyển
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
          className="text-xs text-blue-600 font-bold hover:underline"
        >
          + Thêm tiêu chí
        </button>
      </div>

      {fields.map((item, k) => {
        // Tìm thông tin tiêu chí đang được chọn ở dòng này
        const selectedId = watchedCriteria?.[k]?.criterionId;
        const selectedDetail = tieuChiTuyenSinh?.find(
          (tc: any) => tc.id === Number(selectedId),
        );
        const isNumberType = selectedDetail?.type === "NUMBER";

        return (
          <div
            key={item.id}
            className="grid grid-cols-2 md:grid-cols-12 gap-3 items-end bg-gray-50 p-3 rounded-lg border border-gray-200"
          >
            {/* 1. Chọn Tiêu chí - Luôn hiển thị */}
            <div className="md:col-span-4">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                Tên tiêu chí
              </label>
              <select
                {...register(`items.${nestIndex}.criteria.${k}.criterionId`, {
                  valueAsNumber: true,
                  required: true,
                })}
                className="w-full mt-0.5 text-sm border border-gray-300 rounded p-1 bg-white focus:border-orange-500 outline-none"
              >
                <option value="">-- Chọn tiêu chí --</option>
                {tieuChiTuyenSinh?.map((tc: any) => (
                  <option key={tc.id} value={tc.id}>
                    {tc.criterionName} ({tc.type})
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Các field chỉ hiện khi type là 'number' */}
            {isNumberType ? (
              <>
                <div className="md:col-span-2">
                  <label className="text-[10px] font-bold text-gray-400">
                    Min Score
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    {...register(`items.${nestIndex}.criteria.${k}.minValue`, {
                      valueAsNumber: true,
                    })}
                    className="w-full text-sm border rounded p-1"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-[10px] font-bold text-gray-400">
                    Hệ số (Weight)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    {...register(`items.${nestIndex}.criteria.${k}.weight`, {
                      valueAsNumber: true,
                    })}
                    className="w-full text-sm border rounded p-1"
                  />
                </div>
              </>
            ) : (
              // Spacer để giữ layout ổn định khi không phải type number
              <div className="md:col-span-4 text-xs italic text-gray-400 pb-2">
                Tiêu chí định tính (Đạt/Không đạt)
              </div>
            )}

            {/* 3. Bắt buộc - Luôn hiển thị */}
            <div className="md:col-span-2 flex items-center h-full pt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register(`items.${nestIndex}.criteria.${k}.isRequired`)}
                  className="rounded text-orange-500 focus:ring-orange-500"
                />
                <span className="text-xs text-gray-600 font-medium">
                  Bắt buộc
                </span>
              </label>
            </div>

            {/* 4. Nút xóa */}
            <div className="md:col-span-2 text-right md:text-center">
              <button
                type="button"
                onClick={() => remove(k)}
                className="p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4 inline" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CreateDotTuyenSinhModal;
