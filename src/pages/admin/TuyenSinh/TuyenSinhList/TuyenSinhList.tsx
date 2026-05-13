import { GraduationCap, Plus } from "lucide-react";
import PageShell from "../../../../components/ui/PageShell";
import StatsOverview from "../components/StatsOverview";
import ButtonAction from "../../../../components/ui/ButtonAction";
import FilterSection from "../components/FilterSection";
import AdmissionTable from "../../../../features/DotTuyenSinh/TuyenSinhTable";
import {
  DotTuyenSinhProvider,
  useDotTuyenSinhContext,
} from "../../../../features/DotTuyenSinh/DotTuyenSinhProvider";
import CreateDotTuyenSinhModal from "../../../../features/DotTuyenSinh/CreateDotTuyenSinhForm";

const DotTuyenSinhList = () => {
  return (
    <DotTuyenSinhProvider>
      <Inner />
    </DotTuyenSinhProvider>
  );
};

const Inner = () => {
  const { admissions, openFormCreate, setOpenFormCreate } =
    useDotTuyenSinhContext();

  return (
    <PageShell
      title="Đợt tuyển sinh"
      sub="Quản lý toàn bộ các đợt tuyển sinh theo hệ đào tạo"
      icon={GraduationCap}
      renderRight={
        <ButtonAction
          onClick={() => setOpenFormCreate(true)}
          icon={<Plus size={16} />}
        >
          Tạo đợt mới
        </ButtonAction>
      }
    >
      <div className="min-h-screen bg-gray-50">
        <main className="flex-1 py-4">
          <div className="space-y-5">
            <StatsOverview />
            <FilterSection />

            <AdmissionTable data={admissions || []} />
          </div>

          <CreateDotTuyenSinhModal
            isOpen={openFormCreate}
            onClose={() => setOpenFormCreate(false)}
          />
        </main>
      </div>
    </PageShell>
  );
};

export default DotTuyenSinhList;
