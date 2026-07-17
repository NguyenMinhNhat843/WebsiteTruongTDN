import { formatDateToString } from "../../../../util/formatDate";
import { type DataRow } from "./types";
import { TeacherSelectCell } from "./TeacherSelectCell";

interface TableContentProps {
  table: DataRow[];
  weekList: { weekNumber: number; start: Date | string }[];
  rooms?: any[];
  isLoadingRooms: boolean;
  handleAddClassSubjectSession: (itemIndex: number) => void;
  handleRemoveClassSubjectSession: (itemIndex: number, sessionIndex: number) => void;
  handleChangeRoom: (itemIndex: number, sessionIndex: number, roomIdValue: string) => void;
  handleChangeTeacher: (itemIndex: number, teacherId: string, teacherName: string) => void;
  handleChangeSessionField: (
    itemIndex: number,
    sessionIndex: number,
    field: "maPhongHoc" | "thu" | "tiet" | "idPhongHoc",
    value: string,
  ) => void;
  handleToggleWeek: (itemIndex: number, sessionIndex: number, weekNumber: number) => void;
}

const daysMap = {
  MONDAY: "Thứ 2",
  TUESDAY: "Thứ 3",
  WEDNESDAY: "Thứ 4",
  THURSDAY: "Thứ 5",
  FRIDAY: "Thứ 6",
  SATURDAY: "Thứ 7",
  SUNDAY: "Chủ nhật",
};

export const TableContent = ({
  table,
  weekList,
  rooms,
  isLoadingRooms,
  handleAddClassSubjectSession,
  handleRemoveClassSubjectSession,
  handleChangeRoom,
  handleChangeTeacher,
  handleChangeSessionField,
  handleToggleWeek,
}: TableContentProps) => {
  return (
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
                        <TeacherSelectCell
                          currentTeacherId={item.giaoVienGiangDayId}
                          currentTeacherName={item.giaoVienGiangDay}
                          onChange={(teacherId, teacherName) => {
                            handleChangeTeacher(itemIndex, String(teacherId), teacherName);
                          }}
                        />
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
                          onClick={() => handleAddClassSubjectSession(itemIndex)}
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
                    const hasSchedule = !!session[`week_${week.weekNumber}`];
                    return (
                      <td
                        key={week.weekNumber}
                        className={`px-2 py-3 text-center border border-slate-200 transition-colors duration-150 align-middle ${hasSchedule ? "bg-emerald-50/50" : "bg-white"
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
  );
};
