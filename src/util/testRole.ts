import type { UserRole } from "../features/users/types/User.types";

export const canView = (role: UserRole | null, allowedRoles: UserRole[]) => {
  if (!role) return false; // Nếu không có role, không cho phép truy cập
  return allowedRoles.includes(role);
};

export const canEdit = (role: UserRole | null, allowedRoles: UserRole[]) => {
  if (!role) return false;
  return allowedRoles.includes(role);
};

export const canDelete = (role: UserRole | null, allowedRoles: UserRole[]) => {
  if (!role) return false;
  return allowedRoles.includes(role);
};
