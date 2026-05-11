import { useState } from "react";
import { $api } from "../../api/client";
import type { components } from "../../api/v1";
import { createContextProvider } from "../../util/createContextProvider";
import { useQueryClient } from "@tanstack/react-query";

export type TieuChiTuyenSinh = components["schemas"]["CriterionResponseDto"];
export type CreateTieuChiDto = components["schemas"]["CreateCriterionDto"];

export const [TieuChuanTuyenSinhProvider, useTieuChuanTuyenSinhContext] =
  createContextProvider(() => {
    // state
    const [isOpenModalCreateTieuChi, setIsOpenModalCreateTieuChi] =
      useState<boolean>(false);
    const queryClient = useQueryClient();

    // get
    const { data: tieuChis, isPending: isTieuChiPending } = $api.useQuery(
      "get",
      "/criteria",
    );

    // post
    const { mutate: createTieuChi, isPending: isCreateTieuChiPending } =
      $api.useMutation("post", "/criteria", {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["get", "/criteria"] });
        },
      });

    // delete
    const { mutate: deleteTieuChi, isPending: isDeleteTieuChiPending } =
      $api.useMutation("delete", "/criteria", {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["get", "/criteria"] });
        },
      });

    return {
      tieuChis,
      isTieuChiPending,
      createTieuChi,
      isCreateTieuChiPending,
      deleteTieuChi,
      isDeleteTieuChiPending,
      isOpenModalCreateTieuChi,
      setIsOpenModalCreateTieuChi,
    };
  });
