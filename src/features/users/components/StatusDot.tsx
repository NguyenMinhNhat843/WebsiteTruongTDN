import { STATUS_COLOR } from "../constants/user.constants";
import type { UserStatus } from "../types/User.types";

interface StatusDotProps {
  status: UserStatus;
}

export default function StatusDot({ status }: StatusDotProps) {
  // Đảm bảo ép kiểu key nếu STATUS_COLOR báo lỗi đỏ
  const s = STATUS_COLOR[status as keyof typeof STATUS_COLOR];

  return (
    <span
      style={{ color: s.color }}
      className="inline-flex items-center gap-1.25 text-[12px]"
    >
      <span
        style={{
          backgroundColor: s.color,
          boxShadow: `0 0 6px ${s.color}`,
        }}
        className="w-1.75 h-1.75 rounded-full shrink-0"
      />
      {s.label}
    </span>
  );
}
