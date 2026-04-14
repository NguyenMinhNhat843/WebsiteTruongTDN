import { useState } from "react";
import {
  Users,
  BookOpen,
  Calendar,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Clock,
  User,
  GraduationCap,
  List,
  LayoutGrid,
  MapPin,
} from "lucide-react";

// Dữ liệu giáo viên
interface Teacher {
  id: string;
  name: string;
  subject: string;
  maxSessions: number;
  assignedSessions: number;
  color: string;
}

const teachersData: Teacher[] = [
  {
    id: "T001",
    name: "Nguyễn Văn A",
    subject: "Kỹ thuật hàn",
    maxSessions: 20,
    assignedSessions: 0,
    color: "blue",
  },
  {
    id: "T002",
    name: "Trần Thị B",
    subject: "Tin học cơ bản",
    maxSessions: 18,
    assignedSessions: 0,
    color: "green",
  },
  {
    id: "T003",
    name: "Lê Văn C",
    subject: "Cơ khí chế tạo",
    maxSessions: 20,
    assignedSessions: 0,
    color: "purple",
  },
  {
    id: "T004",
    name: "Phạm Văn D",
    subject: "Toán cao cấp",
    maxSessions: 15,
    assignedSessions: 0,
    color: "orange",
  },
  {
    id: "T005",
    name: "Hoàng Thị E",
    subject: "Điện tử công nghiệp",
    maxSessions: 18,
    assignedSessions: 0,
    color: "indigo",
  },
  {
    id: "T006",
    name: "Ngô Văn F",
    subject: "Tiếng Anh giao tiếp",
    maxSessions: 16,
    assignedSessions: 0,
    color: "pink",
  },
  {
    id: "T007",
    name: "Đặng Văn G",
    subject: "Kỹ thuật máy lạnh",
    maxSessions: 20,
    assignedSessions: 0,
    color: "cyan",
  },
  {
    id: "T008",
    name: "Võ Thị H",
    subject: "Hóa học công nghiệp",
    maxSessions: 15,
    assignedSessions: 0,
    color: "teal",
  },
  {
    id: "T009",
    name: "Lý Văn K",
    subject: "Công nghệ ô tô",
    maxSessions: 20,
    assignedSessions: 0,
    color: "violet",
  },
  {
    id: "T010",
    name: "Mai Thị L",
    subject: "Kế toán doanh nghiệp",
    maxSessions: 16,
    assignedSessions: 0,
    color: "rose",
  },
];

// Dữ liệu lớp học
interface ClassData {
  id: string;
  name: string;
  subject: string;
  system: string;
  sessionsPerWeek: number;
  teacher?: Teacher;
  schedule?: TimeSlot[];
  systemColor: string;
}

interface TimeSlot {
  day: string;
  slot: number;
  dayName: string;
  slotName: string;
}

const classesData: ClassData[] = [
  {
    id: "C001",
    name: "TCN21A",
    subject: "Kỹ thuật hàn",
    system: "Trung cấp nghề",
    sessionsPerWeek: 4,
    systemColor: "blue",
  },
  {
    id: "C002",
    name: "SCN21B",
    subject: "Tin học cơ bản",
    system: "Sơ cấp nghề",
    sessionsPerWeek: 3,
    systemColor: "green",
  },
  {
    id: "C003",
    name: "TCN21B",
    subject: "Cơ khí chế tạo",
    system: "Trung cấp nghề",
    sessionsPerWeek: 5,
    systemColor: "blue",
  },
  {
    id: "C004",
    name: "DHLK21A",
    subject: "Toán cao cấp",
    system: "Đại học liên kết",
    sessionsPerWeek: 3,
    systemColor: "purple",
  },
  {
    id: "C005",
    name: "TCN21C",
    subject: "Điện tử công nghiệp",
    system: "Trung cấp nghề",
    sessionsPerWeek: 4,
    systemColor: "blue",
  },
  {
    id: "C006",
    name: "9PLUS21A",
    subject: "Tiếng Anh giao tiếp",
    system: "Hệ 9+",
    sessionsPerWeek: 2,
    systemColor: "orange",
  },
  {
    id: "C007",
    name: "TCN21D",
    subject: "Kỹ thuật máy lạnh",
    system: "Trung cấp nghề",
    sessionsPerWeek: 4,
    systemColor: "blue",
  },
  {
    id: "C008",
    name: "TCN21E",
    subject: "Hóa học công nghiệp",
    system: "Trung cấp nghề",
    sessionsPerWeek: 3,
    systemColor: "blue",
  },
  {
    id: "C009",
    name: "TCN21F",
    subject: "Công nghệ ô tô",
    system: "Trung cấp nghề",
    sessionsPerWeek: 5,
    systemColor: "blue",
  },
  {
    id: "C010",
    name: "DHLK21B",
    subject: "Kế toán doanh nghiệp",
    system: "Đại học liên kết",
    sessionsPerWeek: 3,
    systemColor: "purple",
  },
  {
    id: "C011",
    name: "TCN21G",
    subject: "Kỹ thuật hàn",
    system: "Trung cấp nghề",
    sessionsPerWeek: 4,
    systemColor: "blue",
  },
  {
    id: "C012",
    name: "SCN21C",
    subject: "Tin học cơ bản",
    system: "Sơ cấp nghề",
    sessionsPerWeek: 2,
    systemColor: "green",
  },
];

