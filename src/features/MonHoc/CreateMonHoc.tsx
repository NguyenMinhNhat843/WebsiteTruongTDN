import { useMemo, useState, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import type { CreatemonHocDto } from "./MonHocProvider";
import { useMonHocContext } from "./MonHocProvider";
import { Trash2, AlertTriangle, Check, BookOpen, Layers } from "lucide-react";

// Định nghĩa kiểu dữ liệu cho từng cột điểm được cấu hình động
interface SelectedGradeComponent {
  gradeComponentId: number;
  name: string;
  weight: number | "";
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: CreatemonHocDto & {
      gradeComponents: { gradeComponentId: number; weight: number }[];
    },
    reset: () => void,
  ) => void;
  isPending: boolean;
}

const CreateMonHocModal = ({ isOpen, onClose, onSubmit, isPending }: Props) => {
  // Lấy danh mục các loại điểm hệ thống từ Context (Ví dụ: Chuyên cần, Giữa kỳ, Cuối kỳ...)
  const { diemComponents } = useMonHocContext();

  // State quản lý danh sách các đầu điểm đã chọn để cấu hình trọng số
  const [selectedComponents, setSelectedComponents] = useState<
    SelectedGradeComponent[]
  >([]);
  const [weightError, setWeightError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreatemonHocDto>({
    defaultValues: {
      isMandatory: true,
      credits: 0,
      theoryHours: 0,
      practiceHours: 0,
    },
  });

  // 1. Tính tổng trọng số hiện tại của các cấu hình (Quy đổi về hệ số 1 để validate)
  const currentTotalWeight = useMemo(() => {
    return selectedComponents.reduce((sum, comp) => {
      const w = comp.weight === "" ? 0 : comp.weight;
      return sum + w;
    }, 0);
  }, [selectedComponents]);

  // 2. Xử lý khi chọn một đầu điểm mới từ thẻ Select Option
  const handleSelectComponent = (e: ChangeEvent<HTMLSelectElement>) => {
    const componentId = Number(e.target.value);
    if (!componentId || !diemComponents) return;

    // Kiểm tra xem đầu điểm này đã được thêm vào danh sách cấu hình hay chưa
    const isExisted = selectedComponents.some(
      (c) => c.gradeComponentId === componentId,
    );
    if (isExisted) {
      setWeightError("Thành phần điểm này đã được chọn.");
      e.target.value = ""; // Reset giá trị thẻ select về rỗng
      return;
    }

    const targetComponent = diemComponents.find((c) => c.id === componentId);
    if (targetComponent) {
      setWeightError(null);
      setSelectedComponents((prev) => [
        ...prev,
        {
          gradeComponentId: targetComponent.id,
          name: targetComponent.name,
          weight: "", // Để trống để giảng viên tự tay điền trọng số
        },
      ]);
    }
    e.target.value = ""; // Reset giá trị thẻ select về rỗng
  };

  // 3. Thay đổi trọng số (weight) của một đầu điểm cụ thể
  const handleWeightChange = (componentId: number, value: string) => {
    setWeightError(null);

    // Nếu rỗng thì cho phép xóa
    if (value === "") {
      setSelectedComponents((prev) =>
        prev.map((c) =>
          c.gradeComponentId === componentId ? { ...c, weight: "" } : c,
        ),
      );
      return;
    }

    const numericWeight = parseFloat(value);
    // Chặn nhập số âm hoặc vượt quá 100% (tương đương hệ số 1)
    if (numericWeight < 0 || numericWeight > 100) return;

    setSelectedComponents((prev) =>
      prev.map((c) =>
        c.gradeComponentId === componentId
          ? { ...c, weight: numericWeight / 100 }
          : c,
      ),
    );
  };

  // 4. Xóa một đầu điểm ra khỏi cấu hình hiện tại
  const handleRemoveComponent = (componentId: number) => {
    setWeightError(null);
    setSelectedComponents((prev) =>
      prev.filter((c) => c.gradeComponentId !== componentId),
    );
  };

  // 5. Kiểm tra tính hợp lệ toàn bộ Form trước khi submit lên Backend
  const handleInternalSubmit = (data: CreatemonHocDto) => {
    if (selectedComponents.length === 0) {
      setWeightError(
        "Vui lòng cấu hình ít nhất một cột điểm thành phần cho môn học.",
      );
      return;
    }

    // Kiểm tra xem có ô điểm nào chưa được điền trọng số hay không
    const hasEmptyWeight = selectedComponents.some((c) => c.weight === "");
    if (hasEmptyWeight) {
      setWeightError(
        "Vui lòng nhập đầy đủ trọng số % cho các đầu điểm đã chọn.",
      );
      return;
    }

    // Kiểm tra tổng trọng số bắt buộc phải bằng 100% (hệ số 1)
    if (Math.abs(currentTotalWeight - 1) > 0.001) {
      setWeightError(
        `Tổng trọng số các cột điểm phải bằng 100% (Hiện tại là: ${(
          currentTotalWeight * 100
        ).toFixed(0)}%)`,
      );
      return;
    }

    setWeightError(null);

    // Chuẩn bị payload chuẩn hóa mảng object chứa { gradeComponentId, weight } khớp với cấu trúc API mới
    const formattedGradeComponents = selectedComponents.map((c) => ({
      gradeComponentId: c.gradeComponentId,
      weight: c.weight as number,
    }));

    // Gửi dữ liệu thông qua callback hàm cha
    onSubmit(
      {
        ...data,
        gradeComponents: formattedGradeComponents,
      },
      () => {
        reset();
        setSelectedComponents([]);
      },
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 transition-all duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <BookOpen size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 tracking-tight">
                Tạo Môn Học Mới
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Thiết lập thông tin chung và cấu hình khung điểm thành phần
                riêng biệt.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
            disabled={isPending}
          >
            <svg
              className="w-5 h-5"
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

        {/* Form Body - Scrollable */}
        <form
          onSubmit={handleSubmit(handleInternalSubmit)}
          className="flex-1 overflow-y-auto p-6 space-y-6"
        >
          {/* Section 1: Thông tin cơ bản */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Layers size={12} /> Thông tin cơ bản
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Mã môn học <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("subjectCode", {
                    required: "Vui lòng nhập mã môn học",
                  })}
                  className={`w-full text-sm font-medium border rounded-xl px-3.5 py-2 outline-none transition-all ${
                    errors.subjectCode
                      ? "border-red-400 focus:border-red-500 bg-red-50/10"
                      : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 bg-slate-50/30 focus:bg-white"
                  }`}
                  placeholder="VD: IT101"
                />
                {errors.subjectCode && (
                  <p className="text-red-500 text-xs mt-1 font-semibold">
                    {errors.subjectCode.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Tên môn học <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("subjectName", {
                    required: "Vui lòng nhập tên môn học",
                  })}
                  className={`w-full text-sm font-medium border rounded-xl px-3.5 py-2 outline-none transition-all ${
                    errors.subjectName
                      ? "border-red-400 focus:border-red-500 bg-red-50/10"
                      : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 bg-slate-50/30 focus:bg-white"
                  }`}
                  placeholder="VD: Cấu trúc dữ liệu và giải thuật"
                />
                {errors.subjectName && (
                  <p className="text-red-500 text-xs mt-1 font-semibold">
                    {errors.subjectName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Tín chỉ
                </label>
                <input
                  type="number"
                  {...register("credits", {
                    valueAsNumber: true,
                    min: { value: 0, message: "Tối thiểu là 0" },
                  })}
                  className="w-full text-sm font-medium border border-slate-200 rounded-xl px-3.5 py-2 outline-none focus:border-blue-500 bg-slate-50/30 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Lý thuyết (h)
                </label>
                <input
                  type="number"
                  {...register("theoryHours", { valueAsNumber: true })}
                  className="w-full text-sm font-medium border border-slate-200 rounded-xl px-3.5 py-2 outline-none focus:border-blue-500 bg-slate-50/30 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Thực hành (h)
                </label>
                <input
                  type="number"
                  {...register("practiceHours", { valueAsNumber: true })}
                  className="w-full text-sm font-medium border border-slate-200 rounded-xl px-3.5 py-2 outline-none focus:border-blue-500 bg-slate-50/30 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Loại môn học
                </label>
                <select
                  {...register("isMandatory", {
                    setValueAs: (v) => v === "true",
                  })}
                  className="w-full text-sm font-semibold border border-slate-200 rounded-xl px-3.5 py-2 outline-none bg-slate-50/30 focus:bg-white focus:border-blue-500 transition-all cursor-pointer"
                >
                  <option value="true">Bắt buộc</option>
                  <option value="false">Tự chọn</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Mô tả (tùy chọn)
                </label>
                <input
                  {...register("description")}
                  className="w-full text-sm font-medium border border-slate-200 rounded-xl px-3.5 py-2 outline-none focus:border-blue-500 bg-slate-50/30 focus:bg-white transition-all"
                  placeholder="Nhập ghi chú ngắn về môn học..."
                />
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Section 2: Cấu hình cột điểm thành phần theo cơ chế Select Option và tự nhập Trọng số */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  Cấu hình cột điểm môn học
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Chọn đầu điểm từ danh mục và nhập tỷ lệ phần trăm trọng số
                  mong muốn.
                </p>
              </div>

              {/* Vòng hiển thị tiến trình tổng % */}
              <div className="bg-slate-50 px-3 py-1 border border-slate-100 rounded-lg text-sm font-medium">
                <span className="text-slate-500">Tổng trọng số: </span>
                <span
                  className={`font-bold ${Math.abs(currentTotalWeight - 1) < 0.001 ? "text-emerald-600" : "text-amber-500"}`}
                >
                  {(currentTotalWeight * 100).toFixed(0)}%
                </span>
                <span className="text-slate-400 text-xs"> / 100%</span>
              </div>
            </div>

            {/* THẺ SELECT OPTION ĐỂ THÊM ĐẦU ĐIỂM HỆ THỐNG */}
            <div className="w-full">
              <select
                onChange={handleSelectComponent}
                defaultValue=""
                className="w-full text-sm font-semibold border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all cursor-pointer text-slate-700"
              >
                <option value="" disabled>
                  --- Bấm vào đây để chọn đầu điểm muốn thêm ---
                </option>
                {diemComponents?.map((comp) => (
                  <option key={comp.id} value={comp.id}>
                    {comp.name}
                  </option>
                ))}
              </select>
            </div>

            {/* DANH SÁCH CÁC ĐẦU ĐIỂM ĐÃ CHỌN ĐỂ NHẬP TRỌNG SỐ */}
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {selectedComponents.length > 0 ? (
                selectedComponents.map((component) => {
                  const displayValue =
                    component.weight === ""
                      ? ""
                      : (component.weight * 100).toString();
                  return (
                    <div
                      key={component.gradeComponentId}
                      className="flex items-center justify-between p-3 rounded-xl border border-blue-100 bg-blue-50/20 group hover:bg-blue-50/40 transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <span className="text-sm font-bold text-blue-950 uppercase">
                          {component.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-slate-400 font-medium">
                            Trọng số:
                          </span>
                          <div className="relative flex items-center">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              step="1"
                              value={displayValue}
                              placeholder="0"
                              onChange={(e) =>
                                handleWeightChange(
                                  component.gradeComponentId,
                                  e.target.value,
                                )
                              }
                              className="w-16 text-center text-sm font-bold text-slate-800 border border-slate-200 focus:border-blue-500 bg-white rounded-lg py-1 outline-none transition-all pr-4"
                            />
                            <span className="absolute right-1.5 text-xs font-bold text-slate-400">
                              %
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveComponent(component.gradeComponentId)
                          }
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                  <p className="text-xs text-slate-400 font-medium">
                    Chưa chọn đầu điểm nào. Vui lòng chọn ở ô Select phía trên.
                  </p>
                </div>
              )}
            </div>

            {/* Thông báo lỗi logic trọng số */}
            {weightError && (
              <div className="flex items-start gap-2 bg-rose-50 text-rose-700 p-3 rounded-xl border border-rose-100/70 animate-in fade-in slide-in-from-top-1 duration-200">
                <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
                <p className="text-xs font-semibold">{weightError}</p>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-5 py-2 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200/70 rounded-xl transition-all cursor-pointer disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isPending}
              className={`px-5 py-2 text-sm font-bold text-white rounded-xl shadow-md shadow-blue-500/5 transition-all flex items-center gap-1.5 ${
                Math.abs(currentTotalWeight - 1) < 0.001
                  ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                  : "bg-blue-600/80 hover:bg-blue-700 cursor-pointer"
              } disabled:bg-blue-400 disabled:cursor-not-allowed`}
            >
              {isPending ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
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
                  <span>Đang lưu...</span>
                </>
              ) : (
                <>
                  <Check size={16} />
                  <span>Lưu môn học</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateMonHocModal;
