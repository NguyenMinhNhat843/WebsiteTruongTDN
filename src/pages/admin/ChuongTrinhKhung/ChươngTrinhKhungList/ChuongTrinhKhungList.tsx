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
    <div className="w-96 shrink-0 space-y-3 p-1">
      {data.length === 0 && (
        <div className="bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-12 text-center flex flex-col items-center justify-center">
          <svg
            className="w-10 h-10 text-slate-300 mb-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-slate-500 font-medium text-sm">
            Không có kết quả phù hợp
          </p>
          <p className="text-slate-400 text-xs mt-1">
            Vui lòng thử lại với bộ lọc khác.
          </p>
        </div>
      )}
      {/* Danh sách Card */}
      {data.map((fw) => {
        const isSel = selectedId === fw.id;
        return (
          <button
            key={fw.id}
            onClick={() => setSelectedId(fw.id)}
            className={`w-full text-left rounded-xl border p-4 transition-all duration-200 ease-in-out relative overflow-hidden group
              ${
                isSel
                  ? "border-blue-500 bg-linear-to-r from-blue-50/30 to-white shadow-md ring-1 ring-blue-500/30"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md hover:-translate-y-px"
              }`}
          >
            {/* Thanh màu highlight nhỏ ở cạnh trái khi được chọn */}
            {isSel && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />
            )}

            {/* Header: Badge Hệ đào tạo & Code */}
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <span
                className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide border
                  ${
                    isSel
                      ? "bg-blue-50 border-blue-200 text-blue-600"
                      : "bg-slate-50 border-slate-200 text-slate-500"
                  }`}
              >
                Hệ đào tạo: Trung cấp nghề
              </span>

              <span className="font-mono text-[11px] font-medium text-slate-400 bg-slate-100/60 px-1.5 py-0.5 rounded">
                #{fw.curriculumCode}
              </span>
            </div>

            {/* Body: Tên chương trình */}
            <h4
              className={`text-sm font-bold leading-snug mb-2 transition-colors
              ${isSel ? "text-blue-600" : "text-slate-800 group-hover:text-blue-600"}`}
            >
              {fw.curriculumName}
            </h4>

            {/* Footer: Ngành & Tín chỉ */}
            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 mt-2">
              <div className="flex items-center gap-1.5 text-slate-500 max-w-[70%] truncate">
                <svg
                  className="w-3.5 h-3.5 shrink-0 text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                <span className="truncate">
                  Ngành:{" "}
                  <span className="font-medium text-slate-700">
                    {fw.major?.majorName || "Chưa cập nhật"}
                  </span>
                </span>
              </div>

              <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-lg font-semibold text-[11px]">
                <span>{fw.totalCredits}</span>
                <span className="font-normal opacity-85">tín chỉ</span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default ChuongTrinhKhungList;
