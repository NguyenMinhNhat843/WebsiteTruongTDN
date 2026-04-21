import type { UserRole } from "../../features/users/types/User.types";

export interface NavItem {
  id: string;
  label: string;
  icon?: string; // emoji hoặc ký tự icon
  href?: string;
  badge?: string | number;
  children?: NavItem[];
  roles?: UserRole[]; // Nếu có, chỉ hiển thị item này cho các role được liệt kê
}
