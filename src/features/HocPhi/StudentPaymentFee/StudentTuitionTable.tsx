import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import {
  Wallet,
  Clock,
  CreditCard,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { useHocphisContext, type ChiTietHocPhiDto } from "../HocPhiProvider";

const columnHelper = createColumnHelper<ChiTietHocPhiDto>();

export const StudentTuitionTable = () => {
  // Lấy data và trạng thái từ Context
  const {
    studentTuitionDetails,
    isPendingStudentTuitionDetails,
    student: studentData,
    thanhToanHocPhi,
    isPendingThanhToanHocPhi,
  } = useHocphisContext();

  // State lưu trữ các hàng được chọn từ TanStack Table
  const [rowSelection, setRowSelection] = useState({});

  // 2. Định nghĩa Cấu hình Cột
  const columns = useMemo(
    () => [
      // Thêm cột Checkbox vào đầu bảng
      columnHelper.display({
        id: "select",
        header: ({ table }) => (
          <input
            type="checkbox"
            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4 accent-indigo-600 cursor-pointer"
            checked={table.getIsAllPageRowsSelected()}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
          />
        ),
        cell: ({ row }) => {
          const isPaid = row.original.status === "paid";
          return (
            <input
              type="checkbox"
              className={`rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4 accent-indigo-600 ${
                isPaid ? "cursor-not-allowed opacity-50" : "cursor-pointer"
              }`}
              disabled={isPaid} // Khóa không cho chọn nếu đã đóng tiền
              checked={row.getIsSelected()}
              onChange={row.getToggleSelectedHandler()}
            />
          );
        },
      }),
      columnHelper.accessor("name", {
        header: "Khoản phí",
        cell: (info) => {
          const isPaid = info.row.original.status === "paid";
          return (
            <div
              className={isPaid ? "opacity-50 line-through text-slate-400" : ""}
            >
              <p className="font-bold text-slate-700 group-[.is-paid]:text-slate-400">
                {info.getValue()}
              </p>
              <p className="text-[11px] text-slate-400 group-[.is-paid]:text-slate-400/70">
                ID: {info.row.original.id}
              </p>
            </div>
          );
        },
      }),
      columnHelper.accessor("amount", {
        header: "Số tiền",
        cell: (info) => {
          const isPaid = info.row.original.status === "paid";
          return (
            <span
              className={`font-mono font-bold ${
                isPaid
                  ? "opacity-50 line-through text-slate-400"
                  : "text-slate-800"
              }`}
            >
              {info.getValue().toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </span>
          );
        },
      }),
      columnHelper.accessor("status", {
        header: "Trạng thái",
        cell: (info) => {
          const status = info.getValue();
          const isPaid = status === "paid";

          return (
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                isPaid
                  ? "bg-slate-100 text-slate-500 border border-slate-200 opacity-60 selection:bg-transparent"
                  : "bg-amber-50 text-amber-600 border border-amber-100"
              }`}
            >
              {isPaid ? <CheckCircle2 size={12} /> : <Clock size={12} />}
              {isPaid ? "Đã thu" : "Chưa thu"}
            </span>
          );
        },
      }),
      columnHelper.display({
        id: "actions",
        header: "Thao tác",
        cell: ({ row }) => {
          const isPaid = row.original.status === "paid";
          return (
            <button
              disabled={isPaid}
              className={`p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all active:scale-90 ${
                isPaid
                  ? "opacity-30 cursor-not-allowed hover:bg-transparent text-slate-400"
                  : ""
              }`}
            >
              <CreditCard size={18} />
            </button>
          );
        },
      }),
    ],
    [],
  );

  // 3. Khởi tạo Table Instance tích hợp Row Selection
  const table = useReactTable({
    data: studentTuitionDetails || [],
    columns,
    state: {
      rowSelection, // Truyền state chọn dòng vào đây
    },
    enableRowSelection: (row) => row.original.status !== "paid", // Chặn việc select hàng loạt (Select All) dính các hàng PAID
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
  });

  // Lấy danh sách dữ liệu thực tế của các hàng đang được tích chọn
  const selectedRowsData = table
    .getSelectedRowModel()
    .rows.map((row) => row.original);

  // Tính tổng số tiền dựa trên những dòng đang ĐƯỢC CHỌN (nếu không chọn cái nào thì hiển thị tổng toàn bộ)
  const totalAmountToShow =
    selectedRowsData.length > 0
      ? selectedRowsData.reduce((sum, item) => sum + item.amount, 0)
      : (studentTuitionDetails || []).reduce(
          (sum, item) => sum + item.amount,
          0,
        );

  return (
    <div className="col-span-12 lg:col-span-8 h-full">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Table Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Wallet className="text-indigo-600" size={20} />
            Danh mục học phí
          </h3>
          {selectedRowsData.length > 0 && (
            <span className="text-xs font-bold bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full border border-indigo-100 animate-fade-in">
              Đã chọn: {selectedRowsData.length} khoản phí
            </span>
          )}
        </div>

        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider"
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
              {/* 1. Loading State */}
              {isPendingStudentTuitionDetails ? (
                <tr>
                  <td colSpan={columns.length} className="py-20 text-center">
                    <Loader2
                      className="animate-spin mx-auto text-indigo-500 mb-2"
                      size={32}
                    />
                    <p className="text-slate-400 font-medium">
                      Đang tải danh sách học phí...
                    </p>
                  </td>
                </tr>
              ) : /* 2. Data State */
              table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => {
                  const isPaid = row.original.status === "paid";
                  return (
                    <tr
                      key={row.id}
                      // Thêm class is-paid group nếu đã PAID để dễ dàng điều chỉnh style dòng
                      className={`transition-colors group ${
                        isPaid
                          ? "bg-slate-50/40 cursor-not-allowed is-paid"
                          : row.getIsSelected()
                            ? "bg-indigo-50/30 hover:bg-indigo-50/40"
                            : "hover:bg-slate-50/50"
                      }`}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-6 py-4">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })
              ) : (
                /* 3. Empty State */
                <tr>
                  <td
                    colSpan={columns.length}
                    className="py-20 text-center text-slate-300"
                  >
                    <div className="flex flex-col items-center">
                      <AlertCircle size={48} strokeWidth={1} />
                      <p className="mt-2 font-medium">
                        {!studentData
                          ? "Vui lòng tìm kiếm sinh viên"
                          : "Không tìm thấy khoản phí nào"}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 4. Footer: Tổng cộng */}
        {studentData &&
          studentTuitionDetails &&
          studentTuitionDetails.length > 0 && (
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
              <div>
                <p className="text-xs uppercase font-bold text-slate-400 tracking-widest">
                  {selectedRowsData.length > 0
                    ? "Tổng tiền thanh toán (Đã chọn)"
                    : "Tổng tiền học phí"}
                </p>
                <p className="text-2xl font-black text-slate-900">
                  {totalAmountToShow.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </p>
              </div>
              <button
                disabled={
                  isPendingThanhToanHocPhi || // Khóa button khi đang loading
                  (selectedRowsData.length === 0 &&
                    studentTuitionDetails.every((i) => i.status === "paid"))
                }
                className={`px-8 py-3 font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 active:scale-95 ${
                  isPendingThanhToanHocPhi
                    ? "bg-indigo-400 text-white cursor-wait shadow-none" // Style khi đang loading
                    : selectedRowsData.length > 0
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100 cursor-pointer"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                }`}
                onClick={() =>
                  thanhToanHocPhi(
                    {
                      body: {
                        studentId: studentData.id,
                        itemsPaymented: selectedRowsData.map((item) => item.id),
                        semesterId: selectedRowsData[0].semesterId!,
                      },
                    },
                    {
                      onSuccess: () => {
                        alert("Thanh toán học phí thành công!");
                      },
                      onError: () => {
                        alert(
                          "Có lỗi xảy ra khi thanh toán học phí. Vui lòng thử lại.",
                        );
                      },
                    },
                  )
                }
              >
                {isPendingThanhToanHocPhi ? (
                  // Hiện icon xoay khi đang load
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <CheckCircle2 size={18} />
                )}

                {isPendingThanhToanHocPhi
                  ? "Đang xử lý..." // Text khi đang load
                  : selectedRowsData.length > 0
                    ? `Thanh toán (${selectedRowsData.length})`
                    : "Chọn khoản để thanh toán"}
              </button>
            </div>
          )}
      </div>
    </div>
  );
};
