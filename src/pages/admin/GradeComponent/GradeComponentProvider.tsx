import { useQueryClient } from "@tanstack/react-query";
import { $api } from "../../../api/client";
import { createContextProvider } from "../../../util/createContextProvider";
import type { components } from "../../../api/v1";
import { useState } from "react";

export type CreateGradeComponentDto =
  components["schemas"]["CreateGradeComponentDto"];
export type GradeComponentDto = components["schemas"]["GradeComponentDto"];

export const [GradeComponentProvider, useGradeComponentContext] =
  createContextProvider(() => {
    const [isOpenModalCreate, setIsOpenModalCreate] = useState(false);
    const queryClient = useQueryClient();
    // get
    const { data: gradeComponents, isLoading: isLoadingGradeComponents } =
      $api.useQuery("get", "/grade-components");

    // create
    const { mutate: createDiemThanhPhan, isPending: isCreatingDiemThanhPhan } =
      $api.useMutation("post", "/grade-components", {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["get", "/grade-components"],
          });
        },
      });

    // delete
    const { mutate: deleteDiemThanhPhan, isPending: isDeletingDiemThanhPhan } =
      $api.useMutation("delete", "/grade-components/{id}", {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["get", "/grade-components"],
          });
        },
      });

    return {
      gradeComponents,
      isLoadingGradeComponents,
      createDiemThanhPhan,
      isCreatingDiemThanhPhan,
      deleteDiemThanhPhan,
      isDeletingDiemThanhPhan,

      // state
      isOpenModalCreate,
      setIsOpenModalCreate,
    };
  });