const daysOfWeek = [
  { id: "mon", name: "Thứ Hai" },
  { id: "tue", name: "Thứ Ba" },
  { id: "wed", name: "Thứ Tư" },
  { id: "thu", name: "Thứ Năm" },
  { id: "fri", name: "Thứ Sáu" },
  { id: "sat", name: "Thứ Bảy" },
];

const timeSlots = [
  { id: 1, label: "Tiết 1-2", time: "07:00 - 08:30" },
  { id: 2, label: "Tiết 3-4", time: "08:45 - 10:15" },
  { id: 3, label: "Tiết 5-6", time: "10:30 - 12:00" },
  { id: 4, label: "Tiết 7-8", time: "13:00 - 14:30" },
  { id: 5, label: "Tiết 9-10", time: "14:45 - 16:15" },
];

export function PhanCongGiangDay() {
  const [classes, setClasses] = useState<ClassData[]>(classesData);
  const [teachers, setTeachers] = useState<Teacher[]>(teachersData);
  const [showResults, setShowResults] = useState(false);
  const [assignmentLog, setAssignmentLog] = useState<string[]>([]);
  const [scheduleLog, setScheduleLog] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  // Tự động phân bổ giáo viên
  const autoAssignTeachers = () => {
    const log: string[] = [];
    const updatedTeachers = teachers.map((t) => ({
      ...t,
      assignedSessions: 0,
    }));
    const updatedClasses = classes.map((classItem) => {
      // Tìm giáo viên phù hợp với môn học
      const matchingTeacher = updatedTeachers.find(
        (t) =>
          t.subject === classItem.subject &&
          t.assignedSessions + classItem.sessionsPerWeek <= t.maxSessions,
      );

      if (matchingTeacher) {
        matchingTeacher.assignedSessions += classItem.sessionsPerWeek;
        log.push(
          `✓ Phân công ${matchingTeacher.name} dạy lớp ${classItem.name} (${classItem.subject}) - ${classItem.sessionsPerWeek} buổi/tuần`,
        );
        return { ...classItem, teacher: matchingTeacher };
      } else {
        log.push(
          `✗ Không tìm thấy giáo viên phù hợp cho lớp ${classItem.name} (${classItem.subject})`,
        );
        return classItem;
      }
    });

    setClasses(updatedClasses);
    setTeachers(updatedTeachers);
    setAssignmentLog(log);
    setShowResults(true);
  };

  // Tự động sắp xếp lịch học
  const autoScheduleClasses = () => {
    const log: string[] = [];
    const schedule: Record<
      string,
      Record<number, { teacherId: string; classId: string }[]>
    > = {};

    // Khởi tạo lịch trống
    daysOfWeek.forEach((day) => {
      schedule[day.id] = {};
      timeSlots.forEach((slot) => {
        schedule[day.id][slot.id] = [];
      });
    });

    const updatedClasses = classes.map((classItem) => {
      if (!classItem.teacher) {
        log.push(
          `✗ Lớp ${classItem.name} chưa có giáo viên, bỏ qua sắp xếp lịch`,
        );
        return classItem;
      }

      const assignedSlots: TimeSlot[] = [];
      let sessionsNeeded = classItem.sessionsPerWeek;
      let attempts = 0;
      const maxAttempts = 100;

      while (sessionsNeeded > 0 && attempts < maxAttempts) {
        attempts++;

        // Chọn ngẫu nhiên ngày và tiết
        const randomDay =
          daysOfWeek[Math.floor(Math.random() * daysOfWeek.length)];
        const randomSlot =
          timeSlots[Math.floor(Math.random() * timeSlots.length)];

        const daySchedule = schedule[randomDay.id][randomSlot.id];

        // Kiểm tra xem giáo viên có bận không
        const teacherBusy = daySchedule.some(
          (s) => s.teacherId === classItem.teacher!.id,
        );

        // Kiểm tra xem lớp có bận không
        const classBusy = daySchedule.some((s) => s.classId === classItem.id);

        if (!teacherBusy && !classBusy) {
          // Thêm vào lịch
          schedule[randomDay.id][randomSlot.id].push({
            teacherId: classItem.teacher.id,
            classId: classItem.id,
          });

          assignedSlots.push({
            day: randomDay.id,
            slot: randomSlot.id,
            dayName: randomDay.name,
            slotName: randomSlot.label,
          });

          sessionsNeeded--;
        }
      }

      if (assignedSlots.length === classItem.sessionsPerWeek) {
        log.push(
          `✓ Đã sắp xếp lịch cho lớp ${classItem.name} - ${assignedSlots.length} buổi`,
        );
        return { ...classItem, schedule: assignedSlots };
      } else {
        log.push(
          `⚠ Chỉ sắp xếp được ${assignedSlots.length}/${classItem.sessionsPerWeek} buổi cho lớp ${classItem.name}`,
        );
        return { ...classItem, schedule: assignedSlots };
      }
    });

    setClasses(updatedClasses);
    setScheduleLog(log);
  };

  const resetAssignment = () => {
    setClasses(classesData);
    setTeachers(teachersData);
    setShowResults(false);
    setAssignmentLog([]);
    setScheduleLog([]);
  };

  const assignedCount = classes.filter((c) => c.teacher).length;
  const scheduledCount = classes.filter(
    (c) => c.schedule && c.schedule.length > 0,
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GraduationCap className="w-8 h-8 text-violet-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Phân Công Giảng Dạy
                </h1>
                <p className="text-sm text-gray-600">
                  Tự động phân bổ giáo viên và sắp xếp lịch học
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* View mode toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                    viewMode === "list"
                      ? "bg-white text-violet-700 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <List className="w-4 h-4" />
                  Danh sách
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                    viewMode === "grid"
                      ? "bg-white text-violet-700 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                  Lưới thời khóa biểu
                </button>
              </div>

              <button
                onClick={resetAssignment}
                className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Làm mới
              </button>
              <button
                onClick={autoAssignTeachers}
                className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg font-medium hover:from-violet-700 hover:to-purple-700 transition-all shadow-md flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Tự động phân bổ giáo viên
              </button>
              <button
                onClick={autoScheduleClasses}
                disabled={assignedCount === 0}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Calendar className="w-5 h-5" />
                Tự động sắp xếp lịch học
              </button>
            </div>
          </div>

          {/* Thống kê */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg p-4 text-white shadow-md">
              <div className="text-2xl font-bold">{classes.length}</div>
              <div className="text-sm text-violet-100 flex items-center gap-1">
                <Users className="w-4 h-4" />
                Tổng số lớp
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg p-4 text-white shadow-md">
              <div className="text-2xl font-bold">{teachers.length}</div>
              <div className="text-sm text-blue-100 flex items-center gap-1">
                <User className="w-4 h-4" />
                Giáo viên
              </div>
            </div>
            <div
              className={`bg-gradient-to-br ${assignedCount === classes.length ? "from-green-500 to-emerald-600" : "from-orange-500 to-amber-600"} rounded-lg p-4 text-white shadow-md`}
            >
              <div className="text-2xl font-bold">
                {assignedCount}/{classes.length}
              </div>
              <div className="text-sm opacity-90 flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                Đã phân công GV
              </div>
            </div>
            <div
              className={`bg-gradient-to-br ${scheduledCount === classes.length ? "from-green-500 to-emerald-600" : "from-orange-500 to-amber-600"} rounded-lg p-4 text-white shadow-md`}
            >
              <div className="text-2xl font-bold">
                {scheduledCount}/{classes.length}
              </div>
              <div className="text-sm opacity-90 flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Đã sắp xếp lịch
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-8 py-6">
        {viewMode === "list" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Danh sách lớp học */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-violet-50 to-purple-50">
                <h2 className="font-bold text-gray-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-violet-600" />
                  Danh sách lớp học
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {classes.length} lớp cần phân công giảng dạy
                </p>
              </div>

              <div className="p-6 max-h-[600px] overflow-y-auto">
                <div className="space-y-3">
                  {classes.map((classItem) => (
                    <div
                      key={classItem.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`px-2.5 py-1 bg-${classItem.systemColor}-100 text-${classItem.systemColor}-700 text-xs font-medium rounded-full`}
                            >
                              {classItem.name}
                            </span>
                            <span className="text-sm text-gray-600">
                              {classItem.system}
                            </span>
                          </div>
                          <div className="font-semibold text-gray-900">
                            {classItem.subject}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-700">
                            {classItem.sessionsPerWeek} buổi/tuần
                          </div>
                        </div>
                      </div>

                      {classItem.teacher ? (
                        <div className="bg-green-50 border border-green-200 rounded-md p-3">
                          <div className="flex items-center gap-2 text-green-800">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-sm font-medium">
                              GV: {classItem.teacher.name}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                          <div className="flex items-center gap-2 text-gray-500">
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-sm">
                              Chưa phân công giáo viên
                            </span>
                          </div>
                        </div>
                      )}

                      {classItem.schedule && classItem.schedule.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="text-xs font-medium text-gray-700 mb-2">
                            Lịch học:
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {classItem.schedule.map((slot, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md"
                              >
                                {slot.dayName} - {slot.slotName}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Danh sách giáo viên */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <h2 className="font-bold text-gray-900 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  Danh sách giáo viên
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {teachers.length} giáo viên có thể phân công
                </p>
              </div>

              <div className="p-6 max-h-[600px] overflow-y-auto">
                <div className="space-y-3">
                  {teachers.map((teacher) => {
                    const utilizationPercent = Math.round(
                      (teacher.assignedSessions / teacher.maxSessions) * 100,
                    );
                    const isOverloaded =
                      teacher.assignedSessions > teacher.maxSessions;

                    return (
                      <div
                        key={teacher.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900 mb-1">
                              {teacher.name}
                            </div>
                            <div className="text-sm text-gray-600">
                              {teacher.subject}
                            </div>
                          </div>
                          <div className="text-right">
                            <div
                              className={`text-sm font-medium ${isOverloaded ? "text-red-600" : "text-gray-700"}`}
                            >
                              {teacher.assignedSessions}/{teacher.maxSessions}{" "}
                              buổi
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs text-gray-600">
                            <span>Mức độ phân công</span>
                            <span
                              className={`font-medium ${isOverloaded ? "text-red-600" : utilizationPercent >= 80 ? "text-orange-600" : "text-green-600"}`}
                            >
                              {utilizationPercent}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                isOverloaded
                                  ? "bg-red-500"
                                  : utilizationPercent >= 80
                                    ? "bg-orange-500"
                                    : "bg-green-500"
                              }`}
                              style={{
                                width: `${Math.min(utilizationPercent, 100)}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-violet-50 to-purple-50">
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <LayoutGrid className="w-5 h-5 text-violet-600" />
                Lưới thời khóa biểu
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Xem lịch học của các lớp theo thời gian
              </p>
            </div>

            {scheduledCount === 0 ? (
              <div className="p-12 text-center">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">
                  Chưa có lịch học được sắp xếp
                </p>
                <p className="text-gray-400 text-sm">
                  Vui lòng phân công giáo viên và sắp xếp lịch học trước
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-violet-600 to-purple-600">
                      <th className="sticky left-0 z-10 bg-violet-600 px-4 py-4 text-left">
                        <div className="flex items-center gap-2 text-white">
                          <Clock className="w-5 h-5" />
                          <span className="font-semibold">Giờ học</span>
                        </div>
                      </th>
                      {daysOfWeek.map((day) => (
                        <th
                          key={day.id}
                          className="px-4 py-4 text-center min-w-[200px]"
                        >
                          <div className="text-white font-semibold">
                            {day.name}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {timeSlots.map((slot, slotIndex) => (
                      <tr
                        key={slot.id}
                        className={
                          slotIndex % 2 === 0 ? "bg-gray-50" : "bg-white"
                        }
                      >
                        <td className="sticky left-0 z-10 px-4 py-4 border-r border-gray-200 bg-white">
                          <div className="font-semibold text-gray-900 text-sm">
                            {slot.label}
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            {slot.time}
                          </div>
                        </td>
                        {daysOfWeek.map((day) => {
                          const classesInSlot = classes.filter((c) =>
                            c.schedule?.some(
                              (s) => s.day === day.id && s.slot === slot.id,
                            ),
                          );

                          return (
                            <td
                              key={day.id}
                              className="px-3 py-3 border-l border-gray-200 align-top"
                            >
                              {classesInSlot.length > 0 ? (
                                classesInSlot.map((classItem) => {
                                  const systemColorMap: Record<string, string> =
                                    {
                                      blue: "bg-blue-100 border-blue-400",
                                      green: "bg-green-100 border-green-400",
                                      purple: "bg-purple-100 border-purple-400",
                                      orange: "bg-orange-100 border-orange-400",
                                    };
                                  const colorClass =
                                    systemColorMap[classItem.systemColor] ||
                                    "bg-gray-100 border-gray-400";

                                  return (
                                    <div
                                      key={classItem.id}
                                      className={`${colorClass} border-l-4 rounded-md p-3 mb-2 hover:shadow-md transition-shadow cursor-pointer`}
                                    >
                                      <div className="font-semibold text-sm text-gray-900 mb-1">
                                        {classItem.subject}
                                      </div>
                                      <div className="flex items-center gap-1 text-xs text-gray-700 mb-1">
                                        <Users className="w-3 h-3" />
                                        <span>{classItem.name}</span>
                                      </div>
                                      {classItem.teacher && (
                                        <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                                          <BookOpen className="w-3 h-3" />
                                          <span>{classItem.teacher.name}</span>
                                        </div>
                                      )}
                                      <div className="flex items-center gap-1 text-xs text-gray-500">
                                        <MapPin className="w-3 h-3" />
                                        <span>{classItem.system}</span>
                                      </div>
                                    </div>
                                  );
                                })
                              ) : (
                                <div className="text-xs text-gray-300 text-center py-4">
                                  -
                                </div>
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
          </div>
        )}

        {/* Kết quả phân công */}
        {showResults && assignmentLog.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Kết quả phân công giáo viên
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {assignmentLog.map((log, idx) => (
                  <div
                    key={idx}
                    className={`text-sm p-3 rounded-lg ${
                      log.startsWith("✓")
                        ? "bg-green-50 text-green-800"
                        : "bg-red-50 text-red-800"
                    }`}
                  >
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Kết quả sắp xếp lịch */}
        {scheduleLog.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Kết quả sắp xếp lịch học
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {scheduleLog.map((log, idx) => (
                  <div
                    key={idx}
                    className={`text-sm p-3 rounded-lg ${
                      log.startsWith("✓")
                        ? "bg-green-50 text-green-800"
                        : log.startsWith("⚠")
                          ? "bg-orange-50 text-orange-800"
                          : "bg-red-50 text-red-800"
                    }`}
                  >
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Hướng dẫn */}
        <div className="mt-6 bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg shadow-sm border border-violet-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-violet-600" />
            Hướng dẫn sử dụng
          </h3>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex items-start gap-2">
              <span className="text-violet-600 font-bold">1.</span>
              <span>
                Chọn chế độ xem: <strong>"Danh sách"</strong> để xem chi tiết
                lớp học và giáo viên, hoặc{" "}
                <strong>"Lưới thời khóa biểu"</strong> để xem lịch học dạng bảng
                trực quan.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-violet-600 font-bold">2.</span>
              <span>
                Nhấn <strong>"Tự động phân bổ giáo viên"</strong> để hệ thống tự
                động gán giáo viên phù hợp cho từng lớp học dựa trên chuyên môn
                và khả năng giảng dạy.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-violet-600 font-bold">3.</span>
              <span>
                Sau khi phân công giáo viên, nhấn{" "}
                <strong>"Tự động sắp xếp lịch học"</strong> để tạo thời khóa
                biểu sao cho không xảy ra xung đột (giáo viên không dạy 2 lớp
                cùng lúc, lớp không học 2 môn cùng lúc).
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-violet-600 font-bold">4.</span>
              <span>
                Chuyển sang chế độ <strong>"Lưới thời khóa biểu"</strong> để xem
                kết quả sắp xếp lịch học một cách trực quan và dễ dàng phát hiện
                các khoảng trống.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-violet-600 font-bold">5.</span>
              <span>
                Nhấn <strong>"Làm mới"</strong> để đặt lại tất cả và thực hiện
                phân công mới.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PhanCongGiangDay;
