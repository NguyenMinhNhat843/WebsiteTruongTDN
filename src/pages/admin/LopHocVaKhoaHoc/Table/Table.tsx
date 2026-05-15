import { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import {
  Hash,
  BookOpen,
  User,
  CalendarDays,
  Activity,
  Users,
  MoreVertical,
  SlidersHorizontal,
} from "lucide-react";

type CourseOfferItem = {
  id: number;
  courseCode: string;
  courseName: string | null;
  teacherId: number | null;
  teacher: {
    fullName: string | null;
  };
  subjectId: number;
  classId: number | null;
  semesterId: number;
  maxStudents: number;
  currentStudents: number;
  status: "planned" | "open" | "closed" | "cancelled" | string;
  registrationStart: string;
  registrationEnd: string;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
  subject: {
    id: number;
    subjectCode: string;
    subjectName: string;
    credits: number;
  };
  semester: {
    id: number;
    name: string;
    isCurrent: boolean;
  };
  baseClass: {
    id: number;
    classCode: string;
    className: string;
  } | null;
};

// Giả định dữ liệu mẫu truyền từ API của bạn vào component
interface Props {
  data: CourseOfferItem[];
  isLoading?: boolean;
}

const columnHelper = createColumnHelper<CourseOfferItem>();

const DanhSachLopHocPhan = ({ data, isLoading }: Props) => {
  const columns = useMemo(
    () => [
      // 1. ID
      columnHelper.accessor("id", {
        header: () => (
          <span className="flex items-center gap-1.5">
            <Hash size={14} /> ID
          </span>
        ),
        cell: (info) => (
          <span className="font-semibold text-slate-400">
            #{info.getValue()}
          </span>
        ),
      }),

      // 2. Mã lớp & Tên lớp học phần
      columnHelper.display({
        id: "courseInfo",
        header: () => (
          <span className="flex items-center gap-1.5">
            <BookOpen size={14} /> Lớp học phần
          </span>
        ),
        cell: (info) => {
          const row = info.row.original;
          return (
            <div className="flex flex-col gap-0.5">
              <span className="font-bold text-slate-800 tracking-tight">
                {row.courseCode}
              </span>
              <span className="text-xs text-slate-500 font-medium line-clamp-1">
                {row.courseName || "Chưa cập nhật tên"}
              </span>
            </div>
          );
        },
      }),

      // 3. Học kỳ (Semester ID & Name)
      columnHelper.display({
        id: "semesterInfo",
        header: () => (
          <span className="flex items-center gap-1.5">
            <CalendarDays size={14} /> Học kỳ
          </span>
        ),
        cell: (info) => {
          const semester = info.row.original.semester;
          return (
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold text-slate-700">
                  {semester.name}
                </span>
                {semester.isCurrent && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                    Hiện tại
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-400">
                Mã HK: #{semester.id}
              </span>
            </div>
          );
        },
      }),

      // 4. Giáo viên giảng dạy
      columnHelper.accessor("teacher", {
        header: () => (
          <span className="flex items-center gap-1.5">
            <User size={14} /> GV giảng dạy
          </span>
        ),
        cell: (info) => {
          const teacher = info.getValue();
          return teacher ? (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs">
                {teacher.fullName?.charAt(0) || "N/A"}
              </div>
              <span className="text-sm font-medium text-slate-600">
                {teacher.fullName}
              </span>
            </div>
          ) : (
            <span className="text-slate-300 italic text-xs">
              Chưa phân công
            </span>
          );
        },
      }),

      // 5. Sĩ số (Bổ sung thêm để UI đầy đặn, trực quan hơn)
      columnHelper.display({
        id: "studentsCount",
        header: () => (
          <span className="flex items-center gap-1.5">
            <Users size={14} /> Sĩ số
          </span>
        ),
        cell: (info) => {
          const row = info.row.original;
          return (
            <span className="text-sm font-medium text-slate-600">
              {row.currentStudents} /{" "}
              <span className="text-slate-400 text-xs">{row.maxStudents}</span>
            </span>
          );
        },
      }),

      // 6. Trạng thái lớp (Status Badge)
      columnHelper.accessor("status", {
        header: () => (
          <span className="flex items-center gap-1.5">
            <Activity size={14} /> Trạng thái
          </span>
        ),
        cell: (info) => {
          const status = info.getValue()?.toLowerCase();

          const statusStyles: Record<string, string> = {
            open: "bg-emerald-50 text-emerald-700 border-emerald-200",
            planned: "bg-blue-50 text-blue-700 border-blue-200",
            closed: "bg-slate-100 text-slate-600 border-slate-200",
            cancelled: "bg-rose-50 text-rose-700 border-rose-200",
          };

          const labelMap: Record<string, string> = {
            open: "Mở đăng ký",
            planned: "Lên kế hoạch",
            closed: "Đã đóng",
            cancelled: "Đã hủy",
          };

          return (
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${statusStyles[status] || statusStyles.closed}`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 animate-pulse" />
              {labelMap[status] || status}
            </span>
          );
        },
      }),

      // 7. Cột chức năng (Actions)
      columnHelper.display({
        id: "actions",
        cell: () => (
          <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-600">
            <MoreVertical size={16} />
          </button>
        ),
      }),
    ],
    [],
  );

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50">
        <div>
          <h3 className="text-lg font-bold text-slate-800">
            Quản lý Lớp học phần
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Danh sách các học phần được mở đăng ký và điều phối giảng dạy
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="p-2 border border-slate-200 rounded-xl hover:bg-white text-slate-600 transition-colors flex items-center justify-center gap-2 text-sm bg-slate-50">
            <SlidersHorizontal size={16} /> Bộ lọc
          </button>
          <button className="flex-1 sm:flex-initial bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm shadow-blue-100">
            + Mở lớp mới
          </button>
        </div>
      </div>

      {/* Main Table Wrapper */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="border-b border-slate-100 bg-slate-50/30"
              >
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider"
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
            {isLoading ? (
              // Skeleton Loading State
              [...Array(4)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {[...Array(7)].map((_, j) => (
                    <td key={j} className="px-6 py-4">
                      <div className="h-4 bg-slate-100 rounded-md w-full" />
                    </td>
                  ))}
                </tr>
              ))
            ) : table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-slate-50/60 transition-all duration-200 group"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-6 py-4 text-sm text-slate-600 vertical-middle"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              // Empty State
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-12 text-center text-slate-400 italic bg-white"
                >
                  Không tìm thấy dữ liệu lớp học phần hợp lệ.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer Summary */}
      <div className="px-6 py-3.5 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center">
        <span className="text-xs text-slate-500 font-medium">
          Tổng số:{" "}
          <span className="text-slate-800 font-bold">{data?.length || 0}</span>{" "}
          lớp học phần
        </span>
      </div>
    </div>
  );
};

export default DanhSachLopHocPhan;
