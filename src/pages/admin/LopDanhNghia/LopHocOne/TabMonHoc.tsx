import { useLopHocOneContext } from './LopHocOneProvider'
import { useNavigate } from 'react-router-dom'

const TabMonHoc = () => {
  const navigate = useNavigate()

  const { classSubjects, isClassSubjectsLoading, isHocKysLoading } = useLopHocOneContext()

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
  }))

  if (isHocKysLoading || isClassSubjectsLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-100 bg-white py-20 shadow-sm">
        <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-slate-200 border-t-blue-600"></div>
        <span className="text-sm font-medium tracking-wide text-slate-500">Đang tải cấu trúc môn học...</span>
      </div>
    )
  }

  return (
    <div className="mb-32 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      {/* HEADER SECTION */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-100 bg-white p-6 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-base font-bold tracking-tight text-slate-800">Chương trình môn học</h3>
          <p className="mt-0.5 text-xs text-slate-400">Danh sách các môn học phân phối theo từng học kỳ</p>
        </div>
      </div>

      {/* CONTENT SECTION (BẢNG HIỂN THỊ) */}
      {!dataHienThi || dataHienThi.length === 0 ? (
        <div className="bg-slate-50/30 px-4 py-16 text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-400">
            !
          </div>
          <p className="mx-auto max-w-xs text-sm leading-relaxed font-medium text-slate-500">
            Không có môn học nào được xếp lịch trong học kỳ này.
          </p>
        </div>
      ) : (
        /* Thêm custom-scrollbar và overflow-x-auto giúp cuộn mượt khi bảng dài */
        <div className="custom-scrollbar overflow-x-auto">
          <table className="w-full min-w-[800px] border-collapse text-left">
            <thead>
              <tr className="border-slate-150 border-b bg-slate-50/70 text-xs font-bold tracking-wider text-slate-500 uppercase">
                {/* Dùng whitespace-nowrap ngăn các thẻ th rớt dòng */}
                <th className="w-40 px-6 py-4 font-semibold whitespace-nowrap text-slate-600">Mã môn học</th>
                <th className="min-w-[240px] px-6 py-4 font-semibold whitespace-nowrap text-slate-600">
                  Tên môn học
                </th>
                <th className="w-32 px-6 py-4 text-center font-semibold whitespace-nowrap text-slate-600">
                  Số tín chỉ
                </th>
                <th className="w-28 px-4 py-4 text-center font-semibold whitespace-nowrap text-slate-600">
                  Lý thuyết
                </th>
                <th className="w-28 px-4 py-4 text-center font-semibold whitespace-nowrap text-slate-600">
                  Thực hành
                </th>
                <th className="w-28 px-4 py-4 text-center font-semibold whitespace-nowrap text-slate-600">
                  Kiểm tra
                </th>
                <th className="min-w-[200px] px-6 py-4 font-semibold whitespace-nowrap text-slate-600">
                  Giáo viên giảng dạy
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white text-sm text-slate-600">
              {dataHienThi?.map((item) => {
                return (
                  <tr
                    key={item.id}
                    className="transition-colors duration-150 ease-in-out hover:bg-blue-50/20"
                  >
                    {/* Mã môn học */}
                    <td className="px-6 py-4 align-middle whitespace-nowrap">
                      <span className="rounded-md bg-blue-50 px-2.5 py-1 font-mono text-xs font-semibold tracking-wider text-blue-600">
                        {item.maMonHoc}
                      </span>
                    </td>

                    {/* Tên môn học */}
                    <td className="px-6 py-4 align-middle whitespace-nowrap">
                      <div className="max-w-md">
                        <div
                          className="inline-block cursor-pointer text-[14px] font-semibold text-slate-800 transition-all duration-150 hover:text-blue-600 active:scale-95"
                          onClick={() => navigate(`/admin/quan-ly-diem/nhap-diem/${item.id}`)}
                        >
                          {item.tenMonHoc ?? 'N/A'}
                        </div>
                      </div>
                    </td>

                    {/* Số tín chỉ */}
                    <td className="px-6 py-4 text-center align-middle font-semibold whitespace-nowrap text-slate-700">
                      {item.soTinChi ?? 0}
                    </td>

                    {/* Cột Số giờ Lý thuyết */}
                    <td className="px-4 py-4 text-center align-middle font-medium whitespace-nowrap text-slate-600 tabular-nums">
                      {item.soGioLyThuyet ?? 0}
                    </td>

                    {/* Cột Số giờ Thực hành */}
                    <td className="px-4 py-4 text-center align-middle font-medium whitespace-nowrap text-slate-600 tabular-nums">
                      {item.soGioThucHanh ?? 0}
                    </td>

                    {/* Cột Số giờ Kiểm tra */}
                    <td className="px-4 py-4 text-center align-middle font-medium whitespace-nowrap text-slate-600 tabular-nums">
                      {item.soGioKiemTra ?? 0}
                    </td>

                    {/* Giáo viên giảng dạy */}
                    <td className="px-6 py-4 align-middle text-sm font-medium whitespace-nowrap">
                      {item.teacher ?? '--'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default TabMonHoc
