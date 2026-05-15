import { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import {
  Calendar,
  Briefcase,
  Hash,
  Building2,
  MoreHorizontal,
  User,
} from "lucide-react";
import {
  useQuanLyNguoiDungContext,
  type StaffDto,
} from "../QuanLyNguoiDungContext";
import PageShell from "../../../../components/ui/PageShell";

const columnHelper = createColumnHelper<StaffDto>();

const QuanLyNhanVienList = () => {
  const { staffs, isPendingStaffs } = useQuanLyNguoiDungContext();

  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        header: () => (
          <span className="flex items-center gap-2">
            <Hash size={14} /> ID
          </span>
        ),
        cell: (info) => (
          <span className="font-medium text-slate-500">#{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("fullName", {
        header: "Họ và tên",
      }),
      columnHelper.accessor("staffCode", {
        header: "Mã NV",
        cell: (info) => (
          <div className="flex flex-col">
            <span className="font-bold text-slate-700">{info.getValue()}</span>
            <span className="text-xs text-slate-400">
              {info.row.original.username}
            </span>
          </div>
        ),
      }),
      columnHelper.accessor("role", {
        header: "Vai trò",
        cell: (info) => {
          const role = info.getValue();
          const colors = {
            admin: "bg-rose-50 text-rose-600 border-rose-100",
            teacher: "bg-blue-50 text-blue-600 border-blue-100",
            staff: "bg-emerald-50 text-emerald-600 border-emerald-100",
            student: "bg-amber-50 text-amber-600 border-amber-100",
          };
          return (
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-bold border ${colors[role] || colors.staff} capitalize`}
            >
              {role}
            </span>
          );
        },
      }),
      columnHelper.accessor("position", {
        header: () => (
          <span className="flex items-center gap-2">
            <Briefcase size={14} /> Chức vụ
          </span>
        ),
        cell: (info) =>
          info.getValue() || (
            <span className="text-slate-300 italic text-xs">Chưa cập nhật</span>
          ),
      }),
      columnHelper.accessor("departmentId", {
        header: () => (
          <span className="flex items-center gap-2">
            <Building2 size={14} /> Phòng ban
          </span>
        ),
        cell: (info) => (
          <div className="flex items-center gap-2">
            <span className="text-sm">{info.getValue()}</span>
          </div>
        ),
      }),
      columnHelper.accessor("createdAt", {
        header: () => (
          <span className="flex items-center gap-2">
            <Calendar size={14} /> Ngày tạo
          </span>
        ),
        cell: (info) => (
          <span className="text-sm text-slate-500">
            {new Date(info.getValue()).toLocaleDateString("vi-VN")}
          </span>
        ),
      }),
      columnHelper.display({
        id: "actions",
        cell: () => (
          <button className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600">
            <MoreHorizontal size={18} />
          </button>
        ),
      }),
    ],
    [],
  );

  const table = useReactTable({
    data: staffs || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <PageShell
      title="Quản lý nhân viên"
      icon={User}
      renderRight={
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm shadow-blue-200 flex items-center gap-2">
          + Thêm nhân viên
        </button>
      }
    >
      <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-slate-100">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider"
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
            <tbody className="divide-y divide-slate-50">
              {isPendingStaffs ? (
                // Skeleton Loading
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {[...Array(7)].map((_, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-4 bg-slate-100 rounded w-full"></div>
                      </td>
                    ))}
                  </tr>
                ))
              ) : table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-blue-50/30 transition-colors group"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-6 py-4 text-sm text-slate-600"
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
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-slate-400 italic"
                  >
                    Không có dữ liệu nhân viên nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100">
          <span className="text-xs text-slate-500 font-medium">
            Hiển thị {staffs?.length || 0} nhân viên trong hệ thống
          </span>
        </div>
      </div>
    </PageShell>
  );
};

export default QuanLyNhanVienList;
