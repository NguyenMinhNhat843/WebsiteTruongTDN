import {
  ROLE_COLOR,
  ROLE_LABEL,
} from "../../../features/users/constants/user.constants";
import { USER_ROLE } from "../../../features/users/types/User.types";
import UserDetailModal from "../../../features/users/components/UserDetailModal";
import {
  QuanLyNguoiDungProvider,
  useQuanLyNguoiDungContext,
} from "./QuanLyNguoiDungContext";
import UserRow from "../../../features/users/components/UserRow";
import PageShell from "../../../components/ui/PageShell";
import { User } from "lucide-react";
import CreateNhanVien from "./CreateNhanVien/CreateNhanVienForm";

export default function QuanLyNhanVien() {
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
    openModalCreate,
    setOpenModalCreate,
  } = useQuanLyNguoiDungContext();
  return (
    <PageShell
      title="Quản lý người dùng"
      sub={`${stats.total} tài khoản · ${stats.active} đang hoạt động`}
      icon={User}
      renderRight={
        <button
          className="ml-auto px-4.5 py-2.25 rounded-[10px] 
        bg-linear-to-br from-indigo-600 to-violet-600 text-white text-[13px] 
        font-bold tracking-wide shadow-lg shadow-indigo-200 border-none cursor-pointer 
        hover:opacity-90 active:scale-95 transition-all"
          onClick={() => setOpenModalCreate(true)}
        >
          + Thêm người dùng
        </button>
      }
    >
      <div className="">
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

      {openModalCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Lớp nền mờ (Backdrop) */}
          <div
            className="absolute inset-0 bg-slate-900/40 transition-opacity"
            onClick={() => setOpenModalCreate(false)}
          />

          {/* Nội dung Modal */}
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header của Modal */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">
                Thêm nhân viên mới
              </h3>
              <button
                onClick={() => setOpenModalCreate(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Body chứa Form - Giới hạn chiều cao nếu form dài */}
            <div className="max-h-[80vh] overflow-y-auto p-6">
              <CreateNhanVien />
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}
