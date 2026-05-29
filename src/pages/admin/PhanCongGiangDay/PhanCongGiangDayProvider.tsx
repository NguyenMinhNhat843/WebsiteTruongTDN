import { useState } from "react";
import { $api } from "../../../api/client";
import { createContextProvider } from "../../../util/createContextProvider";
import type { components, paths } from "../../../api/v1";

export type ClassSubjectResponseDto = components["schemas"]["CourseOfferDto"];
export type SearchClassSubjectDto =
  paths["/course-offers"]["get"]["parameters"]["query"];

export const [PhanCongGiangDayProvider, usePhanCongGiangDayContext] =
  createContextProvider(() => {
    const [filterClassSubject, setFilterClassSubject] =
      useState<SearchClassSubjectDto>({
        semesterId: undefined,
      });

    /**
     * Lấy danh sách tất cả classSubject theo học kỳ
     */
    const {
      data: classSubjects,
      isLoading: isLoadingClassSubjects,
      refetch: refetchClassSubjects,
    } = $api.useQuery("get", "/course-offers", {
      params: {
        query: {
          ...filterClassSubject,
        },
      },
    });

    /**
     * Sinh toàn bộ ClassSubject cho học kỳ này
     */
    const {
      mutate: generateClassSubject,
      isPending: isPendingGenerateClassSubject,
    } = $api.useMutation("post", "/course-offers/gen-classSubject", {
      onSuccess: () => {
        refetchClassSubjects();
      },
    });

    /**
     * Phân công giáo viên
     */
    const { mutate: assignTeacher, isPending: isPendingAssignTeacher } =
      $api.useMutation("post", "/course-offers/assign-teacher");

    return {
      classSubjects,
      isLoadingClassSubjects,
      assignTeacher,
      isPendingAssignTeacher,
      generateClassSubject,
      isPendingGenerateClassSubject,
      refetchClassSubjects,

      // state
      filterClassSubject,
      setFilterClassSubject,
    };
  });
