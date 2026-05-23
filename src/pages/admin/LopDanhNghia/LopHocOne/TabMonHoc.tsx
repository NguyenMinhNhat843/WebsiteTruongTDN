import { useState } from "react";
import { useAppContext } from "../../../../AppProvider";
import { useLopHocOneContext } from "./LopHocOneProvider";

const TabMonHoc = () => {
  const { hocKysData, isHocKysLoading } = useAppContext();
  const {
    selectedSemesterId,
    setselectedSemesterId,
    classSubjects,
    isClassSubjectsLoading,
    isGiaoViensLoading,
    dataGiaoViens,
    updateClassSubject,
    isPendingUpdateClassSubject, // Sử dụng biến update từ context
    refetchClassSubjects,
  } = useLopHocOneContext();

  // State cục bộ để lưu ID của classSubject nào đang được bấm cập nhật giảng viên
  const [updatingSubjectId, setUpdatingSubjectId] = useState<number | null>(
    null,
  );

  const dataGiaoVienHienThi = dataGiaoViens?.map((gv) => ({
    id: gv.id,
    fullName: gv.fullName,
  }));

  const phanGiaoVienGiangDay = (
    classSubjectId: number,
    teacherId: number | null,
  ) => {
    // Đánh dấu hàng này đang trong quá trình update để kích hoạt hiệu ứng xoay
    setUpdatingSubjectId(classSubjectId);

    updateClassSubject(
      {
        params: { path: { id: classSubjectId } },
        body: { teacherId: teacherId ?? undefined },
      },
      {
        onSuccess: () => {
          refetchClassSubjects();
          setUpdatingSubjectId(null); // Reset sau khi thành công
        },
        onError: () => {
          alert("Có lỗi xảy ra khi cập nhật giáo viên giảng dạy.");
          setUpdatingSubjectId(null); // Reset sau khi lỗi
        },
      },
    );
  };

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
                <th className="px-6 py-4 font-semibold text-slate-600 text-center w-28">
                  Số tín chỉ
                </th>
                <th className="px-6 py-4 font-semibold text-slate-600 text-center w-44">
                  Số giờ (LT / TH / KT)
                </th>
                <th className="px-6 py-4 font-semibold text-slate-600 w-60">
                  Giáo viên giảng dạy
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-600 bg-white">
              {dataHienThi?.map((item) => {
                // Xác định chính xác hàng nào đang thực hiện hành động cập nhật dữ liệu
                const isThisRowUpdating =
                  isPendingUpdateClassSubject && updatingSubjectId === item.id;

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
                        <div className="font-semibold text-slate-800 text-[14px]">
                          {item.tenMonHoc ?? "N/A"}
                        </div>
                      </div>
                    </td>

                    {/* Số tín chỉ */}
                    <td className="px-6 py-4 align-middle text-center font-semibold text-slate-700">
                      {item.soTinChi ?? 0}
                    </td>

                    {/* Số giờ */}
                    <td className="px-6 py-4 align-middle text-center">
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
                    <td className="px-6 py-4 align-middle min-w-[200px]">
                      {isGiaoViensLoading ? (
                        <div className="inline-flex items-center gap-2 text-slate-400 text-xs bg-slate-50/50 px-2.5 py-1.5 rounded-xl border border-slate-200/60 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                          Đang tải...
                        </div>
                      ) : isThisRowUpdating ? (
                        /* ĐANG UPDATE: Hiển thị trạng thái xoay riêng biệt cho đúng hàng này */
                        <div
                          className="inline-flex items-center gap-2 text-blue-600 text-xs 
                        bg-blue-50/50 px-2.5 py-1.5 rounded-xl border border-blue-100 font-medium"
                        >
                          <div
                            className="animate-spin rounded-full h-3.5 w-3.5 border-2 
                          border-slate-200 border-t-blue-600"
                          ></div>
                          Đang lưu...
                        </div>
                      ) : (
                        /* TRẠNG THÁI BÌNH THƯỜNG */
                        <div className="relative max-w-[220px]">
                          <select
                            value={item.giaoVienId || ""}
                            disabled={isPendingUpdateClassSubject} // Khóa tất cả select trong lúc đang xử lý bất kì hàng nào
                            onChange={(e) => {
                              const val = e.target.value;
                              phanGiaoVienGiangDay(
                                item.id,
                                val ? Number(val) : null,
                              );
                            }}
                            className={`w-full pl-3 pr-8 py-1.5 bg-white border rounded-xl text-sm font-medium transition-all appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/10 disabled:opacity-60 disabled:cursor-not-allowed ${
                              item.giaoVienId
                                ? "text-slate-700 border-slate-200 focus:border-indigo-500"
                                : "text-slate-400 border-slate-200 bg-slate-50/30 italic"
                            }`}
                          >
                            <option
                              value=""
                              className="text-slate-400 not-italic"
                            >
                              -- Chọn giáo viên giảng dạy --
                            </option>
                            {dataGiaoVienHienThi?.map((gv) => (
                              <option
                                key={gv.id}
                                value={gv.id}
                                className="text-slate-700 not-italic font-medium"
                              >
                                {gv.fullName}
                              </option>
                            ))}
                          </select>

                          <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none text-slate-400">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </div>
                        </div>
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
