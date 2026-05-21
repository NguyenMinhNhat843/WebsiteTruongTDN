import { useEffect, useState } from "react";
import { useAppContext } from "../../../../AppProvider";
import { $api } from "../../../../api/client";
import { createContextProvider } from "../../../../util/createContextProvider";
import type { components } from "../../../../api/v1";

export type createLopHocPhan =
  components["schemas"]["CreateOptionalCourseOfferDto"];
export type GenLopHocphan = components["schemas"]["CreateBulkCourseOfferDto"];

export const [LopHocPhanProvider, useLopHocPhanContext] = createContextProvider(
  () => {
    const { hocKysData, currentSemester } = useAppContext();
    // state
    const [hocKyIdSelected, setHocKyIdSelected] = useState<number | null>(null);
    const [page, setPage] = useState(1);
    const [showCreate, setShowCreate] = useState(false);

    const handleFilter = () => setPage(1);

    useEffect(() => {
      setHocKyIdSelected(
        hocKysData.find((hk) => hk.isCurrent)?.id || hocKysData[0]?.id,
      );
    }, [hocKysData]);

    /**
     * Lấy lớp học phần học kỳ hiện tại
     */
    const { data: lopHocPhans, isLoading: isLoadingLopHocPhans } =
      $api.useQuery("get", "/course-offers", {
        params: {
          query: {
            semesterId: hocKyIdSelected || currentSemester?.id,
          },
        },
      });

    /**
     * Tạo lớp học phần thủ công
     */
    const { mutate: createLopHocPhan, isPending: isCreatingLopHocPhan } =
      $api.useMutation("post", "/course-offers/optional");

    /**
     * Generate lớp học phần thoe khóa đào tạo (batchId), theo ngành, học kỳ
     */
    const { mutate: generateLopHocPhan, isPending: isGeneratingLopHocPhan } =
      $api.useMutation("post", "/course-offers/generate");

    /**
     * Lấy danh sách ngành
     */
    const { data: nganhHocs } = $api.useQuery("get", "/majors");

    /**
     * Lấy danh sách khóa đào tạo
     */
    const { data: khoaHocs } = $api.useQuery("get", "/batches");

    return {
      lopHocPhans,
      isLoadingLopHocPhans,
      createLopHocPhan,
      isCreatingLopHocPhan,
      generateLopHocPhan,
      isGeneratingLopHocPhan,
      nganhHocs,
      khoaHocs,

      // state
      hocKyIdSelected,
      setHocKyIdSelected,
      hocKysData,

      page,
      setPage,
      showCreate,
      setShowCreate,
      handleFilter,
      pageSize: 10,
    };
  },
);
