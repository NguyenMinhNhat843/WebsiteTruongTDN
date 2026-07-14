import { $api } from "../../../api/client";
import { useAppContext } from "../../../AppProvider";

// Inline SVG Icons để tối ưu dung lượng và tốc độ hiển thị
const GraduationCapIcon = () => (
  <svg
    className="w-5 h-5 opacity-80"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 14l9-5-9-5-9 5 9 5z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7"
    />
  </svg>
);
const UserIcon = () => (
  <svg
    className="w-4 h-4 text-indigo-200"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);
const IdCardIcon = () => (
  <svg
    className="w-4 h-4 text-indigo-200"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 012-2h2a2 2 0 012 2v1m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v1"
    />
  </svg>
);
const BookmarkIcon = () => (
  <svg
    className="w-4 h-4 text-blue-600 flex-shrink-0"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
    />
  </svg>
);
const AlertIcon = () => (
  <svg
    className="w-5 h-5 text-rose-600 flex-shrink-0"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
    />
  </svg>
);

const StudentbangDiem = () => {
  const { currentUser } = useAppContext();
  const studentId = currentUser?.profile?.id;

  const {
    data,
    isLoading: isTranscriptLoading,
    error: transcriptError,
  } = $api.useQuery(
    "get",
    "/grades/transcript",
    {
      params: {
        query: {
          studentId: studentId!,
        },
      },
    },
    { enabled: !!studentId },
  );

  if (isTranscriptLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[450px] gap-3 bg-slate-50/50">
        <div className="w-10 h-10 border-[3.5px] border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 text-sm animate-pulse font-semibold tracking-wide">
          Đang tải bảng điểm toàn khóa...
        </p>
      </div>
    );
  }

  if (transcriptError || !data) {
    return (
      <div className="p-4 mx-6 my-6 bg-rose-50 border border-rose-100 text-rose-700 rounded-xl flex items-start gap-3 shadow-sm text-sm">
        <AlertIcon />
        <div>
          <p className="font-bold text-rose-900">
            Đã xảy ra lỗi khi tải dữ liệu bảng điểm.
          </p>
          <p className="text-rose-600 mt-0.5">
            Vui lòng thử lại sau hoặc liên hệ quản trị viên để được hỗ trợ.
          </p>
        </div>
      </div>
    );
  }

  const { studentInfo, transcript } = data;

  // Tính toán nhanh số liệu tổng quan toàn khóa học từ học kỳ cuối cùng
  const latestSemester = transcript[transcript.length - 1];
  const totalCredits = latestSemester?.cumulativeCredits || 0;
  const currentCPA = latestSemester?.cumulativeCPA4 || 0.0;

  // Hàm xác định Style hiển thị cho điểm chữ mềm mại, sang trọng hơn
  const getGradeStyle = (letter: string) => {
    if (letter.startsWith("A"))
      return "text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100";
    if (letter.startsWith("B"))
      return "text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100";
    if (letter.startsWith("C"))
      return "text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100";
    if (letter.startsWith("D"))
      return "text-orange-600 font-bold bg-orange-50 px-2 py-0.5 rounded-md border border-orange-100";
    if (letter === "F")
      return "text-rose-600 font-extrabold bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100";
    return "text-slate-600 font-medium bg-slate-50 px-2 py-0.5 rounded-md";
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 bg-slate-50/30 min-h-screen">
      {/* 1. Header & Thông tin sinh viên (UI Gradient mịn, chia lưới cân đối) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-6 bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-900 rounded-2xl text-white shadow-lg border border-indigo-900/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider">
              <GraduationCapIcon /> Tiến trình đào tạo
            </div>
            <h1 className="text-2xl lg:text-3xl font-black tracking-tight mt-1">
              Bảng Điểm Toàn Khóa
            </h1>
            <p className="text-slate-300 text-xs font-medium mt-1">
              Theo dõi kết quả học tập, điểm tích lũy thành phần và CPA qua từng
              giai đoạn học tập.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2.5 pt-2 border-t border-white/10 text-sm font-semibold text-slate-200">
            <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
              <UserIcon />
              <span>
                <span className="text-slate-400 font-normal">Họ tên:</span>{" "}
                {studentInfo.fullName}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
              <IdCardIcon />
              <span>
                <span className="text-slate-400 font-normal">Mã SV:</span>{" "}
                {studentInfo.studentCode}
              </span>
            </div>
          </div>
        </div>

        {/* 2. Khối tổng quan tích lũy toàn khóa dạng các Metric Widget */}
        <div className="flex gap-4 w-full lg:w-auto">
          <div className="flex-1 lg:flex-none text-center bg-white/10 px-5 py-4 rounded-xl backdrop-blur-md border border-white/10 shadow-inner">
            <span className="text-[10px] text-indigo-200 block font-bold uppercase tracking-wider">
              TC tích lũy
            </span>
            <span className="text-3xl font-black mt-1 block tracking-tight text-white">
              {totalCredits}
            </span>
          </div>
          <div className="flex-1 lg:flex-none text-center bg-amber-400/10 px-5 py-4 rounded-xl backdrop-blur-md border border-amber-400/20 shadow-inner">
            <span className="text-[10px] text-amber-200 block font-bold uppercase tracking-wider">
              CPA Hệ 4
            </span>
            <span className="text-3xl font-black mt-1 block tracking-tight text-amber-400">
              {currentCPA.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Danh sách bảng điểm theo từng học kỳ */}
      {!transcript || transcript.length === 0 ? (
        <div className="text-center py-20 bg-white border border-slate-200 rounded-2xl text-slate-400 font-medium text-sm shadow-sm">
          Chưa có dữ liệu điểm học tập được ghi nhận trong hệ thống.
        </div>
      ) : (
        <div className="space-y-8">
          {transcript.map((semester: any) => (
            <div
              key={semester.semesterId}
              className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md"
            >
              {/* Tiêu đề Học kỳ */}
              <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-200 flex flex-wrap justify-between items-center gap-3">
                <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <BookmarkIcon />
                  {semester.semesterName}
                </h2>
                <span className="text-xs font-bold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-100">
                  {semester.subjects.length} môn học
                </span>
              </div>

              {/* Bảng điểm chi tiết */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[950px]">
                  <thead>
                    <tr className="bg-slate-50/40 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                      <th className="p-4 w-[110px] text-center">Mã môn</th>
                      <th className="p-4 w-[280px]">Tên môn học</th>
                      <th className="p-4 w-[80px] text-center">Số TC</th>
                      <th className="p-4 text-center text-slate-400 font-normal">
                        KTTX (1-2-3)
                      </th>
                      <th className="p-4 text-center text-slate-400 font-normal">
                        KTĐK (1-2-3-4)
                      </th>
                      <th className="p-4 w-[110px] text-center bg-slate-50/30">
                        Tổng kết 10
                      </th>
                      <th className="p-4 w-[90px] text-center">Thang 4</th>
                      <th className="p-4 w-[90px] text-center">Điểm chữ</th>
                      <th className="p-4 w-[110px] text-center">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                    {semester.subjects.map((subj: any) => (
                      <tr
                        key={subj.gradeId}
                        className="hover:bg-slate-50/50 transition-colors group"
                      >
                        {/* Mã môn */}
                        <td className="p-4 text-center font-mono text-xs text-slate-500 font-semibold group-hover:text-slate-900">
                          {subj.subjectCode}
                        </td>
                        {/* Tên môn */}
                        <td className="p-4 font-bold text-slate-800 group-hover:text-indigo-900 transition-colors">
                          {subj.subjectName}
                        </td>
                        {/* Tín chỉ */}
                        <td className="p-4 text-center font-semibold text-slate-600">
                          {subj.credits}
                        </td>
                        {/* Điểm thường xuyên */}
                        <td className="p-4 text-center text-slate-500 font-medium tracking-wide">
                          {[subj.kttx1, subj.kttx2, subj.kttx3]
                            .filter((g) => g !== null && g !== undefined)
                            .map((n) => n.toFixed(1))
                            .join("  |  ") || "—"}
                        </td>
                        {/* Điểm định kỳ */}
                        <td className="p-4 text-center text-slate-500 font-medium tracking-wide">
                          {[subj.ktdk1, subj.ktdk2, subj.ktdk3, subj.ktdk4]
                            .filter((g) => g !== null && g !== undefined)
                            .map((n) => n.toFixed(1))
                            .join("  |  ") || "—"}
                        </td>
                        {/* Điểm tổng kết hệ 10 */}
                        <td className="p-4 text-center font-black text-slate-900 bg-slate-50/20 text-base">
                          {subj.finalScore !== null
                            ? subj.finalScore.toFixed(1)
                            : "—"}
                        </td>
                        {/* Điểm hệ 4 */}
                        <td className="p-4 text-center font-bold text-slate-800">
                          {subj.finalScore !== null
                            ? subj.gradeFour.toFixed(1)
                            : "—"}
                        </td>
                        {/* Điểm chữ */}
                        <td className="p-4 text-center text-xs">
                          <span className={getGradeStyle(subj.gradeLetter)}>
                            {subj.gradeLetter || "—"}
                          </span>
                        </td>
                        {/* Trạng thái Đạt/Trượt */}
                        <td className="p-4 text-center">
                          {subj.finalScore !== null ? (
                            subj.isPassed ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60 shadow-sm">
                                Đạt
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200/60 shadow-sm animate-pulse">
                                Học lại
                              </span>
                            )
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-400">
                              Chưa có
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Tóm tắt chỉ số cuối học kỳ dạng hàng ngang cân xứng */}
              <div className="bg-slate-50/40 border-t border-slate-200 px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs font-semibold text-slate-600">
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  <p className="flex items-center gap-1.5">
                    <span className="text-slate-400 font-medium">
                      TC đăng ký kỳ:
                    </span>{" "}
                    <span className="text-slate-800 font-bold bg-slate-200/60 px-2 py-0.5 rounded">
                      {semester.semesterCredits}
                    </span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <span className="text-slate-400 font-medium">
                      GPA Kỳ (Hệ 10):
                    </span>{" "}
                    <span className="text-indigo-600 font-extrabold text-sm">
                      {semester.semesterGPA10.toFixed(2)}
                    </span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <span className="text-slate-400 font-medium">
                      GPA Kỳ (Hệ 4):
                    </span>{" "}
                    <span className="text-blue-600 font-extrabold text-sm">
                      {semester.semesterGPA4.toFixed(2)}
                    </span>
                  </p>
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-2 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm w-full md:w-auto">
                  <p>
                    <span className="text-slate-400 font-medium">
                      Tích lũy TC toàn khóa:
                    </span>{" "}
                    <span className="text-slate-800 font-bold">
                      {semester.cumulativeCredits}
                    </span>
                  </p>
                  <p className="border-l border-slate-200 pl-4">
                    <span className="text-slate-400 font-medium">
                      CPA tích lũy:
                    </span>{" "}
                    <span className="text-amber-600 font-extrabold">
                      {semester.cumulativeCPA4.toFixed(2)}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentbangDiem;
