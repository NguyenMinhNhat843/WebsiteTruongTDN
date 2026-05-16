import {
  useGetGradeComponents,
  useGetMonHocDetail,
  useUpdateMonHoc,
} from "./monHocHooks";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import type { UpdateMonHocDto } from "./MonHocProvider";
import { useEffect, useMemo, useState } from "react";

interface UpdateMonHocModalProps {
  idSelected: number | null;
  onClose: () => void;
}

const UpdateMonHoc = ({ idSelected, onClose }: UpdateMonHocModalProps) => {
  const { isPending, updateMonHoc } = useUpdateMonHoc();
  const { monHocDetail, isMonHocDetailLoading } =
    useGetMonHocDetail(idSelected);
  const { diemComponents } = useGetGradeComponents();
  const diemComponentsMap = Object.fromEntries(
    diemComponents?.map((component) => [component.id, component]) ?? [],
  );

  // State quản lý các ID cột điểm được chọn
  const gradeIds = useMemo(
    () => monHocDetail?.gradeComponents.map((component) => component.id) || [],
    [monHocDetail],
  );

  const [selectedComponentIds, setSelectedComponentIds] = useState<number[]>(
    gradeIds || [],
  );

  useEffect(() => {
    setSelectedComponentIds(gradeIds);
  }, [gradeIds]);

  const [weightError, setWeightError] = useState<string | null>(null);

  // Xử lý bật/tắt chọn cột điểm
  const handleToggleComponent = (id: number) => {
    setWeightError(null); // Xóa lỗi cũ khi user thay đổi lựa chọn
    setSelectedComponentIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateMonHocDto>({
    defaultValues: {
      isMandatory: true,
      credits: 0,
      theoryHours: 0,
      practiceHours: 0,
    },
  });

  useEffect(() => {
    if (monHocDetail) {
      reset({
        subjectCode: monHocDetail.subjectCode,
        subjectName: monHocDetail.subjectName,
        credits: monHocDetail.credits,
        theoryHours: monHocDetail.theoryHours,
        practiceHours: monHocDetail.practiceHours,
        isMandatory: monHocDetail.isMandatory,
        description: monHocDetail.description || "",
      });
    }
  }, [idSelected, monHocDetail]);

  const handleInternalSubmit = (data: UpdateMonHocDto) => {
    // 1. Kiểm tra xem đã chọn cột điểm nào chưa
    if (selectedComponentIds.length === 0) {
      setWeightError("Vui lòng cấu hình ít nhất một cột điểm thành phần.");
      return;
    }

    // 2. Kiểm tra tổng trọng số (Dùng sai số nhỏ Math.abs để tránh lỗi số thập phân Javascript)
    if (Math.abs(currentTotalWeight - 1) > 0.00001) {
      setWeightError(
        `Tổng trọng số các cột điểm phải bằng 100% (Hiện tại là: ${(currentTotalWeight * 100).toFixed(0)}%)`,
      );
      return;
    }

    setWeightError(null);
    // Gửi kèm mảng gradeComponentIds lên backend xử lý tiếp
    updateMonHoc(
      {
        body: {
          ...data,
          gradeComponentIds: selectedComponentIds,
        },
        params: {
          path: {
            id: idSelected!, // ID môn học đang cập nhật
          },
        },
      },
      {
        onSuccess: () => {
          alert("Cập nhật môn học thành công!");
          reset(); // Reset form về default values sau khi cập nhật thành công
          onClose();
        },
        onError: (err) => {
          alert(JSON.stringify(err) || "Cập nhật môn học thất bại!");
        },
      },
    );
  };

  if (isMonHocDetailLoading) {
    return <div>Đang tải thông tin môn học...</div>;
  }

  const selectedComponents = selectedComponentIds
    .map((id) => diemComponentsMap[id]) // Tìm component trong Map theo id
    .filter(Boolean); // Loại bỏ các giá trị undefined/null nếu chẳng may id không tồn tại trong map

  const currentTotalWeight = selectedComponents.reduce((sum, component) => {
    return sum + component.weight;
  }, 0);

  if (!idSelected) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 transition-all animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-slate-50 to-white">
          <div>
            <h3 className="text-xl font-bold text-slate-800 tracking-tight">
              Cập nhật môn học
            </h3>
            <p className="text-sm text-slate-500 mt-0.5">
              Thiết lập thông tin chung và cấu hình khung điểm thành phần.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
            disabled={isPending}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(handleInternalSubmit)}
          className="flex-1 overflow-y-auto p-8 space-y-6"
        >
          {/* Section 1: Thông tin cơ bản */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Thông tin cơ bản
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Mã môn học <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("subjectCode", {
                    required: "Vui lòng nhập mã môn học",
                  })}
                  className={`w-full text-base font-normal border rounded-xl px-4 py-2.5 outline-none transition-all focus:ring-4 ${
                    errors.subjectCode
                      ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                      : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/10"
                  }`}
                  placeholder="VD: IT101"
                />
                {errors.subjectCode && (
                  <p className="text-red-500 text-sm mt-1.5 font-medium">
                    {errors.subjectCode.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Tên môn học <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("subjectName", {
                    required: "Vui lòng nhập tên môn học",
                  })}
                  className={`w-full text-base font-normal border rounded-xl px-4 py-2.5 outline-none transition-all focus:ring-4 ${
                    errors.subjectName
                      ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                      : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/10"
                  }`}
                  placeholder="VD: Cấu trúc dữ liệu và giải thuật"
                />
                {errors.subjectName && (
                  <p className="text-red-500 text-sm mt-1.5 font-medium">
                    {errors.subjectName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Tín chỉ
                </label>
                <input
                  type="number"
                  {...register("credits", {
                    valueAsNumber: true,
                    min: { value: 0, message: "Tối thiểu là 0" },
                  })}
                  className="w-full text-base border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Lý thuyết (h)
                </label>
                <input
                  type="number"
                  {...register("theoryHours", { valueAsNumber: true })}
                  className="w-full text-base border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Thực hành (h)
                </label>
                <input
                  type="number"
                  {...register("practiceHours", { valueAsNumber: true })}
                  className="w-full text-base border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Loại môn học
                </label>
                <select
                  {...register("isMandatory", {
                    setValueAs: (v) => v === "true",
                  })}
                  className="w-full text-base border border-slate-200 rounded-xl px-4 py-2.5 outline-none bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                >
                  <option value="true">Bắt buộc</option>
                  <option value="false">Tự chọn</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Mô tả (tùy chọn)
                </label>
                <input
                  {...register("description")}
                  className="w-full text-base border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                  placeholder="Nhập ghi chú ngắn về môn học..."
                />
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Section trọng số điểm */}
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Cấu hình cột điểm
                </h4>
                <p className="text-sm text-slate-500 mt-0.5">
                  Chọn các đầu điểm cấu thành môn học này.
                </p>
              </div>
              {/* Thanh hiển thị tiến trình tổng trọng số trực quan */}
              <div className="text-right">
                <span className="text-sm text-slate-500">Tổng trọng số: </span>
                <span
                  className={`text-base font-bold ${Math.abs(currentTotalWeight - 1) < 0.00001 ? "text-emerald-600" : "text-amber-500"}`}
                >
                  {(currentTotalWeight * 100).toFixed(0)}%
                </span>
                <span className="text-sm text-slate-400"> / 100%</span>
              </div>
            </div>

            {/* Grid danh sách các cột điểm thành phần */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-56 overflow-y-auto pr-1">
              {diemComponents && diemComponents.length > 0 ? (
                diemComponents.map((component) => {
                  const isChecked = selectedComponentIds.includes(component.id);
                  return (
                    <div
                      key={component.id}
                      onClick={() => handleToggleComponent(component.id)}
                      className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer select-none transition-all duration-200 ${
                        isChecked
                          ? "border-blue-500 bg-blue-50/40 shadow-sm"
                          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${
                            isChecked
                              ? "bg-blue-600 border-blue-600 text-white"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {isChecked && (
                            <svg
                              className="w-3.5 h-3.5 stroke-[3]"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </div>
                        <span
                          className={`text-base font-medium ${isChecked ? "text-blue-900" : "text-slate-700"}`}
                        >
                          {component.name}
                        </span>
                      </div>
                      <span
                        className={`text-sm font-semibold px-2.5 py-1 rounded-md ${
                          isChecked
                            ? "bg-blue-100/70 text-blue-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {`${component.weight * 100}%`}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-2 text-center py-6 border border-dashed border-slate-200 rounded-xl bg-slate-50">
                  <p className="text-sm text-slate-400 font-medium">
                    Không tìm thấy dữ liệu cột điểm hệ thống
                  </p>
                </div>
              )}
            </div>

            {/* Hiển thị thông báo lỗi tính toán trọng số */}
            {weightError && (
              <div className="flex items-start gap-2 bg-red-50 text-red-700 p-3.5 rounded-xl border border-red-100 animate-shake">
                <svg
                  className="w-5 h-5 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <p className="text-sm font-medium">{weightError}</p>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pt-5 border-t border-slate-100 mt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-6 py-2.5 text-base font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-all disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isPending}
              className={`px-6 py-2.5 text-base font-semibold text-white rounded-xl shadow-md shadow-blue-500/10 transition-all flex items-center gap-2 ${
                Math.abs(currentTotalWeight - 1) < 0.00001
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-600/80 hover:bg-blue-700 cursor-pointer"
              } disabled:bg-blue-400`}
            >
              {isPending && (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              )}
              {isPending ? "Đang xử lý..." : "Lưu môn học"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateMonHoc;
