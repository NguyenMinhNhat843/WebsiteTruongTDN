import {
  useGetGradeComponents,
  useGetMonHocDetail,
  useUpdateMonHoc,
} from "./monHocHooks";
import {
  X,
  Trash2,
  AlertTriangle,
  Check,
  BookOpen,
  Layers,
} from "lucide-react";
import { useForm } from "react-hook-form";
import type { UpdateMonHocDto } from "./MonHocProvider";
import { useEffect, useMemo, useState, type ChangeEvent } from "react";

interface UpdateMonHocModalProps {
  idSelected: number | null;
  onClose: () => void;
}

// Định nghĩa kiểu dữ liệu state để quản lý danh sách các đầu điểm cục bộ trong form
interface SelectedGradeComponent {
  gradeComponentId: number;
  name: string;
  weight: number | "";
}

const UpdateMonHoc = ({ idSelected, onClose }: UpdateMonHocModalProps) => {
  const { isPending, updateMonHoc } = useUpdateMonHoc();
  const { monHocDetail, isMonHocDetailLoading } =
    useGetMonHocDetail(idSelected);
  const { diemComponents } = useGetGradeComponents();

  // Khởi tạo Map danh mục để hỗ trợ tìm kiếm nhanh tên đầu điểm theo ID
  const diemComponentsMap = useMemo(() => {
    return Object.fromEntries(
      diemComponents?.map((component) => [component.id, component]) ?? [],
    );
  }, [diemComponents]);

  // State quản lý danh sách các đầu điểm đang cấu hình trong Form
  const [selectedComponents, setSelectedComponents] = useState<
    SelectedGradeComponent[]
  >([]);
  const [weightError, setWeightError] = useState<string | null>(null);

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

  // Đổ dữ liệu môn học cũ từ API vào Form State khi load xong thông tin chi tiết
  useEffect(() => {
    if (monHocDetail) {
      // 1. Reset các trường thông tin cơ bản
      reset({
        subjectCode: monHocDetail.subjectCode,
        subjectName: monHocDetail.subjectName,
        credits: monHocDetail.credits,
        theoryHours: monHocDetail.theoryHours,
        practiceHours: monHocDetail.practiceHours,
        isMandatory: monHocDetail.isMandatory,
        description: monHocDetail.description || "",
      });

      // 2. Map mảng subjectGrades cũ của môn học thành state mảng cấu hình động
      if (monHocDetail.subjectGrades && monHocDetail.subjectGrades.length > 0) {
        const initialComponents = monHocDetail.subjectGrades.map((sg) => ({
          gradeComponentId: sg.gradeComponentId,
          name:
            diemComponentsMap[sg.gradeComponentId]?.name ||
            `Đầu điểm #${sg.gradeComponentId}`,
          weight: sg.weight, // Giữ nguyên giá trị hệ số thập phân (VD: 0.3) từ DB
        }));
        setSelectedComponents(initialComponents);
      } else {
        setSelectedComponents([]);
      }
      setWeightError(null);
    }
  }, [idSelected, monHocDetail, diemComponentsMap, reset]);

  // Tính tổng trọng số hiện tại của toàn bộ danh sách điểm cấu hình (Hệ số 1)
  const currentTotalWeight = useMemo(() => {
    return selectedComponents.reduce((sum, comp) => {
      const w = comp.weight === "" ? 0 : comp.weight;
      return sum + w;
    }, 0);
  }, [selectedComponents]);

  // Xử lý khi người dùng chọn thêm một đầu điểm hệ thống từ thẻ Select
  const handleSelectComponent = (e: ChangeEvent<HTMLSelectElement>) => {
    const componentId = Number(e.target.value);
    if (!componentId || !diemComponents) return;

    // Chặn nếu đầu điểm này đã tồn tại trong danh sách
    const isExisted = selectedComponents.some(
      (c) => c.gradeComponentId === componentId,
    );
    if (isExisted) {
      setWeightError(
        "Thành phần điểm này đã tồn tại trong danh sách cấu hình.",
      );
      e.target.value = "";
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
          weight: "", // Để trống để giảng viên nhập mới
        },
      ]);
    }
    e.target.value = ""; // Reset giá trị select về rỗng
  };

  // Cập nhật giá trị trọng số % của một cột điểm cụ thể
  const handleWeightChange = (componentId: number, value: string) => {
    setWeightError(null);

    if (value === "") {
      setSelectedComponents((prev) =>
        prev.map((c) =>
          c.gradeComponentId === componentId ? { ...c, weight: "" } : c,
        ),
      );
      return;
    }

    const numericWeight = parseFloat(value);
    if (numericWeight < 0 || numericWeight > 100) return; // Giới hạn từ 0% đến 100%

    setSelectedComponents((prev) =>
      prev.map((c) =>
        c.gradeComponentId === componentId
          ? { ...c, weight: numericWeight / 100 }
          : c,
      ),
    );
  };

  // Xóa một đầu điểm ra khỏi khung cấu hình hiện tại
  const handleRemoveComponent = (componentId: number) => {
    setWeightError(null);
    setSelectedComponents((prev) =>
      prev.filter((c) => c.gradeComponentId !== componentId),
    );
  };

  // Submit cập nhật dữ liệu
  const handleInternalSubmit = (data: UpdateMonHocDto) => {
    // 1. Kiểm tra mảng rỗng
    if (selectedComponents.length === 0) {
      setWeightError(
        "Vui lòng cấu hình ít nhất một cột điểm thành phần cho môn học.",
      );
      return;
    }

    // 2. Kiểm tra ô trống chưa nhập trọng số
    const hasEmptyWeight = selectedComponents.some((c) => c.weight === "");
    if (hasEmptyWeight) {
      setWeightError(
        "Vui lòng nhập đầy đủ trọng số % cho tất cả các đầu điểm đã chọn.",
      );
      return;
    }

    // 3. Kiểm tra tổng trọng số bắt buộc bằng 100%
    if (Math.abs(currentTotalWeight - 1) > 0.001) {
      setWeightError(
        `Tổng trọng số các cột điểm phải bằng 100% (Hiện tại là: ${(
          currentTotalWeight * 100
        ).toFixed(0)}%)`,
      );
      return;
    }

    setWeightError(null);

    // Chuẩn bị cấu trúc mảng gradeComponents theo đúng chuẩn API: { gradeComponentId, weight }
    const formattedGradeComponents = selectedComponents.map((c) => ({
      gradeComponentId: c.gradeComponentId,
      weight: c.weight as number,
    }));

    // Thực thi Mutation gửi lên Backend
    updateMonHoc(
      {
        body: {
          ...data,
          gradeComponents: formattedGradeComponents,
        },
        params: {
          path: {
            id: idSelected!,
          },
        },
      },
      {
        onSuccess: () => {
          alert("Cập nhật môn học thành công!");
          reset();
          onClose();
        },
        onError: (err) => {
          alert(JSON.stringify(err) || "Cập nhật môn học thất bại!");
        },
      },
    );
  };

  if (!idSelected) return null;

  if (isMonHocDetailLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
        <div className="bg-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 font-semibold text-slate-700 text-sm">
          <svg
            className="animate-spin h-5 w-5 text-blue-600"
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
          Đang tải thông tin môn học...
        </div>
      </div>
    );
  }

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
                Cập Nhật Môn Học
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Chỉnh sửa thông tin và tái cấu hình tỷ lệ điểm thành phần của
                môn học.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
            disabled={isPending}
          >
            <X className="w-5 h-5" />
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

          {/* Section 2: Cấu hình Select Option và ô nhập Trọng số */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  Cấu hình cột điểm thành phần
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Chọn đầu điểm hệ thống và thiết lập lại phần trăm trọng số
                  mong muốn.
                </p>
              </div>

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

            {/* THẺ SELECT OPTION CHỌN ĐẦU ĐIỂM */}
            <div className="w-full">
              <select
                onChange={handleSelectComponent}
                defaultValue=""
                className="w-full text-sm font-semibold border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all cursor-pointer text-slate-700"
              >
                <option value="" disabled>
                  --- Bấm vào đây để thêm đầu điểm cấu hình môn học ---
                </option>
                {diemComponents?.map((comp) => (
                  <option key={comp.id} value={comp.id}>
                    {comp.name}
                  </option>
                ))}
              </select>
            </div>

            {/* DANH SÁCH RENDER ĐẦU ĐIỂM KÈM Ô NHẬP % */}
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {selectedComponents.length > 0 ? (
                selectedComponents.map((component) => {
                  const displayValue =
                    component.weight === ""
                      ? ""
                      : (component.weight * 100).toFixed(0);
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
                    Môn học hiện tại chưa có đầu điểm nào. Hãy chọn một cột điểm
                    ở ô Select phía trên.
                  </p>
                </div>
              )}
            </div>

            {/* Thông báo lỗi logic trọng số */}
            {weightError && (
              <div className="flex items-start gap-2 bg-rose-50 text-rose-700 p-3 rounded-xl border border-rose-100/70">
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
              className="px-5 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md disabled:bg-blue-400 disabled:cursor-not-allowed transition-all flex items-center gap-1.5"
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
                  <span>Đang xử lý...</span>
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

export default UpdateMonHoc;
