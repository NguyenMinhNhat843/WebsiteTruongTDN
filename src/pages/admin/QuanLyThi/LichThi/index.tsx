import { useState } from 'react'
import {
  Calendar,
  Clock,
  MapPin,
  Plus,
  Filter,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  BookOpen,
  Eye,
} from 'lucide-react'
import { $api } from '../../../../api/client'
import type { components } from '../../../../api/v1'
import ModalCreateDotThi from './CreateDotThi'
import ModalDotThiDetail from './One/DotThiDetail'

export type CreateExamScheduleDto = components['schemas']['CreateExamScheduleDto']

const LichThiIndex = () => {
  // --- States mở Modal Tạo đợt thi ---
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  // --- States mở Modal Chi tiết đợt thi ---
  const [selectedDetailId, setSelectedDetailId] = useState<number | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false)

  // --- States bộ lọc ---
  const [selectedSemesterId, setSelectedSemesterId] = useState<number | undefined>(undefined)
  const [selectedRoomId, setSelectedRoomId] = useState<number | undefined>(undefined)
  const [examDate, setExamDate] = useState<string>('')
  const [shift, setShift] = useState<string>('')
  const [examTurn, setExamTurn] = useState<number | undefined>(undefined)

  // --- States phân trang ---
  const [page, setPage] = useState<number>(1)
  const [limit] = useState<number>(10)

  // --- Fetch API ---
  const { data: semesters } = $api.useQuery('get', '/semesters')
  const { data: rooms } = $api.useQuery('get', '/rooms')

  // Lấy danh sách đợt thi
  const {
    data: examSchedulesData,
    isLoading: isLoadingExamSchedules,
    refetch: refetchExamSchedules,
  } = $api.useQuery('get', '/exam-schedules', {
    params: {
      query: {
        limit,
        page,
        examDate: examDate || undefined,
        examTurn: examTurn ? Number(examTurn) : undefined,
        shift: shift || undefined,
        roomId: selectedRoomId,
      },
    },
  })

  // Reset bộ lọc
  const handleResetFilters = () => {
    setSelectedSemesterId(undefined)
    setSelectedRoomId(undefined)
    setExamDate('')
    setShift('')
    setExamTurn(undefined)
    setPage(1)
  }

  // Hàm mở modal chi tiết
  const handleOpenDetail = (id: number) => {
    setSelectedDetailId(id)
    setIsDetailOpen(true)
  }

  // Tính toán số trang
  const totalItems = examSchedulesData?.total || 0
  const totalPages = Math.ceil(totalItems / limit) || 1

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-6">
      {/* --- HEADER --- */}
      <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-800">
            <Calendar className="h-7 w-7 text-indigo-600" />
            Quản lý Lịch thi & Đợt thi
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Lập kế hoạch đợt thi và tự động gán sinh viên đủ điều kiện dự thi
          </p>
        </div>

        {/* NÚT MỞ MODAL TẠO ĐỢT THI MỚI */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 active:bg-indigo-800"
        >
          <Plus className="h-4 w-4" />
          Tạo đợt thi mới
        </button>
      </div>

      {/* --- BỘ LỌC (FILTERS) --- */}
      <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Filter className="h-4 w-4 text-indigo-600" />
            Bộ lọc tìm kiếm
          </div>
          <button
            onClick={handleResetFilters}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-500 transition-colors hover:text-indigo-600"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Xóa bộ lọc
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
          {/* Học kỳ */}
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Học kỳ</label>
            <select
              value={selectedSemesterId || ''}
              onChange={(e) => {
                setSelectedSemesterId(e.target.value ? Number(e.target.value) : undefined)
              }}
              className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="">-- Tất cả học kỳ --</option>
              {semesters?.map((sem) => (
                <option key={sem.id} value={sem.id}>
                  {sem.name} {sem.isCurrent ? '⭐ (Hiện tại)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Phòng thi */}
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Phòng thi</label>
            <select
              value={selectedRoomId || ''}
              onChange={(e) => setSelectedRoomId(e.target.value ? Number(e.target.value) : undefined)}
              className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="">-- Tất cả phòng thi --</option>
              {rooms?.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.roomCode} ({room.building || 'N/A'})
                </option>
              ))}
            </select>
          </div>

          {/* Ngày thi */}
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Ngày thi</label>
            <input
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Ca thi */}
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Ca thi</label>
            <select
              value={shift}
              onChange={(e) => setShift(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="">-- Tất cả ca --</option>
              <option value="Sáng">Ca Sáng</option>
              <option value="Chiều">Ca Chiều</option>
              <option value="Tối">Ca Tối</option>
            </select>
          </div>

          {/* Đợt thi / Kíp thi */}
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Đợt/Lần thi</label>
            <input
              type="number"
              placeholder="Ví dụ: 1, 2"
              value={examTurn || ''}
              onChange={(e) => setExamTurn(e.target.value ? Number(e.target.value) : undefined)}
              className="w-full rounded-lg border border-slate-300 bg-white p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* --- DANH SÁCH ĐỢT THI (TABLE) --- */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold tracking-wider text-slate-600 uppercase">
                <th className="px-4 py-3.5">Mã / Lớp HP</th>
                <th className="px-4 py-3.5">Ngày thi</th>
                <th className="px-4 py-3.5">Thời gian / Ca</th>
                <th className="px-4 py-3.5">Phòng thi</th>
                <th className="px-4 py-3.5 text-center">Đợt thi</th>
                <th className="px-4 py-3.5 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {isLoadingExamSchedules ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <RefreshCw className="mx-auto mb-2 h-6 w-6 animate-spin text-indigo-600" />
                    Đang tải danh sách lịch thi...
                  </td>
                </tr>
              ) : examSchedulesData?.data?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <AlertCircle className="mx-auto mb-2 h-8 w-8 text-slate-400" />
                    Không tìm thấy lịch thi nào phù hợp.
                  </td>
                </tr>
              ) : (
                examSchedulesData?.data?.map((item) => (
                  <tr key={item.id} className="transition-colors hover:bg-slate-50">
                    {/* Mã / Lớp HP */}
                    <td className="px-4 py-3.5">
                      <div className="flex flex-col">
                        <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                          <BookOpen className="h-4 w-4 text-indigo-600" />
                          {item.classSubject?.subject?.subjectName || 'N/A'}
                        </span>
                        <span className="mt-0.5 text-xs text-slate-500">
                          Lớp: {item.classSubject?.baseClass?.classCode || `#${item.classSubjectId}`}
                        </span>
                      </div>
                    </td>

                    {/* Ngày thi */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 font-medium text-slate-700">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        {new Date(item.examDate).toLocaleDateString('vi-VN')}
                      </div>
                    </td>

                    {/* Thời gian & Ca */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="flex items-center gap-1 font-medium text-slate-700">
                          <Clock className="h-3.5 w-3.5 text-slate-400" />
                          {item.startTime && item.endTime
                            ? `${item.startTime} - ${item.endTime}`
                            : 'Chưa xếp'}
                        </span>
                        {item.shift && (
                          <span className="mt-0.5 text-xs text-slate-500">Ca: {item.shift}</span>
                        )}
                      </div>
                    </td>

                    {/* Phòng thi */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      {item.room ? (
                        <span className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                          <MapPin className="h-3.5 w-3.5" />
                          {item.room.roomCode} ({item.room.building || 'N/A'})
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Chưa xếp phòng</span>
                      )}
                    </td>

                    {/* Đợt thi */}
                    <td className="px-4 py-3.5 text-center font-semibold text-slate-700">
                      Lần {item.examTurn}
                    </td>

                    {/* Thao tác (Icon con mắt mở chi tiết) */}
                    <td className="px-4 py-3.5 text-center">
                      <button
                        onClick={() => handleOpenDetail(item.id)}
                        title="Xem chi tiết đợt thi"
                        className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-indigo-50 hover:text-indigo-600 active:bg-indigo-100"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* --- PHÂN TRANG (PAGINATION) --- */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-5 py-3.5 text-xs text-slate-600">
          <div>
            Hiển thị{' '}
            <span className="font-semibold text-slate-800">{examSchedulesData?.data?.length || 0}</span> /{' '}
            <span className="font-semibold text-slate-800">{totalItems}</span> đợt thi
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className="rounded-lg border border-slate-300 bg-white p-1.5 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="font-medium">
              Trang {page} / {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-lg border border-slate-300 bg-white p-1.5 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* --- COMPONENT MODAL TẠO ĐỢT THI MỚI --- */}
      <ModalCreateDotThi
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        semesterId={selectedSemesterId}
        onSuccess={() => {
          refetchExamSchedules()
        }}
      />

      {/* --- COMPONENT MODAL CHI TIẾT ĐỢT THI --- */}
      <ModalDotThiDetail
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false)
          setSelectedDetailId(null)
        }}
        examScheduleId={selectedDetailId}
      />
    </div>
  )
}

export default LichThiIndex
