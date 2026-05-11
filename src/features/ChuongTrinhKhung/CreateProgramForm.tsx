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
    <div className="">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Mã chương trình & Phiên bản (Chia 2 cột) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mã chương trình khung
            </label>
            <input
              {...register("curriculumCode", { required: "Vui lòng nhập mã" })}
              className={`w-full p-2.5 border rounded-lg focus:ring-2 outline-none transition-all ${
                errors.curriculumCode
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:ring-blue-200"
              }`}
              placeholder="VD: CTK-2024"
            />
            {errors.curriculumCode && (
              <span className="text-red-500 text-xs mt-1">
                {errors.curriculumCode.message}
              </span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phiên bản
            </label>
            <input
              {...register("version", {
                required: "Nhập phiên bản",
                valueAsNumber: true,
              })}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
              placeholder="1.0.0"
            />
          </div>
        </div>

        {/* Tên chương trình */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tên chương trình
          </label>
          <input
            {...register("curriculumName", {
              required: "Vui lòng nhập tên chương trình",
            })}
            className={`w-full p-2.5 border rounded-lg focus:ring-2 outline-none ${
              errors.curriculumName
                ? "border-red-500 focus:ring-red-200"
                : "border-gray-300 focus:ring-blue-200"
            }`}
            placeholder="Kỹ thuật phần mềm nâng cao"
          />
          {errors.curriculumName && (
            <span className="text-red-500 text-xs mt-1">
              {errors.curriculumName.message}
            </span>
          )}
        </div>

        {/* Ngành học */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ngành học
          </label>
          <select
            {...register("majorId", { valueAsNumber: true })}
            className="w-full p-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-200 outline-none"
          >
            {majors?.map((m) => {
              return (
                <option key={m.id} value={m.id}>
                  {m.majorName}
                </option>
              );
            })}
          </select>
        </div>

        {/* Trạng thái */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Trạng thái
          </label>
          <div className="flex items-center space-x-6">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                value="true"
                {...register("isActive", {
                  setValueAs: (v) => v === "true",
                })}
                defaultChecked={true} // Hoặc dựa vào defaultValues
                className="..."
              />
              <span className="ml-2 text-sm text-gray-600">Đang hoạt động</span>
            </label>

            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                value="false"
                {...register("isActive", {
                  setValueAs: (v) => v === "true",
                })}
                className="..."
              />
              <span className="ml-2 text-sm text-gray-600">Tạm dừng</span>
            </label>
          </div>
        </div>

        {/* Nút thao tác */}
        <div className="pt-4 flex gap-3">
          <button
            type="submit"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors shadow-md"
          >
            Lưu thông tin
          </button>
          <button
            type="button"
            onClick={() => reset()}
            className="px-6 py-2.5 border border-gray-300 text-gray-600 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProgramForm;
