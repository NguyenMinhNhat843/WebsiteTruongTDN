import { useQueryClient } from "@tanstack/react-query";
import { $api } from "../../../api/client";
import type { components } from "../../../api/v1";
import { createContextProvider } from "../../../util/createContextProvider";
import { useState } from "react";

export type MonHocResponse = components["schemas"]["ResponseSubjectDto"];
export type CreatemonHocDto = components["schemas"]["CreateSubjectDto"];
export type UpdateMonHocDto = components["schemas"]["UpdateSubjectDto"];

export const [MonHocProvider, useMonHocContext] = createContextProvider(() => {
  const queryClient = useQueryClient();
  const [monHocIdSelected, setMonHocIdSelected] = useState<number | null>(null);

  const [isOpenModalCreateMonHoc, setIsOpenModalCreateMonHoc] =
    useState<boolean>(false);
  // get
  const {
    data: monHocs,
    isLoading: isMonHocsLoading,
    error: monHocsError,
  } = $api.useQuery("get", "/subjects");

  // get one
  const {
    data: monHocDetail,
    isLoading: isMonHocDetailLoading,
    error: monHocDetailError,
  } = $api.useQuery(
    "get",
    "/subjects/{id}",
    {
      params: {
        path: {
          id: monHocIdSelected!,
        },
      },
    },
    {
      enabled: !!monHocIdSelected,
    },
  );

  // post
  const {
    mutate: createMonHoc,
    isPending: isCreateMonHocPending,
    isError: isCreateMonHocError,
  } = $api.useMutation("post", "/subjects", {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get", "/subjects"],
      });
    },
  });

  // delete
  const {
    mutate: deleteMonHoc,
    isPending: isDeleteMonHocPending,
    isError: isDeleteMonHocError,
  } = $api.useMutation("delete", "/subjects/{id}", {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get", "/subjects"],
      });
      alert("Xóa môn học thành công!");
    },
    onError: (err) => {
      alert(JSON.stringify(err) || "Xóa môn học thất bại!");
    },
  });

  // update môn hoc
  const {
    mutate: updateMonHoc,
    isPending: isUpdateMonHocPending,
    isError: isUpdateMonHocError,
  } = $api.useMutation("patch", "/subjects/{id}", {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get", "/subjects"],
      });
    },
    onError: (err) => {
      alert(JSON.stringify(err) || "Cập nhật môn học thất bại!");
    },
  });

  return {
    monHocs,
    isMonHocsLoading,
    monHocsError,
    createMonHoc,
    isCreateMonHocPending,
    isCreateMonHocError,
    deleteMonHoc,
    isDeleteMonHocPending,
    isDeleteMonHocError,
    updateMonHoc,
    isUpdateMonHocPending,
    isUpdateMonHocError,
    monHocDetail,
    isMonHocDetailLoading,
    monHocDetailError,
    monHocIdSelected,
    setMonHocIdSelected,

    // state
    isOpenModalCreateMonHoc,
    setIsOpenModalCreateMonHoc,
  };
});
