import type { components } from '../v1'

// Enum cho trạng thái học sinh
export type StudentStatusEnum = components['schemas']['StudentResponseDto']['status']
export const STUDENT_STATUS_MAP: Record<NonNullable<StudentStatusEnum>, string> = {
  registered: 'Đợi tư vấn',
  pending: 'Chờ xét tuyển',
  failed: 'Không đậu',
  approved: 'Đã đậu / Chờ nhập học',
  studying: 'Đã nhập học / Đang học',
  dropped: 'Thôi học',
  graduated: 'Đã tốt nghiệp',
}
export const STUDENT_STATUS_TABS = [
  { value: '' as StudentStatusEnum, label: 'Tất cả' },
  ...Object.entries(STUDENT_STATUS_MAP).map(([value, label]) => ({
    value: value as StudentStatusEnum,
    label,
  })),
]

// Enum các ngày trong tuần
export type EnumDayOfWeek = components['schemas']['ClassSubjectSessionDto']['dayOfWeek']

// Enum roles người dùng
export type EnumRoleUser = components['schemas']['UserResponseDto']['role']
export const UserRoles: EnumRoleUser[] = ['admin', 'teacher', 'staff', 'student']
export const UserRoleViMap: Record<EnumRoleUser, string> = {
  admin: 'Quản trị viên',
  teacher: 'Giáo viên',
  staff: 'Nhân viên',
  student: 'Học sinh',
}

// ============================================================
// ENUMS & MAPS CHO MODULE TUYỂN SINH (ADMISSION)
// ============================================================

// 1. Trạng thái đợt tuyển sinh (CampaignStatus)
export type CampaignStatusEnum = components['schemas']['AdmissionCampaignDto']['status']
export const CAMPAIGN_STATUS_MAP: Record<
  NonNullable<CampaignStatusEnum>,
  { label: string; colorClass: string }
> = {
  PLANNING: { label: 'Lập kế hoạch', colorClass: 'bg-amber-50 text-amber-700 border-amber-200' },
  OPEN: { label: 'Đang nhận hồ sơ', colorClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  CLOSED: { label: 'Đã hết hạn', colorClass: 'bg-rose-50 text-rose-700 border-rose-200' },
  COMPLETED: { label: 'Hoàn tất', colorClass: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
}

// 2. Trạng thái hồ sơ tuyển sinh (ApplicationStatus)
export type ApplicationStatusEnum = components['schemas']['AdmissionProfileDto']['status']
export const APPLICATION_STATUS_MAP: Record<
  NonNullable<ApplicationStatusEnum>,
  { label: string; colorClass: string }
> = {
  REGISTERED: { label: 'Mới đăng ký', colorClass: 'bg-sky-50 text-sky-700 border-sky-200' },
  SUBMITTED: { label: 'Đã nộp đủ hồ sơ', colorClass: 'bg-blue-50 text-blue-700 border-blue-200' },
  APPROVED: { label: 'Đã trúng tuyển', colorClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  CONFIRMED: { label: 'Đã xác nhận nhập học', colorClass: 'bg-teal-50 text-teal-700 border-teal-200' },
  ENROLLED: { label: 'Đã nhập học chính thức', colorClass: 'bg-purple-50 text-purple-700 border-purple-200' },
  REJECTED: { label: 'Hồ sơ không hợp lệ / Rớt', colorClass: 'bg-rose-50 text-rose-700 border-rose-200' },
  CANCELLED: { label: 'Đã hủy đăng ký', colorClass: 'bg-slate-100 text-slate-600 border-slate-200' },
}

export const APPLICATION_STATUS_TABS = [
  { value: '', label: 'Tất cả hồ sơ' },
  ...Object.entries(APPLICATION_STATUS_MAP).map(([key, val]) => ({
    value: key,
    label: val.label,
  })),
]

// 4. Trình độ / Hệ đào tạo (TrainingType)
export type TrainingTypeEnum = components['schemas']['AdmissionCampaignMajorDto']['trainingType']
export const TRAINING_TYPE_MAP: Record<NonNullable<TrainingTypeEnum>, string> = {
  VOCATIONAL_INTERMEDIATE: 'Trung cấp Nghề',
  VOCATIONAL_ELEMENTARY: 'Sơ cấp Nghề',
}

// 5. Trạng thái tài liệu số hóa (DocumentStatus)
export type DocumentStatusEnum = components['schemas']['AdmissionDocumentDto']['status']
export const DOCUMENT_STATUS_MAP: Record<
  NonNullable<DocumentStatusEnum>,
  { label: string; colorClass: string }
> = {
  PENDING: { label: 'Chờ duyệt', colorClass: 'bg-amber-50 text-amber-700 border-amber-200' },
  APPROVED: { label: 'Đã duyệt', colorClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  REJECTED: { label: 'Từ chối / Yêu cầu nộp lại', colorClass: 'bg-rose-50 text-rose-700 border-rose-200' },
}
