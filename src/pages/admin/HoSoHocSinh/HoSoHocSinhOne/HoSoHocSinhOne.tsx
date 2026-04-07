import { useState } from "react";
import {
  User,
  Phone,
  Calendar,
  BookOpen,
  FileText,
  Camera,
  Edit3,
  Save,
  X,
  ChevronRight,
  GraduationCap,
  Download,
  Printer,
  Stethoscope,
  Users,
} from "lucide-react";
import type { HocSinh } from "../mockType";
import { MOCK } from "../mockData/hoSoOne.mockData";
import { HE_DAO_TAO_STYLES, TRANG_THAI_STYLES } from "../mockStyleMapEnum";
import TabHocTap from "./Tabs/TabHocTap";
import TabThongTin from "./Tabs/TabThongTin";
import TabGiaDinh from "./Tabs/TabGiaDinh";
import TabSucKhoe from "./Tabs/TabSucKhoe";
import TabHoSo from "./Tabs/TabHoSo";

type TabKey = "thongTin" | "hocTap" | "giaoDinh" | "sucKhoe" | "hoSo";
const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: "thongTin", label: "Thông tin cá nhân", icon: <User size={15} /> },
  { key: "hocTap", label: "Học tập", icon: <GraduationCap size={15} /> },
  { key: "giaoDinh", label: "Gia đình", icon: <Users size={15} /> },
  { key: "sucKhoe", label: "Sức khỏe", icon: <Stethoscope size={15} /> },
  { key: "hoSo", label: "Hồ sơ giấy tờ", icon: <FileText size={15} /> },
];

const HoSoHocSinhOne: React.FC = () => {
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

export default HoSoHocSinhOne;
