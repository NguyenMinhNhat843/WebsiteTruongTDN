import {
  ROLE_COLOR,
  ROLE_LABEL,
} from "../../features/users/constants/user.constants";
import { USER_ROLE } from "../../features/users/types/User.types";
import StatCard from "../../features/users/components/StatCard";
import UserDetailModal from "../../features/users/components/UserDetailModal";
import {
  QuanLyNguoiDungProvider,
  useQuanLyNguoiDung,
} from "../../features/users/hooks/QuanLyNguoiDungContext";
import UserRow from "../../features/users/components/UserRow";

export default function QuanLyNguoiDung() {
  return (
    <QuanLyNguoiDungProvider>
      <Inner />
    </QuanLyNguoiDungProvider>
  );
}

function Inner() {
  const {
    filtered,
    stats,
    roleStats,
    search,
    setSearch,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    selectedUser,
    setSelectedUser,
  } = useQuanLyNguoiDung();
  return (
    <div
      style={{
        minHeight: "100vh",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 20px" }}>
        {/* Page title */}
        <div style={{ marginBottom: 24 }}>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 900,
              letterSpacing: "-0.03em",
            }}
          >
            Quản lý người dùng
          </h1>
          <p style={{ color: "#475569", fontSize: 13, marginTop: 4 }}>
            {stats.total} tài khoản · {stats.active} đang hoạt động
          </p>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 12,
            marginBottom: 24,
          }}
        >
          {roleStats.map((s) => (
            <StatCard
              key={s.role}
              label={s.label}
              value={stats.byRole[s.role] || 0}
              color={s.color}
              icon={s.icon}
            />
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 p-4 mb-4 bg-white border border-solid border-slate-200 rounded-[14px] shadow-sm">
          {/* Search */}
          <div className="relative flex-[1_1_220px]">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[14px]">
              🔍
            </span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên, email, mã số..."
              className="w-full pl-8.5 pr-3 py-2.25 bg-slate-50 border border-solid border-slate-200 rounded-[10px] text-slate-800 text-[13px] outline-none focus:border-indigo-400 focus:bg-white transition-all"
            />
          </div>

          {/* Role filter */}
          <div className="flex flex-wrap gap-1.5">
            {["ALL", ...Object.keys(USER_ROLE)].map((r) => {
              const rc =
                r !== "ALL" ? ROLE_COLOR[r as keyof typeof ROLE_COLOR] : null;
              const active = roleFilter === r;

              return (
                <button
                  key={r}
                  onClick={() => setRoleFilter(r)}
                  style={{
                    borderColor: active ? rc?.dot || "#4f46e5" : "#e2e8f0",
                    backgroundColor: active
                      ? `${rc?.dot || "#4f46e5"}12`
                      : "transparent",
                    color: active ? rc?.dot || "#4f46e5" : "#64748b",
                  }}
                  className="px-3.5 py-1.75 rounded-full border border-solid text-[12px] font-semibold transition-all cursor-pointer hover:bg-slate-50"
                >
                  {r === "ALL"
                    ? "Tất cả"
                    : ROLE_LABEL[r as keyof typeof ROLE_LABEL]}
                </button>
              );
            })}
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-solid border-slate-200 rounded-[10px] text-slate-600 text-[12px] cursor-pointer outline-none hover:border-slate-300"
          >
            <option value="ALL">Mọi trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Không HĐ</option>
            <option value="locked">Đã khoá</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 bg-white border border-solid border-slate-200 rounded-[10px] text-slate-600 text-[12px] cursor-pointer outline-none hover:border-slate-300"
          >
            <option value="name">Sắp xếp: Tên</option>
            <option value="role">Sắp xếp: Vai trò</option>
            <option value="date">Sắp xếp: Mới nhất</option>
          </select>

          {/* Add button */}
          <button className="ml-auto px-4.5 py-2.25 rounded-[10px] bg-linear-to-br from-indigo-600 to-violet-600 text-white text-[13px] font-bold tracking-wide shadow-lg shadow-indigo-200 border-none cursor-pointer hover:opacity-90 active:scale-95 transition-all">
            + Thêm người dùng
          </button>
        </div>

        {/* Result count */}
        <div style={{ fontSize: 12, color: "#334155", marginBottom: 10 }}>
          Hiển thị{" "}
          <strong style={{ color: "#64748b" }}>{filtered.length}</strong> kết
          quả
        </div>

        {/* ========== Table ============== */}
        <div className="bg-white border border-solid border-slate-200 rounded-[14px] overflow-hidden shadow-sm">
          <div
            className="
                grid grid-cols-[2fr_1fr_1.2fr_1fr_1fr] items-center px-5 py-3
                bg-slate-50/80 border-b border-solid border-slate-200
                text-[11px] font-bold text-slate-500 uppercase tracking-[0.07em]
            "
          >
            <span>Người dùng</span>
            <span>Vai trò</span>
            <span>Chức vụ / Lớp</span>
            <span>Trạng thái</span>
            <span className="text-right">Ngày tạo</span>
          </div>

          <div className="min-h-50">
            {filtered.length === 0 ? (
              <div className="py-24 px-5 text-center flex flex-col items-center justify-center">
                <div className="text-3xl mb-2">🔍</div>
                <div className="text-slate-400 text-[14px] font-medium">
                  Không tìm thấy kết quả nào phù hợp
                </div>
              </div>
            ) : (
              filtered.map((user, idx) => (
                <UserRow
                  key={user.id}
                  user={user}
                  isLast={idx === filtered.length - 1}
                  onClick={() => setSelectedUser(user)}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedUser && (
        <UserDetailModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
}
