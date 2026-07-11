import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  User,
  Users,
  GraduationCap,
  FileText,
  Layers,
  ArrowLeft,
} from "lucide-react";
import Input from "../../../../components/ui/Form/Input";
import { SelectOption } from "../../../../components/ui/Form/SelectOption";
import ButtonAction from "../../../../components/ui/ButtonAction";
import type { createStudentDto } from "../HocSinhProvider";
import SelectBatch from "../../../../components/ui/SelectBatch";
import { CreateProvider, useCreateContext } from "./CreateProvider";
import { cleanEmptyFields } from "../../../../util/cleanEmptyField";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { DateInputv2 } from "../../../../components/ui/Form/DateInputv2";
import ModalSelectDiaChi from "../../../../components/ui/ModalSelectDiaChi";
import { toast } from "sonner";

const CreateStudent = () => {
  return (
    <CreateProvider>
      <Inner />
    </CreateProvider>
  );
};

const Inner = () => {
  const navigate = useNavigate();
  const { createStudent, isCreatingStudent } = useCreateContext();
  const [batchIdselected, setBatchIdSelected] = useState<number | null>(null);
  const [isOpenAddressModal, setIsOpenAddressModal] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<createStudentDto>({
    defaultValues: {
      fullName: "",
      gender: true,
      identityNumber: undefined,
      status: "pending",
      batchId: batchIdselected,
      admissionProfile: {
        conduct6: "TOT",
        conduct7: "TOT",
        conduct8: "TOT",
        conduct9: "TOT",
        gpa6: undefined,
        gpa7: undefined,
        gpa8: undefined,
        gpa9: undefined,
      },
    },
  });

  const handleFormSubmit = async (data: createStudentDto) => {
    try {
      if (!batchIdselected) {
        alert("Vui lòng chọn khóa đào tạo cho học sinh!");
        return;
      }

      const [day, month, year] = data?.dob?.split("/") ?? [];
      const formattedDobString = `${year}-${month}-${day}`;

      const payload = {
        ...data,
        dob: data.dob ? new Date(formattedDobString).toISOString() : null,
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

        admissionProfile: {
          ...data.admissionProfile,
          gpa6: Number(data.admissionProfile?.gpa6),
          gpa7: Number(data.admissionProfile?.gpa7),
          gpa8: Number(data.admissionProfile?.gpa8),
          gpa9: Number(data.admissionProfile?.gpa9),
        },
      };

      await createStudent(
        {
          body: cleanEmptyFields(payload),
        },
        {
          onSuccess: () => {
            toast.success("Tạo hồ sơ học sinh thành công!");
            reset();
            queryClient.invalidateQueries({ queryKey: ["get", "/students"] });
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onError: (error: any) => {
            toast.error(error.message || "Tạo hồ sơ học sinh thất bại!");
          },
        },
      );
    } catch (error) {
      console.error("Xảy ra lỗi khi gửi dữ liệu:", error);
    }
  };

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

  const [familyTab, setFamilyTab] = useState<"father" | "mother" | "guardian">(
    "father",
  );

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="px-4 md:px-8 pt-6">
        <div className="flex items-center gap-3 mb-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-colors shrink-0"
            aria-label="Quay lại"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Thêm hồ sơ học sinh
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Tạo hồ sơ học sinh mới và nhập thông tin cá nhân, gia đình, kết
              quả học tập
            </p>
          </div>
        </div>
      </div>

      {/* CARD NỘI DUNG - nền trắng nổi bật trên nền slate-100 */}
      <div className="px-4 md:px-8 pb-10">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-8">
          <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="space-y-8 flex-1"
          >
            {/* PHÂN KHU 1: CHỌN ĐỢT TUYỂN SINH / NGÀNH & KHOA */}
            <div className="space-y-4 bg-blue-50/40 p-5 rounded-xl border border-blue-100/70">
              <h3 className="text-sm font-bold text-blue-900 flex items-center gap-2 border-b border-blue-100 pb-2">
                <Layers className="w-4 h-4 text-blue-600" /> 1. Thông tin đợt
                tuyển sinh & Ngành học
              </h3>
              <SelectBatch
                onBatchChange={(id) => setBatchIdSelected(id)}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              />
            </div>

            {/* PHÂN KHU 2: THÔNG TIN CÁ NHÂN */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2 border-b border-slate-100 pb-2">
                <User className="w-4 h-4 text-blue-500" /> 2. Thông tin cá nhân
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

                <DateInputv2
                  label="Ngày sinh"
                  required={true}
                  error={errors.dob?.message}
                  {...register("dob", {
                    required: "Vui lòng nhập ngày sinh",
                    validate: (value) => {
                      if (!value) return true; // Nếu không bắt buộc hoặc xử lý ở required trên

                      // Validate định dạng DD/MM/YYYY
                      const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
                      if (!regex.test(value))
                        return "Định dạng phải là DD/MM/YYYY";

                      const [, day, month, year] = value
                        .match(regex)!
                        .map(Number);
                      if (month < 1 || month > 12) return "Tháng không hợp lệ";
                      if (day < 1 || day > 31) return "Ngày không hợp lệ";
                      if (year < 1900 || year > new Date().getFullYear())
                        return "Năm không hợp lệ";

                      return true;
                    },
                  })}
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
                  require
                  placeholder="Nhập số CCCD (nếu có)"
                  {...register("identityNumber")}
                />
                <div className="md:col-span-2">
                  <Input
                    label="Địa chỉ thường trú"
                    placeholder="Nhấp vào đây để chọn Tỉnh, Xã, Thôn..."
                    readOnly // Ngăn người dùng gõ phím bừa bãi
                    className="cursor-pointer" // Tạo hiệu ứng trỏ chuột cho giống nút bấm
                    onClick={() => setIsOpenAddressModal(true)} // Click vào là mở Modal
                    {...register("addressDetail")} // Vẫn giữ nguyên để hiển thị text địa chỉ đầy đủ sau khi chọn
                  />

                  {/* Đăng ký các trường ẩn để lưu ID/Code gửi lên Backend */}
                  <input type="hidden" {...register("provinceCode")} />
                  <input type="hidden" {...register("wardCode")} />
                  <input type="hidden" {...register("villageId")} />

                  {/* Gọi Modal bạn vừa code ở đây */}
                  <ModalSelectDiaChi
                    isOpen={isOpenAddressModal}
                    onClose={() => setIsOpenAddressModal(false)}
                    onSelect={(data) => {
                      // 1. Chuỗi hiển thị đẹp đẽ ra ô Input cho người dùng thấy
                      const textDiaChi = [
                        data.village?.name,
                        data.ward?.name,
                        data.province?.name,
                      ]
                        .filter(Boolean)
                        .join(", "); // Kết quả: "Thôn Trung, Xã Diên Toàn, Tỉnh Khánh Hòa"

                      // 2. Set giá trị vào react-hook-form bằng hàm setValue (có sẵn từ useForm)
                      setValue("addressDetail", textDiaChi);
                      setValue("provinceCode", data.province?.code || null);
                      setValue("wardCode", data.ward?.code || null);
                      setValue("villageId", data.village?.id || null);
                    }}
                  />
                </div>
              </div>
            </div>

            {/* PHÂN KHU 3: THÔNG TIN GIA ĐÌNH */}
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-2">
                <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-500" /> 3. Thông tin gia
                  đình & Người giám hộ
                </h3>

                <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-medium self-start md:self-auto">
                  <button
                    type="button"
                    onClick={() => setFamilyTab("father")}
                    className={`px-4 py-1.5 rounded-md transition-all ${familyTab === "father" ? "bg-white text-blue-600 shadow-sm font-bold" : "text-slate-600 hover:text-slate-900"}`}
                  >
                    Thông tin Cha
                  </button>
                  <button
                    type="button"
                    onClick={() => setFamilyTab("mother")}
                    className={`px-4 py-1.5 rounded-md transition-all ${familyTab === "mother" ? "bg-white text-blue-600 shadow-sm font-bold" : "text-slate-600 hover:text-slate-900"}`}
                  >
                    Thông tin Mẹ
                  </button>
                  <button
                    type="button"
                    onClick={() => setFamilyTab("guardian")}
                    className={`px-4 py-1.5 rounded-md transition-all ${familyTab === "guardian" ? "bg-white text-blue-600 shadow-sm font-bold" : "text-slate-600 hover:text-slate-900"}`}
                  >
                    Người giám hộ
                  </button>
                </div>
              </div>

              <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200 min-h-[160px]">
                {familyTab === "father" && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fadeIn">
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
                )}

                {familyTab === "mother" && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fadeIn">
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
                )}

                {familyTab === "guardian" && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fadeIn">
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
                )}
              </div>
            </div>

            {/* PHÂN KHU 4: KẾT QUẢ HỌC TẬP */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2 border-b border-slate-100 pb-2">
                <FileText className="w-4 h-4 text-blue-500" /> 4. Kết quả học
                tập cấp THCS
              </h3>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {(
                    [
                      {
                        grade: "6",
                        gpaField: "admissionProfile.gpa6",
                        conductField: "admissionProfile.conduct6",
                        errorKey: "gpa6",
                      },
                      {
                        grade: "7",
                        gpaField: "admissionProfile.gpa7",
                        conductField: "admissionProfile.conduct7",
                        errorKey: "gpa7",
                      },
                      {
                        grade: "8",
                        gpaField: "admissionProfile.gpa8",
                        conductField: "admissionProfile.conduct8",
                        errorKey: "gpa8",
                      },
                      {
                        grade: "9",
                        gpaField: "admissionProfile.gpa9",
                        conductField: "admissionProfile.conduct9",
                        errorKey: "gpa9",
                      },
                    ] as const
                  ).map(({ grade, gpaField, conductField, errorKey }) => (
                    <div
                      key={grade}
                      className="bg-white p-3 rounded-lg border border-slate-200 space-y-2"
                    >
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block border-b pb-1">
                        Lớp {grade}
                      </span>
                      <Input
                        type="text"
                        label="Điểm TB (GPA)"
                        placeholder="VD: 8.5"
                        require
                        error={errors.admissionProfile?.[errorKey]?.message}
                        {...register(gpaField, {
                          required: `Vui lòng nhập GPA lớp ${grade}`,
                        })}
                      />
                      <SelectOption
                        label="Hạnh kiểm"
                        options={conductOptions}
                        {...register(conductField)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* PHÂN KHU 5: TRẠNG THÁI HỆ THỐNG */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2 border-b border-slate-100 pb-2">
                <GraduationCap className="w-4 h-4 text-blue-500" /> 5. Trạng
                thái học tập ban đầu
              </h3>
              <div className="w-full md:w-1/3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <SelectOption
                  label="Trạng thái hồ sơ học sinh"
                  options={statusOptions}
                  {...register("status")}
                />
              </div>
            </div>

            {/* FOOTER ACTIONS - sticky trong card */}
            <div className="sticky bottom-0 bg-white border-t border-slate-200 pt-4 pb-2 flex justify-end gap-3 z-10 -mx-5 md:-mx-8 px-5 md:px-8 rounded-b-2xl">
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
    </div>
  );
};

export default CreateStudent;
