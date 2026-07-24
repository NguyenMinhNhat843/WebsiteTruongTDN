import { useState } from 'react'
import { X, PlusCircle, Loader2, CheckSquare, Square } from 'lucide-react'
import { $api } from '../../../../api/client'
import { useAppContext } from '../../../../AppProvider'

interface CreateDotDanhGiaProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

const CreateDotDanhGia = ({ isOpen, onClose, onSuccess }: CreateDotDanhGiaProps) => {
  const { hocKysOptions } = useAppContext() // Danh sách học kỳ [{ value: number, label: string }] hoặc cấu trúc tương tự
  const [name, setName] = useState('')
  const [semesterId, setSemesterId] = useState<number | ''>('')
  const [selectedCriterionIds, setSelectedCriterionIds] = useState<number[]>([])
  const [error, setError] = useState('')

  // 1. Tải danh sách tiêu chí từ API
  const { data: criteria, isLoading: isLoadingCriteria } = $api.useQuery('get', '/assessment/criteria', {
    enabled: isOpen, // Chỉ tự động gọi API khi modal được mở ra
  })

  // 2. Hook mutation để tạo đợt đánh giá
  const { mutate: createDotDanhGiaDiemRenLuyen, isPending } = $api.useMutation(
    'post',
    '/assessment/periods',
    {
      onSuccess: () => {
        setName('')
        setSemesterId('')
        setSelectedCriterionIds([])
        setError('')
        if (onSuccess) onSuccess()
        onClose()
      },
      onError: () => {
        setError('Có lỗi xảy ra khi kết nối đến máy chủ.')
      },
    },
  )

  // Xử lý khi người dùng chọn học kỳ -> tự động tạo tên đợt
  const handleSemesterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    if (error) setError('')

    if (!value) {
      setSemesterId('')
      setName('')
      return
    }

    const selectedId = Number(value)
    setSemesterId(selectedId)

    // Tìm học kỳ tương ứng trong danh sách options để lấy tên (label)
    const selectedOption = hocKysOptions?.find((opt) => opt.value === selectedId)

    if (selectedOption?.label) {
      setName(`Đợt đánh giá ${selectedOption.label}`)
    }
  }

  // Xử lý chọn/bỏ chọn tiêu chí đánh giá
  const toggleCriterion = (id: number) => {
    setSelectedCriterionIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    )
  }

  // Submit Form
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!semesterId) return setError('Vui lòng chọn học kỳ áp dụng.')
    if (!name.trim()) return setError('Vui lòng nhập tên đợt đánh giá.')
    if (selectedCriterionIds.length === 0) return setError('Vui lòng cấu hình ít nhất một tiêu chí.')

    setError('')

    createDotDanhGiaDiemRenLuyen({
      body: {
        name: name.trim(),
        semesterId: Number(semesterId),
        criterionIds: selectedCriterionIds,
      },
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm transition-opacity">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={isPending ? undefined : onClose} />

      {/* Nội dung Khung Modal */}
      <div className="animate-in fade-in zoom-in-95 relative flex max-h-[90vh] w-full max-w-xl transform flex-col overflow-hidden rounded-xl border border-gray-100 bg-white p-6 shadow-xl transition-all duration-200">
        {/* Nút đóng */}
        <button
          type="button"
          onClick={onClose}
          disabled={isPending}
          className="absolute top-4 right-4 rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Tiêu đề */}
        <div className="mb-5 flex flex-shrink-0 items-center gap-2.5">
          <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
            <PlusCircle className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Tạo mới đợt đánh giá điểm rèn luyện</h3>
        </div>

        {/* Form nhập liệu */}
        <form onSubmit={handleSubmit} className="flex-1 space-y-4 overflow-y-auto pr-1">
          {/* 1. Chọn học kỳ */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Học kỳ áp dụng <span className="text-red-500">*</span>
            </label>
            <select
              value={semesterId}
              disabled={isPending}
              onChange={handleSemesterChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none disabled:bg-gray-50"
            >
              <option value="">-- Chọn học kỳ --</option>
              {hocKysOptions?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Nhập tên đợt */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Tên đợt đánh giá <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              disabled={isPending}
              placeholder="Ví dụ: Đợt đánh giá rèn luyện Học kỳ I"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (error) setError('')
              }}
              className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none disabled:bg-gray-50"
            />
          </div>

          {/* 3. Cấu hình danh mục tiêu chí */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Cấu hình các tiêu chí áp dụng <span className="text-red-500">*</span>
            </label>

            {isLoadingCriteria ? (
              <div className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-gray-200 py-6 text-sm text-gray-400">
                <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                Đang tải danh mục tiêu chí...
              </div>
            ) : !criteria || criteria.length === 0 ? (
              <div className="rounded-lg border border-dashed border-gray-200 py-6 text-center text-sm text-gray-400">
                Không tìm thấy tiêu chí nào trên hệ thống.
              </div>
            ) : (
              <div className="max-h-56 divide-y divide-gray-100 overflow-hidden overflow-y-auto rounded-lg border border-gray-200 bg-gray-50/30">
                {criteria.map((item) => {
                  const isChecked = selectedCriterionIds.includes(item.id)
                  return (
                    <div
                      key={item.id}
                      onClick={() => !isPending && toggleCriterion(item.id)}
                      className={`flex cursor-pointer items-start gap-3 p-3 text-sm transition-colors hover:bg-gray-50 ${
                        isChecked ? 'bg-blue-50/40' : ''
                      }`}
                    >
                      <div className="mt-0.5 flex-shrink-0 text-gray-400">
                        {isChecked ? (
                          <CheckSquare className="h-4 w-4 text-blue-600" />
                        ) : (
                          <Square className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="leading-tight font-medium text-gray-800">{item.title}</p>
                        <p className="mt-1 text-xs font-semibold text-emerald-600">
                          Điểm tối đa: {item.maxScore} đ
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Hiển thị thông báo lỗi (Nếu có) */}
          {error && (
            <p className="rounded-lg border border-red-100 bg-red-50 p-2.5 text-xs font-medium text-red-600">
              {error}
            </p>
          )}

          {/* Nhóm nút bấm điều hướng */}
          <div className="flex flex-shrink-0 justify-end gap-2.5 border-t border-gray-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 focus:ring-2 focus:ring-blue-500/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                'Tạo đợt'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateDotDanhGia
