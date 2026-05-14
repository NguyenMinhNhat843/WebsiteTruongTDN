import { useQueryClient } from "@tanstack/react-query";
import { $api } from "../../../api/client";
import type { components } from "../../../api/v1";
import { createContextProvider } from "../../../util/createContextProvider";
import { useState } from "react";

export type HocKyDto = components["schemas"]["SemesterResponseDto"];
export type CreateHocKyDto = components["schemas"]["CreateSemesterDto"];

export const [HocKyProvider, useHocKyContext] = createContextProvider(() => {
  const queryClient = useQueryClient();
  const [isOpenModalCreate, setIsOpenModalCreate] = useState(false);
  // get danh sách học kỳ
  const { data: hocKyList, isPending: isHocKyListPending } = $api.useQuery(
    "get",
    "/semesters",
  );

  // create học kỳ mới
  const {
    mutate: createhocKy,
    isPending: isCreateHocKyPending,
    isError: isCreateHocKyError,
  } = $api.useMutation("post", "/semesters", {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get", "/semesters"] });
    },
  });

  // delete học kỳ
  const {
    mutate: deleteHocKy,
    isPending: isDeleteHocKyPending,
    error: deleteHocKyError,
  } = $api.useMutation("delete", "/semesters/{id}", {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get", "/semesters"] });
    },
  });

  return {
    hocKyList,
    isHocKyListPending,
    createhocKy,
    deleteHocKy,
    isDeleteHocKyPending,
    deleteHocKyError,

    isCreateHocKyPending,
    isCreateHocKyError,

    // state
    isOpenModalCreate,
    setIsOpenModalCreate,
  };
});
