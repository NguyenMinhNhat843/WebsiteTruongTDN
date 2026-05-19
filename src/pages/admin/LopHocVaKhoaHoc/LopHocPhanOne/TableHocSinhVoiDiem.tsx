import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import {
  useLopHocPhanOneContext,
  type GradeEntry,
  type SubmitGradeInClass,
} from "./LopHocPhanOneProvider";

/* eslint-disable @typescript-eslint/no-explicit-any */

interface StudentRowData {
  id: number;
  studentCode: string;
  fullName: string;
  // Lưu trữ điểm theo ID thành phần điểm dưới dạng object: { [componentId]: score }
  diem: Record<number, GradeEntry | null>; // Giá trị có thể là điểm số hoặc chuỗi rỗng nếu chưa nhập
  regisId: number; // ID của CourseRegistration để mapping khi gửi điểm lên server
}

const TableHocSinhVoiDiem = () => {
  const { lopHocPhanDetail, submitGrades, isSubmittingGrades } =
    useLopHocPhanOneContext();
  const courseOfferId = lopHocPhanDetail?.id;
  const createdBy = lopHocPhanDetail?.teacherId;

  // 1. Lấy điểm thành phần từ môn học
  const gradesConfig = useMemo(() => {
    return (
      lopHocPhanDetail?.subject?.subjectGrades?.map((subjectGrade) => {
        return {
          name: subjectGrade.gradeComponent.name, // Tên thành phần điểm (ví dụ: "Điểm giữa kỳ")
          weight: subjectGrade.weight, // Trọng số thực tế (ví dụ: 0.3 cho 30%)
          id: subjectGrade.gradeComponent.id, // ID của thành phần điểm để mapping khi nhập liệu
        };
      }) || []
    );
  }, [lopHocPhanDetail]);

  // 2. CHUYỂN ĐỔI SANG STATE: Quản lý toàn bộ dữ liệu bảng để có thể tương tác nhập liệu
  const [tableData, setTableData] = useState<StudentRowData[]>(() => {
    return (
      lopHocPhanDetail?.registrations?.map((regis) => {
        const student = regis.student;
        const diemMap: Record<number, GradeEntry | null> = {};
        const gradeEntries = regis.gradeEntries || [];

        // Duyệt qua điểm thành phần (ví dụ: Chuyên cần, Giữa kỳ, Cuối kỳ)
        gradesConfig.forEach((gradeComponent) => {
          // Tìm xem sinh viên này (regis.id) đã có điểm của đầu điểm này (grade.id) chưa
          const matchingGrade = gradeEntries?.find(
            (entry) => entry.componentId === gradeComponent.id,
          );

          // Nếu tìm thấy điểm thì hiển thị score, nếu không thấy (hoặc null) thì để chuỗi rỗng ""
          diemMap[gradeComponent.id] =
            matchingGrade && matchingGrade.score !== null
              ? matchingGrade
              : null;
        });

        return {
          id: student.id,
          studentCode: student.studentCode,
          fullName: student.fullName,
          diem: diemMap,
          regisId: regis.id,
        };
      }) || []
    );
  });

  // 3. Hàm xử lý khi thay đổi điểm số trên từng ô Input
  const handleScoreChange = (
    studentId: number,
    componentId: number,
    value: string,
  ) => {
    // Chặn người dùng nhập vượt quá thang điểm từ 0 đến 10
    if (value !== "") {
      const num = parseFloat(value);
      if (num < 0 || num > 10) return;
    }

    setTableData((prevData) =>
      prevData.map((row) => {
        if (row.id === studentId) {
          return {
            ...row,
            diem: {
              ...row.diem,
              [componentId]: null, // Cập nhật giá trị điểm của thành phần tương ứng
            },
          };
        }
        return row;
      }),
    );
  };

  // 4. Hàm tính toán tổng điểm dựa trên trọng số thực tế (Hệ số 10)
  const calculateTotalScore = (diem: Record<number, any>) => {
    let total = 0;
    let hasAllScores = true;

    for (const grade of gradesConfig) {
      const score = diem[grade.id].score;
      if (score === "" || score === undefined || score === null) {
        hasAllScores = false; // Nếu học sinh bị thiếu bất kỳ đầu điểm nào, chưa tính tổng điểm hiển thị
        break;
      }
      total += parseFloat(score as string) * grade.weight; // Tính tổng theo trọng số tích lũy
    }

    return hasAllScores ? total.toFixed(2) : "-";
  };

  // 5. Khởi tạo Định nghĩa Cột động với TanStack Table
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

      // Duyệt mảng cấu hình để sinh cột điểm tự động  171]
      ...gradesConfig.map((grade) =>
        columnHelper.accessor((row) => row.diem[grade.id], {
          id: `grade-${grade.id}`,
          header: () => (
            <div className="text-center">
              <div>{grade.name}</div>
              <div className="text-[11px] text-slate-400 font-normal">
                ( {grade.weight * 100}%)
              </div>{" "}
            </div>
          ),
          cell: (info) => {
            const studentId = info.row.original.id;
            const currentValue = info.getValue();

            const score = currentValue?.score || "";

            return (
              <div className="text-center flex items-center justify-center">
                {/* Bọc input và badge trong một khung relative để định vị icon tuyệt đối */}
                <div className="relative inline-block pr-6">
                  <input
                    type="number"
                    min={0}
                    max={10}
                    step="0.1"
                    placeholder="-"
                    className={`w-16 text-center py-1 border rounded focus:outline-none focus:border-blue-500 text-sm font-medium bg-slate-50/50 focus:bg-white transition-all disabled:opacity-50
                      ${status === "REJECTED" ? "border-rose-200 bg-rose-50/30" : "border-slate-200"}
                      ${status === "APPROVED" ? "border-emerald-200 bg-emerald-50/30" : ""}
                    `}
                    value={score}
                    disabled={isSubmittingGrades || status === "APPROVED"} // Khóa luôn nếu điểm đã được duyệt
                    onChange={(e) =>
                      handleScoreChange(studentId, grade.id, e.target.value)
                    }
                  />
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

  // 6. Xử lý đóng gói payload và gửi dữ liệu lên server
  const handleSubmit = async (statusType: "DRAFT" | "PENDING") => {
    if (!courseOfferId || !createdBy) {
      alert("Thiếu thông tin lớp học phần hoặc giảng viên phụ trách!");
      return;
    }

    // Biến đổi cấu trúc từ State Table sang đúng cấu trúc API yêu cầu
    const gradeEntriesPayload: any[] = [];

    tableData.forEach((studentRow) => {
      Object.keys(studentRow.diem).forEach((componentIdStr) => {
        const compId = Number(componentIdStr);
        const rawValue = studentRow.diem[compId];

        gradeEntriesPayload.push({
          courseRegistrationId: studentRow.regisId,
          componentId: compId, //
          score: rawValue?.score,
          status: statusType,
        });
      });
    });

    const payload: SubmitGradeInClass = {
      courseOfferId,
      createdBy,
      grades: gradeEntriesPayload,
    };

    submitGrades(payload); // Trigger hàm API từ context của bạn
  };

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
          <button
            type="button"
            disabled={isSubmittingGrades} //
            onClick={() => handleSubmit("DRAFT")}
            className="px-4 py-2 border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-white disabled:opacity-50 active:scale-[0.99] transition-all cursor-pointer"
          >
            Lưu bản nháp
          </button>

          <button
            type="button"
            disabled={isSubmittingGrades} //
            onClick={() => handleSubmit("PENDING")}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white text-sm font-semibold rounded-lg shadow-sm shadow-blue-500/10 active:scale-[0.99] transition-all flex items-center gap-2 cursor-pointer"
          >
            {isSubmittingGrades && ( // Hiển thị spinner khi đang trong quá trình kết nối mạng
              <svg
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
            Gửi nộp phê duyệt
          </button>
        </div>
      )}
    </div>
  );
};

export default TableHocSinhVoiDiem;
