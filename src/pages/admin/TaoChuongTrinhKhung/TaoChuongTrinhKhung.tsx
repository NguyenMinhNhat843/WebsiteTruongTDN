import PageShell from "../../../components/ui/PageShell";
import { GrabIcon, PlusIcon } from "lucide-react";
import CreateProgramForm from "../../../features/ChuongTrinhKhung/CreateProgramForm";
import SemesterManager from "../../../features/ChuongTrinhKhung/SemesterManager";
import { useState } from "react";
import { TaoChuongTrinhKhungProvider } from "../../../features/ChuongTrinhKhung/CreateProgramProvider";

const TaoChuongTrinhKhung = () => {
  return (
    <TaoChuongTrinhKhungProvider>
      <Inner />
    </TaoChuongTrinhKhungProvider>
  );
};

const Inner = () => {
  const [semesterNumber, setSemesterNumber] = useState<number>(1);
  const handleAddSemester = () => {
    setSemesterNumber((prev) => prev + 1);
  };

  return (
    <PageShell
      title="Tạo chương trình khung"
      sub="Xây dựng chương trình khung cho các ngành đào tạo"
      icon={GrabIcon}
    >
      <div>
        <CreateProgramForm />

        {/* Danh sách các học kỳ */}
        <div className="space-y-6">
          {Array.from({ length: semesterNumber }, (_, i) => i + 1).map(
            (num) => (
              <div key={num} className="relative">
                <SemesterManager title={`Học kỳ ${num}`} semesterNumber={num} />
              </div>
            ),
          )}
        </div>

        <div className="flex justify-center pt-4">
          <button
            onClick={handleAddSemester}
            className="flex items-center gap-2 bg-white border-2 border-dashed border-indigo-300 text-indigo-600 px-8 py-3 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all font-semibold"
          >
            <PlusIcon className="text-lg" />
            Thêm Học Kỳ {semesterNumber + 1}
          </button>
        </div>
      </div>
    </PageShell>
  );
};

export default TaoChuongTrinhKhung;
