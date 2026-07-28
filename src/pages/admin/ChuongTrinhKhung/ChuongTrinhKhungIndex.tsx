import { Plus, School2, Loader2, BookOpen } from 'lucide-react'
import { ChuongTrinhKhungProvider, useChuongTrinhKhungContext } from './ChuongTrinhKhungProvider'
import ChuongTrinhKhungList from './List/ChuongTrinhKhungList'
import PageShell from '../../../components/ui/PageShell'
import ChuongTrinhKhungOne from './ChuongTrinhKhungOne/ChuongTrinhKhungOne'
import { useNavigate } from 'react-router-dom'
import ButtonAction from '../../../components/ui/ButtonAction'

export default function CurriculumFrameworkPage() {
  return (
    <ChuongTrinhKhungProvider>
      <Inner />
    </ChuongTrinhKhungProvider>
  )
}

function Inner() {
  const { curriculums, isCurriculumsFetching, isCurriculumOneFetching, curriculumOne } =
    useChuongTrinhKhungContext()
  const navigate = useNavigate()

  return (
    <PageShell
      title="Chương trình khung"
      sub="Quản lý các chương trình khung đào tạo, bao gồm thông tin chung và danh mục môn học / mô-đun."
      icon={School2}
      renderRight={
        <ButtonAction
          label="Thêm chương trình"
          variant="primary"
          icon={<Plus size={16} />}
          onClick={() => navigate('/admin/dao-tao/tao-chuong-trinh-khung')}
        />
      }
    >
      <div className="min-h-screen bg-[#f8fafc]">
        <div className="space-y-6">
          <div className="flex items-start gap-6">
            <div className="w-96 shrink-0">
              {isCurriculumsFetching ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="animate-pulse space-y-3 rounded-xl border border-slate-100 bg-white p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="h-5 w-24 rounded-full bg-slate-200" />
                        <div className="h-4 w-14 rounded bg-slate-100" />
                      </div>
                      <div className="h-5 w-3/4 rounded bg-slate-200" />
                      <div className="flex justify-between border-t border-slate-50 pt-2">
                        <div className="h-4 w-1/2 rounded bg-slate-100" />
                        <div className="h-4 w-12 rounded bg-slate-200" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <ChuongTrinhKhungList data={curriculums || []} />
              )}
            </div>

            {/* Cột Chi tiết (Phải) */}
            <div className="min-w-0 flex-1">
              {isCurriculumOneFetching ? (
                // Hiệu ứng Loading khi đang tải chi tiết 1 chương trình
                <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-8 text-center">
                  <Loader2 className="mb-3 h-8 w-8 animate-spin text-blue-500" />
                  <p className="animate-pulse text-sm font-medium text-slate-500">
                    Đang tải thông tin chi tiết...
                  </p>
                </div>
              ) : curriculumOne ? (
                <ChuongTrinhKhungOne data={curriculumOne} />
              ) : (
                // Trạng thái trống (Empty State)
                <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-white px-6 py-24 text-center shadow-sm">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 text-slate-400 shadow-inner transition-colors">
                    <BookOpen className="h-7 w-7 stroke-[1.75]" />
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-slate-700">
                      Chọn chương trình để xem chi tiết
                    </h4>
                    <p className="mx-auto mt-1 max-w-xs text-sm text-slate-400">
                      Vui lòng bấm vào một chương trình học ở danh sách bên trái để theo dõi cấu trúc môn học.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
