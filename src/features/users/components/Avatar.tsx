import { ROLE_COLOR } from "../constants/user.constants";
import { userHelpers } from "../user.helpers";
import type { User } from "../types/User.types";

// Giả sử User và ROLE_COLOR đã được định nghĩa ở đâu đó
interface AvatarProps {
  user: User;
  size?: number;
}

export default function Avatar({ user, size = 40 }: AvatarProps) {
  const rc = ROLE_COLOR[user.role];
  const initials = userHelpers.getInitials(user.name);

  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundColor: `${rc.dot}33`,
        borderColor: `${rc.dot}55`,
        color: rc.dot,
        fontSize: size * 0.35,
        boxShadow: `0 0 12px ${rc.dot}22`,
        background: `linear-gradient(135deg, ${rc.dot}33, ${rc.dot}66)`,
      }}
      className="
        flex items-center justify-center 
        rounded-full border-2 shrink-0
      "
    >
      {initials}
    </div>
  );
}
