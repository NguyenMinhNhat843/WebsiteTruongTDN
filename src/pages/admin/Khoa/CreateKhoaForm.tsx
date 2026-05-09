import { forwardRef, useImperativeHandle } from "react";
import { useForm, Controller } from "react-hook-form";
import { LayoutGrid, Hash, UserCircle, FileText } from "lucide-react";
import Input from "../../../components/ui/Form/Input";
import { SelectOption } from "../../../components/ui/Form/SelectOption";
import type { components } from "../../../api/v1";
import { useKhoaContext } from "./KhoaProvider";

export type CreateKhoaFormData = components["schemas"]["CreateDepartmentDto"];

// Định nghĩa kiểu dữ liệu cho Form
interface IFormInput extends CreateKhoaFormData {
  description?: string | undefined;
  status: "Hoạt động ngay" | "Chưa hoạt động";
}

export interface CreateKhoaFormRef {
  submitForm: () => void;
}

interface CreateKhoaFormProps {
  onSuccess?: () => void; // Thêm prop này
}

const CreateKhoaForm = forwardRef<CreateKhoaFormRef, CreateKhoaFormProps>(
  (props, ref) => {
    const { onSuccess } = props;
    const { createDepartment } = useKhoaContext();
    // 1. Khởi tạo useForm
    const {
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<IFormInput>({
      defaultValues: {
        deptName: "",
        deptCode: "",
        headOfDepartmentId: undefined,
        description: "",
        status: "Hoạt động ngay",
      },
    });

    // 2. Hàm xử lý submit
    const onSubmit = (data: IFormInput) => {
      console.log("Submitting Data via RHF:", data);
      // Gọi API của bạn ở đây
      createDepartment(
        {
          body: {
            deptCode: data.deptCode,
            deptName: data.deptName,
            // headOfDepartmentId: data.headOfDepartmentId,
            description: data.description,
            // status: data.status === "Hoạt động ngay" ? "active" : "inactive",
          },
        },
        {
          onSuccess: () => {
            onSuccess?.();
          },
        },
      );
    };

    // 3. Lộ hàm submitForm ra bên ngoài
    useImperativeHandle(ref, () => ({
      submitForm: () => {
        // Trigger hàm handleSubmit của RHF
        handleSubmit(onSubmit)();
      },
    }));

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Phần tiêu đề phụ */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1 h-6 bg-indigo-600 rounded-full" />
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
            Thông tin cơ bản
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Tên Khoa */}
          <Controller
            name="deptName"
            control={control}
            rules={{ required: "Tên khoa không được để trống" }}
            render={({ field }) => (
              <Input
                {...field}
                label="Tên khoa chuyên môn"
                placeholder="VD: Khoa Công nghệ Ô tô"
                icon={LayoutGrid}
                require={true}
                // Giả sử Input component của bạn hỗ trợ prop error
                error={errors.deptName?.message}
              />
            )}
          />

          {/* Mã Khoa */}
          <Controller
            name="deptCode"
            control={control}
            rules={{ required: "Mã khoa là bắt buộc" }}
            render={({ field }) => (
              <Input
                {...field}
                label="Mã khoa"
                placeholder="VD: KCNOTO"
                icon={Hash}
                require={true}
                error={errors.deptCode?.message}
              />
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Trưởng Khoa */}
          <Controller
            name="headOfDepartmentId"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Trưởng khoa (Họ tên)"
                placeholder="VD: ThS. Nguyễn Văn A"
                icon={UserCircle}
                error={errors.headOfDepartmentId?.message}
              />
            )}
          />

          {/* Trạng thái */}
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <SelectOption
                {...field}
                label="Trạng thái"
                options={["Hoạt động ngay", "Chưa hoạt động"].map((status) => ({
                  value: status,
                  label: status,
                }))}
              />
            )}
          />
        </div>

        {/* Mô tả ngắn */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-bold text-slate-700 ml-1 flex items-center gap-2">
            <FileText size={14} /> Mô tả chức năng / nhiệm vụ
          </label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 outline-none transition-all min-h-[100px] text-[14px]"
                placeholder="Nhập mô tả ngắn về khoa..."
              />
            )}
          />
        </div>
      </form>
    );
  },
);

export default CreateKhoaForm;
