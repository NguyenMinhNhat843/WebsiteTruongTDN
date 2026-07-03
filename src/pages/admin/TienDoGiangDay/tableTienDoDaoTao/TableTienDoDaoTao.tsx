import { useSearchParams } from "react-router-dom";
import { useAppContext } from "../../../../AppProvider";
import { useTienDoDaoTaoContext } from "../TienDoDaoTaoProvider";
import { useEffect, useMemo, useState } from "react";
import { getWeeksInRange } from "./helpers";
import { formatDateToString } from "../../../../util/formatDate";

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

const TableTienDoDaoTao = () => {
  const { trainingPlan, isLoadingTrainingPlan, classes, semesterId, teachers } =
    useTienDoDaoTaoContext();
  const { hocKysOptions, hocKysData } = useAppContext();

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

  const handleChangeSessionField = (
    itemIndex: number,
    sessionIndex: number,
    field: "maPhongHoc" | "thu" | "tiet",
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

  const handleSubmit = () => {
    console.log("Table state:", table);
  };

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Lớp học</label>
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm"
          >
            <option value="">-- Chọn lớp học --</option>
            {classOptions?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Học kỳ</label>
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm"
          >
            <option value="">-- Chọn học kỳ --</option>
            {semesterOptions?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        {isLoadingTrainingPlan ? (
          <div className="flex items-center gap-2 text-gray-500">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span>Đang tải tiến độ đào tạo...</span>
          </div>
        ) : (
          <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm custom-scrollbar">
            <table className="min-w-full divide-y divide-gray-200 text-sm text-left border-collapse border border-gray-200">
              <thead className="bg-gray-50 text-gray-700 font-medium uppercase text-xs tracking-wider sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-center w-12 border border-gray-200">
                    STT
                  </th>
                  <th className="px-6 min-w-60 py-3 border border-gray-200">
                    Tên môn học
                  </th>
                  <th className="px-6 min-w-60 py-3 border border-gray-200">
                    Giáo viên giảng dạy
                  </th>
                  <th className="px-4 py-3 text-center border border-gray-200">
                    Tín chỉ
                  </th>
                  <th className="px-4 py-3 text-center border border-gray-200">
                    Tổng số tiết
                  </th>
                  <th className="px-6 min-w-32 py-3 border border-gray-200">
                    Phòng
                  </th>
                  <th className="px-6 py-3 border border-gray-200">Thứ</th>
                  <th className="px-6 py-3 border border-gray-200">Tiết</th>
                  <th className="px-6 py-3 text-center border border-gray-200">
                    Thao tác
                  </th>
                  {weekList.map((week) => (
                    <th
                      key={week.weekNumber}
                      className="px-4 py-3 text-center border border-gray-200 min-w-[80px]"
                    >
                      Tuần {week.weekNumber} <br />
                      <span className="text-[10px] text-gray-400 font-normal">
                        {formatDateToString(week.start).slice(0, 5)}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 text-gray-600">
                {table?.map((item, itemIndex) => {
                  const totalSessions = item.sessions.length;

                  // 5. Sử dụng trực tiếp item.sessions (Đã chắc chắn có ít nhất 1 phần tử từ bước 2)
                  return item.sessions.map((session, sessionIndex) => {
                    const isFirstRow = sessionIndex === 0;
                    return (
                      <tr
                        key={`${item.monHocId}-${sessionIndex}`}
                        className="hover:bg-gray-50/80 transition-colors border-b border-gray-200"
                      >
                        {isFirstRow && (
                          <>
                            <td
                              rowSpan={totalSessions}
                              className="px-4 py-4 text-center font-medium text-gray-900 border-r border-gray-200 align-middle"
                            >
                              {itemIndex + 1}
                            </td>

                            {/* Tên môn học */}
                            <td
                              rowSpan={totalSessions}
                              className="px-6 py-4 font-medium text-gray-900 border-r border-gray-200 align-middle"
                            >
                              {item.tenMonHoc || "---"}
                            </td>

                            {/* Giáo viên giảng dạy */}
                            <td
                              rowSpan={totalSessions}
                              className="px-6 py-4 whitespace-nowrap border-r border-gray-200 align-middle"
                            >
                              <select
                                className="block w-full rounded-md border-gray-300 text-sm text-gray-950 bg-white py-1.5 px-2 border"
                                value={item.giaoVienGiangDayId || ""}
                                onChange={(e) =>
                                  handleChangeTeacher(itemIndex, e.target.value)
                                }
                              >
                                <option
                                  value=""
                                  disabled
                                  className="text-gray-400 italic"
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
                            </td>

                            {/* Số tín chỉ */}
                            <td
                              rowSpan={totalSessions}
                              className="px-4 py-4 text-center border-r border-gray-200 align-middle"
                            >
                              {item.tinChi ?? "0"}
                            </td>

                            {/* Tổng số tiết */}
                            <td
                              rowSpan={totalSessions}
                              className="px-4 py-4 text-center font-medium text-blue-600 border-r border-gray-200 align-middle"
                            >
                              {item.tongSoTiet}
                            </td>
                          </>
                        )}

                        {/* Phòng học */}
                        <td className="px-4 py-3 border-r border-gray-200">
                          <input
                            type="text"
                            placeholder="Phòng..."
                            value={session.maPhongHoc}
                            onChange={(e) =>
                              handleChangeSessionField(
                                itemIndex,
                                sessionIndex,
                                "maPhongHoc",
                                e.target.value,
                              )
                            }
                            className="w-20 rounded border border-gray-300 px-2 py-1 text-sm focus:border-indigo-500 focus:outline-none"
                          />
                        </td>

                        {/* Thứ */}
                        <td className="px-4 py-3 border-r border-gray-200">
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
                            className="w-28 rounded border border-gray-300 px-2 py-1 text-sm focus:border-indigo-500 focus:outline-none"
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
                            ].map((d) => {
                              const daysMap: Record<string, string> = {
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
                        </td>

                        {/* Tiết */}
                        <td className="px-4 py-3 border-r border-gray-200">
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
                            className="w-20 rounded border border-gray-300 px-2 py-1 text-sm"
                          />
                        </td>

                        {/* Thao tác thêm buổi */}
                        <td className="px-4 py-3 text-center border-r border-gray-200 whitespace-nowrap">
                          <div className="flex flex-col gap-1 items-center">
                            {isFirstRow ? (
                              <button
                                onClick={() =>
                                  handleAddClassSubjectSession(itemIndex)
                                }
                                className="text-indigo-600 hover:text-indigo-900 font-medium text-xs bg-indigo-50 px-2 py-1 rounded border border-indigo-200 w-full"
                              >
                                + Thêm buổi
                              </button>
                            ) : (
                              <button
                                className="text-red-500 hover:text-red-700 font-medium text-xs bg-red-50 px-2 py-1 rounded border border-red-200 w-full"
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

                        {/* 6. Render Checkbox Tuần liên kết trực tiếp với State table */}
                        {weekList.map((week) => {
                          const hasSchedule =
                            !!session[`week_${week.weekNumber}`];
                          return (
                            <td
                              key={week.weekNumber}
                              className={`px-2 py-3 text-center border border-gray-200 transition-colors ${
                                hasSchedule ? "bg-emerald-50/40" : "bg-white"
                              }`}
                            >
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
                                className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                              />
                            </td>
                          );
                        })}
                      </tr>
                    );
                  });
                })}
              </tbody>
            </table>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleSubmit}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-md shadow-sm"
              >
                Lưu tiến độ đào tạo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TableTienDoDaoTao;
