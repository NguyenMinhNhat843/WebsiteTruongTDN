import { useState } from "react";
import { $api } from "../../../../api/client";
import type { components } from "../../../../api/v1";
import { createContextProvider } from "../../../../util/createContextProvider";

export type LopHocResponseDto = components["schemas"]["ClassResponseDto"];
export type CreateLopHocDto = components["schemas"]["CreateClassDto"];

export const [LopHocProvider, useLopHocContext] = createContextProvider(() => {
  const [isOpenModalCreate, setIsOpenModalCreate] = useState(false);
  /**
   * Lấy danh sách lớp học
   */
  const {
    data: LopHocList,
    isLoading: isLoadingLopHocList,
    refetch: refetchLopHocList,
  } = $api.useQuery("get", "/classes");

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

    //state
    isOpenModalCreate,
    setIsOpenModalCreate,
  };
});
