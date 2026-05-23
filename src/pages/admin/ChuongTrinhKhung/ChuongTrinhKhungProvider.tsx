import { useState } from "react";
import { createContextProvider } from "../../../util/createContextProvider";
import type { components } from "../../../api/v1";
import { $api } from "../../../api/client";
import { useAppContext } from "../../../AppProvider";

export type CuriculumResponseDto =
  components["schemas"]["CurriculumResponseDto"];
export type CurriCulumSubjectDto =
  components["schemas"]["CurriculumSubjectResponseDto"];

export const [ChuongTrinhKhungProvider, useChuongTrinhKhungContext] =
  createContextProvider(() => {
    const { majors, isMajorsLoading } = useAppContext();

    // state
    const [selectedId, setSelectedId] = useState<string | null | number>(null);
    const [majorIdSelected, setMajorIdSelected] = useState<number | null>(null);

    // get chương trình khung
    const { data: curriculums, isPending: isCurriculumsPending } =
      $api.useQuery("get", "/curriculums", {
        params: {
          query: {
            majorId: majorIdSelected!,
          },
        },
      });

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
    console.log(curriculumOne);

    return {
      curriculums,
      isCurriculumsPending,
      curriculumOne,
      isCurriculumOnePending,
      majors,
      isMajorsLoading,

      selectedId,
      setSelectedId,
      majorIdSelected,
      setMajorIdSelected,
    };
  });
