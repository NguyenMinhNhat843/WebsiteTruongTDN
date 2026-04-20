import {
  TaoChuongTrinhKhungProvider,
  useTaoChuongTrinhKhungContext,
} from "./TaoChuongTrinhKhungProvider";
import PageShell from "../../../components/ui/PageShell";
import { GrabIcon } from "lucide-react";
import { CurriculumHeader } from "./components/HeaderCuriculum";
import { SemesterManager } from "./components/SelesterManager";

const TaoChuongTrinhKhung = () => {
  return (
    <TaoChuongTrinhKhungProvider>
      <Inner />
    </TaoChuongTrinhKhungProvider>
  );
};

const Inner = () => {
  const {
    curriculum,
    setCurriculum,
    selectedMajor,
    totalCredits,
    totalSemesters,
    addSemester,
    addSubject,
    moveSubject,
  } = useTaoChuongTrinhKhungContext();

  return (
    <PageShell
      title="Tạo chương trình khung"
      sub="Xây dựng chương trình khung cho các ngành đào tạo"
      icon={GrabIcon}
    >
      <div className="space-y-6">
        <CurriculumHeader
          totalCredits={totalCredits}
          totalSemesters={totalSemesters}
          curriculum={curriculum}
          selectedMajor={selectedMajor}
          setCurriculum={setCurriculum}
        />

        <SemesterManager
          addSubject={addSubject}
          moveSubject={moveSubject}
          addSemester={addSemester}
          curriculum={curriculum}
        />
        <button
          onClick={addSemester}
          className="px-4 py-2 w-full text-center text-[12px] font-bold text-blue-600 border 
          border-blue-200 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
        >
          <span className="text-lg">+</span> Thêm học kỳ
        </button>
      </div>
    </PageShell>
  );
};

export default TaoChuongTrinhKhung;
