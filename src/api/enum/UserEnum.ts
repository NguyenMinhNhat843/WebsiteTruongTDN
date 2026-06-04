import type { components } from "../v1";

export type UserRole = components["schemas"]["RegisterDto"]["role"];
export const UserRoles: UserRole[] = ["admin", "staff", "student", "teacher"];
