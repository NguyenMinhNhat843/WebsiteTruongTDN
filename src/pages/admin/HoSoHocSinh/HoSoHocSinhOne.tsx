import { useState } from "react";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  BookOpen,
  FileText,
  Camera,
  Edit3,
  Save,
  X,
  ChevronRight,
  GraduationCap,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Clock,
  Download,
  Printer,
  Building2,
  Stethoscope,
  Users,
  Star,
  TrendingUp,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type HeDaoTao =
  | "Trung cấp nghề"
  | "Sơ cấp nghề"
  | "Cao đẳng"
  | "Đại học liên kết";
type TrangThaiHocSinh = "Đang học" | "Bảo lưu" | "Thôi học" | "Tốt nghiệp";
type GioiTinh = "Nam" | "Nữ" | "Khác";

interface HocSinh {
  id: string;
  maSoHocSinh: string;
  hoTen: string;
  ngaySinh: string;
  gioiTinh: GioiTinh;
  danToc: string;
  tonGiao: string;
  cccd: string;
  ngayCap: string;
  noiCap: string;
  diaChiThuongTru: string;
  diaChiTamTru: string;
  soDienThoai: string;
  email: string;
  // Gia đình
  hoTenCha: string;
  sdtCha: string;
  ngheNghiepCha: string;
  hoTenMe: string;
  sdtMe: string;
  ngheNghiepMe: string;
  nguoiLienHeKhac: string;
  sdtLienHe: string;
  // Học vấn
  heDaoTao: HeDaoTao;
  nganh: string;
  chuyenNganh: string;
  lop: string;
  khoaHoc: string;
  namNhapHoc: number;
  trangThai: TrangThaiHocSinh;
  hocBongHienTai: string;
  // Sức khỏe
  nhomMau: string;
  chieuCao: number;
  canNang: number;
  tinhTrangSucKhoe: string;
  // Hồ sơ
  daNopHoSo: string[];
  chuaNopHoSo: string[];
  ghiChu: string;
}

type TabKey = "thongTin" | "hocTap" | "giaoDinh" | "sucKhoe" | "hoSo";

// ─── Mock ─────────────────────────────────────────────────────────────────────

const MOCK: HocSinh = {
  id: "1",
  maSoHocSinh: "TCN2024-0142",
  hoTen: "Nguyễn Thị Minh Châu",
  ngaySinh: "2006-03-15",
  gioiTinh: "Nữ",
  danToc: "Kinh",
  tonGiao: "Không",
  cccd: "079206012345",
  ngayCap: "2022-08-20",
  noiCap: "Cục Cảnh sát QLHC về TTXH",
  diaChiThuongTru: "45 Đường Lê Lợi, Phường Vĩnh Hải, TP. Nha Trang, Khánh Hòa",
  diaChiTamTru: "12/3 Hẻm 5, Phường Phước Tân, TP. Nha Trang",
  soDienThoai: "0901 234 567",
  email: "minhchau.nguyen@email.com",
  hoTenCha: "Nguyễn Văn Hùng",
  sdtCha: "0912 345 678",
  ngheNghiepCha: "Thợ hồ",
  hoTenMe: "Trần Thị Lan",
  sdtMe: "0923 456 789",
  ngheNghiepMe: "Nội trợ",
  nguoiLienHeKhac: "Nguyễn Văn Minh (Anh trai)",
  sdtLienHe: "0934 567 890",
  heDaoTao: "Trung cấp nghề",
  nganh: "Kỹ thuật May",
  chuyenNganh: "May thời trang",
  lop: "TCN-MAY-24A",
  khoaHoc: "2024 – 2026",
  namNhapHoc: 2024,
  trangThai: "Đang học",
  hocBongHienTai: "Hỗ trợ chi phí học nghề (Chính sách Nhà nước)",
  nhomMau: "A+",
  chieuCao: 158,
  canNang: 50,
  tinhTrangSucKhoe: "Bình thường, không dị tật",
  daNopHoSo: [
    "Đơn xin học",
    "Bản sao CCCD",
    "Học bạ THCS (có công chứng)",
    "Ảnh 3×4 (6 tấm)",
    "Giấy khai sinh (bản sao)",
    "Sổ hộ khẩu (bản sao)",
  ],
  chuaNopHoSo: [
    "Giấy khám sức khỏe",
    "Bằng tốt nghiệp THCS (bản sao công chứng)",
  ],
  ghiChu:
    "Học sinh thuộc diện chính sách, được miễn 100% học phí theo Nghị quyết 46/NQ-CP.",
};

