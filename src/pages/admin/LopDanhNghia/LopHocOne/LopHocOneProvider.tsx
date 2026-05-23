import { useEffect, useState } from "react";
import { createContextProvider } from "../../../../util/createContextProvider";
import { $api } from "../../../../api/client";
import { useParams } from "react-router-dom";
import { useAppContext } from "../../../../AppProvider";

export const [LopHocOneProvider, useLopHocOneContext] = createContextProvider(
  () => {
    const { currentSemester } = useAppContext();
    const [selectedSemesterId, setselectedSemesterId] = useState<number | null>(
      currentSemester ? currentSemester.id : null,
    );
    const { idLopHoc } = useParams();
    const idLopHocNumber = Number(idLopHoc);

    useEffect(() => {
      if (currentSemester) {
        setselectedSemesterId(currentSemester.id);
      }
    }, [currentSemester]);

    /**
     * Lấy danh sách môn theo học kỳ đã chọn, lấy từ chương trình khung
     */
    const { data: dataMonHocs, isLoading: isMonHocsLoading } = $api.useQuery(
      "get",
      "/curriculums/curriculum-subjects/by-semester",
      {
        params: {
          query: {
            semesterId: selectedSemesterId!,
            classId: idLopHocNumber,
          },
        },
      },
      {
        enabled: selectedSemesterId !== null,
      },
    );

    /**
     * Lấy danh sách ClassSubject
     */
    const { data: classSubjects, isLoading: isClassSubjectsLoading } =
      $api.useQuery(
        "get",
        "/course-offers",
        {
          params: {
            query: {
              classId: idLopHocNumber,
              semesterId: selectedSemesterId!,
            },
          },
        },
        {
          enabled: selectedSemesterId !== null,
        },
      );

    return {
      selectedSemesterId,
      setselectedSemesterId,
      dataMonHocs,
      isMonHocsLoading,
      classSubjects,
      isClassSubjectsLoading,
    };
  },
);
