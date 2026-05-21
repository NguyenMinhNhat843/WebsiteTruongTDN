import { useState } from "react";
import type { components } from "../../../api/v1";
import { createContextProvider } from "../../../util/createContextProvider";
import { $api } from "../../../api/client";

export type LopHocResponseDto = components["schemas"]["ClassResponseDto"];
export type CreateLopHocDto = components["schemas"]["CreateClassDto"];

export const [LopHocProvider, useLopHocContext] = createContextProvider(() => {
  const [isOpenModalCreate, setIsOpenModalCreate] = useState(false);
  const [selectedLopHocId, setSelectedLopHocId] = useState<number | null>(null);
  /**
   * Lấy danh sách lớp học
   */
  const {
    data: LopHocList,
    isLoading: isLoadingLopHocList,
    refetch: refetchLopHocList,
  } = $api.useQuery("get", "/classes");

  /**
   * Lấy lớp học theo id
   */
  const { data: LopHocDetail, isLoading: isLoadingLopHocDetail } =
    $api.useQuery(
      "get",
      `/classes/{id}`,
      {
        params: {
          path: {
            id: selectedLopHocId!,
          },
        },
      },
      {
        enabled: !!selectedLopHocId,
      },
    );

  /**
   * Tạo lớp học
   */
  const { mutate: createLopHoc, isPending: isCreatingLopHoc } =
    $api.useMutation("post", "/classes");

  /**
   * Lấy danh sách ngành học
   */
  const { data: nganhHocs } = $api.useQuery("get", "/majors");

  /**
   * Lấy khóa đào tạo
   */
  const { data: khoaHocs } = $api.useQuery("get", "/batches");

  return {
    LopHocList,
    isLoadingLopHocList,
    createLopHoc,
    isCreatingLopHoc,
    refetchLopHocList,
    nganhHocs,
    khoaHocs,
    LopHocDetail,
    isLoadingLopHocDetail,

    //state
    isOpenModalCreate,
    setIsOpenModalCreate,
    selectedLopHocId,
    setSelectedLopHocId,
  };
});
