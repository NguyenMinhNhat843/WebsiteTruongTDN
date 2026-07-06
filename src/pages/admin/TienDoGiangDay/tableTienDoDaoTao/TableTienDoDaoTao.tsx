import { useSearchParams } from "react-router-dom";
import { useAppContext } from "../../../../AppProvider";
import { useTienDoDaoTaoContext } from "../TienDoDaoTaoProvider";
import { useEffect, useMemo, useState } from "react";
import { getWeeksInRange } from "./helpers";
import { formatDateToString } from "../../../../util/formatDate";
import type { components } from "../../../../api/v1";
import { $api } from "../../../../api/client";
import { toast } from "sonner";
import ButtonAction from "../../../../components/ui/ButtonAction";
import { FileText, SlidersHorizontal } from "lucide-react";
import { downloadFromBlob } from "../../../../util/download";

interface DataRow {
  monHocId: number;
  tenMonHoc: string;
  giaoVienGiangDay: string;
  giaoVienGiangDayId: number;
  tinChi: number;
  tongSoTiet: number;
  sessions: {
    maPhongHoc: string;
    idPhongHoc: number;
    thu: string;
    tiet: string;
    [week: string]: any;
  }[];
}

export type UpsertPlanTrainingDto =
  components["schemas"]["UpsertTrainingPlanDto"];

