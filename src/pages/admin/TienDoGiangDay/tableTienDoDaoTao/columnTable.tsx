import type { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import type { TienDoDaoTaoRow } from "./columnType";
import SelectSearchInput from "../../../../components/ui/Form/SelectInput";
import { EditableCell } from "./components/EditTableCell";
import { formatDateToString } from "../../../../util/formatDate";
import { TotalHoursCell } from "./components/TotalHoursCell";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ColumnsConfigProps {
  teachers: any[];
  isLoadingTeachers: boolean;
  assignTeacher: (payload: any, options?: any) => void;
  updateCellData: (rowIndex: number, columnId: string, value: any) => void;
  weeksList: any[];
  addSessionRow: (rowIndex: number) => void;
  removeSessionRow: (rowIndex: number) => void;
}

export const getTienDoDaoTaoColumns = (
  config: ColumnsConfigProps,
): ColumnDef<TienDoDaoTaoRow>[] => {
  const {
    teachers,
    isLoadingTeachers,
    assignTeacher,
    updateCellData,
    weeksList,
    addSessionRow,
    removeSessionRow,
  } = config;

  const baseColumns: ColumnDef<TienDoDaoTaoRow>[] = [
    {
      accessorKey: "stt",
      header: "STT",
      size: 50,
      cell: ({ row, getValue }) => {
        if (row.original.isSubRow) return null;
        return (
          <div className="text-center font-medium">{getValue() as any}</div>
        );
      },
    },
    {
      accessorKey: "tenMonHoc",
      size: 200,
      header: "Tên Môn Học",
      cell: ({ row, getValue }) => {
        if (row.original.isSubRow) return null;
        return (
          <div className="font-semibold text-gray-700">{getValue() as any}</div>
        );
      },
    },
    {
      accessorKey: "giaoVienGiangDay",
      header: "Giáo Viên Giảng Dạy",
      size: 220,
      cell: ({ getValue, row, column: { id } }) => {
        if (row.original.isSubRow) return null;
        const currentValue = getValue();
        return (
          <SelectSearchInput
            value={currentValue as string}
            onChange={(e) => {
              const val = e.target.value;
              updateCellData(row.index, id, val);
              assignTeacher(
                {
                  params: { path: { id: row.original.classSubjectId } },
                  body: { teacherId: val || null },
                },
                {
                  onSuccess: () => {
                    toast.success("Bổ nhiệm giáo viên thành công!");
                  },
                  onError: (error: any) => {
                    toast.error(
                      "Lỗi: " +
                        (error?.response?.data?.message ||
                          "Bổ nhiệm giáo viên thất bại"),
                    );
                  },
                },
              );
            }}
            placeholder="Chọn giáo viên"
            disabled={isLoadingTeachers}
            options={[
              { value: "", label: "" },
              ...(teachers?.map((teacher) => ({
                value: teacher.id!,
                label: teacher.fullName,
              })) || []),
            ]}
          />
        );
      },
    },
    {
      id: "tongGioMon",
      header: "Tổng Giờ Môn",
      size: 140,
      cell: ({ row, table }) => <TotalHoursCell row={row} table={table} />,
    },

    {
      accessorKey: "phongHoc",
      header: "Phòng Học",
      size: 85,
      cell: ({ getValue, row: { index }, column: { id } }) => (
        <EditableCell
          initialValue={getValue()}
          rowIndex={index}
          columnId={id}
          updateCellData={updateCellData}
          placeholder="Phòng"
          className="text-center"
        />
      ),
    },
    {
      accessorKey: "thu",
      header: "Thứ",
      size: 75,
      cell: ({ getValue, row: { index }, column: { id } }) => (
        <EditableCell
          className="w-full text-center font-medium"
          initialValue={getValue()}
          rowIndex={index}
          columnId={id}
          updateCellData={updateCellData}
          placeholder="Thứ"
        />
      ),
    },
    {
      accessorKey: "tiet",
      header: "Tiết",
      size: 85,
      cell: ({ getValue, row: { index }, column: { id } }) => (
        <EditableCell
          className="w-full text-center"
          initialValue={getValue()}
          rowIndex={index}
          columnId={id}
          updateCellData={updateCellData}
          placeholder="S1-3"
        />
      ),
    },
    {
      id: "actions",
      header: "Tùy chọn",
      size: 90,
      cell: ({ row }) => {
        return (
          <div className="flex justify-center items-center">
            {!row.original.isSubRow ? (
              <button
                type="button"
                onClick={() => addSessionRow(row.index)}
                className="px-2 py-1 text-[11px] bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 rounded font-medium transition-colors"
              >
                + Buổi
              </button>
            ) : (
              <button
                type="button"
                onClick={() => removeSessionRow(row.index)}
                className="px-2 py-1 text-[11px] bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded font-medium transition-colors"
              >
                Xóa
              </button>
            )}
          </div>
        );
      },
    },
  ];

  const weekColumns: ColumnDef<TienDoDaoTaoRow>[] = weeksList.map(
    (week, idx) => ({
      accessorKey: `tuan_${idx + 1}`,
      size: 95,
      header: () => (
        <div className="flex flex-col items-center justify-center leading-tight">
          <span className="font-semibold text-gray-800">{week.weekNumber}</span>
          <span className="text-[10px] text-gray-400 font-normal mt-0.5">
            {formatDateToString(week.start).slice(0, 5)}
          </span>
        </div>
      ),
      cell: ({ getValue, row: { index }, column: { id } }) => (
        <EditableCell
          className="text-center"
          placeholder="..."
          initialValue={getValue()}
          rowIndex={index}
          columnId={id}
          updateCellData={updateCellData}
        />
      ),
    }),
  );

  return [...baseColumns, ...weekColumns];
};
