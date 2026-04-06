import { StatCard } from "../../../components/ui/StatCard";
import { TABS } from "./constants";
import {
  LopHocVaKhoaHocProvider,
  useLopHocVaKhoaHocContext,
} from "./LopHocVaKhoaHocProvider";
import CreatePanel from "./Create/CreateForm";
import DetailModal from "./One/ModalOne";
import { Search } from "lucide-react";
import Table from "./Table/Table";

// ─── MAIN APP ────────────────────────────────────────────────────────────────
export default function LopHocVaKhoaHoc() {
  return (
    <LopHocVaKhoaHocProvider>
      <Inner />
    </LopHocVaKhoaHocProvider>
  );
}
function Inner() {
  const {
    activeTab,
    detail,
    fKhoa,
    fNganh,
    fStatus,
    filtered,
    handleFilter,
    handleTabChange,
    search,
    setFKhoa,
    setFStatus,
    setFNganh,
    setSearch,
    setShowCreate,
    setDetail,
    stats,
    tabCounts,
    showCreate,
  } = useLopHocVaKhoaHocContext();

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900 overflow-hidden">
      {/* MAIN */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* TOPBAR */}
        <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">Đào tạo</span>
            <span className="text-gray-300">/</span>
            <span className="font-medium">Quản lý lớp học</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
              HK2 • 2024–2025
            </span>
            <button
              onClick={() => setShowCreate(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors"
            >
              + Tạo lớp mới
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-6 py-5">
          {/* STATS */}
          <div className="grid grid-cols-4 gap-3 mb-5">
            {[
              {
                label: "Tổng lớp học",
                value: stats.total,
                description: "Tất cả hệ đào tạo",
              },
              {
                label: "Đang hoạt động",
                value: stats.active,
                description: (
                  <span className="text-green-600">↑ 5 so với HK1</span>
                ),
              },
              {
                label: "Tổng học sinh/SV",
                value: stats.students,
                description: "Trong tất cả lớp",
              },
              {
                label: "Tỉ lệ lấp đầy",
                value: stats.fill,
                description: "Bình quân / lớp",
              },
            ].map((stat) => {
              return (
                <StatCard
                  label={stat.label}
                  value={stat.value}
                  description={stat.description}
                />
              );
            })}
          </div>

          {/* TABS */}
          <div className="flex gap-1 bg-gray-200/50 p-1.5 rounded-xl w-fit mb-6 backdrop-blur-sm">
            {TABS.map((t) => {
              const isActive = activeTab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => handleTabChange(t.key)}
                  className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 group
                          ${
                            isActive
                              ? "bg-white text-blue-600 shadow-md translate-y-px"
                              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                          }`}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {t.label}
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full border 
                              ${
                                isActive
                                  ? "bg-blue-50 border-blue-100 text-blue-500"
                                  : "bg-gray-200 border-transparent text-gray-500"
                              }`}
                    >
                      {tabCounts[t.key]}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* FILTERS */}
          <div className="flex flex-wrap items-center gap-3 p-4 bg-white border border-gray-100 rounded-xl shadow-sm mb-6">
            {/* Filter Group: Gom nhóm các select để tạo sự mạch lạc */}
            <div className="flex flex-wrap items-center gap-2 grow sm:grow-0">
              {/* Select Khóa */}
              <div className="relative group">
                <select
                  className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-3 pr-8 py-2.5 transition-all hover:bg-white"
                  value={fKhoa}
                  onChange={(e) => {
                    setFKhoa(e.target.value);
                    handleFilter();
                  }}
                >
                  <option value="">Khóa đào tạo</option>
                  {["K2022", "K2023", "K2024"].map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              {/* Select Trạng thái */}
              <div className="relative group">
                <select
                  className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-3 pr-8 py-2.5 transition-all hover:bg-white"
                  value={fStatus}
                  onChange={(e) => {
                    setFStatus(e.target.value);
                    handleFilter();
                  }}
                >
                  <option value="">Trạng thái</option>
                  {["Đang học", "Đang tuyển", "Đã kết thúc"].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              {/* Select Ngành */}
              <div className="relative group">
                <select
                  className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-3 pr-8 py-2.5 transition-all hover:bg-white"
                  value={fNganh}
                  onChange={(e) => {
                    setFNganh(e.target.value);
                    handleFilter();
                  }}
                >
                  <option value="">Tất cả ngành</option>
                  {[
                    "Kế toán",
                    "CNTT",
                    "Điện – Điện tử",
                    "Cơ khí",
                    "Du lịch",
                  ].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Search Input: Tăng chiều rộng và thêm icon search */}
            <div className="relative grow max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                placeholder="Tìm lớp, mã lớp..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  handleFilter();
                }}
              />
            </div>

            {/* Result Count: Hiển thị như một Badge nhỏ */}
            <div className="flex items-center gap-2 ml-auto">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                {filtered.length} kết quả
              </span>
            </div>
          </div>

          {/* TABLE */}
          <Table />
        </main>
      </div>

      {/* MODALS */}
      <CreatePanel open={showCreate} onClose={() => setShowCreate(false)} />
      <DetailModal row={detail} onClose={() => setDetail(null)} />
    </div>
  );
}
