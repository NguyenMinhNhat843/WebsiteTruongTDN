import { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { useLopHocPhanOneContext } from "./LopHocPhanOneProvider";

// Định nghĩa kiểu dữ liệu cho hàng trong bảng
interface StudentRowData {
  id: number;
  studentCode: string;
  fullName: string;
  // Lưu trữ điểm số theo ID của thành phần điểm: { [gradeComponentId]: score }
  diem: Record<number, number | string>;
}

const TableHocSinhVoiDiem = () => {
  const { lopHocPhanDetail } = useLopHocPhanOneContext();

  // 1. Lấy cấu hình đầu điểm
  const gradesConfig = useMemo(() => {
    return lopHocPhanDetail?.gradeConfig || [];
  }, [lopHocPhanDetail]);

  // 2. Chuyển đổi dữ liệu registrations sang danh sách hàng của bảng
  const data: StudentRowData[] = useMemo(() => {
    return (
      lopHocPhanDetail?.registrations?.map((regis) => {
        const student = regis.student;

        // Tạo object điểm mẫu hoặc map từ dữ liệu điểm thực tế của bạn (nếu có ở giai đoạn sau)
        const diemMap: Record<number, number | string> = {};
        gradesConfig.forEach((grade) => {
          diemMap[grade.id] = ""; // Hiện tại để trống cho UI nhập điểm hoặc hiển thị
        });

        return {
          id: student.id,
          studentCode: student.studentCode,
          fullName: student.fullName,
          diem: diemMap,
        };
      }) || []
    );
  }, [lopHocPhanDetail, gradesConfig]);

  // 3. Khởi tạo Định nghĩa Cột động với TanStack Table
  const columns = useMemo(() => {
    const columnHelper = createColumnHelper<StudentRowData>();

    return [
      // Các cột thông tin cơ bản cố định
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

      // Map động các cột điểm dựa trên cấu hình gradeConfig của lớp
      ...gradesConfig.map((grade) =>
        columnHelper.accessor((row) => row.diem[grade.id], {
          id: `grade-${grade.id}`,
          // Hiển thị tên cột kèm phần trăm trọng số (ví dụ: Giữa kỳ (30%))
          header: () => (
            <div className="text-center">
              <div>{grade.name}</div>
              <div className="text-[11px] text-slate-400 font-normal">
                ({grade.weight * 100}%)
              </div>
            </div>
          ),
          cell: (info) => (
            <div className="text-center">
              {/* Đây là nơi hiển thị điểm, hiện tại đang để ô Input mockup đẹp mắt */}
              <input
                type="number"
                min={0}
                max={10}
                placeholder="-"
                className="w-16 text-center py-1 border border-slate-200 rounded focus:outline-none focus:border-blue-500 text-sm font-medium bg-slate-50/50 focus:bg-white transition-all"
                value={info.getValue() ?? ""}
                onChange={() => {
                  /* Xử lý cập nhật điểm ở đây */
                }}
              />
            </div>
          ),
        }),
      ),

      // Cột tổng điểm tính toán tự động (Mockup)
      columnHelper.display({
        id: "totalScore",
        header: () => (
          <div className="text-center font-bold text-blue-600">
            <div>Tổng điểm</div>
          </div>
        ),
        cell: () => (
          <div className="text-center font-bold text-blue-600 text-sm">-</div>
        ),
      }),
    ];
  }, [gradesConfig]);

  // 4. Cấu hình bảng React Table
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          {/* Header Table */}
          <thead className="bg-slate-50/70 border-b border-slate-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="p-3.5 text-xs font-semibold text-slate-600 uppercase tracking-wider whitespace-nowrap"
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

          {/* Body Table */}
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
                  Chưa có học sinh nào đăng ký vào lớp học phần này.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableHocSinhVoiDiem;
