import { useAppContext } from "../../../../AppProvider";
import { useLopHocOneContext } from "./LopHocOneProvider";

const TabMonHoc = () => {
  const { hocKysData, isHocKysLoading } = useAppContext();
  const {
    selectedSemesterId,
    setselectedSemesterId,
    classSubjects,
    isClassSubjectsLoading,
  } = useLopHocOneContext();

  const dataHienThi = classSubjects?.map((cs) => ({
    maMonHoc: cs.subject?.subjectCode,
    giaoVienGiangDay: cs.teacher?.fullName,
    tenMonHoc: cs.subject?.subjectName,
    soTinChi: cs.subject?.credits,
    soGioLyThuyet: cs.subject?.theoryHours,
    soGioThucHanh: cs.subject?.practiceHours,
    soGioKiemTra: cs.subject?.testHours,
  }));

  // Trạng thái đang tải dữ liệu
  if (isHocKysLoading || isClassSubjectsLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm gap-3">
        <div className="animate-spin rounded-full h-9 w-9 border-[3px] border-slate-200 border-t-blue-600"></div>
        <span className="text-sm font-medium text-slate-500 tracking-wide">
          Đang tải cấu trúc môn học...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
      {/* BỘ LỌC HỌC KỲ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h3 className="text-base font-bold text-slate-800 tracking-tight">
            Chương trình môn học
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Danh sách các môn học phân phối theo từng học kỳ
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={selectedSemesterId ?? ""}
            onChange={(e) => setselectedSemesterId(Number(e.target.value))}
            className="block w-52 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 font-semibold cursor-pointer transition-all shadow-sm hover:bg-slate-100/50"
          >
            {hocKysData?.map((hocKy) => (
              <option key={hocKy.id} value={hocKy.id}>
                {hocKy.name} {hocKy.isCurrent ? "(Hiện tại)" : ""}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* BẢNG HIỂN THỊ DANH SÁCH MÔN HỌC */}
      {!dataHienThi || dataHienThi.length === 0 ? (
        <div className="text-center py-16 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 px-4">
          <div className="mx-auto w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3 text-sm font-bold">
            !
          </div>
          <p className="text-sm font-medium text-slate-500 max-w-xs mx-auto leading-relaxed">
            Không có môn học nào được xếp lịch trong học kỳ này.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200/80 shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                <th className="px-5 py-3.5 font-semibold text-slate-600 w-36">
                  Mã môn học
                </th>
                <th className="px-5 py-3.5 font-semibold text-slate-600">
                  Tên môn học
                </th>
                <th className="px-5 py-3.5 font-semibold text-slate-600 text-center w-28">
                  Số tín chỉ
                </th>
                <th className="px-5 py-3.5 font-semibold text-slate-600 text-center w-44">
                  Số giờ (LT / TH / KT)
                </th>
                <th className="px-5 py-3.5 font-semibold text-slate-600 w-60">
                  Giáo viên giảng dạy
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
              {dataHienThi?.map((item) => {
                return (
                  <tr
                    key={item.maMonHoc}
                    className="hover:bg-blue-50/30 transition-colors duration-150 ease-in-out"
                  >
                    {/* Mã môn học */}
                    <td className="px-5 py-4 align-middle">
                      <span className="font-mono font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md text-xs tracking-wider">
                        {item.maMonHoc}
                      </span>
                    </td>

                    {/* Tên môn học */}
                    <td className="px-5 py-4 align-middle">
                      <div className="max-w-md">
                        <div className="font-semibold text-slate-800 text-[14px]">
                          {item.tenMonHoc ?? "N/A"}
                        </div>
                      </div>
                    </td>

                    {/* Số tín chỉ */}
                    <td className="px-5 py-4 align-middle text-center font-semibold text-slate-700">
                      {item.soTinChi ?? 0}
                    </td>

                    {/* Số giờ lý thuyết / thực hành / kiểm tra */}
                    <td className="px-5 py-4 align-middle text-center">
                      <div className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-medium bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                        <span className="font-bold text-slate-800">
                          {item.soGioLyThuyet ?? 0}
                        </span>
                        <span className="text-slate-400 text-[10px]">LT</span>
                        <span className="text-slate-300">|</span>
                        <span className="font-bold text-slate-800">
                          {item.soGioThucHanh ?? 0}
                        </span>
                        <span className="text-slate-400 text-[10px]">TH</span>
                        <span className="text-slate-300">|</span>
                        <span className="font-bold text-slate-800">
                          {item.soGioKiemTra ?? 0}
                        </span>
                        <span className="text-slate-400 text-[10px]">KT</span>
                      </div>
                    </td>

                    {/* Giáo viên giảng dạy */}
                    <td className="px-5 py-4 align-middle">
                      <div className="inline-flex items-center gap-2 text-slate-400 text-xs bg-slate-50/50 px-2.5 py-1 rounded-full border border-slate-200/60 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-pulse"></span>
                        Chưa có thông tin
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TabMonHoc;
