import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query"; // Đảm bảo import đúng hook của react-query bạn đang dùng
import type { CreatemonHocDto } from "./MonHocProvider";
import {
  BookOpen,
  Layers,
  Code,
  Type,
  Hash,
  Clock,
  FileText,
} from "lucide-react";
import { useAppContext } from "../../../AppProvider";
import Input from "../../../components/ui/Form/Input";
import SelectSearchInput from "../../../components/ui/Form/SelectInput";
import ButtonAction from "../../../components/ui/ButtonAction";
import { $api } from "../../../api/client";

// Giả định kiểu dữ liệu môn học từ API trả về có ID
interface SubjectDataType extends CreatemonHocDto {
  id?: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreatemonHocDto, reset: () => void) => void;
  isPending: boolean;
  initialData?: SubjectDataType | null; // Nhận data môn học khi cần Update
}

const CreateMonHocModal = ({
  isOpen,
  onClose,
  onSubmit,
  isPending,
  initialData,
}: Props) => {
  const isEditMode = !!initialData?.id; // Kiểm tra xem đang ở chế độ tạo mới hay cập nhật
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreatemonHocDto>({
    defaultValues: {
      credits: 0,
      theoryHours: 0,
      practiceHours: 0,
      testHours: 0,
      knowledgeBlock: "GENERAL",
      description: "",
    },
  });

  // Tự động load dữ liệu cũ vào form nếu ở chế độ Edit, hoặc reset form về mặc định nếu là Create
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset(initialData);
      } else {
        reset({
          subjectName: "",
          subjectCode: "",
          departmentId: null,
          credits: 0,
          theoryHours: 0,
          practiceHours: 0,
          testHours: 0,
          knowledgeBlock: "GENERAL",
          description: "",
        });
      }
    }
  }, [initialData, isOpen, reset]);

  // Hook API cập nhật môn học
  const { mutate: updateMonHoc, isPending: isUpdatePending } = $api.useMutation(
    "patch",
    "/subjects/{id}",
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["get", "/subjects"],
        });
        reset();
        onClose();
      },
      onError: (err) => {
        alert(JSON.stringify(err) || "Cập nhật môn học thất bại!");
      },
    },
  );

  const { departments, isDepartmentsLoading } = useAppContext();

  const departmentOptions =
    departments?.map((dept) => ({
      label: dept.deptName,
      value: dept.id,
    })) || [];

  const knowledgeBlockOptions: { label: string; value: string }[] = [
    { label: "Đại cương", value: "GENERAL" },
    { label: "Cơ sở ngành", value: "BASE_MAJOR" },
    { label: "Chuyên ngành", value: "SPECIALIZED" },
  ];

  const removeVietnameseTones = (str: string) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  };

  const generateSubjectCode = (name: string) => {
    if (!name) return "";
    const cleanName = removeVietnameseTones(name);
    return cleanName
      .split(/\s+/)
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase();
  };

  const handleInternalSubmit = (data: CreatemonHocDto) => {
    if (isEditMode && initialData?.id) {
      // Gọi API Patch để cập nhật
      updateMonHoc({
        params: { path: { id: initialData.id } },
        body: data,
      });
    } else {
      // Gọi hàm onSubmit của cha để tạo mới
      onSubmit(data, () => {
        reset();
      });
    }
  };

  if (!isOpen) return null;

  // Trạng thái loading chung cho cả nút bấm và nút tắt
  const anyPending = isPending || isUpdatePending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 transition-all duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <BookOpen size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 tracking-tight">
                {isEditMode ? "Cập Nhật Môn Học" : "Tạo Môn Học Mới"}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {isEditMode
                  ? "Chỉnh sửa thông tin định danh, số tín chỉ và khối kiến thức của môn học."
                  : "Thiết lập thông tin chung và phân khối kiến thức cho môn học mới."}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
            disabled={anyPending}
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
              <Layers size={12} /> Thông tin định danh môn học
            </h4>

            {/* Hàng 1: Tên môn học & Mã môn học */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Tên môn học"
                icon={Type}
                require
                placeholder="VD: Cấu trúc dữ liệu và giải thuật"
                error={errors.subjectName?.message}
                {...register("subjectName", {
                  required: "Vui lòng nhập tên môn học",
                  onChange: (e) => {
                    // Chỉ tự động gen code nếu đang ở chế độ tạo mới
                    if (!isEditMode) {
                      const nameValue = e.target.value;
                      const generatedCode = generateSubjectCode(nameValue);
                      setValue("subjectCode", generatedCode, {
                        shouldValidate: true,
                      });
                    }
                  },
                })}
              />

              <Input
                label="Mã môn học"
                icon={Code}
                require
                placeholder="VD: IT101"
                error={errors.subjectCode?.message}
                {...register("subjectCode", {
                  required: "Vui lòng nhập mã môn học",
                })}
              />
            </div>

            {/* Hàng 2: Khoa quản lý & Khối kiến thức */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                name="departmentId"
                control={control}
                render={({ field: { onChange, value, name, ref } }) => (
                  <SelectSearchInput
                    ref={ref}
                    name={name}
                    label="Khoa / Bộ môn quản lý"
                    placeholder={
                      isDepartmentsLoading
                        ? "Đang tải danh sách khoa..."
                        : "--- Chọn khoa / bộ môn ---"
                    }
                    isLoading={isDepartmentsLoading}
                    options={departmentOptions}
                    value={value ?? ""}
                    error={errors.departmentId?.message}
                    onChange={(e) => {
                      const val = e.target.value;
                      onChange(val ? Number(val) : null);
                    }}
                  />
                )}
              />

              <Controller
                name="knowledgeBlock"
                control={control}
                rules={{ required: "Vui lòng chọn khối kiến thức" }}
                render={({ field: { onChange, value, name, ref } }) => (
                  <SelectSearchInput
                    ref={ref}
                    name={name}
                    label="Khối kiến thức"
                    options={knowledgeBlockOptions}
                    value={value}
                    error={errors.knowledgeBlock?.message}
                    onChange={(e) => onChange(e.target.value)}
                  />
                )}
              />
            </div>

            {/* Hàng 3: Cấu hình Tín chỉ / Số giờ */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Input
                type="number"
                label="Tín chỉ"
                icon={Hash}
                error={errors.credits?.message}
                {...register("credits", {
                  valueAsNumber: true,
                  min: { value: 0, message: "Tối thiểu là 0" },
                })}
              />

              <Input
                type="number"
                label="Lý thuyết (h)"
                icon={Clock}
                error={errors.theoryHours?.message}
                {...register("theoryHours", { valueAsNumber: true })}
              />

              <Input
                type="number"
                label="Thực hành (h)"
                icon={Clock}
                error={errors.practiceHours?.message}
                {...register("practiceHours", { valueAsNumber: true })}
              />

              <Input
                type="number"
                label="Kiểm tra (h)"
                icon={Clock}
                error={errors.testHours?.message}
                {...register("testHours", {
                  valueAsNumber: true,
                })}
              />
            </div>

            {/* Hàng 4: Mô tả môn học */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                <FileText size={16} className="text-slate-400" /> Mô tả tóm tắt
                môn học
              </label>
              <textarea
                placeholder="Nhập nội dung tóm tắt môn học, chuẩn đầu ra hoặc tài liệu tham khảo cốt lõi..."
                rows={4}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all resize-none"
                {...register("description")}
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
            <ButtonAction
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={anyPending}
            >
              Hủy
            </ButtonAction>

            <ButtonAction type="submit" variant="primary" loading={anyPending}>
              {isEditMode ? "Cập nhật" : "Lưu môn học"}
            </ButtonAction>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateMonHocModal;
