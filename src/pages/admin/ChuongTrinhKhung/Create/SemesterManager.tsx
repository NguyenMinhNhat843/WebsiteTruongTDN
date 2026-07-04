import { useMemo, useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { MonHocResponse } from "../../MonHoc/MonHocProvider";
import { useTaoChuongTrinhKhungContext } from "./CreateProgramProvider";
import { Trash, PlusCircle, BookOpen, AlertCircle } from "lucide-react";
import SelectSearchInput from "../../../../components/ui/Form/SelectInput";

interface SemesterManagerProps {
  title?: string;
  semesterNumber?: number;
}

const SemesterManager = ({ title, semesterNumber }: SemesterManagerProps) => {
  const { monhocs, handleAddSubject, handleRemove, allSubjects } =
    useTaoChuongTrinhKhungContext();
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(
    null,
  );

  const subjectsInSemesterIds = useMemo(() => {
    return allSubjects
      .filter((s) => s.semesterNumber === semesterNumber)
      .map((s) => s.subjectId);
  }, [allSubjects, semesterNumber]);

  const subjectsInSemester = useMemo(() => {
    if (!monhocs) return [];
    return monhocs.filter((s) => subjectsInSemesterIds.includes(s.id));
  }, [monhocs, subjectsInSemesterIds]);

  // 1. Định nghĩa cột cho TanStack Table
  const columnHelper = createColumnHelper<MonHocResponse>();

  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        header: "Mã môn",
        cell: (info) => (
          <span className="font-mono text-xs font-bold text-slate-400 bg-slate-100/80 px-1.5 py-0.5 rounded">
            #{info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("subjectName", {
        header: "Tên môn học",
        cell: (info) => (
          <span className="font-semibold text-slate-800">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("credits", {
        header: "Tín chỉ",
        cell: (info) => (
          <span className="font-bold text-slate-700">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("theoryHours", {
        header: "LT (giờ)",
        cell: (info) => (
          <span className="text-slate-500">{info.getValue()}h</span>
        ),
      }),
      columnHelper.accessor("practiceHours", {
        header: "TH (giờ)",
        cell: (info) => (
          <span className="text-slate-500">{info.getValue()}h</span>
        ),
      }),
      columnHelper.accessor("testHours", {
        header: "KT (giờ)",
        cell: (info) => (
          <span className="text-slate-500">{info.getValue()}h</span>
        ),
      }),
      columnHelper.display({
        id: "actions",
        header: "Thao tác",
        cell: (props) => (
          <button
            onClick={() => handleRemove(props.row.original.id)}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
            title="Xóa môn học khỏi kỳ này"
          >
            <Trash size={16} />
          </button>
        ),
      }),
    ],
    [handleRemove],
  );

  const table = useReactTable({
    data: subjectsInSemester,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full bg-white rounded-xl border border-slate-200/80 shadow-sm p-6 mt-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-5 border-b border-slate-100 gap-4 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <BookOpen className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">
            {title || "Chi Tiết Học Kỳ"}
          </h2>
        </div>

        {/* Cụm Thêm môn học - Chuyển sang khung nhập to rõ, dễ đọc */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 min-w-[320px] lg:min-w-[450px]">
          <div className="relative flex-1">
            <SelectSearchInput
              value={selectedSubjectId ? selectedSubjectId.toString() : ""}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedSubjectId(val ? Number(val) : null);
              }}
              options={[
                { value: "", label: "--- Chọn môn học ---" },
                ...(monhocs?.map((s) => ({
                  value: s.id.toString(),
                  label: `${s.subjectName} (${s.credits} tín chỉ)`,
                })) || []),
              ]}
            />
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          <button
            onClick={() => {
              handleAddSubject(selectedSubjectId!, semesterNumber!);
              setSelectedSubjectId(null);
            }}
            disabled={!selectedSubjectId}
            className="flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white px-4 py-2 rounded-xl text-base font-semibold transition-all shadow-sm active:scale-[0.98] shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            Thêm môn
          </button>
        </div>
      </div>

      {/* Bảng dữ liệu TanStack Table */}
      <div className="overflow-x-auto border border-slate-200 rounded-xl">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="p-3.5 text-xs font-bold uppercase text-slate-500 tracking-wider"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-slate-100">
            {subjectsInSemester && subjectsInSemester.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-blue-50/30 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-3.5 text-sm text-slate-600">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="p-12 text-center text-slate-400"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <AlertCircle className="w-8 h-8 text-slate-300" />
                    <p className="text-base font-medium text-slate-400 italic">
                      Chưa có môn học nào được chọn cho học kỳ này.
                    </p>
                    <p className="text-xs text-slate-400 not-italic">
                      Vui lòng chọn môn học ở danh sách phía trên để thiết lập
                      cấu trúc.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SemesterManager;
