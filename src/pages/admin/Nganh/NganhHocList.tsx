import type { nganhHocResponse } from './NganhProvider'
import { FolderOpen, Building2, FileText } from 'lucide-react'

interface Props {
  data: nganhHocResponse[]
  renderActions?: (item: nganhHocResponse) => React.ReactNode
}

const NganhHocList = ({ data, renderActions }: Props) => {
  // Empty State - Tối giản & Trang nhã
  if (!data || data.length === 0) {
    return (
      <div className="flex w-full flex-col items-center justify-center rounded-xl border border-slate-200/80 bg-white py-16 text-center shadow-sm">
        <div className="mb-3 rounded-xl border border-slate-100 bg-slate-50 p-4 text-slate-400">
          <FolderOpen size={32} strokeWidth={1.5} />
        </div>
        <p className="text-sm font-bold text-slate-800">Chưa có dữ liệu ngành học</p>
        <p className="mt-1 max-w-sm text-xs text-slate-500">
          Không tìm thấy ngành học nào trong hệ thống. Vui lòng thêm mới hoặc điều chỉnh lại bộ lọc search.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {data.map((item, index) => (
        <div
          key={item.id || index}
          className="group relative flex flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm transition-all duration-200 hover:border-slate-300 hover:shadow-md"
        >
          <div>
            {/* Header Card: Mã ngành & Thao tác */}
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 font-mono text-xs font-bold tracking-wide text-slate-700 uppercase">
                {item.majorCode}
              </span>

              {/* Vùng hành động (Sửa / Xóa) */}
              {renderActions && (
                <div className="opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                  {renderActions(item)}
                </div>
              )}
            </div>

            {/* Tên ngành học */}
            <h3 className="line-clamp-2 min-h-[48px] text-base leading-snug font-bold text-slate-900 transition-colors group-hover:text-indigo-600">
              {item.majorName}
            </h3>

            {/* Chi tiết thông tin */}
            <div className="mt-4 space-y-2.5 border-t border-slate-100 pt-4 text-xs text-slate-600">
              {/* Khoa trực thuộc */}
              <div className="flex items-start gap-2.5">
                <Building2 size={15} className="mt-0.5 shrink-0 text-slate-400" />
                <div className="min-w-0">
                  <span className="block text-[11px] font-medium text-slate-400">Đơn vị quản lý</span>
                  <span
                    className="block truncate font-semibold text-slate-800"
                    title={item.department?.deptName || ''}
                  >
                    {item.department?.deptName || (
                      <span className="font-normal text-slate-400 italic">Chưa phân khoa</span>
                    )}
                  </span>
                </div>
              </div>

              {/* Mô tả tóm tắt */}
              <div className="flex items-start gap-2.5">
                <FileText size={15} className="mt-0.5 shrink-0 text-slate-400" />
                <div className="min-w-0">
                  <span className="block text-[11px] font-medium text-slate-400">Mô tả</span>
                  <p
                    className="line-clamp-2 leading-relaxed font-normal text-slate-600"
                    title={item.description || ''}
                  >
                    {item.description || 'Chưa có thông tin mô tả chi tiết.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default NganhHocList
