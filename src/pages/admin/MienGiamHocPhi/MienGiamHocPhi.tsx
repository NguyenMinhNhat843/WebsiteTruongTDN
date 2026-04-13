import { Gift, Plus, Award } from "lucide-react";
import { ExemtionProvider, useExemtionContext } from "./ExemtionProvider";
import { formatCurrency } from "../../../util/format";
import TableDanhSachMienGiam from "./TableDanhSachMienGiam";
import ModalDetail from "./ModalDetail";
import FiltersSection from "./components/FiltersSection";
import OverviewStats from "./components/OverviewStats";
import ModalRegister from "./components/ModalRegister";

const ExemptionManagement = () => {
  return (
    <ExemtionProvider>
      <Inner />
    </ExemtionProvider>
  );
};

function Inner() {
  const {
    selectedExemption,
    setSelectedExemption,
    setShowDetailModal,
    setShowRegisterModal,
    showDetailModal,
    showRegisterModal,
    typeStats,
  } = useExemtionContext();

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-white to-pink-50">
      <div className="max-w-400 mx-auto px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-linear-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
                <Gift className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Quản Lý Miễn Giảm Học Phí
                </h1>
                <p className="text-gray-600">
                  Đăng ký và phê duyệt miễn giảm học phí
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowRegisterModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl font-medium"
            >
              <Plus className="w-5 h-5" />
              Đăng ký miễn giảm
            </button>
          </div>
        </div>

        {/* Thống kê tổng quan */}
        <OverviewStats />

        {/* Thống kê theo loại miễn giảm */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-600" />
            Thống kê theo loại miễn giảm
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {typeStats.map(({ type, count, amount }, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-all bg-gray-50/30"
              >
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-600 truncate mr-2">
                    {type}
                  </span>
                  <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full whitespace-nowrap text-[11px]">
                    {count} SV
                  </span>
                </div>
                <div className="text-lg font-bold text-purple-600">
                  {formatCurrency(amount)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bộ lọc và tìm kiếm */}
        <FiltersSection />

        {/* Bảng danh sách miễn giảm */}
        <TableDanhSachMienGiam />

        {/* Modal chi tiết */}
        {showDetailModal && selectedExemption && (
          <ModalDetail
            onClose={() => setShowDetailModal(false)}
            selectedExemption={selectedExemption}
            setSelectedExemption={setSelectedExemption}
          />
        )}

        {/* Modal đăng ký miễn giảm */}
        {showRegisterModal && (
          <ModalRegister onClose={() => setShowRegisterModal(false)} />
        )}
      </div>
    </div>
  );
}

export default ExemptionManagement;
