import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMonHocContext } from "./MonHocProvider"; // Import để lấy danh sách cột điểm từ hệ thống

/* eslint-disable @typescript-eslint/no-explicit-any */

interface FormInputs {
  subjectCode: string;
  subjectName: string;
  credits: number;
  theoryHours: number;
  practiceHours: number;
  deptId: number;
  isMandatory: boolean;
  description: string;
}

interface UpdateMonHocModalProps {
  isOpen: boolean;
  onClose: () => void;
  monHocDetail: any;
  isMonHocDetailLoading: boolean;
  monHocDetailError: any;
  updateMonHoc: (data: any, options?: any) => void;
  isUpdateMonHocPending: boolean;
  isUpdateMonHocError: boolean;
}

export default function UpdateMonHocModal({
  isOpen,
  onClose,
  monHocDetail,
  isMonHocDetailLoading,
  monHocDetailError,
  updateMonHoc,
  isUpdateMonHocPending,
}: UpdateMonHocModalProps) {
  // Lấy danh sách danh mục cột điểm hệ thống từ context
  const { diemComponents } = useMonHocContext();

  // State quản lý các ID cột điểm được chọn và thông báo lỗi trọng số
  const [selectedComponentIds, setSelectedComponentIds] = useState<number[]>(
    [],
  );
  const [weightError, setWeightError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: {
      isMandatory: false,
      credits: 0,
      theoryHours: 0,
      practiceHours: 0,
    },
  });

  // Tính tổng trọng số hiện tại của các cột điểm đã chọn
  const currentTotalWeight = diemComponents
    ? diemComponents
        .filter((comp) => selectedComponentIds.includes(comp.id))
        .reduce((sum, comp) => sum + comp.weight, 0)
    : 0;

  // Xử lý bật/tắt chọn cột điểm
  const handleToggleComponent = (id: number) => {
    setWeightError(null);
    setSelectedComponentIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  // 1. Đổ dữ liệu chi tiết vào form và khôi phục các cột điểm đã lưu
  useEffect(() => {
    if (monHocDetail) {
      reset({
        subjectCode: monHocDetail.subjectCode,
        subjectName: monHocDetail.subjectName,
        credits: monHocDetail.credits || 0,
        theoryHours: monHocDetail.theoryHours || 0,
        practiceHours: monHocDetail.practiceHours || 0,
        deptId: monHocDetail.deptId,
        isMandatory: monHocDetail.isMandatory,
        description: monHocDetail.description || "",
      });

      // Giả định backend trả về mảng object hoặc mảng ID trong monHocDetail.grade_components
      // Bạn hãy điều chỉnh map() này cho đúng với cấu trúc thực tế từ API detail của bạn
      if (
        monHocDetail.grade_components &&
        Array.isArray(monHocDetail.grade_components)
      ) {
        const initialIds = monHocDetail.grade_components.map((item: any) =>
          typeof item === "object" ? item.id : item,
        );
        setSelectedComponentIds(initialIds);
      } else {
        setSelectedComponentIds([]);
      }
      setWeightError(null);
    }
  }, [monHocDetail, reset]);

  // 3. Xử lý submit form
  const onSubmit = (data: FormInputs) => {
    if (!monHocDetail?.id) return;

    // Kiểm tra xem đã chọn cột điểm nào chưa
    if (selectedComponentIds.length === 0) {
      setWeightError("Vui lòng cấu hình ít nhất một cột điểm thành phần.");
      return;
    }

    // Kiểm tra tổng trọng số phải bằng 100% (1.0)
    if (Math.abs(currentTotalWeight - 1) > 0.00001) {
      setWeightError(
        `Tổng trọng số các cột điểm phải bằng 100% (Hiện tại là: ${(currentTotalWeight * 100).toFixed(0)}%)`,
      );
      return;
    }

    setWeightError(null);

    // Gọi API mutate để update kèm mảng gradeComponentIds
    updateMonHoc(
      {
        id: monHocDetail.id,
        ...data,
        gradeComponentIds: selectedComponentIds,
      },
      {
        onSuccess: () => {
          alert("Cập nhật môn học thành công!");
          onClose();
        },
      },
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 transition-all">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-slate-50 to-white">
          <div>
            <h3 className="text-xl font-bold text-slate-800 tracking-tight">
              Cập Nhật Môn Học
            </h3>
            <p className="text-sm text-slate-500 mt-0.5">
              Chỉnh sửa thông tin chung và cập nhật khung điểm thành phần.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
            disabled={isUpdateMonHocPending}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Trạng thái Loading hoặc Lỗi của dữ liệu chi tiết */}
        {isMonHocDetailLoading && (
          <div className="flex flex-col items-center justify-center py-12 flex-1">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mb-4"></div>
            <p className="text-base text-slate-600 font-medium">
              Đang tải dữ liệu môn học...
            </p>
          </div>
        )}

        {monHocDetailError && (
          <div className="flex-1 p-8 text-center">
            <div className="bg-red-50 text-red-700 p-6 rounded-xl font-medium text-base my-6 border border-red-100">
              Không thể tải thông tin môn học. Vui lòng đóng và thử lại!
            </div>
          </div>
        )}

        {/* Form chính (Chỉ hiện khi đã load xong data và không lỗi) */}
        {!isMonHocDetailLoading && !monHocDetailError && (
          <form
            onSubmit={handleSubmit(onSubmit)}
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
                    type="text"
                    disabled // Không cho phép sửa mã môn học
                    {...register("subjectCode")}
                    className="w-full text-base font-normal border border-slate-200 bg-slate-50 rounded-xl px-4 py-2.5 text-slate-400 cursor-not-allowed outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Tên môn học <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
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
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Loại môn học
                  </label>
                  <select
                    {...register("isMandatory", {
                      setValueAs: (v) => v === "true" || v === true,
                    })}
                    className="w-full text-base border border-slate-200 rounded-xl px-4 py-2.5 outline-none bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                  >
                    <option value="true"> Bắt buộc </option>
                    <option value="false"> Tự chọn </option>
                  </select>
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Section 2: Cấu hình cột điểm thành phần giống Create */}
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
                <div className="text-right">
                  <span className="text-sm text-slate-500">
                    {" "}
                    Tổng trọng số:{" "}
                  </span>
                  <span
                    className={`text-base font-bold ${
                      Math.abs(currentTotalWeight - 1) < 0.00001
                        ? "text-emerald-600"
                        : "text-amber-500"
                    }`}
                  >
                    {(currentTotalWeight * 100).toFixed(0)}%
                  </span>
                  <span className="text-sm text-slate-400"> / 100%</span>
                </div>
              </div>

              {/* Grid danh sách các cột điểm thành phần */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto pr-1">
                {diemComponents && diemComponents.length > 0 ? (
                  diemComponents.map((component) => {
                    const isChecked = selectedComponentIds.includes(
                      component.id,
                    );
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

              {/* Hiển thị lỗi tính toán trọng số */}
              {weightError && (
                <div className="flex items-start gap-2 bg-red-50 text-red-700 p-3.5 rounded-xl border border-red-100">
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

            {/* Metadata (Readonly) */}
            <div className="bg-gray-50 rounded-xl p-4 grid grid-cols-2 gap-4 text-xs text-slate-500 font-medium">
              <div>
                Ngày tạo:{" "}
                {monHocDetail?.createdAt
                  ? new Date(monHocDetail.createdAt).toLocaleDateString("vi-VN")
                  : "---"}
              </div>
              <div>
                Cập nhật cuối:{" "}
                {monHocDetail?.updatedAt
                  ? new Date(monHocDetail.updatedAt).toLocaleDateString("vi-VN")
                  : "---"}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex justify-end gap-3 pt-5 border-t border-slate-100 mt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isUpdateMonHocPending}
                className="px-6 py-2.5 text-base font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-all"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isUpdateMonHocPending}
                className={`px-6 py-2.5 text-base font-semibold text-white rounded-xl shadow-md shadow-blue-500/10 transition-all flex items-center gap-2 ${
                  Math.abs(currentTotalWeight - 1) < 0.00001
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-blue-600/80 hover:bg-blue-700"
                }`}
              >
                {isUpdateMonHocPending && (
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
                {isUpdateMonHocPending ? "Đang xử lý..." : "Lưu thay đổi"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
