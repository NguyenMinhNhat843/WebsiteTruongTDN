import TableHoSoHocSinh from "./TableHoSoHocSinh";
import PageShell from "../../../../components/ui/PageShell";
import StatOverview from "../components/StatOverview";
import { GraduationCap } from "lucide-react";
import ButtonAction from "../../../../components/ui/ButtonAction";
import { useHocSinhContext } from "../HocSinhProvider";
import ImportStudentModal from "./ModalImportHocSinh";

const DanhSachHoSoHocSinh = () => {
  const { isOpenModalImport, setIsOpenModalImport } = useHocSinhContext();
  return (
    <PageShell
      title="Hồ sơ học sinh"
      sub="Quản lý danh sách và hồ sơ toàn bộ học sinh các hệ đào tạo"
      icon={GraduationCap}
      renderRight={
        <div>
          <ButtonAction label="Thêm học sinh" />
          <ButtonAction
            label="Import dữ liệu"
            className="ml-2"
            variant="outline"
            onClick={() => setIsOpenModalImport(true)}
          />
        </div>
      }
    >
      <div className="space-y-5">
        {/* ── Stats ── */}
        <StatOverview />

        <TableHoSoHocSinh />

        <ImportStudentModal
          isOpen={isOpenModalImport}
          onClose={() => setIsOpenModalImport(false)}
        />
      </div>
    </PageShell>
  );
};

export default DanhSachHoSoHocSinh;
