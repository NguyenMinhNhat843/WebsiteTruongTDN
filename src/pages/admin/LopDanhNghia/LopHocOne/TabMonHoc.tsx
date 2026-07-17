import { useLopHocOneContext } from "./LopHocOneProvider";
import { useNavigate } from "react-router-dom";

const TabMonHoc = () => {
  const navigate = useNavigate();

  const {
    LopHocDetail: lopHocDetail,
    classSubjects,
    isClassSubjectsLoading,
    isHocKysLoading,
  } = useLopHocOneContext();

  const dataHienThi = classSubjects?.map((cs) => ({
    id: cs.id,
    maMonHoc: cs.subject?.subjectCode,
    giaoVienId: cs.teacher?.id,
    giaoVienGiangDay: cs.teacher?.fullName,
    tenMonHoc: cs.subject?.subjectName,
    soTinChi: cs.subject?.credits,
    soGioLyThuyet: cs.subject?.theoryHours,
    soGioThucHanh: cs.subject?.practiceHours,
    soGioKiemTra: cs.subject?.testHours,
    teacher: cs.teacher?.fullName,
  }));

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
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden mb-32">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border-b border-slate-100 bg-white">
        <div>
          <h3 className="text-base font-bold text-slate-800 tracking-tight">
            Chương trình môn học
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Danh sách các môn học phân phối theo từng học kỳ
          </p>
        </div>
      </div>

      {/* CONTENT SECTION (BẢNG HIỂN THỊ) */}
      {!dataHienThi || dataHienThi.length === 0 ? (
        <div className="text-center py-16 px-4 bg-slate-50/30">
          <div className="mx-auto w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3 text-sm font-bold">
            !
          </div>
          <p className="text-sm font-medium text-slate-500 max-w-xs mx-auto leading-relaxed">
            Không có môn học nào được xếp lịch trong học kỳ này.
          </p>
        </div>
      ) : (
        /* Thêm custom-scrollbar và overflow-x-auto giúp cuộn mượt khi bảng dài */
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50/70 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-150">
                {/* Dùng whitespace-nowrap ngăn các thẻ th rớt dòng */}
                <th className="px-6 py-4 font-semibold text-slate-600 w-40 whitespace-nowrap">
                  Mã môn học
                </th>
                <th className="px-6 py-4 font-semibold text-slate-600 min-w-[240px] whitespace-nowrap">
                  Tên môn học
                </th>
                <th className="px-6 py-4 font-semibold text-slate-600 text-center w-32 whitespace-nowrap">
                  Số tín chỉ
                </th>
                <th className="px-4 py-4 font-semibold text-slate-600 text-center w-28 whitespace-nowrap">
                  Lý thuyết
                </th>
                <th className="px-4 py-4 font-semibold text-slate-600 text-center w-28 whitespace-nowrap">
                  Thực hành
                </th>
                <th className="px-4 py-4 font-semibold text-slate-600 text-center w-28 whitespace-nowrap">
                  Kiểm tra
                </th>
                <th className="px-6 py-4 font-semibold text-slate-600 min-w-[200px] whitespace-nowrap">
                  Giáo viên giảng dạy
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-600 bg-white">
              {dataHienThi?.map((item) => {
                return (
                  <tr
                    key={item.id}
                    className="hover:bg-blue-50/20 transition-colors duration-150 ease-in-out"
                  >
                    {/* Mã môn học */}
                    <td className="px-6 py-4 align-middle whitespace-nowrap">
                      <span className="font-mono font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md text-xs tracking-wider">
                        {item.maMonHoc}
                      </span>
                    </td>

                    {/* Tên môn học */}
                    <td className="px-6 py-4 align-middle whitespace-nowrap">
                      <div className="max-w-md">
                        <div
                          className="font-semibold text-slate-800 text-[14px] inline-block cursor-pointer hover:text-blue-600 active:scale-95 transition-all duration-150"
                          onClick={() => navigate(`${item.id}`)}
                        >
                          {item.tenMonHoc ?? "N/A"}
                        </div>
                      </div>
                    </td>

                    {/* Số tín chỉ */}
                    <td className="px-6 py-4 align-middle text-center font-semibold text-slate-700 whitespace-nowrap">
                      {item.soTinChi ?? 0}
                    </td>

                    {/* Cột Số giờ Lý thuyết */}
                    <td className="px-4 py-4 align-middle text-center font-medium text-slate-600 tabular-nums whitespace-nowrap">
                      {item.soGioLyThuyet ?? 0}
                    </td>

                    {/* Cột Số giờ Thực hành */}
                    <td className="px-4 py-4 align-middle text-center font-medium text-slate-600 tabular-nums whitespace-nowrap">
                      {item.soGioThucHanh ?? 0}
                    </td>

                    {/* Cột Số giờ Kiểm tra */}
                    <td className="px-4 py-4 align-middle text-center font-medium text-slate-600 tabular-nums whitespace-nowrap">
                      {item.soGioKiemTra ?? 0}
                    </td>

                    {/* Giáo viên giảng dạy */}
                    <td className="px-6 py-4 align-middle text-sm font-medium whitespace-nowrap">
                      {item.teacher ?? "--"}
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
