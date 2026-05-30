import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { useAppContext } from "../../../../AppProvider";
import { SelectOption } from "../../../../components/ui/Form/SelectOption";
import {
  useTienDoDaoTaoContext,
  type CreateScheduleDto,
} from "../TienDoDaoTaoProvider";
import type { TienDoDaoTaoRow } from "./columnType";
import { useMemo, useState, useEffect, type ComponentProps } from "react";
import { formatDateToString } from "../../../../util/formatDate";
import ButtonAction from "../../../../components/ui/ButtonAction";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface EditableCellProps extends Omit<ComponentProps<"input">, "onChange"> {
  initialValue: any;
  rowIndex: number;
  columnId: string;
  updateCellData: (rowIndex: number, columnId: string, value: any) => void;
}

const EditableCell = ({
  initialValue,
  rowIndex,
  columnId,
  updateCellData,
  className,
  type = "text",
  ...props
}: EditableCellProps) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  // Chỉ khi người dùng click ra ngoài (onBlur) mới đẩy data lên state tổng của cha
  const handleBlur = () => {
    let finalValue = value;
    if (type === "number") {
      finalValue = value === "" ? "" : Number(value);
    }
    updateCellData(rowIndex, columnId, finalValue);
  };

  return (
    <input
      {...props}
      type={type}
      className={`w-full bg-transparent px-1 py-0.5 border border-transparent hover:border-gray-300 focus:border-blue-500 focus:bg-white rounded outline-none transition-all ${className}`}
      value={value ?? ""}
      onChange={(e) => setValue(e.target.value)}
      onBlur={handleBlur}
    />
  );
};

