import type { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import type { TienDoDaoTaoRow } from "./columnType";
import SelectSearchInput from "../../../../components/ui/Form/SelectInput";
import { EditableCell } from "./components/EditTableCell";
import { formatDateToString } from "../../../../util/formatDate";

// Định nghĩa kiểu dữ liệu cho các dependency truyền từ ngoài vào thông qua bảng
/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ColumnsConfigProps {
  teachers: any[];
  isLoadingTeachers: boolean;
  assignTeacher: (payload: any, options?: any) => void;
  updateCellData: (rowIndex: number, columnId: string, value: any) => void;
  weeksList: any[];
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
  } = config;

  const baseColumns: ColumnDef<TienDoDaoTaoRow>[] = [
    {
      accessorKey: "stt",
      header: "STT",
      size: 50,
    },
    {
      accessorKey: "tenMonHoc",
      size: 200,
      header: "Tên Môn Học",
    },
    {
      accessorKey: "giaoVienGiangDay",
      header: "Giáo Viên Giảng Dạy",
      size: 250,
      cell: ({ getValue, row, column: { id } }) => {
        const currentValue = getValue();
        return (
          <div>
            <SelectSearchInput
              value={currentValue as string}
              onChange={(e) => {
                const val = e.target.value;
                updateCellData(row.index, id, val);
                assignTeacher(
                  {
                    params: {
                      path: { id: row.original.id },
                    },
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
          </div>
        );
      },
    },
    {
      accessorKey: "phongHoc",
      header: "Phòng Học",
      size: 70,
      cell: ({ getValue, row: { index }, column: { id } }) => (
        <EditableCell
          initialValue={getValue()}
          rowIndex={index}
          columnId={id}
          updateCellData={updateCellData}
        />
      ),
    },
    {
      accessorKey: "tongGio",
      header: "Tổng Giờ",
      size: 100,
      cell: ({ getValue, row: { index }, column: { id } }) => (
        <EditableCell
          type="number"
          className="w-16 text-center"
          initialValue={getValue()}
          rowIndex={index}
          columnId={id}
          updateCellData={updateCellData}
        />
      ),
    },
    {
      accessorKey: "thu",
      header: "Thứ",
      size: 70,
      cell: ({ getValue, row: { index }, column: { id } }) => (
        <EditableCell
          className="w-16 text-center"
          initialValue={getValue()}
          rowIndex={index}
          columnId={id}
          updateCellData={updateCellData}
        />
      ),
    },
    {
      accessorKey: "tiet",
      header: "Tiết",
      size: 70,
      cell: ({ getValue, row: { index }, column: { id } }) => (
        <EditableCell
          className="w-full text-center"
          initialValue={getValue()}
          rowIndex={index}
          columnId={id}
          updateCellData={updateCellData}
        />
      ),
    },
  ];

  const weekColumns: ColumnDef<TienDoDaoTaoRow>[] = weeksList.map(
    (week, idx) => ({
      accessorKey: `tuan_${idx + 1}`,
      size: 100,
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
