import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { $api } from '../../../../api/client'
import { useChuongTrinhKhungContext, type CuriculumResponseDto } from '../ChuongTrinhKhungProvider'
import { FileText, Building2, Trash2, GraduationCap, Loader2, Copy, X, AlertTriangle } from 'lucide-react'
import type { components } from '../../../../api/v1'

interface Props {
  data: CuriculumResponseDto[]
  onRefresh?: () => void // Callback cập nhật dữ liệu mượt mà thay vì reload trang
}

export type CopyCurrculumDto = components['schemas']['CopyCurriculumDto']

const ChuongTrinhKhungList = ({ data, onRefresh }: Props) => {
  const { selectedId, setSelectedId } = useChuongTrinhKhungContext()

  // State quản lý Modal sao chép
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false)
  const [selectedCurriculum, setSelectedCurriculum] = useState<CuriculumResponseDto | null>(null)

  // State quản lý Modal xác nhận xóa
  const [deleteTarget, setDeleteTarget] = useState<CuriculumResponseDto | null>(null)

  // Khởi tạo React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CopyCurrculumDto>()

  // API sao chép & xóa
  const { mutate: copyCurriculum, isPending: isCopyPending } = $api.useMutation('post', '/curriculums/copy')

  const { mutate: deleteCurriculum, isPending: isDeletePending } = $api.useMutation(
    'delete',
    '/curriculums/{id}',
  )

  // Mở modal sao chép
  const handleOpenCopyModal = (e: React.MouseEvent, fw: CuriculumResponseDto) => {
    e.stopPropagation()
    setSelectedCurriculum(fw)
    setIsCopyModalOpen(true)
    reset({
      sourceCurriculumId: fw.id,
      curriculumCode: `${fw.curriculumCode}_COPY`,
      curriculumName: `${fw.curriculumName} - Bản sao`,
    })
  }

  const handleCloseCopyModal = () => {
    setIsCopyModalOpen(false)
    setSelectedCurriculum(null)
    reset()
  }

  // Mở modal xóa
  const handleOpenDeleteModal = (e: React.MouseEvent, fw: CuriculumResponseDto) => {
    e.stopPropagation()
    setDeleteTarget(fw)
  }

  // Xử lý sao chép
  const onCopySubmit = (formData: CopyCurrculumDto) => {
    copyCurriculum(
      { body: formData },
      {
        onSuccess: () => {
          toast.success('Sao chép chương trình khung thành công!')
          handleCloseCopyModal()
          onRefresh?.()
        },
        onError: (err) => {
          toast.error('Có lỗi xảy ra khi sao chép dữ liệu!')
          console.error(err)
        },
      },
    )
  }

  // Xử lý xóa
  const ConfirmDelete = () => {
    if (!deleteTarget) return

    deleteCurriculum(
      {
        params: {
          path: { id: deleteTarget.id },
        },
      },
      {
        onSuccess: () => {
          toast.success('Xóa chương trình khung thành công!')
          if (selectedId === deleteTarget.id) {
            setSelectedId(null)
          }
          setDeleteTarget(null)
          onRefresh?.()
        },
        onError: (err) => {
          toast.error('Có lỗi xảy ra khi xóa dữ liệu!')
          console.error(err)
        },
      },
    )
  }

  const isGlobalPending = isDeletePending || isCopyPending

  return (
    <div className="relative min-h-[200px] w-96 shrink-0 space-y-3 p-1">
      {/* Spinner Overlay khi thao tác ngầm */}
      {isGlobalPending && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-2 rounded-xl bg-slate-100/60 backdrop-blur-xs transition-all">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="text-xs font-semibold tracking-wide text-slate-600">
            {isDeletePending ? 'Đang xóa dữ liệu...' : 'Đang sao chép...'}
          </span>
        </div>
      )}

      {/* Trạng thái danh sách trống */}
      {data.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
          <FileText className="mb-3 h-10 w-10 text-slate-300" />
          <p className="text-sm font-medium text-slate-600">Không tìm thấy chương trình khung</p>
          <p className="mt-1 text-xs text-slate-400">Vui lòng thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm.</p>
        </div>
      )}

      {/* Danh sách Card (Đã sửa từ <button> thành <div> tương tác) */}
      {data.map((fw) => {
        const isSel = selectedId === fw.id
        return (
          <div
            key={fw.id}
            role="button"
            tabIndex={0}
            onClick={() => setSelectedId(fw.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                setSelectedId(fw.id)
              }
            }}
            aria-selected={isSel}
            className={`group relative w-full cursor-pointer overflow-hidden rounded-xl border p-4 text-left transition-all duration-200 ease-in-out focus:ring-2 focus:ring-blue-500/40 focus:outline-none ${
              isSel
                ? 'border-blue-500 bg-gradient-to-r from-blue-50/40 to-white shadow-md ring-1 ring-blue-500/30'
                : 'border-slate-200 bg-white hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md'
            }`}
          >
            {/* Thanh highlight góc trái */}
            {isSel && <div className="absolute top-0 bottom-0 left-0 w-1 bg-blue-500" />}

            {/* Header: Badge Hệ đào tạo & Nút thao tác */}
            <div className="mb-2.5 flex items-center justify-between gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-wide ${
                  isSel
                    ? 'border-blue-200 bg-blue-50 text-blue-600'
                    : 'border-slate-200 bg-slate-50 text-slate-500'
                }`}
              >
                <GraduationCap className="h-3 w-3" />
                Hệ đào tạo: Trung cấp nghề
              </span>

              <div className="flex items-center gap-1.5">
                <span className="rounded bg-slate-100/60 px-1.5 py-0.5 font-mono text-[11px] font-medium text-slate-400">
                  #{fw.curriculumCode}
                </span>

                {/* Nút Sao chép */}
                <button
                  type="button"
                  disabled={isGlobalPending}
                  onClick={(e) => handleOpenCopyModal(e, fw)}
                  aria-label="Sao chép chương trình khung"
                  className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-blue-50 hover:text-blue-600 disabled:opacity-50"
                  title="Sao chép"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>

                {/* Nút Xóa */}
                <button
                  type="button"
                  disabled={isGlobalPending}
                  onClick={(e) => handleOpenDeleteModal(e, fw)}
                  aria-label="Xóa chương trình khung"
                  className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
                  title="Xóa"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Title */}
            <h4
              className={`mb-2 pr-2 text-sm leading-snug font-bold transition-colors ${
                isSel ? 'text-blue-600' : 'text-slate-800 group-hover:text-blue-600'
              }`}
            >
              {fw.curriculumName}
            </h4>

            {/* Footer */}
            <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-2 text-xs">
              <div className="flex max-w-[70%] items-center gap-1.5 truncate text-slate-500">
                <Building2 className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                <span className="truncate">
                  Ngành:{' '}
                  <span className="font-medium text-slate-700">{fw.major?.majorName || 'Chưa cập nhật'}</span>
                </span>
              </div>

              <div className="flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                <span>{fw.totalCredits}</span>
                <span className="font-normal opacity-85">tín chỉ</span>
              </div>
            </div>
          </div>
        )
      })}

      {/* ================= MODAL SAO CHÉP CHƯƠNG TRÌNH ================= */}
      {isCopyModalOpen && selectedCurriculum && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="copy-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs"
        >
          <div className="animate-in fade-in zoom-in-95 w-full max-w-md overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h3
                id="copy-modal-title"
                className="flex items-center gap-2 text-base font-bold text-slate-800"
              >
                <Copy className="h-4 w-4 text-blue-500" />
                Sao chép chương trình khung
              </h3>
              <button
                type="button"
                onClick={handleCloseCopyModal}
                aria-label="Đóng"
                className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onCopySubmit)} className="space-y-4 p-5">
              <input type="hidden" {...register('sourceCurriculumId')} />

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-500">Chương trình gốc</label>
                <div className="truncate rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600">
                  {selectedCurriculum.curriculumName}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">
                  Mã chương trình mới <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  className={`w-full rounded-lg border px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none ${
                    errors.curriculumCode ? 'border-rose-500' : 'border-slate-200'
                  }`}
                  placeholder="Nhập mã chương trình..."
                  {...register('curriculumCode', {
                    required: 'Mã chương trình là bắt buộc',
                  })}
                />
                {errors.curriculumCode && (
                  <p className="mt-1 text-[11px] text-rose-500">{errors.curriculumCode.message}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">
                  Tên chương trình mới <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  className={`w-full rounded-lg border px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none ${
                    errors.curriculumName ? 'border-rose-500' : 'border-slate-200'
                  }`}
                  placeholder="Nhập tên chương trình..."
                  {...register('curriculumName', {
                    required: 'Tên chương trình là bắt buộc',
                  })}
                />
                {errors.curriculumName && (
                  <p className="mt-1 text-[11px] text-rose-500">{errors.curriculumName.message}</p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={handleCloseCopyModal}
                  disabled={isCopyPending}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isCopyPending}
                  className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-50"
                >
                  {isCopyPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  Xác nhận Sao chép
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL XÁC NHẬN XÓA Custom UI ================= */}
      {deleteTarget && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs"
        >
          <div className="animate-in fade-in zoom-in-95 w-full max-w-sm space-y-4 overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-xl duration-150">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="rounded-full bg-rose-50 p-2.5">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h3 id="delete-modal-title" className="text-sm font-bold text-slate-800">
                  Xác nhận xóa
                </h3>
                <p className="mt-0.5 text-xs text-slate-500">Hành động này không thể hoàn tác.</p>
              </div>
            </div>

            <p className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-xs text-slate-600">
              Bạn có chắc chắn muốn xóa chương trình khung{' '}
              <strong className="text-slate-800">"{deleteTarget.curriculumName}"</strong>?
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeletePending}
                className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={ConfirmDelete}
                disabled={isDeletePending}
                className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-rose-700 disabled:opacity-50"
              >
                {isDeletePending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Xóa ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChuongTrinhKhungList
