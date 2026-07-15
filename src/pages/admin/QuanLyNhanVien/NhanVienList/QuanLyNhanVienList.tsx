import { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { Calendar, Hash, Building2, User, Eye } from "lucide-react";
import {
  useQuanLyNguoiDungContext,
  type StaffDto,
} from "../QuanLyNguoiDungContext";
import PageShell from "../../../../components/ui/PageShell";
import CreateNhanVien from "./CreateNhanVien";
import { useNavigate } from "react-router-dom";
import ButtonAction from "../../../../components/ui/ButtonAction";
import { UserRoleViMap, type EnumRoleUser } from "../../../../api/enum";

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
        cell: (info) => (
          <span className="font-semibold text-slate-900">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("staffCode", {
        header: "Mã NV",
        cell: (info) => (
          <span className="font-bold text-slate-700">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("EmployeeRole", {
        header: "Vai trò",
        cell: (info) => {
          const rawRole = info.getValue()?.toLowerCase() as EnumRoleUser;

          // Định nghĩa màu sắc tương ứng cho từng vai trò
          const colors: Record<EnumRoleUser, string> = {
            admin: "bg-amber-50 text-amber-600 border-amber-100",
            teacher: "bg-blue-50 text-blue-600 border-blue-100",
            staff: "bg-rose-50 text-rose-600 border-rose-100",
            student: "bg-emerald-50 text-emerald-600 border-emerald-100",
          };

          const badgeColor =
            colors[rawRole] || "bg-slate-50 text-slate-400 border-slate-100";
          const roleLabel = UserRoleViMap[rawRole] || "Chưa xác định";

          return (
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-bold border ${badgeColor}`}
            >
              {roleLabel}
            </span>
          );
        },
      }),
      columnHelper.accessor("department.deptName", {
        header: () => (
          <span className="flex items-center gap-2">
            <Building2 size={14} /> Phòng ban
          </span>
        ),
        cell: (info) => (
          <span className="text-sm font-medium text-slate-600">
            {info.getValue() || "-"}
          </span>
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
            <span className="text-sm text-slate-500 font-medium">
              {dateValue
                ? new Date(dateValue).toLocaleDateString("vi-VN")
                : "-"}
            </span>
          );
        },
      }),
      columnHelper.display({
        id: "actions",
        header: () => <span className="text-center block">Thao tác</span>,
        cell: (info) => (
          <div className="flex justify-center">
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
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 
          rounded-xl text-sm font-bold transition-all shadow-xs flex items-center gap-2"
          onClick={() => setOpenModalCreate(true)}
        >
          + Thêm nhân viên
        </button>
      }
    >
      <div className="w-full bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  className="bg-slate-50/50 border-b border-slate-200"
                >
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
            <tbody className="divide-y divide-slate-100">
              {isPendingStaffs ? (
                /* Skeleton Loading */
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {[...Array(6)].map((_, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-4 bg-slate-100 rounded-lg w-full"></div>
                      </td>
                    ))}
                  </tr>
                ))
              ) : table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-blue-50/20 transition-colors group"
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
                /* Không có dữ liệu */
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-16 text-center text-slate-400 italic font-medium"
                  >
                    Không có dữ liệu nhân viên nào trong danh sách.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer tổng kết dữ liệu */}
        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500 font-medium">
          <span>
            Hiển thị{" "}
            <strong className="text-slate-800">{staffs?.length || 0}</strong>{" "}
            nhân viên trong hệ thống
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
