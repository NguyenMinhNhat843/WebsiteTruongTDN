import React from "react";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  User,
  BookOpen,
  Award,
  GraduationCap,
  Save,
  ArrowLeft,
  FileCheck,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { $api } from "../../../../../api/client";
import type { components } from "../../../../../api/v1";
import { useGetMajors } from "../../../../../hooks/useMajor";

export type CreateAdmissionProfileDto =
  components["schemas"]["CreateAdmissionProfileDto"];

const TaoHoSoTuyenSinh: React.FC = () => {
  const navigate = useNavigate();

  // Lấy danh sách đợt tuyển sinh đang active
  const { data: activeCampaigns, isLoading: isLoadingCampaigns } =
    $api.useQuery("get", "/admission-campaigns/active");

  // 1. Mutation API
  const { mutate: createAdmissionProfile, isPending: isCreating } =
    $api.useMutation("post", "/admission-profiles");

  // Fetch danh sách ngành tuyển sinh
  const { data: majors } = useGetMajors();

  // 2. React Hook Form Setup
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateAdmissionProfileDto>({
    defaultValues: {
      status: "REGISTERED",
      admissionType: "ACADEMIC_TRANSCRIPT",
      educationLevel: "THCS",
      trainingType: "VOCATIONAL_INTERMEDIATE",
      gender: "MALE",
      isDirectAdmission: false,
      priorityObject: "NONE",
      priorityScore: 0,
      scoreCalculated: 0,
      totalExamScore: 0,
    },
  });

  // 3. Watch các giá trị để xử lý logic Hiển thị điều kiện
  const watchEducationLevel = useWatch({ control, name: "educationLevel" });
  const watchAdmissionType = useWatch({ control, name: "admissionType" });
  const watchIsDirect = useWatch({ control, name: "isDirectAdmission" });

  // 4. Submit Handler
  const onSubmit = (formData: CreateAdmissionProfileDto) => {
    // Format payload trước khi gửi
    const payload: CreateAdmissionProfileDto = {
      ...formData,
      admissionCampaignId: Number(formData.admissionCampaignId),
      majorId: Number(formData.majorId),
      // Ép kiểu number cho các điểm GPA/Điểm thi
      gpa6: formData.gpa6 ? Number(formData.gpa6) : null,
      gpa7: formData.gpa7 ? Number(formData.gpa7) : null,
      gpa8: formData.gpa8 ? Number(formData.gpa8) : null,
      gpa9: formData.gpa9 ? Number(formData.gpa9) : null,
      gpa10: formData.gpa10 ? Number(formData.gpa10) : null,
      gpa11: formData.gpa11 ? Number(formData.gpa11) : null,
      gpa12: formData.gpa12 ? Number(formData.gpa12) : null,
      thcsGradYear: formData.thcsGradYear
        ? Number(formData.thcsGradYear)
        : null,
      thptGradYear: formData.thptGradYear
        ? Number(formData.thptGradYear)
        : null,
      totalExamScore: formData.totalExamScore
        ? Number(formData.totalExamScore)
        : null,
      priorityScore: formData.priorityScore
        ? Number(formData.priorityScore)
        : 0,
      scoreCalculated: formData.scoreCalculated
        ? Number(formData.scoreCalculated)
        : null,
      villageId: formData.villageId ? Number(formData.villageId) : null,
    };

    createAdmissionProfile(
      { body: payload },
      {
        onSuccess: () => {
          toast.success("Tạo mới hồ sơ tuyển sinh thành công!");
          navigate(-1);
        },
        onError: () => {
          toast.error(
            "Tạo mới hồ sơ thất bại. Vui lòng kiểm tra lại thông tin!",
          );
        },
      },
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6 bg-slate-50/50 min-h-screen">
      {/* HEADER & ACTIONS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <FileCheck className="w-6 h-6 text-indigo-600" />
              Tạo Hồ Sơ Tuyển Sinh Mới
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Thêm mới hồ sơ đăng ký cho học sinh vào hệ thống
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 justify-end">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            form="form-create-profile"
            disabled={isCreating}
            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-xl transition-all shadow-sm shadow-indigo-200"
          >
            <Save className="w-4 h-4" />
            {isCreating ? "Đang lưu..." : "Lưu Hồ Sơ"}
          </button>
        </div>
      </div>

      <form
        id="form-create-profile"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
        {/* SECTION 1: CẤU HÌNH TUYỂN SINH & NGÀNH HỌC */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-indigo-600">
            <GraduationCap className="w-5 h-5" />
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
              1. Thông Tin Đăng Ký Tuyển Sinh
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                ID Đợt Tuyển Sinh <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                placeholder="Nhập ID đợt"
                {...register("admissionCampaignId", { required: "Bắt buộc" })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
              {errors.admissionCampaignId && (
                <span className="text-[11px] text-red-500">
                  {errors.admissionCampaignId.message}
                </span>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Ngành Đăng Ký <span className="text-red-500">*</span>
              </label>
              <select
                {...register("majorId", { required: "Chọn ngành" })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="">-- Chọn ngành học --</option>
                {majors?.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.majorName} ({m.majorCode})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Trình Độ Học Vấn <span className="text-red-500">*</span>
              </label>
              <select
                {...register("educationLevel")}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="THCS">Tốt nghiệp THCS</option>
                <option value="THPT">Tốt nghiệp THPT</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Loại Hình Đào Tạo
              </label>
              <select
                {...register("trainingType")}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="VOCATIONAL_INTERMEDIATE">Trung cấp nghề</option>
                <option value="DUAL_PROGRAM_9PLUS">
                  Chương trình 9+ (Song song)
                </option>
                <option value="VOCATIONAL_ELEMENTARY">Sơ cấp nghề</option>
                <option value="CONTINUING_EDUCATION">GDTX</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Phương Thức Xét Tuyển
              </label>
              <select
                {...register("admissionType")}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="ACADEMIC_TRANSCRIPT">Xét Học Bạ</option>
                <option value="EXAM_SCORE">Xét Điểm Thi</option>
                <option value="DIRECT">Xét Tuyển Thẳng</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Trạng Thái Hồ Sơ
              </label>
              <select
                {...register("status")}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="REGISTERED">Mới đăng ký (Registered)</option>
                <option value="SUBMITTED">Đã nộp bản cứng (Submitted)</option>
                <option value="APPROVED">Đã duyệt (Approved)</option>
                <option value="CONFIRMED">Xác nhận nhập học (Confirmed)</option>
                <option value="REJECTED">Từ chối (Rejected)</option>
                <option value="ENROLLED">Đã nhập học (Enrolled)</option>
                <option value="CANCELLED">Đã hủy (Cancelled)</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 2: THÔNG TIN CÁ NHÂN HỌC SINH */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-indigo-600">
            <User className="w-5 h-5" />
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
              2. Thông Tin Thí Sinh
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Họ và Tên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="VD: Nguyễn Văn A"
                {...register("fullName", { required: "Vui lòng nhập họ tên" })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
              {errors.fullName && (
                <span className="text-[11px] text-red-500">
                  {errors.fullName.message}
                </span>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Số CCCD / CMND <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="VD: 038200012345"
                {...register("identityNumber", {
                  required: "Vui lòng nhập CCCD",
                })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Ngày Sinh <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                {...register("dob", { required: "Chọn ngày sinh" })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Giới Tính
              </label>
              <select
                {...register("gender")}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="MALE">Nam</option>
                <option value="FEMALE">Nữ</option>
                <option value="OTHER">Khác</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Số Điện Thoại <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="0987654321"
                {...register("phone", { required: "Vui lòng nhập SĐT" })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="example@gmail.com"
                {...register("email")}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Địa Chỉ Chi Tiết (Số nhà, tên đường...)
              </label>
              <input
                type="text"
                placeholder="VD: Số 123, đường Nguyễn Trãi"
                {...register("addressDetail")}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: KẾT QUẢ HỌC TẬP (HỌC BẠ / ĐIỂM THI) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 text-indigo-600">
              <BookOpen className="w-5 h-5" />
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                3. Kết Quả Học Tập & Điểm Xét Tuyển
              </h2>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg">
              Đang chọn:{" "}
              {watchEducationLevel === "THCS"
                ? "Cấp THCS (Lớp 6-9)"
                : "Cấp THPT (Lớp 10-12)"}
            </span>
          </div>

          {/* Trường hợp TRÌNH ĐỘ THCS */}
          {watchEducationLevel === "THCS" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                {/* Lớp 6 */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700">
                    Lớp 6
                  </span>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="GPA 6"
                    {...register("gpa6")}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm"
                  />
                  <select
                    {...register("conduct6")}
                    className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="">Hạnh kiểm</option>
                    <option value="TOT">Tốt</option>
                    <option value="KHA">Khá</option>
                    <option value="TB">Trung bình</option>
                    <option value="YEU">Yếu</option>
                  </select>
                </div>

                {/* Lớp 7 */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700">
                    Lớp 7
                  </span>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="GPA 7"
                    {...register("gpa7")}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm"
                  />
                  <select
                    {...register("conduct7")}
                    className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="">Hạnh kiểm</option>
                    <option value="TOT">Tốt</option>
                    <option value="KHA">Khá</option>
                    <option value="TB">Trung bình</option>
                    <option value="YEU">Yếu</option>
                  </select>
                </div>

                {/* Lớp 8 */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700">
                    Lớp 8
                  </span>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="GPA 8"
                    {...register("gpa8")}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm"
                  />
                  <select
                    {...register("conduct8")}
                    className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="">Hạnh kiểm</option>
                    <option value="TOT">Tốt</option>
                    <option value="KHA">Khá</option>
                    <option value="TB">Trung bình</option>
                    <option value="YEU">Yếu</option>
                  </select>
                </div>

                {/* Lớp 9 */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700">
                    Lớp 9
                  </span>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="GPA 9"
                    {...register("gpa9")}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm"
                  />
                  <select
                    {...register("conduct9")}
                    className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="">Hạnh kiểm</option>
                    <option value="TOT">Tốt</option>
                    <option value="KHA">Khá</option>
                    <option value="TB">Trung bình</option>
                    <option value="YEU">Yếu</option>
                  </select>
                </div>
              </div>

              <div className="w-full sm:w-1/4">
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Năm Tốt Nghiệp THCS
                </label>
                <input
                  type="number"
                  placeholder="VD: 2026"
                  {...register("thcsGradYear")}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>
            </div>
          )}

          {/* Trường hợp TRÌNH ĐỘ THPT */}
          {watchEducationLevel === "THPT" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    GPA Lớp 10
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Điểm TB Lớp 10"
                    {...register("gpa10")}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    GPA Lớp 11
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Điểm TB Lớp 11"
                    {...register("gpa11")}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    GPA Lớp 12
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Điểm TB Lớp 12"
                    {...register("gpa12")}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="w-full sm:w-1/4">
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Năm Tốt Nghiệp THPT
                </label>
                <input
                  type="number"
                  placeholder="VD: 2026"
                  {...register("thptGradYear")}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>
            </div>
          )}

          {/* Ô Nhập Điểm Thi (Nếu chọn xét điểm thi) & Ô Tính Tổng */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {watchAdmissionType === "EXAM_SCORE" && (
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Tổng Điểm Thi Xét Tuyển
                </label>
                <input
                  type="number"
                  step="0.05"
                  placeholder="VD: 24.5"
                  {...register("totalExamScore")}
                  className="w-full px-3 py-2 bg-amber-50/50 border border-amber-200 rounded-xl text-sm font-semibold text-amber-900"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Điểm Xét Tuyển (Đã Tính)
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="Tự động hoặc nhập tay"
                {...register("scoreCalculated")}
                className="w-full px-3 py-2 bg-indigo-50/50 border border-indigo-200 rounded-xl text-sm font-bold text-indigo-700"
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: ƯU TIÊN & XÉT TUYỂN THẲNG */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-indigo-600">
            <Award className="w-5 h-5" />
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
              4. Chế Độ Ưu Tiên & Xét Tuyển Thẳng
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Khu Vực Ưu Tiên
              </label>
              <select
                {...register("priorityRegion")}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              >
                <option value="">-- Không chọn --</option>
                <option value="KV1">Khu vực 1 (KV1)</option>
                <option value="KV2_NT">Khu vực 2 Nông thôn (KV2-NT)</option>
                <option value="KV2">Khu vực 2 (KV2)</option>
                <option value="KV3">Khu vực 3 (KV3)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Đối Tượng Ưu Tiên
              </label>
              <select
                {...register("priorityObject")}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              >
                <option value="NONE">Không có</option>
                <option value="CON_THUONG_BINH_LIET_SI">
                  Con thương binh / Liệt sĩ
                </option>
                <option value="DAN_TOC_THIEU_SO">Dân tộc thiểu số</option>
                <option value="HO_NGHEO">Hộ nghèo / Cận nghèo</option>
                <option value="KHUYET_TAT">Người khuyết tật</option>
                <option value="KHAC">Đối tượng khác</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Điểm Ưu Tiên Cộng Thêm
              </label>
              <input
                type="number"
                step="0.25"
                {...register("priorityScore")}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>
          </div>

          {/* Cấu hình Xét Tuyển Thẳng */}
          <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...register("isDirectAdmission")}
                className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
              />
              <span className="text-xs font-bold text-slate-800">
                Đăng ký Xét Tuyển Thẳng
              </span>
            </label>

            {watchIsDirect && (
              <div className="flex-1">
                <select
                  {...register("directReason")}
                  className="w-full px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-medium"
                >
                  <option value="">-- Chọn lý do xét tuyển thẳng --</option>
                  <option value="HSG_QUOC_GIA">Học sinh giỏi Quốc Gia</option>
                  <option value="HSG_CAP_TINH">
                    Học sinh giỏi Cấp Tỉnh / Thành Phố
                  </option>
                  <option value="CHUNG_CHI_NGHE">
                    Có Chứng chỉ nghề phù hợp
                  </option>
                  <option value="CON_DIEN_CHINH_SACH">
                    Con diện chính sách đặc biệt
                  </option>
                  <option value="KHAC">Lý do khác</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* SECTION 5: THÔNG TIN PHỤ HUYNH & NGHỆ NẠO */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-indigo-600">
            <Users className="w-5 h-5" />
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
              5. Thông Tin Phụ Huynh / Người Giám Hộ
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Bố */}
            <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100 space-y-2">
              <span className="text-xs font-bold text-slate-700 block">
                Thông tin Bố
              </span>
              <input
                type="text"
                placeholder="Họ tên Bố"
                {...register("fatherName")}
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm"
              />
              <input
                type="text"
                placeholder="SĐT Bố"
                {...register("fatherPhone")}
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-mono"
              />
            </div>

            {/* Mẹ */}
            <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100 space-y-2">
              <span className="text-xs font-bold text-slate-700 block">
                Thông tin Mẹ
              </span>
              <input
                type="text"
                placeholder="Họ tên Mẹ"
                {...register("motherName")}
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm"
              />
              <input
                type="text"
                placeholder="SĐT Mẹ"
                {...register("motherPhone")}
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-mono"
              />
            </div>

            {/* Giám hộ */}
            <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100 space-y-2">
              <span className="text-xs font-bold text-slate-700 block">
                Người Giám Hộ (Khác)
              </span>
              <input
                type="text"
                placeholder="Họ tên người giám hộ"
                {...register("guardianName")}
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm"
              />
              <input
                type="text"
                placeholder="SĐT người giám hộ"
                {...register("guardianPhone")}
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-mono"
              />
            </div>
          </div>

          {/* Ghi chú */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Ghi Chú Bổ Sung
            </label>
            <textarea
              rows={2}
              placeholder="Nhập ghi chú thêm về hồ sơ này..."
              {...register("note")}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default TaoHoSoTuyenSinh;
