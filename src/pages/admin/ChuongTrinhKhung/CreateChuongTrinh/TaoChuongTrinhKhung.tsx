import PageShell from "../../../../components/ui/PageShell";
import { GrabIcon, PlusIcon, RotateCcw, Save } from "lucide-react";
import CreateProgramForm from "./CreateProgramForm";
import SemesterManager from "./SemesterManager";
import { useState } from "react";
import {
  TaoChuongTrinhKhungProvider,
  useTaoChuongTrinhKhungContext,
} from "./CreateProgramProvider";

const TaoChuongTrinhKhung = () => {
  return (
    <TaoChuongTrinhKhungProvider>
      <Inner />
    </TaoChuongTrinhKhungProvider>
  );
};

const Inner = () => {
  const { reset } = useTaoChuongTrinhKhungContext();
  const [semesterNumber, setSemesterNumber] = useState<number>(1);
  const handleAddSemester = () => {
    setSemesterNumber((prev) => prev + 1);
  };

  return (
    <PageShell
      title="Tạo chương trình khung"
      sub="Xây dựng chương trình khung cho các ngành đào tạo"
      icon={GrabIcon}
      renderRight={
        <div className="pt-4 flex gap-3">
          <button
            type="submit"
            form="create-program-form"
            className="flex-1 flex items-center p-2 cursor-pointer justify-center gap-2 
            bg-blue-600 hover:bg-blue-700 text-white font-semibold 
            py-2.5 rounded-lg transition-all shadow-sm active:scale-[0.99]"
          >
            <Save className="w-4 h-4" />
            Lưu thông tin
          </button>

          <button
            type="button"
            onClick={() => reset()}
            className="px-6 py-2.5 border border-slate-200 text-slate-600 font-medium rounded-lg hover:bg-slate-50 hover:text-slate-800 transition-all active:scale-[0.99] flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Clear
          </button>
        </div>
      }
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