const TableTienDoDaoTao = () => {
  const { trainingPlan, isLoadingTrainingPlan, classes, semesterId, teachers } =
    useTienDoDaoTaoContext();
  const { hocKysOptions, hocKysData } = useAppContext();

  // Lấy danh sách phòng học
  const { data: rooms, isLoading: isLoadingRooms } = $api.useQuery(
    "get",
    "/rooms",
  );

  const teachersOption = teachers?.map((teacher) => ({
    value: teacher.id,
    label: teacher.fullName,
  }));

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

  // 3. Chỉ đồng bộ dữ liệu vào State khi trainingPlan hoặc tuần học kì thay đổi (Chặn ghi đè dữ liệu Client nhập)
  useEffect(() => {
    if (tableData && tableData.length > 0 && table.length === 0) {
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
  const handleChangeTeacher = (itemIndex: number, teacherId: string) => {
    const selectedId = teacherId ? Number(teacherId) : 0;
    const selectedTeacher = teachers?.find((t) => t.id === selectedId);

    setTable((prevTable) =>
      prevTable.map((item, iIdx) => {
        if (iIdx !== itemIndex) return item;
        return {
          ...item,
          giaoVienGiangDayId: selectedId,
          giaoVienGiangDay: selectedTeacher?.fullName || "",
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
        },
        onError: () => {
          toast.error("Có lỗi xảy ra khi lưu kế hoạch đào tạo!");
        },
      },
    );
  };

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-sm">
      {/* Header Đơn giản phía trên bộ lọc */}
      <div className="flex items-center gap-2.5 pb-1 border-b border-slate-100">
        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
          <SlidersHorizontal className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-800 tracking-tight">
            Bộ lọc tiến độ đào tạo
          </h2>
          <p className="text-xs text-slate-400">
            Chọn lớp và học kỳ để cấu hình dữ liệu chi tiết
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8 p-5 bg-white rounded-xl border border-slate-100 shadow-sm">
        {/* Dropdown Lớp học */}
        <div className="flex flex-col gap-2 relative">
          <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
            <svg
              className="w-4 h-4 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            Lớp học
          </label>
          <div className="relative">
            <select
              value={classIdParam}
              onChange={(e) => {
                const value = e.target.value;
                setSearchParams((prev) => {
                  if (value) prev.set("classId", value);
                  else prev.delete("classId");
                  return prev;
                });
              }}
              className="w-full appearance-none bg-slate-50/50 hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-800 rounded-lg pl-3 pr-10 py-2.5 text-sm font-medium transition-all duration-200 outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 cursor-pointer"
            >
              <option value="" className="text-slate-400">
                -- Chọn lớp học --
              </option>
              {classOptions?.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  className="text-slate-800"
                >
                  {option.label}
                </option>
              ))}
            </select>
            {/* Icon mũi tên tùy chỉnh */}
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
              <svg
                className="w-4 h-4 transition-transform duration-200"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Dropdown Học kỳ */}
        <div className="flex flex-col gap-2 relative">
          <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
            <svg
              className="w-4 h-4 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Học kỳ
          </label>
          <div className="relative">
            <select
              value={semesterIdParam}
              onChange={(e) => {
                const value = e.target.value;
                setSearchParams((prev) => {
                  if (value) prev.set("semesterId", value);
                  else prev.delete("semesterId");
                  return prev;
                });
              }}
              className="w-full appearance-none bg-slate-50/50 hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-800 rounded-lg pl-3 pr-10 py-2.5 text-sm font-medium transition-all duration-200 outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 cursor-pointer"
            >
              <option value="" className="text-slate-400">
                -- Chọn học kỳ --
              </option>
              {semesterOptions?.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  className="text-slate-800"
                >
                  {option.label}
                </option>
              ))}
            </select>
            {/* Icon mũi tên tùy chỉnh */}
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
              <svg
                className="w-4 h-4 transition-transform duration-200"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div>
        {isLoadingTrainingPlan ? (
          <div className="flex justify-center items-center py-8 w-full">
            <div className="flex items-center gap-3 text-slate-500 font-medium text-sm bg-slate-50 px-4 py-2 rounded-full border border-slate-100 shadow-sm">
              <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <span>Đang tải tiến độ đào tạo...</span>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-md bg-white custom-scrollbar">
            <table className="min-w-full divide-y divide-slate-200 text-sm text-left border-collapse">
              <thead className="bg-slate-50 text-slate-700 font-semibold text-xs tracking-wider sticky top-0 z-10 shadow-[inset_0_-1px_0_rgba(226,232,240,1)]">
                <tr>
                  <th className="px-4 py-3.5 text-center w-14 border border-slate-200 text-slate-800 bg-slate-50">
                    STT
                  </th>
                  <th className="px-6 min-w-60 py-3.5 border border-slate-200 text-slate-800 bg-slate-50">
                    Tên môn học
                  </th>
                  <th className="px-6 min-w-60 py-3.5 border border-slate-200 text-slate-800 bg-slate-50">
                    Giáo viên giảng dạy
                  </th>
                  <th className="px-4 py-3.5 text-center border border-slate-200 text-slate-800 bg-slate-50">
                    Tổng số tiết
                  </th>
                  <th className="px-6 py-3.5 text-center border border-slate-200 text-slate-800 bg-slate-50">
                    Thao tác
                  </th>
                  <th className="px-6 min-w-32 py-3.5 border border-slate-200 text-slate-800 bg-slate-50">
                    Phòng
                  </th>
                  <th className="px-6 py-3.5 border border-slate-200 text-slate-800 bg-slate-50">
                    Thứ
                  </th>
                  <th className="px-6 py-3.5 border border-slate-200 text-slate-800 bg-slate-50">
                    Tiết
                  </th>

                  {weekList.map((week) => (
                    <th
                      key={week.weekNumber}
                      className="px-4 py-2.5 text-center border border-slate-200 min-w-[85px] bg-slate-50/70 align-middle"
                    >
                      <span className="text-slate-700 font-bold block">
                        Tuần {week.weekNumber}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                        {formatDateToString(week.start).slice(0, 5)}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200 text-slate-600">
                {table?.map((item, itemIndex) => {
                  const totalSessions = item.sessions.length;

                  return item.sessions.map((session, sessionIndex) => {
                    const isFirstRow = sessionIndex === 0;
                    return (
                      <tr
                        key={`${item.monHocId}-${sessionIndex}`}
                        className="hover:bg-slate-50/60 transition-colors duration-150"
                      >
                        {isFirstRow && (
                          <>
                            <td
                              rowSpan={totalSessions}
                              className="px-4 py-4 text-center font-semibold text-slate-800 border border-slate-200 bg-slate-50/30 align-middle"
                            >
                              {itemIndex + 1}
                            </td>

                            {/* Tên môn học */}
                            <td
                              rowSpan={totalSessions}
                              className="px-6 py-4 font-semibold text-slate-900 border border-slate-200 align-middle max-w-xs leading-relaxed"
                            >
                              {item.tenMonHoc || "---"}
                            </td>

                            {/* Giáo viên giảng dạy */}
                            <td
                              rowSpan={totalSessions}
                              className="px-6 py-4 whitespace-nowrap border border-slate-200 align-middle bg-white"
                            >
                              <div className="relative">
                                <select
                                  className="block w-full rounded-lg border border-slate-200 text-slate-800 bg-slate-50/50 hover:bg-slate-50 py-2 px-3 text-sm font-medium transition-all outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 cursor-pointer appearance-none pr-8"
                                  value={item.giaoVienGiangDayId || ""}
                                  onChange={(e) =>
                                    handleChangeTeacher(
                                      itemIndex,
                                      e.target.value,
                                    )
                                  }
                                >
                                  <option
                                    value=""
                                    disabled
                                    className="text-slate-400 italic"
                                  >
                                    -- Chưa phân công --
                                  </option>
                                  {teachersOption?.map((option) => (
                                    <option
                                      key={option.value}
                                      value={option.value}
                                    >
                                      {option.label}
                                    </option>
                                  ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none text-slate-400">
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M19 9l-7 7-7-7"
                                    />
                                  </svg>
                                </div>
                              </div>
                            </td>

                            {/* Tổng số tiết */}
                            <td
                              rowSpan={totalSessions}
                              className="px-4 py-4 text-center font-bold text-indigo-600 border border-slate-200 align-middle bg-indigo-50/20 text-base"
                            >
                              {item.tongSoTiet}
                            </td>
                          </>
                        )}

                        {/* Thao tác thêm buổi */}
                        <td className="px-4 py-3 text-center border border-slate-200 whitespace-nowrap align-middle">
                          <div className="flex flex-col gap-1 items-center justify-center min-w-[90px]">
                            {isFirstRow ? (
                              <button
                                onClick={() =>
                                  handleAddClassSubjectSession(itemIndex)
                                }
                                className="text-indigo-600 hover:text-indigo-700 font-semibold text-xs bg-indigo-50 hover:bg-indigo-100/80 px-2.5 py-1.5 rounded-lg border border-indigo-200 hover:border-indigo-300 transition-all shadow-sm w-full"
                              >
                                + Thêm buổi
                              </button>
                            ) : (
                              <button
                                className="text-red-600 hover:text-red-700 font-semibold text-xs bg-red-50 hover:bg-red-100/80 px-2.5 py-1.5 rounded-lg border border-red-200 hover:border-red-300 transition-all shadow-sm w-full"
                                onClick={() =>
                                  handleRemoveClassSubjectSession(
                                    itemIndex,
                                    sessionIndex,
                                  )
                                }
                              >
                                Xóa buổi
                              </button>
                            )}
                          </div>
                        </td>

                        {/* Phòng học */}
                        <td className="px-4 py-3 border border-slate-200 align-middle">
                          <div className="relative">
                            <select
                              disabled={isLoadingRooms}
                              value={session.idPhongHoc || ""}
                              onChange={(e) =>
                                handleChangeRoom(
                                  itemIndex,
                                  sessionIndex,
                                  e.target.value,
                                )
                              }
                              className="w-32 rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm bg-white hover:bg-slate-50 font-medium text-slate-800 focus:border-indigo-500 focus:outline-none transition-all disabled:bg-slate-100 disabled:text-slate-400 appearance-none pr-7 cursor-pointer"
                            >
                              <option value="" disabled>
                                {isLoadingRooms
                                  ? "Đang tải..."
                                  : "Chọn phòng..."}
                              </option>

                              {rooms?.map((room) => (
                                <option key={room.id} value={room.id}>
                                  {room.roomCode}{" "}
                                  {room.building ? `(${room.building})` : ""}
                                </option>
                              ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none text-slate-400">
                              <svg
                                className="w-3.5 h-3.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            </div>
                          </div>
                        </td>

                        {/* Thứ */}
                        <td className="px-4 py-3 border border-slate-200 align-middle">
                          <div className="relative">
                            <select
                              value={session.thu}
                              onChange={(e) =>
                                handleChangeSessionField(
                                  itemIndex,
                                  sessionIndex,
                                  "thu",
                                  e.target.value,
                                )
                              }
                              className="w-28 rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm bg-white hover:bg-slate-50 font-medium text-slate-800 focus:border-indigo-500 focus:outline-none transition-all appearance-none pr-7 cursor-pointer"
                            >
                              <option value="">Chọn thứ</option>
                              {[
                                "MONDAY",
                                "TUESDAY",
                                "WEDNESDAY",
                                "THURSDAY",
                                "FRIDAY",
                                "SATURDAY",
                                "SUNDAY",
                              ].map((day) => {
                                const d = day as keyof typeof daysMap;

                                const daysMap = {
                                  MONDAY: "Thứ 2",
                                  TUESDAY: "Thứ 3",
                                  WEDNESDAY: "Thứ 4",
                                  THURSDAY: "Thứ 5",
                                  FRIDAY: "Thứ 6",
                                  SATURDAY: "Thứ 7",
                                  SUNDAY: "Chủ nhật",
                                };

                                return (
                                  <option key={d} value={d}>
                                    {daysMap[d]}
                                  </option>
                                );
                              })}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none text-slate-400">
                              <svg
                                className="w-3.5 h-3.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            </div>
                          </div>
                        </td>

                        {/* Tiết */}
                        <td className="px-4 py-3 border border-slate-200 align-middle">
                          <input
                            type="text"
                            placeholder="VD: S1-3"
                            value={session.tiet}
                            onChange={(e) =>
                              handleChangeSessionField(
                                itemIndex,
                                sessionIndex,
                                "tiet",
                                e.target.value,
                              )
                            }
                            className="w-20 rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm font-medium text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none transition-all"
                          />
                        </td>

                        {/* Render Checkbox Tuần */}
                        {weekList.map((week) => {
                          const hasSchedule =
                            !!session[`week_${week.weekNumber}`];
                          return (
                            <td
                              key={week.weekNumber}
                              className={`px-2 py-3 text-center border border-slate-200 transition-colors duration-150 align-middle ${
                                hasSchedule ? "bg-emerald-50/50" : "bg-white"
                              }`}
                            >
                              <div className="flex items-center justify-center">
                                <input
                                  type="checkbox"
                                  checked={hasSchedule}
                                  onChange={() =>
                                    handleToggleWeek(
                                      itemIndex,
                                      sessionIndex,
                                      week.weekNumber,
                                    )
                                  }
                                  className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500/20 cursor-pointer accent-emerald-600 transition-all"
                                />
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  });
                })}
              </tbody>
            </table>
          </div>
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
