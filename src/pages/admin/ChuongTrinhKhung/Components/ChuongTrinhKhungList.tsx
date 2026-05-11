import {
  useChuongTrinhKhungContext,
  type CuriculumResponseDto,
} from "../ChuongTrinhKhungProvider";

interface Props {
  data: CuriculumResponseDto[];
}

const ChuongTrinhKhungList = ({ data }: Props) => {
  const { selectedId, setSelectedId } = useChuongTrinhKhungContext();
  return (
    <div className="w-90 shrink-0 space-y-2">
      {data.length === 0 && (
        <div className="bg-white rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-400 text-sm">
          Không có kết quả phù hợp.
        </div>
      )}
      {data.map((fw) => {
        const isSel = selectedId === fw.id;
        return (
          <button
            key={fw.id}
            onClick={() => {
              setSelectedId(fw.id);
            }}
            className={`w-full text-left rounded-xl border transition-all p-4 ${isSel ? "border-blue-500 bg-white shadow-lg ring-2 ring-blue-100" : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"}`}
          >
            <div className="flex items-start justify-between gap-2 mb-2.5">
              <span
                className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-black border`}
              >
                Hệ đào tạo: Không xác định
              </span>
              {/* <StatusBadge status={fw.status} /> */}
            </div>
            <p className="font-black text-slate-800 text-sm leading-tight mb-0.5">
              {fw.curriculumName}
            </p>
            <p className="font-mono text-[10px] text-slate-400 mb-2">
              {fw.curriculumCode}
            </p>
            <div className="flex flex-wrap gap-x-2 gap-y-0 text-xs text-slate-400">
              <span>Ngành: {fw.majorId}</span>
              <span className="text-slate-300">·</span>
              <span className="font-bold text-slate-600">
                {fw.totalCredits} tín chỉ
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default ChuongTrinhKhungList;
