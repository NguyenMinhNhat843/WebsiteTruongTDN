import { useMemo, useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { MonHocResponse } from "../../../../features/MonHoc/MonHocProvider";
import { useTaoChuongTrinhKhungContext } from "./CreateProgramProvider";
import { Trash, PlusCircle, BookOpen, AlertCircle } from "lucide-react";

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
      columnHelper.accessor("isMandatory", {
        header: "Loại môn",
        cell: (info) => {
          const isMandatory = info.getValue() === true;
          return (
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                ${
                  isMandatory
                    ? "bg-rose-50 border-rose-100 text-rose-700"
                    : "bg-emerald-50 border-emerald-100 text-emerald-700"
                }`}
            >
              {isMandatory ? "Bắt buộc" : "Tự chọn"}
            </span>
          );
        },
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

  // 2. Khởi tạo Table instance
  const table = useReactTable({
    data: subjectsInSemester,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    // Layout w-full rộng rãi đồng bộ với form tạo thông tin chung
    <div className="w-full bg-white rounded-xl border border-slate-200/80 shadow-sm p-6 mt-6">
      {/* Header khu vực Học kỳ: Gồm Tiêu đề bên trái và Bộ thêm môn bên phải */}
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
            <select
              value={selectedSubjectId ?? ""}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedSubjectId(value ? Number(value) : null);
              }}
              className="w-full pl-3 pr-10 py-2 text-base border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer text-slate-700"
            >
              <option value="">-- Chọn môn học để thêm vào kỳ --</option>
              {monhocs?.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.subjectName} ({s.credits} tín chỉ)
                </option>
              ))}
            </select>
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