// ─── Constants ────────────────────────────────────────────────────────────────

const HE_DAO_TAO_STYLES: Record<
  HeDaoTao,
  { bg: string; text: string; border: string }
> = {
  "Trung cấp nghề": {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  "Sơ cấp nghề": {
    bg: "bg-teal-50",
    text: "text-teal-700",
    border: "border-teal-200",
  },
  "Cao đẳng": {
    bg: "bg-violet-50",
    text: "text-violet-700",
    border: "border-violet-200",
  },
  "Đại học liên kết": {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
  },
};

const TRANG_THAI_STYLES: Record<
  TrangThaiHocSinh,
  { bg: string; text: string; dot: string }
> = {
  "Đang học": {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
  },
  "Bảo lưu": { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-400" },
  "Thôi học": { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
  "Tốt nghiệp": { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
};

const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: "thongTin", label: "Thông tin cá nhân", icon: <User size={15} /> },
  { key: "hocTap", label: "Học tập", icon: <GraduationCap size={15} /> },
  { key: "giaoDinh", label: "Gia đình", icon: <Users size={15} /> },
  { key: "sucKhoe", label: "Sức khỏe", icon: <Stethoscope size={15} /> },
  { key: "hoSo", label: "Hồ sơ giấy tờ", icon: <FileText size={15} /> },
];

// ─── Small components ─────────────────────────────────────────────────────────

const InfoRow = ({
  label,
  value,
  icon,
  span = false,
}: {
  label: string;
  value?: string | number;
  icon?: React.ReactNode;
  span?: boolean;
}) => (
  <div className={`flex flex-col gap-0.5 ${span ? "sm:col-span-2" : ""}`}>
    <dt className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
      {icon && <span className="opacity-60">{icon}</span>}
      {label}
    </dt>
    <dd className="text-[13.5px] text-slate-700 font-medium leading-snug">
      {value || (
        <span className="text-slate-300 italic text-[12px]">Chưa cập nhật</span>
      )}
    </dd>
  </div>
);

const SectionCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
    <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/60">
      <h3 className="text-[12px] font-bold text-slate-500 uppercase tracking-widest">
        {title}
      </h3>
    </div>
    <div className="px-5 py-4">{children}</div>
  </div>
);

// ─── Tab contents ─────────────────────────────────────────────────────────────

const TabThongTin = ({ hs }: { hs: HocSinh }) => (
  <div className="space-y-4">
    <SectionCard title="Thông tin cơ bản">
      <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-5">
        <InfoRow
          label="Họ và tên"
          value={hs.hoTen}
          icon={<User size={11} />}
          span
        />
        <InfoRow
          label="Ngày sinh"
          value={new Date(hs.ngaySinh).toLocaleDateString("vi-VN")}
          icon={<Calendar size={11} />}
        />
        <InfoRow label="Giới tính" value={hs.gioiTinh} />
        <InfoRow label="Dân tộc" value={hs.danToc} />
        <InfoRow label="Tôn giáo" value={hs.tonGiao} />
      </dl>
    </SectionCard>

    <SectionCard title="CCCD / CMND">
      <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-5">
        <InfoRow
          label="Số CCCD"
          value={hs.cccd}
          icon={<CreditCard size={11} />}
        />
        <InfoRow
          label="Ngày cấp"
          value={new Date(hs.ngayCap).toLocaleDateString("vi-VN")}
        />
        <InfoRow label="Nơi cấp" value={hs.noiCap} span />
      </dl>
    </SectionCard>

    <SectionCard title="Liên lạc & Địa chỉ">
      <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-5">
        <InfoRow
          label="Số điện thoại"
          value={hs.soDienThoai}
          icon={<Phone size={11} />}
        />
        <InfoRow label="Email" value={hs.email} icon={<Mail size={11} />} />
        <InfoRow
          label="Địa chỉ thường trú"
          value={hs.diaChiThuongTru}
          icon={<MapPin size={11} />}
          span
        />
        <InfoRow
          label="Địa chỉ tạm trú"
          value={hs.diaChiTamTru}
          icon={<MapPin size={11} />}
          span
        />
      </dl>
    </SectionCard>
  </div>
);

const TabHocTap = ({ hs }: { hs: HocSinh }) => {
  const heStyle = HE_DAO_TAO_STYLES[hs.heDaoTao];
  return (
    <div className="space-y-4">
      <SectionCard title="Chương trình đào tạo">
        <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-5">
          <div className="flex flex-col gap-1">
            <dt className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Hệ đào tạo
            </dt>
            <dd>
              <span
                className={`inline-flex px-2.5 py-1 rounded-lg text-[12px] font-bold border ${heStyle.bg} ${heStyle.text} ${heStyle.border}`}
              >
                {hs.heDaoTao}
              </span>
            </dd>
          </div>
          <InfoRow
            label="Ngành học"
            value={hs.nganh}
            icon={<BookOpen size={11} />}
          />
          <InfoRow label="Chuyên ngành" value={hs.chuyenNganh} />
          <InfoRow label="Lớp" value={hs.lop} icon={<Building2 size={11} />} />
          <InfoRow
            label="Khóa học"
            value={hs.khoaHoc}
            icon={<Calendar size={11} />}
          />
          <InfoRow label="Năm nhập học" value={hs.namNhapHoc} />
        </dl>
      </SectionCard>

      <SectionCard title="Học bổng & Chính sách">
        <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
          <Star size={16} className="text-blue-500 mt-0.5 shrink-0" />
          <p className="text-[13px] text-blue-700 font-medium leading-relaxed">
            {hs.hocBongHienTai}
          </p>
        </div>
      </SectionCard>

      <SectionCard title="Kết quả học tập">
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: "Học kỳ 1",
              diem: "7.8",
              xep: "Khá",
              color: "text-blue-600",
              bg: "bg-blue-50",
              border: "border-blue-100",
            },
            {
              label: "Học kỳ 2",
              diem: "8.2",
              xep: "Giỏi",
              color: "text-emerald-600",
              bg: "bg-emerald-50",
              border: "border-emerald-100",
            },
            {
              label: "Tích lũy",
              diem: "8.0",
              xep: "Giỏi",
              color: "text-emerald-600",
              bg: "bg-emerald-50",
              border: "border-emerald-100",
            },
          ].map((item) => (
            <div
              key={item.label}
              className={`flex flex-col items-center p-4 rounded-xl border ${item.bg} ${item.border}`}
            >
              <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wide mb-2">
                {item.label}
              </span>
              <span className={`text-2xl font-black ${item.color}`}>
                {item.diem}
              </span>
              <span className={`text-[11px] font-bold mt-1 ${item.color}`}>
                {item.xep}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2 text-[12px] text-slate-400">
          <TrendingUp size={13} /> Điểm trung bình tích lũy tính theo hệ 10
        </div>
      </SectionCard>
    </div>
  );
};

const TabGiaDinh = ({ hs }: { hs: HocSinh }) => (
  <div className="space-y-4">
    {[
      {
        title: "Thông tin cha",
        ten: hs.hoTenCha,
        sdt: hs.sdtCha,
        ngheNghiep: hs.ngheNghiepCha,
      },
      {
        title: "Thông tin mẹ",
        ten: hs.hoTenMe,
        sdt: hs.sdtMe,
        ngheNghiep: hs.ngheNghiepMe,
      },
    ].map((p) => (
      <SectionCard key={p.title} title={p.title}>
        <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-5">
          <InfoRow label="Họ và tên" value={p.ten} icon={<User size={11} />} />
          <InfoRow
            label="Số điện thoại"
            value={p.sdt}
            icon={<Phone size={11} />}
          />
          <InfoRow label="Nghề nghiệp" value={p.ngheNghiep} />
        </dl>
      </SectionCard>
    ))}

    <SectionCard title="Người liên hệ khác">
      <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-5">
        <InfoRow
          label="Họ tên / Quan hệ"
          value={hs.nguoiLienHeKhac}
          icon={<Users size={11} />}
        />
        <InfoRow
          label="Số điện thoại"
          value={hs.sdtLienHe}
          icon={<Phone size={11} />}
        />
      </dl>
    </SectionCard>
  </div>
);

const TabSucKhoe = ({ hs }: { hs: HocSinh }) => (
  <div className="space-y-4">
    <SectionCard title="Chỉ số sức khỏe">
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          {
            label: "Nhóm máu",
            value: hs.nhomMau,
            unit: "",
            color: "text-red-600",
            bg: "bg-red-50",
            border: "border-red-100",
          },
          {
            label: "Chiều cao",
            value: hs.chieuCao,
            unit: "cm",
            color: "text-blue-600",
            bg: "bg-blue-50",
            border: "border-blue-100",
          },
          {
            label: "Cân nặng",
            value: hs.canNang,
            unit: "kg",
            color: "text-teal-600",
            bg: "bg-teal-50",
            border: "border-teal-100",
          },
        ].map((item) => (
          <div
            key={item.label}
            className={`flex flex-col items-center p-4 rounded-xl border ${item.bg} ${item.border}`}
          >
            <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wide mb-2">
              {item.label}
            </span>
            <span className={`text-2xl font-black ${item.color}`}>
              {item.value}
            </span>
            {item.unit && (
              <span
                className={`text-[11px] font-semibold mt-0.5 ${item.color} opacity-70`}
              >
                {item.unit}
              </span>
            )}
          </div>
        ))}
      </div>
      <dl className="grid grid-cols-1 gap-y-4">
        <InfoRow
          label="Tình trạng sức khỏe"
          value={hs.tinhTrangSucKhoe}
          icon={<Stethoscope size={11} />}
        />
      </dl>
    </SectionCard>

    <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200">
      <AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
      <p className="text-[13px] text-amber-700 leading-relaxed">
        Thông tin sức khỏe cần được cập nhật định kỳ hàng năm. Vui lòng cung cấp
        giấy khám sức khỏe mới nhất từ cơ sở y tế có thẩm quyền.
      </p>
    </div>
  </div>
);

