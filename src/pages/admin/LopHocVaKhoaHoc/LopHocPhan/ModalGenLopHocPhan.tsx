import { useState } from "react";
import {
  X,
  Layers,
  BookOpen,
  GraduationCap,
  CalendarDays,
  Sparkles,
  CheckCircle2,
  ListFilter,
  Users,
} from "lucide-react";
import { SelectOption } from "../../../../components/ui/Form/SelectOption";
import ButtonAction from "../../../../components/ui/ButtonAction";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const GenLopHocPhanModal = ({ isOpen, onClose }: Props) => {
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  // 1. Data giả lập cho các bộ lọc (Select Options)
  const nganhOptions = [
    { value: "cntt", label: "Công nghệ thông tin" },
    { value: "ktpm", label: "Kỹ thuật phần mềm" },
    { value: "anm", label: "An toàn thông tin" },
  ];

  const khoaDaoTaoOptions = [
    { value: "k22", label: "Khóa 2022 (K22)" },
    { value: "k23", label: "Khóa 2023 (K23)" },
    { value: "k24", label: "Khóa 2024 (K24)" },
  ];

  const lopOptions = [
    { value: "all", label: "Tất cả các lớp thuộc khóa" },
    { value: "cntt1", label: "K22_CNTT01" },
    { value: "cntt2", label: "K22_CNTT02" },
  ];

  const hocKyOptions = [
    { value: "hk1-2026", label: "Học kỳ 1 (2026 - 2027)" },
    { value: "hk2-2026", label: "Học kỳ 2 (2026 - 2027)" },
  ];

  // 2. Data giả lập danh sách môn học & lớp học phần dự kiến sẽ gen
  const mockSubjectPreviews = [
    {
      id: 1,
      subjectCode: "INT1306",
      subjectName: "Cấu trúc dữ liệu và Giải thuật",
      credits: 3,
      currentClasses: ["K22_CNTT01", "K22_CNTT02"],
      expectedSections: 2,
    },
    {
      id: 2,
      subjectCode: "INT13110",
      subjectName: "Lập trình Web nâng cao (ReactJS & NestJS)",
      credits: 3,
      currentClasses: ["K22_CNTT01"],
      expectedSections: 1,
    },
    {
      id: 3,
      subjectCode: "MAT1101",
      subjectName: "Xác suất thống kê",
      credits: 2,
      currentClasses: ["K22_CNTT01", "K22_CNTT02"],
      expectedSections: 2,
    },
  ];

  const handleGenData = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      alert("UI Trigger: Tạo lớp học phần tự động thành công!");
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-tr from-blue-500 to-indigo-500 text-white rounded-xl shadow-md shadow-blue-100">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Khởi tạo Lớp học phần
              </h2>
              <p className="text-xs text-gray-500">
                Tự động cấu trúc lớp học phần dựa trên chương trình khung
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        {/* Modal Content Area */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Section 1: Bộ lọc cấu hình cấu trúc (Filters) */}
          <div className="bg-gray-50/60 p-4 rounded-xl border border-gray-100/80">
            <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
              <ListFilter size={16} className="text-blue-500" /> Cấu hình điều
              kiện lọc
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <SelectOption
                label="Chọn ngành học"
                icon={<Layers size={14} className="text-gray-400" />}
                options={nganhOptions}
                defaultValue="cntt"
              />
              <SelectOption
                label="Khóa đào tạo"
                icon={<GraduationCap size={14} className="text-gray-400" />}
                options={khoaDaoTaoOptions}
                defaultValue="k22"
              />
              <SelectOption
                label="Lớp sinh viên"
                icon={<Users size={14} className="text-gray-400" />}
                options={lopOptions}
                defaultValue="all"
              />
              <SelectOption
                label="Học kỳ áp dụng"
                icon={<CalendarDays size={14} className="text-gray-400" />}
                options={hocKyOptions}
                defaultValue="hk1-2026"
              />
            </div>
          </div>

          {/* Section 2: Danh sách xem trước kết quả sẽ tạo */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <BookOpen size={16} className="text-indigo-500" />
                Danh sách môn học & Lớp dự kiến cấu hình
              </h3>
              <span className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full font-medium border border-blue-100">
                Phát hiện {mockSubjectPreviews.length} môn học tương thích
              </span>
            </div>

            {/* Table View */}
            <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <th className="px-5 py-3">Mã môn / Tên môn học</th>
                    <th className="px-4 py-3 text-center">Số TC</th>
                    <th className="px-5 py-3">Các lớp hành chính thụ hưởng</th>
                    <th className="px-4 py-3 text-center">Số lớp HP dự kiến</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm text-gray-700">
                  {mockSubjectPreviews.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50/80 transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <div className="font-mono text-xs text-blue-600 font-semibold mb-0.5">
                          {item.subjectCode}
                        </div>
                        <div className="font-semibold text-gray-800">
                          {item.subjectName}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-center font-medium">
                        {item.credits}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex flex-wrap gap-1.5">
                          {item.currentClasses.map((cls, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md border border-gray-200/60 font-mono"
                            >
                              {cls}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full font-bold text-xs border border-indigo-100">
                          {item.expectedSections} Lớp HP
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Chú ý giải thích cơ chế UI */}
            <p className="text-xs text-gray-400 italic">
              * Hệ thống dựa trên lộ trình tiến độ khung của khóa đào tạo để gom
              nhóm và gợi ý số lượng học phần tối ưu.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex-shrink-0">
          <ButtonAction
            type="button"
            variant="outline"
            className="px-5"
            onClick={onClose}
            disabled={isGenerating}
          >
            Hủy bỏ
          </ButtonAction>
          <ButtonAction
            type="button"
            variant="primary"
            className="px-6 shadow-md shadow-blue-200"
            icon={<CheckCircle2 size={16} />}
            loading={isGenerating}
            onClick={handleGenData}
          >
            Xác nhận Gen lớp học phần
          </ButtonAction>
        </div>
      </div>
    </div>
  );
};

export default GenLopHocPhanModal;
