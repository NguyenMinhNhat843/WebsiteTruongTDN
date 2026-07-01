/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  getCoreRowModel,
  useReactTable,
  type RowData,
} from "@tanstack/react-table";
import { useAppContext } from "../../../../AppProvider";
import { SelectOption } from "../../../../components/ui/Form/SelectOption";
import {
  useTienDoDaoTaoContext,
  type CreateScheduleDto,
  type DayOfWeek,
} from "../TienDoDaoTaoProvider";
import { useMemo, useState, useEffect } from "react";
import ButtonAction from "../../../../components/ui/ButtonAction";
import {
  calculateRowTotal,
  calculateStudyDate,
  calculateSubjectTotal,
  convertEnumDayOfWeekToString,
  getWeeksInRange,
  mapEnumDayOfWeek,
} from "./helpers";
import PageShell from "../../../../components/ui/PageShell";
import { ArrowRight, CalendarDays, FileText, GridIcon } from "lucide-react";
import { SpinnerLoading } from "../../../../components/ui/SpinnerLoading";
import { getTienDoDaoTaoColumns } from "./columnTable";
import { StickyTanStackTable } from "../../../../components/ui/StickyTanstackTable";
import { downloadFromBlob } from "../../../../util/download";

// Mở rộng kiểu TableMeta của TanStack Table để không bị báo lỗi TypeScript
declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    calculateRowTotal?: (row: TData) => number;
    calculateSubjectTotal?: (classSubjectId: number) => number;
  }
}

