import { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import {
  useQuanLyTaiKhoanContext,
  type AccountResponseDto,
} from "./QuanLyTaiKhoanProvider";

import { QuanLyTaiKhoanProvider } from "./QuanLyTaiKhoanProvider";
import PageShell from "../../../components/ui/PageShell";
import { Lock } from "lucide-react";
const QuanLyTaiKhoan = () => {
  return (
    <QuanLyTaiKhoanProvider>
      <Inner />
    </QuanLyTaiKhoanProvider>
  );
};

const Inner = () => {
  const { accounts, errorAccounts, isLoadingAccounts } =
    useQuanLyTaiKhoanContext();

  // 1. Định nghĩa Column Helper dựa trên Type của accounts
  const columnHelper = createColumnHelper<AccountResponseDto>();

  // 2. Thiết lập cấu trúc các cột (Columns)
  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        header: "ID",
        cell: (info) => (
          <span className="font-semibold text-gray-700">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("username", {
        header: "Tên đăng nhập",
        cell: (info) => (
          <span className="font-medium text-blue-600">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("role", {
        header: "Vai trò",
        cell: (info) => (
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 uppercase tracking-wider">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("isActive", {
        header: "Trạng thái",
        cell: (info) => (
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
              info.getValue()
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            <span
              className={`w-2 h-2 mr-2 rounded-full ${info.getValue() ? "bg-green-500" : "bg-red-500"}`}
            ></span>
            {info.getValue() ? "Hoạt động" : "Khóa"}
          </span>
        ),
      }),
      columnHelper.accessor("createdAt", {
        header: "Ngày tạo",
        cell: (info) => new Date(info.getValue()).toLocaleDateString("vi-VN"),
      }),
      columnHelper.accessor("updatedAt", {
        header: "Cập nhật cuối",
        cell: (info) => new Date(info.getValue()).toLocaleDateString("vi-VN"),
      }),
    ],
    [columnHelper],
  );

  // 3. Khởi tạo dữ liệu cho TanStack Table
  const table = useReactTable({
    data: accounts || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Khối hiển thị Loading
  if (isLoadingAccounts) {
    return (
      <div className="flex justify-center items-center p-10 text-xl font-medium text-gray-500">
        Đang tải danh sách tài khoản...
      </div>
    );
  }

  // Khối hiển thị Lỗi
  if (errorAccounts) {
    return (
      <div className="p-5 my-4 bg-red-50 text-red-700 rounded-lg border border-red-200 font-medium">
        Đã xảy ra lỗi khi tải dữ liệu! Vui lòng thử lại sau.
      </div>
    );
  }

  // 4. Render Giao diện Table (To, rõ ràng)
  return (
    <PageShell
      title="Quản lý tài khoản"
      sub={`Tổng số: ${accounts?.length || 0} tài khoản`}
      icon={Lock}
    >
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-left border-collapse bg-white text-base">
          {/* Header */}
          <thead className="bg-gray-50 text-gray-700 uppercase text-sm border-b border-gray-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-4 font-bold tracking-wider"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-gray-100 text-gray-600">
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-blue-50/50 transition-colors duration-150"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-6 py-4 whitespace-nowrap text-lg"
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
                  colSpan={columns.length}
                  className="text-center py-10 text-gray-400 font-medium text-lg"
                >
                  Không có dữ liệu tài khoản nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </PageShell>
  );
};

export default QuanLyTaiKhoan;
