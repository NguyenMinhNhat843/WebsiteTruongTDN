import React, { useState } from "react";
import { CheckCircle } from "lucide-react";
import FormInput from "../ui/FormInput";
import type { Option } from "../ui/SelectOption";
import SelectOption from "../ui/SelectOption";

interface FormState {
  fullName: string;
  address: string;
  phone: string;
  email: string;
  major: string;
}

const formFields = [
  {
    label: "Họ và tên",
    name: "fullName",
    placeholder: "Nguyễn Văn A",
    required: true,
  },
  { label: "Địa chỉ", name: "address", placeholder: "Quận, Thành phố" },
  {
    label: "Điện thoại",
    name: "phone",
    type: "tel",
    placeholder: "09xx xxx xxx",
    required: true,
  },
  {
    label: "Email",
    name: "email",
    type: "email",
    placeholder: "email@domain.com",
  },
  {
    label: "Ngành muốn xét tuyển",
    name: "major",
    type: "select",
    required: true,
    options: [
      { label: "TC Hướng dẫn du lịch", value: "tc-huong-dan-du-lich" },
      { label: "TC Kế toán doanh nghiệp", value: "tc-ke-toan-doanh-nghiep" },
      { label: "ĐH Công nghệ thông tin", value: "dh-cong-nghe-thong-tin" },
      { label: "ĐH Quản trị kinh doanh", value: "dh-quan-tri-kinh-doanh" },
      { label: "CĐ Điều dưỡng", value: "cd-dieu-duong" },
    ] as Option[],
  },
];

export default function ConsultationForm() {
  const [form, setForm] = useState<FormState>({
    fullName: "",
    address: "",
    phone: "",
    email: "",
    major: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.fullName.trim()) errs.fullName = "Vui lòng nhập họ tên";
    if (!form.phone.trim()) errs.phone = "Vui lòng nhập số điện thoại";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Email không hợp lệ";
    if (!form.major.trim()) errs.major = "Vui lòng nhập ngành muốn xét tuyển";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length > 0) return;

    setSubmitting(true);
    setSuccess(false);

    // Giả lập call API
    await new Promise((resolve) => setTimeout(resolve, 900));

    setSubmitting(false);
    setSuccess(true);

    // reset form after success (keeps minor delay for UX)
    setTimeout(() => {
      setForm({ fullName: "", address: "", phone: "", email: "", major: "" });
      setSuccess(false);
    }, 2200);
  };

  return (
    <div className="p-4 md:p-8">
      <div className="bg-white rounded-xl p-4 md:p-6 border border-slate-100 shadow-sm">
        <h3 className="text-xl font-semibold text-slate-800">
          Đăng ký tư vấn miễn phí
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          Để lại thông tin, chuyên viên sẽ liên hệ với bạn sớm nhất.
        </p>

        <form
          className="mt-6 grid grid-cols-1 gap-4"
          onSubmit={handleSubmit}
          noValidate
        >
          {formFields.map((field) => {
            if (field.type === "select") {
              return (
                <SelectOption
                  key={field.name}
                  label={field.label}
                  name={field.name}
                  value={form[field.name as keyof typeof form]}
                  onChange={() => {}}
                  options={field.options || []} // Truyền JSON vào đây
                  required={field.required}
                  placeholder="Chọn ngành bạn quan tâm"
                />
              );
            }

            // Ngược lại render FormInput bình thường
            return (
              <FormInput
                key={field.name}
                label={field.label}
                name={field.name}
                type={field.type || "text"}
                value={form[field.name as keyof typeof form]}
                onChange={handleChange}
                placeholder={field.placeholder}
                required={field.required}
              />
            );
          })}

          {/* Nút bấm và Trạng thái */}
          <div className="mt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-school-blue-600 hover:bg-school-700 text-white py-2.5 px-6 text-sm font-semibold transition shadow-md active:scale-95 disabled:opacity-70"
              disabled={submitting}
            >
              {submitting ? "Đang gửi..." : "Gửi đăng ký"}
            </button>

            {success && (
              <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-2 rounded-lg animate-in fade-in slide-in-from-left-2">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Gửi thành công!</span>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
