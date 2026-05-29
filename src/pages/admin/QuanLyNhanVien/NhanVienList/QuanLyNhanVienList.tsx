import { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { Calendar, Briefcase, Hash, Building2, User, Eye } from "lucide-react";
import {
  useQuanLyNguoiDungContext,
  type StaffDto,
} from "../QuanLyNguoiDungContext";
import PageShell from "../../../../components/ui/PageShell";
import CreateNhanVien from "./CreateNhanVien";
import { useNavigate } from "react-router-dom";
import ButtonAction from "../../../../components/ui/ButtonAction";

const columnHelper = createColumnHelper<StaffDto>();

const QuanLyNhanVienList = () => {
  const { staffs, isPendingStaffs, openModalCreate, setOpenModalCreate } =
    useQuanLyNguoiDungContext();
  const navigate = useNavigate();

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
        cell: (info) => <span>{info.getValue()}</span>,
      }),
      columnHelper.accessor("staffCode", {
        header: "Mã NV",
        cell: (info) => (
          <div className="flex flex-col">
            <span className="font-bold text-slate-700">{info.getValue()}</span>
          </div>
        ),
      }),
      columnHelper.accessor("EmployeeRole", {
        header: "Vai trò",
        cell: (info) => {
          const role = info.getValue();
          const colors = {
            STAFF: "bg-rose-50 text-rose-600 border-rose-100",
            TEACHER: "bg-blue-50 text-blue-600 border-blue-100",
            undefined: "bg-gray-50 text-gray-400 border-gray-100",
          };

          const currentRole = role ?? "undefined";

          return (
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-bold border ${colors[currentRole]} capitalize`}
            >
              {role ?? "N/A"}
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
        cell: (info) => {
          const dateValue = info.getValue();

          return (
            <span className="text-sm text-slate-500">
              {dateValue
                ? new Date(dateValue).toLocaleDateString("vi-VN")
                : "-"}
            </span>
          );
        },
      }),
      columnHelper.display({
        id: "actions",
        cell: (info) => (
          <div>
            <ButtonAction
              variant="outline"
              title="Xem chi tiết"
              icon={<Eye size={16} className="hover:text-blue-600" />}
              onClick={() =>
                navigate(`/admin/users/${info.row.original.staffCode}`)
              }
            />
          </div>
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
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 
          rounded-lg text-sm font-semibold transition-all shadow-sm 
          shadow-blue-200 flex items-center gap-2"
          onClick={() => setOpenModalCreate(true)}
        >
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

      <CreateNhanVien
        isOpen={openModalCreate}
        onClose={() => setOpenModalCreate(false)}
      />
    </PageShell>
  );
};

export default QuanLyNhanVienList;
