import type { UserRole } from "../../api/enum/UserEnum";

export interface NavItem {
  id: string;
  label: string;
  icon?: string;
  href?: string;
  badge?: string | number;
  children?: NavItem[];
  roles?: UserRole[];
}
