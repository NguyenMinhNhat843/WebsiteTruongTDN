import { Edit, Eye, Trash2 } from "lucide-react";
import React, { useState } from "react";

// --- TYPES ---
export const USER_ROLE = {
  ADMIN: "ADMIN",
  TEACHER: "TEACHER",
  STAFF: "STAFF",
  STUDENT: "STUDENT",
  PARENT: "PARENT",
} as const;

export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

type Action = "read" | "update" | "delete";

interface ModulePermission {
  id: string;
  label: string;
}

// --- CONFIGURATION ---
const MODULE_LIST: ModulePermission[] = [
  { id: "students", label: "Quản lý học sinh" },
  { id: "grades", label: "Quản lý điểm số" },
  { id: "finances", label: "Học phí & Thu chi" },
  { id: "schedule", label: "Thời khóa biểu" },
  { id: "news", label: "Tin tức & Thông báo" },
];

type PermissionState = Record<UserRole, Record<string, Action[]>>;

const INITIAL_STATE: PermissionState = {
  ADMIN: {
    students: ["read", "update", "delete"],
    grades: ["read", "update", "delete"],
    finances: ["read", "update", "delete"],
    schedule: ["read", "update", "delete"],
    news: ["read", "update", "delete"],
  },
  TEACHER: {
    students: [],
    grades: ["read", "update"],
    schedule: ["update"],
    news: ["read"],
  },
  STAFF: {
    students: ["read", "update"],
    finances: ["read", "update"],
    news: ["read"],
  },
  STUDENT: { students: [], grades: [], finances: [], schedule: [], news: [] },
  PARENT: { students: [], grades: [], finances: [], schedule: [], news: [] },
};

export default function PhanQuyenNguoiDung() {
  const [permissions, setPermissions] =
    useState<PermissionState>(INITIAL_STATE);

  const togglePermission = (
    role: UserRole,
    moduleId: string,
    action: Action,
  ) => {
    if (role === "ADMIN") return; // Khóa quyền Admin để bảo mật

    setPermissions((prev) => {
      const rolePerms = prev[role] || {};
      const moduleActions = rolePerms[moduleId] || [];

      const newActions = moduleActions.includes(action)
        ? moduleActions.filter((a) => a !== action)
        : [...moduleActions, action];

      return {
        ...prev,
        [role]: { ...rolePerms, [moduleId]: newActions },
      };
    });
  };

  const ActionButton = ({
    role,
    modId,
    action,
    label,
    color,
    Icon,
  }: {
    role: UserRole;
    modId: string;
    action: Action;
    label: string;
    color: string;
    Icon?: React.ElementType;
  }) => {
    const isActive = permissions[role][modId]?.includes(action);
    const isAdmin = role === "ADMIN";

    return (
      <button
        disabled={isAdmin}
        onClick={() => togglePermission(role, modId, action)}
        className={`px-3 py-2 rounded-lg text-[10px] font-semibold transition-all flex items-center gap-1 ${
          isActive
            ? `bg-${color}-600 border-${color}-700 text-white`
            : "bg-white border-slate-200 text-slate-400 hover:border-slate-400"
        } ${isAdmin ? "opacity-60 cursor-not-allowed" : "active:scale-90"}`}
      >
        {Icon && <Icon size={16} />}
        {isActive && label}
      </button>
    );
  };

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Phân Quyền
            </h1>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all">
            Lưu thay đổi
          </button>
        </header>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white whitespace-nowrap">
                  <th className="p-5 text-left font-bold uppercase tracking-widest text-xs border-r border-slate-800 w-64">
                    Nhóm Chức Năng
                  </th>
                  {["ADMIN", "TEACHER", "STAFF", "STUDENT"].map((role) => (
                    <th
                      key={role}
                      className="p-5 text-center font-bold text-sm min-w-45"
                    >
                      {role}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MODULE_LIST.map((mod) => (
                  <tr
                    key={mod.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="p-5 font-bold text-slate-700 bg-slate-50/30 border-r border-slate-100">
                      {mod.label}
                    </td>
                    {["ADMIN", "TEACHER", "STAFF", "STUDENT"].map((role) => (
                      <td key={role} className="p-4">
                        <div className="flex justify-center gap-1.5">
                          <ActionButton
                            role={role}
                            modId={mod.id}
                            action="read"
                            label="XEM"
                            color="green"
                            Icon={Eye}
                          />
                          <ActionButton
                            role={role}
                            modId={mod.id}
                            action="update"
                            label="SỬA"
                            color="blue"
                            Icon={Edit}
                          />
                          <ActionButton
                            role={role}
                            modId={mod.id}
                            action="delete"
                            label="XÓA"
                            color="red"
                            Icon={Trash2}
                          />
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
