import React, { useState } from "react";
import Input from "../../../../components/ui/Form/Input";
import { SelectOption } from "../../../../components/ui/Form/SelectOption";
import { $api } from "../../../../api/client";
import { DateInputv2 } from "../../../../components/ui/Form/DateInputv2";
import { toast } from "sonner";
import moment from "moment";

// Khai báo state theo đúng các trường yêu cầu cho giai đoạn đăng ký tuyển sinh
interface FormState {
  fullName: string;
  phone: string;
  email: string;
  dob: string;
  identityNumber: string;
  majorId: string; // Vẫn giữ string ở state để quản lý thẻ <select> dễ dàng
}

export default function ConsultationForm() {
  const [form, setForm] = useState<FormState>({
    fullName: "",
    phone: "",
    email: "",
    dob: "",
    identityNumber: "",
    majorId: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // 1. Lấy danh sách ngành học từ API thật
  const { data: majorsData, isLoading: isLoadingMajors } = $api.useQuery(
    "get",
    "/majors",
  );

  // 2. Sử dụng hook Mutation từ OpenAPI React Query để call API POST /students
  const { mutateAsync: createStudent, isPending: submitting } =
    $api.useMutation("post", "/students");

  // Đồng bộ dữ liệu khi user gõ/nhập/chọn
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" })); // Xóa lỗi khi user sửa lại
    }
  };

  // Hàm validate dữ liệu phía Client
  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.fullName.trim()) errs.fullName = "Vui lòng nhập họ và tên";
    if (!form.phone.trim()) errs.phone = "Vui lòng nhập số điện thoại";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) {
      errs.email = "Email không đúng định dạng";
    }
    if (form.identityNumber && !/^\d{9,12}$/.test(form.identityNumber)) {
      errs.identityNumber = "Căn cước công dân không hợp lệ (9 - 12 chữ số)";
    }
    return errs;
  };

  // Xử lý gửi Form lên API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Chuyển đổi an toàn giá trị majorId sang kiểu Number/Integer trước khi gửi API
    const parsedMajorId =
      form.majorId && !isNaN(Number(form.majorId))
        ? parseInt(form.majorId, 10)
        : undefined;

    if (!parsedMajorId) {
      toast.error("Vui lòng chọn ngành muốn xét tuyển.");
      return;
    }

    await createStudent(
      {
        body: {
          fullName: form.fullName.trim(),
          phone: form.phone.trim(),
          email: form.email.trim() || undefined,
          dob: form.dob
            ? moment(form.dob, "DD/MM/YYYY").toISOString()
            : undefined,
          identityNumber: form.identityNumber.trim() || undefined,
          status: "registered",
          majorId: parsedMajorId!,
        },
      },
      {
        onSuccess: () => {
          toast.success(
            "Đăng ký hồ sơ thành công! Ban tuyển sinh sẽ liên hệ sớm.",
          );
          // Reset form sau khi đăng ký thành công hoàn tất
          setForm({
            fullName: "",
            phone: "",
            email: "",
            dob: "",
            identityNumber: "",
            majorId: "",
          });
        },
        onError: () => {
          toast.error("Đăng ký hồ sơ thất bại. Vui lòng thử lại sau.");
        },
      },
    );
  };

  const defaultOption = { value: "", label: "Chọn ngành nghề" };

  const majorOptions = [
    defaultOption,
    ...(majorsData?.map((m) => ({
      value: String(m.id),
      label: m.majorName,
    })) || []),
  ];

  return (
    <div className="">
      <div className="bg-white rounded-xl p-4 md:p-6 border border-slate-100 shadow-sm">
        <h3 className="text-xl font-semibold text-slate-800">
          Đăng ký xét tuyển trực tuyến
        </h3>

        <form
          className="mt-6 grid grid-cols-1 gap-4"
          onSubmit={handleSubmit}
          noValidate
        >
          {/* 1. Họ và tên */}
          <div>
            <Input
              label="Họ và tên"
              name="fullName"
              type="text"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Nguyễn Văn A"
              require={true}
            />
            {errors.fullName && (
              <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>
            )}
          </div>

          {/* 2. Số điện thoại */}
          <div>
            <Input
              label="Điện thoại liên hệ"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="09xx xxx xxx"
              require={true}
            />
            {errors.phone && (
              <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
            )}
          </div>

          {/* 3. Ngày sinh */}
          <div>
            <DateInputv2
              label="Ngày sinh"
              name="dob"
              type="date"
              value={form.dob}
              onChange={handleChange}
            />
          </div>

          {/* 5. Email */}
          <div>
            <Input
              label="Địa chỉ Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="email@domain.com"
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          {/* 6. Ngành muốn xét tuyển */}
          <div>
            <SelectOption
              label={
                isLoadingMajors
                  ? "Đang tải danh sách ngành..."
                  : "Ngành muốn xét tuyển"
              }
              name="majorId"
              value={form.majorId}
              onChange={handleChange}
              options={majorOptions}
              require={false}
            />
          </div>

          {/* Thanh trạng thái hành động */}
          <div className="mt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-school-blue-600 hover:bg-school-700 text-white py-2.5 px-6 text-sm font-semibold transition shadow-md active:scale-95 disabled:opacity-70"
              disabled={submitting}
            >
              {submitting ? "Đang xử lý..." : "Gửi đăng ký"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