const TableTienDoDaoTao = () => {
  const {
    setSemesterId,
    semesterId,
    classes,
    isLoadingClasses,
    classId,
    setClassId,
    classSubjects,
    createStudySchedule,
    isCreatingStudySchedule,
  } = useTienDoDaoTaoContext();
  const { hocKysData, isHocKysLoading } = useAppContext();
  const hocKysSelected = hocKysData?.find((hk) => hk.id === semesterId);
  const startDateSemester = hocKysSelected?.startDate;
  const endDateSemester = hocKysSelected?.endDate;

  // Quản lý dữ liệu bảng
  const [data, setData] = useState<any[]>([]);

  // Giả định dữ liệu weeksList từ hàm sinh tuần của bạn
  const weeksList = useMemo(() => {
    if (!startDateSemester || !endDateSemester) return [];
    const weeks = [];
    let currentStart = new Date(startDateSemester);
    const finalEnd = new Date(endDateSemester);

    if (currentStart > finalEnd) return [];

    let weekIndex = 1;
    while (currentStart <= finalEnd) {
      let currentEnd = new Date(currentStart);
      currentEnd.setDate(currentStart.getDate() + 6);

      if (currentEnd > finalEnd) {
        currentEnd = new Date(finalEnd);
      }

      weeks.push({
        weekNumber: `Tuần ${weekIndex}`,
        start: currentStart.toISOString(),
        end: currentEnd.toISOString(),
      });

      currentStart = new Date(currentEnd);
      currentStart.setDate(currentStart.getDate() + 1);
      weekIndex++;
    }
    return weeks;
  }, [startDateSemester, endDateSemester]);

  // Đồng bộ dữ liệu gốc từ API vào State
  useEffect(() => {
    if (!classSubjects) {
      setData([]);
      return;
    }

    const initialData = classSubjects.map((mon, index) => {
      const tongGio =
        (mon.subject?.theoryHours || 0) +
        (mon?.subject?.practiceHours || 0) +
        (mon?.subject?.testHours || 0);

      const rowData: any = {
        id: mon.id || index,
        stt: index + 1,
        tenMonHoc: mon.subject?.subjectName || "",
        giaoVienGiangDay: "",
        phongHoc: "",
        tongGio: tongGio,
        thu: "",
        tiet: "",
      };

      weeksList.forEach((_, idx) => {
        rowData[`tuan_${idx + 1}`] = "";
      });

      return rowData;
    });

    setData(initialData);
  }, [classSubjects, weeksList]);

  // Hàm cập nhật cell khi user blur ra ngoài
  const updateCellData = (rowIndex: number, columnId: string, value: any) => {
    setData((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: value,
          };
        }
        return row;
      }),
    );
  };

  // Định nghĩa cấu trúc cột Table sử dụng Component EditableCell tối ưu
  const columnTable = useMemo<ColumnDef<TienDoDaoTaoRow>[]>(() => {
    const baseColumns: ColumnDef<TienDoDaoTaoRow>[] = [
      {
        accessorKey: "stt",
        header: "STT",
      },
      {
        accessorKey: "tenMonHoc",
        header: "Tên Môn Học",
      },
      {
        accessorKey: "giaoVienGiangDay",
        header: "Giáo Viên Giảng Dạy",
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
        accessorKey: "phongHoc",
        header: "Phòng Học",
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
        cell: ({ getValue, row: { index }, column: { id } }) => (
          <EditableCell
            className="w-24 text-center"
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
        header: () => (
          <div className="flex flex-col items-center justify-center leading-tight">
            <span className="font-semibold text-gray-800">
              {week.weekNumber}
            </span>
            <span className="text-[10px] text-gray-400 font-normal mt-0.5">
              ({formatDateToString(week.start).slice(0, 5)} -{" "}
              {formatDateToString(week.end).slice(0, 5)})
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
  }, [weeksList]); // Chỉ chạy lại định nghĩa cột khi weeksList đổi, hàm updateCellData qua tham chiếu cha không đổi

  const table = useReactTable({
    data: data,
    columns: columnTable,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleSubmit = () => {
    console.log(data);
    // Xử lý data
    const dataSubmit: CreateScheduleDto[] = (data || []).map((row) => {
      const tietString = row.tiet || "";
      const match = tietString.match(/^([A-Za-z])(\d+)-(\d+)$/);
      const shift = match ? match[1] : "";
      const startPeriod = match ? Number(match[2]) : 0;
      const endPeriod = match ? Number(match[3]) : 0;

      return {
        classSubjectId: row.id,
        dayOfWeek: "MONDAY",
        shift: shift,
        roomId: null,
        startPeriod: startPeriod,
        endPeriod: endPeriod,
      };
    });

    createStudySchedule(
      {
        body: dataSubmit,
      },
      {
        onSuccess: () => {
          alert("Đã lưu thông tin tiến độ thành công!");
        },
        onError: (error) => {
          console.error("Lỗi khi lưu tiến độ đào tạo:", error);
          alert("Lưu tiến độ đào tạo thất bại. Vui lòng thử lại.");
        },
      },
    );
  };

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow-sm">
      <div className="flex gap-4">
        <div className="w-1/2">
          <SelectOption
            label="Học kỳ"
            value={semesterId ?? ""}
            onChange={(e) => setSemesterId(Number(e.target.value))}
            disabled={isHocKysLoading}
            options={[
              { label: "Chọn học kỳ", value: "" },
              ...(hocKysData?.map((hocKy) => ({
                label: hocKy.name,
                value: hocKy.id,
              })) || []),
            ]}
          />
        </div>
        <div className="w-1/2">
          <SelectOption
            label="Lớp học"
            value={classId ?? ""}
            onChange={(e) => setClassId(Number(e.target.value))}
            disabled={isLoadingClasses}
            options={[
              { label: "Chọn lớp học", value: "" },
              ...(classes?.map((cls) => ({
                label: cls.className,
                value: cls.id!,
              })) || []),
            ]}
          />
        </div>
      </div>

      <div className="w-full overflow-x-auto border border-gray-200 rounded-lg shadow-inner">
        <table className="w-full border-collapse text-left table-auto">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="bg-gray-50 border-b border-gray-200"
              >
                {headerGroup.headers.map((header) => {
                  const isWeekColumn = header.id.startsWith("tuan_");
                  return (
                    <th
                      key={header.id}
                      className={`px-3 py-2.5 text-gray-600 font-medium border-r border-gray-200 uppercase tracking-wider
                      ${isWeekColumn ? "text-center whitespace-normal min-w-[130px]" : "whitespace-nowrap text-xs text-[11px]"}
                      font-bold`}
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
          <tbody className="divide-y divide-gray-100">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-gray-50/70 transition-colors"
              >
                {row.getVisibleCells().map((cell) => {
                  const isWeekColumn = cell.column.id.startsWith("tuan_");
                  return (
                    <td
                      key={cell.id}
                      className={`px-3 py-2 text-gray-700 border-r border-gray-100 text-[12px] whitespace-nowrap
                      ${isWeekColumn ? "text-center" : ""}`}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end pt-2">
        <ButtonAction
          variant="outline"
          loading={isCreatingStudySchedule}
          label="Tạo tiến độ tự động"
          onClick={handleSubmit}
        />
      </div>
    </div>
  );
};

export default TableTienDoDaoTao;
