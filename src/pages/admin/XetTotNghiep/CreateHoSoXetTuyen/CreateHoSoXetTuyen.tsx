import {
  X,
  Search,
  GraduationCap,
  Hash,
  User,
  Calendar,
  BookOpen,
  Award,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";
import { useXetTotNghiepContext } from "../XetTotNghiepProvider";
import DetailItem from "../components/DetailItem";

type StudentInfo = {
  studentId: string;
  name: string;
  dob: string;
  className: string;
  faculty: string;
  major: string;
  credits: number;
  gpa: number;
  certificates: string[];
};

const CreateHoSoXetTuyen = () => {
  const { setIsModalOpen, handleAddStudent } = useXetTotNghiepContext();

  const [studentId, setStudentId] = useState("");
  const [loading, setLoading] = useState(false);
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);

  // 🚀 giả lập API
  const fetchStudent = async () => {
    if (!studentId) return;

    setLoading(true);

    // fake delay
    await new Promise((r) => setTimeout(r, 800));

    // mock data (sau này thay bằng API thật)
    setStudentInfo({
      studentId,
      name: "Nguyễn Văn A",
      dob: "2002-05-10",
      className: "CNTT1",
      faculty: "Công nghệ thông tin",
      major: "Kỹ thuật phần mềm",
      credits: 120,
      gpa: 3.2,
      certificates: ["TOEIC 550", "Tin học cơ bản"],
    });

    setLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentInfo) return;

    handleAddStudent(studentInfo);
    setIsModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 transition-opacity">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Header - Gradient nhẹ tạo cảm giác chuyên nghiệp */}
        <div className="flex items-center justify-between p-5 border-b bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <GraduationCap size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">
                Thêm hồ sơ xét tốt nghiệp
              </h3>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                Hệ thống quản lý sinh viên
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(false)}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Nhập MSSV - Tách biệt rõ ràng */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Mã số sinh viên
            </label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Hash
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="Ví dụ: B20DCCN123..."
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-slate-100 rounded-xl focus:border-blue-500 focus:ring-0 outline-none transition-all bg-slate-50 focus:bg-white text-slate-700 font-medium"
                />
              </div>
              <button
                type="button"
                onClick={fetchStudent}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl flex items-center gap-2 shadow-lg shadow-blue-200 transition-all active:scale-95"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Search size={18} />
                )}
                Tải dữ liệu
              </button>
            </div>
          </div>

          {/* Thông tin sinh viên - Card-based layout */}
          {studentInfo ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="grid grid-cols-2 gap-4">
                {/* Cột 1: Thông tin cá nhân */}
                <div className="space-y-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <h4 className="text-xs font-bold text-blue-600 uppercase flex items-center gap-2">
                    <User size={14} /> Thông tin cá nhân
                  </h4>
                  <DetailItem
                    icon={<User size={14} />}
                    label="Họ tên"
                    value={studentInfo.name}
                    bold
                  />
                  <DetailItem
                    icon={<Calendar size={14} />}
                    label="Ngày sinh"
                    value={studentInfo.dob}
                  />
                  <DetailItem
                    icon={<BookOpen size={14} />}
                    label="Lớp"
                    value={studentInfo.className}
                  />
                </div>

                {/* Cột 2: Thông tin học tập */}
                <div className="space-y-4 p-4 rounded-2xl bg-blue-50/30 border border-blue-100">
                  <h4 className="text-xs font-bold text-blue-600 uppercase flex items-center gap-2">
                    <GraduationCap size={14} /> Kết quả học tập
                  </h4>
                  <div className="flex justify-between items-end">
                    <DetailItem
                      label="Tín chỉ tích lũy"
                      value={`${studentInfo.credits} / 120`}
                    />
                    <div className="text-right">
                      <p className="text-[10px] text-slate-500 uppercase font-bold">
                        GPA
                      </p>
                      <p className="text-xl font-black text-blue-700 leading-none">
                        {studentInfo.gpa}
                      </p>
                    </div>
                  </div>
                  <DetailItem label="Khoa" value={studentInfo.faculty} />
                  <DetailItem label="Ngành" value={studentInfo.major} />
                </div>

                {/* Dòng 3: Chứng chỉ - Full width */}
                <div className="col-span-2 p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                  <h4 className="text-xs font-bold text-emerald-700 uppercase flex items-center gap-2 mb-3">
                    <Award size={14} /> Chứng chỉ & Điều kiện cần
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {studentInfo.certificates.map((c, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-white border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-full flex items-center gap-1.5 shadow-sm"
                      >
                        <CheckCircle2 size={12} />
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400">
              <Search size={40} strokeWidth={1} className="mb-2" />
              <p className="text-sm font-medium">
                Vui lòng nhập MSSV để kiểm tra dữ liệu
              </p>
            </div>
          )}

          {/* Action Footer */}
          <div className="flex gap-3 mt-8">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 px-4 py-3 border-2 border-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={!studentInfo}
              className="flex-1 px-4 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-black disabled:opacity-30 disabled:cursor-not-allowed shadow-xl shadow-slate-200 transition-all active:scale-95"
            >
              Xác nhận hồ sơ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateHoSoXetTuyen;
