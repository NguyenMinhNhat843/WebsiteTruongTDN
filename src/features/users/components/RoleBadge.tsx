import type { UserRole } from "../types/User.types";
import { ROLE_COLOR, ROLE_LABEL } from "../constants/user.constants";

interface RoleBadgeProps {
  role: UserRole;
}

export default function RoleBadge({ role }: RoleBadgeProps) {
  const rc = ROLE_COLOR[role];

  return (
    <span
      style={{
        backgroundColor: rc.bg,
        color: rc.text,
        borderColor: `${rc.dot}33`,
      }}
      className="
        inline-flex items-center gap-1.25
        px-2.5 py-0.75 
        rounded-full border border-solid
        text-[11px] font-semibold tracking-[0.04em]
      "
    >
      {/* Cái Dot nhỏ bên cạnh */}
      <span
        style={{ backgroundColor: rc.dot }}
        className="w-1.5 h-1.5 rounded-full shrink-0"
      />

      {ROLE_LABEL[role]}
    </span>
  );
}
