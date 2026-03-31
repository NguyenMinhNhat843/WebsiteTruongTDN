import {
  type UserResponse,
  STAFF_POSITION,
  DEPARTMENT,
} from "../types/User.types";
import { appHelpers } from "../../../util/app.helpers";
import Avatar from "./Avatar";
import RoleBadge from "./RoleBadge";
import StatusDot from "./StatusDot";

interface UserRowProps {
  user: UserResponse;
  isLast: boolean;
  onClick: () => void;
}

export default function UserRow({ user, isLast, onClick }: UserRowProps) {
  const pos = user.staffProfile
    ? STAFF_POSITION[user.staffProfile.position as keyof typeof STAFF_POSITION]
    : null;
  const dept = user.staffProfile
    ? DEPARTMENT[user.staffProfile.department as keyof typeof DEPARTMENT]
    : null;
  const classInfo = user.studentProfile?.className;

  return (
    <div
      onClick={onClick}
      className={`
        group grid grid-cols-[2fr_1fr_1.2fr_1fr_1fr] items-center px-5 py-3.5
        transition-all duration-150 cursor-pointer
        hover:bg-slate-50/80 active:bg-slate-100
        ${isLast ? "border-none" : "border-b border-solid border-slate-100"}
      `}
    >
      {/* Name + Email */}
      <div className="flex items-center gap-3">
        <div className="shrink-0">
          <Avatar user={user} size={38} />
        </div>
        <div className="flex flex-col min-w-0">
          <div className="text-[14px] font-bold text-slate-700 transition-colors group-hover:text-indigo-600 truncate">
            {user.name}
          </div>
          <div className="text-[12px] text-slate-400 mt-0.5 truncate leading-none">
            {user.email}
          </div>
        </div>
      </div>

      {/* Role */}
      <div>
        <RoleBadge role={user.role} />
      </div>

      {/* Position / Class */}
      <div className="flex flex-col justify-center">
        {pos ? (
          <>
            <div className="text-[13px] text-slate-600 font-semibold truncate leading-tight">
              {pos}
            </div>
            <div className="text-[11px] text-slate-400 mt-1 uppercase tracking-wider font-medium truncate">
              {dept}
            </div>
          </>
        ) : classInfo ? (
          <div className="text-[13px] text-slate-500 font-medium italic bg-slate-100/50 px-2 py-0.5 rounded-md w-fit">
            Lớp {classInfo}
          </div>
        ) : (
          <div className="text-[12px] text-slate-300">—</div>
        )}
      </div>

      {/* Status */}
      <div className="flex justify-start">
        <StatusDot status={user.status} />
      </div>

      {/* Date */}
      <div className="text-[12px] text-slate-400 font-medium text-right font-mono">
        {appHelpers.formatDate(user.createdAt)}
      </div>
    </div>
  );
}
