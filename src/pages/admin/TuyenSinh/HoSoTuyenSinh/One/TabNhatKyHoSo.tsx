import { Clock, History } from 'lucide-react'
import { useHoSoTuyenSinhOneContext } from './HoSoTuyenSinhOneProvider'
import { APPLICATION_STATUS_MAP, type ApplicationStatusEnum } from '../../../../../api/enum'

const TabNhatKyHoSo = () => {
  const { profileData } = useHoSoTuyenSinhOneContext()
  return (
    <div className="space-y-4">
      <h3 className="flex items-center gap-2 font-bold text-indigo-600">
        <History className="h-4 w-4" /> Lịch Sử Thay Đổi Trạng Thái
      </h3>
      {profileData?.statusLogs && profileData?.statusLogs.length > 0 ? (
        <div className="relative space-y-4 border-l-2 border-indigo-100 pl-4">
          {profileData.statusLogs.map((log) => {
            const toStatusConfig = APPLICATION_STATUS_MAP[
              log.toStatus as NonNullable<ApplicationStatusEnum>
            ] || { label: log.toStatus, colorClass: 'bg-slate-100 text-slate-700' }

            return (
              <div key={log.id} className="group relative">
                {/* Dot indicator */}
                <div className="absolute top-1 -left-[21px] h-2.5 w-2.5 rounded-full border-2 border-white bg-indigo-600 ring-2 ring-indigo-100" />

                <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${toStatusConfig.colorClass}`}
                    >
                      {toStatusConfig.label}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-slate-400">
                      <Clock className="h-3 w-3" />
                      {log.createdAt ? new Date(log.createdAt).toLocaleString('vi-VN') : ''}
                    </span>
                  </div>

                  {log.reason && (
                    <p className="mt-2 text-xs font-medium text-slate-700">Ghi chú: {log.reason}</p>
                  )}

                  <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-500">
                    <span>Người thực hiện:</span>
                    <span className="font-semibold text-slate-700">
                      {log.isSystem ? 'Hệ thống (Tự động)' : log.byUser?.username || 'NPH / Quản trị viên'}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <p className="text-xs text-slate-400 italic">Chưa có nhật ký trạng thái.</p>
      )}
    </div>
  )
}

export default TabNhatKyHoSo
