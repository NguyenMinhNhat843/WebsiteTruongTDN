import clsx from "clsx";

export const SpinnerLoading = () => {
  return (
    <div
      className={clsx(
        "w-full min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6",
      )}
    >
      <div className="relative flex flex-col items-center gap-4 animate-in fade-in duration-300">
        <div className="relative w-12 h-12">
          <div className="w-full h-full border-4 border-slate-200 rounded-full" />
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-600 border-t-transparent rounded-full animate-spin [animation-duration:0.8s]" />
        </div>

        <div className="space-y-1 text-center">
          <p className="text-sm font-semibold text-slate-700 tracking-wide">
            Đang tải dữ liệu...
          </p>
          <p className="text-xs text-slate-400 font-medium">
            Vui lòng đợi trong giây lát
          </p>
        </div>
      </div>
    </div>
  );
};
