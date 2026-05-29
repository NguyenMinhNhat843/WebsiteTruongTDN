import { useQueryClient } from "@tanstack/react-query";
import { $api } from "../../api/client";

export const useGetMonHocDetail = (idSelected: number | undefined | null) => {
  const {
    data: monHocDetail,
    isLoading: isMonHocDetailLoading,
    error: monHocDetailError,
    refetch: refetchMonHocDetail,
  } = $api.useQuery(
    "get",
    "/subjects/{id}",
    {
      params: {
        path: {
          id: idSelected!,
        },
      },
    },
    {
      enabled: !!idSelected, // Chỉ chạy query khi idSelected có giá trị thực tế
    },
  );

  return {
    monHocDetail,
    isMonHocDetailLoading,
    monHocDetailError,
    refetchMonHocDetail,
  };
};

export const useUpdateMonHoc = () => {
  const queryClient = useQueryClient();

  const {
    mutate: updateMonHoc,
    isPending: isUpdateMonHocPending,
    isError: isUpdateMonHocError,
    error: updateMonHocError,
  } = $api.useMutation("patch", "/subjects/{id}", {
    onSuccess: () => {
      // Làm mới danh sách môn học
      queryClient.invalidateQueries({
        queryKey: ["get", "/subjects"],
      });
    },
    onError: (err) => {
      alert(JSON.stringify(err) || "Cập nhật môn học thất bại!");
    },
  });

  return {
    updateMonHoc,
    isPending: isUpdateMonHocPending,
    isError: isUpdateMonHocError,
    updateMonHocError,
  };
};
