import { useQueryClient } from "@tanstack/react-query";
import { $api } from "../../api/client";
import type { components } from "../../api/v1";
import { createContextProvider } from "../../util/createContextProvider";
import { useState } from "react";

export type MonHocResponse = components["schemas"]["SubjectResponseDto"];
export type CreatemonHocDto = components["schemas"]["CreateSubjectDto"];

export const [MonHocProvider, useMonHocContext] = createContextProvider(() => {
  const queryClient = useQueryClient();
  const [isOpenModalCreateMonHoc, setIsOpenModalCreateMonHoc] =
    useState<boolean>(false);
  // get
  const {
    data: monHocs,
    isLoading: isMonHocsLoading,
    error: monHocsError,
  } = $api.useQuery("get", "/subjects");

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

    // state
    isOpenModalCreateMonHoc,
    setIsOpenModalCreateMonHoc,
  };
});
