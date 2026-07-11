import { useState } from "react";
import type { components, paths } from "../../../api/v1";
import { createContextProvider } from "../../../util/createContextProvider";
import { $api } from "../../../api/client";
import { useParams } from "react-router-dom";

export type LopHocResponseDto = components["schemas"]["ClassResponseDto"];
export type CreateLopHocDto = components["schemas"]["CreateClassDto"];
export type SearchClassDto = paths["/classes"]["get"]["parameters"]["query"];

export const [LopHocProvider, useLopHocContext] = createContextProvider(() => {
  const [isOpenModalCreate, setIsOpenModalCreate] = useState(false);
  const [semesterIdSelected, setSemesterIdSelected] = useState<number | null>(
    null,
  );
  const { idLopHoc } = useParams();
  const idLopHocNumber = Number(idLopHoc);

  /**
   * Filter search Lớp học
   */
  const [filterClass, setFilterClass] = useState<SearchClassDto>({
    batchId: undefined,
    majorId: undefined,
    classCode: undefined,
    formTeacherId: undefined,
    search: undefined,
  });

  /**
   * Lấy danh sách lớp học
   */
  const {
    data: LopHocList,
    isLoading: isLoadingLopHocList,
    refetch: refetchLopHocList,
  } = $api.useQuery("get", "/classes", {
    params: {
      query: filterClass,
    },
  });

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

  /**
   * Thêm học sinh vào 1 lớp học
   */
  const { mutate: addStudent, isPending: isAddStudentPending } =
    $api.useMutation("patch", "/students/{id}");

  /**
   * Tìm học sinh theo mã sinh viên
   */
  const {
    mutate: findStudentByMssv,
    isPending: isFindingStudentByMssv,
    data: studentFound,
  } = $api.useMutation("get", "/students/search-by-code");

  return {
    LopHocList,
    isLoadingLopHocList,
    createLopHoc,
    isCreatingLopHoc,
    refetchLopHocList,
    nganhHocs,
    khoaHocs,
    idLopHocNumber,
    findStudentByMssv,
    isFindingStudentByMssv,
    studentFound,
    semesterIdSelected,
    setSemesterIdSelected,
    filterClass,
    setFilterClass,
    addStudent,
    isAddStudentPending,

    //state
    isOpenModalCreate,
    setIsOpenModalCreate,
  };
});
