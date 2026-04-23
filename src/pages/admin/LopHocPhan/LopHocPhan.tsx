import { useState } from "react";
import {
  GraduationCap,
  Layers,
  ChevronRight,
  Search,
  CalendarDays,
  Info,
} from "lucide-react";
import { SelectOption } from "../../../components/ui/Form/SelectOption";
import ButtonAction from "../../../components/ui/ButtonAction";
import PageShell from "../../../components/ui/PageShell";
import ReusableTable from "../../../components/ui/Table";
import CreateCourseModule from "./CreateLopHocPhan";
import ChuongTrinhTheoHocKy from "./ChuongTrinhTheoHocKy";
/* eslint-disable @typescript-eslint/no-explicit-any */
const MOCK_CLASSES = [
  {
    id: "1",
    code: "DCNK20A",
    gvcn: "Nguyễn Văn A",
    totalStudents: 35,
    period: "2021-2026",
    currentSemester: "Học kỳ 3",
    major: "Điện công nghiệp",
    batch: "K20",
  },
  {
    id: "2",
    code: "DCNK20B",
    gvcn: "Trần Thị B",
    totalStudents: 32,
    period: "2021-2026",
    currentSemester: "Học kỳ 3",
    major: "Điện công nghiệp",
    batch: "K20",
  },
  {
    id: "3",
    code: "DCNK20C",
    gvcn: "Lê Văn C",
    totalStudents: 30,
    period: "2021-2026",
    currentSemester: "Học kỳ 3",
    major: "Điện công nghiệp",
    batch: "K20",
  },
];

const LopHocPhan = () => {
  const [formData, setFormData] = useState({
    semester: "",
    major: "",
    batch: "",
  });

  const isNextDisabled = !formData.semester || !formData.major;

  // Chỉ hiển thị table khi đã chọn đủ 3 filter chính
  const isFilterReady = formData.semester && formData.major && formData.batch;

  // Định nghĩa cột cho ReusableTable
  const columns = [
    { key: "code", label: "Tên lớp", className: "font-bold" },
    { key: "gvcn", label: "Giáo viên chủ nhiệm" },
    {
      key: "totalStudents",
      label: "Sĩ số",
      render: (item: any) => `${item.totalStudents} học sinh`,
    },
    { key: "period", label: "Niên khóa" },
    {
      key: "currentSemester",
      label: "HK Thực tế",
      className: "font-medium",
    },
  ];

  return (
    <PageShell title="Tạo Lớp Học Phần" icon={Layers}>
      <div className="p-8 bg-white rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-800">
            Chọn thông tin lớp
          </h2>
          <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full">
            <Info size={16} />
            <span className="text-xs font-medium">
              Chọn đủ thông tin để hiển thị lớp học phần
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Học kỳ */}
          <SelectOption
            label="Học kỳ"
            require
            icon={<CalendarDays size={18} className="text-blue-500" />} // Màu xanh dương cho thời gian
            value={formData.semester}
            options={[
              { value: "HK1-2025", label: "Học kỳ 1 - 2025" },
              { value: "HK2-2025", label: "Học kỳ 2 - 2025" },
              { value: "HK3-2025", label: "Học kỳ 3 - 2025" },
              { value: "HK1-2026", label: "Học kỳ 1 - 2026" },
              { value: "HK2-2026", label: "Học kỳ 2 - 2026" },
              { value: "HK3-2026", label: "Học kỳ 3 - 2026" },
            ]}
            className="bg-slate-50 border-blue-700"
            onChange={(e) =>
              setFormData({ ...formData, semester: e.target.value })
            }
          />

          {/* Ngành học */}
          <SelectOption
            label="Ngành học"
            require
            icon={<GraduationCap size={18} className="text-emerald-500" />} // Màu xanh lá cho giáo dục
            value={formData.major}
            options={[
              { value: " - ", label: " - " },
              { value: "CNTT", label: "Công nghệ thông tin" },
              { value: "Kế toán doanh nghiệp", label: "Kế toán doanh nghiệp" },
              { value: "Hàn điện dân dụng", label: "Hàn điện dân dụng" },
              { value: "Điện công nghiệp", label: "Điện công nghiệp" },
            ]}
            className="bg-slate-50 border-emerald-700"
            onChange={(e) =>
              setFormData({ ...formData, major: e.target.value })
            }
          />

          {/* Khóa đào tạo */}
          <SelectOption
            label="Khóa đào tạo"
            icon={<Layers size={18} className="text-amber-500" />} // Màu cam cho phân lớp/khóa
            options={["K20", "K21", "K22", "K23"].map((khoa) => ({
              value: khoa,
              label: khoa,
            }))}
            value={formData.batch}
            className="bg-slate-50 border-amber-700"
            onChange={(e) =>
              setFormData({ ...formData, batch: e.target.value })
            }
          />
        </div>

        {/* Nút điều hướng */}
        <div className="flex justify-end mt-10 pt-6 border-t border-slate-100">
          <ButtonAction
            label="Tìm kiếm lớp học"
            icon={<ChevronRight size={18} />}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl transition-all shadow-md"
            onClick={() =>
              !isNextDisabled && console.log("Data Step 1:", formData)
            }
          />
        </div>
      </div>

      {/* Section Danh sách lớp */}
      {isFilterReady ? (
        <div>
          <div className="mt-6 bg-white overflow-hidden">
            <div className="pb-2 flex justify-between items-center">
              <h3 className="font-bold text-slate-700 flex items-center gap-2">
                <Search size={18} /> Danh sách lớp tìm thấy (
                {MOCK_CLASSES.length})
              </h3>
            </div>

            <ReusableTable
              data={MOCK_CLASSES}
              columns={columns}
              rowKey="id"
              emptyMessage="Không tìm thấy lớp học nào cho bộ lọc này."
            />
          </div>

          {/* Section Danh sách môn học trong kỳ này */}
          <div className="pt-6">
            <h3 className="font-bold pb-2 text-slate-700 flex items-center gap-2">
              <Search size={18} /> Các môn học trong kỳ{" "}
              {formData.semester.split("-")[0]} -{" "}
              {formData.semester.split("-")[1]} (dựa trên chương trình khung )
            </h3>
            <ChuongTrinhTheoHocKy />
          </div>

          {/* Khoảng đệm và đường kẻ */}
          <div className="relative py-10">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-slate-50 px-4 text-sm font-semibold text-slate-500 uppercase tracking-wider">
                Bắt đầu khởi tạo & Phân bổ
              </span>
            </div>
          </div>

          {/* Section Tạo lớp học phần */}
          <div className="pt-6">
            <CreateCourseModule />
          </div>
        </div>
      ) : (
        <div className="text-center p-12 mt-6 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
          <p className="text-slate-500">
            Vui lòng chọn đầy đủ Học kỳ, Ngành và Khóa để xem danh sách lớp.
          </p>
        </div>
      )}
    </PageShell>
  );
};

export default LopHocPhan;
