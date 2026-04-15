import {
  FileCheck,
  User,
  Calendar,
  BookOpen,
  CheckCircle,
  XCircle,
  Plus,
  Upload,
  Info,
  Users,
} from "lucide-react";
import {
  admissionBatches,
  QuanLyHoSoProvider,
  useQuanLyHoSoContext,
} from "./QuanLyHoSoProvider";
import BatchStatCard from "./components/BatchStatCard";
import OverviewStat from "./components/OverviewStat";
import FilterSection from "./components/FilterSection";
import SystemStatCard from "./components/SystemStatCard";
import TableQuanLyHoSo from "./TableQuanLyHoSo/TableQuanLyHoSo";
import Tabs from "../../../../components/ui/Tabs";
import { useState } from "react";
import PageShell from "../../../../components/ui/PageShell";
import { majors } from "./mockData";
import CreateHoSoTuyenSinh from "./CreateHoSoTuyenSinh";

const AdmissionApplication = () => {
  return (
    <QuanLyHoSoProvider>
      <Inner />
    </QuanLyHoSoProvider>
  );
};

function Inner() {
  const {
    batchStats,
    handleSubmit,
    selectedApplication,
    setFormData,
    setSelectedApplication,
    setShowRegisterModal,
    setShowReviewModal,
    showRegisterModal,
    showReviewModal,
    systemStats,
    formData,
  } = useQuanLyHoSoContext();
  const [activeTab, setActiveTab] = useState<TabType>("tongquan");
  const TABS = [
    { id: "tongquan", label: "Tổng quan", icon: <Info size={16} /> },
    {
      id: "danhsach",
      label: "Danh sách",
      icon: <Users size={16} />,
    },
  ];
  type TabType = (typeof TABS)[number]["id"];

  return (
    <PageShell
      title="Quản lý hồ sơ tuyển sinh"
      sub="Xem, xét duyệt và thống kê hồ sơ đăng ký tuyển sinh"
      icon={<FileCheck size={26} />}
      renderRight={
        <button
          onClick={() => setShowRegisterModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl font-medium"
        >
          <Plus className="w-5 h-5" />
          Tiếp nhận hồ sơ mới
        </button>
      }
    >
      <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

      <div className="min-h-screen bg-linear-to-br from-cyan-50 via-white to-blue-50">
        <div className="max-w-400 mx-auto py-8">
          {/* Thống kê tổng quan */}
          <OverviewStat />

          {/* Thống kê theo đợt và hệ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Thống kê theo đợt */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-cyan-600" />
                Thống kê theo đợt tuyển sinh
              </h3>
              <div className="space-y-3">
                {batchStats.slice(0, 3).map((stat, index) => (
                  <BatchStatCard key={index} stat={stat} />
                ))}
              </div>
            </div>

            {/* Thống kê theo hệ */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-cyan-600" />
                Thống kê theo hệ đào tạo
              </h3>
              <div className="space-y-3">
                {systemStats.map((stat, index) => (
                  <SystemStatCard key={index} stat={stat} />
                ))}
              </div>
            </div>
          </div>

          {/* Bộ lọc và tìm kiếm */}
          <FilterSection />

          {/* Bảng danh sách hồ sơ */}
          <TableQuanLyHoSo />

          {/* Modal tiếp nhận hồ sơ mới */}
          {showRegisterModal && <CreateHoSoTuyenSinh />}

          {/* Modal xét duyệt */}
          {showReviewModal && selectedApplication && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
                <div className="bg-linear-to-r from-cyan-500 to-blue-600 text-white p-6 rounded-t-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-bold">Xét Duyệt Hồ Sơ</h2>
                    <button
                      onClick={() => {
                        setShowReviewModal(false);
                        setSelectedApplication(null);
                      }}
                      className="text-white/80 hover:text-white"
                    >
                      <XCircle className="w-6 h-6" />
                    </button>
                  </div>
                  <p className="text-sm text-cyan-100">
                    Mã hồ sơ: {selectedApplication.id}
                  </p>
                </div>

                <div className="p-6 space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm space-y-1">
                      <div>
                        <span className="text-gray-600">Thí sinh:</span>{" "}
                        <span className="font-medium">
                          {selectedApplication.applicantName}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Ngành:</span>{" "}
                        <span className="font-medium">
                          {selectedApplication.major}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">GPA:</span>{" "}
                        <span className="font-bold text-cyan-600">
                          {selectedApplication.gpa.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ghi chú xét duyệt
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Nhập ghi chú..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => {
                        alert(`Từ chối hồ sơ ${selectedApplication.id}`);
                        setShowReviewModal(false);
                      }}
                      className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Không đạt
                    </button>
                    <button
                      onClick={() => {
                        alert(`Phê duyệt hồ sơ ${selectedApplication.id}`);
                        setShowReviewModal(false);
                      }}
                      className="flex-1 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Đạt
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}

export default AdmissionApplication;
