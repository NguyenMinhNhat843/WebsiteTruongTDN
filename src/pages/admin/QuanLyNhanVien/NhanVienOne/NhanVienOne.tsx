import { BookOpen, Briefcase, Plus, ShieldCheck, Trash2, X, Loader2 } from 'lucide-react'
import Breadcrumb from '../../../../components/ui/Breadcrum'
import { formatDate } from '../../../../util/formatDate'
import { useQuanLyNguoiDungContext } from '../QuanLyNguoiDungContext'
import ButtonAction from '../../../../components/ui/ButtonAction'
import ModalMonHocGiangDay from './ModalThemMonHoc'
import RegisterModal from '../../../../features/auth/RegisterForm'
import { useState } from 'react'
import { $api } from '../../../../api/client'
import type { components } from '../../../../api/v1'

export type AddPositionDto = components['schemas']['CreateStaffPositionDto']

const NhanVienOne = () => {
  const {
    staffDetail,
    isLoadingStaffDetail,
    allSubjects,
    registerSubjectsForTeacher,
    isRegistering,
    isOpenModalMonHoc,
    setIsOpenModalMonHoc,
  } = useQuanLyNguoiDungContext()

  const [isOpenRegisterModal, setIsOpenRegisterModal] = useState(false)
  const [isOpenPositionModal, setIsOpenPositionModal] = useState(false)

  // Form State để phân công chức vụ cho nhân viên này
  const [formAssignPosition, setFormAssignPosition] = useState<{
    positionId: number | ''
    departmentId: number | ''
    startDate: string
    endDate: string
  }>({
    positionId: '',
    departmentId: staffDetail?.departmentId || '',
    startDate: new Date().toISOString().split('T')[0], // Mặc định ngày hôm nay (YYYY-MM-DD)
    endDate: '',
  })

  // 1. API Lấy danh sách chức vụ ĐÃ GÁN của nhân viên này
  const {
    data: currentPositions,
    isLoading: isLoadingCurrentPositions,
    refetch: refetchCurrentPositions,
  } = $api.useQuery(
    'get',
    '/staff-positions',
    {
      params: {
        query: {
          staffId: staffDetail!.id!,
        },
      },
    },
    {
      enabled: !!staffDetail?.id,
    },
  )

  // 2. API Lấy danh mục chức vụ hệ thống (để chọn trong Select option)
  const { data: positionsCategory, isLoading: isLoadingPositionsCategory } = $api.useQuery(
    'get',
    '/management-positions',
  )

  // 3. API Phân công / Thêm 1 chức vụ cho nhân viên này
  const { mutate: assignPosition, isPending: isAssigningPosition } = $api.useMutation(
    'post',
    '/staff-positions',
    {
      onSuccess: () => {
        refetchCurrentPositions()
        // Reset selection
        setFormAssignPosition((prev) => ({
          ...prev,
          positionId: '',
          endDate: '',
        }))
      },
    },
  )

  // 4. API Gỡ / Xóa 1 chức vụ khỏi nhân viên này
  const { mutate: deleteStaffPosition, isPending: isDeletingStaffPosition } = $api.useMutation(
    'delete',
    '/staff-positions/{id}',
    {
      onSuccess: () => {
        refetchCurrentPositions()
      },
    },
  )

  const handleAssignPosition = (e: React.FormEvent) => {
    e.preventDefault()
    if (!staffDetail?.id || !formAssignPosition.positionId) return

    const payload: AddPositionDto = {
      staffId: staffDetail.id,
      positionId: Number(formAssignPosition.positionId),
      departmentId: formAssignPosition.departmentId ? Number(formAssignPosition.departmentId) : null,
      startDate: formAssignPosition.startDate,
      endDate: formAssignPosition.endDate || null,
    }

    assignPosition({
      body: payload,
    })
  }

  const handleDeleteStaffPosition = (id: number) => {
    if (confirm('Bạn có chắc chắn muốn gỡ chức vụ này khỏi nhân viên?')) {
      deleteStaffPosition({
        params: { path: { id } },
      })
    }
  }

  if (isLoadingStaffDetail)
    return (
      <div className="flex min-h-100 items-center justify-center font-medium text-slate-500">
        <div className="mr-3 h-10 w-10 animate-spin rounded-full border-b-2 border-blue-600"></div>
        Đang tải thông tin nhân viên...
      </div>
    )

  if (!staffDetail || !staffDetail.id)
    return (
      <div className="rounded-xl border border-rose-100 bg-rose-50 p-6 text-center text-rose-600">
        Không tìm thấy thông tin chi tiết của nhân viên này hoặc dữ liệu không tồn tại.
      </div>
    )

  const {
    fullName,
    staffCode,
    avatarUrl,
    id,
    dob,
    gender,
    identityNumber,
    phone,
    address,
    departmentId,
    contractType,
    salaryCoefficient,
    hireDate,
    employeeRole,
    user,
    email,
  } = staffDetail

  const personalInfo = [
    { label: 'Ngày sinh', value: formatDate(dob) },
    {
      label: 'Giới tính',
      value: gender === true ? 'Nam' : gender === false ? 'Nữ' : '-',
    },
    { label: 'Số CCCD / CMND', value: identityNumber ?? '-' },
    { label: 'Số điện thoại', value: phone ?? '-' },
  ]

  const jobInfo = [
    { label: 'Phòng ban (ID)', value: departmentId ?? '-' },
    { label: 'Loại hợp đồng', value: contractType ?? '-' },
    { label: 'Hệ số lương', value: salaryCoefficient ?? '-' },
    { label: 'Ngày vào làm', value: formatDate(hireDate) },
    {
      label: 'Vai trò',
      value: employeeRole === 'TEACHER' ? 'Giáo viên' : 'Nhân viên hành chính',
    },
  ]

  return (
    <div className="min-h-screen space-y-6 p-6">
      <Breadcrumb
        items={[{ label: 'Hồ sơ giáo viên', link: '/admin/users' }, { label: `${fullName} - ${staffCode}` }]}
      />

      {/* HEADER PROFILE */}
      <div className="flex flex-col items-center gap-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm md:flex-row">
        <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-slate-100 shadow-md">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
          ) : (
            <span className="text-3xl font-bold text-slate-400">{fullName?.charAt(0).toUpperCase()}</span>
          )}
        </div>
        <div className="flex-1 space-y-2 text-center md:text-left">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <h1 className="text-2xl font-bold text-slate-800">{fullName}</h1>
            <div className="flex justify-center gap-2 text-xs font-semibold md:justify-start">
              {staffCode && (
                <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-slate-700">
                  {staffCode}
                </span>
              )}
              {employeeRole && (
                <span
                  className={`rounded-full border px-3 py-1 ${
                    employeeRole === 'TEACHER'
                      ? 'border-blue-100 bg-blue-50 text-blue-600'
                      : 'border-rose-100 bg-rose-50 text-rose-600'
                  }`}
                >
                  {employeeRole}
                </span>
              )}
            </div>
          </div>
          <p className="text-sm text-slate-500">Mã định danh hệ thống: #{id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* CỘT TRÁI (2/3) */}
        <div className="space-y-6 lg:col-span-2">
          {/* THÔNG TIN CÁ NHÂN */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 border-b border-slate-100 pb-3 text-lg font-bold text-slate-800">
              Thông tin cá nhân
            </h2>
            <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
              {personalInfo.map((info, idx) => (
                <div key={idx}>
                  <span className="block text-xs font-medium text-slate-400 uppercase">{info.label}</span>
                  <span className="text-sm font-semibold text-slate-700">{info.value}</span>
                </div>
              ))}
              <div className="md:col-span-2">
                <span className="block text-xs font-medium text-slate-400 uppercase">Địa chỉ liên hệ</span>
                <span className="text-sm font-semibold text-slate-700">{address ?? '-'}</span>
              </div>
            </div>
          </div>

          {/* CHỨC VỤ QUẢN LÝ ĐẢM NHIỆM */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex flex-col justify-between gap-4 border-b border-slate-100 pb-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
                  <ShieldCheck className="h-5 w-5 text-blue-600" />
                  Chức vụ quản lý
                </h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  Danh sách các chức vụ kiêm nhiệm và tỷ lệ % giảm định mức
                </p>
              </div>
              <ButtonAction label="Phân công chức vụ" onClick={() => setIsOpenPositionModal(true)} />
            </div>

            {isLoadingCurrentPositions ? (
              <div className="py-6 text-center text-sm text-slate-400">Đang tải chức vụ...</div>
            ) : currentPositions && currentPositions.length > 0 ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {currentPositions.map((item) => {
                  const posDetail = item.position
                  return (
                    <div
                      key={item.id}
                      className="flex items-start justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 transition-all hover:bg-slate-50"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-800">{posDetail?.name ?? 'N/A'}</span>
                          {posDetail?.code && (
                            <span className="rounded bg-slate-200/80 px-1.5 py-0.5 text-[10px] font-bold text-slate-700 uppercase">
                              {posDetail.code}
                            </span>
                          )}
                        </div>
                        {item.startDate && (
                          <p className="text-[11px] text-slate-400">
                            Từ: {formatDate(item.startDate)}{' '}
                            {item.endDate ? ` - Đến: ${formatDate(item.endDate)}` : ''}
                          </p>
                        )}
                      </div>
                      {posDetail?.reductionPercent !== undefined && (
                        <span className="inline-flex items-center rounded-lg border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 shadow-sm">
                          Giảm {posDetail.reductionPercent}%
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-8 text-center">
                <div className="mb-2 rounded-xl border border-slate-100 bg-white p-2.5 text-slate-400 shadow-sm">
                  <Briefcase className="h-5 w-5" />
                </div>
                <p className="text-sm font-semibold text-slate-600">Chưa giữ chức vụ quản lý nào</p>
              </div>
            )}
          </div>

          {/* DANH SÁCH MÔN GIẢNG DẠY */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col justify-between gap-4 border-b border-slate-100 pb-4 sm:flex-row sm:items-center">
              <h2 className="text-lg font-bold text-slate-800">Danh sách môn đăng ký giảng dạy</h2>
              <ButtonAction label="Đăng ký môn học giảng dạy" onClick={() => setIsOpenModalMonHoc(true)} />
            </div>

            {staffDetail?.teacherSubjects?.length ? (
              <div className="flex flex-wrap gap-2">
                {staffDetail.teacherSubjects.map((ts) => (
                  <div
                    key={ts.id}
                    className="flex items-center gap-2 rounded-xl border border-indigo-100 bg-indigo-50/50 px-3 py-1.5 text-sm font-medium text-indigo-900"
                  >
                    <span className="text-xs font-bold text-indigo-600 uppercase">
                      {ts.subject?.subjectCode}
                    </span>
                    <span>{ts.subject?.subjectName}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-12 transition-all hover:bg-slate-50/90">
                <div className="mb-3 rounded-xl border border-slate-100 bg-white p-3 text-slate-400 shadow-sm">
                  <BookOpen className="h-6 w-6 stroke-[1.75]" />
                </div>
                <p className="text-sm font-semibold text-slate-600">Chưa có thông tin đăng ký giảng dạy</p>
              </div>
            )}
          </div>
        </div>

        {/* CỘT PHẢI (1/3) */}
        <div className="space-y-6">
          {/* THÔNG TIN CÔNG VIỆC */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 border-b border-slate-100 pb-3 text-lg font-bold text-slate-800">
              Thông tin công việc
            </h2>
            <div className="space-y-4">
              {jobInfo.map((info, idx) => (
                <div key={idx}>
                  <span className="block text-xs font-medium text-slate-400 uppercase">{info.label}</span>
                  <span className="text-sm font-semibold text-slate-700">{info.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* TÀI KHOẢN LIÊN KẾT */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-800">Tài khoản liên kết</h2>
              {!user && <ButtonAction label="Tạo tài khoản" onClick={() => setIsOpenRegisterModal(true)} />}
            </div>

            {user ? (
              <div className="space-y-4">
                <div>
                  <span className="block text-xs font-medium text-slate-400 uppercase">Tên tài khoản</span>
                  <span className="font-mono text-sm font-bold text-blue-600">{user.username}</span>
                </div>
                <div>
                  <span className="block text-xs font-medium text-slate-400 uppercase">Email liên kết</span>
                  <span className="text-sm font-semibold text-slate-700">{email}</span>
                </div>
                <div>
                  <span className="block text-xs font-medium text-slate-400 uppercase">Trạng thái</span>
                  <span
                    className={`inline-flex rounded px-2 py-0.5 text-xs font-bold ${
                      user.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}
                  >
                    {user.isActive ? 'Hoạt động' : 'Đang khóa'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-amber-100 bg-amber-50 p-3 text-xs text-amber-700">
                Nhân viên này hiện chưa được kích hoạt hoặc liên kết với tài khoản người dùng hệ thống.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL PHÂN CÔNG CHỨC VỤ CHO NHÂN VIÊN */}
      {isOpenPositionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <h3 className="text-lg font-bold text-slate-800">Phân Công Chức Vụ - {fullName}</h3>
              <button
                onClick={() => setIsOpenPositionModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[75vh] space-y-6 overflow-y-auto p-5">
              {/* Form Gán Chức Vụ Mới */}
              <form
                onSubmit={handleAssignPosition}
                className="space-y-3 rounded-xl border border-blue-100 bg-blue-50/50 p-4"
              >
                <h4 className="text-xs font-bold tracking-wider text-blue-700 uppercase">Gán chức vụ mới</h4>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs font-medium text-slate-600">Chọn chức vụ (*)</label>
                    <select
                      value={formAssignPosition.positionId}
                      onChange={(e) =>
                        setFormAssignPosition((prev) => ({
                          ...prev,
                          positionId: e.target.value ? Number(e.target.value) : '',
                        }))
                      }
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      required
                    >
                      <option value="">-- Chọn chức vụ từ hệ thống --</option>
                      {isLoadingPositionsCategory ? (
                        <option disabled>Đang tải danh mục...</option>
                      ) : (
                        positionsCategory?.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({p.code}) - Giảm {p.reductionPercent}%
                          </option>
                        ))
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">Ngày bắt đầu (*)</label>
                    <input
                      type="date"
                      value={formAssignPosition.startDate}
                      onChange={(e) =>
                        setFormAssignPosition((prev) => ({
                          ...prev,
                          startDate: e.target.value,
                        }))
                      }
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">
                      Ngày kết thúc (không bắt buộc)
                    </label>
                    <input
                      type="date"
                      value={formAssignPosition.endDate}
                      onChange={(e) =>
                        setFormAssignPosition((prev) => ({
                          ...prev,
                          endDate: e.target.value,
                        }))
                      }
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isAssigningPosition}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isAssigningPosition ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Plus className="h-3.5 w-3.5" />
                    )}
                    Phân công chức vụ
                  </button>
                </div>
              </form>

              {/* Danh sách các chức vụ ĐÃ GÁN cho nhân viên này */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                  Chức vụ đang đảm nhiệm
                </h4>
                {isLoadingCurrentPositions ? (
                  <div className="py-6 text-center text-sm text-slate-400">Đang tải danh sách...</div>
                ) : !currentPositions || currentPositions.length === 0 ? (
                  <div className="py-6 text-center text-sm text-slate-400">
                    Nhân viên chưa được gán chức vụ nào.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 rounded-xl border border-slate-200">
                    {currentPositions.map((item) => {
                      const posDetail = item.position
                      return (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-3 transition-colors hover:bg-slate-50"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-slate-800">{posDetail?.name}</span>
                              {posDetail?.code && (
                                <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-600">
                                  {posDetail.code}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400">
                              Từ: {formatDate(item.startDate)}{' '}
                              {item.endDate ? ` - Đến: ${formatDate(item.endDate)}` : ''} | Giảm:{' '}
                              {posDetail?.reductionPercent}%
                            </p>
                          </div>
                          <button
                            onClick={() => handleDeleteStaffPosition(item.id)}
                            disabled={isDeletingStaffPosition}
                            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                            title="Gỡ chức vụ này khỏi nhân viên"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL MÔN HỌC */}
      <ModalMonHocGiangDay
        data={allSubjects ?? []}
        onSubmit={(subjectIds, onSuccess) => {
          registerSubjectsForTeacher(
            {
              body: {
                teacherId: staffDetail.id!,
                subjectIds,
              },
            },
            {
              onSuccess: () => {
                onSuccess()
              },
            },
          )
        }}
        isLoadingSubmit={isRegistering}
        isOpen={isOpenModalMonHoc}
        setIsOpen={setIsOpenModalMonHoc}
      />

      {/* MODAL TẠO TÀI KHOẢN */}
      <RegisterModal
        isOpen={isOpenRegisterModal}
        onClose={() => setIsOpenRegisterModal(false)}
        staffId={id}
      />
    </div>
  )
}

export default NhanVienOne
