import { type Row, type Table } from "@tanstack/react-table";
import type { TienDoDaoTaoRow } from "../columnType";

interface TotalHoursCellProps {
  row: Row<TienDoDaoTaoRow>;
  table: Table<TienDoDaoTaoRow>;
}

export const TotalHoursCell = ({ row, table }: TotalHoursCellProps) => {
  const calculateRowTotal = table.options.meta?.calculateRowTotal;
  const calculateSubjectTotal = table.options.meta?.calculateSubjectTotal;

  const rowTotal = calculateRowTotal ? calculateRowTotal(row.original) : 0;
  const subjectTotal = calculateSubjectTotal
    ? calculateSubjectTotal(row.original.classSubjectId)
    : 0;
  const maxGio = row.original.tongGioMonHoc;
  const isMatch = subjectTotal === maxGio;

  return (
    <div className="text-center flex flex-col justify-center items-center leading-tight py-1">
      <span
        className={`font-bold ${isMatch ? "text-green-600" : "text-amber-500"}`}
      >
        {subjectTotal} / {maxGio} tiết
      </span>
      <span className="text-[11px] text-blue-600 font-medium mt-1 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
        Buổi này: {rowTotal}t
      </span>
    </div>
  );
};
