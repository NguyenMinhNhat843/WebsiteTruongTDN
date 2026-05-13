import { useState } from "react";
import { $api } from "../../api/client";
import type { components } from "../../api/v1";
import { createContextProvider } from "../../util/createContextProvider";
import { useQueryClient } from "@tanstack/react-query";

export type createKhoaDaoTaoDTO = components["schemas"]["CreateBatchDto"];
export type khoaDaoTaoDto = components["schemas"]["BatchResponseDto"];

export const [KhoaDaoTaoProvider, useKhoaDaoTaoContext] = createContextProvider(
  () => {
    const [isOpenModalCreateBatch, setIsOpenModalCreateBatch] =
      useState<boolean>(false);
    const queryClient = useQueryClient();

    // get khóa đào tạo
    const {
      data: batches,
      isPending: isBatchesPending,
      isError: isBatchesError,
    } = $api.useQuery("get", "/batches");

    // get nhành học
    const {
      data: majors,
      isPending: isMajorsPending,
      isError: isMajorsError,
    } = $api.useQuery("get", "/majors");

    // thêm
    const {
      mutate: addBatch,
      isPending: isAddBatchPending,
      isError: isAddBatchError,
    } = $api.useMutation("post", "/batches", {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["get", "/batches"] });
        alert("Thêm khóa đào tạo thành công");
      },
    });

    // delete
    const { mutate: deleteBatch, isPending: isDeleting } = $api.useMutation(
      "delete",
      "/batches/{id}",
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["get", "/batches"] });
        },
      },
    );

    return {
      batches,
      isBatchesPending,
      isBatchesError,
      addBatch,
      isAddBatchPending,
      isAddBatchError,
      majors,
      isMajorsPending,
      isMajorsError,
      deleteBatch,
      isDeleting,

      // state
      isOpenModalCreateBatch,
      setIsOpenModalCreateBatch,
    };
  },
);
