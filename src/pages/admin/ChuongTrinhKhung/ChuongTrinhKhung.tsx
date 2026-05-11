import { Plus, School2 } from "lucide-react";
import {
  ChuongTrinhKhungProvider,
  useChuongTrinhKhungContext,
} from "./ChuongTrinhKhungProvider";
import Filters from "./Components/Filters";
import ChuongTrinhKhungList from "./Components/ChuongTrinhKhungList";
import PageShell from "../../../components/ui/PageShell";
import StatOverview from "./Components/StatOverview";
import ChuongTrinhKhungOne from "./ChuongTrinhKhungOne";

export default function CurriculumFrameworkPage() {
  return (
    <ChuongTrinhKhungProvider>
      <Inner />
    </ChuongTrinhKhungProvider>
  );
}

function Inner() {
  const {
    // data real
    curriculums,
    curriculumOne,
  } = useChuongTrinhKhungContext();

  return (
    <PageShell
      title="Chương trình khung"
      sub="Quản lý các chương trình khung đào tạo, bao gồm thông tin chung và danh mục môn học / mô-đun."
      icon={School2}
      renderRight={
        <div className="flex items-center justify-between">
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors shadow-sm">
            <Plus />
            Thêm chương trình
          </button>
        </div>
      }
    >
      <div className="min-h-screen bg-[#f4f5f8]">
        <div className="py-5 space-y-4">
          <StatOverview />

          <Filters />

          {/* Master / Detail */}
          <div className="flex gap-4 items-start">
            <ChuongTrinhKhungList data={curriculums || []} />

            {/* Detail */}
            {curriculumOne ? (
              <ChuongTrinhKhungOne data={curriculumOne!} />
            ) : (
              <div className="flex-1 bg-white rounded-xl border border-slate-200 flex flex-col items-center justify-center py-20 gap-4 text-center">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                  <svg
                    width="26"
                    height="26"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="text-slate-300"
                  >
                    <path
                      d="M4 19V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />
                    <path
                      d="M8 10h8M8 14h5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-black text-slate-500">
                    Chọn chương trình để xem chi tiết
                  </p>
                  <p className="text-sm text-slate-400 mt-1">
                    Bấm vào một chương trình ở danh sách bên trái.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
