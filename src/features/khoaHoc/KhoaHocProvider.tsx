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

    return {
      batches,
      isBatchesPending,
      isBatchesError,
      addBatch,
      isAddBatchPending,
      isAddBatchError,

      // state
      isOpenModalCreateBatch,
      setIsOpenModalCreateBatch,
    };
  },
);
