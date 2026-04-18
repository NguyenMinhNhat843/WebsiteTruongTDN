import { DollarSign } from "lucide-react";
import { ThuHocPhiProvider, useThuHocPhiContext } from "./ThuHocPhiProvider";
import TableThuHocPhi from "./TableThuHocPhi";
import FilterOption from "./components/FilterOption";
import ThuHocPhiOne from "./ThuHocPhiOne/ThuHocPhiOneModal";
import ModalThuHocPhi from "./ModalThuHocPhi";
import PageShell from "../../../components/ui/PageShell";
import StatOVerview from "./components/StatOVerview";
import ButtonAction from "../../../components/ui/ButtonAction";
import BienLaiModal from "./CreateThuHocPhi/ThuHocPhiModal";

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
    openModalThuHocPhi,
    setOpenModalThuHocPhi,
  } = useThuHocPhiContext();

  return (
    <PageShell
      title="Quản lý Thu học phí"
      sub="Theo dõi và quản lý thu học phí toàn trường"
      icon={DollarSign}
      classNameIcon="bg-gradient-to-br from-green-500 to-emerald-600 text-white"
      renderRight={
        <ButtonAction
          label="Đóng học phí"
          onClick={() => setOpenModalThuHocPhi(true)}
        />
      }
    >
      <div className="max-w-400 mx-auto">
        {/* Thống kê tổng quan */}
        <StatOVerview />

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

      {openModalThuHocPhi && (
        <BienLaiModal onClose={() => setOpenModalThuHocPhi(false)} />
      )}
    </PageShell>
  );
}

export default TuitionFee;
