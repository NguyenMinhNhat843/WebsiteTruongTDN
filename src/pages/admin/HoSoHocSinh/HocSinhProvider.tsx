import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { createContextProvider } from "../../../util/createContextProvider";
import { $api } from "../../../api/client";
import type { components } from "../../../api/v1";

export type HocSinhDto = components["schemas"]["StudentResponseDto"];
export type StatusHocSinhEnum = HocSinhDto["status"];

export const [HocSinhProvider, useHocSinhContext] = createContextProvider(
  () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    /**
     * Lấy danh sách học sinh
     */
    const {
      data: students,
      isLoading: isLoadingStudents,
      refetch: refetchStudents,
    } = $api.useQuery("get", "/students");
    // thống kê đơn giản
    const dataAnalyst = {
      total: students?.length || 0,
      studying: students?.filter((s) => s.status === "studying").length || 0,
      approved: students?.filter((s) => s.status === "approved").length || 0,
      dropped: students?.filter((s) => s.status === "dropped").length || 0,
      expelled: students?.filter((s) => s.status === "expelled").length || 0,
      graduated: students?.filter((s) => s.status === "graduated").length || 0,
      suspended: students?.filter((s) => s.status === "suspended").length || 0,
    };

    /**
     * Xóa học sinh - dành cho development
     * Lên production sẽ bỏ đi
     */
    const { mutate: deleteStudent, isPending: isDeletingStudent } =
      $api.useMutation("delete", "/students/{id}", {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["get", "/students"] });
        },
      });

    /**
     * Thêm học sinh
     */
    const { mutate: createStudent, isPending: isCreatingStudent } =
      $api.useMutation("post", "/students");

    return {
      students: students || [],
      deleteStudent,
      isDeletingStudent,
      isLoadingStudents,
      dataAnalyst,
      createStudent,
      isCreatingStudent,
      refetchStudents,

      navigate,
    };
  },
);
