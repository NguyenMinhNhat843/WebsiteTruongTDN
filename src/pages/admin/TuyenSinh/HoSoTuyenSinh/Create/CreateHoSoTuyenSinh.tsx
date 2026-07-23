import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import {
  User,
  BookOpen,
  GraduationCap,
  Save,
  ArrowLeft,
  FileCheck,
  Users,
  Search,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react'
import { toast } from 'sonner'
import { $api } from '../../../../../api/client'
import type { components } from '../../../../../api/v1'
import { useGetMajors } from '../../../../../hooks/useMajor'
import type { TrainingTypeEnum } from '../../../../../api/enum'
import { cleanEmptyFields } from '../../../../../util/cleanEmptyField'
/*
eslint-disable @typescript-eslint/no-explicit-any
*/

export type CreateAdmissionProfileDto = components['schemas']['CreateAdmissionProfileDto']

const TaoHoSoTuyenSinh: React.FC = () => {
  const navigate = useNavigate()

  // ----------------------------------------------------
  // 1. STATE BƯỚC ĐẦU: NGÀNH + HỆ ĐÀO TẠO + TRÌNH ĐỘ
  // ----------------------------------------------------
  const [selectedMajorId, setSelectedMajorId] = useState<number | undefined>()
  const [selectedTrainingType, setSelectedTrainingType] =
    useState<TrainingTypeEnum>('VOCATIONAL_INTERMEDIATE')
  const [selectedEducationLevel, setSelectedEducationLevel] = useState<'THCS' | 'THPT'>('THCS')
  const [selectedCampaignMajorId, setSelectedCampaignMajorId] = useState<number | undefined>()

  // Fetch danh sách Ngành
  const { data: majors } = useGetMajors()

  // Auto Query Đợt tuyển sinh Active theo Ngành & Hệ
  const { data: activeCampaigns, isLoading: isLoadingCampaigns } = $api.useQuery(
    'get',
    '/admission-campaigns/active',
    {
      params: {
        query: {
          ...(selectedMajorId && { majorId: selectedMajorId }),
          ...(selectedTrainingType && { trainingType: selectedTrainingType }),
        },
      },
    },
    {
      enabled: Boolean(selectedMajorId && selectedTrainingType),
    },
  )

  // Lấy object campaignMajor được người dùng chọn
  const selectedCampaignMajor = React.useMemo(() => {
    if (!activeCampaigns || !selectedCampaignMajorId) return null
    for (const campaign of activeCampaigns) {
      const cm = campaign.campaignMajors?.find((item) => item.id === selectedCampaignMajorId)
      if (cm) return cm
    }
    return null
  }, [activeCampaigns, selectedCampaignMajorId])

  const subjectCombinationItems = selectedCampaignMajor?.subjectCombination?.items || []
  // Danh sách các lớp cần nhập theo Trình độ học vấn
  const gradesToInput = selectedEducationLevel === 'THCS' ? [6, 7, 8, 9] : [10, 11, 12]

  // ----------------------------------------------------
  // 2. MUTATION & REACT HOOK FORM SETUP
  // ----------------------------------------------------
  const { mutate: createAdmissionProfile, isPending: isCreating } = $api.useMutation(
    'post',
    '/admission-profiles',
  )

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateAdmissionProfileDto>({
    defaultValues: {
      status: 'REGISTERED',
      educationLevel: 'THCS',
      gender: 'MALE',
      avgSubjectScore: 0,
    },
  })

  // Điểm học bạ theo môn KHÔNG đăng ký vào mảng của RHF nữa (register theo index
  // gây lỗi: khi đổi Trình độ học vấn, các ô ẩn của lớp/số lượng lớp cũ không tự
  // gỡ khỏi form state, dẫn tới submit dư dữ liệu lớp cũ với score null).
  // Thay vào đó lưu bằng state cục bộ, key theo "lớp_mônCode", và chỉ dựng lại
  // mảng transcriptSubjectScores đúng tại thời điểm submit.
  const [scoresMap, setScoresMap] = useState<Record<string, string>>({})

  const handleScoreChange = (grade: number, subjectCode: string, value: string) => {
    setScoresMap((prev) => ({ ...prev, [`${grade}_${subjectCode}`]: value }))
  }

  // Cập nhật educationLevel vào Form khi chọn ở Bước 0 — đồng thời xóa sạch điểm
  // đã nhập trước đó, vì đổi trình độ nghĩa là đổi hẳn bộ lớp cần nhập (6-9 hay 10-12).
  const handleEducationLevelChange = (level: 'THCS' | 'THPT') => {
    setSelectedEducationLevel(level)
    setValue('educationLevel', level)
    setScoresMap({})
  }

  // Tổ hợp môn xét tuyển do đợt tuyển sinh quy định sẵn cho ngành/hệ này —
  // thí sinh không được chọn khác, tự động gán vào form khi chọn đợt.
  // Đổi đợt tuyển sinh (khác tổ hợp môn) cũng phải xóa điểm cũ vì các môn có thể khác.
  useEffect(() => {
    if (selectedCampaignMajor?.subjectCombinationId) {
      setValue('subjectCombinationId', Number(selectedCampaignMajor.subjectCombinationId))
    }
    setScoresMap({})
  }, [selectedCampaignMajor, setValue])

  // Tự động tính điểm TB tổ hợp môn từ các điểm học bạ đã nhập, hiển thị trực quan.
  // Chỉ tính trên đúng bộ lớp + môn đang áp dụng hiện tại (gradesToInput/subjectCombinationItems),
  // không bị dính điểm "rác" của trình độ học vấn hay tổ hợp môn trước đó.
  const computedAvgSubjectScore = React.useMemo(() => {
    const scores: number[] = []
    gradesToInput.forEach((grade) => {
      subjectCombinationItems.forEach((item) => {
        const raw = scoresMap[`${grade}_${item.subjectName}`]
        const num = raw !== undefined && raw !== '' ? Number(raw) : NaN
        if (!Number.isNaN(num)) scores.push(num)
      })
    })
    if (scores.length === 0) return 0
    return scores.reduce((sum, val) => sum + val, 0) / (scores.length / 3)
  }, [scoresMap, gradesToInput, subjectCombinationItems])
  console.log('Computed Avg Subject Score:', computedAvgSubjectScore)

  useEffect(() => {
    setValue('avgSubjectScore', Number(computedAvgSubjectScore.toFixed(2)))
  }, [computedAvgSubjectScore, setValue])

  // ----------------------------------------------------
  // 3. SUBMIT HANDLER
  // ----------------------------------------------------
  const onSubmit = (formData: CreateAdmissionProfileDto) => {
    if (!selectedCampaignMajorId) {
      toast.error('Vui lòng chọn đợt tuyển sinh hợp lệ!')
      return
    }

    // Dựng lại mảng điểm học bạ đúng theo bộ lớp + môn đang áp dụng hiện tại
    // (gradesToInput/subjectCombinationItems), chỉ lấy các ô đã có giá trị hợp lệ.
    const transcriptSubjectScores: NonNullable<CreateAdmissionProfileDto['transcriptSubjectScores']> = []
    gradesToInput.forEach((grade) => {
      subjectCombinationItems.forEach((item) => {
        const raw = scoresMap[`${grade}_${item.subjectName}`]
        const num = raw !== undefined && raw !== '' ? Number(raw) : NaN
        if (!Number.isNaN(num)) {
          transcriptSubjectScores.push({
            gradeLevel: grade,
            subjectCode: item.subjectName,
            score: num,
          })
        }
      })
    })

    const payload: CreateAdmissionProfileDto = {
      ...formData,
      status: 'REGISTERED',
      admissionCampaignMajorId: Number(selectedCampaignMajorId),
      educationLevel: selectedEducationLevel,

      thcsGradYear: formData.thcsGradYear ? Number(formData.thcsGradYear) : null,
      thptGradYear: formData.thptGradYear ? Number(formData.thptGradYear) : null,
      avgSubjectScore: formData.avgSubjectScore ? Number(formData.avgSubjectScore) : null,
      subjectCombinationId: formData.subjectCombinationId ? Number(formData.subjectCombinationId) : null,
      villageId: formData.villageId ? Number(formData.villageId) : null,

      transcriptSubjectScores,
    }

    createAdmissionProfile(
      { body: cleanEmptyFields(payload) },
      {
        onSuccess: () => {
          toast.success('Tạo mới hồ sơ tuyển sinh thành công!')
          // navigate(-1)
        },
        onError: () => {
          toast.error('Tạo mới hồ sơ thất bại. Vui lòng kiểm tra lại thông tin!')
        },
      },
    )
  }

  return (
    <div className="mx-auto min-h-screen max-w-7xl space-y-6 bg-slate-50/50 p-6">
      {/* HEADER & ACTIONS */}
      <div className="sticky top-0 z-20 flex flex-col justify-between gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-xl p-2 text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-700"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="flex items-center gap-2 text-xl font-bold text-slate-900">
              <FileCheck className="h-6 w-6 text-indigo-600" />
              Tạo Hồ Sơ Tuyển Sinh Mới
            </h1>
            <p className="mt-0.5 text-xs text-slate-500">Thêm mới hồ sơ đăng ký cho học sinh vào hệ thống</p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            form="form-create-profile"
            disabled={isCreating || !selectedCampaignMajorId}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-sm shadow-indigo-200 transition-all hover:bg-indigo-700 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {isCreating ? 'Đang lưu...' : 'Lưu Hồ Sơ'}
          </button>
        </div>
      </div>

      {/* ==================================================== */}
      {/* BƯỚC 0: TIÊU CHÍ LỌC ĐỢT TUYỂN SINH (BẮT BUỘC ĐẦU TIÊN) */}
      {/* ==================================================== */}
      <div className="space-y-4 rounded-2xl border border-indigo-100 bg-indigo-50/30 p-6 shadow-sm">
        <div className="flex items-center gap-2 border-b border-indigo-100 pb-3 text-indigo-700">
          <Search className="h-5 w-5" />
          <h2 className="text-sm font-bold tracking-wide uppercase">Xác Định Ngành & Đợt Tuyển Sinh</h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Ngành học */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              1. Chọn Ngành Học <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedMajorId || ''}
              onChange={(e) => {
                setSelectedMajorId(e.target.value ? Number(e.target.value) : undefined)
                setSelectedCampaignMajorId(undefined)
              }}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
            >
              <option value="">-- Chọn ngành muốn học --</option>
              {majors?.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.majorName} ({m.majorCode})
                </option>
              ))}
            </select>
          </div>

          {/* Hệ đào tạo */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              2. Chọn Hệ Đào Tạo <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedTrainingType}
              onChange={(e) => {
                setSelectedTrainingType(e.target.value as TrainingTypeEnum)
                setSelectedCampaignMajorId(undefined)
              }}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
            >
              <option value="VOCATIONAL_INTERMEDIATE">Trung cấp nghề</option>
              <option value="VOCATIONAL_ELEMENTARY">Sơ cấp nghề</option>
            </select>
          </div>

          {/* Trình độ học vấn hiện tại */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              3. Trình Độ Học Vấn <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedEducationLevel}
              onChange={(e) => handleEducationLevelChange(e.target.value as 'THCS' | 'THPT')}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-indigo-700 focus:border-indigo-500 focus:outline-none"
            >
              <option value="THCS">Đã / Sắp tốt nghiệp THCS (Xét THCS)</option>
              <option value="THPT">Đã / Sắp tốt nghiệp THPT (Xét THPT)</option>
            </select>
          </div>
        </div>

        {/* HIỂN THỊ KẾT QUẢ ĐỢT TUYỂN SINH HOẠT ĐỘNG */}
        {selectedMajorId && selectedTrainingType && (
          <div className="mt-4 border-t border-indigo-100 pt-4">
            {isLoadingCampaigns ? (
              <p className="text-xs text-slate-500 italic">Đang kiểm tra các đợt tuyển sinh đang mở...</p>
            ) : !activeCampaigns || activeCampaigns.length === 0 ? (
              <div className="flex items-center gap-2 rounded-xl bg-amber-50 p-3 text-xs text-amber-800">
                <AlertCircle className="h-5 w-5 shrink-0 text-amber-600" />
                <span>
                  Hiện tại <b>chưa có Đợt tuyển sinh nào đang mở</b> cho Ngành và Hệ đào tạo này. Vui lòng
                  thông báo cho học sinh quay lại sau!
                </span>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-emerald-800">
                  4. Chọn Đợt Tuyển Sinh Đang Hoạt Động <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {activeCampaigns.map((campaign) => {
                    // Tìm campaignMajor tương ứng
                    const targetMajor = campaign.campaignMajors?.find(
                      (cm) => cm.majorId === selectedMajorId && cm.trainingType === selectedTrainingType,
                    )

                    if (!targetMajor) return null

                    const isSelected = selectedCampaignMajorId === targetMajor.id

                    return (
                      <div
                        key={campaign.id}
                        onClick={() => setSelectedCampaignMajorId(targetMajor.id)}
                        className={`cursor-pointer rounded-xl border p-3 transition-all ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-600/5 ring-2 ring-indigo-600/20'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900">{campaign.name}</span>
                          {isSelected && <CheckCircle2 className="h-4 w-4 text-indigo-600" />}
                        </div>
                        <p className="mt-1 text-[11px] text-slate-500">
                          Mã: <span className="font-mono font-semibold">{campaign.code}</span> | Chỉ tiêu:{' '}
                          {targetMajor.quota || 'N/A'} | Tổ hợp:{' '}
                          {targetMajor.subjectCombination?.code || 'N/A'}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ==================================================== */}
      {/* KHU VỰC ĐIỀN FORM HỒ SƠ (CHỈ HIỂN THỊ KHI ĐÃ CHỌN ĐỢT) */}
      {/* ==================================================== */}
      {selectedCampaignMajorId ? (
        <form id="form-create-profile" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* SECTION 1: THÔNG TIN CÁ NHÂN HỌC SINH */}
          <div className="space-y-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 text-indigo-600">
              <User className="h-5 w-5" />
              <h2 className="text-sm font-bold tracking-wide text-slate-800 uppercase">
                1. Thông Tin Thí Sinh
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Họ và Tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="VD: Nguyễn Văn A"
                  {...register('fullName', { required: 'Vui lòng nhập họ tên' })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                />
                {errors.fullName && (
                  <span className="text-[11px] text-red-500">{errors.fullName.message}</span>
                )}
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Số CCCD / CMND <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="VD: 038200012345"
                  {...register('identityNumber', { required: 'Vui lòng nhập CCCD' })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Ngày Sinh <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  {...register('dob', { required: 'Chọn ngày sinh' })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">Giới Tính</label>
                <select
                  {...register('gender')}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                >
                  <option value="MALE">Nam</option>
                  <option value="FEMALE">Nữ</option>
                  <option value="OTHER">Khác</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Số Điện Thoại <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="0987654321"
                  {...register('phone', { required: 'Vui lòng nhập SĐT' })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">Email</label>
                <input
                  type="email"
                  placeholder="example@gmail.com"
                  {...register('email')}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Địa Chỉ Chi Tiết (Số nhà, tên đường...)
                </label>
                <input
                  type="text"
                  placeholder="VD: Số 123, đường Nguyễn Trãi"
                  {...register('addressDetail')}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: MÃ HỒ SƠ */}
          <div className="space-y-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 text-indigo-600">
              <GraduationCap className="h-5 w-5" />
              <h2 className="text-sm font-bold tracking-wide text-slate-800 uppercase">2. Mã Hồ Sơ</h2>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Mã Hồ Sơ / Đơn Đăng Ký <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="VD: HS2026-0001"
                  {...register('applicationCode', { required: 'Nhập mã hồ sơ' })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-sm focus:border-indigo-500 focus:outline-none"
                />
                {errors.applicationCode && (
                  <span className="text-[11px] text-red-500">{errors.applicationCode.message}</span>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 3: KẾT QUẢ HỌC TẬP & ĐIỂM XÉT TUYỂN */}
          <div className="space-y-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-indigo-600">
                <BookOpen className="h-5 w-5" />
                <h2 className="text-sm font-bold tracking-wide text-slate-800 uppercase">
                  3. Kết Quả Học Tập & Điểm Xét Tuyển
                </h2>
              </div>
              <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                Trình độ: {selectedEducationLevel === 'THCS' ? 'THCS (Lớp 6-9)' : 'THPT (Lớp 10-12)'}
              </span>
            </div>

            {/* ========================================================= */}
            {/* A. HẠNH KIỂM TỪNG NĂM */}
            {/* ========================================================= */}
            <div>
              <h3 className="mb-3 text-xs font-bold text-slate-700">A. Hạnh Kiểm Từng Năm Học</h3>
              <div className="space-y-4">
                <div
                  className={`grid grid-cols-2 gap-4 rounded-xl border border-slate-100 bg-slate-50/50 p-4 ${
                    selectedEducationLevel === 'THCS' ? 'sm:grid-cols-4' : 'sm:grid-cols-3'
                  }`}
                >
                  {gradesToInput.map((grade) => (
                    <div key={grade} className="space-y-2">
                      <span className="text-xs font-bold text-slate-700">Lớp {grade}</span>
                      <select
                        {...register(`conduct${grade}` as any)}
                        className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs"
                      >
                        <option value="">-- Hạnh kiểm --</option>
                        <option value="TOT">Tốt</option>
                        <option value="KHA">Khá</option>
                        <option value="TB">Trung bình</option>
                        <option value="YEU">Yếu</option>
                      </select>
                    </div>
                  ))}
                </div>
                <div className="w-full sm:w-1/4">
                  <label className="mb-1 block text-xs font-medium text-slate-700">
                    Năm Tốt Nghiệp {selectedEducationLevel === 'THCS' ? 'THCS' : 'THPT'}
                  </label>
                  <input
                    type="number"
                    placeholder="VD: 2026"
                    {...register(selectedEducationLevel === 'THCS' ? 'thcsGradYear' : 'thptGradYear')}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* ========================================================= */}
            {/* B. ĐIỂM HỌC BẠ THEO TỔ HỢP MÔN (duy nhất 1 phương thức xét) */}
            {/* ========================================================= */}
            <div className="space-y-4 rounded-xl border border-indigo-100 bg-indigo-50/30 p-4">
              <div className="flex items-center justify-between border-b border-indigo-100 pb-2">
                <h3 className="text-xs font-bold text-indigo-900">B. Điểm Học Bạ Theo Tổ Hợp Môn</h3>
                {subjectCombinationItems.length > 0 && (
                  <span className="rounded-md bg-indigo-100 px-2 py-0.5 text-[11px] font-semibold text-indigo-700">
                    Tổ hợp {selectedCampaignMajor?.subjectCombination?.code} — Gồm{' '}
                    {subjectCombinationItems.length} môn
                  </span>
                )}
              </div>

              {subjectCombinationItems.length === 0 ? (
                <p className="text-xs text-amber-600 italic">
                  Ngành này chưa cấu hình tổ hợp môn xét tuyển. Vui lòng liên hệ Phòng Đào tạo.
                </p>
              ) : (
                <div className="space-y-3">
                  {gradesToInput.map((grade) => (
                    <div key={grade} className="space-y-2 rounded-xl border border-slate-200 bg-white p-3">
                      <span className="inline-block rounded-md bg-indigo-100 px-2 py-0.5 text-xs font-bold text-indigo-800">
                        Lớp {grade}
                      </span>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        {subjectCombinationItems.map((item) => (
                          <div key={`${grade}-${item.subjectName}`} className="space-y-1">
                            <label className="block text-[11px] font-medium text-slate-600">
                              {item.subjectName}
                            </label>
                            <input
                              type="number"
                              step="0.1"
                              placeholder="Điểm TB môn"
                              value={scoresMap[`${grade}_${item.subjectName}`] ?? ''}
                              onChange={(e) => handleScoreChange(grade, item.subjectName, e.target.value)}
                              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-semibold focus:bg-white focus:outline-none"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ========================================================= */}
            {/* C. ĐIỂM TB TỔ HỢP — TỰ ĐỘNG TÍNH TỪ CÁC Ô ĐIỂM Ở TRÊN */}
            {/* ========================================================= */}
            <div className="grid grid-cols-1 gap-4 border-t border-slate-100 pt-2 sm:grid-cols-3">
              <div>
                <label className="mb-1 flex items-center justify-between text-xs font-medium text-slate-700">
                  <span>Điểm TB Tổ Hợp (Tự động)</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  readOnly
                  {...register('avgSubjectScore')}
                  className="w-full rounded-xl border border-indigo-200 bg-indigo-50/50 px-3 py-2 text-sm font-bold text-indigo-700"
                />
                <p className="mt-1 text-[10px] text-slate-400">
                  Tính trung bình cộng tất cả điểm môn đã nhập ở mục B, dùng để so với điểm sàn/điểm chuẩn của
                  ngành.
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 4: THÔNG TIN PHỤ HUYNH & GHI CHÚ */}
          <div className="space-y-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 text-indigo-600">
              <Users className="h-5 w-5" />
              <h2 className="text-sm font-bold tracking-wide text-slate-800 uppercase">
                4. Thông Tin Phụ Huynh / Người Giám Hộ
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {/* Bố */}
              <div className="space-y-2 rounded-xl border border-slate-100 bg-slate-50/50 p-3">
                <span className="block text-xs font-bold text-slate-700">Thông tin Bố</span>
                <input
                  type="text"
                  placeholder="Họ tên Bố"
                  {...register('fatherName')}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm"
                />
                <input
                  type="text"
                  placeholder="SĐT Bố"
                  {...register('fatherPhone')}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-mono text-sm"
                />
              </div>
              {/* Mẹ */}
              <div className="space-y-2 rounded-xl border border-slate-100 bg-slate-50/50 p-3">
                <span className="block text-xs font-bold text-slate-700">Thông tin Mẹ</span>
                <input
                  type="text"
                  placeholder="Họ tên Mẹ"
                  {...register('motherName')}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm"
                />
                <input
                  type="text"
                  placeholder="SĐT Mẹ"
                  {...register('motherPhone')}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-mono text-sm"
                />
              </div>
              {/* Giám hộ */}
              <div className="space-y-2 rounded-xl border border-slate-100 bg-slate-50/50 p-3">
                <span className="block text-xs font-bold text-slate-700">Người Giám Hộ (Khác)</span>
                <input
                  type="text"
                  placeholder="Họ tên người giám hộ"
                  {...register('guardianName')}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm"
                />
                <input
                  type="text"
                  placeholder="SĐT người giám hộ"
                  {...register('guardianPhone')}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-mono text-sm"
                />
              </div>
            </div>
            {/* Ghi chú */}
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">Ghi Chú Bổ Sung</label>
              <textarea
                rows={2}
                placeholder="Nhập ghi chú thêm về hồ sơ này..."
                {...register('note')}
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
              />
            </div>
          </div>
        </form>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
          <GraduationCap className="h-12 w-12 text-slate-300" />
          <h3 className="mt-3 text-sm font-bold text-slate-700">Chưa Điền Hồ Sơ</h3>
          <p className="mt-1 max-w-sm text-xs text-slate-500">
            Vui lòng hoàn tất bước chọn Ngành, Hệ Đào Tạo và Đợt Tuyển Sinh ở phía trên để mở form nhập liệu.
          </p>
        </div>
      )}
    </div>
  )
}

export default TaoHoSoTuyenSinh
