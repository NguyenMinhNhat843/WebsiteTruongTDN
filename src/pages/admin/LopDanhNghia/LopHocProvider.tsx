import { useState } from "react";
import type { components, paths } from "../../../api/v1";
import { createContextProvider } from "../../../util/createContextProvider";
import { $api } from "../../../api/client";
import { useParams } from "react-router-dom";
import { useAppContext } from "../../../AppProvider";
import { useQueryClient } from "@tanstack/react-query";

export type LopHocResponseDto = components["schemas"]["ClassResponseDto"];
export type CreateLopHocDto = components["schemas"]["CreateClassDto"];
export type CurriculumSubjectResponseDto =
  components["schemas"]["CurriculumSubjectResponseDto"];
export type SearchClassDto = paths["/classes"]["get"]["parameters"]["query"];

export const [LopHocProvider, useLopHocContext] = createContextProvider(() => {
  const [isOpenModalCreate, setIsOpenModalCreate] = useState(false);
  const [isOpenModalAddStudent, setIsOpenModalAddStudent] = useState(false);
  const [semesterIdSelected, setSemesterIdSelected] = useState<number | null>(
    null,
  );
  const [isOpenModalSinhLopHocPhan, setIsOpenModalSinhLopHocPhan] =
    useState(false);
  const { idLopHoc } = useParams();
  const idLopHocNumber = Number(idLopHoc);
  const { currentSemester } = useAppContext();
  const queryClient = useQueryClient();

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
   * Lấy lớp học theo id
   */
  const {
    data: LopHocDetail,
    isLoading: isLoadingLopHocDetail,
    refetch: refetchLopHocDetail,
  } = $api.useQuery(
    "get",
    `/classes/{id}`,
    {
      params: {
        path: {
          id: idLopHocNumber!,
        },
      },
    },
    {
      enabled: !!idLopHocNumber,
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

  /**
   * Lấy danh sách học sinh 1 lớp học
   */
  const {
    data: studentsInLopHoc,
    isLoading: isLoadingStudentsInLopHoc,
    refetch: refetchStudentsInLopHoc,
  } = $api.useQuery(
    "get",
    "/students",
    {
      params: {
        query: {
          classId: idLopHocNumber,
        },
      },
    },
    {
      enabled: !!idLopHocNumber,
    },
  );

  /**
   * Thêm học sinh vào 1 lớp học
   */
  const { mutate: addStudentToLopHoc, isPending: isAddingStudentToLopHoc } =
    $api.useMutation("post", "/classes/{classId}/add-student", {
      onSuccess: () => {
        refetchStudentsInLopHoc();
      },
    });

  /**
   * Tìm học sinh theo mã sinh viên
   */
  const {
    mutate: findStudentByMssv,
    isPending: isFindingStudentByMssv,
    data: studentFound,
  } = $api.useMutation("get", "/students/search-by-code");

  /**
   * Sinh dữ liệu classSubject theo học kỳ
   */
  const { mutate: generateLopHocPhan, isPending: isGeneratingLopHocPhan } =
    $api.useMutation("post", "/course-offers/gen-classSubject-grades", {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["get", "/course-offers"],
        });
      },
    });

  /**
   * Xem trước danh sách classSubject cần sinh
   */
  const { data: subjectsData, isLoading: isLoadingSubjectData } = $api.useQuery(
    "get",
    "/course-offers/previewpreviewGenerateSectionForClass",
    {
      params: {
        query: {
          classId: idLopHocNumber,
          // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
          semesterId: semesterIdSelected! || currentSemester?.id!,
        },
      },
    },
    {
      enabled:
        Boolean(LopHocDetail) &&
        (Boolean(semesterIdSelected) || Boolean(currentSemester?.id)),
    },
  );

  const { mutate: exportStudentGrade, isPending: isExportingStudentGrade } =
    $api.useMutation("get", "/course-offers/student/{id}/export-excel");

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
    studentsInLopHoc,
    isLoadingStudentsInLopHoc,
    idLopHocNumber,
    addStudentToLopHoc,
    isAddingStudentToLopHoc,
    findStudentByMssv,
    isFindingStudentByMssv,
    studentFound,
    refetchStudentsInLopHoc,
    generateLopHocPhan,
    isGeneratingLopHocPhan,
    semesterIdSelected,
    setSemesterIdSelected,
    subjectsData,
    isLoadingSubjectData,
    filterClass,
    setFilterClass,
    exportStudentGrade,
    isExportingStudentGrade,
    refetchLopHocDetail,

    //state
    isOpenModalCreate,
    setIsOpenModalCreate,
    isOpenModalAddStudent,
    setIsOpenModalAddStudent,
    isOpenModalSinhLopHocPhan,
    setIsOpenModalSinhLopHocPhan,
  };
});
