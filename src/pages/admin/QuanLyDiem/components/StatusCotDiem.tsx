import clsx from "clsx";
import type { FunctionComponent } from "react";
import { CheckCircle2, Clock } from "lucide-react";

interface StatusCotDiemProps {
  isApproved?: boolean;
  isSubmitted?: boolean;
}

const StatusCotDiem: FunctionComponent<StatusCotDiemProps> = ({
  isApproved,
  isSubmitted,
}) => {
  return (
    <div
      className={clsx(
        "flex items-center gap-1.5 font-bold px-2.5 py-1.5 rounded-lg border text-sm transition-all",
        isApproved
          ? "bg-emerald-50 border-emerald-200 text-emerald-700"
          : isSubmitted
            ? "bg-amber-50 border-amber-200 text-amber-700"
            : "bg-slate-50 border-slate-200 text-slate-400",
      )}
    >
      {isApproved ? (
        <CheckCircle2 size={14} className="text-emerald-500" />
      ) : (
        <Clock
          size={14}
          className={isSubmitted ? "text-amber-500" : "text-slate-300"}
        />
      )}
      <span className="text-[10px] opacity-70 whitespace-nowrap">
        ({isApproved ? "Đã duyệt" : isSubmitted ? "Chờ duyệt" : "Chưa nhập"})
      </span>
    </div>
  );
};

export default StatusCotDiem;
