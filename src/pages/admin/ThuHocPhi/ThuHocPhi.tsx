import {
  DollarSign,
  User,
  CheckCircle,
  Clock,
  PieChart,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";
import { ThuHocPhiProvider, useThuHocPhiContext } from "./ThuHocPhiProvider";
import { formatCurrency } from "../../../util/format";
import HeaderPage from "../../../components/ui/HeaderPage";
import { StatCard } from "../../../components/ui/StatCard";
import TableThuHocPhi from "./TableThuHocPhi";
import FilterOption from "./components/FilterOption";
import ThuHocPhiOne from "./ThuHocPhiOne/ThuHocPhiOneModal";
import ModalThuHocPhi from "./ModalThuHocPhi";

const TuitionFee = () => {
  return (
    <ThuHocPhiProvider>
      <Inner />
    </ThuHocPhiProvider>
  );
};

function Inner() {
  const {
    selectedStudent,
    showDetailModal,
    showPaymentModal,
    setShowDetailModal,
    setShowPaymentModal,
    stats,
  } = useThuHocPhiContext();

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-blue-50">
      <div className="max-w-400 mx-auto px-8 py-8">
        <HeaderPage
          title="Quản lý Thu học phí"
          sub="Theo dõi và quản lý thu học phí toàn trường"
          icon={<DollarSign className="w-10 h-10" />}
          classNameIcon="bg-gradient-to-br from-green-500 to-emerald-600 text-white"
        />

        {/* Thống kê tổng quan */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[
            {
              label: "Tổng số học viên",
              value: stats.totalStudents,
              icon: (
                <div className="p-3 bg-blue-100 rounded-lg">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
              ),
            },
            {
              label: "Đã thu",
              value: formatCurrency(stats.totalRevenue),
              icon: (
                <div className="p-3 bg-white/20 rounded-lg">
                  <CheckCircle className="w-6 h-6" />
                </div>
              ),
              className:
                "bg-linear-to-br from-green-500 to-emerald-600 text-white",
            },
            {
              label: "Còn nợ",
              value: formatCurrency(stats.totalRemaining),
              icon: (
                <div className="p-3 bg-white/20 rounded-lg">
                  <Clock className="w-6 h-6" />
                </div>
              ),
              className:
                "bg-linear-to-br from-orange-500 to-red-600 text-white",
            },
            {
              label: "Đã đóng đủ",
              value: `${stats.paidStudents} Sinh viên`,
              icon: (
                <div className="p-3 bg-white/20 rounded-lg">
                  <ShieldCheck className="w-6 h-6" />
                </div>
              ),
              className:
                "bg-linear-to-br from-emerald-400 to-teal-500 text-white",
            },
            {
              label: "Đóng 1 phần",
              value: `${stats.partialStudents} Sinh viên`,
              icon: (
                <div className="p-3 bg-white/20 rounded-lg">
                  <PieChart className="w-6 h-6" />
                </div>
              ),
              className:
                "bg-linear-to-br from-amber-400 to-orange-500 text-white",
            },
            {
              label: "Chưa đóng",
              value: `${stats.unpaidStudents} Sinh viên`,
              icon: (
                <div className="p-3 bg-white/20 rounded-lg">
                  <AlertCircle className="w-6 h-6" />
                </div>
              ),
              className: "bg-linear-to-br from-rose-500 to-red-700 text-white",
            },
          ].map((stat) => (
            <StatCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
              icon={stat.icon}
              className={stat.className}
            />
          ))}
        </div>

        {/* Bộ lọc và tìm kiếm */}
        <FilterOption />

        <TableThuHocPhi />

        {/* Modal thu học phí */}
        {showPaymentModal && selectedStudent && (
          <ModalThuHocPhi
            selectedStudent={selectedStudent}
            onClose={() => setShowPaymentModal(false)}
          />
        )}

        {/* Modal chi tiết học phí */}
        {showDetailModal && selectedStudent && (
          <ThuHocPhiOne
            selectedStudent={selectedStudent}
            onClose={() => setShowDetailModal(false)}
          />
        )}
      </div>
    </div>
  );
}

export default TuitionFee;
