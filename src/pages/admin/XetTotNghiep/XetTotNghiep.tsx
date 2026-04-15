import {
  GraduationCap,
  CheckCircle2,
  XCircle,
  FileText,
  Download,
  UserPlus,
  X,
} from "lucide-react";
import { INITIAL_MAJORS } from "./mockData";
import {
  useXetTotNghiepContext,
  XetTotNghiepProvider,
} from "./XetTotNghiepProvider";
import PageShell from "../../../components/ui/PageShell";
import ButtonAction from "../../../components/ui/ButtonAction";
import FilterSection from "./components/FilterSection";
import TableSinhVienXetTotNghiep from "./TableSinhVienXetTotNghiep";

const GraduationManagement = () => {
  return (
    <XetTotNghiepProvider>
      <Inner />
    </XetTotNghiepProvider>
  );
};

const Inner = () => {
  const {
    isModalOpen,
    setIsModalOpen,
    newStudent,
    setNewStudent,
    filteredStudents,
    handleAddStudent,
  } = useXetTotNghiepContext();

  return (
    <PageShell
      title="Hệ thống xét tốt nghiệp"
      sub="Quản lý danh sách dự kiến và quyết định tốt nghiệp"
      icon={<GraduationCap size={26} />}
      renderRight={
        <div className="flex flex-wrap gap-3">
          <ButtonAction
            icon={<UserPlus size={20} />}
            onClick={() => setIsModalOpen(true)}
          >
            Thêm học sinh
          </ButtonAction>
          <ButtonAction icon={<Download size={20} />}>
            Xuất báo cáo
          </ButtonAction>
        </div>
      }
    >
      <div className="py-4">
        <div className="pb-4">
          <FilterSection />
        </div>

        {/* Content Table */}
        <TableSinhVienXetTotNghiep />

        {/* Modal Thêm Sinh Viên */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200">
              <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <h3 className="text-xl font-bold text-slate-800">
                  Thêm sinh viên xét duyệt
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddStudent} className="p-6 space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">
                      Họ và tên
                    </label>
                    <input
                      required
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nhập tên sinh viên..."
                      onChange={(e) =>
                        setNewStudent({ ...newStudent, name: e.target.value })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">
                        Hệ đào tạo
                      </label>
                      <select
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                        onChange={(e) =>
                          setNewStudent({
                            ...newStudent,
                            system: e.target.value as any,
                          })
                        }
                      >
                        <option value="Trung cấp">Trung cấp nghề</option>
                        <option value="Sơ cấp">Sơ cấp nghề</option>
                        <option value="9+">Hệ 9+</option>
                        <option value="Đại học liên kết">
                          Đại học liên kết
                        </option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">
                        Điểm TB
                      </label>
                      <input
                        required
                        type="number"
                        step="0.1"
                        max="4"
                        min="0"
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                        onChange={(e) =>
                          setNewStudent({
                            ...newStudent,
                            gpa: parseFloat(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">
                      Ngành đào tạo
                    </label>
                    <select
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                      onChange={(e) =>
                        setNewStudent({ ...newStudent, major: e.target.value })
                      }
                    >
                      {INITIAL_MAJORS.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                    <input
                      type="checkbox"
                      id="cert"
                      className="h-4 w-4 text-blue-600 rounded"
                      onChange={(e) =>
                        setNewStudent({
                          ...newStudent,
                          vocationalCert: e.target.checked,
                        })
                      }
                    />
                    <label
                      htmlFor="cert"
                      className="text-sm font-semibold text-blue-700 select-none"
                    >
                      Đã nộp Chứng chỉ nghề bắt buộc
                    </label>
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-md"
                  >
                    Xác nhận thêm
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
};

export default GraduationManagement;
