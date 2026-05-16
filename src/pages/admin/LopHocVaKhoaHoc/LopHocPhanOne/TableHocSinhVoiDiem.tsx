import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import {
  useLopHocPhanOneContext,
  type SubmitGradeInClass,
} from "./LopHocPhanOneProvider";

interface StudentRowData {
  id: number;
  studentCode: string;
  fullName: string;
  // Lưu trữ điểm theo ID thành phần điểm dưới dạng object: { [componentId]: score }
  diem: Record<number, number | string>;
}

const TableHocSinhVoiDiem = () => {
  const { lopHocPhanDetail, submitGrades, isSubmittingGrades } =
    useLopHocPhanOneContext(); // [cite: 125]
  const courseOfferId = lopHocPhanDetail?.id; // [cite: 126]
  const createdBy = lopHocPhanDetail?.teacherId; // [cite: 127]

  // 1. Lấy cấu hình đầu điểm từ Context [cite: 128, 129, 130]
  const gradesConfig = useMemo(() => {
    return lopHocPhanDetail?.gradeConfig || []; // [cite: 130]
  }, [lopHocPhanDetail]);

  // 2. CHUYỂN ĐỔI SANG STATE: Quản lý toàn bộ dữ liệu bảng để có thể tương tác nhập liệu
  const [tableData, setTableData] = useState<StudentRowData[]>(() => {
    return (
      lopHocPhanDetail?.registrations?.map((regis) => {
        const student = regis.student; // [cite: 136]
        const diemMap: Record<number, number | string> = {}; // [cite: 138]

        gradesConfig.forEach((grade) => {
          // Bạn có thể map điểm cũ từ DB tại đây nếu sau này API trả về, hiện tại mặc định để rỗng [cite: 140]
          diemMap[grade.id] = "";
        });

        return {
          id: student.id, // [cite: 143]
          studentCode: student.studentCode, // [cite: 144]
          fullName: student.fullName, // [cite: 145]
          diem: diemMap, // [cite: 146]
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
              [componentId]: value, // Cập nhật giá trị điểm của thành phần tương ứng
            },
          };
        }
        return row;
      }),
    );
  };

  // 4. Hàm tính toán tổng điểm dựa trên trọng số thực tế (Hệ số 10)
  const calculateTotalScore = (diem: Record<number, number | string>) => {
    let total = 0;
    let hasAllScores = true;

    for (const grade of gradesConfig) {
      const score = diem[grade.id];
      if (score === "" || score === undefined || score === null) {
        hasAllScores = false; // Nếu học sinh bị thiếu bất kỳ đầu điểm nào, chưa tính tổng điểm hiển thị
        break;
      }
      total += parseFloat(score as string) * grade.weight; // Tính tổng theo trọng số tích lũy [cite: 179]
    }

    return hasAllScores ? total.toFixed(2) : "-";
  };

  // 5. Khởi tạo Định nghĩa Cột động với TanStack Table [cite: 151, 152]
  const columns = useMemo(() => {
    const columnHelper = createColumnHelper<StudentRowData>(); // [cite: 153]

    return [
      columnHelper.accessor("studentCode", {
        // [cite: 156]
        header: "Mã SV", // [cite: 157]
        cell: (info) => (
          <span className="font-semibold text-slate-700">
            {info.getValue()}
          </span>
        ), // [cite: 158, 159, 160]
      }),
      columnHelper.accessor("fullName", {
        // [cite: 164]
        header: "Họ và tên", // [cite: 165]
        cell: (info) => (
          <span className="font-medium text-slate-900">{info.getValue()}</span>
        ), // [cite: 166, 167]
      }),

      // Duyệt mảng cấu hình để sinh cột điểm tự động [cite: 170, 171]
      ...gradesConfig.map((grade) =>
        columnHelper.accessor((row) => row.diem[grade.id], {
          // [cite: 172]
          id: `grade-${grade.id}`, // [cite: 173]
          header: () => (
            <div className="text-center">
              <div>{grade.name}</div> {/* [cite: 177] */}
              <div className="text-[11px] text-slate-400 font-normal">
                ({grade.weight * 100}%)
              </div>{" "}
              {/* [cite: 178, 179] */}
            </div>
          ),
          cell: (info) => {
            const studentId = info.row.original.id;
            const currentValue = info.getValue() ?? ""; // [cite: 192]
            return (
              <div className="text-center">
                <input
                  type="number"
                  min={0} // [cite: 188]
                  max={10} // [cite: 189]
                  step="0.1"
                  placeholder="-" // [cite: 190]
                  className="w-16 text-center py-1 border border-slate-200 rounded focus:outline-none focus:border-blue-500 text-sm font-medium bg-slate-50/50 focus:bg-white transition-all disabled:opacity-50"
                  value={currentValue}
                  disabled={isSubmittingGrades} // Khóa ô nhập khi đang gọi API gửi lên [cite: 125]
                  onChange={(e) =>
                    handleScoreChange(studentId, grade.id, e.target.value)
                  }
                />
              </div>
            );
          },
        }),
      ),

      // Cột tổng điểm tính toán tự động dựa trên hàm logic thực tế [cite: 201, 202]
      columnHelper.display({
        id: "totalScore", // [cite: 203]
        header: () => (
          <div className="text-center font-bold text-blue-600">
            <div>Tổng điểm</div> {/* [cite: 206] */}
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
    data: tableData, // Chuyển sang sử dụng State thay vì dữ liệu tĩnh hằng số [cite: 217]
    columns, // [cite: 218]
    getCoreRowModel: getCoreRowModel(), // [cite: 219]
  });

  // 6. Xử lý đóng gói payload và gửi dữ liệu lên server
  const handleSubmit = async (statusType: "DRAFT" | "PENDING") => {
    if (!courseOfferId || !createdBy) {
      alert("Thiếu thông tin lớp học phần hoặc giảng viên phụ trách!");
      return;
    }

    // Biến đổi cấu trúc từ State Table sang đúng cấu trúc API yêu cầu [cite: 78]
    const gradeEntriesPayload: any[] = [];

    tableData.forEach((studentRow) => {
      Object.keys(studentRow.diem).forEach((componentIdStr) => {
        const compId = Number(componentIdStr);
        const rawValue = studentRow.diem[compId];

        gradeEntriesPayload.push({
          studentId: studentRow.id, // [cite: 80]
          componentId: compId, // [cite: 81]
          // Nếu ô trống thì gửi null lên DB theo quy định trong DTO, có điểm thì parse sang kiểu Float [cite: 35, 41, 82]
          score: rawValue === "" ? null : parseFloat(rawValue as string),
          status: statusType, // Đồng bộ trạng thái Lưu nháp hoặc Gửi duyệt [cite: 83]
        });
      });
    });

    const payload: SubmitGradeInClass = {
      courseOfferId, // [cite: 56, 79]
      createdBy, // [cite: 63, 84]
      grades: gradeEntriesPayload, // [cite: 72, 76]
    };

    submitGrades(payload); // Trigger hàm API từ context của bạn [cite: 101, 125]
  };

  return (
    <div className="w-full space-y-4">
      {/* Khung chứa bảng điểm */}
      <div className="w-full bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        {" "}
        {/* [cite: 222] */}
        <div className="overflow-x-auto">
          {" "}
          {/* [cite: 223] */}
          <table className="w-full text-left border-collapse">
            {" "}
            {/* [cite: 224] */}
            <thead className="bg-slate-50/70 border-b border-slate-100">
              {" "}
              {/* [cite: 226] */}
              {table.getHeaderGroups().map(
                (
                  headerGroup, // [cite: 227]
                ) => (
                  <tr key={headerGroup.id}>
                    {" "}
                    {/* [cite: 228] */}
                    {headerGroup.headers.map(
                      (
                        header, // [cite: 229]
                      ) => (
                        <th
                          key={header.id}
                          className="p-3.5 text-xs font-semibold text-slate-600 uppercase tracking-wider whitespace-nowrap text-center"
                        >
                          {" "}
                          {/* [cite: 230, 231, 232] */}
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}{" "}
                          {/* [cite: 234, 235, 236, 237, 238] */}
                        </th>
                      ),
                    )}
                  </tr>
                ),
              )}
            </thead>
            <tbody className="divide-y divide-slate-100">
              {" "}
              {/* [cite: 246] */}
              {table.getRowModel().rows.length > 0 ? ( // [cite: 247]
                table.getRowModel().rows.map(
                  (
                    row, // [cite: 248]
                  ) => (
                    <tr
                      key={row.id}
                      className="hover:bg-slate-50/40 transition-colors duration-150"
                    >
                      {" "}
                      {/* [cite: 249, 250, 251] */}
                      {row.getVisibleCells().map(
                        (
                          cell, // [cite: 253]
                        ) => (
                          <td
                            key={cell.id}
                            className="p-3.5 text-sm text-slate-600 whitespace-nowrap align-middle"
                          >
                            {" "}
                            {/* [cite: 254, 255, 256] */}
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}{" "}
                            {/* [cite: 258, 259, 260] */}
                          </td>
                        ),
                      )}
                    </tr>
                  ),
                )
              ) : (
                <tr>
                  {" "}
                  {/* [cite: 267] */}
                  <td
                    colSpan={columns.length}
                    className="p-8 text-center text-sm text-slate-400 font-medium"
                  >
                    {" "}
                    {/* [cite: 268, 269, 270] */}
                    Chưa có học sinh nào đăng ký vào lớp học phần này.{" "}
                    {/* [cite: 272] */}
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
            disabled={isSubmittingGrades} // [cite: 125]
            onClick={() => handleSubmit("DRAFT")}
            className="px-4 py-2 border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-white disabled:opacity-50 active:scale-[0.99] transition-all cursor-pointer"
          >
            Lưu bản nháp
          </button>

          <button
            type="button"
            disabled={isSubmittingGrades} // [cite: 125]
            onClick={() => handleSubmit("PENDING")}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white text-sm font-semibold rounded-lg shadow-sm shadow-blue-500/10 active:scale-[0.99] transition-all flex items-center gap-2 cursor-pointer"
          >
            {isSubmittingGrades && ( // Hiển thị spinner khi đang trong quá trình kết nối mạng [cite: 125]
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
