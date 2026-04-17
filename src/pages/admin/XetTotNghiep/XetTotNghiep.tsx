import { GraduationCap, UserPlus, X } from "lucide-react";
import { INITIAL_MAJORS } from "./mockData";
import {
  useXetTotNghiepContext,
  XetTotNghiepProvider,
} from "./XetTotNghiepProvider";
import PageShell from "../../../components/ui/PageShell";
import ButtonAction from "../../../components/ui/ButtonAction";
import FilterSection from "./components/FilterSection";
import TableSinhVienXetTotNghiep from "./TableSinhVienXetTotNghiep";
import ButtonExportExcel from "../../../components/ui/ButtonExportExcel";
import CreateHoSoXetTuyen from "./CreateHoSoXetTuyen/CreateHoSoXetTuyen";

const GraduationManagement = () => {
  return (
    <XetTotNghiepProvider>
      <Inner />
    </XetTotNghiepProvider>
  );
};

const Inner = () => {
  const {
    isModalOpen,
    setIsModalOpen,
    newStudent,
    setNewStudent,
    handleAddStudent,
    openModelOne,
  } = useXetTotNghiepContext();
  console.log(openModelOne);

  return (
    <PageShell
      title="Hệ thống xét tốt nghiệp"
      sub="Quản lý danh sách dự kiến và quyết định tốt nghiệp"
      icon={<GraduationCap size={26} />}
      renderRight={
        <div className="flex flex-wrap gap-3">
          <ButtonAction
            icon={<UserPlus size={20} />}
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white"
          >
            Thêm học sinh
          </ButtonAction>
          <ButtonExportExcel label="Xuất báo cáo" />
        </div>
      }
    >
      <div className="py-4">
        <div className="pb-4">
          <FilterSection />
        </div>

        {/* Content Table */}
        <TableSinhVienXetTotNghiep />

        {/* Modal Thêm Sinh Viên */}
        {isModalOpen && <CreateHoSoXetTuyen />}
      </div>
    </PageShell>
  );
};

export default GraduationManagement;