const TabHoSo = ({ hs }: { hs: HocSinh }) => (
  <div className="space-y-4">
    <SectionCard title={`Đã nộp (${hs.daNopHoSo.length})`}>
      <ul className="space-y-2">
        {hs.daNopHoSo.map((item) => (
          <li
            key={item}
            className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-100"
          >
            <CheckCircle size={15} className="text-emerald-500 shrink-0" />
            <span className="text-[13px] text-slate-700 font-medium flex-1">
              {item}
            </span>
            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
              ĐÃ NỘP
            </span>
          </li>
        ))}
      </ul>
    </SectionCard>

    <SectionCard title={`Chưa nộp (${hs.chuaNopHoSo.length})`}>
      <ul className="space-y-2">
        {hs.chuaNopHoSo.map((item) => (
          <li
            key={item}
            className="flex items-center gap-3 p-3 rounded-xl bg-red-50 border border-red-100"
          >
            <Clock size={15} className="text-red-400 shrink-0" />
            <span className="text-[13px] text-slate-700 font-medium flex-1">
              {item}
            </span>
            <span className="text-[10px] text-red-600 font-bold bg-red-100 px-2 py-0.5 rounded-full">
              THIẾU
            </span>
          </li>
        ))}
      </ul>
    </SectionCard>

    {hs.ghiChu && (
      <SectionCard title="Ghi chú">
        <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
          <FileText size={15} className="text-blue-400 shrink-0 mt-0.5" />
          <p className="text-[13px] text-blue-800 leading-relaxed">
            {hs.ghiChu}
          </p>
        </div>
      </SectionCard>
    )}
  </div>
);

