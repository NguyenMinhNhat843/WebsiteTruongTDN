import React, { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { History, Calendar, Loader2, Receipt } from "lucide-react";
import { useHocphisContext } from "../HocPhiProvider";

// 1. Định nghĩa chuẩn Type theo yêu cầu
type InvoiceDto = {
  studentId: number;
  semesterId: number;
  totalAmount: number;
  createdAt: string;
};

const columnHelper = createColumnHelper<InvoiceDto>();

const LichSuThanhToan = () => {
  const { studentTuitionInvoices, isLoadingStudentTuitionInvoices } =
    useHocphisContext();

  // 2. Định nghĩa cấu hình các cột cho Lịch sử hóa đơn
  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "stt",
        header: "STT",
        cell: (info) => (
          <span className="text-slate-400 font-medium">
            {info.row.index + 1}
          </span>
        ),
      }),
      columnHelper.accessor("createdAt", {
        header: "Ngày thanh toán",
        cell: (info) => {
          const dateVal = info.getValue();
          if (!dateVal) return "—";
          const date = new Date(dateVal);
          return (
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-slate-400" />
              <div>
                <p className="font-medium text-slate-700">
                  {date.toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </p>
                <p className="text-[11px] text-slate-400">
                  {date.toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          );
        },
      }),
      columnHelper.accessor("semesterId", {
        header: "Học kỳ",
        cell: (info) => (
          <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 border border-slate-200/60 font-bold text-[11px]">
            Học kỳ {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("totalAmount", {
        header: "Số tiền đã đóng",
        meta: { className: "text-right" },
        cell: (info) => (
          <span className="font-mono font-bold text-emerald-600 bg-emerald-50/50 px-2.5 py-1 rounded-lg border border-emerald-100">
            +
            {info.getValue().toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </span>
        ),
      }),
    ],
    [],
  );

  // 3. Khởi tạo TanStack Table Instance
  const table = useReactTable({
    data: studentTuitionInvoices || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="col-span-12">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Header Section */}
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <History className="text-indigo-600" size={20} />
            Lịch sử hóa đơn & Thanh toán
          </h3>
          {studentTuitionInvoices && studentTuitionInvoices.length > 0 && (
            <span className="text-xs font-bold bg-slate-50 text-slate-500 px-3 py-1 rounded-full border border-slate-100">
              Tổng số: {studentTuitionInvoices.length} lượt giao dịch
            </span>
          )}
        </div>

        {/* Table Giao diện */}
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className={`px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider`}
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
              {/* 1. Trạng thái đang tải dữ liệu (Loading) */}
              {isLoadingStudentTuitionInvoices ? (
                <tr>
                  <td colSpan={columns.length} className="py-16 text-center">
                    <Loader2
                      className="animate-spin mx-auto text-indigo-500 mb-2"
                      size={28}
                    />
                    <p className="text-slate-400 font-medium text-xs">
                      Đang truy xuất lịch sử giao dịch...
                    </p>
                  </td>
                </tr>
              ) : /* 2. Hiển thị danh sách hóa đơn nếu có data */
              table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className={`px-6 py-4`}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                /* 3. Màn hình trống khi chưa thanh toán lần nào (Empty State) */
                <tr>
                  <td
                    colSpan={columns.length}
                    className="py-16 text-center text-slate-300"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-slate-400 mb-2">
                        <Receipt size={32} strokeWidth={1.5} />
                      </div>
                      <p className="font-semibold text-slate-400 text-sm">
                        Chưa có lịch sử giao dịch
                      </p>
                      <p className="text-xs text-slate-400/70 max-w-[280px] mt-0.5">
                        Mọi hóa đơn sau khi được xuất hoặc gạch nợ thành công sẽ
                        hiển thị tại đây.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LichSuThanhToan;
