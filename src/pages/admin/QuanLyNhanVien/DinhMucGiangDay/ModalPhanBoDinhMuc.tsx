import { useEffect, useMemo, useState } from 'react'
import { CheckCircle2, Loader2, ShieldCheck, X } from 'lucide-react'
import { $api } from '../../../../api/client'

interface ModalPhanBoDinhMucProps {
  isOpen: boolean
  onClose: () => void
  staffId?: number
  staffName?: string
  academicYearId?: number
  onSuccess?: () => void
}

const ModalPhanBoDinhMuc = ({
  isOpen,
  onClose,
  staffId,
  staffName,
  academicYearId,
  onSuccess,
}: ModalPhanBoDinhMucProps) => {
  // 1. API lấy danh sách chức vụ của giáo viên
  const { data: positions, isLoading: isLoadingPositions } = $api.useQuery(
    'get',
    '/staff-positions',
    {
      params: {
        query: {
          staffId: staffId!,
        },
      },
    },
    {
      enabled: isOpen && !!staffId,
    },
  )

  // 2. API Phân bổ định mức (POST /teaching-quotas)
  const { mutate: createTeachingQuota, isPending: isSubmitting } = $api.useMutation(
    'post',
    '/teaching-quotas',
    {
      onSuccess: () => {
        onSuccess?.()
        onClose()
      },
    },
  )

  // 3. Logic tìm Chức vụ có PRIORITY cao nhất để lấy % giảm trừ
  const highestPriorityPosition = useMemo(() => {
    if (!positions || positions.length === 0) return null

    return [...positions]
      .filter((p) => p.position !== null)
      .sort((a, b) => (b.position?.priority ?? 0) - (a.position?.priority ?? 0))[0]
  }, [positions])

  // Lấy % giảm trừ từ chức vụ có priority cao nhất
  const reductionPercent = highestPriorityPosition?.position?.reductionPercent ?? 0

  // State lưu thông tin Form (Mặc định 450 giờ chuẩn)
  const [baseHours, setBaseHours] = useState<number>(450)
  const [actualHours, setActualHours] = useState<number>(0)

  // Reset/Re-init state khi mở Modal
  useEffect(() => {
    if (isOpen) {
      setBaseHours(450)
      setActualHours(0)
    }
  }, [isOpen])

  // Tính số giờ thực tế sau giảm trừ
  const finalHours = Math.round(baseHours * (1 - reductionPercent / 100))

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!staffId || !academicYearId) return

    createTeachingQuota({
      body: {
        staffId,
        academicYearId,
        baseHours: Number(baseHours),
        reductionPercent: Number(reductionPercent),
        actualHours: Number(actualHours),
        finalHours: Number(finalHours),
      },
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Phân Bổ Định Mức Giảng Dạy</h3>
            {staffName && (
              <p className="mt-0.5 text-xs text-slate-500">
                Giáo viên: <span className="font-semibold text-slate-700">{staffName}</span>
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* BODY */}
        {isLoadingPositions ? (
          <div className="flex flex-col items-center justify-center py-12 text-sm text-slate-400">
            <Loader2 className="mb-2 h-8 w-8 animate-spin text-blue-600" />
            Đang tải dữ liệu chức vụ giáo viên...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 p-5">
            {/* HIỂN THỊ CHỨC VỤ CAO NHẤT ĐƯỢC ÁP DỤNG */}
            <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-3.5">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                <div className="space-y-1 text-xs">
                  <span className="block font-semibold text-slate-700">Chức vụ áp dụng giảm trừ:</span>
                  {highestPriorityPosition?.position ? (
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-blue-800">{highestPriorityPosition.position.name}</span>
                      <span className="rounded bg-blue-100 px-2 py-0.5 font-bold text-blue-700">
                        Giảm {reductionPercent}%
                      </span>
                    </div>
                  ) : (
                    <span className="text-slate-500 italic">Không giữ chức vụ quản lý (Giảm 0%)</span>
                  )}
                </div>
              </div>
            </div>

            {/* NHẬP ĐỊNH MỨC CƠ BẢN (BASE HOURS) & ĐỊNH MỨC SAU GIẢM */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">
                  Số giờ chuẩn / năm (*)
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={baseHours}
                  onChange={(e) => setBaseHours(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Ví dụ: 450"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">
                  Định mức sau giảm (Final)
                </label>
                <input
                  type="number"
                  disabled
                  value={finalHours}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-blue-600"
                />
              </div>
            </div>

            {/* SỐ GIỜ ĐÃ DẠY BAN ĐẦU */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">
                Số giờ đã dạy ban đầu (Actual Hours)
              </label>
              <input
                type="number"
                min={0}
                value={actualHours}
                onChange={(e) => setActualHours(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Mặc định: 0"
              />
            </div>

            {/* NÚT THAO TÁC */}
            <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                )}
                Xác nhận phân bổ
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default ModalPhanBoDinhMuc
