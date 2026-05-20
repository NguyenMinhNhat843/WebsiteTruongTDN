import { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { useLopHocPhanOneContext } from "./LopHocPhanOneProvider";
import { Loader2 } from "lucide-react";
import { renderStatusIcon } from "./StatusGrade";
import {
  TableDiemProvider,
  useTableDiemContext,
  type StudentRowData,
} from "./TableDiemProvider";

const TableHocSinhVoiDiem = () => {
  return (
    <TableDiemProvider>
      <Inner />
    </TableDiemProvider>
  );
};
const Inner = () => {
  const { submitGrades, isSubmittingGrades, approveGrade, isApprovingGrade } =
    useLopHocPhanOneContext();
  const {
    gradesConfig,
    tableData,
    handleScoreChange,
    calculateTotalScore,
    handlePayloadSaveGrade,
  } = useTableDiemContext();

  /**
   * Columns table
   */
  const columns = useMemo(() => {
    const columnHelper = createColumnHelper<StudentRowData>();

    return [
      columnHelper.accessor("studentCode", {
        header: "Mã SV",
        cell: (info) => (
          <span className="font-semibold text-slate-700">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("fullName", {
        header: "Họ và tên",
        cell: (info) => (
          <span className="font-medium text-slate-900">{info.getValue()}</span>
        ),
      }),

      // Duyệt mảng cấu hình để sinh cột điểm tự động
      ...gradesConfig.map((grade) =>
        columnHelper.accessor((row) => row.diem[grade.id], {
          id: `grade-${grade.id}`,
          header: () => (
            <div className="text-center">
              <div>{grade.name}</div>
              <div className="text-[11px] text-slate-400 font-normal">
                ({grade.weight * 100}%)
              </div>
            </div>
          ),
          cell: (info) => {
            const studentId = info.row.original.id;
            const currentValue = info.getValue();

            // Trích xuất score và status từ object của ô điểm hiện tại
            const score = currentValue?.score ?? "";
            const currentStatus = currentValue?.status; // PENDING | APPROVED | REJECTED hoặc undefined

            return (
              <div className="text-center flex items-center justify-center">
                {/* Khung chứa relative có padding-right để chứa icon mà không lo đẩy lệch input */}
                <div className="relative inline-block pr-5">
                  <input
                    type="number"
                    min={0}
                    max={10}
                    step="0.1"
                    placeholder="-"
                    className={`w-16 text-center py-1 border rounded focus:outline-none 
                focus:border-blue-500 text-sm font-medium bg-slate-50/50 
                focus:bg-white transition-all disabled:opacity-60 border-slate-200
                ${currentStatus === "APPROVED" ? "border-emerald-200 bg-emerald-50/10 text-emerald-700 font-semibold" : ""}
                ${currentStatus === "REJECTED" ? "border-rose-200 bg-rose-50/10 text-rose-700" : ""}
              `}
                    value={score}
                    // Khóa ô input nếu đang trong quá trình submit hoặc điểm đó đã được APPROVED duyệt chính thức
                    disabled={
                      isSubmittingGrades ||
                      currentStatus === "APPROVED" ||
                      status === "APPROVED"
                    }
                    onChange={(e) =>
                      handleScoreChange(studentId, grade.id, e.target.value)
                    }
                  />
                  {/* Thực thi hàm để hiển thị icon tương ứng */}
                  {renderStatusIcon(currentStatus)}
                </div>
              </div>
            );
          },
        }),
      ),

      // Cột tổng điểm tính toán tự động dựa trên hàm logic thực tế  202]
      columnHelper.display({
        id: "totalScore",
        header: () => (
          <div className="text-center font-bold text-blue-600">
            <div>Tổng điểm</div>
          </div>
        ),
        cell: ({ row }) => {
          const total = calculateTotalScore(row.original.diem);
          return (
            <div className="text-center font-bold text-blue-600 text-sm">
              {total}
            </div>
          );
        },
      }),
    ];
  }, [gradesConfig, isSubmittingGrades]); // Phụ thuộc vào dữ liệu cấu hình và trạng thái Loading

  const table = useReactTable({
    data: tableData, // Chuyển sang sử dụng State thay vì dữ liệu tĩnh hằng số
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full space-y-4">
      {/* Khung chứa bảng điểm */}
      <div className="w-full bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/70 border-b border-slate-100">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="p-3.5 text-xs font-semibold text-slate-600 uppercase tracking-wider whitespace-nowrap text-center"
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
            <tbody className="divide-y divide-slate-100">
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-slate-50/40 transition-colors duration-150"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="p-3.5 text-sm text-slate-600 whitespace-nowrap align-middle"
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
                    className="p-8 text-center text-sm text-slate-400 font-medium"
                  >
                    Chưa có học sinh nào đăng ký vào lớp học phần này. {/*  */}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Thanh công cụ Action Bar nằm dưới bảng để điều khiển hành động submit */}
      {tableData.length > 0 && (
        <div className="flex justify-end items-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-xl">
          {/* Nút Lưu nháp - Hành động phụ (Secondary) */}
          <button
            type="button"
            disabled={isSubmittingGrades || isApprovingGrade}
            onClick={() => submitGrades(handlePayloadSaveGrade())}
            className="px-5 py-2 border border-slate-300 bg-white hover:bg-slate-50 disabled:bg-slate-50 disabled:border-slate-200 disabled:text-slate-400 text-slate-700 text-sm font-medium rounded-lg shadow-sm active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
          >
            {isSubmittingGrades && (
              <Loader2 className="h-4 w-4 animate-spin text-slate-500" />
            )}
            Lưu nháp
          </button>

          {/* Nút Chốt bảng điểm - Hành động chính (Primary) */}
          <button
            type="button"
            disabled={isSubmittingGrades || isApprovingGrade}
            onClick={() => {
              const gradesPayload = handlePayloadSaveGrade();
              return approveGrade(
                {
                  body: gradesPayload,
                },
                {
                  onSuccess: () => {
                    alert("Bảng điểm đã được chốt thành công!");
                  },
                  onError: (error: any) => {
                    alert(
                      error?.message ||
                        "Có lỗi xảy ra khi chốt bảng điểm. Vui lòng thử lại sau.",
                    );
                  },
                },
              );
            }}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:shadow-none text-white text-sm font-semibold rounded-lg shadow-sm shadow-blue-500/10 active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
          >
            {isApprovingGrade && (
              <Loader2 className="h-4 w-4 animate-spin text-white" />
            )}
            Chốt bảng điểm
          </button>
        </div>
      )}
    </div>
  );
};

export default TableHocSinhVoiDiem;
