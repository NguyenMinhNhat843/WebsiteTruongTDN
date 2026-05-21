import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { useMemo } from "react";
import type { CurriCulumSubjectDto } from "../ChuongTrinhKhungProvider";

const columns: ColumnDef<CurriCulumSubjectDto>[] = [
  {
    header: "Mã môn",
    accessorKey: "subject.subjectCode",
    cell: (info) => (
      <span className="font-mono font-bold text-blue-700">
        {info.getValue() as string}
      </span>
    ),
  },
  {
    header: "Tên môn học",
    accessorKey: "subject.subjectName",
    cell: (info) => (
      <span className="font-medium">{info.getValue() as string}</span>
    ),
  },
  {
    header: "Tín chỉ",
    accessorKey: "subject.credits",
    cell: (info) => (
      <div className="text-center font-semibold">
        {info.getValue() as number}
      </div>
    ),
  },
  {
    header: "Số giờ (LT/TH)",
    id: "hours",
    cell: ({ row }) => {
      const sub = row.original.subject;
      return (
        <div className="text-center text-gray-500">
          {sub?.theoryHours} / {sub?.practiceHours}
        </div>
      );
    },
  },
  {
    header: "Loại môn",
    accessorKey: "isMandatory",
    cell: ({ getValue }) => {
      const isMandatory = getValue() as boolean;
      return (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            isMandatory
              ? "bg-orange-100 text-orange-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {isMandatory ? "Bắt buộc" : "Tự chọn"}
        </span>
      );
    },
  },
];

const CurriculumSemesterList = ({
  subjectList,
}: {
  subjectList: CurriCulumSubjectDto[];
}) => {
  // Nhóm dữ liệu theo học kỳ
  const sections = useMemo(() => {
    const grouped = subjectList.reduce(
      (acc, item) => {
        const s = item.semesterNumber;
        if (!acc[s]) acc[s] = [];
        acc[s].push(item);
        return acc;
      },
      {} as Record<number, CurriCulumSubjectDto[]>,
    );

    return Object.entries(grouped).sort(([a], [b]) => Number(a) - Number(b));
  }, [subjectList]);

  // Tính toán thống kê tổng quan toàn bộ chương trình học
  const overviewStats = useMemo(() => {
    const totalSemesters = sections.length;
    const totalSubjects = subjectList.length;
    const totalCredits = subjectList.reduce(
      (sum, item) => sum + (item.subject?.credits || 0),
      0,
    );
    return { totalSemesters, totalSubjects, totalCredits };
  }, [sections, subjectList]);

  return (
    <div className="flex flex-col gap-8 p-6 bg-gray-50 min-h-screen">
      {/* Header Thống kê tổng quan đơn giản */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-around text-center shadow-sm">
        <div className="flex flex-col gap-1 flex-1 border-r border-gray-100">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Tổng số học kỳ
          </span>
          <span className="text-2xl font-bold text-gray-800">
            {overviewStats.totalSemesters}
          </span>
        </div>
        <div className="flex flex-col gap-1 flex-1 border-r border-gray-100">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Tổng số môn học
          </span>
          <span className="text-2xl font-bold text-gray-800">
            {overviewStats.totalSubjects}
          </span>
        </div>
        <div className="flex flex-col gap-1 flex-1">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Tổng số tín chỉ
          </span>
          <span className="text-2xl font-bold text-blue-600">
            {overviewStats.totalCredits}
          </span>
        </div>
      </div>

      {/* Danh sách bảng theo từng học kỳ */}
      <div className="flex flex-col gap-8">
        {sections.map(([semester, data]) => (
          <SemesterTable key={semester} semester={semester} data={data} />
        ))}
      </div>
    </div>
  );
};

const SemesterTable = ({
  semester,
  data,
}: {
  semester: string;
  data: CurriCulumSubjectDto[];
}) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const totalCredits = data.reduce(
    (sum, item) => sum + (item.subject?.credits || 0),
    0,
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header của từng kỳ */}
      <div className="px-6 py-4 bg-white border-b border-gray-100 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-gray-800">
            {" "}
            Học kỳ {semester}
          </h2>
        </div>
        <div className="text-sm text-gray-500">
          Số môn: <span className="font-bold text-gray-800">{data.length}</span>{" "}
          | Tổng tín chỉ:{" "}
          <span className="font-bold text-blue-600">{totalCredits}</span>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider"
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
          <tbody className="divide-y divide-gray-100">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-blue-50/50 transition-colors group"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4 text-sm text-gray-600">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          {/* Bạn có thể bổ sung tfoot nếu cần */}
        </table>
      </div>
    </div>
  );
};

export default CurriculumSemesterList;
