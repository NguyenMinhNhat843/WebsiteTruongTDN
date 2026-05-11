import { useMemo, useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { MonHocResponse } from "../MonHoc/MonHocProvider";
import { useTaoChuongTrinhKhungContext } from "./CreateProgramProvider";
import { Trash } from "lucide-react";

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
          <span className="font-mono text-xs text-gray-500">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("subjectName", {
        header: "Tên môn học",
        cell: (info) => (
          <span className="font-semibold text-gray-700">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("credits", {
        header: "Tín chỉ",
      }),
      columnHelper.accessor("theoryHours", {
        header: "LT (giờ)",
      }),
      columnHelper.accessor("practiceHours", {
        header: "TH (giờ)",
      }),
      columnHelper.accessor("isMandatory", {
        header: "Loại",
        cell: (info) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              info.getValue() === true
                ? "bg-red-100 text-red-600"
                : "bg-green-100 text-green-600"
            }`}
          >
            {info.getValue() === true ? "Bắt buộc" : "Tự chọn"}
          </span>
        ),
      }),
      columnHelper.display({
        id: "actions",
        header: "Thao tác",
        cell: (props) => (
          <button
            onClick={() => handleRemove(props.row.original.id)}
            className="text-red-500 hover:text-red-700 transition-colors"
          >
            <Trash size={18} />
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
    <div className="mt-2">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">
          {title || "Chi Tiết Học Kỳ"}
        </h2>

        {/* Khu vực Chọn môn học */}
        <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-200">
          <select
            value={selectedSubjectId ?? ""}
            onChange={(e) => {
              const value = e.target.value;
              setSelectedSubjectId(value ? Number(value) : null); // Chuyển về số
            }}
            className="bg-transparent outline-none p-2 text-sm text-gray-700 min-w-50"
          >
            <option value="">-- Chọn môn học để thêm --</option>
            {monhocs?.map((s) => (
              <option key={s.id} value={s.id}>
                {s.subjectName} - {s.credits} TC
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              handleAddSubject(selectedSubjectId!, semesterNumber!);
              setSelectedSubjectId(null); // 🔥 reset state
            }}
            disabled={!selectedSubjectId}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md text-sm font-medium transition-all shadow-sm"
          >
            Thêm môn
          </button>
        </div>
      </div>

      {/* TanStack Table */}
      <div className="overflow-x-auto border rounded-xl">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="p-4 text-xs font-bold uppercase text-gray-600"
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
          <tbody>
            {subjectsInSemester && subjectsInSemester.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-gray-100 hover:bg-indigo-50/30 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-4 text-sm text-gray-600">
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
                  className="p-10 text-center text-gray-400 italic"
                >
                  Chưa có môn học nào được chọn cho học kỳ này.
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
