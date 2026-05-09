import { useState } from "react";
import { $api } from "../../api/client";
import type { components } from "../../api/v1";
import { createContextProvider } from "../../util/createContextProvider";
import { useQueryClient } from "@tanstack/react-query";

export type createNganhDto = components["schemas"]["CreateMajorDto"];
export type nganhHocResponse = components["schemas"]["MajorResponseDto"];

export const [NganhProvider, useNganhContext] = createContextProvider(() => {
  const [isOpenModalCreate, setIsOpenModalCreate] = useState<boolean>(false);
  const queryClient = useQueryClient();
  // get
  const {
    data: nganhs,
    isPending: isPendingNganh,
    isError: isErrorNganh,
  } = $api.useQuery("get", "/majors");

  // create
  const {
    mutate: createNganh,
    isPending: isPendingCreateNganh,
    isError: isErrorCreateNganh,
  } = $api.useMutation("post", "/majors", {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get", "/majors"],
      });
    },
  });

  // delete
  const {
    mutate: deleteNganh,
    isPending: isPendingDeleteNganh,
    isError: isErrorDeleteNganh,
  } = $api.useMutation("delete", "/majors/{id}", {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get", "/majors"],
      });
      alert("Xóa ngành học thành công!");
    },
  });

  return {
    nganhs,
    isPendingNganh,
    isErrorNganh,
    createNganh,
    isPendingCreateNganh,
    isErrorCreateNganh,
    deleteNganh,
    isPendingDeleteNganh,
    isErrorDeleteNganh,

    // state
    isOpenModalCreate,
    setIsOpenModalCreate,
  };
});
