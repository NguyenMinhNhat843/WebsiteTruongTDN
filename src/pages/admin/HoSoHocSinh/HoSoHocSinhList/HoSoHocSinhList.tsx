import TableHoSoHocSinh from "../../../../features/HocSinh/TableHoSoHocSinh";
import PageShell from "../../../../components/ui/PageShell";
import StatOverview from "../components/StatOverview";
import ButtonImportExcel from "../../../../components/ui/ButtonImportExcel";
import ButtonExportExcel from "../../../../components/ui/ButtonExportExcel";
import { GraduationCap } from "lucide-react";

const DanhSachHoSoHocSinh = () => {
  return (
    <PageShell
      title="Hồ sơ học sinh"
      sub="Quản lý danh sách và hồ sơ toàn bộ học sinh các hệ đào tạo"
      icon={GraduationCap}
      renderRight={
        <div className="flex gap-2">
          <ButtonImportExcel label="Nhập excel" />
          <ButtonExportExcel label="Xuất Excel" />
        </div>
      }
    >
      <div className="py-5 space-y-5">
        {/* ── Stats ── */}
        <StatOverview />

        <TableHoSoHocSinh />
      </div>
    </PageShell>
  );
};

export default DanhSachHoSoHocSinh;
