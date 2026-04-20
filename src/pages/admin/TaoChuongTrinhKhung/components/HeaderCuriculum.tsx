/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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
  const handleInputChange = (key: keyof Curriculum, value: any) => {
    setCurriculum({ ...curriculum, [key]: value });
  };

  return (
    <div>
      <header className="border-b-2 border-editorial-ink pb-6 mb-8 flex justify-between items-end">
        <div>
          <div className="inline-block px-3 py-1 border border-editorial-ink rounded-full text-[11px] font-bold uppercase tracking-widest mb-3">
            Academic Registry
          </div>
          <h1 className="text-4xl font-bold leading-none tracking-tight">
            Thiết lập Chương trình Khung
          </h1>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-editorial-muted uppercase font-bold tracking-wider">
            Last updated: 20 Apr 2026
          </span>
        </div>
      </header>

      {/* Main Editorial Grid */}
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
          <div className="bg-white border border-editorial-border p-5 rounded-sm shadow-sm relative overflow-hidden">
            <h2 className="font-bold uppercase border-b border-editorial-border pb-3 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
              Thông số hệ thống
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block font-bold text-editorial-muted uppercase mb-1">
                  Khoa quản lý
                </label>
                <div className="text-sm font-medium text-editorial-ink truncate border-b border-dashed border-gray-200 pb-1">
                  {selectedMajor?.department || "N/A"}
                </div>
              </div>

              {/* Grid 2 cột cho Tín chỉ và Học kỳ để tiết kiệm chiều cao */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <span className="text-editorial-muted font-bold uppercase block">
                    Tổng tín chỉ
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-bold text-xl text-blue-600 leading-none">
                      {totalCredits}
                    </span>
                    <span className="text-[10px] font-bold text-blue-600/60 uppercase">
                      Tín chỉ
                    </span>
                  </div>
                </div>

                <div className="space-y-1 border-l border-editorial-border pl-4">
                  <span className="text-editorial-muted font-bold uppercase block">
                    Thời gian
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-bold text-xl text-editorial-ink leading-none">
                      {totalSemesters}
                    </span>
                    <span className="text-[10px] font-bold text-editorial-muted uppercase">
                      HK
                    </span>
                  </div>
                </div>
              </div>

              {/* Chú thích siêu nhỏ */}
              <p className="text-[10px] text-editorial-muted italic border-t border-gray-50 pt-3 opacity-70">
                * Dữ liệu tính toán tự động.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
