import PageShell from '../../../../components/ui/PageShell'
import { GrabIcon, PlusIcon, RotateCcw, Save } from 'lucide-react'
import CreateProgramForm from './CreateProgramForm'
import SemesterManager from './SemesterManager'
import { useState } from 'react'
import { TaoChuongTrinhKhungProvider, useTaoChuongTrinhKhungContext } from './CreateProgramProvider'
import ButtonAction from '../../../../components/ui/ButtonAction'

const TaoChuongTrinhKhung = () => {
  return (
    <TaoChuongTrinhKhungProvider>
      <Inner />
    </TaoChuongTrinhKhungProvider>
  )
}

const Inner = () => {
  const { reset, isCreatingCurriculum } = useTaoChuongTrinhKhungContext()
  const [semesterNumber, setSemesterNumber] = useState<number>(1)
  const handleAddSemester = () => {
    setSemesterNumber((prev) => prev + 1)
  }

  return (
    <PageShell
      title="Tạo chương trình khung"
      sub="Xây dựng chương trình khung cho các ngành đào tạo"
      icon={GrabIcon}
      renderRight={
        <div className="flex gap-3 pt-4">
          <ButtonAction
            type="submit"
            form="create-program-form"
            variant="primary"
            label="Lưu chương trình"
            loading={isCreatingCurriculum}
            icon={<Save size={16} />}
          />

          <ButtonAction
            type="button"
            variant="outline"
            label="Clear"
            icon={<RotateCcw size={16} />}
            onClick={() => reset()}
          />
        </div>
      }
    >
      <div>
        <CreateProgramForm />

        {/* Danh sách các học kỳ */}
        <div className="space-y-6">
          {Array.from({ length: semesterNumber }, (_, i) => i + 1).map((num) => (
            <div key={num} className="relative">
              <SemesterManager title={`Học kỳ ${num}`} semesterNumber={num} />
            </div>
          ))}
        </div>

        <div className="flex justify-center pt-4">
          <button
            onClick={handleAddSemester}
            className="flex items-center gap-2 rounded-xl border-2 border-dashed border-indigo-300 bg-white px-8 py-3 font-semibold text-indigo-600 transition-all hover:border-indigo-500 hover:bg-indigo-50"
          >
            <PlusIcon className="text-lg" />
            Thêm Học Kỳ {semesterNumber + 1}
          </button>
        </div>
      </div>
    </PageShell>
  )
}

export default TaoChuongTrinhKhung
