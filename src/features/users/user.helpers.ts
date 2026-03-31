import {
  DEPARTMENT,
  STAFF_POSITION,
  type UserResponse,
} from "./types/User.types";

export const userHelpers = {
  getInitials: function (name: string) {
    return name
      .split(" ")
      .slice(-2)
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  },

  getSubtitle: function (user: UserResponse) {
    if (user.staffProfile) {
      const pos = STAFF_POSITION[user?.staffProfile?.position] || "";
      const dept = DEPARTMENT[user.staffProfile.department] || "";
      const extras = (user.staffProfile.additionalPositions || [])
        .map((p) => STAFF_POSITION[p])
        .filter(Boolean);
      return extras.length
        ? `${pos} · ${dept} · kiêm ${extras.join(", ")}`
        : `${pos} · ${dept}`;
    }
    if (user.studentProfile)
      return `${user.studentProfile.className} · ${user.studentProfile.studentCode}`;
    if (user.parentProfile) {
      const rel = { FATHER: "Bố", MOTHER: "Mẹ", GUARDIAN: "Người giám hộ" }[
        user.parentProfile.relationship
      ];
      const child = user.parentProfile.children?.[0];
      return child ? `${rel} của ${child.name} (${child.className})` : rel;
    }
    return "Quản trị viên hệ thống";
  },
};
