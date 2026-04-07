import { ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react";
import type { HocSinhRow, SortState } from "../../mockType";

interface SortBtnProps {
  field: keyof HocSinhRow;
  sort: SortState;
  onSort: (f: keyof HocSinhRow) => void;
  children: React.ReactNode;
}

const SortBtn: React.FC<SortBtnProps> = ({ field, sort, onSort, children }) => {
  const active = sort.field === field;
  return (
    <button
      onClick={() => onSort(field)}
      className="flex items-center gap-1 font-bold text-[11px] uppercase tracking-wider text-gray-500 hover:text-slate-800 transition-colors select-none"
    >
      {children}
      <span className="ml-0.5">
        {active ? (
          sort.dir === "asc" ? (
            <ChevronUp size={12} />
          ) : (
            <ChevronDown size={12} />
          )
        ) : (
          <ArrowUpDown size={11} className="opacity-30" />
        )}
      </span>
    </button>
  );
};

export default SortBtn;
