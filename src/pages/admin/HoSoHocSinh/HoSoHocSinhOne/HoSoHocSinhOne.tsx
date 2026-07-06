import { useState } from "react";
import { User, Users, FileText, ClipboardList } from "lucide-react";
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

const HoSoHocSinhOne = () => {
  return (
    <HoSoHocSinhOneProvider>
      <Inner />
    </HoSoHocSinhOneProvider>
  );
};

const Inner = () => {
  const { dataHoSoHocSinh } = useHoSoHocSinhOneContext();
  const { studentDetail, isGettingStudentDetail } = useHocSinhContext();
  const [activeTab, setActiveTab] = useState<
    "personal" | "family" | "admission" | "documents"
  >("personal");

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
  const renderStatusBadge = (status: StatusHocSinhEnum) => {
    const statusMap = {
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
                <h1 className="text-2xl font-bold text-gray-900">
                  {studentDetail.fullName || "Chưa cập nhật"}
                </h1>
                {renderStatusBadge(studentDetail.status)}
              </div>

              <div className="grid grid-cols-1 gap-x-4 gap-y-1 text-sm text-gray-500 sm:grid-cols-2 md:grid-cols-3">
                <p>
                  Mã học sinh:{" "}
                  <span className="font-semibold text-gray-700">
                    {studentDetail.studentCode}
                  </span>
                </p>
                <p>
                  Khóa đào tạo:{" "}
                  <span className="font-semibold text-gray-700">
                    {studentDetail.batch?.batchCode ||
                      studentDetail.batchId ||
                      "---"}
                  </span>
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
          </div>
        </div>

        {/* ================= NAVIGATION TABS ================= */}
        <div className="flex border-b border-gray-200 bg-white px-4 pt-2 rounded-xl shadow-sm overflow-x-auto scrollbar-none">
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
