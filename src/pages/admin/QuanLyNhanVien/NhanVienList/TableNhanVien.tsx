import type { Column } from "../../../../components/ui/Table";
import ReusableTable from "../../../../components/ui/Table";
import type { UserResponse } from "../../../../features/users/types/User.types";

const NhanVienTable = ({
  filtered,
  setSelectedUser,
}: {
  filtered: UserResponse[];
  setSelectedUser: (user: UserResponse) => void;
}) => {
  const columns: Column<UserResponse>[] = [
    {
      key: "user",
      label: "Người dùng",
      className: "w-[40%]", // Tương ứng 2fr
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[12px] font-bold text-slate-500 border border-slate-200">
            {item.avatarUrl ? (
              <img src={item.avatarUrl} alt="" className="rounded-full" />
            ) : (
              item.name.charAt(0)
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-slate-700 text-[13px]">
              {item.name}
            </span>
            <span className="text-slate-400 text-[11px] font-medium">
              {item.email}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      label: "Vai trò",
      className: "w-[20%]", // Tương ứng 1fr
      render: (item) => (
        <span
          className={`px-2 py-0.5 rounded-full text-[11px] font-bold border border-solid 
          ${
            item.role === "ADMIN"
              ? "bg-indigo-50 text-indigo-600 border-indigo-100"
              : item.role === "TEACHER"
                ? "bg-amber-50 text-amber-600 border-amber-100"
                : "bg-slate-50 text-slate-600 border-slate-100"
          }`}
        >
          {item.role}
        </span>
      ),
    },
    {
      key: "position",
      label: "Chức vụ / Lớp",
      className: "w-[24%]", // Tương ứng 1.2fr
      render: (item) => (
        <span className="text-slate-600 text-[13px] font-medium">
          {item.staffProfile?.position}
        </span>
      ),
    },
    {
      key: "status",
      label: "Trạng thái",
      className: "w-[20%]", // Tương ứng 1fr
      render: (item) => (
        <div className="flex items-center gap-1.5">
          <div
            className={`w-1.5 h-1.5 rounded-full ${item.status === "active" ? "bg-emerald-500" : "bg-slate-300"}`}
          />
          <span
            className={`text-[12px] font-medium ${item.status === "active" ? "text-emerald-600" : "text-slate-400"}`}
          >
            {item.status === "active" ? "Đang hoạt động" : "Tạm khóa"}
          </span>
        </div>
      ),
    },
    {
      key: "createdAt",
      label: "Ngày tạo",
      headerClassName: "text-right",
      className: "text-right w-[20%]", // Tương ứng 1fr
      render: (item) => (
        <span className="text-slate-400 text-[12px] tabular-nums">
          {item.createdAt
            ? new Date(item.createdAt).toLocaleDateString("vi-VN")
            : ""}
        </span>
      ),
    },
  ];

  return (
    <div className="bg-white border border-solid border-slate-200 rounded-[14px] overflow-hidden shadow-sm">
      {filtered.length === 0 ? (
        <div className="py-24 px-5 text-center flex flex-col items-center justify-center">
          <div className="text-3xl mb-2">🔍</div>
          <div className="text-slate-400 text-[14px] font-medium">
            Không tìm thấy kết quả nào phù hợp
          </div>
        </div>
      ) : (
        <ReusableTable
          data={filtered}
          columns={columns}
          rowKey="id"
          onRowClick={(user) => setSelectedUser(user)}
          // Bạn có thể thêm prop onRowClick vào component Table nếu nó hỗ trợ
          // Hoặc xử lý click bên trong hàm render của từng cột
        />
      )}
    </div>
  );
};

export default NhanVienTable;
