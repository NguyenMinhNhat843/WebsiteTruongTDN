import { CalendarDays, CheckCircle2, Plus, School } from "lucide-react";
import PageShell from "../../../components/ui/PageShell";
import TableLopHocList from "./TableLopHocList";
import { useNavigate } from "react-router-dom";
import CreateLopHoc from "./CreateLopHoc";
import ButtonAction from "../../../components/ui/ButtonAction";
import { useLopHocContext } from "./LopHocProvider";
import SearchClassSection from "./components/SearchClassSection";

const LopHocList = () => {
  const {
    LopHocList,
    isLoadingLopHocList,
    isOpenModalCreate,
    setIsOpenModalCreate,
  } = useLopHocContext();
  const navigate = useNavigate();

  // Thống kê nhanh số liệu lớp học
  const totalClasses = LopHocList?.length || 0;
  const activeClasses =
    LopHocList?.filter((c) => c.status === "active").length || 0;

  return (
    <PageShell
      title="Danh sách lớp học"
      sub="Quản lý và theo dõi thông tin tổng quan các lớp học trong hệ thống"
      renderRight={
        <div className="flex gap-3">
          <ButtonAction
            type="button"
            variant="primary"
            icon={<Plus size={16} />}
            label="Phân lớp tự động"
            onClick={() => navigate("/admin/hoc-sinh/phan-lop")}
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Card 1: Tổng số lớp */}
          <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <School className="w-6 h-6" strokeWidth={2} />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                Tổng số lớp
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                {totalClasses} lớp
              </h3>
            </div>
          </div>

          {/* Card 2: Đang hoạt động */}
          <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle2 className="w-6 h-6" strokeWidth={2} />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                Đang hoạt động
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                {activeClasses} lớp
              </h3>
            </div>
          </div>

          {/* Card 3: Khóa học hiện tại */}
          <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <CalendarDays className="w-6 h-6" strokeWidth={2} />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                Khóa học hiện tại
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                Năm {new Date().getFullYear()}
              </h3>
            </div>
          </div>
        </div>

        <SearchClassSection />

        {isLoadingLopHocList ? (
          <div className="h-96 bg-slate-100 rounded-2xl border border-slate-200 animate-pulse flex items-center justify-center">
            <span className="text-sm text-slate-400 font-medium">
              Đang cập nhật danh sách lớp...
            </span>
          </div>
        ) : (
          <TableLopHocList />
        )}
      </div>

      <CreateLopHoc
        isOpen={isOpenModalCreate}
        onClose={() => setIsOpenModalCreate(false)}
      />
    </PageShell>
  );
};

export default LopHocList;
