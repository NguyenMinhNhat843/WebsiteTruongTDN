import { useForm } from 'react-hook-form'
import { X, Calendar, Tag, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import type { CreateHocKyDto, HocKyDto } from './HocKyProvider'
import { useEffect } from 'react'
import { DateInputv2 } from '../../../components/ui/Form/DateInputv2'
import { useQueryClient } from '@tanstack/react-query'
import { $api } from '../../../api/client'

interface Props {
  isOpen: boolean
  onClose: () => void
  createHocKy?: (data: CreateHocKyDto, onSuccess: () => void) => void
  isCreateHocKyPending?: boolean
  isCreateHocKyError?: boolean
  semester?: HocKyDto // Nếu có prop này => Chế độ Update
}

// Kiểu dữ liệu bổ sung cho Form internal
type FormValues = CreateHocKyDto & {
  academicYearId?: number
}

// Helper: Convert DD/MM/YYYY -> ISO String (Gửi lên Backend)
const parseDateStringToISO = (dateStr: string): string => {
  if (!dateStr) return ''
  const [day, month, year] = dateStr.split('/')
  if (!day || !month || !year) return ''
  return new Date(Number(year), Number(month) - 1, Number(day)).toISOString()
}

// Helper: Convert ISO String/Date -> DD/MM/YYYY (Hiển thị lên Form khi Update)
const formatDateToValue = (dateInput: string | Date | undefined): string => {
  if (!dateInput) return ''
  const date = new Date(dateInput)
  if (isNaN(date.getTime())) return ''
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

export const CreateHocKyModal = ({
  isOpen,
  onClose,
  createHocKy,
  isCreateHocKyPending,
  isCreateHocKyError,
  semester,
}: Props) => {
  const isUpdateMode = Boolean(semester)
  const queryClient = useQueryClient()

  // Lấy danh sách năm học
  const {
    data: academicYears,
    isLoading: isAcademicYearsLoading,
    isError: isAcademicYearsError,
  } = $api.useQuery('get', '/academic-years')

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      isCurrent: false,
    },
  })

  // API Update mutation
  const {
    mutate: updateSemester,
    isPending: isUpdateSemesterPending,
    isError: isUpdateSemesterError,
  } = $api.useMutation('patch', '/semesters/{id}', {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get', '/semesters'] })
      reset()
      onClose()
    },
  })

  // Đổ dữ liệu cũ vào form khi mở chế độ Update
  useEffect(() => {
    if (isOpen) {
      if (semester) {
        reset({
          term: semester.term,
          academicYearId: semester.academicYearId!,
          year: semester.year,
          name: semester.name,
          isCurrent: semester.isCurrent,
          startDate: formatDateToValue(semester.startDate),
          endDate: formatDateToValue(semester.endDate),
        })
      } else {
        // Nếu mở modal dạng tạo mới thì clear form
        const currentAcademicYear = academicYears?.data?.find((a) => a.isCurrent)
        reset({
          isCurrent: false,
          academicYearId: currentAcademicYear?.id,
          term: undefined,
          name: '',
          startDate: '',
          endDate: '',
        })
      }
    }
  }, [semester, isOpen, reset, academicYears])

  const watchTerm = watch('term')
  const watchAcademicYearId = watch('academicYearId')

  // Tự động cập nhật Tên học kỳ và lấy giá trị Năm bắt đầu (year) từ AcademicYear được chọn
  useEffect(() => {
    if (watchAcademicYearId && academicYears) {
      const selectedYearObj = academicYears?.data?.find((item) => item.id === Number(watchAcademicYearId))

      if (selectedYearObj) {
        // Ví dụ: selectedYearObj.code = "2026-2027"
        // Lấy năm đầu tiên (2026) lưu vào field `year` cũ
        const startYearNum = parseInt(selectedYearObj.code.split('-')[0], 10)
        if (!isNaN(startYearNum)) {
          setValue('year', startYearNum)
        }

        // Tự sinh tên Học kỳ: HK1 2026-2027
        if (watchTerm) {
          setValue('name', `HK${watchTerm} ${selectedYearObj.code}`)
        }
      }
    }
  }, [watchTerm, watchAcademicYearId, academicYears, setValue])

  const onSubmit = (data: FormValues) => {
    const formattedStartDate = parseDateStringToISO(data.startDate)
    const formattedEndDate = parseDateStringToISO(data.endDate)

    // Lấy object Academic Year tương ứng
    const selectedYearObj = academicYears?.data.find((item) => item.id === Number(data.academicYearId))

    const payload = {
      ...data,
      academicYearId: Number(data.academicYearId),
      year: Number(data.year),
      schoolYear: selectedYearObj?.code || '', // Giữ lại field schoolYear cho backend cũ
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    }

    if (isUpdateMode && semester) {
      updateSemester({
        params: { path: { id: semester.id } },
        body: payload,
      })
    } else if (createHocKy) {
      createHocKy(payload, () => {
        reset()
        onClose()
      })
    }
  }

  const isPending = isCreateHocKyPending || isUpdateSemesterPending
  const isError = isCreateHocKyError || isUpdateSemesterError

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="animate-in fade-in zoom-in w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/50 px-6 py-4">
          <div>
            <h3 className="text-lg font-bold text-gray-800">
              {isUpdateMode ? 'Cập nhật học kỳ' : 'Mở học kỳ mới'}
            </h3>
            <p className="text-xs text-gray-500">
              {isUpdateMode
                ? 'Chỉnh sửa thông tin thời gian và trạng thái'
                : 'Thiết lập thời gian và trạng thái học kỳ mới'}
            </p>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 p-6">
          <div className="flex items-center justify-between gap-4">
            {/* Chọn Năm Học (Dropdown) */}
            <div className="flex-1">
              <label className="mb-2 flex items-center gap-2 text-xs font-bold text-gray-600 uppercase">
                <Calendar size={14} /> Năm học
              </label>
              <select
                {...register('academicYearId', {
                  required: 'Vui lòng chọn năm học',
                  valueAsNumber: true,
                })}
                disabled={isAcademicYearsLoading}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-700 transition-all outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 disabled:bg-gray-100"
              >
                <option value="">{isAcademicYearsLoading ? 'Đang tải...' : '-- Chọn năm học --'}</option>
                {academicYears?.data?.map((ay) => (
                  <option key={ay.id} value={ay.id}>
                    {ay.code} {ay.isCurrent ? '(Hiện tại)' : ''}
                  </option>
                ))}
              </select>
              {isAcademicYearsError && (
                <p className="mt-1 text-[11px] text-red-500">Lỗi tải danh sách năm học</p>
              )}
            </div>

            {/* Số kỳ (term) */}
            <div className="w-1/3">
              <label className="mb-2 flex items-center gap-2 text-xs font-bold text-gray-600 uppercase">
                <Calendar size={14} /> Kỳ học
              </label>
              <input
                type="number"
                placeholder="VD: 1"
                {...register('term', {
                  required: 'Nhập kỳ',
                  valueAsNumber: true,
                  min: { value: 1, message: 'Kỳ >= 1' },
                })}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm transition-all outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              />
            </div>
          </div>

          {/* Tên học kỳ (Tự động sinh ra) */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-xs font-bold text-gray-600 uppercase">
              <Tag size={14} /> Tên học kỳ
            </label>
            <input
              {...register('name', { required: 'Vui lòng nhập tên học kỳ' })}
              className={`w-full border bg-gray-50 px-4 py-2.5 ${
                errors.name ? 'border-red-400 focus:ring-red-100' : 'border-gray-200 focus:ring-indigo-100'
              } rounded-xl text-sm font-medium text-gray-800 transition-all outline-none focus:border-indigo-500 focus:ring-4`}
              placeholder="VD: HK1 2026-2027"
            />
            {errors.name && (
              <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500">
                <AlertCircle size={12} /> {errors.name.message}
              </p>
            )}
          </div>

          {/* Ngày bắt đầu & Kết thúc */}
          <div className="grid grid-cols-2 gap-4">
            <DateInputv2
              label="Bắt đầu"
              required
              error={errors.startDate?.message}
              {...register('startDate', {
                required: 'Bắt buộc nhập ngày bắt đầu',
                pattern: {
                  value: /^([0-2][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
                  message: 'Sai định dạng DD/MM/YYYY',
                },
              })}
            />

            <DateInputv2
              label="Kết thúc"
              required
              error={errors.endDate?.message}
              {...register('endDate', {
                required: 'Bắt buộc nhập ngày kết thúc',
                pattern: {
                  value: /^([0-2][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
                  message: 'Sai định dạng DD/MM/YYYY',
                },
              })}
            />
          </div>

          {/* Checkbox Học kỳ hiện tại */}
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-indigo-100 bg-indigo-50/50 p-3 transition-colors hover:bg-indigo-50">
            <div className="relative flex items-center">
              <input
                type="checkbox"
                {...register('isCurrent')}
                className="h-5 w-5 rounded border-gray-300 text-indigo-600 transition-all focus:ring-indigo-500"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-indigo-900">Đặt làm học kỳ hiện tại</span>
              <span className="text-[11px] text-indigo-600">
                Mọi dữ liệu tài chính và môn học sẽ mặc định vào kỳ này
              </span>
            </div>
          </label>

          {/* Thông báo lỗi từ Server */}
          {isError && (
            <div className="animate-shake flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-600">
              <AlertCircle size={16} />
              <span>Có lỗi xảy ra khi {isUpdateMode ? 'cập nhật' : 'tạo'} học kỳ. Vui lòng thử lại.</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl bg-gray-100 py-3 text-sm font-bold text-gray-500 transition-all hover:bg-gray-200"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex flex-2 items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 disabled:bg-indigo-300"
            >
              {isPending ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
              {isPending ? 'Đang xử lý...' : isUpdateMode ? 'Cập nhật kỳ' : 'Xác nhận mở kỳ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