const TableTienDoDaoTao = () => {
  const {
    semesterId,
    classes,
    isLoadingClasses,
    classId,
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
    exportStudyScheduleToExcel,
    isExportingStudySchedule,
  } = useTienDoDaoTaoContext();
  const { hocKysData, isHocKysLoading } = useAppContext();

  const classSelected = classes?.find((cls) => cls.id === classId);
  const semesterSelected = hocKysData?.find((hk) => hk.id === semesterId);

  const hocKysSelected = hocKysData?.find((hk) => hk.id === semesterId);
  const startDateSemester = hocKysSelected?.startDate;
  const endDateSemester = hocKysSelected?.endDate;

  const [data, setData] = useState<any[]>([]);

  const weeksList = useMemo(() => {
    return getWeeksInRange(
      startDateSemester ? new Date(startDateSemester) : new Date(),
      endDateSemester ? new Date(endDateSemester) : new Date(),
    );
  }, [startDateSemester, endDateSemester]);

  // Đồng bộ dữ liệu gốc từ API và bung phẳng danh sách lịch học
  useEffect(() => {
    if (!classSubjects) {
      setData([]);
      return;
    }

    const flattenedData: any[] = [];
    let globalIndex = 1;

    classSubjects.forEach((mon) => {
      const tongGioMonHoc =
        (mon.subject?.theoryHours || 0) +
        (mon?.subject?.practiceHours || 0) +
        (mon?.subject?.testHours || 0);

      const schedulesOfSubject =
        studySchedule?.filter(
          (schedule) => schedule.classSubjectId === mon.id,
        ) || [];

      const sessionsMap: Record<string, typeof schedulesOfSubject> = {};
      schedulesOfSubject.forEach((sch) => {
        const sessionKey = `${sch.dayOfWeek}_${sch.shift}${sch.startPeriod}-${sch.endPeriod}_${sch.roomId || "none"}`;
        if (!sessionsMap[sessionKey]) {
          sessionsMap[sessionKey] = [];
        }
        sessionsMap[sessionKey].push(sch);
      });

      const sessions = Object.values(sessionsMap);

      if (sessions.length === 0) {
        const rowData: any = {
          id: `${mon.id}_default_${Date.now()}`,
          classSubjectId: mon.id,
          isSubRow: false,
          stt: globalIndex++,
          tenMonHoc: mon.subject?.subjectName || "",
          giaoVienGiangDay: mon.teacherId || "",
          phongHoc: "",
          tongGioMonHoc,
          thu: "",
          tiet: "",
        };
        weeksList.forEach((_, idx) => {
          rowData[`tuan_${idx + 1}`] = "";
        });
        flattenedData.push(rowData);
      } else {
        sessions.forEach((sessionSchedules, sIdx) => {
          const firstSch = sessionSchedules[0];
          const tiet =
            firstSch.shift && firstSch.startPeriod && firstSch.endPeriod
              ? `${firstSch.shift}${firstSch.startPeriod}-${firstSch.endPeriod}`
              : "";
          const thu = convertEnumDayOfWeekToString(firstSch.dayOfWeek) || "";

          const rowData: any = {
            id: `${mon.id}_session_${sIdx}_${Date.now()}`,
            classSubjectId: mon.id,
            isSubRow: sIdx > 0,
            stt: sIdx === 0 ? globalIndex++ : undefined,
            tenMonHoc: mon.subject?.subjectName || "",
            giaoVienGiangDay: mon.teacherId || "",
            phongHoc: firstSch.roomId || "",
            tongGioMonHoc,
            thu,
            tiet,
          };

          weeksList.forEach((_, idx) => {
            const scheduleForWeek = sessionSchedules.find(
              (sch) => sch.weekNumber === idx + 1,
            );
            rowData[`tuan_${idx + 1}`] = scheduleForWeek
              ? scheduleForWeek.countPeriod
              : "";
          });

          flattenedData.push(rowData);
        });
      }
    });

    setData(flattenedData);
  }, [classSubjects, weeksList, studySchedule]);

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

  const addSessionRow = (rowIndex: number) => {
    setData((old) => {
      const targetRow = old[rowIndex];
      const newRow: any = {
        id: `${targetRow.classSubjectId}_add_${Date.now()}`,
        classSubjectId: targetRow.classSubjectId,
        isSubRow: true,
        stt: undefined,
        tenMonHoc: targetRow.tenMonHoc,
        giaoVienGiangDay: targetRow.giaoVienGiangDay,
        phongHoc: "",
        tongGioMonHoc: targetRow.tongGioMonHoc,
        thu: "",
        tiet: "",
      };
      weeksList.forEach((_, idx) => {
        newRow[`tuan_${idx + 1}`] = "";
      });

      const updated = [...old];
      updated.splice(rowIndex + 1, 0, newRow);
      return updated;
    });
  };

  const removeSessionRow = (rowIndex: number) => {
    setData((old) => old.filter((_, index) => index !== rowIndex));
  };

  // TUYỆT ĐỐI KHÔNG TRUYỀN `data` VÀO ĐÂY -> Cột không bị re-create giúp Tab hoạt động mượt mà
  const columns = useMemo(() => {
    return getTienDoDaoTaoColumns({
      teachers: teachers || [],
      isLoadingTeachers,
      assignTeacher,
      updateCellData,
      weeksList,
      addSessionRow,
      removeSessionRow,
    });
  }, [teachers, isLoadingTeachers, weeksList]);

  // Đưa logic tính toán vào `meta` để các ô đọc giá trị realtime mà không phá vỡ cấu trúc DOM cột
  const table = useReactTable({
    data: data,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      calculateRowTotal: (row: any) => calculateRowTotal(row, weeksList.length),
      calculateSubjectTotal: (id: number) =>
        calculateSubjectTotal(data, id, weeksList.length),
    },
  });

  const handleSubmit = () => {
    const groupedBySubject: Record<number, any[]> = {};
    data.forEach((row) => {
      if (!groupedBySubject[row.classSubjectId]) {
        groupedBySubject[row.classSubjectId] = [];
      }
      groupedBySubject[row.classSubjectId].push(row);
    });

    // for (const subjectId in groupedBySubject) {
    //   const rows = groupedBySubject[subjectId];
    //   const targetSubjectName = rows[0]?.tenMonHoc || "Môn học";
    //   const expectedTotalHours = rows[0]?.tongGioMonHoc || 0;

    //   let actualTotalHours = 0;
    //   rows.forEach((row) => {
    //     weeksList.forEach((_, idx) => {
    //       const cellValue = row[`tuan_${idx + 1}`];
    //       if (cellValue && !isNaN(Number(cellValue))) {
    //         actualTotalHours += Number(cellValue);
    //       }
    //     });
    //   });

    //   if (actualTotalHours !== expectedTotalHours) {
    //     alert(
    //       `Lỗi phân bổ số tiết môn [${targetSubjectName}]:\nTổng số tiết gán qua các tuần hiện tại là ${actualTotalHours} tiết, nhưng tổng số tiết quy định bắt buộc phải bằng ${expectedTotalHours} tiết.\nVui lòng chỉnh sửa lại chính xác trước khi lưu!`,
    //     );
    //     return;
    //   }
    // }

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
            classSubjectId: row.classSubjectId,
            dayOfWeek: thu as DayOfWeek,
            shift: shift,
            roomId: row.phongHoc || null,
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

    createStudySchedule(
      { body: dataSubmit },
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

  const hasSelectedFilters = semesterId && classId;

  return (
    <PageShell
      title="Tiến độ đào tạo"
      sub="Quản lý tiến độ giảng dạy theo tuần của từng môn học"
      icon={GridIcon}
    >
      <div className="space-y-6 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
        {/* Phần select học kỳ và lớp học */}
        <div className="flex gap-4">
          <div className="w-1/2">
            <SelectOption
              label="Học kỳ"
              value={semesterId ?? ""}
              onChange={(e) => {
                const value = e.target.value;
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

        {/* Phần hiển thị logic dưới bộ lọc */}
        {isLoadingStudySchedule || isLoadingClassSubjects ? (
          <div className="py-12">
            <SpinnerLoading />
          </div>
        ) : !hasSelectedFilters ? (
          /* UI Hướng dẫn khi chưa chọn đủ filter (Empty State) */
          <div className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50 text-center animate-fade-in">
            <div className="p-4 bg-blue-50 text-blue-600 rounded-full mb-4">
              <CalendarDays className="h-8 w-8" />
            </div>
            <h3 className="text-base font-semibold text-gray-800 mb-1">
              Bắt đầu tạo tiến độ đào tạo
            </h3>
            <p className="text-sm text-gray-500 max-w-sm mb-4 leading-relaxed">
              Vui lòng chọn **Học kỳ** và **Lớp học** ở phía trên để hệ thống
              hiển thị danh sách môn học và cấu trúc tiến độ.
            </p>
            <div className="flex items-center gap-2 text-xs font-medium text-blue-600 bg-blue-50/80 px-3 py-1.5 rounded-full">
              <span>Chọn bộ lọc</span>
              <ArrowRight className="h-3 w-3" />
              <span>Thiết lập tiến độ</span>
            </div>
          </div>
        ) : (
          /* Khi đã chọn đủ filter: Hiện bảng và nút Lưu */
          <div className="space-y-4 animate-fade-in">
            <StickyTanStackTable table={table} stickyColumnCount={3} />

            <div className="flex justify-end pt-2">
              <ButtonAction
                variant="outline"
                loading={isCreatingStudySchedule}
                label="Lưu tiến độ đào tạo"
                onClick={handleSubmit}
              />

              <ButtonAction
                variant="export"
                label="Xuất bảng điểm học kỳ"
                icon={<FileText className="h-4 w-4" />}
                loading={isExportingStudySchedule}
                onClick={() => {
                  return exportStudyScheduleToExcel(
                    {
                      parseAs: "blob",
                      params: {
                        query: {
                          semesterId: semesterId!,
                          classId: classId!,
                        },
                      },
                    },
                    {
                      onSuccess: (blob) => {
                        downloadFromBlob(
                          blob as never,
                          `Tien_Do_Dao_Tao_${classSelected?.className}_${semesterSelected?.name}`,
                          ".xlsx",
                        );
                      },
                    },
                  );
                }}
              />
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
};

export default TableTienDoDaoTao;
