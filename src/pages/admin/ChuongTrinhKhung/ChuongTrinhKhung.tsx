import { useState, useMemo } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type EduSystem =
  | "cao_dang"
  | "trung_cap"
  | "9_cong_10"
  | "dai_hoc_lien_ket"
  | "day_nghe_ngan_han"
  | "day_nghe_so_cap";

type Status = "active" | "draft" | "archived";
type ModuleType =
  | "chung"
  | "co_so"
  | "chuyen_mon"
  | "tu_chon"
  | "thuc_hanh"
  | "thuc_tap";
type UnitType = "tin_chi" | "don_vi_hoc_trinh" | "gio";

interface LearningModule {
  id: string;
  code: string;
  name: string;
  units: number;
  unitType: UnitType;
  theory: number;
  practice: number;
  type: ModuleType;
  semester: number;
  prerequisite?: string[];
  isKey?: boolean;
}

interface Term {
  id: number;
  label: string;
  modules: LearningModule[];
  internship?: boolean;
}

interface CurriculumFramework {
  id: string;
  code: string;
  name: string;
  major: string;
  eduSystem: EduSystem;
  department: string;
  totalUnits: number;
  unitType: UnitType;
  duration: string;
  terms: Term[];
  status: Status;
  effectiveYear: number;
  issuedBy: string;
  decisionNo: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Constants ─────────────────────────────────────────────────────────────────

const EDU_SYSTEM_META: Record<
  EduSystem,
  {
    label: string;
    short: string;
    color: string;
    bg: string;
    border: string;
    accent: string;
  }
> = {
  cao_dang: {
    label: "Cao đẳng",
    short: "CĐ",
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
    accent: "#3b82f6",
  },
  trung_cap: {
    label: "Trung cấp",
    short: "TC",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    accent: "#10b981",
  },
  "9_cong_10": {
    label: "9+ (9 cộng 10)",
    short: "9+",
    color: "text-violet-700",
    bg: "bg-violet-50",
    border: "border-violet-200",
    accent: "#8b5cf6",
  },
  dai_hoc_lien_ket: {
    label: "Đại học liên kết",
    short: "ĐHLK",
    color: "text-orange-700",
    bg: "bg-orange-50",
    border: "border-orange-200",
    accent: "#f97316",
  },
  day_nghe_ngan_han: {
    label: "Dạy nghề ngắn hạn",
    short: "DNNH",
    color: "text-pink-700",
    bg: "bg-pink-50",
    border: "border-pink-200",
    accent: "#ec4899",
  },
  day_nghe_so_cap: {
    label: "Dạy nghề sơ cấp",
    short: "DNSC",
    color: "text-teal-700",
    bg: "bg-teal-50",
    border: "border-teal-200",
    accent: "#14b8a6",
  },
};

const STATUS_META: Record<
  Status,
  { label: string; dot: string; text: string; bg: string }
> = {
  active: {
    label: "Đang áp dụng",
    dot: "bg-emerald-500",
    text: "text-emerald-700",
    bg: "bg-emerald-50 border border-emerald-200",
  },
  draft: {
    label: "Bản nháp",
    dot: "bg-amber-400",
    text: "text-amber-700",
    bg: "bg-amber-50 border border-amber-200",
  },
  archived: {
    label: "Lưu trữ",
    dot: "bg-slate-400",
    text: "text-slate-500",
    bg: "bg-slate-100 border border-slate-200",
  },
};

const MODULE_TYPE_META: Record<
  ModuleType,
  { label: string; color: string; bar: string }
> = {
  chung: {
    label: "Môn chung",
    color: "bg-slate-100 text-slate-600",
    bar: "bg-slate-400",
  },
  co_so: {
    label: "Cơ sở nghề",
    color: "bg-blue-100 text-blue-700",
    bar: "bg-blue-500",
  },
  chuyen_mon: {
    label: "Chuyên môn",
    color: "bg-indigo-100 text-indigo-700",
    bar: "bg-indigo-600",
  },
  tu_chon: {
    label: "Tự chọn",
    color: "bg-violet-100 text-violet-700",
    bar: "bg-violet-500",
  },
  thuc_hanh: {
    label: "Thực hành",
    color: "bg-amber-100 text-amber-700",
    bar: "bg-amber-500",
  },
  thuc_tap: {
    label: "Thực tập",
    color: "bg-orange-100 text-orange-700",
    bar: "bg-orange-500",
  },
};

const UNIT_LABEL: Record<UnitType, string> = {
  tin_chi: "tín chỉ",
  don_vi_hoc_trinh: "ĐVHT",
  gio: "giờ",
};

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockData: CurriculumFramework[] = [
  {
    id: "1",
    code: "CTK-CĐ-CNTT-2024",
    name: "Công nghệ thông tin",
    major: "Công nghệ thông tin",
    eduSystem: "cao_dang",
    department: "Khoa CNTT",
    totalUnits: 90,
    unitType: "tin_chi",
    duration: "3 năm",
    status: "active",
    effectiveYear: 2024,
    issuedBy: "Bộ LĐTBXH",
    decisionNo: "2713/QĐ-BLĐTBXH",
    createdAt: "2024-01-10",
    updatedAt: "2024-06-01",
    terms: [
      {
        id: 1,
        label: "Học kỳ 1",
        modules: [
          {
            id: "m1",
            code: "MH01",
            name: "Giáo dục chính trị",
            units: 2,
            unitType: "tin_chi",
            theory: 30,
            practice: 0,
            type: "chung",
            semester: 1,
          },
          {
            id: "m2",
            code: "MH02",
            name: "Pháp luật",
            units: 1,
            unitType: "tin_chi",
            theory: 15,
            practice: 0,
            type: "chung",
            semester: 1,
          },
          {
            id: "m3",
            code: "MH03",
            name: "Giáo dục thể chất",
            units: 1,
            unitType: "tin_chi",
            theory: 0,
            practice: 30,
            type: "chung",
            semester: 1,
          },
          {
            id: "m4",
            code: "MĐ04",
            name: "Tin học văn phòng",
            units: 3,
            unitType: "tin_chi",
            theory: 15,
            practice: 60,
            type: "co_so",
            semester: 1,
          },
          {
            id: "m5",
            code: "MĐ05",
            name: "Lập trình căn bản",
            units: 4,
            unitType: "tin_chi",
            theory: 30,
            practice: 90,
            type: "co_so",
            semester: 1,
            isKey: true,
          },
          {
            id: "m6",
            code: "MH06",
            name: "Tiếng Anh 1",
            units: 3,
            unitType: "tin_chi",
            theory: 30,
            practice: 30,
            type: "chung",
            semester: 1,
          },
        ],
      },
      {
        id: 2,
        label: "Học kỳ 2",
        modules: [
          {
            id: "m7",
            code: "MĐ07",
            name: "Lập trình hướng đối tượng",
            units: 4,
            unitType: "tin_chi",
            theory: 30,
            practice: 90,
            type: "chuyen_mon",
            semester: 2,
            prerequisite: ["MĐ05"],
            isKey: true,
          },
          {
            id: "m8",
            code: "MĐ08",
            name: "Cơ sở dữ liệu",
            units: 3,
            unitType: "tin_chi",
            theory: 30,
            practice: 60,
            type: "co_so",
            semester: 2,
            isKey: true,
          },
          {
            id: "m9",
            code: "MĐ09",
            name: "Mạng máy tính cơ bản",
            units: 3,
            unitType: "tin_chi",
            theory: 30,
            practice: 45,
            type: "co_so",
            semester: 2,
          },
          {
            id: "m10",
            code: "MH10",
            name: "Tiếng Anh 2",
            units: 3,
            unitType: "tin_chi",
            theory: 30,
            practice: 30,
            type: "chung",
            semester: 2,
            prerequisite: ["MH06"],
          },
        ],
      },
      {
        id: 3,
        label: "Học kỳ 3",
        modules: [
          {
            id: "m12",
            code: "MĐ12",
            name: "Lập trình Web Frontend",
            units: 4,
            unitType: "tin_chi",
            theory: 30,
            practice: 90,
            type: "chuyen_mon",
            semester: 3,
            prerequisite: ["MĐ07"],
            isKey: true,
          },
          {
            id: "m13",
            code: "MĐ13",
            name: "Thiết kế cơ sở dữ liệu",
            units: 3,
            unitType: "tin_chi",
            theory: 30,
            practice: 60,
            type: "chuyen_mon",
            semester: 3,
          },
          {
            id: "m14",
            code: "MĐ14",
            name: "Lập trình Java",
            units: 4,
            unitType: "tin_chi",
            theory: 30,
            practice: 90,
            type: "tu_chon",
            semester: 3,
          },
        ],
      },
      {
        id: 4,
        label: "Học kỳ 4",
        modules: [
          {
            id: "m16",
            code: "MĐ16",
            name: "Lập trình Web Backend (Node.js)",
            units: 4,
            unitType: "tin_chi",
            theory: 30,
            practice: 90,
            type: "chuyen_mon",
            semester: 4,
            prerequisite: ["MĐ12"],
            isKey: true,
          },
          {
            id: "m17",
            code: "MĐ17",
            name: "Kiểm thử phần mềm",
            units: 3,
            unitType: "tin_chi",
            theory: 15,
            practice: 75,
            type: "chuyen_mon",
            semester: 4,
          },
          {
            id: "m18",
            code: "MĐ18",
            name: "Quản lý dự án phần mềm",
            units: 2,
            unitType: "tin_chi",
            theory: 30,
            practice: 0,
            type: "chuyen_mon",
            semester: 4,
          },
        ],
      },
      {
        id: 5,
        label: "Học kỳ 5 – Thực tập",
        internship: true,
        modules: [
          {
            id: "m19",
            code: "TT01",
            name: "Thực tập tốt nghiệp tại doanh nghiệp",
            units: 8,
            unitType: "tin_chi",
            theory: 0,
            practice: 360,
            type: "thuc_tap",
            semester: 5,
            isKey: true,
          },
          {
            id: "m20",
            code: "DA01",
            name: "Đồ án tốt nghiệp",
            units: 4,
            unitType: "tin_chi",
            theory: 0,
            practice: 180,
            type: "thuc_tap",
            semester: 5,
          },
        ],
      },
    ],
  },
  {
    id: "2",
    code: "CTK-TC-KT-2024",
    name: "Kế toán doanh nghiệp",
    major: "Kế toán doanh nghiệp",
    eduSystem: "trung_cap",
    department: "Khoa Kinh tế",
    totalUnits: 65,
    unitType: "tin_chi",
    duration: "2 năm",
    status: "active",
    effectiveYear: 2024,
    issuedBy: "Bộ LĐTBXH",
    decisionNo: "3144/QĐ-BLĐTBXH",
    createdAt: "2024-02-01",
    updatedAt: "2024-07-10",
    terms: [
      {
        id: 1,
        label: "Học kỳ 1",
        modules: [
          {
            id: "k1",
            code: "MH01",
            name: "Giáo dục chính trị",
            units: 2,
            unitType: "tin_chi",
            theory: 30,
            practice: 0,
            type: "chung",
            semester: 1,
          },
          {
            id: "k2",
            code: "MĐ02",
            name: "Nguyên lý kế toán",
            units: 3,
            unitType: "tin_chi",
            theory: 30,
            practice: 45,
            type: "co_so",
            semester: 1,
            isKey: true,
          },
          {
            id: "k3",
            code: "MĐ03",
            name: "Tin học kế toán",
            units: 3,
            unitType: "tin_chi",
            theory: 15,
            practice: 75,
            type: "co_so",
            semester: 1,
            isKey: true,
          },
          {
            id: "k4",
            code: "MH04",
            name: "Kinh tế vi mô",
            units: 2,
            unitType: "tin_chi",
            theory: 30,
            practice: 0,
            type: "co_so",
            semester: 1,
          },
        ],
      },
      {
        id: 2,
        label: "Học kỳ 2",
        modules: [
          {
            id: "k5",
            code: "MĐ05",
            name: "Kế toán tài chính 1",
            units: 4,
            unitType: "tin_chi",
            theory: 30,
            practice: 90,
            type: "chuyen_mon",
            semester: 2,
            prerequisite: ["MĐ02"],
            isKey: true,
          },
          {
            id: "k6",
            code: "MĐ06",
            name: "Thuế",
            units: 3,
            unitType: "tin_chi",
            theory: 30,
            practice: 45,
            type: "chuyen_mon",
            semester: 2,
            isKey: true,
          },
          {
            id: "k7",
            code: "MĐ07",
            name: "Phần mềm kế toán MISA",
            units: 3,
            unitType: "tin_chi",
            theory: 10,
            practice: 80,
            type: "thuc_hanh",
            semester: 2,
            isKey: true,
          },
        ],
      },
      {
        id: 3,
        label: "Thực tập nghề",
        internship: true,
        modules: [
          {
            id: "k8",
            code: "TT01",
            name: "Thực tập nghề kế toán tại doanh nghiệp",
            units: 6,
            unitType: "tin_chi",
            theory: 0,
            practice: 270,
            type: "thuc_tap",
            semester: 3,
            isKey: true,
          },
        ],
      },
    ],
  },
  {
    id: "3",
    code: "CTK-9P-DCN-2024",
    name: "Điện công nghiệp (hệ 9+)",
    major: "Điện công nghiệp",
    eduSystem: "9_cong_10",
    department: "Khoa Điện – Điện tử",
    totalUnits: 1560,
    unitType: "gio",
    duration: "3 năm",
    status: "active",
    effectiveYear: 2024,
    issuedBy: "Sở LĐTBXH Khánh Hòa",
    decisionNo: "45/QĐ-SLĐTBXH",
    createdAt: "2024-03-05",
    updatedAt: "2024-08-15",
    terms: [
      {
        id: 1,
        label: "Năm 1 – HK1",
        modules: [
          {
            id: "d1",
            code: "MH01",
            name: "Giáo dục chính trị",
            units: 60,
            unitType: "gio",
            theory: 45,
            practice: 15,
            type: "chung",
            semester: 1,
          },
          {
            id: "d2",
            code: "MĐ02",
            name: "An toàn lao động điện",
            units: 30,
            unitType: "gio",
            theory: 15,
            practice: 15,
            type: "co_so",
            semester: 1,
          },
          {
            id: "d3",
            code: "MĐ03",
            name: "Điện kỹ thuật cơ bản",
            units: 90,
            unitType: "gio",
            theory: 30,
            practice: 60,
            type: "co_so",
            semester: 1,
            isKey: true,
          },
          {
            id: "d4",
            code: "MĐ04",
            name: "Đo lường điện",
            units: 60,
            unitType: "gio",
            theory: 15,
            practice: 45,
            type: "co_so",
            semester: 1,
            isKey: true,
          },
        ],
      },
      {
        id: 2,
        label: "Năm 1 – HK2",
        modules: [
          {
            id: "d5",
            code: "MĐ05",
            name: "Máy điện 1",
            units: 90,
            unitType: "gio",
            theory: 30,
            practice: 60,
            type: "chuyen_mon",
            semester: 2,
            prerequisite: ["MĐ03"],
            isKey: true,
          },
          {
            id: "d6",
            code: "MĐ06",
            name: "Trang bị điện công nghiệp",
            units: 90,
            unitType: "gio",
            theory: 30,
            practice: 60,
            type: "chuyen_mon",
            semester: 2,
            isKey: true,
          },
          {
            id: "d7",
            code: "MĐ07",
            name: "Điện tử cơ bản",
            units: 90,
            unitType: "gio",
            theory: 30,
            practice: 60,
            type: "co_so",
            semester: 2,
          },
        ],
      },
      {
        id: 3,
        label: "Thực tập sản xuất",
        internship: true,
        modules: [
          {
            id: "d8",
            code: "TT01",
            name: "Thực tập tại cơ sở sản xuất",
            units: 200,
            unitType: "gio",
            theory: 0,
            practice: 200,
            type: "thuc_tap",
            semester: 3,
            isKey: true,
          },
        ],
      },
    ],
  },
  {
    id: "4",
    code: "CTK-ĐHLK-QT-2023",
    name: "Quản trị kinh doanh (ĐH liên kết)",
    major: "Quản trị kinh doanh",
    eduSystem: "dai_hoc_lien_ket",
    department: "Khoa Kinh tế",
    totalUnits: 128,
    unitType: "tin_chi",
    duration: "4 năm",
    status: "active",
    effectiveYear: 2023,
    issuedBy: "ĐH Nha Trang (liên kết)",
    decisionNo: "512/QĐ-ĐHNT",
    createdAt: "2023-08-01",
    updatedAt: "2024-01-10",
    terms: [],
  },
  {
    id: "5",
    code: "CTK-DNNH-HAN-2024",
    name: "Hàn điện cơ bản",
    major: "Hàn điện",
    eduSystem: "day_nghe_ngan_han",
    department: "Khoa Cơ khí",
    totalUnits: 240,
    unitType: "gio",
    duration: "3 tháng",
    status: "active",
    effectiveYear: 2024,
    issuedBy: "Trường (tự ban hành)",
    decisionNo: "08/QĐ-TCN",
    createdAt: "2024-04-01",
    updatedAt: "2024-04-01",
    terms: [
      {
        id: 1,
        label: "Giai đoạn 1 – Cơ bản",
        modules: [
          {
            id: "h1",
            code: "MĐ01",
            name: "An toàn hàn",
            units: 16,
            unitType: "gio",
            theory: 8,
            practice: 8,
            type: "chung",
            semester: 1,
          },
          {
            id: "h2",
            code: "MĐ02",
            name: "Hàn hồ quang – Mối hàn bằng",
            units: 60,
            unitType: "gio",
            theory: 10,
            practice: 50,
            type: "thuc_hanh",
            semester: 1,
            isKey: true,
          },
          {
            id: "h3",
            code: "MĐ03",
            name: "Hàn hồ quang – Mối hàn đứng",
            units: 60,
            unitType: "gio",
            theory: 5,
            practice: 55,
            type: "thuc_hanh",
            semester: 1,
            isKey: true,
          },
        ],
      },
      {
        id: 2,
        label: "Giai đoạn 2 – Tổng hợp & Thi",
        modules: [
          {
            id: "h4",
            code: "MĐ04",
            name: "Thực hành ghép cấu kiện thép",
            units: 80,
            unitType: "gio",
            theory: 0,
            practice: 80,
            type: "thuc_hanh",
            semester: 2,
            isKey: true,
          },
          {
            id: "h5",
            code: "KT01",
            name: "Kiểm tra tay nghề – Thi tốt nghiệp",
            units: 24,
            unitType: "gio",
            theory: 4,
            practice: 20,
            type: "thuc_tap",
            semester: 2,
            isKey: true,
          },
        ],
      },
    ],
  },
  {
    id: "6",
    code: "CTK-DNSC-MAY-2025",
    name: "May công nghiệp",
    major: "May công nghiệp",
    eduSystem: "day_nghe_so_cap",
    department: "Khoa May – Thời trang",
    totalUnits: 120,
    unitType: "gio",
    duration: "1.5 tháng",
    status: "draft",
    effectiveYear: 2025,
    issuedBy: "Trường (đang soạn thảo)",
    decisionNo: "—",
    createdAt: "2025-01-15",
    updatedAt: "2025-02-10",
    terms: [],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function calcBreakdown(fw: CurriculumFramework) {
  const r: Record<ModuleType, number> = {
    chung: 0,
    co_so: 0,
    chuyen_mon: 0,
    tu_chon: 0,
    thuc_hanh: 0,
    thuc_tap: 0,
  };
  fw.terms.forEach((t) =>
    t.modules.forEach((m) => {
      r[m.type] += m.units;
    }),
  );
  return r;
}

function totalHours(fw: CurriculumFramework) {
  return fw.terms.reduce(
    (acc, t) => acc + t.modules.reduce((a, m) => a + m.theory + m.practice, 0),
    0,
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function EduBadge({ sys }: { sys: EduSystem }) {
  const m = EDU_SYSTEM_META[sys];
  return (
    <span
      className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black border ${m.bg} ${m.color} ${m.border}`}
    >
      {m.short} · {m.label}
    </span>
  );
}

function StatusBadge({ status }: { status: Status }) {
  const m = STATUS_META[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${m.bg} ${m.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${m.dot}`} />
      {m.label}
    </span>
  );
}

function ModTypeBadge({ type }: { type: ModuleType }) {
  const m = MODULE_TYPE_META[type];
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${m.color}`}
    >
      {m.label}
    </span>
  );
}

// ─── Form ─────────────────────────────────────────────────────────────────────

type FormState = {
  code: string;
  name: string;
  major: string;
  department: string;
  eduSystem: EduSystem;
  totalUnits: number;
  unitType: UnitType;
  duration: string;
  status: Status;
  effectiveYear: number;
  issuedBy: string;
  decisionNo: string;
};

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400"
      />
    </div>
  );
}

function FormModal({
  initial,
  onSave,
  onClose,
}: {
  initial?: FormState;
  onSave: (f: FormState) => void;
  onClose: () => void;
}) {
  const defaultForm: FormState = {
    code: "",
    name: "",
    major: "",
    department: "",
    eduSystem: "trung_cap",
    totalUnits: 65,
    unitType: "tin_chi",
    duration: "2 năm",
    status: "draft",
    effectiveYear: 2025,
    issuedBy: "",
    decisionNo: "",
  };
  const [form, setForm] = useState<FormState>(initial ?? defaultForm);
  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((p) => ({ ...p, [k]: v }));
  const valid = form.code.trim() && form.name.trim() && form.major.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Chương trình khung
            </p>
            <h3 className="text-base font-black text-slate-800">
              {initial ? "Chỉnh sửa chương trình" : "Tạo chương trình mới"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
              <path
                d="M18 6 6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">
              Hệ đào tạo <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(EDU_SYSTEM_META) as EduSystem[]).map((sys) => {
                const m = EDU_SYSTEM_META[sys];
                const sel = form.eduSystem === sys;
                return (
                  <button
                    key={sys}
                    type="button"
                    onClick={() => set("eduSystem", sys)}
                    className={`rounded-xl px-3 py-2.5 text-left border-2 transition-all ${sel ? `${m.bg} ${m.border} ${m.color}` : "border-slate-200 text-slate-500 hover:border-slate-300"}`}
                  >
                    <p className="text-sm font-black">{m.short}</p>
                    <p className="text-[10px] leading-tight mt-0.5 opacity-80">
                      {m.label}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Mã chương trình *"
              value={form.code}
              onChange={(v) => set("code", v)}
              placeholder="VD: CTK-CĐ-CNTT-2025"
            />
            <Field
              label="Năm áp dụng"
              type="number"
              value={String(form.effectiveYear)}
              onChange={(v) => set("effectiveYear", +v)}
            />
          </div>
          <Field
            label="Tên ngành / nghề đào tạo *"
            value={form.name}
            onChange={(v) => set("name", v)}
            placeholder="VD: Công nghệ thông tin"
          />
          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Ngành / Nghề chính thức *"
              value={form.major}
              onChange={(v) => set("major", v)}
              placeholder="VD: Điện công nghiệp"
            />
            <Field
              label="Khoa / Bộ môn"
              value={form.department}
              onChange={(v) => set("department", v)}
              placeholder="VD: Khoa Điện – Điện tử"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Đơn vị học tập
              </label>
              <select
                value={form.unitType}
                onChange={(e) => set("unitType", e.target.value as UnitType)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400"
              >
                <option value="tin_chi">Tín chỉ (TC)</option>
                <option value="don_vi_hoc_trinh">ĐVHT</option>
                <option value="gio">Giờ học</option>
              </select>
            </div>
            <Field
              label={`Tổng ${UNIT_LABEL[form.unitType]}`}
              type="number"
              value={String(form.totalUnits)}
              onChange={(v) => set("totalUnits", +v)}
            />
            <Field
              label="Thời gian đào tạo"
              value={form.duration}
              onChange={(v) => set("duration", v)}
              placeholder="VD: 2 năm, 3 tháng"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Cơ quan ban hành"
              value={form.issuedBy}
              onChange={(v) => set("issuedBy", v)}
              placeholder="VD: Bộ LĐTBXH"
            />
            <Field
              label="Số quyết định"
              value={form.decisionNo}
              onChange={(v) => set("decisionNo", v)}
              placeholder="VD: 2713/QĐ-BLĐTBXH"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Trạng thái
            </label>
            <select
              value={form.status}
              onChange={(e) => set("status", e.target.value as Status)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400/20"
            >
              <option value="draft">Bản nháp</option>
              <option value="active">Đang áp dụng</option>
              <option value="archived">Lưu trữ</option>
            </select>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-white transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={() => valid && onSave(form)}
            disabled={!valid}
            className="px-5 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-colors shadow-sm"
          >
            {initial ? "Lưu thay đổi" : "Tạo chương trình"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function CurriculumFrameworkPage() {
  const [frameworks, setFrameworks] = useState<CurriculumFramework[]>(mockData);
  const [search, setSearch] = useState("");
  const [filterSys, setFilterSys] = useState<EduSystem | "all">("all");
  const [filterStatus, setFilterStatus] = useState<Status | "all">("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "modules">(
    "overview",
  );
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<CurriculumFramework | null>(
    null,
  );

  const filtered = useMemo(
    () =>
      frameworks.filter((f) => {
        const q = search.toLowerCase();
        const ms =
          !search ||
          [f.name, f.code, f.major, f.department].some((s) =>
            s.toLowerCase().includes(q),
          );
        return (
          ms &&
          (filterSys === "all" || f.eduSystem === filterSys) &&
          (filterStatus === "all" || f.status === filterStatus)
        );
      }),
    [frameworks, search, filterSys, filterStatus],
  );

  const selected = frameworks.find((f) => f.id === selectedId) ?? null;

  const stats = useMemo(
    () => ({
      total: frameworks.length,
      active: frameworks.filter((f) => f.status === "active").length,
      draft: frameworks.filter((f) => f.status === "draft").length,
      systems: new Set(frameworks.map((f) => f.eduSystem)).size,
    }),
    [frameworks],
  );

  function handleSave(form: FormState) {
    const now = new Date().toISOString().slice(0, 10);
    if (editTarget) {
      setFrameworks((p) =>
        p.map((f) =>
          f.id === editTarget.id ? { ...f, ...form, updatedAt: now } : f,
        ),
      );
    } else {
      setFrameworks((p) => [
        {
          id: Date.now().toString(),
          ...form,
          terms: [],
          createdAt: now,
          updatedAt: now,
        },
        ...p,
      ]);
    }
    setShowForm(false);
    setEditTarget(null);
  }

  function handleDelete(id: string) {
    if (!confirm("Xóa chương trình khung này?")) return;
    setFrameworks((p) => p.filter((f) => f.id !== id));
    if (selectedId === id) setSelectedId(null);
  }

  const breakdown = selected ? calcBreakdown(selected) : null;
  const hrs = selected ? totalHours(selected) : 0;

  return (
    <div
      className="min-h-screen bg-[#f4f5f8]"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;0,9..40,900&display=swap');`}</style>

      {/* Top nav */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-30 shadow-sm">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
              <svg width="17" height="17" fill="none" viewBox="0 0 24 24">
                <path
                  d="M4 19V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"
                  stroke="white"
                  strokeWidth="1.8"
                />
                <path
                  d="M8 10h8M8 14h5"
                  stroke="white"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 leading-none mb-0.5">
                Quản lý đào tạo
              </p>
              <h1 className="text-[15px] font-black text-slate-800 leading-none">
                Chương trình khung
              </h1>
            </div>
          </div>
          <button
            onClick={() => {
              setEditTarget(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors shadow-sm"
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
              <path
                d="M12 5v14M5 12h14"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
            Thêm chương trình
          </button>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 py-5 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { l: "Tổng chương trình", v: stats.total, c: "text-slate-800" },
            { l: "Đang áp dụng", v: stats.active, c: "text-emerald-600" },
            { l: "Bản nháp", v: stats.draft, c: "text-amber-500" },
            { l: "Số hệ đào tạo", v: stats.systems, c: "text-blue-600" },
          ].map((s) => (
            <div
              key={s.l}
              className="bg-white rounded-xl border border-slate-200 p-4"
            >
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                {s.l}
              </p>
              <p className={`text-2xl font-black ${s.c}`}>{s.v}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-slate-200 p-3.5 space-y-3">
          <div className="flex flex-wrap gap-2.5 items-center">
            <div className="relative flex-1 min-w-52">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                width="14"
                height="14"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="7"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="m21 21-4-4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm mã, tên ngành, khoa…"
                className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(e.target.value as Status | "all")
              }
              className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none"
            >
              <option value="all">Tất cả TT</option>
              <option value="active">Đang áp dụng</option>
              <option value="draft">Bản nháp</option>
              <option value="archived">Lưu trữ</option>
            </select>
            <p className="text-xs text-slate-400 ml-auto">
              {filtered.length} kết quả
            </p>
          </div>
          {/* System filter pills */}
          <div className="flex gap-1.5 flex-wrap">
            <button
              onClick={() => setFilterSys("all")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${filterSys === "all" ? "bg-slate-800 text-white" : "text-slate-500 hover:bg-slate-100"}`}
            >
              Tất cả hệ
            </button>
            {(Object.keys(EDU_SYSTEM_META) as EduSystem[]).map((sys) => {
              const m = EDU_SYSTEM_META[sys];
              const sel = filterSys === sys;
              const count = frameworks.filter(
                (f) => f.eduSystem === sys,
              ).length;
              return (
                <button
                  key={sys}
                  onClick={() => setFilterSys(sys)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all flex items-center gap-1.5 ${sel ? `${m.bg} ${m.color} ${m.border}` : "border-transparent text-slate-500 hover:bg-slate-100"}`}
                >
                  {m.short}
                  <span
                    className={`text-[9px] font-black px-1 rounded-full ${sel ? m.color + " opacity-70" : "bg-slate-200 text-slate-500"}`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Master / Detail */}
        <div className="flex gap-4 items-start">
          {/* List */}
          <div className="w-[360px] flex-shrink-0 space-y-2">
            {filtered.length === 0 && (
              <div className="bg-white rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-400 text-sm">
                Không có kết quả phù hợp.
              </div>
            )}
            {filtered.map((fw) => {
              const sm = EDU_SYSTEM_META[fw.eduSystem];
              const isSel = selectedId === fw.id;
              return (
                <button
                  key={fw.id}
                  onClick={() => {
                    setSelectedId(fw.id);
                    setActiveTab("overview");
                  }}
                  className={`w-full text-left rounded-xl border transition-all p-4 ${isSel ? "border-blue-500 bg-white shadow-lg ring-2 ring-blue-100" : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"}`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2.5">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-black border ${sm.bg} ${sm.color} ${sm.border}`}
                    >
                      {sm.short} · {sm.label}
                    </span>
                    <StatusBadge status={fw.status} />
                  </div>
                  <p className="font-black text-slate-800 text-sm leading-tight mb-0.5">
                    {fw.name}
                  </p>
                  <p className="font-mono text-[10px] text-slate-400 mb-2">
                    {fw.code}
                  </p>
                  <div className="flex flex-wrap gap-x-2 gap-y-0 text-xs text-slate-400">
                    <span>{fw.department}</span>
                    <span className="text-slate-300">·</span>
                    <span className="font-bold text-slate-600">
                      {fw.totalUnits} {UNIT_LABEL[fw.unitType]}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span>{fw.duration}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detail */}
          {selected ? (
            <div className="flex-1 bg-white rounded-xl border border-slate-200 overflow-hidden min-w-0">
              {/* Header */}
              <div className="p-5 border-b border-slate-100">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <EduBadge sys={selected.eduSystem} />
                      <StatusBadge status={selected.status} />
                      <span className="font-mono text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                        {selected.code}
                      </span>
                    </div>
                    <h2 className="text-lg font-black text-slate-800">
                      {selected.name}
                    </h2>
                    <p className="text-sm text-slate-400 mt-0.5">
                      Ngành:{" "}
                      <strong className="text-slate-600">
                        {selected.major}
                      </strong>{" "}
                      · {selected.department} · Từ năm{" "}
                      <strong className="text-slate-600">
                        {selected.effectiveYear}
                      </strong>
                    </p>
                    {selected.decisionNo !== "—" && (
                      <p className="text-xs text-slate-400 mt-0.5">
                        QĐ:{" "}
                        <span className="font-mono text-slate-600">
                          {selected.decisionNo}
                        </span>
                        {selected.issuedBy && (
                          <span> — {selected.issuedBy}</span>
                        )}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0 flex-wrap justify-end">
                    <button
                      onClick={() => {
                        setEditTarget(selected);
                        setShowForm(true);
                      }}
                      className="text-xs font-semibold text-slate-600 border border-slate-200 hover:border-blue-400 hover:text-blue-600 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Sửa
                    </button>
                    {selected.status === "draft" && (
                      <button
                        onClick={() =>
                          setFrameworks((p) =>
                            p.map((f) =>
                              f.id === selected.id
                                ? { ...f, status: "active" }
                                : f,
                            ),
                          )
                        }
                        className="text-xs font-semibold text-emerald-600 border border-emerald-200 hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        ✓ Áp dụng
                      </button>
                    )}
                    {selected.status === "active" && (
                      <button
                        onClick={() =>
                          setFrameworks((p) =>
                            p.map((f) =>
                              f.id === selected.id
                                ? { ...f, status: "archived" }
                                : f,
                            ),
                          )
                        }
                        className="text-xs font-semibold text-amber-600 border border-amber-200 hover:bg-amber-50 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Lưu trữ
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(selected.id)}
                      className="text-xs font-semibold text-red-500 border border-red-100 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
                <div className="flex gap-1">
                  {(["overview", "modules"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setActiveTab(t)}
                      className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-colors ${activeTab === t ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:bg-slate-100"}`}
                    >
                      {t === "overview"
                        ? "Tổng quan"
                        : "Danh mục môn học / mô-đun"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Overview */}
              {activeTab === "overview" && breakdown && (
                <div className="p-5 space-y-5">
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      {
                        l: "Tổng " + UNIT_LABEL[selected.unitType],
                        v: selected.totalUnits,
                      },
                      { l: "Thời gian", v: selected.duration },
                      { l: "Tổng giờ (LT+TH)", v: hrs + "h" },
                      { l: "Học kỳ / Giai đoạn", v: selected.terms.length },
                    ].map((item) => (
                      <div
                        key={item.l}
                        className="bg-slate-50 rounded-xl p-3 text-center border border-slate-200"
                      >
                        <p className="text-lg font-black text-slate-800">
                          {item.v}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">
                          {item.l}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Breakdown */}
                  <div>
                    <p className="text-[11px] font-black text-slate-600 uppercase tracking-widest mb-3">
                      Phân bổ khối lượng theo loại
                    </p>
                    <div className="space-y-2">
                      {(Object.keys(MODULE_TYPE_META) as ModuleType[]).map(
                        (t) => {
                          const val = breakdown[t];
                          if (val === 0) return null;
                          const pct =
                            selected.totalUnits > 0
                              ? Math.round((val / selected.totalUnits) * 100)
                              : 0;
                          const m = MODULE_TYPE_META[t];
                          return (
                            <div key={t} className="flex items-center gap-3">
                              <span
                                className={`text-[10px] px-2 py-1 rounded font-bold w-28 text-center ${m.color}`}
                              >
                                {m.label}
                              </span>
                              <div className="flex-1 bg-slate-100 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full transition-all ${m.bar}`}
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                              <span className="text-xs text-slate-500 w-28 text-right font-semibold">
                                {val} {UNIT_LABEL[selected.unitType]}{" "}
                                <span className="text-slate-400 font-normal">
                                  ({pct}%)
                                </span>
                              </span>
                            </div>
                          );
                        },
                      )}
                    </div>
                  </div>

                  {/* Term map */}
                  {selected.terms.length > 0 && (
                    <div>
                      <p className="text-[11px] font-black text-slate-600 uppercase tracking-widest mb-3">
                        Sơ đồ học kỳ / giai đoạn
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        {selected.terms.map((term) => (
                          <div
                            key={term.id}
                            className={`rounded-xl border px-4 py-3 min-w-[120px] text-center ${term.internship ? "border-orange-200 bg-gradient-to-b from-orange-50 to-white" : "border-slate-200 bg-gradient-to-b from-slate-50 to-white"}`}
                          >
                            <p className="text-base font-black text-slate-700">
                              {term.modules.length}
                            </p>
                            <p className="text-[10px] font-bold text-slate-400 mt-0.5">
                              {term.internship ? "🏭 Thực tập" : "môn / mô-đun"}
                            </p>
                            <p className="text-[10px] text-slate-400 mt-1 leading-tight">
                              {term.label}
                            </p>
                            <p className="text-xs font-black text-slate-600 mt-1.5">
                              {term.modules.reduce((a, m) => a + m.units, 0)}{" "}
                              <span className="font-normal text-slate-400 text-[10px]">
                                {UNIT_LABEL[selected.unitType]}
                              </span>
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <p className="text-[10px] text-slate-300 border-t border-slate-100 pt-3">
                    Tạo: {selected.createdAt} · Cập nhật: {selected.updatedAt}
                  </p>
                </div>
              )}

              {/* Modules tab */}
              {activeTab === "modules" && (
                <div className="p-5 space-y-5">
                  {selected.terms.length === 0 && (
                    <div className="text-center py-12 text-slate-400">
                      <p className="text-sm">Chưa có môn học / mô-đun nào.</p>
                      <p className="text-xs mt-1">
                        Cần tích hợp chức năng quản lý chi tiết từng học kỳ.
                      </p>
                    </div>
                  )}
                  {selected.terms.map((term) => (
                    <div key={term.id}>
                      <div
                        className={`flex items-center gap-3 mb-2 pb-2 border-b ${term.internship ? "border-orange-200" : "border-slate-200"}`}
                      >
                        <h3
                          className={`text-sm font-black ${term.internship ? "text-orange-600" : "text-slate-700"}`}
                        >
                          {term.internship ? "🏭 " : ""}
                          {term.label}
                        </h3>
                        <span className="text-xs text-slate-400">
                          {term.modules.length} MH/MĐ
                        </span>
                        <span className="text-xs font-bold text-slate-600">
                          {term.modules.reduce((a, m) => a + m.units, 0)}{" "}
                          {UNIT_LABEL[selected.unitType]}
                        </span>
                        <span className="text-xs text-slate-400 ml-auto">
                          LT: {term.modules.reduce((a, m) => a + m.theory, 0)}t
                          &nbsp;|&nbsp; TH:{" "}
                          {term.modules.reduce((a, m) => a + m.practice, 0)}t
                        </span>
                      </div>
                      <div className="overflow-x-auto rounded-lg border border-slate-200">
                        <table className="w-full text-sm min-w-[600px]">
                          <thead>
                            <tr className="bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-200">
                              <th className="text-left px-3 py-2">Mã</th>
                              <th className="text-left px-3 py-2">
                                Tên môn học / mô-đun
                              </th>
                              <th className="text-center px-3 py-2">
                                {UNIT_LABEL[selected.unitType]}
                              </th>
                              <th className="text-center px-3 py-2">LT</th>
                              <th className="text-center px-3 py-2">TH</th>
                              <th className="text-left px-3 py-2">Loại</th>
                              <th className="text-left px-3 py-2">
                                Tiên quyết
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {term.modules.map((mod, i) => (
                              <tr
                                key={mod.id}
                                className={`border-b border-slate-100 last:border-0 ${mod.isKey ? "bg-blue-50/40" : i % 2 === 1 ? "bg-slate-50/50" : ""}`}
                              >
                                <td className="px-3 py-2.5 font-mono text-[11px] font-bold text-blue-600">
                                  {mod.code}
                                </td>
                                <td className="px-3 py-2.5">
                                  <span className="font-semibold text-slate-700 text-sm">
                                    {mod.name}
                                  </span>
                                  {mod.isKey && (
                                    <span className="ml-2 text-[9px] font-black text-amber-700 bg-amber-100 border border-amber-200 px-1.5 py-0.5 rounded-full">
                                      Trọng tâm
                                    </span>
                                  )}
                                </td>
                                <td className="px-3 py-2.5 text-center font-black text-slate-700">
                                  {mod.units}
                                </td>
                                <td className="px-3 py-2.5 text-center text-xs text-slate-500">
                                  {mod.theory}
                                </td>
                                <td className="px-3 py-2.5 text-center text-xs text-slate-500">
                                  {mod.practice}
                                </td>
                                <td className="px-3 py-2.5">
                                  <ModTypeBadge type={mod.type} />
                                </td>
                                <td className="px-3 py-2.5">
                                  {mod.prerequisite?.length ? (
                                    mod.prerequisite.map((p) => (
                                      <span
                                        key={p}
                                        className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded mr-1"
                                      >
                                        {p}
                                      </span>
                                    ))
                                  ) : (
                                    <span className="text-slate-300 text-xs">
                                      —
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 bg-white rounded-xl border border-slate-200 flex flex-col items-center justify-center py-20 gap-4 text-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                <svg
                  width="26"
                  height="26"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="text-slate-300"
                >
                  <path
                    d="M4 19V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                  <path
                    d="M8 10h8M8 14h5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div>
                <p className="font-black text-slate-500">
                  Chọn chương trình để xem chi tiết
                </p>
                <p className="text-sm text-slate-400 mt-1">
                  Bấm vào một chương trình ở danh sách bên trái.
                </p>
              </div>
              <div className="mt-2 flex flex-wrap gap-2 justify-center max-w-sm">
                {(Object.keys(EDU_SYSTEM_META) as EduSystem[]).map((sys) => {
                  const m = EDU_SYSTEM_META[sys];
                  return (
                    <span
                      key={sys}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-black border ${m.bg} ${m.color} ${m.border}`}
                    >
                      {m.short} — {m.label}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <FormModal
          initial={
            editTarget
              ? {
                  code: editTarget.code,
                  name: editTarget.name,
                  major: editTarget.major,
                  department: editTarget.department,
                  eduSystem: editTarget.eduSystem,
                  totalUnits: editTarget.totalUnits,
                  unitType: editTarget.unitType,
                  duration: editTarget.duration,
                  status: editTarget.status,
                  effectiveYear: editTarget.effectiveYear,
                  issuedBy: editTarget.issuedBy,
                  decisionNo: editTarget.decisionNo,
                }
              : undefined
          }
          onSave={handleSave}
          onClose={() => {
            setShowForm(false);
            setEditTarget(null);
          }}
        />
      )}
    </div>
  );
}
