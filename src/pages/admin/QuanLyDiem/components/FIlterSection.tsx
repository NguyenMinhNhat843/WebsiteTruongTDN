import { Filter, RefreshCcw } from "lucide-react";
import { useState } from "react";
import { SelectOption } from "../../../../components/ui/Form/SelectOption";
import SearchInput from "../../../../components/ui/Form/SearchInput";

const DEPARTMENTS = ["Công nghệ thông tin", "Kinh tế", "Ngoại ngữ"];
const FACULTIES = {
  "Công nghệ thông tin": [
    "Kỹ thuật phần mềm",
    "An toàn thông tin",
    "Khoa học máy tính",
  ],
  "Kinh tế": ["Quản trị kinh doanh", "Kế toán", "Tài chính ngân hàng"],
  "Ngoại ngữ": ["Ngôn ngữ Anh", "Ngôn ngữ Nhật"],
};
const SEMESTERS = ["Học kỳ 1", "Học kỳ 2"];
const YEARS = ["2023-2024", "2024-2025", "2025-2026"];

const FilterSection = () => {
  const [filters, setFilters] = useState({
    department: "",
    faculty: "",
    teacher: "",
    year: "2025-2026",
    semester: "Học kỳ 2",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFilters({
      department: "",
      faculty: "",
      teacher: "",
      year: "2025-2026",
      semester: "Học kỳ 2",
    });
  };

  return (
    <div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-6">
        <div className="flex items-center gap-2 mb-4 text-slate-800 font-semibold">
          <Filter size={20} />
          <h2>Bộ lọc tìm kiếm</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <SearchInput
            label="Tên giáo viên"
            placeholder="Tên giáo viên..."
            value={filters.teacher}
            onChange={handleChange}
          />

          {/* Lọc theo Ngành */}
          <SelectOption
            label="Ngành"
            name="department"
            value={filters.department}
            onChange={handleChange}
            options={[
              { value: "", label: "Tất cả ngành" },
              ...DEPARTMENTS.map((d) => ({ value: d, label: d })),
            ]}
          />

          {/* Lọc theo Khoa */}
          <SelectOption
            label="Khoa"
            name="faculty"
            value={filters.faculty}
            onChange={handleChange}
            options={[
              { value: "", label: "Tất cả khoa" },
              ...(filters.department
                ? FACULTIES[filters.department]?.map((f) => ({
                    value: f,
                    label: f,
                  }))
                : []),
            ]}
          />

          {/* Lọc theo Năm học */}
          <SelectOption
            label="Năm học"
            name="year"
            value={filters.year}
            onChange={handleChange}
            options={YEARS.map((y) => ({ value: y, label: y }))}
          />

          {/* Lọc theo Học kỳ */}
          <SelectOption
            label="Học kỳ"
            name="semester"
            value={filters.semester}
            onChange={handleChange}
            options={SEMESTERS.map((s) => ({ value: s, label: s }))}
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={handleReset}
            className="text-sm flex items-center gap-2 px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors"
          >
            <RefreshCcw size={18} />
            Làm mới
          </button>
          <button className="text-sm flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-md shadow-blue-100 transition-all">
            Áp dụng bộ lọc
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterSection;
