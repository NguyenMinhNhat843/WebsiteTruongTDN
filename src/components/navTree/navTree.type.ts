import type { EnumRoleUser } from "../../api/enum";

export interface NavItem {
  id: string;
  label: string;
  icon?: string;
  href?: string;
  badge?: string | number;
  children?: NavItem[];
  roles?: EnumRoleUser[];
}
