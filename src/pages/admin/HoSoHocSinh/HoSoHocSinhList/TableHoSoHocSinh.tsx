import { useMemo, useState } from 'react'
import { useReactTable, getCoreRowModel, flexRender, type ColumnDef } from '@tanstack/react-table'
import { useHocSinhContext } from '../HocSinhProvider'
import { formatDate } from '../../../../util/formatDate'
import { STUDENT_STATUS_TABS, type StudentStatusEnum } from '../../../../api/enum'
import type { StudentDetailDto } from '../../../../api/entity'
import { $api } from '../../../../api/client'
import HoSoDetailModal from '../../TuyenSinh/HoSoTuyenSinh/One/HoSoDetailModal'

// Map hiển thị Trạng thái sang Tiếng Việt & Màu sắc Badge
const STATUS_CONFIG: Record<StudentStatusEnum, { label: string; className: string }> = {
  STUDYING: {
    label: 'Đang học',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  SUSPENDED: {
    label: 'Bảo lưu',
    className: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  DROPPED: {
    label: 'Thôi học',
    className: 'bg-rose-50 text-rose-700 border-rose-200',
  },
  GRADUATED: {
    label: 'Đã tốt nghiệp',
    className: 'bg-blue-50 text-blue-700 border-blue-200',
  },
}

const TableHoSoHocSinh = () => {
  const { navigate, students, isLoadingStudents, filters, setFilters, total } = useHocSinhContext()

  // State lưu studentId khi người dùng bấm nút xem
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null)

  // Fetch dữ liệu Admission Profile theo studentId
  const {
    data: profileData,
    isLoading: isGettingAdmissionProfile,
    refetch: refetchProfile,
  } = $api.useQuery(
    'get',
    '/admission-profiles/student/{studentId}',
    {
      params: {
        path: {
          studentId: selectedStudentId!,
        },
      },
    },
    {
      enabled: selectedStudentId !== null, // Chỉ tự động gọi khi đã chọn studentId
    },
  )

  // Hàm mở Modal
  const handleOpenModal = (studentId: number) => {
    setSelectedStudentId(studentId)
  }

  // Hàm đóng Modal & reset state
  const handleCloseModal = () => {
    setSelectedStudentId(null)
  }

  const currentTab = filters.status || ''
  const currentPage = filters.page || 1
  const pageSize = filters.limit || 10
  const totalPages = Math.ceil((total || 0) / pageSize) || 1

  const handleTabChange = (status: StudentStatusEnum | undefined) => {
    setFilters((prev) => ({
      ...prev,
      page: 1,
      status: status || undefined,
    }))
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setFilters((prev) => ({ ...prev, page: newPage }))
    }
  }

  // Khai báo cấu trúc các cột hiển thị
  const columns = useMemo<ColumnDef<StudentDetailDto>[]>(
    () => [
      {
        id: 'stt',
        header: 'STT',
        cell: (info) => (currentPage - 1) * pageSize + info.row.index + 1,
        meta: { className: 'w-[60px] text-center' },
      },
      {
        id: 'fullName',
        header: 'Họ và tên',
        cell: ({ row }) => (
          <span className="text-[13px] font-bold text-slate-800">
            {row.original.fullName || 'Chưa cập nhật'}
          </span>
        ),
      },
      {
        id: 'dob',
        header: 'Ngày sinh',
        cell: ({ row }) =>
          row.original.dob ? (
            <span className="text-xs text-slate-600">{formatDate(String(row.original.dob))}</span>
          ) : (
            <span className="text-xs text-slate-400">-</span>
          ),
      },
      {
        id: 'studentCode',
        header: 'Mã học sinh',
        cell: ({ row }) => (
          <span className="rounded border border-indigo-100 bg-indigo-50 px-2 py-0.5 font-mono text-xs font-semibold text-indigo-600">
            {row.original.studentCode || '-'}
          </span>
        ),
      },
      {
        id: 'class',
        header: 'Lớp học',
        cell: ({ row }) => row.original.class?.classCode || '-',
      },
      {
        id: 'batch',
        header: 'Khóa đào tạo',
        cell: ({ row }) => row.original.batch?.batchCode || '-',
      },
      {
        id: 'status',
        header: 'Trạng thái',
        cell: ({ row }) => {
          const statusKey = row.original.status as StudentStatusEnum
          const config = STATUS_CONFIG[statusKey]

          if (!config) {
            return <span className="text-xs text-slate-400">-</span>
          }

          return (
            <span
              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${config.className}`}
            >
              {config.label}
            </span>
          )
        },
      },
      {
        id: 'actions',
        header: 'Thao tác',
        meta: { className: 'text-right pr-6' },
        cell: ({ row }) => {
          const student = row.original
          return (
            <div className="flex items-center justify-end gap-1">
              {/* Nút 1: Mở Modal Hồ Sơ Detail */}
              <button
                type="button"
                onClick={() => handleOpenModal(student.id)}
                title="Xem hồ sơ đăng ký"
                className="rounded-lg border border-transparent p-1.5 text-slate-500 transition-colors hover:border-indigo-100 hover:bg-indigo-50 hover:text-indigo-600"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </button>
            </div>
          )
        },
      },
    ],
    [currentPage, pageSize, navigate],
  )

  const table = useReactTable({
    data: students || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="relative flex w-full flex-col gap-4">
      {/* THANH LỌC TRẠNG THÁI (TABS) */}
      <div className="flex items-center justify-between border-b border-slate-200 px-2 pb-2">
        <div className="custom-scrollbar flex min-w-0 flex-1 gap-6 overflow-x-auto">
          {STUDENT_STATUS_TABS.map((tab) => {
            const isActive = currentTab === tab.value
            return (
              <button
                key={tab.value || 'all'}
                onClick={() => handleTabChange(tab.value)}
                className={`relative pb-2 text-sm font-medium whitespace-nowrap transition-all ${
                  isActive ? 'font-bold text-indigo-600' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab.label}
                {isActive && (
                  <div className="animate-fadeIn absolute right-0 bottom-[-1px] left-0 h-[2px] rounded-full bg-indigo-600" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* BẢNG DỮ LIỆU */}
      <div className="w-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-slate-200 bg-slate-50/70">
                  {headerGroup.headers.map((header) => {
                    const meta = header.column.columnDef.meta as { className?: string }
                    return (
                      <th
                        key={header.id}
                        className={`px-5 py-4 text-[11px] font-bold tracking-wider text-slate-500 uppercase ${
                          meta?.className || ''
                        }`}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    )
                  })}
                </tr>
              ))}
            </thead>

            <tbody className="divide-y divide-slate-100">
              {isLoadingStudents ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    {Array.from({ length: columns.length }).map((_, colIdx) => (
                      <td key={colIdx} className="px-5 py-4">
                        <div className="h-4 w-full max-w-[120px] rounded-md bg-slate-200/80"></div>
                      </td>
                    ))}
                  </tr>
                ))
              ) : table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="group transition-colors hover:bg-slate-50/40">
                    {row.getVisibleCells().map((cell) => {
                      const meta = cell.column.columnDef.meta as { className?: string }
                      return (
                        <td key={cell.id} className={`px-5 py-3.5 text-slate-700 ${meta?.className || ''}`}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      )
                    })}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="h-32 bg-slate-50/20 text-center font-medium text-slate-400"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <span className="text-xl">📭</span>
                      <span>Không tìm thấy dữ liệu học sinh nào.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* THANH PHÂN TRANG */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <div className="text-sm text-slate-500">
            Hiển thị dòng{' '}
            <span className="font-semibold text-slate-700">{(currentPage - 1) * pageSize + 1}</span> -{' '}
            <span className="font-semibold text-slate-700">
              {Math.min(currentPage * pageSize, total || 0)}
            </span>{' '}
            trên tổng số <span className="font-semibold text-slate-700">{total}</span> học sinh
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || isLoadingStudents}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white"
            >
              Trước
            </button>

            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNum = i + 1
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  disabled={isLoadingStudents}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium transition-colors ${
                    currentPage === pageNum
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'border border-transparent text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {pageNum}
                </button>
              )
            })}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || isLoadingStudents}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white"
            >
              Sau
            </button>
          </div>
        </div>
      )}

      {/* MODAL CHI TIẾT HỒ SƠ */}
      {selectedStudentId !== null && (
        <>
          {isGettingAdmissionProfile ? (
            /* Backdrop Loading tạm thời trong lúc chờ API trả về profile */
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-3 rounded-2xl bg-white px-6 py-5 shadow-xl">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
                <p className="text-sm font-medium text-slate-600">Đang tải thông tin hồ sơ...</p>
              </div>
            </div>
          ) : (
            <HoSoDetailModal
              profileId={profileData?.profile?.id ?? 0}
              profile={profileData?.profile}
              onClose={handleCloseModal}
              onRefetch={refetchProfile}
            />
          )}
        </>
      )}
    </div>
  )
}

export default TableHoSoHocSinh
