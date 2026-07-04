import { useEffect } from "react";
import {
  useTaoChuongTrinhKhungContext,
  type CreateProgramDto,
} from "./CreateProgramProvider";
import { SelectOption } from "../../../../components/ui/Form/SelectOption";
import Input from "../../../../components/ui/Form/Input";
import { toast } from "sonner";

// Hàm helper để chuyển đổi Tên ngành thành chữ viết tắt không dấu (Ví dụ: Tin học ứng dụng -> THUD)
const getShortName = (str: string): string => {
  if (!str) return "";
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();
};

const CreateProgramForm = () => {
  const {
    majors,
    register,
    handleSubmit,
    reset,
    errors,
    createCurriculum,
    watch,
    setValue,
    totalCredits,
  } = useTaoChuongTrinhKhungContext();
  setValue("totalCredits", totalCredits);

  const selectedMajorId = watch("majorId");

  // Tự động sinh Mã và Tên chương trình khi chọn Ngành học
  useEffect(() => {
    if (selectedMajorId) {
      const currentMajor = majors?.find(
        (m) => m.id === Number(selectedMajorId),
      );

      if (currentMajor) {
        const currentYear = new Date().getFullYear(); // Lấy năm hiện tại để thay thế cho version cũ

        // 1. Sinh mã viết tắt + Năm hiện tại (Ví dụ: THUD2026)
        const shortMajorName = getShortName(currentMajor.majorName);
        const autoCode = `${shortMajorName}${currentYear}`;
        setValue("curriculumCode", autoCode, { shouldValidate: true });

        // 2. Sinh tên chương trình mặc định (Ví dụ: Tin học ứng dụng - Khóa 2026)
        const autoName = `${currentMajor.majorName} - Khóa ${currentYear}`;
        setValue("curriculumName", autoName, { shouldValidate: true });
      }
    } else {
      setValue("curriculumCode", "");
      setValue("curriculumName", "");
    }
  }, [selectedMajorId, majors, setValue]);

  const onSubmit = (data: CreateProgramDto) => {
    createCurriculum(
      {
        body: data,
      },
      {
        onSuccess: () => {
          toast.success("Lưu dữ liệu thành công!");
          reset();
        },
      },
    );
  };

  const majorOptions =
    majors?.map((m) => ({
      value: m.id,
      label: m.majorName,
    })) || [];

  return (
    <div className="w-full bg-white rounded-xl border border-slate-200/80 shadow-sm p-6">
      <form
        id="create-program-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
        {/* Hàng 1: Chọn Ngành học & Nhập Tổng số tín chỉ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          <div className="md:col-span-2">
            <SelectOption
              label="Ngành học"
              options={majorOptions}
              error={errors.majorId?.message}
              {...register("majorId", {
                required: "Vui lòng chọn ngành học",
                valueAsNumber: true,
              })}
            />
          </div>

          <Input
            label="Tổng số tín chỉ (Tự động)"
            type="number"
            readOnly
            value={totalCredits}
            className="bg-slate-50 font-bold text-slate-700"
            error={errors.totalCredits?.message}
            {...register("totalCredits", { valueAsNumber: true })}
          />
        </div>

        {/* Hàng 2: Mã chương trình & Trạng thái hoạt động */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-2">
            <Input
              label="Mã chương trình khung (Tự động sinh)"
              placeholder="Sẽ tự động sinh... VD: THUD2026"
              require={true}
              error={errors.curriculumCode?.message}
              {...register("curriculumCode", { required: "Vui lòng nhập mã" })}
            />
          </div>

          {/* Field isActive: Trạng thái kích hoạt */}
          <div className="flex items-center h-11 border border-slate-200 rounded-lg px-4 bg-slate-50/50">
            <label className="flex items-center gap-3 cursor-pointer w-full text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                defaultChecked={true}
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
                {...register("isActive")}
              />
              Kích hoạt ngay
            </label>
          </div>
        </div>

        {/* Tên chương trình */}
        <Input
          label="Tên chương trình học"
          placeholder="Sẽ tự động điền dựa trên ngành..."
          require={true}
          error={errors.curriculumName?.message}
          {...register("curriculumName", {
            required: "Vui lòng nhập tên chương trình học",
          })}
        />
      </form>
    </div>
  );
};

export default CreateProgramForm;
