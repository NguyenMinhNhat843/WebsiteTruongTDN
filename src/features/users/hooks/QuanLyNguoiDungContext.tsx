import { useMemo, useState } from "react";
import { createContextProvider } from "../../../util/createContextProvider";
import { SAMPLE_USERS } from "../constants/user.dataTmp";
import { USER_ROLE, type UserResponse } from "../types/User.types";

export const [QuanLyNguoiDungProvider, useQuanLyNguoiDung] =
  createContextProvider(() => {
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("ALL");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
    const [sortBy, setSortBy] = useState("name");

    const stats = useMemo(
      () => ({
        total: SAMPLE_USERS.length,
        byRole: Object.fromEntries(
          Object.keys(USER_ROLE).map((r) => [
            r,
            SAMPLE_USERS.filter((u) => u.role === r).length,
          ]),
        ),
        active: SAMPLE_USERS.filter((u) => u.status === "active").length,
      }),
      [],
    );

    const filtered = useMemo(() => {
      let list = [...SAMPLE_USERS];
      if (roleFilter !== "ALL")
        list = list.filter((u) => u.role === roleFilter);
      if (statusFilter !== "ALL")
        list = list.filter((u) => u.status === statusFilter);
      if (search.trim()) {
        const q = search.toLowerCase();
        list = list.filter(
          (u) =>
            u.name.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q) ||
            u.phoneNumber.includes(q) ||
            (u.staffProfile?.staffCode || "").toLowerCase().includes(q) ||
            (u.studentProfile?.studentCode || "").toLowerCase().includes(q),
        );
      }
      list.sort((a, b) => {
        if (sortBy === "name") return a.name.localeCompare(b.name, "vi");
        if (sortBy === "role") return a.role.localeCompare(b.role);
        if (sortBy === "date") {
          return b.createdAt.getTime() - a.createdAt.getTime();
        }
        return 0;
      });
      return list;
    }, [search, roleFilter, statusFilter, sortBy]);

    const roleStats = [
      { label: "Giáo viên", role: "TEACHER", icon: "🎓", color: "#4ade80" },
      { label: "Nhân viên", role: "STAFF", icon: "💼", color: "#facc15" },
      { label: "Học sinh", role: "STUDENT", icon: "📚", color: "#38bdf8" },
      { label: "Phụ huynh", role: "PARENT", icon: "👨‍👩‍👧", color: "#fb7185" },
    ];

    return {
      search,
      setSearch,
      roleFilter,
      setRoleFilter,
      statusFilter,
      setStatusFilter,
      selectedUser,
      setSelectedUser,
      sortBy,
      setSortBy,
      stats,
      filtered,
      roleStats,
    };
  });
