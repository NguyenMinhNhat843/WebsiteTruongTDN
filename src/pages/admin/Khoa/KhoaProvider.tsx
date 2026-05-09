import { useState } from "react";
import { createContextProvider } from "../../../util/createContextProvider";
import { $api } from "../../../api/client";
import type { components } from "../../../api/v1";
import { useQueryClient } from "@tanstack/react-query";

export type CreateKhoaType = components["schemas"]["CreateDepartmentDto"];

export const [KhoaProvider, useKhoaContext] = createContextProvider(() => {
  const [openModalCreateKhoa, setOpenModalCreateKhoa] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: departments,
    isLoading: isLoadingDepartment,
    isError: isDepartmentError,
  } = $api.useQuery("get", "/departments", {
    params: {},
  });

  // create
  const { mutate: createDepartment, isError: isCreateDepartmentError } =
    $api.useMutation("post", "/departments", {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: $api.queryOptions("get", "/departments", { params: {} })
            .queryKey,
        });
      },
    });

  // delete
  const {
    mutate: deleteDepartment,
    isError: isDeleteDepartmentError,
    isPending: isDeleteDepartmentPending,
  } = $api.useMutation("delete", "/departments/{id}", {
    onSuccess: () => {
      alert("Xóa khoa thành công");
      queryClient.invalidateQueries({
        queryKey: $api.queryOptions("get", "/departments", { params: {} })
          .queryKey,
      });
    },
  });

  return {
    openModalCreateKhoa,
    setOpenModalCreateKhoa,
    departments,
    isLoadingDepartment,
    isDepartmentError,
    createDepartment,
    isCreateDepartmentError,
    deleteDepartment,
    isDeleteDepartmentError,
    isDeleteDepartmentPending,
  };
});
