import { useMemo, useState } from "react";
import { createContextProvider } from "../../../util/createContextProvider";
import { SAMPLE_USERS } from "../../../features/users/constants/user.dataTmp";
import {
  USER_ROLE,
  type UserResponse,
} from "../../../features/users/types/User.types";
import { useQuery } from "@tanstack/react-query";
import { client } from "../../../api/client";

export const [QuanLyNguoiDungProvider, useQuanLyNguoiDungContext] =
  createContextProvider(() => {
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("ALL");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
    const [sortBy, setSortBy] = useState("name");
    const [openModalCreate, setOpenModalCreate] = useState(false);

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

    const [filters, setFilters] = useState({
      page: 1,
      limit: 10,
      username: "",
      role: "STAFF", // Ví dụ lọc theo nhân viên
    });

    const {
      data: users,
      isLoading,
      isError,
      refetch,
    } = useQuery({
      // 1. queryKey phải chứa filters để tự động fetch lại khi filter thay đổi
      queryKey: ["nhan-vien", filters],

      queryFn: async () => {
        // 2. Gọi API với params
        const { data, error } = await client.GET("/users/search", {
          params: {
            query: {
              page: filters.page,
              limit: filters.limit,
              username: filters.username,
              role: filters.role,
              // các field khác như email, isActive...
            },
          },
        });

        // 3. Xử lý lỗi nếu fetch fail
        if (error) throw new Error(error || "Lỗi khi lấy dữ liệu");

        // Trả về dữ liệu cho TanStack Query
        return data;
      },
      refetchOnWindowFocus: false,
    });

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
      openModalCreate,
      setOpenModalCreate,
      users,
      isLoading,

      isError,
      refetch,
      filters,
      setFilters,
    };
  });
