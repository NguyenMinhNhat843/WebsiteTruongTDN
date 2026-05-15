import { Users, Wand2 } from "lucide-react";
import PageShell from "../../../components/ui/PageShell";
import { usePhanLopContext } from "./PhanLopProvider";

const PhanLop = () => {
  const {
    isPendingbatches,
    nganhs,
    isPendingNganhs,
    students,
    isPendingStudents,
    selectedMajorId,
    setSelectedMajorId,
    latestBatch,
    phanLop,
    isPendingPhanLop,
  } = usePhanLopContext();

  return (
    <PageShell
      title="Phân lớp Sinh viên"
      sub="Quản lý việc phân lớp cho sinh viên dựa trên ngành và khóa đào tạo"
      icon={Users} // Icon chính cho trang
      renderRight={
        <button
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-md active:scale-95"
          onClick={() =>
            phanLop(
              {
                body: {
                  batchId: latestBatch!.id!, // Lấy batchId từ latestBatch đã tính toán ở trên
                  studentsPerClass: 40, // Hoặc bạn có thể cho phép admin nhập số này thông qua UI nếu muốn linh hoạt hơn
                },
              },
              {
                onSuccess: () => {
                  alert("Phân lớp thành công! Dữ liệu sẽ được cập nhật.");
                },
              },
            )
          }
          disabled={isPendingPhanLop}
        >
          <Wand2 className="w-4 h-4" />{" "}
          {/* Icon "đũa phép" gợi ý sự tự động hóa/phân lớp thông minh */}
          Phân lớp
        </button>
      }
    >
      <div className="p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen font-sans text-slate-900">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {/* Card: Cấu hình lọc */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-6 items-end">
            <div className="flex-1 w-full flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">
                Chọn Ngành đào tạo{" "}
              </label>
              <div className="relative">
                <select
                  className="w-full appearance-none border border-slate-200 rounded-xl p-3 bg-white hover:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                  onChange={(e) => setSelectedMajorId(Number(e.target.value))}
                  value={selectedMajorId || ""}
                >
                  <option value="">-- Chọn ngành học --</option>
                  {nganhs?.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.majorName}
                    </option>
                  ))}
                </select>
                {isPendingNganhs && (
                  <div className="absolute right-10 top-3.5 italic text-xs text-blue-500 animate-pulse">
                    Đang tải...{" "}
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 w-full flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">
                Khóa đào tạo mới nhất{" "}
              </label>
              <div
                className={`border rounded-xl p-3 min-h-[50px] flex items-center transition-colors ${latestBatch ? "bg-blue-50 border-blue-100" : "bg-slate-50 border-slate-100"}`}
              >
                {isPendingbatches ? (
                  <span className="text-sm text-slate-400 animate-pulse italic">
                    Đang kiểm tra dữ liệu...{" "}
                  </span>
                ) : latestBatch ? (
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></span>
                    <span className="font-bold text-blue-700 text-lg">
                      {latestBatch.batchCode}{" "}
                      <span className="font-normal text-sm opacity-75">
                        ({latestBatch.startYear} - {latestBatch.endYear})
                      </span>{" "}
                    </span>
                  </div>
                ) : (
                  <span className="text-slate-400 text-sm italic">
                    Vui lòng chọn ngành để xem khóa{" "}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Card: Thống kê nhanh */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-2xl shadow-lg text-white flex flex-col justify-center relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-blue-100 text-sm font-medium uppercase tracking-wider">
                Tổng sinh viên đủ điều kiện
              </p>
              <h3 className="text-5xl font-black mt-2">
                {students?.totalEligible || 0}{" "}
              </h3>
              <p className="text-blue-200 text-xs mt-4">
                Dữ liệu được cập nhật theo thời gian thực
              </p>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <svg
                width="120"
                height="120"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="8.5" cy="7" r="4" />
                <path d="M20 8v6M23 11h-6" />
              </svg>
            </div>
          </div>
        </div>

        {/* Main Content: Table */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden transition-all">
          <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-xl text-slate-800">
                Danh sách sinh viên{" "}
              </h3>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase text-xs tracking-widest font-semibold">
                  <th className="px-6 py-4 text-center w-20">STT </th>
                  <th className="px-6 py-4 text-left">Mã sinh viên </th>
                  <th className="px-6 py-4 text-left">Họ và Tên </th>
                  <th className="px-6 py-4 text-left">Hình thức tuyển sinh </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isPendingStudents ? (
                  <tr>
                    <td colSpan={4} className="py-20">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-slate-400 font-medium">
                          Đang tải danh sách sinh viên...{" "}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : students?.students && students.students.length > 0 ? (
                  students.students.map((st, index) => (
                    <tr
                      key={st.id}
                      className="group hover:bg-blue-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 text-center font-medium text-slate-400">
                        {index + 1}{" "}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-slate-100 text-slate-800 group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors font-mono">
                          {st.studentCode}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-700">
                        {st.fullName}{" "}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-slate-600 bg-slate-100 px-3 py-1 rounded-full text-xs">
                          {st.admissionName}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-24 text-center">
                      <div className="flex flex-col items-center opacity-40">
                        <svg
                          className="w-16 h-16 mb-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1"
                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                          />
                        </svg>
                        <p className="text-lg font-medium">
                          {selectedMajorId
                            ? "Không tìm thấy sinh viên nào đủ điều kiện."
                            : "Vui lòng chọn ngành để hiển thị dữ liệu."}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageShell>
  );
};

export default PhanLop;
