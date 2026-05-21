import TableHoSoHocSinh from "./TableHoSoHocSinh";
import PageShell from "../../../../components/ui/PageShell";
import StatOverview from "../components/StatOverview";
import { GraduationCap } from "lucide-react";
import ButtonAction from "../../../../components/ui/ButtonAction";

const DanhSachHoSoHocSinh = () => {
  return (
    <PageShell
      title="Hồ sơ học sinh"
      sub="Quản lý danh sách và hồ sơ toàn bộ học sinh các hệ đào tạo"
      icon={GraduationCap}
      renderRight={<ButtonAction label="Thêm học sinh" />}
    >
      <div className="space-y-5">
        {/* ── Stats ── */}
        <StatOverview />

        <TableHoSoHocSinh />
      </div>
    </PageShell>
  );
};

export default DanhSachHoSoHocSinh;
