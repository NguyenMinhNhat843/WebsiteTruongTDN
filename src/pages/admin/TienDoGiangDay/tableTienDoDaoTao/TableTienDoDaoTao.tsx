import { useSearchParams } from "react-router-dom";
import { useTienDoDaoTaoContext } from "../TienDoDaoTaoProvider";
import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getWeeksInRange } from "./helpers";
import type { components } from "../../../../api/v1";
import { $api } from "../../../../api/client";
import { toast } from "sonner";
import ButtonAction from "../../../../components/ui/ButtonAction";
import { FileText } from "lucide-react";
import { downloadFromBlob } from "../../../../util/download";
import { Filters } from "./Filters";
import { TableContent } from "./TableContent";
import { type DataRow } from "./types";

export type UpsertPlanTrainingDto =
  components["schemas"]["UpsertTrainingPlanDto"];

const TableTienDoDaoTao = () => {
  const queryClient = useQueryClient();
  const {
    trainingPlan,
    isLoadingTrainingPlan,
    classes,
    semesterId,
    semesters: hocKysData,
  } = useTienDoDaoTaoContext();

  const hocKysOptions = hocKysData?.map((hk) => ({
    value: hk.id,
    label: hk.name,
  }));

  // Lấy danh sách phòng học
  const { data: rooms, isLoading: isLoadingRooms } = $api.useQuery(
    "get",
    "/rooms",
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const classIdParam = searchParams.get("classId") || "";
  const semesterIdParam = searchParams.get("semesterId") || "";

  const hocKysSelected = hocKysData?.find((hk) => hk.id === semesterId);
  const startDateSemester = hocKysSelected?.startDate;
  const endDateSemester = hocKysSelected?.endDate;

  // 1. Tối ưu weekList bằng useMemo để tránh re-render liên tục gây lặp vô hạn
  const weekList = useMemo(() => {
    return getWeeksInRange(
      startDateSemester ? new Date(startDateSemester) : new Date(),
      endDateSemester ? new Date(endDateSemester) : new Date(),
    );
  }, [startDateSemester, endDateSemester]);

  // Api xuất file excel
  const { mutate: exportExcelData, isPending: isLoadingExportExcel } =
    $api.useMutation(
      "get",
      "/class-subject-session/training-plan/export-excel",
    );

  // 2. Định nghĩa cấu trúc tableData chuẩn: Nếu classSubjectSessions trống, tự động nạp sẵn 1 phần tử rỗng
  const tableData: DataRow[] = useMemo(() => {
    if (!trainingPlan) return [];
    return trainingPlan.map((row) => {
      const tongSoTiet =
        (row.subject.testHours || 0) +
        row.subject.theoryHours +
        row.subject.practiceHours;

      const createEmptySession = () => {
        const emptyObj: any = {
          maPhongHoc: "",
          idPhongHoc: 0,
          thu: "",
          tiet: "",
        };
        weekList.forEach((week) => {
          emptyObj[`week_${week.weekNumber}`] = false;
        });
        return emptyObj;
      };

      const mappedSessions =
        !row.classSubjectSessions || row.classSubjectSessions.length === 0
          ? [createEmptySession()]
          : row.classSubjectSessions.map((session) => {
            const sessionObj: any = {
              maPhongHoc: session.room?.roomCode || "",
              idPhongHoc: session.room?.id || 0,
              thu: session.dayOfWeek || "",
              tiet:
                session.startPeriod && session.endPeriod
                  ? `${session.shift || ""}${session.startPeriod}-${session.endPeriod}`
                  : "",
            };

            weekList.forEach((week) => {
              const hasSchedule = session?.schedules?.some(
                (schedule) => schedule.weekNumber === week.weekNumber,
              );
              sessionObj[`week_${week.weekNumber}`] = !!hasSchedule;
            });

            return sessionObj;
          });

      return {
        monHocId: row.subject.id,
        tenMonHoc: row.subject.subjectName,
        giaoVienGiangDay: row.teacher?.fullName || "",
        giaoVienGiangDayId: row.teacher?.id || 0,
        tinChi: row.subject.credits,
        tongSoTiet,
        sessions: mappedSessions,
      };
    });
  }, [trainingPlan, weekList, semesterId]);

  const [table, setTable] = useState<DataRow[]>([]);

  // Reset table state khi đổi lớp hoặc học kỳ
  useEffect(() => {
    setTable([]);
  }, [classIdParam, semesterIdParam]);

  // 3. Đồng bộ dữ liệu vào State khi tableData thay đổi
  useEffect(() => {
    if (tableData && tableData.length > 0) {
      setTable(tableData);
    }
  }, [tableData]);

  const classOptions = classes?.map((cls) => ({
    value: cls.id,
    label: `${cls.className} - ${cls.classCode}`,
  }));

  const semesterOptions = hocKysOptions?.map((hk) => ({
    value: hk.value,
    label: hk.label,
  }));

  // Hàm thêm 1 buổi học
  const handleAddClassSubjectSession = (itemIndex: number) => {
    setTable((prevTable) => {
      const updatedTable = [...prevTable];
      if (updatedTable[itemIndex]) {
        const newSession: any = {
          maPhongHoc: "",
          idPhongHoc: 0,
          thu: "",
          tiet: "",
        };
        weekList.forEach((week) => {
          newSession[`week_${week.weekNumber}`] = false;
        });
        updatedTable[itemIndex] = {
          ...updatedTable[itemIndex],
          sessions: [...updatedTable[itemIndex].sessions, newSession],
        };
      }
      return updatedTable;
    });
  };

  // Hàm xóa buổi học
  const handleRemoveClassSubjectSession = (
    itemIndex: number,
    sessionIndex: number,
  ) => {
    setTable((prevTable) =>
      prevTable.map((item, iIdx) => {
        if (iIdx !== itemIndex) return item;

        if (item.sessions.length === 1) {
          const resetSession: any = {
            maPhongHoc: "",
            idPhongHoc: 0,
            thu: "",
            tiet: "",
          };
          weekList.forEach((week) => {
            resetSession[`week_${week.weekNumber}`] = false;
          });
          return { ...item, sessions: [resetSession] };
        }

        return {
          ...item,
          sessions: item.sessions.filter((_, sIdx) => sIdx !== sessionIndex),
        };
      }),
    );
  };

  // 4. Hàm xử lý đảo trạng thái Checkbox tuần học
  const handleToggleWeek = (
    itemIndex: number,
    sessionIndex: number,
    weekNumber: number,
  ) => {
    const key = `week_${weekNumber}`;
    setTable((prevTable) =>
      prevTable.map((item, iIdx) => {
        if (iIdx !== itemIndex) return item;
        return {
          ...item,
          sessions: item.sessions.map((session, sIdx) => {
            if (sIdx !== sessionIndex) return session;
            return { ...session, [key]: !session[key] };
          }),
        };
      }),
    );
  };

  // Hàm xử lý khi chọn giáo viên giảng dạy cho 1 môn học
  const handleChangeTeacher = (itemIndex: number, teacherId: string, teacherName: string) => {
    const selectedId = teacherId ? Number(teacherId) : 0;

    setTable((prevTable) =>
      prevTable.map((item, iIdx) => {
        if (iIdx !== itemIndex) return item;
        return {
          ...item,
          giaoVienGiangDayId: selectedId,
          giaoVienGiangDay: teacherName || "",
        };
      }),
    );
  };

  // Hàm xử lý khi chọn phòng học: option hiển thị mã phòng nhưng value là id phòng
  const handleChangeRoom = (
    itemIndex: number,
    sessionIndex: number,
    roomIdValue: string,
  ) => {
    const selectedRoom = rooms?.find((r) => String(r.id) === roomIdValue);

    setTable((prevTable) =>
      prevTable.map((item, iIdx) => {
        if (iIdx !== itemIndex) return item;
        return {
          ...item,
          sessions: item.sessions.map((session, sIdx) => {
            if (sIdx !== sessionIndex) return session;
            return {
              ...session,
              idPhongHoc: selectedRoom?.id || 0,
              maPhongHoc: selectedRoom?.roomCode || "",
            };
          }),
        };
      }),
    );
  };

  const handleChangeSessionField = (
    itemIndex: number,
    sessionIndex: number,
    field: "maPhongHoc" | "thu" | "tiet" | "idPhongHoc",
    value: string,
  ) => {
    setTable((prevTable) =>
      prevTable.map((item, iIdx) => {
        if (iIdx !== itemIndex) return item;
        return {
          ...item,
          sessions: item.sessions.map((session, sIdx) => {
            if (sIdx !== sessionIndex) return session;
            return { ...session, [field]: value };
          }),
        };
      }),
    );
  };

  const { mutate: upsertPlanTraining, isPending: isPendingUpsertPlanTraining } =
    $api.useMutation("post", "/class-subject-session/upsert-plan-training");

  // "S1-3" -> { shift: "S", startPeriod: 1, endPeriod: 3 }
  function parseTiet(tiet: string): {
    shift: string;
    startPeriod: number;
    endPeriod: number;
  } {
    const match = tiet.match(/^([A-Za-z]*)(\d+)-(\d+)$/);
    if (!match) return { shift: "", startPeriod: 0, endPeriod: 0 };
    const [, shift, start, end] = match;
    return { shift, startPeriod: Number(start), endPeriod: Number(end) };
  }

  const DAY_OFFSET: Record<string, number> = {
    MONDAY: 0,
    TUESDAY: 1,
    WEDNESDAY: 2,
    THURSDAY: 3,
    FRIDAY: 4,
    SATURDAY: 5,
    SUNDAY: 6,
  };

  // ⚠️ Giả định week.start (trả về từ getWeeksInRange) là ngày Thứ 2 của tuần đó.
  function getStudyDate(weekStart: Date | string, dayOfWeek: string): string {
    const offset = DAY_OFFSET[dayOfWeek] ?? 0;

    // Nếu weekStart là string (hoặc Date), new Date() đều sẽ xử lý mượt mà
    const date = new Date(weekStart);

    date.setDate(date.getDate() + offset);
    return date.toISOString();
  }

  const handleSubmit = () => {
    if (!classIdParam || !semesterIdParam) {
      alert("Vui lòng chọn lớp học và học kỳ trước khi lưu.");
      return;
    }

    // Kiểm tra xem có buổi học nào được tích tuần nhưng thiếu Thứ hoặc Tiết không
    for (const item of table) {
      for (const session of item.sessions) {
        const hasTickedWeek = weekList.some((week) => !!session[`week_${week.weekNumber}`]);
        if (hasTickedWeek && (!session.thu || !session.tiet)) {
          toast.error(
            `Môn học "${item.tenMonHoc}" đã được tích tuần học nhưng chưa chọn Thứ hoặc Tiết. Vui lòng cấu hình đầy đủ Thứ và Tiết trước khi lưu.`
          );
          return;
        }
      }
    }

    const items: UpsertPlanTrainingDto["items"] = table.map((item) => {
      const sessions = item.sessions
        // Bỏ qua các buổi chưa cấu hình đầy đủ Thứ/Tiết
        .filter((session) => session.thu && session.tiet)
        .map((session) => {
          const { shift, startPeriod, endPeriod } = parseTiet(session.tiet);

          const schedules = weekList
            .filter((week) => !!session[`week_${week.weekNumber}`])
            .map((week) => ({
              roomId: (session.idPhongHoc || null) as any,
              studyDate: getStudyDate(week.start, session.thu),
              weekNumber: week.weekNumber,
            }));

          return {
            roomId: (session.idPhongHoc || null) as any,
            countPeriod: (endPeriod - startPeriod + 1) as any,
            dayOfWeek:
              session.thu as UpsertPlanTrainingDto["items"][number]["sessions"][number]["dayOfWeek"],
            endPeriod,
            shift,
            startPeriod,
            schedules,
          };
        });

      return {
        subjectId: item.monHocId,
        teacherId: (item.giaoVienGiangDayId || null) as any,
        sessions,
      };
    }) as UpsertPlanTrainingDto["items"];

    const payload: UpsertPlanTrainingDto = {
      classId: Number(classIdParam),
      semesterId: Number(semesterIdParam),
      items,
    };

    upsertPlanTraining(
      {
        body: payload,
      },
      {
        onSuccess: () => {
          toast.success("Lưu kế hoạch đào tạo thành công!");
          queryClient.invalidateQueries({
            queryKey: ["get", "/class-subject-session/plan-training"],
          });
        },
        onError: () => {
          toast.error("Có lỗi xảy ra khi lưu kế hoạch đào tạo!");
        },
      },
    );
  };

  const handleClassChange = (value: string) => {
    setSearchParams((prev) => {
      if (value) prev.set("classId", value);
      else prev.delete("classId");
      return prev;
    });
  };

  const handleSemesterChange = (value: string) => {
    setSearchParams((prev) => {
      if (value) prev.set("semesterId", value);
      else prev.delete("semesterId");
      return prev;
    });
  };

  return (
    <div>
      <Filters
        classIdParam={classIdParam}
        semesterIdParam={semesterIdParam}
        classOptions={classOptions}
        semesterOptions={semesterOptions}
        onClassChange={handleClassChange}
        onSemesterChange={handleSemesterChange}
      />

      <div className="w-full p-4 bg-white rounded-lg shadow-sm">
        {isLoadingTrainingPlan ? (
          <div className="flex justify-center items-center py-8 w-full">
            <div className="flex items-center gap-3 text-slate-500 font-medium text-sm bg-slate-50 px-4 py-2 rounded-full border border-slate-100 shadow-sm">
              <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <span>Đang tải tiến độ đào tạo...</span>
            </div>
          </div>
        ) : (
          <TableContent
            table={table}
            weekList={weekList}
            rooms={rooms}
            isLoadingRooms={isLoadingRooms}
            handleAddClassSubjectSession={handleAddClassSubjectSession}
            handleRemoveClassSubjectSession={handleRemoveClassSubjectSession}
            handleChangeRoom={handleChangeRoom}
            handleChangeTeacher={handleChangeTeacher}
            handleChangeSessionField={handleChangeSessionField}
            handleToggleWeek={handleToggleWeek}
          />
        )}

        <div className="flex justify-end mt-4">
          <ButtonAction
            variant="export"
            label="Xuất bảng điểm học kỳ"
            icon={<FileText className="h-4 w-4" />}
            loading={isLoadingExportExcel}
            onClick={() => {
              return exportExcelData(
                {
                  parseAs: "blob",
                  params: {
                    query: {
                      classId: Number(classIdParam),
                      semesterId: Number(semesterIdParam),
                    },
                  },
                },
                {
                  onSuccess: (blob) => {
                    downloadFromBlob(
                      blob as never,
                      `TienDoDaoTao_Lop${classIdParam}_HocKy${semesterIdParam}`,
                      ".xlsx",
                    );
                  },
                },
              );
            }}
          />

          <button
            onClick={handleSubmit}
            disabled={isPendingUpsertPlanTraining}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2 rounded-xl ms-2 shadow-sm flex items-center gap-2"
          >
            {isPendingUpsertPlanTraining && (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {isPendingUpsertPlanTraining
              ? "Đang lưu..."
              : "Lưu tiến độ đào tạo"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TableTienDoDaoTao;
