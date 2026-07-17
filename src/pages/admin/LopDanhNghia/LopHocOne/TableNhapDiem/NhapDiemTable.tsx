import { useMemo, useState, useEffect } from "react";
import { type ClassSubjectGrade } from "../LopHocOneProvider";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { RefreshCw, Save, Loader2 } from "lucide-react";
import { type LopHocResponseDto } from "../../LopHocProvider";
import ButtonAction from "../../../../../components/ui/ButtonAction";
import ButtonExport from "../../../../../components/ui/ButtonExport";
import { calculateGrades, getStickyClass, handleKeyDown } from "./helper";
import { downloadFromBlob } from "../../../../../util/download";
import { NhapDiemProvider, useNhapDiemContext } from "./NhapDiemProvider";
import { toast } from "sonner";

// Định nghĩa kiểu dữ liệu chuẩn cho hàng trong bảng
export interface GradeRow {
  stt: number;
  studentId: number;
  tenHs: string;
  maHs: string;
  ngaySinh: string;
  kttx1: number | null;
  kttx2: number | null;
  kttx3: number | null;
  ktdk1: number | null;
  ktdk2: number | null;
  ktdk3: number | null;
  ktdk4: number | null;
  diemKiemTra1: number | null;
  diemKiemTra2: number | null;
  diemTB: number | null;
  diemTongKet1: number | null;
  diemTongKet2: number | null;
  diemChu: string; // Cột mới thay thế ghi chú
  diemHe4: number | null; // Cột mới thay thế ghi chú
}

const columnHelper = createColumnHelper<GradeRow>();

interface NhapDiemProps {
  classSubjectId: number;
  lopHocDetail: LopHocResponseDto;
}

const getGradeLetterAndScale4 = (diemTK1: any, diemTK2: any) => {
  const rawGrade =
    diemTK2 !== null && diemTK2 !== undefined && diemTK2 !== ""
      ? diemTK2
      : diemTK1;

  if (
    rawGrade === null ||
    rawGrade === undefined ||
    rawGrade === "" ||
    rawGrade === "-"
  ) {
    return { diemChu: "-", diemHe4: null };
  }

  const targetGrade = parseFloat(rawGrade);

  if (isNaN(targetGrade)) {
    return { diemChu: "-", diemHe4: null };
  }

  if (targetGrade >= 8.5) return { diemChu: "A", diemHe4: 4.0 };
  if (targetGrade >= 7.0) return { diemChu: "B", diemHe4: 3.0 };
  if (targetGrade >= 5.5) return { diemChu: "C", diemHe4: 2.0 };
  if (targetGrade >= 4.0) return { diemChu: "D", diemHe4: 1.0 };
  return { diemChu: "F", diemHe4: 0.0 };
};

const NhapDiem = ({ classSubjectId, lopHocDetail }: NhapDiemProps) => {
  return (
    <NhapDiemProvider props={{ classSubjectId, lopHocDetail }}>
      <Inner />
    </NhapDiemProvider>
  );
};

