import { useState } from "react";
import { createContextProvider } from "../../../util/createContextProvider";
import { $api } from "../../../api/client";
import type { components } from "../../../api/v1";
import { useParams } from "react-router-dom";

export type StaffDto = components["schemas"]["StaffResponseDto"];
export type CreateStaffDto = components["schemas"]["CreateStaffDto"];
export type StaffRole = CreateStaffDto["EmployeeRole"];
export type SubjectResponseDto = components["schemas"]["ResponseSubjectDto"];

export const [QuanLyNguoiDungProvider, useQuanLyNguoiDungContext] =
  createContextProvider(() => {
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("ALL");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [selectedUser, setSelectedUser] = useState(null);
    const [sortBy, setSortBy] = useState("name");
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const { staffCode } = useParams(); // Dùng cho xem chi tiết
    const [isOpenModalMonHoc, setIsOpenModalMonHoc] = useState(false);

    const [filters, setFilters] = useState({
      page: 1,
      limit: 10,
      EmployeeRole: "TEACHER",
    });

    /**
     * Lấy danh sách giáo viên
     */
    const {
      data: staffs,
      isLoading: isLoadingNhanVien,
      isPending: isPendingStaffs,
      refetch: refetchStaffs,
    } = $api.useQuery("get", "/staffs", {
      params: {
        query: {
          page: filters.page,
          limit: filters.limit,
          employeeRole: filters.EmployeeRole as StaffRole,
          keyword: search.trim() !== "" ? search.trim() : undefined,
        },
      },
    });

    /**
     * Tạo 1 giáo viên
     */
    const { mutate: createStaff, isPending: isCreatingStaff } =
      $api.useMutation("post", "/staffs", {
        onSuccess: () => {
          refetchStaffs();
        },
      });

    /**
     * Lấy thông tin chi tiết 1 giáo viên
     */
    const {
      data: staffDetail,
      isLoading: isLoadingStaffDetail,
      refetch: refetchStaffDetail,
    } = $api.useQuery(
      "get",
      "/staffs/{staffCode}",
      {
        params: {
          path: {
            staffCode: staffCode!,
          },
        },
      },
      {
        enabled: Boolean(staffCode),
      },
    );

    /**
     * Đăng ký môn học cho giáo viên
     */
    const { mutate: registerSubjectsForTeacher, isPending: isRegistering } =
      $api.useMutation("post", "/teacher-subjects/batch", {
        onSuccess: () => {
          refetchStaffDetail();
        },
      });

    /**
     * Lấy all danh sách môn học
     */
    const { data: allSubjects, isLoading: isLoadingAllSubjects } =
      $api.useQuery("get", "/subjects");

    return {
      staffs,
      isPendingStaffs,
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
      openModalCreate,
      setOpenModalCreate,
      isLoadingNhanVien,
      createStaff,
      isCreatingStaff,
      staffDetail,
      isLoadingStaffDetail,
      registerSubjectsForTeacher,
      isRegistering,
      allSubjects,
      isLoadingAllSubjects,
      isOpenModalMonHoc,
      setIsOpenModalMonHoc,

      filters,
      setFilters,
    };
  });
