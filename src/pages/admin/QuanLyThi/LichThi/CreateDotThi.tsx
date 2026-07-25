import React, { useState } from 'react'
import { X, Search, BookOpen, Calendar, CheckCircle2, Users } from 'lucide-react'
import { $api } from '../../../../api/client'
import type { components } from '../../../../api/v1'
import { toast } from 'sonner'

export type CreateDotThiDto = components['schemas']['CreateExamScheduleDto']

interface ModalCreateDotThiProps {
  isOpen: boolean
  onClose: () => void
  semesterId?: number
  onSuccess?: () => void
}

const ModalCreateDotThi: React.FC<ModalCreateDotThiProps> = ({ isOpen, onClose, semesterId, onSuccess }) => {
  // --- States tìm kiếm & chọn lớp HP ---
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedClassSubjectId, setSelectedClassSubjectId] = useState<number | null>(null)

  // --- States Form đợt thi ---
  const [formData, setFormData] = useState<Omit<CreateDotThiDto, 'classSubjectId'>>({
    examDate: new Date().toISOString().split('T')[0],
    examTurn: 1,
    startTime: '07:30',
    endTime: '09:30',
    shift: 'Sáng',
    roomId: null,
    note: '',
  })

  // --- Fetch Data ---
  // Query danh sách ClassSubject theo semesterId truyền vào
  const { data: classSubjects, isLoading: isLoadingClassSubjects } = $api.useQuery(
    'get',
    '/class-subject',
    {
      params: {
        query: {
          semesterId: semesterId,
        },
      },
    },
    {
      enabled: isOpen && !!semesterId, // Chỉ fetch khi Modal mở và có semesterId
    },
  )

  // Query danh sách Phòng học
  const { data: rooms } = $api.useQuery('get', '/rooms', {}, { enabled: isOpen })

  // Mutation Tạo đợt thi
  const { mutate: createDotThi, isPending: isCreating } = $api.useMutation('post', '/exam-schedules', {
    onSuccess: () => {
      toast.success('Tạo đợt thi thành công! Sinh viên đủ điều kiện đã được tự động thêm vào đợt thi.')
      onSuccess?.()
      handleClose()
    },
    onError: () => {
      toast.error('Có lỗi xảy ra khi tạo đợt thi!')
    },
  })

  // Reset & Đóng modal
  const handleClose = () => {
    setSelectedClassSubjectId(null)
    setSearchTerm('')
    setFormData({
      examDate: new Date().toISOString().split('T')[0],
      examTurn: 1,
      startTime: '07:30',
      endTime: '09:30',
      shift: 'Sáng',
      roomId: null,
      note: '',
    })
    onClose()
  }

  // Submit Form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedClassSubjectId) {
      toast.error('Vui lòng chọn một Lớp học phần ở cột bên trái!')
      return
    }

    const payload: CreateDotThiDto = {
      classSubjectId: selectedClassSubjectId,
      ...formData,
    }

    createDotThi({
      body: payload,
    })
  }

  // Lọc danh sách Lớp HP theo từ khóa
  const filteredClassSubjects = classSubjects?.filter((cs) => {
    const classCode = cs.baseClass?.classCode || ''
    const subjectName = cs.subject?.subjectName || ''
    const semesterName = cs.semester?.name || cs.semester?.name || ''
    const fullText = `${classCode} ${subjectName} ${semesterName}`.toLowerCase()
    return fullText.includes(searchTerm.toLowerCase())
  })

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        {/* --- HEADER --- */}
        <div className="flex shrink-0 items-center justify-between bg-indigo-600 px-6 py-4 text-white">
          <div className="flex items-center gap-2.5">
            <Calendar className="h-5 w-5 text-indigo-200" />
            <h2 className="text-lg font-bold">Tạo Đợt Thi Mới</h2>
          </div>
          <button
            onClick={handleClose}
            className="rounded-lg p-1.5 text-indigo-200 transition-colors hover:bg-indigo-700/50 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* --- BODY (LAYOUT 2 CỘT) --- */}
        <form onSubmit={handleSubmit} className="grid flex-1 grid-cols-1 overflow-hidden md:grid-cols-12">
          {/* ================= CỘT TRÁI: ĐANH SÁCH LỚP HỌC PHẦN ================= */}
          <div className="flex flex-col overflow-hidden border-r border-slate-200 bg-slate-50 p-4 md:col-span-5">
            <div className="mb-3">
              <label className="mb-2 block text-xs font-semibold tracking-wider text-slate-700 uppercase">
                1. Chọn Lớp học phần <span className="text-red-500">*</span>
              </label>

              {/* Thanh tìm kiếm */}
              <div className="relative">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm theo mã lớp, tên môn..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white py-2 pr-3 pl-9 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            {/* List Lớp HP */}
            <div className="flex-1 space-y-2 overflow-y-auto pr-1">
              {isLoadingClassSubjects ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  Đang tải danh sách lớp học phần...
                </div>
              ) : !semesterId ? (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 py-8 text-center text-xs text-amber-600">
                  Chưa chọn Học kỳ ở trang chính. Vui lòng chọn Học kỳ trước!
                </div>
              ) : filteredClassSubjects?.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  Không tìm thấy lớp học phần phù hợp.
                </div>
              ) : (
                filteredClassSubjects?.map((cs) => {
                  const isSelected = selectedClassSubjectId === cs.id
                  const classCode = cs.baseClass?.classCode || `Lớp #${cs.classId || cs.id}`
                  const subjectName = cs.subject?.subjectName || 'Chưa có tên môn'
                  const semesterName = cs.semester?.name || cs.semester?.name || ''

                  return (
                    <div
                      key={cs.id}
                      onClick={() => setSelectedClassSubjectId(cs.id)}
                      className={`relative cursor-pointer rounded-xl border p-3 text-xs transition-all ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/80 shadow-sm'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-100/60'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5 font-bold text-slate-800">
                          <BookOpen
                            className={`h-3.5 w-3.5 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`}
                          />
                          {subjectName}
                        </div>
                        {isSelected && <CheckCircle2 className="h-4 w-4 shrink-0 text-indigo-600" />}
                      </div>

                      <div className="mt-1.5 flex flex-wrap items-center gap-2 text-slate-600">
                        <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                          Lớp: {classCode}
                        </span>
                        {semesterName && <span className="text-[11px] text-slate-500">• {semesterName}</span>}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* ================= CỘT PHẢI: THÔNG TIN ĐỢT THI ================= */}
          <div className="flex flex-col justify-between space-y-4 overflow-y-auto bg-white p-6 md:col-span-7">
            <div className="space-y-4">
              <label className="block text-xs font-semibold tracking-wider text-slate-700 uppercase">
                2. Thiết lập thông tin đợt thi
              </label>

              {/* Ngày thi & Lần thi */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">
                    Ngày thi <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      required
                      value={formData.examDate}
                      onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">
                    Đợt / Lần thi <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={formData.examTurn}
                    onChange={(e) => setFormData({ ...formData, examTurn: Number(e.target.value) })}
                    className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Ca thi & Phòng thi */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">Ca thi</label>
                  <select
                    value={formData.shift || ''}
                    onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="Sáng">Ca Sáng</option>
                    <option value="Chiều">Ca Chiều</option>
                    <option value="Tối">Ca Tối</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">Phòng thi</label>
                  <select
                    value={formData.roomId || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, roomId: e.target.value ? Number(e.target.value) : null })
                    }
                    className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="">-- Chọn phòng thi --</option>
                    {rooms?.map((room) => (
                      <option key={room.id} value={room.id}>
                        {room.roomCode} {room.building ? `(${room.building})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Giờ bắt đầu & Giờ kết thúc */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">Giờ bắt đầu</label>
                  <input
                    type="time"
                    value={formData.startTime || ''}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">Giờ kết thúc</label>
                  <input
                    type="time"
                    value={formData.endTime || ''}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Ghi chú */}
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Ghi chú</label>
                <textarea
                  rows={3}
                  placeholder="Ghi chú thêm cho đợt thi này..."
                  value={formData.note || ''}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  className="w-full resize-none rounded-lg border border-slate-300 bg-white p-2.5 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* Banner thông báo nghiệp vụ */}
              <div className="flex items-start gap-2.5 rounded-xl border border-indigo-100 bg-indigo-50 p-3 text-xs text-indigo-900">
                <Users className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />
                <div>
                  <span className="font-semibold">Tự động xét điều kiện dự thi:</span> Khi bấm tạo, hệ thống
                  sẽ tự động quét danh sách sinh viên của lớp HP và gán những sinh viên vắng ít hơn 20% số
                  tiết vào phòng thi này.
                </div>
              </div>
            </div>

            {/* --- FOOTER BUTTONS --- */}
            <div className="mt-4 flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-lg px-4 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={isCreating || !selectedClassSubjectId}
                className="rounded-lg bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isCreating ? 'Đang tạo đợt thi...' : 'Tạo đợt thi'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ModalCreateDotThi
