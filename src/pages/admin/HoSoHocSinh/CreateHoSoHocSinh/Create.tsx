import { useState } from "react";
import { useForm } from "react-hook-form";
import { User, Users, GraduationCap, FileText } from "lucide-react";
import Input from "../../../../components/ui/Form/Input";
import { SelectOption } from "../../../../components/ui/Form/SelectOption";
import ButtonAction from "../../../../components/ui/ButtonAction";
import type { createStudentDto } from "../HocSinhProvider";
import SelectBatch from "../../../../components/ui/SelectBatch";
import { CreateProvider, useCreateContext } from "./CreateProvider";

const CreateStudent = () => {
  return (
    <CreateProvider>
      <Inner />
    </CreateProvider>
  );
};

const Inner = () => {
  const { createStudent, isCreatingStudent } = useCreateContext();
  const [batchIdselected, setBatchIdSelected] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<createStudentDto>({
    defaultValues: {
      fullName: "",
      email: "",
      gender: true,
      dob: "",
      phone: "",
      address: "",
      identityNumber: "",
      fatherName: "",
      fatherPhone: "",
      fatherCCCD: "",
      fatherYearOfBirth: undefined,
      fatherJob: "",
      motherName: "",
      motherPhone: "",
      motherCCCD: "",
      motherYearOfBirth: undefined,
      motherJob: "",
      guardianName: "",
      guardianRelationship: "",
      guardianPhone: "",
      guardianCCCD: "",
      guardianYearOfBirth: undefined,
      guardianJob: "",
      status: "studying",
      batchId: batchIdselected,
      // Thêm default values cho Hồ sơ nhập học
      admissionProfile: {
        conduct6: "TOT",
        conduct7: "TOT",
        conduct8: "TOT",
        conduct9: "TOT",
        gpa6: "",
        gpa7: "",
        gpa8: "",
        gpa9: "",
      },
    },
  });

  const handleFormSubmit = async (data: createStudentDto) => {
    try {
      if (!batchIdselected) {
        alert("Vui lòng chọn khóa đào tạo cho học sinh!");
        return;
      }

      const payload = {
        ...data,
        batchId: batchIdselected,
        gender: data.gender,
        enrollmentDate: new Date().toISOString(),
        fatherYearOfBirth: data.fatherYearOfBirth
          ? Number(data.fatherYearOfBirth)
          : null,
        motherYearOfBirth: data.motherYearOfBirth
          ? Number(data.motherYearOfBirth)
          : null,
        guardianYearOfBirth: data.guardianYearOfBirth
          ? Number(data.guardianYearOfBirth)
          : null,
        // Ép kiểu gpa sang chuỗi định dạng số (hoặc giữ nguyên tuỳ cấu hình schema backend)
        admissionProfile: {
          ...data.admissionProfile,
          gpa6: data.admissionProfile?.gpa6
            ? String(data.admissionProfile.gpa6)
            : "",
          gpa7: data.admissionProfile?.gpa7
            ? String(data.admissionProfile.gpa7)
            : "",
          gpa8: data.admissionProfile?.gpa8
            ? String(data.admissionProfile.gpa8)
            : "",
          gpa9: data.admissionProfile?.gpa9
            ? String(data.admissionProfile.gpa9)
            : "",
        },
      };

      await createStudent(
        {
          body: payload,
        },
        {
          onSuccess: () => {
            alert("Tạo hồ sơ học sinh thành công!");
            reset();
          },
          /* eslint-disable @typescript-eslint/no-explicit-any */
          onError: (error: any) => {
            alert(error.message || "Tạo hồ sơ học sinh thất bại!");
          },
        },
      );
    } catch (error) {
      console.error("Xảy ra lỗi khi gửi dữ liệu:", error);
    }
  };

  // Danh mục Options
  const genderOptions = [
    { value: "true", label: "Nam" },
    { value: "false", label: "Nữ" },
  ];

  const statusOptions = [
    { value: "pending", label: "Chờ duyệt" },
    { value: "approved", label: "Đã duyệt" },
    { value: "studying", label: "Đang học" },
    { value: "suspended", label: "Bảo lưu / Tạm dừng" },
    { value: "dropped", label: "Thôi học" },
    { value: "expelled", label: "Buộc thôi học" },
    { value: "graduated", label: "Đã tốt nghiệp" },
  ];

  const conductOptions = [
    { value: "TOT", label: "Tốt" },
    { value: "KHA", label: "Khá" },
    { value: "TB", label: "Trung bình" },
    { value: "YEU", label: "Yếu" },
  ];

  return (
    <div className="flex items-center justify-center p-4">
      <div className="bg-white w-full overflow-y-auto rounded-xl shadow-xl flex flex-col">
        {/* Header thành phần mượt mà */}
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex justify-between items-center z-10">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            Thêm Hồ Sơ Học Sinh Mới
          </h2>
        </div>

        {/* Form Body chính */}
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="p-6 space-y-6 flex-1"
        >
          {/* PHÂN KHU 1: THÔNG TIN CÁ NHÂN HỌC SINH */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2 border-b border-slate-100 pb-2">
              <User className="w-4 h-4 text-blue-500" /> 1. Thông tin cá nhân
              học sinh
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="md:col-span-2">
                <Input
                  label="Họ và tên học sinh"
                  placeholder="Nhập đầy đủ họ và tên"
                  require
                  error={errors.fullName?.message}
                  {...register("fullName", {
                    required: "Họ tên học sinh không được để trống",
                  })}
                />
              </div>

              <SelectOption
                label="Giới tính"
                options={genderOptions}
                {...register("gender", {
                  setValueAs: (value) => value === "true",
                })}
              />

              <Input
                type="date"
                label="Ngày sinh"
                error={errors.dob?.message ?? undefined}
                {...register("dob")}
              />

              <Input
                type="email"
                label="Địa chỉ Email"
                placeholder="example@gmail.com"
                error={errors.email?.message ?? undefined}
                {...register("email")}
              />

              <Input
                label="Số điện thoại cá nhân"
                placeholder="VD: 0912345678"
                {...register("phone")}
              />

              <Input
                label="Số CCCD / Định danh"
                placeholder="Nhập số CCCD (nếu có)"
                {...register("identityNumber")}
              />

              <div className="md:col-span-2">
                <Input
                  label="Địa chỉ thường trú"
                  placeholder="Số nhà, tên đường, xã/phường, quận/huyện"
                  {...register("address")}
                />
              </div>

              <SelectBatch
                onBatchChange={(id) => setBatchIdSelected(id)}
                className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4"
              />
            </div>
          </div>

          {/* PHÂN KHU 2: THÔNG TIN GIA ĐÌNH */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2 border-b border-slate-100 pb-2">
              <Users className="w-4 h-4 text-blue-500" /> 2. Thông tin gia đình
              & Người giám hộ
            </h3>

            <div className="space-y-4">
              {/* Thông tin Bố */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="md:col-span-2">
                  <Input
                    label="Họ tên Cha"
                    placeholder="Nhập họ tên cha"
                    {...register("fatherName")}
                  />
                </div>
                <Input
                  label="Số điện thoại Cha"
                  placeholder="Số điện thoại"
                  {...register("fatherPhone")}
                />
                <Input
                  label="Số CCCD Cha"
                  placeholder="Mã số định danh"
                  {...register("fatherCCCD")}
                />
                <Input
                  type="number"
                  label="Năm sinh"
                  placeholder="VD: 1975"
                  {...register("fatherYearOfBirth")}
                />
                <div className="md:col-span-2">
                  <Input
                    label="Nghề nghiệp"
                    placeholder="Công việc hiện tại"
                    {...register("fatherJob")}
                  />
                </div>
              </div>

              {/* Thông tin Mẹ */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="md:col-span-2">
                  <Input
                    label="Họ tên Mẹ"
                    placeholder="Nhập họ tên mẹ"
                    {...register("motherName")}
                  />
                </div>
                <Input
                  label="Số điện thoại Mẹ"
                  placeholder="Số điện thoại"
                  {...register("motherPhone")}
                />
                <Input
                  label="Số CCCD Mẹ"
                  placeholder="Mã số định danh"
                  {...register("motherCCCD")}
                />
                <Input
                  type="number"
                  label="Năm sinh"
                  placeholder="VD: 1978"
                  {...register("motherYearOfBirth")}
                />
                <div className="md:col-span-2">
                  <Input
                    label="Nghề nghiệp"
                    placeholder="Công việc hiện tại"
                    {...register("motherJob")}
                  />
                </div>
              </div>

              {/* Thông tin Người giám hộ (Tùy chọn) */}
              <div className="bg-slate-50/50 p-4 rounded-xl border border-dashed border-slate-200 grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="md:col-span-2">
                  <Input
                    label="Họ tên Người giám hộ"
                    placeholder="Nhập tên người giám hộ thay thế"
                    {...register("guardianName")}
                  />
                </div>
                <Input
                  label="Mối quan hệ"
                  placeholder="VD: Ông nội, bà ngoại..."
                  {...register("guardianRelationship")}
                />
                <Input
                  label="Số điện thoại"
                  placeholder="Số điện thoại liên hệ"
                  {...register("guardianPhone")}
                />
                <Input
                  label="Số CCCD"
                  placeholder="Số định danh người giám hộ"
                  {...register("guardianCCCD")}
                />
                <Input
                  type="number"
                  label="Năm sinh"
                  placeholder="Năm sinh"
                  {...register("guardianYearOfBirth")}
                />
                <div className="md:col-span-2">
                  <Input
                    label="Nghề nghiệp"
                    placeholder="Nghề nghiệp"
                    {...register("guardianJob")}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* PHÂN KHU 3: HỒ SƠ NHẬP HỌC (ĐIỂM & HẠNH KIỂM THCS) */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2 border-b border-slate-100 pb-2">
              <FileText className="w-4 h-4 text-blue-500" /> 3. Kết quả học tập
              cấp THCS
            </h3>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Lớp 6 */}
                <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block border-b pb-1">
                    Lớp 6
                  </span>
                  <Input
                    type="text"
                    label="Điểm TB (GPA)"
                    placeholder="VD: 8.5"
                    {...register("admissionProfile.gpa6")}
                  />
                  <SelectOption
                    label="Hạnh kiểm"
                    options={conductOptions}
                    {...register("admissionProfile.conduct6")}
                  />
                </div>

                {/* Lớp 7 */}
                <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block border-b pb-1">
                    Lớp 7
                  </span>
                  <Input
                    type="text"
                    label="Điểm TB (GPA)"
                    placeholder="VD: 8.2"
                    {...register("admissionProfile.gpa7")}
                  />
                  <SelectOption
                    label="Hạnh kiểm"
                    options={conductOptions}
                    {...register("admissionProfile.conduct7")}
                  />
                </div>

                {/* Lớp 8 */}
                <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block border-b pb-1">
                    Lớp 8
                  </span>
                  <Input
                    type="text"
                    label="Điểm TB (GPA)"
                    placeholder="VD: 8.8"
                    {...register("admissionProfile.gpa8")}
                  />
                  <SelectOption
                    label="Hạnh kiểm"
                    options={conductOptions}
                    {...register("admissionProfile.conduct8")}
                  />
                </div>

                {/* Lớp 9 */}
                <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block border-b pb-1">
                    Lớp 9
                  </span>
                  <Input
                    type="text"
                    label="Điểm TB (GPA)"
                    placeholder="VD: 9.0"
                    {...register("admissionProfile.gpa9")}
                  />
                  <SelectOption
                    label="Hạnh kiểm"
                    options={conductOptions}
                    {...register("admissionProfile.conduct9")}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* PHÂN KHU 4: TRẠNG THÁI HỆ THỐNG */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2 border-b border-slate-100 pb-2">
              <GraduationCap className="w-4 h-4 text-blue-500" /> 4. Trạng thái
              học tập ban đầu
            </h3>
            <div className="w-full md:w-1/3 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <SelectOption
                label="Trạng thái hồ sơ học sinh"
                options={statusOptions}
                {...register("status")}
              />
            </div>
          </div>

          {/* Sticky Footer cố định để tiện thao tác */}
          <div className="sticky bottom-0 bg-white border-t border-slate-100 pt-4 flex justify-end gap-3 z-10">
            <ButtonAction
              type="button"
              variant="outline"
              label="Hủy bỏ"
              onClick={() => reset()}
            />
            <ButtonAction
              type="submit"
              variant="primary"
              loading={isSubmitting || isCreatingStudent}
              label="Lưu hồ sơ học sinh"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateStudent;
