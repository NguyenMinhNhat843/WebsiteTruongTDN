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
  type DayOfWeek,
} from "../TienDoDaoTaoProvider";
import type { TienDoDaoTaoRow } from "./columnType";
import { useMemo, useState, useEffect } from "react";
import { formatDateToString } from "../../../../util/formatDate";
import ButtonAction from "../../../../components/ui/ButtonAction";
import {
  calculateStudyDate,
  convertEnumDayOfWeekToString,
  getWeeksInRange,
  mapEnumDayOfWeek,
} from "./helpers";
import SelectSearchInput from "../../../../components/ui/Form/SelectInput";
import PageShell from "../../../../components/ui/PageShell";
import { GridIcon } from "lucide-react";
import { EditableCell } from "./components/EditTableCell";
import { SpinnerLoading } from "../../../../components/ui/SpinnerLoading";
import { toast } from "sonner";

/* eslint-disable @typescript-eslint/no-explicit-any */
const TableTienDoDaoTao = () => {
  const {
    // setSemesterId,
    semesterId,
    classes,
    isLoadingClasses,
    classId,
    // setClassId,
    classSubjects,
    createStudySchedule,
    isCreatingStudySchedule,
    studySchedule,
    isLoadingStudySchedule,
    teachers,
    isLoadingTeachers,
    isLoadingClassSubjects,
    searchParams,
    setSearchParams,
    assignTeacher,
  } = useTienDoDaoTaoContext();
  const { hocKysData, isHocKysLoading } = useAppContext();
  const hocKysSelected = hocKysData?.find((hk) => hk.id === semesterId);
  const startDateSemester = hocKysSelected?.startDate;
  const endDateSemester = hocKysSelected?.endDate;

  // Quản lý dữ liệu bảng
  const [data, setData] = useState<any[]>([]);

  const weeksList = useMemo(() => {
    return getWeeksInRange(
      startDateSemester ? new Date(startDateSemester) : new Date(),
      endDateSemester ? new Date(endDateSemester) : new Date(),
    );
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

      // Load data từ API lên
      const scheduleOfRow = studySchedule?.filter(
        (schedule) => schedule.classSubjectId === mon.id,
      );
      const { shift, startPeriod, endPeriod, dayOfWeek } =
        scheduleOfRow?.[0] || {};
      const tiet =
        shift && startPeriod && endPeriod
          ? `${shift}${startPeriod}-${endPeriod}`
          : "";
      const thu = convertEnumDayOfWeekToString(dayOfWeek) || "";

      const rowData: any = {
        id: mon.id,
        stt: index + 1,
        tenMonHoc: mon.subject?.subjectName || "",
        giaoVienGiangDay: mon.teacherId || "",
        phongHoc: "",
        tongGio: tongGio,
        thu,
        tiet,
      };

      weeksList.forEach((_, idx) => {
        const scheduleForWeek = scheduleOfRow?.find(
          (sch) => sch.weekNumber === idx + 1,
        );
        rowData[`tuan_${idx + 1}`] = scheduleForWeek
          ? scheduleForWeek.countPeriod
          : "";
      });

      return rowData;
    });

    setData(initialData);
  }, [classSubjects, weeksList, studySchedule]);

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
                        path: {
                          id: row.original.id,
                        },
                      },
                      body: {
                        teacherId: val || null,
                      },
                    },
                    {
                      onSuccess: () => {
                        toast.success("Bổ nhiệm giáo viên thành công!");
                      },
                      onError: (error: any) => {
                        toast.error(
                          "Lỗi: ",
                          error?.response?.data?.message ||
                            "Bổ nhiệm giáo viên thất bại",
                        );
                      },
                    },
                  );
                }}
                placeholder="Chọn giáo viên"
                disabled={isLoadingTeachers}
                options={[
                  {
                    value: "",
                    label: "",
                  },
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
            <span className="font-semibold text-gray-800">
              {week.weekNumber}
            </span>
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
  }, [weeksList]);

  const table = useReactTable({
    data: data,
    columns: columnTable,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleSubmit = () => {
    const dataSubmit: CreateScheduleDto[] = (data || []).flatMap((row) => {
      const tietString = row.tiet || "";
      const match = tietString.match(/^([A-Za-z])(\d+)-(\d+)$/);
      const shift = match ? match[1] : "";
      const startPeriod = match ? Number(match[2]) : 0;
      const endPeriod = match ? Number(match[3]) : 0;
      const thu = mapEnumDayOfWeek(row.thu) as DayOfWeek;

      return weeksList
        .map((week, idx) => {
          const weekIndex = idx + 1;
          const cellValue = row[`tuan_${weekIndex}`];

          if (
            !cellValue ||
            (typeof cellValue === "string" && cellValue.trim() === "")
          ) {
            return null;
          }

          return {
            classSubjectId: row.id,
            dayOfWeek: thu as DayOfWeek,
            shift: shift,
            roomId: null,
            startPeriod: startPeriod,
            endPeriod: endPeriod,
            weekNumber: weekIndex,
            countPeriod: Number(cellValue) || 0,
            studyDate: calculateStudyDate(
              new Date(week.start),
              new Date(week.end),
              thu as DayOfWeek,
            ),
          };
        })
        .filter(Boolean) as CreateScheduleDto[];
    });
    // Gửi dữ liệu lên API
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
    <PageShell
      title="Tiến độ đào tạo"
      sub="Quản lý tiến độ giảng dạy theo tuần của từng môn học"
      icon={GridIcon}
    >
      <div className="space-y-4 p-4 bg-white rounded-lg shadow-sm">
        <div className="flex gap-4">
          <div className="w-1/2">
            <SelectOption
              label="Học kỳ"
              value={semesterId ?? ""}
              onChange={(e) => {
                const value = e.target.value;
                // setSemesterId(Number(value));
                if (value) {
                  searchParams.set("semesterId", value);
                } else {
                  searchParams.delete("semesterId");
                }
                setSearchParams(searchParams);
              }}
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
              onChange={(e) => {
                const value = e.target.value;
                // setClassId(Number(e.target.value));
                if (value) {
                  searchParams.set("classId", value);
                } else {
                  searchParams.delete("classId");
                }
                setSearchParams(searchParams);
              }}
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

        {isLoadingStudySchedule || isLoadingClassSubjects ? (
          <SpinnerLoading />
        ) : (
          <div className="w-full overflow-x-auto custom-scrollbar border border-gray-200 rounded-lg shadow-inner">
            <table
              className="border-collapse text-left table-fixed min-w-full"
              style={{ width: table.getTotalSize() }}
            >
              <thead>
                {table.getHeaderGroups().map((headerGroup) => {
                  return (
                    <tr
                      key={headerGroup.id}
                      className="bg-gray-50 border-b border-gray-200"
                    >
                      {headerGroup.headers.map((header, index) => {
                        const isSticky = index === 0 || index === 1;

                        return (
                          <th
                            key={header.id}
                            style={{
                              width: header.getSize(),
                              position: isSticky ? "sticky" : undefined,
                              left: isSticky
                                ? header.column.getStart()
                                : undefined,
                            }}
                            className={`px-3 py-2.5 font-bold border-r border-gray-200 
                                  uppercase tracking-wider text-xs text-center
                                  ${isSticky ? "z-10 bg-gray-50" : ""}`}
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
                  );
                })}
              </thead>
              <tbody className="divide-y divide-gray-100">
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-gray-50/70 transition-colors"
                  >
                    {row.getVisibleCells().map((cell, cellIndex) => {
                      const isWeekColumn = cell.column.id.startsWith("tuan_");
                      const isSticky = cellIndex === 0 || cellIndex === 1;
                      return (
                        <td
                          key={cell.id}
                          style={{
                            width: cell.column.getSize(),
                            position: isSticky ? "sticky" : undefined,
                            left: isSticky ? cell.column.getStart() : undefined,
                          }}
                          className={`px-3 py-2 border-r border-gray-100 text-[12px]
                          ${isWeekColumn ? "text-center whitespace-nowrap" : ""}
                          ${isSticky ? "z-10 bg-white group-hover:bg-gray-50" : ""}
                          `}
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
        )}

        <div className="flex justify-end pt-2">
          <ButtonAction
            variant="outline"
            loading={isCreatingStudySchedule}
            label="Tạo tiến độ tự động"
            onClick={handleSubmit}
          />
        </div>
      </div>
    </PageShell>
  );
};

export default TableTienDoDaoTao;
