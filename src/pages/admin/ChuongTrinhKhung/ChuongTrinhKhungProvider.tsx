import { useState } from "react";
import { createContextProvider } from "../../../util/createContextProvider";
import type { components } from "../../../api/v1";
import { $api } from "../../../api/client";

export type CuriculumResponseDto =
  components["schemas"]["CurriculumResponseDto"];
export type CurriCulumSubjectDto =
  components["schemas"]["CurriculumSubjectResponseDto"];

export const [ChuongTrinhKhungProvider, useChuongTrinhKhungContext] =
  createContextProvider(() => {
    const [selectedId, setSelectedId] = useState<string | null | number>(null);

    // get chương trình khung
    const { data: curriculums, isPending: isCurriculumsPending } =
      $api.useQuery("get", "/curriculums");

    // get chi tiết
    const { data: curriculumOne, isPending: isCurriculumOnePending } =
      $api.useQuery("get", "/curriculums/{id}", {
        params: {
          path: {
            id: selectedId as number,
          },
        },
        enabled:
          typeof selectedId === "number" &&
          selectedId !== null &&
          !isNaN(selectedId),
      });

    return {
      curriculums,
      isCurriculumsPending,
      curriculumOne,
      isCurriculumOnePending,

      selectedId,
      setSelectedId,
    };
  });