const Inner = () => {
  const {
    exportExcel,
    isExportingExcel,
    isPendingSaveGradeTable,
    saveGradeTable,
    classSubject,
    isClassSubjectLoading,
    refetchClassSubject,
    lopHocDetail,
  } = useNhapDiemContext();

  // State quản lý danh sách điểm cục bộ
  const [tableData, setTableData] = useState<GradeRow[]>([]);

  // Đồng bộ hóa dữ liệu từ Context vào State
  useEffect(() => {
    if (classSubject?.gradeStudents) {
      const initialData = classSubject.gradeStudents.map(
        (regis: ClassSubjectGrade, index: number) => {
          const baseRow = {
            stt: index + 1,
            studentId: regis.studentId || regis.student?.id || 0,
            tenHs: regis.student?.fullName ?? "N/A",
            maHs: regis.student?.studentCode ?? "N/A",
            ngaySinh: regis.student?.dob
              ? new Date(regis.student.dob).toLocaleDateString("vi-VN")
              : "-",
            kttx1: regis.kttx1 ?? null,
            kttx2: regis.kttx2 ?? null,
            kttx3: regis.kttx3 ?? null,
            ktdk1: regis.ktdk1 ?? null,
            ktdk2: regis.ktdk2 ?? null,
            ktdk3: regis.ktdk3 ?? null,
            ktdk4: regis.ktdk4 ?? null,
            diemKiemTra1: regis.diemKiemTra1 ?? null,
            diemKiemTra2: regis.diemKiemTra2 ?? null,
          };

          // Tính toán các điểm trung bình từ hàm helper có sẵn
          const calculated = calculateGrades(baseRow);
          const tempRow = { ...baseRow, ...calculated };

          // Tính toán thêm Điểm chữ & Điểm hệ 4 dựa trên điểm tổng kết vừa tính được
          const gradeScale = getGradeLetterAndScale4(
            tempRow.diemTongKet1 ?? null,
            tempRow.diemTongKet2 ?? null,
          );

          return { ...tempRow, ...gradeScale } as GradeRow;
        },
      );
      setTableData(initialData);
    }
  }, [classSubject]);

  // Hàm xử lý khi người dùng thay đổi điểm số trong các ô input
  const handleCellChange = (
    rowIndex: number,
    columnId: keyof GradeRow,
    value: string,
  ) => {
    setTableData((oldData) =>
      oldData.map((row, index) => {
        if (index !== rowIndex) return row;

        let updatedValue: number | null = null;

        if (value !== "") {
          const parsed = parseFloat(value);
          if (isNaN(parsed) || parsed < 0 || parsed > 10) return row;
          updatedValue = parsed;
        }

        const updatedRow = { ...row, [columnId]: updatedValue };
        const calculated = calculateGrades(updatedRow);
        const tempRow = { ...updatedRow, ...calculated };

        // Tính lại Điểm chữ và Hệ 4 sau khi có điểm tổng kết mới
        const gradeScale = getGradeLetterAndScale4(
          tempRow.diemTongKet1 ?? null,
          tempRow.diemTongKet2 ?? null,
        );

        return { ...tempRow, ...gradeScale };
      }),
    );
  };

  const renderInputCell = (
    rowIndex: number,
    columnId: keyof GradeRow,
    value: number | null,
  ) => {
    return (
      <input
        type="number"
        value={value ?? ""}
        min={0}
        max={10}
        onChange={(e) => handleCellChange(rowIndex, columnId, e.target.value)}
        className="w-full h-full min-h-[38px] px-2 text-center font-medium text-slate-800 
        bg-transparent border-0 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 
        focus:bg-blue-50/30 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none 
        [&::-webkit-inner-spin-button]:appearance-none"
        placeholder="-"
      />
    );
  };

  // Định nghĩa cấu trúc cột với Header nhóm phân cấp UI
  const columns = useMemo(
    () => [
      columnHelper.accessor("stt", {
        header: "STT",
        cell: (info) => (
          <span className="font-medium text-slate-500">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("tenHs", {
        header: "Họ và Tên",
        cell: (info) => (
          <div className="text-left py-2 px-2">
            <div className="font-semibold text-slate-900">
              {info.getValue()}
            </div>
            <div className="text-xs text-slate-400 font-mono">
              {info.row.original.maHs}
            </div>
          </div>
        ),
      }),
      columnHelper.accessor("ngaySinh", {
        header: "Ngày sinh",
        cell: (info) => (
          <span className="text-slate-600 font-mono">{info.getValue()}</span>
        ),
      }),

      // --- NHÓM CỘT KIỂM TRA THƯỜNG XUYÊN ---
      columnHelper.group({
        id: "kiemTraThuongXuyen",
        header: "Kiểm tra thường xuyên",
        columns: (["kttx1", "kttx2", "kttx3"] as const).map((id, idx) =>
          columnHelper.accessor(id, {
            header: `Lần ${idx + 1}`,
            cell: (info) =>
              renderInputCell(info.row.index, id, info.getValue()),
          }),
        ),
      }),

      // --- NHÓM CỘT KIỂM TRA ĐỊNH KỲ ---
      columnHelper.group({
        id: "kiemTraDinhKy",
        header: "Kiểm tra định kỳ",
        columns: (["ktdk1", "ktdk2", "ktdk3", "ktdk4"] as const).map(
          (id, idx) =>
            columnHelper.accessor(id, {
              header: `Lần ${idx + 1}`,
              cell: (info) =>
                renderInputCell(info.row.index, id, info.getValue()),
            }),
        ),
      }),

      columnHelper.accessor("diemTB", {
        header: "Điểm TB",
        cell: (info) => (
          <span className="font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md block text-center min-w-11.25">
            {info.getValue() !== null ? info.getValue()?.toFixed(1) : "-"}
          </span>
        ),
      }),

      // --- NHÓM CỘT ĐIỂM KIỂM TRA ---
      columnHelper.group({
        id: "diemKiemTraGroup",
        header: "Điểm Kiểm tra",
        columns: [
          columnHelper.accessor("diemKiemTra1", {
            header: "Lần 1",
            cell: (info) =>
              renderInputCell(info.row.index, "diemKiemTra1", info.getValue()),
          }),
          columnHelper.accessor("diemKiemTra2", {
            header: "Lần 2",
            cell: (info) =>
              renderInputCell(info.row.index, "diemKiemTra2", info.getValue()),
          }),
        ],
      }),

      // --- NHÓM CỘT ĐIỂM TỔNG KẾT ---
      columnHelper.group({
        id: "diemTongKetGroup",
        header: "Điểm Tổng kết",
        columns: [
          columnHelper.accessor("diemTongKet1", {
            header: "Lần 1",
            cell: (info) => (
              <span
                className="font-bold text-emerald-600 bg-emerald-50 px-2 py-1 
              rounded-md block text-center min-w-11.25"
              >
                {info.getValue() !== null ? info.getValue()?.toFixed(1) : "-"}
              </span>
            ),
          }),
          columnHelper.accessor("diemTongKet2", {
            header: "Lần 2",
            cell: (info) => (
              <span
                className="font-bold text-amber-600 bg-amber-50 px-2 py-1 
              rounded-md block text-center min-w-11.25"
              >
                {info.getValue() !== null ? info.getValue()?.toFixed(1) : "-"}
              </span>
            ),
          }),
        ],
      }),

      // --- CỘT ĐIỂM CHỮ (THAY CHO GHI CHÚ) ---
      columnHelper.accessor("diemChu", {
        header: "Điểm chữ",
        cell: (info) => {
          const val = info.getValue();
          let colorClass = "text-slate-500 bg-slate-50";
          if (val === "A") colorClass = "text-red-600 bg-red-50 font-extrabold";
          else if (val === "B") colorClass = "text-orange-600 bg-orange-50";
          else if (val === "C") colorClass = "text-yellow-600 bg-yellow-50";
          else if (val === "D") colorClass = "text-blue-600 bg-blue-50";
          else if (val === "F")
            colorClass = "text-rose-700 bg-rose-100 font-bold";

          return (
            <span
              className={`px-2 py-1 rounded-md block text-center font-bold min-w-[50px] ${colorClass}`}
            >
              {val}
            </span>
          );
        },
      }),

      // --- CỘT ĐIỂM HỆ 4 (THAY CHO GHI CHÚ) ---
      columnHelper.accessor("diemHe4", {
        header: "Hệ 4",
        cell: (info) => {
          const val = info.getValue();
          return (
            <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-1 rounded-md block text-center min-w-[50px]">
              {val !== null ? val.toFixed(1) : "-"}
            </span>
          );
        },
      }),
    ],
    [],
  );

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleSaveGrades = async () => {
    saveGradeTable(
      {
        body: {
          classSubjectId: classSubject!.id!,
          grades: tableData.map((row) => ({
            studentId: row.studentId,
            kttx1: row.kttx1 ?? undefined,
            kttx2: row.kttx2 ?? undefined,
            kttx3: row.kttx3 ?? undefined,
            ktdk1: row.ktdk1 ?? undefined,
            ktdk2: row.ktdk2 ?? undefined,
            ktdk3: row.ktdk3 ?? undefined,
            ktdk4: row.ktdk4 ?? undefined,
            diemKiemTra1: row.diemKiemTra1 ?? undefined,
            diemKiemTra2: row.diemKiemTra2 ?? undefined,
            diemTB: row.diemTB ?? undefined,
            diemTongKet1: row.diemTongKet1 ?? undefined,
            diemTongKet2: row.diemTongKet2 ?? undefined,
            // Đã lược bỏ note/ghiChu tại đây
          })),
        },
      },
      {
        onSuccess: () => {
          refetchClassSubject();
          toast.success("Lưu bảng điểm thành công!");
        },
        onError: () => {
          toast.error("Đã có lỗi xảy ra khi lưu bảng điểm. Vui lòng thử lại.");
        },
      },
    );
  };

  const getStickyCellClass = (columnId: string) => {
    if (columnId === "stt") {
      return "sticky left-0 z-10 bg-white group-hover:bg-slate-50/90 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] text-center";
    }
    if (columnId === "tenHs") {
      return "sticky left-[60px] z-10 bg-white group-hover:bg-slate-50/90 shadow-[4px_0_8px_-3px_rgba(0,0,0,0.15)] font-semibold";
    }
    return "";
  };

  if (isClassSubjectLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        <p className="text-sm font-medium text-slate-500">
          Đang tải bảng điểm lớp học...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen rounded-xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pt-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Bảng Nhập Điểm
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {"Môn học: " + (classSubject?.subject?.subjectName || "N/A")}
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <ButtonAction
            icon={<RefreshCw className="w-4 h-4" />}
            label="Làm mới"
            onClick={() => refetchClassSubject()}
            variant="outline"
          />
          <ButtonExport
            onClick={() => {
              return exportExcel(
                {
                  parseAs: "blob",
                  body: {
                    classSubjectIds: [classSubject!.id!],
                  },
                },
                {
                  onSuccess: (blob) => {
                    downloadFromBlob(
                      blob as never,
                      `${lopHocDetail?.className} - ${classSubject?.subject?.subjectName}`,
                      ".xlsx",
                    );
                  },
                },
              );
            }}
            isPending={isExportingExcel}
          />
          <ButtonAction
            icon={<Save className="w-4 h-4" />}
            label="Lưu bảng điểm"
            onClick={handleSaveGrades}
            loading={isPendingSaveGradeTable}
          />
        </div>
      </div>

      <div className="w-full bg-white rounded-xl shadow-sm border border-slate-200/80 overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse text-sm text-left">
            <thead>
              {table.getHeaderGroups().map((headerGroup, groupIndex) => (
                <tr
                  key={headerGroup.id}
                  className={
                    groupIndex === 0
                      ? "bg-slate-100 border-b border-slate-200"
                      : "bg-slate-50 border-b border-slate-200"
                  }
                >
                  {headerGroup.headers.map((header) => {
                    const isGroup =
                      header.subHeaders && header.subHeaders.length > 0;

                    const isSubHeader = groupIndex > 0;

                    return (
                      <th
                        key={header.id}
                        colSpan={header.colSpan}
                        rowSpan={isGroup ? 1 : 2}
                        className={`px-3 py-2.5 text-xs font-bold tracking-wider text-center select-none border-r border-slate-200 last:border-0 transition-colors relative ${
                          isGroup
                            ? "text-blue-800 font-extrabold uppercase bg-blue-50"
                            : isSubHeader
                              ? "text-slate-500 font-medium normal-case bg-slate-50"
                              : "text-slate-700 font-bold uppercase bg-slate-100"
                        } ${getStickyClass(header.id, groupIndex, header.placeholderId)}`}
                        style={{
                          borderRightWidth:
                            isGroup || !isSubHeader ? "2px" : "1px",
                        }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody
              className="divide-y divide-slate-100"
              onKeyDown={(e) => handleKeyDown(e, table)}
            >
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="group hover:bg-slate-50/50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      data-row-index={row.index}
                      data-col-index={cell.column.id}
                      className={`align-middle text-center whitespace-nowrap border-r border-slate-100 last:border-0 transition-colors duration-150 ${getStickyCellClass(cell.column.id)}`}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default NhapDiem;
