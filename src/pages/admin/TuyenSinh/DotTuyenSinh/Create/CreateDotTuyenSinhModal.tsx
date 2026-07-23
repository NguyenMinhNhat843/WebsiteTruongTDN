import React, { useEffect } from 'react'
import { useForm, useFieldArray, useWatch } from 'react-hook-form'
import { Plus, Trash2, X, Layers, Info, Calculator } from 'lucide-react'
import { $api } from '../../../../../api/client'
import type { components } from '../../../../../api/v1'
import { useGetAcademicYears } from '../../../../../hooks/useAcademicYear'
import { useGetMajors } from '../../../../../hooks/useMajor'
import { toast } from 'sonner'
import type { AdmissionCampaignDetailDto } from '../../../../../api/entity'
import { cleanEmptyFields } from '../../../../../util/cleanEmptyField'

export type CreateAdmissionCampaignDto = components['schemas']['CreateAdmissionCampaignDto']
export type CreateAdmissionCampaignMajorDto = components['schemas']['CreateAdmissionCampaignMajorDto']

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  initialData?: AdmissionCampaignDetailDto | null
}

const CreateDotTuyenSinhModal: React.FC<ModalProps> = ({ isOpen, onClose, onSuccess, initialData }) => {
  const isEdit = Boolean(initialData?.id)

  // 1. API Mutations & Queries
  const { mutate: createDotTuyenSinh, isPending: isCreating } = $api.useMutation(
    'post',
    '/admission-campaigns',
  )

  const { mutate: updateDotTuyenSinh, isPending: isUpdating } = $api.useMutation(
    'patch',
    '/admission-campaigns/{id}',
  )

  const { data: academicYears, isLoading: isAcademicYearsLoading } = useGetAcademicYears({ status: 'ACTIVE' })

  const { data: majors, isLoading: isLoadingMajors } = useGetMajors()

  const { data: subjectCombinations } = $api.useQuery('get', '/subject-combinations')

  const { data: batches, isLoading: isLoadingBatches } = $api.useQuery('get', '/batches')

  const isSubmitting = isCreating || isUpdating

  const initFormData: Partial<CreateAdmissionCampaignDto> = {
    academicYearId: undefined,
    code: '',
    name: '',
    startDate: '',
    endDate: '',
    status: 'PLANNING',
    description: '',
    campaignMajors: [],
  }

  // 2. Setup React Hook Form
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateAdmissionCampaignDto>({
    defaultValues: initFormData,
  })

  // Dynamic Array cho danh sách ngành tuyển sinh
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'campaignMajors',
  })

  // 3. Tự động tính Tổng Chỉ tiêu + theo dõi majorId từng dòng để lọc batch tương ứng
  const watchedMajors = useWatch({ control, name: 'campaignMajors' })
  const totalCalculatedQuota = (watchedMajors || []).reduce(
    (acc, item) => acc + (Number(item?.quota) || 0),
    0,
  )

  // 4. Đồng bộ dữ liệu khi ở chế độ Edit/Create
  useEffect(() => {
    if (initialData && isOpen) {
      reset({
        academicYearId: initialData.academicYearId,
        code: initialData.code,
        name: initialData.name,
        startDate: initialData.startDate ? initialData.startDate.slice(0, 10) : '',
        endDate: initialData.endDate ? initialData.endDate.slice(0, 10) : '',
        status: initialData.status,
        description: initialData.description || '',
        campaignMajors:
          initialData.campaignMajors?.map((item) => ({
            majorId: item.majorId,
            trainingType: item.trainingType || 'VOCATIONAL_INTERMEDIATE',
            quota: item.quota || 0,
            subjectCombinationId: item.subjectCombinationId ? Number(item.subjectCombinationId) : undefined,
            batchId: item.batchId ? Number(item.batchId) : undefined,
            minScorePerSubject: item.minScorePerSubject,
            minTotalScore: item.minTotalScore,
            minConduct: item.minConduct,
          })) || [],
      })
    } else if (!initialData && isOpen) {
      reset(initFormData)
    }
  }, [initialData, isOpen, reset])

  // 5. Submit handler
  const onSubmit = (formData: CreateAdmissionCampaignDto) => {
    const payload: CreateAdmissionCampaignDto = {
      ...formData,
      academicYearId: Number(formData.academicYearId),
      campaignMajors: formData.campaignMajors?.map((item) => ({
        ...item,
        majorId: Number(item.majorId),
        quota: Number(item.quota),
        subjectCombinationId: Number(item.subjectCombinationId),
        batchId: Number(item.batchId),
        minScorePerSubject: item.minScorePerSubject ? Number(item.minScorePerSubject) : undefined,
        minTotalScore: item.minTotalScore ? Number(item.minTotalScore) : undefined,
      })),
    }

    if (isEdit && initialData?.id) {
      updateDotTuyenSinh(
        {
          params: { path: { id: initialData.id } },
          body: cleanEmptyFields(payload),
        },
        {
          onSuccess: () => {
            reset(initFormData)
            onSuccess?.()
            onClose()
            toast.success('Cập nhật đợt tuyển sinh thành công')
          },
          onError: () => {
            toast.error('Cập nhật đợt tuyển sinh thất bại')
          },
        },
      )
    } else {
      createDotTuyenSinh(
        { body: cleanEmptyFields(payload) },
        {
          onSuccess: () => {
            reset(initFormData)
            onSuccess?.()
            onClose()
            toast.success('Tạo mới đợt tuyển sinh thành công')
          },
          onError: () => {
            toast.error('Tạo mới đợt tuyển sinh thất bại')
          },
        },
      )
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="relative flex max-h-[92vh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl">
        {/* Header Modal */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {isEdit ? 'Cập nhật đợt tuyển sinh' : 'Tạo mới đợt tuyển sinh'}
            </h3>
            <p className="text-xs text-slate-500">
              Thiết lập thông tin đợt và phân bổ ngành tuyển sinh kèm tiêu chuẩn xét tuyển
            </p>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="rounded-lg p-1.5 text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body Form Layout 2 Cột */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-1 flex-col overflow-hidden">
          <div className="grid flex-1 grid-cols-1 gap-6 overflow-y-auto p-6 lg:grid-cols-12">
            {/* CỘT TRÁI: Thông tin đợt tuyển sinh (4 cols) */}
            <div className="space-y-4 pr-0 lg:col-span-4 lg:border-r lg:border-slate-100 lg:pr-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <Info className="h-4 w-4 text-indigo-600" />
                <h4 className="text-sm font-semibold text-slate-800">Thông tin đợt tuyển sinh</h4>
              </div>

              {/* Năm học */}
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Năm học <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('academicYearId', {
                    required: 'Vui lòng chọn năm học',
                  })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                  disabled={isAcademicYearsLoading}
                >
                  <option value="">-- Chọn năm học --</option>
                  {academicYears?.data?.map((year) => (
                    <option key={year.id} value={year.id}>
                      {year.code} {year.isCurrent ? '(Hiện tại)' : ''}
                    </option>
                  ))}
                </select>
                {errors.academicYearId && (
                  <p className="mt-1 text-xs text-red-500">{errors.academicYearId.message}</p>
                )}
                <p className="mt-1 text-[11px] text-slate-400">
                  Mỗi năm học chỉ nên tạo 1 đợt tuyển sinh — cần nhận hồ sơ thêm thì gia hạn Ngày kết thúc.
                </p>
              </div>

              {/* Mã & Tên đợt tuyển sinh */}
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Mã đợt <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="VD: TS-2026"
                  {...register('code', { required: 'Nhập mã đợt' })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                />
                {errors.code && <p className="mt-1 text-xs text-red-500">{errors.code.message}</p>}
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Tên đợt tuyển sinh <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="VD: Tuyển sinh Năm học 2026"
                  {...register('name', { required: 'Nhập tên đợt' })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
              </div>

              {/* Thời gian Bắt đầu - Kết thúc */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700">
                    Ngày bắt đầu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    {...register('startDate', {
                      required: 'Chọn ngày bắt đầu',
                    })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                  />
                  {errors.startDate && (
                    <p className="mt-1 text-xs text-red-500">{errors.startDate.message}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700">
                    Ngày kết thúc <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    {...register('endDate', {
                      required: 'Chọn ngày kết thúc',
                    })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                  />
                  {errors.endDate && <p className="mt-1 text-xs text-red-500">{errors.endDate.message}</p>}
                </div>
              </div>

              {/* Trạng thái & Tổng chỉ tiêu hiển thị */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700">Trạng thái</label>
                  <select
                    {...register('status')}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                  >
                    <option value="PLANNING">Lên kế hoạch</option>
                    <option value="OPEN">Mở nhận hồ sơ</option>
                    <option value="CLOSED">Đóng nhận hồ sơ</option>
                    <option value="COMPLETED">Hoàn thành</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 flex items-center justify-between text-xs font-medium text-slate-700">
                    <span>Tổng chỉ tiêu</span>
                    <span className="flex items-center gap-0.5 text-[10px] font-normal text-indigo-600">
                      <Calculator className="h-3 w-3" /> Tự động
                    </span>
                  </label>
                  <div className="w-full rounded-xl border border-indigo-100 bg-indigo-50/50 px-3 py-2 text-sm font-bold text-indigo-700">
                    {totalCalculatedQuota}
                  </div>
                </div>
              </div>

              {/* Mô tả */}
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">Ghi chú / Mô tả</label>
                <textarea
                  rows={3}
                  placeholder="Ghi chú đợt tuyển sinh..."
                  {...register('description')}
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                />
              </div>
            </div>

            {/* CỘT PHẢI: Ngành Tuyển Sinh & Tiêu Chuẩn (8 cols) */}
            <div className="flex flex-col space-y-4 lg:col-span-8">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-indigo-600" />
                  <h4 className="text-sm font-semibold text-slate-800">
                    Cấu hình ngành tuyển sinh ({fields.length})
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    append({
                      majorId: 0,
                      quota: 10,
                      trainingType: 'VOCATIONAL_INTERMEDIATE',
                      subjectCombinationId: 0,
                      batchId: 0,
                    })
                  }
                  className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600 transition-colors hover:bg-indigo-100"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Thêm ngành
                </button>
              </div>

              {fields.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 py-16 text-center">
                  <Layers className="mb-2 h-8 w-8 text-slate-300" />
                  <p className="text-xs font-medium text-slate-500">
                    Chưa có ngành nào trong đợt tuyển sinh này
                  </p>
                  <p className="mt-0.5 text-[11px] text-slate-400">
                    Nhấn "Thêm ngành" để thiết lập chỉ tiêu, hệ đào tạo và điều kiện xét tuyển
                  </p>
                </div>
              ) : (
                <div className="max-h-[550px] space-y-4 overflow-y-auto pr-1">
                  {fields.map((field, index) => {
                    // Lấy majorId hiện tại của dòng này để lọc danh sách khóa (batch) phù hợp
                    const currentMajorId = Number(watchedMajors?.[index]?.majorId) || 0
                    const filteredBatches = (batches || []).filter(
                      (b) => currentMajorId > 0 && b.majorId === currentMajorId,
                    )

                    return (
                      <div
                        key={field.id}
                        className="group relative space-y-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 transition-all hover:border-slate-300"
                      >
                        {/* Tiêu đề mục ngành + Nút xóa */}
                        <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                          <span className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-[10px] text-indigo-700">
                              {index + 1}
                            </span>
                            Cấu hình ngành thứ {index + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                            title="Xóa ngành này"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Dòng 1: Chọn Ngành, Hệ đào tạo & Chỉ tiêu */}
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-12">
                          <div className="sm:col-span-5">
                            <label className="mb-1 block text-[11px] font-semibold text-slate-600">
                              Ngành tuyển sinh <span className="text-red-500">*</span>
                            </label>
                            <select
                              {...register(`campaignMajors.${index}.majorId` as const, {
                                required: 'Chọn ngành',
                                valueAsNumber: true,
                              })}
                              disabled={isLoadingMajors}
                              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                            >
                              <option value={0}>-- Chọn ngành --</option>
                              {majors?.map((m) => (
                                <option key={m.id} value={m.id}>
                                  {m.majorName} ({m.majorCode})
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="sm:col-span-4">
                            <label className="mb-1 block text-[11px] font-semibold text-slate-600">
                              Hệ đào tạo <span className="text-red-500">*</span>
                            </label>
                            <select
                              {...register(`campaignMajors.${index}.trainingType` as const)}
                              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                            >
                              <option value="VOCATIONAL_INTERMEDIATE">Trung cấp</option>
                              <option value="VOCATIONAL_ELEMENTARY">Sơ cấp nghề</option>
                            </select>
                          </div>

                          <div className="sm:col-span-3">
                            <label className="mb-1 block text-[11px] font-semibold text-slate-600">
                              Chỉ tiêu <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              min={1}
                              placeholder="Chỉ tiêu"
                              {...register(`campaignMajors.${index}.quota` as const, {
                                required: true,
                                valueAsNumber: true,
                              })}
                              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* Dòng 1b: Chọn Khóa (Batch) — phụ thuộc vào ngành đã chọn ở trên */}
                        <div>
                          <label className="mb-1 block text-[11px] font-semibold text-slate-600">
                            Khóa tuyển sinh <span className="text-red-500">*</span>
                          </label>
                          <select
                            {...register(`campaignMajors.${index}.batchId` as const, {
                              required: 'Chọn khóa',
                              valueAsNumber: true,
                            })}
                            disabled={isLoadingBatches || currentMajorId === 0}
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                          >
                            <option value={0}>
                              {currentMajorId === 0 ? '-- Chọn ngành trước --' : '-- Chọn khóa --'}
                            </option>
                            {filteredBatches.map((b) => (
                              <option key={b.id} value={b.id}>
                                {b.batchName} ({b.batchCode})
                              </option>
                            ))}
                          </select>
                          {currentMajorId !== 0 && filteredBatches.length === 0 && !isLoadingBatches && (
                            <p className="mt-1 text-[11px] text-amber-600">
                              Ngành này chưa có khóa tuyển sinh nào, vui lòng tạo khóa trước.
                            </p>
                          )}
                        </div>

                        {/* Dòng 2: Điều kiện xét tuyển — chỉ còn 1 phương thức duy nhất:
                            Học bạ theo tổ hợp 3 môn + hạnh kiểm */}
                        <div className="rounded-xl border border-amber-200/80 bg-amber-50/50 p-2.5">
                          <div className="mb-2 flex items-center gap-1.5 text-[11px] font-bold text-amber-800">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                            Điều kiện xét tuyển (Học bạ theo tổ hợp môn + hạnh kiểm)
                          </div>
                          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                            {/* Tổ hợp môn */}
                            <div>
                              <label className="mb-1 block text-[10px] font-medium text-slate-600">
                                Tổ hợp môn <span className="text-red-500">*</span>
                              </label>
                              <select
                                {...register(`campaignMajors.${index}.subjectCombinationId` as const, {
                                  required: 'Chọn tổ hợp môn',
                                  valueAsNumber: true,
                                })}
                                className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                              >
                                <option value="">-- Chọn tổ hợp --</option>
                                {subjectCombinations?.data?.map((sc) => (
                                  <option key={sc.id} value={sc.id}>
                                    {sc.code} ({sc.name})
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Hạnh kiểm tối thiểu */}
                            <div>
                              <label className="mb-1 block text-[10px] font-medium text-slate-600">
                                Hạnh kiểm tối thiểu
                              </label>
                              <select
                                {...register(`campaignMajors.${index}.minConduct` as const)}
                                className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                              >
                                <option value="">Không yêu cầu</option>
                                <option value="TOT">Tốt</option>
                                <option value="KHA">Khá trở lên</option>
                                <option value="TB">Trung bình trở lên</option>
                                <option value="YEU">Yếu</option>
                              </select>
                            </div>

                            {/* Điểm sàn tổng */}
                            <div>
                              <label className="mb-1 block text-[10px] font-medium text-slate-600">
                                Điểm sàn TB tổ hợp
                              </label>
                              <input
                                type="number"
                                step="0.1"
                                placeholder="VD: 5.0"
                                {...register(`campaignMajors.${index}.minTotalScore` as const, {
                                  valueAsNumber: true,
                                })}
                                className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                              />
                            </div>

                            {/* Điểm sàn tối thiểu mỗi môn */}
                            <div>
                              <label className="mb-1 block text-[10px] font-medium text-slate-600">
                                Điểm sàn min / môn
                              </label>
                              <input
                                type="number"
                                step="0.1"
                                placeholder="VD: 2.0"
                                {...register(`campaignMajors.${index}.minScorePerSubject` as const, {
                                  valueAsNumber: true,
                                })}
                                className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                              />
                            </div>
                          </div>
                          <p className="mt-2 text-[10px] text-slate-400">
                            Điểm học bạ lấy theo tổ hợp môn ở trên, tính trung bình 4 năm cấp 2 (lớp 6-9) hoặc
                            3 năm cấp 3 (lớp 10-12) tùy trình độ học vấn của thí sinh khi nộp hồ sơ.
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex shrink-0 items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-200/60"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-medium text-white shadow-sm shadow-indigo-200 transition-colors hover:bg-indigo-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Đang xử lý...' : isEdit ? 'Cập nhật đợt' : 'Tạo mới đợt'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateDotTuyenSinhModal
