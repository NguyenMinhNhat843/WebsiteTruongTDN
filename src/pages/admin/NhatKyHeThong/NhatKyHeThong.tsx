import {
  User,
  ShieldCheck,
  Clock,
  Activity,
  Download,
  Search,
  Filter,
  RotateCcw,
} from "lucide-react";
import ButtonAction from "../../../components/ui/ButtonAction";
import Input from "../../../components/ui/Form/Input";
import { SelectOption } from "../../../components/ui/Form/SelectOption";
import ReusableTable from "../../../components/ui/Table";
import clsx from "clsx";
import { MOCK_SYSTEM_LOGS } from "./mockData";
import PageShell from "../../../components/ui/PageShell";
import Pagination from "../../../components/ui/Pagination";

const columns = [
  {
    key: "time",
    label: "Thời gian",
    render: (item: any) => (
      <div className="flex items-center gap-2 text-slate-600">
        <Clock size={14} className="text-slate-400" />
        <span className="font-medium">{item.time}</span>
      </div>
    ),
  },
  {
    key: "user",
    label: "Người thực hiện",
    render: (item: any) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
          {item.user.charAt(0)}
        </div>
        <span className="font-semibold text-slate-700">{item.user}</span>
      </div>
    ),
  },
  {
    key: "role",
    label: "Vai trò",
    render: (item: any) => {
      const isAdmin = item.role === "Admin";
      return (
        <span
          className={clsx(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold",
            isAdmin
              ? "bg-purple-50 text-purple-600 border border-purple-100"
              : "bg-slate-50 text-slate-600 border border-slate-100",
          )}
        >
          {isAdmin ? <ShieldCheck size={12} /> : <User size={12} />}
          {item.role}
        </span>
      );
    },
  },
  {
    key: "action",
    label: "Hành động",
    render: (item: any) => {
      // Phân loại màu sắc theo loại hành động
      const styles: any = {
        CREATE: "bg-emerald-50 text-emerald-700 border-emerald-100",
        UPDATE: "bg-amber-50 text-amber-700 border-amber-100",
        DELETE: "bg-red-50 text-red-700 border-red-100",
        LOGIN: "bg-blue-50 text-blue-700 border-blue-100",
      };
      return (
        <span
          className={clsx(
            "px-2 py-1 rounded-md text-[11px] font-black uppercase border",
            styles[item.type] || "bg-slate-50 text-slate-600",
          )}
        >
          {item.action}
        </span>
      );
    },
  },
  {
    key: "content",
    label: "Nội dung chi tiết",
    className: " text-sm max-w-[300px]",
  },
];

const SystemLogPage = () => {
  return (
    <PageShell
      title="Nhật ký hệ thống"
      sub="Theo dõi toàn bộ lịch sử thao tác của người dùng trên hệ thống"
      icon={Clock}
      renderRight={
        <ButtonAction
          label="Xuất báo cáo (Excel)"
          icon={<Download size={18} />}
          className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-100"
        />
      }
    >
      <div className="space-y-6">
        {/* Bộ lọc (Filter Bar) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <Input
            label="Tìm kiếm"
            placeholder="Tên người dùng, nội dung..."
            icon={Search}
          />
          <SelectOption
            label="Vai trò"
            options={[
              { label: "Tất cả", value: "" },
              { label: "Quản trị viên", value: "Admin" },
              { label: "Giảng viên", value: "Teacher" },
              { label: "Nhân viên", value: "Staff" },
            ]}
          />
          <SelectOption
            label="Loại hành động"
            options={[
              { label: "Tất cả", value: "" },
              { label: "Thêm mới", value: "CREATE" },
              { label: "Cập nhật", value: "UPDATE" },
              { label: "Xóa", value: "DELETE" },
            ]}
          />
          <div className="flex items-end gap-2">
            <ButtonAction
              label="Lọc dữ liệu"
              icon={<Filter size={18} />}
              className="flex-1 bg-slate-800 text-white"
            />
            <ButtonAction
              icon={<RotateCcw size={18} />}
              className="bg-slate-100 text-slate-600"
            />
          </div>
        </div>

        {/* Bảng dữ liệu */}
        <div className="bg-white overflow-hidden">
          <div className="py-4 bg-slate-50/50 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Activity size={18} className="text-blue-500" />
              <span className="font-bold text-slate-700">
                Dữ liệu log vận hành
              </span>
            </div>
            <span className="text-xs font-medium text-slate-400">
              Tự động cập nhật mỗi 30s
            </span>
          </div>

          <ReusableTable
            data={MOCK_SYSTEM_LOGS}
            columns={columns}
            rowKey="id"
            emptyMessage="Không tìm thấy nhật ký thao tác nào."
          />

          <Pagination
            currentPage={1}
            onPageChange={() => console.log()}
            pageSize={8}
            totalItems={9}
          />
        </div>
      </div>
    </PageShell>
  );
};

export default SystemLogPage;
