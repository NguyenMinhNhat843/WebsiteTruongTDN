import { useState, useMemo } from "react";
import type { EducationSystem, Student } from "./typeDataResponse";
import { INITIAL_STUDENTS } from "./DataTemple";

// --- 3. MAIN COMPONENT ---
export default function SchoolAdminApp() {
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSystem, setFilterSystem] = useState<EducationSystem | "All">(
    "All",
  );

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"VIEW" | "EDIT">("VIEW");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Logic lọc dữ liệu phía FE
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchSystem = filterSystem === "All" || s.system === filterSystem;
      const matchSearch =
        s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.id.toLowerCase().includes(searchTerm.toLowerCase());
      return matchSystem && matchSearch;
    });
  }, [students, filterSystem, searchTerm]);

  // Handlers
  const handleOpenModal = (student: Student, mode: "VIEW" | "EDIT") => {
    setSelectedStudent(student);
    setModalMode(mode);
    setIsModalOpen(true);
  };

  const handleUpdateStudent = (updatedData: Student) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === updatedData.id ? updatedData : s)),
    );
    setIsModalOpen(false);
  };

  const handleDeleteStudent = (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa hồ sơ này?")) {
      setStudents((prev) => prev.filter((s) => s.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight">
              Hồ sơ học sinh
            </h1>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold shadow-md transition-all active:scale-95">
            + Thêm hồ sơ mới
          </button>
        </header>

        {/* Toolbar: Search & Filter */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="md:col-span-2 relative">
            <span className="absolute left-3 top-2.5 text-slate-400">🔍</span>
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc mã sinh viên..."
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white cursor-pointer"
            value={filterSystem}
            onChange={(e) => setFilterSystem(e.target.value as any)}
          >
            <option value="All">Tất cả hệ đào tạo</option>
            <option value="9+">Hệ 9+ (Phổ thông + Nghề)</option>
            <option value="Cao đẳng">Hệ Cao đẳng</option>
            <option value="Liên kết Đại học">Liên kết Đại học</option>
          </select>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-4 font-semibold text-slate-600 text-sm">
                    Mã SV
                  </th>
                  <th className="p-4 font-semibold text-slate-600 text-sm">
                    Học viên
                  </th>
                  <th className="p-4 font-semibold text-slate-600 text-sm">
                    Hệ đào tạo
                  </th>
                  <th className="p-4 font-semibold text-slate-600 text-sm">
                    Chuyên ngành
                  </th>
                  <th className="p-4 font-semibold text-slate-600 text-sm">
                    Trạng thái
                  </th>
                  <th className="p-4 font-semibold text-slate-600 text-sm text-center">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-blue-50/30 transition-colors group"
                  >
                    <td className="p-4 font-mono text-sm text-slate-500">
                      {student.id}
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-800">
                        {student.fullName}
                      </div>
                      <div className="text-xs text-slate-500">
                        {student.phoneNumber}
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold ${
                          student.system === "9+"
                            ? "bg-purple-100 text-purple-700"
                            : student.system === "Cao đẳng"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {student.system}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-slate-600">
                      {student.major}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
                          student.status === "Đã nhập học"
                            ? "bg-green-100 text-green-700"
                            : student.status === "Đã rút hồ sơ"
                              ? "bg-red-100 text-red-700"
                              : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                        {student.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenModal(student, "VIEW")}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Xem chi tiết"
                        >
                          👁️
                        </button>
                        <button
                          onClick={() => handleOpenModal(student, "EDIT")}
                          className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                          title="Chỉnh sửa"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteStudent(student.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Xóa"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredStudents.length === 0 && (
            <div className="py-20 text-center">
              <div className="text-4xl mb-2">📁</div>
              <p className="text-slate-400 font-medium">
                Không tìm thấy hồ sơ sinh viên nào.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* --- MODAL COMPONENT (In-file) --- */}
      {isModalOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in duration-300">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/80">
              <h3 className="text-xl font-bold text-slate-800">
                {modalMode === "EDIT"
                  ? "Chỉnh sửa thông tin"
                  : "Chi tiết hồ sơ học viên"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <ModalForm
                data={selectedStudent}
                mode={modalMode}
                onSave={handleUpdateStudent}
                onCancel={() => setIsModalOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- 4. SUB-COMPONENT: MODAL FORM ---
interface ModalFormProps {
  data: Student;
  mode: "VIEW" | "EDIT";
  onSave: (val: Student) => void;
  onCancel: () => void;
}

function ModalForm({ data, mode, onSave, onCancel }: ModalFormProps) {
  const [tempData, setTempData] = useState<Student>({ ...data });
  const isEdit = mode === "EDIT";

  const labelClass = "block text-sm font-semibold text-slate-700 mb-1.5";
  const inputClass = `w-full px-4 py-2.5 border rounded-xl transition-all outline-none ${
    isEdit
      ? "border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
      : "border-transparent bg-slate-50 text-slate-900 font-medium"
  }`;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <label className={labelClass}>Họ và Tên</label>
          <input
            disabled={!isEdit}
            className={inputClass}
            value={tempData.fullName}
            onChange={(e) =>
              setTempData({ ...tempData, fullName: e.target.value })
            }
          />
        </div>

        <div>
          <label className={labelClass}>Hệ đào tạo</label>
          <select
            disabled={!isEdit}
            className={inputClass}
            value={tempData.system}
            onChange={(e) =>
              setTempData({ ...tempData, system: e.target.value as any })
            }
          >
            <option value="9+">Hệ 9+</option>
            <option value="Cao đẳng">Cao đẳng</option>
            <option value="Liên kết Đại học">Liên kết Đại học</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Chuyên ngành</label>
          <input
            disabled={!isEdit}
            className={inputClass}
            value={tempData.major}
            onChange={(e) =>
              setTempData({ ...tempData, major: e.target.value })
            }
          />
        </div>

        <div>
          <label className={labelClass}>Số điện thoại</label>
          <input
            disabled={!isEdit}
            className={inputClass}
            value={tempData.phoneNumber}
            onChange={(e) =>
              setTempData({ ...tempData, phoneNumber: e.target.value })
            }
          />
        </div>

        <div>
          <label className={labelClass}>Email</label>
          <input
            disabled={!isEdit}
            className={inputClass}
            value={tempData.email}
            onChange={(e) =>
              setTempData({ ...tempData, email: e.target.value })
            }
          />
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>Trạng thái hiện tại</label>
          <div className="flex flex-wrap gap-2 pt-1">
            {(
              ["Đang xử lý", "Đã nhập học", "Đã rút hồ sơ"] as StudentStatus[]
            ).map((st) => (
              <button
                key={st}
                disabled={!isEdit}
                onClick={() => setTempData({ ...tempData, status: st })}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  tempData.status === st
                    ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                } ${!isEdit && tempData.status !== st ? "hidden" : ""}`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>Địa chỉ thường trú</label>
          <textarea
            disabled={!isEdit}
            rows={2}
            className={inputClass}
            value={tempData.address}
            onChange={(e) =>
              setTempData({ ...tempData, address: e.target.value })
            }
          />
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="px-6 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors"
        >
          {isEdit ? "Hủy bỏ" : "Đóng"}
        </button>
        {isEdit && (
          <button
            onClick={() => onSave(tempData)}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-100 transition-all active:scale-95"
          >
            Lưu thay đổi
          </button>
        )}
      </div>
    </div>
  );
}
