import React, { useState, useMemo } from "react";
import {
  GraduationCap,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  Download,
  Plus,
  UserPlus,
  X,
} from "lucide-react";

// --- Types Definitions ---

type EducationSystem = "Trung cấp" | "Sơ cấp" | "9+" | "Đại học liên kết";

type StudentStatus = "Đủ điều kiện" | "Không đủ điều kiện" | "Đang xem xét";

interface Student {
  id: string;
  name: string;
  system: EducationSystem;
  major: string;
  gpa: number;
  vocationalCert: boolean;
  status: StudentStatus;
}

// --- Mock Data Initial ---

const INITIAL_MAJORS = [
  "Kỹ thuật máy tính",
  "Điện công nghiệp",
  "Sửa chữa ô tô",
  "Quản trị mạng",
  "Kế toán",
];

const MOCK_STUDENTS: Student[] = [
  {
    id: "SV001",
    name: "Nguyễn Văn A",
    system: "Trung cấp",
    major: "Kỹ thuật máy tính",
    gpa: 3.2,
    vocationalCert: true,
    status: "Đủ điều kiện",
  },
  {
    id: "SV002",
    name: "Trần Thị B",
    system: "9+",
    major: "Điện công nghiệp",
    gpa: 2.8,
    vocationalCert: true,
    status: "Đủ điều kiện",
  },
  {
    id: "SV003",
    name: "Lê Văn C",
    system: "Sơ cấp",
    major: "Sửa chữa ô tô",
    gpa: 2.4,
    vocationalCert: false,
    status: "Không đủ điều kiện",
  },
  {
    id: "SV004",
    name: "Phạm Minh D",
    system: "Đại học liên kết",
    major: "Quản trị mạng",
    gpa: 3.5,
    vocationalCert: true,
    status: "Đang xem xét",
  },
];

// --- Main Component ---

const GraduationManagement: React.FC = () => {
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterSystem, setFilterSystem] = useState<EducationSystem | "All">(
    "All",
  );
  const [filterStatus, setFilterStatus] = useState<StudentStatus | "All">(
    "All",
  );
  const [filterMajor, setFilterMajor] = useState<string>("All");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State cho sinh viên mới
  const [newStudent, setNewStudent] = useState<Partial<Student>>({
    system: "Trung cấp",
    status: "Đang xem xét",
    vocationalCert: false,
    major: INITIAL_MAJORS[0],
  });

  // Logic lọc dữ liệu tổng hợp
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.id.includes(searchTerm);
      const matchesSystem = filterSystem === "All" || s.system === filterSystem;
      const matchesStatus = filterStatus === "All" || s.status === filterStatus;
      const matchesMajor = filterMajor === "All" || s.major === filterMajor;
      return matchesSearch && matchesSystem && matchesStatus && matchesMajor;
    });
  }, [students, searchTerm, filterSystem, filterStatus, filterMajor]);

  // Handler thêm sinh viên
  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const studentToAdd = {
      ...newStudent,
      id: `SV${Math.floor(100 + Math.random() * 900)}`,
    } as Student;

    setStudents([studentToAdd, ...students]);
    setIsModalOpen(false);
    setNewStudent({
      system: "Trung cấp",
      status: "Đang xem xét",
      vocationalCert: false,
      major: INITIAL_MAJORS[0],
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      {/* Header */}
      <header className="mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <GraduationCap className="text-white" size={28} />
            </div>
            Hệ Thống Xét Tốt Nghiệp
          </h1>
          <p className="text-slate-500 mt-1">
            Quản lý danh sách dự kiến và quyết định tốt nghiệp
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-md active:scale-95"
          >
            <UserPlus size={20} />
            Thêm học sinh
          </button>
          <button className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-5 py-2.5 rounded-xl font-semibold transition-all shadow-sm">
            <Download size={20} />
            Xuất báo cáo
          </button>
        </div>
      </header>

      {/* Filter Toolbar */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Tìm kiếm */}
          <div className="relative">
            <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">
              Tìm kiếm
            </label>
            <Search
              className="absolute left-3 top-9 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Tên hoặc mã SV..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Hệ đào tạo */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">
              Hệ đào tạo
            </label>
            <select
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              value={filterSystem}
              onChange={(e) => setFilterSystem(e.target.value as any)}
            >
              <option value="All">Tất cả hệ</option>
              <option value="Trung cấp">Trung cấp nghề</option>
              <option value="Sơ cấp">Sơ cấp nghề</option>
              <option value="9+">Hệ 9+</option>
              <option value="Đại học liên kết">Đại học liên kết</option>
            </select>
          </div>

          {/* Ngành học */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">
              Ngành học
            </label>
            <select
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              value={filterMajor}
              onChange={(e) => setFilterMajor(e.target.value)}
            >
              <option value="All">Tất cả ngành</option>
              {INITIAL_MAJORS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Trạng thái xét duyệt */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">
              Trạng thái xét
            </label>
            <div className="flex gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200">
              {(
                [
                  "All",
                  "Đủ điều kiện",
                  "Không đủ điều kiện",
                  "Đang xem xét",
                ] as const
              ).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status as any)}
                  className={`flex-1 py-1.5 text-[10px] font-bold rounded-md transition-all ${
                    filterStatus === status
                      ? "bg-white shadow-sm text-blue-600 border border-slate-100"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {status === "All" ? "TẤT CẢ" : status.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200 text-slate-500">
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">
                  Sinh viên
                </th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">
                  Hệ đào tạo
                </th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">
                  Ngành
                </th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">
                  Điểm TB
                </th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-center">
                  CC Nghề
                </th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">
                  Kết quả
                </th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-right">
                  Chi tiết
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((s) => (
                <tr
                  key={s.id}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                        {s.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800">{s.name}</div>
                        <div className="text-xs text-slate-400 font-mono">
                          {s.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-600">
                    {s.system}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {s.major}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`font-mono font-bold ${s.gpa >= 2.5 ? "text-slate-700" : "text-red-500"}`}
                    >
                      {s.gpa.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      {s.vocationalCert ? (
                        <div className="bg-green-100 p-1 rounded-full">
                          <CheckCircle2 size={16} className="text-green-600" />
                        </div>
                      ) : (
                        <div className="bg-red-100 p-1 rounded-full">
                          <XCircle size={16} className="text-red-500" />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ring-1 ring-inset ${
                        s.status === "Đủ điều kiện"
                          ? "bg-green-50 text-green-700 ring-green-600/20"
                          : s.status === "Không đủ điều kiện"
                            ? "bg-red-50 text-red-700 ring-red-600/20"
                            : "bg-yellow-50 text-yellow-700 ring-yellow-600/20"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          s.status === "Đủ điều kiện"
                            ? "bg-green-600"
                            : s.status === "Không đủ điều kiện"
                              ? "bg-red-600"
                              : "bg-yellow-600"
                        }`}
                      />
                      {s.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-blue-600 transition-colors p-2 hover:bg-blue-50 rounded-lg">
                      <FileText size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
                      <option value="Đại học liên kết">Đại học liên kết</option>
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
  );
};

export default GraduationManagement;
