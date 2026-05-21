import { AlertCircle, CheckCircle2 } from "lucide-react";
import {
  useTaoChuongTrinhKhungContext,
  type CreateProgramDto,
} from "./CreateProgramProvider";

const CreateProgramForm = () => {
  const { majors, register, handleSubmit, reset, errors, createCurriculum } =
    useTaoChuongTrinhKhungContext();

  const onSubmit = (data: CreateProgramDto) => {
    console.log("Dữ liệu Form:", data);
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

  return (
    // Giữ nguyên div bọc ngoài không giới hạn width để giao diện rộng mở như ban đầu
    <div className="w-full bg-white rounded-xl border border-slate-200/80 shadow-sm p-6">
      <form
        id="create-program-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
        {/* Mã chương trình & Phiên bản (Chia 2 cột rộng rãi) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Mã chương trình khung <span className="text-rose-500">*</span>
            </label>
            <input
              {...register("curriculumCode", { required: "Vui lòng nhập mã" })}
              className={`w-full p-2.5 text-base border rounded-lg outline-none transition-all duration-200 bg-slate-50/40 focus:bg-white
                ${
                  errors.curriculumCode
                    ? "border-rose-400 focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500"
                    : "border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500"
                }`}
              placeholder="VD: CTK-2024"
            />
            {errors.curriculumCode && (
              <div className="flex items-center gap-1.5 text-rose-500 text-xs mt-1.5 font-medium pl-0.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.curriculumCode.message}</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Phiên bản <span className="text-rose-500">*</span>
            </label>
            <input
              {...register("version", {
                required: "Vui lòng nhập phiên bản",
                valueAsNumber: true,
              })}
              type="number"
              step="0.1"
              className={`w-full p-2.5 text-base border rounded-lg outline-none transition-all duration-200 bg-slate-50/40 focus:bg-white
                ${
                  errors.version
                    ? "border-rose-400 focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500"
                    : "border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500"
                }`}
              placeholder="1.0"
            />
            {errors.version && (
              <div className="flex items-center gap-1.5 text-rose-500 text-xs mt-1.5 font-medium pl-0.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.version.message}</span>
              </div>
            )}
          </div>
        </div>

        {/* Tên chương trình */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Tên chương trình học <span className="text-rose-500">*</span>
          </label>
          <input
            {...register("curriculumName", {
              required: "Vui lòng nhập tên chương trình học",
            })}
            className={`w-full p-2.5 text-base border rounded-lg outline-none transition-all duration-200 bg-slate-50/40 focus:bg-white
              ${
                errors.curriculumName
                  ? "border-rose-400 focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500"
                  : "border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500"
              }`}
            placeholder="VD: Công nghệ thông tin định hướng ứng dụng"
          />
          {errors.curriculumName && (
            <div className="flex items-center gap-1.5 text-rose-500 text-xs mt-1.5 font-medium pl-0.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.curriculumName.message}</span>
            </div>
          )}
        </div>

        {/* Ngành học */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Ngành học
          </label>
          <div className="relative">
            <select
              {...register("majorId", { valueAsNumber: true })}
              className="w-full p-2.5 text-base border border-slate-200 rounded-lg bg-slate-50/40 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer text-slate-700"
            >
              {majors?.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.majorName}
                </option>
              ))}
            </select>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Trạng thái hoạt động (Form ngang rộng rãi, đổi sang Card Choice hiện đại) */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Trạng thái hoạt động
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Option Đang hoạt động */}
            <label
              className="relative flex items-center justify-between p-3 border 
              border-slate-200 rounded-xl bg-white hover:bg-slate-50 cursor-pointer 
              transition-all has-checked:border-blue-500 
              has-checked:bg-blue-50/30 has-checked:ring-1 
              has-checked:ring-blue-500 group"
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  value="true"
                  {...register("isActive", {
                    setValueAs: (v) => v === "true",
                  })}
                  defaultChecked={true}
                  className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500 focus:ring-offset-0"
                />
                <span className="text-sm font-semibold text-slate-700 group-has-checked:text-blue-700">
                  Hoạt động
                </span>
              </div>
              <CheckCircle2 className="w-4 h-4 text-blue-500 opacity-0 group-has-checked:opacity-100 transition-opacity" />
            </label>

            {/* Option Tạm dừng */}
            <label
              className="relative flex items-center justify-between p-3 
                border border-slate-200 rounded-xl bg-white hover:bg-slate-50 
                cursor-pointer transition-all has-checked:border-amber-500 
                has-checked:bg-amber-50/30 has-checked:ring-1 has-checked:ring-amber-500 group"
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  value="false"
                  {...register("isActive", {
                    setValueAs: (v) => v === "true",
                  })}
                  className="w-4 h-4 text-amber-600 border-slate-300 
                  focus:ring-amber-500 focus:ring-offset-0"
                />
                <span
                  className="text-sm font-semibold text-slate-700 
                group-has-checked:text-amber-700"
                >
                  Lưu nháp
                </span>
              </div>
              <AlertCircle
                className="w-4 h-4 text-amber-500 opacity-0 
                group-has-checked:opacity-100 transition-opacity"
              />
            </label>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateProgramForm;
