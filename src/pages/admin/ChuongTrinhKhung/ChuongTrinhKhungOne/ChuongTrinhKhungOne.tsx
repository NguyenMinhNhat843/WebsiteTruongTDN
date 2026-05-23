import { type CuriculumResponseDto } from "../ChuongTrinhKhungProvider";
import CurriculumSemesterList from "./CurriculumSemesterList";

interface Props {
  data: CuriculumResponseDto;
}

const ChuongTrinhKhungOne = ({ data }: Props) => {
  return (
    <div className="flex-1 bg-white rounded-xl border border-slate-200 overflow-hidden min-w-0">
      <CurriculumSemesterList subjectList={data.curriculumSubjects} />
    </div>
  );
};

export default ChuongTrinhKhungOne;
