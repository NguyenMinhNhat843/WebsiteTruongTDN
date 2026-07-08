import { useState } from "react";
import {
  User,
  Users,
  FileText,
  ClipboardList,
  Edit3,
  X,
  Check,
} from "lucide-react";
import Breadcrumb from "../../../../components/ui/Breadcrum";
import { useHocSinhContext, type StatusHocSinhEnum } from "../HocSinhProvider";
import { StudentDocuments } from "./HoSoFile";
import {
  HoSoHocSinhOneProvider,
  useHoSoHocSinhOneContext,
} from "./HoSoHocSinhOneProvider";
import TabThongTinCaNhan from "./Tabs/TabThongTinCaNhan";
import TabThongTinNguoiGiamHo from "./Tabs/TabThongTinNguoiGiamHo";
import TabHoSoXetTuyen from "./Tabs/TabHoSoXetTuyen";
import { toast } from "sonner";
import { STUDENT_STATUS_MAP } from "../../../../api/enum";
import { $api } from "../../../../api/client";

const HoSoHocSinhOne = () => {
  return (
    <HoSoHocSinhOneProvider>
      <Inner />
    </HoSoHocSinhOneProvider>
  );
};

const Inner = () => {
  const {
    dataHoSoHocSinh,
    isEditMode,
    setIsEditMode,
    formData,
    setFormData,
    updateStudent,
    isUpdatingStudent,
    studentDetail,
    handleChangeFormUpdate,
  } = useHoSoHocSinhOneContext();
  const { isGettingStudentDetail } = useHocSinhContext();
  const [activeTab, setActiveTab] = useState<
    "personal" | "family" | "admission" | "documents"
  >("personal");

  const handleSave = () => {
    if (!studentDetail?.id) return;

    // Loại bỏ các field không được phép gửi lên DTO theo Prisma Model yêu cầu
    const dtoData = formData;
    console.log("dtoData trước khi gửi lên backend: ", dtoData);

    // Ép kiểu các trường Number cho đúng DTO đầu vào backend
    if (dtoData.fatherYearOfBirth)
      dtoData.fatherYearOfBirth = Number(dtoData.fatherYearOfBirth);
    if (dtoData.motherYearOfBirth)
      dtoData.motherYearOfBirth = Number(dtoData.motherYearOfBirth);
    if (dtoData.guardianYearOfBirth)
      dtoData.guardianYearOfBirth = Number(dtoData.guardianYearOfBirth);

    if (dtoData.admissionProfile) {
      dtoData.admissionProfile.gpa6 = Number(dtoData.admissionProfile.gpa6);
      dtoData.admissionProfile.gpa7 = Number(dtoData.admissionProfile.gpa7);
      dtoData.admissionProfile.gpa8 = Number(dtoData.admissionProfile.gpa8);
      dtoData.admissionProfile.gpa9 = Number(dtoData.admissionProfile.gpa9);
    }

    const cleanedData = Object.fromEntries(
      Object.entries(dtoData).filter(
        ([_, value]) => value !== null && value !== undefined,
      ),
    );

    updateStudent(
      {
        params: {
          path: {
            id: studentDetail.id,
          },
        },
        body: cleanedData,
      },
      {
        onSuccess: () => {
          toast.success("Cập nhật thông tin học sinh thành công!");
        },
        onError: () => {
          toast.error(
            "Cập nhật thông tin học sinh thất bại. Vui lòng thử lại.",
          );
        },
      },
    );

    // Trạng thái Loading
    if (isGettingStudentDetail) {
      return (
        <div className="flex h-screen items-center justify-center bg-gray-50">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <span className="ml-3 text-lg font-medium text-gray-600">
            Đang tải thông tin học sinh...
          </span>
        </div>
      );
    }
  };

  // Trường hợp không có dữ liệu
  if (!studentDetail) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 text-gray-500">
        <p className="text-xl font-semibold">
          Không tìm thấy thông tin học sinh.
        </p>
      </div>
    );
  }

  // Hàm helper định dạng ngày tháng
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "---";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  // Hàm hiển thị Badge trạng thái
  const renderStatusBadge = (status: NonNullable<StatusHocSinhEnum>) => {
    const statusMap = {
      registered: {
        text: "Đợi tư vấn",
        color: "bg-gray-100 text-gray-800 border-gray-200",
      },
      pending: {
        text: "Chờ duyệt",
        color: "bg-gray-100 text-gray-800 border-gray-200",
      },
      failed: {
        text: "Không đạt",
        color: "bg-red-100 text-red-800 border-red-200",
      },
      studying: {
        text: "Đang học",
        color: "bg-green-100 text-green-800 border-green-200",
      },
      graduated: {
        text: "Đã tốt nghiệp",
        color: "bg-blue-100 text-blue-800 border-blue-200",
      },
      suspended: {
        text: "Bảo lưu",
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      },
      dropped: {
        text: "Thôi học",
        color: "bg-red-100 text-red-800 border-red-200",
      },
      approved: {
        text: "Đã duyệt nhập học",
        color: "bg-indigo-100 text-indigo-800 border-indigo-200",
      },
      expelled: {
        text: "Buộc thôi học",
        color: "bg-purple-100 text-purple-800 border-purple-200",
      },
    };
    const current = statusMap[status] || {
      text: status,
      color: "bg-gray-100 text-gray-800 border-gray-200",
    };

    return (
      <span
        className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${current.color}`}
      >
        {current.text}
      </span>
    );
  };

  // Định nghĩa danh sách Tabs
  const tabs = [
    {
      id: "personal",
      label: "Thông tin cá nhân & Nhập học",
      icon: <User className="w-4 h-4" />,
    },
    {
      id: "family",
      label: "Thông tin người giám hộ",
      icon: <Users className="w-4 h-4" />,
    },
    {
      id: "admission",
      label: "Hồ sơ xét tuyển (Điểm THCS)",
      icon: <ClipboardList className="w-4 h-4" />,
    },
    {
      id: "documents",
      label: "Tài liệu & Học bạ đính kèm",
      icon: <FileText className="w-4 h-4" />,
    },
  ] as const;

  const STUDENT_STATUS_OPTIONS = Object.entries(STUDENT_STATUS_MAP).map(
    ([value, label]) => ({
      value: value,
      label,
    }),
  );

  // Lấy các khóa đào tạo của ngành
  const { data: batches } = $api.useQuery(
    "get",
    "/batches",
    {
      params: {
        query: {
          majorId: studentDetail?.majorId!,
        },
      },
    },
    {
      enabled: !!studentDetail?.majorId && !isGettingStudentDetail,
    },
  );

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 sm:p-6 lg:p-8">
      <Breadcrumb
        items={[
          { label: "Hồ sơ học sinh", link: "/admin/hoc-sinh/ho-so" },
          { label: `${studentDetail.fullName}`, active: true },
        ]}
      />

      <div className="space-y-6 mt-4">
        {/* ================= HEADER PROFILE ================= */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
            {/* Avatar */}
            <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-slate-100 ring-4 ring-slate-50">
              {studentDetail.avatarUrl ? (
                <img
                  src={studentDetail.avatarUrl}
                  alt={studentDetail.fullName || "Avatar"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-blue-50 text-3xl font-bold text-blue-600">
                  {studentDetail.fullName?.charAt(0).toUpperCase() || "H"}
                </div>
              )}
            </div>

            {/* Thông tin chính */}
            <div className="flex-1 space-y-2">
              <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-center">
                {/* Họ tên */}
                <h1 className="text-2xl font-bold text-gray-900">
                  {studentDetail.fullName || "Chưa cập nhật"}
                </h1>

                {/* Trạng thái */}
                {isEditMode ? (
                  <select
                    value={formData.status || ""}
                    onChange={(e) =>
                      setFormData((prev: any) => ({
                        ...prev,
                        status: e.target.value,
                      }))
                    }
                    className="rounded-lg border border-gray-300 bg-white px-2 py-1 text-xs font-semibold focus:border-blue-500 focus:outline-none"
                  >
                    {STUDENT_STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  studentDetail.status &&
                  renderStatusBadge(studentDetail.status)
                )}
              </div>

              {/* Thông tin phụ */}
              <div className="grid grid-cols-1 gap-x-4 gap-y-1 text-sm text-gray-500 sm:grid-cols-2 md:grid-cols-3">
                <p>
                  Mã học sinh:{" "}
                  <span className="font-semibold text-gray-700">
                    {studentDetail.studentCode}
                  </span>
                </p>
                <p>
                  Ngành nghề:{" "}
                  <span className="font-semibold text-gray-700">
                    {studentDetail.major?.majorName ||
                      studentDetail.majorId ||
                      "---"}
                  </span>
                </p>
                <p className="flex items-center gap-2">
                  Khóa đào tạo:{" "}
                  {isEditMode ? (
                    <select
                      className="rounded-xl border border-gray-200 bg-slate-50/50 p-1.5 px-2.5 text-sm font-semibold text-gray-700 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                      value={formData.batchId ?? ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        handleChangeFormUpdate(
                          "batchId",
                          val ? Number(val) : null,
                        );
                      }}
                    >
                      <option value="">-- Chọn khóa đào tạo --</option>
                      {batches?.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.batchName} ({b.batchCode})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span className="font-semibold text-gray-700">
                      {batches?.find((b) => b.id === formData.batchId)
                        ?.batchName ||
                        studentDetail.batch?.batchName ||
                        studentDetail.batch?.batchCode ||
                        "---"}
                    </span>
                  )}
                </p>
                <p>
                  Lớp học:{" "}
                  <span className="font-semibold text-gray-700">
                    {studentDetail.class?.className ||
                      studentDetail.classId ||
                      "---"}
                  </span>
                </p>
              </div>
            </div>

            {/* --- KHỐI ACTIONS NUT BẤM UPDATE --- */}
            <div className="flex gap-2 self-center sm:self-start">
              {!isEditMode ? (
                <button
                  onClick={() => setIsEditMode(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-all shadow-sm"
                >
                  <Edit3 className="w-4 h-4" /> Chỉnh sửa hồ sơ
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditMode(false)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition-all"
                    disabled={isUpdatingStudent}
                  >
                    <X className="w-4 h-4" /> Hủy
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium transition-all shadow-sm"
                    disabled={isUpdatingStudent}
                  >
                    <Check className="w-4 h-4" />{" "}
                    {isUpdatingStudent ? "Đang lưu..." : "Lưu thay đổi"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ================= NAVIGATION TABS ================= */}
        <div className="flex border-b border-gray-200 bg-white px-4 pt-2 rounded-xl shadow-sm overflow-x-auto custom-scrollbar">
          <div className="flex space-x-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 pb-4 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600 font-semibold"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ================= TAB CONTENT RENDER ================= */}
        <div className="bg-transparent transition-all duration-200">
          {/* TAB 1: THÔNG TIN CÁ NHÂN & NHẬP HỌC */}
          {activeTab === "personal" && <TabThongTinCaNhan />}

          {/* TAB 2: THÔNG TIN NGƯỜI GIÁM HỘ (GIA ĐÌNH) */}
          {activeTab === "family" && <TabThongTinNguoiGiamHo />}

          {/* TAB 3: HỒ SƠ XÉT TUYỂN (ĐIỂM SỐ & HẠNH KIỂM CẤP THCS) */}
          {activeTab === "admission" && <TabHoSoXetTuyen />}

          {/* TAB 4: TÀI LIỆU ĐÍNH KÈM */}
          {activeTab === "documents" && (
            <StudentDocuments documents={dataHoSoHocSinh} />
          )}
        </div>

        {/* Hệ thống Footprint thời gian */}
        <div className="text-right text-xs text-gray-400 space-x-4">
          <span>Ngày tạo hồ sơ: {formatDate(studentDetail.createdAt)}</span>
          <span>Cập nhật cuối: {formatDate(studentDetail.updatedAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default HoSoHocSinhOne;
