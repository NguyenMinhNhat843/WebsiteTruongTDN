import Input from "../../../../components/ui/Form/Input";
import { SelectOption } from "../../../../components/ui/Form/SelectOption";
import { MAJORS, type Curriculum, type Major } from "../type";

interface CurriculumHeaderProps {
  curriculum: Curriculum;
  setCurriculum: (curriculum: Curriculum) => void;
  selectedMajor: Major | undefined;
  totalCredits: number;
  totalSemesters: number;
}

export function CurriculumHeader({
  curriculum,
  setCurriculum,
  selectedMajor,
  totalCredits,
  totalSemesters,
}: CurriculumHeaderProps) {
  const handleInputChange = (key: keyof Curriculum, value: unknown) => {
    setCurriculum({ ...curriculum, [key]: value });
  };

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        {/* Form Inputs (Left side) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {/* Mã CTK */}
            <Input
              label="Mã chương trình đào tạo"
              placeholder="Nhập mã CTK..."
              value={curriculum.code}
              onChange={(e) => handleInputChange("code", e.target.value)}
            />

            {/* Phiên bản */}
            <Input
              label="Phiên bản (Version)"
              type="number"
              placeholder="Nhập phiên bản..."
              value={curriculum.version}
              onChange={(e) =>
                handleInputChange("version", Number(e.target.value))
              }
            />

            {/* Tên CTK - Chiếm 2 cột */}
            <div className="md:col-span-2">
              <Input
                label="Tên chương trình đào tạo"
                placeholder="Nhập tên chương trình..."
                value={curriculum.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </div>

            {/* Hệ đào tạo */}
            <SelectOption
              label="Hệ đào tạo"
              options={[
                { label: "Chọn hệ đào tạo", value: "" },
                ...["9+", "Trung cấp nghề", "Sơ cấp nghề"].map((t) => ({
                  label: t,
                  value: t,
                })),
              ]}
              value={curriculum.trainingType}
              onChange={(e) =>
                handleInputChange("trainingType", e.target.value)
              }
            />

            {/* Trạng thái */}
            <SelectOption
              label="Trạng thái hệ thống"
              options={[
                { label: "Active (Đang hoạt động)", value: "active" },
                { label: "Inactive (Ngừng áp dụng)", value: "inactive" },
              ]}
              value={curriculum.status}
              onChange={(e) => handleInputChange("status", e.target.value)}
            />

            {/* Ngành đào tạo chính - Chiếm 2 cột */}
            <div className="md:col-span-2">
              <SelectOption
                label="Ngành đào tạo chính"
                options={[
                  { label: "Chọn ngành đào tạo...", value: "" },
                  ...MAJORS.map((m) => ({
                    label: m.name,
                    value: m.id,
                  })),
                ]}
                value={curriculum.majorId}
                onChange={(e) => handleInputChange("majorId", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Summary Card (Right side) */}
        <aside className="space-y-4">
          {" "}
          {/* Giảm space-y từ 8 xuống 4 */}
          <div className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm relative overflow-hidden">
            {/* Header với phong cách hiện đại hơn */}
            <h2 className="text-[13px] font-bold text-gray-700 uppercase tracking-wider border-b border-gray-50 pb-4 mb-5 flex items-center gap-2">
              <span className="flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
              </span>
              Thông số hệ thống
            </h2>

            <div className="space-y-5">
              {/* Khoa Quản Lý - Thiết kế dạng thông tin định danh */}
              <div className="group">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-tight mb-1.5">
                  Đơn vị quản lý chuyên môn
                </label>
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-transparent group-hover:border-blue-100 group-hover:bg-blue-50/30 transition-all">
                  <span className="text-blue-600 text-[14px]">🏢</span>
                  <span className="text-[13px] font-semibold text-gray-700 truncate">
                    {selectedMajor?.department || "Chưa xác định"}
                  </span>
                </div>
              </div>

              {/* Stats Grid - Tín chỉ & Học kỳ */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                {/* Tín chỉ */}
                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100/50">
                  <span className="text-[10px] text-blue-600 font-bold uppercase block mb-1">
                    Tổng tín chỉ
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-blue-700 leading-none">
                      {totalCredits}
                    </span>
                    <span className="text-[10px] font-bold text-blue-400 uppercase">
                      TC
                    </span>
                  </div>
                </div>

                {/* Học kỳ */}
                <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-100">
                  <span className="text-[10px] text-gray-500 font-bold uppercase block mb-1">
                    Thời gian
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-gray-800 leading-none">
                      {totalSemesters}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">
                      HK
                    </span>
                  </div>
                </div>
              </div>

              {/* Ghi chú dưới cùng */}
              <div className="flex items-start gap-2 pt-2 border-t border-gray-50">
                <span className="text-gray-300 text-[12px]">💡</span>
                <p className="text-[10px] text-gray-400 leading-relaxed italic">
                  Các thông số được đồng bộ hóa trực tiếp dựa trên cấu trúc môn
                  học hiện tại.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
