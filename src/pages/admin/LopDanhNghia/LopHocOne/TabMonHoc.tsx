import { useAppContext } from "../../../../AppProvider";
import { useLopHocOneContext } from "./LopHocOneProvider";
import { SelectOption } from "../../../../components/ui/Form/SelectOption";
import { useNavigate } from "react-router-dom";

const TabMonHoc = () => {
  const navigate = useNavigate();
  const { hocKysData, isHocKysLoading } = useAppContext();
  const {
    selectedSemesterId,
    setselectedSemesterId,
    classSubjects,
    isClassSubjectsLoading,
    isGiaoViensLoading,
    dataGiaoViens,
  } = useLopHocOneContext();

  const dataGiaoVienHienThi = dataGiaoViens?.map((gv) => ({
    id: gv.id,
    fullName: gv.fullName,
  }));

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
    // Đã làm phẳng thành 1 khối duy nhất (Block đơn), loại bỏ block bọc Table thừa phía trong
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
        <div className="flex items-center gap-2.5">
          <SelectOption
            containerClassName="w-52"
            value={selectedSemesterId ?? ""}
            onChange={(e) => setselectedSemesterId(Number(e.target.value))}
            options={hocKysData?.map((hocKy) => ({
              value: hocKy.id,
              label: `${hocKy.name} ${hocKy.isCurrent ? "(Hiện tại)" : ""}`,
            }))}
          />
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
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-150">
                <th className="px-6 py-4 font-semibold text-slate-600 w-36">
                  Mã môn học
                </th>
                <th className="px-6 py-4 font-semibold text-slate-600">
                  Tên môn học
                </th>
                <th className="px-6 py-4 font-semibold text-slate-600 text-center w-32">
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
                <th className="px-6 py-4 font-semibold text-slate-600 w-60">
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
                    <td className="px-6 py-4 align-middle">
                      <span className="font-mono font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md text-xs tracking-wider">
                        {item.maMonHoc}
                      </span>
                    </td>

                    {/* Tên môn học */}
                    <td className="px-6 py-4 align-middle">
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
                    <td className="px-6 py-4 align-middle text-center font-semibold text-slate-700">
                      {item.soTinChi ?? 0}
                    </td>

                    {/* Cột Số giờ Lý thuyết */}
                    <td className="px-4 py-4 align-middle text-center font-medium text-slate-600 tabular-nums">
                      {item.soGioLyThuyet ?? 0}{" "}
                    </td>

                    {/* Cột Số giờ Thực hành */}
                    <td className="px-4 py-4 align-middle text-center font-medium text-slate-600 tabular-nums">
                      {item.soGioThucHanh ?? 0}{" "}
                    </td>

                    {/* Cột Số giờ Kiểm tra */}
                    <td className="px-4 py-4 align-middle text-center font-medium text-slate-600 tabular-nums">
                      {item.soGioKiemTra ?? 0}{" "}
                    </td>

                    {/* Giáo viên giảng dạy */}
                    <td className="px-6 py-4 align-middle min-w-50 text-sm font-medium">
                      {isGiaoViensLoading ? (
                        <span className="text-slate-400 text-xs italic animate-pulse">
                          Đang tải dữ liệu...
                        </span>
                      ) : item.giaoVienId ? (
                        <span className="text-slate-700">
                          {dataGiaoVienHienThi?.find(
                            (gv) => gv.id === item.giaoVienId,
                          )?.fullName || "Không tìm thấy giáo viên"}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic font-normal">
                          Chưa phân công
                        </span>
                      )}
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
