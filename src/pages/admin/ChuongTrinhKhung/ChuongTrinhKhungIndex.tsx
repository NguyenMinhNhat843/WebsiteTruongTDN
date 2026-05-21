import { Plus, School2, Loader2 } from "lucide-react";
import {
  ChuongTrinhKhungProvider,
  useChuongTrinhKhungContext,
} from "./ChuongTrinhKhungProvider";
import Filters from "./ChươngTrinhKhungList/Filters";
import ChuongTrinhKhungList from "./ChươngTrinhKhungList/ChuongTrinhKhungList";
import PageShell from "../../../components/ui/PageShell";
import ChuongTrinhKhungOne from "./ChuongTrinhKhungOne/ChuongTrinhKhungOne";
import { useNavigate } from "react-router-dom";

export default function CurriculumFrameworkPage() {
  return (
    <ChuongTrinhKhungProvider>
      <Inner />
    </ChuongTrinhKhungProvider>
  );
}

function Inner() {
  const {
    curriculums,
    isCurriculumsPending,
    isCurriculumOnePending,
    curriculumOne,
  } = useChuongTrinhKhungContext();
  const navigate = useNavigate();

  return (
    <PageShell
      title="Chương trình khung"
      sub="Quản lý các chương trình khung đào tạo, bao gồm thông tin chung và danh mục môn học / mô-đun."
      icon={School2}
      renderRight={
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/admin/dao-tao/tao-chuong-trinh-khung")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 
          text-white text-sm font-semibold px-4 py-2.5 rounded-xl 
          transition-all shadow-sm hover:shadow-md active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Thêm chương trình
          </button>
        </div>
      }
    >
      <div className="min-h-screen bg-[#f8fafc]">
        {/* Đổi nền sang slate-50 sáng sủa hơn */}
        <div className="space-y-6">
          {/* Bộ lọc */}
          <Filters />

          {/* Cấu trúc Master / Detail */}
          <div className="flex gap-6 items-start">
            {/* Cột danh sách (Trái) */}
            <div className="w-96 shrink-0">
              {isCurriculumsPending ? (
                // Skeleton Loading cho danh sách bên trái
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="bg-white border border-slate-100 rounded-xl p-4 animate-pulse space-y-3"
                    >
                      <div className="flex justify-between items-center">
                        <div className="h-5 bg-slate-200 rounded-full w-24" />
                        <div className="h-4 bg-slate-100 rounded w-14" />
                      </div>
                      <div className="h-5 bg-slate-200 rounded w-3/4" />
                      <div className="pt-2 border-t border-slate-50 flex justify-between">
                        <div className="h-4 bg-slate-100 rounded w-1/2" />
                        <div className="h-4 bg-slate-200 rounded w-12" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <ChuongTrinhKhungList data={curriculums || []} />
              )}
            </div>

            {/* Cột Chi tiết (Phải) */}
            <div className="flex-1 min-w-0">
              {isCurriculumOnePending ? (
                // Hiệu ứng Loading khi đang tải chi tiết 1 chương trình
                <div className="bg-white rounded-xl border border-slate-200 p-8 min-h-[400px] flex flex-col items-center justify-center text-center">
                  <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-3" />
                  <p className="text-sm font-medium text-slate-500 animate-pulse">
                    Đang tải thông tin chi tiết...
                  </p>
                </div>
              ) : curriculumOne ? (
                <ChuongTrinhKhungOne data={curriculumOne} />
              ) : (
                // Trạng thái trống (Empty State) chỉn chu hơn
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-col items-center justify-center py-24 px-6 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shadow-inner mb-4">
                    <svg
                      width="28"
                      height="28"
                      fill="none"
                      viewBox="0 0 24 24"
                      className="text-slate-400"
                    >
                      <path
                        d="M4 19V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M8 10h8M8 14h5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-700 text-base">
                      Chọn chương trình để xem chi tiết
                    </h4>
                    <p className="text-sm text-slate-400 mt-1 max-w-xs mx-auto">
                      Vui lòng bấm vào một chương trình học ở danh sách bên trái
                      để theo dõi cấu trúc môn học.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
