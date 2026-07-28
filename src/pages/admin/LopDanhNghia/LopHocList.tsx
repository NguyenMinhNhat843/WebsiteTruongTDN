import { CalendarDays, CheckCircle2, Plus, School, School2 } from 'lucide-react'
import PageShell from '../../../components/ui/PageShell'
import TableLopHocList from './List/TableLopHocList'
import { useNavigate } from 'react-router-dom'
import CreateLopHoc from './Create/CreateLopHoc'
import ButtonAction from '../../../components/ui/ButtonAction'
import { useLopHocContext } from './LopHocProvider'
import SearchClassSection from './List/components/SearchClassSection'
import { LoadingWrapper } from '../../../components/ui/LoadingWrapper'

const LopHocList = () => {
  const { LopHocList, isLoadingLopHocList, isOpenModalCreate, setIsOpenModalCreate } = useLopHocContext()
  const navigate = useNavigate()

  // Thống kê nhanh số liệu lớp học
  const totalClasses = LopHocList?.length || 0
  const activeClasses = LopHocList?.filter((c) => c.status === 'active').length || 0

  return (
    <PageShell
      title="Danh sách lớp học"
      sub="Quản lý và theo dõi thông tin tổng quan các lớp học trong hệ thống"
      icon={School2}
      renderRight={
        <div className="flex gap-3">
          <ButtonAction
            type="button"
            variant="primary"
            icon={<Plus size={16} />}
            label="Phân lớp tự động"
            onClick={() => navigate('/admin/hoc-sinh/phan-lop')}
          />

          <ButtonAction
            type="button"
            variant="outline"
            icon={<Plus size={16} />}
            label="Tạo lớp thủ công"
            onClick={() => setIsOpenModalCreate(true)}
          />
        </div>
      }
    >
      <div className="space-y-6 bg-slate-50 text-slate-800">
        {/* STATS OVERVIEW CARDS */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Card 1: Tổng số lớp */}
          <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <School className="h-6 w-6" strokeWidth={2} />
            </div>
            <div>
              <span className="text-xs font-medium tracking-wider text-slate-400 uppercase">Tổng số lớp</span>
              <h3 className="mt-0.5 text-xl font-bold text-slate-900">{totalClasses} lớp</h3>
            </div>
          </div>

          {/* Card 2: Đang hoạt động */}
          <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
              <CheckCircle2 className="h-6 w-6" strokeWidth={2} />
            </div>
            <div>
              <span className="text-xs font-medium tracking-wider text-slate-400 uppercase">
                Đang hoạt động
              </span>
              <h3 className="mt-0.5 text-xl font-bold text-slate-900">{activeClasses} lớp</h3>
            </div>
          </div>

          {/* Card 3: Khóa học hiện tại */}
          <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
              <CalendarDays className="h-6 w-6" strokeWidth={2} />
            </div>
            <div>
              <span className="text-xs font-medium tracking-wider text-slate-400 uppercase">
                Khóa học hiện tại
              </span>
              <h3 className="mt-0.5 text-xl font-bold text-slate-900">Năm {new Date().getFullYear()}</h3>
            </div>
          </div>
        </div>

        <SearchClassSection />

        <LoadingWrapper isLoading={isLoadingLopHocList} message="Đang tải danh sách lớp học...">
          <TableLopHocList />
        </LoadingWrapper>
      </div>

      <CreateLopHoc isOpen={isOpenModalCreate} onClose={() => setIsOpenModalCreate(false)} />
    </PageShell>
  )
}

export default LopHocList
