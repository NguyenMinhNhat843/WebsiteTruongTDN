import { Save } from "lucide-react";
import {
  useTaoChuongTrinhKhungContext,
  type CreateProgramDto,
} from "./CreateProgramProvider";
import ButtonAction from "../../../../components/ui/ButtonAction";
import { SelectOption } from "../../../../components/ui/Form/SelectOption";
import Input from "../../../../components/ui/Form/Input";

const CreateProgramForm = () => {
  const { majors, register, handleSubmit, reset, errors, createCurriculum } =
    useTaoChuongTrinhKhungContext();

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

  // Ánh xạ danh sách ngành học majors sang định dạng Options mà component SelectOption yêu cầu
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
        {/* Mã chương trình & Năm áp dụng (Chia 2 cột) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Mã chương trình khung"
            placeholder="VD: CTK-2024"
            require={true}
            error={errors.curriculumCode?.message}
            {...register("curriculumCode", { required: "Vui lòng nhập mã" })} //
          />
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
        </div>

        {/* Tên chương trình */}
        <Input
          label="Tên chương trình học"
          placeholder="VD: Công nghệ thông tin định hướng ứng dụng"
          require={true}
          error={errors.curriculumName?.message}
          {...register("curriculumName", {
            required: "Vui lòng nhập tên chương trình học",
          })}
        />

        <SelectOption
          label="Ngành học"
          options={majorOptions}
          error={errors.majorId?.message}
          {...register("majorId", { valueAsNumber: true })}
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

export default CreateProgramForm; //
