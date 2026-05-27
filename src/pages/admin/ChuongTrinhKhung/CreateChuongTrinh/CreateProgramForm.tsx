import { useEffect } from "react"; // Thêm useEffect
import { Save } from "lucide-react";
import {
  useTaoChuongTrinhKhungContext,
  type CreateProgramDto,
} from "./CreateProgramProvider";
import ButtonAction from "../../../../components/ui/ButtonAction";
import { SelectOption } from "../../../../components/ui/Form/SelectOption";
import Input from "../../../../components/ui/Form/Input";

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
  } = useTaoChuongTrinhKhungContext();

  const selectedMajorId = watch("majorId");
  const currentVersion = watch("version");

  useEffect(() => {
    if (selectedMajorId && currentVersion) {
      const currentMajor = majors?.find(
        (m) => m.id === Number(selectedMajorId),
      );

      if (currentMajor) {
        // 1. Sinh mã viết tắt (Ví dụ: THUD) + Năm (Ví dụ: 2025) -> THUD2025
        const shortMajorName = getShortName(currentMajor.majorName);
        const autoCode = `${shortMajorName}${currentVersion}`;
        setValue("curriculumCode", autoCode, { shouldValidate: true });

        // 2. Sinh tên chương trình mặc định (Ví dụ: Chương trình khung ngành Tin học ứng dụng - Năm 2025)
        const autoName = `${currentMajor.majorName} - ${currentVersion}`;
        setValue("curriculumName", autoName, { shouldValidate: true });
      }
    } else {
      // Nếu một trong hai trường bị xóa sạch, xóa code/name
      setValue("curriculumCode", "");
      setValue("curriculumName", "");
    }
  }, [selectedMajorId, currentVersion, majors, setValue]);

  const onSubmit = (data: CreateProgramDto) => {
    createCurriculum(
      {
        body: data,
      },
      {
        onSuccess: () => {
          alert("Lưu dữ liệu thành công!");
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
        {/* Chọn ngành học đưa lên đầu để thuận tiện flow nhập liệu */}
        <SelectOption
          label="Ngành học"
          options={majorOptions}
          error={errors.majorId?.message}
          {...register("majorId", {
            required: "Vui lòng chọn ngành học",
            valueAsNumber: true,
          })}
        />

        {/* Mã chương trình & Năm áp dụng (Chia 2 cột) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Năm"
            type="number"
            placeholder="VD: 2026"
            require={true}
            error={errors.version?.message}
            {...register("version", {
              required: "Vui lòng nhập số năm áp dụng",
              valueAsNumber: true,
            })}
          />

          <Input
            label="Mã chương trình khung (Tự động sinh)"
            placeholder="Sẽ tự động sinh... VD: THUD2025"
            require={true}
            error={errors.curriculumCode?.message}
            {...register("curriculumCode", { required: "Vui lòng nhập mã" })}
          />
        </div>

        {/* Tên chương trình */}
        <Input
          label="Tên chương trình học"
          placeholder="Sẽ tự động điền dựa trên ngành và năm..."
          require={true}
          error={errors.curriculumName?.message}
          {...register("curriculumName", {
            required: "Vui lòng nhập tên chương trình học",
          })}
        />

        <div className="flex justify-end pt-2">
          <ButtonAction
            type="submit"
            variant="primary"
            label="Lưu chương trình"
            icon={<Save size={16} />}
            className="px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm shadow-blue-100"
          />
        </div>
      </form>
    </div>
  );
};

export default CreateProgramForm;