// ─── Main ─────────────────────────────────────────────────────────────────────

const HoSoHocSinh: React.FC = () => {
  const [hs] = useState<HocSinh>(MOCK);
  const [activeTab, setActiveTab] = useState<TabKey>("thongTin");
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const ttStyle = TRANG_THAI_STYLES[hs.trangThai];
  const heStyle = HE_DAO_TAO_STYLES[hs.heDaoTao];
  const completionPct = Math.round(
    (hs.daNopHoSo.length / (hs.daNopHoSo.length + hs.chuaNopHoSo.length)) * 100,
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* ── Top bar ── */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
        <nav className="flex items-center gap-2 text-[12px] text-slate-400">
          <span>Quản lý học sinh</span>
          <ChevronRight size={12} />
          <span>Danh sách</span>
          <ChevronRight size={12} />
          <span className="text-slate-700 font-semibold">{hs.hoTen}</span>
        </nav>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-all">
            <Printer size={13} /> In hồ sơ
          </button>
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-all">
            <Download size={13} /> Xuất PDF
          </button>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-all"
            >
              <Edit3 size={13} /> Chỉnh sửa
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-all"
              >
                <X size={13} /> Hủy
              </button>
              <button
                onClick={() => {
                  console.log("💾 Lưu hồ sơ:", hs);
                  setIsEditing(false);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold text-white bg-blue-600 border border-blue-700 rounded-lg hover:bg-blue-700 transition-all"
              >
                <Save size={13} /> Lưu
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-0 max-w-[1280px] mx-auto p-5 gap-5 items-start">
        {/* ── LEFT SIDEBAR ── */}
        <aside className="w-64 shrink-0 sticky top-5 space-y-4">
          {/* Avatar card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {/* Banner */}
            <div className="h-20 bg-gradient-to-br from-slate-700 to-slate-900 relative">
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(45deg, white 0, white 1px, transparent 0, transparent 50%)",
                  backgroundSize: "10px 10px",
                }}
              />
            </div>
            {/* Avatar */}
            <div className="flex flex-col items-center px-4 pb-5 -mt-10">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-md bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-3xl font-black text-slate-500 select-none">
                  {hs.hoTen.split(" ").slice(-1)[0][0]}
                </div>
                <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center shadow hover:bg-blue-700 transition">
                  <Camera size={11} className="text-white" />
                </button>
              </div>

              <h2 className="mt-3 text-[15px] font-black text-slate-800 text-center leading-tight">
                {hs.hoTen}
              </h2>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                {hs.maSoHocSinh}
              </p>

              <div className="mt-2 flex flex-wrap justify-center gap-1.5">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${heStyle.bg} ${heStyle.text} ${heStyle.border}`}
                >
                  {hs.heDaoTao}
                </span>
                <span
                  className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${ttStyle.bg} ${ttStyle.text}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${ttStyle.dot}`} />
                  {hs.trangThai}
                </span>
              </div>
            </div>
          </div>

          {/* Quick info */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-50">
            {[
              { icon: <BookOpen size={13} />, label: "Lớp", value: hs.lop },
              {
                icon: <GraduationCap size={13} />,
                label: "Ngành",
                value: hs.nganh,
              },
              {
                icon: <Calendar size={13} />,
                label: "Khóa",
                value: hs.khoaHoc,
              },
              {
                icon: <Phone size={13} />,
                label: "SĐT",
                value: hs.soDienThoai,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 px-4 py-3"
              >
                <span className="text-slate-400 shrink-0">{item.icon}</span>
                <div className="min-w-0">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                    {item.label}
                  </div>
                  <div className="text-[12px] text-slate-700 font-semibold truncate">
                    {item.value}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Hồ sơ completion */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-4 py-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Hoàn thiện hồ sơ
              </span>
              <span
                className={`text-[12px] font-black ${completionPct === 100 ? "text-emerald-600" : "text-amber-600"}`}
              >
                {completionPct}%
              </span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${completionPct === 100 ? "bg-emerald-500" : "bg-amber-400"}`}
                style={{ width: `${completionPct}%` }}
              />
            </div>
            {hs.chuaNopHoSo.length > 0 && (
              <p className="mt-2 text-[11px] text-slate-400">
                Còn thiếu{" "}
                <strong className="text-red-500">
                  {hs.chuaNopHoSo.length}
                </strong>{" "}
                giấy tờ
              </p>
            )}
          </div>

          {/* Nav tabs */}
          <nav className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left text-[13px] font-semibold transition-all border-l-2
                  ${
                    activeTab === tab.key
                      ? "bg-blue-50 text-blue-700 border-blue-500"
                      : "text-slate-500 border-transparent hover:bg-slate-50 hover:text-slate-700"
                  }`}
              >
                <span
                  className={
                    activeTab === tab.key ? "text-blue-500" : "text-slate-400"
                  }
                >
                  {tab.icon}
                </span>
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main className="flex-1 min-w-0">
          {/* Tab header */}
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="text-[18px] font-black text-slate-800">
                {TABS.find((t) => t.key === activeTab)?.label}
              </h1>
              <p className="text-[12px] text-slate-400 mt-0.5">
                Cập nhật lần cuối: 12/06/2025 — Phòng đào tạo
              </p>
            </div>
            {isEditing && (
              <span className="text-[11px] bg-amber-100 text-amber-600 px-3 py-1 rounded-full font-bold animate-pulse uppercase tracking-wider">
                Chế độ chỉnh sửa
              </span>
            )}
          </div>

          {/* Tab content */}
          {activeTab === "thongTin" && <TabThongTin hs={hs} />}
          {activeTab === "hocTap" && <TabHocTap hs={hs} />}
          {activeTab === "giaoDinh" && <TabGiaDinh hs={hs} />}
          {activeTab === "sucKhoe" && <TabSucKhoe hs={hs} />}
          {activeTab === "hoSo" && <TabHoSo hs={hs} />}
        </main>
      </div>
    </div>
  );
};

export default HoSoHocSinh;
