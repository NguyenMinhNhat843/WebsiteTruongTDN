import { useForm } from 'react-hook-form'
import { X, PlusCircle, BookOpen, Hash, Building2, FileText } from 'lucide-react'
import { useNganhContext, type createNganhDto } from './NganhProvider'
import Input from '../../../components/ui/Form/Input'
import { SelectOption } from '../../../components/ui/Form/SelectOption'
import ButtonAction from '../../../components/ui/ButtonAction'
import { useEffect } from 'react'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: createNganhDto, reset: () => void) => void
  isPending?: boolean
}

const CreateNganhModal = ({ isOpen, onClose, onSubmit, isPending }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<createNganhDto>()

  const { departments, isLoadingDepartment } = useNganhContext()

  // Đóng modal bằng phím ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const departmentOptions =
    departments?.map((dept) => ({
      value: dept.id,
      label: dept.deptName,
    })) || []

  if (!isOpen) return null

  const handleFormSubmit = (data: createNganhDto) => {
    onSubmit(data, reset)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 transition-opacity duration-200"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="animate-in fade-in zoom-in-95 relative w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl duration-200 ease-out"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Phối màu Xanh giáo dục nhã nhặn */}
        <div className="flex items-center justify-between border-b border-blue-100 bg-blue-50/50 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-600 p-2.5 text-white shadow-sm">
              <PlusCircle size={20} className="stroke-[2.2]" />
            </div>
            <div>
              <h2 id="modal-title" className="text-lg font-bold text-slate-800">
                Thêm Ngành Học Mới
              </h2>
              <p className="mt-0.5 text-xs font-medium text-blue-700/80">
                Điền thông tin chi tiết để thiết lập ngành đào tạo mới.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Đóng cửa sổ"
            className="rounded-lg p-1.5 text-slate-400 transition-all duration-200 hover:bg-blue-100/50 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5 p-6">
          {/* Nhóm 1: Mã & Tên ngành */}
          <div className="grid grid-cols-1 gap-4 pl-3 md:grid-cols-3">
            <div className="md:col-span-1">
              <Input
                label="Mã ngành"
                icon={Hash}
                placeholder="VD: CNTT"
                error={errors.majorCode?.message ? String(errors.majorCode.message) : undefined}
                {...register('majorCode', {
                  required: 'Vui lòng nhập mã ngành',
                })}
              />
            </div>

            <div className="md:col-span-2">
              <Input
                label="Tên ngành"
                icon={BookOpen}
                placeholder="VD: Công nghệ thông tin"
                error={errors.majorName?.message ? String(errors.majorName.message) : undefined}
                {...register('majorName', {
                  required: 'Vui lòng nhập tên ngành',
                })}
              />
            </div>
          </div>

          {/* Nhóm 2: Chọn Khoa */}
          <div className="w-full pl-3">
            <SelectOption
              label={isLoadingDepartment ? 'Đang tải danh sách khoa...' : 'Thuộc Khoa / Phòng ban'}
              icon={<Building2 size={14} className="text-blue-500" />}
              options={departmentOptions}
              disabled={isLoadingDepartment}
              error={errors.deptId?.message ? String(errors.deptId.message) : undefined}
              {...register('deptId', {
                required: 'Vui lòng chọn khoa',
                valueAsNumber: true,
              })}
            />
          </div>

          {/* Nhóm 3: Mô tả */}
          <div className="space-y-1.5 pl-3">
            <label className="ml-1 flex items-center gap-2 text-sm font-semibold text-slate-700">
              <FileText size={14} className="text-blue-500" /> Mô tả ngành học
            </label>
            <textarea
              {...register('description')}
              rows={3}
              placeholder="Nhập mô tả tóm tắt về mục tiêu hoặc định hướng của ngành học này..."
              className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm shadow-sm transition-all duration-200 outline-none placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Footer Buttons - Nút chính chuẩn màu Xanh giáo dục */}
          <div className="mt-8 flex gap-3 border-t border-slate-100 pt-5">
            <ButtonAction
              type="button"
              variant="outline"
              className="flex-1 rounded-xl border-slate-200 py-2.5 font-medium text-slate-600 transition-colors hover:bg-slate-50"
              onClick={onClose}
            >
              Hủy bỏ
            </ButtonAction>
            <ButtonAction
              type="submit"
              variant="primary"
              className="flex-1 rounded-xl border-none bg-blue-600 py-2.5 font-medium text-white shadow-sm transition-colors hover:bg-blue-700 active:bg-blue-800"
              loading={isPending}
            >
              Tạo ngành học
            </ButtonAction>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateNganhModal
